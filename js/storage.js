/*
 * Devoir Numerique
 * Copyright (C) 2026 [Stinj-NoD]
 * License: GNU GPL v3
 */

const Storage = {
    currentUser: null,
    _memoryStore: {},
    _currentUserKey: 'dn_current_user',
    _profilesKey: 'dn_profiles_list',
    _salt: "DN_2026_SECURE_V1",
    _profileNameMinLength: 2,
    _profileNameMaxLength: 15,

    _sanitize(str) {
        if (!str) return "";
        return str
            .toString()
            .replace(/[^-a-zA-Z0-9\u00C0-\u00FF ]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    },

    _normalizeProfileName(name) {
        return this._sanitize(name).toLocaleLowerCase();
    },

    validateProfileName(name) {
        const rawValue = (name || "").toString();
        const trimmedValue = rawValue.trim();
        const cleanName = this._sanitize(trimmedValue).slice(0, this._profileNameMaxLength);

        if (!trimmedValue) {
            return { ok: false, code: 'empty', cleanName: "" };
        }

        if (!cleanName) {
            return { ok: false, code: 'invalid', cleanName: "" };
        }

        if (cleanName.length < this._profileNameMinLength) {
            return { ok: false, code: 'too_short', cleanName };
        }

        const profiles = this.getProfiles();
        const normalized = this._normalizeProfileName(cleanName);
        const duplicate = profiles.some((profile) => this._normalizeProfileName(profile) === normalized);
        if (duplicate) {
            return { ok: false, code: 'duplicate', cleanName };
        }

        return { ok: true, code: 'ok', cleanName };
    },

    _generateHash(data) {
        const str = JSON.stringify(data) + this._salt;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return hash.toString(16);
    },

    _getItem(key) {
        const stores = [];
        try { stores.push(localStorage); } catch (e) {}
        try { stores.push(sessionStorage); } catch (e) {}

        for (const store of stores) {
            try {
                const value = store.getItem(key);
                if (value !== null && value !== undefined) return value;
            } catch (e) {}
        }

        return Object.prototype.hasOwnProperty.call(this._memoryStore, key)
            ? this._memoryStore[key]
            : null;
    },

    _setItem(key, value) {
        let wrote = false;

        try {
            localStorage.setItem(key, value);
            wrote = true;
        } catch (e) {}

        if (!wrote) {
            try {
                sessionStorage.setItem(key, value);
                wrote = true;
            } catch (e) {}
        }

        this._memoryStore[key] = value;
        return wrote || Object.prototype.hasOwnProperty.call(this._memoryStore, key);
    },

    _removeItem(key) {
        let removed = false;

        try {
            localStorage.removeItem(key);
            removed = true;
        } catch (e) {}

        try {
            sessionStorage.removeItem(key);
            removed = true;
        } catch (e) {}

        if (Object.prototype.hasOwnProperty.call(this._memoryStore, key)) {
            delete this._memoryStore[key];
            removed = true;
        }

        return removed;
    },

    _safeParseObject(raw) {
        if (!raw) return {};
        try {
            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
        } catch (e) {
            return {};
        }
    },

    _sanitizeRecordEntry(entry) {
        if (!entry || typeof entry !== 'object') return null;

        const score = Math.max(0, Number(entry.score));
        const total = Math.max(1, Number(entry.total));
        const percent = Math.min(100, Math.max(0, Number(entry.percent)));
        const stars = Math.max(0, Math.min(3, Number(entry.stars)));
        const timestamp = Number(entry.timestamp);
        const hash = typeof entry.h === 'string' ? entry.h : "";

        if (!Number.isFinite(score) || !Number.isFinite(total) || !Number.isFinite(percent) || !Number.isFinite(stars) || !hash) {
            return null;
        }

        const normalized = {
            score,
            total,
            percent,
            stars,
            timestamp: Number.isFinite(timestamp) && timestamp > 0 ? timestamp : Date.now(),
            h: hash
        };

        const check = this._generateHash({ s: normalized.score, t: normalized.total, p: normalized.percent });
        if (check !== normalized.h) return null;

        const lastPercent = Math.min(100, Math.max(0, Number(entry.lastPercent)));
        const lastTimestamp = Number(entry.lastTimestamp);
        if (Number.isFinite(lastPercent)) {
            normalized.lastPercent = lastPercent;
            normalized.lastTimestamp = Number.isFinite(lastTimestamp) && lastTimestamp > 0 ? lastTimestamp : normalized.timestamp;
        }

        return normalized;
    },

    _getRecordsKey(name = this.getCurrentUser()) {
        const cleanName = this._sanitize(name).slice(0, this._profileNameMaxLength);
        return cleanName ? `records_${cleanName}` : null;
    },

    _readRecords(name = this.getCurrentUser()) {
        const key = this._getRecordsKey(name);
        if (!key) return { key: null, records: {} };

        const rawRecords = this._safeParseObject(this._getItem(key));
        const safeRecords = {};

        Object.entries(rawRecords).forEach(([recordKey, entry]) => {
            if (typeof recordKey !== 'string' || !recordKey.trim()) return;
            const safeEntry = this._sanitizeRecordEntry(entry);
            if (safeEntry) safeRecords[recordKey] = safeEntry;
        });

        return { key, records: safeRecords };
    },

    _writeRecords(key, records) {
        if (!key) return false;
        return this._setItem(key, JSON.stringify(records || {}));
    },

    setCurrentUser(name) {
        const cleanName = this._sanitize(name).slice(0, this._profileNameMaxLength);
        const profiles = this.getProfiles();
        const normalized = this._normalizeProfileName(cleanName);
        const existing = profiles.find((profile) => this._normalizeProfileName(profile) === normalized);
        const resolvedName = existing || cleanName;
        this.currentUser = resolvedName || null;

        if (!resolvedName) {
            this._removeItem(this._currentUserKey);
            return;
        }

        this._setItem(this._currentUserKey, resolvedName);
    },

    getCurrentUser() {
        const rawUser = this.currentUser || this._getItem(this._currentUserKey) || "";
        const cleanUser = this._sanitize(rawUser).slice(0, this._profileNameMaxLength);
        const profiles = this.getProfiles();
        const normalized = this._normalizeProfileName(cleanUser);
        const existing = profiles.find((profile) => this._normalizeProfileName(profile) === normalized);
        const resolved = existing || null;

        this.currentUser = resolved;
        if (resolved) this._setItem(this._currentUserKey, resolved);
        else this._removeItem(this._currentUserKey);
        return resolved;
    },

    getProfiles() {
        try {
            const raw = this._getItem(this._profilesKey);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];

            const seen = new Set();
            const cleanProfiles = [];
            parsed.forEach((name) => {
                const cleanName = this._sanitize(name).slice(0, this._profileNameMaxLength);
                const normalized = this._normalizeProfileName(cleanName);
                if (!cleanName || seen.has(normalized)) return;
                seen.add(normalized);
                cleanProfiles.push(cleanName);
            });

            return cleanProfiles;
        } catch (e) {
            return [];
        }
    },

    addProfile(name) {
        const validation = this.validateProfileName(name);
        if (!validation.ok) return validation;

        const profiles = this.getProfiles();
        if (!profiles.includes(validation.cleanName)) {
            profiles.push(validation.cleanName);
            this._setItem(this._profilesKey, JSON.stringify(profiles));
        }

        return validation;
    },

    _getRecordKey(gradeId, exerciseId) {
        const safeGradeId = this._sanitize(gradeId || "unknown_grade");
        const safeExerciseId = this._sanitize(exerciseId || "unknown_exercise");
        return `${safeGradeId}::${safeExerciseId}`;
    },

    saveRecord(gradeId, exerciseId, score, total) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return;

        const { key, records } = this._readRecords(currentUser);
        if (!key) return;

        const safeScore = Math.max(0, Number(score));
        const safeTotal = Math.max(1, Number(total));
        if (!Number.isFinite(safeScore) || !Number.isFinite(safeTotal)) return;

        const percent = Math.min(100, Math.max(0, (safeScore / safeTotal) * 100));
        const stars = (percent === 100 ? 3 : percent >= 75 ? 2 : percent >= 50 ? 1 : 0);
        const recordKey = this._getRecordKey(gradeId, exerciseId);
        const existing = records[recordKey] || records[exerciseId];
        const now = Date.now();

        let entry;
        if (!existing || percent > existing.percent) {
            entry = { score: safeScore, total: safeTotal, percent, stars, timestamp: now };
            entry.h = this._generateHash({ s: safeScore, t: safeTotal, p: percent });
        } else {
            entry = { ...existing };
        }
        entry.lastPercent = percent;
        entry.lastTimestamp = now;

        records[recordKey] = entry;
        if (records[exerciseId]) delete records[exerciseId];
        this._writeRecords(key, records);
    },

    getRecord(exerciseId, gradeId = null) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return null;

        try {
            const { key, records } = this._readRecords(currentUser);
            if (!key) return null;
            const recordKey = this._getRecordKey(gradeId, exerciseId);
            const entry = records[recordKey] || records[exerciseId];

            if (!entry) return null;

            return entry;
        } catch (e) {
            return null;
        }
    },

    removeProfile(name) {
        const cleanName = this._sanitize(name).slice(0, this._profileNameMaxLength);
        if (!cleanName) return false;
        const normalized = this._normalizeProfileName(cleanName);
        const existingProfile = this.getProfiles().find((profile) => this._normalizeProfileName(profile) === normalized);
        const profiles = this.getProfiles().filter((profile) => this._normalizeProfileName(profile) !== normalized);
        this._setItem(this._profilesKey, JSON.stringify(profiles));
        const resolvedName = existingProfile || cleanName;
        this._removeItem(`records_${resolvedName}`);
        this._removeItem(`streak_${resolvedName}`);
        this._removeItem(`champion_${resolvedName}`);
        this._removeItem(this._getAppearanceKey(resolvedName));

        if (this._normalizeProfileName(this.getCurrentUser()) === normalized) {
            this.currentUser = null;
            this._removeItem(this._currentUserKey);
        }

        return true;
    },

    _avatarChoices: [
        '🐣', '🐥', '🐶', '🐱', '🐰', '🐻', '🐼', '🦊',
        '🐯', '🦁', '🐨', '🐷', '🐸', '🐢', '🐧', '🦋',
        '🦄', '🐳', '🐙', '🦖', '🧚', '🧙', '🤖', '🌟'
    ],
    _accentChoices: [
        { id: 'blue', label: 'Bleu', color: '#4a90e2' },
        { id: 'purple', label: 'Violet', color: '#9c6bd6' },
        { id: 'pink', label: 'Rose', color: '#e25a9e' },
        { id: 'orange', label: 'Orange', color: '#f0973a' },
        { id: 'green', label: 'Vert', color: '#4caf78' },
        { id: 'teal', label: 'Turquoise', color: '#2bb7b3' }
    ],

    getAvatarChoices() {
        return [...this._avatarChoices];
    },

    getAccentChoices() {
        return this._accentChoices.map((entry) => ({ ...entry }));
    },

    _getAppearanceKey(name = this.getCurrentUser()) {
        const cleanName = this._sanitize(name).slice(0, this._profileNameMaxLength);
        return cleanName ? `appearance_${cleanName}` : null;
    },

    getProfileAppearance(name = this.getCurrentUser()) {
        const key = this._getAppearanceKey(name);
        const fallback = { avatar: this._avatarChoices[0], accent: this._accentChoices[0].id };
        if (!key) return fallback;
        const raw = this._safeParseObject(this._getItem(key));
        const avatar = this._avatarChoices.includes(raw.avatar) ? raw.avatar : fallback.avatar;
        const accent = this._accentChoices.some((entry) => entry.id === raw.accent) ? raw.accent : fallback.accent;
        return { avatar, accent };
    },

    setProfileAppearance(name, { avatar, accent } = {}) {
        const key = this._getAppearanceKey(name);
        if (!key) return null;
        const current = this.getProfileAppearance(name);
        const safeAvatar = this._avatarChoices.includes(avatar) ? avatar : current.avatar;
        const safeAccent = this._accentChoices.some((entry) => entry.id === accent) ? accent : current.accent;
        const next = { avatar: safeAvatar, accent: safeAccent };
        this._setItem(key, JSON.stringify(next));
        return next;
    },

    getPreference(key) {
        return this._getItem(`pref_${this._sanitize(key)}`) === '1';
    },

    setPreference(key, value) {
        const cleanKey = `pref_${this._sanitize(key)}`;
        if (value) this._setItem(cleanKey, '1');
        else this._removeItem(cleanKey);
    },

    _speechRateKey: 'pref_speech_rate_level',
    _speechRateLevels: { slow: 0.7, normal: 1, fast: 1.35 },

    getSpeechRateLevel() {
        const raw = this._getItem(this._speechRateKey);
        return Object.prototype.hasOwnProperty.call(this._speechRateLevels, raw) ? raw : 'normal';
    },

    setSpeechRateLevel(level) {
        const cleanLevel = Object.prototype.hasOwnProperty.call(this._speechRateLevels, level) ? level : 'normal';
        this._setItem(this._speechRateKey, cleanLevel);
        return cleanLevel;
    },

    getSpeechRateMultiplier(level = this.getSpeechRateLevel()) {
        return this._speechRateLevels[level] ?? 1;
    },

    _getStreakKey(name = this.getCurrentUser()) {
        const cleanName = this._sanitize(name).slice(0, this._profileNameMaxLength);
        return cleanName ? `streak_${cleanName}` : null;
    },

    _dayNumber(timestamp) {
        return Math.floor(timestamp / 86400000);
    },

    _readStreak(name = this.getCurrentUser()) {
        const key = this._getStreakKey(name);
        if (!key) return { key: null, current: 0, best: 0, lastDay: 0 };
        const raw = this._safeParseObject(this._getItem(key));
        const current = Math.max(0, Number(raw.current) || 0);
        const best = Math.max(0, Number(raw.best) || 0);
        const lastDay = Math.max(0, Number(raw.lastDay) || 0);
        return { key, current, best: Math.max(best, current), lastDay };
    },

    recordSessionActivity(name = this.getCurrentUser()) {
        const { key, current, best, lastDay } = this._readStreak(name);
        if (!key) return null;

        const today = this._dayNumber(Date.now());
        if (today === lastDay) {
            return { current, best, isNewDay: false };
        }

        const newCurrent = (today === lastDay + 1) ? current + 1 : 1;
        const newBest = Math.max(best, newCurrent);
        this._setItem(key, JSON.stringify({ current: newCurrent, best: newBest, lastDay: today }));
        return { current: newCurrent, best: newBest, isNewDay: true };
    },

    getStreak(name = this.getCurrentUser()) {
        const { current, best, lastDay } = this._readStreak(name);
        const today = this._dayNumber(Date.now());
        const isActiveToday = lastDay === today;
        const isBroken = !isActiveToday && lastDay !== today - 1;
        return { current: isBroken ? 0 : current, best, isActiveToday };
    },

    _badgeDefinitions: [
        { id: 'first-star', icon: '⭐', label: 'Première étoile', test: (s) => s.totalStars >= 1 },
        { id: 'ten-stars', icon: '🌟', label: '10 étoiles', test: (s) => s.totalStars >= 10 },
        { id: 'fifty-stars', icon: '✨', label: '50 étoiles', test: (s) => s.totalStars >= 50 },
        { id: 'hundred-stars', icon: '💫', label: '100 étoiles', test: (s) => s.totalStars >= 100 },
        { id: 'two-hundred-stars', icon: '🌠', label: '200 étoiles', test: (s) => s.totalStars >= 200 },
        { id: 'first-perfect', icon: '🏆', label: 'Premier sans-faute', test: (s) => s.perfectCount >= 1 },
        { id: 'ten-perfect', icon: '🏅', label: '10 sans-faute', test: (s) => s.perfectCount >= 10 },
        { id: 'twenty-five-perfect', icon: '👑', label: '25 sans-faute', test: (s) => s.perfectCount >= 25 },
        { id: 'streak-3', icon: '🔥', label: '3 jours de suite', test: (s) => s.bestStreak >= 3 },
        { id: 'streak-7', icon: '🔥', label: '7 jours de suite', test: (s) => s.bestStreak >= 7 },
        { id: 'streak-30', icon: '🔥', label: '30 jours de suite', test: (s) => s.bestStreak >= 30 },
        { id: 'explorer-10', icon: '🧭', label: '10 exercices essayés', test: (s) => s.exercisesAttempted >= 10 },
        { id: 'explorer-25', icon: '🗺️', label: '25 exercices essayés', test: (s) => s.exercisesAttempted >= 25 },
        { id: 'explorer-50', icon: '🌍', label: '50 exercices essayés', test: (s) => s.exercisesAttempted >= 50 },
        { id: 'explorer-100', icon: '🚀', label: '100 exercices essayés', test: (s) => s.exercisesAttempted >= 100 }
    ],

    getBadges(name = this.getCurrentUser()) {
        const { records } = this._readRecords(name);
        const entries = Object.values(records || {});
        const totalStars = entries.reduce((sum, entry) => sum + (entry.stars || 0), 0);
        const perfectCount = entries.filter((entry) => entry.percent === 100).length;
        const bestStreak = this._readStreak(name).best;
        // Compte les exercices distincts réussis (au moins une fois, sans
        // contrainte de score) : une mesure d'exploration complémentaire aux
        // étoiles, qui mesurent plutôt la performance.
        const exercisesAttempted = entries.length;
        const stats = { totalStars, perfectCount, bestStreak, exercisesAttempted };

        return this._badgeDefinitions.map((def) => ({
            id: def.id,
            icon: def.icon,
            label: def.label,
            unlocked: !!def.test(stats)
        }));
    },

    _championScoresMaxEntries: 5,
    _championDurations: [60, 90, 120],

    _getChampionKey(name = this.getCurrentUser()) {
        const cleanName = this._sanitize(name).slice(0, this._profileNameMaxLength);
        return cleanName ? `champion_${cleanName}` : null;
    },

    _sanitizeChampionEntry(entry) {
        if (!entry || typeof entry !== 'object') return null;
        const score = Number(entry.score);
        const timestamp = Number(entry.timestamp);
        if (!Number.isInteger(score) || score < 0) return null;
        return {
            score,
            timestamp: Number.isFinite(timestamp) && timestamp > 0 ? timestamp : Date.now()
        };
    },

    saveChampionScore(gradeId, duration, score) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return;
        const key = this._getChampionKey(currentUser);
        if (!key) return;

        const safeGradeId = this._sanitize(gradeId || 'unknown_grade');
        const safeDuration = this._championDurations.includes(Number(duration)) ? Number(duration) : this._championDurations[0];
        const safeScore = Math.max(0, Number(score) || 0);

        const all = this._safeParseObject(this._getItem(key));
        const entryKey = `${safeGradeId}::${safeDuration}`;
        const list = Array.isArray(all[entryKey])
            ? all[entryKey].map((e) => this._sanitizeChampionEntry(e)).filter(Boolean)
            : [];

        list.push({ score: safeScore, timestamp: Date.now() });
        list.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);
        all[entryKey] = list.slice(0, this._championScoresMaxEntries);

        this._setItem(key, JSON.stringify(all));
        return all[entryKey];
    },

    getChampionScores(gradeId, duration, name = this.getCurrentUser()) {
        const key = this._getChampionKey(name);
        if (!key) return [];
        const safeGradeId = this._sanitize(gradeId || 'unknown_grade');
        const safeDuration = this._championDurations.includes(Number(duration)) ? Number(duration) : this._championDurations[0];
        const all = this._safeParseObject(this._getItem(key));
        const entryKey = `${safeGradeId}::${safeDuration}`;
        const list = Array.isArray(all[entryKey]) ? all[entryKey] : [];
        return list.map((e) => this._sanitizeChampionEntry(e)).filter(Boolean);
    }
};

window.Storage = Storage;

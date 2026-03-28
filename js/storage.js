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

        if (!existing || percent > existing.percent) {
            const entry = { score: safeScore, total: safeTotal, percent, stars, timestamp: Date.now() };
            entry.h = this._generateHash({ s: safeScore, t: safeTotal, p: percent });
            records[recordKey] = entry;
            if (records[exerciseId]) delete records[exerciseId];
            this._writeRecords(key, records);
        }
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
        this._removeItem(`records_${existingProfile || cleanName}`);

        if (this._normalizeProfileName(this.getCurrentUser()) === normalized) {
            this.currentUser = null;
            this._removeItem(this._currentUserKey);
        }

        return true;
    }
};

window.Storage = Storage;

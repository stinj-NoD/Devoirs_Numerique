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

    getRecord(exerciseId, gradeId = null, name = this.getCurrentUser()) {
        const currentUser = name;
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
        this._removeItem(`avatar_state_${resolvedName}`);
        this._removeItem(`activity_log_${resolvedName}`);
        this._removeItem(`daily_challenge_${resolvedName}`);
        this._removeItem(this._getAppearanceKey(resolvedName));

        if (this._normalizeProfileName(this.getCurrentUser()) === normalized) {
            this.currentUser = null;
            this._removeItem(this._currentUserKey);
        }

        return true;
    },

    _accentChoices: [
        { id: 'blue', label: 'Bleu', color: '#4a90e2' },
        { id: 'purple', label: 'Violet', color: '#9c6bd6' },
        { id: 'pink', label: 'Rose', color: '#e25a9e' },
        { id: 'orange', label: 'Orange', color: '#f0973a' },
        { id: 'green', label: 'Vert', color: '#4caf78' },
        { id: 'teal', label: 'Turquoise', color: '#2bb7b3' }
    ],

    /**
     * Arbre d'évolution de l'avatar : chaque nœud représente un stade
     * (œuf, poussin, etc.) avec un seuil d'étoiles cumulées pour l'atteindre
     * et une liste de "children" (les stades suivants possibles). Plusieurs
     * children = embranchement réel (l'enfant choisit sa branche au palier
     * suivant), pas une collection à plat : on réutilise totalStars comme
     * seule monnaie de progression, cohérent avec badges/défi du jour.
     */
    _avatarTree: {
        // Œuf générique : embranchement vers les branches qui naissent d'un œuf.
        'egg': { emoji: '🥚', label: 'Œuf', requires: 0, children: ['chick', 'fish-fry', 'caterpillar'] },

        // Branche oiseaux (depuis l'œuf)
        'chick': { emoji: '🐣', label: 'Poussin', requires: 5, children: ['hen', 'duckling', 'eagle-chick'] },
        'hen': { emoji: '🐔', label: 'Poule', requires: 20, children: [] },
        'duckling': { emoji: '🐥', label: 'Caneton', requires: 20, children: ['duck'] },
        'duck': { emoji: '🦆', label: 'Canard', requires: 45, children: [] },
        'eagle-chick': { emoji: '🐦', label: 'Petit aiglon', requires: 20, children: ['eagle'] },
        'eagle': { emoji: '🦅', label: 'Aigle', requires: 45, children: [] },

        // Branche marine (depuis l'œuf)
        'fish-fry': { emoji: '🐠', label: 'Alevin', requires: 5, children: ['fish'] },
        'fish': { emoji: '🐟', label: 'Poisson', requires: 20, children: ['dolphin', 'whale'] },
        'dolphin': { emoji: '🐬', label: 'Dauphin', requires: 45, children: [] },
        'whale': { emoji: '🐳', label: 'Baleine', requires: 45, children: [] },

        // Branche fantastique (depuis l'œuf, via la chenille)
        'caterpillar': { emoji: '🐛', label: 'Chenille', requires: 5, children: ['butterfly'] },
        'butterfly': { emoji: '🦋', label: 'Papillon', requires: 20, children: ['unicorn', 'dragon'] },
        'unicorn': { emoji: '🦄', label: 'Licorne', requires: 45, children: [] },
        'dragon': { emoji: '🐉', label: 'Dragon', requires: 45, children: [] },

        // Branche félins (starter direct, ne naît pas d'un œuf)
        'kitten': { emoji: '🐱', label: 'Chaton', requires: 5, children: ['cat'] },
        'cat': { emoji: '🐈', label: 'Chat', requires: 20, children: ['lion', 'tiger', 'leopard'] },
        'lion': { emoji: '🦁', label: 'Lion', requires: 45, children: [] },
        'tiger': { emoji: '🐯', label: 'Tigre', requires: 45, children: [] },
        'leopard': { emoji: '🐆', label: 'Léopard', requires: 45, children: [] },

        // Branche canidés (starter direct)
        'puppy': { emoji: '🐶', label: 'Chiot', requires: 5, children: ['dog'] },
        'dog': { emoji: '🐕', label: 'Chien', requires: 20, children: ['wolf', 'fox'] },
        'wolf': { emoji: '🐺', label: 'Loup', requires: 45, children: [] },
        'fox': { emoji: '🦊', label: 'Renard', requires: 45, children: [] },

        // Branche lapin (starter direct)
        'bunny': { emoji: '🐰', label: 'Lapereau', requires: 5, children: ['rabbit'] },
        'rabbit': { emoji: '🐇', label: 'Lapin', requires: 20, children: [] }
    },

    /**
     * Espèces de départ proposées dès la création du profil : un œuf
     * générique (qui embranche vers oiseaux/marin/fantastique au premier
     * palier) plus quelques mammifères qui démarrent directement à leur
     * stade "bébé". Chaque branche retenue a un emoji distinct à chaque
     * stade (contrainte volontaire : pas de stade qui "n'a l'air de rien
     * changer" visuellement, sinon l'évolution perd son sens).
     */
    _avatarStarterIds: ['egg', 'kitten', 'puppy', 'bunny'],

    getAccentChoices() {
        return this._accentChoices.map((entry) => ({ ...entry }));
    },

    _accentUnlockStep: 15,

    getAccentChoicesWithUnlock(name = this.getCurrentUser()) {
        const totalStars = this.getTotalStars(name);
        return this._accentChoices.map((accent, index) => ({
            ...accent,
            unlocked: index === 0 || totalStars >= index * this._accentUnlockStep,
            unlockAt: index * this._accentUnlockStep
        }));
    },

    _getAvatarNode(nodeId) {
        return this._avatarTree[nodeId] || this._avatarTree[this._avatarStarterIds[0]];
    },

    /**
     * Paliers de prestige cosmétiques (halo/étoiles/couronne en CSS) pour la
     * progression au-delà du dernier stade d'une branche (45★) : pas de
     * nouvel emoji à produire, juste un effet visuel autour du compagnon
     * final, qui continue de récompenser les étoiles gagnées ensuite.
     */
    _prestigeTiers: [
        { id: 'gold', requires: 75, label: 'Halo doré', className: 'avatar-prestige-gold' },
        { id: 'stars', requires: 100, label: 'Étoiles scintillantes', className: 'avatar-prestige-stars' },
        { id: 'crown', requires: 150, label: 'Couronne', className: 'avatar-prestige-crown' }
    ],

    getAvatarPrestigeTier(totalStars) {
        let current = null;
        for (const tier of this._prestigeTiers) {
            if (totalStars >= tier.requires) current = tier;
        }
        return current;
    },

    getAvatarNextPrestigeTier(totalStars) {
        return this._prestigeTiers.find((tier) => totalStars < tier.requires) || null;
    },

    /**
     * État de l'évolution : le nœud actuel, s'il peut encore évoluer (a des
     * children dont au moins un seuil est atteignable), et la liste des
     * prochains stades disponibles. totalStarsOverride permet de recalculer
     * cet état pour un total d'étoiles hypothétique (ex: "avant" un exercice)
     * sans dépendre de l'état localStorage réel à cet instant.
     */
    getAvatarEvolutionState(name = this.getCurrentUser(), totalStarsOverride = null) {
        const totalStars = totalStarsOverride !== null ? totalStarsOverride : this.getTotalStars(name);
        const key = this._getAvatarStateKey(name);
        const state = key ? this._safeParseObject(this._getItem(key)) : {};
        const currentId = this._avatarTree[state.currentId] ? state.currentId : this._avatarStarterIds[0];
        const node = this._getAvatarNode(currentId);

        const childOptions = (node.children || [])
            .map((childId) => ({ id: childId, ...this._getAvatarNode(childId) }))
            .filter((child) => totalStars >= child.requires);

        const isFinalStage = (node.children || []).length === 0;
        const prestigeTier = isFinalStage ? this.getAvatarPrestigeTier(totalStars) : null;
        const nextPrestigeTier = isFinalStage ? this.getAvatarNextPrestigeTier(totalStars) : null;

        return {
            currentId,
            emoji: node.emoji,
            label: node.label,
            totalStars,
            canEvolve: childOptions.length > 0,
            nextOptions: childOptions,
            isFinalStage,
            prestigeTier,
            nextPrestigeTier
        };
    },

    _getAvatarStateKey(name = this.getCurrentUser()) {
        const cleanName = this._sanitize(name).slice(0, this._profileNameMaxLength);
        return cleanName ? `avatar_state_${cleanName}` : null;
    },

    hasAvatarStarter(name = this.getCurrentUser()) {
        const key = this._getAvatarStateKey(name);
        if (!key) return false;
        const state = this._safeParseObject(this._getItem(key));
        return !!this._avatarTree[state.currentId];
    },

    getAvatarStarterChoices() {
        return this._avatarStarterIds.map((id) => ({ id, ...this._getAvatarNode(id) }));
    },

    chooseAvatarStarter(starterId, name = this.getCurrentUser()) {
        const key = this._getAvatarStateKey(name);
        if (!key) return null;
        const cleanId = this._avatarStarterIds.includes(starterId) ? starterId : this._avatarStarterIds[0];
        this._setItem(key, JSON.stringify({ currentId: cleanId }));
        return this._getAvatarNode(cleanId);
    },

    /**
     * Fait évoluer l'avatar vers childId si ce stade est bien un enfant du
     * nœud courant ET que le seuil d'étoiles est atteint — recalculé ici
     * plutôt que de faire confiance à l'appelant, pour qu'un appel direct ne
     * puisse jamais débloquer un stade non gagné.
     */
    evolveAvatarTo(childId, name = this.getCurrentUser()) {
        const state = this.getAvatarEvolutionState(name);
        const target = state.nextOptions.find((option) => option.id === childId);
        if (!target) return state;

        const key = this._getAvatarStateKey(name);
        if (!key) return state;
        this._setItem(key, JSON.stringify({ currentId: childId }));
        return this.getAvatarEvolutionState(name);
    },

    getTotalStars(name = this.getCurrentUser()) {
        const { records } = this._readRecords(name);
        return Object.values(records || {}).reduce((sum, entry) => sum + (entry.stars || 0), 0);
    },

    _getActivityLogKey(name = this.getCurrentUser()) {
        const cleanName = this._sanitize(name).slice(0, this._profileNameMaxLength);
        return cleanName ? `activity_log_${cleanName}` : null;
    },

    _activityLogMaxDays: 35,

    /**
     * Journal léger par jour (compteur de tentatives + d'étoiles gagnées ce
     * jour-là), distinct des records par exercice : records ne garde que la
     * MEILLEURE tentative par exercice, donc impossible d'en déduire "ce qui
     * s'est passé cette semaine". On ne garde que 35 jours pour rester léger
     * en localStorage (largement assez pour un rapport hebdomadaire glissant).
     */
    recordDailyActivity(starsEarned, name = this.getCurrentUser()) {
        const key = this._getActivityLogKey(name);
        if (!key) return;

        const today = this._dayNumber(Date.now());
        const log = this._safeParseObject(this._getItem(key));
        const dayEntry = log[today] && typeof log[today] === 'object' ? log[today] : { attempts: 0, stars: 0 };
        dayEntry.attempts = Math.max(0, Number(dayEntry.attempts) || 0) + 1;
        dayEntry.stars = Math.max(0, Number(dayEntry.stars) || 0) + Math.max(0, Number(starsEarned) || 0);
        log[today] = dayEntry;

        const cutoff = today - this._activityLogMaxDays;
        Object.keys(log).forEach((dayKey) => {
            if (Number(dayKey) < cutoff) delete log[dayKey];
        });

        this._setItem(key, JSON.stringify(log));
    },

    /**
     * Exporte toutes les données locales connues (profils + données par
     * profil) en un objet JSON sérialisable, pour rassurer sur la pérennité
     * d'un stockage purement local (pas de cloud) : le parent peut le
     * sauvegarder lui-même. Ne couvre que les clés gérées par Storage, pas
     * les préférences globales (dark_mode, etc.) qui ne sont pas liées à un
     * enfant en particulier.
     */
    exportAllData() {
        const profiles = this.getProfiles();
        return {
            exportedAt: new Date().toISOString(),
            profiles: profiles.map((name) => {
                const cleanName = this._sanitize(name).slice(0, this._profileNameMaxLength);
                return {
                    name: cleanName,
                    records: this._readRecords(cleanName).records,
                    streak: this._readStreak(cleanName),
                    appearance: this.getProfileAppearance(cleanName)
                };
            })
        };
    },

    getWeeklyActivity(name = this.getCurrentUser()) {
        const key = this._getActivityLogKey(name);
        const today = this._dayNumber(Date.now());
        const log = key ? this._safeParseObject(this._getItem(key)) : {};

        let attempts = 0;
        let stars = 0;
        let activeDays = 0;
        for (let i = 0; i < 7; i++) {
            const dayEntry = log[today - i];
            if (dayEntry && (dayEntry.attempts > 0)) {
                attempts += Number(dayEntry.attempts) || 0;
                stars += Number(dayEntry.stars) || 0;
                activeDays++;
            }
        }

        return { attempts, stars, activeDays };
    },

    _getAppearanceKey(name = this.getCurrentUser()) {
        const cleanName = this._sanitize(name).slice(0, this._profileNameMaxLength);
        return cleanName ? `appearance_${cleanName}` : null;
    },

    /**
     * L'avatar (emoji) n'est plus un choix libre : il vient de l'arbre
     * d'évolution (getAvatarEvolutionState). getProfileAppearance ne gère
     * plus que l'accent (couleur) ; l'avatar renvoyé ici est juste un
     * confort pour les écrans qui veulent les deux d'un coup.
     */
    getProfileAppearance(name = this.getCurrentUser()) {
        const key = this._getAppearanceKey(name);
        const fallback = { accent: this._accentChoices[0].id };
        const raw = key ? this._safeParseObject(this._getItem(key)) : {};
        const accent = this._accentChoices.some((entry) => entry.id === raw.accent) ? raw.accent : fallback.accent;
        const avatarState = this.getAvatarEvolutionState(name);
        return { avatar: avatarState.emoji, accent };
    },

    setProfileAppearance(name, { accent } = {}) {
        const key = this._getAppearanceKey(name);
        if (!key) return null;
        const current = this.getProfileAppearance(name);
        const safeAccent = this._accentChoices.some((entry) => entry.id === accent) ? accent : current.accent;
        const next = { accent: safeAccent };
        this._setItem(key, JSON.stringify(next));
        return { avatar: current.avatar, accent: safeAccent };
    },

    getPreference(key) {
        return this._getItem(`pref_${this._sanitize(key)}`) === '1';
    },

    _parentPinKey: 'dn_parent_pin',
    _defaultParentPin: '0000',

    getParentPin() {
        const raw = (this._getItem(this._parentPinKey) || '').toString();
        return /^\d{4}$/.test(raw) ? raw : this._defaultParentPin;
    },

    setParentPin(pin) {
        const clean = (pin || '').toString().trim();
        if (!/^\d{4}$/.test(clean)) return false;
        this._setItem(this._parentPinKey, clean);
        return true;
    },

    isDefaultParentPin() {
        return this.getParentPin() === this._defaultParentPin;
    },

    _dailyChallengeTemplates: [
        { id: 'exercises-3', target: 3, label: 'Réussis 3 exercices aujourd\'hui', icon: '🎯' },
        { id: 'exercises-5', target: 5, label: 'Réussis 5 exercices aujourd\'hui', icon: '🚀' },
        { id: 'perfect-1', target: 1, label: 'Obtiens un sans-faute aujourd\'hui', icon: '🏆', perfectOnly: true },
        { id: 'perfect-2', target: 2, label: 'Obtiens 2 sans-faute aujourd\'hui', icon: '🌟', perfectOnly: true }
    ],

    _getDailyChallengeKey(name = this.getCurrentUser()) {
        const cleanName = this._sanitize(name).slice(0, this._profileNameMaxLength);
        return cleanName ? `daily_challenge_${cleanName}` : null;
    },

    getDailyChallenge(name = this.getCurrentUser()) {
        const key = this._getDailyChallengeKey(name);
        if (!key) return null;

        const today = this._dayNumber(Date.now());
        const raw = this._safeParseObject(this._getItem(key));
        const storedDay = Math.max(0, Number(raw.day) || 0);

        if (storedDay === today && raw.templateId) {
            const template = this._dailyChallengeTemplates.find((t) => t.id === raw.templateId);
            if (template) {
                return {
                    ...template,
                    progress: Math.max(0, Number(raw.progress) || 0),
                    completed: !!raw.completed
                };
            }
        }

        const template = this._dailyChallengeTemplates[Math.floor(Math.random() * this._dailyChallengeTemplates.length)];
        this._setItem(key, JSON.stringify({ day: today, templateId: template.id, progress: 0, completed: false }));
        return { ...template, progress: 0, completed: false };
    },

    /**
     * Avance le défi du jour après un exercice terminé. isPerfect distingue
     * les défis "sans-faute" (perfectOnly) des défis "N exercices" génériques :
     * un exercice raté compte pour les seconds mais pas pour les premiers.
     */
    recordDailyChallengeAttempt(isPerfect, name = this.getCurrentUser()) {
        const key = this._getDailyChallengeKey(name);
        if (!key) return null;

        const challenge = this.getDailyChallenge(name);
        if (!challenge || challenge.completed) return challenge;

        if (challenge.perfectOnly && !isPerfect) return challenge;

        const today = this._dayNumber(Date.now());
        const progress = Math.min(challenge.target, challenge.progress + 1);
        const completed = progress >= challenge.target;
        this._setItem(key, JSON.stringify({ day: today, templateId: challenge.id, progress, completed }));

        return { ...challenge, progress, completed, justCompleted: completed && !challenge.completed };
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
        { id: 'explorer-100', icon: '🚀', label: '100 exercices essayés', test: (s) => s.exercisesAttempted >= 100 },
        // Grade completion badges — unlocked when ≥10 exercises attempted in a given grade
        { id: 'grade-cp', icon: '🐣', label: 'CP terminé', test: (s) => (s.gradeExercises['cp'] || 0) >= 10 },
        { id: 'grade-ce1', icon: '🌱', label: 'CE1 terminé', test: (s) => (s.gradeExercises['ce1'] || 0) >= 10 },
        { id: 'grade-ce2', icon: '🌿', label: 'CE2 terminé', test: (s) => (s.gradeExercises['ce2'] || 0) >= 10 },
        { id: 'grade-cm1', icon: '🌳', label: 'CM1 terminé', test: (s) => (s.gradeExercises['cm1'] || 0) >= 10 },
        { id: 'grade-cm2', icon: '🎓', label: 'CM2 terminé', test: (s) => (s.gradeExercises['cm2'] || 0) >= 10 },
        // Subject mastery badges — unlocked when ≥5 exercises in that subject scored ≥75%
        { id: 'master-maths', icon: '🔢', label: 'Maître des maths', test: (s) => (s.subjectMastery['maths'] || 0) >= 5 },
        { id: 'master-francais', icon: '📖', label: 'Maître du français', test: (s) => (s.subjectMastery['francais'] || 0) >= 5 },
        { id: 'master-histoire', icon: '🏛️', label: 'Historien en herbe', test: (s) => (s.subjectMastery['histoire'] || 0) >= 5 },
        { id: 'master-sciences', icon: '🔬', label: 'Petit scientifique', test: (s) => (s.subjectMastery['sciences'] || 0) >= 5 },
        { id: 'master-geo', icon: '🗺️', label: 'Géographe en herbe', test: (s) => (s.subjectMastery['geo'] || 0) >= 5 }
    ],

    // Maps exercise-id prefixes to canonical subject keys used by mastery badges.
    // Prefix matching beats segment[1] parsing because many IDs have non-subject
    // second segments (e.g. 'cm1-frac-1', 'add-1') or use 'geo' for both geography
    // and math-geometry exercises. Longest prefix wins (checked in order).
    _subjectPrefixes: [
        // Maths — must come before geography to claim cm*-geo-* geometry ids
        ['add-', 'maths'], ['sub-', 'maths'], ['comp-', 'maths'], ['mul-', 'maths'],
        ['div-', 'maths'], ['cible-', 'maths'], ['banquier-', 'maths'], ['oiseau-', 'maths'],
        ['carre-', 'maths'], ['math-', 'maths'],
        ['cp-maths-', 'maths'], ['ce1-maths-', 'maths'], ['ce2-maths-', 'maths'],
        ['cm1-maths-', 'maths'], ['cm2-maths-', 'maths'],
        ['cm1-m-', 'maths'], ['cm2-m-', 'maths'],
        ['cm1-frac-', 'maths'], ['cm2-frac-', 'maths'],
        ['cm1-dec-', 'maths'], ['cm2-dec-', 'maths'],
        ['cm1-div-', 'maths'], ['cm2-div-', 'maths'],
        ['cm1-nombres-', 'maths'], ['cm2-nombres-', 'maths'],
        ['cm1-longueurs', 'maths'], ['cm2-longueurs', 'maths'],
        ['cm1-romains', 'maths'], ['cm2-romains', 'maths'],
        ['cm1-graphique-', 'maths'], ['cm2-graphique-', 'maths'],
        ['cm1-donnees-', 'maths'], ['cm2-donnees-', 'maths'],
        ['cm1-geo-', 'maths'], ['cm2-geo-', 'maths'],   // math geometry, not geography
        ['ce2-geo-perim-', 'maths'], ['ce2-geo-aire-', 'maths'],
        ['ce1-geo-formes-', 'maths'], ['cp-geo-formes-', 'maths'],
        ['cp-geo-comp-', 'maths'],
        // Français
        ['fr-', 'francais'], ['cp-audio-', 'francais'],
        ['cp-francais-', 'francais'], ['ce1-francais-', 'francais'],
        ['ce2-francais-', 'francais'], ['cm1-francais-', 'francais'],
        ['cm2-francais-', 'francais'],
        ['cp-lecture-', 'francais'], ['ce1-lecture-', 'francais'],
        ['ce2-lecture-', 'francais'], ['cm1-lecture-', 'francais'],
        ['cm2-lecture-', 'francais'],
        ['cp-conj-', 'francais'], ['ce1-conj-', 'francais'],
        ['ce2-conj-', 'francais'], ['cm1-conj-', 'francais'],
        ['cm2-conj-', 'francais'],
        ['cp-gram-', 'francais'], ['ce1-gram-', 'francais'],
        ['ce2-gram-', 'francais'], ['cm1-gram-', 'francais'],
        ['cm2-gram-', 'francais'],
        ['cp-ortho-', 'francais'], ['ce1-ortho-', 'francais'],
        ['ce2-ortho-', 'francais'], ['cm1-ortho-', 'francais'],
        ['cm2-ortho-', 'francais'],
        ['cp-vocabulaire-', 'francais'], ['ce1-vocabulaire-', 'francais'],
        ['ce2-vocabulaire-', 'francais'], ['cm1-vocabulaire-', 'francais'],
        ['cm2-vocabulaire-', 'francais'],
        ['cp-dictee-', 'francais'], ['ce1-dictee-', 'francais'],
        ['cp-phrase-', 'francais'], ['ce1-phrase-', 'francais'],
        ['ce2-phrase-', 'francais'],
        ['cp-conjugaison-', 'francais'], ['ce1-conjugaison-', 'francais'],
        ['cp-un-', 'francais'], ['cp-mon-', 'francais'],
        ['cp-ordre-', 'francais'],
        // Histoire
        ['cp-histoire-', 'histoire'], ['ce1-histoire-', 'histoire'],
        ['ce2-histoire-', 'histoire'], ['cm1-histoire-', 'histoire'],
        ['cm2-histoire-', 'histoire'],
        ['cm1-periodes-', 'histoire'], ['cm1-prehistoire-', 'histoire'],
        ['cm1-moyen-', 'histoire'], ['cm1-antiquite-', 'histoire'],
        ['cm2-revolution-', 'histoire'], ['cm2-xxe-', 'histoire'],
        // Géographie (real geography — distinct from math geometry above)
        ['cp-geo-plan-', 'geo'], ['cp-geo-paysages-', 'geo'],
        ['cp-geo-transports-', 'geo'], ['cp-geo-se-', 'geo'],
        ['cp-plan-', 'geo'],
        ['ce1-geo-', 'geo'], ['ce2-geo-transports-', 'geo'],
        ['ce2-geo-relief-', 'geo'], ['ce2-geo-france-', 'geo'],
        ['ce2-geographie-', 'geo'],
        ['cm1-geographie-', 'geo'], ['cm1-geo-relief-', 'geo'],
        ['cm1-geo-europe-', 'geo'], ['cm1-geo-france-', 'geo'],
        ['cm2-geographie-', 'geo'], ['cm2-geo-monde-', 'geo'],
        ['cm2-geo-france-', 'geo'], ['cm2-geo-ue-', 'geo'],
        // Sciences
        ['cp-sciences-', 'sciences'], ['ce1-sciences-', 'sciences'],
        ['ce2-sciences-', 'sciences'], ['cm1-sciences-', 'sciences'],
        ['cm2-sciences-', 'sciences'],
        // EMC (no badge for now — entries still counted in subjectMastery for future use)
        ['cp-emc-', 'emc'], ['ce1-emc-', 'emc'], ['ce2-emc-', 'emc'],
        ['cm1-emc-', 'emc'], ['cm2-emc-', 'emc']
    ],

    _extractSubjectFromExerciseId(exerciseId) {
        const id = exerciseId.toLowerCase();
        for (const [prefix, subject] of this._subjectPrefixes) {
            if (id.startsWith(prefix)) return subject;
        }
        return null;
    },

    getBadges(name = this.getCurrentUser()) {
        const { records } = this._readRecords(name);
        const rawRecords = records || {};
        const entries = Object.values(rawRecords);
        const totalStars = entries.reduce((sum, entry) => sum + (entry.stars || 0), 0);
        const perfectCount = entries.filter((entry) => entry.percent === 100).length;
        const bestStreak = this._readStreak(name).best;
        const exercisesAttempted = entries.length;

        // Grade exercise counts: count distinct exerciseIds per grade prefix
        const gradeExercises = {};
        for (const key of Object.keys(rawRecords)) {
            const sep = key.indexOf('::');
            if (sep === -1) continue;
            const gradeId = key.slice(0, sep);
            gradeExercises[gradeId] = (gradeExercises[gradeId] || 0) + 1;
        }

        // Subject mastery: count exercises per subject where percent >= 75
        const subjectMastery = {};
        for (const [key, entry] of Object.entries(rawRecords)) {
            if ((entry.percent || 0) < 75) continue;
            const sep = key.indexOf('::');
            if (sep === -1) continue;
            const exerciseId = key.slice(sep + 2);
            const subject = this._extractSubjectFromExerciseId(exerciseId);
            if (subject) subjectMastery[subject] = (subjectMastery[subject] || 0) + 1;
        }

        const stats = { totalStars, perfectCount, bestStreak, exercisesAttempted, gradeExercises, subjectMastery };

        return this._badgeDefinitions.map((def) => ({
            id: def.id,
            icon: def.icon,
            label: def.label,
            unlocked: !!def.test(stats)
        }));
    },

    getNewlyUnlockedBadges(badgesBefore) {
        const badgesAfter = this.getBadges();
        return badgesAfter.filter((b) => {
            const before = badgesBefore.find((x) => x.id === b.id);
            return b.unlocked && before && !before.unlocked;
        });
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

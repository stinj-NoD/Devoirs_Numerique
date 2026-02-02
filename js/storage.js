/*
 * Devoir Numérique
 * Copyright (C) 2026 [Stinj-NoD]
 * Licence : GNU GPL v3
 */

const Storage = {
    currentUser: null,
    // Une clé "secrète" pour signer les scores (à changer si tu veux)
    _salt: "DN_2026_SECURE_V1",

    /**
     * Nettoie une chaîne pour éviter les injections de scripts ou caractères spéciaux
     */
    _sanitize(str) {
        if (!str) return "";
        return str.replace(/[^-a-zA-Z0-9À-ÿ ]/g, "").trim();
    },

    /**
     * Génère un hash simple pour vérifier que le score n'a pas été modifié à la main
     */
    _generateHash(data) {
        const str = JSON.stringify(data) + this._salt;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0; // Convertit en entier 32 bits
        }
        return hash.toString(16);
    },

    setCurrentUser(name) {
        const cleanName = this._sanitize(name);
        this.currentUser = cleanName;
        localStorage.setItem('dn_current_user', cleanName);
    },

    getCurrentUser() {
        return this.currentUser || localStorage.getItem('dn_current_user');
    },

    getProfiles() {
        try {
            const p = localStorage.getItem('dn_profiles_list');
            return p ? JSON.parse(p).map(n => this._sanitize(n)) : [];
        } catch (e) { return []; }
    },

    addProfile(name) {
        const cleanName = this._sanitize(name);
        if (!cleanName) return;
        
        let profiles = this.getProfiles();
        if (!profiles.includes(cleanName)) {
            profiles.push(cleanName);
            localStorage.setItem('dn_profiles_list', JSON.stringify(profiles));
        }
    },

    saveRecord(gradeId, exerciseId, score, total) {
        if (!this.currentUser) return;
        
        const key = `records_${this.currentUser}`;
        let records = {};
        
        // Récupération sécurisée des anciens records
        try {
            const raw = localStorage.getItem(key);
            if (raw) records = JSON.parse(raw);
        } catch (e) { records = {}; }

        const percent = Math.min(100, Math.max(0, (score / total) * 100));
        const stars = (percent === 100 ? 3 : percent >= 75 ? 2 : percent >= 50 ? 1 : 0);

        // On ne sauvegarde que si c'est un meilleur score
        if (!records[exerciseId] || percent > records[exerciseId].percent) {
            const entry = { score, total, percent, stars, timestamp: Date.now() };
            
            // Signature de l'entrée pour détecter la triche
            entry.h = this._generateHash({s: score, t: total, p: percent});
            
            records[exerciseId] = entry;
            localStorage.setItem(key, JSON.stringify(records));
        }
    },

    getRecord(exerciseId) {
        if (!this.currentUser) return null;
        try {
            const records = JSON.parse(localStorage.getItem(`records_${this.currentUser}`) || "{}");
            const entry = records[exerciseId];
            
            if (!entry) return null;

            // VERIFICATION : Le hash correspond-il toujours aux données ?
            const check = this._generateHash({s: entry.score, t: entry.total, p: entry.percent});
            if (check !== entry.h) {
                console.warn("Données corrompues ou modifiées pour l'exercice :", exerciseId);
                return null; // On ignore le score s'il a été modifié manuellement
            }
            
            return entry;
        } catch (e) { return null; }
    },

    removeProfile(name) {
        const cleanName = this._sanitize(name);
        let profiles = this.getProfiles();
        profiles = profiles.filter(p => p !== cleanName);
        localStorage.setItem('dn_profiles_list', JSON.stringify(profiles));
        
        localStorage.removeItem(`records_${cleanName}`);
        
        if (this.currentUser === cleanName) {
            this.currentUser = null;
            localStorage.removeItem('dn_current_user');
        }
    }
};
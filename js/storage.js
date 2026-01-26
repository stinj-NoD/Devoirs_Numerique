const Storage = {
    currentUser: null,

    setCurrentUser(name) {
        this.currentUser = name;
        localStorage.setItem('math_current_user', name);
    },

    getCurrentUser() {
        return this.currentUser || localStorage.getItem('math_current_user');
    },

    getProfiles() {
        const p = localStorage.getItem('math_profiles_list');
        return p ? JSON.parse(p) : [];
    },

    addProfile(name) {
        let profiles = this.getProfiles();
        if (!profiles.includes(name)) {
            profiles.push(name);
            localStorage.setItem('math_profiles_list', JSON.stringify(profiles));
        }
    },

    // La clé de sauvegarde devient spécifique : "Alice_records"
    saveRecord(gradeId, exerciseId, score, total) {
        if (!this.currentUser) return;
        const key = `records_${this.currentUser}`;
        let records = JSON.parse(localStorage.getItem(key) || "{}");
        const percent = (score / total) * 100;

        if (!records[exerciseId] || percent > records[exerciseId].percent) {
            records[exerciseId] = { score, total, percent, stars: (percent === 100 ? 3 : percent >= 75 ? 2 : percent >= 50 ? 1 : 0) };
            localStorage.setItem(key, JSON.stringify(records));
        }
    },

    getRecord(exerciseId) {
        if (!this.currentUser) return null;
        const records = JSON.parse(localStorage.getItem(`records_${this.currentUser}`) || "{}");
        return records[exerciseId] || null;
    },
    removeProfile(name) {
        let profiles = this.getProfiles();
        profiles = profiles.filter(p => p !== name);
        localStorage.setItem('math_profiles_list', JSON.stringify(profiles));
        
        // Optionnel : on nettoie aussi les records associés pour libérer de l'espace
        localStorage.removeItem(`records_${name}`);
        
        // Si c'était l'utilisateur actuel, on le déconnecte
        if (this.currentUser === name) {
            this.currentUser = null;
            localStorage.removeItem('math_current_user');
        }
    }
};
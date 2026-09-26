/*
 * Devoir Numérique - Espace parents
 * Extrait de app.js (découpage mécanique, aucun changement de logique).
 * Fusionné sur le même objet App : this.state et les méthodes des autres
 * modules restent accessibles normalement (même objet partagé).
 */
Object.assign(App, {
    exportParentData() {
        const data = Storage.exportAllData();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.getElementById('parents-export-link');
        if (!link) return;
        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    },

    async importParentData(fileInput) {
        const file = fileInput.files?.[0];
        fileInput.value = ''; // permet de re-sélectionner le même fichier
        if (!file) return;

        let data;
        try {
            data = JSON.parse(await file.text());
        } catch (e) {
            alert("Ce fichier n'est pas une sauvegarde valide (JSON illisible).");
            return;
        }

        const names = Array.isArray(data?.profiles)
            ? data.profiles.map((p) => p?.name).filter(Boolean)
            : [];
        if (!names.length) {
            alert("Ce fichier ne contient aucun profil à restaurer.");
            return;
        }

        const confirmed = confirm(
            `Restaurer ${names.length} profil${names.length > 1 ? 's' : ''} : ${names.join(', ')} ?\n\n` +
            "Les profils du même nom seront remplacés par les données de la sauvegarde."
        );
        if (!confirmed) return;

        const result = Storage.importAllData(data);
        if (!result.ok) {
            alert("La restauration a échoué : aucun profil valide dans ce fichier.");
            return;
        }
        alert(`Restauration réussie : ${result.imported} profil${result.imported > 1 ? 's' : ''} importé${result.imported > 1 ? 's' : ''}.`);
        this.showParentsDashboard();
    },

    showGuide(origin = 'screen-profiles') {
        this.state.guideOrigin = origin;
        const backLabel = document.getElementById('parents-guide-back-label');
        if (backLabel) {
            backLabel.textContent = origin === 'screen-parents' ? '← RETOUR AU SUIVI' : "← RETOUR À L'ACCUEIL";
        }
        UI.showScreen('screen-parents-guide');
    },

    // Reads and clears the guide origin so a stale value can never route a
    // later navigation (e.g. straight onto the PIN-gated parents dashboard).
    leaveGuide() {
        const target = this.state.guideOrigin || 'screen-profiles';
        this.state.guideOrigin = null;
        if (target === 'screen-profiles') this.renderProfilesScreen();
        else UI.showScreen(target);
    },

    async showProgramOverview() {
        try {
            await this.loadAllGradesCache();
        } catch (e) {
            console.error('Erreur chargement programme :', e);
        }
        const grades = this._gradesIndexCache || [];
        const gradeDataById = this._collectionGradesCache || {};
        UI.renderProgramOverview(grades, gradeDataById);
        UI.showScreen('screen-parents-program');
    },

    // --- ESPACE PARENTS ---

    openParentsGate() {
        this.state.parentsPinInput = "";
        UI.renderParentsPinPad(
            (digit) => this.parentsPinInput(digit),
            () => this.parentsPinBackspace()
        );
        this.refreshParentsPinDisplay();
        const hint = document.getElementById('parents-pin-hint');
        if (hint) {
            hint.textContent = Storage.isDefaultParentPin()
                ? 'Code par défaut : 0000 (à personnaliser dans l\'espace parents).'
                : '';
        }
        const error = document.getElementById('parents-pin-error');
        if (error) error.classList.add('is-hidden');
        UI.showScreen('screen-parents-pin');
    },

    refreshParentsPinDisplay() {
        const display = document.getElementById('parents-pin-display');
        if (!display) return;
        const input = this.state.parentsPinInput || "";
        display.textContent = '●'.repeat(input.length) + '○'.repeat(Math.max(0, 4 - input.length));
    },

    parentsPinBackspace() {
        this.state.parentsPinInput = (this.state.parentsPinInput || "").slice(0, -1);
        this.refreshParentsPinDisplay();
    },

    async parentsPinInput(digit) {
        const current = (this.state.parentsPinInput || "") + digit;
        if (current.length > 4) return;
        this.state.parentsPinInput = current;
        this.refreshParentsPinDisplay();

        if (current.length === 4) {
            if (current === Storage.getParentPin()) {
                this.state.parentsPinInput = "";
                await this.showParentsDashboard();
            } else {
                const error = document.getElementById('parents-pin-error');
                if (error) error.classList.remove('is-hidden');
                this.state.parentsPinInput = "";
                this.refreshParentsPinDisplay();
            }
        }
    },

    async getParentDashboardData() {
        await this.loadAllGradesCache();
        const grades = this._gradesIndexCache || [];
        const gradeDataById = this._collectionGradesCache || {};

        return Storage.getProfiles().map((name) => {
            let totalExercises = 0;
            let totalDone = 0;
            let totalStars = 0;
            let lastTimestamp = 0;
            const toReview = [];

            grades.forEach((grade) => {
                const gradeData = gradeDataById[grade.id];
                const subjects = Array.isArray(gradeData?.subjects) ? gradeData.subjects : [];
                subjects.forEach((subject) => {
                    (subject?.subthemes || []).forEach((subtheme) => {
                        (subtheme?.exercises || []).forEach((exercise) => {
                            totalExercises++;
                            const record = Storage.getRecord(exercise.id, grade.id, name);
                            if (record) {
                                totalDone++;
                                totalStars += record.stars || 0;
                                const ts = record.lastTimestamp || record.timestamp || 0;
                                if (ts > lastTimestamp) lastTimestamp = ts;

                                const percent = Math.round((record.lastPercent ?? record.percent) || 0);
                                if (percent < 50) {
                                    toReview.push({
                                        title: exercise.title || 'Exercice',
                                        subjectTitle: subject?.title || 'Matière',
                                        gradeTitle: grade.title || grade.id,
                                        percent
                                    });
                                }
                            }
                        });
                    });
                });
            });

            toReview.sort((a, b) => a.percent - b.percent);

            return {
                name,
                appearance: Storage.getProfileAppearance(name),
                totalExercises,
                totalDone,
                totalStars,
                maxStars: totalExercises * 3,
                streak: Storage.getStreak(name),
                badges: Storage.getBadges(name),
                lastTimestamp,
                weekly: Storage.getWeeklyActivity(name),
                toReview: toReview.slice(0, 5)
            };
        });
    },

    async showParentsDashboard() {
        const data = await this.getParentDashboardData();
        UI.renderParentsDashboard(data);
        UI.showScreen('screen-parents');
    },

    promptChangeParentPin() {
        const current = prompt("Nouveau code parent (4 chiffres) :");
        if (current === null) return;
        const ok = Storage.setParentPin(current.trim());
        if (!ok) {
            alert("Le code doit contenir exactement 4 chiffres.");
            return;
        }
        alert("Code parent mis à jour.");
    },
});

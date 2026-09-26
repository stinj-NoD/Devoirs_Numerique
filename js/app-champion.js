/*
 * Devoir Numérique - Mode Champions (chrono)
 * Extrait de app.js (découpage mécanique, aucun changement de logique).
 * Fusionné sur le même objet App : this.state et les méthodes des autres
 * modules restent accessibles normalement (même objet partagé).
 */
Object.assign(App, {
    championDurations: [60, 90, 120],

    showChampionSetup() {
        const modes = this.championDurations.map((duration) => ({
            id: `champion-duration-${duration}`,
            mode: duration,
            icon: '⏱️',
            title: `${duration} secondes`,
            subtitle: duration === 60 ? 'Sprint' : (duration === 90 ? 'Standard' : 'Marathon'),
            helper: 'Lancer le défi.'
        }));
        UI.renderBrowseModes(modes, (entry) => this.startChampionMode(entry.mode), 'champion-duration-list');
        this.renderChampionScores();
        UI.showScreen('screen-champion-setup');
    },

    renderChampionScores() {
        const gradeId = this.state.currentGrade?.gradeId || null;
        const scoresByDuration = this.championDurations.map((duration) => ({
            duration,
            scores: Storage.getChampionScores(gradeId, duration)
        }));
        UI.renderChampionScores(scoresByDuration);
    },

    async startChampionMode(duration) {
        // Les cartes interactives (map-locate) sont exclues : leur SVG n'est
        // pas préchargé par ce mode ("Carte indisponible") et une carte à
        // explorer ne colle pas au rythme d'un sprint chronométré.
        const pool = this.getAllNormalExercises()
            .filter((exercise) => exercise.params?.type !== 'map-locate');
        if (pool.length < 5) {
            alert("Pas assez d'exercices disponibles pour le Mode Champions dans ce niveau.");
            return;
        }

        const dataFiles = [...new Set(pool.map((e) => e.params?.dataFile).filter(Boolean))];
        let dataCache = {};
        try {
            const loaded = await Promise.all(dataFiles.map((file) => this.fetchJson([file, `./${file.replace(/^\.\//, '')}`])));
            dataFiles.forEach((file, index) => { dataCache[file] = loaded[index]; });
        } catch (error) {
            console.error(error);
            alert("Impossible de préparer le Mode Champions (chargement des données).");
            return;
        }

        this.stopCurrentExercise();
        this.state.championMode = {
            duration,
            pool,
            dataCache,
            usedSetsByExercise: new Map(),
            score: 0,
            answered: 0,
            endAt: Date.now() + duration * 1000,
            intervalId: null
        };
        this.state.currentExercise = null;
        this.state.currentExerciseData = null;
        this.state.problemData = null;
        this.state.userInput = "";
        this.state.isValidating = false;
        this.applyVisualContext();

        const hud = document.getElementById('champion-hud');
        if (hud) hud.classList.remove('is-hidden');
        const progressContainer = document.querySelector('#screen-game .progress-container');
        if (progressContainer) progressContainer.classList.add('is-hidden');

        UI.showScreen('screen-game');
        this.championTick();
        this.state.championMode.intervalId = setInterval(() => this.championTick(), 250);
        this.championNextQuestion();
    },

    championTick() {
        const championMode = this.state.championMode;
        if (!championMode) return;
        const remainingMs = championMode.endAt - Date.now();
        const timerEl = document.getElementById('champion-timer');
        const scoreEl = document.getElementById('champion-score');
        if (scoreEl) scoreEl.textContent = `${championMode.score} pt${championMode.score > 1 ? 's' : ''}`;

        if (remainingMs <= 0) {
            if (timerEl) timerEl.textContent = '0 s';
            this.endChampionMode();
            return;
        }
        if (timerEl) timerEl.textContent = `${Math.ceil(remainingMs / 1000)} s`;
    },

    championNextQuestion() {
        const championMode = this.state.championMode;
        if (!championMode) return;
        if (championMode.endAt <= Date.now()) {
            this.endChampionMode();
            return;
        }

        const exercise = Engines.utils.pick(championMode.pool);
        const usedSetKey = exercise.id || `${exercise.params?.dataFile || ''}::${exercise.params?.category || ''}`;
        if (!championMode.usedSetsByExercise.has(usedSetKey)) {
            championMode.usedSetsByExercise.set(usedSetKey, new Set());
        }
        const cfg = {
            ...(exercise.params || {}),
            dataSet: exercise.params?.dataFile ? championMode.dataCache[exercise.params.dataFile] : undefined,
            mapSvg: "",
            usedSet: championMode.usedSetsByExercise.get(usedSetKey)
        };
        const problem = Engines.run(exercise.engine, cfg, this.state.frenchLib);
        const check = window.Validators?.validateProblem(problem);
        if (check && !check.valid || problem.answer === undefined || problem.answer === null) {
            // Question invalide : on retente immédiatement avec un autre exercice du pool plutôt que de bloquer la partie.
            this.championNextQuestion();
            return;
        }

        this.shuffleProblemChoices(problem);
        this.state.currentExercise = exercise;
        this.state.problemData = problem;
        this.state.targetAnswer = problem.answer;
        this.state.userInput = "";
        if (problem.visualType === 'timelineOrder' && Array.isArray(problem.data?.currentOrder)) {
            this.state.userInput = problem.data.currentOrder.join(',');
        }
        if (problem.visualType === 'square' && problem.data) {
            problem.data.selectedIndices = [];
        }

        this.applyVisualContext();
        UI.updateKeyboardLayout(problem.inputType || "numeric", problem);
        this.refreshChampionUI();
        this.state.isValidating = false;
    },

    refreshChampionUI() {
        if (!this.state.problemData) return;
        UI.updateGameDisplay(this.state.problemData, this.state.userInput, 0);
    },

    endChampionMode() {
        const championMode = this.state.championMode;
        if (!championMode) return;
        if (championMode.intervalId) clearInterval(championMode.intervalId);

        const gradeId = this.state.currentGrade?.gradeId || null;
        const finalScore = championMode.score;
        const duration = championMode.duration;
        const previousBest = Storage.getChampionScores(gradeId, duration)[0]?.score || 0;
        Storage.saveChampionScore(gradeId, duration, finalScore);

        this.state.championMode = null;
        const hud = document.getElementById('champion-hud');
        if (hud) hud.classList.add('is-hidden');

        UI.renderChampionResults({
            score: finalScore,
            duration,
            isNewBest: finalScore > previousBest
        });
        UI.showScreen('screen-champion-results');
        if (finalScore > 0 && finalScore > previousBest) {
            UI.launchCelebration();
            if (window.AudioFeedback) AudioFeedback.playPerfect();
        }
    },
});

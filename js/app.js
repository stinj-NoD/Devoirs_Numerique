/*
 * Devoir Numérique
 * Copyright (C) 2026 [Stinj-NoD]
 *
 * Ce programme est un logiciel libre : vous pouvez le redistribuer et/ou le modifier
 * selon les termes de la Licence Publique Générale GNU publiée par la
 * Free Software Foundation, soit la version 3 de la licence, soit
 * (à votre gré) toute version ultérieure.
 *
 * Ce programme est distribué dans l'espoir qu'il sera utile,
 * mais SANS AUCUNE GARANTIE ; sans même la garantie implicite de
 * COMMERCIALISATION ou D'ADÉQUATION À UN USAGE PARTICULIER.
 * Voir la Licence Publique Générale GNU pour plus de détails.
 */
const App = {
    state: {
        currentGrade: null, currentTheme: null, currentExercise: null,
        currentQuestion: 0, score: 0, userInput: "", 
        targetAnswer: null, problemData: null, timer: null,
        isUppercase: true,
        frenchLib: null 
    },

    async init() {
        try {
            const res = await fetch('data/french_lib.json');
            this.state.frenchLib = await res.json();
        } catch (e) { console.error("Erreur bibliothèque :", e); }

        // Initialisation de la navigation et du clavier
        if (UI.initNavigation) UI.initNavigation();
        UI.initKeyboard((v, t) => this.handleInput(v, t));
        
        // Gestionnaire global pour les éléments interactifs (sécurité)
        const pz = document.getElementById('math-problem');
        if (pz) pz.onclick = (e) => { 
            const k = e.target.closest('.key'); 
            if (k) this.handleInput(k.getAttribute('data-val'), k); 
        };
        
        const br = document.getElementById('btn-results-menu');
        if (br) br.onclick = () => UI.showScreen('screen-themes');
        
        const profs = Storage.getProfiles();
        profs.length ? this.renderProfilesScreen() : UI.showScreen('screen-profiles');
    },

    // --- PROFILS & NAVIGATION ---
    createProfile() {
        const el = document.getElementById('new-profile-name'), n = el.value.trim();
        if (n) { Storage.addProfile(n); el.value = ""; this.renderProfilesScreen(); }
    },

    deleteProfile(e, n) {
        e.stopPropagation();
        if (confirm(`Supprimer ${n} ?`)) { Storage.removeProfile(n); this.renderProfilesScreen(); }
    },

    renderProfilesScreen() {
        const c = document.getElementById('profiles-list'); if (!c) return;
        c.innerHTML = "";
        Storage.getProfiles().forEach(n => {
            const d = document.createElement('div'); d.className = 'card profile-card';
            d.innerHTML = `<span class="card-icon">👤</span><span class="card-title">${n}</span><button class="btn-delete-profile">×</button>`;
            d.onclick = () => { Storage.setCurrentUser(n); this.loadGradesMenu(); };
            d.querySelector('.btn-delete-profile').onclick = (e) => this.deleteProfile(e, n);
            c.appendChild(d);
        });
        UI.showScreen('screen-profiles');
    },

    async loadGradesMenu() {
        try {
            UI.updateHeader(`Joueur : ${Storage.getCurrentUser()}`);
            const r = await fetch('data/index.json'), d = await r.json();
            UI.renderMenu('grades-list', d.grades, g => this.loadGrade(g));
            UI.showScreen('screen-grades');
        } catch (e) { console.error(e); }
    },

    async loadGrade(g) {
        UI.updateHeader(`${g.title} - ${Storage.getCurrentUser()}`);
        const r = await fetch(g.dataFile), d = await r.json();
        this.state.currentGrade = d;
        UI.renderMenu('themes-list', d.themes, t => this.selectTheme(t));
        UI.showScreen('screen-themes');
    },

    selectTheme(t) {
        this.state.currentTheme = t;
        UI.renderMenu('levels-list', t.exercises, e => this.startExercise(e));
        UI.showScreen('screen-levels');
    },

    // --- LOGIQUE DE JEU ---
    startExercise(e) {
        this.state.currentExercise = e; this.state.currentQuestion = 0; this.state.score = 0;
        UI.showScreen('screen-game'); this.generateNextQuestion();
    },

    generateNextQuestion() {
        if (this.state.timer) clearTimeout(this.state.timer);
        this.state.currentQuestion++; this.state.userInput = ""; this.state.isUppercase = true; 
        
        const cfg = this.state.currentExercise.params;
        const pD = Engines.run(this.state.currentExercise.engine, cfg, this.state.frenchLib);
        
        this.state.problemData = pD; this.state.targetAnswer = pD.answer;
        
        // Initialisation correcte des indices sélectionnés pour le Carré Magique
        if (pD.visualType === 'square' && !pD.data.selectedIndices) {
            pD.data.selectedIndices = [];
        }

        UI.updateKeyboardLayout(pD.inputType || "numeric", pD.data);
        UI.updateGameDisplay(pD, "", (this.state.currentQuestion / cfg.questions) * 100);

        if (pD.visualType === 'bird') this.state.timer = setTimeout(() => this.handleInput("timeout"), (cfg.vitesse || 8) * 1000);
    },

    handleInput(val, target = null) {
        if (val === "timeout") return this.validateAnswer(false);
        if (val === 'shift') { this.state.isUppercase = !this.state.isUppercase; return UI.updateKeyboardLayout('alpha'); }

        const { inputType, visualType, data } = this.state.problemData;

        // --- CORRECTION CLIC CARRÉ MAGIQUE ---
        if (val === 'card-click' && target) {
            const idx = parseInt(target.getAttribute('data-idx'));
            if (!isNaN(idx)) {
                // Initialisation de sûreté
                if (!data.selectedIndices) data.selectedIndices = [];
                
                // Toggle (Ajout / Suppression)
                const pos = data.selectedIndices.indexOf(idx);
                if (pos > -1) data.selectedIndices.splice(pos, 1);
                else data.selectedIndices.push(idx);

                // Calcul de la somme
                const sum = data.selectedIndices.reduce((acc, i) => acc + data.numbers[i], 0);
                this.state.userInput = sum.toString();

                // Mise à jour visuelle immédiate
                UI.updateGameDisplay(this.state.problemData, this.state.userInput, (this.state.currentQuestion / this.state.currentExercise.params.questions) * 100);
            }
            return;
        }
        // -------------------------------------

        if (inputType === 'selection') {
            // Validation manuelle via le bouton OK du clavier
            if (val === 'ok') return this.validateAnswer();
        } 
        else if (inputType === "boolean" || inputType === "qcm") {
            this.state.userInput = val; return this.validateAnswer();
        } 
        else {
            if (val === 'backspace' || val === 'del') {
                this.state.userInput = this.state.userInput.slice(0, -1);
                if (inputType === 'alpha' && !this.state.userInput.length) { this.state.isUppercase = true; UI.updateKeyboardLayout('alpha'); }
            } else if (val === 'ok') {
                return this.validateAnswer();
            } else {
                const lim = (visualType === 'clock') ? 4 : this.state.targetAnswer.toString().length;
                if (this.state.userInput.length < Math.max(lim, 5)) {
                    this.state.userInput += val;
                    if (inputType === 'alpha' && this.state.userInput.length === 1) { this.state.isUppercase = false; UI.updateKeyboardLayout('alpha'); }
                }
            }
        }
        
        UI.updateGameDisplay(this.state.problemData, this.state.userInput, (this.state.currentQuestion / this.state.currentExercise.params.questions) * 100);
    },

    validateAnswer(hasAnswered = true) {
        if (this.state.timer) clearTimeout(this.state.timer);
        const { inputType, visualType } = this.state.problemData, d = document.getElementById('user-answer');
        let isC = false;

        // 1. Comparaison intelligente
        if (inputType === 'alpha' || inputType === 'qcm') {
            const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
            const u = inputType === 'alpha' ? norm(this.state.userInput) : this.state.userInput;
            const t = inputType === 'alpha' ? norm(this.state.targetAnswer.toString()) : this.state.targetAnswer.toString();
            isC = hasAnswered && (u === t);
        } else {
            isC = hasAnswered && (parseInt(this.state.userInput) === parseInt(this.state.targetAnswer));
        }

        if (isC) this.state.score++;
        
        // 2. Préparation réponse
        let v = isC ? this.state.userInput : this.state.targetAnswer;
        
        // 3. Style visuel réponse
        if (inputType === 'alpha' || inputType === 'qcm') {
            v = v.toString().toLowerCase(); 
            d.style.textTransform = "none"; 
            d.style.display = "flex"; 
        } else {
            d.style.textTransform = "uppercase"; 
        }

        // 4. Rendu HTML Réponse
        if (visualType === 'clock') {
            let s = v.toString().padStart(4, "0");
            d.innerHTML = `<div class="clock-digit-block">${s.slice(0, 2)}</div><span class="clock-separator">:</span><div class="clock-digit-block">${s.slice(2, 4)}</div>`;
        } else {
            d.innerText = v;
        }

        // 5. Feedback
        d.style.color = isC ? 'var(--success)' : 'var(--secondary)';
        setTimeout(() => {
            d.style.color = 'var(--primary)';
            this.state.currentQuestion < this.state.currentExercise.params.questions ? this.generateNextQuestion() : this.showFinalResults();
        }, isC ? 1000 : 2500);
    },

    showFinalResults() {
        const { score, currentExercise, currentGrade } = this.state, tot = currentExercise.params.questions, pct = (score / tot) * 100;
        Storage.saveRecord(currentGrade.gradeId, currentExercise.id, score, tot);
        document.getElementById('result-score').innerText = `Score : ${score} / ${tot}`;
        UI.renderStars(score, tot);
        const t = document.getElementById('result-title');
        t.innerText = pct === 100 ? "Incroyable ! 🌟" : pct >= 75 ? "Excellent ! 👍" : pct >= 50 ? "Bien joué !" : "Réessaie encore ! 💪";
        t.style.color = pct >= 75 ? "var(--success)" : pct >= 50 ? "var(--primary)" : "var(--secondary)";
        UI.showScreen('screen-results');
    }
};

window.App = App;
window.onload = () => App.init();
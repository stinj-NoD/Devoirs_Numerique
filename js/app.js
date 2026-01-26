/**
 * APP.js - Le Cerveau de l'Application
 * Coordination entre Engines, UI et Storage.
 */
const App = {
    state: {
        currentGrade: null, currentTheme: null, currentExercise: null,
        currentQuestion: 0, score: 0, userInput: "", 
        targetAnswer: null, problemData: null, timer: null,
        isUppercase: true, frenchLib: null 
    },

    async init() {
        // Chargement optionnel de la lib français
        try {
            const res = await fetch('data/french_lib.json');
            if(res.ok) this.state.frenchLib = await res.json();
        } catch (e) { console.warn("Bibliothèque français non chargée (optionnel)"); }

        // --- CORRECTION 1 : Gestionnaire Clavier compatible avec ui.js ---
        // On écoute le clavier global défini dans le HTML
        const kb = document.getElementById('keyboard-num');
        if (kb) {
            kb.addEventListener('click', (e) => {
                if (e.target.classList.contains('key')) {
                    this.handleInput(e.target.getAttribute('data-val'), e.target);
                }
            });
        }
        
        // Gestion des clics sur la zone de jeu (pour les cibles/bulles)
        const pz = document.getElementById('math-problem');
        if (pz) pz.onclick = (e) => { 
            const k = e.target.closest('.key'); 
            if (k) this.handleInput(k.getAttribute('data-val'), k); 
        };
        
        document.getElementById('btn-results-menu').onclick = () => UI.showScreen('screen-themes');
        
        const profs = Storage.getProfiles();
        profs.length ? this.renderProfilesScreen() : UI.showScreen('screen-profiles');
    },

    // --- NAVIGATION & PROFILS ---
    createProfile() {
        const el = document.getElementById('new-profile-name'), n = el.value.trim();
        if (n) { Storage.addProfile(n); el.value = ""; this.renderProfilesScreen(); }
    },

    renderProfilesScreen() {
        const c = document.getElementById('profiles-list'); if (!c) return;
        c.innerHTML = "";
        Storage.getProfiles().forEach(n => {
            const d = document.createElement('div'); d.className = 'card profile-card';
            d.innerHTML = `<span class="card-icon">👤</span><span class="card-title">${n}</span><button class="btn-delete-profile">×</button>`;
            d.onclick = () => { Storage.setCurrentUser(n); this.loadGradesMenu(); };
            d.querySelector('.btn-delete-profile').onclick = (e) => {
                e.stopPropagation();
                if (confirm(`Supprimer ${n} ?`)) { Storage.removeProfile(n); this.renderProfilesScreen(); }
            };
            c.appendChild(d);
        });
        UI.showScreen('screen-profiles');
    },

    async loadGradesMenu() {
        UI.updateHeader(`Joueur : ${Storage.getCurrentUser()}`);
        try {
            const r = await fetch('data/index.json');
            const d = await r.json();
            UI.renderMenu('grades-list', d.grades, g => this.loadGrade(g));
            UI.showScreen('screen-grades');
        } catch (e) { alert("Erreur chargement index.json"); }
    },

    async loadGrade(g) {
        UI.updateHeader(`${g.title} - ${Storage.getCurrentUser()}`);
        try {
            // --- CORRECTION 2 : Utilisation de g.file au lieu de g.dataFile ---
            const r = await fetch(g.file); 
            const d = await r.json();
            this.state.currentGrade = d;
            UI.renderMenu('themes-list', d.themes, t => this.selectTheme(t));
            UI.showScreen('screen-themes');
        } catch (e) { console.error(e); alert("Erreur chargement classe"); }
    },

    selectTheme(t) {
        this.state.currentTheme = t;
        UI.renderMenu('levels-list', t.exercises, e => this.startExercise(e));
        UI.showScreen('screen-levels'); // Assure-toi que cette section existe dans HTML ou utilise screen-exercises
    },

    // --- LOGIQUE DE JEU ---
    startExercise(e) {
        this.state.currentExercise = e; 
        this.state.currentQuestion = 0; 
        this.state.score = 0;
        UI.showScreen('screen-game'); 
        this.generateNextQuestion();
    },

    generateNextQuestion() {
        if (this.state.timer) clearTimeout(this.state.timer);
        this.state.currentQuestion++; 
        this.state.userInput = ""; 
        this.state.isUppercase = true; 
        
        const cfg = this.state.currentExercise.params;
        const pD = Engines.run(this.state.currentExercise.engine, cfg, this.state.frenchLib);
        
        this.state.problemData = pD; 
        this.state.targetAnswer = pD.answer;
        
        // --- CORRECTION 3 : Mapping vers les fonctions UI.js existantes ---
        const type = pD.inputType || "numeric";
        if (type === 'alpha') UI.renderAlphaKeyboard ? UI.renderAlphaKeyboard() : null; 
        else if (type === 'bool' || type === 'qcm') UI.renderQCM(['VRAI', 'FAUX']);
        else if (type === 'choice' && pD.choices) UI.renderQCM(pD.choices);
        else UI.restoreNumericKeyboard(); // Par défaut

        UI.updateGameDisplay(pD, "", (this.state.currentQuestion / cfg.questions) * 100);

        if (pD.visualType === 'bird') {
            this.state.timer = setTimeout(() => this.handleInput("timeout"), (cfg.vitesse || 8) * 1000);
        }
    },

    handleInput(val, target = null) {
        if (val === "timeout") return this.validateAnswer(false);
        
        // Gestion Majuscule (si supporté par UI)
        if (val === 'shift') { 
            this.state.isUppercase = !this.state.isUppercase; 
            // Note: UI.js doit savoir gérer le redraw si on veut voir le changement visuel
            return; 
        }

        const { inputType, data } = this.state.problemData;

        // Gestion QCM / Booléen
        if (inputType === "bool" || inputType === "qcm" || inputType === "choice") {
            this.state.userInput = val; 
            return this.validateAnswer();
        } 
        // Gestion Clavier (Alpha et Numérique)
        else {
            if (val === 'backspace' || val === 'del') {
                this.state.userInput = this.state.userInput.slice(0, -1);
            } else if (val === 'ok') {
                if (this.state.userInput.length > 0) this.validateAnswer();
            } else {
                const lim = 15;
                if (this.state.userInput.length < lim) {
                    this.state.userInput += val;
                }
            }
        }
        
        // Mise à jour de l'affichage (Input)
        UI.updateInputDisplay ? UI.updateInputDisplay(this.state.userInput, inputType) : null;
    },

    validateAnswer(hasAnswered = true) {
        if (this.state.timer) clearTimeout(this.state.timer);
        
        const { inputType, visualType } = this.state.problemData;
        let isC = false;

        // Comparaison
        const norm = s => s ? s.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim() : "";
        
        if (inputType === 'alpha' || inputType === 'choice' || inputType === 'bool') {
            isC = hasAnswered && (norm(this.state.userInput) === norm(this.state.targetAnswer));
        } else {
            // Comparaison numérique souple
            isC = hasAnswered && (parseFloat(this.state.userInput) === parseFloat(this.state.targetAnswer));
        }

        if (isC) this.state.score++;
        
        // Feedback via UI.js
        UI.feedback(isC, this.state.targetAnswer);

        // Suite
        setTimeout(() => {
            // Nettoyage input
            UI.updateInputDisplay ? UI.updateInputDisplay("", inputType) : null;
            
            const total = this.state.currentExercise.params.questions || 10;
            if (this.state.currentQuestion < total) {
                this.generateNextQuestion();
            } else {
                this.showFinalResults();
            }
        }, isC ? 1000 : 2500);
    },

    showFinalResults() {
        const { score, currentExercise, currentGrade } = this.state;
        const total = currentExercise.params.questions || 10;
        
        Storage.saveRecord(currentGrade.id, currentExercise.id, score, total); // Correction: gradeId -> id
        
        document.getElementById('result-score').innerText = `Score : ${score} / ${total}`;
        UI.renderStars(score, total);
        UI.showScreen('screen-results');
    }
};

window.App = App;
window.onload = () => App.init();

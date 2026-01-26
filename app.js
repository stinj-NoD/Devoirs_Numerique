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
        try {
            const res = await fetch('data/french_lib.json');
            this.state.frenchLib = await res.json();
        } catch (e) { console.error("Erreur bibliothèque :", e); }

        UI.initKeyboard((v, t) => this.handleInput(v, t));
        
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
        const r = await fetch('data/index.json'), d = await r.json();
        UI.renderMenu('grades-list', d.grades, g => this.loadGrade(g));
        UI.showScreen('screen-grades');
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
        UI.updateKeyboardLayout(pD.inputType || "numeric", pD.data);
        UI.updateGameDisplay(pD, "", (this.state.currentQuestion / cfg.questions) * 100);

        if (pD.visualType === 'bird') {
            this.state.timer = setTimeout(() => this.handleInput("timeout"), (cfg.vitesse || 8) * 1000);
        }
    },

    handleInput(val, target = null) {
        if (val === "timeout") return this.validateAnswer(false);
        if (val === 'shift') { 
            this.state.isUppercase = !this.state.isUppercase; 
            return UI.updateKeyboardLayout('alpha'); 
        }

        const { inputType, data } = this.state.problemData;

        // Gestion Entrées Spéciales (Sélection de bulles / QCM / Boolean)
        if (inputType === 'selection') {
            if (val === 'ok') return this.validateAnswer();
            const idx = parseInt(target?.getAttribute('data-idx')), sel = data.selectedIndices;
            if (!isNaN(idx)) {
                const p = sel.indexOf(idx); p > -1 ? sel.splice(p, 1) : sel.push(idx);
                this.state.userInput = sel.reduce((a, i) => a + data.numbers[i], 0).toString();
            }
        } else if (inputType === "boolean" || inputType === "qcm") {
            this.state.userInput = val; return this.validateAnswer();
        } 
        // Gestion Clavier (Alpha et Numérique)
        else {
            if (val === 'backspace' || val === 'del') {
                this.state.userInput = this.state.userInput.slice(0, -1);
                if (inputType === 'alpha' && !this.state.userInput.length) { 
                    this.state.isUppercase = true; UI.updateKeyboardLayout('alpha'); 
                }
            } else if (val === 'ok') {
                if (this.state.userInput.length > 0) this.validateAnswer();
            } else {
                const lim = 15; // Sécurité longueur max
                if (this.state.userInput.length < lim) {
                    this.state.userInput += val;
                    // Auto-minuscule après la première lettre en mode alpha
                    if (inputType === 'alpha' && this.state.userInput.length === 1) { 
                        this.state.isUppercase = false; UI.updateKeyboardLayout('alpha'); 
                    }
                }
            }
        }
        UI.updateGameDisplay(this.state.problemData, this.state.userInput, (this.state.currentQuestion / this.state.currentExercise.params.questions) * 100);
    },

    validateAnswer(hasAnswered = true) {
        if (this.state.timer) clearTimeout(this.state.timer);
        const { inputType, visualType } = this.state.problemData, d = document.getElementById('user-answer');
        let isC = false;

        // 1. Comparaison normalisée (Accents et Casse)
        const norm = s => s ? s.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim() : "";
        
        if (inputType === 'alpha' || inputType === 'qcm') {
            isC = hasAnswered && (norm(this.state.userInput) === norm(this.state.targetAnswer));
        } else {
            isC = hasAnswered && (parseInt(this.state.userInput) === parseInt(this.state.targetAnswer));
        }

        if (isC) this.state.score++;
        
        // 2. Feedback Visuel
        let v = isC ? this.state.userInput : this.state.targetAnswer;
        d.style.color = isC ? 'var(--success)' : 'var(--secondary)';
        
        if (visualType === 'clock') {
            let s = v.toString().padStart(4, "0");
            d.innerHTML = `<div class="clock-digit-block">${s.slice(0, 2)}</div><span class="clock-separator">:</span><div class="clock-digit-block">${s.slice(2, 4)}</div>`;
        } else {
            d.innerText = v;
            // Pour le français, on retire le forçage majuscule si c'est une correction
            d.style.textTransform = (inputType === 'alpha') ? "none" : "uppercase";
        }

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
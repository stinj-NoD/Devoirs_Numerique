/*
 * Devoir Numérique - App.js
 * Copyright (C) 2026 [Stinj-NoD]
 * Version : 3.0 (Production-Ready)
 */

const App = {
    state: {
        currentGrade: null, 
        currentTheme: null, 
        currentExercise: null,
        currentQuestion: 0, 
        score: 0, 
        userInput: "", 
        targetAnswer: null, 
        problemData: null, 
        timer: null,
        frenchLib: null 
    },

    async init() {
        console.log("🛠️ Initialisation App V3...");

        // 1. Chargement Résilient de la Bibliothèque
        try {
            const res = await fetch('data/french_lib.json');
            if (res.ok) {
                this.state.frenchLib = await res.json();
                console.log("✅ Bibliothèque chargée.");
            } else {
                throw new Error("Fichier introuvable");
            }
        } catch (e) { 
            console.warn("⚠️ Mode Offline restreint (Lib absente)."); 
            // On ne bloque pas l'app, le moteur utilisera ses fallbacks
        }

        // 2. Initialisation UI sécurisée
        if (UI && UI.initNavigation) UI.initNavigation();
        if (UI && UI.initKeyboard) UI.initKeyboard((val, target) => this.handleInput(val, target));

        // 3. Bindings globaux
        this.bindEvents();

        // 4. Démarrage
        this.renderProfilesScreen();
        console.log("🚀 Application Prête.");
    },

    bindEvents() {
        const get = (id) => document.getElementById(id);

        // Profils
        const btnAdd = get('btn-add-profile');
        const inputName = get('new-profile-name');
        if (btnAdd) btnAdd.onclick = () => this.createProfile();
        if (inputName) inputName.onkeypress = (e) => { if (e.key === 'Enter') this.createProfile(); };

        // Délégation d'événements pour la zone de jeu (Performance & Sécurité)
        const gameZone = get('math-problem');
        if (gameZone) {
            gameZone.onclick = (e) => {
                const target = e.target.closest('[data-val]');
                if (target) this.handleInput(target.getAttribute('data-val'), target);
            };
        }

        // Navigation retour
        const btnRes = get('btn-results-menu');
        if (btnRes) btnRes.onclick = () => UI.showScreen('screen-themes');
    },

    // --- GESTION DES PROFILS ---

    createProfile() {
        const el = document.getElementById('new-profile-name');
        const name = el?.value.trim().slice(0, 15); // Limite 15 chars
        
        if (name) {
            Storage.addProfile(name);
            el.value = "";
            this.renderProfilesScreen();
        } else {
            alert("Merci d'entrer un prénom valide.");
        }
    },

    renderProfilesScreen() {
        const names = Storage.getProfiles();
        // Transformation sécurisée
        const profiles = (names || []).map(n => ({ id: n, name: n, avatar: '👤' }));

        UI.renderProfiles(
            profiles, 
            (p) => { // OnSelect
                Storage.setCurrentUser(p.name);
                this.loadGradesMenu();
            },
            (id) => { // OnDelete
                Storage.removeProfile(id);
                this.renderProfilesScreen();
            }
        );
        UI.showScreen('screen-profiles');
    },

    // --- CHARGEMENT DES DONNÉES ---

    async loadGradesMenu() {
        try {
            const user = Storage.getCurrentUser() || "Invité";
            UI.updateHeader(`Joueur : ${user}`);
            
            const r = await fetch('data/index.json');
            if (!r.ok) throw new Error("Erreur réseau index.json");
            
            const d = await r.json();
            UI.renderMenu('grades-list', d.grades, (g) => this.loadGrade(g));
            UI.showScreen('screen-grades');
        } catch (e) { 
            console.error(e);
            alert("Impossible de charger les niveaux. Vérifiez votre connexion ou les fichiers.");
        }
    },

    async loadGrade(g) {
        try {
            UI.updateHeader(`${g.title}`);
            const r = await fetch(g.dataFile);
            if (!r.ok) throw new Error(`Erreur réseau ${g.dataFile}`);
            
            const d = await r.json();
            this.state.currentGrade = d; // Stockage grade complet pour sauvegarde score
            // On injecte l'ID du grade pour le storage plus tard
            this.state.currentGrade.gradeId = g.id || d.id || "unknown_grade";
            
            UI.renderMenu('themes-list', d.themes, (t) => this.selectTheme(t));
            UI.showScreen('screen-themes');
        } catch (e) { console.error(e); }
    },

    selectTheme(t) {
        this.state.currentTheme = t;
        UI.renderMenu('levels-list', t.exercises, (e) => this.startExercise(e));
        UI.showScreen('screen-levels');
    },

    // --- LOGIQUE DE JEU ---

    startExercise(e) {
        // Reset propre de l'état
        this.state.currentExercise = e; 
        this.state.currentQuestion = 0; 
        this.state.score = 0;
        this.state.userInput = "";
        
        UI.showScreen('screen-game'); 
        this.generateNextQuestion();
    },

    generateNextQuestion() {
        if (this.state.timer) clearTimeout(this.state.timer);
        
        this.state.currentQuestion++; 
        this.state.userInput = ""; 
        
        // Exécution sécurisée du moteur
        const cfg = this.state.currentExercise.params || {};
        const problem = Engines.run(this.state.currentExercise.engine, cfg, this.state.frenchLib);
        
        this.state.problemData = problem; 
        // Important : Engines V3 renvoie toujours une string pour answer
        this.state.targetAnswer = problem.answer;
        
        // Initialisation spécifique Carré Magique (sécurité UI)
        if (problem.visualType === 'square' && problem.data) {
            problem.data.selectedIndices = [];
        }

        UI.updateKeyboardLayout(problem.inputType || "numeric", problem);
        this.refreshUI();

        // Gestion Timer (Oiseau)
        if (problem.visualType === 'bird') {
            const duration = (cfg.vitesse || 8) * 1000;
            this.state.timer = setTimeout(() => this.handleInput("timeout"), duration);
        }
    },

    handleInput(val, target = null) {
        const p = this.state.problemData;
        if (!p) return; // Protection contre input fantôme

        if (val === "timeout") return this.validateAnswer(false);

        // --- CAS SPÉCIAL : Carré Magique (Click sur cartes) ---
        if (val === 'card-click' && target) {
            const idx = parseInt(target.getAttribute('data-idx'));
            if (isNaN(idx) || !p.data) return;

            const d = p.data;
            if (!d.selectedIndices) d.selectedIndices = [];

            // Toggle sélection
            const pos = d.selectedIndices.indexOf(idx);
            if (pos > -1) d.selectedIndices.splice(pos, 1);
            else d.selectedIndices.push(idx);

            // Recalcul somme (Sécurisé Number)
            const sum = d.selectedIndices.reduce((acc, i) => acc + (Number(d.numbers[i]) || 0), 0);
            this.state.userInput = sum.toString();
            
            this.refreshUI();
            return; 
        }

        // --- GESTION CLAVIER ---
        if (val === 'ok') {
            // On autorise la validation vide pour le carré magique seulement
            if (this.state.userInput.length > 0 || p.visualType === 'square') {
                return this.validateAnswer();
            }
            return;
        } 
        
        if (val === 'backspace' || val === 'del') {
            this.state.userInput = this.state.userInput.slice(0, -1);
        } else {
            // Validation directe pour QCM/Boolean
            if (p.inputType === 'qcm' || p.inputType === 'boolean') {
                this.state.userInput = val;
                return this.validateAnswer();
            }
            
            // Limites de saisie (UX)
            let limit = 10;
            if (p.visualType === 'clock') limit = 4;
            if (p.inputType === 'alpha') limit = 20;

            if (this.state.userInput.length < limit) {
                this.state.userInput += val;
            }
        }

        this.refreshUI();
    },

    refreshUI() {
        const total = this.state.currentExercise.params.questions || 10;
        const prog = (this.state.currentQuestion / total) * 100;
        UI.updateGameDisplay(this.state.problemData, this.state.userInput, prog);
    },

    validateAnswer(hasAnswered = true) {
        if (this.state.timer) clearTimeout(this.state.timer);
        
        const { userInput, targetAnswer, currentExercise, problemData } = this.state;
        const ansZone = document.getElementById('user-answer');
        
        // 1. COMPARAISON STRICTE (Strings nettoyées)
        const clean = s => (s || "").toString().toLowerCase().trim();
        let isCorrect = false;

        if (hasAnswered) {
            // Engines V3 renvoie toujours des strings ("0915"), donc comparaison simple
            isCorrect = clean(userInput) === clean(targetAnswer);
        }

        if (isCorrect) this.state.score++;
        
        // 2. FEEDBACK VISUEL
        if (ansZone) {
            // On force l'affichage même si masqué par UI (ex: dictée)
            ansZone.style.display = 'flex';
            ansZone.style.color = isCorrect ? 'var(--success)' : 'var(--secondary)';
            
            // Animation "Shake" si faux (optionnel, nécessite CSS)
            if (!isCorrect) {
                ansZone.classList.add('shake');
                setTimeout(() => ansZone.classList.remove('shake'), 400);
            }

            if (problemData.visualType === 'clock') {
                // Feedback formaté pour l'horloge
                const val = (isCorrect ? userInput : targetAnswer).toString().padStart(4, '0');
                ansZone.innerHTML = `
                    <div class="clock-digit-block">${val.slice(0, 2)}</div>
                    <span class="clock-separator">:</span>
                    <div class="clock-digit-block">${val.slice(2, 4)}</div>`;
            } else {
                ansZone.textContent = isCorrect ? userInput : targetAnswer;
            }
        }

        // 3. SUITE DU JEU
        const delay = isCorrect ? 800 : 2500; // Plus long si erreur
        
        setTimeout(() => {
            if (ansZone) {
                ansZone.style.color = 'var(--primary)';
                // On laisse UI.updateGameDisplay décider de masquer ou non au prochain tour
            }

            if (this.state.currentQuestion < currentExercise.params.questions) {
                this.generateNextQuestion();
            } else {
                this.showFinalResults();
            }
        }, delay);
    },

    showFinalResults() {
        const { score, currentGrade, currentExercise } = this.state;
        const total = currentExercise.params.questions;
        
        // Sauvegarde sécurisée
        if (currentGrade && currentGrade.gradeId) {
            Storage.saveRecord(currentGrade.gradeId, currentExercise.id, score, total);
        }
        
        UI.renderStars(score, total);
        UI.showScreen('screen-results');

        // Confettis si 100%
        if (score === total) {
            UI.launchCelebration();
        }

        const scEl = document.getElementById('result-score');
        if (scEl) scEl.innerText = `Score : ${score} / ${total}`;
    }
};

// Exposition globale & Démarrage
window.App = App;
window.onload = () => App.init();
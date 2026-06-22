/*
 * Devoir Numérique - App.js
 * Version : 3.1 (Secured & Optimized)
 */

const App = {
    state: {
        currentGrade: null, 
        currentBrowseMode: null,
        currentSubject: null,
        currentTheme: null, 
        currentLesson: null,
        currentLessonOrigin: null,
        currentExercise: null,
        currentQuestion: 0, 
        score: 0, 
        userInput: "", 
        targetAnswer: null, 
        problemData: null, 
        timer: null,
        frenchLib: null,
        currentExerciseData: null,
        speechStatus: 'idle',
        isValidating: false, // VERROU ANTI-DOUBLE CLIC
        championMode: null // { duration, pool, dataCache, endAt, intervalId }
    },
    _initialized: false,

    async init() {
        if (this._initialized) return;
        this._initialized = true;
        console.log("Initialisation de l'application...");

        this.applyPreferences();

        // 1. Chargement résilient de la bibliothèque
        try {
            const lib = await this.loadFrenchLibrary();
            const check = window.Validators?.validateFrenchLibrary(lib);
            if (check && !check.valid) throw new Error(check.reason);
            this.state.frenchLib = lib;
            console.log("Bibliothèque chargée.");
        } catch (e) { 
            console.warn("Mode offline restreint : bibliothèque absente.", e);
        }

        // 2. Initialisation UI sécurisée
        try {
            if (UI && UI.initNavigation) UI.initNavigation();
        } catch (e) {
            console.error("Init navigation UI impossible", e);
        }

        try {
            if (UI && UI.initKeyboard) UI.initKeyboard((val, target) => this.handleInput(val, target));
        } catch (e) {
            console.error("Init clavier UI impossible", e);
        }

        // 3. Bindings globaux
        try {
            this.bindEvents();
        } catch (e) {
            console.error("Bindings globaux impossibles", e);
        }

        // 4. Démarrage
        if (!Storage.getPreference('onboarding_seen')) {
            this.showOnboarding();
        } else {
            this.renderProfilesScreen();
        }
        console.log("Application prête.");
    },

    showOnboarding() {
        UI.showScreen('screen-onboarding');
        UI.updateHeader("Devoir Numérique");
    },

    finishOnboarding() {
        Storage.setPreference('onboarding_seen', true);
        this.renderProfilesScreen();
    },

    bindEvents() {
        const get = (id) => document.getElementById(id);

        // Onboarding
        const btnOnboarding = get('btn-onboarding-start');
        if (btnOnboarding) {
            btnOnboarding.onclick = () => this.finishOnboarding();
        }

        // Profils
        const btnAdd = get('btn-add-profile');
        const inputName = get('new-profile-name');
        if (btnAdd && btnAdd.dataset.inlineProfile !== '1') {
            btnAdd.onclick = async () => this.createProfile();
        }
        if (inputName) {
            if (inputName.dataset.inlineProfile !== '1') {
                inputName.onkeydown = async (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        await this.createProfile();
                    }
                };
            }
        }

        // Délégation d'événements pour la zone de jeu
        const gameZone = get('math-problem');
        if (gameZone) {
            gameZone.onclick = (e) => {
                const target = e.target.closest('[data-val]');
                if (target) this.handleInput(target.getAttribute('data-val'), target);
            };
            gameZone.onkeydown = (e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                const target = e.target.closest('[data-val]');
                if (!target) return;
                e.preventDefault();
                this.handleInput(target.getAttribute('data-val'), target);
            };
        }

        // Navigation retour
        const btnRes = get('btn-results-menu');
        if (btnRes) btnRes.onclick = () => this.returnToThemes();
        const btnLesson = get('btn-results-lesson');
        if (btnLesson) btnLesson.onclick = () => this.reviewThemeLessons();

        // Mode Champions
        const btnChampionRetry = get('btn-champion-retry');
        if (btnChampionRetry) btnChampionRetry.onclick = () => this.showChampionSetup();
        const btnChampionMenu = get('btn-champion-menu');
        if (btnChampionMenu) btnChampionMenu.onclick = () => UI.showScreen('screen-mode');
    },

    async loadFrenchLibrary() {
        const sectionFiles = {
            spelling: ['data/french/spelling.json', './data/french/spelling.json'],
            conjugation: ['data/french/conjugation.json', './data/french/conjugation.json'],
            homophones: ['data/french/homophones.json', './data/french/homophones.json'],
            grammar: ['data/french/grammar.json', './data/french/grammar.json'],
            reading: ['data/french/reading.json', './data/french/reading.json']
        };

        const [spelling, conjugation, homophones, grammar, reading] = await Promise.all([
            this.fetchJson(sectionFiles.spelling),
            this.fetchJson(sectionFiles.conjugation),
            this.fetchJson(sectionFiles.homophones),
            this.fetchJson(sectionFiles.grammar),
            this.fetchJson(sectionFiles.reading)
        ]);

        return { spelling, conjugation, homophones, grammar, reading };
    },

    async fetchJson(paths) {
        const list = Array.isArray(paths) ? paths : [paths];
        let lastError = null;
        const useBundledFirst = window.location.protocol === 'file:';

        for (const path of list) {
            const readBundled = () => {
                const normalizedPath = (path || "").toString().replace(/\\/g, '/').replace(/^\.\//, '');
                const bundleKeys = [path, normalizedPath, `./${normalizedPath}`];

                for (const key of bundleKeys) {
                    const bundled = window.DataBundle?.[key];
                    if (!bundled) continue;

                    const binary = window.atob(bundled);
                    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
                    const jsonText = new TextDecoder('utf-8').decode(bytes).replace(/^\uFEFF/, '');
                    return JSON.parse(jsonText);
                }

                return null;
            };

            if (useBundledFirst) {
                const bundledData = readBundled();
                if (bundledData) return bundledData;
            }

            try {
                const response = await fetch(path);
                if (!response.ok) throw new Error(`Erreur réseau ${path}`);
                const jsonText = (await response.text()).replace(/^\uFEFF/, '');
                return JSON.parse(jsonText);
            } catch (error) {
                lastError = error;
                if (!useBundledFirst) {
                    try {
                        const bundledData = readBundled();
                        if (bundledData) return bundledData;
                    } catch (bundleError) {
                        lastError = bundleError;
                    }
                }
            }
        }

        if (window.location.protocol === 'file:') {
            throw new Error("Chargement impossible en mode fichier local sans données embarquées.");
        }

        throw lastError || new Error("Chargement JSON impossible");
    },

    async fetchText(paths) {
        const list = Array.isArray(paths) ? paths : [paths];
        let lastError = null;
        const useBundledFirst = window.location.protocol === 'file:';

        for (const path of list) {
            const readBundled = () => {
                const normalizedPath = (path || "").toString().replace(/\\/g, '/').replace(/^\.\//, '');
                const bundleKeys = [path, normalizedPath, `./${normalizedPath}`];

                for (const key of bundleKeys) {
                    const bundled = window.DataBundle?.[key];
                    if (!bundled) continue;

                    const binary = window.atob(bundled);
                    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
                    return new TextDecoder('utf-8').decode(bytes).replace(/^﻿/, '');
                }

                return null;
            };

            if (useBundledFirst) {
                const bundledText = readBundled();
                if (bundledText) return bundledText;
            }

            try {
                const response = await fetch(path);
                if (!response.ok) throw new Error(`Erreur réseau ${path}`);
                return (await response.text()).replace(/^﻿/, '');
            } catch (error) {
                lastError = error;
                if (!useBundledFirst) {
                    try {
                        const bundledText = readBundled();
                        if (bundledText) return bundledText;
                    } catch (bundleError) {
                        lastError = bundleError;
                    }
                }
            }
        }

        if (window.location.protocol === 'file:') {
            throw new Error("Chargement impossible en mode fichier local sans données embarquées.");
        }

        throw lastError || new Error("Chargement texte impossible");
    },

    stopCurrentExercise() {
        if (this.state.timer) {
            clearTimeout(this.state.timer);
            this.state.timer = null;
        }
        if (this.state.championMode?.intervalId) {
            clearInterval(this.state.championMode.intervalId);
        }
        this.state.championMode = null;
        const hud = document.getElementById('champion-hud');
        if (hud) hud.classList.add('is-hidden');
        const progressContainer = document.querySelector('#screen-game .progress-container');
        if (progressContainer) progressContainer.classList.remove('is-hidden');
        this.stopSpeech();
        this.state.speechStatus = 'idle';
        this.state.isValidating = false;
    },

    supportsSpeechSynthesis() {
        return typeof window !== 'undefined'
            && 'speechSynthesis' in window
            && typeof window.SpeechSynthesisUtterance !== 'undefined';
    },

    stopSpeech() {
        if (!this.supportsSpeechSynthesis()) return;
        try {
            window.speechSynthesis.cancel();
        } catch (error) {
            console.warn("Arrêt audio impossible", error);
        }
    },

    setAudioSpellingStatus(status) {
        this.state.speechStatus = status;
        const problem = this.state.problemData;
        if (problem?.visualType === 'audioSpelling' && problem.data) {
            problem.data.audioStatus = status;
            problem.data.audioSupported = this.supportsSpeechSynthesis();
            this.refreshUI();
        }
    },

    getFrenchVoice() {
        if (!this.supportsSpeechSynthesis()) return null;
        const voices = window.speechSynthesis.getVoices?.() || [];
        const frenchVoices = voices.filter((voice) =>
            /^fr(-|_)/i.test(voice.lang || '') || /french|fran[çc]ais/i.test(voice.name || '')
        );
        if (!frenchVoices.length) return null;

        const preferredNames = [
            /hortense/i,
            /denise/i,
            /amelie/i,
            /audrey/i,
            /brigitte/i,
            /thomas/i,
            /paul/i
        ];

        const ranked = [...frenchVoices].sort((a, b) => {
            const score = (voice) => {
                let value = 0;
                if ((voice.lang || '').toLowerCase() === 'fr-fr') value += 5;
                if (voice.localService) value += 3;
                const name = voice.name || '';
                const preferredIndex = preferredNames.findIndex((pattern) => pattern.test(name));
                if (preferredIndex !== -1) value += (preferredNames.length - preferredIndex);
                return value;
            };
            return score(b) - score(a);
        });

        return ranked[0] || null;
    },

    replayAudioSpelling() {
        const problem = this.state.problemData;
        if (!problem || problem.visualType !== 'audioSpelling') return false;
        if (!this.supportsSpeechSynthesis()) {
            this.setAudioSpellingStatus('unsupported');
            return false;
        }

        const text = (problem.data?.audioText || this.state.targetAnswer || "").toString().trim();
        if (!text) return false;

        this.stopSpeech();
        this.setAudioSpellingStatus('playing');
        const baseRate = Number.isFinite(Number(problem.data?.speechRate)) ? Number(problem.data.speechRate) : 0.72;
        const multiplier = Storage.getSpeechRateMultiplier();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = Math.min(2, Math.max(0.4, baseRate * multiplier));
        utterance.pitch = Number.isFinite(Number(problem.data?.speechPitch)) ? Number(problem.data.speechPitch) : 1.15;
        utterance.volume = Number.isFinite(Number(problem.data?.speechVolume)) ? Number(problem.data.speechVolume) : 0.9;
        const voice = this.getFrenchVoice();
        if (voice) utterance.voice = voice;
        utterance.onend = () => this.setAudioSpellingStatus('ready');
        utterance.onerror = () => this.setAudioSpellingStatus('error');

        try {
            window.speechSynthesis.speak(utterance);
            return true;
        } catch (error) {
            console.warn("Lecture audio impossible", error);
            this.setAudioSpellingStatus('error');
            return false;
        }
    },

    setSpeechRateLevel(level) {
        Storage.setSpeechRateLevel(level);
        const problem = this.state.problemData;
        if (problem?.visualType === 'audioSpelling') {
            this.refreshUI();
            this.replayAudioSpelling();
        }
    },

    getQuestionTarget(exercise = this.state.currentExercise) {
        const count = Number(exercise?.params?.questions);
        return Number.isInteger(count) && count > 0 ? count : 0;
    },

    hasRunnableExercise(exercise = this.state.currentExercise) {
        return !!exercise
            && typeof exercise.engine === 'string'
            && !!exercise.params
            && this.getQuestionTarget(exercise) > 0;
    },

    failSafeExit(message) {
        this.stopCurrentExercise();
        this.state.problemData = null;
        this.state.targetAnswer = null;
        this.state.userInput = "";
        if (message) alert(message);
        this.goBack();
    },

    inferSubjectKey() {
        const normalize = (value) => (value || "")
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        const currentTheme = this.state.currentTheme || {};
        const currentExercise = this.state.currentExercise || {};
        const currentData = this.state.currentExerciseData || {};
        const haystack = [
            currentData.subjectId,
            currentData.title,
            currentTheme.id,
            currentTheme.title,
            currentExercise.id,
            currentExercise.title
        ].map(normalize).join(' ');

        if (/(history|histoire|chrono|frise)/.test(haystack)) return 'history';
        if (/(geography|geographie|geo\b)/.test(haystack)) return 'geography';
        if (/(science|sciences)/.test(haystack)) return 'science';
        if (/\bemc\b/.test(haystack)) return 'emc';
        if (/(francais|francais|orthographe|grammaire|conjug|dictee|dictee|lecture|homophone|genre)/.test(haystack)) return 'french';
        if (/(math|maths|mathematiques|addition|soustraction|multiplication|division|fraction|mesure|conversion|monnaie|nombres|calcul|logique)/.test(haystack)) return 'math';
        return 'general';
    },

    applyVisualContext() {
        const appShell = document.getElementById('app');
        if (!appShell) return;

        const subject = this.inferSubjectKey();
        appShell.dataset.subject = subject;

        const currentUser = Storage.getCurrentUser();
        if (currentUser) {
            const appearance = Storage.getProfileAppearance(currentUser);
            const accent = Storage.getAccentChoices().find((entry) => entry.id === appearance.accent);
            if (accent) appShell.style.setProperty('--profile-accent', accent.color);
        }
    },

    applyPreferences() {
        const appShell = document.getElementById('app');
        if (!appShell) return;
        appShell.classList.toggle('theme-dark', Storage.getPreference('dark_mode'));
        appShell.classList.toggle('reduced-motion', Storage.getPreference('reduced_motion'));
    },

    toggleDarkMode() {
        Storage.setPreference('dark_mode', !Storage.getPreference('dark_mode'));
        this.applyPreferences();
    },

    toggleReducedMotion() {
        Storage.setPreference('reduced_motion', !Storage.getPreference('reduced_motion'));
        this.applyPreferences();
    },

    toggleSoundMuted() {
        Storage.setPreference('sound_muted', !Storage.getPreference('sound_muted'));
    },

    goHome() {
        this.stopCurrentExercise();
        UI.closeNavSheet?.();
        this.state.currentGrade = null;
        this.state.currentBrowseMode = null;
        this.state.currentSubject = null;
        this.state.currentTheme = null;
        this.state.currentLessonOrigin = null;
        this.state.currentExercise = null;
        this.state.currentExerciseData = null;
        this.state.problemData = null;
        this.state.userInput = "";
        this.applyVisualContext();
        UI.updateHeader("Devoir Numérique");
        UI.showScreen('screen-profiles');
        this.renderProfilesScreen();
    },

    getNavUiState(screenId = document.querySelector('.screen.active')?.id || 'screen-profiles') {
        const isProfileRoot = screenId === 'screen-profiles' || screenId === 'screen-onboarding';
        const isGame = screenId === 'screen-game';
        return {
            showBack: !isProfileRoot,
            backLabel: '←',
            backTitle: isGame ? 'Quitter cet exercice' : 'Retour',
            showMenu: !isProfileRoot,
            menuLabel: '☰',
            menuTitle: 'Navigation'
        };
    },

    confirmLeaveExercise() {
        const currentScreen = document.querySelector('.screen.active')?.id || '';
        if (currentScreen !== 'screen-game') return true;
        return confirm("Quitter cet exercice et perdre la progression en cours ?");
    },

    openNavMenu() {
        const currentScreen = document.querySelector('.screen.active')?.id || '';
        const actions = [];

        if (currentScreen !== 'screen-profiles') {
            actions.push({
                title: 'Retour',
                subtitle: currentScreen === 'screen-game' ? "Revenir sans terminer l'exercice" : 'Écran précédent',
                onSelect: () => this.goBack()
            });
        }

        if (this.state.currentGrade) {
            actions.push({
                title: 'Parcours',
                subtitle: 'Revenir à la matière / aux thèmes',
                onSelect: () => {
                    if (!this.confirmLeaveExercise()) return;
                    this.returnToThemes();
                }
            });
            actions.push({
                title: 'Changer de classe',
                subtitle: 'Revenir au choix de classe',
                onSelect: () => {
                    if (!this.confirmLeaveExercise()) return;
                    UI.showScreen('screen-grades');
                }
            });
        }

        actions.push({
            title: 'Changer de profil',
            subtitle: 'Retour à la sélection des profils',
            variant: 'warning',
            onSelect: () => {
                if (!this.confirmLeaveExercise()) return;
                this.goHome();
            }
        });

        actions.push({
            title: Storage.getPreference('dark_mode') ? 'Mode clair' : 'Mode sombre',
            subtitle: 'Changer l\'apparence de l\'application',
            onSelect: () => this.toggleDarkMode()
        });

        actions.push({
            title: Storage.getPreference('reduced_motion') ? 'Réactiver les animations' : 'Réduire les animations',
            subtitle: 'Limiter les effets visuels et mouvements',
            onSelect: () => this.toggleReducedMotion()
        });

        actions.push({
            title: Storage.getPreference('sound_muted') ? 'Réactiver les sons' : 'Couper les sons',
            subtitle: 'Sons de validation et de réussite',
            onSelect: () => this.toggleSoundMuted()
        });

        UI.openNavSheet?.(actions);
    },

    returnToThemes() {
        this.stopCurrentExercise();

        const grade = this.state.currentGrade;
        if (!grade) {
            return this.goHome();
        }

        this.state.currentTheme = null;
        this.state.currentLessonOrigin = null;
        this.state.currentExercise = null;
        this.state.currentExerciseData = null;
        this.state.problemData = null;
        this.state.userInput = "";
        this.applyVisualContext();
        UI.updateHeader(`${grade.title || grade.gradeId || "Classe"}`);
        if ((this.state.currentBrowseMode || 'exercises') === 'lessons') {
            this.openLessonLibrary();
            return;
        }
        this.openGradeContent();
    },

    reviewThemeLessons() {
        const lessons = Array.isArray(this.state.currentTheme?.lessons) ? this.state.currentTheme.lessons : [];
        if (!lessons.length) return;
        this.state.currentLessonOrigin = 'theme';
        this.startLesson(lessons[0]);
    },

    goBack() {
        if (!this.confirmLeaveExercise()) return;
        UI.closeNavSheet?.();
        const wasChampionMode = !!this.state.championMode;
        this.stopCurrentExercise();

        const currentScreen = document.querySelector('.screen.active')?.id;
        const actions = {
            'screen-progress': () => UI.showScreen('screen-mode'),
            'screen-champion-setup': () => UI.showScreen('screen-mode'),
            'screen-champion-results': () => UI.showScreen('screen-mode'),
            'screen-profile-customize': () => {
                this.state.customizingProfile = null;
                this.renderProfilesScreen();
            },
            'screen-game': () => {
                if (wasChampionMode) {
                    UI.showScreen('screen-champion-setup');
                    return;
                }
                UI.showScreen('screen-exercises');
            },
            'screen-lesson': () => {
                if ((this.state.currentBrowseMode || 'exercises') === 'lessons' && this.state.currentLessonOrigin === 'library') {
                    UI.showScreen('screen-library');
                    return;
                }
                UI.showScreen('screen-exercises');
            },
            'screen-library': () => UI.showScreen('screen-mode'),
            'screen-exercises': () => {
                if ((this.state.currentBrowseMode || 'exercises') === 'lessons' && this.state.currentLessonOrigin === 'library') {
                    UI.showScreen('screen-library');
                    return;
                }
                if (this.currentGradeUsesSubjects()) UI.showScreen('screen-levels');
                else UI.showScreen('screen-themes');
            },
            'screen-levels': () => UI.showScreen('screen-themes'),
            'screen-themes': () => {
                this.state.currentSubject = null;
                this.state.currentTheme = null;
                UI.showScreen('screen-mode');
            },
            'screen-mode': () => {
                this.state.currentBrowseMode = null;
                this.state.currentSubject = null;
                this.state.currentTheme = null;
                UI.showScreen('screen-grades');
            },
            'screen-grades': () => {
                this.state.currentGrade = null;
                this.state.currentBrowseMode = null;
                this.state.currentSubject = null;
                this.state.currentTheme = null;
                this.renderProfilesScreen();
            }
        };

        if (actions[currentScreen]) actions[currentScreen]();
        else this.renderProfilesScreen();
    },

    // --- GESTION DES PROFILS ---

    async createProfile() {
        const el = document.getElementById('new-profile-name');
        const name = el?.value || "";
        const result = Storage.addProfile(name);

        if (result?.ok) {
            Storage.setCurrentUser(result.cleanName);
            if (el) el.value = "";
            await this.loadGradesMenu();
            return;
        }

        const messages = {
            empty: "Merci d'entrer un prénom.",
            invalid: "Ce prénom contient uniquement des caractères non autorisés.",
            too_short: "Merci d'entrer au moins 2 caractères.",
            duplicate: "Ce profil existe déjà."
        };

        alert(messages[result?.code] || "Merci d'entrer un prénom valide.");
    },

    renderProfilesScreen() {
        UI.updateHeader("Devoir Numérique");
        UI.showScreen('screen-profiles');
        const names = Storage.getProfiles();
        const accentChoices = Storage.getAccentChoices();
        const profiles = (names || []).map(n => {
            const appearance = Storage.getProfileAppearance(n);
            const accentColor = accentChoices.find((entry) => entry.id === appearance.accent)?.color || null;
            return { id: n, name: n, avatar: appearance.avatar, accent: appearance.accent, accentColor, onEdit: (p) => this.showProfileCustomize(p) };
        });
        if (UI && typeof UI.renderProfiles === 'function') {
            UI.renderProfiles(
                profiles,
                (p) => {
                    Storage.setCurrentUser(p.name);
                    this.loadGradesMenu();
                },
                (id) => {
                    Storage.removeProfile(id);
                    this.renderProfilesScreen();
                }
            );
        }
    },

    showProfileCustomize(profile) {
        this.state.customizingProfile = profile.name;
        const current = Storage.getProfileAppearance(profile.name);
        UI.renderProfileCustomize({
            profileName: profile.name,
            avatars: Storage.getAvatarChoices(),
            accents: Storage.getAccentChoices(),
            current
        }, (choice) => {
            Storage.setProfileAppearance(profile.name, choice);
        }, () => {
            this.state.customizingProfile = null;
            this.renderProfilesScreen();
            UI.showScreen('screen-profiles');
        });
        UI.showScreen('screen-profile-customize');
    },

    // --- CHARGEMENT DES DONNÃ‰ES ---

    async loadGradesMenu() {
        try {
            const user = Storage.getCurrentUser() || "Invité";
            UI.updateHeader(`Joueur : ${user}`);
            
            const d = await this.fetchJson(['data/index.json', './data/index.json']);
            const check = window.Validators?.validateIndexData(d);
            if (check && !check.valid) throw new Error(check.reason);
            this.applyVisualContext();
            UI.renderMenu('grades-list', d.grades, (g) => this.loadGrade(g));
            UI.showScreen('screen-grades');
        } catch (e) { 
            console.error(e);
            alert(`Impossible de charger les niveaux.\n${e.message || ""}`.trim());
        }
    },

    async loadGrade(g) {
        try {
            if (!g?.dataFile || !g?.title) throw new Error("Niveau invalide.");
            UI.updateHeader(`${g.title}`);
            const d = await this.fetchJson([g.dataFile, `./${g.dataFile.replace(/^\.\//, '')}`]);
            const check = window.Validators?.validateGradeData(d);
            if (check && !check.valid) throw new Error(check.reason);
            const usesSubjects = Array.isArray(d.subjects) && d.subjects.length > 0;
            const topLevelEntries = usesSubjects ? d.subjects : this.normalizeGradeThemes(d);
            if (!Array.isArray(topLevelEntries) || topLevelEntries.length === 0) throw new Error("Aucun thème disponible.");
            this.state.currentGrade = { ...d, themes: this.normalizeGradeThemes(d) };
            this.state.currentGrade.gradeId = g.id || d.id || "unknown_grade";
            this.state.currentBrowseMode = null;
            this.state.currentSubject = null;
            this.state.currentTheme = null;
            this.applyVisualContext();
            this.showBrowseModeMenu();
        } catch (e) {
            console.error(e);
            alert(`Impossible de charger ce niveau.\n${e.message || ""}`.trim());
        }
    },

    showBrowseModeMenu() {
        const grade = this.state.currentGrade;
        if (!grade) return;

        const modes = [];
        const lessonsCount = this.countGradeModeEntries('lessons');
        const exercisesCount = this.countGradeModeEntries('exercises');

        if (lessonsCount > 0) {
            modes.push({
                id: 'browse-lessons',
                mode: 'lessons',
                icon: '📘',
                title: "J'apprends",
                subtitle: `${lessonsCount} leçon${lessonsCount > 1 ? 's' : ''} pour comprendre`,
                helper: 'Je découvre la notion avec des exemples faciles.'
            });
        }

        if (exercisesCount > 0) {
            modes.push({
                id: 'browse-exercises',
                mode: 'exercises',
                icon: '✏️',
                title: "Je m'entraîne",
                subtitle: `${exercisesCount} exercice${exercisesCount > 1 ? 's' : ''} pour jouer et réussir`,
                helper: "Je m'entraîne tout de suite."
            });
        }

        if (exercisesCount > 0) {
            modes.push({
                id: 'browse-progress',
                mode: 'progress',
                icon: '📊',
                title: 'Ma progression',
                subtitle: 'Mes étoiles et mes scores',
                helper: 'Je regarde ce que j\'ai déjà réussi.'
            });
        }

        if (this.getAllNormalExercises().length >= 5) {
            modes.push({
                id: 'browse-champion',
                mode: 'champion',
                icon: '🏆',
                title: 'Mode Champions',
                subtitle: 'Défi chronométré, toutes matières',
                helper: 'Je réponds à un maximum de questions avant la fin du temps.'
            });
        }

        UI.renderBrowseModes(modes, (entry) => this.selectBrowseMode(entry.mode));
        UI.showScreen('screen-mode');
    },

    /**
     * Liste tous les exercices "normaux" (hors bonus) du niveau en cours,
     * toutes matières confondues — utilisé par le Mode Champions pour piocher
     * des questions transverses.
     */
    getAllNormalExercises() {
        const grade = this.state.currentGrade;
        if (!grade) return [];
        const subjects = this.currentGradeUsesSubjects()
            ? grade.subjects
            : this.normalizeGradeThemes(grade).map((theme) => ({ ...theme, subthemes: [theme] }));

        const result = [];
        (subjects || []).forEach((subject) => {
            (subject?.subthemes || []).forEach((subtheme) => {
                (subtheme?.exercises || []).forEach((exercise) => {
                    if (exercise.isBonus) return;
                    if (!this.hasRunnableExercise(exercise)) return;
                    result.push({ ...exercise, subjectTitle: subject?.title || 'Matière' });
                });
            });
        });
        return result;
    },

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
        const pool = this.getAllNormalExercises();
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
        const cfg = {
            ...(exercise.params || {}),
            dataSet: exercise.params?.dataFile ? championMode.dataCache[exercise.params.dataFile] : undefined,
            mapSvg: ""
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

    selectBrowseMode(mode) {
        if (mode === 'progress') {
            this.showProgressScreen();
            return;
        }
        if (mode === 'champion') {
            this.showChampionSetup();
            return;
        }
        this.state.currentBrowseMode = mode === 'lessons' ? 'lessons' : 'exercises';
        this.state.currentSubject = null;
        this.state.currentTheme = null;
        this.state.currentLessonOrigin = null;
        if (this.state.currentBrowseMode === 'lessons') {
            this.openLessonLibrary();
            return;
        }
        this.openGradeContent();
    },

    showProgressScreen() {
        const grade = this.state.currentGrade;
        if (!grade) return;

        const subjects = this.currentGradeUsesSubjects()
            ? grade.subjects
            : this.normalizeGradeThemes(grade).map((theme) => ({ ...theme, subthemes: [theme] }));

        let totalExercises = 0;
        let totalStars = 0;
        let totalDone = 0;
        const toReview = [];

        const subjectRows = (subjects || []).map((subject, subjectIndex) => {
            let subjectExercises = 0;
            let subjectStars = 0;
            let subjectDone = 0;

            const subthemeRows = (subject?.subthemes || []).map((subtheme) => {
                const exerciseEntries = Array.isArray(subtheme?.exercises) ? subtheme.exercises : [];
                let subthemeExercises = 0;
                let subthemeStars = 0;
                let subthemeDone = 0;

                exerciseEntries.forEach((exercise) => {
                    subthemeExercises++;
                    subjectExercises++;
                    totalExercises++;
                    const record = Storage.getRecord(exercise.id, grade.gradeId);
                    if (record) {
                        subthemeStars += record.stars || 0;
                        subthemeDone++;
                        subjectStars += record.stars || 0;
                        subjectDone++;
                        totalStars += record.stars || 0;
                        totalDone++;

                        const percent = Math.round((record.lastPercent ?? record.percent) || 0);
                        if (percent < 50) {
                            toReview.push({
                                exercise,
                                title: exercise.title || 'Exercice',
                                subjectTitle: subject?.title || 'Matière',
                                subthemeTitle: subtheme?.title || '',
                                percent,
                                stars: record.stars || 0
                            });
                        }
                    }
                });

                return {
                    title: subtheme?.title || 'Sous-thème',
                    exercises: subthemeExercises,
                    done: subthemeDone,
                    stars: subthemeStars,
                    maxStars: subthemeExercises * 3,
                    exerciseEntries
                };
            }).filter((row) => row.exercises > 0);

            return {
                id: `subject-${subjectIndex}`,
                title: subject?.title || 'Matière',
                icon: subject?.icon || '📘',
                exercises: subjectExercises,
                done: subjectDone,
                stars: subjectStars,
                maxStars: subjectExercises * 3,
                subthemes: subthemeRows
            };
        }).filter((row) => row.exercises > 0);

        toReview.sort((a, b) => a.percent - b.percent);

        this._progressExerciseIndex = new Map();
        subjectRows.forEach((subject) => {
            subject.subthemes.forEach((subtheme) => {
                subtheme.exerciseEntries.forEach((exercise) => {
                    this._progressExerciseIndex.set(exercise.id, exercise);
                });
            });
        });
        toReview.forEach((entry) => this._progressExerciseIndex.set(entry.exercise.id, entry.exercise));

        const streak = Storage.getStreak();
        const badges = Storage.getBadges();

        UI.renderProgressScreen({
            totalExercises,
            totalDone,
            totalStars,
            maxStars: totalExercises * 3,
            subjects: subjectRows,
            streak,
            badges,
            toReview: toReview.slice(0, 8)
        }, (exerciseId) => {
            const exercise = this._progressExerciseIndex.get(exerciseId);
            if (exercise) this.startExercise(exercise);
        });
        UI.showScreen('screen-progress');
    },

    getGradeLessonLibraryEntries() {
        const grade = this.state.currentGrade;
        if (!Array.isArray(grade?.subjects)) return [];

        const entries = [];
        for (const subject of grade.subjects) {
            const subjectTitle = subject?.title || 'Matière';
            const subjectIcon = subject?.icon || '📘';
            const subthemes = Array.isArray(subject?.subthemes) ? subject.subthemes : [];
            const lessonEntries = [];

            for (const subtheme of subthemes) {
                const lessons = Array.isArray(subtheme?.lessons) ? subtheme.lessons : [];
                for (const lesson of lessons) {
                    lessonEntries.push({
                        ...lesson,
                        kind: 'lesson',
                        icon: lesson.icon || subjectIcon,
                        subtitle: `${subtheme.title}${lesson.subtitle ? ` · ${lesson.subtitle}` : ''}`,
                        subjectTitle,
                        themeTitle: subtheme.title,
                        __subject: subject,
                        __theme: subtheme
                    });
                }
            }

            if (!lessonEntries.length) continue;
            entries.push({
                kind: 'section',
                title: subjectTitle,
                subtitle: `${lessonEntries.length} leçon${lessonEntries.length > 1 ? 's' : ''} à relire`
            });
            entries.push(...lessonEntries);
        }

        return entries;
    },

    openLessonLibrary() {
        const grade = this.state.currentGrade;
        if (!grade) return this.loadGradesMenu();

        const entries = this.getGradeLessonLibraryEntries();
        if (!entries.length) {
            alert("Aucune leçon disponible pour ce niveau.");
            return this.showBrowseModeMenu();
        }

        const title = document.querySelector('#screen-library h2');
        const lead = document.getElementById('library-lead');
        if (title) title.textContent = `Bibliothèque ${grade.title || grade.gradeId || ''}`.trim();
        if (lead) lead.textContent = "Choisis une leçon à revoir. Elles sont rangées par matière pour retrouver l'essentiel plus vite.";

        UI.renderMenu('library-list', entries, (entry) => {
            if (entry?.kind !== 'lesson') return;
            this.state.currentSubject = entry.__subject || null;
            this.state.currentTheme = entry.__theme || null;
            this.state.currentLessonOrigin = 'library';
            this.startLesson(entry);
        });
        UI.showScreen('screen-library');
    },

    openGradeContent() {
        const grade = this.state.currentGrade;
        if (!grade) return this.loadGradesMenu();

        const mode = this.state.currentBrowseMode || 'exercises';
        const usesSubjects = this.currentGradeUsesSubjects();
        const themesLead = document.getElementById('themes-lead');

        if (usesSubjects) {
            const subjects = this.getFilteredSubjectsByMode(mode);
            if (!subjects.length) {
                alert("Aucun contenu disponible pour ce parcours.");
                return this.showBrowseModeMenu();
            }
            const title = mode === 'lessons' ? 'Choisis une matière pour apprendre' : 'Choisis une matière pour t’entraîner';
            const screenTitle = document.querySelector('#screen-themes h2');
            if (screenTitle) screenTitle.textContent = title;
            if (themesLead) {
                themesLead.textContent = mode === 'lessons'
                    ? "Choisis une matière pour découvrir les notions calmement."
                    : "Choisis une matière pour commencer tes exercices.";
            }
            UI.renderMenu('themes-list', subjects, (entry) => this.selectSubject(entry));
            UI.showScreen('screen-themes');
            return;
        }

        const themes = this.getFilteredThemesByMode(mode);
        if (!themes.length) {
            alert("Aucun contenu disponible pour ce parcours.");
            return this.showBrowseModeMenu();
        }
        const screenTitle = document.querySelector('#screen-themes h2');
        if (screenTitle) screenTitle.textContent = mode === 'lessons' ? 'Choisis une notion' : 'Choisis un thème';
        if (themesLead) {
            themesLead.textContent = mode === 'lessons'
                ? "Choisis la notion que tu veux comprendre."
                : "Choisis le thème sur lequel tu veux t'entraîner.";
        }
        UI.renderMenu('themes-list', themes, (entry) => this.selectTheme(entry));
        UI.showScreen('screen-themes');
    },

    hasModeContent(item, mode = 'exercises') {
        if (!item) return false;
        if (mode === 'lessons') return Array.isArray(item.lessons) && item.lessons.length > 0;
        return Array.isArray(item.exercises) && item.exercises.length > 0;
    },

    countModeContent(item, mode = 'exercises') {
        if (!item) return 0;
        return mode === 'lessons'
            ? (Array.isArray(item.lessons) ? item.lessons.length : 0)
            : (Array.isArray(item.exercises) ? item.exercises.length : 0);
    },

    countGradeModeEntries(mode = 'exercises') {
        const grade = this.state.currentGrade;
        if (!grade) return 0;
        if (this.currentGradeUsesSubjects()) {
            const subjects = Array.isArray(grade?.subjects) ? grade.subjects : [];
            return subjects.reduce((sum, subject) => {
                const subthemes = Array.isArray(subject?.subthemes) ? subject.subthemes : [];
                return sum + subthemes.reduce((subSum, subtheme) => subSum + this.countModeContent(subtheme, mode), 0);
            }, 0);
        }

        const themes = this.normalizeGradeThemes(grade);
        return themes.reduce((sum, theme) => sum + this.countModeContent(theme, mode), 0);
    },

    getFilteredSubjectsByMode(mode = 'exercises') {
        const subjects = Array.isArray(this.state.currentGrade?.subjects) ? this.state.currentGrade.subjects : [];
        return subjects
            .map((subject) => {
                const subthemes = (Array.isArray(subject?.subthemes) ? subject.subthemes : [])
                    .filter((subtheme) => this.hasModeContent(subtheme, mode))
                    .map((subtheme) => ({
                        ...subtheme,
                        subtitle: mode === 'lessons'
                            ? `${this.countModeContent(subtheme, mode)} leçon${this.countModeContent(subtheme, mode) > 1 ? 's' : ''}`
                            : `${this.countModeContent(subtheme, mode)} exercice${this.countModeContent(subtheme, mode) > 1 ? 's' : ''}`
                    }));

                if (!subthemes.length) return null;

                const total = subthemes.reduce((sum, subtheme) => sum + this.countModeContent(subtheme, mode), 0);
                return {
                    ...subject,
                    subthemes,
                    subtitle: mode === 'lessons'
                        ? `${total} leçon${total > 1 ? 's' : ''} à découvrir`
                        : `${total} exercice${total > 1 ? 's' : ''} pour s'entraîner`
                };
            })
            .filter(Boolean);
    },

    getFilteredThemesByMode(mode = 'exercises') {
        const themes = Array.isArray(this.state.currentGrade?.themes) ? this.state.currentGrade.themes : [];
        return themes
            .filter((theme) => this.hasModeContent(theme, mode))
            .map((theme) => ({
                ...theme,
                subtitle: mode === 'lessons'
                    ? `${this.countModeContent(theme, mode)} leçon${this.countModeContent(theme, mode) > 1 ? 's' : ''}`
                    : `${this.countModeContent(theme, mode)} exercice${this.countModeContent(theme, mode) > 1 ? 's' : ''}`
            }));
    },

    selectSubject(subject) {
        if (!subject || !Array.isArray(subject.subthemes) || subject.subthemes.length === 0) {
            alert("Cette matière ne contient aucun sous-thème disponible.");
            return;
        }
        this.state.currentSubject = subject;
        this.state.currentTheme = null;
        this.state.currentLesson = null;
        this.state.currentLessonOrigin = null;
        this.applyVisualContext();
        const mode = this.state.currentBrowseMode || 'exercises';
        const screenTitle = document.querySelector('#screen-levels h2');
        const screenLead = document.getElementById('levels-lead');
        if (screenTitle) {
            screenTitle.textContent = mode === 'lessons' ? 'Choisis une notion à découvrir' : 'Choisis un sous-thème';
        }
        if (screenLead) {
            screenLead.textContent = mode === 'lessons'
                ? "Prends une notion simple et avance à ton rythme."
                : "Choisis un sous-thème précis pour pratiquer.";
        }
        UI.renderMenu('levels-list', subject.subthemes, (subtheme) => this.selectTheme(subtheme));
        UI.showScreen('screen-levels');
    },

    selectTheme(t) {
        const lessons = Array.isArray(t?.lessons) ? t.lessons : [];
        const exercises = Array.isArray(t?.exercises) ? t.exercises : [];
        if (!t || (lessons.length === 0 && exercises.length === 0)) {
            alert("Ce thème ne contient aucun contenu disponible.");
            return;
        }
        this.state.currentTheme = t;
        this.state.currentLesson = null;
        this.state.currentLessonOrigin = null;
        this.applyVisualContext();
        const mode = this.state.currentBrowseMode || (lessons.length > 0 ? 'lessons' : 'exercises');
        this.renderThemeContent(mode);
        UI.showScreen('screen-exercises');
    },

    renderThemeContent(mode = 'exercises') {
        const theme = this.state.currentTheme;
        if (!theme) return;

        const lessons = Array.isArray(theme?.lessons) ? theme.lessons : [];
        const exercises = Array.isArray(theme?.exercises) ? theme.exercises : [];
        const activeMode = mode === 'lessons' && lessons.length > 0 ? 'lessons' : 'exercises';
        const screenTitle = document.querySelector('#screen-exercises h2');
        const screenLead = document.getElementById('exercises-lead');

        if (screenTitle) {
            screenTitle.textContent = activeMode === 'lessons' ? 'Choisis une leçon' : 'Choisis un exercice';
        }
        if (screenLead) {
            screenLead.textContent = activeMode === 'lessons'
                ? `Découvre ${theme?.title || 'la notion'} avant de t'entraîner.`
                : `Choisis un exercice sur ${theme?.title || 'ce sous-thème'}.`;
        }

        const entries = activeMode === 'lessons'
            ? lessons.map((lesson) => ({
                ...lesson,
                kind: 'lesson',
                subtitle: lesson.subtitle || 'Découvrir la notion',
                icon: lesson.icon || '📘'
            }))
            : this.annotateBonusExercises(exercises).map((exercise) => ({
                ...exercise,
                kind: 'exercise'
            }));

        UI.renderMenu('exercises-list', entries, (entry) => {
            if (entry.kind === 'lesson') this.startLesson(entry);
            else if (entry.isBonus && !entry.bonusUnlocked) return;
            else this.startExercise(entry);
        });
    },

    /**
     * Calcule, pour un sous-thème, la moyenne d'étoiles obtenue sur les
     * exercices "normaux" (hors bonus) et déduit si chaque exercice marqué
     * bonusThreshold est débloqué. Le seuil s'exprime en moyenne d'étoiles
     * (0 à 3) sur les exercices déjà tentés du même sous-thème.
     */
    annotateBonusExercises(exercises) {
        const gradeId = this.state.currentGrade?.gradeId || null;
        const normalExercises = exercises.filter((exercise) => !exercise.isBonus);
        let starsSum = 0;
        let attemptedCount = 0;

        normalExercises.forEach((exercise) => {
            const record = Storage.getRecord(exercise.id, gradeId);
            if (record) {
                starsSum += record.stars || 0;
                attemptedCount++;
            }
        });

        const allAttempted = attemptedCount === normalExercises.length && normalExercises.length > 0;
        const averageStars = attemptedCount > 0 ? starsSum / attemptedCount : 0;

        return exercises.map((exercise) => {
            if (!exercise.isBonus) return exercise;
            const threshold = Number.isFinite(Number(exercise.bonusThreshold)) ? Number(exercise.bonusThreshold) : 2;
            const bonusUnlocked = allAttempted && averageStars >= threshold;
            return { ...exercise, bonusUnlocked };
        });
    },

    normalizeGradeThemes(gradeData) {
        if (Array.isArray(gradeData?.themes) && gradeData.themes.length > 0) {
            return gradeData.themes;
        }

        if (!Array.isArray(gradeData?.subjects) || gradeData.subjects.length === 0) {
            return [];
        }

        const themes = [];
        for (const subject of gradeData.subjects) {
            const subjectTitle = subject?.title || 'Matière';
            const subjectIcon = subject?.icon || null;
            const subthemes = Array.isArray(subject?.subthemes) ? subject.subthemes : [];

            for (const subtheme of subthemes) {
                const hasExercises = Array.isArray(subtheme?.exercises) && subtheme.exercises.length > 0;
                const hasLessons = Array.isArray(subtheme?.lessons) && subtheme.lessons.length > 0;
                if (!subtheme || (!hasExercises && !hasLessons)) continue;
                themes.push({
                    ...subtheme,
                    title: subtheme.title,
                    subtitle: subjectTitle,
                    icon: subtheme.icon || subjectIcon || null,
                    subjectId: subject.id,
                    subjectTitle
                });
            }
        }

        return themes;
    },

    currentGradeUsesSubjects() {
        return Array.isArray(this.state.currentGrade?.subjects) && this.state.currentGrade.subjects.length > 0;
    },

    startLesson(lesson) {
        if (!lesson || !Array.isArray(lesson.blocks) || lesson.blocks.length === 0) {
            alert("Leçon indisponible.");
            return;
        }
        this.stopCurrentExercise();
        this.state.currentLesson = lesson;
        this.state.currentExercise = null;
        this.state.problemData = null;
        this.state.targetAnswer = null;
        this.state.userInput = "";
        this.applyVisualContext();
        const theme = this.state.currentTheme || {};
        const lessons = Array.isArray(theme?.lessons) ? theme.lessons : [];
        const exerciseCount = Array.isArray(theme?.exercises) ? theme.exercises.length : 0;
        const lessonLead = document.getElementById('lesson-lead');
        if (lessonLead) {
            lessonLead.textContent = exerciseCount > 0
                ? `Lis l'essentiel, retiens les idées clés, puis passe aux ${exerciseCount} exercice${exerciseCount > 1 ? 's' : ''} du sous-thème.`
                : "Lis l'essentiel de la leçon comme un rappel de cours, puis reviens au sous-thème.";
        }
        UI.renderLesson(lesson, () => {
            if (this.state.currentTheme) {
                this.renderThemeContent('exercises');
                UI.showScreen('screen-exercises');
            }
        }, {
            themeTitle: theme?.title || '',
            subjectTitle: theme?.subjectTitle || '',
            lessons: lessons.map((item) => ({
                id: item.id,
                title: item.title,
                subtitle: item.subtitle
            })),
            onSelectLesson: (lessonId) => {
                const target = lessons.find((item) => item.id === lessonId);
                if (target) this.startLesson(target);
            },
            exerciseCount,
            summaryText: exerciseCount > 0
                ? `Retiens l'idée essentielle, l'exemple important et les mots-clés, puis passe aux ${exerciseCount} exercice${exerciseCount > 1 ? 's' : ''} du sous-thème.`
                : `Retiens l'idée essentielle et les mots-clés, puis reviens au sous-thème pour continuer.`
        });
        UI.showScreen('screen-lesson');
    },

    shuffleArray(items) {
        const copy = Array.isArray(items) ? [...items] : [];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    },

    shuffleProblemChoices(problem) {
        if (!problem || (problem.inputType !== 'qcm' && problem.inputType !== 'boolean')) return;
        const choices = problem.data?.choices || problem.choices;
        if (!Array.isArray(choices) || choices.length < 2) return;

        const isComparisonChoices = choices.length === 3
            && ['<', '=', '>'].every((symbol) => choices.includes(symbol));
        if (isComparisonChoices) return;

        const shuffledChoices = this.shuffleArray(choices);

        if (problem.data?.choices) problem.data.choices = shuffledChoices;
        else problem.choices = shuffledChoices;
    },

    // --- LOGIQUE DE JEU (Remplace initGame) ---

    async startExercise(e) {
        if (!this.hasRunnableExercise(e)) {
            alert("Exercice indisponible : paramètres incomplets.");
            return;
        }

        const check = window.Validators?.validateExercise(e);
        if (check && !check.valid) {
            alert(`Exercice indisponible : ${check.reason}`);
            return;
        }

        let exerciseData = null;
        if (e.params?.dataFile) {
            try {
                exerciseData = await this.fetchJson([e.params.dataFile, `./${e.params.dataFile.replace(/^\.\//, '')}`]);
                const dataCheck = window.Validators?.validateExerciseData(e, exerciseData);
                if (dataCheck && !dataCheck.valid) throw new Error(dataCheck.reason);
            } catch (error) {
                console.error(error);
                alert(`Impossible de charger les données de cet exercice.\n${error.message || ""}`.trim());
                return;
            }
        }

        let mapSvg = "";
        if (e.engine === 'board-interactive' && e.params?.type === 'map-locate' && e.params?.mapFile) {
            try {
                mapSvg = await this.fetchText([e.params.mapFile, `./${e.params.mapFile.replace(/^\.\//, '')}`]);
                // Dev-only: strip the live-reload script some local static servers
                // (e.g. VSCode "Live Server") inject before </svg>. Harmless to
                // remove here since it never reaches a real GitHub Pages response.
                mapSvg = mapSvg.replace(/<!--\s*Code injected by live-server\s*-->[\s\S]*?<\/script>\s*(?=<\/svg>)/i, '');
                if (!window.Validators?.isSafeSvgMarkup?.(mapSvg)) throw new Error("Carte SVG invalide ou non sûre.");
            } catch (error) {
                console.error(error);
                alert(`Impossible de charger la carte de cet exercice.\n${error.message || ""}`.trim());
                return;
            }
        }

        // Reset propre de l'Ã©tat
        this.state.currentExercise = e;
        this.state.currentExerciseMapSvg = mapSvg;
        this.state.currentExerciseData = exerciseData;
        this.state.currentQuestion = 0; 
        this.state.score = 0;
        this.state.userInput = "";
        this.state.problemData = null;
        this.state.targetAnswer = null;
        this.state.isValidating = false; // ðŸ”“ On dÃ©verrouille au dÃ©but
        this.applyVisualContext();
        UI.showScreen('screen-game'); 
        this.generateNextQuestion();
    },

    generateNextQuestion() {
        if (this.state.timer) clearTimeout(this.state.timer);
        this.stopSpeech();
        if (!this.hasRunnableExercise()) {
            this.failSafeExit("Cet exercice ne peut pas être démarré correctement.");
            return;
        }

        const totalQuestions = this.getQuestionTarget();
        if (this.state.currentQuestion >= totalQuestions) {
            this.showFinalResults();
            return;
        }
        
        this.state.currentQuestion++; 
        this.state.userInput = ""; 
        this.state.speechStatus = 'idle';
        
        // ExÃ©cution sÃ©curisÃ©e du moteur
        const cfg = {
            ...(this.state.currentExercise.params || {}),
            dataSet: this.state.currentExerciseData,
            mapSvg: this.state.currentExerciseMapSvg || ""
        };
        const problem = Engines.run(this.state.currentExercise.engine, cfg, this.state.frenchLib);
        const check = window.Validators?.validateProblem(problem);
        if (check && !check.valid) {
            console.error("Problème invalide :", check.reason, problem);
            this.failSafeExit("Cet exercice ne peut pas être affiché pour le moment.");
            return;
        }
        if (problem.answer === undefined || problem.answer === null) {
            this.failSafeExit("Cet exercice a retourné une réponse invalide.");
            return;
        }

        this.shuffleProblemChoices(problem);
        this.state.problemData = problem; 
        this.state.targetAnswer = problem.answer;
        if (problem.visualType === 'audioSpelling' && problem.data) {
            problem.data.audioSupported = this.supportsSpeechSynthesis();
            problem.data.audioStatus = problem.data.audioSupported ? 'ready' : 'unsupported';
        }
        if (problem.visualType === 'timelineOrder' && Array.isArray(problem.data?.currentOrder)) {
            this.state.userInput = problem.data.currentOrder.join(',');
        }
        
        if (problem.visualType === 'square' && problem.data) {
            problem.data.selectedIndices = [];
        }

        UI.updateKeyboardLayout(problem.inputType || "numeric", problem);
        this.refreshUI();
        if (problem.visualType === 'audioSpelling') {
            setTimeout(() => {
                if (this.state.problemData === problem) this.replayAudioSpelling();
            }, 320);
        }

        // ðŸ”“ ON OUVRE LE VERROU POUR LA NOUVELLE QUESTION
        this.state.isValidating = false;

        // Gestion Timer (Oiseau)
        if (problem.visualType === 'bird') {
            const duration = (cfg.vitesse || 8) * 1000;
            this.state.timer = setTimeout(() => this.handleInput("timeout"), duration);
        }
    },

    handleInput(val, target = null) {
        // Si validation en cours, on ignore les inputs
        if (this.state.isValidating && val !== 'timeout') return;

        const p = this.state.problemData;
        if (!p) return; 

        if (val === "timeout") return this.validateAnswer(false);

        // --- CAS SPÃ‰CIAL : CarrÃ© Magique ---
        if (val === 'card-click' && target) {
            const idx = parseInt(target.getAttribute('data-idx'));
            if (isNaN(idx) || !p.data) return;

            const d = p.data;
            if (!d.selectedIndices) d.selectedIndices = [];

            const pos = d.selectedIndices.indexOf(idx);
            if (pos > -1) d.selectedIndices.splice(pos, 1);
            else d.selectedIndices.push(idx);

            const sum = d.selectedIndices.reduce((acc, i) => acc + (Number(d.numbers[i]) || 0), 0);
            this.state.userInput = sum.toString();
            
            this.refreshUI();
            return; 
        }

        // --- CAS SPÃ‰CIAL : Frise chronologique ---
        if (typeof val === 'string' && val.startsWith('timeline-order:')) {
            const selectedId = val.replace('timeline-order:', '');
            if (p.visualType !== 'timelineOrder' || !p.data) return;
            p.data.selectedId = selectedId;
            this.state.userInput = (p.data.currentOrder || []).join(',');
            this.refreshUI();
            return;
        }

        if (val === 'timeline-move-left' || val === 'timeline-move-right') {
            if (p.visualType !== 'timelineOrder' || !p.data?.selectedId || !Array.isArray(p.data.currentOrder)) return;
            const order = [...p.data.currentOrder];
            const selectedIdx = order.indexOf(p.data.selectedId);
            if (selectedIdx === -1) return;
            const nextIdx = val === 'timeline-move-left' ? selectedIdx - 1 : selectedIdx + 1;
            if (nextIdx < 0 || nextIdx >= order.length) return;
            [order[selectedIdx], order[nextIdx]] = [order[nextIdx], order[selectedIdx]];
            p.data.currentOrder = order;
            this.state.userInput = order.join(',');
            this.refreshUI();
            return;
        }

        // --- CAS SPÃ‰CIAL : Appariement ---
        if (typeof val === 'string' && val.startsWith('matching-select:')) {
            if (p.visualType !== 'matching' || !p.data) return;
            const [, side, rawId] = val.split(':');
            const id = parseInt(rawId);
            if (isNaN(id)) return;
            const d = p.data;
            if (!d.matches) d.matches = {};

            if (side === 'left') {
                if (Object.prototype.hasOwnProperty.call(d.matches, id)) return;
                d.selectedLeft = id;
            } else if (side === 'right') {
                if (d.selectedLeft === null || d.selectedLeft === undefined) return;
                if (Object.values(d.matches).includes(id)) return;
                d.matches[d.selectedLeft] = id;
                d.selectedLeft = null;

                const total = (d.left || []).length;
                if (Object.keys(d.matches).length === total) {
                    const ordered = (d.left || []).map((entry) => d.matches[entry.id]);
                    this.state.userInput = ordered.join(',');
                    d.revealed = true;
                    this.refreshUI();
                    return this.validateAnswer();
                }
            }
            this.refreshUI();
            return;
        }

        // --- CAS SPÉCIAL : Remise en ordre de mots ---
        if (typeof val === 'string' && val.startsWith('word-order-pick:')) {
            if (p.visualType !== 'wordOrder' || !p.data) return;
            const wordId = parseInt(val.replace('word-order-pick:', ''));
            if (isNaN(wordId)) return;
            const d = p.data;
            const wordEntry = (d.words || []).find((w) => w.id === wordId);
            if (!wordEntry) return;
            const alreadyPicked = (d.picked || []).some((w) => w.id === wordId);
            if (alreadyPicked) return;
            d.picked = [...(d.picked || []), wordEntry];
            const totalWords = (d.words || []).length;
            if (d.picked.length === totalWords) {
                this.state.userInput = d.picked.map((w) => w.id).join(',');
                d.revealed = true;
                this.refreshUI();
                return this.validateAnswer();
            }
            this.state.userInput = d.picked.map((w) => w.id).join(',');
            this.refreshUI();
            return;
        }

        if (typeof val === 'string' && val.startsWith('word-order-remove:')) {
            if (p.visualType !== 'wordOrder' || !p.data) return;
            const pos = parseInt(val.replace('word-order-remove:', ''));
            if (isNaN(pos)) return;
            const d = p.data;
            if (!Array.isArray(d.picked) || pos < 0 || pos >= d.picked.length) return;
            d.picked = d.picked.filter((_, i) => i !== pos);
            this.state.userInput = d.picked.map((w) => w.id).join(',');
            this.refreshUI();
            return;
        }

        if (typeof val === 'string' && val.startsWith('timeline-place:')) {
            const year = val.replace('timeline-place:', '');
            if (p.visualType !== 'timelinePlace' || !p.data) return;
            p.data.selectedYear = year;
            this.state.userInput = year.toString();
            this.refreshUI();
            return;
        }

        // --- CAS SPÉCIAL : Plateau interactif (géométrie) ---
        if (typeof val === 'string' && val.startsWith('board-') && p.visualType === 'geometry-board' && p.data) {
            const d = p.data;

            if (val === 'board-reset') {
                if (d.boardKind === 'tap-features') d.userState = { selectedIds: [] };
                else if (d.boardKind === 'shape-classify') d.userState = { selectedFigureId: null, assignments: {} };
                else if (d.boardKind === 'point-on-grid') d.userState = { point: null };
                else if (d.boardKind === 'symmetry-complete') d.userState = { placedPoints: [] };
                d.revealed = false;
                this.state.userInput = "";
                this.refreshUI();
                return;
            }

            if (val === 'board-submit') {
                if (d.boardKind === 'tap-features') {
                    const ids = Array.isArray(d.userState?.selectedIds) ? [...d.userState.selectedIds].sort() : [];
                    this.state.userInput = ids.join('|');
                } else if (d.boardKind === 'shape-classify') {
                    const assignments = d.userState?.assignments || {};
                    this.state.userInput = EnginesBoard.canonicalizeAssignments(assignments);
                } else if (d.boardKind === 'point-on-grid') {
                    const point = d.userState?.point;
                    this.state.userInput = EnginesBoard.canonicalizePoint(point);
                } else if (d.boardKind === 'symmetry-complete') {
                    const points = d.userState?.placedPoints || [];
                    this.state.userInput = EnginesBoard.canonicalizePoints(points);
                }
                d.revealed = true;
                this.refreshUI();
                return this.validateAnswer();
            }

            if (val.startsWith('board-toggle-feature:') && d.boardKind === 'tap-features') {
                const featureId = val.replace('board-toggle-feature:', '');
                if (!d.userState) d.userState = { selectedIds: [] };
                if (!Array.isArray(d.userState.selectedIds)) d.userState.selectedIds = [];
                const idx = d.userState.selectedIds.indexOf(featureId);
                if (idx > -1) d.userState.selectedIds.splice(idx, 1);
                else d.userState.selectedIds.push(featureId);
                this.refreshUI();
                return;
            }

            if (val.startsWith('board-select-figure:') && d.boardKind === 'shape-classify') {
                const figureId = val.replace('board-select-figure:', '');
                if (!d.userState) d.userState = { selectedFigureId: null, assignments: {} };
                d.userState.selectedFigureId = figureId;
                this.refreshUI();
                return;
            }

            if (val.startsWith('board-assign-bucket:') && d.boardKind === 'shape-classify') {
                const bucketId = val.replace('board-assign-bucket:', '');
                if (!d.userState || !d.userState.selectedFigureId) return;
                if (!d.userState.assignments) d.userState.assignments = {};
                d.userState.assignments[d.userState.selectedFigureId] = bucketId;
                d.userState.selectedFigureId = null;

                const figuresCount = Array.isArray(d.figures) ? d.figures.length : 0;
                const assignedCount = Object.keys(d.userState.assignments).length;
                this.state.userInput = EnginesBoard.canonicalizeAssignments(d.userState.assignments);
                if (figuresCount > 0 && assignedCount === figuresCount) {
                    d.revealed = true;
                    this.refreshUI();
                    return this.validateAnswer();
                }
                this.refreshUI();
                return;
            }

            if (val.startsWith('board-place-point:') && d.boardKind === 'point-on-grid') {
                const parts = val.split(':');
                const x = parseInt(parts[1]);
                const y = parseInt(parts[2]);
                if (isNaN(x) || isNaN(y)) return;
                if (!d.userState) d.userState = { point: null };
                d.userState.point = [x, y];
                this.state.userInput = EnginesBoard.canonicalizePoint([x, y]);
                this.refreshUI();
                return;
            }

            if (val.startsWith('board-toggle-point:') && d.boardKind === 'symmetry-complete') {
                const parts = val.split(':');
                const x = parseInt(parts[1]);
                const y = parseInt(parts[2]);
                if (isNaN(x) || isNaN(y)) return;
                if (!d.userState) d.userState = { placedPoints: [] };
                if (!Array.isArray(d.userState.placedPoints)) d.userState.placedPoints = [];
                const idx = d.userState.placedPoints.findIndex((pt) => Number(pt[0]) === x && Number(pt[1]) === y);
                if (idx > -1) d.userState.placedPoints.splice(idx, 1);
                else d.userState.placedPoints.push([x, y]);
                this.state.userInput = EnginesBoard.canonicalizePoints(d.userState.placedPoints);
                this.refreshUI();
                return;
            }

            if (val.startsWith('board-select-zone:') && d.boardKind === 'map-locate') {
                if (d.revealed) return;
                const zoneId = val.replace('board-select-zone:', '');
                if (!d.userState) d.userState = { selectedZoneId: null };
                d.userState.selectedZoneId = zoneId;
                this.state.userInput = zoneId;
                d.revealed = true;
                this.refreshUI();
                return this.validateAnswer();
            }

            return;
        }

        // --- GESTION CLAVIER ---
        if (val === 'ok') {
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
            
            // Limites de saisie
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
        if (this.state.championMode) {
            this.refreshChampionUI();
            return;
        }
        if (!this.hasRunnableExercise() || !this.state.problemData) return;
        const total = this.getQuestionTarget() || 10;
        const prog = (this.state.currentQuestion / total) * 100;
        UI.updateGameDisplay(this.state.problemData, this.state.userInput, prog);
    },

    validateAnswer(hasAnswered = true) {
        // ðŸ›‘ ANTI-SPAM : Si dÃ©jÃ  en cours, on arrÃªte tout de suite
        if (this.state.isValidating) return;
        this.state.isValidating = true; // ðŸ”’ On verrouille

        if (this.state.timer) clearTimeout(this.state.timer);
        
        const { userInput, targetAnswer, currentExercise, problemData } = this.state;
        if (!this.hasRunnableExercise(currentExercise) || !problemData) {
            this.state.isValidating = false;
            this.failSafeExit("L'exercice courant est dans un état incohérent.");
            return;
        }
        const ansZone = document.getElementById('user-answer');
        
        // 1. NETTOYAGE & TOLÃ‰RANCE
        const clean = s => (s || "").toString().toLowerCase().trim();
        let uInput = clean(userInput);
        let tAnswer = clean(targetAnswer);

        // TolÃ©rance Tiret/Espace (ex: dictÃ©e nombres)
        if (problemData && problemData.data && problemData.data.allowNoHyphen) {
            uInput = uInput.replace(/-/g, " ").replace(/\s+/g, " ");
            tAnswer = tAnswer.replace(/-/g, " ").replace(/\s+/g, " ");
        }

        let isCorrect = false;
        if (hasAnswered) {
            isCorrect = (uInput === tAnswer);
            // Tolérance horloge : accepte "1h30" écrit "130" sans le zéro initial (heures 1-9)
            if (!isCorrect && problemData.visualType === 'clock' && /^\d{3}$/.test(uInput) && /^\d{4}$/.test(tAnswer)) {
                isCorrect = ("0" + uInput) === tAnswer;
            }
        }

        if (isCorrect) {
            if (this.state.championMode) this.state.championMode.score++;
            else this.state.score++;
        }
        if (this.state.championMode) this.state.championMode.answered++;

        if (window.AudioFeedback) {
            if (isCorrect) AudioFeedback.playCorrect();
            else AudioFeedback.playIncorrect();
        }

        // 2. FEEDBACK VISUEL
        if (ansZone && problemData.visualType !== 'matching' && problemData.visualType !== 'wordOrder' && problemData.visualType !== 'geometry-board') {
            ansZone.style.display = 'flex';
            ansZone.classList.remove('is-idle', 'is-success', 'is-error');
            ansZone.classList.add(isCorrect ? 'is-success' : 'is-error');

            if (!isCorrect) {
                ansZone.classList.add('shake');
                setTimeout(() => ansZone.classList.remove('shake'), 400);
            }

            if (problemData.visualType === 'clock') {
                const val = (isCorrect ? userInput : targetAnswer).toString().padStart(4, '0');
                ansZone.innerHTML = `
                    <div class="clock-digit-block">${val.slice(0, 2)}</div>
                    <span class="clock-separator">:</span>
                    <div class="clock-digit-block">${val.slice(2, 4)}</div>`;
            } else if (problemData.visualType === 'timelineOrder') {
                ansZone.textContent = isCorrect
                    ? "Ordre correct"
                    : (problemData.data?.orderedLabels || []).join("  â†’  ");
            } else if (problemData.visualType === 'timelinePlace') {
                ansZone.textContent = isCorrect
                    ? `${userInput}`
                    : `${targetAnswer}`;
            } else {
                ansZone.textContent = isCorrect ? userInput : targetAnswer;
            }
        }

        // 2bis. EXPLICATION PÉDAGOGIQUE (si réponse fausse et explication disponible)
        const explZone = document.getElementById('answer-explanation');
        if (explZone) {
            if (!isCorrect && problemData.explanation) {
                explZone.textContent = problemData.explanation;
                explZone.classList.remove('is-hidden');
            } else {
                explZone.classList.add('is-hidden');
            }
        }

        // 3. SUITE DU JEU
        let delay = isCorrect ? 800 : (problemData.explanation ? 4000 : 2500);
        if (problemData.visualType === 'matching' || problemData.visualType === 'wordOrder' || problemData.visualType === 'geometry-board') {
            delay = isCorrect ? 1800 : (problemData.explanation ? 4500 : 3000);
        }
        if (this.state.championMode) {
            delay = isCorrect ? 350 : 900;
        }

        setTimeout(() => {
            if (ansZone) {
                ansZone.classList.remove('is-success', 'is-error');
                ansZone.classList.add('is-idle');
            }
            if (explZone) explZone.classList.add('is-hidden');

            if (this.state.championMode) {
                this.championNextQuestion();
                return;
            }

            if (this.state.currentQuestion < this.getQuestionTarget(currentExercise)) {
                this.generateNextQuestion();
            } else {
                this.showFinalResults();
            }
            // âš ï¸ On ne dÃ©verrouille PAS ici, c'est fait au dÃ©but de generateNextQuestion
        }, delay);
    },

    showFinalResults() {
        const { score, currentGrade, currentExercise } = this.state;
        const total = this.getQuestionTarget(currentExercise);
        if (!total) {
            this.failSafeExit("Impossible d'afficher les résultats de cet exercice.");
            return;
        }
        
        // ðŸ›¡ï¸ SÃ‰CURITÃ‰ SCORE : On s'assure que le score ne dÃ©passe jamais le total
        const safeScore = Math.min(score, total);
        const percent = Math.round((safeScore / total) * 100);

        if (currentGrade && currentGrade.gradeId) {
            Storage.saveRecord(currentGrade.gradeId, currentExercise.id, safeScore, total);
        }
        const streakResult = Storage.recordSessionActivity();

        UI.renderStars(safeScore, total);
        UI.showScreen('screen-results');

        if (safeScore === total) {
            UI.launchCelebration();
            if (window.AudioFeedback) AudioFeedback.playPerfect();
        }

        if (streakResult && streakResult.isNewDay && streakResult.current > 1) {
            UI.showStreakToast(streakResult.current);
        }

        const scEl = document.getElementById('result-score');
        if (scEl) scEl.innerText = `Score : ${safeScore} / ${total}`;
        const resultTitle = document.getElementById('result-title');
        const resultLead = document.getElementById('result-lead');
        if (resultTitle) {
            resultTitle.innerText = percent === 100
                ? "Bravo !"
                : percent >= 70
                    ? "Très bien !"
                    : percent >= 40
                        ? "Continue !"
                        : "On recommence ?";
        }
        if (resultLead) {
            resultLead.innerText = percent === 100
                ? "Tu as tout réussi. Tu peux passer à une nouvelle notion."
                : percent >= 70
                    ? "Tu avances bien. Relis la leçon ou tente un autre exercice."
                    : percent >= 40
                        ? "Tu progresses. Une petite révision peut t'aider."
                        : "Relis la leçon et réessaie tranquillement.";
        }

        const lessons = Array.isArray(this.state.currentTheme?.lessons) ? this.state.currentTheme.lessons : [];
        const lessonBtn = document.getElementById('btn-results-lesson');
        const lessonLabel = document.getElementById('btn-results-lesson-label');
        if (lessonBtn) {
            lessonBtn.style.display = lessons.length ? 'inline-flex' : 'none';
        }
        if (lessonLabel) {
            lessonLabel.textContent = lessons.length > 1 ? 'VOIR LES LEÇONS' : 'REVOIR LA LEÇON';
        }
    }
};

window.App = App;
window.addEventListener('DOMContentLoaded', () => App.init());

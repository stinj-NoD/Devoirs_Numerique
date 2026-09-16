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

        // Débloque la synthèse vocale dès le premier geste utilisateur : sur
        // de nombreux navigateurs mobiles, speechSynthesis.speak() est ignoré
        // silencieusement s'il n'a jamais été appelé depuis un vrai clic/tap.
        this.unlockSpeechSynthesisOnFirstInteraction();

        // Les voix sont chargées de façon asynchrone par le navigateur : un
        // premier appel à getVoices() peut renvoyer un tableau vide. On force
        // le chargement et on écoute l'événement pour que getFrenchVoice()
        // dispose des voix dès qu'elles sont prêtes.
        if (this.supportsSpeechSynthesis()) {
            window.speechSynthesis.getVoices();
            window.speechSynthesis.addEventListener?.('voiceschanged', () => {
                window.speechSynthesis.getVoices();
            });
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
                // Un <button> natif (ex: cartes du jeu de mémoire) déclenche déjà
                // un vrai événement "click" sur Entrée/Espace : laisser le
                // navigateur faire son travail évite un double appel de
                // handleInput pour le même appui. Seuls les éléments non
                // nativement interactifs (les <g> SVG des autres plateaux)
                // ont besoin de ce relais clavier manuel.
                if (target.tagName === 'BUTTON') return;
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

        // Collection
        const btnOpenCollection = get('btn-open-collection');
        if (btnOpenCollection) btnOpenCollection.onclick = () => this.showCollectionScreen();

        // Espace parents
        const btnOpenParents = get('btn-open-parents');
        if (btnOpenParents) btnOpenParents.onclick = () => this.openParentsGate();
        const btnChangeParentPin = get('btn-parents-change-pin');
        if (btnChangeParentPin) btnChangeParentPin.onclick = () => this.promptChangeParentPin();
        const btnExportData = get('btn-parents-export');
        if (btnExportData) btnExportData.onclick = () => this.exportParentData();
        const btnImportData = get('btn-parents-import');
        const importFileInput = get('parents-import-file');
        if (btnImportData && importFileInput) {
            btnImportData.onclick = () => importFileInput.click();
            importFileInput.onchange = () => this.importParentData(importFileInput);
        }
        const btnParentsProgram = get('btn-parents-program');
        if (btnParentsProgram) btnParentsProgram.onclick = () => this.showProgramOverview();
        const btnParentsProgramBack = get('btn-parents-program-back');
        if (btnParentsProgramBack) btnParentsProgramBack.onclick = () => UI.showScreen('screen-parents');
        const btnParentsGuide = get('btn-parents-guide');
        if (btnParentsGuide) btnParentsGuide.onclick = () => this.showGuide('screen-parents');
        const btnOpenGuide = get('btn-open-guide');
        if (btnOpenGuide) btnOpenGuide.onclick = () => this.showGuide('screen-profiles');
        const btnOpenGrimoire = get('btn-open-grimoire');
        if (btnOpenGrimoire) btnOpenGrimoire.onclick = () => this.showGrimoire();
        const btnOpenQuiz = get('btn-open-quiz');
        if (btnOpenQuiz) btnOpenQuiz.onclick = () => this.showQuizHome();
        const btnNews = get('btn-news');
        if (btnNews) btnNews.onclick = () => this.showNews();
        const btnNewsClose = get('btn-news-close');
        if (btnNewsClose) btnNewsClose.onclick = () => this.closeNews();
        const newsOverlay = get('news-overlay');
        if (newsOverlay) newsOverlay.onclick = (e) => { if (e.target === newsOverlay) this.closeNews(); };
        const btnParentsGuideBack = get('btn-parents-guide-back');
        if (btnParentsGuideBack) btnParentsGuideBack.onclick = () => this.leaveGuide();
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

    unlockSpeechSynthesisOnFirstInteraction() {
        if (!this.supportsSpeechSynthesis()) return;
        let unlocked = false;
        const unlock = () => {
            if (unlocked) return;
            unlocked = true;
            try {
                const utterance = new SpeechSynthesisUtterance(' ');
                utterance.volume = 0;
                window.speechSynthesis.speak(utterance);
            } catch (error) {
                console.warn("Déblocage audio impossible", error);
            }
            document.removeEventListener('pointerdown', unlock);
            document.removeEventListener('keydown', unlock);
        };
        document.addEventListener('pointerdown', unlock, { once: true });
        document.addEventListener('keydown', unlock, { once: true });
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
        return this.getVoiceForLang('fr');
    },

    // Sélectionne la meilleure voix disponible pour une langue donnée
    // ("fr" ou "en"). Centralise ici la logique déjà utilisée pour le
    // français afin qu'une future banque de dictée anglaise n'ait qu'à
    // appeler getVoiceForLang('en') sans dupliquer le classement de voix.
    getVoiceForLang(lang) {
        if (!this.supportsSpeechSynthesis()) return null;
        const langCode = (lang || 'fr').toString().toLowerCase();
        const langNamePattern = langCode === 'en' ? /english/i : /french|fran[çc]ais/i;
        const voices = window.speechSynthesis.getVoices?.() || [];
        const matchingVoices = voices.filter((voice) =>
            new RegExp(`^${langCode}(-|_)`, 'i').test(voice.lang || '') || langNamePattern.test(voice.name || '')
        );
        if (!matchingVoices.length) return null;

        const preferredNames = langCode === 'en'
            ? [/samantha/i, /karen/i, /daniel/i, /moira/i, /tessa/i]
            : [/hortense/i, /denise/i, /amelie/i, /audrey/i, /brigitte/i, /thomas/i, /paul/i];
        const preferredLocale = langCode === 'en' ? 'en-us' : 'fr-fr';

        const ranked = [...matchingVoices].sort((a, b) => {
            const score = (voice) => {
                let value = 0;
                if ((voice.lang || '').toLowerCase() === preferredLocale) value += 5;
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
        const lang = (problem.data?.lang || 'fr').toString().toLowerCase();
        const baseRate = Number.isFinite(Number(problem.data?.speechRate)) ? Number(problem.data.speechRate) : 0.72;
        const multiplier = Storage.getSpeechRateMultiplier();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'en' ? 'en-US' : 'fr-FR';
        utterance.rate = Math.min(2, Math.max(0.4, baseRate * multiplier));
        utterance.pitch = Number.isFinite(Number(problem.data?.speechPitch)) ? Number(problem.data.speechPitch) : 1.15;
        utterance.volume = Number.isFinite(Number(problem.data?.speechVolume)) ? Number(problem.data.speechVolume) : 0.9;
        const voice = this.getVoiceForLang(lang);
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
            const evolution = Storage.getAvatarEvolutionState(currentUser);
            UI.renderHeaderAvatar({
                avatar: evolution.emoji,
                cardImage: this._cardAvatarImage(appearance.cardAvatar, () => this.applyVisualContext()),
                prestigeTier: evolution.prestigeTier,
                accessoryEmoji: Storage.getAccessoryEmoji(currentUser)
            });
        } else {
            UI.renderHeaderAvatar(null);
        }
    },

    // Image d'une carte choisie comme avatar. Synchrone via le cache du
    // catalogue ; si le catalogue n'est pas encore chargé, déclenche son
    // chargement puis rappelle onReady pour re-rendre l'écran concerné.
    _cardAvatarImage(cardId, onReady) {
        if (!cardId) return null;
        const catalog = this._cardsCatalogCache;
        if (!catalog) {
            if (typeof onReady === 'function') {
                this.getCardsCatalog().then(() => onReady());
            }
            return null;
        }
        return (catalog.cards || []).find((c) => c.id === cardId)?.image || null;
    },

    applyPreferences() {
        const appShell = document.getElementById('app');
        if (!appShell) return;
        appShell.classList.toggle('theme-dark', Storage.getPreference('dark_mode'));
        appShell.classList.toggle('reduced-motion', Storage.getPreference('reduced_motion'));
        appShell.classList.toggle('quiet-mode', Storage.getPreference('quiet_mode'));
    },

    toggleDarkMode() {
        Storage.setPreference('dark_mode', !Storage.getPreference('dark_mode'));
        this.applyPreferences();
    },

    toggleReducedMotion() {
        Storage.setPreference('reduced_motion', !Storage.getPreference('reduced_motion'));
        this.applyPreferences();
    },

    toggleQuietMode() {
        Storage.setPreference('quiet_mode', !Storage.getPreference('quiet_mode'));
        this.applyPreferences();
    },

    toggleSoundMuted() {
        Storage.setPreference('sound_muted', !Storage.getPreference('sound_muted'));
    },

    goHome() {
        this.stopCurrentExercise();
        UI.closeNavSheet?.(false);
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

    getNavUiState(screenId = document.querySelector('.screen.active, .screen.active--back')?.id || 'screen-profiles') {
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
        const currentScreen = document.querySelector('.screen.active, .screen.active--back')?.id || '';
        if (currentScreen !== 'screen-game') return true;
        return confirm("Quitter cet exercice et perdre la progression en cours ?");
    },

    openNavMenu() {
        const currentScreen = document.querySelector('.screen.active, .screen.active--back')?.id || '';
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
                    this.stopCurrentExercise();
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
            title: 'Espace parents',
            subtitle: 'Suivi de progression protégé par code',
            onSelect: () => {
                if (!this.confirmLeaveExercise()) return;
                this.openParentsGate();
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

        actions.push({
            title: Storage.getPreference('quiet_mode') ? 'Réactiver la gamification' : 'Mode sans distraction',
            subtitle: 'Masquer badges, confettis et défi du jour',
            onSelect: () => this.toggleQuietMode()
        });

        actions.push({
            title: 'Mettre à jour l\'application',
            subtitle: (typeof window.APP_VERSION === 'string' ? `Version actuelle : ${window.APP_VERSION} — ` : '') + 'forcer le téléchargement des dernières nouveautés',
            onSelect: () => this.forceAppUpdate()
        });

        UI.openNavSheet?.(actions);
    },

    /**
     * Force la vérification d'une nouvelle version : utile sur iOS/Safari où
     * le service worker peut rester "coincé" sur une ancienne version tant
     * que l'utilisateur ne ferme/relance pas vraiment l'app (un simple
     * raccourci d'écran d'accueil ne suffit pas toujours à déclencher ça).
     */
    async forceAppUpdate() {
        if (!('serviceWorker' in navigator) || window.location.protocol === 'file:') {
            alert("La mise à jour automatique n'est pas disponible dans ce mode d'affichage. Ferme complètement l'application puis rouvre-la.");
            return;
        }

        try {
            const registration = await navigator.serviceWorker.getRegistration();
            if (!registration) {
                window.location.reload();
                return;
            }

            // Un nouveau worker mis à jour passe d'abord par "installing" puis
            // "installed" avant d'apparaître dans registration.waiting : on
            // écoute ce cycle plutôt que de vérifier "waiting" juste après
            // update(), sinon on arrive trop tôt (le téléchargement du
            // précache n'est pas encore terminé).
            let detectedUpdate = false;
            const onUpdateFound = () => {
                const worker = registration.installing;
                if (!worker) return;
                detectedUpdate = true;
                worker.addEventListener('statechange', () => {
                    if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                        worker.postMessage({ type: 'SKIP_WAITING' });
                    }
                });
            };
            registration.addEventListener('updatefound', onUpdateFound);

            await registration.update();

            // Laisse le temps à "updatefound" de se déclencher si une nouvelle
            // version existe (l'événement est synchrone dès que update()
            // détecte une différence, donc un court délai suffit à le capter).
            await new Promise((resolve) => setTimeout(resolve, 300));
            registration.removeEventListener('updatefound', onUpdateFound);

            if (registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                return; // Le rechargement est déclenché par "controllerchange" (bootstrap.js).
            }

            if (!detectedUpdate) {
                UI.showSimpleToast?.('✅', 'Tu as déjà la dernière version !');
            }
        } catch (error) {
            console.error('forceAppUpdate a échoué', error);
            alert("Impossible de vérifier les mises à jour pour le moment. Vérifie ta connexion et réessaie.");
        }
    },

    returnToThemes() {
        this.stopCurrentExercise();

        const grade = this.state.currentGrade;
        if (!grade) {
            return this.goHome();
        }

        const wasEveningRitual = this.state.currentLessonOrigin === 'evening' || this.state.currentLessonOrigin === 'mission';
        this.state.currentTheme = null;
        this.state.currentLessonOrigin = null;
        this.state.currentExercise = null;
        this.state.currentExerciseData = null;
        this.state.problemData = null;
        this.state.userInput = "";
        this.applyVisualContext();
        UI.updateHeader(`${grade.title || grade.gradeId || "Classe"}`);
        if (wasEveningRitual) {
            this.showBrowseModeMenu();
            return;
        }
        if ((this.state.currentBrowseMode || 'exercises') === 'lessons') {
            this.openLessonLibrary();
            return;
        }
        this.openGradeContent();
    },

    /**
     * Leçon à proposer après un exercice raté. On ouvrait toujours lessons[0],
     * donc sur un sous-thème à plusieurs leçons l'enfant tombait souvent sur
     * une notion sans rapport avec ce qu'il venait de manquer.
     * Priorité : leçon pas encore comprise > leçon liée à l'exercice (id ou
     * titre) > première leçon. Le tout sans jamais renvoyer null si une
     * leçon existe.
     */
    pickLessonToReview(lessons, exercise) {
        const safeLessons = Array.isArray(lessons) ? lessons.filter(Boolean) : [];
        if (safeLessons.length <= 1) return safeLessons[0] || null;

        const gradeId = this.state.currentGrade?.gradeId;
        const notUnderstood = gradeId
            ? safeLessons.filter((l) => !Storage.isLessonCompleted(gradeId, l.id))
            : safeLessons;
        const pool = notUnderstood.length ? notUnderstood : safeLessons;

        // Rapprochement souple par mots-clés du titre de l'exercice : les ids
        // n'ont pas de convention commune entre leçons et exercices. On compare
        // des radicaux (pluriels/accords : "soustractions" doit matcher
        // "soustraction"), d'où la troncature à 5 lettres minimum.
        const stem = (w) => w.slice(0, Math.max(5, w.length - 2));
        const words = String(exercise?.title || '')
            .toLowerCase()
            .split(/[^a-zà-ÿ0-9]+/)
            .filter((w) => w.length > 3)
            .map(stem);
        if (words.length) {
            const matched = pool.find((l) => {
                const hay = `${l.id || ''} ${l.title || ''} ${l.subtitle || ''}`.toLowerCase();
                return words.some((w) => hay.includes(w));
            });
            if (matched) return matched;
        }
        return pool[0];
    },

    reviewThemeLessons() {
        const lessons = Array.isArray(this.state.currentTheme?.lessons) ? this.state.currentTheme.lessons : [];
        if (!lessons.length) return;
        const target = this.pickLessonToReview(lessons, this.state.currentExercise);
        if (!target) return;
        this.state.currentLessonOrigin = 'theme';
        this.startLesson(target);
    },

    async goBack() {
        if (this._goBackInFlight) return;
        if (!this.confirmLeaveExercise()) return;
        this._goBackInFlight = true;
        UI.closeNavSheet?.(false);
        const wasChampionMode = !!this.state.championMode;
        const currentScreen = document.querySelector('.screen.active, .screen.active--back')?.id;
        this.stopCurrentExercise();
        const actions = {
            'screen-progress': () => UI.showScreen('screen-mode'),
            'screen-collection': () => UI.showScreen('screen-progress'),
            'screen-parents-pin': () => this.renderProfilesScreen(),
            'screen-parents': () => this.renderProfilesScreen(),
            'screen-parents-program': () => UI.showScreen('screen-parents'),
            'screen-parents-guide': () => this.leaveGuide(),
            'screen-grimoire': () => {
                this.refreshCoinsDisplays();
                UI.showScreen('screen-grades');
            },
            'screen-champion-setup': () => UI.showScreen('screen-mode'),
            'screen-champion-results': () => UI.showScreen('screen-mode'),
            'screen-quiz-home': () => {
                this.state.quiz = null;
                UI.showScreen('screen-grades');
            },
            'screen-quiz-play': () => {
                this.state.quiz = null;
                this.showQuizHome();
            },
            'screen-quiz-results': () => this.showQuizHome(),
            'screen-profile-customize': () => {
                this.state.customizingProfile = null;
                this.renderProfilesScreen();
            },
            'screen-game': () => {
                if (wasChampionMode) {
                    UI.showScreen('screen-champion-setup');
                    return;
                }
                if (this.state.currentLessonOrigin === 'evening' || this.state.currentLessonOrigin === 'mission') {
                    UI.showScreen('screen-mode');
                    return;
                }
                if (this.state.currentLessonOrigin === 'library') {
                    this.openLessonLibrary();
                    return;
                }
                this.showExercisesScreen();
            },
            'screen-lesson': () => {
                if (this.state.currentLessonOrigin === 'evening') {
                    UI.showScreen('screen-mode');
                    return;
                }
                if (this.state.currentLessonOrigin === 'library') {
                    UI.showScreen('screen-library');
                    return;
                }
                this.showExercisesScreen();
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

        // Tout showScreen() déclenché pendant goBack() (direct, ou via une
        // méthode intermédiaire comme renderProfilesScreen/showQuizHome —
        // certaines sont async) doit glisser depuis la gauche : on
        // intercepte l'appel le temps de cette exécution plutôt que de
        // propager 'back' à chaque site.
        const originalShowScreen = UI.showScreen.bind(UI);
        UI.showScreen = (id, direction = 'back') => originalShowScreen(id, direction);
        try {
            if (actions[currentScreen]) await actions[currentScreen]();
            else await this.renderProfilesScreen();
        } finally {
            UI.showScreen = originalShowScreen;
            this._goBackInFlight = false;
        }
    },

    // --- GESTION DES PROFILS ---

    async createProfile() {
        const el = document.getElementById('new-profile-name');
        const name = el?.value || "";
        const result = Storage.addProfile(name);

        if (result?.ok) {
            Storage.setCurrentUser(result.cleanName);
            if (el) el.value = "";
            this.setProfileFormCollapsed(true);
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

    /**
     * Replie/déplie le formulaire de création de profil. Le dépli au tap
     * (avec focus clavier) est géré dans bootstrap.js pour rester dans le
     * geste utilisateur exigé par iOS ; ici on gère les états programmés.
     */
    setProfileFormCollapsed(collapsed) {
        const form = document.getElementById('profile-form');
        const toggle = document.getElementById('btn-new-profile-toggle');
        if (form) form.classList.toggle('is-collapsed', collapsed);
        if (toggle) toggle.hidden = !collapsed;
        if (collapsed) window.dnResetProfileKeyboard?.();
    },

    renderProfilesScreen() {
        UI.updateHeader("Devoir Numérique");
        UI.renderHeaderAvatar(null);
        UI.showScreen('screen-profiles');
        const names = Storage.getProfiles();
        // Sans aucun profil, on montre directement le champ prénom : pas de
        // clavier automatique possible (hors geste), mais rien à découvrir.
        this.setProfileFormCollapsed((names || []).length > 0);
        const accentChoices = Storage.getAccentChoices();
        let needsCatalog = false;
        const profiles = (names || []).map(n => {
            const appearance = Storage.getProfileAppearance(n);
            const accentColor = accentChoices.find((entry) => entry.id === appearance.accent)?.color || null;
            if (appearance.cardAvatar && !this._cardsCatalogCache) needsCatalog = true;
            const cardImage = this._cardAvatarImage(appearance.cardAvatar);
            return { id: n, name: n, avatar: appearance.avatar, cardImage, accent: appearance.accent, accentColor, onEdit: (p) => this.showProfileCustomize(p) };
        });
        // Un profil au moins a un avatar-carte et le catalogue n'est pas
        // encore en cache : on le charge puis on re-rend l'écran (une fois).
        if (needsCatalog) {
            this.getCardsCatalog().then(() => this.renderProfilesScreen());
        }
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

    async renderProfileCustomizeScreen(profile) {
        const current = Storage.getProfileAppearance(profile.name);
        // Cartes possédées = choix d'avatar possibles (triées par rareté
        // décroissante : les plus belles d'abord)
        const catalog = await this.getCardsCatalog();
        const owned = Storage.getOwnedCards(profile.name);
        const rarityRank = { brillante: 0, legendaire: 1, epique: 2, rare: 3, commune: 4 };
        const cardChoices = (catalog.cards || [])
            .filter((c) => owned[c.id])
            .sort((a, b) => (rarityRank[a.rarity] ?? 9) - (rarityRank[b.rarity] ?? 9) || (a.stage || 0) - (b.stage || 0))
            .map((c) => ({ id: c.id, name: c.name, image: c.image, rarity: c.rarity }));
        UI.renderProfileCustomize({
            profileName: profile.name,
            totalStars: Storage.getTotalStars(profile.name),
            hasStarter: Storage.hasAvatarStarter(profile.name),
            starters: Storage.getAvatarStarterChoices(),
            evolution: Storage.getAvatarEvolutionState(profile.name),
            accents: Storage.getAccentChoicesWithUnlock(profile.name),
            accessories: Storage.getAccessoryChoicesWithUnlock(profile.name),
            cardChoices,
            current
        }, {
            onChooseStarter: (starterId) => {
                Storage.chooseAvatarStarter(starterId, profile.name);
                this.renderProfileCustomizeScreen(profile);
            },
            onEvolve: (childId) => {
                Storage.evolveAvatarTo(childId, profile.name);
                this.renderProfileCustomizeScreen(profile);
            },
            onChangeAccent: (accent) => {
                Storage.setProfileAppearance(profile.name, { accent });
            },
            onChangeAccessory: (accessory) => {
                Storage.setProfileAppearance(profile.name, { accessory });
            },
            onChangeCardAvatar: (cardAvatar) => {
                Storage.setProfileAppearance(profile.name, { cardAvatar });
            }
        }, () => {
            this.state.customizingProfile = null;
            this.renderProfilesScreen();
            UI.showScreen('screen-profiles');
        });
    },

    showProfileCustomize(profile) {
        this.state.customizingProfile = profile.name;
        this.renderProfileCustomizeScreen(profile);
        UI.showScreen('screen-profile-customize');
    },

    // --- CHARGEMENT DES DONNÉES ---

    async loadGradesMenu() {
        try {
            const user = Storage.getCurrentUser() || "Invité";
            UI.updateHeader(`Joueur : ${user}`);
            
            const d = await this.fetchJson(['data/index.json', './data/index.json']);
            const check = window.Validators?.validateIndexData(d);
            if (check && !check.valid) throw new Error(check.reason);
            this.applyVisualContext();
            UI.renderMenu('grades-list', d.grades, (g) => this.loadGrade(g));
            const coinsEl = document.getElementById('grimoire-entry-coins');
            if (coinsEl) coinsEl.textContent = `🪙 ${Storage.getCoins()}`;
            UI.renderStreakBanner(Storage.getStreak(), Storage.getPreference('quiet_mode'));
            this.refreshNewsBadge();
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

        UI.renderDailyChallenge(Storage.getCurrentUser() ? Storage.getDailyChallenge() : null);
        UI.renderTodayRecap(
            Storage.getCurrentUser() ? Storage.getTodayActivity() : null,
            Storage.getAvatarEvolutionState()?.emoji || '🦉'
        );

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

        if (this.getEveningRitualSubthemes().length > 0) {
            modes.push({
                id: 'browse-evening',
                mode: 'evening',
                icon: '🌙',
                title: 'Rituel du soir',
                subtitle: 'Une leçon courte + 1 exercice, 5 minutes',
                helper: 'Un petit moment calme avant de se coucher.'
            });
        }

        const weakCount = this.getWeakExercises().length;
        if (weakCount > 0) {
            modes.push({
                id: 'browse-mission',
                mode: 'mission',
                icon: '🎯',
                title: 'Mission rattrapage',
                subtitle: `${weakCount} exercice${weakCount > 1 ? 's' : ''} à transformer en réussite`,
                helper: 'Je retente un exercice difficile pour devenir plus fort.'
            });
        }

        UI.renderBrowseModes(modes, (entry) => this.selectBrowseMode(entry.mode));
        UI.showScreen('screen-mode');
    },

    /**
     * Sous-thèmes éligibles au rituel du soir : il faut au moins une leçon
     * ET au moins un exercice non-bonus, pour pouvoir enchaîner les deux à la
     * suite sans dépendre du Mode Champions (qui mélange tout, trop excitant
     * pour un rituel calme avant le coucher).
     */
    getEveningRitualSubthemes() {
        const grade = this.state.currentGrade;
        if (!grade || !this.currentGradeUsesSubjects()) return [];

        const result = [];
        (grade.subjects || []).forEach((subject) => {
            (subject?.subthemes || []).forEach((subtheme) => {
                const lessons = Array.isArray(subtheme?.lessons) ? subtheme.lessons : [];
                const exercises = (Array.isArray(subtheme?.exercises) ? subtheme.exercises : [])
                    .filter((exercise) => !exercise.isBonus && this.hasRunnableExercise(exercise));
                if (lessons.length > 0 && exercises.length > 0) {
                    result.push({ subject, subtheme, lessons, exercises });
                }
            });
        });
        return result;
    },

    startEveningRitual() {
        const candidates = this.getEveningRitualSubthemes();
        if (!candidates.length) {
            alert("Aucun rituel du soir disponible pour ce niveau.");
            return;
        }
        const picked = candidates[Math.floor(Math.random() * candidates.length)];
        const lesson = picked.lessons[Math.floor(Math.random() * picked.lessons.length)];
        const exercise = picked.exercises[Math.floor(Math.random() * picked.exercises.length)];

        this.state.currentSubject = picked.subject;
        this.state.currentTheme = picked.subtheme;
        this.state.currentLessonOrigin = 'evening';
        this.state.eveningRitualExercise = exercise;
        this.applyVisualContext();

        UI.renderLesson(lesson, () => {
            const nextExercise = this.state.eveningRitualExercise;
            this.state.eveningRitualExercise = null;
            if (nextExercise) this.startExercise(nextExercise);
        }, {
            themeTitle: picked.subtheme?.title || '',
            subjectTitle: picked.subject?.title || '',
            lessons: [],
            exerciseCount: 1,
            summaryText: "Lis cette leçon calmement, puis termine avec un seul petit exercice avant de te coucher."
        });
        UI.showScreen('screen-lesson');
    },

    /**
     * Exercices "à rattraper" : déjà tentés mais jamais réussis à 50 % —
     * le même seuil que "à réviser" côté parents. Alimente la Mission
     * rattrapage, qui transforme la remédiation en défi positif.
     */
    getWeakExercises() {
        const grade = this.state.currentGrade;
        if (!grade || !grade.gradeId) return [];
        const subjects = Array.isArray(grade?.subjects) ? grade.subjects : [];

        const result = [];
        (subjects || []).forEach((subject) => {
            (subject?.subthemes || []).forEach((subtheme) => {
                (subtheme?.exercises || []).forEach((exercise) => {
                    if (exercise.isBonus) return;
                    if (!this.hasRunnableExercise(exercise)) return;
                    const record = Storage.getRecord(exercise.id, grade.gradeId);
                    if (!record) return;
                    if (Math.round(record.percent || 0) >= 50) return;
                    result.push({ exercise, subject, subtheme });
                });
            });
        });
        return result;
    },

    startMissionRattrapage() {
        const weak = this.getWeakExercises();
        if (!weak.length) {
            alert("Aucun exercice à rattraper : tout est déjà réussi, bravo !");
            return;
        }
        const picked = weak[Math.floor(Math.random() * weak.length)];
        this.state.currentSubject = picked.subject;
        this.state.currentTheme = picked.subtheme;
        this.state.currentLessonOrigin = 'mission';
        this.applyVisualContext();
        this.startExercise(picked.exercise);
    },

    /**
     * Liste tous les exercices "normaux" (hors bonus) du niveau en cours,
     * toutes matières confondues — utilisé par le Mode Champions pour piocher
     * des questions transverses.
     */
    getAllNormalExercises() {
        const grade = this.state.currentGrade;
        if (!grade) return [];
        const subjects = Array.isArray(grade?.subjects) ? grade.subjects : [];

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

    // --- NOUVEAUTÉS (pastille "quoi de neuf") ---
    // Incrémenter `version` à chaque nouveauté marquante : la pastille
    // réapparaît pour tous les profils qui ne l'ont pas encore consultée.
    newsItems: [
        { version: 1, icon: '🃏', text: "Le Grimoire : gagne des pièces et collectionne plus de 100 cartes magiques !" },
        { version: 1, icon: '🖼️', text: "Tes cartes en avatar : choisis ta préférée avec le bouton ✏️ de ton profil." },
        { version: 1, icon: '🧠', text: "Le Grand Quiz : 900 questions de culture générale — défie toute ta famille !" },
        { version: 1, icon: '📚', text: "Des centaines de nouvelles questions et leçons dans toutes les matières." },
        { version: 1, icon: '✍️', text: "En CM : le passé simple et l'atelier d'écriture font leur entrée !" }
    ],

    get latestNewsVersion() {
        return Math.max(...this.newsItems.map((n) => n.version));
    },

    refreshNewsBadge() {
        const pill = document.getElementById('btn-news');
        if (!pill) return;
        const unseen = Storage.getCurrentUser()
            && Storage.getLastSeenNewsVersion() < this.latestNewsVersion;
        pill.classList.toggle('is-hidden', !unseen);
    },

    showNews() {
        const overlay = document.getElementById('news-overlay');
        const list = document.getElementById('news-list');
        if (!overlay || !list) return;
        const lastSeen = Storage.getLastSeenNewsVersion();
        const items = this.newsItems.filter((n) => n.version > lastSeen);
        list.innerHTML = (items.length ? items : this.newsItems).map((n) => `
            <li class="news-item"><span class="news-item-icon" aria-hidden="true">${n.icon}</span><span>${UI._escapeText(n.text)}</span></li>
        `).join('');
        overlay.classList.remove('is-hidden');
        if (typeof this._newsFocusTrapCleanup === 'function') this._newsFocusTrapCleanup();
        this._newsFocusTrapCleanup = UI.trapOverlayFocus(overlay, () => this.closeNews());
    },

    closeNews() {
        const overlay = document.getElementById('news-overlay');
        if (overlay) overlay.classList.add('is-hidden');
        if (typeof this._newsFocusTrapCleanup === 'function') {
            this._newsFocusTrapCleanup();
            this._newsFocusTrapCleanup = null;
        }
        Storage.setLastSeenNewsVersion(this.latestNewsVersion);
        this.refreshNewsBadge();
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
        if (mode === 'evening') {
            this.startEveningRitual();
            return;
        }
        if (mode === 'mission') {
            this.startMissionRattrapage();
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

        const subjects = Array.isArray(grade?.subjects) ? grade.subjects : [];

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

        // "Mes exploits" : records personnels toutes classes confondues
        const perfectCount = Storage.getPerfectCount();
        const bestChampion = this.championDurations.reduce((best, duration) => {
            const top = Storage.getChampionScores(grade.gradeId, duration)[0]?.score || 0;
            return Math.max(best, top);
        }, 0);
        const feats = {
            bestStreak: streak.best || 0,
            totalStarsAllGrades: Storage.getTotalStars(),
            perfectCount,
            redemptions: Storage.getRedemptionCount(),
            badgesUnlocked: badges.filter((b) => b.unlocked).length,
            badgesTotal: badges.length,
            bestChampion
        };

        UI.renderProgressScreen({
            totalExercises,
            totalDone,
            totalStars,
            maxStars: totalExercises * 3,
            subjects: subjectRows,
            streak,
            badges,
            feats,
            toReview: toReview.slice(0, 8)
        }, (exerciseId) => {
            const exercise = this._progressExerciseIndex.get(exerciseId);
            if (exercise) this.startExercise(exercise);
        });
        UI.showScreen('screen-progress');
    },

    /**
     * Regroupe les leçons du niveau par matière. Chaque groupe expose son
     * entrée `section` (titre/soustitre affichés en tête de liste) et ses
     * entrées `lesson`, pour permettre à openLessonLibrary() de filtrer
     * l'affichage sur une seule matière via les pastilles.
     */
    getGradeLessonLibraryGroups() {
        const grade = this.state.currentGrade;
        if (!Array.isArray(grade?.subjects)) return [];

        const groups = [];
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
            groups.push({
                title: subjectTitle,
                icon: subjectIcon,
                section: {
                    kind: 'section',
                    title: subjectTitle,
                    subtitle: `${lessonEntries.length} leçon${lessonEntries.length > 1 ? 's' : ''} à relire`,
                    icon: subjectIcon
                },
                lessons: lessonEntries
            });
        }

        return groups;
    },

    openLessonLibrary() {
        const grade = this.state.currentGrade;
        if (!grade) return this.loadGradesMenu();

        const groups = this.getGradeLessonLibraryGroups();
        if (!groups.length) {
            alert("Aucune leçon disponible pour ce niveau.");
            return this.showBrowseModeMenu();
        }

        const title = document.querySelector('#screen-library h2');
        const lead = document.getElementById('library-lead');
        if (title) title.textContent = `Bibliothèque ${grade.title || grade.gradeId || ''}`.trim();

        this.state.libraryActiveSubject = null;
        const onSelectLesson = (entry) => {
            if (entry?.kind !== 'lesson') return;
            this.state.currentSubject = entry.__subject || null;
            this.state.currentTheme = entry.__theme || null;
            this.state.currentLessonOrigin = 'library';
            this.startLesson(entry);
        };

        const renderLibraryList = () => {
            const activeIndex = this.state.libraryActiveSubject;
            const activeGroups = Number.isInteger(activeIndex) ? [groups[activeIndex]] : groups;
            const entries = [];
            for (const group of activeGroups) entries.push(group.section, ...group.lessons);

            if (lead) {
                lead.textContent = Number.isInteger(activeIndex)
                    ? `Leçons de ${groups[activeIndex].title}.`
                    : "Choisis une leçon à revoir. Elles sont rangées par matière pour retrouver l'essentiel plus vite.";
            }

            UI.renderJumpBar('library-jumpbar', groups, activeIndex, (index) => {
                this.state.libraryActiveSubject = index;
                renderLibraryList();
                const screen = document.getElementById('screen-library');
                if (screen) screen.scrollTop = 0;
            });
            UI.renderMenu('library-list', entries, onSelectLesson);
        };

        renderLibraryList();
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

    /**
     * Affiche `screen-exercises` en garantissant que sa liste est rendue.
     * `showScreen` seul ne suffit pas : le conteneur n'est peuplé que par
     * renderThemeContent, et une leçon ouverte depuis la bibliothèque n'y est
     * jamais passée — l'écran s'affichait alors vide sous son titre statique.
     * Sans thème courant, on remonte au menu plutôt que d'afficher du vide.
     */
    showExercisesScreen(mode) {
        if (!this.state.currentTheme) {
            this.showBrowseModeMenu();
            return;
        }
        this.renderThemeContent(mode || this.state.currentBrowseMode || 'exercises');
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

    /**
     * Exercice à enchaîner après une leçon : on privilégie ce qui n'a jamais
     * été tenté, sinon le record le plus faible (réviser ce qui coince).
     * Généralise le choix que faisait déjà le Rituel du soir au hasard.
     */
    getFollowUpExerciseFor(theme) {
        const exercises = Array.isArray(theme?.exercises) ? theme.exercises : [];
        if (!exercises.length) return null;
        const gradeId = this.state.currentGrade?.gradeId || null;

        let best = null;
        for (const exercise of exercises) {
            const record = Storage.getRecord(exercise.id, gradeId);
            const percent = record ? (record.percent || 0) : -1; // jamais tenté = priorité
            if (!best || percent < best.percent) best = { exercise, percent };
        }
        return best?.exercise || null;
    },

    /**
     * Récompense d'une leçon comprise. Volontairement en pièces et badges,
     * jamais en étoiles : les étoiles sont dérivées des records d'exercice
     * (Storage._sumStars), y toucher fausserait les badges de maîtrise.
     * completeLessonView garantit le one-shot (pas de farm par relecture).
     */
    onLessonCompleted(lesson, result = {}) {
        const gradeId = this.state.currentGrade?.gradeId;
        if (!gradeId || !lesson?.id) return;

        const badgesBefore = Storage.getBadges();
        const { justCompleted } = Storage.completeLessonView(gradeId, lesson.id, {
            subjectId: this.state.currentSubject?.id,
            subthemeId: this.state.currentTheme?.id,
            quizScore: result.score
        });
        if (!justCompleted) return;

        // Comprendre une leçon est une vraie activité du jour : elle nourrit la
        // série au même titre qu'un exercice, sinon on dirait à l'enfant que
        // les leçons comptent tout en les excluant de sa série.
        // On n'appelle PAS recordDailyActivity : il incrémente `attempts`, le
        // compteur d'exercices tentés du tableau de bord parent.
        const streakResult = Storage.recordSessionActivity();

        // Le défi avance avant la relecture des badges : le compléter peut
        // lui-même débloquer un badge (dont ceux de série), qui doit être
        // compté dans newBadges.
        const challengeResult = Storage.recordDailyChallengeLesson();
        const newBadges = Storage.getNewlyUnlockedBadges(badgesBefore);
        let coinsEarned = this.lessonCoinReward + newBadges.length * 5;
        if (challengeResult?.justCompleted) coinsEarned += 3;
        Storage.addCoins(coinsEarned);
        this.refreshCoinsDisplays();

        // Même ordonnancement que showFinalResults : showSimpleToast retire le
        // toast visible, on espace donc de 3500 ms (durée de vie : 3200 ms).
        if (this._badgeToastTimers) this._badgeToastTimers.forEach((id) => clearTimeout(id));
        this._badgeToastTimers = [];

        // Le gain est toujours annoncé, y compris quand le défi du jour tombe
        // en même temps : sinon l'enfant voit "Défi réussi" sans savoir ce que
        // la leçon lui a rapporté.
        UI.showSimpleToast('🧠', `Leçon comprise ! +${coinsEarned} pièces`);
        let delay = 3500;
        if (challengeResult?.justCompleted) {
            const t = setTimeout(() => UI.showSimpleToast('🎉', 'Défi du jour réussi !'), delay);
            this._badgeToastTimers.push(t);
            delay += 3500;
        }
        if (streakResult?.isNewDay && streakResult.current > 1) {
            const t = setTimeout(() => UI.showStreakToast(streakResult.current), delay);
            this._badgeToastTimers.push(t);
            delay += 3500;
        }
        newBadges.forEach((badge, i) => {
            const t = setTimeout(() => {
                UI.showSimpleToast(badge.icon, `Nouveau badge : ${badge.label} !`);
            }, delay + i * 3500);
            this._badgeToastTimers.push(t);
        });
    },

    // Pièces d'une leçon comprise (une seule fois). Volontairement modeste
    // face aux 20 pièces d'un booster : ~7 exercices parfaits restent la
    // source principale. Voir docs/grimoire-economy.md.
    lessonCoinReward: 2,

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
        const gradeId = this.state.currentGrade?.gradeId;
        const followUp = this.getFollowUpExerciseFor(theme);

        if (gradeId) {
            Storage.recordLessonView(gradeId, lesson.id, {
                subjectId: this.state.currentSubject?.id,
                subthemeId: theme?.id
            });
        }

        const lessonLead = document.getElementById('lesson-lead');
        if (lessonLead) {
            lessonLead.textContent = followUp
                ? "Lis l'essentiel, réponds aux 2 questions, puis enchaîne sur un exercice."
                : "Lis l'essentiel de la leçon comme un rappel de cours, puis reviens au sous-thème.";
        }

        // Le bouton de fin ne doit JAMAIS être sans effet : on enchaîne sur un
        // exercice quand il y en a un, sinon on revient à un écran utile selon
        // l'origine (bibliothèque vs sous-thème).
        const onContinue = () => {
            if (followUp) {
                this.startExercise(followUp);
                return;
            }
            if (this.state.currentLessonOrigin === 'library') {
                this.openLessonLibrary();
                return;
            }
            this.showExercisesScreen('exercises');
        };

        UI.renderLesson(lesson, onContinue, {
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
            alreadyCompleted: gradeId ? Storage.isLessonCompleted(gradeId, lesson.id) : false,
            ctaLabel: followUp ? "JE M'ENTRAÎNE" : (this.state.currentLessonOrigin === 'library' ? 'AUTRE LEÇON' : 'CONTINUER'),
            onLessonCompleted: (result) => this.onLessonCompleted(lesson, result),
            summaryText: followUp
                ? `Retiens l'idée essentielle et les mots-clés, vérifie que tu as compris, puis enchaîne sur un exercice.`
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

        // Reset propre de l'état
        this.state.currentExercise = e;
        this.state.currentExerciseMapSvg = mapSvg;
        this.state.currentExerciseData = exerciseData;
        this.state.currentQuestion = 0;
        this.state.score = 0;
        this.state.userInput = "";
        this.state.problemData = null;
        this.state.targetAnswer = null;
        this.state.isValidating = false; // VERROU : on déverrouille au début
        this.state.usedQuestionsSet = new Set();
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
        
        // Exécution sécurisée du moteur
        const cfg = {
            ...(this.state.currentExercise.params || {}),
            dataSet: this.state.currentExerciseData,
            mapSvg: this.state.currentExerciseMapSvg || "",
            usedSet: this.state.usedQuestionsSet
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

        // 🔓 ON OUVRE LE VERROU POUR LA NOUVELLE QUESTION
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

        // --- CAS SPÉCIAL : Carré Magique ---
        if (val === 'card-click' && target) {
            const idx = parseInt(target.getAttribute('data-idx'));
            if (isNaN(idx) || !p.data) return;

            const d = p.data;
            if (!d.selectedIndices) d.selectedIndices = [];

            const pos = d.selectedIndices.indexOf(idx);
            if (pos > -1) {
                d.selectedIndices.splice(pos, 1);
            } else {
                // Le nombre de cases à choisir est fixé par solutionCount
                // (2 en CP, 3 dès CE2) : au-delà, un nouveau clic remplace la
                // première case choisie plutôt que de s'accumuler sans limite,
                // pour rester cohérent avec la consigne affichée à l'enfant.
                const maxSelection = d.solutionCount || 3;
                if (d.selectedIndices.length >= maxSelection) {
                    d.selectedIndices.shift();
                }
                d.selectedIndices.push(idx);
            }

            const sum = d.selectedIndices.reduce((acc, i) => acc + (Number(d.numbers[i]) || 0), 0);
            this.state.userInput = sum.toString();

            this.refreshUI();
            return;
        }

        // --- CAS SPÉCIAL : Frise chronologique ---
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

        // --- CAS SPÉCIAL : Appariement ---
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
            return this.handleBoardInput(val, p);
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

    /**
     * Gestion des interactions du plateau géométrie (visualType
     * 'geometry-board'), extraite de handleInput() : un plateau peut porter
     * des types très différents (d.boardKind), chacun avec son propre
     * préfixe de commande ('board-toggle-feature:', 'board-place-point:'...).
     * Dispatch par préfixe, un handler par cas plutôt qu'une cascade de if.
     */
    handleBoardInput(val, p) {
        const d = p.data;

        if (val === 'board-zoom-in' || val === 'board-zoom-out') {
            // Manipule le <svg> déjà monté directement (pas de refreshUI) :
            // un zoom doit rester instantané, pas re-générer tout le HTML.
            const problemZone = document.getElementById('math-problem');
            UI.zoomMap(problemZone, p, val === 'board-zoom-in' ? 1.5 : 1 / 1.5);
            return;
        }

        if (val === 'board-reset') {
            const resetStates = {
                'tap-features': { selectedIds: [] },
                'shape-classify': { selectedFigureId: null, assignments: {} },
                'point-on-grid': { point: null },
                'symmetry-complete': { placedPoints: [] },
                'fraction-build': { selectedSlices: [] },
                'angle-classify': { selectedId: null },
                'angle-measure': { selectedDegrees: null },
                'construction-report': { selectedIndex: null }
            };
            if (resetStates[d.boardKind]) d.userState = resetStates[d.boardKind];
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
            } else if (d.boardKind === 'fraction-build') {
                const slices = Array.isArray(d.userState?.selectedSlices) ? d.userState.selectedSlices : [];
                this.state.userInput = String(slices.length);
            } else if (d.boardKind === 'construction-report') {
                const index = d.userState?.selectedIndex;
                const point = Number.isInteger(index) && Array.isArray(d.candidates) ? d.candidates[index] : null;
                this.state.userInput = EnginesBoard.canonicalizePoint(point);
            }
            d.revealed = true;
            this.refreshUI();
            return this.validateAnswer();
        }

        if (val.startsWith('board-pick-angle:') && d.boardKind === 'angle-classify') {
            const bucketId = val.replace('board-pick-angle:', '');
            if (!d.userState) d.userState = { selectedId: null };
            d.userState.selectedId = bucketId;
            this.state.userInput = bucketId;
            d.revealed = true;
            this.refreshUI();
            return this.validateAnswer();
        }

        if (val.startsWith('board-pick-angle-degrees:') && d.boardKind === 'angle-measure') {
            const degrees = Number(val.replace('board-pick-angle-degrees:', ''));
            if (!Number.isFinite(degrees)) return;
            if (!d.userState) d.userState = { selectedDegrees: null };
            d.userState.selectedDegrees = degrees;
            this.state.userInput = String(degrees);
            d.revealed = true;
            this.refreshUI();
            return this.validateAnswer();
        }

        if (val.startsWith('board-pick-candidate:') && d.boardKind === 'construction-report') {
            if (d.revealed) return;
            const index = parseInt(val.replace('board-pick-candidate:', ''), 10);
            if (!Number.isInteger(index) || !Array.isArray(d.candidates) || !d.candidates[index]) return;
            if (!d.userState) d.userState = { selectedIndex: null };
            d.userState.selectedIndex = index;
            this.state.userInput = EnginesBoard.canonicalizePoint(d.candidates[index]);
            this.refreshUI();
            return;
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

        if (val.startsWith('board-flip-card:') && d.boardKind === 'memory-match') {
            if (d.locked) return;
            const cardId = val.replace('board-flip-card:', '');
            if (!d.userState) d.userState = { flippedIds: [], matchedPairIds: [] };
            if (!Array.isArray(d.userState.flippedIds)) d.userState.flippedIds = [];
            if (!Array.isArray(d.userState.matchedPairIds)) d.userState.matchedPairIds = [];

            const card = (d.cards || []).find((c) => c.id === cardId);
            if (!card) return;
            if (d.userState.matchedPairIds.includes(card.pairId)) return;
            if (d.userState.flippedIds.includes(cardId)) return;
            if (d.userState.flippedIds.length >= 2) return;

            d.userState.flippedIds.push(cardId);
            this.refreshUI();

            if (d.userState.flippedIds.length === 2) {
                const [firstId, secondId] = d.userState.flippedIds;
                const firstCard = d.cards.find((c) => c.id === firstId);
                const secondCard = d.cards.find((c) => c.id === secondId);
                const isMatch = firstCard && secondCard && firstCard.pairId === secondCard.pairId;

                d.locked = true;
                setTimeout(() => {
                    if (this.state.problemData !== p) return;
                    d.locked = false;
                    if (isMatch) {
                        d.userState.matchedPairIds.push(firstCard.pairId);
                    }
                    d.userState.flippedIds = [];

                    const total = Number(d.totalPairs) || 0;
                    if (total > 0 && d.userState.matchedPairIds.length === total) {
                        this.state.userInput = EnginesBoard.canonicalizeMatchedPairs(d.userState.matchedPairIds);
                        d.revealed = true;
                        this.refreshUI();
                        this.validateAnswer();
                        return;
                    }
                    this.refreshUI();
                }, isMatch ? 500 : 900);
            }
            return;
        }

        if (val.startsWith('board-toggle-slice:') && d.boardKind === 'fraction-build') {
            if (d.revealed) return;
            const sliceIndex = parseInt(val.replace('board-toggle-slice:', ''));
            if (isNaN(sliceIndex)) return;
            if (!d.userState) d.userState = { selectedSlices: [] };
            if (!Array.isArray(d.userState.selectedSlices)) d.userState.selectedSlices = [];
            const idx = d.userState.selectedSlices.indexOf(sliceIndex);
            if (idx > -1) d.userState.selectedSlices.splice(idx, 1);
            else d.userState.selectedSlices.push(sliceIndex);
            this.state.userInput = String(d.userState.selectedSlices.length);
            this.refreshUI();
            return;
        }
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
        // 🛑 ANTI-SPAM : Si déjà en cours, on arrête tout de suite
        if (this.state.isValidating) return;
        this.state.isValidating = true; // 🔒 On verrouille

        if (this.state.timer) clearTimeout(this.state.timer);
        
        const { userInput, targetAnswer, currentExercise, problemData } = this.state;
        if (!this.hasRunnableExercise(currentExercise) || !problemData) {
            this.state.isValidating = false;
            this.failSafeExit("L'exercice courant est dans un état incohérent.");
            return;
        }
        const ansZone = document.getElementById('user-answer');
        
        // 1. NETTOYAGE & TOLÉRANCE
        const clean = s => (s || "").toString().toLowerCase().trim().replace(/[’‘]/g, "'");
        let uInput = clean(userInput);
        let tAnswer = clean(targetAnswer);

        // Tolérance Tiret/Espace (ex: dictée nombres)
        if (problemData && problemData.data && problemData.data.allowNoHyphen) {
            uInput = uInput.replace(/-/g, " ").replace(/\s+/g, " ");
            tAnswer = tAnswer.replace(/-/g, " ").replace(/\s+/g, " ");
        }

        let isCorrect = false;
        if (hasAnswered) {
            isCorrect = (uInput === tAnswer);
            // Mots composés (spelling/audioSpelling) : le tiret/espace n'est
            // pas la compétence testée (c'est l'orthographe des lettres) —
            // on accepte "sous-marin", "sous marin" et "sousmarin" comme
            // équivalents, dans les deux sens (saisie et réponse attendue).
            if (!isCorrect && ['spelling', 'audioSpelling'].includes(problemData.visualType)) {
                const collapse = s => s.replace(/[-\s]+/g, " ").trim();
                const strip = s => s.replace(/[-\s]/g, "");
                isCorrect = collapse(uInput) === collapse(tAnswer) || strip(uInput) === strip(tAnswer);
            }
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
                    : (problemData.data?.orderedLabels || []).join("  →  ");
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
            // ⚠️ On ne déverrouille PAS ici, c'est fait au début de generateNextQuestion
        }, delay);
    },

    /**
     * Compare l'état avant/après un exercice pour détecter un déblocage
     * franchi pendant cette tentative (couleur, palier de prestige, ou
     * simplement "ton compagnon peut évoluer"). Priorité décroissante :
     * évolution > prestige > couleur, pour n'afficher qu'un seul toast.
     */
    getNewAvatarUnlockToast(starsBefore, starsAfter) {
        if (starsAfter <= starsBefore) return null;

        const evolutionAfter = Storage.getAvatarEvolutionState(Storage.getCurrentUser(), starsAfter);
        if (evolutionAfter.canEvolve) {
            const evolutionBefore = Storage.getAvatarEvolutionState(Storage.getCurrentUser(), starsBefore);
            if (!evolutionBefore.canEvolve) {
                return { icon: '🐾', text: 'Ton compagnon peut évoluer !' };
            }
        }

        const prestigeAfter = Storage.getAvatarPrestigeTier(starsAfter);
        const prestigeBefore = Storage.getAvatarPrestigeTier(starsBefore);
        if (prestigeAfter && prestigeAfter.id !== prestigeBefore?.id) {
            return { icon: '👑', text: `Nouveau niveau : ${prestigeAfter.label} !` };
        }

        const accents = Storage.getAccentChoicesWithUnlock();
        const newlyUnlockedAccent = accents.find((accent) => accent.unlockAt > starsBefore && accent.unlockAt <= starsAfter);
        if (newlyUnlockedAccent) {
            return { icon: '🎨', text: `Nouvelle couleur débloquée : ${newlyUnlockedAccent.label} !` };
        }

        return null;
    },

    showFinalResults() {
        const { score, currentGrade, currentExercise } = this.state;
        const total = this.getQuestionTarget(currentExercise);
        if (!total) {
            this.failSafeExit("Impossible d'afficher les résultats de cet exercice.");
            return;
        }
        
        // 🛡️ SÉCURITÉ SCORE : On s'assure que le score ne dépasse jamais le total
        const safeScore = Math.min(score, total);
        const percent = Math.round((safeScore / total) * 100);
        const starsBefore = Storage.getTotalStars();
        const badgesBefore = Storage.getBadges();

        // Contexte pour la réaction de la mascotte : record battu, exercice
        // "rattrapé" (était < 50 %, passe ≥ 75 %) — lu AVANT la sauvegarde.
        const previousRecord = (currentGrade && currentGrade.gradeId)
            ? Storage.getRecord(currentExercise.id, currentGrade.gradeId)
            : null;
        const previousPercent = previousRecord ? Math.round(previousRecord.percent || 0) : null;
        const isRecord = previousPercent !== null && percent > previousPercent;
        const isRedemption = previousPercent !== null && previousPercent < 50 && percent >= 75;

        if (currentGrade && currentGrade.gradeId) {
            const subject = Storage.canonicalizeSubjectId(this.state.currentSubject?.id);
            Storage.saveRecord(currentGrade.gradeId, currentExercise.id, safeScore, total, subject);
        }
        if (isRedemption) Storage.recordRedemption();
        const streakResult = Storage.recordSessionActivity();
        const challengeResult = Storage.recordDailyChallengeAttempt(safeScore === total);
        const starsEarned = (percent === 100 ? 3 : percent >= 75 ? 2 : percent >= 50 ? 1 : 0);
        Storage.recordDailyActivity(starsEarned);
        const unlockToast = this.getNewAvatarUnlockToast(starsBefore, Storage.getTotalStars());
        const newBadges = Array.isArray(badgesBefore) ? Storage.getNewlyUnlockedBadges(badgesBefore) : [];

        // Pièces du Grimoire (mode hybride) : étoiles + gros bonus sur les
        // accomplissements (défi du jour, rattrapage, nouveau badge).
        let coinsEarned = starsEarned;
        if (challengeResult?.justCompleted) coinsEarned += 3;
        if (isRedemption) coinsEarned += 5;
        coinsEarned += newBadges.length * 5;
        if (coinsEarned > 0) {
            Storage.addCoins(coinsEarned);
            this.refreshCoinsDisplays();
        }
        const coinsEl = document.getElementById('result-coins');
        if (coinsEl) {
            if (coinsEarned > 0) {
                coinsEl.textContent = `🪙 +${coinsEarned} pièce${coinsEarned > 1 ? 's' : ''} pour ton Grimoire !`;
                coinsEl.classList.remove('is-hidden');
            } else {
                coinsEl.classList.add('is-hidden');
            }
        }

        UI.renderStars(safeScore, total);
        UI.renderMascotReaction(percent, {
            isRecord,
            isRedemption,
            companionEmoji: Storage.getAvatarEvolutionState()?.emoji || null
        });
        UI.showScreen('screen-results');
        this.applyVisualContext();

        if (safeScore === total) {
            UI.launchCelebration(Storage.canonicalizeSubjectId(this.state.currentSubject?.id));
            if (window.AudioFeedback) AudioFeedback.playPerfect();
        }

        // Cancel any badge toasts still pending from a previous exercise
        if (this._badgeToastTimers) {
            this._badgeToastTimers.forEach((id) => clearTimeout(id));
        }
        this._badgeToastTimers = [];

        let priorToastShown = true;
        if (unlockToast) {
            UI.showSimpleToast(unlockToast.icon, unlockToast.text);
        } else if (challengeResult?.justCompleted) {
            UI.showSimpleToast('🎉', 'Défi du jour réussi !');
        } else if (streakResult && streakResult.isNewDay && streakResult.current > 1) {
            UI.showStreakToast(streakResult.current);
        } else {
            priorToastShown = false;
        }

        // Badge toasts: each badge needs its own slot so they don't clobber each other.
        // showSimpleToast auto-removes any visible toast — space them at 3500ms so the
        // previous one has finished its 3200ms lifetime before the next fires.
        if (newBadges.length > 0) {
            const firstDelay = priorToastShown ? 3500 : 400;
            newBadges.forEach((badge, i) => {
                const t = setTimeout(() => {
                    UI.showSimpleToast(badge.icon, `Nouveau badge : ${badge.label} !`);
                }, firstDelay + i * 3500);
                this._badgeToastTimers.push(t);
            });
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
            // On ouvre désormais UNE leçon ciblée (pickLessonToReview), pas la
            // liste : le libellé doit le dire, au singulier dans tous les cas.
            lessonLabel.textContent = percent < 50 ? 'RELIRE LA LEÇON' : 'REVOIR LA LEÇON';
        }
    }
};

window.App = App;
window.addEventListener('DOMContentLoaded', () => App.init());

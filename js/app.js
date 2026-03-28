/*
 * Devoir NumÃ©rique - App.js
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
        isValidating: false // ï¿½Y>' VERROU ANTI-DOUBLE CLIC
    },
    _initialized: false,

    async init() {
        if (this._initialized) return;
        this._initialized = true;
        console.log("Initialisation de l'application...");

        // 1. Chargement RÃ©silient de la BibliothÃ¨que
        try {
            const lib = await this.loadFrenchLibrary();
            const check = window.Validators?.validateFrenchLibrary(lib);
            if (check && !check.valid) throw new Error(check.reason);
            this.state.frenchLib = lib;
            console.log("Bibliotheque chargee.");
        } catch (e) { 
            console.warn("Mode offline restreint : bibliotheque absente.", e);
        }

        // 2. Initialisation UI sÃ©curisÃ©e
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

        // 4. DÃ©marrage
        this.renderProfilesScreen();
        console.log("Application prete.");
    },

    bindEvents() {
        const get = (id) => document.getElementById(id);

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

        // DÃ©lÃ©gation d'Ã©vÃ©nements pour la zone de jeu
        const gameZone = get('math-problem');
        if (gameZone) {
            gameZone.onclick = (e) => {
                const target = e.target.closest('[data-val]');
                if (target) this.handleInput(target.getAttribute('data-val'), target);
            };
        }

        // Navigation retour
        const btnRes = get('btn-results-menu');
        if (btnRes) btnRes.onclick = () => this.returnToThemes();
        const btnLesson = get('btn-results-lesson');
        if (btnLesson) btnLesson.onclick = () => this.reviewThemeLessons();
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
                if (!response.ok) throw new Error(`Erreur rï¿½seau ${path}`);
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
            throw new Error("Chargement impossible en mode fichier local sans donnï¿½es embarquï¿½es.");
        }

        throw lastError || new Error("Chargement JSON impossible");
    },

    stopCurrentExercise() {
        if (this.state.timer) {
            clearTimeout(this.state.timer);
            this.state.timer = null;
        }
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
            console.warn("Arrï¿½t audio impossible", error);
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
            /^fr(-|_)/i.test(voice.lang || '') || /french|fran[ï¿½c]ais/i.test(voice.name || '')
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
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = Number.isFinite(Number(problem.data?.speechRate)) ? Number(problem.data.speechRate) : 0.72;
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
        UI.updateHeader("Devoir Numï¿½rique");
        UI.showScreen('screen-profiles');
        this.renderProfilesScreen();
    },

    getNavUiState(screenId = document.querySelector('.screen.active')?.id || 'screen-profiles') {
        const isProfileRoot = screenId === 'screen-profiles';
        const isGame = screenId === 'screen-game';
        return {
            showBack: !isProfileRoot,
            backLabel: '?',
            backTitle: isGame ? 'Quitter cet exercice' : 'Retour',
            showMenu: !isProfileRoot,
            menuLabel: '?',
            menuTitle: 'Menu navigation'
        };
    },

    confirmLeaveExercise() {
        const currentScreen = document.querySelector('.screen.active')?.id;
        if (currentScreen !== 'screen-game') return true;
        return confirm("Quitter cet exercice et perdre la progression en cours ?");
    },

    goToGrades() {
        if (!this.confirmLeaveExercise()) return;
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
        this.loadGradesMenu();
    },

    openNavMenu() {
        const currentScreen = document.querySelector('.screen.active')?.id || '';
        const actions = [];

        if (currentScreen !== 'screen-profiles') {
            actions.push({
                title: '? Retour',
                subtitle: currentScreen === 'screen-game' ? "Revenir sans terminer l'exercice" : "ï¿½cran prï¿½cï¿½dent",
                onSelect: () => this.goBack()
            });
        }

        if (this.state.currentGrade) {
            actions.push({
                title: '?? Parcours',
                subtitle: 'Revenir ï¿½ la matiï¿½re / aux thï¿½mes',
                onSelect: () => {
                    if (!this.confirmLeaveExercise()) return;
                    this.returnToThemes();
                }
            });
            actions.push({
                title: '?? Changer de classe',
                subtitle: 'Revenir au choix de classe',
                onSelect: () => this.goToGrades()
            });
        }

        actions.push({
            title: '?? Changer de profil',
            subtitle: 'Retour ï¿½ la sï¿½lection des profils',
            variant: 'warning',
            onSelect: () => {
                if (!this.confirmLeaveExercise()) return;
                this.goHome();
            }
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
        this.stopCurrentExercise();
        UI.closeNavSheet?.();

        const currentScreen = document.querySelector('.screen.active')?.id;
        const actions = {
            'screen-game': () => UI.showScreen('screen-exercises'),
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
            empty: "Merci d'entrer un prï¿½nom.",
            invalid: "Ce prï¿½nom contient uniquement des caractï¿½res non autorisï¿½s.",
            too_short: "Merci d'entrer au moins 2 caractï¿½res.",
            duplicate: "Ce profil existe dï¿½jï¿½."
        };

        alert(messages[result?.code] || "Merci d'entrer un prï¿½nom valide.");
    },

    renderProfilesScreen() {
        UI.updateHeader("Devoir Numï¿½rique");
        UI.showScreen('screen-profiles');
        const names = Storage.getProfiles();
        const profiles = (names || []).map(n => ({ id: n, name: n, avatar: '\u{1F464}' }));
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

    // --- CHARGEMENT DES DONNï¿½?ES ---

    async loadGradesMenu() {
        try {
            const user = Storage.getCurrentUser() || "Invitï¿½";
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
            if (!Array.isArray(topLevelEntries) || topLevelEntries.length === 0) throw new Error("Aucun thï¿½me disponible.");
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
                icon: '??',
                title: "J'apprends",
                subtitle: `${lessonsCount} leï¿½on${lessonsCount > 1 ? 's' : ''} pour comprendre`,
                helper: 'Je dï¿½couvre la notion avec des exemples faciles.'
            });
        }

        if (exercisesCount > 0) {
            modes.push({
                id: 'browse-exercises',
                mode: 'exercises',
                icon: '??',
                title: "Je m'entraï¿½ne",
                subtitle: `${exercisesCount} exercice${exercisesCount > 1 ? 's' : ''} pour jouer et rï¿½ussir`,
                helper: "Je m'entraï¿½ne tout de suite."
            });
        }

        UI.renderBrowseModes(modes, (entry) => this.selectBrowseMode(entry.mode));
        UI.showScreen('screen-mode');
    },

    selectBrowseMode(mode) {
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

    getGradeLessonLibraryEntries() {
        const grade = this.state.currentGrade;
        if (!Array.isArray(grade?.subjects)) return [];

        const entries = [];
        for (const subject of grade.subjects) {
            const subjectTitle = subject?.title || 'Matiï¿½re';
            const subjectIcon = subject?.icon || '??';
            const subthemes = Array.isArray(subject?.subthemes) ? subject.subthemes : [];
            const lessonEntries = [];

            for (const subtheme of subthemes) {
                const lessons = Array.isArray(subtheme?.lessons) ? subtheme.lessons : [];
                for (const lesson of lessons) {
                    lessonEntries.push({
                        ...lesson,
                        kind: 'lesson',
                        icon: lesson.icon || subjectIcon,
                        subtitle: `${subtheme.title}${lesson.subtitle ? ` ï¿½ ${lesson.subtitle}` : ''}`,
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
                subtitle: `${lessonEntries.length} leï¿½on${lessonEntries.length > 1 ? 's' : ''} ï¿½ relire`
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
            alert("Aucune leï¿½on disponible pour ce niveau.");
            return this.showBrowseModeMenu();
        }

        const title = document.querySelector('#screen-library h2');
        const lead = document.getElementById('library-lead');
        if (title) title.textContent = `Bibliothï¿½que ${grade.title || grade.gradeId || ''}`.trim();
        if (lead) lead.textContent = "Choisis une leï¿½on ï¿½ revoir. Elles sont rangï¿½es par matiï¿½re pour retrouver l'essentiel plus vite.";

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
            const title = mode === 'lessons' ? "Choisis une matiÃ¨re pour apprendre" : "Choisis une matiÃ¨re pour t'entraÃ®ner";
            const screenTitle = document.querySelector('#screen-themes h2');
            if (screenTitle) screenTitle.textContent = title;
            if (themesLead) {
                themesLead.textContent = mode === 'lessons'
                    ? "Choisis une matiï¿½re pour dï¿½couvrir les notions calmement."
                    : "Choisis une matiï¿½re pour commencer tes exercices.";
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
        if (screenTitle) screenTitle.textContent = mode === 'lessons' ? 'Choisis une notion' : 'Choisis un thï¿½me';
        if (themesLead) {
            themesLead.textContent = mode === 'lessons'
                ? "Choisis la notion que tu veux comprendre."
                : "Choisis le thï¿½me sur lequel tu veux t'entraï¿½ner.";
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
                            ? `${this.countModeContent(subtheme, mode)} leï¿½on${this.countModeContent(subtheme, mode) > 1 ? 's' : ''}`
                            : `${this.countModeContent(subtheme, mode)} exercice${this.countModeContent(subtheme, mode) > 1 ? 's' : ''}`
                    }));

                if (!subthemes.length) return null;

                const total = subthemes.reduce((sum, subtheme) => sum + this.countModeContent(subtheme, mode), 0);
                return {
                    ...subject,
                    subthemes,
                    subtitle: mode === 'lessons'
                        ? `${total} leï¿½on${total > 1 ? 's' : ''} ï¿½ dï¿½couvrir`
                        : `${total} exercice${total > 1 ? 's' : ''} pour s'entraï¿½ner`
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
                    ? `${this.countModeContent(theme, mode)} leï¿½on${this.countModeContent(theme, mode) > 1 ? 's' : ''}`
                    : `${this.countModeContent(theme, mode)} exercice${this.countModeContent(theme, mode) > 1 ? 's' : ''}`
            }));
    },

    selectSubject(subject) {
        if (!subject || !Array.isArray(subject.subthemes) || subject.subthemes.length === 0) {
            alert("Cette matiï¿½re ne contient aucun sous-thï¿½me disponible.");
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
            screenTitle.textContent = mode === 'lessons' ? 'Choisis une notion ï¿½ dï¿½couvrir' : 'Choisis un sous-thï¿½me';
        }
        if (screenLead) {
            screenLead.textContent = mode === 'lessons'
                ? "Prends une notion simple et avance ï¿½ ton rythme."
                : "Choisis un sous-thï¿½me prï¿½cis pour pratiquer.";
        }
        UI.renderMenu('levels-list', subject.subthemes, (subtheme) => this.selectTheme(subtheme));
        UI.showScreen('screen-levels');
    },

    selectTheme(t) {
        const lessons = Array.isArray(t?.lessons) ? t.lessons : [];
        const exercises = Array.isArray(t?.exercises) ? t.exercises : [];
        if (!t || (lessons.length === 0 && exercises.length === 0)) {
            alert("Ce thï¿½me ne contient aucun contenu disponible.");
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
            screenTitle.textContent = activeMode === 'lessons' ? 'Choisis une leï¿½on' : 'Choisis un exercice';
        }
        if (screenLead) {
            screenLead.textContent = activeMode === 'lessons'
                ? `Dï¿½couvre ${theme?.title || 'la notion'} avant de t'entraï¿½ner.`
                : `Choisis un exercice sur ${theme?.title || 'ce sous-thï¿½me'}.`;
        }

        const entries = activeMode === 'lessons'
            ? lessons.map((lesson) => ({
                ...lesson,
                kind: 'lesson',
                subtitle: lesson.subtitle || 'Dï¿½couvrir la notion',
                icon: lesson.icon || '??'
            }))
            : exercises.map((exercise) => ({
                ...exercise,
                kind: 'exercise'
            }));

        UI.renderMenu('exercises-list', entries, (entry) => {
            if (entry.kind === 'lesson') this.startLesson(entry);
            else this.startExercise(entry);
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
            const subjectTitle = subject?.title || 'Matiï¿½re';
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
            alert("Leï¿½on indisponible.");
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
                ? `Lis l'essentiel, retiens les idï¿½es clï¿½s, puis passe aux ${exerciseCount} exercice${exerciseCount > 1 ? 's' : ''} du sous-thï¿½me.`
                : "Lis l'essentiel de la leï¿½on comme un rappel de cours, puis reviens au sous-thï¿½me.";
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
                ? `Retiens l'idï¿½e essentielle, l'exemple important et les mots-clï¿½s, puis passe aux ${exerciseCount} exercice${exerciseCount > 1 ? 's' : ''} du sous-thï¿½me.`
                : `Retiens l'idï¿½e essentielle et les mots-clï¿½s, puis reviens au sous-thï¿½me pour continuer.`
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

    serializeBoardState(problem) {
        const data = problem?.data || {};
        const state = data.userState || {};
        switch (data.boardKind) {
            case 'tap-features':
                return Array.isArray(state.selectedIds) ? [...state.selectedIds].sort().join('|') : '';
            case 'shape-classify':
                return Object.keys(state.assignments || {})
                    .sort()
                    .map((key) => `${key}:${state.assignments[key]}`)
                    .join('|');
            case 'point-on-grid':
                return Array.isArray(state.point) ? `${Number(state.point[0])},${Number(state.point[1])}` : '';
            case 'symmetry-complete':
                return Array.isArray(state.placedPoints)
                    ? state.placedPoints
                        .filter((point) => Array.isArray(point) && point.length === 2)
                        .map((point) => [Number(point[0]), Number(point[1])])
                        .sort((a, b) => a[0] - b[0] || a[1] - b[1])
                        .map((point) => `${point[0]},${point[1]}`)
                        .join('|')
                    : '';
            default:
                return '';
        }
    },

    shuffleProblemChoices(problem) {
        if (!problem || (problem.inputType !== 'qcm' && problem.inputType !== 'boolean')) return;
        const choices = problem.data?.choices || problem.choices;
        if (!Array.isArray(choices) || choices.length < 2) return;
        const shuffledChoices = this.shuffleArray(choices);

        if (problem.data?.choices) problem.data.choices = shuffledChoices;
        else problem.choices = shuffledChoices;
    },

    // --- LOGIQUE DE JEU (Remplace initGame) ---

    async startExercise(e) {
        if (!this.hasRunnableExercise(e)) {
            alert("Exercice indisponible : paramï¿½tres incomplets.");
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
                alert(`Impossible de charger les donnï¿½es de cet exercice.\n${error.message || ""}`.trim());
                return;
            }
        }

        // Reset propre de l'Ã©tat
        this.state.currentExercise = e; 
        this.state.currentExerciseData = exerciseData;
        this.state.currentQuestion = 0; 
        this.state.score = 0;
        this.state.userInput = "";
        this.state.problemData = null;
        this.state.targetAnswer = null;
        this.state.isValidating = false; // ï¿½Y"" On dÃ©verrouille au dÃ©but
        this.applyVisualContext();
        UI.showScreen('screen-game'); 
        this.generateNextQuestion();
    },

    generateNextQuestion() {
        if (this.state.timer) clearTimeout(this.state.timer);
        this.stopSpeech();
        if (!this.hasRunnableExercise()) {
            this.failSafeExit("Cet exercice ne peut pas ï¿½tre dï¿½marrï¿½ correctement.");
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
            dataSet: this.state.currentExerciseData
        };
        const problem = Engines.run(this.state.currentExercise.engine, cfg, this.state.frenchLib);
        const check = window.Validators?.validateProblem(problem);
        if (check && !check.valid) {
            console.error("Problï¿½me invalide :", check.reason, problem);
            this.failSafeExit("Cet exercice ne peut pas ï¿½tre affichï¿½ pour le moment.");
            return;
        }
        if (problem.answer === undefined || problem.answer === null) {
            this.failSafeExit("Cet exercice a retournï¿½ une rï¿½ponse invalide.");
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

        // ï¿½Y"" ON OUVRE LE VERROU POUR LA NOUVELLE QUESTION
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

        // --- CAS SPï¿½?CIAL : CarrÃ© Magique ---
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

        // --- CAS SPï¿½?CIAL : Frise chronologique ---
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

        if (typeof val === 'string' && val.startsWith('timeline-place:')) {
            const year = val.replace('timeline-place:', '');
            if (p.visualType !== 'timelinePlace' || !p.data) return;
            p.data.selectedYear = year;
            this.state.userInput = year.toString();
            this.refreshUI();
            return;
        }

        if (typeof val === 'string' && val.startsWith('board-')) {
            const state = p.data?.userState || (p.data.userState = {});

            if (val === 'board-reset') {
                if (p.data.boardKind === 'tap-features') {
                    state.selectedIds = [];
                } else if (p.data.boardKind === 'shape-classify') {
                    state.selectedFigureId = null;
                    state.assignments = {};
                } else if (p.data.boardKind === 'point-on-grid') {
                    state.point = null;
                } else if (p.data.boardKind === 'symmetry-complete') {
                    state.placedPoints = [];
                }
                this.state.userInput = '';
                this.refreshUI();
                return;
            }

            if (val === 'board-submit') {
                this.state.userInput = this.serializeBoardState(p);
                if (this.state.userInput) {
                    return this.validateAnswer();
                }
                this.refreshUI();
                return;
            }

            if (val.startsWith('board-toggle-feature:') && p.data.boardKind === 'tap-features') {
                const featureId = val.replace('board-toggle-feature:', '');
                if (!Array.isArray(state.selectedIds)) state.selectedIds = [];
                const idx = state.selectedIds.indexOf(featureId);
                if (idx >= 0) state.selectedIds.splice(idx, 1);
                else state.selectedIds.push(featureId);
                this.state.userInput = this.serializeBoardState(p);
                this.refreshUI();
                return;
            }

            if (val.startsWith('board-select-figure:') && p.data.boardKind === 'shape-classify') {
                state.selectedFigureId = val.replace('board-select-figure:', '');
                this.refreshUI();
                return;
            }

            if (val.startsWith('board-assign-bucket:') && p.data.boardKind === 'shape-classify') {
                const bucketId = val.replace('board-assign-bucket:', '');
                const selectedFigureId = state.selectedFigureId;
                if (!selectedFigureId) return;
                if (!state.assignments) state.assignments = {};
                state.assignments[selectedFigureId] = bucketId;
                state.selectedFigureId = null;
                this.state.userInput = this.serializeBoardState(p);
                this.refreshUI();
                return;
            }

            if (val.startsWith('board-place-point:') && p.data.boardKind === 'point-on-grid') {
                const [, x, y] = val.split(':');
                state.point = [Number(x), Number(y)];
                this.state.userInput = this.serializeBoardState(p);
                this.refreshUI();
                return;
            }

            if (val.startsWith('board-toggle-point:') && p.data.boardKind === 'symmetry-complete') {
                const [, x, y] = val.split(':');
                const key = `${Number(x)},${Number(y)}`;
                if (!Array.isArray(state.placedPoints)) state.placedPoints = [];
                const idx = state.placedPoints.findIndex((point) => `${Number(point[0])},${Number(point[1])}` === key);
                if (idx >= 0) state.placedPoints.splice(idx, 1);
                else state.placedPoints.push([Number(x), Number(y)]);
                this.state.userInput = this.serializeBoardState(p);
                this.refreshUI();
                return;
            }
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
        if (!this.hasRunnableExercise() || !this.state.problemData) return;
        const total = this.getQuestionTarget() || 10;
        const prog = (this.state.currentQuestion / total) * 100;
        UI.updateGameDisplay(this.state.problemData, this.state.userInput, prog);
    },

    validateAnswer(hasAnswered = true) {
        // ï¿½Y>' ANTI-SPAM : Si dÃ©jÃ  en cours, on arrÃªte tout de suite
        if (this.state.isValidating) return;
        this.state.isValidating = true; // ï¿½Y"' On verrouille

        if (this.state.timer) clearTimeout(this.state.timer);
        
        const { userInput, targetAnswer, currentExercise, problemData } = this.state;
        if (!this.hasRunnableExercise(currentExercise) || !problemData) {
            this.state.isValidating = false;
            this.failSafeExit("L'exercice courant est dans un ï¿½tat incohï¿½rent.");
            return;
        }
        const ansZone = document.getElementById('user-answer');
        
        // 1. NETTOYAGE & TOLï¿½?RANCE
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
        }

        if (isCorrect) this.state.score++;
        
        // 2. FEEDBACK VISUEL
        if (ansZone) {
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
                    : (problemData.data?.orderedLabels || []).join("  ï¿½?'  ");
            } else if (problemData.visualType === 'timelinePlace') {
                ansZone.textContent = isCorrect
                    ? `${userInput}`
                    : `${targetAnswer}`;
            } else if (problemData.visualType === 'geometry-board') {
                ansZone.textContent = isCorrect
                    ? "Bravo, c'est correct."
                    : "Ce n'est pas encore la bonne rï¿½ponse.";
            } else {
                ansZone.textContent = isCorrect ? userInput : targetAnswer;
            }
        }

        // 3. SUITE DU JEU
        const delay = isCorrect ? 800 : 2500;
        
        setTimeout(() => {
            if (ansZone) {
                ansZone.classList.remove('is-success', 'is-error');
                ansZone.classList.add('is-idle');
            }

            if (this.state.currentQuestion < this.getQuestionTarget(currentExercise)) {
                this.generateNextQuestion();
            } else {
                this.showFinalResults();
            }
            // ï¿½sï¿½ï¸ On ne dÃ©verrouille PAS ici, c'est fait au dÃ©but de generateNextQuestion
        }, delay);
    },

    showFinalResults() {
        const { score, currentGrade, currentExercise } = this.state;
        const total = this.getQuestionTarget(currentExercise);
        if (!total) {
            this.failSafeExit("Impossible d'afficher les rï¿½sultats de cet exercice.");
            return;
        }
        
        // ï¿½Y>ï¿½ï¸ Sï¿½?CURITï¿½? SCORE : On s'assure que le score ne dÃ©passe jamais le total
        const safeScore = Math.min(score, total);
        const percent = Math.round((safeScore / total) * 100);

        if (currentGrade && currentGrade.gradeId) {
            Storage.saveRecord(currentGrade.gradeId, currentExercise.id, safeScore, total);
        }
        
        UI.renderStars(safeScore, total);
        UI.showScreen('screen-results');

        if (safeScore === total) {
            UI.launchCelebration();
        }

        const scEl = document.getElementById('result-score');
        if (scEl) scEl.innerText = `Score : ${safeScore} / ${total}`;
        const resultTitle = document.getElementById('result-title');
        const resultLead = document.getElementById('result-lead');
        if (resultTitle) {
            resultTitle.innerText = percent === 100
                ? "Bravo !"
                : percent >= 70
                    ? "Trï¿½s bien !"
                    : percent >= 40
                        ? "Continue !"
                        : "On recommence ?";
        }
        if (resultLead) {
            resultLead.innerText = percent === 100
                ? "Tu as tout rï¿½ussi. Tu peux passer ï¿½ une nouvelle notion."
                : percent >= 70
                    ? "Tu avances bien. Relis la leï¿½on ou tente un autre exercice."
                    : percent >= 40
                        ? "Tu progresses. Une petite rï¿½vision peut t'aider."
                        : "Relis la leï¿½on et rï¿½essaie tranquillement.";
        }

        const lessons = Array.isArray(this.state.currentTheme?.lessons) ? this.state.currentTheme.lessons : [];
        const lessonBtn = document.getElementById('btn-results-lesson');
        const lessonLabel = document.getElementById('btn-results-lesson-label');
        if (lessonBtn) {
            lessonBtn.style.display = lessons.length ? 'inline-flex' : 'none';
        }
        if (lessonLabel) {
            lessonLabel.textContent = lessons.length > 1 ? 'VOIR LES LEï¿½ONS' : 'REVOIR LA LEï¿½ON';
        }
    }
};

window.App = App;
window.addEventListener('DOMContentLoaded', () => App.init());


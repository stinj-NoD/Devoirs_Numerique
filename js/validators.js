const Validators = {
    knownEngines: new Set([
        'choice-engine',
        'clock',
        'conjugation',
        'conversion',
        'counting',
        'math-input',
        'audio-spelling',
        'reading',
        'timeline'
    ]),

    isPlainObject(value) {
        return !!value && typeof value === 'object' && !Array.isArray(value);
    },

    isNonEmptyString(value) {
        return typeof value === 'string' && value.trim().length > 0;
    },

    isPositiveInteger(value) {
        return Number.isInteger(Number(value)) && Number(value) > 0;
    },

    hasDuplicates(items) {
        return new Set(items).size !== items.length;
    },

    isDataFilePath(value) {
        return this.isNonEmptyString(value) && /^\.?\/?data\/.+\.json$/i.test(value.trim().replace(/\\/g, '/'));
    },

    validateFrenchLibrarySection(sectionName, data) {
        if (!this.isPlainObject(data)) {
            return { valid: false, reason: `Section de bibliothèque invalide : ${sectionName}.` };
        }

        if (sectionName === 'reading') {
            for (const [category, entries] of Object.entries(data)) {
                if (!Array.isArray(entries) || entries.length === 0) {
                    return { valid: false, reason: `Catégorie de lecture invalide : ${category}.` };
                }

                for (const entry of entries) {
                    if (!this.isPlainObject(entry)) {
                        return { valid: false, reason: `Entrée de lecture invalide : ${category}.` };
                    }

                    if (!this.isNonEmptyString(entry.text)) {
                        return { valid: false, reason: `Texte de lecture absent : ${category}.` };
                    }

                    if (!Array.isArray(entry.syllables) || entry.syllables.length === 0 || entry.syllables.some((syllable) => !this.isNonEmptyString(syllable))) {
                        return { valid: false, reason: `Syllabes invalides : ${category}.` };
                    }

                    const answer = entry.answer || entry.a || entry.text;
                    if (!this.isNonEmptyString(answer)) {
                        return { valid: false, reason: `Réponse de lecture absente : ${category}.` };
                    }

                    if (!Array.isArray(entry.choices) || entry.choices.length < 2 || entry.choices.some((choice) => !this.isNonEmptyString(choice))) {
                        return { valid: false, reason: `Choix de lecture invalides : ${category}.` };
                    }

                    if (!entry.choices.includes(answer)) {
                        return { valid: false, reason: `Réponse de lecture hors choix : ${category}.` };
                    }

                    if (entry.silent !== undefined && (!Array.isArray(entry.silent) || entry.silent.some((index) => !Number.isInteger(Number(index)) || Number(index) < 0))) {
                        return { valid: false, reason: `Index de lettres muettes invalide : ${category}.` };
                    }
                }
            }
        }

        if (sectionName === 'grammar') {
            for (const [category, entries] of Object.entries(data)) {
                if (!Array.isArray(entries) || entries.length === 0) {
                    return { valid: false, reason: `Catégorie de grammaire invalide : ${category}.` };
                }

                for (const entry of entries) {
                    if (!this.isPlainObject(entry)) {
                        return { valid: false, reason: `Entrée de grammaire invalide : ${category}.` };
                    }

                    const isGenderEntry = this.isNonEmptyString(entry.word)
                        && this.isNonEmptyString(entry.gender)
                        && this.isNonEmptyString(entry.article);

                    const isQcmEntry = this.isNonEmptyString(entry.question || entry.sentence)
                        && Array.isArray(entry.choices)
                        && entry.choices.length >= 2
                        && this.isNonEmptyString(entry.answer || entry.a);

                    if (!isGenderEntry && !isQcmEntry) {
                        return { valid: false, reason: `Format de grammaire inconnu : ${category}.` };
                    }
                }
            }
        }

        return { valid: true };
    },

    validateFrenchLibrary(lib) {
        if (!this.isPlainObject(lib)) {
            return { valid: false, reason: 'BibliothÃ¨que de langue invalide.' };
        }

        const requiredSections = ['spelling', 'conjugation', 'homophones', 'grammar'];
        for (const section of requiredSections) {
            const check = this.validateFrenchLibrarySection(section, lib[section]);
            if (!check.valid) {
                return check;
            }
        }

        if (lib.reading !== undefined) {
            const readingCheck = this.validateFrenchLibrarySection('reading', lib.reading);
            if (!readingCheck.valid) {
                return readingCheck;
            }
        }

        return { valid: true };
    },

    validateIndexData(data) {
        if (!this.isPlainObject(data) || !Array.isArray(data.grades) || data.grades.length === 0) {
            return { valid: false, reason: 'index.json invalide : grades[] absent ou vide.' };
        }

        const gradeIds = [];

        for (const grade of data.grades) {
            if (!this.isPlainObject(grade)) {
                return { valid: false, reason: "index.json invalide : une classe n'est pas un objet." };
            }
            if (!this.isNonEmptyString(grade.id) || !this.isNonEmptyString(grade.title) || !this.isDataFilePath(grade.dataFile)) {
                return { valid: false, reason: `index.json invalide : classe incomplÃ¨te (${grade?.id || 'id manquant'}).` };
            }
            gradeIds.push(grade.id.trim());
        }

        if (this.hasDuplicates(gradeIds)) {
            return { valid: false, reason: 'index.json invalide : id de classes dupliquÃ©s.' };
        }

        return { valid: true };
    },

    validateGradeData(data) {
        if (!this.isPlainObject(data) || !this.isNonEmptyString(data.gradeId)) {
            return { valid: false, reason: 'Fichier de niveau invalide : gradeId manquant.' };
        }

        const hasLegacyThemes = Array.isArray(data.themes) && data.themes.length > 0;
        const hasSubjects = Array.isArray(data.subjects) && data.subjects.length > 0;

        if (!hasLegacyThemes && !hasSubjects) {
            return { valid: false, reason: 'Fichier de niveau invalide : themes/subjects manquants ou vides.' };
        }

        const themeIds = [];
        const exerciseIds = [];
        const subjectIds = [];
        const subthemeIds = [];

        if (hasLegacyThemes) {
            for (const theme of data.themes) {
                const check = this.validateTheme(theme);
                if (!check.valid) return check;

                themeIds.push(theme.id.trim());

                for (const exercise of theme.exercises) {
                    const exerciseCheck = this.validateExercise(exercise);
                    if (!exerciseCheck.valid) {
                        return {
                            valid: false,
                            reason: `Fichier de niveau invalide : exercice ${exercise?.id || 'sans id'} dans ${theme.id} - ${exerciseCheck.reason}`
                        };
                    }
                    exerciseIds.push(exercise.id.trim());
                }
            }
        }

        if (hasSubjects) {
            for (const subject of data.subjects) {
                if (!this.isPlainObject(subject)) {
                    return { valid: false, reason: "Fichier de niveau invalide : une matiÃ¨re n'est pas un objet." };
                }
                if (!this.isNonEmptyString(subject.id) || !this.isNonEmptyString(subject.title) || !Array.isArray(subject.subthemes) || subject.subthemes.length === 0) {
                    return { valid: false, reason: `Fichier de niveau invalide : matiÃ¨re incomplÃ¨te (${subject?.id || 'id manquant'}).` };
                }

                subjectIds.push(subject.id.trim());

                for (const subtheme of subject.subthemes) {
                    const check = this.validateTheme(subtheme, 'sous-thÃ¨me');
                    if (!check.valid) {
                        return {
                            valid: false,
                            reason: check.reason.replace('thÃ¨me', 'sous-thÃ¨me')
                        };
                    }

                    subthemeIds.push(subtheme.id.trim());

                    for (const exercise of subtheme.exercises) {
                        const exerciseCheck = this.validateExercise(exercise);
                        if (!exerciseCheck.valid) {
                            return {
                                valid: false,
                                reason: `Fichier de niveau invalide : exercice ${exercise?.id || 'sans id'} dans ${subtheme.id} - ${exerciseCheck.reason}`
                            };
                        }
                        exerciseIds.push(exercise.id.trim());
                    }
                }
            }
        }

        if (this.hasDuplicates(themeIds)) {
            return { valid: false, reason: 'Fichier de niveau invalide : id de thÃ¨mes dupliquÃ©s.' };
        }
        if (this.hasDuplicates(subjectIds)) {
            return { valid: false, reason: 'Fichier de niveau invalide : id de matiÃ¨res dupliquÃ©s.' };
        }
        if (this.hasDuplicates(subthemeIds)) {
            return { valid: false, reason: 'Fichier de niveau invalide : id de sous-thÃ¨mes dupliquÃ©s.' };
        }
        if (this.hasDuplicates(exerciseIds)) {
            return { valid: false, reason: 'Fichier de niveau invalide : id d\'exercices dupliquÃ©s.' };
        }

        return { valid: true };
    },

    validateTheme(theme, label = 'thÃ¨me') {
        if (!this.isPlainObject(theme)) {
            return { valid: false, reason: `Fichier de niveau invalide : un ${label} n'est pas un objet.` };
        }
        if (!this.isNonEmptyString(theme.id) || !this.isNonEmptyString(theme.title) || !Array.isArray(theme.exercises) || theme.exercises.length === 0) {
            return { valid: false, reason: `Fichier de niveau invalide : ${label} incomplet (${theme?.id || 'id manquant'}).` };
        }
        return { valid: true };
    },

    validateExercise(exercise) {
        if (!this.isPlainObject(exercise)) {
            return { valid: false, reason: 'exercice absent ou mal formÃ©.' };
        }
        if (!this.isNonEmptyString(exercise.id) || !this.isNonEmptyString(exercise.title)) {
            return { valid: false, reason: 'id/title manquants.' };
        }
        if (!this.isNonEmptyString(exercise.engine)) {
            return { valid: false, reason: 'engine manquant.' };
        }
        if (!this.knownEngines.has(exercise.engine)) {
            return { valid: false, reason: `engine inconnu (${exercise.engine}).` };
        }
        if (!this.isPlainObject(exercise.params)) {
            return { valid: false, reason: 'params manquants ou invalides.' };
        }
        if (!this.isPositiveInteger(exercise.params.questions)) {
            return { valid: false, reason: 'paramÃ¨tre questions invalide.' };
        }
        if (exercise.params.dataFile && !this.isDataFilePath(exercise.params.dataFile)) {
            return { valid: false, reason: 'dataFile invalide.' };
        }
        if (exercise.params.choices && (!Array.isArray(exercise.params.choices) || exercise.params.choices.length < 2)) {
            return { valid: false, reason: 'choices doit contenir au moins 2 options.' };
        }
        if (exercise.params.options && (!Array.isArray(exercise.params.options) || exercise.params.options.length < 2)) {
            return { valid: false, reason: 'options doit contenir au moins 2 valeurs.' };
        }
        if (exercise.params.type === 'factual-qcm' && !this.isNonEmptyString(exercise.params.category)) {
            return { valid: false, reason: 'category manquante pour factual-qcm.' };
        }
        if (exercise.engine === 'timeline') {
            if (!this.isNonEmptyString(exercise.params.grade)) {
                return { valid: false, reason: 'grade manquant pour timeline.' };
            }
            if (!this.isNonEmptyString(exercise.params.mode) || !['order', 'place'].includes(exercise.params.mode)) {
                return { valid: false, reason: 'mode timeline invalide.' };
            }
            if (!this.isNonEmptyString(exercise.params.timelineId)) {
                return { valid: false, reason: 'timelineId manquant.' };
            }
        }

        return { valid: true };
    },

    validateExerciseData(exercise, dataSet) {
        if (!exercise?.params?.dataFile) {
            return { valid: true };
        }

        if (!this.isPlainObject(dataSet)) {
            return { valid: false, reason: 'dataset absent ou invalide.' };
        }

        if (exercise.params?.type === 'factual-qcm') {
            return this.validateFactualDataset(exercise, dataSet);
        }

        if (exercise.engine === 'timeline') {
            return this.validateTimelineDataset(exercise, dataSet);
        }

        return { valid: true };
    },

    validateFactualDataset(exercise, dataSet) {
        if (!this.isPlainObject(dataSet.categories)) {
            return { valid: false, reason: 'dataset documentaire sans categories.' };
        }

        const pool = dataSet.categories[exercise.params.category];
        if (!Array.isArray(pool) || pool.length === 0) {
            return { valid: false, reason: `catÃ©gorie documentaire introuvable (${exercise.params.category}).` };
        }

        const invalidItem = pool.find((item) =>
            !this.isPlainObject(item) ||
            !this.isNonEmptyString(item.question) ||
            !Array.isArray(item.choices) ||
            item.choices.length < 2 ||
            !this.isNonEmptyString(item.answer) ||
            !item.choices.includes(item.answer)
        );

        if (invalidItem) {
            return { valid: false, reason: `question documentaire invalide dans ${exercise.params.category}.` };
        }

        return { valid: true };
    },

    validateTimelineDataset(exercise, dataSet) {
        if (!this.isPlainObject(dataSet.grades)) {
            return { valid: false, reason: 'dataset frise sans grades.' };
        }

        const gradeId = String(exercise.params.grade || '').toLowerCase();
        const gradeData = dataSet.grades[gradeId];
        if (!this.isPlainObject(gradeData)) {
            return { valid: false, reason: `grade de frise introuvable (${gradeId}).` };
        }

        const events = Array.isArray(gradeData.events) ? gradeData.events : [];
        const timelines = Array.isArray(gradeData.timelines) ? gradeData.timelines : [];
        const periods = Array.isArray(gradeData.periods) ? gradeData.periods : [];

        if (events.length === 0 || timelines.length === 0) {
            return { valid: false, reason: 'dataset frise incomplet : events/timelines manquants.' };
        }

        const eventIds = events.map((event) => event?.id).filter(Boolean);
        if (this.hasDuplicates(eventIds)) {
            return { valid: false, reason: 'dataset frise invalide : id d\\'events dupliquÃ©s.' };
        }

        const periodIds = periods.map((period) => period?.id).filter(Boolean);
        const timeline = timelines.find((item) => item?.id === exercise.params.timelineId);
        if (!timeline) {
            return { valid: false, reason: `timeline introuvable (${exercise.params.timelineId}).` };
        }

        if (!Array.isArray(timeline.items) || timeline.items.length < 1) {
            return { valid: false, reason: `timeline invalide (${exercise.params.timelineId}) : items manquants.` };
        }

        if (!this.isNonEmptyString(timeline.mode) || !['order', 'place'].includes(timeline.mode)) {
            return { valid: false, reason: `timeline invalide (${exercise.params.timelineId}) : mode inconnu.` };
        }

        if (timeline.mode !== exercise.params.mode) {
            return { valid: false, reason: `timeline incohÃ©rente (${exercise.params.timelineId}) : mode inattendu.` };
        }

        const eventMap = new Map(events.map((event) => [event.id, event]));
        const missingItems = timeline.items.filter((id) => !eventMap.has(id));
        if (missingItems.length > 0) {
            return { valid: false, reason: `timeline invalide (${exercise.params.timelineId}) : events introuvables (${missingItems.join(', ')}).` };
        }

        const invalidEvent = events.find((event) =>
            !this.isPlainObject(event) ||
            !this.isNonEmptyString(event.id) ||
            !this.isNonEmptyString(event.label) ||
            !Number.isFinite(Number(event.year)) ||
            !this.isNonEmptyString(event.period)
        );
        if (invalidEvent) {
            return { valid: false, reason: `event de frise invalide (${invalidEvent?.id || 'sans id'}).` };
        }

        if (periods.length > 0) {
            const unknownPeriod = events.find((event) => !periodIds.includes(event.period));
            if (unknownPeriod) {
                return { valid: false, reason: `event de frise avec pÃ©riode inconnue (${unknownPeriod.id}).` };
            }
        }

        if (timeline.mode === 'place') {
            const range = Array.isArray(timeline.range) ? timeline.range : null;
            if (!range || range.length !== 2 || !Number.isFinite(Number(range[0])) || !Number.isFinite(Number(range[1]))) {
                return { valid: false, reason: `timeline place invalide (${exercise.params.timelineId}) : range absent ou invalide.` };
            }
            if (!Number.isFinite(Number(timeline.step)) || Number(timeline.step) <= 0) {
                return { valid: false, reason: `timeline place invalide (${exercise.params.timelineId}) : step invalide.` };
            }
        }

        return { valid: true };
    },

    validateProblem(problem) {
        if (!problem || typeof problem !== 'object') {
            return { valid: false, reason: 'RÃ©ponse moteur absente.' };
        }

        if (problem.answer === undefined || problem.answer === null) {
            return { valid: false, reason: 'RÃ©ponse moteur sans answer.' };
        }

        return { valid: true };
    }
};

window.Validators = Validators;

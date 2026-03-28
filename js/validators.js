const Validators = {
    knownEngines: new Set([
        'choice-engine',
        'clock',
        'conjugation',
        'conversion',
        'counting',
        'math-input',
        'audio-spelling',
        'board-interactive',
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

    isValidLessonFormat(value) {
        return this.isNonEmptyString(value) && ['lesson-card'].includes(value.trim());
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
                    const check = this.validateSubtheme(subtheme);
                    if (!check.valid) {
                        return { valid: false, reason: check.reason };
                    }

                    subthemeIds.push(subtheme.id.trim());

                    const lessonIds = [];
                    const lessons = Array.isArray(subtheme.lessons) ? subtheme.lessons : [];
                    for (const lesson of lessons) {
                        const lessonCheck = this.validateLesson(lesson);
                        if (!lessonCheck.valid) {
                            return {
                                valid: false,
                                reason: `Fichier de niveau invalide : leÃ§on ${lesson?.id || 'sans id'} dans ${subtheme.id} - ${lessonCheck.reason}`
                            };
                        }
                        lessonIds.push(lesson.id.trim());
                    }

                    if (this.hasDuplicates(lessonIds)) {
                        return { valid: false, reason: `Fichier de niveau invalide : id de leÃ§ons dupliquÃ©s dans ${subtheme.id}.` };
                    }

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

    validateSubtheme(subtheme) {
        if (!this.isPlainObject(subtheme)) {
            return { valid: false, reason: "Fichier de niveau invalide : un sous-thÃ¨me n'est pas un objet." };
        }

        const hasExercises = Array.isArray(subtheme.exercises) && subtheme.exercises.length > 0;
        const hasLessons = Array.isArray(subtheme.lessons) && subtheme.lessons.length > 0;

        if (!this.isNonEmptyString(subtheme.id) || !this.isNonEmptyString(subtheme.title)) {
            return { valid: false, reason: `Fichier de niveau invalide : sous-thÃ¨me incomplet (${subtheme?.id || 'id manquant'}).` };
        }

        if (!hasExercises && !hasLessons) {
            return { valid: false, reason: `Fichier de niveau invalide : sous-thÃ¨me vide (${subtheme.id}).` };
        }

        if (subtheme.lessons !== undefined && !Array.isArray(subtheme.lessons)) {
            return { valid: false, reason: `Fichier de niveau invalide : lessons invalide dans ${subtheme.id}.` };
        }

        if (subtheme.exercises !== undefined && !Array.isArray(subtheme.exercises)) {
            return { valid: false, reason: `Fichier de niveau invalide : exercises invalide dans ${subtheme.id}.` };
        }

        return { valid: true };
    },

    validateLesson(lesson) {
        if (!this.isPlainObject(lesson)) {
            return { valid: false, reason: 'leÃ§on absente ou mal formÃ©e.' };
        }
        if (!this.isNonEmptyString(lesson.id) || !this.isNonEmptyString(lesson.title)) {
            return { valid: false, reason: 'id/title de leÃ§on manquants.' };
        }
        if (!this.isValidLessonFormat(lesson.format)) {
            return { valid: false, reason: 'format de leÃ§on invalide.' };
        }
        if (!Array.isArray(lesson.blocks) || lesson.blocks.length === 0) {
            return { valid: false, reason: 'blocks manquants ou vides pour la leÃ§on.' };
        }

        for (const block of lesson.blocks) {
            const blockCheck = this.validateLessonBlock(block);
            if (!blockCheck.valid) return blockCheck;
        }

        return { valid: true };
    },

    validateLessonBlock(block) {
        if (!this.isPlainObject(block) || !this.isNonEmptyString(block.type)) {
            return { valid: false, reason: 'bloc de leÃ§on invalide.' };
        }

        const type = block.type.trim();
        if (type === 'paragraph') {
            return this.isNonEmptyString(block.text)
                ? { valid: true }
                : { valid: false, reason: 'bloc paragraph sans texte.' };
        }

        if (type === 'example' || type === 'tip') {
            return this.isNonEmptyString(block.content)
                ? { valid: true }
                : { valid: false, reason: `bloc ${type} sans contenu.` };
        }

        if (type === 'bullets') {
            return Array.isArray(block.items) && block.items.length > 0 && block.items.every((item) => this.isNonEmptyString(item))
                ? { valid: true }
                : { valid: false, reason: 'bloc bullets invalide.' };
        }

        if (type === 'mini-table') {
            const hasHeaders = Array.isArray(block.headers)
                && block.headers.length >= 2
                && block.headers.every((item) => this.isNonEmptyString(item));
            const hasRows = Array.isArray(block.rows)
                && block.rows.length > 0
                && block.rows.every((row) =>
                    Array.isArray(row)
                    && row.length === block.headers.length
                    && row.every((cell) => this.isNonEmptyString(cell))
                );

            return hasHeaders && hasRows
                ? { valid: true }
                : { valid: false, reason: 'bloc mini-table invalide.' };
        }

        return { valid: false, reason: `type de bloc de leÃ§on inconnu (${type}).` };
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
        if (exercise.engine === 'board-interactive') {
            if (!this.isNonEmptyString(exercise.params.type) || !['tap-features', 'shape-classify', 'point-on-grid', 'symmetry-complete'].includes(exercise.params.type)) {
                return { valid: false, reason: 'type board-interactive invalide.' };
            }
            if (!this.isNonEmptyString(exercise.params.category)) {
                return { valid: false, reason: 'category manquante pour board-interactive.' };
            }
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

        if (exercise.engine === 'board-interactive') {
            return this.validateBoardDataset(exercise, dataSet);
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

    validateBoardDataset(exercise, dataSet) {
        if (!this.isPlainObject(dataSet.categories)) {
            return { valid: false, reason: 'dataset interactif sans categories.' };
        }

        const pool = dataSet.categories[exercise.params.category];
        if (!Array.isArray(pool) || pool.length === 0) {
            return { valid: false, reason: `catégorie interactive introuvable (${exercise.params.category}).` };
        }

        for (const item of pool) {
            if (!this.isPlainObject(item) || !this.isNonEmptyString(item.prompt) || !this.isPlainObject(item.board)) {
                return { valid: false, reason: `entrée interactive invalide dans ${exercise.params.category}.` };
            }

            if (exercise.params.type === 'tap-features') {
                const features = Array.isArray(item.features) && item.features.length > 0;
                const validFeatures = features && item.features.every((feature) =>
                    this.isPlainObject(feature)
                    && this.isNonEmptyString(feature.id)
                    && Number.isFinite(Number(feature.x))
                    && Number.isFinite(Number(feature.y))
                    && typeof feature.correct === 'boolean'
                );
                if (!validFeatures) {
                    return { valid: false, reason: `tap-features invalide dans ${exercise.params.category}.` };
                }
            }

            if (exercise.params.type === 'shape-classify') {
                const figures = Array.isArray(item.figures) && item.figures.length > 0;
                const buckets = Array.isArray(item.buckets) && item.buckets.length > 1;
                const answer = this.isPlainObject(item.answer);
                if (!figures || !buckets || !answer) {
                    return { valid: false, reason: `shape-classify invalide dans ${exercise.params.category}.` };
                }
            }

            if (exercise.params.type === 'point-on-grid') {
                const target = item.task?.target;
                if (!this.isPlainObject(item.task) || !Array.isArray(target) || target.length !== 2) {
                    return { valid: false, reason: `point-on-grid invalide dans ${exercise.params.category}.` };
                }
            }

            if (exercise.params.type === 'symmetry-complete') {
                const givenPoints = Array.isArray(item.givenPoints) && item.givenPoints.length > 0;
                const targetPoints = Array.isArray(item.targetPoints) && item.targetPoints.length > 0;
                if (!givenPoints || !targetPoints) {
                    return { valid: false, reason: `symmetry-complete invalide dans ${exercise.params.category}.` };
                }
            }
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
            return { valid: false, reason: "dataset frise invalide : id d'events dupliqués." };
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

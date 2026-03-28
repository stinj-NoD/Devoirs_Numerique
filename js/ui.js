/*
 * Devoir NumÃ©rique - UI.js
 * Copyright (C) 2026 [Stinj-NoD]
 * Version : 3.0 (Hardened & Secure)
 */

const UI = {
    // Getters sÃ©curisÃ©s (retournent null si Ã©lÃ©ment absent)
    get screens() { return document.querySelectorAll('.screen'); },
    get btnBack() { return document.getElementById('btn-back'); },
    get btnHome() { return document.getElementById('btn-home'); },
    get navSheet() { return document.getElementById('nav-sheet'); },
    get navSheetActions() { return document.getElementById('nav-sheet-actions'); },
    lastFocusedElement: null,
    navSheetHideTimer: null,
    _navInitialized: false,

    /**
     * Gestionnaire d'affichage des Ã©crans
     */
    showScreen(id) {
        // 1. Gestion des Ã©crans
        if (this.screens.length === 0) return console.warn("UI: Aucun écran trouvé dans le DOM");
        
        this.screens.forEach(s => {
            if (s.id === id) {
                s.classList.add('active');
                s.style.display = 'flex';
            } else {
                s.classList.remove('active');
                s.style.display = 'none';
            }
        });

        // 2. Sync navigation contextuelle
        if (typeof window !== 'undefined' && window.App?.getNavUiState) {
            this.syncHeaderNav(window.App.getNavUiState(id));
        }
    },

    syncHeaderNav(state = {}) {
        const model = {
            showBack: state.showBack !== false,
            backLabel: state.backLabel || '←',
            backTitle: state.backTitle || 'Retour',
            showMenu: state.showMenu !== false,
            menuLabel: state.menuLabel || '☰',
            menuTitle: state.menuTitle || 'Menu'
        };

        if (this.btnBack) {
            this.btnBack.style.visibility = model.showBack ? 'visible' : 'hidden';
            this.btnBack.disabled = !model.showBack;
            this.btnBack.textContent = model.backLabel;
            this.btnBack.setAttribute('aria-label', model.backTitle);
            this.btnBack.setAttribute('title', model.backTitle);
        }

        if (this.btnHome) {
            this.btnHome.style.visibility = model.showMenu ? 'visible' : 'hidden';
            this.btnHome.disabled = !model.showMenu;
            this.btnHome.textContent = model.menuLabel;
            this.btnHome.setAttribute('aria-label', model.menuTitle);
            this.btnHome.setAttribute('title', model.menuTitle);
        }
    },

    openNavSheet(actions = []) {
        if (!this.navSheet || !this.navSheetActions) return;
        if (this.navSheetHideTimer) {
            clearTimeout(this.navSheetHideTimer);
            this.navSheetHideTimer = null;
        }
        this.navSheetActions.innerHTML = '';
        this.lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const normalizedActions = Array.isArray(actions) ? actions : [];
        normalizedActions.forEach((action) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn--soft nav-sheet-action';
            if (action?.variant) button.classList.add(`nav-sheet-action--${action.variant}`);
            const title = document.createElement('span');
            title.className = 'nav-sheet-action-title';
            title.textContent = action?.title || 'Action';
            button.appendChild(title);
            if (action?.subtitle) {
                const subtitle = document.createElement('span');
                subtitle.className = 'nav-sheet-action-subtitle';
                subtitle.textContent = action.subtitle;
                button.appendChild(subtitle);
            }
            button.onclick = () => {
                this.closeNavSheet();
                if (typeof action?.onSelect === 'function') action.onSelect();
            };
            this.navSheetActions.appendChild(button);
        });

        if (!normalizedActions.length) {
            const empty = document.createElement('p');
            empty.className = 'nav-sheet-empty';
            empty.textContent = 'Aucune action disponible ici.';
            this.navSheetActions.appendChild(empty);
        }

        this.navSheet.hidden = false;
        this.navSheet.setAttribute('aria-hidden', 'false');
        this.navSheet.classList.add('is-open');
        const firstButton = this.navSheetActions.querySelector('button');
        if (firstButton instanceof HTMLButtonElement) {
            firstButton.focus();
        }
    },

    closeNavSheet() {
        if (!this.navSheet) return;
        this.navSheet.classList.remove('is-open');
        this.navSheet.setAttribute('aria-hidden', 'true');
        this.navSheetHideTimer = setTimeout(() => {
            if (this.navSheet && !this.navSheet.classList.contains('is-open')) {
                this.navSheet.hidden = true;
            }
            this.navSheetHideTimer = null;
        }, 190);
        if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
            this.lastFocusedElement.focus();
        }
        this.lastFocusedElement = null;
    },

    updateHeader(text) {
        const title = document.getElementById('app-title');
        if (title) title.innerText = text || "Devoir Numérique";
    },

    safeIcon(value, fallback = '\u{1F4DD}') {
        const icon = (value || "").toString().trim();
        if (!icon) return fallback;
        if (/[ÃÂðâ�]/.test(icon)) return fallback;
        return icon;
    },

    escapeHtml(value) {
        if (window.SecurityUtils?.escapeHtml) return window.SecurityUtils.escapeHtml(value);
        return (value ?? "").toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    escapeAttr(value) {
        if (window.SecurityUtils?.escapeAttr) return window.SecurityUtils.escapeAttr(value);
        return this.escapeHtml(value).replace(/`/g, '&#96;');
    },

    safeImagePath(path) {
        if (window.SecurityUtils?.safeImagePath) return window.SecurityUtils.safeImagePath(path);
        return '';
    },

    buildCardContent(title, subtitle = "") {
        const safeTitle = this.escapeHtml(title || 'Exercice');
        const safeSubtitle = this.escapeHtml(subtitle || "");
        return `
            <div class="card-content">
                <span class="card-title">${safeTitle}</span>
                ${safeSubtitle ? `<span class="card-subtitle">${safeSubtitle}</span>` : ''}
            </div>
        `;
    },

    // --- PROFILS & MENUS ---

    renderProfiles(profiles, onSelect, onDelete) {
        const container = document.getElementById('profiles-list');
        if (!container) return;
        container.innerHTML = "";

        (profiles || []).forEach(p => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'card profile-card';
            card.innerHTML = `
                <div class="btn btn--icon btn--danger btn-delete-profile" title="Supprimer">🗑️</div>
                <span class="card-icon">${this.safeIcon(p.avatar, '\u{1F464}')}</span>
                ${this.buildCardContent(p?.name || 'Anonyme')}
                <span class="profile-card-helper">Entrer</span>
            `;

            card.onclick = () => onSelect(p);

            const deleteBtn = card.querySelector('.btn-delete-profile');
            if (deleteBtn) {
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (confirm(`Veux-tu vraiment supprimer le profil de ${p.name} ?`)) {
                        onDelete(p.id);
                    }
                };
            }
            container.appendChild(card);
        });
    },

    renderMenu(id, data, callback) {
        const container = document.getElementById(id);
        if (!container) return;
        container.innerHTML = "";
        const menuVariant = (id || '').replace('-list', '');
        const menuKicker = menuVariant === 'grades'
            ? 'Classe'
            : menuVariant === 'themes'
                ? 'Matière'
                : menuVariant === 'library'
                    ? 'Leçon'
                : menuVariant === 'levels'
                    ? 'Sous-thème'
                    : menuVariant === 'exercises'
                        ? 'À faire'
                        : '';

        (data || []).forEach(item => {
            if (item?.kind === 'section') {
                const section = document.createElement('div');
                section.className = 'menu-section';
                section.innerHTML = `
                    <div class="menu-section-title">${this.escapeHtml(item.title || 'Section')}</div>
                    ${item.subtitle ? `<div class="menu-section-subtitle">${this.escapeHtml(item.subtitle)}</div>` : ''}
                `;
                container.appendChild(section);
                return;
            }

            // AccÃ¨s sÃ©curisÃ© au Storage
            let stars = 0;
            try {
                if (typeof Storage !== 'undefined' && Storage.getRecord) {
                    const gradeId = window.App?.state?.currentGrade?.gradeId || null;
                    const record = Storage.getRecord(item.id, gradeId);
                    if (record) stars = record.stars || 0;
                }
        } catch (e) { console.warn("UI: Erreur de lecture des étoiles", e); }
            stars = Number.isFinite(stars) ? Math.min(3, Math.max(0, stars)) : 0;

            const starsHtml = stars > 0 ? `<div class="menu-stars">${'★'.repeat(stars)}</div>` : "";
            const badgeHtml = item.kind === 'lesson'
                ? `<div class="menu-badge menu-badge--lesson">Leçon</div>`
                : menuVariant === 'exercises'
                    ? `<div class="menu-badge menu-badge--exercise">Exercice</div>`
                    : "";
            
            const card = document.createElement('button');
            card.type = 'button';
            card.className = `card menu-card menu-card--${menuVariant}`;
            card.innerHTML = `
                <span class="card-icon">${this.safeIcon(item.icon, '\u{1F4DD}')}</span>
                ${menuKicker ? `<span class="menu-card-kicker">${menuKicker}</span>` : ''}
                ${this.buildCardContent(item.title || item.nom || 'Exercice', item.subtitle)}
                <div class="menu-card-footer">
                    ${badgeHtml}
                    ${starsHtml}
                </div>`;
            card.onclick = () => callback(item);
            container.appendChild(card);
        });
    },

    renderBrowseModes(data, callback) {
        const container = document.getElementById('mode-list');
        if (!container) return;
        container.innerHTML = "";

        (data || []).forEach((item) => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = `mode-card mode-card--${item.mode || 'default'}`;
            card.innerHTML = `
                <span class="mode-card-icon">${this.safeIcon(item.icon, '📘')}</span>
                <span class="mode-card-body">
                    <span class="mode-card-title">${this.escapeHtml(item.title || 'Parcours')}</span>
                    ${item.subtitle ? `<span class="mode-card-subtitle">${this.escapeHtml(item.subtitle)}</span>` : ''}
                    ${item.helper ? `<span class="mode-card-helper">${this.escapeHtml(item.helper)}</span>` : ''}
                </span>
                <span class="mode-card-arrow">→</span>
            `;
            card.onclick = () => callback(item);
            container.appendChild(card);
        });
    },

    renderLesson(lesson, onContinue, context = {}) {
        const container = document.getElementById('lesson-view');
        const btn = document.getElementById('btn-lesson-exercises');
        const btnLabel = document.getElementById('btn-lesson-exercises-label');
        if (!container) return;

        const safeBlocks = Array.isArray(lesson?.blocks) ? lesson.blocks : [];
        const safeLessons = Array.isArray(context?.lessons) ? context.lessons : [];
        const blocksHtml = safeBlocks.map((block) => this.renderLessonBlock(block)).join('');
        const exerciseCount = Number.isFinite(context?.exerciseCount) ? context.exerciseCount : 0;
        const themeTitle = context?.themeTitle || '';
        const subjectTitle = context?.subjectTitle || '';
        const blockCount = safeBlocks.length;
        const chips = [
            themeTitle ? `<span class="lesson-chip">${this.escapeHtml(themeTitle)}</span>` : '',
            subjectTitle ? `<span class="lesson-chip">${this.escapeHtml(subjectTitle)}</span>` : '',
            blockCount > 0 ? `<span class="lesson-chip">${blockCount} repère${blockCount > 1 ? 's' : ''}</span>` : '',
            exerciseCount > 0 ? `<span class="lesson-chip lesson-chip--accent">${exerciseCount} exercice${exerciseCount > 1 ? 's' : ''}</span>` : ''
        ].filter(Boolean).join('');
        const summaryText = this.escapeHtml(context?.summaryText || (exerciseCount > 0
            ? `Lis la notion, observe les exemples, puis enchaîne sur ${exerciseCount} exercice${exerciseCount > 1 ? 's' : ''}.`
            : `Lis la notion puis reviens au sous-thème pour continuer.`));
        const outlineHtml = safeLessons.length > 1 ? `
            <section class="lesson-outline">
                <div class="lesson-outline-head">
                    <div class="lesson-block-label">Dans ce sous-thème</div>
                    <div class="lesson-outline-count">${safeLessons.length} leçons</div>
                </div>
                <div class="lesson-outline-list">
                    ${safeLessons.map((item, index) => `
                        <button
                            type="button"
                            class="lesson-outline-item${item.id === lesson?.id ? ' is-active' : ''}"
                            data-lesson-id="${this.escapeAttr(item.id || '')}"
                        >
                            <span class="lesson-outline-index">${index + 1}</span>
                            <span class="lesson-outline-content">
                                <span class="lesson-outline-title">${this.escapeHtml(item.title || 'Leçon')}</span>
                                ${item.subtitle ? `<span class="lesson-outline-subtitle">${this.escapeHtml(item.subtitle)}</span>` : ''}
                            </span>
                        </button>
                    `).join('')}
                </div>
            </section>
        ` : '';

        container.innerHTML = `
            <article class="lesson-card">
                <header class="lesson-card-header">
                    <div class="lesson-eyebrow">Leçon</div>
                    <h3 class="lesson-card-title">${this.escapeHtml(lesson?.title || 'Leçon')}</h3>
                    ${lesson?.subtitle ? `<p class="lesson-card-subtitle">${this.escapeHtml(lesson.subtitle)}</p>` : ''}
                    ${chips ? `<div class="lesson-chips">${chips}</div>` : ''}
                </header>
                ${outlineHtml}
                <section class="lesson-summary">
                    <div class="lesson-summary-icon">🧭</div>
                    <p class="lesson-summary-text">${summaryText}</p>
                </section>
                <div class="lesson-card-body">${blocksHtml}</div>
            </article>
        `;

        if (btn) {
            btn.onclick = () => onContinue?.();
            btn.style.display = 'inline-flex';
        }
        if (btnLabel) {
            btnLabel.textContent = exerciseCount > 0
                ? `VOIR LES ${exerciseCount} EXERCICES`
                : 'REVENIR AUX EXERCICES';
        }

        if (typeof context?.onSelectLesson === 'function') {
            container.querySelectorAll('[data-lesson-id]').forEach((node) => {
                node.onclick = () => context.onSelectLesson(node.getAttribute('data-lesson-id'));
            });
        }
    },

    renderLessonBlock(block) {
        if (!block || typeof block !== 'object') return '';

        if (block.type === 'paragraph') {
            return `<p class="lesson-block lesson-block--paragraph">${this.escapeHtml(block.text || '')}</p>`;
        }

        if (block.type === 'example') {
            return `
                <section class="lesson-block lesson-block--example">
                    <div class="lesson-block-label">${this.escapeHtml(block.label || 'Exemple')}</div>
                    <div class="lesson-block-content">${this.escapeHtml(block.content || '')}</div>
                </section>
            `;
        }

        if (block.type === 'tip') {
            return `
                <section class="lesson-block lesson-block--tip">
                    <div class="lesson-block-label">${this.escapeHtml(block.label || 'À retenir')}</div>
                    <div class="lesson-block-content">${this.escapeHtml(block.content || '')}</div>
                </section>
            `;
        }

        if (block.type === 'bullets') {
            const items = Array.isArray(block.items) ? block.items : [];
            return `
                <section class="lesson-block lesson-block--bullets">
                    ${block.label ? `<div class="lesson-block-label">${this.escapeHtml(block.label)}</div>` : ''}
                    <ul class="lesson-bullets">${items.map((item) => `<li>${this.escapeHtml(item)}</li>`).join('')}</ul>
                </section>
            `;
        }

        if (block.type === 'mini-table') {
            const headers = Array.isArray(block.headers) ? block.headers : [];
            const rows = Array.isArray(block.rows) ? block.rows : [];
            return `
                <section class="lesson-block lesson-block--mini-table">
                    ${block.label ? `<div class="lesson-block-label">${this.escapeHtml(block.label)}</div>` : ''}
                    <div class="lesson-table-wrap">
                        <table class="lesson-mini-table">
                            <thead>
                                <tr>${headers.map((header) => `<th>${this.escapeHtml(header)}</th>`).join('')}</tr>
                            </thead>
                            <tbody>
                                ${rows.map((row) => `<tr>${row.map((cell) => `<td>${this.escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                </section>
            `;
        }

        return '';
    },

    // --- NAVIGATION & CLAVIERS ---

    initNavigation() {
        if (this._navInitialized) return;
        this._navInitialized = true;

        if (this.btnHome) {
            this.btnHome.onclick = () => {
                if (window.App?.openNavMenu) window.App.openNavMenu();
            };
        }
        
        if (this.btnBack) {
            this.btnBack.onclick = () => {
                if (window.App?.goBack) window.App.goBack();
                else this.showScreen('screen-profiles');
            };
        }

        const closeButton = document.getElementById('nav-sheet-close');
        const backdrop = document.getElementById('nav-sheet-backdrop');
        if (closeButton) closeButton.onclick = () => this.closeNavSheet();
        if (backdrop) backdrop.onclick = () => this.closeNavSheet();
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') this.closeNavSheet();
        });
    },

    initKeyboard(...args) {
        return UIKeyboards.initKeyboard(...args);
    },

    updateKeyboardLayout(...args) {
        return UIKeyboards.updateKeyboardLayout(...args);
    },

    restoreNumericKeyboard(...args) {
        return UIKeyboards.restoreNumericKeyboard(...args);
    },

    renderAlphaKeyboard(...args) {
        return UIKeyboards.renderAlphaKeyboard(...args);
    },

    renderRomanKeyboard(...args) {
        return UIKeyboards.renderRomanKeyboard(...args);
    },

    renderQCM(...args) {
        return UIKeyboards.renderQCM(...args);
    },

    // --- MOTEUR D'AFFICHAGE (Le CÅ“ur) ---

    getExerciseSurfaceClass(p, isQCM) {
        if (!p) return 'exercise-surface exercise-surface--formula';
        if (!p.isVisual) return 'exercise-surface exercise-surface--formula';
        if (p.visualType === 'factualCard') return 'exercise-surface exercise-surface--documentary';
        if (['spelling', 'audioSpelling', 'conjugation', 'reading', 'homophones'].includes(p.visualType)) {
            return 'exercise-surface exercise-surface--language';
        }
        if (isQCM) return 'exercise-surface exercise-surface--choice';
        return 'exercise-surface exercise-surface--diagram';
    },

    wrapExerciseContent(content, surfaceClass) {
        const shellClasses = ['exercise-shell'];
        if ((surfaceClass || '').includes('exercise-surface--documentary')) shellClasses.push('exercise-shell--documentary');
        else if ((surfaceClass || '').includes('exercise-surface--language')) shellClasses.push('exercise-shell--language');
        else if ((surfaceClass || '').includes('exercise-surface--choice')) shellClasses.push('exercise-shell--choice');
        else if ((surfaceClass || '').includes('exercise-surface--diagram')) shellClasses.push('exercise-shell--diagram');
        else shellClasses.push('exercise-shell--formula');
        return `<div class="${shellClasses.join(' ')}"><div class="${surfaceClass}">${content}</div></div>`;
    },

	updateGameDisplay(p, rawInput, prog) {
	    const problemZone = document.getElementById('math-problem');
	    const answerZone = document.getElementById('user-answer');
	    const instructionZone = document.getElementById('game-instruction');
        const gameScreen = document.getElementById('screen-game');
	    
	    if (!problemZone || !answerZone) return;
        if (!p || typeof p !== 'object') {
            problemZone.innerHTML = this.wrapExerciseContent(
                `<div class="error-msg">Exercice indisponible.</div>`,
                'exercise-surface exercise-surface--formula'
            );
            answerZone.className = 'answer-display is-hidden';
            answerZone.innerHTML = "";
            if (instructionZone) {
                instructionZone.innerHTML = "";
                instructionZone.style.display = 'none';
            }
            return;
        }

	    // 1. Nettoyage et Consigne
	    const input = (rawInput === undefined || rawInput === null) ? "" : rawInput.toString();
	    problemZone.innerHTML = "";
	    answerZone.innerHTML = "";
        if (gameScreen) {
            gameScreen.classList.remove('compact-number-spelling-long', 'compact-number-spelling-huge');
        }
    
    // DÃ©tection du mode QCM (Boutons au lieu de saisie clavier)
    const isQCM = (p.inputType === 'qcm' || p.inputType === 'boolean');
    const rendersQuestionInProblemZone = !p.isVisual || ['homophones', 'timeMemo'].includes(p.visualType);

    if (instructionZone) {
        instructionZone.textContent = rendersQuestionInProblemZone ? "" : (p.question || "");
        instructionZone.style.display = (!rendersQuestionInProblemZone && p.question) ? 'block' : 'none';
    }

    // 2. VISUEL PRINCIPAL
    try {
        let renderedContent = "";
            if (p.isVisual) {
                // Cas particulier : Homophones (on garde ta logique de style)
                if (p.visualType === 'homophones') {
                    renderedContent = `<div class="text-sentence prompt-card prompt-card--sentence">${this.escapeHtml(p.question || "")}</div>`;
                } 
            // Dispatcher vers les moteurs de dessin
            else {
                    const drawMethods = { 
                        clock:'drawClockCard', spelling:'drawSpelling', audioSpelling:'drawAudioSpelling', conjugation:'drawConjugation', 
                        target:'drawSvgTarget', money:'drawMoneyCard', bird:'drawBird', division:'drawDivisionCard',
                        square:'drawSquare', reading: 'drawReading', counting: 'drawCountingCard', fraction: 'drawFraction',
                        conversionTable: 'drawConversionCard', timeMemo: 'drawTimeMemoCard', factualCard: 'drawFactualCard',
                        'geometry-board': 'drawBoardInteractive',
                        timelineOrder: 'drawTimelineOrder', timelinePlace: 'drawTimelinePlace'
                    };
                const method = drawMethods[p.visualType];
                
                if (this[method]) {
                    // On envoie le flag isQCM pour que drawSpelling affiche le mot complet
                    renderedContent = this[method](p, input, isQCM);
                } else {
                    renderedContent = `<div class="error-msg">Moteur de rendu [${p.visualType}] introuvable.</div>`;
                }
            }

            problemZone.innerHTML = this.wrapExerciseContent(
                renderedContent,
                this.getExerciseSurfaceClass(p, isQCM)
            );

            // RÃ©-attachement des clics pour le CarrÃ© Magique (Square)
            if (p.visualType === 'square') {
                const cards = problemZone.querySelectorAll('.number-card');
                cards.forEach(card => {
                    card.onclick = () => {
                        if (window.App && window.App.handleInput) {
                            window.App.handleInput('card-click', card); 
                        }
                    };
                });
            }
        } else {
            // Mode texte (Calculs simples, DictÃ©e de nombres)
            // p.question contient soit le texte, soit le HTML du gros chiffre (DictÃ©e CP)
            const formulaClasses = ['math-formula', 'prompt-card', 'prompt-card--formula'];
            const questionHtml = p.question || "";
            const trustedRichQuestion = questionHtml.includes('number-spelling-prompt');
            const safeQuestionHtml = trustedRichQuestion ? questionHtml : this.escapeHtml(questionHtml);
            let compactMode = '';
            if (questionHtml.includes('number-spelling-prompt')) {
                const formulaClassIndex = formulaClasses.indexOf('prompt-card--formula');
                if (formulaClassIndex !== -1) formulaClasses.splice(formulaClassIndex, 1);
                formulaClasses.push('prompt-card--number-spelling');
                if (questionHtml.includes('number-spelling-prompt--huge')) {
                    formulaClasses.push('prompt-card--number-spelling-huge');
                    compactMode = 'compact-number-spelling-huge';
                } else if (questionHtml.includes('number-spelling-prompt--long')) {
                    formulaClasses.push('prompt-card--number-spelling-long');
                    compactMode = 'compact-number-spelling-long';
                }
            }
            if (gameScreen) {
                gameScreen.classList.remove('compact-number-spelling-long', 'compact-number-spelling-huge');
                if (compactMode) gameScreen.classList.add(compactMode);
            }
            renderedContent = `<div class="${formulaClasses.join(' ')}">${safeQuestionHtml}</div>`;
            problemZone.innerHTML = this.wrapExerciseContent(
                renderedContent,
                this.getExerciseSurfaceClass(p, isQCM)
            );
        }
    } catch (e) {
        console.error("UI: Erreur lors du rendu du problème", e);
        problemZone.innerHTML = this.wrapExerciseContent(
            `<div class="error-msg">Erreur d'affichage visuel.</div>`,
            'exercise-surface exercise-surface--formula'
        );
    }

	    // 3. ZONE DE RÃ‰PONSE (Barre du bas)
	    // On masque la barre si c'est visuel ET textuel (Spelling/Conjugaison) OU si c'est un QCM
	    const hideBottomBar = (['spelling', 'audioSpelling', 'conjugation', 'geometry-board'].includes(p.visualType)) || isQCM || p.inputType === 'board';
	    
	    answerZone.style.display = hideBottomBar ? 'none' : 'flex';
	    answerZone.className = `answer-display ${hideBottomBar ? 'is-hidden' : 'is-idle'}`;
    
	    if (!hideBottomBar) {
        try {
	            if (p.visualType === 'clock') {
	                let s = input.padEnd(4, "_");
	                answerZone.innerHTML = `<div class="clock-digit-block">${s.slice(0, 2)}</div><span class="clock-separator">:</span><div class="clock-digit-block">${s.slice(2, 4)}</div>`;
	            } else if (p.visualType === 'fraction') {
	                answerZone.innerHTML = `
	                    <div class="fraction-answer">
	                        <span class="fraction-answer-current">${this.escapeHtml(input || "?")}</span>
	                        <span class="fraction-answer-separator">/</span>
	                        <span>${this.escapeHtml(p.data?.d || "?")}</span>
	                    </div>`;
	            } else if (p.visualType === 'timelineOrder') {
	                const orderSize = (p.data?.currentOrder || []).length;
	                answerZone.innerHTML = `Ordre prêt : <b class="selection-answer-value">${orderSize}</b> repères`;
	            } else if (p.visualType === 'timelinePlace') {
	                answerZone.innerHTML = `Date choisie : <b class="selection-answer-value">${this.escapeHtml(input || "?")}</b>`;
	            } else if (p.inputType === "selection") {
	                // Cas spÃ©cifique pour le CarrÃ© Magique si on affiche la somme en bas
	                answerZone.innerHTML = `Somme : <b class="selection-answer-value">${this.escapeHtml(input || 0)}</b> / ${this.escapeHtml(p.data?.target || "?")}`;
	            } else {
	                answerZone.innerText = input || "\u00A0";
	            }
        } catch (e) {
            answerZone.innerText = input;
        }
    }

	    // 4. BARRE DE PROGRESSION
		    const bar = document.getElementById('game-progress');
		    if (bar) bar.style.width = (prog || 0) + "%";

        if (p.visualType === 'audioSpelling') {
            const replayButton = problemZone.querySelector('[data-action="replay-audio-spelling"]');
            if (replayButton) {
                replayButton.onclick = () => window.App?.replayAudioSpelling?.();
            }
        }
        this.bindDynamicVisuals(problemZone);
			},

    bindDynamicVisuals(problemZone) {
        if (!problemZone) return;
        problemZone.querySelectorAll('img[data-fallback-target]').forEach((imgNode) => {
            const targetId = imgNode.getAttribute('data-fallback-target');
            if (!targetId) return;
            const fallback = document.getElementById(targetId);
            if (!fallback) return;
            imgNode.addEventListener('load', () => {
                imgNode.style.display = 'block';
                fallback.classList.add('is-hidden');
            }, { once: true });
            imgNode.addEventListener('error', () => {
                imgNode.style.display = 'none';
                fallback.classList.remove('is-hidden');
            }, { once: true });
        });
    },

    // --- FONCTIONS DE DESSIN (Toutes protÃ©gÃ©es par d = p.data || {}) ---

    drawSvgTarget(...args) {
        return UIVisuals.drawSvgTarget(...args);
    },

    getDivisionSteps(...args) {
        return UIVisuals.getDivisionSteps(...args);
    },

    drawSquare(...args) {
        return UIVisuals.drawSquare(...args);
    },

    drawBird(...args) {
        return UIVisuals.drawBird(...args);
    },

    drawFraction(...args) {
        return UIVisuals.drawFraction(...args);
    },

    drawClockCard(...args) {
        return UIVisuals.drawClockCard(...args);
    },

    drawTimeMemoCard(...args) {
        return UIVisuals.drawTimeMemoCard(...args);
    },

    drawMoneyCard(...args) {
        return UIVisuals.drawMoneyCard(...args);
    },

    drawCountingCard(...args) {
        return UIVisuals.drawCountingCard(...args);
    },

    drawConversionCard(...args) {
        return UIVisuals.drawConversionCard(...args);
    },

    drawDivisionCard(...args) {
        return UIVisuals.drawDivisionCard(...args);
    },

	    drawReading(p) {
	        const d = p.data || {};
	        let h = `<div class="reading-container">`, charIdx = 0;
	        (d.syllables || []).forEach((syll, sIdx) => {
	            if(d.text) {
	                while (d.text[charIdx] === " ") { h += `<span class="reading-space"></span>`; charIdx++; }
	            }
	            h += `<span class="syll-${sIdx%2}">`;
	            for (let char of syll) {
	                const isSilent = d.silent && d.silent.includes(charIdx);
	                h += `<span class="${isSilent ? 'char-silent' : ''}">${this.escapeHtml(char)}</span>`;
	                charIdx++;
	            }
	            h += `</span>`;
	        });
	        return h + `</div>`;
    },

    drawAudioSpelling(p, input) {
        const d = p.data || {};
        const target = Array.from((d.targetText || '').toString());
        const typed = Array.from((input || '').toString().toUpperCase());
        const status = (d.audioStatus || 'ready').toString();
        const isUnsupported = status === 'unsupported';
        const isPlaying = status === 'playing';
        const helperText = isUnsupported
            ? "L'audio n'est pas disponible sur cet appareil."
            : isPlaying
                ? "Le mot est en train d'être lu."
                : "Écoute bien le mot, puis écris-le. Tu peux le réécouter.";
	        const slots = target.map((char, idx) => {
	            if (char === ' ') return `<span class="audio-spelling-separator">&nbsp;</span>`;
	            if (char === '-' || char === "'") return `<span class="audio-spelling-separator">${this.escapeHtml(char)}</span>`;
	            return `<span class="audio-spelling-slot">${typed[idx] ? this.escapeHtml(typed[idx]) : "&nbsp;"}</span>`;
	        }).join('');

        return `
            <div class="audio-spelling-container">
                <button type="button" class="btn audio-spelling-replay${isUnsupported ? ' is-disabled' : ''}" data-action="replay-audio-spelling" ${isUnsupported || isPlaying ? 'disabled' : ''}>${isPlaying ? 'Lecture...' : 'Écouter à nouveau'}</button>
                <div class="audio-spelling-hint">${helperText}</div>
                <div class="audio-spelling-slots">${slots}</div>
            </div>
        `;
    },

/* --- uiv2.js : drawSpelling consolidé --- */

    drawSpelling(p, input, isQCM = false) {
        const d = p.data || {};
        const word = (d.word || "").toString();
        const icon = this.safeIcon(d.icon, "❓");
        const imgPath = this.safeImagePath(d.img || "");
        const hasImage = !!imgPath;

        let slots;
	        if (isQCM) {
	            slots = `<div class="word-full">${this.escapeHtml(word)}</div>`;
	        } else {
            slots = '<div class="spelling-slots">' + word.split("").map((_, idx) => {
                const char = input[idx] ? input[idx].toUpperCase() : "";
                return `<span class="letter-slot spelling-slot-fill">${char ? this.escapeHtml(char) : "&nbsp;"}</span>`;
            }).join("") + '</div>';
        }

        const safeId = (window.SecurityUtils?.sanitizeId ? window.SecurityUtils.sanitizeId(word) : word.replace(/[^a-zA-Z0-9]/g, '')) || 'spelling';
        const fallbackText = hasImage ? "Illustration indisponible" : "Icône utilisée";

        return `
            <div class="spelling-container">
                <div class="spelling-visual">
                    <div class="spelling-fallback" id="fallback-${this.escapeAttr(safeId)}">
	                        <div class="fallback-icon fallback-icon-large">${this.escapeHtml(icon)}</div>
                        <div class="spelling-fallback-text">${fallbackText}</div>
                    </div>
                    ${imgPath ? `
                    <img src="${this.escapeAttr(imgPath)}" 
                        alt=""
                        class="spelling-image spelling-image-hidden" 
                        data-fallback-target="fallback-${this.escapeAttr(safeId)}">
                    ` : ''}
                </div>
                ${slots}
            </div>`;
    },

		    drawConjugation(p, input) {
		        const d = p.data || {};
		        const temps = this.escapeHtml(d.tense || "TEMPS");
	        const infinitif = this.escapeHtml(d.infinitive || "VERBE");
	        const pronom = this.escapeHtml(d.pronoun || "?");
	        const saisie = this.escapeHtml(input || "");

        return `
            <div class="conjugation-container">
                <div class="tense-badge">${temps}</div>
                <div class="verb-machine">
                    <div class="verb-infinitive">${infinitif}</div>
                    <div class="verb-body">
                        <span class="pronoun-tag">${pronom}</span>
                        <span class="verb-input-zone">${saisie}</span>
                    </div>
	                    </div>
	                </div>`;
	    },

    drawTimelineOrder(...args) {
        return UIDocumentary.drawTimelineOrder(...args);
    },

    drawTimelinePlace(...args) {
        return UIDocumentary.drawTimelinePlace(...args);
    },

    drawFactualCard(...args) {
        return UIDocumentary.drawFactualCard(...args);
    },

    drawBoardInteractive(...args) {
        return UIBoard.render(...args);
    },
	    
	    showFinalResults(score, total) {
        // 1. Mise Ã  jour des Ã©toiles
        this.renderStars(score, total);
        
        // 2. Mise Ã  jour du texte du score
        const scoreEl = document.getElementById('result-score');
        if (scoreEl) scoreEl.innerText = `Score : ${score} / ${total}`;

        // 3. Affichage de l'Ã©cran
        this.showScreen('screen-results');
    },

    renderStars(score, total) {
        const container = document.getElementById('stars-container');
        if (!container) return;
        
        // Division par zÃ©ro protection
        if(total === 0) total = 1;
        
        const p = (score/total)*100;
        const count = p===100?3:p>=75?2:p>=50?1:0;
        
        container.innerHTML = Array(3).fill(0).map((_, i) => `<span class="star ${i < count ? 'active' : ''}">★</span>`).join("");
    },

    launchCelebration() {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
        const container = document.body;
        if(!container) return;

        // Limite pour ne pas surcharger le navigateur
        for (let i = 0; i < 40; i++) {
            const div = document.createElement('div');
            div.className = 'confetti';
            div.style.left = Math.random() * 100 + 'vw';
            div.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            div.style.animationDuration = (Math.random() * 2 + 1) + 's';
            div.style.opacity = Math.random();
            container.appendChild(div);

            setTimeout(() => { if(div.parentNode) div.remove(); }, 3000);
        }
        
        const resScreen = document.getElementById('screen-results');
        if (resScreen) {
            resScreen.classList.remove('victory-bounce'); // Reset
            void resScreen.offsetWidth; // Force reflow
            resScreen.classList.add('victory-bounce');
        }
    }
};

window.UI = UI;


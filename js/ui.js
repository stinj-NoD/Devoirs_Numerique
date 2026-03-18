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

    /**
     * Gestionnaire d'affichage des Ã©crans
     */
    showScreen(id) {
        // 1. Gestion des Ã©crans
        if (this.screens.length === 0) return console.warn("UI: Aucun Ã©cran trouvÃ© dans le DOM");
        
        this.screens.forEach(s => {
            if (s.id === id) {
                s.classList.add('active');
                s.style.display = 'flex';
            } else {
                s.classList.remove('active');
                s.style.display = 'none';
            }
        });

        // 2. Gestion intelligente du bouton retour
        const hideBack = ['screen-profiles', 'screen-results'];
        if (this.btnBack) {
            this.btnBack.style.visibility = hideBack.includes(id) ? 'hidden' : 'visible';
        }
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

    buildCardContent(title, subtitle = "") {
        return `
            <div class="card-content">
                <span class="card-title">${title || 'Exercice'}</span>
                ${subtitle ? `<span class="card-subtitle">${subtitle}</span>` : ''}
            </div>
        `;
    },

    // --- PROFILS & MENUS ---

    renderProfiles(profiles, onSelect, onDelete) {
        const container = document.getElementById('profiles-list');
        if (!container) return;
        container.innerHTML = "";

        // Protection si profiles est null/undefined
        (profiles || []).forEach(p => {
            const card = document.createElement('div');
            card.className = 'card profile-card';
            // Injection sÃ©curisÃ©e des valeurs
            card.innerHTML = `
                <div class="btn btn--icon btn--danger btn-delete-profile" title="Supprimer">🗑️</div>
                <span class="card-icon">${this.safeIcon(p.avatar, '\u{1F464}')}</span>
                ${this.buildCardContent(p.name || 'Anonyme')}
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

        (data || []).forEach(item => {
            // AccÃ¨s sÃ©curisÃ© au Storage
            let stars = 0;
            try {
                if (typeof Storage !== 'undefined' && Storage.getRecord) {
                    const gradeId = window.App?.state?.currentGrade?.gradeId || null;
                    const record = Storage.getRecord(item.id, gradeId);
                    if (record) stars = record.stars || 0;
                }
            } catch (e) { console.warn("UI: Erreur lecture stars", e); }

            const starsHtml = stars > 0 ? `<div class="menu-stars">${'★'.repeat(stars)}</div>` : "";
            
            const card = document.createElement('div');
            card.className = 'card menu-card';
            card.innerHTML = `
                <span class="card-icon">${this.safeIcon(item.icon, '\u{1F4DD}')}</span>
                ${this.buildCardContent(item.title || item.nom || 'Exercice', item.subtitle)}
                ${starsHtml}`;
            card.onclick = () => callback(item);
            container.appendChild(card);
        });
    },

    // --- NAVIGATION & CLAVIERS ---

    initNavigation() {
        if (this.btnHome) {
            this.btnHome.onclick = () => {
                if (window.App?.goHome) window.App.goHome();
                else this.showScreen('screen-profiles');
            };
        }
        
        if (this.btnBack) {
            this.btnBack.onclick = () => {
                if (window.App?.goBack) window.App.goBack();
                else this.showScreen('screen-profiles');
            };
        }
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
        instructionZone.innerHTML = rendersQuestionInProblemZone ? "" : (p.question || "");
        instructionZone.style.display = (!rendersQuestionInProblemZone && p.question) ? 'block' : 'none';
    }

    // 2. VISUEL PRINCIPAL
    try {
        let renderedContent = "";
        if (p.isVisual) {
            // Cas particulier : Homophones (on garde ta logique de style)
            if (p.visualType === 'homophones') {
                renderedContent = `<div class="text-sentence prompt-card prompt-card--sentence">${p.question || ""}</div>`;
            } 
            // Dispatcher vers les moteurs de dessin
            else {
                    const drawMethods = { 
                    clock:'drawClockCard', spelling:'drawSpelling', audioSpelling:'drawAudioSpelling', conjugation:'drawConjugation', 
                    target:'drawSvgTarget', money:'drawMoneyCard', bird:'drawBird', division:'drawDivisionCard',
                    square:'drawSquare', reading: 'drawReading', counting: 'drawCountingCard', fraction: 'drawFraction',
                    conversionTable: 'drawConversionCard', timeMemo: 'drawTimeMemoCard', factualCard: 'drawFactualCard',
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
            renderedContent = `<div class="${formulaClasses.join(' ')}">${questionHtml}</div>`;
            problemZone.innerHTML = this.wrapExerciseContent(
                renderedContent,
                this.getExerciseSurfaceClass(p, isQCM)
            );
        }
    } catch (e) {
        console.error("UI: Erreur lors du rendu du problÃ¨me", e);
        problemZone.innerHTML = this.wrapExerciseContent(
            `<div class="error-msg">Erreur d'affichage visuel.</div>`,
            'exercise-surface exercise-surface--formula'
        );
    }

	    // 3. ZONE DE RÃ‰PONSE (Barre du bas)
	    // On masque la barre si c'est visuel ET textuel (Spelling/Conjugaison) OU si c'est un QCM
	    const hideBottomBar = (['spelling', 'audioSpelling', 'conjugation'].includes(p.visualType)) || isQCM;
	    
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
                        <span class="fraction-answer-current">${input || "?"}</span>
                        <span class="fraction-answer-separator">/</span>
                        <span>${p.data?.d || "?"}</span>
                    </div>`;
            } else if (p.visualType === 'timelineOrder') {
                const orderSize = (p.data?.currentOrder || []).length;
                answerZone.innerHTML = `Ordre prêt : <b class="selection-answer-value">${orderSize}</b> repères`;
            } else if (p.visualType === 'timelinePlace') {
                answerZone.innerHTML = `Date choisie : <b class="selection-answer-value">${input || "?"}</b>`;
            } else if (p.inputType === "selection") {
                // Cas spÃ©cifique pour le CarrÃ© Magique si on affiche la somme en bas
                answerZone.innerHTML = `Somme : <b class="selection-answer-value">${input || 0}</b> / ${p.data?.target || "?"}`;
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
                h += `<span class="${isSilent ? 'char-silent' : ''}">${char}</span>`;
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
            if (char === '-' || char === "'") return `<span class="audio-spelling-separator">${char}</span>`;
            return `<span class="audio-spelling-slot">${typed[idx] || "&nbsp;"}</span>`;
        }).join('');

        return `
            <div class="audio-spelling-container">
                <button type="button" class="btn audio-spelling-replay${isUnsupported ? ' is-disabled' : ''}" data-action="replay-audio-spelling" ${isUnsupported || isPlaying ? 'disabled' : ''}>${isPlaying ? 'Lecture...' : 'Écouter à nouveau'}</button>
                <div class="audio-spelling-hint">${helperText}</div>
                <div class="audio-spelling-slots">${slots}</div>
            </div>
        `;
    },

/* --- uiv2.js : drawSpelling consolidÃ© --- */

    drawSpelling(p, input, isQCM = false) {
        // --- DEBUG LOGS (Regarde ta console F12) ---
        console.log("ðŸ” DRAW SPELLING APPELÃ‰");
        console.log("ðŸ‘‰ Mode QCM reÃ§u :", isQCM);
        console.log("ðŸ‘‰ DonnÃ©es reÃ§ues (p.data) :", p.data);
        // -------------------------------------------

        const d = p.data || {};
        const word = (d.word || "").toString();
        const icon = this.safeIcon(d.icon, "❓");
        const imgPath = d.img || "";
        const hasImage = !!imgPath;

        // LOGIQUE CP : Si c'est un QCM (Un/Une), on affiche le mot complet
        let slots;
        if (isQCM) {
            // Affichage MOT COMPLET
            console.log("âœ… Affichage en mode MOT COMPLET :", word);
            slots = `<div class="word-full">${word}</div>`;
        } else {
            // Affichage DICTÃ‰E (Trous)
            console.log("âœï¸ Affichage en mode DICTÃ‰E (Trous)");
            slots = '<div class="spelling-slots">' + word.split("").map((_, idx) => {
                const char = input[idx] ? input[idx].toUpperCase() : "";
                return `<span class="letter-slot spelling-slot-fill">${char || "&nbsp;"}</span>`;
            }).join("") + '</div>';
        }

        const safeId = word.replace(/[^a-zA-Z0-9]/g, '');
        const fallbackText = hasImage ? "Illustration indisponible" : "Icône utilisée";

        return `
            <div class="spelling-container">
                <div class="spelling-visual">
                    <div class="spelling-fallback" id="fallback-${safeId}">
                        <div class="fallback-icon fallback-icon-large">${icon}</div>
                        <div class="spelling-fallback-text">${fallbackText}</div>
                    </div>
                    ${imgPath ? `
                    <img src="${imgPath}" 
                        alt=""
                        class="spelling-image spelling-image-hidden" 
                        onload="this.style.display='block'; document.getElementById('fallback-${safeId}').classList.add('is-hidden');"
                        onerror="this.style.display='none'; document.getElementById('fallback-${safeId}').classList.remove('is-hidden');">
                    ` : ''}
                </div>
                ${slots}
            </div>`;
    },

	    drawConjugation(p, input) {
	        const d = p.data || {};
	        const temps = d.tense || "TEMPS";
        const infinitif = d.infinitive || "VERBE";
        const pronom = d.pronoun || "?";
        const saisie = input || "";

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
window.addEventListener('DOMContentLoaded', () => UI.initNavigation());


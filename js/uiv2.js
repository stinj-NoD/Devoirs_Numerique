/*
 * Devoir Numérique - UI.js
 * Copyright (C) 2026 [Stinj-NoD]
 * Version : 3.0 (Hardened & Secure)
 */

const UI = {
    // Getters sécurisés (retournent null si élément absent)
    get screens() { return document.querySelectorAll('.screen'); },
    get btnBack() { return document.getElementById('btn-back'); },
    get btnHome() { return document.getElementById('btn-home'); },

    /**
     * Gestionnaire d'affichage des écrans
     */
    showScreen(id) {
        // 1. Gestion des écrans
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

    // --- PROFILS & MENUS ---

    renderProfiles(profiles, onSelect, onDelete) {
        const container = document.getElementById('profiles-list');
        if (!container) return;
        container.innerHTML = "";

        // Protection si profiles est null/undefined
        (profiles || []).forEach(p => {
            const card = document.createElement('div');
            card.className = 'card profile-card';
            // Injection sécurisée des valeurs
            card.innerHTML = `
                <div class="btn-delete-profile" title="Supprimer">🗑️</div>
                <span class="card-icon">${p.avatar || '👤'}</span>
                <span class="card-title">${p.name || 'Anonyme'}</span>
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
            // Accès sécurisé au Storage
            let stars = 0;
            try {
                if (typeof Storage !== 'undefined' && Storage.getRecord) {
                    const record = Storage.getRecord(item.id);
                    if (record) stars = record.stars || 0;
                }
            } catch (e) { console.warn("UI: Erreur lecture stars", e); }

            const starsHtml = stars > 0 ? `<div class="menu-stars">${'★'.repeat(stars)}</div>` : "";
            
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <span class="card-icon">${item.icon || '📝'}</span>
                <div style="flex:1">
                    <span class="card-title">${item.title || item.nom || 'Exercice'}</span>
                    ${item.subtitle ? `<span class="card-subtitle">${item.subtitle}</span>` : ''}
                </div>
                ${starsHtml}`;
            card.onclick = () => callback(item);
            container.appendChild(card);
        });
    },

    // --- NAVIGATION & CLAVIERS ---

    initNavigation() {
        if (this.btnHome) this.btnHome.onclick = () => location.reload();
        
        if (this.btnBack) {
            this.btnBack.onclick = () => {
                const cur = document.querySelector('.screen.active')?.id;
                // Mapping de navigation sécurisé
                const map = { 
                    'screen-game': 'screen-levels', 
                    'screen-levels': 'screen-themes', 
                    'screen-themes': 'screen-grades',
                    'screen-grades': 'screen-profiles'
                };
                if (cur && map[cur]) this.showScreen(map[cur]);
                else this.showScreen('screen-profiles'); // Fallback safe
            };
        }
    },

    initKeyboard(callback) {
        const container = document.querySelector('.keyboard-container');
        if (container) {
            container.onclick = (e) => {
                const key = e.target.closest('.key');
                // On vérifie que key existe et qu'il a un data-val
                if (key && key.hasAttribute('data-val')) {
                    callback(key.getAttribute('data-val'), key);
                }
            };
        }
    },

    updateKeyboardLayout(type, data = null) {
        const numKb = document.getElementById('keyboard-num');
        const boolKb = document.getElementById('keyboard-boolean'); // Legacy check
        const answerZone = document.getElementById('user-answer');
        
        if (!numKb) return;

        // Reset display
        numKb.style.display = "none";
        if (boolKb) boolKb.style.display = "none";
        if (answerZone) answerZone.style.display = "flex";

        try {
            if (type === "boolean" || type === "qcm") {
                // Extraction sécurisée des choix
                let choices = ["VRAI", "FAUX"];
                if (data) {
                    choices = data.choices || (data.data?.choices) || choices;
                }
                this.renderQCM(choices);
                numKb.style.display = "grid";
                if (answerZone) answerZone.style.display = "none"; 
                
            } else if (type === "selection") {
                numKb.innerHTML = `<button class="key action ok wide-btn" data-val="ok" style="grid-column: 1 / -1;">VALIDER LA SÉLECTION</button>`;
                numKb.style.display = "grid";
                numKb.style.gridTemplateColumns = "1fr";
                
            } else if (type === "alpha") {
                this.renderAlphaKeyboard();
                numKb.style.display = "block";
                
            } else {
                this.restoreNumericKeyboard();
                numKb.style.display = "grid";
            }
        } catch (e) {
            console.error("UI: Erreur Layout Clavier", e);
            this.restoreNumericKeyboard(); // Fallback ultime
            numKb.style.display = "grid";
        }
    },

    restoreNumericKeyboard() {
        const kb = document.getElementById('keyboard-num');
        if(!kb) return;
        kb.style.gridTemplateColumns = "repeat(3, 1fr)";
        kb.innerHTML = "123456789".split("").map(v => `<button class="key" data-val="${v}">${v}</button>`).join("") +
                       `<button class="key del" data-val="backspace">⌫</button>` +
                       `<button class="key" data-val="0">0</button>` +
                       `<button class="key action ok" data-val="ok">OK</button>`;
    },

    renderAlphaKeyboard() {
        const kb = document.getElementById('keyboard-num');
        if(!kb) return;
        
        kb.style.gridTemplateColumns = "none";
        const rows = ["azertyuiop", "qsdfghjklm", "wxcvbn"];
        
        let html = '<div class="alpha-keyboard">';
        html += `<div class="kb-row accent-row">` + "éèàçêîôû-".split('').map(a => 
            `<button class="key letter-key" data-val="${a}">${a}</button>`
        ).join('') + `</div>`;

        rows.forEach(row => {
            html += `<div class="kb-row">`;
            row.split('').forEach(char => html += `<button class="key letter-key" data-val="${char}">${char}</button>`);
            html += `</div>`;
        });
        
        html += `<div class="kb-row" style="margin-top:5px">
            <button class="key action del" data-val="backspace" style="flex: 2;">⌫</button>
            <button class="key space-key" data-val=" " style="flex: 5;">ESPACE</button>
            <button class="key action ok" data-val="ok" style="flex: 3;">OK</button>
        </div></div>`;
        kb.innerHTML = html; 
    },

    renderQCM(choices) {
        const kb = document.getElementById('keyboard-num');
        if(!kb) return;
        
        // Calcul sécurisé des colonnes (max 3 pour éviter d'écraser l'écran)
        const cols = Math.min(choices.length, 3);
        kb.style.gridTemplateColumns = `repeat(${choices.length > 4 ? 2 : cols}, 1fr)`;
        kb.style.gap = "10px";
        
        kb.innerHTML = choices.map(v => {
            let cssClass = "key"; 
            if (v === "VRAI" || v === ">") cssClass += " btn-true";
            else if (v === "FAUX" || v === "<") cssClass += " btn-false";
            else cssClass += " btn-neutral";
            
            // Gestion taille police pour symboles
            const style = (['<','>','='].includes(v)) ? "font-size: 2.5rem;" : "";
            return `<button class="${cssClass}" data-val="${v}" style="${style}">${v}</button>`;
        }).join("");
    },

    // --- MOTEUR D'AFFICHAGE (Le Cœur) ---

updateGameDisplay(p, rawInput, prog) {
    const problemZone = document.getElementById('math-problem');
    const answerZone = document.getElementById('user-answer');
    const instructionZone = document.getElementById('game-instruction');
    
    if (!problemZone || !answerZone) return;

    // 1. Nettoyage et Consigne
    const input = (rawInput === undefined || rawInput === null) ? "" : rawInput.toString();
    problemZone.innerHTML = "";
    answerZone.innerHTML = "";
    
    // On affiche la consigne (ex: "Choisis le bon mot" ou "Écris en lettres")
    if (instructionZone) instructionZone.innerHTML = p.question || "";

    // Détection du mode QCM (Boutons au lieu de saisie clavier)
    const isQCM = (p.inputType === 'qcm' || p.inputType === 'boolean');

    // 2. VISUEL PRINCIPAL
    try {
        if (p.isVisual) {
            // Cas particulier : Homophones (on garde ta logique de style)
            if (p.visualType === 'homophones') {
                problemZone.innerHTML = `<div class="text-sentence">${p.question || ""}</div>`;
            } 
            // Dispatcher vers les moteurs de dessin
            else {
                const drawMethods = { 
                    clock:'drawClock', spelling:'drawSpelling', conjugation:'drawConjugation', 
                    target:'drawSvgTarget', money:'drawMoney', bird:'drawBird', division:'drawDivision',
                    square:'drawSquare', reading: 'drawReading', counting: 'drawCounting', fraction: 'drawFraction',
                    conversionTable: 'drawConversionTable'
                };
                const method = drawMethods[p.visualType];
                
                if (this[method]) {
                    // On envoie le flag isQCM pour que drawSpelling affiche le mot complet
                    problemZone.innerHTML = this[method](p, input, isQCM);
                } else {
                    problemZone.innerHTML = `<div class="error-msg">Moteur de rendu [${p.visualType}] introuvable.</div>`;
                }
            }

            // Ré-attachement des clics pour le Carré Magique (Square)
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
            // Mode texte (Calculs simples, Dictée de nombres)
            // p.question contient soit le texte, soit le HTML du gros chiffre (Dictée CP)
            problemZone.innerHTML = `<div class="math-formula">${p.question || ""}</div>`;
        }
    } catch (e) {
        console.error("UI: Erreur lors du rendu du problème", e);
        problemZone.innerHTML = `<div class="error-msg">Erreur d'affichage visuel.</div>`;
    }

    // 3. ZONE DE RÉPONSE (Barre du bas)
    // On masque la barre si c'est visuel ET textuel (Spelling/Conjugaison) OU si c'est un QCM
    const hideBottomBar = (['spelling', 'conjugation'].includes(p.visualType)) || isQCM;
    
    answerZone.style.display = hideBottomBar ? 'none' : 'flex';
    
    if (!hideBottomBar) {
        try {
            if (p.visualType === 'clock') {
                let s = input.padEnd(4, "_");
                answerZone.innerHTML = `<div class="clock-digit-block">${s.slice(0, 2)}</div><span class="clock-separator">:</span><div class="clock-digit-block">${s.slice(2, 4)}</div>`;
            } else if (p.visualType === 'fraction') {
                answerZone.innerHTML = `
                    <div class="fraction-answer">
                        <span style="color:var(--primary)">${input || "?"}</span>
                        <span style="margin: 0 10px; opacity: 0.3">/</span>
                        <span>${p.data?.d || "?"}</span>
                    </div>`;
            } else if (p.inputType === "selection") {
                // Cas spécifique pour le Carré Magique si on affiche la somme en bas
                answerZone.innerHTML = `Somme : <b style="color:var(--primary); margin-left:10px">${input || 0}</b> / ${p.data?.target || "?"}`;
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
},

    // --- FONCTIONS DE DESSIN (Toutes protégées par d = p.data || {}) ---

    drawSvgTarget(p) {
        const d = p.data || {};
        const s = 200, c = s / 2;
        const sortedZones = [...(d.zonesDefinitions || [])].sort((a, b) => b - a);
        const colors = ['#4A90E2', '#FF6B6B', '#FFD700', '#48bb78', '#9F7AEA'];
        
        let svg = `<svg viewBox="0 0 ${s} ${s}" width="180" height="180">`;
        
        if (sortedZones.length === 0) return svg + `<text x="100" y="100">Erreur Zone</text></svg>`;

        sortedZones.forEach((val, i) => {
            const r = 90 - (i * (90 / sortedZones.length));
            svg += `<circle cx="${c}" cy="${c}" r="${r}" fill="${colors[i % colors.length]}" stroke="white" stroke-width="2"/>`;
            svg += `<text x="${c}" y="${c - r + 15}" text-anchor="middle" font-size="12" font-weight="bold" fill="white" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5)">${val}</text>`;
        });
        
        (d.hits || []).forEach(h => {
            // Protection index -1
            const zoneIdx = sortedZones.indexOf(h.val);
            if(zoneIdx === -1) return;
            
            const rHit = 90 - (zoneIdx * (90 / sortedZones.length)) - 10;
            const tx = c + rHit * Math.cos(h.angle);
            const ty = c + rHit * Math.sin(h.angle);
            svg += `<circle cx="${tx}" cy="${ty}" r="6" fill="black" stroke="white" stroke-width="2"/>`;
        });
        return svg + `</svg>`;
    },

    getDivisionSteps(dividend, divisor) {
        const dividendStr = dividend.toString();
        let steps = [];
        let currentPart = "";
        
        // On parcourt chaque chiffre du dividende
        for (let i = 0; i < dividendStr.length; i++) {
            // On "descend" le chiffre suivant
            currentPart += dividendStr[i];
            let currentVal = parseInt(currentPart);

            // On regarde si on peut diviser ce morceau
            // (Ou si c'est la fin et qu'il faut traiter le reste)
            const q = Math.floor(currentVal / divisor);
            
            // Condition d'affichage d'une étape :
            // 1. On a trouvé un quotient > 0 (ex: dans 12 combien de 5 -> 2)
            // 2. OU c'est le dernier chiffre et on doit afficher le reste final (même si c'est 0)
            // 3. Cas spécial : on évite d'afficher des étapes "0" inutiles au tout début
            if (q > 0 || i === dividendStr.length - 1) {
                const sub = q * divisor;
                const remainder = currentVal - sub;
                
                steps.push({
                    sub: sub,             // Ce qu'on soustrait (ex: 12)
                    rem: remainder,       // Le résultat (ex: 0)
                    nextDigit: dividendStr[i+1] || "", // Le chiffre qu'on va descendre après
                    endIndex: i,          // L'index où se termine l'opération (pour l'alignement)
                    partLength: currentPart.length // La longueur du nombre traité (pour reculer l'alignement)
                });
                
                // Le reste devient le début du prochain nombre
                // Ex: Reste 2, prochain chiffre 5 -> "25"
                currentPart = remainder.toString();
                if (remainder === 0) currentPart = ""; // Si reste 0, on repart à vide pour ne pas avoir "05"
            }
        }
        return steps;
    },

            // À mettre dans uiv2.js (remplace l'ancienne version)
    drawDivision(p, input, isQCM) {
        const d = p.data || {};
        const divStr = d.dividend.toString();
        const sor = d.divisor;
        
        // 1. Calcul des étapes
        const steps = this.getDivisionSteps(d.dividend, sor);
        
        // 2. Préparation de la Grille (Colonne de Gauche)
        let gridItemsHtml = "";
        
        // LIGNE 1 : Le Dividende
        divStr.split('').forEach((char, i) => {
            // J'ajoute line-height: 1 ici aussi pour aligner
            gridItemsHtml += `<div style="grid-column: ${i + 1}; grid-row: 1; text-align: center; line-height: 1;">${char}</div>`;
        });

        let currentRow = 2;

        steps.forEach((step) => {
            // --- A. La Soustraction (ex: -12) ---
            const subStr = step.sub.toString();
            const startCol = (step.endIndex - subStr.length + 1) + 1;
            const endCol = step.endIndex + 2;

            gridItemsHtml += `
                <div style="
                    grid-column: ${startCol} / ${endCol}; 
                    grid-row: ${currentRow}; 
                    text-align: right; 
                    color: #7f8c8d;
                    position: relative;
                    line-height: 1; /* Pour éviter les débordements verticaux */
                ">
                    <span style="position:absolute; left:-12px; font-size:0.7em; top:2px;">-</span>${subStr}
                </div>
            `;
            currentRow++;

        // --- B. Le Résultat (C'EST ICI LE CORRECTIF) ---
        const remStr = step.rem.toString();
        const nextDigit = step.nextDigit;
        const fullRemStr = remStr + nextDigit;
        
        const remEndIndex = step.nextDigit ? step.endIndex + 1 : step.endIndex;
        const remStartCol = (remEndIndex - fullRemStr.length + 1) + 1;
        const remEndCol = remEndIndex + 2;

        gridItemsHtml += `
            <div style="
                grid-column: ${remStartCol} / ${remEndCol}; 
                grid-row: ${currentRow}; 
                text-align: right; 
                /* LE FIX EST ICI : */
                border-top: 2px solid #2c3e50;
                padding-top: 4px; /* Espace entre le trait et les chiffres dessous */
                line-height: 1;   /* Resserre les chiffres verticalement */
                font-weight: bold;
                /* Fin du fix */
            ">
                ${remStr}<span style="color:#e74c3c;">${nextDigit}</span>
            </div>
        `;
        currentRow++;
    });

    const nbCols = divStr.length;
    
    // J'ai aussi légèrement augmenté la hauteur des lignes de grille (40px au lieu de 35px)
    return `
    <div class="division-wrapper" style="
        display: flex;
        justify-content: center;
        margin-top: 20px;
        font-family: 'Courier New', monospace;
        font-size: 2.2rem;
        font-weight: bold;
        color: #2c3e50;
    ">
        <div style="
            display: grid;
            grid-template-columns: repeat(${nbCols}, 25px);
            grid-auto-rows: 40px; /* Un peu plus de hauteur par ligne */
            padding-right: 15px;
            border-right: 4px solid #2c3e50;
            align-items: end; /* Aligne les chiffres vers le bas de leur case pour coller à la ligne */
        ">
            ${gridItemsHtml}
            <div style="grid-row: ${currentRow}; height:50px;"></div>
        </div>

        <div style="
            padding-left: 15px; 
            display: flex; 
            flex-direction: column;
        ">
            <div style="
                border-bottom: 4px solid #2c3e50; 
                height: 40px; /* Synchro avec la grille */
                display: flex;
                align-items: flex-end; /* Le diviseur posé sur la barre */
                padding-bottom: 4px;
            ">
                ${sor}
            </div>
            
            <div style="margin-top: 10px;">
                <div style="
                    color: var(--primary);
                    background: #e3f2fd;
                    padding: 5px 10px;
                    border-radius: 8px;
                    text-align: center;
                    min-width: 60px;
                ">
                    ${input || '?'}
                </div>
                <div style="font-size:0.8rem; color:#95a5a6; margin-top:5px; text-align:center;">Quotient</div>
            </div>
        </div>
    </div>`;
},

    drawMoney(p) {
        const d = p.data || {};
        const ms = { 1:{b:'#CD7F32',s:40}, 2:{b:'#C0C0C0',s:50}, 5:{b:'#81c784',w:70}, 10:{b:'#e57373',w:75}, 20:{b:'#64b5f6',w:80}, 50:{b:'#ffb74d',w:90} };
        
        let h = '<div class="money-table" style="position:relative; width:100%; height:180px; background:#fff; border-radius:10px; border:1px solid #ddd;">';
        
        (d.hits || []).forEach((item, i) => {
            const val = (typeof item === 'object') ? item.val : item;
            const conf = ms[val] || ms[1]; // Fallback pièce de 1
            const isBill = !!conf.w;
            const x = (i % 4) * 75 + 15;
            const y = Math.floor(i / 4) * 50 + 10;
            h += `<div class="${isBill ? 'bill' : 'coin'}" style="position:absolute; left:${x}px; top:${y}px; width:${isBill ? conf.w : conf.s}px; height:${isBill ? 40 : conf.s}px; background:${conf.b}; border-radius:${isBill ? 5 : 50}%; display:flex; align-items:center; justify-content:center; font-weight:bold; box-shadow: 0 4px 0 rgba(0,0,0,0.1); border:1px solid rgba(0,0,0,0.1); font-size:14px;">${val}€</div>`;
        });
        return h + '</div>';
    },

    drawClock(p) {
        const d = p.data || {};
        // Valeurs par défaut sécurisées
        const mins = d.minutes || 0;
        const hours = d.hours || 0;
        
        const s = 160, c = s / 2, r = 70;
        const ma = (mins / 60) * 360;
        const ha = ((hours % 12) / 12) * 360 + (mins / 60) * 30;

        const periodInfo = `<div class="period-badge" style="background:var(--primary); color:white; padding:5px 15px; border-radius:20px; font-weight:bold; margin-bottom:15px; font-size:0.9rem;">${d.periodIcon || '🕐'} ${d.periodText || ''}</div>`;

        let svg = `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><circle cx="${c}" cy="${c}" r="${r}" fill="white" stroke="var(--dark)" stroke-width="3"/>`;

        for (let i = 1; i <= 12; i++) {
            const a = (i * 30) * (Math.PI / 180);
            const x = c + (r - 16) * Math.sin(a);
            const y = c - (r - 16) * Math.cos(a);
            svg += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="12px" font-weight="bold" fill="var(--dark)">${i}</text>`;
        }

        svg += `<line x1="${c}" y1="${c}" x2="${c + 35 * Math.sin(ha * Math.PI / 180)}" y2="${c - 35 * Math.cos(ha * Math.PI / 180)}" stroke="var(--dark)" stroke-width="6" stroke-linecap="round"/>`;
        svg += `<line x1="${c}" y1="${c}" x2="${c + 52 * Math.sin(ma * Math.PI / 180)}" y2="${c - 52 * Math.cos(ma * Math.PI / 180)}" stroke="var(--secondary)" stroke-width="4" stroke-linecap="round"/>`;
        svg += `<circle cx="${c}" cy="${c}" r="4" fill="var(--dark)"/>`;
        svg += `</svg>`;

        return `<div style="display:flex; flex-direction:column; align-items:center;">${periodInfo}${svg}</div>`;
    },

    drawSquare(p) {
        const d = p.data || {};
        const nums = d.numbers || [];
        const gridSize = Math.sqrt(nums.length || 9);
        const selected = d.selectedIndices || [];
        
        return `<div class="square-container">
            <div class="target-badge">CIBLE : ${d.target || "?"}</div>
            <div class="square-grid" style="grid-template-columns: repeat(${gridSize}, 1fr)">
                ${nums.map((n, idx) => {
                    const isSelected = selected.includes(idx);
                    return `<div class="number-card ${isSelected ? 'selected' : ''}" data-idx="${idx}">${n}</div>`;
                }).join('')}
            </div>
        </div>`;
    },

    drawBird(p) {
        const d = p.data || {};
        return `<div class="sky-container">
            <div class="bird-container" style="animation-duration:${d.duration || 8}s;">
                <div class="bird-bubble">${d.question || "?"}</div>
                <div class="bird-sprite">🐦</div>
            </div>
        </div>`;
    },

    drawCounting(p) {
        const d = p.data || {};
        let h = '<div class="counting-area" style="display:flex; gap:10px; justify-content:center; align-items:flex-end; min-height:150px;">';
        
        const tens = d.tens || 0;
        const units = d.units || 0;

        for (let i = 0; i < tens; i++) {
            h += '<div class="ten-bar" style="width:30px; display:flex; flex-direction:column-reverse; border:2px solid var(--dark); border-radius:4px; overflow:hidden;">';
            for (let j = 0; j < 10; j++) h += '<div class="cube" style="height:12px; width:100%; border:1px solid rgba(0,0,0,0.1); background:var(--primary);"></div>';
            h += '</div>';
        }
        if (units > 0) {
            h += '<div class="units-grid" style="display:grid; grid-template-columns:repeat(2,1fr); gap:5px;">';
            for (let i = 0; i < units; i++) {
                h += '<div class="cube unit" style="width:25px; height:25px; background:#ECC94B; border-radius:4px; border:2px solid var(--dark);"></div>';
            }
            h += '</div>';
        }
        return h + '</div>';
    },

    drawConversionTable(p, input) {
        const d = p.data || {};
        // Configuration des colonnes selon le type
        let cols = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
        if (d.type === 'masse') cols = ['kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'];
        if (d.type === 'capacite') cols = ['kL', 'hL', 'daL', 'L', 'dL', 'cL', 'mL'];

        // Construction du tableau HTML
        let headerHtml = "";
        cols.forEach(c => {
            // On met en surbrillance les colonnes concernées
            const highlight = (c === d.u1 || c === d.u2) ? 'background:#e3f2fd; color:var(--primary);' : '';
            headerHtml += `<div style="flex:1; border-right:1px solid #ccc; padding:5px 0; ${highlight}">${c}</div>`;
        });

        return `
        <div class="conversion-container" style="width:100%; max-width:600px; margin:0 auto;">
            <div style="font-size:2.5rem; font-weight:bold; margin-bottom:20px; color:#2c3e50;">
                ${d.val} <span style="font-size:0.8em; color:#7f8c8d">${d.u1}</span> 
                <span style="color:#ccc"> ➝ </span> 
                ? <span style="font-size:0.8em; color:var(--primary)">${d.u2}</span>
            </div>

            <div style="
                display: flex; 
                border: 2px solid #2c3e50; 
                border-radius: 8px; 
                font-weight:bold; 
                background: white;
                text-align: center;
                font-size: 1.1rem;
            ">
                ${headerHtml}
            </div>
            <div style="font-size:0.9rem; color:#95a5a6; margin-top:5px; text-align:center;">
                Utilise le tableau pour t'aider !
            </div>
        </div>`;
    },

    drawFraction(p) {
        const d = p.data || {};
        const denom = d.d || 1;
        const num = d.n || 0;
        
        const radius = 60, center = 80; 
        let paths = "";
        
        for (let i = 0; i < denom; i++) {
            const a1 = (i * 2 * Math.PI) / denom - Math.PI/2;
            const a2 = ((i + 1) * 2 * Math.PI) / denom - Math.PI/2;
            const x1 = center + radius * Math.cos(a1), y1 = center + radius * Math.sin(a1);
            const x2 = center + radius * Math.cos(a2), y2 = center + radius * Math.sin(a2);
            const color = i < num ? 'var(--primary)' : 'white';
            paths += `<path d="M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z" fill="${color}" stroke="var(--dark)" stroke-width="2" />`;
        }
        return `<div class="fraction-display"><svg viewBox="0 0 160 160" width="140" height="140">${paths}</svg></div>`;
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

/* --- uiv2.js : drawSpelling consolidé --- */

drawSpelling(p, input, isQCM = false) {
    // --- DEBUG LOGS (Regarde ta console F12) ---
    console.log("🔍 DRAW SPELLING APPELÉ");
    console.log("👉 Mode QCM reçu :", isQCM);
    console.log("👉 Données reçues (p.data) :", p.data);
    // -------------------------------------------

    const d = p.data || {};
    const word = (d.word || "").toString();
    const icon = d.icon || "❓";
    const imgPath = d.img || "";

    // LOGIQUE CP : Si c'est un QCM (Un/Une), on affiche le mot complet
    let slots;
    if (isQCM) {
        // Affichage MOT COMPLET
        console.log("✅ Affichage en mode MOT COMPLET :", word);
        slots = `<div class="word-full" style="font-size:3rem; font-weight:bold; letter-spacing:2px; margin-top:15px; text-align:center; color:#333;">${word}</div>`;
    } else {
        // Affichage DICTÉE (Trous)
        console.log("✏️ Affichage en mode DICTÉE (Trous)");
        slots = '<div class="spelling-slots">' + word.split("").map((_, idx) => {
            const char = input[idx] ? input[idx].toUpperCase() : "";
            return `<span class="letter-slot" style="display:inline-block; width:30px; height:40px; border-bottom:2px solid #333; margin:2px; text-align:center;">${char || "&nbsp;"}</span>`;
        }).join("") + '</div>';
    }

    const safeId = word.replace(/[^a-zA-Z0-9]/g, '');

    return `
        <div class="spelling-container" style="display:flex; flex-direction:column; align-items:center;">
            <div class="spelling-visual">
                <div class="fallback-icon" id="fallback-${safeId}" style="font-size:4rem;">
                    ${icon}
                </div>
                ${imgPath ? `
                <img src="${imgPath}" 
                     class="spelling-image" 
                     style="display:none; max-height:150px;" 
                     onload="this.style.display='block'; document.getElementById('fallback-${safeId}').style.display='none';"
                     onerror="this.style.display='none';">
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

    renderStars(score, total) {
        const container = document.getElementById('stars-container');
        if (!container) return;
        
        // Division par zéro protection
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

window.addEventListener('DOMContentLoaded', () => UI.initNavigation());

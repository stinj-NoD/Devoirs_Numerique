/*
 * Devoir Numérique
 * Copyright (C) 2026 [Stinj-NoD]
 *
 * Ce programme est un logiciel libre : vous pouvez le redistribuer et/ou le modifier
 * selon les termes de la Licence Publique Générale GNU publiée par la
 * Free Software Foundation, soit la version 3 de la licence, soit
 * (à votre gré) toute version ultérieure.
 *
 * Ce programme est distribué dans l'espoir qu'il sera utile,
 * mais SANS AUCUNE GARANTIE ; sans même la garantie implicite de
 * COMMERCIALISATION ou D'ADÉQUATION À UN USAGE PARTICULIER.
 * Voir la Licence Publique Générale GNU pour plus de détails.
 */
const UI = {
    // Éléments mis à jour dynamiquement
    get screens() { return document.querySelectorAll('.screen'); },
    get btnBack() { return document.getElementById('btn-back'); },
    get btnHome() { return document.getElementById('btn-home'); },

    // --- NAVIGATION ---
    showScreen(id) {
        this.screens.forEach(s => {
            if (s.id === id) {
                s.classList.add('active');
                s.style.display = 'flex';
            } else {
                s.classList.remove('active');
                s.style.display = 'none';
            }
        });

        // Visibilité intelligente du bouton retour
        const hideBack = ['screen-profiles', 'screen-results'];
        if (this.btnBack) {
            this.btnBack.style.visibility = hideBack.includes(id) ? 'hidden' : 'visible';
        }
    },

    updateHeader(text) {
        const title = document.getElementById('app-title');
        if (title) title.innerText = text;
    },

    renderMenu(id, data, callback) {
        const container = document.getElementById(id);
        if (!container) return;
        container.innerHTML = "";

        (data || []).forEach(item => {
            const record = Storage.getRecord(item.id);
            const stars = record ? record.stars : 0;
            const starsHtml = stars > 0 ? `<div class="menu-stars">${'★'.repeat(stars)}</div>` : "";
            
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <span class="card-icon">${item.icon || '📝'}</span>
                <div style="flex:1">
                    <span class="card-title">${item.title || item.nom}</span>
                    ${item.subtitle ? `<span class="card-subtitle">${item.subtitle}</span>` : ''}
                </div>
                ${starsHtml}`;
            card.onclick = () => callback(item);
            container.appendChild(card);
        });
    },

    // --- CŒUR DU JEU & CLAVIERS ---
    initNavigation() {
        // Fixe les boutons de navigation (Home et Back)
        if (this.btnHome) {
            this.btnHome.onclick = () => location.reload();
        }
        if (this.btnBack) {
            this.btnBack.onclick = () => {
                const cur = document.querySelector('.screen.active')?.id;
                const map = { 
                    'screen-game': 'screen-levels', 
                    'screen-levels': 'screen-themes', 
                    'screen-themes': 'screen-grades',
                    'screen-grades': 'screen-profiles'
                };
                if (map[cur]) this.showScreen(map[cur]);
            };
        }
    },

    initKeyboard(callback) {
        const container = document.querySelector('.keyboard-container');
        if (container) {
            container.onclick = (e) => {
                const key = e.target.closest('.key');
                if (key) callback(key.getAttribute('data-val'), key);
            };
        }
    },

    updateKeyboardLayout(type, data = null) {
        const numKb = document.getElementById('keyboard-num');
        const boolKb = document.getElementById('keyboard-boolean');
        const answerZone = document.getElementById('user-answer');
        const container = document.querySelector('.keyboard-container');

        if (!container || !numKb) return;

        // Reset pour éviter les chevauchements
        numKb.style.display = "none";
        if (boolKb) boolKb.style.display = "none";
        answerZone.style.display = "flex";

        if (type === "boolean" || type === "qcm") {
            this.renderQCM(data ? data.choices : ["VRAI", "FAUX"]);
            numKb.style.display = "grid";
            answerZone.style.display = "none";
        } else if (type === "selection") {
            numKb.innerHTML = `<button class="key action ok" data-val="ok" style="grid-column: 1 / -1; height: 65px;">VALIDER LA SÉLECTION</button>`;
            numKb.style.display = "grid";
            numKb.style.gridTemplateColumns = "1fr";
        } else if (type === "alpha") {
            this.renderAlphaKeyboard();
            numKb.style.display = "block";
        } else {
            this.restoreNumericKeyboard();
            numKb.style.display = "grid";
        }
    },

    restoreNumericKeyboard() {
        const kb = document.getElementById('keyboard-num');
        kb.style.gridTemplateColumns = "repeat(3, 1fr)";
        kb.innerHTML = "123456789".split("").map(v => `<button class="key" data-val="${v}">${v}</button>`).join("") +
                       `<button class="key del" data-val="backspace">⌫</button>` +
                       `<button class="key" data-val="0">0</button>` +
                       `<button class="key action ok" data-val="ok">OK</button>`;
    },

renderAlphaKeyboard() {
        const kb = document.getElementById('keyboard-num');
        // Récupération sécurisée de l'état majuscule
        const caps = typeof App !== 'undefined' ? App.state.isUppercase : true;
        const rows = ["AZERTYUIOP", "QSDFGHJKLM", "WXCVBN"];
        
        kb.style.display = "block"; 
        kb.style.gridTemplateColumns = "none";

        let html = '<div class="alpha-keyboard">';
        
        // CORRECTION 1 : Les accents basculent maintenant en minuscule
        html += `<div class="kb-row">` + "ÉÈÀÇÊÎÔÛ".split('').map(a => {
            const char = caps ? a : a.toLowerCase();
            return `<button class="key letter-key accent-key" style="height:35px; flex:1; font-size:0.8rem" data-val="${char}">${char}</button>`;
        }).join('') + `</div>`;

        rows.forEach(row => {
            html += `<div class="kb-row">`;
            row.split('').forEach(l => { 
                const char = caps ? l : l.toLowerCase(); 
                html += `<button class="key letter-key" style="flex:1" data-val="${char}">${char}</button>`; 
            });
            html += `</div>`;
        });
        
        html += `<div class="kb-row" style="margin-top:5px">
            <button class="key action" data-val="shift" style="flex:1.5; font-size:1rem">${caps ? 'abc' : 'ABC'}</button>
            <button class="key" data-val=" " style="flex:3">ESPACE</button>
            <button class="key action del" data-val="backspace" style="flex:1.5">⌫</button>
            <button class="key action ok" data-val="ok" style="flex:2.5">OK</button>
        </div></div>`;
        kb.innerHTML = html; 
    },

    renderQCM(choices) {
        const kb = document.getElementById('keyboard-num');
        kb.style.display = "grid";
        // Si 2 choix, 2 colonnes. Si plus, on avise (ici max 2 colonnes pour les homophones pour que ce soit gros)
        /*kb.style.gridTemplateColumns = choices.length > 2 ? "1fr 1fr" : `repeat(${choices.length}, 1fr)`;*/
        kb.style.gridTemplateColumns = `repeat(${choices.length}, 1fr)`;
        kb.style.gap = "15px";

        kb.innerHTML = choices.map(v => {
            // CORRECTION 2 & 3 : Gestion fine des couleurs
            let cssClass = "key"; // Classe de base (Blanc)
            
            if (v === "VRAI") cssClass += " btn-true";      // Vert
            else if (v === "FAUX") cssClass += " btn-false"; // Rouge
            else cssClass += " btn-neutral";                 // Blanc (Homophones: a, à, et, est...)

            // Note : on ajoute 'ok' pour que le moteur sache que c'est une validation immédiate
            return `<button class="${cssClass}" data-val="${v}">${v}</button>`;
        }).join("");
    },

    // --- MOTEURS DE RENDU VISUELS ---
updateGameDisplay(p, input, prog) {
        const problemZone = document.getElementById('math-problem');
        const answerZone = document.getElementById('user-answer');
        if (!problemZone || !answerZone) return;

        problemZone.innerHTML = "";
        answerZone.innerHTML = "";

        // 1. DESSIN DU PROBLÈME
        if (p.isVisual) {
            const drawMethods = { 
                clock:'drawClock', spelling:'drawSpelling', conjugation:'drawConjugation', 
                target:'drawSvgTarget', money:'drawMoney', bird:'drawBird', 
                square:'drawSquare', reading: 'drawReading', counting: 'drawCounting', fraction: 'drawFraction'
            };
            const method = drawMethods[p.visualType];
            if (this[method]) {
                let badge = p.tense ? `<div class="tense-badge" style="background:var(--primary)">${p.tense}</div>` : "";
                problemZone.innerHTML = badge + this[method](p.data, input);
            }

            // --- FIX CARRÉ MAGIQUE : Rendre les cartes cliquables ---
            if (p.visualType === 'square') {
                const cards = problemZone.querySelectorAll('.number-card');
                cards.forEach(card => {
                    card.onclick = (e) => {
                        // On appelle la méthode de App.js qui gère l'input
                        if (typeof App !== 'undefined' && App.handleInput) {
                            // On passe l'élément complet pour récupérer data-idx
                            App.handleInput('card-click', card); 
                        }
                    };
                });
            }
            // ---------------------------------------------------------

        } else {
            problemZone.innerHTML = `<div style="padding:10px">${p.question || ""}</div>`;
        }

        // 2. AFFICHAGE DE LA RÉPONSE / INPUT
        if (p.visualType === 'clock') {
            let s = input.padEnd(4, "_");
            answerZone.innerHTML = `<div class="clock-digit-block">${s.slice(0, 2)}</div><span class="clock-separator">:</span><div class="clock-digit-block">${s.slice(2, 4)}</div>`;
        } else if (p.inputType === "numeric" || p.inputType === "alpha") {
            answerZone.innerText = input || "\u00A0";
        } else if (p.inputType === "selection") {
            // Affiche la somme courante pour le carré magique
            answerZone.innerHTML = `Somme : <b style="color:var(--primary); margin-left:10px">${input || 0}</b> / ${p.data.target}`;
        }

        // 3. BARRE DE PROGRÈS
        const bar = document.getElementById('game-progress');
        if (bar) bar.style.width = prog + "%";
    },

    drawReading(d) {
        let h = `<div class="reading-container">`, charIdx = 0;
        d.syllables.forEach((syll, sIdx) => {
            while (d.text[charIdx] === " ") { h += `<span class="reading-space"></span>`; charIdx++; }
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

drawSvgTarget(d) {
        const s = 200, c = s / 2;
        
        // 1. Tri des zones (Petit chiffre = Grand rayon)
        const sortedZones = [...d.zonesDefinitions].sort((a, b) => a - b);
        const step = 80 / sortedZones.length;
        const colors = ['#FFD700', '#9ACD32', '#87CEEB', '#DA70D6', '#FF6347'];

        let svg = ''; 

        // 2. Dessin des cercles
        sortedZones.forEach((val, index) => { 
            const r = 80 - (index * step);
            const color = colors[index % colors.length];
            svg += `<circle cx="${c}" cy="${c}" r="${r}" fill="${color}" stroke="#fff" stroke-width="2"/>`;
            svg += `<text x="${c}" y="${c - r + 12}" text-anchor="middle" font-size="10px" font-weight="bold" fill="rgba(0,0,0,0.5)">${val}</text>`; 
        });

        // 3. Dessin des impacts (Position FIXE)
        d.hits.forEach((h) => { 
            // h est maintenant un objet {val: 10, angle: 1.54...}
            const val = h.val; 
            const zoneIndex = sortedZones.indexOf(val);
            
            if (zoneIndex > -1) {
                const bandRadius = 80 - (zoneIndex * step) - (step / 2);
                
                // ON UTILISE L'ANGLE DÉJÀ CALCULÉ PAR LE MOTEUR
                const angle = h.angle; 
                
                const tx = c + bandRadius * Math.cos(angle);
                const ty = c + bandRadius * Math.sin(angle);
                
                svg += `<circle cx="${tx}" cy="${ty}" r="6" fill="#E53E3E" stroke="white" stroke-width="2" style="filter:drop-shadow(1px 1px 2px rgba(0,0,0,0.3))"></circle>`; 
            }
        });

        return `<svg width="${s}" height="${s}">${svg}</svg>`;
    },

drawMoney(d) {
        const ms = { 1:{b:'#CD7F32',s:40}, 2:{b:'#C0C0C0',s:50}, 5:{b:'#81c784',w:70}, 10:{b:'#e57373',w:75}, 20:{b:'#64b5f6',w:80}, 50:{b:'#ffb74d',w:90} };
        
        let h = '<div class="money-table" style="position:relative;width:100%;height:180px">';
        
        d.hits.forEach((item, i) => {
            // --- FIX : GESTION DES OBJETS ---
            // On vérifie si 'item' est un objet (nouveau moteur) ou un nombre (ancien compatibilité)
            const v = (typeof item === 'object' && item.val !== undefined) ? item.val : item;

            const s = ms[v] || ms[1]; // Récupère config pièce ou billet
            const isB = !!s.w; // Est-ce un billet ? (si width définie)
            
            // Positionnement en grille (4 par ligne) pour éviter le chaos
            const x = (i % 4) * 75 + 10;
            const y = Math.floor(i / 4) * 50 + 10;

            h += `<div class="${isB?'bill':'coin'}" style="position:absolute;left:${x}px;top:${y}px;width:${isB?s.w:s.s}px;height:${isB?40:s.s}px;background:${s.b};border-radius:${isB?4:50}px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:bold;box-shadow:2px 2px 4px rgba(0,0,0,0.1);border:1px solid rgba(0,0,0,0.1)">${v}€</div>`;
        });
        
        return h + '</div>';
    },

    drawClock(d) {
        const s=160, c=s/2, r=70, ma=(d.minutes/60)*360, ha=((d.hours%12)/12)*360+(d.minutes/60)*30;
        let svg=`<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><circle cx="${c}" cy="${c}" r="${r}" fill="white" stroke="var(--dark)" stroke-width="3"/>`;
        for (let i=1; i<=12; i++) { const a=(i*30)*(Math.PI/180), x=c+(r-12)*Math.sin(a), y=c-(r-12)*Math.cos(a); svg+=`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="10px" font-weight="bold">${i}</text>`; }
        svg+=`<line x1="${c}" y1="${c}" x2="${c+35*Math.sin(ha*Math.PI/180)}" y2="${c-35*Math.cos(ha*Math.PI/180)}" stroke="var(--dark)" stroke-width="5" stroke-linecap="round"/><line x1="${c}" y1="${c}" x2="${c+50*Math.sin(ma*Math.PI/180)}" y2="${c-50*Math.cos(ma*Math.PI/180)}" stroke="var(--secondary)" stroke-width="3" stroke-linecap="round"/></svg>`;
        return svg;
    },

drawSquare(d) {
        // d.numbers est le tableau de chiffres, d.target est la cible
        const size = Math.sqrt(d.numbers.length);
        const selected = d.selectedIndices || [];
        
        return `
            <div class="square-container">
                <div class="target-badge">CIBLE : ${d.target}</div>
                <div class="square-grid" style="grid-template-columns: repeat(${size}, 1fr)">
                    ${d.numbers.map((n, idx) => {
                        const isSelected = selected.includes(idx);
                        return `
                            <div class="number-card ${isSelected ? 'selected' : ''}" 
                                 data-idx="${idx}" 
                                 data-val="${n}">
                                 ${n}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    drawBird: (d) => `<div class="sky-container"><div class="bird-container" style="animation-duration:${d.duration||8}s;"><div class="bird-bubble">${d.question}</div><div class="bird-sprite">🐦</div></div></div>`,

    drawCounting(d) {
        let h = '<div class="counting-area">';
        for (let i=0; i<d.tens; i++) { h += '<div class="ten-bar">'; for (let j=0; j<10; j++) h += '<div class="cube"></div>'; h += '</div>'; }
        if (d.units > 0) { h += '<div class="units-grid" style="display:grid; grid-template-columns:repeat(2,1fr); gap:4px;">'; for (let i=0; i<d.units; i++) h += '<div class="cube unit"></div>'; h += '</div>'; }
        return h + '</div>';
    },

    drawFraction(d) {
        const radius = 60, center = 80; let paths = "";
        for (let i = 0; i < d.d; i++) {
            const a1 = (i * 2 * Math.PI) / d.d - Math.PI/2, a2 = ((i + 1) * 2 * Math.PI) / d.d - Math.PI/2;
            const x1 = center + radius * Math.cos(a1), y1 = center + radius * Math.sin(a1);
            const x2 = center + radius * Math.cos(a2), y2 = center + radius * Math.sin(a2);
            paths += `<path d="M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z" fill="${i < d.n ? 'var(--primary)' : 'white'}" stroke="var(--dark)" stroke-width="2" />`;
        }
        return `<div class="fraction-display"><svg viewBox="0 0 160 160" width="140" height="140">${paths}</svg><div class="fraction-formula" style="font-size:1.5rem; margin-top:10px">... / ${d.d}</div></div>`;
    },

    drawSpelling(d, input) {
        const slots = d.word.split("").map((_, idx) => `<span class="letter-slot">${input[idx] || "_"}</span>`).join("");
        return `<div class="spelling-media"><img src="${d.imageUrl}" class="spelling-image" onerror="this.nextElementSibling.style.display='flex';this.style.display='none'"><div style="display:none;font-size:3rem">${d.icon||'❓'}</div></div><div class="spelling-slots">${slots}</div>`;
    },

    drawConjugation(d, i) {
        const isCompound = d.isCompound;
        const parts = i.split(" ");
        return `<div class="verb-machine"><div class="verb-infinitive">${d.infinitive}</div><div class="verb-body"><span class="pronoun-tag">${d.pronoun}</span><span class="verb-input-zone">${parts.join(" ") || "..."}</span></div></div>`;
    },

    renderStars(score, total) {
        const container = document.getElementById('stars-container');
        if (!container) return;
        const p = (score/total)*100, count = p===100?3:p>=75?2:p>=50?1:0;
        container.innerHTML = Array(3).fill(0).map((_, i) => `<span class="star ${i < count ? 'active' : ''}">★</span>`).join("");
    }
};

// Initialisation au chargement

window.addEventListener('DOMContentLoaded', () => UI.initNavigation());

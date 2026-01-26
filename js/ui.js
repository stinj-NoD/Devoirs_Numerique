/* * ---------------------------------------------------------
 * DEVOIR NUMÉRIQUE - Système Éducatif Minimaliste
 * Certifié Original - © 2026
 * Signature ID: DN-JS-2026-STABLE
 * ---------------------------------------------------------
/**
 * UI.js - Gestionnaire d'Interface Utilisateur (Version Intégrale Consolidée)
 */
const UI = {
    screens: document.querySelectorAll('.screen'),
    headerTitle: document.getElementById('app-title'),
    btnBack: document.getElementById('btn-back'),
    btnHome: document.getElementById('btn-home'),
    
    showScreen(id) {
        this.screens.forEach(s => s.classList.toggle('active', s.id === id));
        const hideBack = ['screen-profiles', 'screen-grades', 'screen-results'];
        this.btnBack.style.visibility = hideBack.includes(id) ? 'hidden' : 'visible';
    },

    updateHeader: (text) => UI.headerTitle.innerText = text,

    renderMenu(id, data, callback) {
        const container = document.getElementById(id); if (!container) return;
        container.innerHTML = "";
        (data || []).forEach(item => {
            const record = Storage.getRecord(item.id), 
                  starsHtml = record && record.stars > 0 ? `<div class="menu-stars">${'★'.repeat(record.stars)}${'☆'.repeat(3 - record.stars)}</div>` : "";
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

    initKeyboard: (callback) => {
        document.querySelector('.keyboard-container').onclick = (e) => {
            const key = e.target.closest('.key'); 
            if (key) callback(key.getAttribute('data-val'), key);
        };
    },

    updateKeyboardLayout(type, data = null) {
        const numKb = document.getElementById('keyboard-num'), 
              boolKb = document.getElementById('keyboard-boolean'), 
              container = document.querySelector('.keyboard-container'), 
              answerDisplay = document.getElementById('user-answer');

        container.style.display = "block"; 
        numKb.style.display = "none"; 
        boolKb.style.display = "none"; 
        answerDisplay.style.display = "inline-block";

        if (type === "boolean") { 
            boolKb.style.display = "grid"; 
            answerDisplay.style.display = "none"; 
        }
        else if (type === "qcm") { 
            this.renderQCM(data.choices); 
            numKb.style.display = "grid"; 
            answerDisplay.style.display = "none"; 
        }
        else if (type === "selection") {
            // Correctif vital pour le Carré Magique : permet la validation
            numKb.innerHTML = `<button class="key action ok" data-val="ok" style="grid-column: 1 / -1; height: 70px; font-size: 1.4rem;">VALIDER LA SÉLECTION</button>`;
            numKb.style.display = "grid";
            numKb.style.gridTemplateColumns = "1fr";
        }
        else if (type === "alpha") { 
            this.renderAlphaKeyboard(); 
            numKb.style.display = "block"; 
        }
        else { 
            this.restoreNumericKeyboard(); 
            numKb.style.display = "grid"; 
        }
    },

    updateGameDisplay(p, input, prog) {
    const problemZone = document.getElementById('math-problem'), 
          answerZone = document.getElementById('user-answer');
    
    // On nettoie avant de redessiner
    problemZone.innerHTML = ""; 
    // On ne vide answerZone.innerHTML que si ce n'est pas une horloge pour éviter les clignotements
    if (p.visualType !== 'clock') answerZone.innerHTML = ""; 
    
    // Style de base
    Object.assign(answerZone.style, { display: "flex", color: "var(--primary)" });

    if (p.isVisual) {
        const drawMethods = { 
            clock:'drawClock', spelling:'drawSpelling', conjugation:'drawConjugation', 
            target:'drawSvgTarget', money:'drawMoney', bird:'drawBird', 
            square:'drawSquare', reading: 'drawReading', counting: 'drawCounting', fraction: 'drawFraction'
        };
        problemZone.innerHTML = this[drawMethods[p.visualType]](p.data, input);
    } else {
        problemZone.innerHTML = p.question || ""; 
    }

    // Gestion de l'affichage de la saisie selon le type
    if (p.visualType === 'clock') {
        let s = input.padEnd(4, "_");
        answerZone.innerHTML = `<div class="clock-digit-block">${s.slice(0, 2)}</div><span class="clock-separator">:</span><div class="clock-digit-block">${s.slice(2, 4)}</div>`;
    } 
    else if (p.inputType === "selection") {
        answerZone.innerHTML = `Somme : <b>${input || 0}</b> / ${p.data.target}`;
    }
    else if (p.inputType === "numeric") {
        answerZone.style.borderBottom = "6px solid var(--primary)";
        answerZone.innerText = input || "\u00A0"; // Espace insécable pour garder la hauteur
    } 
    else {
        // En mode alpha (Conjugaison/Orthographe), le texte s'inscrit directement 
        // dans le moteur (problemZone), donc on cache la zone du bas.
        answerZone.style.display = "none";
    }

    document.getElementById('game-progress').style.width = prog + "%";
}

    // --- MOTEURS DE RENDU ---

    drawConjugation(d, i) {
        if (d.isCompound) {
            const parts = i.split(" ");
            const inputAux = parts[0] || "";
            const inputPP = parts.slice(1).join(" ") || ""; 

            return `<div class="verb-machine compound">
                <div class="verb-header"><span class="verb-icon">${d.icon || '⏳'}</span><span class="verb-infinitive">${d.infinitive}</span></div>
                <div class="verb-body compound-layout">
                    <div class="pronoun-tag">${d.pronoun}</div>
                    <div class="compound-inputs">
                        <div class="verb-input-zone aux-zone">${inputAux || "..."}</div>
                        <div class="verb-input-zone pp-zone">${inputPP || "..."}</div>
                    </div>
                </div>
                <div class="hint-text">Appuie sur <b>ESPACE</b> pour changer de case</div>
            </div>`;
        }
        return `<div class="verb-machine">
            <div class="verb-header"><span class="verb-icon">${d.icon || '📝'}</span><span class="verb-infinitive">${d.infinitive}</span></div>
            <div class="verb-body"><div class="pronoun-tag">${d.pronoun}</div><div class="verb-input-zone">${i || "..."}</div></div>
        </div>`;
    },

    drawSquare(d) {
        const size = Math.sqrt(d.numbers.length);
        return `<div class="game-container-selection">
            <div class="target-badge">Cible : ${d.target}</div>
            <div style="display:grid; grid-template-columns:repeat(${size},1fr); gap:10px; max-width:300px; margin:0 auto;">
                ${d.numbers.map((n, idx) => `<div class="key number-card ${(d.selectedIndices||[]).includes(idx)?'selected':''}" data-val="${n}" data-idx="${idx}">${n}</div>`).join('')}
            </div>
        </div>`;
    },

    drawSpelling(d, input) {
        const slots = d.word.split("").map((_, idx) => `<span class="letter-slot">${input[idx] || "_"}</span>`).join("");
        return `<div class="spelling-container">
            <div class="spelling-media">
                <img src="${d.imageUrl}" class="spelling-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="spelling-placeholder" style="display:none;">${d.icon || '❓'}</div>
            </div>
            <div class="spelling-slots">${slots}</div>
        </div>`;
    },

    drawClock(d) {
        const s=240, c=s/2, r=100, ma=(d.minutes/60)*360, ha=((d.hours%12)/12)*360+(d.minutes/60)*30;
        let svg=`<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><circle cx="${c}" cy="${c}" r="${r}" fill="white" stroke="#2D3748" stroke-width="6"/>`;
        for (let i=1; i<=12; i++) { 
            const a=(i*30)*(Math.PI/180), x=c+(r-22)*Math.sin(a), y=c-(r-22)*Math.cos(a); 
            svg+=`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="16px" font-weight="900" fill="#4A5568">${i}</text>`; 
        }
        svg+=`<line x1="${c}" y1="${c}" x2="${c+55*Math.sin(ha*Math.PI/180)}" y2="${c-55*Math.cos(ha*Math.PI/180)}" stroke="#2D3748" stroke-width="8" stroke-linecap="round"/><line x1="${c}" y1="${c}" x2="${c+80*Math.sin(ma*Math.PI/180)}" y2="${c-80*Math.cos(ma*Math.PI/180)}" stroke="#FF6B6B" stroke-width="5" stroke-linecap="round"/><circle cx="${c}" cy="${c}" r="6" fill="#2D3748"/></svg>`;
        return `<div class="clock-exercise">${svg}</div>`;
    },

    drawSvgTarget(d) {
        const s=300, c=s/2, zs=[...d.zonesDefinitions].sort((a,b)=>a-b), st=130/zs.length;
        let svg=''; zs.reverse().forEach((v, i) => { const r=130-(i*st); svg+=`<circle cx="${c}" cy="${c}" r="${r}" fill="${['#FFD700','#9ACD32','#87CEEB','#DA70D6','#FF6347'][i%5]}" stroke="#fff" stroke-width="2"/><text x="${c}" y="${c-r+15}" text-anchor="middle" font-size="14px" fill="rgba(0,0,0,0.4)">${v}</text>`; });
        d.hits.forEach((h, i) => { const r=130-(zs.length-1-zs.indexOf(h))*st-(st/2), a=(i*(360/d.hits.length))*(Math.PI/180); svg+=`<circle cx="${c+r*Math.cos(a)}" cy="${c+r*Math.sin(a)}" r="10" fill="#E53E3E" stroke="white" stroke-width="2"></circle>`; });
        return `<svg width="${s}" height="${s}">${svg}</svg>`;
    },

    drawMoney(d) {
        const ms = { 1:{b:'#CD7F32',s:45}, 2:{b:'#C0C0C0',s:55}, 5:{b:'#81c784',w:85}, 10:{b:'#e57373',w:90}, 20:{b:'#64b5f6',w:95}, 50:{b:'#ffb74d',w:105} };
        let h = '<div class="money-table" style="position:relative;height:240px;width:100%">';
        d.hits.forEach((v, i) => {
            const s = ms[v] || ms[1], isB = !!s.w, x = (i%4)*75 + (Math.random()*10), y = Math.floor(i/4)*65;
            h += `<div class="${isB?'bill':'coin'}" style="position:absolute;left:${x}px;top:${y}px;width:${isB?s.w:s.s}px;height:${isB?55:s.s}px;background:${s.b};border-radius:${isB?6:50}px;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,0.7);font-weight:bold;box-shadow:2px 2px 4px rgba(0,0,0,0.15);transform:rotate(${(i*7)%20-10}deg)">${v}€</div>`;
        });
        return h + '</div>';
    },

    drawBird: (d) => `<div class="sky-container"><div class="bird-container" style="animation-duration:${d.duration||8}s;"><div class="bird-bubble">${d.question}</div><div class="bird-sprite">🐦</div></div></div>`,

    drawReading(d) {
        let h = `<div class="reading-container">`, charIdx = 0;
        d.syllables.forEach((syll, sIdx) => {
            while (d.text[charIdx] === " ") { h += `<span>&nbsp;</span>`; charIdx++; }
            h += `<span class="syll-${sIdx%2}">`;
            for (let char of syll) { h += `<span class="${d.silent && d.silent.includes(charIdx)?'char-silent':''}">${char}</span>`; charIdx++; }
            h += `</span>`;
        });
        return h + `</div>`;
    },

    drawCounting(d) {
        let h = '<div class="counting-area">';
        for (let i=0; i<d.tens; i++) { h += '<div class="ten-bar">'; for (let j=0; j<10; j++) h += '<div class="cube"></div>'; h += '</div>'; }
        if (d.units > 0) { h += '<div class="units-grid">'; for (let i=0; i<d.units; i++) h += '<div class="cube unit"></div>'; h += '</div>'; }
        return h + '</div>';
    },

    drawFraction(d) {
        const radius = 80, center = 100; let paths = "";
        for (let i = 0; i < d.d; i++) {
            const a1 = (i * 2 * Math.PI) / d.d - Math.PI/2, a2 = ((i + 1) * 2 * Math.PI) / d.d - Math.PI/2;
            const x1 = center + radius * Math.cos(a1), y1 = center + radius * Math.sin(a1);
            const x2 = center + radius * Math.cos(a2), y2 = center + radius * Math.sin(a2);
            paths += `<path d="M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z" fill="${i < d.n ? 'var(--primary)' : 'white'}" stroke="var(--dark)" stroke-width="2" />`;
        }
        return `<div class="fraction-display"><svg viewBox="0 0 200 200" width="160" height="160">${paths}</svg><div class="fraction-formula">... / ${d.d}</div></div>`;
    },

    // --- CLAVIERS ET FEEDBACK ---

    renderAlphaKeyboard() {
        const kb = document.getElementById('keyboard-num'), caps = App.state.isUppercase;
        const rows = ["AZERTYUIOP", "QSDFGHJKLM", "WXCVBN", "ÉÈÀÇÊÎÔÛ"];
        let html = '<div class="alpha-keyboard">';
        rows.forEach((row, idx) => {
            html += `<div class="kb-row">`;
            row.split('').forEach(l => { const char = caps ? l : l.toLowerCase(); html += `<button class="key letter-key ${idx===3?'accent-key':''}" data-val="${char}">${char}</button>`; });
            html += `</div>`;
        });
        html += `<div class="kb-row"><button class="key action shift-btn" data-val="shift" style="flex:1">${caps ? 'abc' : 'ABC'}</button><button class="key letter-key space-key" data-val=" " style="flex:3">ESPACE</button><button class="key action del" data-val="backspace" style="flex:1">⌫</button><button class="key action ok" data-val="ok" style="flex:2">VALIDER</button></div></div>`;
        kb.innerHTML = html; kb.style.gridTemplateColumns = "none"; 
    },

    restoreNumericKeyboard() {
        const kb = document.getElementById('keyboard-num'); kb.style.gridTemplateColumns = "repeat(3, 1fr)";
        kb.innerHTML = "123456789".split("").map(v => `<button class="key" data-val="${v}">${v}</button>`).join("") + 
                       `<button class="key del" data-val="backspace">⌫</button><button class="key" data-val="0">0</button><button class="key action ok" data-val="ok">OK</button>`;
    },

    renderQCM(choices) {
        const kb = document.getElementById('keyboard-num'); kb.innerHTML = ""; kb.style.gridTemplateColumns = `repeat(${choices.length}, 1fr)`;
        choices.forEach(v => kb.innerHTML += `<button class="key action bool" data-val="${v}">${v}</button>`);
    },

    renderStars(score, total) {
        const container = document.getElementById('stars-container'); container.innerHTML = "";
        const p = (score/total)*100, count = p===100?3:p>=75?2:p>=50?1:0;
        for (let i=1; i<=3; i++) {
            const s = document.createElement('span'); s.className='star'+(i<=count?' active':''); s.innerHTML='★';
            s.style.animationDelay=(i*0.2)+'s'; container.appendChild(s);
        }
    }
};

UI.btnHome.onclick = () => location.reload();
UI.btnBack.onclick = () => {
    const map = { 'screen-game':'screen-levels', 'screen-levels':'screen-themes', 'screen-themes':'screen-grades' };
    const cur = document.querySelector('.screen.active').id; 
    if (map[cur]) UI.showScreen(map[cur]);
};


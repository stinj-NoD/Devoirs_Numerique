/**
 * UI.js - Gestionnaire d'Interface Utilisateur (Version Intégrale Vérifiée)
 */
const UI = {
    screens: document.querySelectorAll('.screen'),
    headerTitle: document.getElementById('app-title'),
    btnBack: document.getElementById('btn-back'),
    btnHome: document.getElementById('btn-home'),
    
    showScreen(id) {
        this.screens.forEach(s => s.classList.toggle('active', s.id === id));
        const hb = ['screen-profiles', 'screen-grades', 'screen-results'];
        this.btnBack.style.visibility = hb.includes(id) ? 'hidden' : 'visible';
    },

    updateHeader: (t) => UI.headerTitle.innerText = t,

    renderMenu(id, data, cb) {
        const c = document.getElementById(id); if (!c) return;
        c.innerHTML = "";
        (data || []).forEach(item => {
            const r = Storage.getRecord(item.id), 
                  s = r && r.stars > 0 ? `<div class="menu-stars">${'★'.repeat(r.stars)}${'☆'.repeat(3 - r.stars)}</div>` : "";
            const d = document.createElement('div'); d.className = 'card';
            d.innerHTML = `
                <span class="card-icon">${item.icon || '📝'}</span>
                <div style="flex:1">
                    <span class="card-title">${item.title || item.nom}</span>
                    ${item.subtitle ? `<span class="card-subtitle">${item.subtitle}</span>` : ''}
                </div>
                ${s}`;
            d.onclick = () => cb(item); 
            c.appendChild(d); 
        });
    },

    initKeyboard: (cb) => {
        document.querySelector('.keyboard-container').onclick = (e) => {
            const k = e.target.closest('.key'); 
            if (k) cb(k.getAttribute('data-val'), k);
        };
    },

    updateKeyboardLayout(type, data = null) {
        const n = document.getElementById('keyboard-num'), 
              b = document.getElementById('keyboard-boolean'), 
              c = document.querySelector('.keyboard-container'), 
              a = document.getElementById('user-answer');

        c.style.display = "block"; 
        n.style.display = "none"; 
        b.style.display = "none"; 
        a.style.display = "inline-block";

        if (type === "boolean") { 
            b.style.display = "grid"; 
            a.style.display = "none"; 
        }
        else if (type === "qcm") { 
            this.renderQCM(data.choices); 
            n.style.display = "grid"; 
            a.style.display = "none"; 
        }
        else if (type === "selection") {
            c.style.display = "none";
        }
        else if (type === "alpha") { 
            this.renderAlphaKeyboard(); 
            n.style.display = "block"; 
        }
        else { 
            this.restoreNumericKeyboard(); 
            n.style.gridTemplateColumns = "repeat(3, 1fr)"; 
            n.style.display = "grid"; 
        }
    },

updateGameDisplay(p, input, prog) {
    const c = document.getElementById('math-problem'), 
          d = document.getElementById('user-answer');
    
    // Reset des zones
    c.innerHTML = ""; 
    d.innerHTML = ""; 
    
    // Style par défaut de la zone de réponse (user-answer)
    Object.assign(d.style, { 
        borderBottom: "none", display: "flex", justifyContent: "center", 
        alignItems: "center", gap: "10px", minHeight: "1.5em", margin: "0 auto" 
    });

    if (p.isVisual) {
        const ts = { 
            clock:'drawClock', spelling:'drawSpelling', conjugation:'drawConjugation', 
            target:'drawSvgTarget', money:'drawMoney', bird:'drawBird', 
            square:'drawSquare', reading: 'drawReading', counting: 'drawCounting', fraction: 'drawFraction'
        };

        // --- GESTION DU BADGE DE TEMPS ---
        let badge = "";
        if (p.tense) {
            const colors = { 
                'PRÉSENT': '#4A90E2', 
                'FUTUR': '#F5A623', 
                'IMPARFAIT': '#7ED321', 
                'PASSÉ COMPOSÉ': '#9B59B6' 
            };
            const bg = colors[p.tense.toUpperCase()] || 'var(--dark)';
            badge = `<div class="tense-badge" style="background:${bg}">${p.tense}</div>`;
        }

        // On dessine le badge + l'exercice visuel
        c.innerHTML = badge + this[ts[p.visualType]](p.data, input);
    } else {
        c.innerHTML = p.question || ""; 
    }

    // --- GESTION DE LA ZONE DE RÉPONSE BASSE (USER-ANSWER) ---
    // On l'affiche seulement pour l'horloge et les maths numériques
    if (p.visualType === 'clock') {
        let s = input.padEnd(4, "_"); d.style.width = "auto";
        d.innerHTML = `<div class="clock-digit-block">${s.slice(0, 2)}</div><span class="clock-separator">:</span><div class="clock-digit-block">${s.slice(2, 4)}</div>`;
    } 
    else if (p.inputType === "numeric") {
        Object.assign(d.style, { 
            display: "inline-block", width: "fit-content", minWidth: "120px", 
            maxWidth: "250px", textAlign: "center", borderBottom: "6px solid var(--primary)", padding: "0 10px" 
        });
        d.innerText = input || "\u00A0";
    } 
    else {
        // Pour la conjugaison et l'orthographe, on cache la zone basse car l'input est "dans" l'exercice
        d.style.display = "none";
    }

    document.getElementById('game-progress').style.width = prog + "%";
},

drawConjugation(d, i) {
    if (d.isCompound) {
        // Logique bi-bloc pour le Passé Composé
        // On sépare l'input utilisateur par l'espace pour remplir les deux zones
        const parts = i.split(" ");
        const inputAux = parts[0] || "";
        const inputPP = parts.slice(1).join(" ") || ""; 

        return `
        <div class="verb-machine compound">
            <div class="verb-header">
                <span class="verb-icon">${d.icon || '⏳'}</span>
                <span class="verb-infinitive">${d.infinitive}</span>
            </div>
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

    // Mode simple (Présent, Futur, Imparfait)
    return `
    <div class="verb-machine">
        <div class="verb-header">
            <span class="verb-icon">${d.icon || '📝'}</span>
            <span class="verb-infinitive">${d.infinitive}</span>
        </div>
        <div class="verb-body">
            <div class="pronoun-tag">${d.pronoun}</div>
            <div class="verb-input-zone">${i || "..."}</div>
        </div>
    </div>`;
},

    drawSpelling(d, input) {
        const s = d.word.split("").map((_, i) => `<span class="letter-slot">${input[i] || "_"}</span>`).join("");
        return `<div class="spelling-container"><div class="spelling-media"><img src="${d.imageUrl}" class="spelling-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"><div class="spelling-placeholder" style="display:none;">${d.icon || '❓'}</div></div><div class="spelling-slots">${s}</div></div>`;
    },

    drawClock(d) {
        const s=240, c=s/2, r=100, ma=(d.minutes/60)*360, ha=((d.hours%12)/12)*360+(d.minutes/60)*30;
        let svg=`<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><circle cx="${c}" cy="${c}" r="${r}" fill="white" stroke="#2D3748" stroke-width="6"/>`;
        for (let i=1; i<=12; i++) { const a=(i*30)*(Math.PI/180), x=c+(r-22)*Math.sin(a), y=c-(r-22)*Math.cos(a); svg+=`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="16px" font-weight="900" fill="#4A5568">${i}</text>`; }
        svg+=`<line x1="${c}" y1="${c}" x2="${c+55*Math.sin(ha*Math.PI/180)}" y2="${c-55*Math.cos(ha*Math.PI/180)}" stroke="#2D3748" stroke-width="8" stroke-linecap="round"/><line x1="${c}" y1="${c}" x2="${c+80*Math.sin(ma*Math.PI/180)}" y2="${c-80*Math.cos(ma*Math.PI/180)}" stroke="#FF6B6B" stroke-width="5" stroke-linecap="round"/><circle cx="${c}" cy="${c}" r="6" fill="#2D3748"/></svg>`;
        return `<div class="clock-exercise">${svg}</div>`;
    },

    drawMoney(d) {
        const ms = { 1:{b:'#CD7F32',s:45}, 2:{b:'#C0C0C0',s:55}, 5:{b:'#81c784',w:85}, 10:{b:'#e57373',w:90}, 20:{b:'#64b5f6',w:95}, 50:{b:'#ffb74d',w:105} };
        let h = '<div class="money-table" style="position:relative;height:240px;width:100%">';
        d.hits.forEach((v, i) => {
            const s = ms[v] || ms[1], isB = !!s.w, x = (i%4)*75 + (Math.random()*10), y = Math.floor(i/4)*65;
            h += `<div class="${isB?'bill':'coin'}" style="position:absolute;left:${x}px;top:${y}px;width:${isB?s.w:s.s}px;height:${isB?55:s.s}px;background:${s.b};border-radius:${isB?6:50}px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:rgba(0,0,0,0.7);font-weight:bold;box-shadow:2px 2px 4px rgba(0,0,0,0.15);transform:rotate(${(i*7)%20-10}deg);border:2px solid rgba(255,255,255,0.4)">${isB?'<span style="font-size:8px;opacity:0.6;margin-bottom:-2px">EURO</span>':''}<span style="font-size:${isB?'16px':'14px'}">${v}€</span></div>`;
        });
        return h + '</div>';
    },

    drawSvgTarget(d) {
        const s=300, c=s/2, zs=[...d.zonesDefinitions].sort((a,b)=>a-b), st=130/zs.length;
        let svg=''; zs.reverse().forEach((v, i) => { const r=130-(i*st); svg+=`<circle cx="${c}" cy="${c}" r="${r}" fill="${['#FFD700','#9ACD32','#87CEEB','#DA70D6','#FF6347'][i%5]}" stroke="#fff" stroke-width="2"/><text x="${c}" y="${c-r+15}" text-anchor="middle" font-size="14px" fill="rgba(0,0,0,0.4)">${v}</text>`; });
        d.hits.forEach((h, i) => { const r=130-(zs.length-1-zs.indexOf(h))*st-(st/2), a=(i*(360/d.hits.length))*(Math.PI/180); svg+=`<circle cx="${c+r*Math.cos(a)}" cy="${c+r*Math.sin(a)}" r="10" fill="#E53E3E" stroke="white" stroke-width="2"></circle>`; });
        return `<svg width="${s}" height="${s}">${svg}</svg>`;
    },

    drawBird: (d) => `<div class="sky-container"><div class="bird-container" style="animation-duration:${d.duration||8}s;"><div class="bird-bubble">${d.question}</div><div class="bird-sprite">🐦</div></div></div>`,

    drawSquare: (d, i) => `<div class="game-container-selection"><div class="target-badge">Cible : ${d.target}</div><div style="display:grid;grid-template-columns:repeat(${Math.sqrt(d.numbers.length)},1fr);gap:10px;">${d.numbers.map((n, idx) => `<div class="key number-card ${(d.selectedIndices||[]).includes(idx)?'selected':''}" data-val="${n}" data-idx="${idx}">${n}</div>`).join('')}</div></div>`,

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
        return `<div class="fraction-display"><svg viewBox="0 0 200 200" width="200" height="200">${paths}</svg><div class="fraction-formula">... / ${d.d}</div></div>`;
    },

    // --- CLAVIERS ---

    renderAlphaKeyboard() {
        const c = document.getElementById('keyboard-num'), caps = App.state.isUppercase;
        const rows = ["AZERTYUIOP", "QSDFGHJKLM", "WXCVBN", "ÉÈÀÇÊÎÔÛ"];
        let h = '<div class="alpha-keyboard">';
        rows.forEach((row, idx) => {
            h += `<div class="kb-row">`;
            row.split('').forEach(l => { 
                const char = caps ? l : l.toLowerCase(); 
                h += `<button class="key letter-key ${idx===3?'accent-key':''}" data-val="${char}">${char}</button>`; 
            });
            h += `</div>`;
        });
        h += `
        <div class="kb-row">
            <button class="key action shift-btn" data-val="shift" style="flex:1">${caps ? 'abc' : 'ABC'}</button>
            <button class="key letter-key space-key" data-val=" " style="flex:3">ESPACE</button>
            <button class="key action del" data-val="backspace" style="flex:1">⌫</button>
            <button class="key action ok" data-val="ok" style="flex:2">VALIDER</button>
        </div></div>`;
        c.innerHTML = h; c.style.gridTemplateColumns = "none"; 
    },

    restoreNumericKeyboard() {
        const n = document.getElementById('keyboard-num'); n.style.gridTemplateColumns = "repeat(3, 1fr)";
        n.innerHTML = "123456789".split("").map(v => `<button class="key" data-val="${v}">${v}</button>`).join("") + 
                      `<button class="key del" data-val="backspace">⌫</button><button class="key" data-val="0">0</button><button class="key action ok" data-val="ok">OK</button>`;
    },

    renderQCM(choices) {
        const n = document.getElementById('keyboard-num'); n.innerHTML = ""; n.style.gridTemplateColumns = `repeat(${choices.length}, 1fr)`;
        choices.forEach(v => n.innerHTML += `<button class="key action bool" data-val="${v}">${v}</button>`);
    },

    renderStars(score, total) {
        const c = document.getElementById('stars-container'); c.innerHTML = "";
        const p = (score/total)*100, count = p===100?3:p>=75?2:p>=50?1:0;
        for (let i=1; i<=3; i++) {
            const s = document.createElement('span'); s.className='star'+(i<=count?' active':''); s.innerHTML='★';
            s.style.animationDelay=(i*0.2)+'s'; c.appendChild(s);
        }
    }
};

UI.btnHome.onclick = () => location.reload();
UI.btnBack.onclick = () => {
    const map = { 'screen-game':'screen-levels', 'screen-levels':'screen-themes', 'screen-themes':'screen-grades' };
    const cur = document.querySelector('.screen.active').id; 
    if (map[cur]) UI.showScreen(map[cur]);
};
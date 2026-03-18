const UIKeyboards = {
    initKeyboard(callback) {
        const container = document.querySelector('.keyboard-container');
        if (container) {
            container.onclick = (e) => {
                const key = e.target.closest('.key');
                if (key && key.hasAttribute('data-val')) {
                    callback(key.getAttribute('data-val'), key);
                }
            };
        }
    },

    updateKeyboardLayout(type, data = null) {
        const numKb = document.getElementById('keyboard-num');
        const boolKb = document.getElementById('keyboard-boolean');
        const answerZone = document.getElementById('user-answer');

        if (!numKb) return;

        numKb.style.display = "none";
        if (boolKb) boolKb.style.display = "none";
        if (answerZone) answerZone.style.display = "flex";

        try {
            if (type === "boolean" || type === "qcm") {
                let choices = ["VRAI", "FAUX"];
                if (data) {
                    choices = data.choices || (data.data?.choices) || choices;
                }
                this.renderQCM(choices);
                numKb.style.display = "grid";
                if (answerZone) answerZone.style.display = "none";
            } else if (type === "selection") {
                numKb.innerHTML = `<button class="btn btn--success key action ok wide-btn" data-val="ok">VALIDER LA S\u00c9LECTION</button>`;
                numKb.style.display = "grid";
                numKb.style.gridTemplateColumns = "1fr";
            } else if (type === "alpha") {
                this.renderAlphaKeyboard();
                numKb.style.display = "block";
            } else if (type === "roman") {
                this.renderRomanKeyboard();
                numKb.style.display = "block";
            } else {
                this.restoreNumericKeyboard();
                numKb.style.display = "grid";
            }
        } catch (e) {
            console.error("UI: Erreur Layout Clavier", e);
            this.restoreNumericKeyboard();
            numKb.style.display = "grid";
        }
    },

    restoreNumericKeyboard() {
        const kb = document.getElementById('keyboard-num');
        if (!kb) return;

        kb.style.gridTemplateColumns = "repeat(3, 1fr)";

        let html = "123456789".split("").map(v =>
            `<button class="btn key" data-val="${v}">${v}</button>`
        ).join("");

        html += `<button class="btn key key-comma" data-val=",">,</button>`;
        html += `<button class="btn key" data-val="0">0</button>`;
        html += `<button class="btn btn--danger key del key-delete" data-val="backspace">&#9003;</button>`;
        html += `<button class="btn btn--success key action ok key-ok key-ok-wide" data-val="ok">OK</button>`;

        kb.innerHTML = html;
    },

    renderAlphaKeyboard() {
        const kb = document.getElementById('keyboard-num');
        if (!kb) return;

        kb.style.gridTemplateColumns = "none";
        const rows = ["azertyuiop", "qsdfghjklm", "wxcvbn"];

        let html = '<div class="alpha-keyboard">';

        html += `<div class="kb-row accent-row">` + "\u00e9\u00e8\u00e0\u00e7\u00ea\u00ee\u00f4\u00fb-,".split('').map(a =>
            `<button class="btn key letter-key" data-val="${a}">${a}</button>`
        ).join('') + `</div>`;

        rows.forEach(row => {
            html += `<div class="kb-row">`;
            row.split('').forEach(char => {
                html += `<button class="btn key letter-key" data-val="${char}">${char}</button>`;
            });
            html += `</div>`;
        });

        html += `<div class="kb-row kb-row-actions">
            <button class="btn btn--danger key action del key-delete key-flex-2" data-val="backspace">&#9003;</button>
            <button class="btn key space-key key-flex-5" data-val=" ">ESPACE</button>
            <button class="btn btn--success key action ok key-ok key-flex-3" data-val="ok">OK</button>
        </div></div>`;

        kb.innerHTML = html;
    },

    renderRomanKeyboard() {
        const kb = document.getElementById('keyboard-num');
        if (!kb) return;

        kb.style.gridTemplateColumns = "none";
        kb.style.display = "block";

        const html = `
    <div class="roman-keyboard">
        <div class="roman-keyboard-row">
            ${["I", "V", "X", "L"].map(k =>
                `<button class="btn key roman-key" data-val="${k}">${k}</button>`
            ).join('')}
        </div>

        <div class="roman-keyboard-row">
            ${["C", "D", "M"].map(k =>
                `<button class="btn key roman-key" data-val="${k}">${k}</button>`
            ).join('')}
            <div class="roman-keyboard-spacer"></div>
        </div>

        <div class="roman-keyboard-row roman-keyboard-actions">
            <button class="btn btn--danger key action del key-delete roman-action-key roman-action-key-delete" data-val="backspace">&#9003;</button>
            <button class="btn btn--success key action ok key-ok roman-action-key roman-action-key-ok" data-val="ok">VALIDER</button>
        </div>
    </div>`;

        kb.innerHTML = html;
    },

    renderQCM(choices) {
        const kb = document.getElementById('keyboard-num');
        if (!kb) return;

        const cols = Math.min(choices.length, 3);
        kb.style.gridTemplateColumns = `repeat(${choices.length > 4 ? 2 : cols}, 1fr)`;
        kb.style.gap = "10px";

        kb.innerHTML = choices.map(v => {
            let cssClass = "btn key";
            if (v === "VRAI" || v === ">") cssClass += " btn-true";
            else if (v === "FAUX" || v === "<") cssClass += " btn-false";
            else cssClass += " btn-neutral";

            if (['<', '>', '='].includes(v)) cssClass += " qcm-symbol";
            return `<button class="${cssClass}" data-val="${v}">${v}</button>`;
        }).join("");
    }
};

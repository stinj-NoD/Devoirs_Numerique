const UIDocumentary = {
    _escape(value) {
        if (window.SecurityUtils?.escapeHtml) return window.SecurityUtils.escapeHtml(value);
        return (value ?? "").toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    _safeAttr(value) {
        if (window.SecurityUtils?.escapeAttr) return window.SecurityUtils.escapeAttr(value);
        return this._escape(value).replace(/`/g, '&#96;');
    },

    drawTimelineOrder(p) {
        const d = p.data || {};
        const cards = Array.isArray(d.cards) ? d.cards : [];
        const currentOrder = Array.isArray(d.currentOrder) ? d.currentOrder : cards.map((card) => card.id);
        const orderedCards = currentOrder
            .map((id) => cards.find((card) => card.id === id))
            .filter(Boolean);
        const selectedId = d.selectedId || "";

        return `
            <div class="timeline-card timeline-card--order">
                <div class="timeline-badge">FRISE</div>
                <div class="timeline-title">${this._escape(d.title || "Remets dans l'ordre")}</div>
                <div class="timeline-helper">Selectionne un repere puis deplace-le avec les fleches.</div>
                <div class="timeline-order-list">
                    ${orderedCards.map((card, index) => `
                        <button class="timeline-event-card ${selectedId === card.id ? 'is-selected' : ''}" data-val="timeline-order:${this._safeAttr(card.id)}">
                            <span class="timeline-event-rank">${index + 1}</span>
                            <span class="timeline-event-icon">${this._escape(card.icon || '\u{1F4CD}')}</span>
                            <span class="timeline-event-text">${this._escape(card.label)}</span>
                        </button>
                    `).join('')}
                </div>
                <div class="timeline-controls">
                    <button class="btn btn--soft key timeline-control" data-val="timeline-move-left">\u2190 Plus ancien</button>
                    <button class="btn btn--soft key timeline-control" data-val="timeline-move-right">Plus recent \u2192</button>
                </div>
            </div>`;
    },

    drawTimelinePlace(p) {
        const d = p.data || {};
        const selectedYear = (d.selectedYear ?? "").toString();
        const markers = Array.isArray(d.markers) ? d.markers : [];
        const range = Array.isArray(d.range) ? d.range : [0, 1];
        const start = Number(range[0] || 0);
        const end = Number(range[1] || 1);

        return `
            <div class="timeline-card timeline-card--place">
                <div class="timeline-badge">FRISE</div>
                <div class="timeline-title">${this._escape(d.title || "Place sur la frise")}</div>
                <div class="timeline-target">
                    <span class="timeline-target-icon">${this._escape(d.icon || '\u{1F4CD}')}</span>
                    <span class="timeline-target-label">${this._escape(d.prompt || "Repere historique")}</span>
                </div>
                <div class="timeline-helper">Choisis la date juste sur la graduation. La bonne reponse est parmi les dates affichees.</div>
                <div class="timeline-ruler">
                    <div class="timeline-ruler-ends">
                        <span>${start}</span>
                        <span>${end}</span>
                    </div>
                    <div class="timeline-ruler-line"></div>
                    <div class="timeline-ruler-slots">
                        ${markers.map((year, index) => `
                            <button class="timeline-slot ${selectedYear === year.toString() ? 'is-selected' : ''} ${index % 2 === 0 ? 'is-top' : 'is-bottom'}" data-val="timeline-place:${this._safeAttr(year)}">
                                <span class="timeline-slot-stem"></span>
                                <span class="timeline-slot-tick"></span>
                                <span class="timeline-slot-label">${this._escape(year)}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>`;
    },

    drawMatching(p) {
        const d = p.data || {};
        const left = Array.isArray(d.left) ? d.left : [];
        const right = Array.isArray(d.right) ? d.right : [];
        const matches = d.matches || {};
        const selectedLeft = d.selectedLeft;
        const revealed = !!d.revealed;
        const matchedRightIds = new Set(Object.values(matches));
        const leftIdsInMatchOrder = Object.keys(matches).map(Number);
        const badgeNumber = (leftId) => leftIdsInMatchOrder.indexOf(leftId) + 1;

        return `
            <div class="matching-card">
                <div class="matching-helper">Touche un élément à gauche, puis sa correspondance à droite.</div>
                <div class="matching-columns">
                    <div class="matching-column matching-column--left">
                        ${left.map((entry) => {
                            const isMatched = Object.prototype.hasOwnProperty.call(matches, entry.id);
                            const isSelected = selectedLeft === entry.id;
                            let stateCls = isMatched ? 'is-matched' : '';
                            let isWrong = false;
                            if (revealed && isMatched) {
                                isWrong = matches[entry.id] !== entry.id;
                                stateCls = isWrong ? 'is-incorrect' : 'is-correct';
                            }
                            const cls = ['matching-item', stateCls, isSelected ? 'is-selected' : ''].filter(Boolean).join(' ');
                            const badge = isMatched ? `<span class="matching-badge">${badgeNumber(entry.id)}</span>` : '';
                            const correctEntry = isWrong ? right.find((r) => r.id === entry.id) : null;
                            const hint = correctEntry
                                ? `<div class="matching-hint">Bonne réponse : ${this._escape(correctEntry.label)}</div>`
                                : '';
                            return `<div class="matching-pair">
                                <button class="${cls}" data-val="matching-select:left:${this._safeAttr(entry.id)}" ${isMatched ? 'disabled' : ''}>${badge}${this._escape(entry.label)}</button>
                                ${hint}
                            </div>`;
                        }).join('')}
                    </div>
                    <div class="matching-column matching-column--right">
                        ${right.map((entry) => {
                            const isMatched = matchedRightIds.has(entry.id);
                            let stateCls = isMatched ? 'is-matched' : '';
                            let badge = '';
                            if (isMatched) {
                                const pairedLeftId = Number(Object.keys(matches).find((leftId) => matches[leftId] === entry.id));
                                badge = `<span class="matching-badge">${badgeNumber(pairedLeftId)}</span>`;
                                if (revealed) stateCls = (pairedLeftId === entry.id) ? 'is-correct' : 'is-incorrect';
                            }
                            const cls = ['matching-item', stateCls].filter(Boolean).join(' ');
                            return `<button class="${cls}" data-val="matching-select:right:${this._safeAttr(entry.id)}" ${isMatched ? 'disabled' : ''}>${badge}${this._escape(entry.label)}</button>`;
                        }).join('')}
                    </div>
                </div>
            </div>`;
    },

    drawWordOrder(p) {
        const d = p.data || {};
        const words = Array.isArray(d.words) ? d.words : [];
        const picked = Array.isArray(d.picked) ? d.picked : [];
        const revealed = !!d.revealed;
        const isStorySequence = !!d.isStorySequence;
        const pickedIds = new Set(picked.map((w) => w.id));
        const available = words.filter((w) => !pickedIds.has(w.id));

        const correctOrder = Array.isArray(d.sentence)
            ? d.sentence
            : (typeof d.sentence === 'string' ? d.sentence.trim().split(/\s+/) : words.map((w) => w.label));

        const tokenCls = isStorySequence ? 'word-order-token word-order-token--sentence' : 'word-order-token';
        const joiner = isStorySequence ? '' : ' ';

        let pickedHtml;
        if (picked.length) {
            pickedHtml = picked.map((w, pos) => {
                let cls = `${tokenCls} word-order-token--picked`;
                if (revealed) {
                    const isCorrect = correctOrder[pos] === w.label;
                    cls += isCorrect ? ' is-correct' : ' is-incorrect';
                }
                const interactive = revealed ? 'disabled' : `data-val="word-order-remove:${pos}"`;
                return `<button class="${cls}" ${interactive}>${this._escape(w.label)}</button>`;
            }).join(joiner);
        } else {
            pickedHtml = `<span class="word-order-placeholder">${isStorySequence ? 'Touche les phrases ci-dessous pour reconstituer le récit&hellip;' : 'Touche les mots ci-dessous pour former la phrase&hellip;'}</span>`;
        }

        const availableHtml = available.map((w) => `
            <button class="${tokenCls} word-order-token--available" data-val="word-order-pick:${this._safeAttr(w.id)}">
                ${this._escape(w.label)}
            </button>
        `).join('');

        const correctPhraseHtml = revealed && !available.length
            ? `<div class="word-order-correct-phrase">${correctOrder.map((s) => this._escape(s)).join(isStorySequence ? '<br>' : ' ')}</div>`
            : '';

        return `
            <div class="word-order-card${isStorySequence ? ' word-order-card--story' : ''}">
                <div class="word-order-helper">${isStorySequence ? 'Reconstitue le récit en touchant les phrases dans le bon ordre.' : 'Construis la phrase en touchant les mots dans le bon ordre.'}</div>
                <div class="word-order-sentence">
                    ${pickedHtml}
                </div>
                ${correctPhraseHtml}
                <div class="word-order-divider"></div>
                <div class="word-order-bank">
                    ${availableHtml}
                </div>
            </div>`;
    },

    drawFactualCard(p) {
        const d = p.data || {};
        const subjectTitle = this._escape(d.subjectTitle || "Question");
        const prompt = this._escape(d.prompt || p.question || "");
        const context = this._escape((d.context || "").toString().trim());
        const subjectId = (d.subjectId || "general").toString().replace(/[^a-z0-9-]/gi, "").toLowerCase();

        return `
            <div class="factual-card factual-card-${subjectId}">
                <div class="factual-badge">${subjectTitle}</div>
                ${context ? `
                    <div class="factual-context-block">
                        <div class="factual-context-label">Texte</div>
                        <div class="factual-context">${context}</div>
                    </div>
                ` : ""}
                <div class="factual-question-label">Question</div>
                <div class="factual-question">${prompt}</div>
            </div>
        `;
    }
};

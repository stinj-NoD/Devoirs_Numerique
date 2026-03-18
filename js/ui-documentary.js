const UIDocumentary = {
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
                <div class="timeline-title">${d.title || "Remets dans l'ordre"}</div>
                <div class="timeline-helper">Selectionne un repere puis deplace-le avec les fleches.</div>
                <div class="timeline-order-list">
                    ${orderedCards.map((card, index) => `
                        <button class="timeline-event-card ${selectedId === card.id ? 'is-selected' : ''}" data-val="timeline-order:${card.id}">
                            <span class="timeline-event-rank">${index + 1}</span>
                            <span class="timeline-event-icon">${card.icon || '\u{1F4CD}'}</span>
                            <span class="timeline-event-text">${card.label}</span>
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
                <div class="timeline-title">${d.title || "Place sur la frise"}</div>
                <div class="timeline-target">
                    <span class="timeline-target-icon">${d.icon || '\u{1F4CD}'}</span>
                    <span class="timeline-target-label">${d.prompt || "Repere historique"}</span>
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
                            <button class="timeline-slot ${selectedYear === year.toString() ? 'is-selected' : ''} ${index % 2 === 0 ? 'is-top' : 'is-bottom'}" data-val="timeline-place:${year}">
                                <span class="timeline-slot-stem"></span>
                                <span class="timeline-slot-tick"></span>
                                <span class="timeline-slot-label">${year}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>`;
    },

    drawFactualCard(p) {
        const d = p.data || {};
        const subjectTitle = d.subjectTitle || "Question";
        const prompt = d.prompt || p.question || "";
        const subjectId = (d.subjectId || "general").toString().replace(/[^a-z0-9-]/gi, "").toLowerCase();

        return `
            <div class="factual-card factual-card-${subjectId}">
                <div class="factual-badge">${subjectTitle}</div>
                <div class="factual-question">${prompt}</div>
            </div>
        `;
    }
};

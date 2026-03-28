const UIBoard = {
    render(problem) {
        const data = problem?.data || {};
        switch (data.boardKind) {
            case 'tap-features':
                return this.renderTapFeatures(problem);
            case 'shape-classify':
                return this.renderShapeClassify(problem);
            case 'point-on-grid':
                return this.renderPointOnGrid(problem);
            case 'symmetry-complete':
                return this.renderSymmetryComplete(problem);
            default:
                return `<div class="board-card"><p>Moteur interactif prêt, activité non reconnue.</p></div>`;
        }
    },

    renderTapFeatures(problem) {
        const data = problem.data || {};
        const board = data.board || { width: 10, height: 6 };
        const drawing = data.drawing || {};
        const features = Array.isArray(data.features) ? data.features : [];
        const selectedIds = Array.isArray(data.userState?.selectedIds) ? data.userState.selectedIds : [];
        const selectedSet = new Set(selectedIds);
        const width = Number(board.width) || 10;
        const height = Number(board.height) || 6;
        const size = 320;
        const pad = 24;
        const stepX = (size - pad * 2) / Math.max(width, 1);
        const stepY = (size - pad * 2) / Math.max(height, 1);
        const toX = (value) => pad + Number(value) * stepX;
        const toY = (value) => pad + Number(value) * stepY;

        const lines = (Array.isArray(drawing.lines) ? drawing.lines : []).map((line) => `
            <line
                x1="${toX(line.x1)}"
                y1="${toY(line.y1)}"
                x2="${toX(line.x2)}"
                y2="${toY(line.y2)}"
                class="board-shape-line"
            />
        `).join('');

        const markers = (Array.isArray(drawing.markers) ? drawing.markers : []).map((marker) => {
            if (marker.type === 'right-angle') {
                const x = toX(marker.x);
                const y = toY(marker.y);
                const sizeMark = 16;
                return `<path d="M ${x} ${y} l ${sizeMark} 0 l 0 ${sizeMark}" class="board-right-angle-marker" />`;
            }
            return '';
        }).join('');

        const hotspots = features.map((feature) => {
            const isSelected = selectedSet.has(feature.id);
            const cx = toX(feature.x);
            const cy = toY(feature.y);
            return `
                <g class="board-feature ${isSelected ? 'is-selected' : ''}" data-val="board-toggle-feature:${feature.id}">
                    <circle cx="${cx}" cy="${cy}" r="18" class="board-feature-hit"></circle>
                    <circle cx="${cx}" cy="${cy}" r="8" class="board-feature-core"></circle>
                </g>
            `;
        }).join('');

        return `
            <div class="board-card">
                <div class="board-toolbar">
                    <div class="board-status">${selectedIds.length} élément${selectedIds.length > 1 ? 's' : ''} choisi${selectedIds.length > 1 ? 's' : ''}</div>
                    <div class="board-toolbar-actions">
                        <button type="button" class="btn board-action" data-val="board-reset">Réinitialiser</button>
                        <button type="button" class="btn btn--success board-action" data-val="board-submit">Valider</button>
                    </div>
                </div>
                <div class="board-panel">
                    <svg class="board-svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="Figure géométrique interactive">
                        ${lines}
                        ${markers}
                        ${hotspots}
                    </svg>
                </div>
            </div>
        `;
    },

    renderShapeClassify(problem) {
        const data = problem.data || {};
        const figures = Array.isArray(data.figures) ? data.figures : [];
        const buckets = Array.isArray(data.buckets) ? data.buckets : [];
        const state = data.userState || {};
        const assignments = state.assignments || {};
        const selectedFigureId = state.selectedFigureId || '';
        const unassigned = figures.filter((figure) => !assignments[figure.id]);

        const figureCards = unassigned.map((figure) => `
            <button
                type="button"
                class="board-chip ${selectedFigureId === figure.id ? 'is-selected' : ''}"
                data-val="board-select-figure:${figure.id}"
            >
                <span class="board-chip-label">${figure.label || figure.shape || figure.id}</span>
            </button>
        `).join('');

        const bucketCards = buckets.map((bucket) => {
            const items = figures.filter((figure) => assignments[figure.id] === bucket.id);
            return `
                <button
                    type="button"
                    class="board-bucket"
                    data-val="board-assign-bucket:${bucket.id}"
                >
                    <span class="board-bucket-title">${bucket.label || bucket.id}</span>
                    <span class="board-bucket-hint">${items.length > 0 ? items.map((item) => item.label || item.shape || item.id).join(' · ') : 'Dépose ici'}</span>
                </button>
            `;
        }).join('');

        return `
            <div class="board-card">
                <div class="board-toolbar">
                    <button type="button" class="btn board-action" data-val="board-reset">Réinitialiser</button>
                    <button type="button" class="btn btn--success board-action" data-val="board-submit">Valider</button>
                </div>
                <div class="board-panel">
                    <div class="board-panel-title">Figures</div>
                    <div class="board-chip-list">${figureCards || '<span class="board-empty">Toutes les figures sont rangées.</span>'}</div>
                </div>
                <div class="board-panel">
                    <div class="board-panel-title">Catégories</div>
                    <div class="board-bucket-list">${bucketCards}</div>
                </div>
            </div>
        `;
    },

    renderPointOnGrid(problem) {
        const data = problem.data || {};
        const board = data.board || { width: 8, height: 8 };
        const point = data.userState?.point || null;
        const task = data.task || {};
        const size = 280;
        const cols = Number(board.width) || 8;
        const rows = Number(board.height) || 8;
        const margin = 24;
        const stepX = (size - margin * 2) / Math.max(cols - 1, 1);
        const stepY = (size - margin * 2) / Math.max(rows - 1, 1);

        const verticals = Array.from({ length: cols }, (_, index) => {
            const x = margin + index * stepX;
            return `<line x1="${x}" y1="${margin}" x2="${x}" y2="${size - margin}" class="board-grid-line" />`;
        }).join('');

        const horizontals = Array.from({ length: rows }, (_, index) => {
            const y = margin + index * stepY;
            return `<line x1="${margin}" y1="${y}" x2="${size - margin}" y2="${y}" class="board-grid-line" />`;
        }).join('');

        const points = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cx = margin + x * stepX;
                const cy = margin + y * stepY;
                const isActive = point && Number(point[0]) === x && Number(point[1]) === y;
                points.push(`
                    <g class="board-grid-node ${isActive ? 'is-active' : ''}" data-val="board-place-point:${x}:${y}">
                        <circle cx="${cx}" cy="${cy}" r="${isActive ? 12 : 10}" class="board-grid-hit"></circle>
                        <circle cx="${cx}" cy="${cy}" r="${isActive ? 6 : 3.5}" class="board-grid-dot"></circle>
                    </g>
                `);
            }
        }

        return `
            <div class="board-card">
                <div class="board-toolbar">
                    <div class="board-status">${task.label || 'Point'} : ${point ? `(${point[0]} ; ${point[1]})` : 'non placé'}</div>
                    <div class="board-toolbar-actions">
                        <button type="button" class="btn board-action" data-val="board-reset">Réinitialiser</button>
                        <button type="button" class="btn btn--success board-action" data-val="board-submit">Valider</button>
                    </div>
                </div>
                <div class="board-panel">
                    <svg class="board-svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="Quadrillage interactif">
                        ${verticals}
                        ${horizontals}
                        ${points.join('')}
                    </svg>
                </div>
            </div>
        `;
    },

    renderSymmetryComplete(problem) {
        const data = problem.data || {};
        const board = data.board || { width: 10, height: 8 };
        const placedPoints = Array.isArray(data.userState?.placedPoints) ? data.userState.placedPoints : [];
        const givenPoints = Array.isArray(data.givenPoints) ? data.givenPoints : [];
        const axis = data.axis || null;
        const size = 320;
        const cols = Number(board.width) || 10;
        const rows = Number(board.height) || 8;
        const margin = 24;
        const stepX = (size - margin * 2) / Math.max(cols - 1, 1);
        const stepY = (size - margin * 2) / Math.max(rows - 1, 1);

        const verticals = Array.from({ length: cols }, (_, index) => {
            const x = margin + index * stepX;
            return `<line x1="${x}" y1="${margin}" x2="${x}" y2="${size - margin}" class="board-grid-line" />`;
        }).join('');

        const horizontals = Array.from({ length: rows }, (_, index) => {
            const y = margin + index * stepY;
            return `<line x1="${margin}" y1="${y}" x2="${size - margin}" y2="${y}" class="board-grid-line" />`;
        }).join('');

        const axisLine = axis && axis.type === 'vertical'
            ? `<line x1="${margin + Number(axis.x || 0) * stepX}" y1="${margin}" x2="${margin + Number(axis.x || 0) * stepX}" y2="${size - margin}" class="board-axis-line" />`
            : '';

        const toKey = (point) => `${Number(point[0])},${Number(point[1])}`;
        const placedSet = new Set(placedPoints.map(toKey));

        const fixed = givenPoints.map((point) => {
            const cx = margin + Number(point[0]) * stepX;
            const cy = margin + Number(point[1]) * stepY;
            return `<circle cx="${cx}" cy="${cy}" r="6" class="board-fixed-point" />`;
        }).join('');

        const interactive = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const key = `${x},${y}`;
                const cx = margin + x * stepX;
                const cy = margin + y * stepY;
                const isPlaced = placedSet.has(key);
                interactive.push(`
                    <g class="board-grid-node ${isPlaced ? 'is-active' : ''}" data-val="board-toggle-point:${x}:${y}">
                        <circle cx="${cx}" cy="${cy}" r="${isPlaced ? 12 : 10}" class="board-grid-hit"></circle>
                        <circle cx="${cx}" cy="${cy}" r="${isPlaced ? 6 : 3}" class="board-grid-dot"></circle>
                    </g>
                `);
            }
        }

        return `
            <div class="board-card">
                <div class="board-toolbar">
                    <div class="board-status">${placedPoints.length} point${placedPoints.length > 1 ? 's' : ''} placé${placedPoints.length > 1 ? 's' : ''}</div>
                    <div class="board-toolbar-actions">
                        <button type="button" class="btn board-action" data-val="board-reset">Réinitialiser</button>
                        <button type="button" class="btn btn--success board-action" data-val="board-submit">Valider</button>
                    </div>
                </div>
                <div class="board-panel">
                    <svg class="board-svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="Figure à compléter par symétrie">
                        ${verticals}
                        ${horizontals}
                        ${axisLine}
                        ${fixed}
                        ${interactive.join('')}
                    </svg>
                </div>
            </div>
        `;
    }
};

window.UIBoard = UIBoard;

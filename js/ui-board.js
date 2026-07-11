const UIBoard = {
    _escape(value) {
        return SecurityUtils.escapeHtml(value);
    },

    /**
     * Calcule un nouveau viewBox zoomé/déplacé, toujours contenu dans
     * baseBox (jamais plus dézoomé que la carte source, jamais de pan qui
     * sortirait du cadre). factor > 1 = zoom avant (viewBox plus petit).
     * Le zoom est centré sur (focusX, focusY) exprimé en coordonnées SVG.
     */
    zoomViewBox(currentBox, baseBox, factor, focusX, focusY) {
        const [cx, cy, cw, ch] = currentBox;
        const [bx, by, bw, bh] = baseBox;
        const minW = bw * 0.06; // zoom max ~x16, largement assez pour toucher un petit pays
        const maxW = bw;        // jamais plus large que la carte source (= dézoomé au max)
        let nw = Math.min(maxW, Math.max(minW, cw / factor));
        let nh = nw * (ch / cw);
        const fx = focusX ?? (cx + cw / 2);
        const fy = focusY ?? (cy + ch / 2);
        // Le point sous le doigt/curseur reste fixe pendant le zoom.
        const ratioX = cw ? (fx - cx) / cw : 0.5;
        const ratioY = ch ? (fy - cy) / ch : 0.5;
        let nx = fx - ratioX * nw;
        let ny = fy - ratioY * nh;
        nx = Math.min(Math.max(bx, nx), bx + bw - nw);
        ny = Math.min(Math.max(by, ny), by + bh - nh);
        return [nx, ny, nw, nh];
    },

    /** Déplace le viewBox de (dx, dy) en coordonnées SVG, sans sortir de baseBox. */
    panViewBox(currentBox, baseBox, dx, dy) {
        const [cx, cy, cw, ch] = currentBox;
        const [bx, by, bw, bh] = baseBox;
        let nx = Math.min(Math.max(bx, cx + dx), bx + bw - cw);
        let ny = Math.min(Math.max(by, cy + dy), by + bh - ch);
        return [nx, ny, cw, ch];
    },

    /**
     * Calcule la bounding box d'un path SVG (commandes M/L/H/V/C/Z, absolues
     * ou relatives — validé par isSafeSvgMarkup). Sert à recentrer/zoomer la
     * carte sur la zone cible pour les petits pays/régions autrement
     * impossibles à toucher précisément. Pour C, seuls les points de
     * contrôle et le point final sont pris en compte (bbox légèrement plus
     * large que le tracé réel, mais un vrai calcul de bbox de courbe de
     * Bézier n'apporterait rien ici — c'est déjà bien plus précis qu'un
     * curseur désynchronisé qui ignorerait la commande).
     */
    _getPathBoundingBox(d) {
        const tokens = d.match(/[MmLlHhVvCcZz]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
        let i = 0;
        let cx = 0, cy = 0;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        const visit = (x, y) => {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        };
        let cmd = '';
        while (i < tokens.length) {
            const token = tokens[i];
            if (/^[MmLlHhVvCcZz]$/.test(token)) {
                cmd = token;
                i++;
                if (cmd === 'Z' || cmd === 'z') continue;
            }
            const isRelative = cmd === cmd.toLowerCase();
            if (cmd.toUpperCase() === 'H') {
                const x = parseFloat(tokens[i]); i++;
                cx = isRelative ? cx + x : x;
                visit(cx, cy);
            } else if (cmd.toUpperCase() === 'V') {
                const y = parseFloat(tokens[i]); i++;
                cy = isRelative ? cy + y : y;
                visit(cx, cy);
            } else if (cmd.toUpperCase() === 'M' || cmd.toUpperCase() === 'L') {
                const x = parseFloat(tokens[i]); i++;
                const y = parseFloat(tokens[i]); i++;
                cx = isRelative ? cx + x : x;
                cy = isRelative ? cy + y : y;
                visit(cx, cy);
            } else if (cmd.toUpperCase() === 'C') {
                const x1 = parseFloat(tokens[i]); i++;
                const y1 = parseFloat(tokens[i]); i++;
                const x2 = parseFloat(tokens[i]); i++;
                const y2 = parseFloat(tokens[i]); i++;
                const x = parseFloat(tokens[i]); i++;
                const y = parseFloat(tokens[i]); i++;
                if (isRelative) {
                    visit(cx + x1, cy + y1);
                    visit(cx + x2, cy + y2);
                    cx += x; cy += y;
                } else {
                    visit(x1, y1);
                    visit(x2, y2);
                    cx = x; cy = y;
                }
                visit(cx, cy);
            } else {
                i++;
            }
        }
        if (minX === Infinity) return null;
        return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
    },

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
            case 'map-locate':
                return this.renderMapLocate(problem);
            case 'memory-match':
                return this.renderMemoryMatch(problem);
            case 'fraction-build':
                return this.renderFractionBuild(problem);
            case 'angle-classify':
                return this.renderAngleClassify(problem);
            default:
                return `<div class="board-card"><p>Moteur interactif prêt, activité non reconnue.</p></div>`;
        }
    },

    renderAngleClassify(problem) {
        const data = problem.data || {};
        const board = data.board || { width: 10, height: 6 };
        const drawing = data.drawing || {};
        const buckets = Array.isArray(data.buckets) ? data.buckets : [];
        const revealed = !!data.revealed;
        const selectedId = data.userState?.selectedId || null;
        const answerId = data.answerId || '';
        const width = Number(board.width) || 10;
        const height = Number(board.height) || 6;
        const size = 280;
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

        let arc = '';
        if (drawing.arc && Array.isArray(drawing.arc.vertex) && Array.isArray(drawing.arc.start) && Array.isArray(drawing.arc.end)) {
            const a = drawing.arc;
            const vx = toX(a.vertex[0]), vy = toY(a.vertex[1]);
            const sx = toX(a.start[0]), sy = toY(a.start[1]);
            const ex = toX(a.end[0]), ey = toY(a.end[1]);
            const radius = Math.hypot(sx - vx, sy - vy);
            const largeArc = a.largeArc ? 1 : 0;
            const path = `M ${vx} ${vy} L ${sx} ${sy} A ${radius} ${radius} 0 ${largeArc} 0 ${ex} ${ey} Z`;
            arc = `<path d="${this._escape(path)}" class="board-angle-arc" />`;
        }

        const bucketButtons = buckets.map((bucket) => {
            let stateCls = selectedId === bucket.id ? 'is-selected' : '';
            if (revealed && selectedId === bucket.id) {
                stateCls = bucket.id === answerId ? 'is-correct' : 'is-incorrect';
            } else if (revealed && bucket.id === answerId) {
                stateCls = 'is-correct';
            }
            return `
                <button
                    type="button"
                    class="board-bucket board-angle-choice ${stateCls}"
                    data-val="board-pick-angle:${SecurityUtils.sanitizeId(bucket.id)}"
                    ${revealed ? 'disabled' : ''}
                >
                    <span class="board-bucket-title">${this._escape(bucket.label || bucket.id)}</span>
                </button>
            `;
        }).join('');

        return `
            <div class="board-card">
                <div class="board-panel">
                    <svg class="board-svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="Angle à classer">
                        ${lines}
                        ${arc}
                    </svg>
                </div>
                <div class="board-panel">
                    <div class="board-bucket-list board-angle-list">${bucketButtons}</div>
                </div>
            </div>
        `;
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

        const circles = (Array.isArray(drawing.circles) ? drawing.circles : []).map((circle) => `
            <circle
                cx="${toX(circle.x)}"
                cy="${toY(circle.y)}"
                r="${Number(circle.r || 1) * stepX}"
                class="board-shape-line"
                fill="none"
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

        const hotspots = features.map((feature, index) => {
            const isSelected = selectedSet.has(feature.id);
            const cx = toX(feature.x);
            const cy = toY(feature.y);
            return `
                <g class="board-feature ${isSelected ? 'is-selected' : ''}" data-val="board-toggle-feature:${SecurityUtils.sanitizeId(feature.id)}" role="button" tabindex="0" aria-label="Point ${index + 1}" aria-pressed="${isSelected}">
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
                        ${circles}
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
        const answerMap = data.answerMap || {};
        const revealed = !!data.revealed;
        const selectedFigureId = state.selectedFigureId || '';
        const unassigned = figures.filter((figure) => !assignments[figure.id]);

        const figureCards = unassigned.map((figure) => `
            <button
                type="button"
                class="board-chip ${selectedFigureId === figure.id ? 'is-selected' : ''}"
                data-val="board-select-figure:${SecurityUtils.sanitizeId(figure.id)}"
                ${revealed ? 'disabled' : ''}
            >
                <span class="board-chip-label">${this._escape(figure.label || figure.shape || figure.id)}</span>
            </button>
        `).join('');

        const bucketCards = buckets.map((bucket) => {
            const items = figures.filter((figure) => assignments[figure.id] === bucket.id);
            let stateCls = '';
            if (revealed && items.length > 0) {
                const allCorrect = items.every((item) => answerMap[item.id] === bucket.id);
                stateCls = allCorrect ? 'is-correct' : 'is-incorrect';
            }
            const itemLabels = items.map((item) => {
                if (!revealed) return this._escape(item.label || item.shape || item.id);
                const isCorrect = answerMap[item.id] === bucket.id;
                return `<span class="${isCorrect ? 'is-correct' : 'is-incorrect'}">${this._escape(item.label || item.shape || item.id)}</span>`;
            }).join(' · ');
            return `
                <button
                    type="button"
                    class="board-bucket ${stateCls}"
                    data-val="board-assign-bucket:${SecurityUtils.sanitizeId(bucket.id)}"
                    ${revealed ? 'disabled' : ''}
                >
                    <span class="board-bucket-title">${this._escape(bucket.label || bucket.id)}</span>
                    <span class="board-bucket-hint">${items.length > 0 ? itemLabels : 'Dépose ici'}</span>
                </button>
            `;
        }).join('');

        return `
            <div class="board-card">
                <div class="board-toolbar">
                    <button type="button" class="btn board-action" data-val="board-reset" ${revealed ? 'disabled' : ''}>Réinitialiser</button>
                    <button type="button" class="btn btn--success board-action" data-val="board-submit" ${revealed ? 'disabled' : ''}>Valider</button>
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
        const revealed = !!data.revealed;
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
                const interactiveAttrs = revealed ? '' : `data-val="board-place-point:${x}:${y}" role="button" tabindex="0" aria-label="Point (${x} ; ${y})" aria-pressed="${isActive}"`;
                points.push(`
                    <g class="board-grid-node ${isActive ? 'is-active' : ''}" ${interactiveAttrs}>
                        <circle cx="${cx}" cy="${cy}" r="${isActive ? 12 : 10}" class="board-grid-hit"></circle>
                        <circle cx="${cx}" cy="${cy}" r="${isActive ? 6 : 3.5}" class="board-grid-dot"></circle>
                    </g>
                `);
            }
        }

        return `
            <div class="board-card">
                <div class="board-toolbar">
                    <div class="board-status">${revealed
                        ? `${this._escape(task.label || 'Point')} : ${point ? `(${point[0]} ; ${point[1]})` : 'non placé'}`
                        : (point ? 'Point placé — vérifie bien avant de valider !' : 'Touche une intersection du quadrillage.')}</div>
                    <div class="board-toolbar-actions">
                        <button type="button" class="btn board-action" data-val="board-reset" ${revealed ? 'disabled' : ''}>Réinitialiser</button>
                        <button type="button" class="btn btn--success board-action" data-val="board-submit" ${revealed ? 'disabled' : ''}>Valider</button>
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
                    <g class="board-grid-node ${isPlaced ? 'is-active' : ''}" data-val="board-toggle-point:${x}:${y}" role="button" tabindex="0" aria-label="Point (${x} ; ${y})" aria-pressed="${isPlaced}">
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
    },

    renderMapLocate(problem) {
        const data = problem.data || {};
        const mapSvgRaw = (data.mapSvg || '').toString();
        const targetZoneId = (data.targetZoneId || '').toString();
        const targetLabel = data.targetLabel || '';
        const revealed = !!data.revealed;
        const selectedZoneId = data.userState?.selectedZoneId || null;

        let viewBox = '0 0 800 800';
        let svgFullViewBox = viewBox;
        let pathsHtml = '<text x="400" y="400" text-anchor="middle" class="board-map-error">Carte indisponible</text>';

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(mapSvgRaw, 'image/svg+xml');
            const svgEl = doc.querySelector('svg');
            const parserError = doc.querySelector('parsererror');
            if (svgEl && !parserError) {
                viewBox = svgEl.getAttribute('viewBox') || viewBox;
                svgFullViewBox = viewBox;

                if (data.computedViewBox) {
                    // Le cadrage a déjà été calculé pour cette question (au
                    // premier rendu) : on le réutilise tel quel, y compris le
                    // zoom/pan manuel que l'enfant a pu faire depuis — sinon
                    // cliquer sur une zone (qui redéclenche un rendu à l'état
                    // révélé) ferait "sauter" la carte à sa position d'origine.
                    viewBox = data.computedViewBox;
                } else {
                    // Cadrage initial : toujours la carte entière telle que
                    // scopée par son propre fichier SVG (chaque carte — Asie,
                    // Europe, régions de France, monde... — a un viewBox déjà
                    // limité au bon territoire, pas un unique fichier "monde"
                    // qu'il faudrait recadrer nous-mêmes). Zoomer d'emblée sur
                    // la cible masquait le contexte et pouvait, avec le
                    // décalage aléatoire, sortir complètement la cible du
                    // cadre — l'enfant utilise maintenant les boutons +/- et
                    // le glisser-déposer pour zoomer lui-même si besoin.
                    data.computedViewBox = viewBox;
                }

                const paths = Array.from(doc.querySelectorAll('path[id]'));
                pathsHtml = paths.map((node) => {
                    const zoneId = node.getAttribute('id') || '';
                    const d = node.getAttribute('d') || '';
                    // The path geometry is numeric drawing data, never user-facing
                    // text: HTML-escaping it would be meaningless and the shared
                    // escapeHtml() truncates at 5000 chars, which silently cuts
                    // long country/region outlines mid-command and renders as a
                    // stray line. Validate the character set instead.
                    if (!/^[MmLlHhVvCcSsQqTtAaZz0-9.,\-\s]*$/.test(d)) return '';
                    const zoneName = node.getAttribute('data-name') || zoneId;
                    let stateCls = '';
                    if (revealed) {
                        if (zoneId === targetZoneId) stateCls = 'is-correct';
                        else if (zoneId === selectedZoneId) stateCls = 'is-incorrect';
                    } else if (zoneId === selectedZoneId) {
                        stateCls = 'is-selected';
                    }
                    const safeZoneId = SecurityUtils.sanitizeId ? SecurityUtils.sanitizeId(zoneId) : zoneId.replace(/[^a-zA-Z0-9-]/g, '');
                    const interactiveAttrs = revealed ? '' : `data-val="board-select-zone:${safeZoneId}" role="button" tabindex="0" aria-label="${this._escape(zoneName)}"`;
                    return `<path class="board-map-zone ${stateCls}" d="${d}" data-zone-name="${this._escape(zoneName)}" ${interactiveAttrs} />`;
                }).join('');
            }
        } catch (err) {
            pathsHtml = '<text x="400" y="400" text-anchor="middle" class="board-map-error">Carte indisponible</text>';
        }

        const statusText = revealed
            ? (selectedZoneId === targetZoneId ? `Bravo, c'était ${this._escape(targetLabel)} !` : `La bonne réponse était ${this._escape(targetLabel)}.`)
            : `Touche ${this._escape(targetLabel)} sur la carte.`;

        // baseViewBox sert de référence pour les limites de zoom/pan (on ne
        // s'éloigne jamais de la carte source, on ne zoome jamais plus loin
        // qu'elle). Toujours le viewBox complet du SVG, indépendamment du
        // cadrage initial actuellement affiché.
        const baseViewBox = svgFullViewBox || viewBox;

        return `
            <div class="board-card">
                <div class="board-toolbar">
                    <div class="board-status">${statusText}</div>
                    <div class="board-zoom-controls">
                        <button type="button" class="btn board-zoom-btn" data-val="board-zoom-out" aria-label="Dézoomer">−</button>
                        <button type="button" class="btn board-zoom-btn" data-val="board-zoom-in" aria-label="Zoomer">+</button>
                    </div>
                </div>
                <div class="board-panel board-panel--map">
                    <svg class="board-svg board-map-svg${(data.mapId || '') === 'france-regions' ? ' board-map-svg--flat' : ''}" viewBox="${this._escape(viewBox)}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Carte interactive, glisser pour se déplacer" data-board-map-svg data-base-viewbox="${this._escape(baseViewBox)}">
                        ${pathsHtml}
                    </svg>
                </div>
            </div>
        `;
    },

    renderMemoryMatch(problem) {
        const data = problem.data || {};
        const cards = Array.isArray(data.cards) ? data.cards : [];
        const totalPairs = Number(data.totalPairs) || 0;
        const flippedIds = Array.isArray(data.userState?.flippedIds) ? data.userState.flippedIds : [];
        const matchedPairIds = Array.isArray(data.userState?.matchedPairIds) ? data.userState.matchedPairIds : [];
        const flippedSet = new Set(flippedIds);
        const matchedSet = new Set(matchedPairIds);
        const isLocked = !!data.locked;

        const cardsHtml = cards.map((card) => {
            const isFlipped = flippedSet.has(card.id);
            const isMatched = matchedSet.has(card.pairId);
            const isFaceUp = isFlipped || isMatched;
            const stateCls = isMatched ? 'is-matched' : (isFlipped ? 'is-flipped' : '');
            const disabled = (isFaceUp || isLocked) ? 'disabled' : '';
            return `
                <button
                    type="button"
                    class="board-memory-card ${stateCls}"
                    data-val="board-flip-card:${SecurityUtils.sanitizeId(card.id)}"
                    aria-label="${isFaceUp ? this._escape(card.label) : 'Carte cachée'}"
                    aria-pressed="${isFaceUp}"
                    ${disabled}
                >
                    <span class="board-memory-card-face board-memory-card-back">?</span>
                    <span class="board-memory-card-face board-memory-card-front">${this._escape(card.label)}</span>
                </button>
            `;
        }).join('');

        return `
            <div class="board-card">
                <div class="board-toolbar">
                    <div class="board-status">${matchedSet.size} / ${totalPairs} paire${totalPairs > 1 ? 's' : ''} trouvée${matchedSet.size > 1 ? 's' : ''}</div>
                </div>
                <div class="board-panel board-memory-grid" style="--memory-cols: ${Math.min(4, Math.ceil(Math.sqrt(cards.length)))}">
                    ${cardsHtml}
                </div>
            </div>
        `;
    },

    renderFractionBuild(problem) {
        const data = problem.data || {};
        const denominator = Number(data.denominator) || 1;
        const numerator = Number(data.numerator) || 0;
        const selectedSlices = Array.isArray(data.userState?.selectedSlices) ? data.userState.selectedSlices : [];
        const selectedSet = new Set(selectedSlices);
        const revealed = !!data.revealed;

        const radius = 60;
        const center = 80;
        let slicesHtml = '';
        for (let i = 0; i < denominator; i++) {
            const a1 = (i * 2 * Math.PI) / denominator - Math.PI / 2;
            const a2 = ((i + 1) * 2 * Math.PI) / denominator - Math.PI / 2;
            const x1 = center + radius * Math.cos(a1);
            const y1 = center + radius * Math.sin(a1);
            const x2 = center + radius * Math.cos(a2);
            const y2 = center + radius * Math.sin(a2);
            const isSelected = selectedSet.has(i);
            const stateCls = isSelected ? 'is-selected' : '';
            const interactiveAttrs = revealed ? '' : `data-val="board-toggle-slice:${i}" role="button" tabindex="0" aria-label="Part ${i + 1} sur ${denominator}" aria-pressed="${isSelected}"`;
            slicesHtml += `<path class="board-fraction-slice ${stateCls}" d="M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z" ${interactiveAttrs} />`;
        }

        const statusText = revealed
            ? (selectedSet.size === numerator ? `Bravo, ${numerator}/${denominator} !` : `La bonne réponse était ${numerator}/${denominator}.`)
            : `${selectedSet.size} part${selectedSet.size > 1 ? 's' : ''} sélectionnée${selectedSet.size > 1 ? 's' : ''} sur ${denominator}`;

        return `
            <div class="board-card">
                <div class="board-toolbar">
                    <div class="board-status">${statusText}</div>
                    <div class="board-toolbar-actions">
                        <button type="button" class="btn board-action" data-val="board-reset" ${revealed ? 'disabled' : ''}>Réinitialiser</button>
                        <button type="button" class="btn btn--success board-action" data-val="board-submit" ${revealed ? 'disabled' : ''}>Valider</button>
                    </div>
                </div>
                <div class="board-panel">
                    <svg class="board-svg" viewBox="0 0 160 160" role="img" aria-label="Disque de fraction interactif">
                        ${slicesHtml}
                    </svg>
                </div>
            </div>
        `;
    }
};

window.UIBoard = UIBoard;

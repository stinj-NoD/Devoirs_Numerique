const EnginesBoard = {
    getPoolEntry(p) {
        const category = p?.category;
        const pool = p?.dataSet?.categories?.[category];
        if (!Array.isArray(pool) || pool.length === 0) return null;
        return Engines.utils.pick(pool);
    },

    canonicalizeAssignments(answerMap) {
        if (!answerMap || typeof answerMap !== 'object') return '';
        return Object.keys(answerMap)
            .sort()
            .map((key) => `${key}:${answerMap[key]}`)
            .join('|');
    },

    canonicalizePoint(point) {
        if (!Array.isArray(point) || point.length !== 2) return '';
        return `${Number(point[0])},${Number(point[1])}`;
    },

    canonicalizePoints(points) {
        if (!Array.isArray(points)) return '';
        return points
            .filter((point) => Array.isArray(point) && point.length === 2)
            .map((point) => [Number(point[0]), Number(point[1])])
            .sort((a, b) => a[0] - b[0] || a[1] - b[1])
            .map((point) => `${point[0]},${point[1]}`)
            .join('|');
    },

    run(p = {}) {
        const entry = this.getPoolEntry(p);
        if (!entry) {
            return Engines.fallback("Activité interactive indisponible");
        }

        switch (p.type) {
            case 'tap-features':
                return this.tapFeatures(entry);
            case 'shape-classify':
                return this.shapeClassify(entry);
            case 'point-on-grid':
                return this.pointOnGrid(entry);
            case 'symmetry-complete':
                return this.symmetryComplete(entry);
            default:
                return Engines.fallback("Type d'activité interactive inconnu");
        }
    },

    tapFeatures(entry) {
        const features = Array.isArray(entry.features) ? entry.features : [];
        const answerIds = features
            .filter((feature) => feature && feature.correct === true)
            .map((feature) => feature.id)
            .sort();
        return {
            question: entry.prompt || "Touche les bons éléments.",
            answer: answerIds.join('|'),
            inputType: 'board',
            isVisual: true,
            visualType: 'geometry-board',
            data: {
                boardKind: 'tap-features',
                board: entry.board || { width: 10, height: 6, grid: false },
                drawing: entry.drawing || {},
                features,
                expectedSelections: answerIds.length,
                userState: {
                    selectedIds: []
                }
            }
        };
    },

    shapeClassify(entry) {
        const figures = Array.isArray(entry.figures) ? entry.figures : [];
        const buckets = Array.isArray(entry.buckets) ? entry.buckets : [];
        const answerMap = entry.answer && typeof entry.answer === 'object' ? entry.answer : {};
        return {
            question: entry.prompt || "Classe les figures.",
            answer: this.canonicalizeAssignments(answerMap),
            inputType: 'board',
            isVisual: true,
            visualType: 'geometry-board',
            data: {
                boardKind: 'shape-classify',
                board: entry.board || { width: 10, height: 6, grid: false },
                figures,
                buckets,
                answerMap,
                userState: {
                    selectedFigureId: null,
                    assignments: {}
                }
            }
        };
    },

    pointOnGrid(entry) {
        const board = entry.board || { width: 8, height: 8, grid: true };
        const targetPoint = Array.isArray(entry.task?.target) ? entry.task.target : null;
        return {
            question: entry.prompt || "Place le point au bon endroit.",
            answer: this.canonicalizePoint(targetPoint),
            inputType: 'board',
            isVisual: true,
            visualType: 'geometry-board',
            data: {
                boardKind: 'point-on-grid',
                board,
                task: entry.task || null,
                tolerance: Number.isFinite(Number(entry.tolerance)) ? Number(entry.tolerance) : 0,
                userState: {
                    point: null
                }
            }
        };
    },

    symmetryComplete(entry) {
        const board = entry.board || { width: 10, height: 8, grid: true };
        const targetPoints = Array.isArray(entry.targetPoints) ? entry.targetPoints : [];
        return {
            question: entry.prompt || "Complète la figure.",
            answer: this.canonicalizePoints(targetPoints),
            inputType: 'board',
            isVisual: true,
            visualType: 'geometry-board',
            data: {
                boardKind: 'symmetry-complete',
                board,
                axis: entry.board?.axis || null,
                givenPoints: Array.isArray(entry.givenPoints) ? entry.givenPoints : [],
                targetPoints,
                tolerance: Number.isFinite(Number(entry.tolerance)) ? Number(entry.tolerance) : 0,
                userState: {
                    placedPoints: []
                }
            }
        };
    }
};

window.EnginesBoard = EnginesBoard;

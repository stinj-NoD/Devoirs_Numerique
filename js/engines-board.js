const EnginesBoard = {
    getPoolEntry(p) {
        const category = p?.category;
        const pool = p?.dataSet?.categories?.[category];
        if (!Array.isArray(pool) || pool.length === 0) return null;
        return Engines.utils.pickUnused(pool, p?.usedSet);
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

    canonicalizeMatchedPairs(matchedPairIds) {
        if (!Array.isArray(matchedPairIds)) return '';
        return [...new Set(matchedPairIds)].map(String).sort().join(',');
    },

    run(p = {}) {
        // fraction-build est généré procéduralement (comme math-input) plutôt
        // que pioché dans un fichier de données : il n'y a rien à varier
        // d'une entrée à l'autre à part le dénominateur/numérateur aléatoires.
        if (p.type === 'fraction-build') {
            return this.fractionBuild(p);
        }

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
            case 'map-locate':
                return this.mapLocate(entry, p);
            case 'memory-match':
                return this.memoryMatch(entry);
            case 'angle-classify':
                return this.angleClassify(entry);
            default:
                return Engines.fallback("Type d'activité interactive inconnu");
        }
    },

    angleClassify(entry) {
        const buckets = Array.isArray(entry.buckets) && entry.buckets.length
            ? entry.buckets
            : [
                { id: 'aigu', label: 'Aigu (< 90°)' },
                { id: 'droit', label: 'Droit (= 90°)' },
                { id: 'obtu', label: 'Obtus (> 90°)' }
            ];
        const answerId = (entry.answer || '').toString();
        return {
            question: SecurityUtils.escapeHtml(entry.prompt || "Cet angle est-il aigu, droit ou obtus ?"),
            answer: answerId,
            inputType: 'board',
            isVisual: true,
            visualType: 'geometry-board',
            explanation: entry.explanation || "",
            data: {
                boardKind: 'angle-classify',
                board: entry.board || { width: 10, height: 6, grid: false },
                drawing: entry.drawing || {},
                buckets,
                answerId,
                userState: {
                    selectedId: null
                }
            }
        };
    },

    tapFeatures(entry) {
        const features = Array.isArray(entry.features) ? entry.features : [];
        const answerIds = features
            .filter((feature) => feature && feature.correct === true)
            .map((feature) => feature.id)
            .sort();
        return {
            question: SecurityUtils.escapeHtml(entry.prompt || "Touche les bons éléments."),
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
            question: SecurityUtils.escapeHtml(entry.prompt || "Classe les figures."),
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
            question: SecurityUtils.escapeHtml(entry.prompt || "Place le point au bon endroit."),
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

    mapLocate(entry, p) {
        const targetZoneId = (entry.targetZoneId || '').toString().trim();
        return {
            question: SecurityUtils.escapeHtml(entry.prompt || `Touche ${entry.targetLabel || 'la bonne zone'} sur la carte.`),
            answer: targetZoneId,
            inputType: 'board',
            isVisual: true,
            visualType: 'geometry-board',
            data: {
                boardKind: 'map-locate',
                mapId: (p.mapId || entry.mapId || '').toString(),
                mapSvg: (p.mapSvg || '').toString(),
                targetZoneId,
                targetLabel: (entry.targetLabel || '').toString(),
                userState: {
                    selectedZoneId: null
                }
            }
        };
    },

    symmetryComplete(entry) {
        const board = entry.board || { width: 10, height: 8, grid: true };
        const targetPoints = Array.isArray(entry.targetPoints) ? entry.targetPoints : [];
        return {
            question: SecurityUtils.escapeHtml(entry.prompt || "Complète la figure."),
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
    },

    memoryMatch(entry) {
        const { shuffle } = Engines.utils;
        const allPairs = Array.isArray(entry.pairs)
            ? entry.pairs.filter((pair) => Array.isArray(pair) && pair.length === 2)
            : [];
        if (allPairs.length < 3) {
            return Engines.fallback("Mémoire indisponible");
        }

        const maxPairs = Math.min(6, allPairs.length);
        const pairs = shuffle(allPairs).slice(0, maxPairs);
        const allPairIds = pairs.map((_, index) => `p${index}`);

        const cards = [];
        pairs.forEach((pair, index) => {
            const pairId = `p${index}`;
            cards.push({ id: `${pairId}-a`, pairId, label: pair[0] });
            cards.push({ id: `${pairId}-b`, pairId, label: pair[1] });
        });

        return {
            question: entry.title || "Retrouve toutes les paires.",
            answer: this.canonicalizeMatchedPairs(allPairIds),
            inputType: 'board',
            isVisual: true,
            visualType: 'geometry-board',
            explanation: entry.explanation || "",
            data: {
                boardKind: 'memory-match',
                cards: shuffle(cards),
                totalPairs: pairs.length,
                userState: {
                    flippedIds: [],
                    matchedPairIds: []
                }
            }
        };
    },

    fractionBuild(p) {
        const { rnd } = Engines.utils;
        const minDenom = Number.isFinite(Number(p.minDenom)) ? Number(p.minDenom) : 2;
        const maxDenom = Number.isFinite(Number(p.maxDenom)) ? Number(p.maxDenom) : 8;
        const denominator = rnd(Math.max(2, minDenom), Math.max(2, maxDenom));
        const numerator = rnd(1, denominator - 1);

        return {
            question: SecurityUtils.escapeHtml(`Touche ${numerator} part${numerator > 1 ? 's' : ''} sur ${denominator} pour construire la fraction ${numerator}/${denominator}.`),
            answer: String(numerator),
            inputType: 'board',
            isVisual: true,
            visualType: 'geometry-board',
            data: {
                boardKind: 'fraction-build',
                denominator,
                numerator,
                userState: {
                    selectedSlices: []
                }
            }
        };
    }
};

window.EnginesBoard = EnginesBoard;

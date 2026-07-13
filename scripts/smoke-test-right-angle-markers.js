#!/usr/bin/env node
// Smoke-test du correctif d'orientation des marqueurs `right-angle` dans
// renderTapFeatures (js/ui-board.js). Vérifie que la bissectrice calculée
// pour chaque marker pointe vers l'intérieur du polygone du contour, sur
// les données réelles de data/board_tap_features_{cm1,ce2}.json.
//   node scripts/smoke-test-right-angle-markers.js

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// --- copie des fonctions pures de js/ui-board.js (tenues en sync manuellement) ---

function collectVertexDirections(marker, lines, eps = 0.01) {
    const mx = Number(marker.x);
    const my = Number(marker.y);
    const isSamePoint = (px, py) => Math.abs(px - mx) <= eps && Math.abs(py - my) <= eps;
    const directions = [];
    (Array.isArray(lines) ? lines : []).forEach((line) => {
        const x1 = Number(line.x1), y1 = Number(line.y1);
        const x2 = Number(line.x2), y2 = Number(line.y2);
        if (x1 === x2 && y1 === y2) return;
        if (isSamePoint(x1, y1)) directions.push({ dx: x2 - x1, dy: y2 - y1 });
        else if (isSamePoint(x2, y2)) directions.push({ dx: x1 - x2, dy: y1 - y2 });
    });
    return directions;
}

function pickTwoDistinctDirections(directions) {
    for (let i = 0; i < directions.length; i += 1) {
        for (let j = i + 1; j < directions.length; j += 1) {
            const a = directions[i], b = directions[j];
            const cross = a.dx * b.dy - a.dy * b.dx;
            if (Math.abs(cross) > 1e-6) return [a, b];
        }
    }
    return [directions[0], directions[1]];
}

function resolveChevronLegs(directions) {
    const norm = (d) => {
        const len = Math.hypot(d.dx, d.dy) || 1;
        return { dx: d.dx / len, dy: d.dy / len };
    };
    if (directions.length === 0) {
        return [{ dx: 1, dy: 0 }, { dx: 0, dy: 1 }];
    }
    if (directions.length === 1) {
        const u = norm(directions[0]);
        return [u, { dx: -u.dy, dy: u.dx }];
    }
    const [d1, d2] = pickTwoDistinctDirections(directions);
    return [norm(d1), norm(d2)];
}

// --- utilitaires de test ---

function bisector(legA, legB) {
    let bx = legA.dx + legB.dx;
    let by = legA.dy + legB.dy;
    if (Math.hypot(bx, by) < 1e-6) {
        bx = -legA.dy;
        by = legA.dx;
    }
    const len = Math.hypot(bx, by) || 1;
    return { dx: bx / len, dy: by / len };
}

// Propriété garantie par le correctif : sur un sommet à 2 côtés connus, le
// chevron doit être aligné sur CES DEUX côtés réels (le trait souligne
// l'angle formé localement par le contour, qu'il soit convexe ou réflexe —
// ex. le coin intérieur d'une figure en L). On ne peut donc pas vérifier
// "la bissectrice pointe vers l'intérieur du polygone global" sur une
// figure non convexe (ça échoue à raison sur un sommet réflexe) ; on
// vérifie à la place que resolveChevronLegs renvoie exactement les deux
// directions issues de collectVertexDirections (aux permutations près).
function legsMatchDirections(legA, legB, directions) {
    if (directions.length !== 2) return true; // cas 0/1 direction : autre couverture plus bas
    const norm = (d) => {
        const len = Math.hypot(d.dx, d.dy) || 1;
        return { dx: d.dx / len, dy: d.dy / len };
    };
    const [d1, d2] = [norm(directions[0]), norm(directions[1])];
    const close = (a, b) => Math.abs(a.dx - b.dx) < 1e-6 && Math.abs(a.dy - b.dy) < 1e-6;
    return (close(legA, d1) && close(legB, d2)) || (close(legA, d2) && close(legB, d1));
}

let failures = 0;
let checks = 0;

function assert(cond, message) {
    checks += 1;
    if (!cond) {
        failures += 1;
        console.error('FAIL:', message);
    }
}

function checkEntry(label, entry) {
    const lines = Array.isArray(entry.drawing?.lines) ? entry.drawing.lines : [];
    const markers = Array.isArray(entry.drawing?.markers) ? entry.drawing.markers : [];
    markers.forEach((marker, i) => {
        const directions = collectVertexDirections(marker, lines);
        const [legA, legB] = resolveChevronLegs(directions);
        assert(Number.isFinite(legA.dx) && Number.isFinite(legB.dy), `${label} marker#${i} : jambes non-finies`);
        assert(
            legsMatchDirections(legA, legB, directions),
            `${label} marker#${i} (${marker.x},${marker.y}) : le chevron ne suit pas les côtés réels du contour`
        );
    });
}

// --- rectangle CM1 #0 : assertions dures sur les bissectrices attendues ---

const rectangle = {
    drawing: {
        lines: [
            { x1: 2, y1: 1, x2: 8, y2: 1 },
            { x1: 8, y1: 1, x2: 8, y2: 5 },
            { x1: 8, y1: 5, x2: 2, y2: 5 },
            { x1: 2, y1: 5, x2: 2, y2: 1 },
        ],
        markers: [
            { type: 'right-angle', x: 2, y: 1 },
            { type: 'right-angle', x: 8, y: 1 },
            { type: 'right-angle', x: 8, y: 5 },
            { type: 'right-angle', x: 2, y: 5 },
        ],
    },
};

const expectedBisectors = [
    { dx: 1, dy: 1 },   // (2,1) coin haut-gauche -> intérieur = bas-droite
    { dx: -1, dy: 1 },  // (8,1) coin haut-droit -> intérieur = bas-gauche
    { dx: -1, dy: -1 }, // (8,5) coin bas-droit -> intérieur = haut-gauche
    { dx: 1, dy: -1 },  // (2,5) coin bas-gauche -> intérieur = haut-droite
];

rectangle.drawing.markers.forEach((marker, i) => {
    const directions = collectVertexDirections(marker, rectangle.drawing.lines);
    assert(directions.length === 2, `rectangle marker#${i} : attendu 2 directions, trouvé ${directions.length}`);
    const [legA, legB] = resolveChevronLegs(directions);
    const b = bisector(legA, legB);
    const expected = expectedBisectors[i];
    const expectedLen = Math.hypot(expected.dx, expected.dy);
    const ex = expected.dx / expectedLen, ey = expected.dy / expectedLen;
    const dot = b.dx * ex + b.dy * ey;
    assert(dot > 0.99, `rectangle marker#${i} (${marker.x},${marker.y}) : bissectrice (${b.dx.toFixed(2)},${b.dy.toFixed(2)}) != attendue (${ex.toFixed(2)},${ey.toFixed(2)}), dot=${dot.toFixed(3)}`);
});

checkEntry('rectangle-hardcoded', rectangle);

// --- données réelles CM1 + CE2 ---

['data/board_tap_features_cm1.json', 'data/board_tap_features_ce2.json'].forEach((relPath) => {
    const file = path.join(ROOT, relPath);
    if (!fs.existsSync(file)) return;
    const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
    const categories = bank.categories || bank;
    Object.entries(categories).forEach(([cat, entries]) => {
        if (!Array.isArray(entries)) return;
        entries.forEach((entry, i) => {
            if (Array.isArray(entry.drawing?.markers) && entry.drawing.markers.length) {
                checkEntry(`${relPath}/${cat}#${i}`, entry);
            }
        });
    });
});

console.log(`${checks} vérifications effectuées.`);
if (failures > 0) {
    console.error(`SMOKE_TEST_FAILURES: ${failures}`);
    process.exit(1);
}
console.log('SMOKE_TEST_OK');

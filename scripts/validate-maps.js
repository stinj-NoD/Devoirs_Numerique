// Validateur du sous-système cartes (map-locate) et plateaux interactifs.
// Usage : node scripts/validate-maps.js
// Échoue (exit 1) si une incohérence est détectée. À lancer après tout ajout
// de carte, de banque map-locate ou d'exercice board-interactive.
//
// Vérifie :
//  1. Chaque exercice map-locate : mapFile existe, SVG parseable, mapId cohérent,
//     dataFile + category existants et non vides
//  2. Chaque entrée de banque map-locate : targetZoneId présent dans les ids
//     du SVG correspondant, et stable après SecurityUtils.sanitizeId (sinon
//     injouable au clic malgré un id "valide" en apparence)
//  3. Chaque exercice board-interactive (tous types) : dataFile + category
//     existants, pools non vides, format tableau
//  4. Orphelins : banques map-locate et SVG jamais référencés par un exercice
//  5. mapCollectionDefinitions (app.js) : chaque mapId de la Collection a au
//     moins un exercice, et réciproquement
//  6. Chaque mapFile respecte Validators.isSafeSvgMarkup (le même garde-fou
//     que le runtime applique avant de lancer l'exercice) — sans ce check,
//     un SVG peut passer ce script et pourtant ne jamais se lancer pour
//     l'enfant ("Carte SVG invalide ou non sûre.")
//  7. Chaque pool tap-features : mêmes ids de features d'une entrée à l'autre
//     de la catégorie (sinon une question isolée introduit/retire une cible
//     sans cohérence avec le reste de l'exercice)

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8').replace(/^﻿/, '');
const readJson = (p) => JSON.parse(read(p));

// Charge le vrai js/validators.js (pas une réimplémentation) pour éviter
// toute divergence future avec le garde-fou runtime.
function loadValidators() {
    const src = read('js/validators.js').replace(/window\.Validators\s*=\s*Validators;?\s*$/, '');
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(`${src}\nthis.Validators = Validators;`, sandbox);
    return sandbox.Validators;
}
const Validators = loadValidators();
const sanitizeId = (value) => (value || '').toString().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);

const errors = [];
const warnings = [];

// --- Collecte des exercices board-interactive de tous les niveaux ---
const grades = ['cp', 'ce1', 'ce2', 'cm1', 'cm2'];
const boardExercises = [];
for (const g of grades) {
    const data = readJson(`data/${g}.json`);
    for (const subject of data.subjects || []) {
        for (const subtheme of subject.subthemes || []) {
            for (const ex of subtheme.exercises || []) {
                if (ex.engine === 'board-interactive') {
                    boardExercises.push({ grade: g, ...ex });
                }
            }
        }
    }
}
console.log(`Exercices board-interactive : ${boardExercises.length}`);

// --- 1+3. Validation des exercices ---
const usedMapIds = new Set();
const usedBanks = new Set();
const svgIdsCache = {};

function svgZoneIds(mapFile) {
    if (!svgIdsCache[mapFile]) {
        const svg = read(mapFile);
        svgIdsCache[mapFile] = new Set([...svg.matchAll(/<path[^>]*\bid="([^"]+)"/g)].map((m) => m[1]));
    }
    return svgIdsCache[mapFile];
}

for (const ex of boardExercises) {
    const p = ex.params || {};
    const where = `${ex.grade}/${ex.id}`;

    if (p.dataFile) {
        usedBanks.add(p.dataFile.replace(/^\.\//, ''));
        let bank;
        try {
            bank = readJson(p.dataFile);
        } catch (e) {
            errors.push(`${where}: dataFile illisible ${p.dataFile} (${e.message})`);
            continue;
        }
        const cats = bank.categories || bank;
        const pool = cats[p.category];
        if (!Array.isArray(pool)) {
            errors.push(`${where}: catégorie '${p.category}' absente ou non-tableau dans ${p.dataFile}`);
            continue;
        }
        if (pool.length === 0) {
            errors.push(`${where}: catégorie '${p.category}' vide dans ${p.dataFile}`);
        } else if (pool.length < 4) {
            warnings.push(`${where}: pool fin (${pool.length} entrées) — répétitif pour l'enfant`);
        }

        if (p.type === 'map-locate') {
            usedMapIds.add(p.mapId);
            if (!p.mapFile) {
                errors.push(`${where}: map-locate sans mapFile`);
                continue;
            }
            if (!fs.existsSync(path.join(ROOT, p.mapFile))) {
                errors.push(`${where}: mapFile introuvable ${p.mapFile}`);
                continue;
            }
            const zoneIds = svgZoneIds(p.mapFile);
            if (zoneIds.size === 0) {
                errors.push(`${where}: aucun <path id> dans ${p.mapFile}`);
            }
            // 6. Le SVG doit passer le même garde-fou que le runtime, sinon
            // l'exercice est bloqué par une alerte au lancement malgré un
            // targetZoneId par ailleurs correct.
            if (!Validators.isSafeSvgMarkup(read(p.mapFile))) {
                errors.push(`${where}: ${p.mapFile} ne passe pas Validators.isSafeSvgMarkup (balise/attribut hors allowlist) — l'exercice ne pourra pas démarrer`);
            }
            // 2. Chaque entrée de la banque doit viser une zone du SVG, et
            // cet id doit rester identique une fois passé par sanitizeId
            // (c'est cette version sanitizée qui sert au clic réel).
            for (const entry of pool) {
                if (!zoneIds.has(entry.targetZoneId)) {
                    errors.push(`${where}: targetZoneId '${entry.targetZoneId}' absent du SVG ${p.mapFile}`);
                } else if (sanitizeId(entry.targetZoneId) !== entry.targetZoneId) {
                    errors.push(`${where}: targetZoneId '${entry.targetZoneId}' n'est pas stable après sanitizeId — injouable au clic`);
                }
                if (!entry.targetLabel) {
                    warnings.push(`${where}: entrée sans targetLabel (zone ${entry.targetZoneId})`);
                }
            }
        }

        // 7. Cohérence d'un pool tap-features : détecte une entrée isolée
        // qui perd/ajoute une cible par rapport au jeu majoritaire du pool
        // (ex. 6 entrées avec {tete,tronc,bras,jambe}, 1 seule avec
        // {tete,bras,jambe} — la cible manquante devient injouable pour
        // cette question). Ne signale rien pour les pools où la variété est
        // la norme (angles avec nombre de segments variable, villes tirées
        // au sort) : on ne compare que les entrées proches du jeu le plus
        // fréquent, pas la variété globale du pool.
        if (p.type === 'tap-features') {
            const idSetOf = (entry) => new Set((entry.features || []).map((f) => f.id));
            const keyOf = (set) => [...set].sort().join(',');
            const withSets = pool
                .filter((entry) => Array.isArray(entry.features) && entry.features.length)
                .map((entry) => ({ entry, set: idSetOf(entry) }));
            const counts = new Map();
            for (const { set } of withSets) {
                const key = keyOf(set);
                counts.set(key, (counts.get(key) || 0) + 1);
            }
            const [majorityKey, majorityCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0] || [];
            if (majorityKey && majorityCount / withSets.length >= 0.7) {
                const majoritySet = new Set(majorityKey.split(','));
                for (const { entry, set } of withSets) {
                    const key = keyOf(set);
                    if (key === majorityKey) continue;
                    const missing = [...majoritySet].filter((id) => !set.has(id));
                    const extra = [...set].filter((id) => !majoritySet.has(id));
                    if (missing.length && missing.length + extra.length <= 2) {
                        warnings.push(`${where}: entrée '${(entry.prompt || '').toString().slice(0, 60)}' du pool '${p.category}' n'offre pas ${missing.join(', ')} (présent(e) dans ${majorityCount}/${withSets.length} autres entrées) — cible potentiellement injouable pour cette question`);
                    }
                }
            }
        }
    }
}

// --- 4. Orphelins ---
const allBanks = fs.readdirSync(path.join(ROOT, 'data'))
    .filter((f) => f.startsWith('board_'))
    .map((f) => `data/${f}`);
for (const bank of allBanks) {
    if (!usedBanks.has(bank)) {
        warnings.push(`banque orpheline (aucun exercice ne la référence) : ${bank}`);
    }
}
const allSvgs = fs.readdirSync(path.join(ROOT, 'data', 'maps')).filter((f) => f.endsWith('.svg'));
const usedSvgs = new Set(boardExercises
    .filter((e) => e.params?.mapFile)
    .map((e) => path.basename(e.params.mapFile)));
for (const svg of allSvgs) {
    if (!usedSvgs.has(svg)) {
        warnings.push(`SVG orphelin : data/maps/${svg}`);
    }
}

// --- 5. Cohérence avec la Collection (app.js) ---
const appJs = read('js/app.js');
const collMatch = appJs.match(/mapCollectionDefinitions:\s*\[([\s\S]*?)\]/);
if (collMatch) {
    const collectionIds = [...collMatch[1].matchAll(/mapId:\s*'([^']+)'/g)].map((m) => m[1]);
    for (const id of collectionIds) {
        if (!usedMapIds.has(id)) {
            errors.push(`Collection: mapId '${id}' n'a aucun exercice map-locate — carte indébloquable`);
        }
    }
    for (const id of usedMapIds) {
        if (!collectionIds.includes(id)) {
            warnings.push(`mapId '${id}' a des exercices mais n'est pas dans la Collection (mapCollectionDefinitions)`);
        }
    }
}

// --- Rapport ---
console.log(`Cartes utilisées : ${[...usedMapIds].join(', ')}`);
if (warnings.length) {
    console.log('\n--- AVERTISSEMENTS ---');
    warnings.forEach((w) => console.log('  ⚠ ' + w));
}
if (errors.length) {
    console.log('\n--- ERREURS ---');
    errors.forEach((e) => console.log('  ✗ ' + e));
    process.exit(1);
}
console.log('\nOK — sous-système cartes cohérent.');

#!/usr/bin/env node
/*
 * build-content-index.js — Index machine-lisible + détecteur de doublons.
 * Node pur, aucune dépendance.
 *
 * Deux modes :
 *   node scripts/build-content-index.js --write   (défaut si aucun flag)
 *     Régénère CONTENT_INDEX.json à la racine : catalogue plat de tous les
 *     exercices/leçons des 5 niveaux + inventaire des banques data/*.json.
 *
 *   node scripts/build-content-index.js --check
 *     Ne réécrit rien. Échoue (exit 1) UNIQUEMENT sur ce qui est toujours un
 *     bug — pour ne pas casser le workflow sur du contenu historique légitime :
 *       - CONTENT_INDEX.json est absent ou périmé (≠ ce qui serait généré) ;
 *       - un id d'exercice/leçon est dupliqué (inter- OU intra-niveau : angle
 *         mort des validateurs actuels, qui ne vérifient l'unicité que par
 *         fichier — or les ids sont des clés de records côté utilisateur) ;
 *       - les listes knownEngines de js/validators.js, scripts/validate-data.ps1
 *         et data/engine-registry.json divergent (garde-fou du registre).
 *     Rapporte en WARNING (sans échouer) les doublons "mous", légitimes pour
 *     le contenu existant (variantes bonus, banque étalée sur plusieurs
 *     exercices) mais que l'agent auteur doit voir pour ne pas EN AJOUTER :
 *       - pool (dataFile,category) réutilisé dans le MÊME sous-thème (signal
 *         fort de redondance) ;
 *       - pool réutilisé entre sous-thèmes/niveaux ;
 *       - contrat engine+params identique entre exercices.
 *
 * À lancer dans le workflow obligatoire, à côté de validate-data.ps1.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LEVELS = ['cp', 'ce1', 'ce2', 'cm1', 'cm2'];
const INDEX_PATH = path.join(ROOT, 'CONTENT_INDEX.json');
const REGISTRY_PATH = path.join(ROOT, 'data', 'engine-registry.json');

const mode = process.argv.includes('--check') ? 'check' : 'write';

function readJson(p) {
    return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, ''));
}

/* -------- Empreinte de contrat : engine + params normalisés -------- */
// On ignore les clés purement "cosmétiques" ou de dosage qui ne changent pas
// la nature de l'exercice : questions (nombre tiré) et memo (aide affichée).
const CONTRACT_IGNORE = new Set(['questions', 'memo']);

function contractHash(ex) {
    const p = ex.params || {};
    const norm = {};
    for (const k of Object.keys(p).sort()) {
        if (CONTRACT_IGNORE.has(k)) continue;
        const v = p[k];
        if (v === null || typeof v === 'object') continue; // params scalaires seulement
        norm[k] = v;
    }
    return ex.engine + '|' + JSON.stringify(norm);
}

function poolKey(ex) {
    const p = ex.params || {};
    if (!p.dataFile || !p.category) return null;
    return p.dataFile.replace(/\\/g, '/').replace(/^\.\//, '') + '::' + p.category;
}

/* -------- Construction de l'index -------- */
function buildIndex() {
    const entries = [];
    let exercises = 0;
    let lessons = 0;

    for (const level of LEVELS) {
        const data = readJson(path.join(ROOT, 'data', `${level}.json`));
        for (const subject of data.subjects || []) {
            for (const st of subject.subthemes || []) {
                for (const lesson of st.lessons || []) {
                    lessons++;
                    entries.push({
                        id: lesson.id,
                        kind: 'lesson',
                        level,
                        subjectId: subject.id,
                        subthemeId: st.id,
                        engine: null,
                        paramsType: null,
                        pool: null,
                        contractHash: null
                    });
                }
                for (const ex of st.exercises || []) {
                    exercises++;
                    entries.push({
                        id: ex.id,
                        kind: 'exercise',
                        level,
                        subjectId: subject.id,
                        subthemeId: st.id,
                        engine: ex.engine || null,
                        paramsType: (ex.params && ex.params.type) || null,
                        pool: poolKey(ex),
                        contractHash: contractHash(ex)
                    });
                }
            }
        }
    }

    // Inventaire des banques externes data/*.json (hors niveaux/index/legacy).
    const skip = new Set([...LEVELS.map(l => `${l}.json`), 'index.json', 'cpold.json', 'engine-registry.json']);
    const banks = {};
    for (const file of fs.readdirSync(path.join(ROOT, 'data')).sort()) {
        if (!file.endsWith('.json') || skip.has(file)) continue;
        let bank;
        try {
            bank = readJson(path.join(ROOT, 'data', file));
        } catch (e) {
            banks[`data/${file}`] = { error: 'JSON invalide' };
            continue;
        }
        const cats = {};
        if (bank && bank.categories && typeof bank.categories === 'object') {
            for (const [cat, items] of Object.entries(bank.categories)) {
                cats[cat] = Array.isArray(items) ? items.length : null;
            }
        }
        banks[`data/${file}`] = { categories: cats };
    }

    return {
        _comment: 'Index machine-lisible généré par scripts/build-content-index.js. Ne pas éditer à la main : relancer le script après tout ajout de contenu. Artefact d\'outillage, NON embarqué dans le bundle runtime.',
        totals: { exercises, lessons, levels: LEVELS.length, banks: Object.keys(banks).length },
        entries,
        banks
    };
}

/* -------- Extraction des listes knownEngines pour le garde-fou -------- */
function enginesFromValidatorsJs() {
    const src = fs.readFileSync(path.join(ROOT, 'js', 'validators.js'), 'utf8');
    const m = src.match(/knownEngines:\s*new Set\(\[([\s\S]*?)\]\)/);
    if (!m) return null;
    return [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]);
}
function enginesFromValidatePs1() {
    const src = fs.readFileSync(path.join(ROOT, 'scripts', 'validate-data.ps1'), 'utf8');
    const m = src.match(/knownEngines\s*=\s*@\(([\s\S]*?)\)/);
    if (!m) return null;
    return [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]);
}
function enginesFromRegistry() {
    try {
        return Object.keys(readJson(REGISTRY_PATH).engines || {});
    } catch (e) {
        return null;
    }
}

function sortedEqual(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    const sa = [...a].sort();
    const sb = [...b].sort();
    return sa.every((v, i) => v === sb[i]);
}

/* -------- Détection des doublons -------- */
function detect(index) {
    const errors = [];
    const warnings = [];

    // 1. IDs dupliqués (inter-niveaux et intra) — un id doit être global unique.
    const idSeen = {};
    for (const e of index.entries) {
        (idSeen[e.id] = idSeen[e.id] || []).push(`${e.level}/${e.kind}`);
    }
    for (const [id, locs] of Object.entries(idSeen)) {
        if (locs.length > 1) {
            errors.push(`ID dupliqué "${id}" présent dans : ${locs.join(', ')}`);
        }
    }

    // 2. Pools (dataFile,category) réutilisés — habillages redondants.
    //    Deux niveaux de warning : même sous-thème (signal fort) vs global.
    const byPool = {};
    const byPoolSubtheme = {};
    for (const e of index.entries) {
        if (e.kind !== 'exercise' || !e.pool) continue;
        (byPool[e.pool] = byPool[e.pool] || []).push(e.level + '/' + e.id);
        const k = e.level + '/' + e.subthemeId + '::' + e.pool;
        (byPoolSubtheme[k] = byPoolSubtheme[k] || []).push(e.id);
    }
    for (const [k, ids] of Object.entries(byPoolSubtheme)) {
        if (ids.length > 1) {
            const [loc, pool] = [k.split('::')[0], k.slice(k.indexOf('::') + 2)];
            warnings.push(`[pool-même-sous-thème] ${loc} — ${ids.length} exercices sur le même vivier [${pool}] : ${ids.join(', ')}`);
        }
    }
    for (const [pool, ids] of Object.entries(byPool)) {
        if (ids.length > 1) {
            warnings.push(`[pool-global] réutilisé par ${ids.length} exercices [${pool}] : ${ids.join(', ')}`);
        }
    }

    // 3. Contrats engine+params identiques (informe l'agent ; jamais bloquant :
    //    pour les moteurs library/generator, le contenu vient de la lib, pas
    //    des params — contrat identique ≠ contenu identique).
    const byContract = {};
    for (const e of index.entries) {
        if (e.kind !== 'exercise' || !e.contractHash) continue;
        (byContract[e.contractHash] = byContract[e.contractHash] || []).push(e);
    }
    for (const group of Object.values(byContract)) {
        if (group.length < 2) continue;
        warnings.push(`[contrat-identique] ${group.length} exercices : ${group.map(e => e.level + '/' + e.id).join(', ')}`);
    }

    // 4. Garde-fou : cohérence des knownEngines entre les 3 sources.
    const vjs = enginesFromValidatorsJs();
    const vps = enginesFromValidatePs1();
    const reg = enginesFromRegistry();
    if (!vjs) errors.push('Impossible d\'extraire knownEngines de js/validators.js');
    if (!vps) errors.push('Impossible d\'extraire knownEngines de scripts/validate-data.ps1');
    if (!reg) errors.push('Impossible de lire data/engine-registry.json');
    if (vjs && vps && !sortedEqual(vjs, vps)) {
        errors.push(`knownEngines divergent entre validators.js (${vjs.length}) et validate-data.ps1 (${vps.length})`);
    }
    if (vjs && reg && !sortedEqual(vjs, reg)) {
        const missReg = vjs.filter(x => !reg.includes(x));
        const extraReg = reg.filter(x => !vjs.includes(x));
        errors.push(`engine-registry.json désynchronisé de validators.js` +
            (missReg.length ? ` — absents du registre: ${missReg.join(', ')}` : '') +
            (extraReg.length ? ` — en trop dans le registre: ${extraReg.join(', ')}` : ''));
    }

    return { errors, warnings };
}

/* -------- Main -------- */
const index = buildIndex();
const { errors, warnings } = detect(index);

// Sérialisation stable (les entrées sont déjà dans l'ordre niveau→matière→sous-thème).
const serialized = JSON.stringify(index, null, 2) + '\n';

if (mode === 'write') {
    fs.writeFileSync(INDEX_PATH, serialized, 'utf8');
    console.log(`CONTENT_INDEX.json régénéré : ${index.totals.exercises} exercices, ${index.totals.lessons} leçons, ${index.totals.banks} banques.`);
    if (warnings.length) {
        console.log(`\n${warnings.length} avertissement(s) (doublons "mous", non bloquants) :`);
        warnings.forEach(w => console.log(`  ⚠ ${w}`));
    }
    if (errors.length) {
        console.log(`\nCONTENT_INDEX_ERRORS`);
        errors.forEach(e => console.log(`  ✗ ${e}`));
        process.exit(1);
    }
    process.exit(0);
}

// mode === 'check'
let stale = false;
if (!fs.existsSync(INDEX_PATH)) {
    stale = true;
    console.log('✗ CONTENT_INDEX.json absent — lancer `node scripts/build-content-index.js --write`.');
} else if (fs.readFileSync(INDEX_PATH, 'utf8') !== serialized) {
    stale = true;
    console.log('✗ CONTENT_INDEX.json périmé — relancer `node scripts/build-content-index.js --write`.');
}

if (warnings.length) {
    console.log(`${warnings.length} avertissement(s) (non bloquants) :`);
    warnings.forEach(w => console.log(`  ⚠ ${w}`));
}

if (errors.length || stale) {
    console.log('\nCONTENT_INDEX_CHECK_FAILED');
    errors.forEach(e => console.log(`  ✗ ${e}`));
    process.exit(1);
}

console.log(`CONTENT_INDEX_CHECK_OK — ${index.totals.exercises} exercices, ${index.totals.lessons} leçons, ${index.totals.banks} banques, ${warnings.length} avertissement(s).`);
process.exit(0);

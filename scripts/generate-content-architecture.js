#!/usr/bin/env node
// Régénère CONTENT_ARCHITECTURE.md depuis data/{cp,ce1,ce2,cm1,cm2}.json.
// Node pur, aucune dépendance — à relancer après toute vague de contenu :
//   node scripts/generate-content-architecture.js

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LEVELS = ['cp', 'ce1', 'ce2', 'cm1', 'cm2'];
const OUT = path.join(ROOT, 'CONTENT_ARCHITECTURE.md');

const today = new Date().toISOString().slice(0, 10);

let totalExercises = 0;
let totalLessons = 0;
const engineCounts = {};
const boardTypeCounts = {};
const gaps = [];
const sections = [];

function paramsSummary(ex) {
    const parts = [];
    const p = ex.params || {};
    if (p.type) parts.push(`type=${p.type}`);
    for (const [k, v] of Object.entries(p)) {
        if (k === 'type') continue;
        if (v === null || typeof v === 'object') continue;
        parts.push(`${k}=${v}`);
    }
    if (ex.isBonus) parts.push(`bonus (seuil=${ex.bonusThreshold ?? '?'})`);
    return parts;
}

for (const level of LEVELS) {
    const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', `${level}.json`), 'utf8'));
    const lines = [`## ${level.toUpperCase()}`, ''];
    for (const subject of data.subjects || []) {
        lines.push(`### ${subject.title} (${subject.id})`, '');
        for (const st of subject.subthemes || []) {
            const lessons = st.lessons || [];
            const exercises = st.exercises || [];
            lines.push(`#### ${st.title} \`(${st.id})\``, '');
            if (!lessons.length || !exercises.length) {
                gaps.push(`- ${level.toUpperCase()} / ${subject.title} / ${st.title} \`(${st.id})\` — ${lessons.length} leçon(s), ${exercises.length} exercice(s)`);
            }
            if (lessons.length) {
                lines.push(`- **Leçons** (${lessons.length}) :`);
                for (const lesson of lessons) {
                    totalLessons++;
                    const blocks = (lesson.blocks || []).map(b => b.type).join(', ');
                    lines.push(`  - ${lesson.title} \`(${lesson.id})\` — blocs: ${blocks}`);
                }
            } else {
                lines.push('- **Leçons** : _aucune_');
            }
            if (exercises.length) {
                lines.push(`- **Exercices** (${exercises.length}) :`);
                for (const ex of exercises) {
                    totalExercises++;
                    engineCounts[ex.engine] = (engineCounts[ex.engine] || 0) + 1;
                    if (ex.engine === 'board-interactive' && ex.params && ex.params.type) {
                        boardTypeCounts[ex.params.type] = (boardTypeCounts[ex.params.type] || 0) + 1;
                    }
                    const parts = paramsSummary(ex);
                    const suffix = parts.length ? `, ${parts.join(', ')}` : '';
                    lines.push(`  - ${ex.title} \`(${ex.id})\` — engine: \`${ex.engine}\`${suffix}`);
                }
            } else {
                lines.push('- **Exercices** : _aucun_');
            }
            lines.push('');
        }
    }
    sections.push(lines.join('\n'));
}

function countTable(counts, header) {
    const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return [`| ${header} | Nombre d'exercices |`, '|---|---|', ...rows.map(([k, v]) => `| \`${k}\` | ${v} |`)].join('\n');
}

const doc = `# Architecture des contenus pédagogiques

Document de référence listant, pour chaque niveau, chaque matière, chaque sous-thème : les leçons (J'apprends) et les exercices (Je m'entraîne) avec leur moteur et leurs paramètres.

Objectif : repérer rapidement les manques de contenu (sous-thèmes sans leçon, sans exercice, catégories peu fournies) pour prioriser les ajouts.

> Document généré automatiquement depuis \`data/cp.json\` à \`data/cm2.json\` le ${today} par \`scripts/generate-content-architecture.js\`. Ne pas éditer à la main : relancer le script après tout ajout de contenu.

---

## Vue d'ensemble

- **${totalExercises} exercices** et **${totalLessons} leçons** répartis sur 5 niveaux (CP à CM2).
- Moteurs utilisés :

${countTable(engineCounts, 'Moteur')}

- Types \`board-interactive\` utilisés :

${countTable(boardTypeCounts, 'Type board-interactive')}

---

## Synthèse des manques

Sous-thèmes sans leçon et/ou sans exercice (candidats prioritaires pour de futurs ajouts) :

${gaps.length ? gaps.join('\n') : '_Aucun sous-thème sans leçon ni sans exercice détecté._'}

---

${sections.join('\n---\n\n')}
`;

fs.writeFileSync(OUT, doc, 'utf8');
console.log(`CONTENT_ARCHITECTURE.md régénéré : ${totalExercises} exercices, ${totalLessons} leçons.`);
if (gaps.length) {
    console.log(`Attention : ${gaps.length} sous-thème(s) sans leçon et/ou sans exercice (voir Synthèse des manques).`);
}

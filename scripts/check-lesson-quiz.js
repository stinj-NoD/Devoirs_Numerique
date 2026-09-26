// Contrôle qualité des quiz d'ancrage des leçons (blocs `check`).
// Usage : node scripts/check-lesson-quiz.js
//
// Ce script ne remplace PAS scripts/validate-data.ps1 / js/validators.js, qui
// valident la STRUCTURE du bloc. Il valide ce qu'aucun schéma ne peut voir :
// la qualité pédagogique du quiz, telle que définie par les règles R1-R5 de
// docs/lesson-guidelines.md.
//
// La règle centrale (R1) : un quiz dont la réponse est recopiable depuis la
// prose de la leçon teste la relecture, pas la compréhension. Il déverrouille
// le CTA et crédite les pièces sans que l'enfant ait rien compris.
//
// Sortie : LESSON_QUIZ_OK / exit 1 (cohérent avec DATA_VALIDATION_OK).

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GRADES = ['cp', 'ce1', 'ce2', 'cm1', 'cm2'];

const errors = [];
const warnings = [];

// Normalisation pour la détection de fuite : on veut attraper « Une majuscule »
// dans « une phrase commence par une majuscule », donc on retire accents, casse
// et ponctuation, et on écrase les espaces.
function normalize(text) {
    return String(text == null ? '' : text)
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

// Texte visible d'un bloc de contenu, tous types confondus (le modèle de bloc
// est décrit dans technicalaspect.md §4).
function blockProse(block) {
    const parts = [];
    if (typeof block.text === 'string') parts.push(block.text);
    if (typeof block.content === 'string') parts.push(block.content);
    if (typeof block.label === 'string') parts.push(block.label);
    if (Array.isArray(block.items)) parts.push(block.items.join(' '));
    if (Array.isArray(block.rows)) {
        for (const row of block.rows) {
            parts.push(Array.isArray(row) ? row.join(' ') : String(row));
        }
    }
    if (Array.isArray(block.headers)) parts.push(block.headers.join(' '));
    return parts.join(' ');
}

const stats = new Map(); // `${grade}::${subjectId}` -> compteurs de couverture

function bump(key, field) {
    if (!stats.has(key)) stats.set(key, { lessons: 0, zero: 0, one: 0, two: 0, more: 0 });
    stats.get(key)[field]++;
}

for (const grade of GRADES) {
    const file = path.join(ROOT, 'data', `${grade}.json`);
    const data = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));

    for (const subject of data.subjects || []) {
        const key = `${grade}::${subject.id}`;
        if (!stats.has(key)) bump(key, 'lessons'), stats.get(key).lessons--;

        for (const subtheme of subject.subthemes || []) {
            for (const lesson of subtheme.lessons || []) {
                const blocks = Array.isArray(lesson.blocks) ? lesson.blocks : [];
                const checks = blocks.filter((b) => b && b.type === 'check');
                const prose = normalize(blocks.filter((b) => b && b.type !== 'check').map(blockProse).join(' '));
                const where = `${grade}/${lesson.id}`;

                bump(key, 'lessons');
                bump(key, checks.length === 0 ? 'zero' : checks.length === 1 ? 'one' : checks.length === 2 ? 'two' : 'more');

                checks.forEach((block, i) => {
                    const at = `${where} [check ${i + 1}]`;
                    const answer = String(block.answer == null ? '' : block.answer);
                    const choices = Array.isArray(block.choices) ? block.choices : [];

                    // --- Contrôle 1 (R1) : fuite de réponse dans la prose. ERREUR.
                    // Ne se déclenche que si la réponse est assez substantielle
                    // pour être recopiée : « 6 » apparaît partout, « une majuscule »
                    // non.
                    const normAnswer = normalize(answer);
                    if (normAnswer.split(' ').length >= 2 && normAnswer.length >= 8 && prose.includes(normAnswer)) {
                        errors.push(`${at} : FUITE — la réponse « ${answer} » est recopiable telle quelle depuis la prose de la leçon (R1). Le quiz teste la relecture, pas la compréhension.`);
                    }

                    // --- Contrôle 2 : exactitude answer/choices. ERREUR.
                    // Miroir du runtime (ui.js : value === block.answer). Attrape
                    // ce que les validateurs de structure laissent passer.
                    if (choices.length && !choices.includes(answer)) {
                        const insensitive = choices.find((c) => String(c).toLowerCase() === answer.toLowerCase());
                        errors.push(insensitive
                            ? `${at} : CASSE — answer « ${answer} » ne correspond à « ${insensitive} » qu'à la casse près. Le runtime compare en strict : aucun choix ne serait jamais correct, la leçon deviendrait une impasse.`
                            : `${at} : answer « ${answer} » ne figure pas dans choices.`);
                    }
                    // Doublons stricts uniquement : deux choix qui ne diffèrent
                    // que par la casse ou la ponctuation sont légitimes quand
                    // c'est précisément ce que la question teste (« Laquelle de
                    // ces phrases est bien écrite ? » oppose « Le chien court. »
                    // à « le chien court »).
                    const seen = new Set();
                    for (const choice of choices) {
                        const value = String(choice);
                        if (seen.has(value)) {
                            errors.push(`${at} : doublon de choix « ${choice} » — deux propositions strictement identiques.`);
                        }
                        seen.add(value);
                    }

                    // --- Contrôle 3 (R5) : explanation explicative. AVERTISSEMENT.
                    const explanation = typeof block.explanation === 'string' ? block.explanation.trim() : '';
                    if (!explanation) {
                        warnings.push(`${at} : pas d'explanation — l'enfant qui se trompe n'apprend rien (R5).`);
                    } else if (explanation.length < 15) {
                        warnings.push(`${at} : explanation trop courte (« ${explanation} ») — elle doit expliquer, pas féliciter (R5).`);
                    }

                    // --- Contrôle 4 (R4) : réponse déductible de sa longueur. AVERTISSEMENT.
                    // On compare à la DEUXIÈME plus longue, pas à la plus courte :
                    // c'est ce que fait l'œil. L'ancien seuil (max > min * 2) laissait
                    // passer 54 vrais indices — une réponse de 82 car. face à 45 et 49
                    // ne double pas le minimum mais saute aux yeux.
                    // Les réponses courtes par nature (« ph », « 14 », « 3 000 m ») sont
                    // exclues : leurs distracteurs ne sont pas rallongeables sans absurdité.
                    if (choices.length >= 2) {
                        const answerText = String(answer);
                        const others = choices.filter((c) => String(c) !== answerText).map((c) => String(c).length);
                        const secondLongest = others.length ? Math.max(...others) : 0;
                        const isProse = answerText.length > 20 && answerText.includes(' ');
                        if (secondLongest > 0 && isProse && answerText.length / secondLongest >= 1.35) {
                            warnings.push(`${at} : la bonne réponse est nettement la plus longue (${answerText.length} car. contre ${secondLongest}) — repérable sans comprendre (R4). Étoffer les distracteurs sans les rendre plus plausibles.`);
                        }
                    }
                });
            }
        }
    }
}

// --- Contrôle 5 : couverture. INFO — le tableau de bord des lots.
const rows = [...stats.entries()].map(([key, s]) => ({ key, ...s })).filter((r) => r.lessons > 0);
const totals = rows.reduce((a, r) => ({
    lessons: a.lessons + r.lessons, zero: a.zero + r.zero, two: a.two + r.two
}), { lessons: 0, zero: 0, two: 0 });

console.log('Couverture des quiz d\'ancrage (leçons — sans quiz / avec 2 checks)\n');
for (const r of rows.sort((a, b) => b.zero - a.zero || a.key.localeCompare(b.key))) {
    const flag = r.zero === 0 ? 'OK  ' : '    ';
    console.log(`${flag}${r.key.padEnd(34)} ${String(r.lessons).padStart(3)} leçons — ${String(r.zero).padStart(3)} sans quiz, ${String(r.two).padStart(3)} équipées`);
}
const done = totals.lessons - totals.zero;
const pct = totals.lessons ? ((done / totals.lessons) * 100).toFixed(1) : '0.0';
console.log(`\nTotal : ${done}/${totals.lessons} leçons équipées (${pct} %) — ${totals.zero} restantes.`);

if (warnings.length) {
    console.log(`\n--- AVERTISSEMENTS (${warnings.length}) ---`);
    for (const w of warnings) console.log(w);
}
if (errors.length) {
    console.log(`\n--- ERREURS (${errors.length}) ---`);
    for (const e of errors) console.log(e);
    console.log('\nÉCHEC : ' + errors.length + ' quiz à corriger.');
    process.exit(1);
}
console.log('\nLESSON_QUIZ_OK');

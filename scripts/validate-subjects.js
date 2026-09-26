// Valide la classification matière utilisée par les badges de maîtrise.
// Usage : node scripts/validate-subjects.js
//
// Invariant DUR (échec du script) : chaque nœud sujet des 5 fichiers de
// niveaux doit être reconnu par Storage.canonicalizeSubjectId — c'est cette
// valeur qui est stockée dans chaque record à la sauvegarde et qui alimente
// les badges de maîtrise.
//
// Information (pas d'échec) : couverture du fallback par parsing d'id
// (Storage._extractSubjectFromExerciseId), utilisé uniquement pour les
// records sauvegardés avant l'ajout du champ subject.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', 'storage.js'), 'utf8'), sandbox);
const Storage = sandbox.window.Storage;
if (!Storage || typeof Storage.canonicalizeSubjectId !== 'function') {
    console.error('Impossible de charger Storage depuis js/storage.js');
    process.exit(2);
}

const grades = ['cp', 'ce1', 'ce2', 'cm1', 'cm2'];
const hardFailures = [];
let checked = 0;
let fallbackOk = 0;
let fallbackMiss = 0;

for (const grade of grades) {
    const raw = fs.readFileSync(path.join(ROOT, 'data', `${grade}.json`), 'utf8').replace(/^﻿/, '');
    const data = JSON.parse(raw);
    for (const subject of data.subjects || []) {
        const canonical = Storage.canonicalizeSubjectId(subject.id);
        if (!canonical) {
            hardFailures.push(`${grade}: sujet '${subject.id}' non reconnu par canonicalizeSubjectId — les records de ses exercices n'auront pas de matière.`);
            continue;
        }
        for (const subtheme of subject.subthemes || []) {
            for (const ex of subtheme.exercises || []) {
                checked++;
                if (Storage._extractSubjectFromExerciseId(ex.id) === canonical) fallbackOk++;
                else fallbackMiss++;
            }
        }
    }
}

console.log(`Sujets vérifiés sur ${grades.length} niveaux — exercices parcourus : ${checked}`);
console.log(`Fallback legacy (info) : ${fallbackOk}/${checked} ids correctement classés sans le champ subject.`);

if (hardFailures.length) {
    console.log('\n--- ÉCHECS ---');
    for (const f of hardFailures) console.log(f);
    process.exit(1);
}
console.log('OK — toutes les matières des fichiers de niveaux sont canonicalisables.');

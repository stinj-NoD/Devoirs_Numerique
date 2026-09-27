/*
 * check-audit-freshness.js — signale les audits de couverture devenus périmés.
 *
 * Un audit (`docs/curriculum-audit-<niveau>.md`) est une photo du contenu à un
 * instant donné. Chaque vague de contenu l'éloigne de la réalité, en silence :
 * rien dans la chaîne de validation ne le dit. Le prix se paie plus tard, quand
 * un agent de production lit un audit qui annonce comme manquant quelque chose
 * qui existe — et produit un doublon.
 *
 * Ce script compare l'inventaire que chaque audit ANNONCE (il écrit son propre
 * décompte de leçons et d'exercices) à l'inventaire RÉEL de `CONTENT_INDEX.json`.
 * Il ne juge pas le contenu de l'audit, seulement sa fraîcheur.
 *
 *   node scripts/check-audit-freshness.js
 *
 * Sort en code 1 si au moins un audit dépasse le seuil de dérive, 0 sinon.
 * Seuil réglable : SEUIL_ENTREES (défaut 10 entrées d'écart cumulé).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const NIVEAUX = ['cp', 'ce1', 'ce2', 'cm1', 'cm2'];
const SEUIL_ENTREES = Number(process.env.SEUIL_ENTREES || 10);

function inventaireReel(index) {
    const parNiveau = {};
    for (const niveau of NIVEAUX) parNiveau[niveau] = { lessons: 0, exercises: 0 };
    for (const entry of index.entries || []) {
        const cible = parNiveau[entry.level];
        if (!cible) continue;
        if (entry.kind === 'lesson') cible.lessons++;
        else if (entry.kind === 'exercise') cible.exercises++;
    }
    return parNiveau;
}

// L'audit écrit son propre décompte en prose, du type « 83 leçons, 206
// exercices ». Prendre la PREMIÈRE occurrence du fichier est un piège vécu :
// un audit qui rappelle l'ancien décompte avant d'annoncer le nouveau était
// lu comme périmé alors qu'il venait d'être régénéré. On cherche donc
// d'abord le décompte porté par le bloc de relecture (la ligne datée et les
// quelques lignes qui la suivent), et on ne retombe sur la première
// occurrence qu'à défaut.
function chercherPaire(fragment) {
    const direct = fragment.match(/(\d+)\s*le[çc]ons?[^0-9]{0,15}?(\d+)\s*exercices?/i);
    if (direct) return { lessons: Number(direct[1]), exercises: Number(direct[2]) };
    const inverse = fragment.match(/(\d+)\s*exercices?[^0-9]{0,15}?(\d+)\s*le[çc]ons?/i);
    if (inverse) return { lessons: Number(inverse[2]), exercises: Number(inverse[1]) };
    return null;
}

function inventaireAnnonce(texte) {
    const lignes = texte.split(/\r?\n/);
    const iRelecture = lignes.findIndex(
        (l) => /(relu|régénéré|regenere|mis à jour|mise à jour)/i.test(l) && /20\d{2}-\d{2}-\d{2}/.test(l)
    );
    if (iRelecture >= 0) {
        const bloc = lignes.slice(iRelecture, iRelecture + 4).join(' ');
        const paire = chercherPaire(bloc);
        if (paire) return paire;
    }
    return chercherPaire(texte);
}

// La date à afficher est celle de la RELECTURE de l'audit, pas la première du
// fichier : l'en-tête cite des dates de textes officiels et de référentiel qui
// n'ont rien à voir avec la fraîcheur du diagnostic.
function dateAudit(texte) {
    const ligne = texte.split(/\r?\n/)
        .find((l) => /(relu|régénéré|regenere|mis à jour|mise à jour)/i.test(l) && /20\d{2}-\d{2}-\d{2}/.test(l));
    if (ligne) return ligne.match(/20\d{2}-\d{2}-\d{2}/)[0];
    const m = texte.match(/20\d{2}-\d{2}-\d{2}/);
    return m ? m[0] + ' (date incertaine)' : '(non datée)';
}

function main() {
    const indexPath = path.join(ROOT, 'CONTENT_INDEX.json');
    if (!fs.existsSync(indexPath)) {
        console.error('CONTENT_INDEX.json introuvable — lancer `node scripts/build-content-index.js --write`.');
        process.exit(2);
    }
    const reel = inventaireReel(JSON.parse(fs.readFileSync(indexPath, 'utf8').replace(/^﻿/, '')));

    const perimes = [];
    const illisibles = [];

    for (const niveau of NIVEAUX) {
        const p = path.join(ROOT, 'docs', `curriculum-audit-${niveau}.md`);
        if (!fs.existsSync(p)) {
            illisibles.push(`${niveau} : audit absent`);
            continue;
        }
        const texte = fs.readFileSync(p, 'utf8');
        const annonce = inventaireAnnonce(texte);
        const actuel = reel[niveau];

        if (!annonce) {
            illisibles.push(`${niveau} : l'audit n'annonce pas son inventaire, fraîcheur invérifiable`);
            continue;
        }

        const dLessons = actuel.lessons - annonce.lessons;
        const dExercises = actuel.exercises - annonce.exercises;
        const derive = Math.abs(dLessons) + Math.abs(dExercises);
        const etat = derive > SEUIL_ENTREES ? 'PÉRIMÉ ' : 'à jour ';

        console.log(`${etat}${niveau.toUpperCase().padEnd(4)}`
            + `| audit du ${dateAudit(texte)} : ${annonce.lessons} leçons / ${annonce.exercises} exercices`.padEnd(56)
            + `| réel : ${actuel.lessons} / ${actuel.exercises}`.padEnd(22)
            + `| dérive : ${dLessons >= 0 ? '+' : ''}${dLessons} leçons, ${dExercises >= 0 ? '+' : ''}${dExercises} exercices`);

        if (derive > SEUIL_ENTREES) perimes.push(niveau);
    }

    console.log('');
    illisibles.forEach((m) => console.log('⚠ ' + m));

    if (perimes.length) {
        console.log(`\n${perimes.length} audit(s) périmé(s) au-delà de ${SEUIL_ENTREES} entrées d'écart : ${perimes.join(', ')}.`);
        console.log('Les rafraîchir (agent curriculum-auditor) AVANT toute vague de contenu sur ces niveaux :');
        console.log('un audit périmé fait produire des doublons, en annonçant comme manquant ce qui existe déjà.');
        console.log('AUDIT_FRESHNESS_STALE');
        process.exit(1);
    }

    console.log('AUDIT_FRESHNESS_OK — les 5 audits sont alignés sur le contenu réel.');
    process.exit(0);
}

main();

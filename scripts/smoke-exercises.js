/*
 * smoke-exercises.js — filet anti-régression sur la totalité du contenu.
 *
 * Démarre CHAQUE exercice des 5 niveaux dans un vrai navigateur, génère
 * plusieurs questions par exercice, et signale tout ce qui rend un exercice
 * injouable : sortie en `failSafeExit`, problème rejeté par les validateurs
 * runtime, réponse vide, ou bonne réponse absente de ses propres choix.
 *
 * Pourquoi un navigateur : les validateurs hors-runtime
 * (`scripts/validate-data.ps1`, `build-content-index.js`) vérifient la FORME
 * des données. Ils ne peuvent pas voir qu'un moteur, sur un tirage donné,
 * produit une question sans réponse ou un QCM dont la bonne réponse n'est pas
 * proposée — ça ne se voit qu'en exécutant réellement le moteur.
 *
 * Playwright n'est PAS une dépendance du projet et ne doit pas le devenir
 * (aucun package.json, aucun gestionnaire de paquets). Il est emprunté au
 * cache npx, comme le fait déjà la compétence `verify` :
 *
 *   export NODE_PATH="C:/Users/fayne/AppData/Local/npm-cache/_npx/48b1ca104c3549f4/node_modules"
 *   node scripts/smoke-exercises.js
 *
 * Si ce chemin a changé :
 *   for d in ~/AppData/Local/npm-cache/_npx/*\/node_modules/; do [ -d "$d/playwright" ] && echo "$d"; done
 *
 * Sort en code 1 si au moins un exercice est en échec ou si une erreur JS de
 * page est apparue, 0 sinon.
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = Number(process.env.SMOKE_PORT || 8899);
const LEVELS = ['cp', 'ce1', 'ce2', 'cm1', 'cm2'];
const MIME = {
    '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
    '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp',
    '.png': 'image/png', '.ico': 'image/x-icon'
};

function startServer() {
    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            const url = decodeURIComponent(req.url.split('?')[0]);
            const file = path.join(ROOT, url === '/' ? 'index.html' : url);
            // Pas de traversée hors du dépôt.
            if (!file.startsWith(ROOT)) { res.writeHead(403); res.end('403'); return; }
            fs.readFile(file, (err, data) => {
                if (err) { res.writeHead(404); res.end('404'); return; }
                res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
                res.end(data);
            });
        });
        server.on('error', reject);
        server.listen(PORT, () => resolve(server));
    });
}

// Exécuté DANS la page : parcourt un niveau entier.
async function smokeLevel(gradeId) {
    const idx = await App.fetchJson('data/index.json');
    const grade = idx.grades.find((g) => g.id === gradeId);
    await App.loadGrade(grade);

    const failures = [];
    let count = 0;

    // On neutralise la sortie de secours le temps du test : elle ramène
    // normalement l'enfant au menu, ici on veut juste enregistrer le motif.
    const originalFailSafe = App.failSafeExit.bind(App);
    let lastFailSafe = null;
    App.failSafeExit = (message) => { lastFailSafe = message; };

    const clean = (value) => String(value == null ? '' : value)
        .toLowerCase().trim().replace(/[’‘]/g, "'");

    try {
        for (const subject of App.state.currentGrade.subjects || []) {
            for (const theme of (subject.subthemes || [])) {
                for (const exercise of (theme.exercises || [])) {
                    count++;
                    App.state.currentSubject = subject;
                    App.state.currentTheme = theme;
                    lastFailSafe = null;

                    try {
                        await App.startExercise(exercise);
                    } catch (error) {
                        failures.push({ id: exercise.id, motif: 'exception au démarrage : ' + error.message });
                        continue;
                    }
                    if (lastFailSafe) {
                        failures.push({ id: exercise.id, motif: 'failSafeExit : ' + lastFailSafe });
                        continue;
                    }

                    let bad = null;
                    for (let draw = 0; draw < 4 && !bad; draw++) {
                        const problem = App.state.problemData;
                        if (!problem) { bad = 'aucun problème généré'; break; }

                        // Une réponse vide est légitime sur tap-features quand la
                        // figure n'a aucun élément à toucher — l'énoncé doit alors
                        // dire explicitement qu'on valide sans rien toucher.
                        const tapSansCible = problem.data
                            && problem.data.boardKind === 'tap-features'
                            && problem.data.expectedSelections === 0;
                        if (problem.answer === undefined || problem.answer === null
                            || (String(problem.answer) === '' && !tapSansCible)) {
                            bad = 'réponse vide';
                        }
                        if (!bad && tapSansCible && !/aucun|ne touche/i.test(String(problem.question || ''))) {
                            bad = 'tap-features sans cible, mais l\u2019énoncé ne dit pas quoi faire';
                        }

                        const check = window.Validators && window.Validators.validateProblem
                            ? window.Validators.validateProblem(problem) : { valid: true };
                        if (!bad && check && !check.valid) bad = 'problème invalide : ' + check.reason;

                        if (!bad && (problem.inputType === 'qcm' || (problem.data && Array.isArray(problem.data.choices)))) {
                            const choices = (problem.data && problem.data.choices) || [];
                            // Même normalisation que App.validateAnswer : la
                            // comparaison réelle ignore la casse.
                            if (choices.length && !choices.map(clean).includes(clean(problem.answer))) {
                                bad = 'answer absente de choices';
                            }
                        }

                        if (!bad) {
                            App.state.currentQuestion = 0;
                            lastFailSafe = null;
                            App.generateNextQuestion();
                            if (lastFailSafe) bad = 'failSafeExit au tirage ' + (draw + 2) + ' : ' + lastFailSafe;
                        }
                    }
                    if (bad) failures.push({ id: exercise.id, motif: bad });
                }
            }
        }
    } finally {
        App.failSafeExit = originalFailSafe;
    }

    return { count, failures };
}

(async () => {
    let chromium;
    try {
        ({ chromium } = require('playwright'));
    } catch (error) {
        console.error('Playwright introuvable. Renseigne NODE_PATH vers le cache npx — voir l\u2019en-tête de ce fichier.');
        process.exit(2);
    }

    const server = await startServer();
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 900, height: 1000 } });

    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(String(error.message)));

    await page.goto(`http://127.0.0.1:${PORT}/index.html`);
    await page.waitForFunction(() => typeof App !== 'undefined' && typeof Storage !== 'undefined');
    // bootstrap.js désenregistre le service worker en dev et force un reload :
    // on laisse ce cycle se terminer avant de piloter l'app.
    await page.waitForTimeout(2000);
    await page.evaluate(() => { Storage.addProfile('SmokeTest'); Storage.setCurrentUser('SmokeTest'); });

    const allFailures = [];
    let total = 0;

    for (const level of LEVELS) {
        const result = await page.evaluate(smokeLevel, level);
        total += result.count;
        result.failures.forEach((f) => allFailures.push(`${level} | ${f.id} | ${f.motif}`));
        console.log(`${level.toUpperCase().padEnd(4)} : ${result.count} exercices, ${result.failures.length} en échec`);
    }

    console.log(`\nTOTAL : ${total} exercices testés, ${allFailures.length} en échec`);
    if (allFailures.length) console.log(allFailures.join('\n'));

    const realErrors = pageErrors.filter((m) => !/favicon|manifest/i.test(m));
    console.log('Erreurs JS de page : ' + (realErrors.length ? '\n - ' + realErrors.join('\n - ') : 'aucune'));

    await browser.close();
    server.close();

    const ok = allFailures.length === 0 && realErrors.length === 0;
    console.log(ok ? 'SMOKE_EXERCISES_OK' : 'SMOKE_EXERCISES_FAILED');
    process.exit(ok ? 0 : 1);
})();

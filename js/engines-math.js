const EnginesMath = {
    calculate(p) {
        const { rnd, pick, shuffle } = Engines.utils;
        let a, b, total;
        switch (p.type) {
            case 'add-simple':
                total = rnd(p.min || 2, p.maxSum || 10);
                a = rnd(1, total - 1);
                return { question: `${a} + ${total - a} = ?`, answer: total, explanation: `${a} + ${total - a} = ${total}` };
            case 'add-trou':
                total = rnd(p.min || 10, p.max || 20);
                a = rnd(1, total - 1);
                return { question: `${a} + ? = ${total}`, answer: total - a, explanation: `${a} + ${total - a} = ${total}, donc il manque ${total - a}.` };
            case 'sub-simple':
                a = rnd(p.min || 5, p.max || 20);
                b = rnd(0, a);
                return { question: `${a} - ${b} = ?`, answer: a - b, explanation: `${a} - ${b} = ${a - b}` };
            case 'mult':
                a = p.table === 'mix' ? rnd(2, 12) : (p.table || 2);
                b = rnd(0, 10);
                return { question: `${a} × ${b} = ?`, answer: a * b, explanation: `${a} × ${b} = ${a * b}` };
            case 'complement': {
                const target = p.target || 100;
                const cur = rnd(1, target - 1);
                return { question: `${cur} + ? = ${target}`, answer: target - cur, explanation: `${cur} + ${target - cur} = ${target}, donc il manque ${target - cur}.` };
            }
            case 'decimal-place': {
                const trapMode = p.trap === true;
                const intPart = trapMode ? Engines.utils.rnd(123, 987) : Engines.utils.rnd(0, 99);
                const decPart = Engines.utils.rnd(11, 99);
                const numberStr = `${intPart},${decPart}`;
                const targets = [
                    { label: "chiffre des <b style='color:#e91e63'>dixièmes</b>", textLabel: "chiffre des dixièmes", ans: Math.floor(decPart / 10) },
                    { label: "chiffre des <b style='color:#e91e63'>centièmes</b>", textLabel: "chiffre des centièmes", ans: decPart % 10 }
                ];
                if (trapMode) {
                    targets.push(
                        { label: "chiffre des <b>dizaines</b>", textLabel: "chiffre des dizaines", ans: Math.floor(intPart / 10) % 10 },
                        { label: "chiffre des <b>centaines</b>", textLabel: "chiffre des centaines", ans: Math.floor(intPart / 100) % 10 }
                    );
                }
                const t = Engines.utils.pick(targets);
                return {
                    question: `<div style="font-size:3rem; font-weight:bold; letter-spacing:2px;">${numberStr}</div><div class="small-question" style="margin-top:10px;">Quel est le ${t.label} ?</div>`,
                    answer: t.ans,
                    inputType: 'numeric',
                    explanation: `Dans ${numberStr}, le ${t.textLabel} est ${t.ans}.`
                };
            }
            case 'dictée-nombres': {
                const nBig = rnd(1000, p.max || 1000000);
                return { question: `<span class="small-question">Écris en chiffres :<br><b>${numberToFrench(nBig)}</b></span>`, answer: nBig, explanation: `${numberToFrench(nBig)} s'écrit ${nBig}.` };
            }
            case 'calc-mental':
                if (p.operator === "/") {
                    const ops = p.operands?.length ? p.operands : [2, 5, 10];
                    const diviseur = pick(ops);
                    const ans = rnd(5, 50);
                    return { question: `${ans * diviseur} : ${diviseur} = ?`, answer: ans, explanation: `${ans * diviseur} : ${diviseur} = ${ans}` };
                }
                a = rnd(p.range?.[0] || 2, p.range?.[1] || 10);
                b = rnd(2, 10);
                return { question: `${a} × ${b} = ?`, answer: a * b, explanation: `${a} × ${b} = ${a * b}` };
            case 'oiseau-math': {
                a = rnd(p.min || 1, p.max || 10);
                b = rnd(p.min || 1, p.max || 10);
                const res = a + b;
                return { isVisual: true, visualType: 'bird', inputType: 'qcm', data: { question: `${a} + ${b}`, choices: shuffle([res, res + 1, res - 1]), duration: p.vitesse || 8 }, answer: res, explanation: `${a} + ${b} = ${res}` };
            }
            case 'cibles': {
                const zones = p.zones?.length ? p.zones : [10, 50, 100];
                const touches = [];
                for (let i = 0; i < (p.nbFleches || 3); i++) {
                    const val = pick(zones);
                    touches.push({ val, angle: (i * (360 / (p.nbFleches || 3)) + rnd(0, 20)) * (Math.PI / 180) });
                }
                const totalScore = touches.reduce((acc, item) => acc + item.val, 0);
                return { isVisual: true, visualType: p.skin === 'money' ? 'money' : 'target', data: { zonesDefinitions: zones, hits: touches }, answer: totalScore, explanation: `${touches.map(t => t.val).join(' + ')} = ${totalScore}` };
            }
            case 'half': {
                // min/max bornent la MOITIÉ demandée (ex: min 5, max 25 → moitié de 10 à 50)
                const pair = rnd(p.min || 10, p.max || 100) * 2;
                return { question: `Moitié de ${pair} ?`, answer: pair / 2, explanation: `La moitié de ${pair} est ${pair / 2}, car ${pair / 2} + ${pair / 2} = ${pair}.` };
            }
            case 'double': {
                const base = rnd(p.min || 5, p.max || 50);
                return { question: `Double de ${base} ?`, answer: base * 2, explanation: `Le double de ${base} est ${base * 2}, car ${base} + ${base} = ${base * 2}.` };
            }
            case 'division-simple':
                b = rnd(2, 9);
                total = rnd(2, 10);
                a = b * total;
                return { question: `${a} : ${b} = ?`, answer: total, explanation: `${a} : ${b} = ${total}, car ${b} × ${total} = ${a}.` };
            case 'division-reste': {
                const diviseur = rnd(3, 9);
                const quotient = rnd(2, 9);
                const reste = rnd(1, diviseur - 1);
                const dividende = (diviseur * quotient) + reste;
                return { question: `<span class="small-question">Dans <b>${dividende}</b>,<br>combien de fois <b>${diviseur}</b> ?</span>`, answer: quotient, explanation: `${diviseur} × ${quotient} = ${dividende - reste}, et il reste ${reste} (${dividende} - ${dividende - reste} = ${reste}).` };
            }
            case 'proportionnalite': {
                const contexts = p.contexts || [
                    { item: 'pommes', unit: '€', label: 'pommes' },
                    { item: 'œufs', unit: '€', label: 'œufs' },
                    { item: 'bonbons', unit: '€', label: 'bonbons' },
                    { item: 'litres de jus', unit: '€', label: 'litres' }
                ];
                const ctx = pick(contexts);
                const coef = rnd(2, p.maxCoef || 5);
                const baseQty = rnd(1, p.maxBase || 6);
                const basePrix = rnd(1, p.maxBase || 6);
                const qty2 = baseQty * coef;
                const prix2 = basePrix * coef;
                const askPrix = Math.random() > 0.5;
                const question = askPrix
                    ? `Pour ${baseQty} ${ctx.label}, c'est ${basePrix} ${ctx.unit}.<br>Pour ${qty2} ${ctx.label}, combien de ${ctx.unit} ?`
                    : `${basePrix} ${ctx.unit} pour ${baseQty} ${ctx.label}.<br>${prix2} ${ctx.unit} pour combien de ${ctx.label} ?`;
                const propExplanation = askPrix
                    ? `${qty2} ${ctx.label}, c'est ${coef} fois plus que ${baseQty} : ${basePrix} × ${coef} = ${prix2} ${ctx.unit}.`
                    : `${prix2} ${ctx.unit}, c'est ${coef} fois plus que ${basePrix} : ${baseQty} × ${coef} = ${qty2} ${ctx.label}.`;
                return { question: `<span class="small-question">${question}</span>`, answer: askPrix ? prix2 : qty2, inputType: 'numeric', explanation: propExplanation };
            }
            case 'pourcentage': {
                const pourcentages = p.values || [10, 20, 25, 50];
                const pct = pick(pourcentages);
                const steps = [4, 5, 10, 20];
                const step = steps.find(s => (100 / pct) % 1 === 0 && s % (100 / pct) === 0) || (100 / pct);
                const base = rnd(1, p.maxMultiple || 10) * step;
                const result = (base * pct) / 100;
                return { question: `<span class="small-question">${pct} % de ${base} = ?</span>`, answer: result, inputType: 'numeric', explanation: `${pct} % de ${base} = (${base} × ${pct}) ÷ 100 = ${result}.` };
            }
            case 'aire-rectangle': {
                const longueur = rnd(2, p.max || 12);
                const largeur = rnd(2, p.max || 12);
                return { question: `<span class="small-question">Un rectangle mesure ${longueur} cm de longueur et ${largeur} cm de largeur.<br>Quelle est son aire (en cm²) ?</span>`, answer: longueur * largeur, inputType: 'numeric', explanation: `L'aire d'un rectangle = longueur × largeur = ${longueur} × ${largeur} = ${longueur * largeur} cm².` };
            }
            case 'volume-pave': {
                const longueur = rnd(2, p.max || 6);
                const largeur = rnd(2, p.max || 6);
                const hauteur = rnd(2, p.max || 6);
                return { question: `<span class="small-question">Un pavé droit mesure ${longueur} cm de longueur, ${largeur} cm de largeur et ${hauteur} cm de hauteur.<br>Quel est son volume (en cm³) ?</span>`, answer: longueur * largeur * hauteur, inputType: 'numeric', explanation: `Le volume d'un pavé droit = longueur × largeur × hauteur = ${longueur} × ${largeur} × ${hauteur} = ${longueur * largeur * hauteur} cm³.` };
            }
            case 'echelle': {
                const echelle = pick(p.echelles || [50, 100, 200, 1000]);
                const step = Math.max(1, Math.round(100 / echelle) || 1);
                const planCm = rnd(1, 9) * step;
                const reelM = (planCm * echelle) / 100;
                return { question: `<span class="small-question">Sur un plan à l'échelle 1/${echelle},<br>${planCm} cm représente combien de mètres dans la réalité ?</span>`, answer: reelM, inputType: 'numeric', explanation: `${planCm} cm × ${echelle} = ${planCm * echelle} cm dans la réalité, soit ${reelM} m.` };
            }
            case 'vitesse': {
                const vitesses = p.vitesses || [30, 40, 50, 60, 80, 90, 100];
                const vitesse = pick(vitesses);
                const heures = rnd(1, p.maxHeures || 4);
                const distance = vitesse * heures;
                const askDistance = Math.random() > 0.5;
                const question = askDistance
                    ? `Une voiture roule à ${vitesse} km/h pendant ${heures} h.<br>Quelle distance parcourt-elle (en km) ?`
                    : `Une voiture roule à ${vitesse} km/h et parcourt ${distance} km.<br>Combien de temps roule-t-elle (en h) ?`;
                const vitesseExplanation = askDistance
                    ? `distance = vitesse × temps = ${vitesse} × ${heures} = ${distance} km.`
                    : `temps = distance ÷ vitesse = ${distance} ÷ ${vitesse} = ${heures} h.`;
                return { question: `<span class="small-question">${question}</span>`, answer: askDistance ? distance : heures, inputType: 'numeric', explanation: vitesseExplanation };
            }
            case 'division-posed': {
                const level = p.level || 1;
                let d_divisor, d_dividend;
                if (level === 1) {
                    d_divisor = rnd(3, 9);
                    d_dividend = rnd(50, 900);
                } else if (level === 2) {
                    d_divisor = rnd(12, 25);
                    d_dividend = rnd(200, 2000);
                } else {
                    d_divisor = rnd(15, 99);
                    d_dividend = rnd(500, 9999);
                }
                const d_q = Math.floor(d_dividend / d_divisor);
                const d_r = d_dividend % d_divisor;
                const askRemainder = p.ask === 'reste';
                const divExplanation = `${d_dividend} : ${d_divisor} : le quotient est ${d_q} (${d_divisor} × ${d_q} = ${d_divisor * d_q}) et il reste ${d_r}.`;
                return { question: askRemainder ? "Quel est le reste ?" : "Quel est le quotient ?", answer: askRemainder ? d_r : d_q, isVisual: true, visualType: 'division', inputType: 'numeric', data: { dividend: d_dividend, divisor: d_divisor, askRemainder }, explanation: divExplanation };
            }
            case 'bar-chart-read': {
                const themes = p.themes || [
                    { unit: 'fruits récoltés', labels: ['Pommes', 'Poires', 'Cerises', 'Prunes'] },
                    { unit: 'livres lus', labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'] },
                    { unit: 'buts marqués', labels: ['Équipe A', 'Équipe B', 'Équipe C', 'Équipe D'] },
                    { unit: 'élèves présents', labels: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'] }
                ];
                const theme = pick(themes);
                const barCount = Math.max(3, Math.min(theme.labels.length, p.maxBars || theme.labels.length));
                const labels = shuffle(theme.labels).slice(0, barCount);
                // maxVal doit pouvoir fournir au moins barCount valeurs
                // distinctes dans [1, maxVal], sinon on l'élève au minimum
                // nécessaire (évite tout risque de génération bloquante).
                const maxVal = Math.max(p.maxValue || 20, barCount);

                // Valeurs distinctes piochées par mélange (pas de boucle de
                // retirage) pour qu'un maximum/minimum soit toujours sans
                // ambiguïté : deux barres égales rendraient "la plus grande ?"
                // sans réponse unique.
                const values = shuffle(Array.from({ length: maxVal }, (_, i) => i + 1)).slice(0, barCount);

                const bars = labels.map((label, i) => ({ label, value: values[i] }));
                const total = values.reduce((a, b) => a + b, 0);
                const maxBar = bars.reduce((best, b) => (b.value > best.value ? b : best), bars[0]);
                const minBar = bars.reduce((best, b) => (b.value < best.value ? b : best), bars[0]);

                const questionKinds = p.questionKinds || ['max', 'min', 'value', 'total', 'difference'];
                const kind = pick(questionKinds);

                let question, answer, choices, explanation;
                if (kind === 'max') {
                    question = `Quelle barre a le plus de ${theme.unit} ?`;
                    answer = maxBar.label;
                    choices = shuffle([maxBar.label, ...shuffle(bars.filter(b => b !== maxBar)).slice(0, 2).map(b => b.label)]);
                    explanation = `${maxBar.label} a la plus grande valeur : ${maxBar.value}.`;
                } else if (kind === 'min') {
                    question = `Quelle barre a le moins de ${theme.unit} ?`;
                    answer = minBar.label;
                    choices = shuffle([minBar.label, ...shuffle(bars.filter(b => b !== minBar)).slice(0, 2).map(b => b.label)]);
                    explanation = `${minBar.label} a la plus petite valeur : ${minBar.value}.`;
                } else if (kind === 'value') {
                    const target = pick(bars);
                    question = `Combien de ${theme.unit} pour « ${target.label} » ?`;
                    answer = target.value;
                    explanation = `La barre « ${target.label} » indique ${target.value}.`;
                } else if (kind === 'total') {
                    question = `Quel est le total de ${theme.unit} ?`;
                    answer = total;
                    explanation = `${values.join(' + ')} = ${total}.`;
                } else {
                    question = `Quelle est la différence entre « ${maxBar.label} » et « ${minBar.label} » ?`;
                    answer = maxBar.value - minBar.value;
                    explanation = `${maxBar.value} - ${minBar.value} = ${maxBar.value - minBar.value}.`;
                }

                const isNumeric = typeof answer === 'number';
                return {
                    question: SecurityUtils.escapeHtml(question),
                    answer: answer.toString(),
                    inputType: isNumeric ? 'numeric' : 'qcm',
                    isVisual: true,
                    visualType: 'barChart',
                    data: { bars, unit: theme.unit, choices: isNumeric ? undefined : choices },
                    explanation
                };
            }
            case 'data-table-read': {
                const themes = p.themes || [
                    { unit: 'fruits vendus', rowLabels: ['Pommes', 'Poires', 'Bananes', 'Oranges'], colLabels: ['Lundi', 'Mardi', 'Mercredi'] },
                    { unit: 'livres empruntés', rowLabels: ['CE2', 'CM1', 'CM2'], colLabels: ['Janvier', 'Février', 'Mars'] },
                    { unit: 'points marqués', rowLabels: ['Équipe A', 'Équipe B', 'Équipe C'], colLabels: ['Match 1', 'Match 2'] },
                    { unit: 'entrées au musée', rowLabels: ['Enfants', 'Adultes', 'Seniors', 'Groupes'], colLabels: ['Samedi', 'Dimanche'] }
                ];
                const theme = pick(themes);
                const rowCount = Math.max(3, Math.min(theme.rowLabels.length, p.maxRows || theme.rowLabels.length));
                const colCount = Math.max(2, Math.min(theme.colLabels.length, p.maxCols || theme.colLabels.length));
                const rowLabels = shuffle(theme.rowLabels).slice(0, rowCount);
                const colLabels = shuffle(theme.colLabels).slice(0, colCount);
                const maxCell = p.maxValue || 20;

                // Grille de valeurs (avec répétitions possibles d'une cellule à
                // l'autre : contrairement au diagramme en barres, ici on compare
                // des cellules identifiées par (ligne, colonne), donc deux
                // cellules égales ne créent pas d'ambiguïté de question).
                const grid = rowLabels.map(() => colLabels.map(() => rnd(1, maxCell)));

                const rowTotals = grid.map((row) => row.reduce((a, b) => a + b, 0));
                const colTotals = colLabels.map((_, c) => grid.reduce((sum, row) => sum + row[c], 0));

                const questionKinds = p.questionKinds || ['cell', 'row-total', 'col-total', 'compare'];
                const kind = pick(questionKinds);

                let question, answer, explanation;
                if (kind === 'cell') {
                    const r = rnd(0, rowCount - 1);
                    const c = rnd(0, colCount - 1);
                    question = `Dans le tableau, combien de ${theme.unit} pour « ${rowLabels[r]} » à « ${colLabels[c]} » ?`;
                    answer = grid[r][c];
                    explanation = `La case « ${rowLabels[r]} » / « ${colLabels[c]} » indique ${grid[r][c]}.`;
                } else if (kind === 'row-total') {
                    const r = rnd(0, rowCount - 1);
                    question = `Quel est le total de la ligne « ${rowLabels[r]} » ?`;
                    answer = rowTotals[r];
                    explanation = `${grid[r].join(' + ')} = ${rowTotals[r]}.`;
                } else if (kind === 'col-total') {
                    const c = rnd(0, colCount - 1);
                    question = `Quel est le total de la colonne « ${colLabels[c]} » ?`;
                    answer = colTotals[c];
                    explanation = `${grid.map((row) => row[c]).join(' + ')} = ${colTotals[c]}.`;
                } else {
                    const r1 = rnd(0, rowCount - 1);
                    let r2 = rnd(0, rowCount - 1);
                    if (r2 === r1) r2 = (r1 + 1) % rowCount;
                    const c = rnd(0, colCount - 1);
                    const v1 = grid[r1][c];
                    const v2 = grid[r2][c];
                    if (v1 === v2) {
                        // Repli déterministe sur une question de cellule pour
                        // éviter une comparaison sans réponse unique.
                        question = `Dans le tableau, combien de ${theme.unit} pour « ${rowLabels[r1]} » à « ${colLabels[c]} » ?`;
                        answer = v1;
                        explanation = `La case « ${rowLabels[r1]} » / « ${colLabels[c]} » indique ${v1}.`;
                    } else {
                        const winner = v1 > v2 ? rowLabels[r1] : rowLabels[r2];
                        question = `Pour « ${colLabels[c]} », qui a le plus de ${theme.unit} : « ${rowLabels[r1]} » ou « ${rowLabels[r2]} » ?`;
                        answer = winner;
                        explanation = `« ${rowLabels[r1]} » = ${v1}, « ${rowLabels[r2]} » = ${v2}, donc « ${winner} » a le plus.`;
                    }
                }

                const isNumeric = typeof answer === 'number';
                const choices = isNumeric ? undefined : shuffle([answer, ...rowLabels.filter((l) => l !== answer)].slice(0, Math.min(3, rowLabels.length)));
                return {
                    question: SecurityUtils.escapeHtml(question),
                    answer: answer.toString(),
                    inputType: isNumeric ? 'numeric' : 'qcm',
                    isVisual: true,
                    visualType: 'dataTable',
                    data: { rowLabels, colLabels, grid, unit: theme.unit, choices },
                    explanation
                };
            }
            case 'pie-chart-read': {
                const themes = p.themes || [
                    { unit: 'des dépenses du mois', labels: ['Loisirs', 'Nourriture', 'Transport', 'Épargne'] },
                    { unit: 'des élèves de la classe', labels: ['Vélo', 'Bus', 'À pied', 'Voiture'] },
                    { unit: 'des fruits du panier', labels: ['Pommes', 'Bananes', 'Oranges', 'Raisins'] },
                    { unit: 'du temps libre', labels: ['Sport', 'Lecture', 'Jeux', 'Musique'] }
                ];
                const theme = pick(themes);
                // Proportions rondes et lisibles à l'œil (pas de calcul d'angle
                // exact attendu) : jeux de parts qui totalisent toujours 100.
                const partSets = p.partSets || [
                    [{ frac: 'la moitié', pct: 50 }, { frac: 'un quart', pct: 25 }, { frac: 'un quart', pct: 25 }],
                    [{ frac: 'trois quarts', pct: 75 }, { frac: 'un quart', pct: 25 }],
                    [{ frac: 'la moitié', pct: 50 }, { frac: 'un tiers', pct: 33 }, { frac: 'un sixième', pct: 17 }],
                    [{ frac: 'un quart', pct: 25 }, { frac: 'un quart', pct: 25 }, { frac: 'la moitié', pct: 50 }]
                ];
                const parts = pick(partSets);
                const labelCount = Math.min(theme.labels.length, parts.length);
                const labels = shuffle(theme.labels).slice(0, labelCount);
                const slices = parts.slice(0, labelCount).map((part, i) => ({ label: labels[i], pct: part.pct, frac: part.frac }));

                const maxSlice = slices.reduce((best, s) => (s.pct > best.pct ? s : best), slices[0]);
                const minSlice = slices.reduce((best, s) => (s.pct < best.pct ? s : best), slices[0]);
                const halfSlice = slices.find((s) => s.pct === 50);

                const questionKinds = p.questionKinds || (halfSlice ? ['max', 'min', 'half'] : ['max', 'min']);
                const kind = pick(questionKinds);

                let question, answer, explanation;
                if (kind === 'max') {
                    question = `Quelle est la plus grande part ${theme.unit} ?`;
                    answer = maxSlice.label;
                    explanation = `« ${maxSlice.label} » représente ${maxSlice.frac} (${maxSlice.pct} %), la plus grande part.`;
                } else if (kind === 'min') {
                    question = `Quelle est la plus petite part ${theme.unit} ?`;
                    answer = minSlice.label;
                    explanation = `« ${minSlice.label} » représente ${minSlice.frac} (${minSlice.pct} %), la plus petite part.`;
                } else {
                    question = `Quelle part représente la moitié ${theme.unit} ?`;
                    answer = halfSlice.label;
                    explanation = `« ${halfSlice.label} » représente la moitié (50 %) du total.`;
                }

                const choices = shuffle([answer, ...slices.filter((s) => s.label !== answer).map((s) => s.label)]);
                return {
                    question: SecurityUtils.escapeHtml(question),
                    answer: answer.toString(),
                    inputType: 'qcm',
                    isVisual: true,
                    visualType: 'pieChart',
                    data: { slices, unit: theme.unit, choices },
                    explanation
                };
            }
            case 'average-compute': {
                const seriesLength = p.length || rnd(4, 5);
                const perValueMax = p.maxValue || 20;
                // Tire seriesLength-1 valeurs libres puis dérive la dernière
                // pour que la somme totale soit un multiple exact de
                // seriesLength (moyenne entière garantie, sans décimaux).
                const values = [];
                for (let i = 0; i < seriesLength - 1; i++) values.push(rnd(1, perValueMax));
                const partialSum = values.reduce((a, b) => a + b, 0);
                const targetAverage = rnd(1, perValueMax);
                let lastValue = (targetAverage * seriesLength) - partialSum;
                // Rejette un tirage qui donnerait une dernière valeur hors bornes
                // raisonnables (négative ou disproportionnée) en la recalculant
                // depuis une moyenne cible dérivée directement de la série tirée.
                if (lastValue < 1 || lastValue > perValueMax * 2) {
                    const filler = rnd(1, perValueMax);
                    values.push(filler);
                    const total = values.reduce((a, b) => a + b, 0);
                    // Ajuste la dernière valeur ajoutée pour que le total soit un
                    // multiple de seriesLength, en restant positive.
                    const remainder = total % seriesLength;
                    if (remainder !== 0) {
                        values[values.length - 1] += (seriesLength - remainder);
                    }
                } else {
                    values.push(lastValue);
                }
                const sum = values.reduce((a, b) => a + b, 0);
                const average = sum / seriesLength;
                const contexts = p.contexts || [
                    'notes obtenues à des contrôles',
                    'buts marqués par match',
                    'kilomètres parcourus par jour',
                    'livres lus par mois'
                ];
                const context = pick(contexts);
                const question = `Voici une série de ${context} : ${values.join(', ')}.<br>Quelle est la moyenne de cette série ?`;
                const explanation = `${values.join(' + ')} = ${sum}. ${sum} ÷ ${seriesLength} = ${average}.`;
                return {
                    question: `<span class="small-question">${question}</span>`,
                    answer: average.toString(),
                    inputType: 'numeric',
                    isVisual: false,
                    data: { values, context },
                    explanation
                };
            }
            default:
                return { question: "Calcul inconnu", answer: 0 };
        }
    },
    numberSpelling(p) {
        const val = Engines.utils.rnd(p.min || 0, p.max || 10);
        const frenchValue = numberToFrench(val);
        const targetMode = p.forceMode || (Math.random() > 0.5 ? 'numeric' : 'alpha');
        if (targetMode === 'numeric') {
            let sizeClass = 'number-spelling-prompt--short';
            if (frenchValue.length > 55) sizeClass = 'number-spelling-prompt--huge';
            else if (frenchValue.length > 38) sizeClass = 'number-spelling-prompt--long';
            else if (frenchValue.length > 24) sizeClass = 'number-spelling-prompt--medium';
            return { question: `<div class="number-spelling-prompt ${sizeClass}">${frenchValue}</div>`, answer: val.toString(), inputType: 'numeric', isVisual: false, explanation: `${frenchValue} s'écrit ${val}.` };
        }
        return { question: `<div class="math-formula" style="font-size:4rem;">${val}</div>`, answer: frenchValue, inputType: 'alpha', isVisual: false, data: { allowNoHyphen: !p.strict }, explanation: `${val} s'écrit « ${frenchValue} ».` };
    },
    conversion(p) {
        const { rnd, romanize } = Engines.utils;
        if (p.subtype === 'roman') {
            const val = rnd(p.min || 1, p.max || 20);
            if (Math.random() > 0.5) return { question: `<div class="math-formula">Écris <b>${val}</b> en chiffres romains</div>`, answer: romanize(val), inputType: 'roman', isVisual: false, explanation: `${val} s'écrit ${romanize(val)} en chiffres romains.` };
            const rVal = romanize(val);
            return { question: `<div class="math-formula">Quel est ce nombre ?<br><b style="font-size:3rem; font-family:'Times New Roman'">${rVal}</b></div>`, answer: val.toString(), inputType: 'numeric', isVisual: false, explanation: `${rVal} en chiffres romains, c'est ${val}.` };
        }
        if (p.subtype === 'time') {
            const showMemo = p.memo === true;
            const mode = Engines.utils.pick(p.modes || ['h_to_min']);
            const isSeconds = mode.includes('sec');
            const unitBig = isSeconds ? 'min' : 'h';
            const unitSmall = isSeconds ? 's' : 'min';
            const memoText = `1 ${unitBig} = 60 ${unitSmall}`;
            let val1, val2, question, answer;
            if (mode === 'h_to_min' || mode === 'min_to_sec') {
                val1 = Engines.utils.rnd(1, 10);
                question = `${val1} ${unitBig} = ? ${unitSmall}`;
                answer = val1 * 60;
            } else if (mode === 'hmin_to_min' || mode === 'minsec_to_sec') {
                val1 = Engines.utils.rnd(1, 5);
                val2 = p.randomMinutes ? Engines.utils.rnd(1, 59) : Engines.utils.pick([10, 15, 20, 25, 30, 40, 45, 50]);
                question = `${val1} ${unitBig} ${val2} ${unitSmall} = ? ${unitSmall}`;
                answer = (val1 * 60) + val2;
            }
            return { question, answer: answer.toString(), inputType: 'numeric', isVisual: true, visualType: 'timeMemo', data: { showMemo, memoText }, explanation: `${memoText}, donc ${question.replace('?', answer.toString())}` };
        }
        if (p.subtype === 'metric') {
            const unitType = p.unitType || 'longueur';
            const unitSets = {
                longueur: ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'],
                masse: ['kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'],
                capacite: ['kL', 'hL', 'daL', 'L', 'dL', 'cL', 'mL']
            };
            const units = unitSets[unitType];
            const factors = [1000, 100, 10, 1, 0.1, 0.01, 0.001];
            let range = p.range || [0, 6];
            const idx1 = rnd(range[0], range[1]);
            let idx2 = rnd(Math.max(range[0], idx1 - 3), Math.min(range[1], idx1 + 3));
            while (idx1 === idx2) idx2 = rnd(range[0], range[1]);
            const u1 = units[idx1], u2 = units[idx2], f1 = factors[idx1], f2 = factors[idx2];
            const val = idx1 < idx2 ? rnd(1, 10) : rnd(1, 9) * 1000;
            const result = Math.round((val * (f1 / f2)) * 1000) / 1000;
            const resultStr = result.toString().replace('.', ',');
            return { question: "Convertis :", answer: resultStr, inputType: 'numeric', isVisual: true, visualType: 'conversionTable', data: { val, u1, u2, type: unitType }, explanation: `${val} ${u1} = ${resultStr} ${u2}.` };
        }
        return Engines.fallback("Conversion indisponible");
    },
    carreSomme(p) {
        const { rnd, shuffle } = Engines.utils;
        const size = p.gridSize || 9;
        // solutionCount fixe le nombre de cases que l'enfant doit choisir pour
        // atteindre la cible : 2 valeurs en CP (plus simple), 3 valeurs à partir
        // de CE2 (calcul à trois termes), pour suivre la progression du programme.
        const solutionCount = p.solutionCount === 2 ? 2 : 3;
        // Avec solutionCount valeurs positives et distinctes, la somme minimale
        // possible est 1+2 (=3) ou 1+2+3 (=6) : on relève targetMin si besoin
        // pour ne jamais demander une cible mathématiquement impossible à
        // atteindre avec des valeurs distinctes (sinon la génération boucle).
        const minPossibleTarget = solutionCount === 2 ? 3 : 6;
        const targetMin = Math.max(p.targetMin || 10, minPossibleTarget);
        const targetMax = Math.max(p.targetMax || 30, targetMin);
        const target = rnd(targetMin, targetMax);

        let solution;
        if (solutionCount === 2) {
            // n1 < target/2 garantit toujours n1 !== n2 (n2 = target - n1 > n1).
            const n1 = rnd(1, Math.max(1, Math.floor((target - 1) / 2)));
            const n2 = target - n1;
            solution = [n1, n2];
        } else {
            // Tire 2 valeurs distinctes dans [1, target-3] (laisse au moins 1+2
            // pour la troisième), puis dérive la troisième par soustraction.
            const half = Math.max(2, Math.floor(target / 2.5));
            let n1 = rnd(1, half);
            let n2 = rnd(1, half);
            if (n1 === n2) n2 = n2 < half ? n2 + 1 : n2 - 1;
            let n3 = target - (n1 + n2);
            if (n3 <= 0 || n3 === n1 || n3 === n2) {
                // Repli déterministe garanti positif et distinct : comme
                // target >= 6, (target-3, 1, 2) laisse toujours target-3 >= 3,
                // donc différent de 1 et 2.
                n1 = 1;
                n2 = 2;
                n3 = target - 3;
            }
            solution = [n1, n2, n3];
        }

        // Construit la grille en ajoutant les distracteurs un par un, en
        // refusant toute valeur qui créerait :
        // 1) un doublon (case ambiguë au clic) ;
        // 2) une sous-combinaison de moins de solutionCount cases atteignant
        //    déjà la cible (l'enfant pourrait valider sans utiliser le bon
        //    nombre de termes, ce qui contredit la progression visée).
        const grid = [...solution];
        const sumsToTarget = (candidate) => {
            // k = 0 couvre le cas où le candidat seul égale déjà la cible.
            for (let k = 0; k < solutionCount; k++) {
                if (this.hasSubsetSumHelper(grid, k, target - candidate, 0)) return true;
            }
            return false;
        };
        const poolMax = Math.max(target + 10, size + 5);
        const candidates = shuffle(Array.from({ length: poolMax }, (_, i) => i + 1));
        for (const v of candidates) {
            if (grid.length >= size) break;
            if (grid.includes(v)) continue;
            if (sumsToTarget(v)) continue;
            grid.push(v);
        }
        const numbers = shuffle(grid);
        return { isVisual: true, visualType: 'square', inputType: 'selection', answer: target, data: { target, numbers, solutionCount, selectedIndices: [] } };
    },

    // Vrai s'il existe une combinaison de exactement `k` valeurs de `arr`
    // (cases déjà placées dans la grille) dont la somme vaut `sum`.
    hasSubsetSumHelper(arr, k, sum, startIndex) {
        if (k === 0) return sum === 0;
        for (let i = startIndex; i <= arr.length - k; i++) {
            if (arr[i] <= sum && this.hasSubsetSumHelper(arr, k - 1, sum - arr[i], i + 1)) return true;
        }
        return false;
    },
    clock(p = {}) {
        const { rnd } = Engines.utils;
        const level = p.level || 3;
        let h, m;
        if (level === 1) {
            h = rnd(1, 12);
            m = [0, 30][rnd(0, 1)];
        } else if (level === 2) {
            h = rnd(1, 12);
            m = [0, 15, 30, 45][rnd(0, 3)];
        } else {
            h = rnd(0, 23);
            m = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55][rnd(0, 11)];
        }
        const isDay = h >= 8 && h < 20;
        return { isVisual: true, visualType: 'clock', inputType: 'numeric', data: { hours: h, minutes: m, periodIcon: isDay ? "☀️" : "\u{1F319}", periodText: isDay ? "Jour" : "Nuit" }, answer: h.toString().padStart(2, '0') + m.toString().padStart(2, '0') };
    },
    fractionView(p) {
        const d = Engines.utils.rnd(2, p.maxDenom || 8);
        const n = Engines.utils.rnd(1, d - 1);
        return { isVisual: true, visualType: 'fraction', inputType: 'numeric', data: { n, d }, answer: n };
    },
    counting(p) {
        const val = Engines.utils.rnd(p.min || 1, p.max || 20);
        return { isVisual: true, visualType: 'counting', inputType: 'numeric', data: { tens: Math.floor(val / 10), units: val % 10 }, answer: val };
    },
    compare(p) {
        const { rnd } = Engines.utils;
        let n1, n2, d1, d2;
        if (p.type === 'compare-decimals') {
            const base = rnd(0, 100);
            n1 = base + Number(Math.random().toFixed(1));
            n2 = (Math.random() < 0.3) ? n1 : base + Number(Math.random().toFixed(2));
            d1 = n1.toString().replace('.', ',');
            d2 = (n1 === n2 && Math.random() > 0.5) ? d1 + "0" : n2.toString().replace('.', ',');
        } else {
            const max = p.range || 100;
            n1 = rnd(0, max);
            n2 = (Math.random() < 0.2) ? n1 : rnd(0, max);
            d1 = n1.toString();
            d2 = n2.toString();
        }
        const compSign = n1 > n2 ? ">" : n1 < n2 ? "<" : "=";
        return { question: `<div class="compare-box"><span>${d1}</span><span class="sep">...</span><span>${d2}</span></div>`, answer: compSign, inputType: "qcm", data: { choices: ["<", "=", ">"] }, explanation: `${d1} ${compSign} ${d2}` };
    }
};


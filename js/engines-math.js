const EnginesMath = {
    calculate(p) {
        const { rnd, pick, shuffle } = Engines.utils;
        let a, b, total;
        switch (p.type) {
            case 'add-simple':
                total = rnd(p.min || 2, p.maxSum || 10);
                a = rnd(1, total - 1);
                return { question: `${a} + ${total - a} = ?`, answer: total };
            case 'add-trou':
                total = rnd(p.min || 10, p.max || 20);
                a = rnd(1, total - 1);
                return { question: `${a} + ? = ${total}`, answer: total - a };
            case 'sub-simple':
                a = rnd(p.min || 5, p.max || 20);
                b = rnd(0, a);
                return { question: `${a} - ${b} = ?`, answer: a - b };
            case 'mult':
                a = p.table === 'mix' ? rnd(2, 9) : (p.table || 2);
                b = rnd(0, 10);
                return { question: `${a} ?- ${b} = ?`, answer: a * b };
            case 'complement': {
                const target = p.target || 100;
                const cur = rnd(1, target - 1);
                return { question: `${cur} + ? = ${target}`, answer: target - cur };
            }
            case 'decimal-place': {
                const trapMode = p.trap === true;
                const intPart = trapMode ? Engines.utils.rnd(123, 987) : Engines.utils.rnd(0, 99);
                const decPart = Engines.utils.rnd(11, 99);
                const numberStr = `${intPart},${decPart}`;
                const targets = [
                    { label: "chiffre des <b style='color:#e91e63'>dixièmes</b>", ans: Math.floor(decPart / 10) },
                    { label: "chiffre des <b style='color:#e91e63'>centièmes</b>", ans: decPart % 10 }
                ];
                if (trapMode) {
                    targets.push(
                        { label: "chiffre des <b>dizaines</b>", ans: Math.floor(intPart / 10) % 10 },
                        { label: "chiffre des <b>centaines</b>", ans: Math.floor(intPart / 100) % 10 }
                    );
                }
                const t = Engines.utils.pick(targets);
                return {
                    question: `<div style="font-size:3rem; font-weight:bold; letter-spacing:2px;">${numberStr}</div><div class="small-question" style="margin-top:10px;">Quel est le ${t.label} ?</div>`,
                    answer: t.ans,
                    inputType: 'numeric'
                };
            }
            case 'dictée-nombres': {
                const nBig = rnd(1000, p.max || 1000000);
                return { question: `<span class="small-question">??cris en chiffres :<br><b>? ${numberToFrench(nBig)} ?</b></span>`, answer: nBig };
            }
            case 'calc-mental':
                if (p.operator === "/") {
                    const ops = p.operands?.length ? p.operands : [2, 5, 10];
                    const diviseur = pick(ops);
                    const ans = rnd(5, 50);
                    return { question: `${ans * diviseur} : ${diviseur} = ?`, answer: ans };
                }
                a = rnd(p.range?.[0] || 2, p.range?.[1] || 10);
                b = rnd(2, 10);
                return { question: `${a} ?- ${b} = ?`, answer: a * b };
            case 'oiseau-math': {
                a = rnd(p.min || 1, p.max || 10);
                b = rnd(p.min || 1, p.max || 10);
                const res = a + b;
                return { isVisual: true, visualType: 'bird', inputType: 'qcm', data: { question: `${a} + ${b}`, choices: shuffle([res, res + 1, res - 1]), duration: p.vitesse || 8 }, answer: res };
            }
            case 'cibles': {
                const zones = p.zones?.length ? p.zones : [10, 50, 100];
                const touches = [];
                for (let i = 0; i < (p.nbFleches || 3); i++) {
                    const val = pick(zones);
                    touches.push({ val, angle: (i * (360 / (p.nbFleches || 3)) + rnd(0, 20)) * (Math.PI / 180) });
                }
                return { isVisual: true, visualType: p.skin === 'money' ? 'money' : 'target', data: { zonesDefinitions: zones, hits: touches }, answer: touches.reduce((acc, item) => acc + item.val, 0) };
            }
            case 'half': {
                const pair = rnd(10, 100) * 2;
                return { question: `Moiti? de ${pair} ?`, answer: pair / 2 };
            }
            case 'division-simple':
                b = rnd(2, 9);
                total = rnd(2, 10);
                a = b * total;
                return { question: `${a} : ${b} = ?`, answer: total };
            case 'division-reste': {
                const diviseur = rnd(3, 9);
                const quotient = rnd(2, 9);
                const reste = rnd(1, diviseur - 1);
                const dividende = (diviseur * quotient) + reste;
                return { question: `<span class="small-question">Dans <b>${dividende}</b>,<br>combien de fois <b>${diviseur}</b> ?</span>`, answer: quotient };
            }
            case 'division-posed': {
                const level = p.level || 1;
                let d_divisor, d_dividend;
                if (level === 1) {
                    d_divisor = rnd(3, 9);
                    d_dividend = rnd(50, 900);
                } else {
                    d_divisor = rnd(12, 25);
                    d_dividend = rnd(200, 2000);
                }
                const d_q = Math.floor(d_dividend / d_divisor);
                const d_r = d_dividend % d_divisor;
                const askRemainder = p.ask === 'reste';
                return { question: askRemainder ? "Quel est le reste ?" : "Quel est le quotient ?", answer: askRemainder ? d_r : d_q, isVisual: true, visualType: 'division', inputType: 'numeric', data: { dividend: d_dividend, divisor: d_divisor, askRemainder } };
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
            return { question: `<div class="number-spelling-prompt ${sizeClass}">${frenchValue}</div>`, answer: val.toString(), inputType: 'numeric', isVisual: false };
        }
        return { question: `<div class="math-formula" style="font-size:4rem;">${val}</div>`, answer: frenchValue, inputType: 'alpha', isVisual: false, data: { allowNoHyphen: !p.strict } };
    },
    conversion(p) {
        const { rnd, romanize } = Engines.utils;
        if (p.subtype === 'roman') {
            const val = rnd(p.min || 1, p.max || 20);
            if (Math.random() > 0.5) return { question: `<div class="math-formula">??cris <b>${val}</b> en chiffres romains</div>`, answer: romanize(val), inputType: 'roman', isVisual: false };
            const rVal = romanize(val);
            return { question: `<div class="math-formula">Quel est ce nombre ?<br><b style="font-size:3rem; font-family:'Times New Roman'">${rVal}</b></div>`, answer: val.toString(), inputType: 'numeric', isVisual: false };
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
            return { question, answer: answer.toString(), inputType: 'numeric', isVisual: true, visualType: 'timeMemo', data: { showMemo, memoText } };
        }
        if (p.subtype === 'metric') {
            const units = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
            const factors = [1000, 100, 10, 1, 0.1, 0.01, 0.001];
            const idx1 = rnd(0, 6);
            let idx2 = rnd(Math.max(0, idx1 - 3), Math.min(6, idx1 + 3));
            while (idx1 === idx2) idx2 = rnd(0, 6);
            const u1 = units[idx1], u2 = units[idx2], f1 = factors[idx1], f2 = factors[idx2];
            const val = idx1 < idx2 ? rnd(1, 10) : rnd(1, 9) * 1000;
            const result = Math.round((val * (f1 / f2)) * 1000) / 1000;
            return { question: "Convertis :", answer: result.toString().replace('.', ','), inputType: 'numeric', isVisual: true, visualType: 'conversionTable', data: { val, u1, u2, type: 'longueur' } };
        }
        return Engines.fallback("Conversion indisponible");
    },
    carreSomme(p) {
        const { rnd, shuffle } = Engines.utils;
        const size = p.gridSize || 9;
        const target = rnd(p.targetMin || 10, p.targetMax || 30);
        const n1 = rnd(1, Math.floor(target / 2.5));
        const n2 = rnd(1, Math.floor(target / 2.5));
        const n3 = target - (n1 + n2);
        let numbers = [n1, n2, n3];
        const pool = Array.from({ length: Math.max(target + 10, size + 5) }, (_, i) => i + 1).filter(x => !numbers.includes(x));
        numbers = shuffle([...numbers, ...shuffle(pool).slice(0, size - 3)]);
        return { isVisual: true, visualType: 'square', inputType: 'selection', answer: target, data: { target, numbers, selectedIndices: [] } };
    },
    clock() {
        const h = Engines.utils.rnd(0, 23);
        const m = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55][Engines.utils.rnd(0, 11)];
        const isDay = h >= 8 && h < 20;
        return { isVisual: true, visualType: 'clock', inputType: 'numeric', data: { hours: h, minutes: m, periodIcon: isDay ? "?~??" : "?YOT", periodText: isDay ? "Jour" : "Nuit" }, answer: h.toString().padStart(2, '0') + m.toString().padStart(2, '0') };
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
        return { question: `<div class="compare-box"><span>${d1}</span><span class="sep">...</span><span>${d2}</span></div>`, answer: n1 > n2 ? ">" : n1 < n2 ? "<" : "=", inputType: "qcm", data: { choices: ["<", "=", ">"] } };
    }
};


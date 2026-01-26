/**
 * ENGINES.js - L'Usine de Contenu
 * Gestion dynamique des exercices et de la conjugaison pédagogique
 */

const Engines = {
    /**
     * Point d'entrée unique
     */
    run(type, params, lib) {
        switch (type) {
            case 'math-input':
                if (params.type === 'spelling') return this.generators.spelling(params, lib);
                if (params.type === 'clock') return this.generators.clock(params);
                if (params.type === 'fraction-view') return this.generators.fractionView(params);
                return this.generators.calculate(params);
            case 'choice-engine':
                if (params.type === 'homophone-duel') return this.generators.homophones(params, lib);
                return this.generators.compare(params);
            case 'conjugation':
                return this.generators.conjugation(params, lib);
            case 'clock':
                return this.generators.clock(params);
            case 'counting':
                return this.generators.counting(params);
            case 'reading':
                return this.generators.reading(params, lib);    
            default:
                console.error("Moteur inconnu :", type);
                return { question: "Erreur", answer: 0, inputType: 'numeric' };
        }
    },

    generators: {
        spelling(p, lib) {
            const category = p.category || 'animals';
            const pool = lib.spelling[category] || lib.spelling.animals;
            const picked = pool[Math.floor(Math.random() * pool.length)];
            return {
                isVisual: true,
                visualType: 'spelling',
                inputType: 'alpha',
                data: { imageUrl: picked.img, word: picked.word, icon: picked.icon },
                answer: picked.word
            };
        },

conjugation(p, lib) {
    const pronouns = ["JE", "TU", "IL", "ELLE", "ON", "NOUS", "VOUS", "ILS", "ELLES"];
    const availableTenses = p.tenses || ["présent"];
    const selectedTense = availableTenses[Math.floor(Math.random() * availableTenses.length)].toLowerCase();
    const isCompound = (selectedTense === 'passé composé');

    // 1. Mapping des catégories (Ex: present_1, future_2, pc_3_freq)
    let category = p.category || 'present_1';
    if (category.startsWith('etre_avoir')) {
        const suffix = (selectedTense === 'futur') ? '_f' : (selectedTense === 'imparfait') ? '_imp' : '_p';
        category = 'etre_avoir' + suffix;
    } else {
        const prefixMap = { 'présent': 'present', 'futur': 'future', 'imparfait': 'imparfait', 'passé composé': 'pc' };
        const prefix = prefixMap[selectedTense] || 'present';
        // Détecte le groupe (_1, _2, _3) dans la catégorie d'origine
        const groupMatch = p.category.match(/_(\d|3_freq)/);
        if (groupMatch) category = prefix + groupMatch[0];
    }

    if (!lib.conjugation[category]) {
        console.warn(`Catégorie manquante : ${category}. Repli sur ${p.category}`);
        category = p.category;
    }

    const pool = lib.conjugation[category];
    const verb = pool[Math.floor(Math.random() * pool.length)];
    const pIdx = Math.floor(Math.random() * pronouns.length);
    const m = [0, 1, 2, 2, 2, 3, 4, 5, 5]; // Mapping 9 pronoms -> 6 formes
    const cIdx = m[pIdx];

    let answer = "";
    let displayData = { 
        pronoun: pronouns[pIdx], infinitive: verb.infinitive, icon: verb.icon,
        tense: selectedTense.toUpperCase(), isCompound: isCompound
    };

    if (isCompound) {
        // Logique Passé Composé (Auxiliaire + Participe + Accords)
        const auxData = lib.conjugation.etre_avoir_p.find(v => v.infinitive.toLowerCase() === verb.aux.toLowerCase());
        const auxiliary = auxData.full[cIdx];
        let pp = verb.pp; 
        if (verb.aux === 'être') {
            if (pIdx === 3) pp += "E";       // ELLE
            if (pIdx === 5) pp += "S";       // NOUS
            if (pIdx === 6) pp += "S";       // VOUS
            if (pIdx === 7) pp += "S";       // ILS
            if (pIdx === 8) pp += "ES";      // ELLES
        }
        answer = `${auxiliary} ${pp}`;
        displayData.participle = pp; 
    } else {
        answer = verb.full ? verb.full[cIdx] : verb.base + verb.endings[cIdx];
    }

    return {
        isVisual: true, visualType: 'conjugation', inputType: 'alpha',
        tense: selectedTense.toUpperCase(), answer: answer, data: displayData
    };
},

        homophones(p, lib) {
            const pool = lib.homophones[p.category];
            const picked = pool[Math.floor(Math.random() * pool.length)];
            return {
                isVisual: false,
                question: picked.sentence,
                answer: picked.answer,
                inputType: "qcm",
                data: { choices: p.choices }
            };
        },

        clock(p) {
            const hours24 = Math.floor(Math.random() * 24);
            const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55][Math.floor(Math.random() * 12)];
            const isDay = hours24 >= 8 && hours24 < 20;
            const hStr = hours24.toString().padStart(2, '0');
            const mStr = minutes.toString().padStart(2, '0');
            return {
                isVisual: true,
                visualType: 'clock',
                inputType: 'numeric',
                data: { hours: hours24, minutes: minutes, periodIcon: isDay ? "☀️" : "🌙", periodText: isDay ? "Après-midi / Jour" : "Matin / Nuit" },
                answer: parseInt(hStr + mStr)
            };
        },

        fractionView(p) {
            const denom = p.maxDenom || 8;
            const d = Math.floor(Math.random() * (denom - 2)) + 2; 
            const n = Math.floor(Math.random() * (d - 1)) + 1;
            return {
                isVisual: true,
                visualType: 'fraction',
                inputType: 'numeric',
                data: { n, d },
                answer: n
            };
        },

        calculate(p) {
            let a, b, total;
            const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

            switch (p.type) {
                case 'add-simple':
                    total = rnd(p.min || 2, p.maxSum || 10);
                    a = rnd(1, total - 1);
                    return { question: `${a} + ${total - a} = ?`, answer: total, inputType: 'numeric' };

                case 'add-trou':
                    total = rnd(p.min, p.max);
                    a = rnd(1, total - 1);
                    return { question: `${a} + ? = ${total}`, answer: total - a, inputType: 'numeric' };

                case 'sub-simple':
                    a = rnd(p.min, p.max);
                    b = rnd(0, a);
                    return { question: `${a} - ${b} = ?`, answer: a - b, inputType: 'numeric' };

                case 'mult':
                    const activeTable = p.table === 'mix' ? rnd(2, 9) : p.table;
                    b = rnd(0, 10);
                    return { question: `${activeTable} × ${b} = ?`, answer: activeTable * b, inputType: 'numeric' };

                case 'complement':
                    const targetVal = p.target || 100;
                    const currentVal = rnd(1, targetVal - 1);
                    return { question: `${currentVal} + ? = ${targetVal}`, answer: targetVal - currentVal, inputType: 'numeric' };

                case 'decimal-place':
                    const vDec = (Math.random() * 100).toFixed(2);
                    const isT = Math.random() > 0.5;
                    const parts = vDec.split('.');
                    return { 
                        question: `<span class="small-question">Dans <b>${vDec.replace('.', ',')}</b>,<br>quel est le chiffre des ${isT ? 'dixièmes' : 'centièmes'} ?</span>`, 
                        answer: parseInt(isT ? parts[1][0] : parts[1][1]), 
                        inputType: 'numeric' 
                    };

                case 'dictée-nombres':
                    const nBig = rnd(1000, p.max || 1000000);
                    return { 
                        question: `<span class="small-question">Écris en chiffres le nombre :<br><b>« ${numberToFrench(nBig)} »</b></span>`, 
                        answer: nBig, 
                        inputType: 'numeric' 
                    };

                case 'oiseau-math':
                    a = rnd(p.min, p.max); b = rnd(p.min, p.max);
                    total = a + b;
                    let choices = [total, total + 1, total - 1].sort(() => Math.random() - 0.5);
                    return { isVisual: true, visualType: 'bird', inputType: 'qcm', data: { question: `${a} + ${b}`, choices: choices, duration: p.vitesse || 8 }, answer: total };

                case 'carre-somme':
                    const target = rnd(p.targetMin, p.targetMax);
                    const grid = [rnd(1, target - 1), target - rnd(1, target - 1)]; // Simplifié pour l'exemple
                    while (grid.length < p.gridSize) {
                        let d = rnd(1, p.targetMax);
                        if (d !== target) grid.push(d);
                    }
                    return { isVisual: true, visualType: 'square', inputType: 'selection', data: { target: target, numbers: grid.sort(() => Math.random() - 0.5), selectedIndices: [] }, answer: target };
                
                case 'cibles': 
                    let touches = [];
                    for (let i = 0; i < p.nbFleches; i++) touches.push(p.zones[Math.floor(Math.random() * p.zones.length)]);
                    return { isVisual: true, visualType: p.skin === 'money' ? 'money' : 'target', inputType: 'numeric', data: { zonesDefinitions: p.zones, hits: touches }, answer: touches.reduce((acc, val) => acc + val, 0) };

                default:
                    return { question: "Calcul inconnu", answer: 0, inputType: 'numeric' };
            }
        },

        counting(p) {
            const min = p.min || 1;
            const max = p.max || 20;
            const target = Math.floor(Math.random() * (max - min + 1)) + min;
            return { isVisual: true, visualType: 'counting', inputType: 'numeric', data: { tens: Math.floor(target / 10), units: target % 10 }, answer: target };
        },

        compare(p) {
            const a = Math.floor(Math.random() * p.range);
            const b = Math.floor(Math.random() * p.range);
            return { question: `${a} > ${b} ?`, answer: a > b ? 1 : 0, inputType: "boolean" };
        },

        reading(p, lib) {
            const category = lib.reading[p.category] || lib.reading.taoki_p1;
            const item = category[Math.floor(Math.random() * category.length)];
            return { isVisual: true, visualType: 'reading', inputType: 'boolean', data: item, answer: 1 };
        }
    }
};

/**
 * UTILITAIRE : Convertit un nombre en lettres (Français)
 */
function numberToFrench(n) {
    if (n === 0) return "zéro";
    const units = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"];
    const teens = ["dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
    const tens = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingts", "quatre-vingt-dix"];

    const getBelowThousand = (num) => {
        let res = "";
        let c = Math.floor(num / 100);
        let r = num % 100;
        if (c > 0) res += (c > 1 ? units[c] + " " : "") + "cent" + (c > 1 && r === 0 ? "s" : "") + " ";
        if (r > 0) {
            if (r < 10) res += units[r];
            else if (r < 20) res += teens[r - 10];
            else {
                let t = Math.floor(r / 10);
                let u = r % 10;
                if (t === 7 || t === 9) res += tens[t - 1] + (u === 1 ? "-et-" : "-") + teens[u];
                else res += tens[t] + (u === 1 ? "-et-" : (u > 0 ? "-" : "")) + units[u];
            }
        }
        return res.trim();
    };

    let result = "";
    let m = Math.floor(n / 1000000);
    let k = Math.floor((n % 1000000) / 1000);
    let r = n % 1000;

    if (m > 0) result += getBelowThousand(m) + " million" + (m > 1 ? "s" : "") + " ";
    if (k > 0) result += (k === 1 ? "" : getBelowThousand(k) + " ") + "mille ";
    if (r > 0) result += getBelowThousand(r);

    return result.trim();

}

/*
 * Devoir Numérique
 * Copyright (C) 2026 [Stinj-NoD]
 *
 * Ce programme est un logiciel libre : vous pouvez le redistribuer et/ou le modifier
 * selon les termes de la Licence Publique Générale GNU publiée par la
 * Free Software Foundation, soit la version 3 de la licence, soit
 * (à votre gré) toute version ultérieure.
 *
 * Ce programme est distribué dans l'espoir qu'il sera utile,
 * mais SANS AUCUNE GARANTIE ; sans même la garantie implicite de
 * COMMERCIALISATION ou D'ADÉQUATION À UN USAGE PARTICULIER.
 * Voir la Licence Publique Générale GNU pour plus de détails.
 */
const Engines = {
    /**
     * Point d'entrée unique
     */
    run(type, params, lib) {
        // GESTION DES ALIAS (SÉCURITÉ)
        if (type === 'compare' || type === 'choice') type = 'choice-engine';
        if (type === 'oiseau') { type = 'math-input'; params.type = 'oiseau-math'; }
        if (type === 'taoki' || type === 'lecture') type = 'reading';

        switch (type) {
            case 'math-input':
                if (params.type === 'spelling') return this.generators.spelling(params, lib);
                if (params.type === 'clock') return this.generators.clock(params);
                if (params.type === 'fraction-view') return this.generators.fractionView(params);
                if (params.type === 'carre-somme') return this.generators.carreSomme(params);
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
        // --- GÉNÉRATEURS MATHÉMATIQUES ---

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

                // --- AJOUT CM2 : CALCUL MENTAL (Division & Tables Supérieures) ---
                case 'calc-mental': 
                    let op = p.operator || "x";
                    
                    if(op === "/") {
                        // DIVISION PAR 10, 100, 1000
                        const diviseur = p.operands[Math.floor(Math.random() * p.operands.length)];
                        const answer = rnd(5, 200); 
                        const dividend = answer * diviseur;
                        
                        return { 
                            question: `${dividend} : ${diviseur} = ?`, 
                            answer: answer, 
                            inputType: 'numeric' 
                        };
                    } else {
                        // MULTIPLICATION AVANCÉE (Tables 11 à 15)
                        const val1 = rnd(p.range[0], p.range[1]); 
                        let val2;
                        // 20% de chance de tomber sur un carré (ex: 12x12), sinon x2 à x10
                        if (Math.random() < 0.2) {
                            val2 = val1;
                        } else {
                            val2 = rnd(2, 10);
                        }
                        
                        return { 
                            question: `${val1} × ${val2} = ?`, 
                            answer: val1 * val2, 
                            inputType: 'numeric' 
                        };
                    }
                // -------------------------------------------------------------

                case 'oiseau-math':
                    a = rnd(p.min, p.max); b = rnd(p.min, p.max);
                    total = a + b;
                    let choices = [total, total + 1, total - 1].sort(() => Math.random() - 0.5);
                    return { isVisual: true, visualType: 'bird', inputType: 'qcm', data: { question: `${a} + ${b}`, choices: choices, duration: p.vitesse || 8 }, answer: total };

                case 'cibles': 
                    let touches = [];
                    for (let i = 0; i < p.nbFleches; i++) {
                        const val = p.zones[Math.floor(Math.random() * p.zones.length)];
                        const fixedAngle = (i * (360 / p.nbFleches) + (Math.random() * 20)) * (Math.PI / 180);
                        touches.push({ val: val, angle: fixedAngle });
                    }
                    const totalSum = touches.reduce((acc, item) => acc + item.val, 0);

                    return { 
                        isVisual: true, 
                        visualType: p.skin === 'money' ? 'money' : 'target', 
                        inputType: 'numeric', 
                        data: { zonesDefinitions: p.zones, hits: touches }, 
                        answer: totalSum 
                    };

                default:
                    return { question: "Calcul inconnu", answer: 0, inputType: 'numeric' };
            }
        },

        carreSomme(p) {
            const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
            const target = rnd(p.targetMin, p.targetMax);
            const size = p.gridSize || 9;
            let numbers = [];
            
            // 1. Solution garantie
            let n1 = rnd(Math.floor(target * 0.1), Math.floor(target * 0.4));
            let n2 = rnd(Math.floor(target * 0.1), Math.floor(target * 0.4));
            let n3 = target - (n1 + n2);
            if (n3 <= 0) { n1 = Math.floor(target/3); n2 = Math.floor(target/3); n3 = target - (n1+n2); }
            numbers.push(n1, n2, n3);

            // 2. Bruit
            while (numbers.length < size) {
                let noise = rnd(2, target - 2);
                if (!numbers.includes(noise)) numbers.push(noise);
            }

            const grid = numbers.sort(() => Math.random() - 0.5);

            return {
                isVisual: true, visualType: 'square', inputType: 'selection',
                answer: target, data: { target: target, numbers: grid, selectedIndices: [] }
            };
        },

        // --- GÉNÉRATEURS FRANÇAIS & AUTRES ---

        conjugation(p, lib) {
            const pronouns = ["JE", "TU", "IL", "ELLE", "ON", "NOUS", "VOUS", "ILS", "ELLES"];
            const availableTenses = p.tenses || ["présent"];
            const selectedTense = availableTenses[Math.floor(Math.random() * availableTenses.length)].toLowerCase();
            const isCompound = (selectedTense === 'passé composé');

            let category = p.category || 'present_1';
            if (category.startsWith('etre_avoir')) {
                const suffix = (selectedTense === 'futur') ? '_f' : (selectedTense === 'imparfait') ? '_imp' : '_p';
                category = 'etre_avoir' + suffix;
            } else {
                const prefixMap = { 'présent': 'present', 'futur': 'future', 'imparfait': 'imparfait', 'passé composé': 'pc' };
                const prefix = prefixMap[selectedTense] || 'present';
                const groupMatch = p.category.match(/_(\d|3_freq)/);
                if (groupMatch) category = prefix + groupMatch[0];
            }

            if (!lib.conjugation[category]) category = p.category;

            const pool = lib.conjugation[category];
            const verb = pool[Math.floor(Math.random() * pool.length)];
            const pIdx = Math.floor(Math.random() * pronouns.length);
            const m = [0, 1, 2, 2, 2, 3, 4, 5, 5]; 
            const cIdx = m[pIdx];

            let answer = "";
            let displayData = { 
                pronoun: pronouns[pIdx], infinitive: verb.infinitive, icon: verb.icon,
                tense: selectedTense.toUpperCase(), isCompound: isCompound
            };

            if (isCompound) {
                const auxData = lib.conjugation.etre_avoir_p.find(v => v.infinitive.toLowerCase() === verb.aux.toLowerCase());
                const auxiliary = auxData.full[cIdx];
                let pp = verb.pp; 
                if (verb.aux === 'être') {
                    if (pIdx === 3) pp += "E";
                    if ([5, 6, 7].includes(pIdx)) pp += "S";
                    if (pIdx === 8) pp += "ES";
                }
                answer = `${auxiliary} ${pp}`;
            } else {
                answer = verb.full ? verb.full[cIdx] : verb.base + verb.endings[cIdx];
            }

            return {
                isVisual: true, visualType: 'conjugation', inputType: 'alpha',
                tense: selectedTense.toUpperCase(), answer: answer, data: displayData
            };
        },

        spelling(p, lib) {
            const category = p.category || 'animals';
            const pool = lib.spelling[category] || lib.spelling.animals;
            const picked = pool[Math.floor(Math.random() * pool.length)];
            return {
                isVisual: true, visualType: 'spelling', inputType: 'alpha',
                data: { imageUrl: picked.img, word: picked.word, icon: picked.icon },
                answer: picked.word
            };
        },

homophones(p, lib) {
            // 1. SÉCURITÉ DE BASE
            if (!lib || !lib.homophones) {
                return { isVisual: false, question: "Erreur Lib", answer: "ok", inputType: "info" };
            }

            // --- LOGIQUE MIX INTELLIGENTE ---
            let targetCategory = p.category; // Par défaut, celle du JSON (ex: "a_à")

            // Si on demande un MIX, on choisit une catégorie au hasard parmi celles existantes
            if (p.category === 'mix_all' || p.category === 'mix_auto') {
                // On récupère toutes les clés du JSON qui ressemblent à des catégories (avec un underscore, ex: "a_à")
                // On exclut les commentaires ou les clés bizarres
                const validKeys = Object.keys(lib.homophones).filter(k => 
                    k.includes('_') && 
                    !k.startsWith('__') && 
                    Array.isArray(lib.homophones[k])
                );

                if (validKeys.length > 0) {
                    targetCategory = validKeys[Math.floor(Math.random() * validKeys.length)];
                } else {
                    return { isVisual: false, question: "Aucune catégorie trouvée pour le mix", answer: "ok", inputType: "info" };
                }
            }

            // 2. RÉCUPÉRATION DE LA PHRASE (Dans la catégorie choisie)
            if (!lib.homophones[targetCategory]) {
                return {
                    isVisual: false,
                    question: `Erreur: Catégorie '${targetCategory}' introuvable`,
                    answer: "ok", inputType: "info"
                };
            }

            const pool = lib.homophones[targetCategory];
            const picked = pool[Math.floor(Math.random() * pool.length)];

            // Normalisation (sentence/q/question et answer/a)
            const rawQuestion = picked.sentence || picked.q || picked.question;
            const rawAnswer = picked.answer || picked.a;

            if (!rawQuestion) {
                return { isVisual: false, question: "Erreur : Phrase vide", answer: "ok", inputType: "info" };
            }

            // 3. DÉTERMINATION DES BOUTONS (CHOIX)
            let choices = [];

            // Priorité A : La phrase a ses propres choix (ex: un cas spécifique complexe)
            if (picked.choices) {
                choices = picked.choices;
            }
            // Priorité B : Si on est en mode MIX, on déduit les choix depuis le nom de la catégorie piochée (ex: "son_sont" -> ["son", "sont"])
            // C'est CRUCIAL : cela permet d'avoir les bons boutons pour la bonne phrase, même en mode mix.
            else if (targetCategory.includes('_')) {
                choices = targetCategory.split('_');
            }
            // Priorité C : Les choix imposés par l'exercice (fallback)
            else if (p.choices && p.choices.length > 0) {
                choices = p.choices;
            }
            // Fallback ultime
            else {
                choices = ["1", "2"];
            }

            return {
                isVisual: true, 
                visualType: 'homophones',
                
                // On remplace les trous visuellement
                question: `<span class="small-question">${rawQuestion.replace(/(\.\.\.|___)/g, '<span style="color:var(--primary)">_____</span>')}</span>`,
                
                answer: rawAnswer,
                
                inputType: "qcm", 
                data: { choices: choices }
            };
        },

        clock(p) {
            const hours24 = Math.floor(Math.random() * 24);
            const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55][Math.floor(Math.random() * 12)];
            const isDay = hours24 >= 8 && hours24 < 20;
            const hStr = hours24.toString().padStart(2, '0');
            const mStr = minutes.toString().padStart(2, '0');
            return {
                isVisual: true, visualType: 'clock', inputType: 'numeric',
                data: { hours: hours24, minutes: minutes, periodIcon: isDay ? "☀️" : "🌙", periodText: isDay ? "Après-midi / Jour" : "Matin / Nuit" },
                answer: parseInt(hStr + mStr)
            };
        },

        fractionView(p) {
            const denom = p.maxDenom || 8;
            const d = Math.floor(Math.random() * (denom - 2)) + 2; 
            const n = Math.floor(Math.random() * (d - 1)) + 1;
            return {
                isVisual: true, visualType: 'fraction', inputType: 'numeric',
                data: { n, d }, answer: n
            };
        },

        counting(p) {
            const min = p.min || 1;
            const max = p.max || 20;
            const target = Math.floor(Math.random() * (max - min + 1)) + min;
            return { isVisual: true, visualType: 'counting', inputType: 'numeric', data: { tens: Math.floor(target / 10), units: target % 10 }, answer: target };
        },

        compare(p) {
            let n1, n2, symbol;
            let d1, d2; 

            // --- CAS 1 : MODE DÉCIMAUX (CM2) ---
            if (p.type === 'compare-decimals') {
                const base = Math.floor(Math.random() * 100); 
                const variant = Math.random();
                
                if (variant < 0.3) {
                    n1 = base + 0.5; n2 = base + 0.5; 
                    d1 = n1.toString().replace('.', ',');
                    d2 = n1.toString().replace('.', ',') + "0";
                    if (Math.random() > 0.5) [d1, d2] = [d2, d1];
                } else if (variant < 0.6) {
                    n1 = base + Number((Math.random()).toFixed(1));
                    n2 = n1 + (Math.random() < 0.5 ? 0.1 : -0.1);
                    n1 = Math.round(n1 * 10) / 10; n2 = Math.round(n2 * 10) / 10;
                    d1 = n1.toString().replace('.', ',');
                    d2 = n2.toString().replace('.', ',');
                } else {
                    n1 = base + Number((Math.random() * 0.9).toFixed(1)); 
                    n2 = base + Number((Math.random() * 0.9).toFixed(2)); 
                    d1 = n1.toString().replace('.', ',');
                    d2 = n2.toString().replace('.', ',');
                }
            } else {
                // --- CAS 2 : MODE ENTIERS ---
                const max = p.range || 100;
                n1 = Math.floor(Math.random() * max);
                n2 = (Math.random() < 0.2) ? n1 : Math.floor(Math.random() * max);
                d1 = n1.toString(); d2 = n2.toString();
            }

            if (n1 > n2) symbol = ">"; else if (n1 < n2) symbol = "<"; else symbol = "=";

            return { 
                question: `<div style="display:flex; align-items:center; justify-content:center; gap:20px; font-size:2.5rem; font-weight:bold;">
                    <span>${d1}</span><span style='color:#A0AEC0; font-size:2rem'>...</span><span>${d2}</span>
                </div>`, 
                answer: symbol, inputType: "qcm", isVisual: false,
                data: { choices: ["<", "=", ">"] } 
            };
        },
        
        reading(p, lib) {
             const category = lib.reading[p.category] || lib.reading.taoki_p1;
             const item = category[Math.floor(Math.random() * category.length)];
             return { isVisual: true, visualType: 'reading', inputType: 'boolean', data: item, answer: 1 };
        }
    } // Fin generators
}; // <--- C'EST ICI QU'IL MANQUAIT L'ACCOLADE ET LE POINT VIRGULE !

/**
 * UTILITAIRE : Convertit un nombre en lettres (Français)
 * Support jusqu'aux Milliards pour le CM2
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
    let b = Math.floor(n / 1000000000); let restB = n % 1000000000;
    let m = Math.floor(restB / 1000000); let restM = restB % 1000000;
    let k = Math.floor(restM / 1000); let r = restM % 1000;

    if (b > 0) result += getBelowThousand(b) + " milliard" + (b > 1 ? "s" : "") + " ";
    if (m > 0) result += getBelowThousand(m) + " million" + (m > 1 ? "s" : "") + " ";
    if (k > 0) result += (k === 1 ? "" : getBelowThousand(k) + " ") + "mille ";
    if (r > 0) result += getBelowThousand(r);

    return result.trim();
}






/*
 * Devoir Numérique - Engines.js
 * Copyright (C) 2026 [Stinj-NoD]
 * Version : 3.0 (Hardened & Optimized)
 */

const Engines = {
    // --- BOÎTE À OUTILS INTERNE (Robustesse & Aléatoire) ---
    utils: {
        // Entier aléatoire borné (sécurisé si min > max)
        rnd(min, max) {
            if (min > max) [min, max] = [max, min];
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        // Pioche un élément dans un tableau sans crasher si vide
        pick(arr) {
            return (Array.isArray(arr) && arr.length > 0) ? arr[Math.floor(Math.random() * arr.length)] : null;
        },
        // Mélange de Fisher-Yates (Vrai aléatoire)
        shuffle(arr) {
            const newArr = [...arr];
            for (let i = newArr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
            }
            return newArr;
        },
        // DANS ENGINES.JS -> Engines.utils

    romanize(num) {
        if (!+num) return false;
        const digits = String(+num).split("");
        const key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
                "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
                "","I","II","III","IV","V","VI","VII","VIII","IX"];
        let roman = "", i = 3;
        while (i--) roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        return Array(+digits.join("") + 1).join("M") + roman;
    },

    deromanize(str) {
        const roman = str.toUpperCase();
        const lookup = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
        let num = 0, p = 0;
        for (let i = roman.length - 1; i >= 0; i--) {
            const curr = lookup[roman.charAt(i)];
            if (curr >= p) num += curr;
            else num -= curr;
            p = curr;
        }
        return num;
    }
    },

    /**
     * POINT D'ENTRÉE UNIQUE
     * @param {string} type - Le nom du moteur (ex: 'math-input', 'conjugation')
     * @param {object} params - Les paramètres du JSON (target, range, etc.)
     * @param {object} lib - La bibliothèque externe (Français)
     */
    run(type, params = {}, lib = {}) {
        // 1. Normalisation des Alias
        let engineType = type;
        if (['compare', 'choice'].includes(engineType)) engineType = 'choice-engine';
        if (engineType === 'oiseau') {
            engineType = 'math-input';
            params.type = 'oiseau-math';
        }

        try {
            let result;
            // 2. Aiguillage vers le bon générateur
            switch (engineType) {
                case 'math-input':
                    if (params.type === 'spelling') result = this.generators.spelling(params, lib);
                    else if (params.type === 'clock') result = this.generators.clock(params);
                    else if (params.type === 'fraction-view') result = this.generators.fractionView(params);
                    else if (params.type === 'number-spelling') result = this.generators.numberSpelling(params);
                    else if (params.type === 'carre-somme') result = this.generators.carreSomme(params);
                    else result = this.generators.calculate(params);
                    break;

                case 'conversion':
                    result = this.generators.conversion(params);
                    break;

                case 'choice-engine':
                    // --- AJOUT : Gestion Genre et Articles ---
                    if (params.type === 'gender-articles') result = this.generators.genderArticles(params, lib);
                    else if (params.type === 'homophone-duel') result = this.generators.homophones(params, lib);
                    else result = this.generators.compare(params);
                    break;

                case 'conjugation': result = this.generators.conjugation(params, lib); break;
                case 'clock': result = this.generators.clock(params); break;
                case 'counting': result = this.generators.counting(params); break;

                default:
                    console.error(`Moteur inconnu : ${engineType}`);
                    return this.fallback("Exercice non disponible");
            }

            // 3. Standardisation de la sortie (Anti-Undefined)
            return this.standardize(result);

        } catch (e) {
            console.error("🔥 CRASH ENGINE :", e);
            return this.fallback("Erreur technique de l'exercice");
        }
    },

    /**
     * Garantit que l'UI reçoit toujours un objet propre
     */
    standardize(res) {
        return {
            question: res.question || "",
            // On force la conversion en string pour garder les zéros non significatifs (ex: "0915")
            answer: (res.answer !== undefined && res.answer !== null) ? res.answer.toString() : "error",
            inputType: res.inputType || "numeric",
            isVisual: !!res.isVisual,
            visualType: res.visualType || null,
            data: res.data || {}
        };
    },

    fallback(msg) {
        return { question: msg, answer: "0", inputType: 'numeric', isVisual: false };
    },

    // --- LES GÉNÉRATEURS ---
    generators: {
        
        // 1. MATHÉMATIQUES
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
                    // Supporte table unique (7) ou table mixte ('mix')
                    a = p.table === 'mix' ? rnd(2, 9) : (p.table || 2);
                    b = rnd(0, 10);
                    return { question: `${a} × ${b} = ?`, answer: a * b };

                case 'complement':
                    const target = p.target || 100;
                    const cur = rnd(1, target - 1);
                    return { question: `${cur} + ? = ${target}`, answer: target - cur };

                case 'decimal-place':
                    const vDec = (Math.random() * 100).toFixed(2);
                    const isT = Math.random() > 0.5;
                    const parts = vDec.split('.');
                    return { 
                        question: `<span class="small-question">Dans <b>${vDec.replace('.', ',')}</b>,<br>quel est le chiffre des ${isT ? 'dixièmes' : 'centièmes'} ?</span>`, 
                        answer: isT ? parts[1][0] : parts[1][1]
                    };

                case 'dictée-nombres':
                    const nBig = rnd(1000, p.max || 1000000);
                    return { 
                        question: `<span class="small-question">Écris en chiffres :<br><b>« ${numberToFrench(nBig)} »</b></span>`, 
                        answer: nBig 
                    };

                case 'calc-mental': 
                    // Gestion division ou multiplication
                    if(p.operator === "/") {
                        const ops = p.operands?.length ? p.operands : [2, 5, 10];
                        const diviseur = pick(ops);
                        const ans = rnd(5, 50); 
                        return { question: `${ans * diviseur} : ${diviseur} = ?`, answer: ans };
                    }
                    const v1 = rnd(p.range?.[0] || 2, p.range?.[1] || 10); 
                    const v2 = rnd(2, 10);
                    return { question: `${v1} × ${v2} = ?`, answer: v1 * v2 };

                case 'oiseau-math':
                    a = rnd(p.min || 1, p.max || 10); 
                    b = rnd(p.min || 1, p.max || 10);
                    const res = a + b;
                    return { 
                        isVisual: true, visualType: 'bird', inputType: 'qcm', 
                        data: { 
                            question: `${a} + ${b}`, 
                            choices: shuffle([res, res + 1, res - 1]), 
                            duration: p.vitesse || 8 
                        }, 
                        answer: res 
                    };

                case 'cibles': 
                    const zones = p.zones?.length ? p.zones : [10, 50, 100];
                    let touches = [];
                    for (let i = 0; i < (p.nbFleches || 3); i++) {
                        const val = pick(zones);
                        touches.push({ 
                            val: val, 
                            angle: (i * (360 / (p.nbFleches || 3)) + rnd(0, 20)) * (Math.PI / 180) 
                        });
                    }
                    return { 
                        isVisual: true, visualType: p.skin === 'money' ? 'money' : 'target', 
                        data: { zonesDefinitions: zones, hits: touches }, 
                        answer: touches.reduce((acc, item) => acc + item.val, 0) 
                    };

                    // DANS ENGINESV2.JS -> generators -> calculate -> switch(p.type)

                case 'half': // La Moitié (CM1)
                    // On prend des nombres pairs évidemment
                    const pair = rnd(10, 100) * 2; 
                    return { 
                        question: `Moitié de ${pair} ?`, 
                        answer: pair / 2 
                    };

                case 'division-simple': // Tables de division
                    // On génère via la multiplication pour être sûr d'avoir un compte rond
                    b = rnd(2, 9); // Diviseur (table)
                    const q = rnd(2, 10); // Quotient
                    a = b * q; // Dividende
                    return { 
                        question: `${a} : ${b} = ?`, 
                        answer: q 
                    };

                case 'division-reste': // Approche Euclidienne (CM2)
                    // Ex: 26 divisé par 5 -> Quotient 5, Reste ?
                    const diviseur = rnd(3, 9);
                    const quotient = rnd(2, 9);
                    const reste = rnd(1, diviseur - 1);
                    const dividende = (diviseur * quotient) + reste;
                    
                    // On demande le reste (plus dur) ou le quotient ?
                    // Pour commencer, demandons le quotient entier ("Combien de fois...")
                    return {
                        question: `<span class="small-question">Dans <b>${dividende}</b>,<br>combien de fois <b>${diviseur}</b> ?</span>`,
                        answer: quotient
                    };

                    // DANS ENGINESV2.JS -> calculate

                case 'division-posed': 
                    // Configuration CM1/CM2
                    const level = p.level || 1; // 1=Simple (3ch/1ch), 2=Dur (3ch/2ch)
                    
                    let d_divisor, d_dividend;
                    
                    if (level === 1) {
                        // Diviseur 1 chiffre (3 à 9), Dividende 2 ou 3 chiffres
                        d_divisor = rnd(3, 9);
                        d_dividend = rnd(50, 900);
                    } else {
                        // Diviseur 2 chiffres (12 à 25), Dividende 3 ou 4 chiffres
                        d_divisor = rnd(12, 25);
                        d_dividend = rnd(200, 2000);
                    }

                    const d_q = Math.floor(d_dividend / d_divisor);
                    const d_r = d_dividend % d_divisor;

                    // On peut choisir de demander le Reste ou le Quotient via paramètre
                    const askRemainder = p.ask === 'reste';

                    return {
                        question: askRemainder ? "Quel est le reste ?" : "Quel est le quotient ?",
                        answer: askRemainder ? d_r : d_q,
                        isVisual: true,
                        visualType: 'division', // Nouveau visuel !
                        inputType: 'numeric',
                        data: { 
                            dividend: d_dividend, 
                            divisor: d_divisor,
                            askRemainder // Pour mettre en surbrillance la zone à remplir
                        }
                    };

                default: return { question: "Calcul inconnu", answer: 0 };
            }
        },
        numberSpelling(p) {
            const { rnd } = Engines.utils;
            const val = rnd(p.min || 0, p.max || 10);
            
            // Pile ou Face : Soit on écrit le chiffre (0->1), soit le mot (1->0)
            // On peut forcer un mode via le JSON avec "forceMode": "numeric" ou "alpha"
            const targetMode = p.forceMode || (Math.random() > 0.5 ? 'numeric' : 'alpha');

            if (targetMode === 'numeric') {
                // SCÉNARIO A : L'enfant lit "Dix" et tape "10"
                // Facile, pas de problème de tiret ici.
                return {
                    question: `<div style="font-size:2.2rem; line-height:1.4; text-align:center;">${numberToFrench(val)}</div>`,
                    answer: val.toString(),
                    inputType: 'numeric',
                    isVisual: false
                };
            } else {
                // SCÉNARIO B : L'enfant lit "10" et tape "dix" (ou "dix-sept")
                return {
                    question: `<div class="math-formula" style="font-size:4rem;">${val}</div>`,
                    answer: numberToFrench(val), // Renvoie la "vraie" réponse (ex: dix-sept)
                    inputType: 'alpha', // Déclenche ton clavier AZERTY avec le tiret
                    isVisual: false,
                    data: {
                        // C'est ici qu'on dit à App.js d'être gentil sur les tirets
                        // Par défaut c'est permissif (CP), sauf si le JSON dit "strict": true
                        allowNoHyphen: !p.strict 
                    }
                };
            }
        },
// DANS ENGINES.JS -> Engines.generators

        conversion(p) {
            const { rnd, pick, romanize } = Engines.utils;

            // --- A. CHIFFRES ROMAINS ---
            if (p.subtype === 'roman') {
                const val = rnd(p.min || 1, p.max || 20); // CE2: 1-20, CM: 1-100+
                const toRoman = Math.random() > 0.5; // Pile ou face

                if (toRoman) {
                    return {
                        question: `<div class="math-formula">Écris <b>${val}</b> en chiffres romains</div>`,
                        answer: romanize(val),
                        inputType: 'alpha', // Clavier lettres
                        isVisual: false
                    };
                } else {
                    const rVal = romanize(val);
                    return {
                        question: `<div class="math-formula">Quel est ce nombre ?<br><b style="font-size:3rem; font-family:'Times New Roman'">${rVal}</b></div>`,
                        answer: val.toString(),
                        inputType: 'numeric',
                        isVisual: false
                    };
                }
            }

            // --- B. TEMPS (Durées) ---
            if (p.subtype === 'time') {
                const mode = pick(p.modes || ['h_to_min']); // h_to_min, min_to_h, min_to_hmin
                
                if (mode === 'h_to_min') {
                    const h = rnd(1, 5);
                    return { question: `${h} h = ? min`, answer: h * 60 };
                }
                if (mode === 'min_to_h') { // Ex: 120 min = ? h
                    const h = rnd(1, 4);
                    return { question: `${h * 60} min = ? h`, answer: h };
                }
                if (mode === 'hmin_to_min') { // Ex: 1h 30min = ? min
                    const h = rnd(1, 3);
                    const m = rnd(1, 5) * 10;
                    return { question: `${h} h ${m} min = ? min`, answer: (h * 60) + m };
                }
            }

            // --- C. SYSTÈME MÉTRIQUE (m, g, L) ---
            if (p.subtype === 'metric') {
                const units = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
                const factors = [1000, 100, 10, 1, 0.1, 0.01, 0.001];
                
                // On choisit deux unités pas trop éloignées (max 3 crans d'écart)
                const idx1 = rnd(0, 6);
                let idx2 = rnd(Math.max(0, idx1 - 3), Math.min(6, idx1 + 3));
                while(idx1 === idx2) idx2 = rnd(0, 6); // Pas la même

                const u1 = units[idx1];
                const u2 = units[idx2];
                const f1 = factors[idx1];
                const f2 = factors[idx2];

                // On génère un nombre "rond" pour éviter les virgules flottantes affreuses
                // Si on va vers une unité plus petite (ex: m -> cm), on prend un petit entier
                // Si on va vers plus grand (cm -> m), on prend des centaines/milliers
                let val;
                if (idx1 < idx2) val = rnd(1, 10); // ex: 5 km -> ... m
                else val = rnd(1, 9) * 1000; // ex: 2000 m -> ... km

                // Calcul précis (astuce pour éviter 0.300000004)
                const ratio = f1 / f2;
                const result = Math.round((val * ratio) * 1000) / 1000;

                return {
                    question: "Convertis :",
                    answer: result.toString().replace('.', ','), // Format français
                    inputType: 'numeric', // Le clavier numérique aura besoin de la virgule (à vérifier)
                    isVisual: true,
                    visualType: 'conversionTable', // 👈 Nouveau visuel !
                    data: { 
                        val, 
                        u1, 
                        u2,
                        type: 'longueur' // ou masse/capacité
                    }
                };
            }
        },

        // 2. LOGIQUE (Carré Magique avec pool sécurisée)
        carreSomme(p) {
            const { rnd, shuffle } = Engines.utils;
            const size = p.gridSize || 9;
            const target = rnd(p.targetMin || 10, p.targetMax || 30);
            
            // a. Solution garantie (3 nombres qui font la cible)
            const n1 = rnd(1, Math.floor(target / 2.5));
            const n2 = rnd(1, Math.floor(target / 2.5));
            const n3 = target - (n1 + n2);
            let numbers = [n1, n2, n3];

            // b. Pool de nombres uniques pour éviter les doublons/boucles infinies
            // On crée une liste large de nombres possibles et on retire ceux déjà utilisés
            const poolLimit = Math.max(target + 10, size + 5);
            let pool = Array.from({length: poolLimit}, (_, i) => i + 1)
                            .filter(x => !numbers.includes(x));
            
            // c. On mélange la pool et on complète la grille
            const remaining = shuffle(pool).slice(0, size - 3);
            numbers = shuffle([...numbers, ...remaining]);

            return {
                isVisual: true, visualType: 'square', inputType: 'selection',
                answer: target, 
                data: { target, numbers, selectedIndices: [] }
            };
        },

        // 3. FRANÇAIS (Avec protection des bibliothèques)
        conjugation(p, lib) {
            if (!lib?.conjugation) return Engines.fallback("Bibliothèque absente");

            const pronouns = ["Je", "Tu", "Il", "Elle", "On", "Nous", "Vous", "Ils", "Elles"];
            const tenses = p.tenses || ["présent"];
            const selectedTense = pick(tenses).toLowerCase();
            const isCompound = (selectedTense === 'passé composé');

            // Détermination sécurisée de la catégorie (ex: 'etre_avoir' ou 'present_1')
            let category = p.category || 'present_1';
            try {
                if (category.startsWith('etre_avoir')) {
                    const suffix = (selectedTense === 'futur') ? '_f' : (selectedTense === 'imparfait') ? '_imp' : '_p';
                    category = 'etre_avoir' + suffix;
                } else {
                    const prefixMap = { 'présent': 'present', 'futur': 'future', 'imparfait': 'imparfait', 'passé composé': 'pc' };
                    const prefix = prefixMap[selectedTense] || 'present';
                    const groupMatch = p.category.match(/_(\d|3_freq)/);
                    if (groupMatch) category = prefix + groupMatch[0];
                }
            } catch(e) { category = 'present_1'; }

            const pool = lib.conjugation[category];
            if (!pool || !pool.length) return Engines.fallback("Verbes introuvables");

            const verb = pick(pool);
            const pIdx = Engines.utils.rnd(0, 8); // Index pronom
            const cIdx = [0, 1, 2, 2, 2, 3, 4, 5, 5][pIdx]; // Index terminaison

            let answer = "";

            if (isCompound) {
                // Passé Composé
                const auxData = lib.conjugation.etre_avoir_p.find(v => v.infinitive.toLowerCase() === verb.aux.toLowerCase());
                const auxiliary = auxData ? auxData.full[cIdx] : "a";
                let pp = verb.pp;
                if (verb.aux === 'être') {
                    if (pIdx === 3) pp += "e"; 
                    if ([5, 6, 7].includes(pIdx)) pp += "s"; 
                    if (pIdx === 8) pp += "es";
                }
                answer = `${auxiliary} ${pp}`;
            } else {
                // Temps simples
                answer = verb.full ? verb.full[cIdx] : (verb.base + verb.endings[cIdx]);

                // Exceptions orthographiques (nous mangeons, nous lançons)
                if (selectedTense === "présent" && pIdx === 5) {
                    if (verb.infinitive?.endsWith("ger")) answer = verb.base + "e" + verb.endings[cIdx];
                    if (verb.infinitive?.endsWith("cer")) answer = verb.base.replace(/c$/, "ç") + verb.endings[cIdx];
                }
            }

            return {
                isVisual: true, visualType: 'conjugation', inputType: 'alpha',
                answer: answer.toLowerCase().trim(),
                data: { 
                    pronoun: pronouns[pIdx], 
                    infinitive: (verb.infinitive || "").toUpperCase(), 
                    tense: selectedTense.toUpperCase(),
                    isCompound 
                }
            };
        },

        spelling(p, lib) {
            const cat = p.category || 'animals';
            const pool = lib?.spelling?.[cat];
            
            if (!pool || !pool.length) return Engines.fallback("Mots indisponibles");

            const picked = pick(pool);
            return {
                isVisual: true, visualType: 'spelling', inputType: 'alpha',
                answer: picked.word.toLowerCase().trim(),
                data: { word: picked.word.toUpperCase(), img: picked.img, icon: picked.icon }
            };
        },

        homophones(p, lib) {
            if (!lib?.homophones) return Engines.fallback("Lib manquante");
            
            let cat = p.category;
            if (cat === 'mix_all' || cat === 'mix_auto') {
                const keys = Object.keys(lib.homophones).filter(k => Array.isArray(lib.homophones[k]));
                cat = pick(keys);
            }
            
            const pool = lib.homophones[cat];
            if (!pool || !pool.length) return Engines.fallback("Catégorie vide");

            const picked = pick(pool);
            const rawQ = picked.sentence || picked.q || "";
            return {
                isVisual: true, visualType: 'homophones', inputType: "qcm", 
                question: `<span class="small-question">${rawQ.replace(/(\.\.\.|___)/g, '<span style="color:var(--primary)">_____</span>')}</span>`,
                answer: picked.answer || picked.a,
                data: { choices: picked.choices || cat.split('_') }
            };
        },

        // 4. VISUELS DIVERS
        clock(p) {
            const h = Engines.utils.rnd(0, 23);
            // Liste complète des minutes
            const m = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55][Engines.utils.rnd(0, 11)];
            const isDay = h >= 8 && h < 20;
            
            // Formatage de la réponse en chaîne (ex: "0905") pour conserver le zéro
            const strH = h.toString().padStart(2, '0');
            const strM = m.toString().padStart(2, '0');
            
            return {
                isVisual: true, visualType: 'clock', inputType: 'numeric',
                data: { hours: h, minutes: m, periodIcon: isDay ? "☀️" : "🌙", periodText: isDay ? "Jour" : "Nuit" },
                answer: strH + strM
            };
        },

        fractionView(p) {
            const d = Engines.utils.rnd(2, p.maxDenom || 8); 
            const n = Engines.utils.rnd(1, d - 1);
            return { isVisual: true, visualType: 'fraction', inputType: 'numeric', data: { n, d }, answer: n };
        },

        counting(p) {
            const val = Engines.utils.rnd(p.min || 1, p.max || 20);
            return { 
                isVisual: true, visualType: 'counting', inputType: 'numeric', 
                data: { tens: Math.floor(val / 10), units: val % 10 }, 
                answer: val 
            };
        },

        compare(p) {
            const { rnd } = Engines.utils;
            let n1, n2, d1, d2;
            
            if (p.type === 'compare-decimals') {
                const base = rnd(0, 100);
                n1 = base + Number(Math.random().toFixed(1));
                // 30% de chance d'égalité ou piège
                n2 = (Math.random() < 0.3) ? n1 : base + Number(Math.random().toFixed(2));
                d1 = n1.toString().replace('.', ',');
                d2 = (n1 === n2 && Math.random() > 0.5) ? d1 + "0" : n2.toString().replace('.', ',');
            } else {
                const max = p.range || 100;
                n1 = rnd(0, max);
                n2 = (Math.random() < 0.2) ? n1 : rnd(0, max);
                d1 = n1.toString(); d2 = n2.toString();
            }
            
            const symbol = n1 > n2 ? ">" : n1 < n2 ? "<" : "=";
            return { 
                question: `<div class="compare-box"><span>${d1}</span><span class="sep">...</span><span>${d2}</span></div>`, 
                answer: symbol, inputType: "qcm", data: { choices: ["<", "=", ">"] } 
            };
        },
        // À ajouter dans Engines.generators dans enginesv2.js
        // À mettre dans Engines.generators dans enginesv2.js
genderArticles(params, lib) {
    const { pick } = Engines.utils;
    const cat = lib.grammar?.[params.category] || [];
    const item = pick(cat);
    
    if (!item) return { question: "Erreur Lib", answer: "ok" };

    let expected;
    let choices = [...(params.options || ["un", "une"])]; // On copie les options du JSON

    // Détection de l'élision (voyelles + h)
    const voyelles = ['a','e','i','o','u','y','h'];
    const needsElision = voyelles.includes(item.word[0].toLowerCase());

    if (choices.includes("un") || choices.includes("une")) {
        // Mode un / une : pas d'élision
        expected = item.article;
    } else {
        // Mode le / la
        if (needsElision) {
            expected = "l'";
            // PROTECTION : Si "l'" n'est pas dans les choix, on l'ajoute dynamiquement
            if (!choices.includes("l'")) {
                choices.push("l'");
            }
        } else {
            expected = (item.gender === "masculin") ? "le" : "la";
        }
    }

    return {
        question: "Choisis le bon petit mot :",
        answer: expected,
        inputType: 'qcm',
        isVisual: true,
        visualType: 'spelling',
        data: {
            word: item.word.toUpperCase(),
            icon: item.icon,
            img: item.img || `assets/img/${item.word.toLowerCase()}.png`,
            choices: choices // L'UI recevra 3 choix si c'est un mot à élision
        }
    };
}
    }
};

// Raccourci pour utiliser les utils dans les générateurs
const { pick, rnd } = Engines.utils;

/**
 * UTILITAIRE GLOBAL : Conversion nombres en lettres (Français)
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

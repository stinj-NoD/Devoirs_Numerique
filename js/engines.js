/*
 * Devoir Numérique - Engines.js
 * Copyright (C) 2026 [Stinj-NoD]
 * Version : 3.0 (Hardened & Optimized)
 */

const Engines = {
    utils: EnginesCore.utils,

    /**
     * POINT D'ENTR�?E UNIQUE
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
                    else if (['article-choice', 'plural-choice', 'word-class-choice'].includes(params.type)) result = this.generators.grammarChoice(params, lib);
                    else if (params.type === 'grammar-cloze') result = this.generators.grammarCloze(params, lib);
                    else if (params.type === 'homophone-duel') result = this.generators.homophones(params, lib);
                    else if (params.type === 'factual-qcm') result = this.generators.factualQcm(params);
                    else result = this.generators.compare(params);
                    break;

                case 'board-interactive':
                    result = this.generators.boardInteractive(params);
                    break;

                case 'reading':
                    result = this.generators.reading(params, lib);
                    break;

                case 'audio-spelling':
                    result = this.generators.audioSpelling(params, lib);
                    break;

                case 'conjugation': result = this.generators.conjugation(params, lib); break;
                case 'clock': result = this.generators.clock(params); break;
                case 'counting': result = this.generators.counting(params); break;
                case 'timeline': result = this.generators.timeline(params); break;

                default:
                    console.error(`Moteur inconnu : ${engineType}`);
                    return this.fallback("Exercice non disponible");
            }

            // 3. Standardisation de la sortie (Anti-Undefined)
            return this.standardize(result);

        } catch (e) { /*
            console.error("�Y"� CRASH ENGINE :", e);
            */ console.error("CRASH ENGINE :", e); return this.fallback("Erreur technique de l'exercice");
        }
    },

    /**
     * Garantit que l'UI reçoit toujours un objet propre
     */
    standardize(...args) {
        return EnginesCore.standardize(...args);
    },

    fallback(...args) {
        return EnginesCore.fallback(...args);
    },

    // --- LES G�?N�?RATEURS ---
    generators: {
        
        calculate(...args) {
            return EnginesMath.calculate(...args);
        },
        numberSpelling(...args) {
            return EnginesMath.numberSpelling(...args);
        },

        conversion(...args) {
            return EnginesMath.conversion(...args);
        },

        carreSomme(...args) {
            return EnginesMath.carreSomme(...args);
        },

        conjugation(...args) {
            return EnginesFrench.conjugation(...args);
        },

        spelling(...args) {
            return EnginesFrench.spelling(...args);
        },

        homophones(...args) {
            return EnginesFrench.homophones(...args);
        },

        reading(...args) {
            return EnginesFrench.reading(...args);
        },

        boardInteractive(...args) {
            return EnginesBoard.run(...args);
        },

        audioSpelling(...args) {
            return EnginesFrench.audioSpelling(...args);
        },

        clock(...args) {
            return EnginesMath.clock(...args);
        },

        fractionView(...args) {
            return EnginesMath.fractionView(...args);
        },

        counting(...args) {
            return EnginesMath.counting(...args);
        },

        compare(...args) {
            return EnginesMath.compare(...args);
        },
        // �? ajouter dans Engines.generators dans enginesv2.js
        // �? mettre dans Engines.generators dans enginesv2.js
        genderArticles(...args) {
            return EnginesFrench.genderArticles(...args);
        },
        grammarChoice(...args) {
            return EnginesFrench.grammarChoice(...args);
        },
        grammarCloze(...args) {
            return EnginesFrench.grammarCloze(...args);
        },

factualQcm(...args) {
    return EnginesDocumentary.factualQcm(...args);
},

timeline(...args) {
    return EnginesDocumentary.timeline(...args);
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

window.Engines = Engines;


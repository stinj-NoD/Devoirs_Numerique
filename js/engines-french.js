const EnginesFrench = {
    conjugation(p, lib) {
        if (!lib?.conjugation) return Engines.fallback("Bibliothèque absente");
        const pronouns = ["Je", "Tu", "Il", "Elle", "On", "Nous", "Vous", "Ils", "Elles"];
        const tenses = Array.isArray(p.tenses) ? p.tenses : [p.tenses || "présent"];
        const selectedTense = ((Engines.utils.pick(tenses)) || "présent").toString().toLowerCase();
        const isCompound = selectedTense === 'passé composé';
        let category = p.category || 'present_1';
        try {
            if (category.startsWith('etre_avoir')) {
                const suffix = selectedTense === 'futur' ? '_f' : (selectedTense === 'imparfait' ? '_imp' : '_p');
                category = 'etre_avoir' + suffix;
            } else {
                const prefixMap = { 'présent': 'present', 'futur': 'future', 'imparfait': 'imparfait', 'passé composé': 'pc' };
                const prefix = prefixMap[selectedTense] || 'present';
                const groupMatch = p.category.match(/_(\d|3_freq)/);
                if (groupMatch) category = prefix + groupMatch[0];
            }
        } catch (e) {
            category = 'present_1';
        }
        const pool = lib.conjugation[category];
        if (!pool || !pool.length) return Engines.fallback("Verbes introuvables");
        const requestedVerbs = Array.isArray(p.verbs) ? p.verbs.map(v => (v || "").toString().toLowerCase()) : (p.verbs ? [(p.verbs || "").toString().toLowerCase()] : []);
        const filteredPool = requestedVerbs.length ? pool.filter(v => requestedVerbs.includes((v.infinitive || "").toString().toLowerCase())) : pool;
        const verb = Engines.utils.pick(filteredPool.length ? filteredPool : pool);
        const pIdx = Engines.utils.rnd(0, 8);
        const cIdx = [0, 1, 2, 2, 2, 3, 4, 5, 5][pIdx];
        let answer = "";
        if (isCompound) {
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
            answer = verb.full ? verb.full[cIdx] : (verb.base + verb.endings[cIdx]);
            if (selectedTense === "présent" && pIdx === 5) {
                if (verb.infinitive?.endsWith("ger")) answer = verb.base + "e" + verb.endings[cIdx];
                if (verb.infinitive?.endsWith("cer")) answer = verb.base.replace(/c$/, "ç") + verb.endings[cIdx];
            }
        }
        return { isVisual: true, visualType: 'conjugation', inputType: 'alpha', answer: answer.toLowerCase().trim(), data: { pronoun: pronouns[pIdx], infinitive: (verb.infinitive || "").toUpperCase(), tense: selectedTense.toUpperCase(), isCompound } };
    },
    spelling(p, lib) {
        const cat = p.category || 'animals';
        const pool = lib?.spelling?.[cat];
        if (!pool || !pool.length) return Engines.fallback("Mots indisponibles");
        const picked = Engines.utils.pick(pool);
        return { isVisual: true, visualType: 'spelling', inputType: 'alpha', answer: picked.word.toLowerCase().trim(), data: { word: picked.word.toUpperCase(), img: picked.img, icon: picked.icon } };
    },
    audioSpelling(p, lib) {
        const cat = p.category || 'animals';
        const pool = lib?.spelling?.[cat];
        if (!pool || !pool.length) return Engines.fallback("Dictée audio indisponible");
        const picked = Engines.utils.pick(pool);
        const answer = (picked.word || "").toString().trim();
        if (!answer) return Engines.fallback("Mot audio indisponible");
        return {
            isVisual: true,
            visualType: 'audioSpelling',
            inputType: 'alpha',
            question: `<span class="small-question">Écoute le mot puis écris-le.</span>`,
            answer: answer.toLowerCase(),
            data: {
                audioText: (picked.audio || answer).toString().trim(),
                targetText: answer.toUpperCase(),
                targetLength: Array.from(answer).length,
                speechRate: Number.isFinite(Number(p.speechRate)) ? Number(p.speechRate) : 0.72,
                speechPitch: Number.isFinite(Number(p.speechPitch)) ? Number(p.speechPitch) : 1.15,
                speechVolume: Number.isFinite(Number(p.speechVolume)) ? Number(p.speechVolume) : 0.9,
                category: cat
            }
        };
    },
    homophones(p, lib) {
        if (!lib?.homophones) return Engines.fallback("Lib manquante");
        let cat = p.category;
        if (cat === 'mix_all' || cat === 'mix_auto') {
            const keys = Object.keys(lib.homophones).filter(k => Array.isArray(lib.homophones[k]));
            cat = Engines.utils.pick(keys);
        }
        const pool = lib.homophones[cat];
        if (!pool || !pool.length) return Engines.fallback("Catégorie vide");
        const picked = Engines.utils.pick(pool);
        const rawQ = picked.sentence || picked.q || "";
        return { isVisual: true, visualType: 'homophones', inputType: "qcm", question: `<span class="small-question">${rawQ.replace(/(\.\.\.|___)/g, '<span style="color:var(--primary)">_____</span>')}</span>`, answer: picked.answer || picked.a, data: { choices: picked.choices || cat.split('_') } };
    },
    reading(params, lib) {
        const pool = lib?.reading?.[params.category];
        if (!pool || !pool.length) return Engines.fallback("Lecture indisponible");
        const picked = Engines.utils.pick(pool);
        const text = (picked.text || "").toString().trim();
        const syllables = Array.isArray(picked.syllables) ? picked.syllables.filter(Boolean) : [];
        const answer = (picked.answer || picked.a || text).toString().trim();
        const choices = Array.isArray(picked.choices) ? picked.choices.filter(Boolean) : [];
        const question = (picked.question || picked.prompt || "Lis et choisis la bonne réponse.").toString().trim();
        const silent = Array.isArray(picked.silent)
            ? picked.silent.map((value) => Number(value)).filter((value) => Number.isInteger(value) && value >= 0)
            : [];

        if (!text || syllables.length === 0 || !answer || choices.length < 2) {
            return Engines.fallback("Exercice de lecture incomplet");
        }

        return {
            isVisual: true,
            visualType: 'reading',
            inputType: 'qcm',
            question: `<span class="small-question">${question}</span>`,
            answer,
            data: {
                text,
                syllables,
                silent,
                choices
            }
        };
    },
    grammarChoice(params, lib) {
        const pool = lib?.grammar?.[params.category];
        if (!pool || !pool.length) return Engines.fallback("Grammaire indisponible");
        const picked = Engines.utils.pick(pool);
        const rawQuestion = (picked.question || picked.sentence || "").toString().trim();
        const answer = (picked.answer || picked.a || "").toString().trim();
        const choices = Array.isArray(picked.choices) ? picked.choices : [];
        if (!rawQuestion || !answer || choices.length < 2) {
            return Engines.fallback("Exercice de grammaire incomplet");
        }
        return {
            question: `<span class="small-question">${rawQuestion}</span>`,
            answer,
            inputType: 'qcm',
            isVisual: false,
            data: { choices }
        };
    },
    grammarCloze(params, lib) {
        const pool = lib?.grammar?.[params.category];
        if (!pool || !pool.length) return Engines.fallback("Phrase à trou indisponible");
        const picked = Engines.utils.pick(pool);
        const rawSentence = (picked.sentence || picked.question || "").toString().trim();
        const answer = (picked.answer || picked.a || "").toString().trim();
        const choices = Array.isArray(picked.choices) ? picked.choices : [];
        if (!rawSentence || !answer || choices.length < 2) {
            return Engines.fallback("Phrase à trou incomplète");
        }
        const prompt = rawSentence.includes('___')
            ? rawSentence.replace(/___/g, '<span style="color:var(--primary); font-weight:800;">_____</span>')
            : `${rawSentence} <span style="color:var(--primary); font-weight:800;">_____</span>`;
        return {
            question: `<span class="small-question">${prompt}</span>`,
            answer,
            inputType: 'qcm',
            isVisual: false,
            data: { choices }
        };
    },
    genderArticles(params, lib) {
        const cat = lib.grammar?.[params.category] || [];
        const item = Engines.utils.pick(cat);
        if (!item) return { question: "Erreur Lib", answer: "ok" };
        let expected;
        const choices = [...(params.options || ["un", "une"])];
        const voyelles = ['a', 'e', 'i', 'o', 'u', 'y', 'h'];
        const needsElision = voyelles.includes(item.word[0].toLowerCase());
        if (choices.includes("un") || choices.includes("une")) {
            expected = item.article;
        } else if (needsElision) {
            expected = "l'";
            if (!choices.includes("l'")) choices.push("l'");
        } else {
            expected = item.gender === "masculin" ? "le" : "la";
        }
        return { question: "Choisis le bon petit mot :", answer: expected, inputType: 'qcm', isVisual: true, visualType: 'spelling', data: { word: item.word.toUpperCase(), icon: item.icon, img: item.img || `assets/img/${item.word.toLowerCase()}.png`, choices } };
    }
};

const EnginesDocumentary = {
    factualQcm(p) {
        const { pick } = Engines.utils;
        const pool = p.dataSet?.categories?.[p.category] || [];

        if (!pool.length) {
            return Engines.fallback("Questions d'histoire indisponibles");
        }

        const item = pick(pool);
        if (!item?.question || !Array.isArray(item.choices) || item.choices.length < 2 || !item.answer) {
            return Engines.fallback("Question d'histoire invalide");
        }

        return {
            question: "Choisis la bonne réponse.",
            answer: item.answer,
            inputType: 'qcm',
            isVisual: true,
            visualType: 'factualCard',
            data: {
                choices: item.choices,
                prompt: item.question,
                subjectTitle: p.dataSet?.title || "Culture générale",
                subjectId: p.dataSet?.subjectId || "general"
            }
        };
    },

    timeline(p) {
        const { pick, shuffle } = Engines.utils;
        const gradeId = (p.grade || "").toString().toLowerCase();
        const gradeData = p.dataSet?.grades?.[gradeId];
        if (!gradeData) return Engines.fallback("Frise indisponible");

        const timelines = Array.isArray(gradeData.timelines) ? gradeData.timelines : [];
        const timelineDef = timelines.find((item) => item.id === p.timelineId) || timelines.find((item) => item.mode === p.mode);
        if (!timelineDef) return Engines.fallback("Activité chronologique introuvable");

        const events = Array.isArray(gradeData.events) ? gradeData.events : [];
        const eventMap = Object.fromEntries(events.map((event) => [event.id, event]));
        const items = (timelineDef.items || [])
            .map((id) => eventMap[id])
            .filter(Boolean);
        const difficultyParam = p.difficulty;
        const difficultyFilter = difficultyParam === undefined || difficultyParam === null || difficultyParam === 'mix'
            ? []
            : (Array.isArray(difficultyParam) ? difficultyParam : [difficultyParam])
                .map((value) => Number(value))
                .filter((value) => !Number.isNaN(value));
        const matchesDifficulty = (item) => difficultyFilter.length === 0 || difficultyFilter.includes(Number(item.difficulty || 1));

        if (!items.length) return Engines.fallback("Repères chronologiques manquants");

        if (timelineDef.mode === 'order') {
            let orderItems = items;
            const periodIds = [...new Set(items.map((item) => item.period).filter(Boolean))];
            const filteredItems = items.filter(matchesDifficulty);
            if (filteredItems.length >= 4) {
                orderItems = shuffle(filteredItems).slice(0, 4).sort((a, b) => a.year - b.year);
            } else if (difficultyFilter.length > 0 && periodIds.length === 1) {
                const periodItems = events.filter((event) => event.period === periodIds[0] && matchesDifficulty(event));
                if (periodItems.length >= 4) {
                    orderItems = shuffle(periodItems).slice(0, 4).sort((a, b) => a.year - b.year);
                }
            }

            const shuffled = shuffle(orderItems).map((item) => ({
                id: item.id,
                label: item.label,
                year: item.year,
                icon: item.icon || "\u{1F4CD}"
            }));

            return {
                question: timelineDef.title || "Remets les événements dans l'ordre.",
                answer: orderItems.map((item) => item.id).join(","),
                inputType: 'selection',
                isVisual: true,
                visualType: 'timelineOrder',
                data: {
                    title: timelineDef.title || "Ordre chronologique",
                    orderedIds: orderItems.map((item) => item.id),
                    orderedLabels: orderItems.map((item) => `${item.icon || "\u{1F4CD}"} ${item.label}`),
                    currentOrder: shuffled.map((item) => item.id),
                    cards: shuffled
                }
            };
        }

        if (timelineDef.mode === 'place') {
            const targetPool = items.filter(matchesDifficulty);
            const target = pick(targetPool.length ? targetPool : items);
            if (!target) return Engines.fallback("Repère chronologique manquant");
            const range = timelineDef.range || p.range || [0, 2000];
            const step = Number(timelineDef.step || p.step || 100);
            const choiceCount = Math.max(4, Math.min(6, Number(timelineDef.choiceCount || p.choiceCount || 5)));
            const start = Number(range[0] || 0);
            const end = Number(range[1] || 0);
            const sameTimelineYears = items
                .filter((item) => item.id !== target.id && matchesDifficulty(item))
                .map((item) => item.year);
            const samePeriodYears = events
                .filter((event) => event.id !== target.id && event.period === target.period && event.year >= start && event.year <= end && matchesDifficulty(event))
                .map((event) => event.year);
            const inRangeYears = events
                .filter((event) => event.id !== target.id && event.year >= start && event.year <= end && matchesDifficulty(event))
                .map((event) => event.year);
            const gridYears = [];

            if (step > 0 && end >= start) {
                for (let year = start; year <= end; year += step) {
                    gridYears.push(year);
                }
            }

            const candidatePool = [...new Set([
                ...sameTimelineYears,
                ...samePeriodYears,
                ...inRangeYears,
                ...gridYears
            ])].filter((year) => year !== target.year);

            const distractors = shuffle(candidatePool)
                .slice(0, Math.max(0, choiceCount - 1));
            const candidateMarkers = [...distractors, target.year].sort((a, b) => a - b);
            const targetYearText = Math.abs(Number(target.year)).toString();
            const escapedYear = targetYearText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let promptLabel = (target.label || "").toString()
                .replace(new RegExp(`\\b(?:de\\s+|du\\s+|en\\s+)?${escapedYear}\\b`, 'i'), '')
                .replace(/\s{2,}/g, ' ')
                .replace(/\s+([,.:;!?])/g, '$1')
                .trim();

            if (!promptLabel) promptLabel = target.label;

            return {
                question: timelineDef.title || "Place l'événement sur la frise.",
                answer: target.year.toString(),
                inputType: 'selection',
                isVisual: true,
                visualType: 'timelinePlace',
                data: {
                    title: timelineDef.title || "Placer sur la frise",
                    prompt: promptLabel,
                    icon: target.icon || "\u{1F4CD}",
                    range,
                    step,
                    markers: candidateMarkers,
                    targetYear: target.year,
                    selectedYear: null
                }
            };
        }

        return Engines.fallback("Mode chronologique inconnu");
    }
};

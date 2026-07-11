const EnginesCore = {
    utils: {
        rnd(min, max) {
            if (min > max) [min, max] = [max, min];
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        pick(arr) {
            return (Array.isArray(arr) && arr.length > 0) ? arr[Math.floor(Math.random() * arr.length)] : null;
        },

        /**
         * Pioche un élément du tableau en excluant les index déjà présents
         * dans usedSet (un Set d'index, muté en place pour mémoriser le
         * tirage). Évite qu'une même question revienne plusieurs fois dans
         * une même session tant que le pool n'est pas épuisé ; une fois tous
         * les index utilisés, le Set est vidé et le tirage redevient libre
         * (avec remise) plutôt que de bloquer si plus de questions sont
         * demandées que le pool n'en contient.
         */
        pickUnused(arr, usedSet) {
            if (!Array.isArray(arr) || arr.length === 0) return null;
            if (!(usedSet instanceof Set)) {
                return arr[Math.floor(Math.random() * arr.length)];
            }
            if (usedSet.size >= arr.length) usedSet.clear();

            const availableIndices = [];
            for (let i = 0; i < arr.length; i++) {
                if (!usedSet.has(i)) availableIndices.push(i);
            }
            const chosenIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            usedSet.add(chosenIndex);
            return arr[chosenIndex];
        },

        shuffle(arr) {
            const newArr = [...arr];
            for (let i = newArr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
            }
            return newArr;
        },

        romanize(num) {
            if (!+num) return false;
            const digits = String(+num).split("");
            const key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
                "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
                "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
            let roman = "";
            let i = 3;
            while (i--) roman = (key[+digits.pop() + (i * 10)] || "") + roman;
            return Array(+digits.join("") + 1).join("M") + roman;
        },

        deromanize(str) {
            const roman = str.toUpperCase();
            const lookup = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
            let num = 0;
            let p = 0;
            for (let i = roman.length - 1; i >= 0; i--) {
                const curr = lookup[roman.charAt(i)];
                if (curr >= p) num += curr;
                else num -= curr;
                p = curr;
            }
            return num;
        }
    },

    standardize(res) {
        return {
            question: res.question || "",
            answer: (res.answer !== undefined && res.answer !== null) ? res.answer.toString() : "error",
            inputType: res.inputType || "numeric",
            isVisual: !!res.isVisual,
            visualType: res.visualType || null,
            data: res.data || {}
        };
    },

    fallback(msg) {
        return { question: msg, answer: "0", inputType: 'numeric', isVisual: false };
    }
};

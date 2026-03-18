const EnginesCore = {
    utils: {
        rnd(min, max) {
            if (min > max) [min, max] = [max, min];
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        pick(arr) {
            return (Array.isArray(arr) && arr.length > 0) ? arr[Math.floor(Math.random() * arr.length)] : null;
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

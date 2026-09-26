/*
 * Devoir Numérique - Le Grand Quiz (culture générale)
 * Extrait de app.js (découpage mécanique, aucun changement de logique).
 * Fusionné sur le même objet App : this.state et les méthodes des autres
 * modules restent accessibles normalement (même objet partagé).
 */
Object.assign(App, {
    // --- LE GRAND QUIZ (culture générale, sans chrono) ---

    quizQuestionsPerGame: 10,

    async getQuizCatalog() {
        if (!this._quizCatalogCache) {
            try {
                this._quizCatalogCache = await this.fetchJson(['data/quiz_culture.json', './data/quiz_culture.json']);
            } catch (e) {
                console.error('Questions du Grand Quiz indisponibles', e);
                this._quizCatalogCache = { levels: [] };
            }
        }
        return this._quizCatalogCache;
    },

    _shuffleArray(list) {
        const copy = [...list];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    },

    async showQuizHome() {
        const catalog = await this.getQuizCatalog();
        const levels = (catalog.levels || []).map((level) => ({
            id: level.id,
            label: level.label,
            icon: level.icon,
            scores: Storage.getQuizScores(level.id)
        }));
        UI.renderBrowseModes(levels.map((level) => ({
            id: `quiz-level-${level.id}`,
            mode: 'quiz',
            icon: level.icon,
            title: level.label,
            subtitle: `${this.quizQuestionsPerGame} questions surprises`,
            helper: 'Lancer le quiz.',
            levelId: level.id
        })), (entry) => this.startQuiz(entry.levelId), 'quiz-level-list');
        UI.renderQuizScores(levels);
        UI.showScreen('screen-quiz-home');
    },

    async startQuiz(levelId) {
        const catalog = await this.getQuizCatalog();
        const level = (catalog.levels || []).find((l) => l.id === levelId);
        if (!level || !Array.isArray(level.questions) || !level.questions.length) return;

        // 10 questions au hasard, choix mélangés (on suit l'index de la bonne
        // réponse à travers le mélange)
        const questions = this._shuffleArray(level.questions)
            .slice(0, this.quizQuestionsPerGame)
            .map((q) => {
                const order = this._shuffleArray(q.choices.map((_, i) => i));
                return {
                    q: q.q,
                    theme: q.theme || '',
                    info: q.info || '',
                    choices: order.map((i) => q.choices[i]),
                    correctIndex: order.indexOf(q.answer)
                };
            });

        this.state.quiz = {
            levelId: level.id,
            levelLabel: level.label,
            questions,
            index: 0,
            score: 0,
            answered: false
        };
        UI.showScreen('screen-quiz-play');
        this.renderQuizQuestion();
    },

    renderQuizQuestion() {
        const quiz = this.state.quiz;
        if (!quiz) return;
        const question = quiz.questions[quiz.index];
        quiz.answered = false;
        UI.renderQuizQuestion({
            index: quiz.index,
            total: quiz.questions.length,
            score: quiz.score,
            theme: question.theme,
            question: question.q,
            choices: question.choices
        }, (selectedIndex) => this.answerQuizQuestion(selectedIndex));
    },

    answerQuizQuestion(selectedIndex) {
        const quiz = this.state.quiz;
        if (!quiz || quiz.answered) return;
        quiz.answered = true;
        const question = quiz.questions[quiz.index];
        const correct = selectedIndex === question.correctIndex;
        if (correct) quiz.score++;
        const scoreLabel = document.getElementById('quiz-score-label');
        if (scoreLabel) scoreLabel.textContent = `⭐ ${quiz.score}`;
        UI.showQuizFeedback({
            selectedIndex,
            correctIndex: question.correctIndex,
            info: question.info,
            isLast: quiz.index === quiz.questions.length - 1
        }, () => {
            if (quiz.index < quiz.questions.length - 1) {
                quiz.index++;
                this.renderQuizQuestion();
            } else {
                this.finishQuiz();
            }
        });
    },

    finishQuiz() {
        const quiz = this.state.quiz;
        if (!quiz) return;
        const total = quiz.questions.length;
        // Petit gain de pièces (Grimoire) : la moitié du score, +3 si sans
        // faute. Volontairement modeste : le quiz est rejouable à volonté.
        const coins = Math.floor(quiz.score / 2) + (quiz.score === total ? 3 : 0);
        if (coins > 0) {
            Storage.addCoins(coins);
            this.refreshCoinsDisplays();
        }
        const podium = Storage.saveQuizScore(quiz.levelId, quiz.score, total) || [];
        const currentUser = Storage.getCurrentUser();
        const rankIndex = podium.findIndex((e) => e.name === currentUser && e.score === quiz.score);
        UI.renderQuizResults({
            score: quiz.score,
            total,
            coins,
            levelLabel: quiz.levelLabel,
            rank: rankIndex >= 0 ? rankIndex + 1 : null,
            podium
        }, () => this.startQuiz(quiz.levelId), () => this.showQuizHome());
        this.state.quiz = null;
        UI.showScreen('screen-quiz-results');
    },
});

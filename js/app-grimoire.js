/*
 * Devoir Numérique - Grimoire (collection de cartes, boosters)
 * Extrait de app.js (découpage mécanique, aucun changement de logique).
 * Fusionné sur le même objet App : this.state et les méthodes des autres
 * modules restent accessibles normalement (même objet partagé).
 */
Object.assign(App, {
    mapCollectionDefinitions: [
        { mapId: 'france-regions', icon: '🇫🇷', label: 'France (régions)' },
        { mapId: 'world-continents', icon: '🌍', label: 'Le monde (continents)' },
        { mapId: 'europe-countries', icon: '🇪🇺', label: "L'Europe" },
        { mapId: 'asia-countries', icon: '🌏', label: "L'Asie" },
        { mapId: 'africa-countries', icon: '🌍', label: "L'Afrique" },
        { mapId: 'north-america-countries', icon: '🌎', label: "L'Amérique du Nord" },
        { mapId: 'south-america-countries', icon: '🌎', label: "L'Amérique du Sud" }
    ],

    /**
     * Pour chaque carte connue (mapCollectionDefinitions), regarde tous les
     * exercices map-locate de TOUS les niveaux (pas seulement celui en
     * cours) qui pointent vers ce mapId, et la considère débloquée si l'un
     * d'eux a été réussi à au moins 50% — le même seuil que "à revoir" déjà
     * utilisé dans l'écran de progression.
     */
    getMapCollectionStatus() {
        const gradeFiles = ['cp', 'ce1', 'ce2', 'cm1', 'cm2'];
        const cachedGrades = this._collectionGradesCache || {};
        const exercisesByMapId = {};

        gradeFiles.forEach((gradeId) => {
            const gradeData = cachedGrades[gradeId];
            if (!gradeData) return;
            const subjects = Array.isArray(gradeData.subjects) ? gradeData.subjects : [];
            subjects.forEach((subject) => {
                (subject?.subthemes || []).forEach((subtheme) => {
                    (subtheme?.exercises || []).forEach((exercise) => {
                        if (exercise.engine !== 'board-interactive' || exercise.params?.type !== 'map-locate') return;
                        const mapId = exercise.params?.mapId;
                        if (!mapId) return;
                        if (!exercisesByMapId[mapId]) exercisesByMapId[mapId] = [];
                        exercisesByMapId[mapId].push({ exercise, gradeId });
                    });
                });
            });
        });

        return this.mapCollectionDefinitions.map((def) => {
            const entries = exercisesByMapId[def.mapId] || [];
            const unlocked = entries.some(({ exercise, gradeId }) => {
                const record = Storage.getRecord(exercise.id, gradeId);
                const percent = record ? Math.round((record.lastPercent ?? record.percent) || 0) : 0;
                return percent >= 50;
            });
            return { ...def, unlocked };
        });
    },

    subjectCollectionDefinitions: [
        { keywords: ['français', 'francais'], icon: '📖', label: 'Champion de français' },
        { keywords: ['math'], icon: '🔢', label: 'Champion de maths' },
        { keywords: ['sciences', 'science'], icon: '🔬', label: 'Champion de sciences' },
        { keywords: ['histoire'], icon: '🏛️', label: "Champion d'histoire" },
        { keywords: ['géographie', 'geographie'], icon: '🗺️', label: 'Champion de géographie' },
        { keywords: ['emc', 'morale', 'civique'], icon: '🤝', label: 'Champion EMC' }
    ],

    /**
     * Série "Champion de matière" : un badge débloqué par matière si la
     * moyenne d'étoiles sur tous les exercices tentés de cette matière (toutes
     * classes confondues) atteint 2,5/3 — réutilise les records déjà stockés,
     * pas de nouveau contenu à créer pour étendre la Collection.
     */
    getSubjectCollectionStatus() {
        const cachedGrades = this._collectionGradesCache || {};
        const starsBySubjectKeyword = {};

        Object.entries(cachedGrades).forEach(([gradeId, gradeData]) => {
            const subjects = Array.isArray(gradeData?.subjects) ? gradeData.subjects : [];
            subjects.forEach((subject) => {
                const title = (subject?.title || '').toLowerCase();
                (subject?.subthemes || []).forEach((subtheme) => {
                    (subtheme?.exercises || []).forEach((exercise) => {
                        if (exercise.isBonus) return;
                        const record = Storage.getRecord(exercise.id, gradeId);
                        if (!record) return;
                        if (!starsBySubjectKeyword[title]) starsBySubjectKeyword[title] = { stars: 0, count: 0 };
                        starsBySubjectKeyword[title].stars += record.stars || 0;
                        starsBySubjectKeyword[title].count++;
                    });
                });
            });
        });

        return this.subjectCollectionDefinitions.map((def) => {
            let totalStars = 0;
            let totalCount = 0;
            Object.entries(starsBySubjectKeyword).forEach(([title, stats]) => {
                if (def.keywords.some((keyword) => title.includes(keyword))) {
                    totalStars += stats.stars;
                    totalCount += stats.count;
                }
            });
            const average = totalCount > 0 ? totalStars / totalCount : 0;
            return { ...def, unlocked: totalCount >= 5 && average >= 2.5 };
        });
    },

    /**
     * Séries à collectionner, débloquées par la maîtrise (≥ 75%) d'exercices
     * de la matière liée. Récompense la progression réelle plutôt que le
     * temps d'écran : chaque carte a un seuil croissant d'exercices maîtrisés.
     * Pas d'emojis drapeaux (rendu cassé sous Windows).
     */
    themedCollectionDefinitions: [
        {
            id: 'animaux', title: 'Animaux', subject: 'sciences',
            cards: [
                { icon: '🐞', label: 'Coccinelle', requires: 1, fact: "Une coccinelle peut manger jusqu'à 100 pucerons par jour : c'est l'amie des jardiniers !" },
                { icon: '🦔', label: 'Hérisson', requires: 3, fact: "Le hérisson a environ 6000 piquants et dort tout l'hiver : c'est l'hibernation." },
                { icon: '🦉', label: 'Chouette', requires: 6, fact: "La chouette peut tourner sa tête aux trois quarts, mais ses yeux, eux, ne bougent pas !" },
                { icon: '🦊', label: 'Renard', requires: 10, fact: "Le renard utilise le champ magnétique de la Terre pour viser quand il bondit sur une proie." },
                { icon: '🐬', label: 'Dauphin', requires: 15, fact: "Le dauphin dort avec une moitié du cerveau éveillée pour penser à remonter respirer." },
                { icon: '🦁', label: 'Lion', requires: 20, fact: "Le rugissement du lion s'entend jusqu'à 8 kilomètres : c'est le plus puissant des félins." }
            ]
        },
        {
            id: 'monuments', title: 'Monuments', subject: 'histoire',
            cards: [
                { icon: '🗼', label: 'Tour Eiffel', requires: 1, fact: "La tour Eiffel grandit d'environ 15 cm l'été : le métal se dilate avec la chaleur !" },
                { icon: '🏰', label: 'Château fort', requires: 3, fact: "Les escaliers des châteaux forts tournent souvent dans le sens qui gênait l'épée des attaquants." },
                { icon: '🏛️', label: 'Temple antique', requires: 6, fact: "Le Parthénon d'Athènes a près de 2500 ans et a inspiré des monuments dans le monde entier." },
                { icon: '🕌', label: 'Palais oriental', requires: 10, fact: "Le Taj Mahal, en Inde, a demandé plus de 20 ans de travail à 20 000 ouvriers." },
                { icon: '🗿', label: 'Statue mystérieuse', requires: 15, fact: "Les statues de l'île de Pâques, les moaï, peuvent peser aussi lourd que 10 éléphants." },
                { icon: '🏯', label: 'Château japonais', requires: 20, fact: "Le château de Himeji, au Japon, est surnommé « le héron blanc » à cause de ses murs blancs." }
            ]
        },
        {
            id: 'tresors-monde', title: 'Trésors du monde', subject: 'geo',
            cards: [
                { icon: '🏝️', label: 'Île tropicale', requires: 1, fact: "Il existe plus de 100 000 îles sur Terre, et la plus grande est le Groenland." },
                { icon: '🏔️', label: 'Haute montagne', requires: 3, fact: "L'Everest, plus haut sommet du monde, grandit encore de quelques millimètres chaque année !" },
                { icon: '🌋', label: 'Volcan', requires: 6, fact: "Il y a environ 1500 volcans actifs sur Terre, et beaucoup d'autres sous les océans." },
                { icon: '🏜️', label: 'Désert', requires: 10, fact: "Le Sahara est presque aussi grand que l'Europe entière… et il neige parfois dessus !" },
                { icon: '🌊', label: 'Grande vague', requires: 15, fact: "Les océans couvrent plus de 70 % de la Terre : voilà pourquoi on l'appelle la planète bleue." },
                { icon: '🗻', label: 'Mont légendaire', requires: 20, fact: "Le mont Fuji, au Japon, est un volcan sacré que des milliers de personnes gravissent chaque été." }
            ]
        }
    ],

    getThemedCollectionStatus() {
        const mastery = Storage.getSubjectMasteryCounts();
        return this.themedCollectionDefinitions.map((series) => {
            const count = mastery[series.subject] || 0;
            const cards = series.cards.map((card) => ({ ...card, unlocked: count >= card.requires }));
            return {
                id: series.id,
                title: series.title,
                unlockedCount: cards.filter((c) => c.unlocked).length,
                totalCount: cards.length,
                cards
            };
        });
    },

    // ---------- GRIMOIRE ----------

    async getCardsCatalog() {
        if (this._cardsCatalogCache) return this._cardsCatalogCache;
        // Une seule requête même en cas d'appels concurrents (en-tête +
        // écran des profils peuvent demander le catalogue en même temps)
        if (!this._cardsCatalogPromise) {
            this._cardsCatalogPromise = this.fetchJson(['data/cards.json', './data/cards.json'])
                .catch((e) => {
                    console.error('Catalogue de cartes indisponible', e);
                    return { cards: [], rarities: {} };
                })
                .then((catalog) => {
                    this._cardsCatalogCache = catalog;
                    return catalog;
                });
        }
        return this._cardsCatalogPromise;
    },

    // Met à jour tous les compteurs de pièces affichés (bouton d'entrée sur
    // l'écran des classes + en-tête du Grimoire). À appeler après tout gain
    // ou dépense de pièces.
    refreshCoinsDisplays() {
        const coins = Storage.getCoins();
        const entry = document.getElementById('grimoire-entry-coins');
        if (entry) entry.textContent = `🪙 ${coins}`;
        UI.updateGrimoireCoins(coins);
    },

    // Toasts de séries complétées, espacés pour ne pas se chevaucher
    _toastCompletedSeries(completed) {
        (completed || []).forEach((serie, i) => {
            setTimeout(() => {
                UI.showSimpleToast(serie.icon, `${serie.label} complète ! +${serie.bonus} 🪙`);
            }, 400 + i * 3500);
        });
    },

    async showGrimoire() {
        const catalog = await this.getCardsCatalog();
        // Rétroactif : crédite les séries déjà complètes jamais récompensées
        const completed = Storage.claimSeriesBonuses(catalog);
        UI.renderGrimoire(
            catalog,
            Storage.getOwnedCards(),
            Storage.getCoins(),
            (size) => this.openBoosterBundleFlow(size)
        );
        this.refreshCoinsDisplays();
        UI.showScreen('screen-grimoire');
        this._toastCompletedSeries(completed);
    },

    /**
     * Ouvre 1, 5 ou 10 boosters. Le ×1 passe par le même chemin que les lots :
     * c'est le même geste en trois quantités, une seule fonction évite que les
     * deux parcours divergent.
     * Un seul paquet à déchirer même pour un lot — répéter le geste 10 fois
     * serait pénible.
     */
    async openBoosterBundleFlow(size) {
        const catalog = await this.getCardsCatalog();
        if (!catalog.cards.length) return;

        const price = Storage.getBoosterBundlePrice(size);
        if (price === null) return;
        if (Storage.getCoins() < price) {
            const quoi = size > 1 ? `un lot de ${size}` : 'un booster';
            UI.showSimpleToast('🪙', `Il te faut ${price} pièces pour ${quoi}. Gagne des étoiles !`);
            return;
        }

        const result = Storage.openBoosterBundle(catalog, size);
        if (!result) return;
        // Bonus de série éventuel : crédité tout de suite, annoncé à la fin
        // de la révélation pour ne pas déflorer le contenu du paquet.
        const completed = Storage.claimSeriesBonuses(catalog);
        const done = () => this._afterBoosterReveal(catalog, completed);
        if (size > 1) UI.renderBoosterBundleReveal(result, catalog, done);
        else UI.renderBoosterReveal(result.packs[0], catalog, done);
        this.refreshCoinsDisplays();
    },

    // Retour au Grimoire après une révélation (unitaire ou lot).
    _afterBoosterReveal(catalog, completed) {
        UI.renderGrimoire(
            catalog,
            Storage.getOwnedCards(),
            Storage.getCoins(),
            (size) => this.openBoosterBundleFlow(size)
        );
        this.refreshCoinsDisplays();
        this._toastCompletedSeries(completed);
    },

    async loadAllGradesCache() {
        if (!this._collectionGradesCache) {
            this._collectionGradesCache = {};
            try {
                const index = await this.fetchJson(['data/index.json', './data/index.json']);
                const loaded = await Promise.all((index.grades || []).map((g) =>
                    this.fetchJson([g.dataFile, `./${g.dataFile.replace(/^\.\//, '')}`]).catch(() => null)
                ));
                this._gradesIndexCache = index.grades || [];
                (index.grades || []).forEach((g, i) => { this._collectionGradesCache[g.id] = loaded[i]; });
            } catch (error) {
                console.error("Impossible de charger les niveaux", error);
            }
        }
        return this._collectionGradesCache;
    },

    async showCollectionScreen() {
        await this.loadAllGradesCache();
        UI.renderCollectionBadges(Storage.getBadges());
        UI.renderCollectionMaps(this.getMapCollectionStatus());
        UI.renderCollectionSubjects(this.getSubjectCollectionStatus());
        UI.renderCollectionThemes(this.getThemedCollectionStatus());
        UI.showScreen('screen-collection');
    },
});

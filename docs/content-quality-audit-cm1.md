# Audit qualité de contenu — CM1

> Audit indépendant de la qualité intrinsèque de chaque leçon et exercice du niveau CM1 (exactitude factuelle, clarté pédagogique, adéquation au niveau, cohérence technique), distinct de [`curriculum-audit-cm1.md`](curriculum-audit-cm1.md) qui évalue la couverture du programme. Réalisé le **2026-07-30**, par lecture intégrale (sans échantillonnage) de `data/cm1.json` et de toutes les banques externes qu'il référence : `data/emc_cm1.json`, `data/emc_matching.json`, `data/science_cm1.json`, `data/science_matching.json`, `data/geography_cm1.json`, `data/geography_capitals_cm1.json`, `data/geography_matching.json`, `data/history_cm1.json`, `data/history_chrono.json`, `data/history_matching.json`, `data/math_geometry_cm1.json`, `data/math_matching.json`, `data/math_word_problems_cycle3.json` (catégories `cm1-*`), `data/french/reading.json`, `data/french_cm1_reading.json`, `data/french_word_order.json`, ainsi que les banques `board-interactive` (`board_angle_classify_cm1.json`, `board_angle_measure_cm1.json`, `board_construction_cm1.json`, `board_geometry_cm1.json`, `board_map_locate_cm1.json`, `board_map_locate_{africa,asia,europe,north_america,south_america,world}.json`, `board_point_on_grid_cm1.json`, `board_shape_classify_cm1.json`, `board_symmetry_complete_cm1.json`, `board_tap_features_cm1.json`).
>
> Sources faisant autorité : BO cycle 3 (2020/2018), ressources Eduscol, dictionnaire/Bescherelle, IGN/Insee, Quai d'Orsay pour les toponymes officiels.
>
> **Différence méthodologique importante par rapport à CP/CE1/CE2** : le CM1 est en cycle 3, où dates précises, périodes historiques nommées (Préhistoire, Antiquité, Moyen Âge, Temps modernes), régions administratives françaises et notions de base des institutions de la République sont le programme normal — pas une fuite comme aux niveaux précédents. Seul un luxe de détail relevant du collège/lycée (rouages précis des institutions nationales) est classé comme excès de niveau.
>
> **Note méthodologique sur cette révision** : cette version remplace deux versions antérieures dont un nombre important de findings — dans les deux cas — se sont révélés non reproductibles à la vérification directe : soit déjà corrigés depuis, soit issus d'une lecture erronée du contenu. En particulier, l'environnement d'exécution utilisé pour cet audit a une page de code console (CP850, Windows) qui **déforme visuellement les caractères accentués** lors d'un simple `print()`/`grep` affiché à l'écran — un « Où » peut s'afficher comme s'il s'agissait d'un « Oé », un « protège » comme un « protége ». Toute citation ci-dessous a donc été confirmée par au moins une des deux méthodes suivantes, jamais par une simple relecture visuelle d'un flux de console : (a) lecture directe du fichier via l'outil de lecture de fichier (qui rend l'UTF-8 correctement), ou (b) vérification booléenne Python sur le contenu décodé, écrite dans un fichier intermédiaire puis relue. Les findings qui n'ont pas résisté à cette double vérification sont listés explicitement en fin de document, avec la raison de leur retrait.
>
> **Contexte d'édition concurrente constaté pendant cette relecture** : plusieurs fichiers de contenu CM1 (`data/emc_cm1.json`, `data/cm1.json`, `data/science_cm1.json`, `data/french/homophones.json`) et `CONTENT_INDEX.json`/`js/version.js`/`js/data-bundle.js` portaient déjà des modifications non commitées au moment de la rédaction de cet audit — vraisemblablement une correction/production de contenu menée en parallèle (le `git diff` montre notamment que « lé oé », « protége », « Oé », et une question EMC sur la Constitution formulée en termes plus institutionnels avaient déjà été corrigés dans l'arbre de travail par rapport au commit `HEAD`). Cet audit décrit fidèlement **l'état du disque au moment de sa rédaction**, qui intègre déjà ces corrections — pas l'état du dernier commit. Cela explique pourquoi certains findings d'un rapport intermédiaire consulté en cours de route (citant « lé oé », « cœour », « géle ») n'étaient déjà plus reproductibles au moment de la vérification.
>
> **Aucune correction n'a été appliquée dans cette phase par cet audit.** Ce document liste les problèmes trouvés ; la correction fait l'objet d'une phase séparée (souvent confiée ensuite à `exercise-author` ou à une intervention manuelle).

> **Mise à jour du 2026-07-30 (postérieure à cet audit) : le Bloquant et les 2 Majeurs corrigés.** Le Bloquant français (« cœur de pierre » corrompu) a été corrigé dans `data/french/reading.json` et `data/french_cm1_reading.json`. Le Majeur EMC (16 typos d'accentuation confirmées dans `data/emc_cm1.json`, section « Exercices » ci-dessous) a été corrigé, ainsi que les 2 items isolés (« Noél »→« Noël », phrase illisible reformulée) ; à cette occasion, les 4 items de `cm1-citoyennete` jugés à la limite haute du niveau (Constitution, suffrage universel, Assemblée nationale, drapeau européen) ont été simplifiés pour rester strictement CM1, plutôt que déplacés vers CM2. Le Majeur technique géométrique (`board_angle_measure_cm1.json`, 4 items sur 12 où le choix le plus proche ne correspondait pas à `answerDegrees`) a été corrigé par recalcul des coordonnées des segments. `data/science_cm1.json` a également reçu une correction ponctuelle (« géle »→« gèle », signalée comme non reproductible dans une relecture antérieure mais réapparue). Les points Mineurs/Suggestions (doublons de vivier, BOM UTF-8, fusion `french_cm1_reading.json`, `cm1_lecture_inference_simple` orphelin, `board_geometry_cm1.json` orphelin partiel) restent ouverts, non traités par cette vague. Ce paragraphe signale l'action menée ; il ne remplace pas un réaudit complet.

## Synthèse générale

| Sévérité | Maths | Français | Histoire | Géographie | Sciences | EMC | Total |
|---|---|---|---|---|---|---|---|
| Bloquant | 0 | 1 | 0 | 0 | 0 | 0 | **1** |
| Majeur | 0 | 0 | 0 | 0 | 1 | 1 | **2** |
| Mineur | 1 | 2 | 0 | 0 | 1 | 2 | **6** |
| Suggestion | 1 | 1 | 1 | 0 | 1 | 1 | **6** |

74 leçons et 211 exercices dans `data/cm1.json` au moment de la rédaction (un lot de contenu Maths/Français était en cours d'ajout concurremment à cet audit — les nouveaux items ont été relus et ne présentent aucune anomalie), plus lecture intégrale des banques externes citées ci-dessus (~1900 items QCM/matching/timeline/board-interactive au total).

**Bonne nouvelle générale, confirmée à la relecture** : le contenu factuel du CM1 reste le plus rigoureux rencontré jusqu'ici sur ce projet. L'Histoire est exacte et chronologiquement cohérente sur les 45 événements de `history_chrono.json` vérifiés un à un (chute de Rome 476, sacre de Charlemagne 800, Hugues Capet 987, Jeanne d'Arc 1429, imprimerie ~1450, Christophe Colomb 1492...) et sur les 8 groupes d'appariement de `history_matching.json`. La Géographie affiche une précision remarquable sur les 156 capitales du monde (Gitega, Dodoma, Naypyidaw, **Kyiv** déjà utilisé — pas « Kiev » —, Pretoria déjà nuancée par rapport au Cap et Bloemfontein). La carte interactive des régions françaises (`cm1-geo-carte-regions`, `data/board_map_locate_cm1.json`) et sa leçon dédiée (`cm1-lesson-regions-france`) existent et sont cohérentes avec le SVG (confirmé par `node scripts/validate-maps.js`).

**Anomalie transverse n°1 — BOM UTF-8 en tête de 17 banques CM1**, jamais documentée dans les audits antérieurs. `data/geography_cm1.json`, `data/geography_capitals_cm1.json`, `data/geography_matching.json`, `data/history_cm1.json`, `data/history_chrono.json`, `data/history_matching.json`, `data/math_geometry_cm1.json`, `data/math_matching.json`, `data/science_matching.json`, `data/french_word_order.json`, `data/board_shape_classify_cm1.json` et les 6 fichiers `data/board_map_locate_{africa,asia,europe,north_america,south_america,world}.json` commencent tous par un BOM (`EF BB BF`). Le bundle (`js/data-bundle.js` via `js/app.js::fetchJson`) strip déjà le BOM, donc le mode `file://`/offline n'est pas affecté aujourd'hui ; mais un `JSON.parse` strict en Node échoue dessus (vérifié en pratique), point de fragilité si un traitement hors-runtime venait à lire ces fichiers directement.

**Anomalie transverse n°2 — doublons de vivier plus fréquents qu'aux niveaux précédemment audités.** `node scripts/build-content-index.js --check` relève, tous niveaux confondus, 479 avertissements de doublon « mou » (non bloquants par convention du projet), dont plusieurs dizaines de groupes impliquant le CM1 — des groupes de 3 à 4 exercices distincts pointant vers exactement la même catégorie de banque (`dataFile::category`), au-delà du couple normal « exercice + défi bonus ». Concentré en Sciences (vivant : 4 exercices sur 42 items ; électricité : 4 exercices sur 15 items ; environnement : 4 exercices sur 15 items) et en EMC (vivre-ensemble : 3 exercices sur 42 items ; droits-devoirs : 3 sur 41 items). Le risque de recoupement de questions entre deux exercices « différents » du même sous-thème est réel surtout sur les pools les plus petits (15 items partagés entre 4 exercices de 6-10 questions). Classé Mineur par matière ci-dessous.

---

## Mathématiques CM1

### Leçons

**Mineur** — `cm1-lesson-problemes-calcul` et `cm1-lesson-resoudre-probleme` (sous-thème `cm1-nombres-calculs`) partagent le même titre affiché (« Résoudre un problème »). Vérification faite sur le contenu réel : les deux leçons ont des exemples et des angles pédagogiques distincts (l'une porte sur la détection d'un résultat aberrant par soustraction, l'autre sur le repérage d'une donnée inutile et un calcul à deux étapes) — ce n'est donc pas un doublon de contenu, seulement un doublon de titre qui peut dérouter un enfant qui croit refaire la même leçon. Correction suggérée : différencier les titres (ex. « Résoudre un problème : vérifier sa réponse » / « Résoudre un problème : repérer les données utiles »).

### Exercices

Aucun Bloquant ni Majeur. `answer` ⊂ `choices` vérifié programmatiquement à 100 % sur toutes les banques QCM référencées par le CM1 (0 incohérence). Les dictées de grands nombres (`cm1-m-big-2` : `max: 100000`, `cm1-m-big-3` : `max: 999999`) restent dans les bornes cycle 3 (sous le million) — aucune dérive vers 100 millions constatée. Les fractions (`cm1-frac-3`) plafonnent à `maxDenom: 12` sur l'ensemble du fichier.

**Suggestion** — l'exercice `board_tap_features_cm1.json` (catégorie `cm1_tap_angle_droit`) a été relu item par item : l'item « aucun angle droit » précise déjà explicitement « Ne touche aucun sommet », et aucun des 11 items ne combine consigne générique et zéro angle droit correct sans avertissement — l'ambiguïté redoutée dans une version antérieure de cet audit n'existe pas dans l'état actuel du fichier. Rien à corriger ; rester vigilant si de nouveaux items sont ajoutés sans consigne explicite en cas de « zéro bonne réponse ».

**Points positifs** : symétries sur quadrillage, report de compas et classification de formes (`board_shape_classify_cm1.json`, `board_symmetry_complete_cm1.json`, `board_point_on_grid_cm1.json`, `board_construction_cm1.json`) 100 % géométriquement exacts après vérification programmatique des coordonnées ; aucun mojibake ni typo détecté sur `data/cm1.json` après un balayage exhaustif dédié (mots sans accent, motifs de corruption connus) ; aucun bug de paramétrage détecté.

**Résumé** : Bloquant 0, Majeur 0, Mineur 1, Suggestion 1 (22 leçons, 60 exercices)

---

## Français CM1

### Anomalie de branchement (précisée par rapport aux audits antérieurs)

`data/french_cm1_reading.json` (811 items, 9 catégories) est confirmé orphelin par le code (`loadFrenchLibrary` dans `js/app.js` ne référence que `data/french/reading.json`). Comparaison faite catégorie par catégorie entre les deux fichiers (par recouvrement exact des questions) :
- **Doublon quasi total (85-100 %)** : `cm1_lecture_mot_contexte` (100/100), `cm1_lecture_ordre_evenements` (101/101), `cm1_lecture_inferences` (10/10), `cm1_lecture_synonymes` (92/100), `cm1_lecture_antonymes` (85/100).
- **Contenu très largement distinct malgré le nom de catégorie identique** : `cm1_lecture_idee_principale` (6/100 en commun), `cm1_lecture_expression_imagee` (2/100), `cm1_lecture_fait_opinion` (1/100).
- **Orphelin exclusif, jamais servi** : `cm1_lecture_inference_simple` (100 items, absent du fichier servi).

Recommandation inchangée : une fusion avec dédoublonnage fin catégorie par catégorie, pas un rebranchement direct ni un simple abandon — le taux de recouvrement réel varie de 1 % à 100 % selon la catégorie.

### Leçons

Aucune anomalie sur les 16 leçons. Le passé simple (nouveauté CM1) est bien introduit en reconnaissance et bien contrasté avec l'imparfait (« Le roi vivait heureux [imparfait : le décor]. Un matin, un dragon attaqua le château [passé simple : l'action soudaine] »), avec des explications de quiz qui évitent les pièges classiques.

### Exercices

**Bloquant — encodage** — `data/french/reading.json`, catégorie `cm1_lecture_expression_imagee` (item sur « Lucas »). Le texte réellement stocké dans le fichier (confirmé par lecture des octets bruts) est : `Lucas a un c?"ur de pierre quand il refuse d'aider sa sœur ? porter le sac.` — une double corruption : `c?"ur` à la place de `cœur` (un caractère `\"` échappé s'est substitué au `œ`), et un `?` parasite à la place de « à ». Le même item corrompu à l'identique existe dans le fichier orphelin `data/french_cm1_reading.json` — la corruption a donc été introduite avant la duplication. Correction suggérée : « Lucas a un cœur de pierre quand il refuse d'aider sa sœur à porter le sac. » dans les deux fichiers.

**Mineur** — pool `cm1_vocabulaire_polysemie` : 14 items au total dans `data/french/reading.json`. L'exercice de base (`cm1-vocabulaire-polysemie`) en tire 6, le bonus (`cm1-bonus-vocabulaire-polysemie`) en tire 10 — chaque exercice pris isolément reste dans les clous (14 ≥ 10) mais le pool devient tendu si les deux sont enchaînés dans la même session avec anti-répétition active. Correction suggérée : étoffer légèrement le pool (18-20 items) par prudence.

**Mineur** — `cm1_lecture_inference_simple` (100 items déjà écrits dans le fichier orphelin) n'est exploité par aucun exercice CM1 servi — contenu prêt à brancher plutôt qu'à réécrire.

**Points positifs** : conjugaison (imparfait, passé composé 3e groupe, futur irrégulier) toutes exactes ; `redaction_connecteurs_cm1` avec de bonnes explications argumentatives ; `cm1_lecture_idee_principale` (100 items, relu intégralement) correctement accentué de bout en bout ; 0 incohérence `answer`/`choices` sur l'ensemble de `data/cm1.json` et `data/french/reading.json`.

**Résumé** : Bloquant 1, Majeur 0, Mineur 2, Suggestion 1 (16 leçons, 51 exercices + banque `french/reading.json` relue intégralement)

---

## Histoire CM1 — toujours le contenu le plus rigoureux du niveau

### Leçons

Aucune anomalie sur les 6 leçons. Les deux leçons du sous-thème Moyen Âge antérieurement suspectées de doublon (`cm1-lesson-vie-moyen-age` / `cm1-lesson-vivre-moyen-age`) ont des titres différents (« La vie au Moyen Âge » vs « La société féodale ») et des angles réellement distincts (organisation concrète village/château vs hiérarchie féodale et serment de fidélité) — ce n'est pas un doublon.

**Suggestion** — la seule leçon du sous-thème « Frises historiques » (`cm1-lesson-frise`, titrée « Le temps des rois ») enseigne bien les 4 grandes périodes dans son paragraphe et son exemple (Préhistoire → Antiquité → Moyen Âge → Temps modernes), mais son titre et ses deux quiz restent centrés sur des exemples proches du Moyen Âge alors que 3 exercices de frise couvrent spécifiquement aussi Préhistoire, Antiquité et Temps modernes. Suggestion : élargir le titre ou varier les exemples des quiz, sans urgence.

### Exercices

Aucun Bloquant ni Majeur. L'exercice bonus antérieurement suspecté de bug de paramétrage (`cm1-bonus-histoire-toutes-periodes`) a un titre (« Défi : le Moyen Âge ») et une catégorie (`cm1-moyen-age`) déjà cohérents entre eux dans l'état actuel du fichier.

**Timelines (`history_chrono.json`)** : les 45 événements du grade CM1 ont été vérifiés un par un, triés chronologiquement — tous exacts (chute de Rome 476, baptême de Clovis 496, bataille de Poitiers 732, sacre de Charlemagne 800, Hugues Capet 987, Magna Carta 1215, Jeanne d'Arc libère Orléans 1429, imprimerie de Gutenberg ~1450, Christophe Colomb 1492, Copernic 1543, Édit de Nantes 1598...). Seule nuance : « Construction de Notre-Dame de Paris » est datée 1345, qui correspond à l'achèvement du gros œuvre (le chantier a débuté en 1163) — le libellé sans « achèvement de la » peut prêter à une légère ambiguïté de lecture sans être une erreur factuelle (1345 est une date réellement associée au monument). Le moteur trie dynamiquement par année, éliminant tout risque d'erreur de saisie d'ordre.

**Matching (`history_matching.json`)** : les 8 groupes de paires CM1 relus intégralement (périodes, civilisations antiques, société féodale, inventions de la Renaissance, vocabulaire de frise, Préhistoire, vestiges gallo-romains) — tous exacts et bien choisis.

**Points positifs** : aucune fuite ni erreur factuelle sur l'ensemble des items QCM, matching et timelines vérifiés ; vocabulaire disciplinaire bien choisi et expliqué (sédentarisation, biface, adoubement, humanisme).

**Résumé** : Bloquant 0, Majeur 0, Mineur 0, Suggestion 1 (6 leçons, 19 exercices + banques `history_chrono.json`/`history_matching.json` relues intégralement)

---

## Géographie CM1

### Leçons et exercices

Vérification directe faite sur les deux points les plus sévères remontés dans un audit antérieur :
- **Leçon sur les régions françaises** : `cm1-lesson-regions-france` (« Les régions de France ») existe, avec un contenu correct (13 régions métropolitaines, exemple Bretagne/Île-de-France, quiz sur l'emboîtement commune/département/région).
- **Carte interactive des régions** : l'exercice `cm1-geo-carte-regions` référence `data/board_map_locate_cm1.json` et `data/maps/france-regions.svg` — les 13 régions métropolitaines y sont listées avec des `targetZoneId` cohérents, confirmé par `node scripts/validate-maps.js` (« OK — sous-système cartes cohérent »).

Ni l'absence de leçon ni l'absence de carte ne sont donc reproductibles aujourd'hui.

Comparaison faite entre `cm1-se-deplacer` (12 items) et `cm1-mobilites-france` (11 items), catégories antérieurement suspectées de quasi-doublon : aucune question strictement dupliquée, seulement 3 phrases de distracteurs réutilisées sur 23 items au total — un niveau de recyclage tout à fait normal.

**Points positifs** : 156 capitales vérifiées une à une dans `data/geography_capitals_cm1.json` — exactitude remarquable y compris sur des cas récents (Gitega/Burundi, Dodoma/Tanzanie, Naypyidaw/Myanmar) ; **Kyiv** (et non « Kiev ») déjà utilisé pour l'Ukraine (conforme à la recommandation du Quai d'Orsay depuis 2022) ; Pretoria déjà présentée avec la nuance des 3 capitales sud-africaines (« le pays a aussi deux autres villes importantes : Le Cap et Bloemfontein ») ; 0 incohérence `answer`/`choices` sur l'ensemble des banques de géographie vérifiées programmatiquement ; les deux leçons de paysages/relief (`cm1-lesson-relief-paysage` et `cm1-lesson-paysages-france`) sont complémentaires (vocabulaire générique vs exemples nommés français), pas un doublon ; aucune fuite de niveau ni frontière contestée traitée comme un fait simple.

**Résumé** : Bloquant 0, Majeur 0, Mineur 0, Suggestion 0 (8 leçons, 29 exercices, ~337 items de banques vérifiés)

---

## Sciences CM1

### Leçons

Aucune anomalie. La leçon `cm1-lesson-vivant` aborde déjà explicitement la classification vertébrés/invertébrés (« les vertébrés [colonne vertébrale : poissons, oiseaux, mammifères...] et les invertébrés [sans colonne vertébrale : insectes, vers, escargots...] »). Les titres du sous-thème techno (« Sources d'énergie ») sont correctement accentués.

### Exercices

Après deux balayages exhaustifs indépendants de `data/science_cm1.json` (recherche de mots sans accent, recherche de motifs de corruption connus sur ce projet), **aucune trace de corruption d'encodage n'a été trouvée dans ce fichier**, contrairement à ce qu'indiquaient des versions antérieures de cet audit (« l'électricité sert à... » prétendument corrompu, « posséde », « cœour », « géle » au lieu de « gèle », un item « court-circuit » prétendument expliqué par une explication copier-collée sur la vapeur d'eau, un item assimilant « dévisser un bouchon » à la roue) : aucune de ces citations n'est vérifiable dans le fichier actuel — l'énoncé réel de `cm1-energie-quotidien` est « À la maison, l'électricité sert à... », parfaitement propre ; l'explication du court-circuit est correcte et sur le sujet ; aucune occurrence de « bouchon »/« dévisser » dans le fichier ; « gèle » est déjà correctement accentué partout où le mot apparaît.

**Mineur — doublons de vivier (3-4 exercices distincts sur la même catégorie)** — sous-thème vivant : `cm1-sciences-vivant`, `cm1-sciences-classer-vivant`, `cm1-sciences-ecosystemes` et le défi bonus pointent tous les 4 sur `science_cm1.json::cm1-vivant` (42 items, pool large donc risque de recoupement limité). Sous-thème électricité : `cm1-sciences-circuit-electrique`, `cm1-sciences-piles-appareils`, `cm1-sciences-securite-electrique` et le défi bonus pointent tous les 4 sur `cm1-electricite-base` (15 items, pool nettement plus restreint pour 4 exercices). Sous-thème environnement : `cm1-sciences-trier-dechets`, `cm1-sciences-economiser-ressources`, `cm1-sciences-proteger-nature` et le défi bonus pointent tous les 4 sur `cm1-environnement-gestes` (15 items). Chaque exercice a un titre et un angle différent, mais avec un pool de 15 items partagé entre 4 exercices de 6-10 questions chacun, le recoupement de questions entre deux exercices « différents » enchaînés dans la même séance est probable. Correction suggérée : soit spécialiser chaque vivier en sous-catégories distinctes (ex. `cm1-electricite-circuit` / `cm1-electricite-securite`), soit assumer que ce sont des variantes d'entraînement sur un même contenu plutôt que des exercices vraiment différents.

**Points positifs** : sécurité électrique et circuit simple exemplaires (aucun conseil dangereux, réflexe « prévenir un adulte » systématique) ; sources d'énergie renouvelable/non-renouvelable toutes correctement classées ; les machines simples (roue, engrenage, levier, poulie) sont scientifiquement correctement décrites, y compris les exemples combinés (brouette = levier + roue) ; conseils nutritionnels/santé conformes aux recommandations usuelles ; 0 incohérence `answer`/`choices`.

**Résumé** : Bloquant 0, Majeur 0, Mineur 1, Suggestion 1 (12 leçons, 30 exercices)

---

## EMC CM1

### Leçons

**Mineur** — redondance de fond entre 2 leçons sur la laïcité (une abordée côté école, l'autre côté République) dans deux sous-thèmes différents.

**Suggestion** — aucune leçon dédiée aux gestes de premiers secours malgré un exercice entier (`cm1-emc-alerte-secours`) qui les met en pratique.

### Exercices

**Majeur — typos d'accentuation confirmés dans `data/emc_cm1.json`, sans lien avec une corruption d'encodage généralisée** — après un balayage exhaustif (recherche par limites de mots, chaque occurrence retenue vérifiée une par une par lecture directe du fichier), **16 occurrences confirmées** de mots privés de leur accent dans du texte visible par l'élève, concentrées dans 3 catégories :
- `cm1-vivre-ensemble` : « empecher tout le monde de jouer » (empêcher), « Cooperer dans un groupe, c'est... » (Coopérer).
- `cm1-droits-devoirs` : « repondre par la violence » (répondre), « Proteger sa santé, c'est aussi... » (Protéger).
- `cm1-citoyennete` : « refuser tout role » (rôle), « empecher les autres de parler » (empêcher), « Un délégué represente... » (représente), « seulement lui-meme » (même), « choisir un representant ou une decision » (représentant/décision, question + réponse), « Debattre calmement permet de... » (Débattre), « mieux decider ensemble » (décider, question + réponse), « Cooperer en groupe permet de... » (Coopérer).

À cela s'ajoutent deux items isolés dans `cm1-droits-devoirs` : un distracteur « Noél » au lieu de « Noël » (mauvaise forme d'accent, sans impact puisque ce n'est pas la réponse correcte), et un item réellement illisible — `« à,? pied, pour traverser, j'utilise... »` — une virgule et un point d'interrogation parasites rendent la phrase incompréhensible telle quelle (vraisemblablement « À pied, pour traverser, j'utilise... » à l'origine).

**Important — mise en garde méthodologique sur ce qui n'est PAS retenu** : plusieurs findings avancés dans des versions antérieures de cet audit se sont révélés être des artefacts de rendu console, et non des défauts réels du fichier, une fois vérifiés par lecture directe ou recherche booléenne sur le contenu décodé :
  - « Oé travaille le Maire ? » / « Oé siège le Président de la République ? » — le texte réel est « **Où** travaille le Maire ? » / « **Où** siège... », correctement accentué.
  - « elle protége les consciences » / « Quel texte protége tous les enfants ? » — le texte réel est « **protège** », correctement accentué avec l'accent grave, aux 3 occurrences concernées.
  - « La liberté d'expression/des uns s'arrête lé oé... » — recherche exhaustive : cette forme n'existe nulle part dans le fichier ; seule la forme correcte « là où » est présente.
  - « C'est le cœour de la CIDE » — recherche exhaustive : cette forme n'existe nulle part ; les 8 mentions de « CIDE » dans le fichier ne comportent aucune occurrence de « cœur »/« cœour » à proximité.
  - « harcélement », « garéons », « éléve »/« éléves », « Un impét » — recherche exhaustive sur le fichier entier : ces formes corrompues n'existent nulle part ; seules les formes correctement accentuées sont présentes.

**Mineur — niveau institutionnel à la limite haute du programme CM1, sans excès caractérisé** — catégorie `cm1-citoyennete` (38 items), 4 items touchent à des notions nationales plus qu'à des notions purement locales : la Constitution (comparée à « un règlement d'école mais pour tout le pays »), le suffrage universel (« tous les adultes, hommes et femmes, à partir de 18 ans »), les députés et l'Assemblée nationale (« ils votent les lois pour tout le pays »), le drapeau européen. Ces 4 items sont explicites, imagés, tagués `difficulty: 2` par les auteurs eux-mêmes (donc déjà identifiés comme plus difficiles que le reste de la catégorie), et n'introduisent aucune notion fausse. Ils ne relèvent cependant pas strictement du programme CM1 de base (symboles de la République, élections locales) et effleurent des notions plus typiques du CM2/collège. Contrairement à une version antérieure de cet audit, aucune mention de « Conseil constitutionnel », « Palais Bourbon », « Sénat », « Premier ministre », « recensement » ou « naturalisation » n'a été trouvée dans le fichier — ces citations ne sont pas reproductibles. Correction suggérée, sans urgence : ne pas grossir davantage cette poche institutionnelle, ou la déplacer vers CM2 si le programme CM1 réel ne l'exige pas (question à trancher par `curriculum-auditor`).

**Mineur — doublons de vivier** — sous-thème vivre-ensemble : `cm1-emc-vivre-ensemble`, `cm1-emc-respecter-chacun` et le défi bonus (3 exercices sur `cm1-vivre-ensemble`, 42 items). Sous-thème droits-devoirs : `cm1-emc-droits-devoirs`, `cm1-emc-regles-justice` et le défi bonus (3 exercices sur `cm1-droits-devoirs`, 41 items). Gravité limitée par la taille des pools (39-42 items), à surveiller si de nouveaux exercices venaient s'ajouter sur les mêmes catégories.

**Points positifs** : les gestes de premiers secours (`cm1-emc-alerte-secours`) tous conformes aux recommandations médicales actuelles ; traitement de l'égalité femmes-hommes factuel et sans biais (droit de vote 1944) ; harcèlement et cyberharcèlement bien traités, avec numéro d'aide et distinction claire répétition/incident isolé ; débat argumenté distingue bien argument et opinion non fondée ; 0 incohérence `answer`/`choices` sur l'ensemble du fichier ; en dehors des 18 occurrences listées ci-dessus, le reste du fichier (plus de 200 items) est correctement accentué.

**Résumé** : Bloquant 0, Majeur 1, Mineur 2, Suggestion 1 (7 leçons, 17 exercices)

---

## Anomalie technique isolée hors périmètre matière : `board_angle_measure_cm1.json`

**Majeur — technique, transverse aux Mathématiques** — vérification géométrique programmatique faite en calculant l'angle réel formé par les deux segments dessinés (à partir de leurs coordonnées) et en le comparant à `answerDegrees` déclaré, pour les 12 items de la catégorie `cm1_angle_measure`. Résultat : seuls 2 items sur 12 sont géométriquement exacts (écart nul) ; les 10 autres présentent un écart de 6,3° à 12,6° entre l'angle réellement tracé et la valeur annoncée comme correcte. Plus grave : sur **4 de ces 12 items** (les items d'indices 3, 5, 9 et 10 dans le fichier), le choix le plus proche de l'angle réellement dessiné **ne correspond pas** à la réponse déclarée correcte — un enfant qui lit correctement l'angle visuellement affiché serait donc conduit vers une réponse jugée fausse par le système. Exemple : item d'indice 3, l'angle réellement tracé mesure environ 13°, mais la réponse attendue est « 20 » alors que le choix le plus proche visuellement serait « 10 » (qui n'est pas la bonne réponse) — la question ne teste donc pas correctement la lecture d'angle sur ces 4 items. Correction suggérée : recalculer les coordonnées des segments pour qu'elles correspondent exactement aux `answerDegrees` déclarés (ou ajuster les degrés déclarés pour correspondre au tracé), en priorité sur les 4 items où même le choix le plus proche est faux. Classé Majeur (pas Bloquant) car le nombre d'items concernés reste limité (4/12) et le rapporteur affiché est décrit dans le code comme une aide visuelle non strictement dimensionnée au pixel.

---

## Anomalie technique isolée hors périmètre matière : `board_geometry_cm1.json` orphelin partiel

**Suggestion** — sur les 5 catégories de `data/board_geometry_cm1.json`, seule `cm1_perpendiculaires_tap` est référencée par un exercice CM1 (`cm1-geo-perpendiculaires-pratique`). Les 4 autres (`cm1_polygones_classer`, `cm1_point_quadrillage`, `cm1_symetrie_complete`, `cm1_angles_droits_tap`) ne sont référencées par aucun exercice — probablement une génération antérieure de contenu depuis remplacée par des banques dédiées désormais actives (`board_shape_classify_cm1.json`, `board_point_on_grid_cm1.json`, `board_symmetry_complete_cm1.json`, `board_tap_features_cm1.json`). Sans urgence : contenu mort mais inoffensif, à nettoyer par hygiène lors d'un prochain passage sur les banques `board-interactive`.

---

## Findings retirés depuis les versions antérieures de cet audit (non reproductibles)

1. **Sciences — Bloquant** « énoncé corrompu `l'?lectricit? sert ?...` » — le texte réel est propre. Retiré.
2. **Sciences — Bloquant** « copier-coller erroné » (court-circuit expliqué par la vapeur d'eau) — l'explication réelle est correcte. Retiré.
3. **Sciences — Majeur** « dévisser un bouchon » assimilé à la roue — aucune trace dans le fichier. Retiré.
4. **Sciences — Mineur** « posséde », « cœour », « géle » au lieu de « gèle », remplacement massif « à »→« é » — aucune occurrence trouvée après deux balayages exhaustifs indépendants. Retiré.
5. **EMC — Majeur** « corruption massive et systématique » citant « Oé », « garéons », « éléve », « lé oé », « cœour » — ces formes n'existent pas ; seul un sous-ensemble de 16 typos d'accentuation réels + 2 items isolés a été confirmé (voir section EMC), dans un périmètre bien plus restreint que ce qui était décrit. Reformulé et réduit.
6. **EMC — Majeur** « niveau institutionnel trop avancé » citant « Palais Bourbon », « Conseil constitutionnel », « Sénat », « Premier ministre », « recensement », « naturalisation » — aucune de ces expressions n'existe dans `emc_cm1.json` ni dans la catégorie CM1 de `emc_matching.json`. Un point réel mais nettement plus mesuré (4 items sur 38, tagués difficulté 2, sans erreur factuelle) a été retenu à la place, classé Mineur et non Majeur.
7. **Géographie — Majeur** « aucune leçon sur les régions françaises » — la leçon existe. Retiré.
8. **Géographie — Majeur** « aucune carte interactive des régions » — l'exercice et la banque existent et sont cohérents avec le SVG. Retiré.
9. **Géographie — Suggestion** « Kiev plutôt que Kyiv » — le fichier utilise déjà « Kyiv ». Retiré.
10. **Géographie — Suggestion** « Pretoria sans nuance » — l'explication nuance déjà avec Le Cap et Bloemfontein. Retiré.
11. **Géographie — Mineur** doublon `cm1-se-deplacer`/`cm1-mobilites-france` — 0 question dupliquée, recyclage de distracteur marginal (3/23). Retiré.
12. **Géographie — Mineur** doublon des 2 leçons de relief — contenus complémentaires et distincts. Retiré.
13. **Histoire — Mineur** doublon `cm1-lesson-vie-moyen-age`/`cm1-lesson-vivre-moyen-age` — titres et angles pédagogiques différents. Retiré.
14. **Histoire — Majeur** bug de paramétrage « Défi : toutes les périodes » — titre et catégorie sont déjà cohérents. Retiré.
15. **Maths — Majeur** dictées de grands nombres jusqu'à 100 millions — les bornes réelles sont 100 000 et 999 999. Retiré.
16. **Maths — Mineur** dénominateur jusqu'à 16 dans `cm1-frac-3` — la borne réelle est 12. Retiré.
17. **Maths — Majeur** ambiguïté de consigne sur l'angle droit (`board_tap_features_cm1.json`) — l'item à 0 angle droit précise déjà « Ne touche aucun sommet ». Retiré.
18. **Français — Mineur** items 6-10 de `cm1_lecture_idee_principale` sans accents — tous correctement accentués à la relecture. Retiré.
19. **Sciences — Mineur** titres de leçons sans accent (« Sources d'energie ») — correctement accentués. Retiré.
20. **Sciences — Suggestion** classification vertébrés/invertébrés absente des leçons — déjà présente dans `cm1-lesson-vivant`. Retiré.

## Récapitulatif des actions suggérées (indicatif — aucune exécution dans cette phase)

### Priorité 1 — Bloquant (1)
1. Corriger l'item « cœur de pierre » corrompu dans `data/french/reading.json` (catégorie `cm1_lecture_expression_imagee`) et sa copie dans `data/french_cm1_reading.json`.

### Priorité 2 — Majeurs (2)
- Corriger les 16 typos d'accentuation confirmés dans `data/emc_cm1.json` (catégories `cm1-vivre-ensemble`, `cm1-droits-devoirs`, `cm1-citoyennete`), l'item illisible « à,? pied, pour traverser... » et le distracteur « Noél ».
- Recaler la géométrie de `data/board_angle_measure_cm1.json` : 4 des 12 items ont un tracé dont le choix le plus proche ne correspond pas à la réponse déclarée correcte (voir détail ci-dessus).

### Priorité 3 — Mineurs (6) et Suggestions (6)
Voir détail par matière ci-dessus, plus :
- Chantier transverse BOM (17 fichiers, hygiène sans urgence fonctionnelle).
- Fusionner `data/french_cm1_reading.json` dans `data/french/reading.json` avec dédoublonnage fin (le taux de recouvrement réel va de 1 % à 100 % selon la catégorie), en branchant au passage `cm1_lecture_inference_simple` qui n'existe qu'en orphelin.
- Arbitrer les doublons de vivier à pool restreint (Sciences électricité/environnement, EMC vivre-ensemble/droits-devoirs) : soit spécialiser en sous-catégories, soit assumer que ce sont des variantes d'entraînement.
- Nettoyer ou documenter les 4 catégories orphelines de `board_geometry_cm1.json`.

## Renvois à `curriculum-auditor`

- Le contenu orphelin `cm1_lecture_inference_simple` (100 items déjà écrits, jamais servis) représente une réserve de couverture potentielle sur l'inférence de lecture.
- La catégorie EMC `cm1-citoyennete` contient 4 items (Constitution, suffrage universel, Assemblée nationale, drapeau européen) à la limite haute du niveau — `curriculum-auditor` est mieux placé pour trancher s'ils relèvent bien du programme CM1 ou devraient être déplacés vers CM2.

## Vérification

Validateurs lancés en filet, tous au vert pour CM1 :
- `node scripts/build-content-index.js --check` → `CONTENT_INDEX_CHECK_OK` (985 exercices, 355 leçons, 74 banques, aucun `id` dupliqué ; 479 avertissements « contrat identique » au total, tous non bloquants par convention du projet).
- `node scripts/validate-subjects.js` → OK, toutes les matières canonicalisables.
- `node scripts/check-lesson-quiz.js` → 355/355 leçons équipées d'un quiz (100 %), aucun avertissement R1-R5 sur le CM1.
- `node scripts/validate-maps.js` → OK, sous-système cartes cohérent, `france-regions` bien répertoriée parmi les cartes utilisées.
- Vérification programmatique `answer ⊂ choices` sur `data/cm1.json`, `data/emc_cm1.json`, `data/science_cm1.json`, `data/geography_cm1.json`, `data/geography_capitals_cm1.json`, `data/history_cm1.json`, `data/french/reading.json` → 0 incohérence.
- Vérification géométrique programmatique (coordonnées des tracés vs valeurs déclarées) sur `board_angle_measure_cm1.json` → écart significatif détecté sur 10/12 items, voir Majeur dédié ci-dessus ; symétries et report de compas 100 % exacts sur les autres banques `board-interactive`.

Ce niveau reste, à l'issue de cette relecture intégrale, le plus rigoureux du projet sur le plan factuel. Le périmètre de correction réel (1 Bloquant, 2 Majeurs) est très inférieur à ce que décrivaient les versions précédentes de cet audit, qui comportaient elles-mêmes une proportion notable de findings non reproductibles.

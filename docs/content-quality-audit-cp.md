# Audit qualité de contenu — CP

> Audit indépendant de la qualité intrinsèque de chaque leçon et exercice du niveau CP (exactitude factuelle, clarté pédagogique, adéquation au niveau, cohérence technique), distinct de [`curriculum-audit-cp.md`](curriculum-audit-cp.md) qui évalue la couverture du programme. Réalisé le **2026-09-28** par lecture intégrale (sans échantillonnage) de `data/cp.json` (**83 leçons, 206 exercices**) et de **toutes** les banques externes référencées par le niveau, complétée par une **sonde de tirages réels** : chacun des 206 exercices a été démarré dans un vrai navigateur et **40 questions ont été tirées par exercice (8 240 tirages)**, puis comparées au titre, au sous-titre et aux bornes du CP ; les réponses des 36 exercices procéduraux de mathématiques ont été **recalculées indépendamment**.
>
> Banques externes relues intégralement : `board_map_locate_cp.json`, `board_memory_match_cp.json`, `board_number_line_cp.json`, `board_point_on_grid_cp.json`, `emc_cp.json`, `emc_matching.json` (`matching_emc_cp`), `french_cp_grammar.json`, `french_word_order.json` (`word_order_cp`), `geography_cp.json`, `history_cp.json`, `math_geometry_cp.json`, `math_matching.json` (`matching_math_cp`), `math_word_problems_cycle2.json` (catégories `cp-*`), `science_cp.json`, et la bibliothèque partagée `data/french/` : `spelling.json` (20 catégories CP), `reading.json` (15 catégories `cp_*`), `grammar.json` (`gender_cp`, `plural_choice_cp`), `conjugation.json` (`etre_avoir_p`, `present_1`). Le code des moteurs et du rendu a été lu chaque fois que les données seules ne suffisaient pas à trancher.
>
> Sources faisant autorité : BO spécial n°40 du 31/10/2024 (mathématiques et français cycle 2), arrêté du 22/04/2026 et BO n°22 du 28/05/2026 (histoire-géographie cycle 2), arrêté du 05/06/2026 et BO n°24 du 11/06/2026 (sciences et technologie), BO du 13/06/2024 (EMC), tous repris dans `PROGRAMME_SCOLAIRE_REFERENCE.md` ; TLFi et Robert pour la langue (orthographe des numéraux — accord de « vingt », absence de « et » dans 81 et 91 —, h aspiré de « hibou », sens de « journée ») ; `docs/lesson-guidelines.md` (règles R1-R5) pour les quiz de leçon.
>
> **Aucune correction n'a été appliquée dans cette phase.** Ce document liste les problèmes trouvés ; la correction fait l'objet d'une phase séparée (souvent confiée ensuite à `exercise-author` ou à une intervention manuelle).

## Synthèse générale

| Sévérité | Maths | Français | Histoire | Géographie | Sciences | EMC | Total |
|---|---|---|---|---|---|---|---|
| Bloquant | 1 | 3 | 0 | 0 | 0 | 0 | **4** |
| Majeur | 5 | 5 | 1 | 4 | 2 | 2 | **19** |
| Mineur | 15 | 16 | 9 | 8 | 7 | 5 | **60** |
| Suggestion | 3 | 2 | 2 | 2 | 2 | 2 | **13** |

**Quatre Bloquants, tous invisibles aux validateurs** (qui sont tous verts, voir plus bas) et tous trouvés par la sonde ou par la lecture du moteur :

1. **Maths** — `cp-dictee-20-69` : les nombres de 81 à 99 sont écrits « quatre-vingts-cinq », « quatre-vingts-dix-neuf », « quatre-vingts-et-onze » (moteur `js/engines.js::numberToFrench`) ; l'orthographe juste que tape l'enfant est refusée.
2. **Français** — `fr-corps` : « ŒIL » et « CŒUR » ne peuvent pas être tapés, le clavier virtuel n'a pas de touche « œ ».
3. **Français** — `cp-bonus-genre-mixte` : « le chat » est compté faux, seul « un chat » est accepté (le moteur n'attend que l'article indéfini dès que « un »/« une » sont proposés).
4. **Français** — `cp-le-la` : pour HIBOU, la réponse attendue est « l' » (« l'hibou ») ; « le hibou » est refusé.

Le niveau a été profondément enrichi depuis le 2026-07-24 (vagues v4.47.0 à v4.50.0) et les contenus nouveaux sont **globalement exacts et bien construits** — jour/nuit, mois, points cardinaux, globe et planisphère, température, tri à trois catégories, rangement de séries, dizaines/unités. Les défauts se concentrent dans les **moteurs** (orthographe des nombres, élision, clavier, tirages dégénérés) et dans l'**assemblage** des exercices (vivier partagé sous plusieurs titres, exercices rangés hors de leur sous-thème), beaucoup moins dans le texte des banques.

### Anomalies transverses

**1. Exercices rangés dans un sous-thème étranger, en doublon d'un exercice bien rangé (Majeur, 8 exercices).** Le constat isolé de l'audit précédent (deux exercices) est en fait un schéma : des sous-thèmes ont été « remplis » avec des exercices d'autres viviers, souvent sous un titre qui existe déjà ailleurs. `cp-emc-partager-materiel` (EMC, rangé en Histoire › Traces du passé), `cp-sciences-corps-sens` (« Révision : les cinq sens », rangé dans « Où vivent les animaux ? »), `cp-sciences-objets-usages` (rangé dans « Matière et lumière »), `cp-sciences-hygiene` (rangé dans « Objets du quotidien »), `cp-geo-transports-lieux` (rangé dans « Paysages »), `cp-emc-sec-politesse` (« Politesse en classe », rangé dans « Sécurité », même titre que `cp-emc-politesse-classe`), `cp-emc-vote-vivre-ensemble` (« Voter ensemble » sur le vivier « vivre ensemble »), `cp-emc-env-partager` (« Partager le matériel », rangé dans « Respecter l'environnement »). Détail par matière ci-dessous.

**2. Un vivier, plusieurs titres : le titre promet une facette que le vivier ne sert qu'en partie (Majeur en Sciences et en EMC).** Mesures faites sur les banques : « S'habiller selon la saison » (`cp-sciences-habits-saison`) → 3 items sur 15 parlent de vêtements ; « La maison et le jardin » → 4 items sur 14 ; « En quoi c'est fait ? » → 6 sur 12 ; « Les cinq sens » → 10 sur 20 ; « Défi : milieux et sens » → aucun item sur les sens ; « Exprimer ses émotions » → 3 sur 10 ; « Défi : tous les mots outils » → 6 mots de la seule période 5. C'est exactement le défaut trouvé au CM1 (« le chiffre des millions » interrogé une fois sur sept) : un exercice jouable qui ne fait pas ce que son titre annonce.

**3. Distracteurs repérables par leur longueur (Mineur, persistant, légère hausse).** Le critère de l'audit précédent (bonne réponse plus longue d'au moins 8 caractères que chacun de ses distracteurs) donne **74 items** dans les banques `factual-qcm` utilisées par le CP, contre 67 au 2026-07-24 : EMC 20, Géographie 18, Histoire 16, Sciences 15, Français 3, Maths 2. Cas extrêmes : `emc_cp.json::cp-environnement` (8 items sur 12, jusqu'à +34 caractères), `history_cp.json::cp-generations` (« Une génération, c'est… » : +39). La règle R4 de `docs/lesson-guidelines.md`, appliquée aux quiz de leçon, ne l'est toujours pas aux banques.

**4. BOM UTF-8 en tête de 7 banques (Mineur, persistant, étendu).** `emc_cp.json`, `geography_cp.json`, `math_geometry_cp.json`, `math_matching.json`, `science_cp.json`, `french_word_order.json` — déjà signalés — et **`french/conjugation.json`**, non listé la dernière fois. Un `JSON.parse` strict échoue sur ces 7 fichiers (vérifié) ; le navigateur les tolère. Aucun mojibake, aucun `\uXXXX`, aucune apostrophe typographique dans les textes visibles des banques CP (18 apostrophes courbes existent dans `french/grammar.json`, mais hors des catégories CP).

**5. Quiz de leçon longs, sans aucun appui audio (Majeur en Géographie, Mineur en Histoire et EMC).** La synthèse vocale n'existe que pour les dictées : un enfant de CP doit lire seul les deux `check` qui conditionnent la validation de la leçon. Longueur moyenne d'une question de `check` : Français 63 caractères, Maths 80, Sciences 91, EMC 93, Histoire 95, **Géographie 109** (maximum 183 : `cp-lesson-plan-ecole`) ; explications moyennes : Géographie 214 caractères, EMC 190.

**6. Défauts de moteurs partagés (hors périmètre CP, à signaler).** Plusieurs Bloquants et Majeurs viennent de moteurs communs à tous les niveaux : `numberToFrench` (nombres 81-99), `genderArticles` (« h » traité comme voyelle ; défi mixte), `conjugation` + `drawConjugation` (« Je » non élidé), `calculate` / `sub-simple` (second terme tiré dans `[0, a]`), `compare` (égalité forcée 20 %). Toute correction doit vérifier l'effet sur les exercices des autres niveaux qui utilisent les mêmes moteurs.

**7. Textes d'interface qui contredisent l'exercice (Mineur).** `js/ui-documentary.js::drawWordOrder` affiche toujours « Construis la phrase en touchant les mots dans le bon ordre » — y compris pour ranger des nombres (`cp-ranger-croissant`, `cp-ranger-decroissant`) ou des mois (`cp-histoire-mois-ordre`), alors que l'amorce juste en dessous a été corrigée (« Touche les nombres ci-dessous pour les ranger… ») ; `js/ui.js::drawAudioSpelling` dit « Écoute bien le mot » pour une syllabe ou une phrase ; `js/ui.js::drawSpelling` affiche « Icône utilisée » ou « Illustration indisponible » sous l'image de chaque mot. À confier à `ui-craftsman`.

### Résultat des validateurs (lancés en filet, jamais en substitut à la lecture)

- `powershell -ExecutionPolicy Bypass -File scripts/validate-data.ps1` → **DATA_VALIDATION_OK** (100 fichiers, 633 références d'exercices).
- `node scripts/build-content-index.js --check` → **CONTENT_INDEX_CHECK_OK** (1 123 exercices, 442 leçons, 80 banques), aucun doublon d'`id` ; les avertissements CP sont des doublons « mous » (même vivier sur plusieurs exercices d'un sous-thème, variantes « Défi ») — ce sont eux qui cachent les anomalies transverses 1 et 2 ci-dessus.
- `node scripts/check-lesson-quiz.js` → **LESSON_QUIZ_OK**, 442/442 leçons équipées ; CP : 83/83, aucune anomalie (aucun `check` avec `id`, aucune `answer` hors `choices`, aucun avertissement R4).
- `node scripts/validate-subjects.js` → **OK**.
- `node scripts/validate-maps.js` → **OK**, sous-système cartes cohérent (la carte `world-continents` est bien servie au CP).
- `node scripts/smoke-exercises.js` → **SMOKE_EXERCISES_OK**, CP 206/206 jouables, aucune erreur JS.
- Contrôles complémentaires de cette passe : sur les 5 120 tirages de la sonde qui portent des choix, **aucune réponse absente des choix et aucun choix en double** ; `JSON.parse` strict en échec sur les 7 banques à BOM.

---

## Mathématiques CP

### Leçons

**Mineur — leçons « méthode » plutôt que notion (persistant)** — `data/cp.json`, leçons `cp-lesson-defi-chercher` et `cp-lesson-defi-verifier` (sous-thème `cp-defis-logique`) — elles décrivent une méthode (« je lis, je choisis, je calcule » ; « je relis, je refais, je corrige ») alors que les exercices du sous-thème (`oiseau-1`, `carre-1` à `carre-3`, `cp-bonus-carre-magique-defi`) sont du calcul mental sans énoncé. `docs/lesson-guidelines.md` classe la « leçon purement méthodologique » parmi les anti-patterns. Correction suggérée : recentrer sur la notion exercée (trouver deux nombres dont la somme fait 10, 15, 20) ou déplacer ces leçons vers `cp-problemes-subtheme`.

**Mineur — quasi-doublon entre leçons (persistant)** — leçons `cp-lesson-defi-chercher` (« Résoudre un petit problème ») et `cp-lesson-resoudre-probleme` (« Résoudre un problème ») — même démarche, exemples jumeaux (images collées, billes reçues). Correction suggérée : différencier les angles ou fusionner.

**Mineur — la ligne numérique enseignée n'est pas celle de l'exercice 0-100** — leçon `cp-lesson-ligne-numerique` — l'exemple (« le nombre 7 se trouve en comptant 7 graduations à partir du 0 ») et l'astuce (« je compte le bon nombre de graduations ») supposent une graduation de 1 en 1 ; l'exercice `cp-ligne-numerique-0-100` gradue de 10 en 10, où compter 60 graduations est faux. Correction suggérée : un exemple « de 10 en 10 » dans la leçon.

**Mineur — la valeur d'un chiffre n'est enseignée nulle part** — leçon `cp-lesson-dizaines-unites` — elle enseigne « 34 = 3 dizaines et 4 unités », jamais que le 3 de 34 **vaut 30**, alors que l'exercice `cp-valeur-chiffre-dizaines-unites` (« Quelle est la valeur du chiffre des dizaines ? » → 30) repose entièrement sur cette idée. Correction suggérée : un bloc « 3 dizaines, c'est 30 ».

**Suggestion — heure en notation 24 h dans un quiz de CP** — leçon `cp-lesson-heures-journee`, 1er `check` — « récréation de 15 h » : au CP, l'heure se lit sur le cadran à aiguilles ; « 15 h » n'est ni enseigné ni exercé. Correction suggérée : « récréation de l'après-midi ».

### Exercices

**Bloquant — orthographe fausse des nombres de 81 à 99, exigée comme bonne réponse** — `data/cp.json`, exercice `cp-dictee-20-69` (« Nombres de 20 à 99 », `math-input` type `number-spelling`, `min: 20, max: 99`) ; moteur `js/engines.js::numberToFrench` — la table `tens` contient « quatre-vingts » (avec s) et elle sert aux décennies 80 et 90. Le moteur produit « quatre-vingts-et-un », « quatre-vingts-cinq », « quatre-vingts-dix », « quatre-vingts-et-onze », « quatre-vingts-dix-neuf » (confirmé par appel direct du moteur). Or « vingt » ne prend le s que lorsqu'il termine le nombre (80 = « quatre-vingts », 85 = « quatre-vingt-cinq ») et il n'y a **jamais** de « et » dans 81 et 91 (« quatre-vingt-un », « quatre-vingt-onze »), en orthographe traditionnelle comme rectifiée. Sonde : **7 tirages sur 40** ; en théorie 19 nombres sur 80 (24 % des questions). Double effet : dans le sens « lettres → chiffres », l'enfant lit une orthographe fausse ; dans le sens « chiffres → lettres », l'orthographe **juste** qu'il tape est refusée (comparaison stricte dans `App.validateAnswer`). Correction suggérée : « quatre-vingt » dès qu'une unité suit, pas de « -et- » pour 81 et 91 ; vérifier les exercices des autres niveaux qui utilisent ce moteur.

**Majeur — quadrillage sans repère et « colonne 0 » (persistant, précisé)** — `data/board_point_on_grid_cp.json`, cat. `cp_point_on_grid` (exercices `cp-geo-quadrillage` et `cp-bonus-quadrillage-defi`) — l'item 5 demande la « ligne 0 », l'item 10 la « colonne 0 », et le plateau (`js/ui-board.js::renderPointOnGrid`) n'affiche **aucun numéro** de ligne ni de colonne ; les cibles sont indexées à partir de 0 sur les intersections. La leçon `cp-lesson-quadrillage` est elle-même ambiguë : son exemple se lit comme un déplacement depuis le coin (« je compte 2 cases vers la droite », cohérent avec la base 0), mais son 2e `check` affirme que « colonne 4, ligne 1 » est « tout en haut », ce qui suppose une base 1. Un enfant qui compte « 1re colonne, 2e colonne » se trompe sur toutes les consignes chiffrées. L'item 8 emploie « coordonnées », vocabulaire du cycle 3. Correction suggérée : numéroter lignes et colonnes sur le plateau, une seule convention (base 1) dans banque et leçon, supprimer « ligne 0 », « colonne 0 » et « coordonnées ».

**Majeur — ligne numérique 0-100 : placer un nombre revient à lire une étiquette** — `data/board_number_line_cp.json`, cat. `cp_number_line_0_100` (exercice `cp-ligne-numerique-0-100`) — `labels` a 11 valeurs pour 11 graduations : `js/ui-board.js::_renderNumberLineTicks` passe en mode positionnel et **affiche le nombre sous chaque graduation** (vérifié dans le rendu de la sonde : « 0 10 20 … 100 »). « Place le nombre 60 » se réduit à toucher l'étiquette « 60 », et les 11 items ne portent que sur des dizaines rondes. Sur la ligne 0-10 (`cp_number_line_0_10`), seuls 0, 5 et 10 sont étiquetés, ce qui est le bon réglage — mais 3 items sur 11 demandent justement 0, 5 ou 10. Correction suggérée : n'étiqueter que 0, 50 et 100 sur la ligne 0-100 ; ajouter des nombres non ronds sur un segment gradué de 1 en 1 (ex. 30 à 40).

**Majeur — le memory refuse des paires mathématiquement justes** — `data/board_memory_match_cp.json`, cat. `cp_memory_match_maths` (exercice `cp-maths-memoire`) — les cartes sont appariées par paire d'origine (`pairId`, gestion de `board-flip-card` dans `js/app.js`), pas par sens. L'item 1 contient deux cartes « 4 » (« 2 + 2 » et « 3 + 1 ») et deux cartes « 5 » (« 5 + 0 » et « 1 + 4 ») ; l'item 2 associe « le rectangle » à « 4 côtés » alors que « le carré » a aussi 4 côtés. Retourner « 2 + 2 » puis le « 4 » de l'autre paire fait refermer les cartes : le jeu dit à un enfant de CP que 2 + 2 ne va pas avec 4. Correction suggérée : des résultats tous différents dans un même item, et « 4 côtés, pas tous égaux » pour le rectangle.

**Majeur — les signes <, > et = sont exercés mais jamais enseignés** — exercices `comp-1`, `comp-2`, `comp-3`, `cp-bonus-comparaison-defi` (sous-thème `cp-nombres-comparaison`) — l'enfant choisit entre « < », « = » et « > » ; aucune des six leçons du sous-thème ne les explique (`cp-lesson-compter-comparer` et `cp-lesson-plus-moins-autant` n'emploient que des mots ; le seul « < » visible est dans l'exemple de `cp-lesson-encadrement`, sans explication). Correction suggérée : un bloc ou une leçon « < veut dire plus petit que, > veut dire plus grand que », avec un `check` de transfert.

**Majeur — « Retirer jusqu'à 10 » : une question sur deux sans calcul** — exercice `sub-1` (`sub-simple`, `min: 1, max: 10`) ; `js/engines-math.js::calculate` (`b = rnd(0, a)`) — le second terme vaut 0 ou le premier terme dans 40 % des cas en théorie ; la sonde mesure **21 tirages dégénérés sur 40** (« 1 - 0 » six fois, « 2 - 2 » trois fois, « 9 - 9 », « 10 - 0 »…) et 11 résultats nuls. Le défaut décroît avec la borne (`sub-2` : 11/40, `sub-3` : 6/40, `cp-bonus-soustraction-defi` : 7/40). Correction suggérée : tirer `b` dans `[1, a - 1]` (ou tolérer au plus une question « - 0 » ou « a - a » par série) et partir de `min: 2`.

**Mineur — « Additions jusqu'à 20 » reste surtout sous 10** — exercice `add-2` (`maxSum: 20`) — la somme est tirée uniformément de 2 à 20 : 47 % de sommes ≤ 10 (sonde : 23/40), « 1 + 1 » une fois sur 19 (sonde : 4/40). L'exercice recouvre largement `add-1`. Correction suggérée : `min: 11`.

**Mineur — « Trouver le nombre caché » peut demander « 1 + ? = 1 »** — exercice `add-3` (`add-trou`, `min: 1`) — réponse 0 (sonde : 2/40). Correction suggérée : `min: 3`.

**Mineur — un quart des comparaisons porte sur deux nombres identiques** — `comp-1` à `comp-3`, `cp-bonus-comparaison-defi` ; `js/engines-math.js::compare` force l'égalité 1 fois sur 5, plus le hasard — sonde : 13/40 réponses « = » pour `comp-1` comme pour le défi « grands nombres » (« 37 … 37 », « 86 … 86 »). Correction suggérée : ramener l'égalité à 10 %.

**Mineur — répétitions dans une même série (espaces de valeurs trop petits)** — les générateurs procéduraux ne mémorisent pas les questions déjà posées. Là où peu de valeurs existent, une question revient dans la série : `banquier-1` « Le Marché » (4 pièces de 1 ou 2 € : 5 totaux possibles, répétition dans toutes les séries sondées), `cible-1` et `cible-2` (6 totaux ; « 2 + 2 » trois fois de suite en ouverture de sonde), `cp-doubles-moities` et `cp-moities` (10 valeurs), `add-4` (9 valeurs), `cp-dictee-0-10` et `cp-dictee-10-20` (11 valeurs). Correction suggérée : mémoriser les questions tirées dans la série, comme le font déjà les banques (`usedSet`), ou élargir les zones.

**Mineur — l'horloge annonce « Nuit » pour 7 heures sur 12** — exercice `cp-clock-heures-pleines` (`clock`, `level: 1`) ; `js/engines-math.js::clock` (`isDay = h >= 8 && h < 20`, avec `h` de 1 à 12) — de 1 h à 7 h, le cadran porte une lune et « Nuit » (sonde : 27/40). Sur un cadran de 12 heures, 3 h 30 peut être l'après-midi, et 7 h est le matin pour un enfant (`cp-lesson-heures-journee` : « Je vais à l'école le matin »). Correction suggérée : retirer l'indicateur au niveau 1, ou le tirer indépendamment avec « matin / après-midi ».

**Mineur — « Carré magique » n'est pas un carré magique** — exercices `carre-1`, `carre-2`, `carre-3`, `cp-bonus-carre-magique-defi` — la consigne réelle est « Touche 2 nombres dont la somme fait 10 » parmi 4 nombres ; un carré magique est une grille dont lignes et colonnes ont la même somme. Correction suggérée : « Trouve la paire qui fait 10 ».

**Mineur — « EUR » dans l'exercice, « € » dans la leçon** — exercices `banquier-1`, `banquier-2`, `cp-bonus-caisse-defi` ; `js/ui-visuals.js::drawMoneyCard` — chaque pièce et chaque billet porte « EUR », alors que `cp-lesson-cibles-monnaie` écrit « 2 € + 2 € + 1 € ». Correction suggérée : « € ».

**Mineur — quasi-doublons et vocabulaire mêlé dans les formes (persistant, précisé)** — `data/math_geometry_cp.json`, cat. `cp-formes-reconnaissance` (exercices `cp-geo-formes-reconnaitre`, `cp-bonus-formes-mesures-defi`) — items jumeaux (« Le rectangle a… 4 côtés » / « Combien de côtés a un rectangle ? » ; deux items « part / morceau de pizza » ; deux items « triangle, 3 côtés ») ; « coins » (items 9, 13) et « sommets » (explications 6 et 19) alors que la leçon ne dit que « coins » ; « rond » (items 11, 13, 16, 20) à côté de « cercle » ; « 4 angles droits » (explication 7), notion de CE1. Correction suggérée : un seul mot par notion, celui de la leçon ; d'autres supports que la pizza ; retirer « angles droits ».

**Mineur — explications absentes et verbe « prêter » (persistant, étendu)** — `data/math_word_problems_cycle2.json`, cat. `cp-problemes-simples` — les **8 derniers items** (11 à 18) n'ont pas d'`explanation`, seul retour de l'enfant qui se trompe ; l'item 16 garde « J'en prête 2 » ; l'item 17 (« 3 poules pondent chacune 1 œuf ») relève de la multiplication. Correction suggérée : rédiger les 8 explications, « donne » au lieu de « prête », remplacer l'item 17.

**Mineur — trois exercices sur le même vivier de problèmes** — `cp-problemes-simples`, `cp-problemes-quotidien` et `cp-bonus-problemes-expert` puisent dans `cp-problemes-simples` (18 items) : le « défi expert » n'est pas plus difficile ; `cp-bonus-problemes-deux-etapes-defi` tire 8 questions d'une banque de 8 items. Correction suggérée : un vivier propre au défi, ou fusionner.

**Mineur — explications imprécises sur la règle** — `data/math_geometry_cp.json`, cat. `cp-longueurs-comparaison`, items 7 (« des petits traits qui s'appellent des centimètres ») et 16 (« Chaque graduation de la règle marque un centimètre de plus ») — les traits sont des graduations, et une règle a aussi des graduations de millimètre. Correction suggérée : « Les grands traits numérotés marquent les centimètres ».

**Suggestion — le défi addition contient des sommes de débutant** — `cp-bonus-addition-defi` (`maxSum: 50`) — 18 % de sommes ≤ 10 (sonde : 5/40, dont « 2 + 1 »). Correction suggérée : `min: 11`.

**Suggestion — solides dans une catégorie de figures planes (persistant, atténué)** — `data/math_geometry_cp.json`, cat. `cp-formes-reconnaissance`, items 17 (dé → cube) et 18 (ballon → boule) — la leçon les cadre désormais, mais la catégorie reste celle des formes planes. Correction suggérée : catégorie « solides » dédiée (le pavé manque : renvoi `curriculum-auditor`).

**Points positifs** : sur les **1 440 tirages des 36 exercices procéduraux**, la réponse recalculée indépendamment est identique à celle du moteur **1 433 fois** — les 7 écarts sont tous le Bloquant « quatre-vingts » (additions, soustractions, compléments, doubles, moitiés, cibles, monnaie, oiseau, horloge, comptage, dizaines/unités, valeur d'un chiffre, comparaisons : 100 % justes) ; les bornes restent dans le CP (nombres ≤ 99 ; défi de monnaie jusqu'à 44 € observés ; horloge limitée aux heures et demies) ; le « carré magique » a toujours exactement une paire solution ; `place-value` alterne bien dizaines et unités de 10 à 99 ; l'encadrement `cp_number_line_frame_dizaines` est juste ; `cp-ranger-croissant` et `cp-ranger-decroissant` (10 séries chacun, jusqu'à 80) n'ont qu'une bonne réponse et s'expliquent par les dizaines ; les leçons addition, soustraction, doubles/moitiés, encadrement et rangement ont des quiz de transfert exemplaires.

**Résumé** : Bloquant 1, Majeur 5, Mineur 15, Suggestion 3 (24 leçons, 55 exercices, 2 200 tirages).

---

## Français CP

### Leçons

**Mineur — l'exemple « chat » oublie la lettre muette** — leçon `cp-lesson-ecrire-mot-image` — « j'entends [ch] puis [a], alors j'écris ch puis a » : en suivant l'exemple, l'enfant écrit « cha », alors que `fr-animaux` attend « CHAT ». Correction suggérée : « … et je n'oublie pas le t qu'on n'entend pas ».

**Mineur — renvoi à des exercices qui n'existent pas au CP** — leçon `cp-lesson-dictee-mots-outils`, astuce « Pour a et à, on apprend la différence dans les exercices d'homophones » — le CP n'a aucun exercice d'homophones. Correction suggérée : retirer la phrase, ou dire comment distinguer a et à dans une phrase.

**Mineur — trois leçons sur « majuscule + point », dont une inexacte** — leçons `cp-lesson-phrase-simple`, `cp-lesson-la-phrase` et `cp-lesson-lire-phrases-courtes` — même notion trois fois ; `cp-lesson-la-phrase` affirme « Sans majuscule ni point, ce n'est pas une vraie phrase ! » et `cp-lesson-lire-phrases-courtes` « se termine par un point », alors que `cp-lesson-ponctuation` enseigne « ? » et « ! » (et que le propre `check` de `cp-lesson-lire-phrases-courtes` utilise « Le bébé pleure ? »). Correction suggérée : « se termine par un point, un point d'interrogation ou un point d'exclamation » ; différencier ou fusionner.

**Mineur — « par coeur » sans ligature** — leçon `cp-lesson-etre-avoir`, bloc `bullets` — les autres leçons écrivent « par cœur ». Correction suggérée : « cœur ».

**Suggestion — deux leçons pour la même notion de mots-outils (persistant)** — `cp-lesson-dictee-mots-outils` et `cp-lesson-mots-outils-niveaux`.

### Exercices

**Bloquant — deux mots impossibles à taper** — `data/french/spelling.json`, cat. `corps`, items « ŒIL » et « CŒUR » (exercice `fr-corps`, dictée d'images) — le clavier virtuel (`js/ui-keyboards.js::renderAlphaKeyboard`) propose é è ê ë à â ç î ï ô û ù - ' et l'espace, **pas « œ »** (touches relevées dans le rendu de la sonde) ; il n'existe pas de saisie au clavier physique ; `App.validateAnswer` compare en strict, donc « oeil » est refusé. Ces 2 items sur 15 sont perdus d'avance, et 57 % des séries de 5 en contiennent au moins un. Correction suggérée : touche « œ », ou équivalence « oe » = « œ » à la validation, ou retrait de ces mots de la dictée d'images.

**Bloquant — « Défi genre : un, une, le, la » : deux bonnes réponses, une seule acceptée** — exercice `cp-bonus-genre-mixte` (`gender-articles`, `options: ["le","la","un","une"]`) ; `js/engines-french.js::genderArticles` — dès que « un » ou « une » figure dans les options, la réponse attendue est l'article indéfini (sonde : 40 réponses attendues sur 40 sont « un » ou « une » ; appel direct : CHAT → « un » seul). Pour les 63 mots de `gender_cp` à consonne initiale (et pour HIBOU), « le chat » et « un chat » sont justes tous les deux, mais « le » est compté faux. Correction suggérée : une consigne qui désigne l'article attendu, ou accepter les deux articles du bon genre.

**Bloquant — « l'hibou » attendu** — exercice `cp-le-la` (options `["le","la"]`) sur `data/french/grammar.json::gender_cp`, item « HIBOU » ; `js/engines-french.js::genderArticles` range « h » parmi les voyelles et impose l'élision — la réponse attendue est « l' » (confirmé par appel direct du moteur), alors que « hibou » a un h aspiré : **le hibou** (TLFi). La bonne réponse de l'enfant est refusée. « HORLOGE » (h muet, « l'horloge », « mon horloge ») est juste. Correction suggérée : liste des h aspirés dans le moteur, ou champ `elision: false` sur l'item.

**Majeur — lettres muettes : la réponse est affichée** — `data/french/reading.json`, cat. `cp_lettres_muettes` (exercices `cp-lecture-muettes` et `cp-bonus-lecture-defi`) — les items 1 à 6 portent un champ `silent`, que `js/ui.js::drawReading` traduit par la classe `char-silent` (texte grisé, opacité 0,6 dans `css/app.css`) : « Quelle lettre ne se prononce pas ? » est posé sur un mot dont la lettre muette est déjà grisée. Les items 7 à 10, sans `silent`, fonctionnent. De plus, l'item 6 (« doigt ») propose « g », « t » et « gt » : « g » et « t » sont chacun muets, donc partiellement justes ; les distracteurs « h » de « chat » et « u » de « loup » ne se prononcent pas seuls non plus. Correction suggérée : ne griser qu'après la réponse ; distracteurs franchement prononcés.

**Majeur — dictée audio de mots-outils homophones isolés** — `data/french/spelling.json`, cat. `cp_mots_outils_p2` et `mots_outils_cp_niveau_2` (« À »), `cp_mots_outils_p4`, `mots_outils_cp_niveau_3`, `adverbes_cp_niveau_1`, `adverbes_frequents_cp` (« LÀ »), `mots_outils_cp_niveau_1` (« OU », « ET », « EST »), `mots_outils_cp_niveau_2` (« VERS », « DANS »), `cp_mots_outils_p3` (« SANS », « MAIS »), `mots_outils_cp` — le mot est prononcé seul, sans contexte : « à » s'entend comme « a », « là » comme « la », « ou » comme « où », « vers » comme « vert » ou « verre », « sans » comme « cent ». La validation étant stricte, accents compris, l'orthographe valable que choisit l'enfant est refusée. `cp-lesson-dictee-mots-outils` reconnaît elle-même que « a » et « à » ne se distinguent pas à l'oreille. Exercices touchés : `cp-audio-mots-outils-p2`, `-p3`, `-p4`, `cp-audio-mots-outils-niv1`, `-niv2`, `-niv3`, `cp-audio-adverbes-niv1`, `cp-bonus-mots-outils-complets`, `cp-bonus-adverbes-frequents`. Correction suggérée : dicter ces mots dans une courte phrase via le champ `audio` (« il va à l'école »), en gardant `word` comme réponse.

**Majeur — « Je ai », « Je aime » à l'écran** — exercices `cp-conj-etre-avoir`, `cp-bonus-conj-etre-avoir`, `cp-conj-verbes-simples` ; `js/engines-french.js::conjugation` et `js/ui.js::drawConjugation` — le pronom « Je » est affiché tel quel devant la forme à taper : « Je [ai] », « Je [aime] » (sonde : « Je + AVOIR » 3 fois sur 40). La leçon `cp-lesson-etre-avoir` enseigne « j'ai ». Correction suggérée : afficher « J' » devant une forme à voyelle initiale.

**Majeur — la conjugaison complète dépasse le CP (à arbitrer)** — sous-thème `cp-conjugaison` (`cp-conj-etre-avoir`, `cp-bonus-conj-etre-avoir`, `cp-conj-verbes-simples`, leçon `cp-lesson-etre-avoir`) — les six personnes d'être et d'avoir (« vous êtes ») et les verbes en -er à toutes les personnes (« nous mangeons ») sont, dans `PROGRAMME_SCOLAIRE_REFERENCE.md`, un attendu de **CE1**, absent de la liste CP ; `curriculum-audit-cp.md` le signale comme dépassement et renvoie l'analyse fine ici. Fuite de niveau vers le haut, sur un contenu exact. Correction suggérée : restreindre au singulier (je, tu, il/elle) en « découverte », ou assumer ce sous-thème comme une avance explicite.

**Majeur — « Défi : tous les mots outils » ne porte que sur la période 5, avec des répétitions forcées** — exercice `cp-bonus-mots-outils-defi` (`category: cp_mots_outils_p5`, `questions: 9`) — la catégorie compte 6 mots : chaque série redicte **3 fois** un mot déjà posé (sonde : « souvent », « toujours », « trop » deux fois chacun sur les 9 premiers tirages), et le titre promet « tous les mots outils ». Un second exercice porte le même titre (`cp-bonus-mots-outils-complets`, qui couvre bien 14 mots). Correction suggérée : pointer ce défi sur une catégorie réunissant les périodes 1 à 5 (30 mots), ou le retirer.

**Mineur — deux systèmes de mots-outils parallèles (persistant)** — sous-thèmes `cp-dictee-mots-outils-audio` (périodes P1-P5) et `cp-mots-outils-niveaux-subtheme` (niveaux 1-3, adverbes 1-2) — mêmes mots sous deux découpages ; les périodes comptent 6 mots pour 6 questions, donc chaque série dicte toujours les 6 mêmes mots. Correction suggérée : un seul système, des viviers plus larges que la série.

**Mineur — « Le ou La ? » propose trois boutons (persistant)** — exercice `cp-le-la` — pour les mots à voyelle initiale, le moteur ajoute « l' » (juste), mais le titre n'annonce que deux réponses. Correction suggérée : « Le, la ou l' ? ».

**Mineur — syllabes : la découpe est affichée, et certaines découpes sont discutables** — `data/french/reading.json`, cat. `cp_compter_syllabes` et `cp_reperer_syllabe` (exercices `cp-lecture-mots`, `cp-lecture-syllabes`) — `drawReading` colore les syllabes en alternance : « Combien de syllabes lis-tu ? » se résout en comptant les couleurs (rendu de la sonde : « ca mi on »), la segmentation n'est pas travaillée. Découpes contestables montrées à l'enfant : « ca-mi-on » (3 attendues ; « camion » se prononce [ka.mjɔ̃], 2 syllabes), « li-on » (`cp_son_on`, item 8), « cai-llou » (`cp_son_ou`, item 3, au lieu de cail-lou), « ba-llon » (`cp_son_on`, item 2, au lieu de bal-lon). La convention (syllabes écrites avec e muet : « sa-la-de », « mi-nu-te » = 3) n'est expliquée nulle part, alors que `cp-lesson-ecouter-ecrire-mot` fait frapper les syllabes orales. Correction suggérée : mot sans couleurs pour ces deux exercices, remplacer « camion » et « lion », corriger les découpes, nommer la convention dans `cp-lesson-lire-syllabes`.

**Mineur — consigne « le mot » pour une syllabe ou une phrase** — exercices `cp-audio-syllabes` et `cp-audio-phrase-courte` ; `js/ui.js::drawAudioSpelling` — l'aide affiche toujours « Écoute bien le mot, puis écris-le » et « Le mot est en train d'être lu » (rendu de la sonde). Correction suggérée : aligner ce texte sur la question, déjà corrigée pour les phrases.

**Mineur — images ambiguës, et textes techniques visibles** — `data/french/spelling.json`, cat. `school` (« GOMME » 🧽 éponge, « TROUSSE » 🧰 boîte à outils, « COLLE » 🧴, « FEUTRE » 🖍️ crayon de cire, « TABLEAU » 🟩, « ARDOISE » ⬛), `house` (« LAMPE » 💡 ampoule), `food` (« YAOURT » 🥣 bol), `corps` (« TÊTE » 🧑) ; `data/french/grammar.json::gender_cp` (« GOMME » 🧽, « TROUSSE » ✏️, « BALLE » 🏀 ballon de basket, alors que « BALLON » ⚽ est aussi dans la liste) — l'enfant qui écrit ce qu'il voit (« éponge », « ampoule ») est corrigé. Sous l'icône, `drawSpelling` affiche « Icône utilisée » (dictée d'images) ou « Illustration indisponible » (exercices de genre : aucune des 80 images `assets/img/<mot>.png` attendues n'existe). Correction suggérée : émojis non ambigus ou mots mieux illustrables ; suppression de ces textes (`ui-craftsman`).

**Mineur — métalangage de cycle 3 dans les explications** — `data/french_word_order.json`, cat. `word_order_cp` (105 explications « sujet + verbe + complément », « complément de lieu ») ; `data/french_cp_grammar.json`, cat. `cp-determinants` (« article indéfini », « masculin singulier », « s'élide », « h muet ») et `cp-nom-verbe` (item 10 « ce que fait ou ce qu'est le sujet », « un état (est, semble) ») — le sujet est une notion de CE1, le complément et l'élision du cycle 3. Correction suggérée : « la phrase dit qui fait quoi », « on dit le chien ».

**Mineur — phrases peu idiomatiques dans l'ordre des mots** — `data/french_word_order.json`, cat. `word_order_cp`, items 3 (« Paul mange un pain »), 8 (« Le soleil brille haut »), 53 (« Karim lave le robinet »), 82 (« Le papillon vole léger »), 94 (« Le requin nage profond ») — une phrase modèle doit être naturelle. Correction suggérée : « Paul mange du pain », « Le papillon vole doucement »…

**Mineur — « Comprendre une petite histoire » ne contient pas d'histoire** — `data/french_cp_grammar.json`, cat. `cp_comprendre_histoire` (exercice `cp-lecture-comprendre-histoire`) — 8 phrases isolées, comme `cp_comprendre_phrase`, sans aucune `explanation`. Correction suggérée : 2 ou 3 phrases enchaînées par item, avec explication.

**Mineur — singulier/pluriel : pas d'explication, paires transparentes** — `data/french/grammar.json`, cat. `plural_choice_cp` (exercice `cp-gram-singulier-pluriel`, 8 questions sur 12 items) — aucune `explanation`, et les items vont par paires (« Le chat dort » / « Les chats dorment ») : la seconde se déduit de la première. Correction suggérée : explications (« chats a un s, dorment finit par -ent ») et items non appariés.

**Mineur — distracteurs mal orthographiés ou anglais** — `data/french_cp_grammar.json`, cat. `cp_lire_mots_simples` — « ecole », « écolle », « maisn », « maïson », « pier », « piet », « oeur », « oures », et des mots anglais (« flour », « line », « lane ») : exposer un lecteur débutant à des graphies fautives brouille sa mémoire orthographique. Correction suggérée : de vrais mots proches (chat / chant / char, comme l'item 1).

**Mineur — « le son œu »** — `data/french/reading.json`, cat. `cp_son_oeu` (exercice `cp-lecture-oeu`) — « œu » est une graphie du son [œ] (le même que « eu » de « fleur ») : on ne peut pas « entendre œu » par opposition à « eu ». L'item 6 (« chœur », [kœʁ]) est hors du vocabulaire CP. Correction suggérée : « Dans quel mot vois-tu œu ? », remplacer « chœur ».

**Mineur — phrase dictée sans majuscule ni point** — `data/french/spelling.json`, cat. `cp_phrases_courtes_dictee` (exercice `cp-audio-phrase-courte`) — les réponses attendues (« LE CHAT DORT ») n'ont pas de point, et le clavier n'en a pas, alors que trois leçons enseignent qu'une phrase finit par un point. Correction suggérée : le dire dans `cp-lesson-ecrire-phrase-dictee` (« ici, on écrit seulement les mots »).

**Suggestion — variété lexicale de l'ordre des mots (persistant)** — `word_order_cp` — « ferme » revient 8 fois (items 33, 45, 57, 63, 79, 83, 93, 103) ; les phrases de 3 mots se reconstituent sans lire (la majuscule donne le début, le point la fin).

**Points positifs** : sur les 2 440 tirages de français, **aucune réponse absente des choix**, aucun choix en double, aucun item injouable hormis ŒIL/CŒUR ; toutes les autres réponses se tapent avec les touches du clavier (vérification exhaustive des 20 catégories dictées) ; le champ `audio` des syllabes (« ma », « chu ») et des phrases correspond exactement à la réponse ; la question des dictées de phrase (« Écoute la phrase puis écris-la ») suit enfin ce qui est dicté ; `gender_cp` (80 mots) est juste hors HIBOU, sans mot corrompu ; les 13 sons complexes (`cp_son_*`) sont exacts et bien choisis ; `word_order_cp` n'a qu'un ordre valable par phrase.

**Résumé** : Bloquant 3, Majeur 5, Mineur 16, Suggestion 2 (15 leçons, 61 exercices, 2 440 tirages).

---

## Histoire CP (Questionner le temps)

### Leçons

**Mineur — la leçon annonce « plus tard » ce qu'enseigne la leçon voisine** — leçon `cp-lesson-temps-qui-passe`, bloc « À retenir » — « Plus tard, j'apprendrai aussi à me repérer avec le mois et l'année. » — or le même sous-thème contient `cp-lesson-mois-annee` (les 12 mois), désormais au programme du CP (thème 2 de 2026). Correction suggérée : retirer la phrase ou renvoyer à la leçon sur les mois.

**Mineur — « le jour et la nuit forment une journée »** — leçon `cp-lesson-jour-nuit` (bloc `bullets`) et `data/history_cp.json`, cat. `cp-jour-nuit`, item 5 (« Le jour et la nuit forment ensemble… une journée entière ») — au sens premier, la **journée** est le temps entre le lever et le coucher du soleil (TLFi) ; jour + nuit, c'est **un jour** (24 heures). Le Maths, lui, enseigne l'inverse : `math_geometry_cp.json::cp-moments-journee`, item 5 : « matin → midi → après-midi → soir. Puis vient la nuit ». Correction suggérée : « le jour et la nuit forment un jour de 24 heures ».

**Mineur — quiz de leçon longs** — leçons `cp-lesson-ordonner-evenements` (question de 144 caractères), `cp-lesson-vivre-autrefois` (120), `cp-lesson-jour-nuit` (113), `cp-lesson-temps-qui-passe` (111, choix de 68 caractères), `cp-lesson-ecole-autrefois`, `cp-lesson-traces-passe`, `cp-lesson-objets-passe` — moyenne de 95 caractères par question et 164 par explication, sans audio (anomalie transverse 5). Le 1er `check` de `cp-lesson-temps-qui-passe` repose en plus sur l'accord d'un verbe au passé composé (« Demain, je suis allée »). Correction suggérée : questions de moins de 80 caractères, choix courts.

**Mineur — quasi-doublon entre leçons (persistant)** — `cp-lesson-vivre-autrefois` et `cp-lesson-ecole-autrefois` (sous-thème `cp-histoire-vie`) — la plume et l'école qui change dans les deux. À différencier.

### Exercices

**Majeur — exercice d'EMC rangé en Histoire (persistant)** — `data/cp.json`, exercice `cp-emc-partager-materiel` (vivier `emc_cp.json::cp-partager-materiel`) dans le sous-thème `cp-histoire-traces-subtheme` — le partage du matériel classé sous « Traces du passé » (anomalie transverse 1) ; le même vivier est servi en EMC par `cp-emc-partager-classe` et `cp-emc-env-partager`. Correction suggérée : retirer cet exercice du sous-thème Histoire.

**Mineur — deux séquences admettent un autre ordre valable** — `data/history_cp.json`, cat. `cp-evenements-ordre` (exercice `cp-histoire-ordonner-evenements`) — item 10 (« l'année de l'arbre » : hiver → printemps → été attendu) : « printemps → été → hiver » est tout aussi chronologique, et c'est même l'ordre que posent `cp-lesson-quatre-saisons` et `science_cp.json::cp-saisons-meteo` (« printemps, été, automne, hiver ») ; item 9 (anniversaire) : ouvrir ses cadeaux avant de souffler les bougies est courant. Correction suggérée : des étapes dont l'ordre est imposé par la logique (on ne peut pas manger avant de cuire).

**Mineur — mois et saisons : deux conventions mêlées** — `data/history_cp.json`, cat. `cp-mois-ordre`, explications des items 3 (« avril, mai, juin : ce sont les mois du printemps ») et 6 (« septembre, octobre, novembre : ce sont les mois de l'automne ») — la première suit à peu près les saisons astronomiques, la seconde les saisons météorologiques ; ailleurs, le niveau suit l'astronomique (`cp-jours-saisons`, item 15 : Noël « quelques jours après le début de l'hiver »). Correction suggérée : « le printemps commence en mars », sans découper les mois par saison.

**Mineur — items ambigus ou inexacts** — `data/history_cp.json`, cat. `cp-avant-apres`, item 7 (« Avant le petit-déjeuner, il se passe… » → « le matin » ; « la nuit » est au moins aussi juste, et l'explication répond à une autre question : « Le petit-déjeuner se prend le matin ») ; cat. `cp-jours-saisons`, item 3 (« Après le printemps vient **souvent** l'été » : toujours). Correction suggérée : reformuler l'item 7 (« Le petit-déjeuner se prend… ») et retirer « souvent ».

**Mineur — tautologie et gabarits répétitifs (persistant)** — `data/history_cp.json`, cat. `cp-personnages-traces` — item 6 : « Un vieux bâtiment encore debout aujourd'hui, c'est… » → « un vieux bâtiment » (la réponse recopie la question, signalé aussi par `curriculum-auditor`) ; 7 items sur 20 tournent autour de la même formule « … une trace (du passé) ». Correction suggérée : réécrire l'item 6, varier les tournures.

**Mineur — distracteurs repérables par leur longueur (persistant)** — `data/history_cp.json` — 16 items, surtout `cp-generations` (5 sur 16 : « Une génération, c'est… » +39 caractères, « Quand papi avait mon âge… » +17) et `cp-metiers-autrefois` (4 sur 8, jusqu'à +19). Correction suggérée : étoffer les distracteurs (anomalie transverse 3).

**Suggestion — distracteurs absurdes** — `data/history_cp.json`, toutes catégories — « la table de 9 », « un nuage », « le train », « en plastique magique », « faire la vaisselle » : un seul choix plausible, la question n'apprend rien (règle R3, appliquée aux quiz de leçon mais pas aux banques) ; « le Moyen Âge » (`cp-avant-apres`, item 8) introduit en plus un repère du cycle 3.

**Suggestion — vocabulaire des métiers d'autrefois très dense pour un lecteur débutant** — `data/history_cp.json`, cat. `cp-metiers-autrefois` — « maréchal-ferrant », « rémouleur », « lavandières », « fournil », « animaux de trait », « charrue », « allumeur de réverbères » en 8 items, sans illustration ni audio. Correction suggérée : 2 ou 3 métiers, illustrés.

**Points positifs** : les nouveautés du programme 2026 sont **exactes et au bon niveau** — `cp-jour-nuit` (12 items) reste descriptif sans exiger la rotation de la Terre ; `cp-mois-annee` (14 items) et `cp-mois-ordre` (10 séries) sont justes, avec des explications qui corrigent l'erreur (« Ce sont les jours de la semaine qui sont au nombre de 7 ») ; `cp-evenements-ordre` travaille « d'abord, ensuite, enfin » sur des scènes familières ; plus aucune fuite de niveau (ni préhistoire, ni rois, ni dates) ; aucune `answer` hors `choices`.

**Résumé** : Bloquant 0, Majeur 1, Mineur 9, Suggestion 2 (9 leçons, 21 exercices, 840 tirages).

---

## Géographie CP (Questionner l'espace)

### Leçons

**Majeur — quiz de leçon trop longs pour un lecteur de CP** — leçons `cp-lesson-plan-ecole` (questions de 183 et 148 caractères), `cp-lesson-paysages-reperes` (160, choix de 75), `cp-lesson-se-reperer-ecole` (142), `cp-lesson-quartier` (133), `cp-lesson-gauche-droite` (128), `cp-lesson-transports-lieux` (126), `cp-lesson-points-cardinaux` (124) — moyenne de **109 caractères par question** et **214 par explication**, la plus haute du niveau, sans audio (anomalie transverse 5). Ces deux `check` conditionnent la validation de la leçon : un enfant qui ne lit pas encore couramment ne peut pas la valider. Correction suggérée : questions sous 80 caractères, choix de quelques mots.

**Mineur — titres proches (persistant)** — `cp-lesson-se-reperer-ecole` (« Se repérer à l'école », devant/derrière/gauche/droite) et `cp-lesson-plan-ecole` (« Le plan de l'école ») ; l'exercice `cp-geo-ecole-trajets` porte en plus le titre « Se repérer à l'école » sur le vivier `cp-se-reperer`, qui ne parle pas de gauche ni de droite. À clarifier.

**Mineur — un indice qui ne se voit pas sur une photo** — leçon `cp-lesson-paysages-reperes`, 1er `check` — « Quel indice prouve que l'on est au bord de la mer ? » → « L'eau salée à perte de vue » : le sel ne se voit pas sur une photo. Correction suggérée : « l'eau à perte de vue et les vagues ».

### Exercices

**Majeur — gauche et droite enseignées, jamais exercées** — sous-thème `cp-geo-reperage-subtheme` — deux leçons (`cp-lesson-se-reperer-ecole`, `cp-lesson-gauche-droite`) et quatre `check` portent sur la gauche et la droite, mais aucun exercice ne les pratique : le vivier `cp-se-reperer` (servi trois fois : `cp-geo-se-reperer`, `cp-geo-reperer`, `cp-geo-ecole-trajets`) parle d'escalier, de cour, de plan, de « devant » et d'« à côté » ; « gauche » n'apparaît dans `geography_cp.json` que dans des explications. Correction suggérée : 8 à 10 items gauche/droite (« Le ballon est à gauche de la chaise », main droite, point de vue de celui d'en face).

**Majeur — carte des continents sans leçon qui les nomme** — exercice `cp-geo-carte-monde-continents` (`map-locate`, `board_map_locate_cp.json::cp_map_continents_monde`) — l'enfant doit toucher l'Amérique du Nord, l'Amérique du Sud ou l'Océanie sur un planisphère sans nom (le SVG `world-continents.svg` n'a aucune étiquette, ce qui est voulu) ; mais aucune leçon ne nomme ni ne situe les continents (`cp-lesson-terre-mer-ocean` dit seulement « les très grandes terres : les continents », la banque `cp-representations-monde` en nomme trois). Les indices des consignes (« le continent du Canada », « du Brésil », « de l'Australie ») supposent de connaître ces pays. Correction suggérée : une leçon courte « Les six continents » (nom + position + un animal ou un repère connu), ou des indices accessibles (« en bas à gauche du planisphère »).

**Majeur — exercices rangés hors de leur sous-thème et titre trompeur** — `cp-geo-transports-lieux` (« Transports et lieux ») est rangé dans `cp-geo-paysages-subtheme` en doublon de `cp-geo-transports` (même titre, même vivier) ; `cp-bonus-geo-paysages-defi` promet « paysages et déplacements » mais ne tire que dans `cp-paysages`. Anomalie transverse 1. Correction suggérée : retirer le doublon, renommer le défi.

**Mineur — titres sans accents** — `data/cp.json`, exercices `cp-geo-se-reperer` (« Se reperer dans l'espace »), `cp-bonus-geo-paysages-defi` (« Defi : paysages et deplacements ») et, en Histoire, `cp-bonus-histoire-vie-defi` (« Defi : vie autrefois ») — texte visible par l'enfant. Correction suggérée : « Se repérer », « Défi », « déplacements ».

**Mineur — distracteurs repérables par leur longueur (persistant)** — `data/geography_cp.json` — 18 items, surtout `cp-lieux-ecole` (6 sur 20 : « Le couloir de l'école sert à… » +20, « Les toilettes sont souvent… » +18). Anomalie transverse 3.

**Mineur — chevauchements entre catégories (persistant)** — `data/geography_cp.json` — quatre exercices sur `cp-transports-lieux` ; le même début de question « Le bus sert à… » attend « se déplacer » dans `cp-transports-lieux` et « transporter plusieurs personnes » dans `cp-trajets-quotidiens` ; trottoir et passage piéton reviennent dans les deux. Correction suggérée : spécialiser les viviers.

**Mineur — « lieux publics » : notion floue** — `data/geography_cp.json`, cat. `cp-lieux-publics`, items 9 (« cabinet médical ») et 10 (« boulangerie ») — un cabinet et un commerce ne sont pas des lieux publics au sens du programme (mairie, école, bibliothèque, poste). Correction suggérée : les remplacer par la piscine municipale, le gymnase, la médiathèque.

**Mineur — notions de cycle 3 dans les paysages** — `data/geography_cp.json`, cat. `cp-paysages`, items 9 (« Un paysage change selon les activités humaines et la nature ») et 10 (« Habiter un espace, c'est aussi… ») — « habiter » est le concept structurant du cycle 3. Correction suggérée : des items d'observation (« Qu'a construit l'homme sur cette photo ? »).

**Mineur — « presque toujours » contredit par l'explication** — `data/geography_cp.json`, cat. `cp-points-cardinaux`, item 4 — question : le nord est « presque toujours » en haut ; explication : « toutes les cartes sont dessinées avec le nord en haut ». Correction suggérée : « la plupart des cartes ».

**Suggestion — une catégorie hors niveau reste dans le bundle** — `data/board_map_locate_cp.json::cp_map_regions_france` (8 régions administratives) n'est plus servie au CP mais reste dans la banque et dans `js/data-bundle.js` : une réactivation par erreur rouvrirait la fuite de niveau corrigée en juillet. Correction suggérée : la retirer du fichier CP.

**Suggestion — « soleil » et « Soleil »** — `cp-lesson-points-cardinaux` et `cp-points-cardinaux` écrivent « le soleil », `cp-lesson-jour-nuit` et `cp-jour-nuit` « le Soleil ». Harmoniser (majuscule pour l'astre).

**Points positifs** : les points cardinaux (`cp-points-cardinaux` 12 items, `cp-rose-des-vents` 10 items) et les représentations du monde (`cp-representations-monde` 12, `cp-terre-mer-ocean` 10) sont exacts, bien gradués et au niveau (opposés, demi-tour, nord en haut, globe qu'on fait tourner, planisphère qu'on affiche) ; le constat de 2026-07 « carte et pays en marge de l'espace proche » est **caduc** : le thème 2 du programme 2026 place le globe et le planisphère au CP ; l'espace proche reste bien traité (plan vu d'en haut, légende, trajets, sécurité routière) ; aucune `answer` hors `choices`.

**Résumé** : Bloquant 0, Majeur 4, Mineur 8, Suggestion 2 (10 leçons, 22 exercices, 880 tirages).

---

## Sciences CP (Questionner le vivant, la matière et les objets)

### Leçons

**Mineur — « un objet peut changer d'état sans disparaître »** — leçon `cp-lesson-matiere-etat`, bloc « À retenir » — c'est la **matière** qui change d'état (la glace devient de l'eau), pas l'objet ; et la banque dit le contraire pour le sucre (voir plus bas). Correction suggérée : « Une matière peut changer d'état sans disparaître ».

**Suggestion — le déplacement comme critère de l'animal (persistant, atténué)** — leçon `cp-lesson-plantes-animaux` — la leçon dit désormais « la plupart des animaux se déplacent » (progrès), mais l'explication du 2e `check` affirme « Ce qui compte, c'est de se déplacer ». Correction suggérée : « L'escargot est un animal : il se déplace, même lentement ».

### Exercices

**Majeur — trois exercices rangés hors de leur sous-thème, en doublon (dont 1 persistant)** — `data/cp.json` : `cp-sciences-corps-sens` (« Révision : les cinq sens ») dans `cp-sciences-milieux-subtheme` (« Où vivent les animaux ? ») ; `cp-sciences-objets-usages` (« Objets et usages ») dans `cp-sciences-matiere-subtheme` (« Matière et lumière »), en doublon de `cp-sciences-objets-usages-quotidien` ; `cp-sciences-hygiene` (« L'hygiène au quotidien ») dans `cp-sciences-objets-subtheme`, en doublon de `cp-sciences-hygiene-quotidienne`. Anomalie transverse 1. Correction suggérée : retirer les doublons.

**Majeur — un vivier, plusieurs titres : la promesse n'est tenue qu'en partie** — `data/science_cp.json` — `cp-saisons-meteo` (15 items) sert « Les quatre saisons », « Le temps qu'il fait » et **« S'habiller selon la saison »** (`cp-sciences-habits-saison`) : 3 items sur 15 parlent de vêtements ; `cp-milieux-vie` (14 items) sert **« La maison et le jardin »** (`cp-sciences-maison-jardin`) : 4 items sur 14, le reste porte sur la forêt, la mer et la mare, et **« Défi : milieux et sens »** (`cp-bonus-sciences-milieux-defi`) sans aucun item sur les sens ; `cp-objets-quotidien` (12 items) sert « À quoi ça sert ? » et **« En quoi c'est fait ? »** : 6 sur 12 ; `cp-corps-sens` (20 items) sert **« Les cinq sens »** (`cp-sciences-cinq-sens`) et « Révision : les cinq sens » : 10 sur 20 (le reste : sommeil, sport, squelette, dos, cicatrisation). Anomalie transverse 2. Correction suggérée : scinder chaque vivier par facette (saisons / météo / vêtements ; sens / santé ; usage / matière), puis pointer chaque exercice sur la sienne.

**Mineur — flottaison : « plus léger que l'eau »** — `data/science_cp.json`, cat. `cp-matiere`, item 16 — « Le liège est plus léger que l'eau : il flotte. La pièce et le caillou, plus lourds, coulent ! » installe la conception erronée « lourd = coule » (un gros bateau est lourd et flotte). Correction suggérée : « Le bouchon flotte, la pièce coule : on le voit en essayant ».

**Mineur — le sucre « disparaît »… mais « il est toujours là »** — `data/science_cp.json`, cat. `cp-matiere`, item 13 — la réponse attendue est « disparaît en se dissolvant », l'explication dit l'inverse (« on ne le voit plus, mais… il est toujours là »). Correction suggérée : réponse « on ne le voit plus, mais l'eau est sucrée ».

**Mineur — doublons exacts entre catégories (persistant)** — `data/science_cp.json` — « Se laver les mains aide à… rester propre » dans `cp-corps-sens`, `cp-besoins-corps` et `cp-hygiene-quotidienne` ; « Une cuillère / des ciseaux / un parapluie / une brosse à dents sert à… » dans `cp-objets-usages` et `cp-objets-quotidien` ; « Pour être en forme, il faut aussi… » dans deux catégories avec deux réponses différentes. Correction suggérée : dédoublonner.

**Mineur — titres qui promettent un support absent** — exercices `cp-sciences-thermometre` (« Lire un thermomètre » : aucun thermomètre n'est affiché, QCM textuel — signalé aussi par `curriculum-auditor`) et `cp-sciences-matiere` / `cp-bonus-sciences-matiere-defi` (« Matière et lumière » : la lumière n'a aucune leçon). Correction suggérée : « La température en degrés » ; « La matière ».

**Mineur — distracteurs repérables par leur longueur (persistant)** — `data/science_cp.json` — 15 items, surtout `cp-tri-trois-categories` (4 sur 12, jusqu'à +17). Anomalie transverse 3.

**Mineur — l'œuf présenté comme non vivant** — `data/board_memory_match_cp.json`, cat. `cp_memory_match_sciences`, item 1, explication « Aucun de ces objets n'est vivant » (pull, miel, chaise, **œuf**) — un œuf fécondé est vivant ; `science_cp.json::cp-tri-trois-categories`, item 8, contourne bien la difficulté (« un œuf rangé dans le frigo… a été fait par une poule »). Correction suggérée : « un œuf du frigo » ou un autre produit (fromage).

**Suggestion — l'état gazeux en avance** — `data/science_cp.json`, cat. `cp-matiere`, item 10 (« liquide, solide ou… gazeuse ») et leçon `cp-lesson-matiere-etat` (« Solide, liquide, gaz ») — la liste CP du référentiel cite « solide, liquide » ; le gaz, invisible, est difficile à observer au CP. À arbitrer avec `curriculum-auditor`.

**Points positifs** : le **tri à trois catégories** (`cp-tri-trois-categories`, `cp_memory_match_sciences`, leçon `cp-lesson-vivant-fabrique`) et la **température** (`cp-chaud-froid`, `cp-temperature-thermometre`, deux leçons) sont exacts, précis et au niveau (la main qui compare au lieu de mesurer, le thermomètre à l'ombre, 0 degré) ; les cas frontières du vivant restent bien traités (arbre, graine) ; « certains objets en métal » pour l'aimant ; aucune `answer` hors `choices`.

**Résumé** : Bloquant 0, Majeur 2, Mineur 7, Suggestion 2 (15 leçons, 27 exercices, 1 080 tirages).

---

## EMC CP

### Leçons

**Mineur — « les émotions sont des sentiments », et quatre émotions présentées comme toutes** — leçon `cp-lesson-emotions` (« Les émotions sont des sentiments que tout le monde ressent ») et `data/emc_cp.json`, cat. `cp-emotions`, item 10 (« Toutes les émotions (joie, peur, tristesse, colère) sont… ») — le texte de 2024 distingue émotions et sentiments et travaille six émotions de base ; présenter quatre émotions comme la liste complète est inexact (le manque de dégoût et de surprise relève de `curriculum-auditor`). Correction suggérée : « Il existe plusieurs émotions, par exemple… ».

**Mineur — quiz de leçon aux choix longs** — leçons `cp-lesson-vivre-ensemble` (choix de 73 caractères), `cp-lesson-environnement` (question de 125 caractères, choix de 63), `cp-lesson-droits-devoirs` (118), `cp-lesson-exprimer-emotions`, `cp-lesson-regles-classe` — choix de 47 caractères en moyenne (le plus haut du niveau) et explications de 190, sans audio (anomalie transverse 5). Correction suggérée : raccourcir les choix.

**Suggestion — trois leçons qui se recouvrent (persistant, étendu)** — `cp-lesson-vivre-ensemble`, `cp-lesson-regles-classe` et `cp-lesson-respect-materiel` (même sous-thème) — partager, ranger et prendre soin des affaires dans les trois.

### Exercices

**Majeur — trois exercices rangés hors de leur sous-thème** — `data/cp.json` : `cp-emc-sec-politesse` (« Politesse en classe ») dans `cp-emc-securite-subtheme`, sous **le même titre** que `cp-emc-politesse-classe` (sous-thème « Vivre ensemble ») ; `cp-emc-vote-vivre-ensemble` (« Voter ensemble », sur le vivier `cp-vivre-ensemble`, sans aucun item sur le vote — persistant, reclassé Majeur conformément à la grille « exercice mal classé ») ; `cp-emc-env-partager` (« Partager le matériel ») dans `cp-emc-environnement-subtheme`. Anomalie transverse 1. Correction suggérée : retirer ou repointer (`cp-emc-vote-vivre-ensemble` → `cp-vote`).

**Majeur — quatre exercices, un seul vivier d'émotions** — `data/cp.json`, `cp-emc-emotions` (« Mes émotions »), `cp-emc-exprimer-emotions` (« Exprimer ses émotions »), `cp-emc-reconnaitre-emotions` (« Reconnaître les émotions ») et `cp-bonus-emc-emotions-defi` tirent tous dans `emc_cp.json::cp-emotions` (10 items) : « Exprimer ses émotions » ne trouve que 3 items sur l'expression (6, 7, 9), « Reconnaître » 5 sur 10. Anomalie transverse 2. Correction suggérée : deux viviers (reconnaître / exprimer), enrichis des émotions manquantes.

**Mineur — appariements tautologiques ou ambigus (persistant, étendu)** — `data/emc_matching.json`, cat. `matching_emc_cp` — item 1 : « bonjour → pour dire bonjour », « au revoir → pour dire au revoir » ; item 8 : « Relie chaque émotion… » avec « je suis fatigué » et « je suis perdu », qui ne sont pas des émotions ; item 2 : « attendre son tour » et « parler doucement » valent pour plusieurs lieux proposés. Correction suggérée : « bonjour → quand j'arrive », titre « chaque situation », règles propres à un seul lieu.

**Mineur — chevauchements entre catégories (persistant)** — `data/emc_cp.json` — prêter, partager et rendre reviennent dans `cp-entraide` et `cp-partager-materiel` ; écouter et attendre son tour dans `cp-vivre-ensemble` et `cp-politesse-classe` ; `cp-partager-materiel` est servi par trois exercices dans trois matières ou sous-thèmes. Correction suggérée : spécialiser les viviers.

**Mineur — distracteurs repérables par leur longueur (persistant, aggravé)** — `data/emc_cp.json` — 20 items, la matière la plus touchée : `cp-environnement` (8 sur 12, jusqu'à +34 : « utiliser une gourde réutilisable plutôt qu'une bouteille en plastique ») et `cp-vote` (5 sur 12, jusqu'à +31). Anomalie transverse 3.

**Suggestion — « délégué de classe » en avance (persistant)** — `data/emc_cp.json`, cat. `cp-vote`, item 12 — l'élection de représentants relève plutôt du cycle 3.

**Points positifs** : les consignes de sécurité sont justes et prudentes (appeler un adulte, regarder même au vert, ceinture à chaque trajet) ; le vote est traité de façon équilibrée (une voix par élève, accepter le résultat, dire son désaccord calmement) ; les quiz de leçon d'EMC sont de vrais cas de transfert (« Malo lève la main pour les deux jeux ») ; aucune `answer` hors `choices`.

**Résumé** : Bloquant 0, Majeur 2, Mineur 5, Suggestion 2 (10 leçons, 20 exercices, 800 tirages).

---

## Constats de l'audit du 2026-07-24 : résolus / persistants

Chacun des 31 constats a été revérifié dans les données du 2026-09-28.

| # | Constat du 2026-07-24 | Statut | Où c'est traité ici |
|---|---|---|---|
| 1 | Maths, Majeur — quadrillage : base 0 dans la banque, base 1 dans la leçon | **Persistant** (précisé : plateau sans numéros, leçon ambiguë elle-même) | Maths, Majeur |
| 2 | Maths, Mineur — `cp-lesson-defi-chercher` / `-verifier` méthodologiques | **Persistant** | Maths, Mineur |
| 3 | Maths, Mineur — quasi-doublon `cp-lesson-defi-chercher` / `cp-lesson-resoudre-probleme` | **Persistant** | Maths, Mineur |
| 4 | Maths, Suggestion — solides absents des leçons | **Résolu** (l'astuce de `cp-lesson-formes-simples` nomme cube et boule) | — |
| 5 | Maths, Mineur — cube et boule dans une catégorie 2D | **Atténué** (cadré par la leçon ; reclassé Suggestion) | Maths, Suggestion |
| 6 | Maths, Mineur — items quasi identiques (pizza, côtés du rectangle) | **Persistant** (+ vocabulaire coins/sommets, « angles droits ») | Maths, Mineur |
| 7 | Maths, Suggestion — « prêter » sans explication | **Persistant et étendu** (8 items sans explication, pas 1) ; reclassé Mineur | Maths, Mineur |
| 8 | Français, Suggestion — « école » : le son [k] écrit c | **Résolu** | — |
| 9 | Français, Suggestion — deux leçons de mots-outils | **Persistant** | Français, Suggestion |
| 10 | Français, Mineur — deux systèmes de mots-outils, deux défis au même titre | **Persistant, et aggravé** pour `cp-bonus-mots-outils-defi` (période 5 seule, répétitions forcées → Majeur) | Français, Majeur + Mineur |
| 11 | Français, Mineur — « Le ou La ? » propose « l' » | **Persistant** (et le moteur se trompe sur HIBOU → Bloquant nouveau) | Français, Mineur + Bloquant |
| 12 | Français, Suggestion — variété lexicale de `word_order_cp` | **Persistant** | Français, Suggestion |
| 13 | Histoire, Mineur — quasi-doublon vivre / école autrefois | **Persistant** | Histoire, Mineur |
| 14 | Histoire, Suggestion — mois et année en avance | **Caduc** : le thème 2 du programme 2026 place les 12 mois au CP ; mais une phrase de `cp-lesson-temps-qui-passe` en garde la trace (nouveau Mineur) | Histoire, Mineur |
| 15 | Histoire, Majeur — `cp-emc-partager-materiel` rangé en Histoire | **Persistant** | Histoire, Majeur |
| 16 | Histoire, Mineur — distracteurs trop longs | **Persistant** (16 items) | Histoire, Mineur |
| 17 | Histoire, Mineur — gabarits répétitifs de `cp-personnages-traces` | **Persistant** (+ tautologie de l'item 6) | Histoire, Mineur |
| 18 | Géographie, Mineur — titres proches se repérer / plan | **Persistant** | Géographie, Mineur |
| 19 | Géographie, Mineur — distracteurs trop longs | **Persistant** (18 items) | Géographie, Mineur |
| 20 | Géographie, Mineur — chevauchements inter-catégories | **Persistant** | Géographie, Mineur |
| 21 | Géographie, Mineur — carte et pays en marge de l'espace proche | **Caduc** (thème 2 du programme 2026 : globe et planisphère au CP) | — |
| 22 | Sciences, Suggestion — « vivant = qui bouge » | **Largement résolu** (« la plupart des animaux ») ; reste une explication | Sciences, Suggestion |
| 23 | Sciences, Majeur — `cp-sciences-corps-sens` dans « milieux » | **Persistant** (et deux autres cas du même type) | Sciences, Majeur |
| 24 | Sciences, Mineur — doublons exacts inter-catégories | **Persistant** | Sciences, Mineur |
| 25 | EMC, Suggestion — vivre ensemble / règles de la classe | **Persistant** (étendu à `cp-lesson-respect-materiel`) | EMC, Suggestion |
| 26 | EMC, Mineur — appariement tautologique | **Persistant** | EMC, Mineur |
| 27 | EMC, Mineur — « Voter ensemble » sans vote | **Persistant**, reclassé Majeur (exercice mal classé) | EMC, Majeur |
| 28 | EMC, Mineur — chevauchements | **Persistant** | EMC, Mineur |
| 29 | EMC, Suggestion — « délégué » | **Persistant** | EMC, Suggestion |
| 30 | Transverse — 67 items à réponse la plus longue | **Persistant** (74 items) | Anomalie transverse 3 |
| 31 | Transverse — BOM sur 6 banques | **Persistant** (+ `french/conjugation.json`, 7 banques) | Anomalie transverse 4 |

Bilan : **2 résolus**, **2 caducs** (le programme 2026 a changé la règle), **2 atténués**, **25 persistants**, dont 5 étendus ou aggravés (n° 7, 10, 23, 30, 31). Aucun des 4 Bloquants de cette passe n'était signalé le 2026-07-24 : trois viennent de moteurs que l'audit précédent n'avait pas fait tourner (`numberToFrench`, et deux fois `genderArticles`), le quatrième du clavier virtuel face à une catégorie de dictée déjà présente (`corps`).

## Sonde des tirages

Méthode : Playwright emprunté au cache npx (jamais ajouté au projet), serveur statique local, `App.loadGrade` sur le CP, puis pour chaque exercice `App.startExercise(exercise)` et 39 appels `App.generateNextQuestion()` (compteur remis à zéro entre deux tirages), lecture de `App.state.problemData` (énoncé réel dans `question`, `data.prompt` ou `data.question` selon le moteur ; `data.boardKind` pour les plateaux) et du rendu (`#math-problem`, `#keyboard-num`). Les 36 exercices procéduraux de mathématiques ont été recalculés indépendamment ; les moteurs `genderArticles` et `numberToFrench` ont en plus été appelés directement sur HIBOU, HORLOGE, CHAT et les nombres 21, 71, 80, 81, 85, 90, 91, 99.

| Exercice(s) | Tirages | Ce qui a été mesuré | Anomalie |
|---|---|---|---|
| `add-1`, `add-2`, `add-3`, `add-4`, `add-5`, `cp-bonus-addition-defi` | 240 | réponse recalculée, bornes, trivialité | 100 % justes ; `add-2` : 23/40 sommes ≤ 10 et « 1 + 1 » 4 fois ; `add-3` : « 1 + ? = 1 » 2 fois ; défi : 5/40 sommes ≤ 10 |
| `sub-1`, `sub-2`, `sub-3`, `cp-bonus-soustraction-defi` | 160 | réponse, part de « - 0 » et « a - a » | 100 % justes ; **dégénérés : 21/40, 11/40, 6/40, 7/40** ; « 1 - 0 » 6 fois dans `sub-1` |
| `comp-1`, `comp-2`, `comp-3`, `cp-bonus-comparaison-defi` | 160 | signe recalculé, part de « = » | 100 % justes ; « = » : 13, 7, 7 et 13 sur 40 |
| `math-count-1`, `math-count-2` | 80 | dizaines × 10 + unités, bornes | 100 % justes, bornes respectées |
| `cp-doubles-moities`, `cp-moities` | 80 | double / moitié recalculés | 100 % justes ; 10 valeurs seulement, répétitions dans la série |
| `cible-1` à `cible-3`, `banquier-1`, `banquier-2`, `cp-bonus-caisse-defi` | 240 | somme des flèches ou des pièces, zones autorisées | 100 % justes ; `banquier-1` : 5 totaux possibles, répétitions dans chaque série ; « 2 + 2 » trois fois de suite (`cible-1`) ; symbole « EUR » |
| `oiseau-1` | 40 | somme, réponse parmi les 3 choix | 100 % justes |
| `carre-1` à `carre-3`, `cp-bonus-carre-magique-defi` | 160 | nombre de paires solutions | exactement 1 paire à chaque tirage |
| `cp-clock-heures-pleines` | 40 | réponse HHMM, minutes, indicateur | 100 % justes (heures 1-12, minutes 0 ou 30) ; « Nuit » 27/40 |
| `cp-dictee-0-10`, `cp-dictee-10-20`, `cp-dictee-20-69`, `cp-bonus-dictee-nombres-defi` | 160 | orthographe comparée à une table de référence (rectifications 1990) | **`cp-dictee-20-69` : 7 écarts sur 40, tous « quatre-vingts-… »** (Bloquant) ; les trois autres 100 % justes |
| `cp-decomposition-dizaines-unites`, `cp-valeur-chiffre-dizaines-unites` | 80 | chiffre ou valeur recalculés, nombres 10-99 | 100 % justes, dizaines et unités alternées |
| `cp-ligne-numerique-0-10`, `-0-100`, `cp-encadrement-dizaines` | 120 | rendu des étiquettes | **0-100 : toutes les graduations étiquetées** (Majeur) |
| `cp-geo-quadrillage`, `cp-bonus-quadrillage-defi` | 80 | rendu du plateau, consignes | aucun numéro de ligne ni de colonne ; « ligne 0 », « colonne 0 » (Majeur) |
| `cp-maths-memoire` | 40 | cartes en double | « 4 » et « 5 » en double dans l'item 1 (Majeur) |
| `cp-ranger-croissant`, `cp-ranger-decroissant`, `cp-histoire-mois-ordre` | 120 | aide et amorce affichées | amorce juste, aide « Construis la phrase… les mots » fausse |
| `fr-*` (6 dictées d'images) + défi | 280 | touches du clavier | pas de « œ » : ŒIL et CŒUR intapables (Bloquant) |
| 21 dictées audio | 840 | `audio` = réponse, aide affichée, taille du vivier | `audio` toujours conforme ; aide « le mot » pour syllabes et phrases ; défi P5 : 3 répétitions par série de 9 |
| `cp-un-une`, `cp-le-la`, `cp-mon-ma`, `cp-bonus-genre-mixte` | 160 | réponse attendue, choix, texte sous l'image | défi mixte : 40/40 réponses indéfinies (Bloquant) ; HIBOU → « l' » (appel direct, Bloquant) ; « Illustration indisponible » affiché |
| `cp-conj-etre-avoir`, `cp-conj-verbes-simples`, `cp-bonus-conj-etre-avoir` | 120 | pronom affiché + forme | « Je » + « ai » non élidé (Majeur) |
| 16 exercices `reading` | 640 | rendu | syllabes colorées (réponse au comptage visible) ; lettres muettes grisées (Majeur) |
| 110 autres exercices sur banque (`factual-qcm`, `plural-choice`, `matching`, `word-order`, `map-locate`, `memory-match`) | 4 400 | réponse ∈ choix, choix en double, taille du vivier | 0 réponse hors choix, 0 doublon ; carte des continents sans étiquette (voulu) |

Au total : **8 240 tirages** sur les 206 exercices, **aucune erreur JavaScript** de page, aucun `failSafeExit`.

## Récapitulatif des actions suggérées (indicatif — aucune exécution dans cette phase)

### Priorité 1 — Bloquants (4)
1. **Maths** — `js/engines.js::numberToFrench` : « quatre-vingt » devant une unité, pas de « -et- » dans 81 et 91 (`cp-dictee-20-69`, et les autres niveaux qui utilisent ce moteur).
2. **Français** — `data/french/spelling.json::corps` : rendre « ŒIL » et « CŒUR » tapables (touche « œ » ou équivalence « oe »), ou les retirer.
3. **Français** — `cp-bonus-genre-mixte` : lever la double réponse (consigne explicite ou double acceptation).
4. **Français** — `js/engines-french.js::genderArticles` : ne pas élider devant un h aspiré (HIBOU).

### Priorité 2 — Majeurs (19)
- **Maths (5)** : quadrillage numéroté en base 1 ; ligne 0-100 étiquetée seulement aux extrémités ; memory sans résultats en double ; leçon sur < , > , = ; `sub-1` sans tirages dégénérés.
- **Français (5)** : ne pas griser les lettres muettes avant la réponse ; dicter les mots-outils homophones dans une phrase (`audio`) ; élision « J' » en conjugaison ; arbitrer l'étendue de la conjugaison au CP ; repointer `cp-bonus-mots-outils-defi`.
- **Histoire (1)** : retirer `cp-emc-partager-materiel` du sous-thème Histoire.
- **Géographie (4)** : quiz de leçon raccourcis ; items gauche/droite ; leçon sur les six continents ; retirer `cp-geo-transports-lieux` du sous-thème « Paysages » et renommer `cp-bonus-geo-paysages-defi`.
- **Sciences (2)** : retirer les 3 exercices hors sous-thème ; scinder les viviers `cp-saisons-meteo`, `cp-milieux-vie`, `cp-objets-quotidien`, `cp-corps-sens` par facette.
- **EMC (2)** : retirer ou repointer les 3 exercices hors sous-thème ; séparer « reconnaître » et « exprimer » les émotions.

### Priorité 3 — Mineurs (60) et Suggestions (13)
- **Transverse** : rééquilibrer les 74 distracteurs trop courts (R4 étendue aux banques) ; retirer le BOM des 7 banques ; corriger les textes d'aide de `drawWordOrder`, `drawAudioSpelling`, `drawSpelling` (`ui-craftsman`) ; accents des titres « Defi » et « Se reperer ».
- Voir le détail par matière pour le reste (répétitions dans les séries procédurales, explications manquantes, métalangage, découpes syllabiques, conventions jour/journée et saisons).

## Renvois à `curriculum-auditor` (manques de couverture entrevus, hors périmètre de cet audit)

- **Solides** : pavé droit absent (cube et boule seulement).
- **Suites et régularités** : aucune occurrence.
- **Frise** (thème 3 d'histoire 2026) : une seule question.
- **EMC** : dégoût et surprise absents des émotions ; confiance en soi, liberté, moqueries répétées absents.
- **Sciences** : groupes d'aliments absents ; place de l'état gazeux au CP à trancher.
- **Français** : aucun texte suivi en compréhension (« Comprendre une petite histoire » = phrases isolées) ; périmètre de la conjugaison au CP à trancher.
- **Géographie** : un exercice de gauche/droite et une leçon sur les continents manquent — signalés ici comme défauts de cohérence leçon ↔ exercice, à planifier avec la couverture.

## Vérification

Relecture recommandée par l'utilisateur des **4 Bloquants** avant toute correction : chacun se reproduit en quelques secondes (dicter 85 dans `cp-dictee-20-69` ; chercher la touche « œ » dans `fr-corps` ; répondre « le » à « CHAT » dans `cp-bonus-genre-mixte` ; tomber sur HIBOU dans `cp-le-la`). Les validateurs étant tous verts, ces défauts ne se voient qu'en jouant ou en sondant les tirages. La phase de correction est **distincte de cet audit** : aucune modification n'a été appliquée au contenu, au code ou aux banques ici.

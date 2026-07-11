# Audit programme CM1

Sources officielles utilisées :
- https://www.education.gouv.fr/programmes-et-horaires-l-ecole-elementaire-9011
- https://www.education.gouv.fr/bo/2025/Hebdo16/MENE2504620A (français et mathématiques cycle 3, arrêté du 10 avril 2025, BO n°16 du 17 avril 2025, application CM1 dès 2025-2026)
- https://eduscol.education.gouv.fr/4470/histoire-geographie (programme 2015 toujours en vigueur au CM1 ; le nouveau programme histoire-géo du BO n°22 du 28 mai 2026 n'entrera en application au CM1 qu'à la rentrée 2026-2027)
- https://eduscol.education.gouv.fr/4446/enseignement-moral-et-civique (EMC actualisé par l'arrêté du 22 octobre 2024, BO n°41 du 31 octobre 2024, applicable au CM1 depuis 2024-2025)
- https://eduscol.education.gouv.fr/31167/domaines-enseignement/enseigner-l-ecole-elementaire

> Audit relu et entièrement revérifié ligne par ligne le 2026-06-29 par lecture intégrale de `data/cm1.json` (4364 lignes). Le constat précédent (2026-06-25) sous-estimait fortement la couverture réelle : la géométrie, l'histoire et la géographie sont en réalité riches et largement conformes. **Mise à jour 2026-06-30 : l'exercice `cm1-francais-structure-recit` pointait par erreur vers `word_order_cm1` (réordonnancement de mots dans une phrase, doublon de `cm1-francais-ordre-mots`) — il pointe désormais vers la nouvelle catégorie `story_order_cm1` (remise en ordre de 3 phrases pour reconstituer un récit chronologique), ce qui en fait un vrai exercice de production d'écrit guidée auto-corrigeable.** Pour le détail exact des exercices par sous-thème, voir [CONTENT_ARCHITECTURE.md](../CONTENT_ARCHITECTURE.md).

## Synthèse

Le CM1 est en réalité une des grilles les plus complètes du corpus : mathématiques (nombres, mesures, géométrie avec 5 leçons et 11 exercices, lecture de graphique), histoire (4 périodes avec leçons narratives + frises à 3 niveaux de difficulté) et géographie (reliefs, territoires, mobilités, cartes du monde par continent et capitales) sont toutes solidement couvertes, contredisant l'ancien diagnostic. Les manques réels sont plus ciblés : en mathématiques, la mesure d'angles en degrés et la construction de figures (compas/équerre) sont absentes, et l'« organisation et gestion de données » se limite à la lecture de diagramme en barres (pas de tableaux, moyenne, ou diagrammes circulaires). En sciences, le volet « technologie » (objets techniques, fonctionnement d'un mécanisme) attendu par le programme cycle 3 « sciences et technologie » est absent. En français, la production d'écrit longue (rédaction guidée, brouillon/relecture) n'est pas représentée au-delà du réordonnancement de phrases.

## État par matière

| Matière | Notions attendues | Couverture actuelle | État | Action suivante |
|---|---|---|---|---|
| Mathématiques | Nombres entiers et grands nombres | Dictée jusqu'à 100 millions, comparaison décimaux | Couvert | — |
| Mathématiques | Fractions (lecture, construction) | fraction-view jusqu'à 1/16, fraction-build interactif | Couvert | — |
| Mathématiques | Nombres décimaux (position, comparaison) | decimal-place avec pièges dizaines/dixièmes, compare-decimals | Couvert | — |
| Mathématiques | Division (euclidienne, avec reste) | division-simple, division-reste, division-posed niveau 1-2 | Couvert | — |
| Mathématiques | Proportionnalité, pourcentages, échelle | proportionnalite, pourcentage (10/20/25/50%), echelle de plan, problèmes dédiés | Couvert | — |
| Mathématiques | Problèmes (mult/div, mesures) | factual-qcm via math_word_problems_cycle3.json | Couvert | Vérifier la richesse du fichier externe (non audité en détail) |
| Mathématiques | Conversions (longueurs, masses, contenances, durées) | conversion engine complet incl. chiffres romains | Couvert | — |
| Mathématiques | Géométrie : polygones, angle droit, périmètre, aire, volume | 5 leçons + 12 exercices (polygones, périmètre/angles, angle droit pratique, symétrie x2, repérage quadrillage, vocabulaire, aire, volume pavé, classement formes, appariement, défi bonus) | Couvert | — |
| Mathématiques | Mesure d'angle en degrés (rapporteur) | classification aigu/droit/obtus interactive (`cm1-geo-angle-classify`, board-interactive) + leçon dédiée ; pas de lecture fine au rapporteur (valeur exacte en degrés) | Partiel | Envisager un exercice de lecture précise au rapporteur si on veut aller au-delà du classement qualitatif |
| Mathématiques | Construction de figures (compas, équerre, règle) | absente — uniquement reconnaissance/classement, pas de tracé guidé | Absent | Ajouter un exercice board-interactive de construction (tracer un cercle, reporter une longueur) |
| Mathématiques | Organisation et gestion de données | lecture de diagramme en barres uniquement (bar-chart-read) | Partiel | Ajouter tableau de données, diagramme circulaire, moyenne simple |
| Français | Homophones grammaticaux | ce/se, ces/ses, a/à, son/sont, on/ont + défi mix | Couvert | — |
| Français | Conjugaison (présent 2e gr., imparfait, passé composé, futur) | présent 2e groupe, imparfait 1er groupe + être/avoir, passé composé (avoir/être/3e groupe), futur simple 1er groupe ; pas de présent du 3e groupe ni de futur 2e/3e groupe | Partiel | Ajouter le présent des verbes du 3e groupe et le futur simple des 2e/3e groupes |
| Français | Articles et genre (élision, accord) | un/une, le/la/l' avec contexte scolaire | Couvert | — |
| Français | Grammaire (nature des mots, fonction, accords) | nature nom/verbe/adjectif, fonction sujet/verbe/complément, accords nom-adjectif | Couvert | — |
| Français | Vocabulaire (polysémie, familles de mots, contexte) | lectures dédiées + matching | Couvert | — |
| Français | Lecture et compréhension | idée principale, sens en contexte (engine reading) | Couvert | Enrichir avec des textes plus longs (compréhension fine, inférences) |
| Français | Production d'écrit (rédaction guidée) | « Structurer un récit ou une lettre » utilise désormais `story_order_cm1` (remise en ordre de 3 phrases d'un mini-récit, corrigé le 2026-06-30) ; pas encore de rédaction libre/brouillon | Partiel | Envisager un exercice de rédaction continue (texte à compléter/continuer) si besoin d'aller plus loin |
| Français | Orthographe (dictée) | dictée audio avec mots pièges et vocabulaire scientifique | Couvert | — |
| Histoire | Préhistoire | leçon + exercice dédiés (outils, feu, sédentarisation) | Couvert | — |
| Histoire | Antiquité (Gaule romaine) | leçon Gaule romaine + exercice antiquité + frise dédiée | Couvert | — |
| Histoire | Moyen Âge (société, château, seigneurs/paysans) | 2 leçons (vie/vivre au Moyen Âge) + exercice + frises à 3 niveaux | Couvert | — |
| Histoire | Temps modernes (Renaissance, imprimerie, humanisme) | 3 exercices dédiés (Renaissance/inventions, humanisme/imprimerie) + frise | Couvert | — |
| Histoire | Repères chronologiques (frises) | frises order/place pour les 4 périodes, 3 niveaux de difficulté + bonus expert | Couvert | — |
| Géographie | Reliefs et fleuves de France | 2 leçons + 3 exercices (relief, fleuves, eaux/paysages) | Couvert | — |
| Géographie | Territoires (ville/campagne/littoral) + lecture de carte | 3 leçons (dont carte et légende) + 3 exercices | Couvert | — |
| Géographie | Mobilités/déplacements | 2 leçons + 4 exercices (dont mobilités France) | Couvert | — |
| Géographie | Se situer dans le monde (Europe, continents) | leçon France-Europe + cartes interactives (monde, Europe, Asie, Afrique, Amérique N/S) + capitales par continent | Couvert | — |
| Sciences | Le vivant (classification, chaîne alimentaire) | 3 leçons + 3 exercices | Couvert | — |
| Sciences | Matière et énergie (états, sources, transformations) | 1 leçon + 8 exercices (incl. tap-features états de la matière) | Couvert | — |
| Sciences | Corps et hygiène (5 sens, santé) | 2 leçons + 5 exercices | Couvert | — |
| Sciences | Électricité (circuit simple, sécurité) | 2 leçons + 4 exercices | Couvert | — |
| Sciences | Environnement (tri, écogestes) | 2 leçons + 4 exercices | Couvert | — |
| Sciences | Technologie (objets techniques, fonctionnement d'un mécanisme) | absente | Absent | Ajouter un sous-thème "objets techniques" (leviers, engrenages, objets du quotidien) |
| EMC | Vivre ensemble (respect, entraide) | 1 leçon + 3 exercices | Couvert | — |
| EMC | Droits et devoirs, laïcité | 2 leçons (dont laïcité à l'école) + 5 exercices | Couvert | — |
| EMC | Citoyenneté (vote, débat, symboles République) | 3 leçons (décider ensemble, symboles, laïcité) + 6 exercices | Couvert | — |

## Fichiers externes référencés (dataFile)

- `data/math_word_problems_cycle3.json` — problèmes (multiplication/division, mesures, proportionnalité), mutualisé cycle 3.
- `data/math_geometry_cm1.json` — banque de questions géométrie (polygones, périmètre/angles, symétrie, vocabulaire).
- `data/math_matching.json` — appariements mesures/géométrie.
- `data/board_tap_features_cm1.json`, `data/board_point_on_grid_cm1.json`, `data/board_symmetry_complete_cm1.json`, `data/board_shape_classify_cm1.json` — exercices interactifs board (angle droit, repérage quadrillage, symétrie, classement de formes).
- `data/french_word_order.json` — réordonnancement de phrases/structuration de récit.
- `data/french/matching.json` — appariements vocabulaire (familles de mots, champ lexical).
- `data/history_cm1.json` — banque QCM histoire (4 périodes).
- `data/history_chrono.json` — frises chronologiques (order/place, 3 niveaux).
- `data/history_matching.json` — appariements périodes/civilisations.
- `data/geography_cm1.json` — banque QCM géographie (relief, territoires, déplacements, Europe/monde).
- `data/geography_matching.json` — appariements géographie.
- `data/geography_capitals_cm1.json` — capitales par continent.
- `data/board_map_locate_world.json`, `data/board_map_locate_europe.json`, `data/board_map_locate_asia.json`, `data/board_map_locate_africa.json`, `data/board_map_locate_north_america.json`, `data/board_map_locate_south_america.json` — cartes interactives à toucher, avec fichiers SVG associés (`data/maps/*.svg`).
- `data/science_cm1.json` — banque QCM sciences (vivant, matière/énergie, corps, électricité, environnement).
- `data/science_matching.json` — appariements sciences (énergies, organes).
- `data/board_tap_features_science.json` — exercice interactif états de la matière.
- `data/emc_cm1.json` — banque QCM EMC (vivre ensemble, droits/devoirs, citoyenneté).
- `data/emc_matching.json` — appariements EMC (institutions, valeurs).

## Points de vigilance

- Les contenus des fichiers externes (`math_word_problems_cycle3.json`, `history_cm1.json`, `science_cm1.json`, `emc_cm1.json`, etc.) n'ont pas été audités en détail ligne par ligne ici — seule leur existence et leur usage par catégorie ont été vérifiés depuis `cm1.json`. Un audit de second niveau pourrait vérifier le nombre réel de questions par catégorie dans ces fichiers.
- Plusieurs blocs JSON ont un ordre de clés incohérent (`params` avant `title`/`id` sur certains exercices ajoutés récemment) — sans impact fonctionnel mais à uniformiser pour la maintenabilité.

## Priorités

1. ~~**Mesure/classification d'angle**~~ : **fait le 2026-06-30** (`cm1-geo-angle-classify`, classification aigu/droit/obtus sur angles dessinés en SVG, + leçon "Les familles d'angles"). Reste à ajouter : un exercice de construction de figure (compas/équerre/report de longueur), non traité.
2. **Ajouter** — Mathématiques : organisation et gestion de données au-delà du diagramme en barres (tableau à lire, diagramme circulaire, moyenne simple).
3. **Ajouter** — Sciences : sous-thème "objets techniques et technologie" (fonctionnement d'un mécanisme simple, objets du quotidien), actuellement absent malgré l'intitulé officiel "sciences et technologie".
4. ~~**Production d'écrit guidée**~~ : **fait le 2026-06-30** (« Structurer un récit ou une lettre » utilise désormais une vraie séquence de phrases à reconstituer, `story_order_cm1`).
5. **Enrichir** — Français : lecture/compréhension avec des textes plus longs et des questions d'inférence, au-delà de l'idée principale et du sens en contexte.
6. **Ajouter** — Français : présent des verbes du 3e groupe et futur simple des 2e/3e groupes, actuellement absents de la conjugaison CM1.
7. **Vérifier** (second niveau) — contenu réel des fichiers externes `math_word_problems_cycle3.json`, `history_cm1.json`, `science_cm1.json`, `emc_cm1.json` pour confirmer la richesse et l'absence de mojibake.

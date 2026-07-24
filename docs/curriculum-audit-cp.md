# Audit programme CP

Sources officielles utilisées :
- https://www.education.gouv.fr/programmes-et-horaires-l-ecole-elementaire-9011
- Bulletin officiel n°31 du 30 juillet 2020 (programme cycle 2 : français, mathématiques, questionner le monde, EMC — en vigueur)
- https://eduscol.education.gouv.fr/4740/ressources-d-accompagnement-du-programme-de-francais-au-cycle-2
- https://eduscol.education.gouv.fr/4770/ressources-d-accompagnement-pour-questionner-l-espace-et-le-temps-explorer-les-organisations-du-monde-au-cycle-2
- https://eduscol.education.gouv.fr/4446/enseignement-moral-et-civique

> Audit relu le 2026-07-24 par projection de `CONTENT_INDEX.json` (entrées filtrées `level=cp` : 249 entrées — 67 leçons, 182 exercices, réparties en 6 matières et 37 sous-thèmes) croisée avec `CONTENT_ARCHITECTURE.md`, et confirmations ciblées dans `data/cp.json`, `data/math_geometry_cp.json` et le moteur `clock` (`js/engines-math.js`). L'audit précédent (2026-06-29, « 130 exercices, 62 leçons ») était périmé : le contenu a été fortement étoffé depuis (phonologie CP quasi complète, EMC vote + environnement, problèmes à deux étapes, repérage sur quadrillage). Voir la section « Corrections » et [CONTENT_ARCHITECTURE.md](../CONTENT_ARCHITECTURE.md) pour le détail par sous-thème.

## Synthèse

Le CP reste le niveau le plus mûr de l'application. Les 6 matières attendues (hors EPS/arts, hors périmètre) sont toutes couvertes leçon + exercice(s), avec une volumétrie confortable (182 exercices, 67 leçons). La quasi-totalité du référentiel BO 2020 est désormais atteinte : les quatre manques structurants signalés par l'audit précédent (sons complexes limités à ou/on/ch, problèmes à deux étapes, repérage sur quadrillage, EMC décision collective + environnement) ont tous été comblés depuis et sont aujourd'hui `Couvert`.

Les manques résiduels sont fins et non structurels :
- **Numération** : pas de placement sur une ligne numérique, pas d'encadrement, pas de rangement d'une série de nombres, pas de suites/régularités numériques. La comparaison se fait deux à deux (`<`/`>`/`=`) mais jamais sur une suite ordonnée.
- **Dictée** : la dictée reste au niveau du mot isolé (image et audio) ; il n'existe pas de dictée de phrase courte complète, pourtant explicitement attendue.
- **Lecture** : la compréhension va jusqu'à la phrase et une courte histoire (QCM), mais pas de parcours de lecture de texte suivi un peu plus long.

Aucun de ces manques n'exige un moteur inexistant : les moteurs `choice-engine`, `math-input`, `board-interactive` et `audio-spelling` déjà en place suffisent, à une réserve près signalée pour la dictée de phrase (voir Points de vigilance).

## État par matière

| Matière | Notions attendues (BO 2020, cycle 2 — CP) | Couverture actuelle (`data/cp.json` + banques) | État | Action suivante |
|---|---|---|---|---|
| Mathématiques — Nombres et calculs | Dénombrer, lire, écrire, comparer, ranger les nombres ≤ 100 ; décomposition dizaines/unités ; ligne numérique, encadrement ; sens et technique de l'addition/soustraction ; compléments à 10 ; doubles/moitiés ; problèmes à 1 puis 2 étapes ; suites et régularités | Dénombrement (`counting`), écriture en lettres 0-10/10-20/20-69 (`number-spelling`), dizaines/unités, comparaison ≤ 99 (`comp-1/2/3`), additions/compléments/soustractions (`math-input`), doubles/moitiés (`cp-doubles-moities`), problèmes 1 étape **et 2 étapes** (`cp-problemes-deux-etapes`, banque `math_word_problems_cycle2.json`), défis logiques (carrés-sommes, oiseau-math) | Partiel | Ajouter le placement/l'encadrement sur **ligne numérique** et le **rangement d'une série** de nombres (QCM ou `word-order` numérique), et une **suite de nombres à compléter** (régularités +1/+2/+10) — moteur `math-input` type « trou » ou banque QCM adaptée |
| Mathématiques — Grandeurs et mesures | Comparer longueurs/masses/contenances ; règle ; unités de temps (jour, semaine, mois, moments de la journée) ; lire l'heure (heures entières et demi-heures) ; monnaie | Comparaison de longueurs et de masses/contenances (`math_geometry_cp.json`), moments de la journée, lecture de l'heure heures pleines **et demi-heures** (moteur `clock` niveau 1 : minutes ∈ {0, 30}), monnaie via « Le Marché »/« La Caisse » (`cibles` skin `money`) | Couvert | Pas de priorité immédiate |
| Mathématiques — Espace et géométrie | Repérage spatial (gauche/droite, devant/derrière…) ; quadrillage simple ; figures planes (carré, rectangle, triangle, cercle) ; solides usuels (cube, boule, pavé) ; reproduire des assemblages sur quadrillage | Formes planes (`cp-formes-reconnaissance`, inclut solides cube/boule), **repérage sur quadrillage** (`cp-geo-quadrillage`, moteur `board-interactive` `point-on-grid`, + leçon `cp-lesson-quadrillage`), repérage spatial traité en géographie (gauche/droite, se repérer) | Couvert | Pas de priorité immédiate ; éventuellement enrichir les solides (pavé/cylindre) au-delà de cube/boule |
| Français — Lecture / phonologie | Principe alphabétique, combinatoire (sons complexes : ou, on, ch, an, in, eu, oi, gn, ph…), syllabation, fluence, compréhension de phrases et textes courts | Syllabes, mots, sons complexes **ou, on, ch, an, in, eu, oi, gn, oin, ien, oeu, ph**, lettres muettes (moteur `reading`) ; compréhension mots simples / phrase / courte histoire (`french_cp_grammar.json`) | Partiel | Ajouter un **parcours de lecture de texte suivi** un peu plus long (au-delà de la phrase et de la mini-histoire QCM) — banque de compréhension type `cp_comprendre_histoire` étoffée en textes multi-phrases |
| Français — Écriture / orthographe | Copie et écriture autonome de mots ; **dictée de syllabes, mots, phrases courtes** ; mots-outils invariables ; correspondances phonie-graphie | Dictée d'images (6 thèmes), dictée audio de mots (5 thèmes), dictée audio de mots-outils par période P1-P5 et par niveaux + adverbes fréquents (`audio-spelling`) | Partiel | Ajouter une **dictée de phrase courte complète** (pas seulement des mots isolés) — vérifier au préalable la capacité du moteur `audio-spelling` à valider une phrase (espaces/ponctuation) ; sinon petit chantier moteur (voir Points de vigilance) |
| Français — Étude de la langue / grammaire | Phrase (majuscule, point), ponctuation simple ; nom vs verbe ; masculin/féminin, singulier/pluriel ; déterminants simples ; ordre des mots | Phrase et ponctuation (`cp-phrase-ponctuation`), ordre des mots (`word-order`), nom vs verbe, déterminants (`french_cp_grammar.json`), genre un/une, le/la, mon/ma (`gender-articles`), conjugaison être/avoir + verbes simples au présent (`conjugation`) | Couvert | Pas de priorité immédiate ; le pluriel simple (un chat / des chats) pourra être amorcé en articulation avec le CE1 |
| Français — Vocabulaire | Catégoriser des mots par thèmes (animaux, corps, maison, école, transports, alimentation…) | Traité de façon transversale via la dictée d'images et audio par champs lexicaux (animaux, corps, aliments, transports, école, maison) | Couvert | Pas de priorité immédiate |
| Histoire / Questionner le temps | Repères avant/après, hier/aujourd'hui/demain ; jours, mois, saisons ; calendrier ; vie d'autrefois vs aujourd'hui ; traces du passé | Avant/après et ordre du temps, jours/saisons, générations (`history_cp.json`) ; vie et école d'autrefois, objets et métiers anciens ; traces du passé, photos-souvenirs, personnages | Couvert | Pas de priorité immédiate |
| Géographie / Questionner l'espace | Se repérer dans l'école/la classe (plan) ; quartier et lieux familiers ; paysages (ville, campagne, mer, montagne) ; transports ; lieux publics | Plan de l'école/quartier, se repérer, lieux publics et lieux de l'école, gauche/droite ; paysages ; transports et lieux, trajets quotidiens (`geography_cp.json`) | Couvert | Pas de priorité immédiate |
| Sciences / Questionner le monde | Vivant vs non-vivant, caractéristiques et besoins du vivant ; états de la matière (solide/liquide) ; objets techniques et matériaux ; 5 sens ; besoins du corps (sommeil, alimentation, hygiène) | Vivant/non-vivant et besoins, animaux/plantes (`science_cp.json`) ; états de la matière ; objets, usages et matériaux ; 5 sens et organes, besoins du corps, hygiène ; saisons et météo ; milieux de vie | Couvert | Pas de priorité immédiate ; éventuellement expliciter un **cycle de vie simple** (graine → plante, œuf → animal) en complément du sous-thème vivant |
| EMC | Règles de vie collective ; droits et devoirs de l'élève ; respect du matériel ; entraide/coopération ; comportements responsables et prudence ; politesse et respect d'autrui ; premières décisions collectives ; respect de l'environnement | Vivre-ensemble et règles de classe, droits/devoirs, respect du matériel, politesse ; sécurité/prudence ; entraide et partage ; émotions (reconnaître/exprimer) ; **vote et décision collective** (`cp-emc-vote-subtheme`, banque `cp-vote`) ; **respect de l'environnement** (`cp-emc-environnement-subtheme`, banque `cp-environnement`) | Couvert | Pas de priorité immédiate |

## Fichiers externes référencés (dataFile)

Banques `data/*.json` mobilisées par le niveau CP (via `pool` `dataFile::category`) :

- `data/math_geometry_cp.json` — formes et solides, comparaison de longueurs, moments de la journée, masses/contenances
- `data/math_word_problems_cycle2.json` — problèmes à une étape (`cp-problemes-simples`) et à deux étapes (`cp-problemes-deux-etapes`)
- `data/math_matching.json` — appariement mathématique (`matching_math_cp`)
- `data/board_point_on_grid_cp.json` — repérage sur quadrillage (`point-on-grid`)
- `data/board_memory_match_cp.json` — jeu de mémoire maths (`memory-match`)
- `data/french_cp_grammar.json` — phrase/ponctuation, déterminants, nom vs verbe, lecture-compréhension (mots/phrase/histoire)
- `data/french_word_order.json` — ordre des mots dans la phrase (`word_order_cp`)
- `data/history_cp.json` — repères temporels, vie et traces d'autrefois
- `data/geography_cp.json` — plan/quartier, repérage, paysages, transports, lieux publics
- `data/science_cp.json` — vivant, matière, corps/sens, saisons/météo, milieux, objets
- `data/emc_cp.json` — vivre-ensemble, sécurité, entraide, émotions, vote, environnement
- `data/emc_matching.json` — appariement EMC (`matching_emc_cp`)

Rappel : les dictées français CP (`spelling`, `audio-spelling`) et la conjugaison s'appuient sur la bibliothèque partagée `data/french/*.json` et les listes internes des moteurs, non sur une banque CP dédiée.

## Points de vigilance

- **Ne pas recréer ce qui existe.** Les quatre manques historiques (sons complexes, problèmes à deux étapes, quadrillage, EMC vote + environnement) sont désormais couverts. Toute nouvelle vague CP doit d'abord consulter `CONTENT_INDEX.json` avant d'ouvrir un sous-thème sur ces notions, sous peine de doublon.
- **Dictée de phrase — réserve moteur.** Combler la dictée de phrase courte suppose que `audio-spelling` valide correctement une chaîne avec espaces et ponctuation (majuscule initiale, point final). Si le moteur ne gère aujourd'hui que le mot unique, l'ajout relève d'un petit chantier moteur/validateur à traiter à part, pas d'un simple ajout de contenu.
- **Numération partielle.** L'axe « ligne numérique / encadrer / ranger / suites » est le manque le plus concret côté maths : la comparaison est binaire (deux nombres) et ne couvre ni le placement sur une ligne, ni le rangement d'une série, ni les régularités. C'est la piste d'ajout la plus rentable pour rapprocher le CP du référentiel.
- **Fuites de niveau.** Aucune fuite d'un autre cycle repérée dans les intitulés CP. L'analyse fine d'exactitude et de qualité rédactionnelle (formulation des leçons, distracteurs des QCM) relève de `content-quality-auditor` — voir renvois ci-dessous.

## Priorités (pour `exercise-author`)

- `Ajouter` (CP, maths, sous-thème `cp-nombres-comparaison` ou nouveau sous-thème numération) : placement/encadrement sur ligne numérique, rangement d'une série de nombres, suite de nombres à compléter (régularités +1/+2/+10).
- `Ajouter` (CP, français, sous-thème `cp-lecture-comprehension`) : parcours de compréhension de texte suivi multi-phrases (au-delà de la mini-histoire QCM actuelle).
- `Ajouter` (CP, français, sous-thème dictée) : dictée de phrase courte complète — sous réserve de validation du moteur `audio-spelling` sur une phrase.
- `Envisager` (CP, sciences, sous-thème `cp-sciences-vivant-subtheme`) : cycle de vie simple (graine → plante, œuf → animal).
- `Maintenir` : mettre à jour cet audit après chaque vague CP pour éviter une nouvelle dérive entre le contenu réel et le diagnostic.

# Delta programme scolaire CP-CM2

*Régénéré le 2026-09-22 à partir des 5 audits de couverture rafraîchis (`docs/curriculum-audit-{cp,ce1,ce2,cm1,cm2}.md`), eux-mêmes comparés au référentiel `PROGRAMME_SCOLAIRE_REFERENCE.md` **recroisé au texte officiel le 2026-09-22** (annexes ministérielles extraites et relues, arrêtés vérifiés sur Légifrance — voir sa section « État de la réforme »).*

**Deux corrections de cadre depuis la version précédente, qui changent ce qu'il faut auditer :**

1. **La ligne EMC du tableau de réforme était fausse sur 4 niveaux sur 5.** L'EMC ne suit pas l'arrêté histoire-géo : il relève du BO du 13/06/2024, déployé CP/CM1 en 2024-2025, CE1/CM2 en 2025-2026, CE2 en 2026-2027. **Les 5 niveaux sont donc au même texte d'EMC depuis cette rentrée**, et le référentiel porte désormais ses attendus niveau par niveau (titre d'année + entrées).
2. **Histoire-géo et sciences ne sont neufs qu'au CP et au CM1.** CE1, CE2 et CM2 restent sur « Questionner le monde » / le texte 2020 jusqu'en 2027-2028 : les auditer contre le programme 2026 produirait du hors-programme pour l'élève cette année.

Sources officielles principales :
- `education.gouv.fr` : programmes et horaires de l'école élémentaire
- `eduscol.education.gouv.fr` : accompagnements cycle 2 et cycle 3
- Programmes 2024-2027 (BO spécial n°40 du 31/10/2024, BO spécial n°16 du 17/04/2025, BO n°22 du 28/05/2026) — voir le détail des sources dans `PROGRAMME_SCOLAIRE_REFERENCE.md`

## Méthode

Le delta compare le contenu actuel de l'application aux attentes du programme du `CP` au `CM2`, en synthétisant les 5 audits de couverture par niveau (source de vérité détaillée — ce document n'en est qu'un résumé transverse, ne pas le laisser diverger sans re-régénérer depuis les audits).

## Diagnostic transverse (régénéré le 2026-09-28, depuis les 5 audits rafraîchis les 27 et 28/09 et la vague v4.51.0)

Chaque case donne **couvert / partiel / absent**, recompté ligne à ligne dans le tableau détaillé de l'audit du niveau (les lignes « hors périmètre » ou « à repositionner » sont exclues). Une case en gras contient au moins un `Absent`.

| Niveau | Maths | Français | Histoire | Géographie | Sciences | EMC |
|---|---|---|---|---|---|---|
| CP | **14 / 2 / 2** | **14 / 1 / 1** | 7 / 2 / 0 | 8 / 0 / 0 | 11 / 1 / 0 | **7 / 2 / 2** |
| CE1 | **18 / 3 / 3** | **15 / 1 / 5** ¹ | 6 / 0 / 0 | 5 / 0 / 0 | 6 / 0 / 0 | **7 / 1 / 1** |
| CE2 | **16 / 5 / 1** | 12 / 4 / 0 | 3 / 3 / 0 | 5 / 1 / 0 | 4 / 2 / 0 | 10 / 0 / 0 |
| CM1 | **24 / 1 / 7** | **10 / 5 / 5** | 5 / 1 / 0 | **7 / 0 / 1** | **8 / 1 / 1** | 9 / 1 / 0 |
| CM2 | **16 / 5 / 1** | **7 / 2 / 4** | 5 / 1 / 0 | 4 / 0 / 0 | 6 / 4 / 0 | **7 / 2 / 1** |

¹ Dont 4 absences structurelles (oral, lecture à voix haute) que l'application ne peut pas évaluer : une seule absence est comblable par du contenu.

**Ce tableau est plus sévère que sa version du 26/09, et ce n'est pas une régression du contenu** — le corpus a au contraire grandi. C'est la mesure qui s'est affinée. L'ancienne version affichait presque partout « Couvert » parce que les audits qu'elle résumait agrégeaient : une ligne « lire, écrire, décomposer, comparer, ranger » tenait en un seul statut. Les audits rafraîchis ont éclaté ces lignes et **lu les banques au lieu des titres**. Ils ont corrigé à eux quatre (CE1, CE2, CM1, CM2) une vingtaine de statuts affirmés à tort, dont plusieurs couvertures fictives : un exercice intitulé « Accorder dans la phrase » sans un seul accord sujet-verbe réel, des exercices « million » plafonnés à six chiffres, un exercice « multi » sans problème à plusieurs étapes. Un `Partiel` honnête vaut mieux qu'un `Couvert` qui ne résiste pas à l'ouverture des `params`.

Histoire, géographie et sciences sont évalués contre le texte **en vigueur pour le niveau cette année** (2026 au CP et au CM1, 2020 ailleurs), jamais contre le texte de 2027.

**Constat majeur** : la couverture réelle est bien meilleure que ce que suggérait l'ancienne version de ce document — la quasi-totalité des compétences « classiques » (hors réforme 2024-2027) est `Couvert`, tous niveaux confondus. Les `Partiel` restants sont soit des manques de contenu ciblés et actionnables, soit liés à la réforme en cours (compétences nouvelles pas encore intégrées, ce qui est attendu vu sa fraîcheur).

## Ce qui est déjà solide

- structure CP-CM2 cohérente, bibliothèque de leçons en place sur les 5 niveaux
- corpus de **1117 exercices et 447 leçons**, dont 447/447 leçons équipées d'un quiz d'ancrage conforme aux 5 règles éditoriales, **sans aucun avertissement**
- un filet anti-régression sur la totalité du contenu (`scripts/smoke-exercises.js`) : les 1117 exercices sont démarrés en navigateur, 1117/1117 au vert
- CM2 n'a plus aucun manque structurel hérité (les 9 points de l'audit du 2026-08-01 sont tous comblés)
- proportionnalité, pourcentages, échelle et vitesse en CM1/CM2 ; opérations posées (add/sub/mult) disponibles comme moteur générique déjà exploité à plusieurs niveaux
- activités interactives non-QCM (cartes, classement, mémoire, fractions) disponibles à plusieurs niveaux
- ligne numérique graduée disponible depuis le CP : moteur `number-line-place`/`number-line-frame` livré (v1.9.0) et première vague de contenu placement 0-10/0-100 en place (v1.9.1) — voir §1 pour ce qui reste à produire
- l'app est déjà **conforme** à une exigence du nouveau programme CP sans action nécessaire : aucune méthode « en barres » n'est utilisée en résolution de problèmes

## Delta majeur restant

### 1. Chantiers moteur : un livré depuis, deux restants

Identifiés indépendamment par les audits CP, CM1 et CM2 :
- ~~**Ligne/droite numérique graduée**~~ **moteur livré, tous les cas d'usage du cadrage traités** (v1.9.0-1.9.3 : sous-types `number-line-place`/`number-line-frame` de `board-interactive`, `js/engines-board.js`+`js/ui-board.js`). CP comblé côté placement ET encadrement (`cp-nombres-comparaison`, `data/board_number_line_cp.json`), CE1 amorcé côté encadrement par centaines (`ce1-nombres-calculs`, `data/board_number_line_ce1.json`), et au CM1 la fraction placée sur ligne graduée (`cm1-fractions-droite-graduee`, v1.9.3). *Corrigé le 2026-09-28 :* ce paragraphe affirmait que cet exercice comblait l'**équivalence** de fractions. C'était faux — il fait placer 1/8 sur une ligne graduée en huitièmes, dans la même unité ; aucune équivalence n'est en jeu. L'équivalence n'est réellement exercée que depuis la v4.51.0 (`cm1-fractions-equivalentes-droite` : placer 1/2 sur une ligne en huitièmes, 6/8 sur une ligne en quarts). Ce chantier est maintenant clos pour les 3 niveaux visés par le cadrage initial ; une extension future (CE2/CM2 milliers, autres dénominateurs) resterait un simple ajout de contenu, pas un nouveau chantier moteur.
- ~~**`operation-posed` avec opérandes décimaux**~~ **livré et utilisé.** Le moteur accepte `decimals` (0, 1 ou 2), les opérandes restant des entiers mis à l'échelle en interne — jamais de flottant JS, donc aucun risque de précision. Le contenu existe désormais au CM1 (dixièmes et centièmes) et au CM2 (addition, soustraction, multiplication décimal × entier). Vérifié avant production sur 27 combinaisons opérateur × decimals × niveau, 40 tirages chacune.
- ~~**Probabilités, algèbre, pensée informatique/algorithmique**~~ **amorcés au CM2 sans nouveau moteur.** Les 3 domaines du programme de maths cycle 3 ont désormais un socle dans le sous-thème `cm2-probabilites-algorithmique` (certain/possible/impossible, comparaison de probabilités, exécution d'algorithmes avec boucle et condition, nombre manquant dans une égalité) : 3 leçons et 4 exercices, portés par `choice-engine`/`factual-qcm`. **Reste ouvert** : un moteur *interactif* pour ces domaines (simulation de tirages, exécution pas à pas d'un programme sur quadrillage) et leur déclinaison au CM1 — c'est un vrai chantier moteur, mais il ne bloque plus la couverture du programme.

### 2. ~~Les fractions au CE1~~ — comblé, et la cascade CE2 avec

La réforme introduit les fractions et la notation décimale de la monnaie dès le CE1. Les deux sont désormais en place (`ce1-lesson-fractions-simples`, `ce1-lesson-monnaie-decimale`), et la fraction y est aussi traitée **comme un nombre** : `ce1-fractions-ligne-graduee` la fait placer sur une ligne graduée dont seules les bornes 0 et 1 portent une étiquette, ce qui oblige à compter les parts au lieu de lire la réponse. Le CE2 peut donc être la « poursuite » attendue par le texte.

**Le manque le plus grave du dépôt était ailleurs, et il est comblé** : l'audit CE2 a montré, en éclatant une ligne « Nombres et calculs » jusque-là résumée en un `Partiel` flou, que le CE2 était **le seul niveau sans aucun exercice d'addition ni de soustraction, tous moteurs confondus**. Addition, soustraction et multiplication posées, problèmes à deux étapes, calcul de durée et encadrement jusqu'à 10 000 ont été produits (v4.47.0). Leçon de méthode : un résumé de tableau trop agrégé peut masquer un trou béant pendant plusieurs audits.

### 3. CM1 : périmètre historique — décisions de repositionnement tranchées (2026-09-19)

Le nouveau programme d'histoire CM1 (BO n°22 du 28/05/2026) a un périmètre chronologique très différent de l'ancien (Moyen Âge quotidien / monarchie XVIe-XVIIe / explorations XVe-XVIIe / année 1789), sans Préhistoire ni Antiquité. Les deux questions de repositionnement identifiées par le lot 14 sont désormais tranchées :

1. **Préhistoire/Antiquité en CM1 → conservé en l'état.** La nouvelle progression semble déplacer ces périodes vers CP-CE2, mais cycle 2 (CP/CE1/CE2) reste sur le programme histoire-géo 2020 jusqu'en 2027-2028 (seuls CP et CM1 basculent en 2026-2027, voir `PROGRAMME_SCOLAIRE_REFERENCE.md` § État de la réforme) — il n'existe donc aujourd'hui aucune destination valide pour ce contenu. Le retirer ou le déplacer maintenant créerait un travail à refaire (et à re-vérifier) à la bascule 2027-2028, pour un contenu par ailleurs riche et fonctionnel (16 questions Préhistoire, 18 questions Antiquité, leçons et frises dédiées). Décision : ne pas toucher, réexaminer explicitement au moment de la bascule CE1/CE2.
2. **Thème « Internet »/communiquer → contenu neuf au CM1, CM2 non touché.** Le contenu CM2 existant (`cm2-geo-mondialisation-subtheme` : câbles sous-marins, fracture numérique, télétravail) reste valide et nécessaire — CM2 reste lui aussi sur l'ancien programme jusqu'en 2027-2028, avec un cadrage économie-de-la-mondialisation différent du cadrage CM1 (entrée « modes de vie », plus simple, pensée pour cet âge). Dupliquer un contenu formulé pour un autre niveau serait la même erreur de calibrage que celle évitée au CE1 (fractions/monnaie décimale, vagues précédentes) : produire un contenu neuf, calibré CM1, plutôt que déplacer ou copier l'existant CM2.

Le contenu CM1 reste à produire une fois ces décisions actées (année 1789, monarchie, explorations, « communiquer »/Internet, « se nourrir » et sciences « mouvements et signaux » **tous produits** depuis, voir §Priorisation ; scission de `cm1-temps-modernes`/`cm1-renaissance-inventions` également faite — leurs doublons avec les catégories dédiées retirés, contenu restant réorganisé en 2 catégories propres).

### 4. Manques de contenu ponctuels (moteurs déjà disponibles, pas de chantier technique)

- **CP** : points cardinaux (absents, existent déjà au CE2 — dupliquer au bon niveau plutôt que déplacer), alternance jour/nuit et année-12-mois (mentionnés mais jamais testés en exercice), rangement de séries/suites numériques.
- **CE1** : notation décimale monnaie, `operation-posed` niveau 2 (bornes 100-999), `point-on-grid` jamais branché, carte `board_map_locate_ce1.json` déjà écrite mais orpheline.
- **CE2** : `operation-posed` jamais exploité malgré le moteur disponible depuis la v4.35.0 (confusion corrigée : ce n'était pas un chantier moteur comme le pensait l'ancien audit).
- **CM2** : homophones lexicaux fréquents (mer/mère/maire...) absents de `data/french/homophones.json` (uniquement du grammatical aujourd'hui) — moteur `homophone-duel` déjà réutilisable ; multiplication décimal×entier quasi absente (1 énoncé sur 10).
- **Toutes matières, tous niveaux** : reliquats de BOM UTF-8 en tête de plusieurs banques externes (`data/*_ce1.json`, `*_ce2.json`, `*_cm2.json` notamment) — sans impact fonctionnel confirmé à ce jour (`build-content-index.js --check` passe), mais à surveiller pour la robustesse du chargement runtime. Voir `content-quality-auditor` pour un passage dédié.

### 5. Contenu déjà écrit mais invisible pour l'élève — à chercher systématiquement

Les audits CM1 et CM2 ont trouvé, indépendamment, **6 catégories de lecture de 100 items chacune** dans `data/french/reading.json` qu'aucun exercice ne référençait : `cm1_lecture_synonymes`, `cm1_lecture_antonymes`, `cm1_lecture_ordre_evenements`, `cm2_lecture_sequence_evenements`, `cm2_lecture_pronoms_reprises`, `cm2_vocabulaire_contexte_precis`. Soit ~600 items rédigés, validés, embarqués dans le bundle, précachés — et jamais joués. Les six sont câblées depuis la v4.47.0, sans écrire un seul item.

**Réflexe à garder pour les prochains audits** : avant de produire du contenu neuf, vérifier les banques orphelines. `node scripts/validate-maps.js` ne signale plus aucune carte orpheline depuis la v4.48.0.

**Et une raison de plus de le faire : une banque orpheline n'a jamais été vue à l'écran.** Câbler les deux cartes des régions a révélé que `data/maps/france-regions.svg` était **cassé** — 44 commandes `l` parasites réparties sur 6 régions (Normandie, Centre-Val de Loire, Occitanie, Grand Est, Bourgogne-Franche-Comté, Corse). En SVG, un `l` sans coordonnées interrompt l'analyse du chemin : ces 6 régions ne dessinaient rien, et l'exercice demandait « Touche l'Occitanie » sur une région invisible. Le défaut a survécu parce que cette carte était la seule du projet affichée nulle part. Les 6 autres SVG sont sains, vérifié. Réparé en v4.48.0, coordonnées préservées.

### 6. Ce que les audits rafraîchis (27-28/09) ont fait remonter

Manques **vérifiés dans les données** par les audits, non encore traités. Détail et moteur pressenti dans chaque audit.

- **Deux régressions de niveau à combler en priorité** — un niveau qui sait moins faire que le précédent :
  - **CE1 ne sait pas ranger une série de nombres, alors que le CP le fait** (`cp-ranger-croissant`/`-decroissant`). Aucun moteur à écrire : `word-order`.
  - **CE2 est plus pauvre que le CE1 sur les fractions** : même plafond `maxDenom: 4` sur le seul exercice commun, et deux surfaces de travail (ligne graduée, problèmes jusqu'aux dixièmes) que le CE1 a et pas le CE2. À combler par **ajout** (`fraction-view` à `maxDenom: 10` sous un nouvel `id`), sans toucher aux ids publiés.
- **CE1** : les **symboles de la République** — seul point du texte EMC 2024 encore totalement absent du niveau ; écrire les nombres en lettres jusqu'à 1 000 ; se **déplacer** sur un quadrillage (les 10 items ne font que placer un point).
- **CE2** : accord sujet-verbe (2 items sur 10 dans une banque de déterminants) ; dictée calibrée CE2 (les 3 exercices rejouent les banques du CP) ; radical et terminaison ; aucune leçon de monnaie ; ranger une série (le seul `Absent` du niveau).
- **CM1** : problèmes à plusieurs étapes (absent — la banque « multi » n'en contient aucun) ; probabilités, algèbre et pensée informatique (patron CM2 réutilisable tel quel) ; puberté et reproduction humaine ; phrase simple et phrase complexe ; comparaison de fractions.
- **CM2** : les banques de futur `future_2` et `future_3_freq` ne sont exposées qu'au CM1 — deux exercices disponibles sans écrire un item.
- **Gisement dormant, mesuré le 2026-09-28** : **81 frises chronologiques écrites et jamais jouées** (38 sur 45 au CM1, 43 sur 51 au CM2), recensées par extraction des `timelineId` réellement référencés. À brancher **avec discernement** : 81 exercices d'histoire d'un coup déséquilibreraient les niveaux ; choisir celles qui servent une compétence `Partiel`.
- ~~**Chantier de moteur réel** : `operation-posed` en `level: 2` peut produire 876 + 954 = 1 830 au CE1~~ **fait (v4.54.0)** : paramètre optionnel `maxResult` (validé dans les deux validateurs), `maxResult: 1000` sur `ce1-addition-posee-centaines`. CE2 et CM1 partagent le niveau 2 sans ce paramètre et sont inchangés (mesuré). Reste, sans moteur : lire une mesure sur une règle graduée, reproduire une figure, coder un déplacement sur quadrillage.

- **Qualité du CE1 (audit du 2026-09-30) : 27 Majeurs sur 28 corrigés en v4.54.0.** Trois leçons ajoutées (signes <, = et >, addition posée, soustraction posée), 14 quiz de géographie raccourcis, une banque de vocabulaire réécrite, 4 copies exactes retirées. Détail dans `docs/content-quality-audit-ce1.md`.
- **⏸ Arbitrage en attente — la carte des régions de France au CE1** (`ce1-geo-carte-regions`). Les deux audits se contredisent : la couverture du 2026-09-27 la juge « conforme au programme 2020 », la qualité la classe en fuite de niveau (région = CE2, organisation administrative = CM1 dans le référentiel). L'exercice est publié, sans leçon ni étiquettes, avec 6 cibles pour 5 questions. Options : le garder tel quel, y ajouter une leçon et des étiquettes, ou le reporter au CE2. **Décision à prendre par l'utilisateur** : aucun des deux audits ne suffit à trancher, et le supprimer serait un recul.

## Priorisation

### P1 — bloquant pour la fidélité au nouveau programme
- ~~Fractions + notation décimale au CE1~~ **fait** (lot 15, vagues 1 et 2)
- ~~Trancher les 2 questions de repositionnement CM1~~ **fait** (2026-09-19, voir §3 ci-dessus)
- ~~Contenu CM1 sur l'année 1789~~ **fait** (lot 15, vague 3)
- ~~Contenu CM1 « Communiquer »/Internet~~ **fait** (lot 15, vague 4, calibré CM1, cf. décision §3.2)
- ~~Monarchie absolue et grandes explorations en histoire CM1~~ **fait** (lot 15, vague 5 — leçons/exercices dédiés, `cm1-temps-modernes`/`cm1-renaissance-inventions` laissés en l'état)

### P2 — chantiers moteur (chacun débloque plusieurs manques de contenu)
- ~~Ligne/droite numérique graduée (CP + CM1)~~ **moteur livré** (v1.9.0), étendu au CE2 (encadrement jusqu'à 10 000) et au CE1 (fractions) en v4.47.0
- ~~`operation-posed` avec décimaux (CM1/CM2)~~ **livré et utilisé** (paramètre `decimals`, contenu CM1 et CM2 en v4.47.0)
- Probabilités / algèbre / pensée informatique : **socle QCM livré au CM2** (v4.47.0). Reste le volet *interactif* — simulation de tirages, exécution pas à pas d'un programme sur quadrillage — et la déclinaison CM1. À cadrer avant de s'engager.
- ~~`place-value` plafonné aux centaines de milliers~~ **levé** (v4.48.0) : 4 rangs ajoutés jusqu'au milliard. Au passage, ce moteur n'était validé **dans aucun des deux validateurs** — `digitCount` est désormais borné 2-10 et `ask` restreint, en miroir.
- ~~`calc-mental` ne sait ni additionner ni soustraire~~ **fait** (v4.49.0), avec une **correction de diagnostic à retenir** : cette ligne affirmait que le moteur *bloquait* deux manques de contenu. C'était faux — le calcul mental additif du CM2 était atteignable par `add-simple`/`sub-simple` (qui existent et servent déjà au CP et au CE1), et le ×/÷ par 10-100-1000 du CM1 par la branche division de `calc-mental`. **Vérifier qu'un moteur bloque vraiment avant de l'écrire ici** : une limite réelle n'est pas forcément un blocage.

  Ce qui justifiait le chantier était mesurable, pas supposé : aux bornes du CM2, `add-simple` produit ~20 % de tirages triviaux (un opérande ≤ 5, parce qu'il tire une somme puis la découpe) et `sub-simple` ~12 %. Le moteur accepte désormais `+` et `-` avec les deux opérandes tirés dans `range` (0 % de trivial), `operands` comme liste de multiplicateurs pour `×`, et `range` sur `/` (le quotient était tiré en dur entre 5 et 50, ce qui interdisait de calibrer une division par niveau). Convention assumée : `calc-mental` emploie des opérateurs symboliques (`x`, `/`, `+`, `-`) là où `operation-posed` attend `add`/`sub`/`mult` — les deux coexistent dans `math-input`, aligner l'une sur l'autre casserait des ids publiés.

### P3 — contenu ponctuel, gain rapide
- ~~CE2 `operation-posed`~~ **fait** (v4.47.0 : add/sub niveaux 2 et 3, mult niveau 1)
- CM2 homophones lexicaux
- ~~CP points cardinaux~~ **fait** (v4.47.0) ; ~~repères temporels CP : alternance jour/nuit et les 12 mois~~ **fait** (v4.50.0), avec l'ordonnancement d'évènements — le moteur `timeline` étant inutilisable au CP (`history_chrono.json` n'a que des repères CM1/CM2 datés en années), tout passe par `word-order`
- ~~CP décomposition d/u, rangement d'une série, singulier/pluriel, dictée de syllabes et de phrase~~ **fait** (v4.50.0). **Restent ouverts au CP** : la copie d'un texte court et la compréhension d'un texte suivi — d'où le `Partiel` maintenu en français.
- ~~CE1 sommets d'un polygone, cinq sens en QCM, fractions 6/8/10, vocabulaire décrire-raconter, volume des textes suivis~~ **fait** (v4.50.0). Le manque « sommets » était un manque de **vocabulaire** : la leçon disait « coins » là où le programme attend « sommets ».
- ~~CE1 `point-on-grid`~~ **fait** (v4.47.0) ; ~~carte des régions CE1 et CE2 à brancher~~ **fait** (v4.48.0, et voir §5 : le câblage a révélé un SVG cassé)
- ~~CM2 calcul mental additif~~ **fait** (v4.49.0) ; ~~CM1 ×/÷ par 10, 100, 1000~~ **fait** (v4.49.0)
- CM2 : la Renaissance en histoire (1 seule occurrence du mot dans `data/history_cm2.json`, comme distracteur), digestion/circulation en sciences, cycle de l'eau
- ~~EMC, issu du détail du texte 2024 ajouté au référentiel~~ **fait** (v4.48.0) : civisme numérique au CM1, responsabilité numérique au CM2, stéréotype/préjugé au CE1, virage institutionnel du CE2. Les 4 manques identifiés en détaillant le texte 2024 sont comblés, chacun en binôme leçon + exercice.
- ~~Ligne numérique graduée : encadrement CP/CE1~~ **fait** (v1.9.2, `cp-encadrement-dizaines`/`ce1-encadrement-centaines`) ; ~~équivalence de fractions CM1~~ **fait en v4.51.0 seulement** (`cm1-fractions-equivalentes-droite`) — longtemps donnée pour faite à tort, voir §1. Reste au CM1 la **comparaison** de fractions
- ~~CM1 : classe des millions, soustraction de fractions, leçons de symétrie axiale et de repérage, exercice de moyenne~~ **fait** (v4.51.0). Tout est apparié leçon + exercice : 3 exercices n'avaient pas de leçon, 2 leçons pas d'exercice. Deux défauts de moteur trouvés en **sondant de vrais tirages** — invisibles au smoke test, qui ne vérifie que la jouabilité : `fraction-operation` en soustraction rendait un résultat nul une fois sur deux, et un exercice titré « le chiffre des millions » n'interrogeait sur les millions qu'une fois sur sept (titre corrigé avant publication).
- ~~CM1 géographie « se nourrir »~~ **fait** (lot 15, vague 6)
- ~~CM1 sciences « mouvements et signaux »~~ **fait** (lot 15, vague 7)

### P4 — qualité et robustesse (non urgent, pas de régression connue)
- Nettoyage des BOM UTF-8 résiduels sur les banques externes
- ~~Scission de `cm1-temps-modernes`/`cm1-renaissance-inventions`~~ **fait** (v1.9.4 : doublons avec `cm1-monarchie-absolue`/`cm1-explorations` retirés, contenu restant réorganisé en « Renaissance culturelle » et « Grandes figures et inventions »)

## Documents liés

- [curriculum-audit-cp.md](curriculum-audit-cp.md)
- [curriculum-audit-ce1.md](curriculum-audit-ce1.md)
- [curriculum-audit-ce2.md](curriculum-audit-ce2.md)
- [curriculum-audit-cm1.md](curriculum-audit-cm1.md)
- [curriculum-audit-cm2.md](curriculum-audit-cm2.md)
- [../PROGRAMME_SCOLAIRE_REFERENCE.md](../PROGRAMME_SCOLAIRE_REFERENCE.md)

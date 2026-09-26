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

## Diagnostic transverse (mis à jour 2026-09-22, après la vague v4.47.0)

| Niveau | Maths | Français | Histoire | Géographie | Sciences | EMC |
|---|---|---|---|---|---|---|
| CP | Partiel | Partiel | Partiel | Couvert | Couvert | Couvert |
| CE1 | Couvert | Partiel | Couvert | Couvert | Couvert | Couvert |
| CE2 | Couvert | Couvert | Couvert | Couvert | Couvert | Couvert |
| CM1 | Couvert | Partiel | Couvert | Couvert | Couvert | Partiel (civisme numérique) |
| CM2 | Couvert | Partiel | Partiel (Renaissance) | Couvert | Partiel | Partiel (numérique) |

Histoire, géographie et sciences sont évalués contre le texte **en vigueur pour le niveau cette année** (2026 au CP et au CM1, 2020 ailleurs), jamais contre le texte de 2027.

**Constat majeur** : la couverture réelle est bien meilleure que ce que suggérait l'ancienne version de ce document — la quasi-totalité des compétences « classiques » (hors réforme 2024-2027) est `Couvert`, tous niveaux confondus. Les `Partiel` restants sont soit des manques de contenu ciblés et actionnables, soit liés à la réforme en cours (compétences nouvelles pas encore intégrées, ce qui est attendu vu sa fraîcheur).

## Ce qui est déjà solide

- structure CP-CM2 cohérente, bibliothèque de leçons en place sur les 5 niveaux
- corpus de **1082 exercices et 414 leçons**, dont 414/414 leçons équipées d'un quiz d'ancrage conforme aux 5 règles éditoriales, **sans aucun avertissement**
- un filet anti-régression sur la totalité du contenu (`scripts/smoke-exercises.js`) : les 1082 exercices sont démarrés en navigateur, 1082/1082 au vert
- CM2 n'a plus aucun manque structurel hérité (les 9 points de l'audit du 2026-08-01 sont tous comblés)
- proportionnalité, pourcentages, échelle et vitesse en CM1/CM2 ; opérations posées (add/sub/mult) disponibles comme moteur générique déjà exploité à plusieurs niveaux
- activités interactives non-QCM (cartes, classement, mémoire, fractions) disponibles à plusieurs niveaux
- ligne numérique graduée disponible depuis le CP : moteur `number-line-place`/`number-line-frame` livré (v1.9.0) et première vague de contenu placement 0-10/0-100 en place (v1.9.1) — voir §1 pour ce qui reste à produire
- l'app est déjà **conforme** à une exigence du nouveau programme CP sans action nécessaire : aucune méthode « en barres » n'est utilisée en résolution de problèmes

## Delta majeur restant

### 1. Chantiers moteur : un livré depuis, deux restants

Identifiés indépendamment par les audits CP, CM1 et CM2 :
- ~~**Ligne/droite numérique graduée**~~ **moteur livré, tous les cas d'usage du cadrage traités** (v1.9.0-1.9.3 : sous-types `number-line-place`/`number-line-frame` de `board-interactive`, `js/engines-board.js`+`js/ui-board.js`). CP comblé côté placement ET encadrement (`cp-nombres-comparaison`, `data/board_number_line_cp.json`), CE1 amorcé côté encadrement par centaines (`ce1-nombres-calculs`, `data/board_number_line_ce1.json`), et le manque CM1 identifié par l'audit (équivalence de fractions — commentaire de `js/engines-math.js`) comblé par `cm1-fractions-droite-graduee` (`cm1-nombres-calculs`, `data/board_number_line_cm1.json`, v1.9.3, ligne graduée en huitièmes). Ce chantier est maintenant clos pour les 3 niveaux visés par le cadrage initial ; une extension future (CE2/CM2 milliers, autres dénominateurs) resterait un simple ajout de contenu, pas un nouveau chantier moteur.
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

**Réflexe à garder pour les prochains audits** : avant de produire du contenu neuf, vérifier les banques orphelines. Le même motif existe encore sur les cartes : `board_map_locate_ce1.json` et `board_map_locate_ce2.json` (régions de France) restent référencées par aucun exercice — `node scripts/validate-maps.js` les signale. La banque CP équivalente, elle, a été câblée dans cette vague.

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

### P3 — contenu ponctuel, gain rapide
- ~~CE2 `operation-posed`~~ **fait** (v4.47.0 : add/sub niveaux 2 et 3, mult niveau 1)
- CM2 homophones lexicaux
- ~~CP points cardinaux~~ **fait** (v4.47.0, avec la rose des vents) ; repères temporels CP : alternance jour/nuit et les 12 mois restent à produire
- ~~CE1 `point-on-grid`~~ **fait** (v4.47.0, quadrillage 6×6, maillon manquant entre le 5×5 du CP et le 8×8 du CE2) ; **la carte des régions CE1 déjà écrite reste à brancher**
- CM2 : la Renaissance en histoire (1 seule occurrence du mot dans `data/history_cm2.json`, comme distracteur), digestion/circulation en sciences, cycle de l'eau
- EMC, issu du détail du texte 2024 ajouté au référentiel : **civisme numérique au CM1** (recherche en ligne, émetteur/récepteur, cyberviolence, sobriété numérique) et **responsabilité numérique au CM2** ; stéréotype/préjugé au CE1 ; virage institutionnel du CE2 (élection, président, maire, intérêt général)
- ~~Ligne numérique graduée : encadrement CP/CE1 et équivalence de fractions CM1~~ **fait** (v1.9.2-1.9.3, `cp-encadrement-dizaines`/`ce1-encadrement-centaines`/`cm1-fractions-droite-graduee`) — chantier clos
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

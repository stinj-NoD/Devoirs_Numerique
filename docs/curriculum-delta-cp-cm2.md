# Delta programme scolaire CP-CM2

*Régénéré le 2026-09-18 à partir des 5 audits de couverture rafraîchis (`docs/curriculum-audit-{cp,ce1,ce2,cm1,cm2}.md`), eux-mêmes comparés au référentiel `PROGRAMME_SCOLAIRE_REFERENCE.md` mis à jour pour la réforme 2024-2027 (voir sa section « État de la réforme »). Ce document n'avait pas suivi les nombreuses vagues de contenu produites depuis sa dernière version (comptait encore « 980+ exercices » contre 1013 aujourd'hui, et un statut `Partiel` uniforme sur toutes les cases alors que la majorité des compétences est en réalité `Couvert`) — corrigé ici.*

Sources officielles principales :
- `education.gouv.fr` : programmes et horaires de l'école élémentaire
- `eduscol.education.gouv.fr` : accompagnements cycle 2 et cycle 3
- Programmes 2024-2027 (BO spécial n°40 du 31/10/2024, BO spécial n°16 du 17/04/2025, BO n°22 du 28/05/2026) — voir le détail des sources dans `PROGRAMME_SCOLAIRE_REFERENCE.md`

## Méthode

Le delta compare le contenu actuel de l'application aux attentes du programme du `CP` au `CM2`, en synthétisant les 5 audits de couverture par niveau (source de vérité détaillée — ce document n'en est qu'un résumé transverse, ne pas le laisser diverger sans re-régénérer depuis les audits).

## Diagnostic transverse (mis à jour 2026-09-18)

| Niveau | Maths | Français | Histoire | Géographie | Sciences | EMC |
|---|---|---|---|---|---|---|
| CP | Partiel | Partiel | Partiel | Partiel | Couvert* | Couvert* |
| CE1 | Partiel (fractions **absentes**) | Couvert | Couvert | Couvert | Couvert | Couvert |
| CE2 | Partiel | Couvert | Couvert | Couvert | Couvert | Couvert |
| CM1 | Partiel (3 domaines réforme absents) | Partiel | Partiel | Partiel | Partiel | Couvert |
| CM2 | Partiel (3 domaines réforme absents) | Partiel | Couvert | Couvert | Couvert | Couvert |

`*` CP Sciences/EMC : couvert sur la substance du programme 2020, contenu du nouveau programme 2026 non encore vérifié en détail (voir audit CP).

**Constat majeur** : la couverture réelle est bien meilleure que ce que suggérait l'ancienne version de ce document — la quasi-totalité des compétences « classiques » (hors réforme 2024-2027) est `Couvert`, tous niveaux confondus. Les `Partiel` restants sont soit des manques de contenu ciblés et actionnables, soit liés à la réforme en cours (compétences nouvelles pas encore intégrées, ce qui est attendu vu sa fraîcheur).

## Ce qui est déjà solide

- structure CP-CM2 cohérente, bibliothèque de leçons en place sur les 5 niveaux
- corpus de **1013 exercices et 367 leçons**
- CM2 n'a plus aucun manque structurel hérité (les 9 points de l'audit du 2026-08-01 sont tous comblés)
- proportionnalité, pourcentages, échelle et vitesse en CM1/CM2 ; opérations posées (add/sub/mult) disponibles comme moteur générique déjà exploité à plusieurs niveaux
- activités interactives non-QCM (cartes, classement, mémoire, fractions) disponibles à plusieurs niveaux
- ligne numérique graduée disponible depuis le CP : moteur `number-line-place`/`number-line-frame` livré (v1.9.0) et première vague de contenu placement 0-10/0-100 en place (v1.9.1) — voir §1 pour ce qui reste à produire
- l'app est déjà **conforme** à une exigence du nouveau programme CP sans action nécessaire : aucune méthode « en barres » n'est utilisée en résolution de problèmes

## Delta majeur restant

### 1. Chantiers moteur : un livré depuis, deux restants

Identifiés indépendamment par les audits CP, CM1 et CM2 :
- ~~**Ligne/droite numérique graduée**~~ **moteur livré, tous les cas d'usage du cadrage traités** (v1.9.0-1.9.3 : sous-types `number-line-place`/`number-line-frame` de `board-interactive`, `js/engines-board.js`+`js/ui-board.js`). CP comblé côté placement ET encadrement (`cp-nombres-comparaison`, `data/board_number_line_cp.json`), CE1 amorcé côté encadrement par centaines (`ce1-nombres-calculs`, `data/board_number_line_ce1.json`), et le manque CM1 identifié par l'audit (équivalence de fractions — commentaire de `js/engines-math.js`) comblé par `cm1-fractions-droite-graduee` (`cm1-nombres-calculs`, `data/board_number_line_cm1.json`, v1.9.3, ligne graduée en huitièmes). Ce chantier est maintenant clos pour les 3 niveaux visés par le cadrage initial ; une extension future (CE2/CM2 milliers, autres dénominateurs) resterait un simple ajout de contenu, pas un nouveau chantier moteur.
- **Probabilités, algèbre, pensée informatique/algorithmique** : les 3 nouveaux domaines du programme de maths cycle 3 (réforme 2025-2026/2026-2027). Zéro moteur, zéro contenu à CM1 et CM2. `data/engine-registry.json` confirmé sans trace de `probability`/`algebra`. Un seul chantier à traiter pour les deux niveaux à la fois.
- **`operation-posed` avec opérandes décimaux** : le moteur existant est strictement entier ; le programme CM1/CM2 exige des opérations posées avec décimaux.

### 2. Manque de contenu confirmé le plus net : les fractions au CE1

La réforme 2024-2027 introduit les fractions dès le CE1 (fractions unitaires, dénominateurs 2 à 10) et la notation décimale monnaie dès le CE1 également. **Confirmé par recherche directe : `data/ce1.json` ne contient aucun contenu fraction, aucune occurrence.** Conséquence en cascade détectée par l'audit CE2 : le CE2 ne peut pas être une vraie « poursuite » du travail CE1 tant que ce socle n'existe pas — les deux audits (CE1 et CE2) pointent vers le même chantier prioritaire.

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

## Priorisation

### P1 — bloquant pour la fidélité au nouveau programme
- ~~Fractions + notation décimale au CE1~~ **fait** (lot 15, vagues 1 et 2)
- ~~Trancher les 2 questions de repositionnement CM1~~ **fait** (2026-09-19, voir §3 ci-dessus)
- ~~Contenu CM1 sur l'année 1789~~ **fait** (lot 15, vague 3)
- ~~Contenu CM1 « Communiquer »/Internet~~ **fait** (lot 15, vague 4, calibré CM1, cf. décision §3.2)
- ~~Monarchie absolue et grandes explorations en histoire CM1~~ **fait** (lot 15, vague 5 — leçons/exercices dédiés, `cm1-temps-modernes`/`cm1-renaissance-inventions` laissés en l'état)

### P2 — chantiers moteur (chacun débloque plusieurs manques de contenu)
- ~~Ligne/droite numérique graduée (CP + CM1)~~ **moteur livré** (v1.9.0) — le contenu résiduel (encadrement CP/CE1, positionnement/fractions CM1) redescend en P3, voir ci-dessous
- `operation-posed` avec décimaux (CM1/CM2)
- Probabilités / algèbre / pensée informatique (CM1/CM2) — le plus gros chantier, à cadrer avant de s'engager (quel format d'exercice est réaliste pour du CM1-CM2 ?)

### P3 — contenu ponctuel, gain rapide
- CE2 `operation-posed` (moteur déjà prêt, zéro contenu)
- CM2 homophones lexicaux + décimal×entier
- CP points cardinaux / repères temporels
- CE1 `point-on-grid` + carte régions déjà écrite à brancher
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

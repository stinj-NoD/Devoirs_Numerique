# Audit qualité de contenu — CM1

> Audit indépendant de la qualité intrinsèque de chaque leçon et exercice du niveau CM1 (exactitude factuelle, clarté pédagogique, adéquation au niveau, cohérence technique), distinct de [`curriculum-audit-cm1.md`](curriculum-audit-cm1.md). Réalisé le 2026-07-11, même méthode que les audits CP/CE1/CE2.
>
> Sources faisant autorité : BO cycle 3 (2020/2018), ressources Eduscol, dictionnaire/Bescherelle, IGN/Insee.
>
> **Différence méthodologique importante par rapport à CP/CE1/CE2** : le CM1 est en cycle 3, où dates précises, périodes historiques nommées (Préhistoire, Antiquité, Moyen Âge, Temps modernes) et découpage régional français sont le programme normal — pas une fuite comme aux niveaux précédents. La grille d'évaluation a été adaptée en conséquence.
>
> **Aucune correction n'a été appliquée dans cette phase.**

## Synthèse générale

| Sévérité | Maths | Français | Histoire | Géographie | Sciences | EMC | Total |
|---|---|---|---|---|---|---|---|
| Bloquant | 0 | 1 | 0 | 0 | 2 | 0 | **3** |
| Majeur | 2 | 1 | 1 | 2 | 1 | 2 | **9** |
| Mineur | 2 | 3 | 4 | 5 | 5 | 6 | **25** |
| Suggestion | 2 | 2 | 2 | 3 | 2 | 4 | **15** |

Environ 63 leçons et ~1900 items audités.

**Bonne nouvelle générale pour ce niveau** : le contenu factuel du CM1 est globalement le plus rigoureux rencontré jusqu'ici. L'Histoire est factuellement exacte et chronologiquement cohérente (aucune fuite hors-programme, contrairement au CP/CE1/CE2), la Géographie affiche une précision remarquable sur les 156 capitales du monde (y compris cas récents bien traités : Gitega, Dodoma, Naypyidaw), et les zones sensibles de Sciences (sécurité électrique, conseils de santé) sont bien traitées.

**Point récurrent transverse le plus notable** : une **corruption d'encodage massive et systématique** touche `emc_cm1.json` et, dans une moindre mesure, `science_cm1.json` — remplacement de "à"/"è" par "é" ou "?" dans de nombreuses phrases ("Oé travaille le Maire ?", "sert é...", "l'?lectricit? sert ?..."). Ce n'est plus un problème ponctuel comme aux niveaux précédents mais un défaut systémique sur ces deux fichiers, à traiter par une passe de correction dédiée plutôt qu'item par item.

**Anomalie de branchement Français, nuancée par rapport au CE1** : `data/french_cm1_reading.json` (811 items) est également orphelin (confirmé par code), mais contrairement au CE1 où le rebranchement était recommandé sans réserve, ici certaines catégories du fichier orphelin dupliquent déjà le contenu servi — la recommandation est donc une **fusion avec dédoublonnage**, pas un simple rebranchement.

**Absence à signaler (à l'inverse des niveaux précédents)** : aucune carte interactive des régions françaises n'existe au CM1, alors que cette notion est justement au programme à ce niveau (contrairement à CP/CE1/CE2 où elle était hors-programme). Le SVG existe déjà (`data/maps/france-regions.svg`, déjà utilisé au CE2) — une carte CM1 serait facile à ajouter et pédagogiquement justifiée.

---

## Mathématiques CM1

### Leçons
**Majeur** — exercices `cm1-m-big-2`/`cm1-m-big-3` (dictée de nombres jusqu'à 10 puis 100 millions) sans leçon dédiée — le programme CM1 se limite au million ; 100 millions relève du collège. Correction suggérée : plafonner à 999 999 et ajouter une leçon "grands nombres entiers", déplacer le reste vers CM2/6e.
**Mineur** — doublon quasi total entre leçons `cm1-lesson-problemes-calcul` et `cm1-lesson-resoudre-probleme` (même titre, même exemple à un chiffre près).

### Exercices
**Majeur — ambiguïté** — `board_tap_features_cm1.json`, cat. `cm1_tap_angle_droit`, item 10 — figure sans aucun angle droit (tous les `features` marqués `correct:false`), mais la consigne générique ("Touche tous les angles droits") ne prévient pas l'élève de cette possibilité, contrairement à 2 autres items du même fichier qui le précisent explicitement. Correction suggérée : harmoniser la consigne.
**Mineur** — dénominateur jusqu'à 16 dans `cm1-frac-3`, au-delà des usages habituels du cycle 3 (2-12).

**Points positifs** : bug "tables mélangées" (trouvé en CE1/CE2) absent ici car aucun exercice équivalent n'existe ; 100% des `answer` ⊂ `choices` vérifiés sur les banques QCM ; symétries sur quadrillage géométriquement exactes.

**Résumé** : Bloquant 0, Majeur 2, Mineur 2, Suggestion 2 (18 leçons, ~184 items)

---

## Français CM1

### Anomalie de branchement (nuancée)

`data/french_cm1_reading.json` (811 items, 9 catégories) confirmé orphelin par grep + lecture de code (`loadFrenchLibrary` dans `js/app.js` ne le référence pas ; aucun exercice CM1 ne déclare de `dataFile` pour l'engine `reading`). **Mais contrairement au CE1**, l'audit qualité du fichier orphelin révèle que 2 catégories (`cm1_lecture_inferences`, `cm1_lecture_fait_opinion`) sont des **duplications mot pour mot** du contenu déjà servi via `data/french/reading.json`. Recommandation : fusion avec dédoublonnage catégorie par catégorie, pas un rebranchement direct — et corriger l'anomalie d'encodage (voir ci-dessous) présente dans les deux fichiers avant toute réactivation.

### Leçons
Aucune anomalie bloquante/majeure sur les 13 leçons ; passé simple (nouveauté CM1) bien introduit en reconnaissance.

### Exercices

**Bloquant — encodage** — `data/french/reading.json`, cat. `cm1_lecture_expression_imagee`, item sur "Lucas" — texte corrompu : `c?"ur` au lieu de `cœur`, et un `?` parasite remplaçant probablement "à"/"pour". Le même item corrompu existe à l'identique dans le fichier orphelin (bug introduit en amont, avant duplication). Correction suggérée : "Lucas a un cœur de pierre quand il refuse d'aider sa sœur à porter le sac."

**Mineur** — items 6-10 de `cm1_lecture_idee_principale` systématiquement sans accents ("role", "Age", "regles"...) alors que les 5 premiers items de la même catégorie sont bien accentués — signe d'un lot ajouté après coup sans relecture.
**Mineur** — pool `cm1_vocabulaire_polysemie` limité à 10 items pour un exercice bonus qui en demande 10 — épuisement systématique du pool.

**Points positifs** : conjugaison (imparfait, passé composé 3e groupe, futur irrégulier) toutes exactes ; passé simple bien contrasté avec l'imparfait ; `redaction_connecteurs_cm1` avec bonnes explications argumentatives.

**Résumé** : Bloquant 1, Majeur 1, Mineur 3, Suggestion 2 (13 leçons, ~620 items audités)

---

## Histoire CM1 — le contenu le plus rigoureux rencontré jusqu'ici

### Leçons
**Mineur** — doublon quasi total entre `cm1-lesson-vie-moyen-age` et `cm1-lesson-vivre-moyen-age` (même sous-titre, contenu quasi identique).
**Mineur** — la seule leçon du sous-thème "Frises historiques" ne couvre que le Moyen Âge alors que les 7 exercices associés couvrent Préhistoire à Temps modernes.

### Exercices

**Majeur — bug de paramétrage** — exercice id=`cm1-bonus-histoire-toutes-periodes` ("Défi : toutes les périodes, de la Préhistoire aux Temps modernes") — `params.category` pointe uniquement sur `cm1-moyen-age` : l'élève ne recevra jamais de questions sur les 3 autres périodes malgré la promesse du titre. Même famille de bug que ceux trouvés en Mathématiques CE1/CE2 (paramètre figé au lieu d'un mode "mélange"). Correction suggérée : catégorie mixte ou renommer l'exercice.

**Timelines (`history_chrono.json`)** : les 7 timelines demandées ont été vérifiées événement par événement — **toutes chronologiquement cohérentes et factuellement exactes** (chute de Rome 476, sacre de Charlemagne 800, Hugues Capet 987, Jeanne d'Arc 1429, imprimerie ~1450, Christophe Colomb 1492, etc.). Le moteur trie dynamiquement par année, éliminant le risque d'erreur de saisie d'ordre.

**Points positifs** : aucune fuite ni erreur factuelle sur les 87 items QCM ; vocabulaire disciplinaire bien choisi et expliqué (sédentarisation, biface, adoubement, humanisme) ; références culturelles pédagogiques bien dosées.

**Résumé** : Bloquant 0, Majeur 1, Mineur 4, Suggestion 2 (6 leçons, 87 items QCM + 8 matching + 7 timelines)

---

## Géographie CM1

### Leçons
**Majeur — décalage programme/contenu** — le sous-thème "territoires" n'a aucune leçon sur les régions françaises alors qu'une catégorie entière d'exercices (`cm1-france-regions`, 12 items) les couvre — les élèves répondent sans support de cours dédié.
**Mineur** — doublon entre 2 leçons du même sous-thème relief (même exemple, même vocabulaire).

### Exercices

**Majeur — absence d'outil pédagogique justifié** — aucune carte interactive des régions françaises n'existe au CM1 (`board_map_locate_cm1.json` inexistant), alors que le programme CM1 porte explicitement sur le fonctionnement du territoire français et que le SVG des régions existe déjà (utilisé au CE2). Correction suggérée : créer `board_map_locate_cm1.json`/`cm1_map_regions_france` réutilisant le SVG existant.

**Mineur** — quasi-doublons de questions entre `cm1-se-deplacer`/`cm1-mobilites-france` et distracteurs recyclés à l'identique entre catégories.
**Suggestion** — "Kiev" plutôt que "Kyiv" (les deux formes coexistent, le Quai d'Orsay recommande désormais la seconde depuis 2022) ; Pretoria présentée sans nuancer les 3 capitales sud-africaines.

**Points positifs** : 156 capitales vérifiées une à une, exactitude remarquable y compris sur des cas récents (Gitega, Dodoma, Naypyidaw) ; 337 items audités, 0 incohérence answer/choices ; les 5 fichiers de cartes-continents parfaitement synchronisés avec leurs SVG ; bonne prudence sur les sujets géopolitiquement sensibles (aucune frontière contestée traitée comme un fait simple).

**Résumé** : Bloquant 0, Majeur 2, Mineur 5, Suggestion 3 (26 leçons, ~337 items audités)

---

## Sciences CM1

### Leçons
**Mineur** — titres sans accents dans le sous-thème techno ("Sources d'energie", "Defi : machines et energie").
**Suggestion** — les 2 leçons du sous-thème vivant n'abordent pas la classification (vertébrés/invertébrés) alors que les exercices associés vont plus loin.

### Exercices

**Bloquant — encodage** — `data/science_cm1.json`, cat. `cm1-energie-quotidien` — énoncé entièrement corrompu : `"À la maison, l'?lectricit? sert ?..."` au lieu de "À la maison, l'électricité sert à...". Illisible tel quel pour un élève.

**Bloquant — copier-coller erroné** — cat. `cm1-matiere-energie`, item "Un court-circuit peut provoquer... un incendie" — l'explication associée est celle de l'item voisin sur la vapeur d'eau, totalement hors-sujet, sans rapport avec le court-circuit. Correction suggérée : rédiger une explication correcte sur l'échauffement des fils.

**Majeur** — item assimilant "dévisser un bouchon" à la machine simple "roue" — c'est en réalité le principe de la vis, approximation scientifique discutable.
**Mineur** — pattern de corruption récurrent similaire à l'EMC : "posséde" (possède), "cœour" (cœur), "œosophage" (œsophage), et surtout un remplacement massif de "à" par "é" dans des dizaines de phrases ("sert é...", "aide é...", "grâce é...") à travers plusieurs catégories.

**Points positifs** : sécurité électrique et circuit simple exemplaires (aucun conseil dangereux, réflexe "adulte" systématique) ; sources d'énergie renouvelable/non-renouvelable toutes correctement classées ; conseils nutritionnels/santé conformes aux recommandations usuelles.

**Résumé** : Bloquant 2, Majeur 1, Mineur 5, Suggestion 2 (11 leçons, ~281 items audités)

---

## EMC CM1

### Leçons
**Mineur** — redondance entre 2 leçons sur la laïcité (école vs République) dans deux sous-thèmes différents.
**Suggestion** — aucune leçon dédiée aux gestes de premiers secours malgré un exercice entier `cm1-emc-alerte-secours`.

### Exercices

**Majeur — corruption d'encodage massive et systématique** — `data/emc_cm1.json` — très nombreux items affectés dans `cm1-citoyennete`, `cm1-vivre-ensemble`, `cm1-droits-devoirs` : "harcélement" (harcèlement), "Oé travaille le Maire ?" (Où), "L'isoloir sert é" (à), "Un impét" (impôt), "éléve"/"éléves" (élève/élèves, très fréquent), "garéons" (garçons), un item entièrement illisible ("é,? pied, pour traverser..."). Pattern bien plus étendu que dans les autres fichiers CM1 — à traiter par correction automatisée/relecture complète du fichier plutôt qu'item par item.

**Majeur — niveau institutionnel trop avancé** — cat. `cm1-citoyennete`, plusieurs items (Palais Bourbon, Conseil constitutionnel, souveraineté nationale, impôts, recensement, Sénat) relevant du niveau collège/lycée plutôt que du programme CM1 (qui reste aux notions de base : symboles de la République, démocratie simple, élections locales, déjà bien couverts par ailleurs). Correction suggérée : déplacer ou simplifier fortement ces questions.

**Points positifs** : les gestes de premiers secours (`cm1-alerte-secours`) tous conformes aux recommandations médicales actuelles (position pour saignement de nez, ne pas mettre d'eau sur un feu de casserole) — le point le plus sensible de l'audit est bien traité ; traitement de l'égalité femmes-hommes factuel et sans biais (droit de vote 1944) ; débat argumenté distingue bien argument et opinion non fondée, niveau supérieur à CE2 comme attendu ; 0 incohérence answer/choices sur ~200 items.

**Résumé** : Bloquant 0, Majeur 2, Mineur 6, Suggestion 4 (6 leçons, ~200 items audités)

---

## Récapitulatif des actions suggérées (indicatif — aucune exécution dans cette phase)

### Priorité 1 — Bloquants (3)
1. Corriger l'énoncé corrompu et l'explication copier-collée erronée dans `science_cm1.json` (catégories `cm1-energie-quotidien` et `cm1-matiere-energie`).
2. Corriger l'item "cœur de pierre" corrompu dans `french/reading.json` (et sa copie dans le fichier orphelin).

### Priorité 2 — Majeurs (9), avec un chantier transverse prioritaire
- **Chantier de correction d'encodage dédié** pour `emc_cm1.json` (très nombreux items) et, dans une moindre mesure, `science_cm1.json` — probablement plus efficace qu'une correction item par item vu l'ampleur.
- Simplifier ou déplacer les questions EMC de niveau institutionnel trop avancé (Conseil constitutionnel, Palais Bourbon...).
- Créer une carte interactive des régions françaises pour le CM1 (réutiliser le SVG existant).
- Corriger le bug de paramétrage de l'exercice Histoire "toutes les périodes".
- Plafonner les dictées de grands nombres en Mathématiques (actuellement jusqu'à 100 millions).
- Clarifier la consigne de l'exercice d'angle droit ambigu.
- Reformuler l'item "vis"/"roue" en Sciences.
- Ajouter une leçon sur les régions en Géographie.

### Priorité 3 — Mineurs et suggestions (40)
Voir détail par matière ci-dessus.

## Vérification

Ce niveau se distingue par un contenu factuel globalement solide (Histoire et Géographie en particulier) mais par un problème d'hygiène de fichier récurrent (encodage) concentré sur 2 fichiers (`emc_cm1.json`, `science_cm1.json`) qui mériterait une correction automatisée ciblée plutôt qu'une correction manuelle item par item.

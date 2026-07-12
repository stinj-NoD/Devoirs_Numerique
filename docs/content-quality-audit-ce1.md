# Audit qualité de contenu — CE1

> Audit indépendant de la qualité intrinsèque de chaque leçon et exercice du niveau CE1 (exactitude factuelle, clarté pédagogique, adéquation au niveau, cohérence technique), distinct de [`curriculum-audit-ce1.md`](curriculum-audit-ce1.md) qui évalue la couverture du programme. Réalisé le 2026-07-11 par lecture intégrale de `data/ce1.json` et de toutes les banques externes référencées, matière par matière — même méthode que [`content-quality-audit-cp.md`](content-quality-audit-cp.md).
>
> Sources faisant autorité : BO n°31 du 30/07/2020 (programme cycle 2), ressources Eduscol par domaine, dictionnaire/Bescherelle, IGN/Insee.
>
> **Aucune correction n'a été appliquée dans cette phase.**

## Synthèse générale

| Sévérité | Maths | Français | Histoire | Géographie | Sciences | EMC | Total |
|---|---|---|---|---|---|---|---|
| Bloquant | 0 | 0 | 1 | 0 | 1 | 1 | **3** |
| Majeur | 1 | 3 | 0 | 6 | 4 | 0 | **14** |
| Mineur | 8 | 5 | 7 | 3 | 10 | 3 | **36** |
| Suggestion | 6 | 2 | 2 | 3 | 3 | 4 | **20** |

Environ 61 leçons et ~1500 items audités (le volume Français est nettement plus élevé qu'au CP à cause de l'audit des fichiers orphelins, voir ci-dessous).

**Découverte la plus significative de ce niveau — un vrai bug applicatif, pas seulement un problème de contenu** : `data/french_ce1_reading.json` (529 items) et `data/french_ce1_comprehension.json` ne sont **jamais chargés par le code** (`js/app.js::loadFrenchLibrary` ne référence que `data/french/*.json`). Les 6 exercices de lecture CE1 utilisent en réalité des catégories homonymes 5 à 10 fois plus pauvres dans `data/french/reading.json`. Confirmé par lecture de code (citations de lignes) par l'agent Français, qui recommande de rebrancher les fichiers riches plutôt que de les supprimer (contenu globalement meilleur, 7 fautes d'élision à corriger avant réactivation).

**Point positif transverse notable** : contrairement au CP, l'Histoire CE1 ne contient aucune fuite de programme de cycle 3 (pas de Préhistoire, Moyen Âge daté, personnages historiques nommés). La Géographie CE1, en revanche, reproduit une version atténuée de la fuite déjà vue au CP (carte des régions, 6/13 régions au lieu de 13, mais toujours hors du programme cycle 2 centré sur l'espace proche).

**Anomalie technique transverse** : BOM UTF-8 incohérent sur plusieurs fichiers CE1 et banques transversales (`history_ce1.json`, `science_ce1.json`, `math_geometry_ce1.json`, `history_matching.json`, `geography_matching.json`, `math_matching.json`, `science_matching.json`, `french/homophones.json`, `french/conjugation.json`, `french_word_order.json`) — sans impact fonctionnel (le code strip le BOM), mais pipeline de génération de données non uniforme. Une vérification d'un signalement initial d'« encodage corrompu » sur les clés `vêtements`/`a_à`/`ou_où` s'est révélée être un faux positif (artefact d'affichage terminal, pas une vraie corruption UTF-8) — méthode à retenir pour les audits suivants : vérifier via `ord()`/`repr()` avant de conclure à une corruption.

---

## Mathématiques CE1

### Leçons
Aucune erreur mathématique bloquante ou majeure sur les 13 leçons ; toutes conformes au programme (multiplication, compléments, doubles/moitiés, addition/soustraction, figures planes/solides, mesures, repérage journée, heure, masses/contenances, problèmes).

**Mineur** — leçon id=`ce1-lesson-formes-planes` ne couvre que les figures planes alors que l'exercice associé teste aussi des solides (cube, pavé, cylindre, cône, sphère) — 7 des 16 items de la catégorie liée portent sur les solides, non préparés par la leçon.
**Mineur** — leçon id=`ce1-lesson-lire-heure` : exemple qui inverse l'ordre pédagogique annoncé (grande aiguille citée avant la petite).
**Mineur** — chevauchement de contenu entre `ce1-lesson-tables-astuces` et `ce1-lesson-multiplication-bases`.
**Suggestion** — incohérence d'ordre des clés JSON (`format` en fin de bloc) sur 2 leçons — cosmétique, à harmoniser.

### Exercices

**Majeur — niveau hors-programme** — exercices id=`mult-6` et id=`mult-7` (sous-thème `ce1-multiplication`) — le programme CE1 cible les tables 2, 5, 10 ; les tables 6 et 7 relèvent du CE2. Correction suggérée : déplacer vers CE2 ou marquer explicitement comme anticipation bonus.

**Mineur — bug de paramétrage** — exercice id=`ce1-bonus-mult-melange` — le sous-titre promet "toutes les tables mélangées" mais `params.table: 10` (un nombre) au lieu de `"mix"` (chaîne attendue par `js/engines-math.js` pour activer le tirage aléatoire de table) : le générateur ne produit en réalité que des questions de la table de 10. Correction suggérée : `"table": "mix"`.

**Mineur — mélange disciplinaire dans un exercice « Mathématiques »** — `data/board_memory_match_ce1.json`, cat. `ce1_memory_match` (exposé par `ce1-maths-memoire`) — 4 des 8 items (contraires, capitales, milieux de vie, familles de mots) sont hors-mathématiques ; même défaut que celui déjà trouvé au CP sur le même mécanisme.
**Mineur** — même pool `matching_math_ce1` réutilisé par un exercice « Formes et mesures » (id=`ce1-maths-geo-appariement`) alors que la majorité des 10 items portent sur les nombres/opérations.
**Mineur** — doublon de bornes entre `ce1-additions-100` et `ce1-bonus-additions-100`.
**Suggestion** — formulation maladroite d'un problème ("Le double de 14 billes, combien cela fait-il de billes ?").

**Points positifs** : aucune erreur de calcul sur les 112 items de banques externes vérifiés ; générateurs `carreSomme` et `bar-chart-read` avec garde-fous anti-ambiguïté explicites et documentés dans le code.

**Résumé** : Bloquant 0, Majeur 1, Mineur 8, Suggestion 6 (13 leçons, 39 exercices, 112 items de banque)

---

## Français CE1

### Anomalie de branchement (point prioritaire)

**Bug de branchement confirmé par lecture de code** : `js/app.js::loadFrenchLibrary()` (lignes 280-297) ne référence que `data/french/*.json` ; `js/engines-french.js::reading()` (ligne 138) lit `lib.reading[params.category]` qui provient exclusivement de ce chargement. Aucun chemin de code ne charge `data/french_ce1_reading.json` (529 items, 5 catégories) ni `data/french_ce1_comprehension.json` (10 items). Les catégories homonymes réellement servies dans `data/french/reading.json` ne comptent que 10-20 items contre 100-108 dans les fichiers orphelins. Les deux fichiers sont bundlés dans `js/data-bundle.js` (et l'un des deux dans `sw.js`), signe d'un branchement prévu puis jamais finalisé plutôt que de reliquats à jeter. **Recommandation** : rebrancher `loadFrenchLibrary` sur ces fichiers après correction de 7 fautes d'élision qu'ils contiennent (voir ci-dessous) — gain pédagogique net (5-10x plus de variété).

### Leçons
Aucune anomalie bloquante ou majeure sur les 15 leçons ; conformes au programme (sons complexes, homophones fréquents, déterminants, nature/fonction, types de phrases, être/avoir, verbes -er).
**Suggestion** — apostrophes non typographiques dans la leçon id=`ce1-lesson-mots-frequents` ("qu on lit", "c est").

### Exercices

**Majeur — fautes d'élision dans le contenu orphelin** — `data/french_ce1_reading.json`, 7 items dans `ce1_lire_phrases_courtes` et `ce1_comprendre_phrase_courte` : "Que attrape...", "Que écrit...", "Que ouvre...", "Que éteint...", "Que arrose..." → devraient être "Qu'attrape/Qu'écrit/Qu'ouvre/Qu'éteint/Qu'arrose". À corriger avant toute réactivation de ces fichiers.

**Majeur — pauvreté du contenu réellement servi** — conséquence directe du bug de branchement : plusieurs catégories (`ce1_lire_phrases_courtes`, `ce1_comprendre_phrase_courte`, `ce1_vocabulaire_antonymes`...) n'ont que 10 items, insuffisant pour un exercice bonus qui en demande 10 (aucune variation possible entre deux tentatives).

**Mineur** — `data/french/grammar.json`, cat. `grammar_plural_ce1` — `choices: ["chien","chiens","chiens"]` contient un doublon exact, réduisant à un seul distracteur réel.
**Mineur** — `data/french/spelling.json`, cat. `vêtements` (9 mots) insuffisante pour un exercice bonus demandant 12 questions ; `pickUnused` réintroduira des mots déjà vus.
**Mineur** — item `"word": "PARCE"` dicté isolément (n'existe jamais seul en français, uniquement dans "parce que").
**Mineur** — doublon "rapide" présent deux fois dans `ce1_vocabulaire_synonymes` (10 items seulement).
**Suggestion** — paire "manger"/"déguster" un peu subtile pour du CE1 dans `matching_synonymes_ce1`.

**Points positifs** : homophones fréquents (a/à, et/est, son/sont, on/ont, ou/où) exemplaires ; conjugaison irréprochable (formes -ger/-cer correctes) ; `french_word_order.json` très soigné sur 116 items sans anomalie.

**Résumé** : Bloquant 0, Majeur 3, Mineur 5, Suggestion 2 (15 leçons, ~620 items audités dont les fichiers orphelins)

---

## Histoire CE1

### Leçons
Aucun défaut Bloquant ou Majeur sur les 8 leçons ; format et contenu conformes, **aucune fuite de programme cycle 3** détectée (contrairement au CP).
**Suggestion** — leçon id=`ce1-lesson-frise-temps` : notion de "période" un peu abstraite sans repère enfant concret.

### Exercices

**Bloquant — faille de conception d'un exercice d'appariement** — `data/history_matching.json`, cat. `matching_histoire_ce1`, item "Relie chaque objet à son époque" (exposé par `ce1-histoire-appariement`) — 2 des 4 paires partagent la même valeur cible ("autrefois" ×2, "aujourd'hui" ×2), ce qui casse la logique d'association 1-à-1 (un élève peut valider par élimination sans association précise). Cas isolé sur tout le fichier tous niveaux confondus. Correction suggérée : rendre chaque valeur cible unique.

**Mineur** — 4 titres/sous-titres sans accents dans `ce1.json` ("L'ecole autrefois", "Reconnaitre et dater...", "Defi : monuments et personnages") incohérents avec le reste du fichier correctement accentué.
**Mineur** — catégorie `ce1-souvenirs-famille` systématiquement sans accents ("aide a", "differents", "vecu"), quasi-doublon de `ce1-memoire-famille` qui, elle, est correctement accentuée.
**Mineur** — doublons de questions identiques entre `ce1-vie-autrefois`/`ce1-ecole-autrefois`/`ce1-objets-passe`.
**Mineur** — chevauchement de catégories entre subthèmes (`ce1-ecole-autrefois` et `ce1-objets-passe` piochées par 2 subthèmes différents) — choix de conception, pas un bug technique.

**Points positifs** : 0 incohérence answer/choices sur 100 items ; aucune notion cycle 3 (pas de Préhistoire/Moyen Âge/rois nommés) ; bons exemples concrets (blouse/ardoise/plume, fer à repasser en fonte).

**Résumé** : Bloquant 1, Majeur 0, Mineur 7, Suggestion 2 (8 leçons, 108 items audités)

---

## Géographie CE1

### Leçons
Aucune erreur factuelle bloquante sur les 7 leçons.
**Suggestion** — leçon id=`ce1-lesson-transports-france` : première leçon à citer des villes précises (Lyon-Paris), à surveiller pour ne pas glisser vers une carte détaillée type cycle 3.

### Exercices

**Majeur — doublon de contenu entre catégories** — `data/geography_ce1.json`, cat. `ce1-lieux-publics` et `ce1-services-quartier` (même sous-thème) — 4 questions strictement identiques partagées entre les deux catégories, réduisant la valeur d'entraînement du second exercice.

**Majeur — 4 fautes d'accent groupées** dans la catégorie `ce1-lieux-publics` : "la foret"→forêt, "de geometrie"→géométrie, "un thermometre"→thermomètre, "la meme seule action"→même (cette dernière correctement orthographiée dans la catégorie jumelle `ce1-services-quartier`, preuve d'une relecture incomplète).

**Majeur — généralisation contestable** — item "Une rue fait partie surtout... de la ville" — contredit la leçon du même sous-thème qui précise que les villages ont aussi des rues.

**Majeur — fuite de programme atténuée mais réelle** — `data/board_map_locate_ce1.json`, cat. `ce1_map_regions_france` (6 items sur 13 régions, exposé par `ce1-geo-carte-regions`) — techniquement propre (targetZoneId cohérents avec le SVG), mais demande de localiser nommément des régions administratives sur une carte de France entière, compétence de cycle 3, même limitée à 6 régions. Recommandation : supprimer du CE1 ou simplifier radicalement (repérer seulement sa propre région, sans exigence de connaître les noms).

**Mineur** — doublons de questions transversales à 3 catégories du même sous-thème (`ce1-reperage`/`ce1-plan-quartier`/`ce1-legende-simple`).
**Mineur** — distracteur syntaxiquement bizarre ("transformer en planète").
**Suggestion** — vocabulaire "torrent"/"alpages" un peu pointu pour CE1, mais résoluble par élimination.

**Points positifs** : 0 incohérence answer/choices sur 118 items QCM ; 13 régions du fichier de mapping conformes au découpage administratif réel (loi NOTRe 2016).

**Résumé** : Bloquant 0, Majeur 6, Mineur 3, Suggestion 3 (7 leçons, 134 items audités)

---

## Sciences CE1

### Leçons
**Mineur** — 2 leçons (`ce1-lesson-prendre-soin-corps`, `ce1-lesson-cinq-sens`) sans `label` "Je retiens" sur leur bloc bullets, rupture de cohérence avec les 10 autres leçons.
**Mineur** — bullet "Les plantes fabriquent leur nourriture grâce à la lumière" omet eau/air, incohérent avec le reste du sous-thème.
**Suggestion** — aucune leçon dédiée au cycle de vie complet alors que la notion est bien présente dans les exercices (`ce1-cycle-vie-simple`, 11 items).

### Exercices

**Bloquant — généralisation scientifiquement fausse** — `data/science_ce1.json`, cat. `ce1-vivant`, item "Un être vivant naît, grandit et... se reproduit" présenté comme étape obligatoire — un individu (chat stérilisé, enfant, vieillard) reste vivant sans se reproduire ; c'est une capacité de l'espèce, pas un passage individuel obligé. Correction suggérée : "peut se reproduire" ou reformulation englobante.

**Majeur** — distracteur "rester exactement pareil" pour un objet, généralisation hâtive (un objet peut aussi se transformer : rouille, usure, fonte).
**Majeur** — chevauchement thématique : items sur ovipare/vivipare/métamorphose classés dans `ce1-vivant` alors qu'ils relèvent de `ce1-cycle-vie-simple`.
**Majeur** — item du glaçon (fusion/thermique) classé à tort dans `ce1-melanges-simples` (ne relève ni de mélange ni de dissolution) — risque de brouiller les 3 notions que le CE1 doit justement différencier.
**Majeur** — deux formulations quasi-identiques ("Un être vivant naît, grandit et/puis...") donnent 2 réponses différentes ("se reproduit" vs "vieillit") sans préciser l'étape visée — ambiguïté de mémorisation.

**Mineur** — plusieurs fautes d'accent groupées dans `ce1-matiere`/`ce1-vivant`/`ce1-corps-hygiene` ("metal", "disparait", "thermometre", "recipient", "carree", "medecin", "gele").
**Mineur** — chevauchement `ce1-objets-maison`/`ce1-objets-materiaux`.

**Points positifs** : catégorie `ce1-melanges-simples` scientifiquement rigoureuse — nette amélioration par rapport au CP, bonne distinction dissolution (homogène)/mélange hétérogène/non-miscibilité, vocabulaire "homogène/hétérogène" bien employé ; leçon `ce1-lesson-melanger-separer` anticipe explicitement la confusion "dissous ne veut pas dire disparu".

**Résumé** : Bloquant 1, Majeur 4, Mineur 10, Suggestion 3 (12 leçons, ~189 items audités)

---

## EMC CE1

### Leçons
Aucun défaut bloquant/majeur sur les 6 leçons ; justesse civique, neutralité, un exemple concret par leçon.
**Suggestion** — leçon différences pourrait mentionner handicap/religion en plus des exemples déjà traités.
**Suggestion** — numéros d'urgence : ajouter que les appels sont gratuits même sans crédit/carte SIM.

### Exercices

**Bloquant — accents manquants sur une catégorie entière** — `data/emc_ce1.json`, cat. `ce1-dialogue-politesse` (8/8 items, exposée par `ce1-emc-dialogue-politesse` et `ce1-emc-entraide-dialogue`) — question, choices et answer intégralement sans accents ("etre poli", "s'il te plait", "de la colere", "desaccord"...) alors que les `explanation` du même bloc et tout le reste du corpus sont correctement accentués — anomalie de saisie localisée, pas un problème d'encodage global du fichier.

**Mineur — distracteurs positifs mal calibrés** — item "Si tout le monde était exactement pareil..." — distracteurs "plus rigolote"/"plus juste" formulés positivement, un enfant pourrait légitimement argumenter que "plus juste" est vrai ; l'explication ne justifie pas pourquoi c'est faux.
**Mineur** — doublons exacts entre `ce1-regles` et `ce1-emotions-respect`.

**Points positifs** : traitement du respect des différences (16 items : handicap, multilinguisme, stéréotypes de genre) remarquablement neutre et bienveillant ; sécurité/urgence (8/8 items) entièrement correcte (numéros exacts, consignes non dangereuses).

**Résumé** : Bloquant 1, Majeur 0, Mineur 3, Suggestion 4 (6 leçons, 124 items audités)

---

## Récapitulatif des actions suggérées (indicatif — aucune exécution dans cette phase)

### Priorité 1 — Bloquants (3) + bug applicatif majeur
1. **Rebrancher `data/french_ce1_reading.json`/`french_ce1_comprehension.json`** dans `js/app.js::loadFrenchLibrary` après correction des 7 fautes d'élision — gain de contenu significatif (5-10x).
2. Corriger la faille de conception de l'exercice d'appariement Histoire (`matching_histoire_ce1`, cibles dupliquées).
3. Reformuler l'item Sciences "tout être vivant se reproduit" (généralisation fausse).
4. Ré-accentuer intégralement la catégorie EMC `ce1-dialogue-politesse`.

### Priorité 2 — Majeurs (14)
- Retirer/reformuler la carte des régions CE1 (`ce1_map_regions_france`) — fuite de programme.
- Dédoublonner `ce1-lieux-publics`/`ce1-services-quartier` et corriger les 4 fautes d'accent groupées en Géographie.
- Reformuler l'item "une rue fait partie surtout de la ville".
- Déplacer les tables 6/7 hors du CE1 en Mathématiques ; corriger le bug `table: 10` vs `"mix"`.
- Clarifier les catégories Sciences qui se chevauchent (vivant/cycle de vie, mélanges/fusion thermique).
- Corriger les 7 fautes d'élision du contenu Français orphelin avant réactivation.

### Priorité 3 — Mineurs et suggestions (56)
Voir détail par matière ci-dessus.

## Vérification

Relecture recommandée des 3 Bloquants et, en priorité absolue, décision sur le rebranchement des fichiers Français orphelins (impact direct sur la richesse pédagogique réellement vécue par les élèves, indépendamment de toute notion de "bug mineur").

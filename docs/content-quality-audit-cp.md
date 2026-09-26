# Audit qualité de contenu — CP

> Audit indépendant de la qualité intrinsèque de chaque leçon et exercice du niveau CP (exactitude factuelle, clarté pédagogique, adéquation au niveau, cohérence technique), distinct de [`curriculum-audit-cp.md`](curriculum-audit-cp.md) qui évalue la couverture du programme. Réalisé le **2026-07-24** par lecture intégrale (sans échantillonnage) de `data/cp.json` et de **toutes** les banques externes référencées par le niveau, matière par matière.
>
> Banques externes auditées intégralement : `board_memory_match_cp.json`, `board_point_on_grid_cp.json`, `emc_cp.json`, `emc_matching.json`, `french_cp_grammar.json`, `french_word_order.json`, `french/grammar.json` (catégorie `gender_cp`), `french/reading.json` (catégories `cp_*`), `geography_cp.json`, `history_cp.json`, `math_geometry_cp.json`, `math_matching.json`, `math_word_problems_cycle2.json` (catégories `cp-*`), `science_cp.json`.
>
> Sources faisant autorité : BO n°31 du 30/07/2020 (programme cycle 2 : français, mathématiques, questionner le monde, EMC), ressources Eduscol par domaine, dictionnaire/Bescherelle pour les points de langue stricte, IGN/Insee pour les découpages géographiques.
>
> **Aucune correction n'a été appliquée dans cette phase.** Ce document liste les problèmes trouvés ; la correction fait l'objet d'une phase séparée (souvent confiée ensuite à `exercise-author` ou à une intervention manuelle).

## Note liminaire : le contenu CP a été largement réécrit depuis l'audit précédent (2026-07-11)

La quasi-totalité des anomalies **Bloquantes et Majeures** de l'audit du 11/07/2026 sont désormais **résolues** dans le contenu réellement servi au CP :

- La **fuite de niveau Histoire** (Préhistoire, Moyen Âge daté « il y a mille ans », archéologue, rois/reines/Versailles) a disparu : la catégorie `cp-personnages-traces` de `history_cp.json` ne comporte plus que des traces génériques (« il y a très longtemps », « historien »).
- La **fuite de niveau Géographie** (régions administratives, carte muette) a disparu : le CP ne référence plus aucun exercice `map-locate` ; `data/board_map_locate_cp.json` est désormais une banque **orpheline** (aucun exercice ne la référence, confirmé par `validate-maps.js`).
- Les **mots corrompus** `GTEAU`/`SIRENE` de `french/grammar.json::gender_cp` sont corrigés (`GÂTEAU`, `SIRÈNE`).
- Le **bug logique mon/ma** de `genderArticles` est corrigé (le code gère « mon » devant nom féminin à initiale vocalique, lignes 252-255 de `js/engines-french.js`).
- Le **mot inventé « bonton »** et l'item **« fenetre »** de `french/reading.json` sont corrigés (`tonton`/`bonbon`, `fenêtre` avec syllabation `["fe","nê","tre"]`).
- Le **pool `memory-match` mixte** est réglé : l'exercice Maths pointe désormais sur la sous-banque dédiée `cp_memory_match_maths` (4 items 100 % mathématiques).
- L'**exercice doubles/moitiés absent** existe désormais (`cp-doubles-moities`, moteur `type:double`).
- L'**hexagone hors-programme** a disparu de `math_geometry_cp.json`.
- Les **bornes de dictée de nombres** montent maintenant jusqu'à 99 (`cp-dictee-20-69` : `max:99`), couvrant les nombres irréguliers 70-99.
- Les **erreurs Sciences** (sucre qui « fond » → « se dissout », accord « a transpire » → « a transpiré ») sont corrigées.
- Le **distracteur EMC ambigu** « refuser de jouer » du vote est remplacé par « bouder dans son coin ».

Cet audit porte donc sur l'**état actuel** et relève des anomalies **nouvelles ou résiduelles**, d'un niveau de gravité globalement inférieur à l'audit précédent.

## Synthèse générale

| Sévérité | Maths | Français | Histoire | Géographie | Sciences | EMC | Total |
|---|---|---|---|---|---|---|---|
| Bloquant | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| Majeur | 1 | 0 | 1 | 0 | 1 | 0 | **3** |
| Mineur | 3 | 2 | 2 | 3 | 2 | 3 | **15** |
| Suggestion | 2 | 2 | 1 | 1 | 1 | 2 | **9** |

Environ **65 leçons** (21 Maths, 12 Français, 6 Histoire, 6 Géographie, 12 Sciences, 10 EMC — toutes équipées d'un quiz d'ancrage validé) et **~700 items** de banque audités au total sur les 6 matières.

**Anomalie transverse pédagogique la plus significative — qualité des distracteurs des QCM `factual-qcm`.** Le garde-fou éditorial des quiz (règle R4 : « la bonne réponse ne doit pas être repérable comme la plus longue ») a été rendu effectif pour les blocs `check` des **leçons** (commits `cbdb180`, `c93f89c`, `95f6071`), mais **n'a jamais été appliqué aux banques `factual-qcm`**. Un balayage automatique trouve **67 items** où la bonne réponse dépasse d'au moins 8 caractères tous ses distracteurs, concentrés en Histoire (`cp-generations`, `cp-metiers-autrefois`) et Géographie (`cp-lieux-ecole`). Exemple : `history_cp.json::cp-generations`, « Une génération, c'est… » → réponse de 60 caractères contre 21 pour le plus long distracteur. Un enfant peut choisir la bonne réponse sans la lire. Classé Mineur (répété par matière ci-dessous).

**Anomalie transverse technique — BOM UTF-8.** Six banques CP commencent par un BOM UTF-8 : `emc_cp.json`, `geography_cp.json`, `math_geometry_cp.json`, `math_matching.json`, `science_cp.json` et `french_word_order.json`. Un parsing JSON strict (ex. Node `JSON.parse` sans normalisation) peut échouer dessus ; le navigateur/`fetch` le tolère généralement, mais c'est un point de vigilance encodage récurrent du projet (cf. `CLAUDE.md`). Aucun mojibake, apostrophe dégradée ni `\uXXXX` inutile détecté dans le texte visible de l'ensemble des banques CP.

**Résultat des validateurs (lancés en filet, jamais en substitut à la lecture) :**
- `node scripts/check-lesson-quiz.js` → **348/348 leçons équipées (100 %)**, 0 anomalie sur les 30 leçons CP (0 quiz manquant, 0 bloc `check` avec `id`, 0 `answer` hors `choices`). Le seul avertissement R4 concerne une leçon **CE1**, pas le CP.
- `node scripts/build-content-index.js --check` → **CONTENT_INDEX_CHECK_OK**, aucun doublon d'`id`. Les avertissements CP sont tous des doublons « mous » légitimes (variantes bonus/défi et étalement de vivier sur plusieurs exercices).
- `node scripts/validate-subjects.js` → **OK**, toutes les matières CP canonicalisables.
- `node scripts/validate-maps.js` → **OK** ; signale `board_map_locate_cp.json` comme banque **orpheline** (plus référencée par le CP — cf. note liminaire).
- Vérification programmatique complémentaire sur les 7 banques `factual-qcm` : **0** `answer` absente de `choices`, **0** choix dupliqué au sein d'un item.

---

## Mathématiques CP

### Leçons

**Mineur — leçon « mode d'emploi d'exercice » plutôt que rappel de notion** — `data/cp.json`, leçons id=`cp-lesson-defi-chercher` et id=`cp-lesson-defi-verifier` (sous-thème `cp-defis-logique`) — ces deux leçons décrivent une **méthode de travail** (« je lis, je choisis, je calcule » / « je relis, je refais, je corrige ») plus qu'une notion mathématique nouvelle, alors que les exercices réels du sous-thème (`oiseau-math`, `carre-somme`) sont des jeux de calcul mental sans énoncé narratif. Le lien leçon→exercice est ténu. Correction suggérée : recentrer sur une compétence exercée, ou rattacher ces leçons méthodologiques au sous-thème `cp-problemes-subtheme` où elles trouvent une pratique réelle.

**Mineur — quasi-doublon de contenu entre leçons** — leçons id=`cp-lesson-defi-chercher` (« Résoudre un petit problème ») et id=`cp-lesson-resoudre-probleme` (sous-thème `cp-problemes-subtheme`) — même structure « lire / choisir le bon calcul / vérifier » et exemples très proches (images collées / billes reçues). Correction suggérée : différencier l'angle (une leçon sur le choix de l'opération, l'autre sur la vérification).

**Suggestion — solides absents des leçons alors que testés en exercice** — sous-thème `cp-formes-mesures-subtheme` — la leçon `cp-lesson-formes-simples` ne traite que les 4 formes planes (carré, rectangle, triangle, cercle), mais la banque `math_geometry_cp.json::cp-formes-reconnaissance` teste aussi « dé → cube » et « ballon → boule ». Aucune leçon n'introduit les solides. Correction suggérée : soit ajouter une courte leçon sur cube/boule, soit retirer ces 2 items (voir renvoi curriculum ci-dessous).

### Exercices

**Majeur — incohérence de convention leçon ↔ exercices (quadrillage indexé 0/1)** — `data/board_point_on_grid_cp.json`, cat. `cp_point_on_grid` (exposée par `cp-geo-quadrillage`, `cp-bonus-quadrillage-defi`, sous-thème `cp-formes-mesures-subtheme`) — la leçon `cp-lesson-quadrillage` enseigne exclusivement un **repérage en base 1** (« colonne 2, ligne 1 », « colonne 3, ligne 2 », « je compte les colonnes en partant de la gauche »), mais plusieurs prompts de la banque utilisent une **base 0** affichée à l'enfant : « colonne 4 et de la ligne **0** », « colonne **0** et de la ligne 2 » (les `target` vont de `[0,0]` à `[4,4]`). Un enfant de CP à qui l'on a appris que la première colonne est la « colonne 1 » est mis en échec par « colonne 0 ». Correction suggérée : harmoniser les prompts de la banque sur la base 1 de la leçon (ou l'inverse), sans laisser cohabiter les deux conventions.

**Mineur — solides 3D mélangés à une catégorie 2D** — `data/math_geometry_cp.json`, cat. `cp-formes-reconnaissance`, items « Un dé à jouer ressemble à… → un cube » et « Un ballon a la forme… → d'une boule » — non faux, mais rangés dans une catégorie « reconnaissance des formes » dont la leçon associée ne traite que les figures planes ; l'introduction du solide n'est ni préparée ni cadrée. Correction suggérée : isoler ces items dans une catégorie « solides » distincte, adossée à une leçon dédiée (cf. Suggestion ci-dessus).

**Mineur — items quasi identiques dans une même catégorie** — `data/math_geometry_cp.json`, cat. `cp-formes-reconnaissance` — deux items assimilent « part de pizza / morceau de pizza » au triangle (« Une part de pizza ressemble souvent à… » et « Quelle forme a 3 côtés, comme un morceau de pizza ? »), et deux items redondants sur « combien de côtés a un rectangle / le rectangle a… ». Diversité perçue réduite lors d'un tirage. Correction suggérée : varier les supports (fanion, panneau « cédez le passage »…).

**Suggestion — nuance sémantique « prêter »** — `data/math_word_problems_cycle2.json`, cat. `cp-problemes-simples`, item « J'ai 8 crayons. J'en prête 2 à mon voisin. Combien m'en reste-t-il ? » (8 − 2 = 6) — calcul correct, mais « prêter » implique une restitution future et peut brouiller la logique de soustraction pour un enfant très littéral. Cet item n'a par ailleurs pas de champ `explanation`, contrairement aux 10 premiers items de la catégorie. Correction suggérée : préférer « donne » / « perd », et ajouter une explication.

**Points positifs** : banques `math_geometry_cp.json` (formes, longueurs, moments de la journée, masses/contenances) et `math_word_problems_cycle2.json` (problèmes simples et à deux étapes) exactes et très soignées, explications contextualisées ; `math_matching.json::matching_math_cp` 100 % mathématique (formes, opérations, comparaisons, chiffres) ; sous-banque `cp_memory_match_maths` correctement isolée du pool mixte ; courbe de difficulté du parcours addition **monotone** (`maxSum` 10 → 20 puis compléments 10/20, défi 50), plus d'anomalie `add-3` ; leçons addition/soustraction/heure/dizaines-unités exemplaires, quiz d'ancrage tous jouables (`===` strict respecté).

**Résumé** : Bloquant 0, Majeur 1, Mineur 3, Suggestion 2 (21 leçons, ~155 éléments audités)

---

## Français CP

### Leçons

Leçons dans l'ensemble conformes (format 3-5 blocs, une notion, exemple concret) ; toutes équipées d'un quiz d'ancrage jouable. Points relevés :

- **Suggestion** — id=`cp-lesson-ecouter-ecrire-mot` — l'exemple « école » est segmenté en sons « é, k, o, l » ; le passage lettre↔son (le son [k] écrit « c ») gagnerait à être explicité pour éviter que l'enfant croie qu'on entend la lettre « c ».
- **Suggestion** — sous-thèmes `cp-dictee-mots-outils-audio` et `cp-mots-outils-niveaux-subtheme` — deux leçons distinctes (`cp-lesson-dictee-mots-outils`, `cp-lesson-mots-outils-niveaux`) redisent la même notion (« petits mots très fréquents ») ; à fusionner ou différencier (voir doublon de banque ci-dessous).

### Exercices

**Mineur — deux banques de mots-outils au contenu redondant** — `data/cp.json`, sous-thèmes `cp-dictee-mots-outils-audio` (catégories `cp_mots_outils_p1..p5`, moteur `audio-spelling`) et `cp-mots-outils-niveaux-subtheme` (catégories `mots_outils_cp_niveau_1..3`, `adverbes_cp_niveau_1..2`) — deux découpages parallèles des mêmes mots-outils sous deux étiquettes différentes (« périodes » vs « niveaux »), plus deux exercices « défi » au titre identique « Défi : tous les mots outils » (`cp-bonus-mots-outils-defi` et `cp-bonus-mots-outils-complets`). Redondance de surface pour l'enfant. Correction suggérée : garder un seul système de progression.

**Mineur — l'exercice « Le ou La ? » présente trois choix** — `data/cp.json`, exercice id=`cp-le-la` (moteur `gender-articles`, options `["le","la"]`) sur `french/grammar.json::gender_cp` — pour les ~15 mots à initiale vocalique du vivier (ÉCOLE, AVION, OURS, ARBRE, ÉTOILE…), le moteur ajoute automatiquement « l' » aux choix et fixe `answer="l'"` : l'enfant voit alors trois boutons `["le","la","l'"]` sous un titre « Le ou La ? ». Le comportement est **linguistiquement juste** (l'école) mais l'intitulé binaire ne prépare pas l'enfant à cette troisième réponse. Correction suggérée : renommer l'exercice (« Le, la ou l' ? ») ou réserver le vivier vocalique à une catégorie dédiée.

**Suggestion — variété lexicale de l'ordre des mots** — `data/french_word_order.json`, cat. `word_order_cp` (105 phrases) — le verbe « fermer/ferme » revient 8 fois et « porte » 6 fois ; l'ensemble reste correct mais un peu répétitif sur les verbes. Variété à renforcer.

**Points positifs** : couverture complète et exacte du décodage (sons `ou/on/ch/an/in/eu/oi/gn/oin/ien/œu/ph`, lettres muettes, syllabation), de la phrase/ponctuation, du genre, des mots-outils et de la conjugaison être/avoir + 1er groupe ; banque `gender_cp` désormais sans mot corrompu (GÂTEAU, SIRÈNE corrects) ; `french/reading.json` sans mot inventé (tonton/bonbon, fenêtre correctement accentuée et syllabée) ; `french_cp_grammar.json` (phrase, déterminants, nom/verbe, lecture, compréhension) exact avec distracteurs pertinents ; **0** incohérence `answer`/`choices` sur l'ensemble ; le bug moteur `genderArticles` mon/ma est corrigé.

**Résumé** : Bloquant 0, Majeur 0, Mineur 2, Suggestion 2 (12 leçons, ~330 items audités)

---

## Histoire CP (Questionner le temps)

### Leçons

**Mineur — quasi-doublon de contenu entre leçons** — leçons id=`cp-lesson-vivre-autrefois` et id=`cp-lesson-ecole-autrefois` (sous-thème `cp-histoire-vie`) — bullets et exemples très proches (plume, objets/école qui changent). À différencier davantage.

**Suggestion — repères mois/année en léger avance** — leçon id=`cp-lesson-temps-qui-passe` et banque `history_cp.json::cp-jours-saisons` (explications mentionnant « 12 mois », « 365 jours », « une année compte plusieurs mois ») — la focale CP de « Questionner le temps » est le jour/la semaine/les saisons ; l'année en mois relève plutôt du CE1. Présent uniquement dans des explications (jamais dans la réponse attendue), donc gravité faible.

### Exercices

**Majeur — exercice mal rangé (matière incohérente)** — `data/cp.json`, exercice id=`cp-emc-partager-materiel` (moteur `factual-qcm` sur `emc_cp.json::cp-partager-materiel`) **rattaché au sous-thème Histoire `cp-histoire-traces-subtheme`** — un exercice d'EMC (partage du matériel) est classé sous « Questionner le temps ». Le contenu lui-même est juste, mais son rangement fausse la lisibilité thématique et la ventilation par matière (le même vivier `cp-partager-materiel` est par ailleurs bien exposé côté EMC via `cp-emc-partager-classe` et `cp-emc-env-partager`). Correction suggérée : retirer ce doublon du sous-thème Histoire.

**Mineur — distracteurs repérables par leur longueur** — `data/history_cp.json`, catégories `cp-generations` et `cp-metiers-autrefois` — plusieurs items où la bonne réponse est nettement la plus longue (ex. `cp-generations` « Une génération, c'est… » → 60 car. vs 21 ; « Mes grands-parents peuvent me raconter… » → 40 vs 24 ; `cp-metiers-autrefois` « Le crieur public servait à… » → 46 vs 29). Repérable sans lecture (cf. anomalie transverse). Correction suggérée : étoffer les distracteurs pour équilibrer les longueurs.

**Mineur — variantes de gabarit peu diversifiées** — `data/history_cp.json`, cat. `cp-personnages-traces` (20 items) — nombreuses formulations « … est une trace du passé » / « un vieux X est… au passé » qui se ressemblent ; diversité perçue réduite lors d'un tirage de 5. Correction suggérée : varier les tournures et les supports.

**Points positifs** : **fuite de niveau totalement résorbée** — la catégorie `cp-personnages-traces` ne contient plus ni Préhistoire, ni Moyen Âge daté, ni archéologue, ni rois/reines/Versailles ; elle reste sur des traces génériques (« il y a très longtemps », « historien ») conformes au CP. Catégories `cp-avant-apres`, `cp-jours-saisons`, `cp-generations`, `cp-metiers-autrefois`, `cp-photos-souvenirs`, `cp-objets-anciens` bien cadrées CP ; anachronismes volontaires bien choisis comme distracteurs (« tablette tactile », « satellite », « drone ») ; **0** incohérence `answer`/`choices` ; l'exercice `cp-histoire-metiers-autrefois` est désormais correctement rattaché à l'Histoire.

**Résumé** : Bloquant 0, Majeur 1, Mineur 2, Suggestion 1 (6 leçons, ~104 items audités)

---

## Géographie CP (Questionner l'espace)

### Leçons

**Mineur — titre dupliqué prêtant à confusion** — leçon id=`cp-lesson-se-reperer-ecole` (sous-thème `cp-geo-reperage-subtheme`) et leçon id=`cp-lesson-plan-ecole` (sous-thème `cp-plan-quartier-subtheme`) — la première porte sur « devant/derrière/gauche/droite », la seconde sur « lire un lieu vu d'en haut » ; leurs intitulés proches (« Se repérer à l'école » / « Le plan de l'école ») peuvent être confondus par un parent ou un enseignant parcourant l'index. À clarifier.

### Exercices

**Mineur — distracteurs repérables par leur longueur** — `data/geography_cp.json`, cat. `cp-lieux-ecole` (et, dans une moindre mesure, `cp-transports-lieux`, `cp-lieux-publics`) — bonne réponse souvent la plus longue (ex. « Le couloir de l'école sert à… » → « se déplacer d'une salle à l'autre » 33 car. vs 13). Cf. anomalie transverse. Correction suggérée : rééquilibrer les longueurs.

**Mineur — chevauchements inter-catégories** — `data/geography_cp.json` — items répétés à l'identique entre catégories réutilisées par plusieurs exercices d'un même sous-thème (« Le bus sert à… », « Une brosse à dents… », etc. côté transports/objets), et 4 exercices puisant dans le même vivier `cp-transports-lieux`. Redondance de tirage possible. Correction suggérée : diversifier les viviers ou réduire le nombre d'exercices par vivier.

**Mineur — notions « carte » / « pays » en marge de l'espace proche** — `data/geography_cp.json`, cat. `cp-se-reperer`, item « Une carte sert surtout à… → localiser des lieux » (explication : « … les villes, les rivières et les pays ») — la focale CP est l'**espace proche** (école, quartier, plan) ; la carte géographique des villes/pays est plutôt CE1-CE2. Présent en marge (un item + une explication), gravité faible. Correction suggérée : recentrer sur le plan de proximité.

**Points positifs** : **plus aucune fuite de niveau** — le CP ne référence plus d'exercice `map-locate` (régions de France), la banque `board_map_locate_cp.json` est orpheline ; l'ensemble reste sur l'espace proche (plan de l'école, quartier, lieux publics, paysages, transports, trajets) ; **0** incohérence `answer`/`choices` ; bon ancrage sécurité routière (feu piéton, ceinture, casque, trottoir) ; distracteurs non ambigus adaptés à l'âge.

**Résumé** : Bloquant 0, Majeur 0, Mineur 3, Suggestion 1 (6 leçons, ~90 items audités)

---

## Sciences CP (Questionner le vivant et la matière)

### Leçons

**Suggestion — critères du vivant à harmoniser entre leçons** — leçons id=`cp-lesson-vivant-non-vivant` (critères : naître, grandir, se nourrir, respirer) et id=`cp-lesson-plantes-animaux` (critère saillant : déplacement) du même sous-thème `cp-sciences-vivant-subtheme` — le déplacement, mis en avant dans la seconde leçon, n'est pas un critère du vivant (la plante ne se déplace pas mais est vivante — ce que la banque `cp-vivant` traite pourtant très bien avec l'item « l'arbre est-il vivant ? »). Risque de conception naïve « vivant = qui bouge ». Correction suggérée : préciser dans `cp-lesson-plantes-animaux` que le déplacement distingue *souvent* animaux et plantes, mais n'est pas le critère du vivant.

### Exercices

**Majeur — exercice de révision mal rangé (sous-thème incohérent)** — `data/cp.json`, exercice id=`cp-sciences-corps-sens` intitulé « Révision : les cinq sens » (moteur `factual-qcm` sur `science_cp.json::cp-corps-sens`) **rattaché au sous-thème `cp-sciences-milieux-subtheme`** (« Où vivent les animaux ? ») — un exercice sur les cinq sens est classé sous les milieux de vie. Il fait par ailleurs doublon avec `cp-sciences-corps` et `cp-sciences-cinq-sens` (mêmes viviers `cp-corps-sens`) du sous-thème « corps ». Correction suggérée : déplacer vers `cp-sciences-corps-subtheme` ou le retirer.

**Mineur — doublons exacts inter-catégories** — `data/science_cp.json` — items strictement identiques présents dans plusieurs catégories réutilisées par le CP : « Se laver les mains aide à… » apparaît 3 fois (`cp-corps-sens`, `cp-besoins-corps`, `cp-hygiene-quotidienne`), « Une cuillère/ des ciseaux/ un parapluie/ une brosse à dents sert à… » en double entre `cp-objets-usages` et `cp-objets-quotidien`. Un enfant enchaînant deux exercices voisins peut retomber sur la même question. Correction suggérée : dédoublonner ou spécialiser chaque vivier.

**Points positifs** : banque `science_cp.json` scientifiquement solide et adaptée — cas frontière « l'arbre est-il vivant ? » et « la graine sèche était-elle vivante ? » pédagogiquement bien traités (anticipent les conceptions naïves) ; formulation « **certains** objets en métal » pour l'aimant évite la généralisation abusive ; sucre qui « **se dissout** » (et non « fond »), accord « a **transpiré** » corrects ; états de la matière justes (solide/liquide/gazeux) ; **0** incohérence `answer`/`choices` sur l'ensemble.

**Résumé** : Bloquant 0, Majeur 1, Mineur 2, Suggestion 1 (12 leçons, ~140 items audités)

---

## EMC CP

### Leçons

Leçons conformes, ton bienveillant, toutes équipées d'un quiz d'ancrage jouable.
- **Suggestion** — leçons id=`cp-lesson-vivre-ensemble` (« Vivre ensemble à l'école ») et id=`cp-lesson-regles-classe` (« Les règles de la classe »), même sous-thème — contenus proches (écouter, attendre son tour, prendre soin du matériel) ; à différencier davantage.

### Exercices

**Mineur — appariement partiellement tautologique** — `data/emc_matching.json`, cat. `matching_emc_cp`, item « Relie chaque mot de politesse à son usage » : paires « bonjour → pour dire bonjour », « au revoir → pour dire au revoir » — l'appariement donne la réponse dans son libellé (auto-référence), l'activité perd son intérêt pédagogique sur ces paires. Correction suggérée : reformuler les usages (« bonjour → quand j'arrive », « au revoir → quand je pars »).

**Mineur — exercice « Voter ensemble » sans lien avec le vote** — `data/cp.json`, exercice id=`cp-emc-vote-vivre-ensemble` (sous-thème `cp-emc-vote-subtheme`) — il puise dans le vivier `emc_cp.json::cp-vivre-ensemble` (respect, écoute, politesse), sans contenu portant réellement sur le vote, alors qu'il est rangé dans le sous-thème « vote » et titré « Voter ensemble ». Décalage titre/contenu. Correction suggérée : le faire pointer sur `cp-vote`, ou le renommer.

**Mineur — chevauchements inter-catégories** — `data/cp.json` / `emc_cp.json` — questions proches réutilisées entre `cp-entraide`/`cp-partager-materiel` (partage/prêt) et entre `cp-vivre-ensemble`/`cp-politesse-classe` (écouter, attendre son tour), avec réutilisation du même vivier par plusieurs exercices d'un même sous-thème. Redondance de tirage possible.

**Suggestion — vocabulaire « délégué » en légère avance** — `data/emc_cp.json`, cat. `cp-vote`, item « Un délégué de classe est un élève qui… » — la notion de délégué (élection de représentants) est davantage travaillée en cycle 3 ; au CP, le vote se limite habituellement aux décisions collectives simples. Présenté ici comme vocabulaire, gravité faible. Correction suggérée : réserver « délégué » aux niveaux supérieurs.

**Points positifs** : questions de sécurité toutes justes et prudentes ; traitement des émotions neutre et bienveillant (« toutes les émotions sont normales ») ; traitement du vote équilibré et démocratique, distracteur ambigu « refuser de jouer » remplacé par « bouder dans son coin » ; **0** incohérence `answer`/`choices` sur l'ensemble des banques `emc_cp.json` et `emc_matching.json`.

**Résumé** : Bloquant 0, Majeur 0, Mineur 3, Suggestion 2 (10 leçons, ~100 items audités)

---

## Récapitulatif des actions suggérées (indicatif — aucune exécution dans cette phase)

### Priorité 1 — Bloquants (0)
Aucun. Les Bloquants de l'audit précédent (fuites de niveau Histoire/Géographie, mots corrompus) sont tous résolus dans le contenu actuel.

### Priorité 2 — Majeurs (3)
1. **Maths** — harmoniser la convention d'indexation du quadrillage (`board_point_on_grid_cp.json::cp_point_on_grid`) sur la base 1 de la leçon `cp-lesson-quadrillage` (supprimer les prompts « colonne 0 » / « ligne 0 »).
2. **Histoire** — retirer l'exercice EMC `cp-emc-partager-materiel` du sous-thème Histoire `cp-histoire-traces-subtheme` (rangement incohérent).
3. **Sciences** — déplacer ou retirer l'exercice `cp-sciences-corps-sens` (« Révision : les cinq sens ») rangé à tort dans le sous-thème « milieux de vie ».

### Priorité 3 — Mineurs (15) et Suggestions (9)
- **Transverse** : rééquilibrer la longueur des distracteurs des banques `factual-qcm` (67 items, surtout `history_cp.json::cp-generations`/`cp-metiers-autrefois` et `geography_cp.json::cp-lieux-ecole`) — étendre au contenu `factual-qcm` la règle R4 déjà appliquée aux quiz de leçon.
- **Transverse** : retirer le BOM UTF-8 de `emc_cp.json`, `geography_cp.json`, `math_geometry_cp.json`, `math_matching.json`, `science_cp.json`, `french_word_order.json`.
- Dédoublonner les banques (mots-outils français « périodes » vs « niveaux » ; items Sciences répétés inter-catégories ; formulations Histoire `cp-personnages-traces` ; chevauchements EMC/Géo).
- Isoler cube/boule dans une catégorie « solides » adossée à une leçon ; clarifier l'exercice « Le ou La ? » (présence de « l' »).
- Voir le détail par matière ci-dessus pour les points sémantiques et de rangement.

## Renvois à `curriculum-auditor` (manques de couverture entrevus, hors périmètre de cet audit)

- **Solides limités à cube/boule** — le programme CP « Questionner… la matière » et l'entrée géométrie de cycle 2 mentionnent aussi le **pavé droit (parallélépipède)** parmi les premiers solides observés. La banque `math_geometry_cp.json` ne teste que le cube et la boule. À arbitrer par `curriculum-auditor` : couverture des solides à compléter (pavé) ou à assumer comme volontairement minimale au CP.
- **Repères mois/année** en Histoire : présents en marge (explications), à situer dans la progression cycle 2 par `curriculum-auditor`.

## Vérification

Relecture recommandée par l'utilisateur des **3 Majeurs** (incohérences de rangement et de convention) avant toute correction. Les Bloquants n'existant plus, la priorité de qualité au CP porte désormais sur l'**équilibrage des distracteurs `factual-qcm`** (anomalie transverse la plus répandue) et le **nettoyage des BOM**. La phase de correction est **distincte de cet audit** : aucune modification n'a été appliquée au contenu, au code ou aux banques ici.

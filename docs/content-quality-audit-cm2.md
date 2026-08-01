# Audit qualité de contenu — CM2

> Audit indépendant de la qualité intrinsèque de chaque leçon et exercice du niveau CM2 (dernier niveau du primaire) : exactitude factuelle, clarté pédagogique, adéquation au niveau, cohérence technique — distinct de [`curriculum-audit-cm2.md`](curriculum-audit-cm2.md), qui traite de la couverture du programme. Réaudit intégral réalisé le 2026-08-01, en remplacement de la version du 2026-07-11 devenue périmée (plusieurs corrections de contenu sont intervenues depuis, notamment sur `data/cm2.json` le 19 juillet 2026).
>
> **Méthode** : lecture intégrale via l'outil Read de `data/cm2.json` (7525 lignes) et des six banques externes qu'il référence (`data/history_cm2.json`, `data/geography_cm2.json`, `data/science_cm2.json`, `data/emc_cm2.json`, `data/math_geometry_cm2.json`, `data/history_chrono.json`) plus les banques d'appariement (`data/math_matching.json`, `data/history_matching.json`, `data/geography_matching.json`, `data/science_matching.json`, `data/emc_matching.json`) et `data/french/reading.json` pour les catégories de lecture CM2. Aucun sondage : chaque fichier a été lu en totalité. Chaque défaut cité ci-dessous est appuyé par une citation exacte du champ concerné (id + extrait), lue directement dans le fichier — pas recopiée d'un audit antérieur. Les défauts de l'ancien audit qui ne sont plus vérifiables ont été retirés et sont listés explicitement en section « Corrections constatées depuis le dernier audit ».
>
> Sources faisant autorité : `PROGRAMME_SCOLAIRE_REFERENCE.md` (cycle 3), BO cycle 3 (2020/2018), Eduscol, dictionnaire/Bescherelle pour la langue, IGN/Insee pour la géographie (le port de Marseille-Fos est bien le premier port de France en tonnage total, vérifié avant de retenir ce point comme correct).
>
> **Aucune correction n'a été appliquée dans cette phase.** Toute correction relève d'une phase séparée (par ex. `exercise-author` ou une intervention manuelle ciblée).

## Synthèse générale

| Sévérité | Maths | Français | Histoire | Géographie | Sciences | EMC | Total |
|---|---|---|---|---|---|---|---|
| Bloquant | 0 | 0 | 1 | 0 | 0 | 0 | **1** |
| Majeur | 1 | 0 | 0 | 1 | 0 | 0 | **2** |
| Mineur | 3 | 2 | 2 | 3 | 4 | 6 | **20** |
| Suggestion | 1 | 1 | 1 | 1 | 2 | 1 | **7** |

Environ 71 leçons et ~2200 items audités (mêmes ordres de grandeur que l'audit précédent).

**Anomalie transverse la plus significative de ce passage** : un contrôle programmatique (parcours de tout `cm2.json`, regroupement par couple `dataFile`+`category` hors variantes `isBonus`) fait remonter **25 groupes d'exercices qui partagent exactement le même vivier de questions**, concentrés en Sciences (7 groupes) et EMC (7 groupes), avec quelques cas en Géographie (3) et Histoire (2). Exemple concret : `cm2-emc-citoyennete` (8 questions) et `cm2-emc-debattre-choisir` (10 questions) pointent tous les deux vers `data/emc_cm2.json` → catégorie `cm2-citoyennete`, sans aucune différence de niveau ni de sous-thème — seuls l'`id`, le titre et le nombre de questions diffèrent. Le script `node scripts/build-content-index.js --check` confirme ces mêmes paires en avertissement `[contrat-identique]` (479 avertissements au total sur les 5 niveaux, dont ceux listés ci-dessus pour CM2), ce qui montre que l'outillage existant détecte déjà ce défaut — mais il reste en l'état dans le contenu. Certains cas sont des viviers d'appariement légitimement réutilisés sur plusieurs exercices (ex. `matching_geo_cm2`, `matching_emc_cm2` — pattern documenté et accepté dans `CLAUDE.md`) ; d'autres, en particulier les paires EMC (`cm2-solidarite`, `cm2-engagement`, `cm2-responsabilites`, `cm2-projet-collectif`) et Sciences (`cm2-techno-energie`, `cm2-corps-effort`, `cm2-corps-sante`, `cm2-environnement`), sont deux exercices `factual-qcm` presque identiques (même sous-thème, même vivier, aucune différenciation de niveau) qui gonflent artificiellement le nombre d'exercices affichés sans ajouter de contenu réellement nouveau.

**Deuxième anomalie transverse : BOM UTF-8 sur 5 des 6 banques externes.** Une inspection des octets bruts (et non un simple affichage console, qui peut être trompeur) confirme la présence d'un BOM UTF-8 (`EF BB BF`) en tête de `data/history_cm2.json`, `data/geography_cm2.json`, `data/science_cm2.json`, `data/emc_cm2.json`, `data/math_geometry_cm2.json` et `data/history_chrono.json`. **Point rassurant, vérifié directement dans le code** : `js/app.js` (`fetchJson`, lignes 316 et 331) et `scripts/build-content-index.js` (ligne 42) neutralisent déjà ce BOM par un `.replace(/^﻿/, '')` avant `JSON.parse`, donc ce défaut **ne casse rien au runtime actuellement** — il est classé Mineur (hygiène technique/dette), pas Bloquant, faute de point d'entrée non protégé identifié. `data/cm2.json` lui-même est propre (pas de BOM).

**Sur l'encodage/mojibake** : recherche automatisée des motifs de corruption réels (`Ã©`, `Ã¨`, `â€™`, `â€œ`, caractère de remplacement U+FFFD) sur les 7 fichiers CM2 — **aucune occurrence trouvée**. Aucune corruption d'encodage n'est donc retenue dans cet audit, conformément à la consigne de ne pas se fier à un affichage console qui peut déformer de l'UTF-8 parfaitement valide.

**Corrections constatées depuis le dernier audit (2026-07-11)** — à ne plus considérer comme des défauts actifs :
- Le bug de paramétrage `division-posed` (niveaux 2 et 3 statistiquement identiques) est corrigé : `js/engines-math.js` distingue bien `level===1` / `level===2` / `else` (niveau 3) avec des bornes de diviseur et de dividende différentes à chaque palier (vérifié en lisant le code : lignes 164-182).
- La formule d'aire du disque (π × rayon²) signalée dans `math_matching.json` a disparu : la catégorie `matching_math_cm2` actuelle (8 fiches) ne contient plus aucune mention de π ni de disque.
- L'ambiguïté de tri de la timeline `cm2-ordre-revolution-3` (Bastille/Déclaration des droits de l'homme toutes deux en 1789, Marseillaise/Première République toutes deux en 1792) est résolue : chaque événement porte désormais un champ `order` explicite (`bastille` order 0, `droits-homme` order 1, `marseillaise` order 0, `republique-1792` order 1), et le moteur (`js/engines-documentary.js`, fonction `byYearThenOrder` ligne 133) trie strictement par année puis par `order` — le tri est donc déterministe, sans ambiguïté.
- Le fichier `data/french_cm2_reading.json` (505 items) reste bien orphelin (aucun `dataFile` de `cm2.json` ne le cite — confirmé par recherche exhaustive), mais **son contenu a été corrigé et migré dans `data/french/reading.json`**, la bibliothèque française partagée, qui est celle réellement utilisée par le moteur `reading` (`js/app.js` ligne 286). Les 7 catégories CM2 nécessaires (`cm2_lecture_idee_principale`, `cm2_vocabulaire_sens`, `cm2_sens_propre_figure`, `cm2_vocabulaire_polysemie`, `cm2_vocabulaire_familles_mots`, `cm2_lecture_inference_personnage`, `cm2_lecture_connecteurs_logiques`) y sont présentes et correctement orthographiées. Les 4 erreurs précédemment signalées dans le fichier orphelin (« Le chenille », « Le iceberg » ×2, ordre inversé du têtard) **sont absentes de la version migrée** : `data/french/reading.json` ligne 6821 porte bien « La chenille se transforme... », ligne 39146 « L'iceberg se détache... », ligne 40356 « le têtard développe des pattes. Ensuite, il perd sa queue » (ordre biologique correct). Le fichier orphelin `data/french_cm2_reading.json` reste toutefois inutile dans le bundle (il continue d'être encodé en base64 dans `js/data-bundle.js` sans jamais être lu) — voir finding Suggestion en Français.
- Les 3 accents manquants historiquement signalés sur `cm2-symboles-republique` (« Republique », « Liberte, Egalite, Fraternite ») sont absents : la catégorie est intégralement accentuée (vérifié ligne 654-755 de `data/history_cm2.json`).
- Les 2 leçons EMC sur les institutions (`cm2-lesson-institutions-republique` et `cm2-lesson-institutions-republique-citoyens`) précédemment qualifiées de « quasi-doublons » ne le sont en réalité pas : la première traite la structure institutionnelle (Parlement, gouvernement, mairie), la seconde le rôle du citoyen (voter, s'informer, participer) — sujets liés mais contenus et questions `check` distincts. Reclassé comme faux positif, retiré des findings.
- « Conseil constitutionnel » : recherche exhaustive sur `emc_cm2.json` et `cm2.json` — **0 occurrence**. Ce terme, précédemment cité comme exemple de notion hors-niveau, n'existe plus dans le contenu actuel.

---

## Mathématiques CM2

### Exercices

**Majeur — progressivité incohérente avec l'intitulé « calcul mental »** — `cm2_tables_x` (« Multiplier par 11 à 15 ») et `cm2_tables_x_16_20` (« Multiplier par 16 à 20 ») ainsi que le bonus `cm2-bonus-tables-x-21-25`, tous `engine: "math-input", params.type: "calc-mental"`. Lu dans `js/engines-math.js` (case `'calc-mental'`, ligne 61) : `a = rnd(p.range[0], p.range[1])` et `b = rnd(2, 10)` — l'exercice génère donc des produits comme 23 × 9 ou 24 × 8, c'est-à-dire une **multiplication posée à deux chiffres**, pas une table de multiplication mémorisable. Le sous-titre « Calcul mental avancé » / « Calcul mental expert » promet une compétence (mémorisation de tables) que l'exercice ne mobilise pas réellement à ce niveau de bornes. Correction suggérée : soit renommer en « Multiplication à deux chiffres » pour aligner le titre sur ce qui est réellement demandé, soit plafonner `b` à une valeur cohérente avec un rappel de table (ex. `rnd(2,9)` en gardant `a` sur une seule table à la fois).

**Mineur** — apostrophes manquantes dans la banque `math_geometry_cm2.json`, catégorie `cm2-symetrie-figures` : « L axe de symétrie sert à... » (2e item, devrait être « L'axe »), « Un triangle n est pas toujours... » (devrait être « n'est pas »), « Le rayon d un cercle va... » (devrait être « d'un »). Même défaut dans `cm2-droites-angles` : « L équerre aide à vérifier... » (devrait être « L'équerre »), « Deux bords opposés d un cahier sont souvent... » (devrait être « d'un »), « Le coin d un mur ou d une feuille montre souvent... » (devrait être « d'un mur ou d'une feuille »). Ces items sont actifs (exercices `cm2-geo-symetrie-figures` et `cm2-geo-droites-angles`, `dataFile: data/math_geometry_cm2.json`). Correction suggérée : réinsérer les apostrophes typographiques.

**Mineur — exercice bonus sans garantie de couverture** — `cm2-bonus-graphique-expert` (« Toutes les questions, sans erreur »), `engine: "math-input"`, `params.type: "bar-chart-read"`. Lu dans `js/engines-math.js` (case `'bar-chart-read'`, ligne 271-272) : `const kind = pick(questionKinds)` tire un type de question au hasard à chaque question, sans mécanisme d'exclusion des types déjà posés. Sur 8 questions et 5 types possibles (`max`, `min`, `value`, `total`, `difference`), l'élève peut ne recevoir que 2 ou 3 types différents, ce qui contredit la promesse du sous-titre « Questions variées, sans erreur ». Correction suggérée : utiliser `pickUnused` (déjà présent dans `engines-core.js` pour d'autres moteurs) pour garantir un tirage sans répétition de type sur la durée de l'exercice.

**Suggestion** — `cm2-frac-build` et `cm2-fractions-lecture`/`cm2-fractions-lecture-2` couvrent des dénominateurs qui se chevauchent (jusqu'à 12, puis jusqu'à 20, puis jusqu'à 24 en bonus) sans repère de progression visible dans les sous-titres au-delà de « (2) » et « expert(e) » — lisible mais pourrait gagner en clarté avec un sous-titre indiquant explicitement la plage (« jusqu'à 20 » comme c'est déjà fait pour `cm2_fractions_lecture_2`).

**Points positifs** : 0 incohérence `answer`/`choices` détectée par un contrôle programmatique exhaustif sur l'ensemble des fichiers CM2 (`cm2.json`, `math_geometry_cm2.json`, `math_matching.json` inclus). Le moteur `division-posed` différencie désormais correctement ses trois niveaux (vérifié dans le code). Les leçons de géométrie (droites/angles, polygones/cercle, symétrie, aires/volumes) sont rédigées avec des questions `check` à piège pédagogique fin (ex. « pourquoi une diagonale de rectangle n'est pas un axe de symétrie », « pourquoi 22 cm n'est pas une aire ») qui interrogent vraiment la compréhension et non la mémorisation. Le classement des figures géométriques est rigoureux, y compris sur les cas particuliers délicats.

**Résumé** : Bloquant 0, Majeur 1, Mineur 3, Suggestion 1 (13 leçons, ~90 items audités).

---

## Français CM2

### Anomalie de branchement — dette résiduelle, pas un manque de contenu

`data/french_cm2_reading.json` (505 items, 5 catégories) reste un fichier mort : aucun `dataFile` de `cm2.json` ne le référence, et il continue pourtant d'être embarqué en base64 dans `js/data-bundle.js` (`window.DataBundle['data/french_cm2_reading.json']`), ce qui alourdit le bundle sans utilité — un fichier de contenu obsolète qui n'est jamais lu au runtime. **Bonne nouvelle confirmée par cette relecture** : son contenu a déjà été corrigé et migré vers `data/french/reading.json` (la bibliothèque partagée effectivement utilisée par le moteur `reading`), donc il n'y a plus d'erreur de contenu à corriger avant réactivation — il n'y a simplement plus de raison de réactiver ce fichier, qui devrait être supprimé du dépôt (et du bundle) lors d'une prochaine passe de nettoyage technique.

**Suggestion** — supprimer `data/french_cm2_reading.json` (et regénérer `js/data-bundle.js`) puisqu'il est mort et dupliqué par `data/french/reading.json` ; c'est un nettoyage technique hors du périmètre de cet audit de contenu, mais à signaler pour éviter toute confusion future sur la source de vérité des catégories `cm2_lecture_*`/`cm2_vocabulaire_*`.

### Exercices

**Mineur — catégorie orpheline non nettoyée** — `data/french/reading.json`, catégorie `cm2_vocabulaire_contexte_precis` (présente aussi dans le fichier mort `french_cm2_reading.json`) : recherche exhaustive dans `cm2.json` — **aucun exercice ne référence cette catégorie**. Le registre lexical de cette catégorie (« impraticable », « inauguré ») reste globalement adapté au niveau, contrairement à ce que l'audit précédent laissait entendre (les mots cités alors, « éloquence », « altruisme », « saumâtre », n'apparaissent nulle part dans cette catégorie ni ailleurs dans le contenu CM2 actif) — ce point de l'ancien audit ne se vérifie pas et est retiré. Correction suggérée : soit brancher cette catégorie sur un nouvel exercice « vocabulaire en contexte », soit la retirer si elle est jugée redondante avec `cm2_vocabulaire_sens`.

**Mineur — duplication d'exercices sur le même vivier** — `cm2_g_cloze_det` (`engine: choice-engine`, catégorie `grammar_cloze_cm2`) et `cm2_g_cloze_ecrit` (`engine: cloze-fill-in`, même catégorie `grammar_cloze_cm2`) : deux moteurs différents sur le même vivier de phrases à trous, ce qui est un usage légitime (QCM vs saisie libre changent réellement l'exercice), donc accepté — mentionné ici uniquement par souci de traçabilité, pas classé comme un vrai doublon.

**Points positifs** : l'accord du participe passé (`grammar_pp_accord_cm2`) et le passé simple, deux des points grammaticaux les plus difficiles du primaire, sont traités sans erreur relevée, avec des questions `check` qui creusent le raisonnement (« pourquoi rangé ne prend pas de -s malgré les élèves », « pourquoi arrivées s'accorde avec être ») plutôt que la simple restitution de règle. `french_word_order.json` (catégories `word_order_cm2`, `story_order_cm2`) est intégralement correct. Les 7 catégories `reading` migrées vers `data/french/reading.json` sont propres (aucune des 4 erreurs historiques retrouvée). Aucune incohérence `answer`/`choices` détectée sur l'ensemble des exercices français CM2 testés programmatiquement.

**Résumé** : Bloquant 0, Majeur 0, Mineur 2, Suggestion 1 (~63 leçons/exercices dans `cm2.json`, 7 catégories `reading` actives dans `data/french/reading.json`, fichier `french_cm2_reading.json` mort et non audité pour son contenu qui est hors service).

---

## Histoire CM2

### Leçons
**Suggestion** — la conquête spatiale (« premier homme sur la Lune ») reste classée dans la même leçon que les inventions techniques du XIXe siècle (`cm2-lesson-progres-techniques`, item « la conquête spatiale : le premier homme sur la Lune » aux côtés de « le chemin de fer », « le téléphone », « le cinéma »). Le texte introductif de la leçon reconnaît d'ailleurs explicitement la nuance (« certaines avancées, comme la conquête spatiale, marquent aussi les esprits sans être des objets du quotidien »), donc ce n'est pas une erreur factuelle, seulement un classement qui pourrait gagner en clarté avec un sous-titre ou un bloc dédié.

### Exercices

**Bloquant — ambiguïté de tri non résolue sur une timeline distincte** — `cm2-histoire-frise-revolution-ordre` (`engine: timeline`, `mode: order`, `timelineId: "cm2-ordre-revolution-4"`, titre « Bonaparte et Napoléon »), dans `data/history_chrono.json`. Cette timeline comporte 4 événements : `bonaparte-consul` (année 1799), `napoleon-empereur` (année 1804), `code-civil` (année 1804), `austerlitz` (année 1805). Contrairement à `cm2-ordre-revolution-3` (déjà corrigée par l'ajout d'un champ `order`), **`napoleon-empereur` et `code-civil` partagent la même année 1804 sans aucun champ `order` pour les départager** (vérifié dans `data/history_chrono.json`, lignes 1062-1076 : ni l'un ni l'autre ne porte de propriété `order`). Le comparateur du moteur (`js/engines-documentary.js`, `byYearThenOrder = (a,b) => (a.year - b.year) || ((a.order||0) - (b.order||0))`) traite alors les deux comme égaux (`0 - 0 = 0`), et l'ordre final dépend de la stabilité du tri JavaScript appliqué après un tirage aléatoire (`shuffle(...).sort(...)`) — le classement entre ces deux événements n'est donc pas garanti reproductible d'une partie à l'autre, alors qu'il existe pourtant un ordre historique réel : le Code civil est promulgué le 21 mars 1804, le sacre de Napoléon comme empereur a lieu le 2 décembre 1804 — le Code civil précède donc chronologiquement le sacre. Un élève qui répond dans le bon ordre historique peut être compté comme faux si le tirage aléatoire préalable a figé un ordre différent lors de la génération. Correction suggérée : ajouter un champ `order` à `napoleon-empereur` (ex. `order: 1`) et à `code-civil` (ex. `order: 0`) pour lever l'ambiguïté, sur le modèle de ce qui a déjà été fait pour `cm2-ordre-revolution-3`.

**Mineur** — doublon de contenu confirmé entre deux catégories de `data/history_cm2.json` : `cm2-revolution` (référencée par `cm2-histoire-revolution`) et `cm2-recits-revolution`/`cm2-recits-historiques` (référencée par `cm2-histoire-recits-revolution`) portent sur les mêmes repères (prise de la Bastille, dates de la Révolution) avec des choix légèrement reformulés. Confirmé aussi par le script `build-content-index.js --check`, qui classe `cm2/cm2-histoire-revolution` et `cm2/cm2-histoire-recits-revolution` comme `[contrat-identique]`.

**Mineur** — accent isolé manquant : `data/history_cm2.json`, catégorie `cm2-vie-democratique` (référencée par l'exercice actif `cm2-histoire-vie-democratique`) — item « Une élection sert à... » / réponse « choisir des representants » (2 occurrences, lignes 770 et 774 : le mot devrait être « représentants », avec un accent aigu sur le é). Item voisin également touché : « Debattre en respectant les autres, c'est... » (ligne 778, devrait être « Débattre »). Ce sont les 2 seules coquilles d'accent relevées dans tout `history_cm2.json` sur cette relecture complète — la catégorie `cm2-symboles-republique` signalée dans l'audit précédent est en réalité intégralement accentuée (voir corrections constatées ci-dessus).

**Points positifs** : traitement remarquable des sujets sensibles — Shoah, Occupation, Résistance, décolonisation abordés de façon factuelle et mesurée, sans dramatisation ni banalisation (ex. `cm2-lesson-seconde-guerre-mondiale`, `cm2-lesson-decolonisation`). Toutes les dates vérifiées exactes (1789, 1792, 1799, 1804-1805, 1914-1918, 1939-1945, 1944, 1945, 1958, 1947, 1954-1962, 1960). La timeline `cm2-ordre-revolution-3`, précédemment signalée Bloquant, est désormais correctement départagée par un champ `order` explicite et cohérent avec la chronologie réelle.

**Résumé** : Bloquant 1, Majeur 0, Mineur 2, Suggestion 1 (12 leçons, 27 exercices : QCM factuels, appariement et frises confondus).

---

## Géographie CM2

### Exercices

**Majeur — accents systématiquement absents sur deux catégories actives** — `data/geography_cm2.json`, catégories `cm2-france-europe` (référencée par `cm2-geo-europe`) et `cm2-habiter` (référencée par 3 exercices actifs : `cm2-geo-habiter`, `cm2-geo-habiter-espaces`, `cm2-bonus-geo-habiter-defi`). Citations exactes (lues directement dans le fichier, pas via console) :
- « La France fait partie du continent... » → réponse « **europeen** » au lieu de « européen » (`cm2-france-europe`, item 1).
- « Une frontiere separe... » → « **frontiere**... **separe** » au lieu de « frontière... sépare » (item 2).
- « ...le Bresil et l'Inde » au lieu de « Brésil » (item 3, choix distracteur).
- « L'Union europeenne regroupe... » / « plusieurs pays **europeens** » au lieu de « européenne »/« européens » (item 4).
- « L'Europe est **composee** de... » au lieu de « composée » (item 8).
- « Un pays a souvent une capitale, des villes et... » → « des **frontieres** » au lieu de « frontières » (item 7).
- Dans `cm2-habiter` : « Une **metropole** est souvent... » (métropole), « Le littoral est l'espace situe pres... » (« situé près »), « ...du **desert** » (désert), « On habite **differemment** selon... » (différemment), « Un quartier **residentiel** sert surtout à... » (résidentiel), « ...cultiver du **ble** partout » (blé), « Une zone portuaire est **liee** à... » / « la mer et aux **echanges** » (liée/échanges), « Les services d'une ville sont par exemple... » → « **ecoles et hopitaux** » (écoles et hôpitaux), « Habiter le littoral peut permettre... » → « la **peche** et le tourisme » (pêche), « Une ville bien **equipee** facilite... » / « les **eclipses** » (équipée/éclipses), « **Economiser** l'énergie dans les villes permet de... » (Économiser), « **Proteger** un littoral, c'est aussi... » (Protéger).

Ce n'est pas une coquille isolée : sur les deux catégories concernées (les plus anciennes du fichier, situées en tout début), la quasi-totalité des questions, réponses et distracteurs sont non accentués, ce qui contraste fortement avec toutes les catégories plus récentes du même fichier (`cm2-espaces-littoraux`, `cm2-espaces-montagnards`, `cm2-espaces-ruraux`, `cm2-cooperation-europe`, `cm2-echanges-flux`, `cm2-mobilites-durables`, `cm2-acteurs-mondialisation`), intégralement et correctement accentuées. Ces deux catégories sont actives et jouées par l'élève dans un exercice fondateur du sous-thème « France et Europe » (`cm2-geo-europe`) et dans le sous-thème « Habiter » (3 exercices). Correction suggérée : réaccentuer intégralement `cm2-france-europe` et `cm2-habiter`, en s'inspirant du style déjà correct des catégories voisines du même fichier.

**Mineur — apostrophes manquantes** — `data/geography_cm2.json`, catégorie `cm2-acteurs-mondialisation` (référencée par `cm2-geo-acteurs-mondialisation` et son bonus) : « Un produit que **j achète** peut avoir été fabriqué... » (devrait être « j'achète »), « ...jamais à **l étranger** » (« l'étranger »), « ...**n a** aucun salarié » (« n'a »), « ...stocker de **l eau** potable » (« l'eau »). Ces 4 défauts sont concentrés dans une seule catégorie, contrairement aux catégories voisines de mondialisation qui sont propres.

**Mineur — deux paires d'exercices sur le même vivier** — `cm2-geo-habiter` (8 questions) et `cm2-geo-habiter-espaces` (10 questions) référencent toutes deux `cm2-habiter` sans aucune différenciation de contenu ou de niveau ; de même `cm2-geo-durable` (6 questions) et `cm2-geo-agir-pour-durer` (8 questions) référencent toutes deux `cm2-developpement-durable`. Confirmé par `build-content-index.js --check` (`[contrat-identique]`).

**Points positifs** : 0 incohérence `answer`/`choices` sur 214+ items (contrôle programmatique exhaustif). Traitement neutre et factuel des sujets économiques sensibles — délocalisation, commerce équitable, uniformisation culturelle — sans caricature. Le manque pédagogique signalé par l'audit précédent (aucune carte/leçon dédiée aux espaces littoraux et montagnards distincts du reste de la France) est comblé : `cm2-espaces-littoraux`, `cm2-espaces-montagnards`, `cm2-espaces-ruraux` existent, sont richement rédigées (conchyliculture, transhumance, étagement de la végétation, érosion du littoral) et bien wirées à des exercices actifs. Les notions de géographie économique de niveau lycée précédemment signalées (subsidiarité, mégalopole européenne, Northern Range) ont disparu du contenu.

**Résumé** : Bloquant 0, Majeur 1, Mineur 3, Suggestion 1 (11 leçons, ~330 items répartis sur 15 catégories).

---

## Sciences CM2

### Exercices

**Mineur (accents isolés, ~10 occurrences réparties)** — coquilles d'accent ponctuelles trouvées par lecture directe, sans corruption systématique : `cm2-corps-sante` (« Les muscles servent surtout **a**... » sans accent sur à), `cm2-techno-energie` (« **Economiser** l'énergie, c'est par exemple... », deux fois ; « ...**fabriquee** par les arbres chaque jour » au lieu de « fabriquée »), `cm2-environnement` (« réutiliser des **materiaux** » au lieu de « matériaux » ; « **Economiser** l'eau permet de... » ; « **Reduire** les déchets, c'est... » ; « ...tout **melanger** » au lieu de « mélanger » ; « **rechauffer** l'eau » sans accent — devrait être « réchauffer »), `cm2-corps-effort` (« le coeur **s'arrete** » au lieu de « s'arrête »), `cm2-electricite-objets` (« **economiser** l'énergie » sans accent). **Point notable confirmé** : contrairement à ce que l'audit précédent indiquait, la catégorie `cm2-securite-electrique` (référencée par 2 exercices actifs) est en réalité **intégralement et correctement accentuée** sur toute sa longueur (lue en totalité, 30 items) — ce point de l'audit précédent ne se vérifie plus et est corrigé ici.

**Mineur — chevauchement de contenu entre 3 catégories du même sous-thème** — `cm2-matiere-transformations`, `cm2-etats-eau` et `cm2-melanges-solutions` (toutes trois dans `data/science_cm2.json`, toutes trois référencées par des exercices actifs du sous-thème « Matière et transformations ») couvrent en partie les mêmes notions (fusion/solidification/évaporation/condensation apparaissent dans `cm2-matiere-transformations` ET `cm2-etats-eau` ; mélange homogène/hétérogène apparaît dans `cm2-matiere-transformations` ET `cm2-melanges-solutions`). Chaque catégorie garde cependant un angle distinct (transformations chimiques vs cycle de l'eau vs solubilité), donc il ne s'agit pas d'un doublon strict — mais l'élève peut recevoir des questions très similaires (ex. « Comment s'appelle le passage de liquide à gaz ? ») dans deux exercices différents du même sous-thème. De même, `cm2-lumiere-son` (générale, référencée par `cm2-sciences-lumiere-son`) chevauche significativement `cm2-sources-lumiere-ombres` et `cm2-son-propagation` (deux catégories plus détaillées et de meilleure qualité, référencées séparément).

**Mineur — doublon quasi-paraphrase** — dans `cm2-corps-sante` : « Bien dormir aide le corps à... » → « récupérer » et, dans la même catégorie, un item très proche sur le sommeil (10 heures pour un enfant de cet âge) : contenu redondant mais formulé différemment, sans erreur.

**Suggestion** — les catégories `cm2-vivant-classification`, `cm2-vivant-reproduction`, `cm2-vivant-chaines-alimentaires` gagneraient à être signalées comme un point fort à conserver tel quel dans toute future vague de contenu : aucune généralisation fausse relevée (le manchot est correctement rattaché aux oiseaux malgré l'incapacité à voler, le dauphin est correctement distingué du requin malgré la ressemblance).

**Suggestion** — `cm2-matiere-transformations`, `cm2-etats-eau`, `cm2-melanges-solutions` pourraient être fusionnées en 2 catégories mieux délimitées (états de la matière incluant l'eau / mélanges-solutions-transformations chimiques) pour réduire la redite sans perdre de volume.

**Points positifs** : **0 Bloquant, 0 Majeur** — Sciences CM2 conserve le meilleur bilan de sévérité de tout l'audit. Traitement du changement climatique factuel et équilibré (cause humaine correctement attribuée, ni catastrophisme ni minimisation). Sécurité électrique exemplaire sur le fond et désormais aussi sur la forme (accents corrects). Classification du vivant rigoureuse. Aucune incohérence `answer`/`choices` détectée.

**Résumé** : Bloquant 0, Majeur 0, Mineur 4, Suggestion 2 (14 leçons, ~330 items répartis sur 21 catégories).

---

## EMC CM2

### Exercices

**Mineur — accents manquants visibles dans des titres d'exercices (pas seulement dans le corps des questions)** — `data/cm2.json` : l'exercice `cm2-emc-engagement-solidarite` a pour titre exact « **Solidarite** au quotidien » (ligne 7131, sans accent sur le second é) ; l'exercice bonus `cm2-bonus-emc-engagement-defi` a pour titre « **Defi** : engagement citoyen » et pour sous-titre « **Solidarite**, projet et action collective » (lignes 7155-7156, deux occurrences). Ces champs `title`/`subtitle` sont affichés tels quels dans le sélecteur d'exercices vu par l'élève — plus visible qu'une coquille dans une explication de fond. Correction suggérée : « Solidarité au quotidien », « Défi : engagement citoyen », « Solidarité, projet et action collective ».

**Mineur — au moins 6 paires/triples d'exercices EMC sur le même vivier de questions, sans différenciation de niveau** — confirmé par lecture de `cm2.json` et recoupé avec `node scripts/build-content-index.js --check` (`[contrat-identique]`) :
- `cm2-emc-citoyennete` (8q) / `cm2-emc-debattre-choisir` (10q) / `cm2-emc-institutions-republique` (7q) → tous trois `category: "cm2-citoyennete"`.
- `cm2-emc-solidarite` (8q) / `cm2-emc-agir-solidarite` (10q) → tous deux `category: "cm2-solidarite"`.
- `cm2-emc-solidarite-quotidienne` (6q) / `cm2-emc-engagement-solidarite` (6q) / bonus `cm2-bonus-emc-solidarite-quotidienne-expert` (10q) → tous trois `category: "cm2-solidarite-quotidienne"`.
- `cm2-emc-engagement` (6q) / `cm2-emc-sengager-classe` (8q) → tous deux `category: "cm2-engagement"`.
- `cm2-emc-responsabilites` (6q) / `cm2-emc-assumer-responsabilites` (8q) → tous deux `category: "cm2-responsabilites"`.
- `cm2-emc-projet-collectif` (6q) / `cm2-emc-engagement-projet` (6q) → tous deux `category: "cm2-projet-collectif"`.

Contrairement aux paires base/bonus (`isBonus: true`, légitimement plus longues et donc acceptées comme variantes), ces paires ne portent **aucune** marque `isBonus` ni différence de portée : deux exercices non-bonus, de titres et sous-titres différents, tirant dans exactement le même vivier. L'élève peut donc « débloquer » deux entrées différentes dans son parcours qui lui posent en réalité les mêmes questions (mélangées différemment). Correction suggérée : soit fusionner chaque paire en un seul exercice avec le nombre de questions le plus généreux, soit enrichir l'une des deux catégories sources avec des items réellement distincts (nouvelles questions, pas reformulations).

**Mineur/Suggestion — notion de séparation des pouvoirs présente mais reformulée simplement** — `cm2-citoyennete` contient la question « Pourquoi n'est-ce pas la même personne qui fait les lois et qui juge ? » (réponse : « Pour éviter qu'une seule personne ait tous les pouvoirs », difficulté 3) et « Qu'est-ce que la Constitution ? » (réponse : « La loi suprême », difficulté 3). Contrairement à l'audit précédent qui citait « Conseil constitutionnel » comme exemple concret de notion hors-niveau (terme introuvable dans le contenu actuel — recherche exhaustive négative), la formulation actuelle est accessible et sans jargon institutionnel (pas de « Montesquieu », pas de nom d'organe précis), ce qui reste globalement dans l'esprit du domaine EMC cycle 3 « Le droit et la règle ». Reclassé de Majeur à Mineur/Suggestion : le fond de la notion (pourquoi séparer les pouvoirs) est pédagogiquement défendable au niveau CM2 à condition de rester à ce niveau de généralité, ce qui est le cas ici.

**Points positifs** : traitement rigoureux et neutre de la liberté/justice (limites légales de la liberté d'expression bien posées, distinction claire nature/fonction du droit). Solidarité et engagement présentés factuellement sans biais idéologique, avec des exemples concrets et vérifiables (Restos du Cœur, Téléthon, UNICEF, don d'organes, service civique). 0 incohérence `answer`/`choices` sur l'ensemble des exercices EMC testés programmatiquement. `matching_emc_cm2` (9 fiches d'appariement) est intégralement et correctement accentué, avec un contenu institutionnel précis et exact (rôles du Président/Assemblée nationale/Sénat/conseil municipal, limites légales des libertés, sources des textes fondateurs). Les deux leçons sur les institutions, un temps qualifiées de quasi-doublons, sont en réalité complémentaires (voir section « Corrections constatées »).

**Résumé** : Bloquant 0, Majeur 0, Mineur 6, Suggestion 1 (11 leçons, ~150 items répartis sur 8 catégories).

---

## Récapitulatif des actions suggérées (indicatif — aucune exécution dans cette phase)

### Priorité 1 — Bloquant (1)
1. Ajouter un champ `order` à `napoleon-empereur` et `code-civil` dans `data/history_chrono.json` (timeline `cm2-ordre-revolution-4`) pour lever l'ambiguïté de tri entre deux événements de même année 1804, sur le modèle déjà appliqué à `cm2-ordre-revolution-3`.

### Priorité 2 — Majeurs (2)
- Réaccentuer intégralement les catégories `cm2-france-europe` et `cm2-habiter` de `data/geography_cm2.json` (dizaines d'occurrences sans accent, catégories actives jouées par l'élève).
- Clarifier le titre/sous-titre des exercices `cm2_tables_x`/`cm2_tables_x_16_20`/`cm2-bonus-tables-x-21-25` en Maths pour ne pas promettre des « tables de calcul mental » alors que le moteur génère des multiplications à deux chiffres, ou ajuster les bornes du moteur `calc-mental` pour que l'exercice corresponde réellement à des tables.

### Priorité 3 — Mineurs et suggestions (27)
Voir détail par matière ci-dessus. À noter en particulier, transversalement : les 25 groupes d'exercices `[contrat-identique]` (dont environ la moitié sans variante `isBonus`, donc de vrais doublons non justifiés) et le BOM UTF-8 sur 5 des 6 banques externes (actuellement neutralisé par le code, à corriger par hygiène plutôt que par urgence).

## Renvois à `curriculum-auditor`

Un audit de couverture (`docs/curriculum-audit-cm2.md`) a été relu le même jour (2026-08-01) et signale des manques de couverture qui ne relèvent pas de cet audit qualité : absence de repères « Temps modernes »/Renaissance en Histoire, absence de la notion d'attribut du sujet en grammaire, absence de la combustion comme transformation chimique en Sciences, absence des catégories d'homophones `leur/leurs` et `c'est/s'est` en exercice CM2. Ces manques sont mentionnés ici pour renvoi uniquement — leur traitement relève de `curriculum-auditor`/`exercise-author`, pas de cet audit qualité.

## Vérification

Validateurs lancés en filet sur l'ensemble du dépôt (résultats complets, pas seulement CM2) :
- `node scripts/build-content-index.js --check` → `CONTENT_INDEX_CHECK_OK` (995 exercices, 361 leçons, 74 banques, 479 avertissements `[contrat-identique]` non bloquants, dont les groupes CM2 cités plus haut).
- `node scripts/validate-subjects.js` → OK, toutes les matières canonicalisables (995 exercices parcourus).
- `node scripts/check-lesson-quiz.js` → `LESSON_QUIZ_OK`, 361/361 leçons équipées, 0 avertissement sur les leçons CM2 (le seul avertissement du run concerne une leçon CE1, hors périmètre).
- `powershell -ExecutionPolicy Bypass -File scripts/validate-data.ps1` → `DATA_VALIDATION_OK` (94 fichiers, 560 références d'exercices vérifiées).
- `node scripts/validate-maps.js` → OK, sous-système cartes cohérent (les banques orphelines signalées concernent CP/CE1/CE2, pas CM2).
- Contrôle programmatique dédié (script ad hoc, non versionné) : 0 incohérence `answer`/`choices` sur les 7 fichiers CM2 ; confirmation de BOM UTF-8 sur 5 banques par inspection d'octets bruts ; 0 motif de mojibake réel détecté sur l'ensemble des fichiers CM2.

Sciences CM2 reste la référence de qualité du niveau (0 Bloquant, 0 Majeur) — à utiliser comme modèle pour prioriser les corrections des autres matières.

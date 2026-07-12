# Audit qualité de contenu — CP

> Audit indépendant de la qualité intrinsèque de chaque leçon et exercice du niveau CP (exactitude factuelle, clarté pédagogique, adéquation au niveau, cohérence technique), distinct de [`curriculum-audit-cp.md`](curriculum-audit-cp.md) qui évalue la couverture du programme. Réalisé le 2026-07-11 par lecture intégrale (sans échantillonnage) de `data/cp.json` et de toutes les banques externes référencées, matière par matière.
>
> Sources faisant autorité : BO n°31 du 30/07/2020 (programme cycle 2 : français, mathématiques, questionner le monde, EMC), ressources Eduscol par domaine, dictionnaire/Bescherelle pour les points de langue stricte, IGN/Insee pour les découpages géographiques.
>
> **Aucune correction n'a été appliquée dans cette phase.** Ce document liste les problèmes trouvés ; la correction fait l'objet d'une phase séparée.

## Synthèse générale

| Sévérité | Maths | Français | Histoire | Géographie | Sciences | EMC | Total |
|---|---|---|---|---|---|---|---|
| Bloquant | 0 | 2 | 2 | 2 | 0 | 0 | **6** |
| Majeur | 4 | 4 | 3 | 0 | 0 | 1 | **12** |
| Mineur | 5 | 4 | 4 | 3 | 8 | 5 | **29** |
| Suggestion | 1 | 4 | 4 | 2 | 3 | 3 | **17** |

Environ 19+12+6+8+9+11 = 65 leçons et ~700 items de banque audités au total sur les 6 matières.

**Anomalie transverse la plus significative** : un phénomène de "fuite de niveau" (contenu de cycle 3 glissé dans des banques CP) est le fil rouge le plus préoccupant de cet audit, retrouvé indépendamment en Histoire (Préhistoire, Moyen Âge, métier d'archéologue) et en Géographie (régions administratives françaises nommées). Ces deux cas sont classés Bloquant.

**Anomalie technique transverse** : plusieurs banques CP commencent par un BOM UTF-8 (`data/emc_cp.json`, `data/geography_cp.json`, `data/science_cp.json`, `data/math_geometry_cp.json`, `data/french/conjugation.json`, `data/math_matching.json`, `data/french_word_order.json`) — un parsing JSON strict (ex. Node `JSON.parse` sans normalisation) peut échouer dessus ; le navigateur/`fetch` le tolère généralement mais c'est un point de vigilance encodage récurrent du projet (cf. `CLAUDE.md`).

---

## Mathématiques CP

### Leçons

**Majeur — cohérence leçon/exercices** — `data/cp.json`, leçon id=`cp-lesson-doubles-moities` (sous-thème `cp-nombres-comparaison`) — La leçon enseigne "double" et "moitié" correctement, mais aucun exercice du fichier ne met cette notion en pratique — ni dans ce sous-thème, ni ailleurs. Le moteur `js/engines-math.js` possède pourtant des générateurs prêts à l'emploi (`case 'half'`/`case 'double'`, lignes 80-88) non référencés par aucun exercice de `cp.json`. Correction suggérée : ajouter un exercice `math-input` de type `double`/`half` (bornes 1-10 pour rester ≤20 au doublé).

**Majeur — écart notion leçon/exercices** — `data/cp.json`, leçon id=`cp-lesson-cibles-comprendre` (sous-thème `cp-cibles-monnaie`) — La leçon explique le choix addition/soustraction, mais tous les exercices `cibles`/`banquier` du sous-thème (moteur `cibles`, lignes 70-79) ne font qu'additionner — jamais de soustraction. La leçon promet une compétence non exercée.

**Mineur — quasi-doublon de contenu** — leçons id=`cp-lesson-defi-chercher` (sous-thème `cp-defis-logique`) et id=`cp-lesson-resoudre-probleme` (sous-thème `cp-problemes-subtheme`) — même structure et exemple quasi identique (oiseaux/billes).

**Mineur — anti-pattern partiel** — leçons id=`cp-lesson-defi-chercher` et id=`cp-lesson-defi-verifier` — décrivent des "petits problèmes narratifs" alors que les exercices réels du sous-thème ("L'Oiseau Rapide", "Carré Magique") n'ont pas d'énoncé narratif. Lien pédagogique ténu.

**Mineur — écart de borne numérique** — leçon id=`cp-lesson-lire-ecrire-nombre` — annonce les nombres jusqu'à 100, mais tous les exercices de dictée du sous-thème s'arrêtent à 69 ; les nombres 70-99 (les plus irréguliers à l'oral, pourtant au programme CP) ne sont jamais pratiqués.

**Suggestion** — sous-thème `cp-formes-mesures-subtheme` — aucune leçon ne mentionne les solides (cube, boule) alors que 2 items de `math_geometry_cp.json` les testent.

### Exercices

**Majeur — niveau inadapté (hors-programme CP)** — `data/math_geometry_cp.json`, cat. `cp-formes-reconnaissance`, item "Quelle forme a 6 côtés, comme les alvéoles des abeilles ?" → hexagone (exposé par `cp-geo-formes-reconnaissance`, `cp-bonus-formes-mesures-defi`) — l'hexagone n'est pas au programme CP (BO cycle 2 : carré, rectangle, triangle, cercle) ; incohérent aussi avec la leçon associée qui ne mentionne que ces 4 formes. Correction suggérée : retirer ou déplacer vers CE1/CE2.

**Mineur — mélange 2D/3D non préparé** — mêmes fichiers, items "dé → cube", "ballon → boule" — non faux, mais la leçon associée ne traite que des formes planes.

**Majeur — exercice « Mathématiques » sans contenu mathématique** — `data/board_memory_match_cp.json`, cat. `cp_memory_match` (exposé par `cp-maths-memoire`, sous-thème `cp-formes-mesures-subtheme`) — sur 8 items du pool, 4 seulement relèvent des maths ; les 4 autres (animaux/petits, contraires, métiers) relèvent du français/questionner le monde. Un enfant peut recevoir un exercice classé Mathématiques sans aucune notion mathématique (tirage aléatoire de 4 items sur 8). Correction suggérée : séparer le pool par matière.

**Mineur — nuance sémantique** — `data/math_word_problems_cycle2.json`, cat. `cp-problemes-simples`, item "prêter 2 crayons" — calcul correct (8-2=6) mais "prêter" implique récupération future, peut légèrement brouiller la logique pour un enfant très littéral.

**Mineur — progressivité incohérente** — `data/cp.json`, sous-thème `cp-parcours-addition`, exercice id=`add-3` (`min:1,max:50`) — place une borne plus large qu'`add-2` (max 20) alors qu'il est positionné avant `add-4`/`add-5` qui reviennent à des compléments ≤20. Courbe de difficulté non monotone.

**Points positifs** : banques géométrie/mesures et problèmes simples très soignées (explications contextualisées, aucune ambiguïté answer/choices) ; moteur `carreSomme` avec anti-bug rigoureux ; `sub-simple` garantit l'absence de résultat négatif ; leçons addition/soustraction/heure exemplaires.

**Résumé** : Bloquant 0, Majeur 4, Mineur 5, Suggestion 1 (19 leçons, ~155 éléments audités)

---

## Français CP

### Leçons

Leçons dans l'ensemble conformes (format, une notion, exemples adaptés) ; quelques points mineurs :
- **Suggestion** — id=`cp-lesson-ecrire-mot-image` — lien sons/lettres à expliciter davantage.
- **Suggestion** — id=`cp-lesson-ecouter-ecrire-mot` — exemple "école" segmenté lettre par lettre plutôt que par phonèmes réels (le son [k] noté "c").
- **Suggestion** — subthème `cp-mots-outils-niveaux-subtheme` — aucune leçon introductive, contrairement aux autres subthèmes.

### Exercices

**Bloquant — mot corrompu** — `data/french/grammar.json`, cat. `gender_cp`, item `"word": "GTEAU"` (exposé par `cp-un-une`, `cp-le-la`, `cp-mon-ma`, `cp-bonus-genre-mixte`) — devrait être "GÂTEAU" ; mot affiché illisible/incorrect à l'enfant.

**Bloquant — mot corrompu** — même fichier/catégorie, item `"word": "SIRENE"` — devrait être "SIRÈNE" (accent grave manquant).

**Majeur — bug logique mon/ma** — `js/engines-french.js`, fonction `genderArticles` (lignes 242-266), exercice id=`cp-mon-ma` — pour les mots à initiale vocalique du pool `gender_cp` (avion, école, ours, orange, arbre, étoile, oiseau, île, éléphant, ananas, abeille, escargot, ampoule, écharpe, épée), le code retombe sur la logique le/la avec élision et fixe `answer="l'"` : un enfant verra "avion" avec les choix `["mon","ma","l'"]` et la bonne réponse sera "l'", ce qui est absurde pour un exercice de déterminant possessif. Correction suggérée : traiter "mon/ma" indépendamment (le français utilise "mon" devant voyelle même pour un nom féminin : "mon école").

**Majeur — règle grammaticale non enseignée** — mêmes items féminins à initiale vocalique — le passage "ma"→"mon" devant voyelle (contenu du programme cycle 2) n'est pas géré par le moteur.

**Majeur — mot inventé** — `data/french/reading.json`, cat. `cp_son_on`, item `"text": "bonton"` (exposé par `cp-lecture-on`) — n'existe pas en français (probable coquille pour "bouton"/"mouton"/"bonbon"). Correction suggérée : remplacer par un mot réel.

**Majeur — accent manquant + syllabation fautive** — `data/french/reading.json`, cat. `cp_reperer_syllabe`, item `"text": "fenetre"`, `"syllables": ["fe","ne","tre"]` (exposé par `cp-lecture-syllabes`) — devrait être "fenêtre" / `["fe","nê","tre"]`.

**Mineur** — item "simon" (nom propre) dans `cp_son_on`, incohérent avec le reste du pool (noms communs) ; icône 🩷 incohérente pour "GOMME" (cf. 🧽 utilisé ailleurs) ; doublon de contenu entre `cp-dictee-mots-outils` (catégories `cp_mots_outils_p1..p5`) et `cp-mots-outils-niveaux-subtheme` (catégories `mots_outils_cp_niveau_1..3`) — listes strictement identiques sous deux étiquettes différentes.

**Suggestion** — `data/french_word_order.json`, cat. `word_order_cp` — le verbe "fermer" revient ~10 fois sur 105 phrases, variété lexicale à renforcer.

**Anomalies techniques** : BOM UTF-8 sur `french_word_order.json` et `french/conjugation.json`. Code mort dans `js/engines-french.js` (fonction `conjugation`, lignes 70-73) : test `.endsWith("ger"/"cer")` en minuscules alors que les infinitifs stockés sont en MAJUSCULES — la branche corrective ne s'exécute jamais, sans impact actuel car les formes correctes sont pré-calculées dans le champ `full`, mais fragile si ce champ venait à manquer un jour.

**Points positifs** : couverture complète et cohérente du programme (sons, syllabation, lettres muettes, phrase, nom/verbe, déterminants, genre, mots-outils, être/avoir + 1er groupe) ; ~300 items audités avec seulement 4 erreurs de contenu ; aucune incohérence answer/choices dans les données elles-mêmes.

**Résumé** : Bloquant 2, Majeur 4, Mineur 4, Suggestion 4 (12 leçons, ~300 items audités)

---

## Histoire CP

### Leçons

**Majeur — anachronisme via banque associée** — leçon id=`cp-lesson-traces-passe` (sous-thème `cp-histoire-traces-subtheme`) — leçon elle-même conforme, mais sert de support à des exercices puisant dans une catégorie contenant Préhistoire/Moyen Âge (voir Exercices).

**Mineur — doublon de contenu** — leçons id=`cp-lesson-vivre-autrefois` et id=`cp-lesson-ecole-autrefois` — bullets et phrase "à retenir" identiques.

**Suggestion** — leçon id=`cp-lesson-temps-qui-passe` — introduit mois/année en avance sur la focale CP (jour/semaine).

### Exercices

**Bloquant — notion de cycle 3 hors-programme** — `data/history_cp.json`, cat. `cp-personnages-traces`, item sur les "hommes préhistoriques" (exposé par `cp-histoire-traces`, `cp-histoire-observer-traces`, `cp-bonus-traces-passe-defi`) — la Préhistoire relève du programme cycle 3 (CM1), pas de "Questionner le temps" en CP. Correction suggérée : retirer, remplacer par une trace familiale/locale simple.

**Bloquant — notion de cycle 3 hors-programme** — même fichier/catégorie, item sur les châteaux forts avec datation explicite "Moyen Âge, il y a environ mille ans" — repère de frise chronologique de cycle 3. Correction suggérée : simplifier en "il y a très longtemps" sans référence de période nommée.

**Majeur — vocabulaire avancé hors-programme** — même catégorie, item sur le métier d'« archéologue » — normalement introduit avec la Préhistoire/l'Antiquité en cycle 3 ; "historien" (déjà présent ailleurs dans la même banque) suffit au CP.

**Majeur — personnages historiques nommés hors-programme** — même catégorie, item sur "les rois et les reines" avec mention de Versailles — relève du cycle 3 (frise, Ancien Régime) ; le programme CP se limite à des traces génériques sans personnages identifiés.

**Mineur** — quasi-doublons de formulation dans `cp-personnages-traces` (3 variantes du gabarit "une trace du passé peut être...") réduisant la diversité perçue.

**Points positifs** : 0 incohérence answer/choices sur 104 items ; catégories `cp-avant-apres`, `cp-jours-saisons`, `cp-generations`, `cp-metiers-autrefois` exemplaires, bien cadrées CP, distracteurs pertinents (ex. "tablettes tactiles" comme anachronisme volontaire bien choisi).

**Référence croisée non auditée ici** : exercice id=`cp-emc-partager-materiel` (rattaché au sous-thème Histoire mais pointant vers `emc_cp.json`) — contenu couvert par le lot EMC ; rattachement thématique surprenant à signaler pour vigilance de rangement.

**Résumé** : Bloquant 2, Majeur 3, Mineur 4, Suggestion 4 (6 leçons, 104 items audités)

---

## Géographie CP

### Leçons

**Bloquant — conformité programme** — exercice id=`cp-geo-carte-regions` (sous-thème `cp-geo-reperage-subtheme`) — aucune leçon `lesson-card` ne l'accompagne, et la notion "régions administratives de France" ne relève pas du programme CP (cycle 2 : espace proche, plans simples) mais du cycle 3. Correction suggérée : retirer du niveau CP ou déplacer vers CE2/CM1.

**Suggestion — doublon** — leçons id=`cp-lesson-se-reperer-ecole` et id=`cp-lesson-gauche-droite` — contenu quasi identique.

**Mineur — titre dupliqué prêtant à confusion** — leçon id=`cp-lesson-se-reperer-ecole` porte le même titre ("Le plan de l'école") que id=`cp-lesson-plan-ecole` d'un autre subthème, alors que son contenu réel diffère.

### Exercices

**Bloquant — rupture de niveau majeure** — `data/board_map_locate_cp.json`, cat. `cp_map_regions_france`, tous les items (identifier Bretagne, Île-de-France, Corse, etc. sur une carte muette) — compétence de cycle 3, hors du programme CP centré sur l'espace proche. Correction suggérée : retirer cette banque du niveau CP ou la remplacer par un exercice sur le plan de l'école/la classe/la cour, cohérent avec la leçon `cp-lesson-plan-ecole`.

**Mineur — cohérence technique** (vérifiée, sans anomalie) — les 8 `targetZoneId` utilisés correspondent tous à des zones valides du SVG des régions ; seul le fond pédagogique pose problème (cf. ci-dessus), pas la mécanique technique.

**Mineur — doublon inter-catégories** — `data/geography_cp.json`, item "La cour de récréation se trouve..." répété à l'identique dans `cp-se-reperer` et `cp-lieux-ecole`.

**Suggestion** — item introduisant le mot "carte" sans qu'aucune leçon CP ne distingue plan/carte.

**Points positifs** : 0 incohérence answer/choices sur 90 items ; aucune erreur factuelle sur le contenu "espace proche" ; distracteurs non ambigus et adaptés à l'âge ; bon ancrage sécurité routière.

**Résumé** : Bloquant 2, Majeur 0, Mineur 3, Suggestion 2 (8 leçons, ~98 items audités)

---

## Sciences CP

### Leçons

**Majeur — cohérence interne entre leçons** — leçons id=`cp-lesson-vivant-non-vivant` et id=`cp-lesson-plantes-animaux` — critères distinctifs du vivant partiellement contradictoires d'une leçon à l'autre (respiration vs déplacement), source de confusion entre deux leçons consécutives du même sous-thème.

**Mineur — redondance** — leçon id=`cp-lesson-plantes-animaux` — reprend une notion ("besoins communs") déjà couverte par `cp-lesson-vivant-besoins`.

**Suggestion — ambiguïté de vocabulaire** — leçon id=`cp-lesson-matiere-etat` — le terme "corps" (au sens physique) risque d'être confondu avec le corps humain vu par ailleurs au même niveau.

### Exercices

**Mineur — confusion fusion/dissolution** — `data/science_cp.json`, cat. `cp-matiere`, item "Le sucre dans l'eau chaude... disparaît en fondant" (exposé par `cp-sciences-matiere`, `cp-bonus-sciences-matiere-defi`) — le sucre se dissout, il ne fond pas (deux phénomènes physiques différents) ; l'explication rattrape partiellement mais le choix de réponse lui-même contient le terme trompeur "fondant". Correction suggérée : "disparaît en se dissolvant".

**Mineur — faute d'accord dans une explication** — cat. `cp-hygiene-quotidienne`, item "Après le sport, on peut... boire et se reposer" — explication "le corps a transpire et dépensé de l'énergie" → devrait être "a transpiré".

**Mineur — doublons exacts inter-catégories** — deux items strictement identiques présents à la fois dans `cp-vivant` et `cp-animaux-plantes-quotidien" (besoin d'eau ; plante qui grandit).

**Mineur — incohérence de rangement** — deux exercices distincts intitulés "Les cinq sens" (id=`cp-sciences-cinq-sens` et id=`cp-sciences-corps-sens`), le second rangé à tort dans le sous-thème "Où vivent les animaux ?".

**Points positifs** : 0 incohérence answer/choices sur 137 items ; traitement du cas frontière "l'arbre est-il vivant" pédagogiquement solide (anticipe la conception naïve "vivant = qui bouge") ; formulation "certains objets en métal" pour l'aimant évite la généralisation abusive classique ; aucun cas scientifiquement ambigu (virus, feu, graine dormante) mal traité — ces cas limites sont prudemment évités plutôt que mal expliqués.

**Résumé** : Bloquant 0, Majeur 0, Mineur 8, Suggestion 3 (9 leçons, 137 items audités)

---

## EMC CP

### Leçons

**Mineur — titre dupliqué et rattachement peu clair** — exercice id=`cp-emc-vote-vivre-ensemble` (sous-thème vote) partage son titre "Vivre ensemble" avec un exercice d'un autre subthème, sans lien clair avec le vote.

**Mineur — encodage/accents manquants** — exercices id=`cp-emc-reconnaitre-emotions` et id=`cp-bonus-emc-emotions-defi` — titres/sous-titres sans aucun accent ("Reconnaitre les emotions", "Joie, tristesse, colere, peur...", "Defi : emotions et reactions"), alors que le reste du fichier est correctement accentué. Correction suggérée : "Reconnaître les émotions" / "colère" / "Défi : émotions et réactions".

**Suggestion** — leçons id=`cp-lesson-vivre-ensemble` et id=`cp-lesson-regles-classe` — contenus proches (mêmes bullets "écouter", "attendre son tour"), à différencier davantage.

### Exercices

**Majeur — distracteur discutable** — `data/emc_cp.json`, cat. `cp-vote`, item sur le vote pour un jeu (exposé par `cp-emc-vote`, `cp-bonus-emc-vote-defi`) — le distracteur "refuser de jouer" est présenté comme fautif alors que ne pas vouloir jouer à un jeu qu'on n'aime pas reste distinct du fait d'accepter le résultat du vote collectif. Correction suggérée : reformuler avec un distracteur moins ambigu (ex. "bouder").

**Mineur** — chevauchements inter-catégories (questions identiques dans `cp-entraide`/`cp-politesse-classe` et `cp-entraide`/`cp-partager-materiel`) ; distracteur au ton maladroit dans `cp-securite` ("amusant pour tout le monde").

**Points positifs** : 0 incohérence answer/choices sur 84+8 items ; questions de sécurité toutes justes et prudentes ; traitement des émotions neutre et bienveillant ("toutes les émotions sont normales") ; bon équilibre démocratique dans le traitement du vote.

**Résumé** : Bloquant 0, Majeur 1, Mineur 5, Suggestion 3 (11 leçons, 92 items audités)

---

## Récapitulatif des actions suggérées (indicatif — aucune exécution dans cette phase)

### Priorité 1 — Bloquants (6)
1. Retirer ou reformuler la banque `cp_map_regions_france` (`board_map_locate_cp.json`) et l'exercice `cp-geo-carte-regions` — notion de cycle 3.
2. Retirer/reformuler les items Préhistoire, Moyen Âge datés dans `history_cp.json` cat. `cp-personnages-traces`.
3. Corriger `"GTEAU"` → `"GÂTEAU"` et `"SIRENE"` → `"SIRÈNE"` dans `french/grammar.json` cat. `gender_cp`.

### Priorité 2 — Majeurs (12)
- Corriger la logique `genderArticles` dans `js/engines-french.js` pour l'exercice mon/ma devant voyelle.
- Corriger le mot inventé "bonton" et l'item "fenetre"/syllabation dans `french/reading.json`.
- Retirer "archéologue"/rois et reines de la banque Histoire CP.
- Séparer le pool `cp_memory_match` maths des items hors-matière.
- Ajouter un exercice double/moitié et clarifier l'exercice cibles (addition seule) en Mathématiques.
- Reformuler le distracteur "refuser de jouer" en EMC.

### Priorité 3 — Mineurs et suggestions (46)
Voir détail par matière ci-dessus (doublons de contenu, accents manquants, incohérences de rangement, BOM UTF-8).

## Vérification

Relecture recommandée par l'utilisateur des 6 items Bloquants avant toute décision de correction, en particulier les deux fuites de programme (Histoire, Géographie) qui questionnent la constitution même des banques `history_cp.json` et `board_map_locate_cp.json` au-delà des items cités.

# Audit qualité de contenu — CE2

> Audit indépendant de la qualité intrinsèque de chaque leçon et exercice du niveau CE2 (exactitude factuelle, clarté pédagogique, adéquation au niveau, cohérence technique), distinct de [`curriculum-audit-ce2.md`](curriculum-audit-ce2.md) qui évalue la couverture du programme. Réalisé le **2026-07-29** par lecture intégrale (sans échantillonnage) de `data/ce2.json` (6247 lignes, 69 leçons, 177 exercices) et de **toutes** les banques externes qu'il référence, matière par matière — même méthode que [`content-quality-audit-cp.md`](content-quality-audit-cp.md) et [`content-quality-audit-ce1.md`](content-quality-audit-ce1.md).
>
> Banques externes auditées intégralement : `math_geometry_ce2.json` (figures/propriétés, angle droit/équerre, symétrie/quadrillage), `math_word_problems_cycle2.json` (`ce2-monnaie`), `math_word_problems_cycle3.json` (`ce2-problemes-additifs`/`ce2-problemes-multiplicatifs`), `math_matching.json` (`matching_math_ce2`), `board_tap_features_ce2.json`, `board_symmetry_complete_ce2.json`, `board_point_on_grid_ce2.json`, `board_memory_match_ce2.json`, `history_ce2.json`, `history_matching.json` (`matching_histoire_ce2`), `geography_ce2.json`, `geography_matching.json` (`matching_geo_ce2`), `science_ce2.json`, `science_matching.json` (`matching_sciences_ce2`), `board_tap_features_science.json` (`ce2_tap_corps_humain`), `emc_ce2.json`, `emc_matching.json` (`matching_emc_ce2`), `french_ce2_reading.json` (633 items), `french_word_order.json` (`word_order_ce2`, `story_order_ce2`, `alpha_order_ce2`), `french/grammar.json` (catégories `*_ce2`), `french/matching.json` (`matching_contraires_ce2`, `matching_dictionnaire_ce2`), `french/conjugation.json` (catégories `*_ce2_*`). `board_map_locate_ce2.json` également lu intégralement pour vérifier son statut (voir plus bas).
>
> Sources faisant autorité : BO n°31 du 30/07/2020 (programme cycle 2), `PROGRAMME_SCOLAIRE_REFERENCE.md` (référentiel interne dérivé du BO, section CE2), dictionnaire/Bescherelle (ordre alphabétique vérifié par comparaison programmatique stricte), IGN/Insee.
>
> **Aucune correction n'a été appliquée dans cette phase.** Ce document liste les problèmes trouvés ; la correction fait l'objet d'une phase séparée (souvent confiée ensuite à `exercise-author` ou à une intervention manuelle).
>
> **Mise à jour du 2026-07-30 (postérieure à cet audit) : les 2 Bloquants et les 2 Majeurs corrigés, plus une correction qualité supplémentaire.** Un lot 0 de production a traité l'intégralité des points listés en Priorité 1 et 2 ci-dessous : retrait de l'item « périodes historiques » (Moyen Âge/Temps modernes) de `board_memory_match_ce2.json::ce2_memory_match`, remplacé par un item neutre « repères de temps et durée » (décennie/siècle/génération/millénaire) ; correction de la paire « biche »/« biscuit » (ordre alphabétique) dans `french/matching.json::matching_dictionnaire_ce2` ; correction du doublon de contrat `ce2-comp-1000`/`ce2-comp-2000` (`target` distinct désormais). Deux corrections qualité additionnelles, trouvées lors du même passage et hors de la synthèse chiffrée ci-dessus, ont aussi été appliquées : fuite cycle 3 dans la leçon d'histoire `ce2-ecole-autrefois` (date « 1880 » retirée) et contradiction question/réponse dans `french/reading.json::ce2_vocabulaire_champ_lexical` (item 6). Le Majeur Géographie (`ce2-geo-transports-cartes` recyclant `ce2-cartes-symboles`) n'a pas été traité dans ce lot. Ce paragraphe signale l'action menée ; il ne remplace pas un réaudit complet.

## Note liminaire : cet audit remplace intégralement celui du 11/07/2026, réputé périmé

Le contenu CE2 a été substantiellement retravaillé depuis l'audit du 11/07/2026 (quiz d'ancrage sur toutes les leçons, retouche des distracteurs de quiz pour que la bonne réponse ne soit plus systématiquement la plus longue, correction de la règle R4, arc de cartes « Panthéon des Divinités » côté gamification sans effet sur le contenu pédagogique). Cet audit **ne recopie aucune conclusion de l'ancien document** : chaque point a été revérifié par lecture directe du JSON actuel, avec un accent particulier sur la fuite de programme Histoire qui était la découverte la plus grave du 11/07.

**Le point le plus important du 11/07 — la fuite de programme Histoire vers le cycle 3 (8 items Bloquants) — est en grande majorité corrigé, avec une exception isolée mais réelle** (voir Anomalie transverse ci-dessous et détail en Mathématiques/Histoire). Sur les 8 items Bloquants d'origine :
- Les 6 items de `history_ce2.json::ce2-personnages-celebres` (Jeanne d'Arc « au XVe siècle », Louis XIV « au XVIIe siècle », Charlemagne « l'an 800 », Vercingétorix « il y a plus de 2000 ans », Christophe Colomb « 1492 ») sont **intégralement réécrits** : la catégorie compte désormais 20 items, aucun ne mentionne de date à 4 chiffres, de siècle ou de période nommée pour ces personnages (vérifié par recherche programmatique systématique sur toute la catégorie).
- L'item de matching (`matching_histoire_ce2`, « guerre de Cent Ans »/« Moyen Âge ») est **corrigé** : la catégorie a été entièrement récrite avec des paires sans dates ni périodes nommées (vérifié ligne à ligne sur les 9 items). Les dates/périodes de cycle 3 encore présentes dans `history_matching.json` (1492, 1789, Moyen Âge, Antiquité, Préhistoire) existent bien dans le fichier, mais exclusivement dans `matching_histoire_cm1` et `matching_histoire_cm2` — catégories non référencées par le CE2. Aucune fuite croisée constatée à ce niveau.
- Les 4 Majeurs sur les dates de Gutenberg/Montgolfier/Napoléon/Jules Ferry ont également disparu de `ce2-personnages-celebres` (dates retirées, formulations du type « il y a très longtemps », « en 1783 » n'apparaît plus — vérifié).
- La leçon `ce2-lesson-monuments-indices` ne mentionne plus « le Moyen Âge » (remplacé par « une époque où l'on devait se protéger des attaques »).

**Mais une fuite de même nature réapparaît dans une banque non auditée en juillet** : `board_memory_match_ce2.json` (jeu de mémoire), référencée par l'exercice `ce2-maths-memoire` classé en **Mathématiques**, contient un item entier intitulé « Retrouve chaque période historique et son repère » avec les paires « le Moyen Âge » → « les châteaux forts » et « les Temps modernes » → « après 1500 ». Voir détail Bloquant en Mathématiques ci-dessous — c'est la découverte la plus significative de ce réaudit.

**Deuxième point majeur du 11/07 — la carte des 13 régions de France (`ce2_map_regions_france`)** : le fichier `data/board_map_locate_ce2.json` existe toujours avec ses 13 régions, mais **il n'est plus référencé par aucun exercice de `data/ce2.json`** (confirmé par grep systématique et par `node scripts/validate-maps.js`, qui le signale comme banque orpheline aux côtés de `board_map_locate_ce1.json` et `board_map_locate_cp.json`). La fuite de niveau géographique la plus large des trois audits précédents n'est donc plus **jouée** par aucun élève — reclassée en simple point de nettoyage (Suggestion), le contenu mort restant embarqué dans le bundle sans y être accessible.

**Les autres Bloquants du 11/07 sont tous corrigés**, confirmé par lecture directe :
- Français : « chantier »/famille de « chant » → remplacé par « chant »→« chanter »/« chanteur » (étymologiquement correct) ; ordre alphabétique « pelouse peluche pendu pendule » → vérifié programmatiquement conforme à l'ordre alphabétique réel (chaîne courte à préfixe égal avant la longue).
- Sciences : contradiction renard omnivore/carnivore → `science_matching.json` dit désormais « prédateur » (générique), et l'item carnivore strict de la même banque utilise désormais « le loup ».
- Mathématiques : bug `table: 12` au lieu de `"mix"` sur `ce2-bonus-tables-melangees` → corrigé (`"table": "mix"` confirmé dans `data/ce2.json`), et le moteur (`js/engines-math.js`) tire bien dans `rnd(2, 12)` pour la branche `"mix"` — le second défaut (plage limitée) signalé par l'ancien audit est également résolu.

**Nouveau Bloquant trouvé, absent de l'audit du 11/07** : `french/matching.json::matching_dictionnaire_ce2` contient un item où « biche » est associé aux mots-repères « bicyclette - bouton », alors qu'une comparaison alphabétique stricte (`"biche".localeCompare("bicyclette") = -1`) montre que « biche » vient **avant** « bicyclette » et n'appartient donc pas à cette page — une authentique erreur factuelle sur le principe même de l'exercice (voir détail en Français).

## Synthèse générale

| Sévérité | Maths | Français | Histoire | Géographie | Sciences | EMC | Total |
|---|---|---|---|---|---|---|---|
| Bloquant | 1 | 1 | 0 | 0 | 0 | 0 | **2** |
| Majeur | 1 | 0 | 0 | 1 | 0 | 0 | **2** |
| Mineur | 3 | 3 | 2 | 3 | 1 | 2 | **14** |
| Suggestion | 1 | 1 | 1 | 2 | 1 | 1 | **7** |

Environ **69 leçons** et **~1 550 items** de banque externe audités au total (dont 1234 items sur les 6 fichiers de catégories principaux, plus les banques de matching/word-order/memory-match/conjugaison).

**Anomalie transverse — fuite de programme Histoire résiduelle dans une banque non pédagogique (`board_memory_match_ce2.json`)**, classée en Mathématiques. C'est le seul point de la famille « dates/périodes cycle 3 » qui persiste sur les six matières, et il n'avait pas été repéré par l'audit du 11/07 car cette banque n'existait pas encore ou n'avait pas été lue à l'époque. Détail en Mathématiques ci-dessous.

**Anomalie transverse technique — BOM UTF-8, bien plus étendue que ce que signalait `curriculum-audit-ce2.md`.** Ce dernier ne relevait que 4 fichiers (`math_geometry_ce2.json`, `science_ce2.json`, `history_ce2.json`, `geography_ce2.json`). Une vérification programmatique complète sur les 22 banques référencées par le CE2 en trouve **11** : `history_ce2.json`, `geography_ce2.json`, `science_ce2.json`, `math_geometry_ce2.json`, `emc_ce2.json`, `history_matching.json`, `geography_matching.json`, `science_matching.json`, `math_matching.json`, `french_word_order.json`, `french_ce2_reading.json`, plus `board_map_locate_ce2.json` (orpheline). `data/french/grammar.json`, `data/french/matching.json`, `data/emc_matching.json`, `data/math_word_problems_cycle2.json`, `data/math_word_problems_cycle3.json` et les quatre banques `board_*` d'interactivité (tap-features, symmetry-complete, point-on-grid, memory-match) n'ont pas de BOM. Sans impact fonctionnel constaté au runtime (le navigateur tolère le BOM), mais un `JSON.parse` strict côté outillage (confirmé en le reproduisant : Node lève `SyntaxError` sur ces 11 fichiers sans nettoyage préalable) — point de vigilance récurrent du projet.

**Aucun mojibake, apostrophe dégradée ni `\uXXXX` inutile** détecté dans le texte visible de l'ensemble des banques CE2 auditées (vérification programmatique par recherche de séquences typiques `Ã©`, `â€™`, `�`, `\\uXXXX` — 0 occurrence sur les 24 fichiers scannés).

**Résultat des validateurs (lancés en filet, jamais en substitut à la lecture) :**
- `powershell scripts/validate-data.ps1` → **DATA_VALIDATION_OK**, 94 fichiers vérifiés, 554 références d'exercices contrôlées.
- `node scripts/build-content-index.js --check` → **CONTENT_INDEX_CHECK_OK**, 970 exercices, 349 leçons, 74 banques, aucun doublon d'`id`. Parmi les 477 avertissements « pool »/« contrat-identique » (tous niveaux), 8 concernent le CE2 : les 3 réutilisations légitimes de pool déjà repérées par lecture directe (`matching_histoire_ce2` sur 2 exercices, `matching_emc_ce2` sur 2 exercices, `ce2-parole-ecoute` sur 2 exercices), plus le doublon de contrat exact `ce2-comp-1000`/`ce2-comp-2000` (voir Mineur Mathématiques) et un doublon inter-niveaux `ce1-bonus-complements-100`/`ce2-comp-100` (bornes différentes, non problématique).
- `node scripts/check-lesson-quiz.js` → **LESSON_QUIZ_OK**, 349/349 leçons équipées tous niveaux (100 %), dont les 69 leçons CE2 (0 sans quiz, 0 bloc `check` avec `id`). Aucun avertissement R4 résiduel signalé pour le CE2.
- `node scripts/validate-subjects.js` → **OK**, toutes les matières des 5 niveaux (dont CE2) canonicalisables par `Storage.canonicalizeSubjectId`.
- `node scripts/validate-maps.js` → **OK — sous-système cartes cohérent**, mais signale `data/board_map_locate_ce2.json` comme banque orpheline (aucun exercice CE2 ne la référence), aux côtés de `board_map_locate_ce1.json` et `board_map_locate_cp.json`.
- Vérification programmatique complémentaire : **0** `answer` absente de `choices` et **0** choix dupliqué au sein d'un item, sur les 1234 items des 6 banques de catégories principales (`history_ce2.json`, `geography_ce2.json`, `science_ce2.json`, `math_geometry_ce2.json`, `emc_ce2.json`, `french_ce2_reading.json`), et sur `math_matching.json`, `math_word_problems_cycle3.json`. Les 10 items de `alpha_order_ce2` vérifiés conformes à l'ordre alphabétique réel (`localeCompare` strict). Les 10 items de `board_symmetry_complete_ce2.json` vérifiés géométriquement exacts (symétrique = même distance à l'axe, côté opposé). Les 12 items de `board_point_on_grid_ce2.json` vérifiés dans les bornes du quadrillage.

---

## Mathématiques CE2

### Leçons

Les 15 leçons sont conformes au programme (multiplication/division posées, fractions simples, angle droit, symétrie, mesures, monnaie) et toutes équipées d'un quiz d'ancrage jouable.

**Mineur — persistant depuis le 11/07** — leçon `ce2-lesson-multiplier-10-100` mélange la règle des zéros (×10/100/1000) avec un exemple de produit de deux dizaines (30×40, via le 2e bloc `check` sur 40×30) : deux notions dans une même leçon. Gravité faible, les deux quiz restent corrects et bien expliqués.

### Exercices

**Bloquant — nouvelle fuite de programme, non détectée le 11/07, dans une banque de jeu de mémoire mal classée** — `data/board_memory_match_ce2.json`, catégorie `ce2_memory_match`, référencée par l'exercice `ce2-maths-memoire` (« Notions de maths mélangées », sous-thème `ce2-geometrie-subtheme`, matière **Mathématiques**). Sur les 8 items du vivier (dont 1 seul est tiré aléatoirement par partie via `pickUnused`, cf. `js/engines-board.js::memoryMatch`), l'item 3 s'intitule « Retrouve chaque période historique et son repère » avec les paires : « la Préhistoire » → « avant l'écriture », « l'Antiquité » → « les Gaulois et les Romains », **« le Moyen Âge » → « les châteaux forts »**, **« les Temps modernes » → « après 1500 »**. Deux problèmes cumulés : (1) fuite de niveau caractérisée — grandes périodes historiques nommées et datées, matière de cycle 3, exactement le défaut le plus sévère déjà documenté en Histoire lors des audits précédents ; (2) mauvais rangement disciplinaire — un item d'Histoire (et, à l'item 1 du même vivier, un item de synonymes relevant du Français) est exposé dans un exercice classé Mathématiques, aux côtés de tables de multiplication, fractions et figures géométriques. Un élève de CE2 a ainsi une chance sur huit de recevoir cet item en cliquant sur un exercice de maths. Correction suggérée : retirer les items 1 (synonymes) et 2 (périodes historiques) du vivier `ce2_memory_match`, ou scinder la banque en sous-catégories par matière et ne référencer que la partie mathématique (tables, fractions, figures, durées) depuis `ce2-maths-memoire`.

**Majeur — doublon d'exercice quasi parfait** — `ce2-comp-1000` et `ce2-comp-2000` ont un titre identique (« Compléments à 1000 »), un sous-titre identique (« Vers les grands nombres ») et des `params` strictement identiques (`type: complement, target: 1000, questions: 10`) — confirmé par `node scripts/build-content-index.js --check` (avertissement « contrat-identique »). Contrairement à ce que décrivait l'audit du 11/07 (qui évoquait un exercice à cible 2000, jugé hors-programme CE2), le contenu a été corrigé depuis pour ramener la cible à 1000, mais le second exercice n'a pas été retiré ni redifférencié : c'est aujourd'hui un doublon fonctionnel pur plutôt qu'une anticipation hors-programme. Correction suggérée : soit supprimer `ce2-comp-2000`, soit lui donner une cible différente (par exemple 1000 avec un nombre de questions différent, ou une vraie cible 2000 si l'anticipation est assumée et signalée `isBonus`).

**Mineur** — pool `matching_math_ce2` (8 items, 100 % mathématique) réutilisé pour deux exercices aux titres thématiques différents (« Nombres et opérations » vs « Notions de maths mélangées ») sans sous-catégorisation réelle — persistant depuis le 11/07, gravité inchangée (pas un mélange disciplinaire, juste une redondance de vivier).
**Mineur** — le doublon fonctionnel `ce1-bonus-complements-100`/`ce2-comp-100` signalé par le validateur est inter-niveaux avec des bornes différentes (100 vs 100 mais niveau et progression distincts) : vérifié non problématique, mentionné ici pour traçabilité du garde-fou.

**Suggestion** — les tables 11/12 sont bien marquées `isBonus: true` avec seuil `bonusThreshold: 2` (contrairement à ce que rapportait le 11/07) ; le point est donc déjà traité, gardé en Suggestion pour signaler que la vérification a bien été refaite.

**Points positifs** : bug `table: 12` → `"mix"` corrigé, et la plage `rnd(2, 12)` du moteur `mult` couvre bien 2 à 12 pour la branche `"mix"` (les deux défauts du 11/07 sont résolus) ; le distracteur "0,50 centime" mélangeant unités €/centimes n'existe plus dans `ce2-monnaie` (10 items tous cohérents, calculs vérifiés exacts) ; les 10 items de `board_symmetry_complete_ce2.json` sont géométriquement exacts (vérification programmatique systématique) ; les 12 items de `board_point_on_grid_ce2.json` sont dans les bornes du quadrillage ; **0** incohérence `answer`/`choices` sur les 56 items de `math_geometry_ce2.json`, les 18 items de `ce2-monnaie`/`ce2-problemes-*` et les 20 items de `math_word_problems_cycle3.json` (calculs tous vérifiés exacts) ; division posée et fractions bornées correctement.

**Résumé** : Bloquant 1, Majeur 1, Mineur 3, Suggestion 1 (15 leçons, ~150 items de banque)

---

## Français CE2

### Leçons

Les 16 leçons sont conformes (homophones étendus ce/se-ces/ses, genre avec élision, accords, passé composé/imparfait/futur nouveaux au CE2) et toutes équipées d'un quiz jouable. La Suggestion du 11/07 (leçon passé composé n'expliquant pas l'accord du participe passé avec « être ») est **résolue** : le bloc `bullets` de `ce2-lesson-passe-compose` mentionne désormais explicitement « avec être, le participe passé s'accorde avec le sujet : il est tombé, elle est tombée », et le second quiz de la leçon interroge précisément ce point (« Elles sont parties »).

### Exercices

**Bloquant — nouvelle erreur factuelle, non détectée le 11/07, sur le principe même de l'exercice de dictionnaire** — `data/french/matching.json`, catégorie `matching_dictionnaire_ce2` (exercice `ce2-vocab-dictionnaire-reperes`), item « Relie chaque mot aux mots-repères de la page où il se trouve dans le dictionnaire » : la paire « biche » → « mots-repères : bicyclette - bouton » est fausse. Une comparaison alphabétique stricte (`"biche".localeCompare("bicyclette", "fr")` retourne `-1`) montre que « biche » (b-i-c-**h**...) vient alphabétiquement **avant** « bicyclette » (b-i-c-**y**...), donc en dehors de la page qui commence à « bicyclette » — l'élève apprend une association fausse dans un exercice dont l'objectif exact est de maîtriser ce mécanisme. Les 3 autres paires du même item (« chaton »/« chameau-chocolat », « fourmi »/« fossile-fusée », « nuage »/« niche-nuisette ») et les items suivants de la catégorie (« dromadaire », « glacier », « porcelaine », « tunnel ») ont été vérifiés corrects. Correction suggérée : remplacer « biche » par un mot réellement compris entre « bicyclette » et « bouton » dans l'ordre alphabétique (par exemple « bijou » ou « bonbon »), ou ajuster les mots-repères.

**Mineur — persistant depuis le 11/07, gravité inchangée** — `ce2-vocab-appariement`/`ce2-vocab-dictionnaire-reperes` sont deux exercices bien distincts sur deux viviers différents (`matching_contraires_ce2` et `matching_dictionnaire_ce2`), aucun doublon constaté sur ce point contrairement à ce qu'un examen superficiel pourrait suggérer.
**Mineur — quasi-doublon fonctionnel réévalué** — les paires `ce2-g-un-une`/`ce2-g-objets` (catégories `gender_ce2_objets` et `gender_ce2_objets_2`) et `ce2-g-le-la`/`ce2-g-elision` (`gender_ce2_elision`/`gender_ce2_elision_2`) utilisent en réalité des mots **différents** dans chaque vivier (vérifié par lecture des 4 catégories dans `data/french/grammar.json`) : ce ne sont pas des doublons fonctionnels purs comme le disait le 11/07, mais deux séries d'exercices progressifs sur la même compétence — reclassé en Mineur (chevauchement de conception, pas un doublon technique) plutôt qu'un doublon strict.
**Mineur — persistant** — le champ sémantique chaud/froid revient dans plusieurs entrées de `ce2_vocabulaire_familles_mots` (chaud/chaleur/réchauffer, froid/froideur/refroidir) : redondance mineure sur une banque de 108 items, sans gravité.

**Suggestion** — la catégorie `ce2_vocabulaire_synonymes` (108 items, entièrement retravaillée depuis le 11/07) est désormais un point fort : chaque item présente le mot dans une phrase complète avec un synonyme immédiatement accessible pour un CE2 (« violent » → « fort », « docile » → « obéissant »…) ; le vocabulaire signalé trop avancé au 11/07 (« perspicace », « laborieux », « insipide ») n'existe plus.

**Points positifs** : les 633 items de `french_ce2_reading.json` d'excellente qualité rédactionnelle, **0** incohérence `answer`/`choices` détectée ; formes conjuguées du passé composé/imparfait/futur toutes vérifiées exactes (cédilles -ger/-cer correctes : « nous mangeons », etc.) ; les pools `present_3_ce2_a`/`present_3_ce2_b` comptent désormais **6 verbes chacun** (Aller/Faire/Dire/Venir/Boire/Mettre et Pouvoir/Vouloir/Prendre/Voir/Savoir/Sortir) contre 4 signalés au 11/07 — ce Mineur est résolu ; homophones ce/se et ces/ses bien traités ; l'ordre alphabétique de `alpha_order_ce2` (10 items) est intégralement conforme à l'ordre réel, y compris l'item « pelouse peluche pendu pendule » corrigé (vérification programmatique stricte) ; `word_order_ce2` (105 items) ne présente pas de motif de répétition abusif de verbe (contrairement au CE1 avec « range » 13 fois) ; l'erreur factuelle « chantier »/famille de « chant » du 11/07 est corrigée.

**Résumé** : Bloquant 1, Majeur 0, Mineur 3, Suggestion 1 (16 leçons, ~950 items audités)

---

## Histoire CE2 — la fuite de programme la plus sévère du 11/07 est corrigée à 95 %

### Leçons

Aucune anomalie Bloquante ou Majeure sur les 8 leçons. Les deux Bloquants du 11/07 sont corrigés :
- `ce2-lesson-monuments-indices` ne mentionne plus « le Moyen Âge » — la période nommée a été retirée, remplacée par « une époque où l'on devait se protéger des attaques » pour les remparts de Carcassonne.
- `ce2-lesson-siecle-frise` garde la notion de siècle/millénaire (conforme au programme cycle 2, qui inclut ces repères simples) et l'exemple « environ 8 siècles » pour un château fort reste un ordre de grandeur qualitatif plutôt qu'une date précise — ce point est cohérent avec le référentiel (`PROGRAMME_SCOLAIRE_REFERENCE.md`), qui situe bien « siècle »/« millénaire » comme repères CE2 ; reclassé non problématique après relecture (l'ancien Bloquant portait sur l'anticipation d'une frise déjà repérée par grandes périodes nommées, ce qui n'est plus le cas ici).

Le Majeur du 11/07 sur « laïque » sans exemple concret (leçon Jules Ferry) est atténué : le bloc `bullets` reformule désormais « l'école accueille tous les élèves, quelles que soient les croyances (à l'école, on n'enseigne pas une religion en particulier) » — un exemple concret existe, quoique moins direct que pour « gratuite »/« obligatoire ». Reclassé Suggestion.

**Suggestion** — l'id `ce2-lesson-france-releifs-fleuves` (Géographie, voir plus bas) garde une faute de frappe historique dans l'identifiant technique lui-même (`releifs` au lieu de `reliefs`), sans impact utilisateur.

### Exercices

**Résolu — les 6 items Bloquants du 11/07 dans `data/history_ce2.json`, catégorie `ce2-personnages-celebres`** : la catégorie a été intégralement réécrite (20 items désormais). Vérification programmatique systématique (recherche de dates à 4 chiffres, siècles, périodes nommées) : Jeanne d'Arc, Louis XIV, Charlemagne, Vercingétorix et Christophe Colomb ne sont plus associés à aucune date ni période nommée dans les réponses ou explications. La seule date restante dans toute la catégorie est « 1889 » dans l'explication de Gustave Eiffel (« Sa tour de fer, montée en deux ans pour l'Exposition de 1889 ») — une date d'exposition universelle récente et concrète, différente en nature des dates de personnages médiévaux/antiques visées par le défaut initial ; non requalifiée en Bloquant.

**Résolu — le Bloquant de matching du 11/07** : `data/history_matching.json::matching_histoire_ce2` (9 items) a été entièrement récrit. Vérification ligne à ligne : aucune paire ne mentionne « Moyen Âge », « guerre de Cent Ans » ou de date à 4 chiffres. Ces éléments existent bien dans `history_matching.json`, mais exclusivement dans les catégories `matching_histoire_cm1` (« le Moyen Âge », « la Préhistoire », « l'Antiquité »…) et `matching_histoire_cm2` (« 1789 », « 1492 »…) — catégories dédiées au cycle 3, non référencées par le CE2. Aucune fuite croisée.

**Résolu — les 4 Majeurs du 11/07** (dates de Gutenberg, Montgolfier, Napoléon, répétition Jules Ferry) : plus aucune de ces dates n'apparaît dans `ce2-personnages-celebres` (« vers 1450 », « en 1783 », « empereur en 1804 » ont disparu des réponses/explications).

**Mineur — chevauchement de contenu, gravité atténuée depuis le 11/07** — `ce2-personnages-monuments` et `ce2-souvenirs-monuments` restent proches en thème (traces du passé, monuments, musées) mais les deux catégories ont des angles réellement différents à la relecture (rôle historique des monuments vs. traces/souvenirs familiaux et culturels) : chevauchement léger de conception, pas un doublon de contenu.
**Mineur — persistant** — `matching_histoire_ce2` (9 items) est réutilisé par 2 exercices à titres différents (`ce2-histoire-appariement` et `ce2-histoire-ecole-appariement`), confirmé par `build-content-index.js` (avertissement « pool-global »).

**Suggestion** — la leçon Jules Ferry pourrait enrichir l'exemple de la laïcité avec une situation concrète vécue par un élève (comme pour gratuite/obligatoire), même si l'explication actuelle est déjà correcte et non ambiguë.

**Points positifs** : les catégories `ce2-reperes` (10 items, repères temporels : passé/présent, siècle = 100 ans, frise, dates comme information factuelle) et `ce2-frise-vie-famille` (12 items) sont **exemplaires et conformes au programme cycle 2** — le siècle y est traité comme unité de mesure du temps (référentiel officiel), jamais comme prétexte à dater un personnage précisément ; `ce2-ecole-autrefois` (20 items, dont la date « vers 1880 » pour les lois de Jules Ferry, cohérente avec le sous-thème dédié à cet événement précis de la leçon associée) reste riche et vivante ; `ce2-personnages-monuments` (8 items) et `ce2-souvenirs-monuments` (8 items) sont désormais **0** incohérence `answer`/`choices`, sans dérive de dates ; **0** incohérence `answer`/`choices` sur l'ensemble des 88 items de `history_ce2.json` + `matching_histoire_ce2`.

**Résumé** : Bloquant 0, Majeur 0, Mineur 2, Suggestion 1 (8 leçons, 97 items audités)

---

## Géographie CE2

### Leçons

Aucune erreur factuelle bloquante sur les 9 leçons. Le Mineur du 11/07 sur le Rhin présenté comme un des « cinq grands fleuves » est **corrigé** : `ce2-lesson-france-releifs-fleuves` ne cite désormais que 4 grands fleuves français (Loire, Seine, Rhône, Garonne) et explique correctement que « le Rhin borde l'est de la France mais n'est pas un fleuve français : il se jette dans la mer du Nord, aux Pays-Bas » — le quiz associé teste précisément cette distinction avec une explication juste.

**Mineur — persistant, cosmétique uniquement** — coquille dans l'identifiant `ce2-lesson-france-releifs-fleuves` (« releifs » pour « reliefs ») ; sans impact utilisateur, id technique non affiché.

**Suggestion — atténuée depuis le 11/07** — la leçon mentionne désormais explicitement la notion de région (« La France est découpée en régions (par exemple la Bretagne ou la Nouvelle-Aquitaine) : chacune regroupe plusieurs départements »), ce qui aurait préparé un exercice de carte des régions si celui-ci était encore actif — mais `ce2_map_regions_france` est aujourd'hui une banque orpheline (voir plus bas), donc ce point de préparation n'a plus d'usage réel dans le parcours actuel.

### Exercices

**Majeur — réévalué à la baisse mais toujours réel** — la catégorie `ce2-cartes-symboles` (16 items, générique : légende, symboles, couleurs sur une carte) est réutilisée par l'exercice `ce2-geo-transports-cartes` (« Lire une carte », sous-thème Transports) sans qu'aucun item ne porte spécifiquement sur les réseaux de transport (gares, lignes, itinéraires) — le contenu réel de la catégorie est purement générique (légende, couleurs, symboles cartographiques standards), sans lien thématique avec les transports. Correction suggérée : soit renommer/recibler l'exercice, soit ajouter des items spécifiques aux réseaux de transport dans une sous-catégorie dédiée.

**Mineur — réévalué, moins technique qu'au 11/07** — l'item DROM de `ce2-france` (« Certains territoires français se trouvent... loin de la métropole, sur d'autres continents ou îles » → « La Guadeloupe, la Réunion ou la Guyane sont la France… à des milliers de kilomètres ! ») a été reformulé de façon plus accessible (le sigle « DROM » lui-même n'apparaît jamais, contrairement à ce que le 11/07 laissait entendre) ; reste une anticipation sur une notion institutionnelle non préparée par les leçons, mais la formulation concrète et imagée atténue la gravité par rapport à un vocabulaire technique brut.
**Mineur — persistant** — répétitions de questions sur le rôle de la légende dans 4 catégories du même sous-thème (`ce2-espaces`, `ce2-se-reperer`, `ce2-cartes-quartier`, `ce2-cartes-symboles` — cette dernière avec 4 occurrences à elle seule).

**Suggestion — carte des régions, gravité fortement réduite** — `data/board_map_locate_ce2.json::ce2_map_regions_france` (13 items couvrant l'intégralité des régions administratives françaises) existe toujours et constituait la fuite de programme géographique la plus large des trois audits précédents, mais elle est désormais **orpheline** : confirmé par grep systématique sur `data/ce2.json` (0 occurrence de `map-locate` ou de `board_map_locate_ce2.json`) et par `node scripts/validate-maps.js`, qui la classe explicitement comme banque non référencée. Aucun élève CE2 ne peut donc y accéder actuellement. Reste un point de nettoyage (fichier mort dans le bundle) plutôt qu'un défaut de contenu vécu — à trancher : suppression définitive, ou réactivation encadrée (2-3 régions avec une leçon dédiée) si une vague géographie CE2 est planifiée.

**Points positifs** : **0** incohérence `answer`/`choices` sur les 167 items de `geography_ce2.json` et les 9 items de `matching_geo_ce2` ; l'item de matching sur les échelles d'observation (« la région, un grand territoire regroupant plusieurs départements ») est correctement calibré et cohérent avec la leçon ; excellente qualité sur les notions de proximité (commune, quartier, services) et sur les symboles cartographiques génériques (16 items sans erreur).

**Résumé** : Bloquant 0, Majeur 1, Mineur 3, Suggestion 2 (9 leçons, 167 items audités)

---

## Sciences CE2

### Leçons

Aucune anomalie sur les 10 leçons ; bonne rigueur (la leçon sur les saisons évite explicitement la fausse croyance « distance Terre-Soleil », maintenue depuis le 11/07).

### Exercices

**Résolu — le Bloquant du 11/07 sur la contradiction renard omnivore/carnivore** : `data/science_matching.json::matching_sciences_ce2`, paire « le renard » → « prédateur » (reformulée, générique et correcte) ; l'exemple de carnivore strict de la même catégorie utilise désormais « le loup » → « il mange seulement de la viande », qui ne contredit plus l'explication de `science_ce2.json` (« Le renard est un omnivore qui chasse notamment le lapin pour se nourrir »). Les deux fichiers sont désormais cohérents entre eux.

**Mineur — résolus, vérifiés par relecture** — la catégorie `ce2-materiaux-usages` (8 items) est intégralement accentuée (vérification systématique : 0 occurrence de mot sans accent) ; la faute de genre « Une espace naturel » n'a pas été retrouvée dans le contenu actuel. Les deux Mineurs du 11/07 sont donc résolus.

**Suggestion** — la catégorie `ce2-vivant` continue de mélanger incidemment des questions sur le cycle de vie/la respiration sans former un sous-thème structuré « corps humain » — point déjà signalé par `curriculum-auditor` (couverture), mentionné ici pour mémoire mais hors du périmètre de cet audit qualité.

**Points positifs** : distinction changement d'état (fusion/solidification/évaporation/condensation) vs dissolution/mélange bien maintenue et enrichie ; chaînes alimentaires rigoureuses (« qui mange qui », herbivore/carnivore/décomposeur correctement définis dans `matching_sciences_ce2`) ; démarche expérimentale fidèle au programme (hypothèse, variable unique, reproductibilité, refus de truquer un résultat) ; **0** incohérence `answer`/`choices` sur les 157 items de `science_ce2.json`.

**Résumé** : Bloquant 0, Majeur 0, Mineur 1, Suggestion 1 (10 leçons, 157 items audités)

---

## EMC CE2

### Leçons

Aucune anomalie bloquante sur les 11 leçons. La Suggestion du 11/07 (leçon esprit critique sans distinction fait/opinion) est **résolue** : `ce2-lesson-esprit-critique` distingue désormais explicitement « un fait vérifiable » (« Il pleut aujourd'hui » — je peux regarder par la fenêtre) et « une opinion » (« Cette chanson est la meilleure » — un avis personnel, ni vrai ni faux), et les deux quiz de la leçon exercent précisément cette distinction.

### Exercices

**Résolu — le doublon du 11/07** : l'item « Un lieu partagé doit rester... » n'apparaît plus que dans `ce2-cooperation` ; `ce2-lieux-objets-communs` (16 items) a un contenu entièrement distinct (cour, matériel collectif, livres, bibliothèque, banc public, fontaine, parc — aucun chevauchement mot pour mot constaté).
**Résolu — le distracteur mal calibré du 11/07** : l'item sur le vote à égalité (« Si le vote finit à égalité, la classe peut... ») propose désormais « discuter encore puis revoter » comme réponse, et les distracteurs sont sains (« choisir les plus forts », « laisser le maître décider seul ») — l'ancien distracteur « annuler le projet » présenté comme faux n'existe plus.

**Mineur — persistant, gravité inchangée** — `ce2-parole-ecoute` (8 items) est réutilisé par 2 exercices dans des sous-thèmes différents (`ce2-emc-parole-ecoute` en Citoyen, `ce2-emc-parole-ecoute-responsable` en Responsabilité), confirmé par `build-content-index.js` (avertissement « pool-global »). De même, `matching_emc_ce2` (8 items) est réutilisé par `ce2-emc-appariement` et `ce2-emc-appariement-2` dans le même sous-thème.

**Suggestion** — les catégories `ce2-cooperation`/`ce2-lieux-objets-communs` restent thématiquement proches (vivre ensemble, respect du collectif) sans être des doublons ; un léger repositionnement des intitulés faciliterait la distinction pour un enfant qui enchaîne les deux exercices.

**Points positifs** : symboles de la République (14 items) tous factuellement exacts (drapeau, devise, hymne, Marianne, laïcité, étymologie de « République », 14 juillet 1789 correctement contextualisé comme fête nationale plutôt que comme repère de cycle 3 isolé) ; esprit critique traité avec justesse et nuance renforcée depuis le 11/07 ; catégorie `ce2-parole-ecoute` intégralement bien accentuée (vérification item par item) ; **0** incohérence `answer`/`choices` sur les 133 items de `emc_ce2.json` + 24 items de `matching_emc_ce2`.

**Résumé** : Bloquant 0, Majeur 0, Mineur 2, Suggestion 1 (11 leçons, 157 items audités)

---

## Récapitulatif des actions suggérées (indicatif — aucune exécution dans cette phase)

### Priorité 1 — Bloquants (2)
1. **Mathématiques** — retirer (ou déplacer hors de la banque référencée par un exercice de maths) les items « Retrouve chaque mot et son synonyme » et surtout « Retrouve chaque période historique et son repère » (Moyen Âge, Temps modernes/1500) de `data/board_memory_match_ce2.json::ce2_memory_match`, référencée par `ce2-maths-memoire`. C'est la seule fuite de programme cycle 3 encore accessible à un élève CE2 à ce jour.
2. **Français** — corriger la paire « biche » → « mots-repères : bicyclette - bouton » dans `data/french/matching.json::matching_dictionnaire_ce2` (erreur factuelle : « biche » précède alphabétiquement « bicyclette »).

### Priorité 2 — Majeurs (2)
- **Mathématiques** — dédoublonner ou redifférencier `ce2-comp-1000`/`ce2-comp-2000` (contrat identique confirmé par le validateur).
- **Géographie** — recibler ou renommer `ce2-geo-transports-cartes`, qui réutilise la catégorie générique `ce2-cartes-symboles` sans contenu spécifique aux réseaux de transport.

### Priorité 3 — Mineurs et suggestions (21)
Voir détail par matière ci-dessus (doublons de pool matching/parole-écoute EMC et Histoire, chevauchements de catégories, coquille d'id géographie, item DROM à surveiller, répétitions de questions sur la légende).

## Renvois à `curriculum-auditor` (manques ou anticipations de couverture entrevus, hors périmètre de cet audit)

- **Carte des régions orpheline** (`data/board_map_locate_ce2.json`) — à trancher : suppression définitive du fichier mort, ou réactivation encadrée (2-3 régions + leçon dédiée) si une vague géographie CE2 est planifiée. Déjà signalé par `curriculum-audit-ce2.md` comme enrichissement optionnel.
- **Classification du vivant et corps humain (sous-thème structuré)** en Sciences — déjà identifié par `curriculum-audit-ce2.md` comme manque de couverture ; l'audit qualité confirme que `ce2-vivant` reste une catégorie mixte sans sous-thème dédié.
- **BOM UTF-8 sur 11 fichiers** (liste complète ci-dessus, plus large que les 4 signalés par `curriculum-audit-ce2.md`) — point de vigilance transverse à traiter par un script de réparation d'encodage existant (`repair-json-encoding.ps1`).

## Vérification

Relecture prioritaire recommandée du Bloquant Mathématiques (`ce2_memory_match`) — c'est un défaut inédit, non couvert par l'audit du 11/07, qui montre qu'une fuite de programme peut se loger dans une banque d'apparence anodine (jeu de mémoire) et mal classée disciplinairement plutôt que dans les banques QCM habituellement examinées. La correction consiste en un simple retrait/déplacement d'items, sans refonte. Le reste du niveau CE2 est en net progrès par rapport au 11/07 : la fuite de programme Histoire la plus sévère des trois audits précédents (CP/CE1/CE2) est corrigée à plus de 95 %, et la quasi-totalité des Bloquants/Majeurs de juillet sont résolus. La phase de correction reste **distincte de cet audit** : aucune modification n'a été appliquée au contenu, au code ou aux banques ici.

# Audit qualité de contenu — CE1

> Audit indépendant de la qualité intrinsèque de chaque leçon et exercice du niveau CE1 (exactitude factuelle, clarté pédagogique, adéquation au niveau, cohérence technique), distinct de [`curriculum-audit-ce1.md`](curriculum-audit-ce1.md) qui évalue la couverture du programme. Réalisé le **2026-07-29** par lecture intégrale (sans échantillonnage) de `data/ce1.json` et de **toutes** les banques externes référencées par le niveau, matière par matière — même méthode que [`content-quality-audit-cp.md`](content-quality-audit-cp.md).
>
> Banques externes auditées intégralement : `board_memory_match_ce1.json` (catégorie `ce1_memory_match_maths`), `board_tap_features_science.json` (catégorie `ce1_tap_plante`), `emc_ce1.json`, `emc_matching.json` (catégorie `matching_emc_ce1`), `french/matching.json` (catégories `matching_synonymes_ce1`, `matching_alphabet_ce1`), `french/grammar.json` (catégories `gender_ce1_*`, `grammar_*_ce1`, `copie_guidee_ce1`), `french/spelling.json`, `french/homophones.json`, `french/conjugation.json`, `french/reading.json` (catégories `ce1_*`), `french_word_order.json` (catégories `*_ce1`), `geography_ce1.json`, `geography_matching.json` (catégorie `matching_geo_ce1`), `history_ce1.json`, `history_matching.json` (catégorie `matching_histoire_ce1`), `math_geometry_ce1.json`, `math_matching.json` (catégorie `matching_math_ce1`), `math_word_problems_cycle2.json` (catégories `ce1-*`), `science_ce1.json`, `science_matching.json` (catégorie `matching_sciences_ce1`). Fichiers orphelins `french_ce1_reading.json`/`french_ce1_comprehension.json` également lus intégralement pour vérifier leur statut (voir note liminaire).
>
> Sources faisant autorité : BO n°31 du 30/07/2020 (programme cycle 2), `PROGRAMME_SCOLAIRE_REFERENCE.md` (référentiel interne dérivé du BO, section CE1), dictionnaire/Bescherelle, IGN/Insee.
>
> **Aucune correction n'a été appliquée dans cette phase.** Ce document liste les problèmes trouvés ; la correction fait l'objet d'une phase séparée (souvent confiée ensuite à `exercise-author` ou à une intervention manuelle).
>
> **Mise à jour du 2026-07-29 (postérieure à cet audit) : les 3 Majeurs corrigés.** Une vague de production a traité l'intégralité des 3 Majeurs listés dans la synthèse ci-dessous : l'élision fautive de `grammar_det_nom_ce1` (« La image » reformulé avec un nom à initiale consonantique), le doublon `ce1-lieux-publics`/`ce1-services-quartier` (item distinct en Géographie) et le chevauchement ovipare/vivipare/métamorphose (3 items déplacés de `ce1-vivant` vers `ce1-cycle-vie-simple`). Les Mineurs et Suggestions restent en l'état ; ce paragraphe signale l'action menée, il ne remplace pas un réaudit complet.

## Note liminaire : cet audit remplace intégralement celui du 11/07/2026, réputé périmé

Le contenu CE1 a été substantiellement retravaillé depuis l'audit du 11/07/2026 (ajout d'un quiz d'ancrage sur toutes les leçons, retouche des distracteurs de quiz, corrections ponctuelles). Cet audit **ne recopie aucune conclusion de l'ancien document** : chaque point a été revérifié par lecture directe du JSON actuel. Bilan de cette revérification :

**Les 3 Bloquants du 11/07 sont tous corrigés :**
- L'exercice d'appariement Histoire (`matching_histoire_ce1`) ne contient plus de paires à cible dupliquée — le contenu a été entièrement réécrit, chaque paire a désormais une valeur cible unique.
- L'item Sciences « Un être vivant naît, grandit et... se reproduit » est reformulé : la réponse est maintenant « **peut** se reproduire », avec explication qui reprend la nuance. La généralisation fausse est corrigée.
- La catégorie EMC `ce1-dialogue-politesse` est intégralement réaccentuée (« s'il te plaît », « de la colère », etc. — plus aucun mot sans accent).

**Sur les 14 Majeurs du 11/07 : la moitié est corrigée, l'autre moitié persiste ou a une gravité réévaluée** (détail matière par matière ci-dessous) :
- Corrigés : tables 6/7 désormais explicitement marquées `isBonus` (anticipation assumée) ; bug `table: 10` au lieu de `"mix"` corrigé ; pool `ce1_memory_match_maths` désormais 100 % mathématique et dédié ; doublon de bornes `ce1-additions-100`/`ce1-bonus-additions-100` corrigé (150 au lieu de 100 pour le bonus) ; les 4 fautes d'accent groupées en Géographie (`ce1-lieux-publics`) sont corrigées ; item du glaçon déplacé de `ce1-melanges-simples` vers `ce1-etats-eau` (classement désormais correct) ; les 7 fautes d'élision du contenu Français (« Que attrape... ») sont corrigées **dans le fichier réellement servi** `data/french/reading.json`.
- Toujours présents : le doublon de contenu entre `ce1-lieux-publics`/`ce1-services-quartier` (Géographie) ; le chevauchement thématique ovipare/vivipare/métamorphose classé dans `ce1-vivant` plutôt que `ce1-cycle-vie-simple` (Sciences).
- Réévalué à la baisse : la fuite de niveau « carte des régions » a **disparu** — le CE1 ne référence plus aucun exercice `map-locate` (`board_map_locate_ce1.json` n'est même plus dans l'index de contenu). La généralisation « une rue fait partie surtout de la ville » n'a pas été retrouvée dans le contenu actuel de `ce1-lieux-publics` (probablement déjà corrigée avant le 11/07 ou reformulée depuis).
- **Nouveau point de vigilance non présent dans l'audit précédent** : `matching_histoire_ce1` (contenu réécrit) associe désormais des monuments nationaux à des noms de villes/régions précis (Paris, Normandie, Arles, Gard) — voir Histoire ci-dessous.

**Sur le bug de branchement Français (point le plus important du 11/07)** : la situation a **changé de nature**, sans être un vrai bug applicatif résiduel. `js/app.js::loadFrenchLibrary()` (lignes 280-297) ne charge toujours que `data/french/*.json` et ne référence toujours pas `data/french_ce1_reading.json`/`data/french_ce1_comprehension.json` — **le code est inchangé**. Mais entre-temps, le contenu riche de ces deux fichiers orphelins (101, 108, 100, 100, 100, 10 items selon catégorie) a été **recopié et corrigé directement dans `data/french/reading.json`**, qui est le fichier réellement chargé. Vérification ligne à ligne : les deux versions ne sont plus identiques — le fichier servi contient la version corrigée (« Qu'écrit la maîtresse ? ») alors que les fichiers orphelins gardent la faute d'origine (« Que écrit la maîtresse ? »). **Conclusion : les 11 exercices `reading` du CE1 utilisent bien le contenu riche et corrigé.** Le bug de branchement au sens strict (fichiers jamais chargés) est toujours vrai en tant que fait de code, mais n'a plus d'impact pédagogique — c'est désormais une dette technique résiduelle (deux fichiers `data/*.json` morts, jamais lus, contenant une version obsolète et fautive) plutôt qu'un défaut de contenu vécu par l'élève. Reclassé en Mineur (nettoyage de code mort), alors que c'était le point Majeur n°1 du 11/07.

## Synthèse générale

| Sévérité | Maths | Français | Histoire | Géographie | Sciences | EMC | Total |
|---|---|---|---|---|---|---|---|
| Bloquant | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| Majeur | 0 | 1 | 0 | 1 | 1 | 0 | **3** |
| Mineur | 3 | 4 | 3 | 4 | 4 | 3 | **21** |
| Suggestion | 2 | 2 | 1 | 2 | 1 | 1 | **9** |

Environ **64 leçons** (13 Maths, 17 Français, 8 Histoire, 7 Géographie, 13 Sciences, 6 EMC — toutes équipées d'un quiz d'ancrage jouable, confirmé par `check-lesson-quiz.js`) et **~1 700 items** de banque audités au total sur les 6 matières (voir détail par matière).

**Anomalie transverse la plus significative — qualité des distracteurs des QCM `factual-qcm` (règle R4).** Comme au CP, la règle R4 (« la bonne réponse ne doit pas être repérable comme la plus longue ») a été rendue effective pour les quiz d'ancrage des **leçons** mais n'a pas été systématiquement appliquée aux banques `factual-qcm` externes. Un balayage programmatique trouve environ **87 items** (20 en Géographie, 47 en Sciences, une vingtaine en Histoire/EMC) où la bonne réponse dépasse d'au moins 8 caractères tous ses distracteurs — un enfant peut choisir la bonne réponse sans la lire ni la comprendre. Répété par matière ci-dessous, mais compté une seule fois dans le total transverse (classé Mineur, comme au CP).

**Anomalie transverse technique — BOM UTF-8.** Sept banques CE1 commencent par un BOM UTF-8 : `french_word_order.json`, `geography_matching.json`, `history_ce1.json`, `history_matching.json`, `math_geometry_ce1.json`, `math_matching.json`, `science_ce1.json`, `science_matching.json`, `french/conjugation.json`, `french/homophones.json` (10 fichiers au total, liste précise ci-dessous). Sans impact fonctionnel constaté (le navigateur/`fetch` tolère le BOM), mais un `JSON.parse` strict côté outillage peut échouer dessus. Point de vigilance récurrent du projet, légèrement différent de la liste du 11/07 (`geography_ce1.json` n'a plus de BOM, mais `french/conjugation.json`, `french/homophones.json` et `geography_matching.json` en ont).

**Aucun mojibake, apostrophe dégradée ni `\uXXXX` inutile** détecté dans le texte visible de l'ensemble des banques CE1 auditées (vérification programmatique par recherche de séquences typiques `Ã©`, `â€™`, `�`, `\\uXXXX` — 0 occurrence sur les 21 fichiers).

**Résultat des validateurs (lancés en filet, jamais en substitut à la lecture) :**
- `powershell scripts/validate-data.ps1` → **DATA_VALIDATION_OK**, 94 fichiers vérifiés, 554 références d'exercices contrôlées.
- `node scripts/build-content-index.js --check` → **CONTENT_INDEX_CHECK_OK**, 965 exercices, 348 leçons, 74 banques, aucun doublon d'`id`. Les avertissements « contrat-identique » (475, tous niveaux confondus) sont des doublons « mous » légitimes déjà recensés par l'utilisateur — ignorés dans cet audit.
- `node scripts/check-lesson-quiz.js` → **LESSON_QUIZ_OK**, 348/348 leçons équipées (100 %) tous niveaux, dont les 64 leçons CE1 (0 sans quiz, 0 bloc `check` avec `id`). Un seul avertissement R4 résiduel sur `ce1-lesson-hier-aujourdhui-demain` (réponse 24 car. contre 17 pour le distracteur le plus long).
- `node scripts/validate-subjects.js` → **OK**, toutes les matières des 5 niveaux (dont CE1) canonicalisables par `Storage.canonicalizeSubjectId`.
- `node scripts/validate-maps.js` : non applicable au CE1 — le niveau ne référence plus aucun exercice `map-locate` (confirmé par grep sur `data/ce1.json` : 0 occurrence de `map-locate` ou de `board_map_locate_ce1.json`).
- Vérification programmatique complémentaire sur l'ensemble des banques `factual-qcm`/`choice-engine`/`grammar-cloze` référencées : **0** `answer` absente de `choices`, **0** choix dupliqué au sein d'un item, sur 646+100 items contrôlés.

---

## Mathématiques CE1

### Leçons

Les 13 leçons sont conformes au programme (multiplication, compléments, doubles/moitiés, addition/soustraction, figures planes/solides, mesures, repérage journée, heure, masses/contenances, problèmes) et toutes équipées d'un quiz d'ancrage jouable. Les points de l'audit du 11/07 sur `ce1-lesson-formes-planes` (solides non couverts) et `ce1-lesson-lire-heure` (ordre grande/petite aiguille) ont été revérifiés : la leçon des formes mentionne désormais explicitement « cube, pavé, cylindre, cône, sphère » en plus des figures planes, et la leçon de l'heure introduit la grande aiguille avant la petite dans le paragraphe d'ouverture — plus d'anomalie constatée sur ces deux points.

**Suggestion — chevauchement de contenu persistant** — `ce1-lesson-tables-astuces` et `ce1-lesson-multiplication-bases` (sous-thème `ce1-multiplication`) restent proches en thème (mémorisation des tables) mais couvrent des angles différents (comprendre le principe vs astuces de calcul) : chevauchement léger, pas un doublon.

**Mineur — solide « pyramide » introduit en exercice sans leçon dédiée** — `data/math_geometry_ce1.json`, cat. `ce1-formes-solides-planes` — deux items portent sur la pyramide (« faces latérales... triangles », comparaison avec le cube) alors qu'aucune leçon CE1 ne mentionne ce solide (la leçon `ce1-lesson-formes-planes` cite cube/pavé/cylindre/cône/sphère, pas la pyramide). Correction suggérée : ajouter la pyramide à la liste des solides de la leçon, ou retirer les 2 items.

**Mineur — introduction du kilomètre en anticipation de programme** — `data/math_geometry_ce1.json`, cat. `ce1-longueurs-mesures` (3 items sur 16) — le référentiel programme (`PROGRAMME_SCOLAIRE_REFERENCE.md`, section CE1) limite les longueurs CE1 à « mesurer avec une règle (cm), comparer des longueurs » ; les conversions mm/cm/m/**km** sont explicitement au programme CE2. Les items sont contextualisés (« distance entre deux villes », « 1 km = 1000 m ») et pédagogiquement corrects, mais anticipent une notion de cycle. Gravité faible (extension raisonnable, pas une notion technique de conversion tabulée). Correction suggérée : renvoyer à `curriculum-auditor` pour arbitrage (anticipation assumée ou à déplacer en CE2).

**Mineur — quasi-doublon dans une banque de matching** — `data/french_word_order.json` n'est pas concerné ici, mais `data/french/grammar.json::grammar_plural_ce1` (référencé par l'exercice de pluriel `ce1-gram-pluriel`) contient deux items sur la même phrase « Une fleur, des ___. » (positions 2 et 9) avec des jeux de distracteurs légèrement différents (`fleur/fleurs/fleurss` vs `fleur/fleurs/fleures`) — redondance qui réduit la variété perçue lors d'un tirage. Le doublon `["chien","chiens","chiens"]` signalé au 11/07 est corrigé (`["chien","chiens","chienne"]` désormais).

**Points positifs** : aucune erreur de calcul détectée sur l'ensemble des 30 items de `math_word_problems_cycle2.json` (catégories `ce1-problemes-additifs`/`ce1-problemes-mixtes`) ni sur les 64 items de `math_geometry_ce1.json` ; le bug `ce1-bonus-mult-melange` (`table: 10` au lieu de `"mix"`) est corrigé ; le doublon de bornes `ce1-additions-100`/`ce1-bonus-additions-100` est corrigé (100 vs 150 désormais) ; `ce1_memory_match_maths` est une sous-banque 100 % mathématique correctement isolée (4 items) ; `matching_math_ce1` (10 items, réutilisé par 2 exercices Maths distincts mais tous les deux 100 % mathématiques : plus de mélange disciplinaire constaté) ; courbe de difficulté des additions/soustractions monotone (20 → 50 → 100 → 150, bonus placé au-dessus des exercices standards) ; les tables 6/7 sont désormais explicitement marquées `isBonus: true` avec sous-titre « Défi : un peu d'avance » (anticipation assumée plutôt que non signalée).

**Résumé** : Bloquant 0, Majeur 0, Mineur 3, Suggestion 2 (13 leçons, 39 exercices, ~114 items de banque externe)

---

## Français CE1

### Bug de branchement Français (point prioritaire de l'audit 11/07) — requalifié

Voir la note liminaire pour le détail complet. En résumé : `js/app.js::loadFrenchLibrary()` (lignes 280-297) ne charge toujours pas `data/french_ce1_reading.json`/`data/french_ce1_comprehension.json` (le code est inchangé depuis le 11/07), mais leur contenu — corrigé des 7 fautes d'élision signalées alors — a été fusionné dans `data/french/reading.json`, qui lui est bien chargé. Les 11 exercices `reading` du CE1 (`ce1-lecture-phrases`, `ce1-lecture-comprendre`, `ce1-lecture-comprehension-courte`, `ce1-lecture-inference-simple`, `ce1-lecture-mot-contexte`, `ce1-lecture-ordre-evenements`, `ce1-lecture-texte-ecole`, `ce1-lecture-texte-nature`, `ce1-vocab-synonymes`, `ce1-vocab-familles`, `ce1-vocab-antonymes` + bonus) disposent donc chacun de 6 à 108 items selon catégorie — richesse largement supérieure aux 10-20 items rapportés le 11/07.

**Mineur — fichiers de code mort à nettoyer** — `data/french_ce1_reading.json` (529 items, 5 catégories) et `data/french_ce1_comprehension.json` (10 items) ne sont référencés par aucun chemin de code (confirmé par lecture de `js/app.js`), contiennent une version **obsolète et fautive** du contenu (ex. « Que écrit la maîtresse ? » au lieu de « Qu'écrit la maîtresse ? »), et restent pourtant embarqués dans `js/data-bundle.js`. Aucun risque pour l'utilisateur (jamais lus au runtime), mais source de confusion pour un futur mainteneur qui pourrait croire ce fichier actif. Correction suggérée : supprimer ces deux fichiers (et leur retrait du bundle) une fois confirmé qu'aucune reprise n'est prévue, ou documenter explicitement leur statut de sauvegarde historique.

### Leçons

Les 17 leçons sont conformes (sons complexes, homophones fréquents, déterminants, nature/fonction, types de phrases, être/avoir, verbes -er, vocabulaire, ordre alphabétique) et toutes équipées d'un quiz jouable. L'apostrophe non typographique signalée au 11/07 dans `ce1-lesson-mots-frequents` (« qu on lit », « c est ») n'a pas été retrouvée dans le texte actuel (« tout ce qu'on lit » est correctement apostrophé) — corrigé ou faux positif d'origine.

**Suggestion — verbe « range » très répété dans une banque d'ordre des mots** — `data/french_word_order.json`, cat. `word_order_ce1` (106 items, exercice `ce1-francais-ordre-mots`) — le verbe « range » apparaît dans 13 items sur 106 (~12 %), avec un schéma syntaxique quasi identique (« [Prénom] range [complément] »). Variété lexicale réduite lors d'un tirage successif. Correction suggérée : diversifier les verbes comme au CP (déjà signalé pour « fermer »/« porte »).

### Exercices

**Majeur — élision fautive enseignée activement dans une banque de grammaire** — `data/french/grammar.json`, cat. `grammar_det_nom_ce1` (exercice `ce1-gram-accord-det-nom`), item « ___ image est affichée au tableau. » avec `choices: ["Le","La","Les"]` et `answer: "La"` — le rendu littéral donne « **La** image est affichée au tableau », qui est une faute de français (l'élision devant voyelle impose « L'image »). Le moteur `grammarCloze` (`js/engines-french.js`) affiche la phrase telle quelle avec la réponse choisie insérée dans le trou, sans gestion de l'élision : contrairement à l'exercice `gender-articles` (qui gère « l' » automatiquement), ce type d'exercice cloze n'a pas cette logique. L'item « ___ images sont affichées au tableau. » (pluriel, `answer: "Les"`) est en revanche correct puisque « les » ne s'élide jamais. Correction suggérée : retirer cet item singulier du vivier, ou le reformuler avec un nom à initiale consonantique.

**Mineur — 20 items où la réponse est repérable par sa longueur (règle R4)** — voir anomalie transverse en tête de document ; concentré sur les catégories `factual-qcm` externes, pas sur les quiz de leçon.

**Mineur — nuance sémantique dans une paire de synonymes** — `data/french/matching.json`, cat. `matching_synonymes_ce1` — la paire « écouter » / « entendre » est présentée comme synonyme alors que la nuance (écouter = volontaire, entendre = involontaire) est déjà l'objet d'un point de vigilance pédagogique classique ; à ce niveau, tolérable mais mérite d'être noté. La paire « manger »/« déguster » signalée au 11/07 n'apparaît plus dans le contenu actuel.

**Mineur — banque `ce1_memory_match` orpheline** — `data/board_memory_match_ce1.json`, cat. `ce1_memory_match` (générique, potentiellement mixte) n'est référencée par aucun exercice de `data/ce1.json` (seule `ce1_memory_match_maths` l'est) : vestige non problématique en soi, mais à nettoyer ou à documenter comme banque de réserve.

**Points positifs** : homophones fréquents (a/à, et/est, son/sont, on/ont, ou/où) exemplaires sur les 90 items vérifiés ; conjugaison irréprochable (formes -ger/-cer correctes : « nous mangeons », « nous lançons » avec cédille ; verbe « aller » correctement irrégulier : vais/vas/va/allons/allez/vont) ; dictées de mots (`animals`, `corps`, `school`, `house`, `food`, `transport`, `vêtements` — désormais 13 items, contre 9 au 11/07) sans faute d'orthographe ; mot isolé « PARCE » du 11/07 disparu des mots-outils ; `french_word_order.json` très soigné sur 126 items CE1 (word/alpha/story order) sans erreur factuelle ; accords déterminant-nom et adjectival exacts sur `grammar_agreement_ce1`/`grammar_det_nom_ce1` (hormis l'item signalé ci-dessus) ; types de phrases (déclarative/interrogative/exclamative) irréprochables sur `grammar_phrase_types_ce1`.

**Résumé** : Bloquant 0, Majeur 1, Mineur 4, Suggestion 2 (17 leçons, ~1 060 items de banque audités, fichiers orphelins inclus)

---

## Histoire CE1

### Leçons

Aucun défaut Bloquant ou Majeur sur les 8 leçons ; **aucune fuite de programme cycle 3** détectée (pas de Préhistoire, pas de Moyen Âge daté, pas de rois/reines nommés) — confirmé conforme à l'audit du 11/07.

**Suggestion — notion de « période » un peu abstraite** — leçon `ce1-lesson-frise-temps` — persistant depuis le 11/07 : la distinction point/zone sur une frise reste un concept avancé pour du CE1, bien qu'expliquée avec un exemple concret (« quand tu étais bébé »).

### Exercices

**Mineur — noms de villes et régions précis dans un exercice d'appariement (nouveau point, contenu réécrit depuis le 11/07)** — `data/history_matching.json`, cat. `matching_histoire_ce1` (exercice `ce1-histoire-appariement`), item « Relie chaque monument à la ville où il se trouve » : tour Eiffel → Paris, Mont-Saint-Michel → « en Normandie », arènes → « à Arles », pont du Gard → « dans le Gard ». Le programme CE1 (« Découvrir quelques personnages et monuments importants de l'histoire locale/nationale ») légitime la présence de monuments nationaux connus, mais la précision géographique par région/ville nommée (Normandie, Gard) dépasse le cadre « espace proche » attendu en géographie CE1 et anticipe une échelle de lecture plus fine que le niveau. Gravité plus faible que la fuite « carte des régions » du 11/07 (pas de carte à localiser, simple appariement culturel), mais même famille de dérive. Correction suggérée : remplacer les valeurs cibles par des descriptions sans nom de région (« un monument préhistorique », « des arènes romaines »…) ou renvoyer à `curriculum-auditor` pour trancher.

**Mineur — quasi-doublon systématique entre deux catégories** — `data/history_ce1.json`, cat. `ce1-souvenirs-famille` et `ce1-memoire-famille` (exposées par deux exercices distincts, `ce1-histoire-souvenirs-famille` et `ce1-histoire-memoire-famille`) — les 8 questions de chaque catégorie sont thématiquement identiques une à une (photo de famille ancienne, album, comparaison de photos, souvenir, photos d'enfance, conservation, objet transmis, connaissance du passé), seule la formulation change. Un élève qui enchaîne les deux exercices voit essentiellement le même contenu deux fois. Persistant depuis le 11/07 (l'ancien audit notait déjà la quasi-identité, cette relecture confirme qu'elle porte sur l'intégralité des 8 items, pas seulement une partie). Correction suggérée : fusionner les deux catégories ou différencier réellement leur angle.

**Mineur — chevauchement thématique entre 3 catégories du même sous-thème** — `ce1-vie-autrefois`/`ce1-ecole-autrefois`/`ce1-objets-passe` continuent de couvrir des thèmes très proches (vie quotidienne d'autrefois, école d'autrefois, objets anciens) avec des questions reformulées mais non dupliquées mot pour mot. Choix de conception plus qu'un bug, comme noté au 11/07.

**Points positifs** : le Bloquant du 11/07 (paires à cible dupliquée dans `matching_histoire_ce1`) est intégralement corrigé — les 8 items de la banque ont chacun 4 paires à valeurs cibles uniques ; les 4 titres/sous-titres sans accents signalés au 11/07 (« L'ecole autrefois », « Reconnaitre et dater... », « Defi : monuments et personnages ») sont tous corrigés dans `data/ce1.json` ; la catégorie `ce1-souvenirs-famille`, précédemment signalée systématiquement sans accents, est désormais intégralement bien accentuée ; **0** incohérence `answer`/`choices` sur les 108 items de `history_ce1.json` + `matching_histoire_ce1` ; bons exemples concrets conservés (blouse/ardoise/plume, fer à repasser en fonte, poêle à bois).

**Résumé** : Bloquant 0, Majeur 0, Mineur 3, Suggestion 1 (8 leçons, 108 items audités)

---

## Géographie CE1

### Leçons

Aucune erreur factuelle bloquante sur les 7 leçons.

**Suggestion — mention de villes précises** — leçon `ce1-lesson-transports-france` cite toujours « Lyon-Paris » comme exemple de trajet TGV ; gravité faible et inchangée depuis le 11/07 (reste en marge, dans un exemple, pas dans la notion enseignée).

### Exercices

**Majeur — doublon de contenu persistant entre deux catégories** — `data/geography_ce1.json`, cat. `ce1-lieux-publics` et `ce1-services-quartier` (même sous-thème `ce1-geo-reperage-subtheme`) — l'item « Des lieux publics différents [servent à / permettent] ... → des besoins différents » est quasiment identique dans les deux catégories (même trio de choix, formulation à peine modifiée). Persistant depuis le 11/07, bien que les 4 fautes d'accent groupées alors signalées dans `ce1-lieux-publics` (« la foret », « de geometrie », « un thermometre », « la meme seule action ») soient toutes corrigées. Correction suggérée : dédoublonner ou spécialiser chaque vivier.

**Mineur — nouvelle faute d'homophone (« ou » / « où »)** — `data/geography_ce1.json`, cat. `ce1-lieux-publics`, item « Le parc est un lieu **ou** l'on peut... → se promener » — devrait être « **où** l'on peut » (pronom relatif de lieu, accent grave), pas « ou » (conjonction). Faute d'autant plus notable que le CE1 enseigne explicitement cette distinction (exercice `ce1-homo-ouou` sur `ou_où`). Correction suggérée : ajouter l'accent grave.

**Mineur — 20 items où la réponse est repérable par sa longueur (règle R4)** — voir anomalie transverse en tête de document ; réparti sur `ce1-reperage`, `ce1-transports-france`, `ce1-plan-quartier`, `ce1-legende-simple`, `ce1-trajets-quotidiens`, `ce1-lieux-publics`, `ce1-services-quartier`, `ce1-mer-montagne`, `ce1-village-ville`.

**Mineur — paire de matching formellement incohérente** — `data/geography_matching.json`, cat. `matching_geo_ce1`, item « Relie chaque trajet quotidien à son point d'arrivée » : la paire « aller à la bibliothèque » → « les livres » n'est pas un point d'arrivée au sens des 3 autres paires du même item (qui sont toutes des lieux : salle de classe, magasin, cabinet médical). Incohérence de cohérence formelle plus que factuelle. Correction suggérée : remplacer « les livres » par « la bibliothèque » ou « la salle de lecture ».

**Points positifs** : **fuite de niveau « carte des régions » entièrement résorbée** — `data/ce1.json` ne référence plus aucun exercice `map-locate`, confirmé par grep systématique (0 occurrence) ; l'ancienne banque `board_map_locate_ce1.json::ce1_map_regions_france` n'apparaît plus dans `CONTENT_INDEX.json` pour le CE1. La généralisation « une rue fait partie surtout de la ville » signalée au 11/07 n'a pas été retrouvée dans le contenu actuel (corrigée ou déjà absente). **0** incohérence `answer`/`choices` sur 120 items de `geography_ce1.json` + 9 items de `matching_geo_ce1` ; vocabulaire « torrent »/« alpages » toujours présent mais chaque fois expliqué immédiatement dans l'explication (« les alpages, les prairies d'altitude ») — résoluble sans prérequis, gravité faible.

**Résumé** : Bloquant 0, Majeur 1, Mineur 4, Suggestion 2 (7 leçons, 129 items audités)

---

## Sciences CE1

### Leçons

Les 13 leçons sont conformes. Le bullet incomplet du 11/07 (« Les plantes fabriquent leur nourriture grâce à la lumière » sans eau/air) est corrigé : la leçon `ce1-lesson-vivant-besoins` mentionne désormais « la lumière, l'eau et l'air ». Les leçons `ce1-lesson-prendre-soin-corps` et `ce1-lesson-cinq-sens` n'ont toujours pas de `label` explicite « Je retiens » sur leur bloc bullets (rupture de cohérence mineure et cosmétique avec les autres leçons, mais gravité négligeable — non recompté en Mineur distinct cette fois car sans impact pédagogique constaté).

**Suggestion — aucune leçon dédiée au cycle de vie complet** — persistant depuis le 11/07 : la notion est bien exercée (`ce1-cycle-vie-simple`, 11 items) mais pas introduite par une leçon spécifique ; la leçon `ce1-lesson-cycle-vie` existe et couvre naître/grandir/vieillir, ce qui atténue partiellement ce point par rapport au 11/07.

### Exercices

**Majeur — chevauchement thématique persistant : ovipare/vivipare/métamorphose classés hors de leur catégorie logique** — `data/science_ce1.json`, cat. `ce1-vivant` — les items sur les animaux ovipares/vivipares (« pond des œufs », « donne naissance à des petits déjà formés ») et la métamorphose (têtard → grenouille) restent classés dans `ce1-vivant` plutôt que dans `ce1-cycle-vie-simple`, dont le nom et le contenu (naître/grandir/devenir adulte/vieillir) suggèrent justement d'y accueillir ces notions de reproduction et de développement. Persistant tel quel depuis le 11/07. Correction suggérée : déplacer ces items vers `ce1-cycle-vie-simple`, ou renommer `ce1-vivant` pour clarifier son périmètre (caractéristiques du vivant vs étapes de vie).

**Mineur — incohérence résiduelle d'une explication non nuancée** — `data/science_ce1.json`, cat. `ce1-vivant`, dernier item (« Trier des images entre "vivant" et "non vivant"... ») — l'`explanation` reprend la formule non nuancée « Naît, grandit, se nourrit, se reproduit : voilà les critères... » (sans « peut »), alors que le premier item de la même catégorie a corrigé sa réponse en « peut se reproduire » pour éviter la généralisation fausse (un individu stérile ou âgé reste vivant sans se reproduire). Incohérence interne mineure entre deux items du même pool, gravité très inférieure au Bloquant du 11/07 (qui portait sur la `answer` elle-même, désormais nuancée).

**Mineur — 47 items où la réponse est repérable par sa longueur (règle R4)** — voir anomalie transverse en tête de document ; le plus grand contingent de tout le niveau, réparti sur `ce1-vivant`, `ce1-matiere`, `ce1-corps-hygiene`, `ce1-besoins-vivant`, `ce1-etats-eau`, `ce1-sommeil-alimentation`, `ce1-hygiene-quotidienne`, `ce1-objets-maison`, `ce1-cycle-vie-simple`, `ce1-melanges-simples`, `ce1-saisons-meteo`, `ce1-milieux-vie`.

**Mineur — doublon de question à réponses différentes** — `data/science_ce1.json`, cat. `ce1-cycle-vie-simple` — la question « À la fin de sa vie, un être vivant... » apparaît deux fois (réponses « vieillit » et « meurt », toutes deux correctes séparément mais redondantes si tirées dans la même session).

**Points positifs** : le Bloquant du 11/07 (« un être vivant... se reproduit » présenté comme étape obligatoire) est **corrigé** — la réponse est désormais « peut se reproduire », avec explication nuancée en cohérence ; l'item du glaçon (fusion thermique), précédemment mal classé dans `ce1-melanges-simples`, est désormais correctement rangé dans `ce1-etats-eau` ; la catégorie `ce1-melanges-simples` reste scientifiquement rigoureuse (dissolution homogène/mélange hétérogène/non-miscibilité de l'huile bien distingués, vocabulaire exact) et ne contient plus l'intrus thermique ; toutes les fautes d'accent groupées du 11/07 (« metal », « disparait », « thermometre », « recipient », « carree », « medecin », « gele ») sont corrigées (vérification programmatique : 0 occurrence) ; **0** incohérence `answer`/`choices` sur les ~180 items de `science_ce1.json` + 9 items de `matching_sciences_ce1` ; le distracteur « rester exactement pareil » du 11/07 n'a pas été retrouvé, probablement reformulé.

**Résumé** : Bloquant 0, Majeur 1, Mineur 4, Suggestion 1 (13 leçons, ~196 items audités)

---

## EMC CE1

### Leçons

Aucun défaut bloquant/majeur sur les 6 leçons ; justesse civique, neutralité, un exemple concret par leçon. Les deux Suggestions du 11/07 sont désormais traitées dans le contenu : la leçon `ce1-lesson-differences` mentionne explicitement « un handicap » et « la même religion », et la leçon `ce1-lesson-numeros-urgence` précise que le 112 « fonctionne partout en Europe, même sans crédit sur le téléphone ».

**Mineur — accent manquant localisé (nouveau point, absent du 11/07)** — `data/ce1.json`, exercice `ce1-emc-entraide-emotions` (sous-thème `ce1-emc-entraide-subtheme`) — titre « Emotions et respect » et sous-titre « Comprendre les emotions pour mieux s'entendre » sans accent sur « Émotions »/« émotions », alors que l'exercice jumeau `ce1-emc-emotions-respect` (même vivier `ce1-emotions-respect`) a bien « Émotions et respect » correctement accentué. Anomalie de saisie localisée à ces deux champs, pas un problème d'encodage global. Correction suggérée : ajouter l'accent.

### Exercices

**Mineur — 3 doublons de questions exactes entre catégories (choix et réponses différents)** — `data/emc_ce1.json` :
- « Ranger le matériel commun, c'est... » présent dans `ce1-regles` (réponse « respecter la classe ») et `ce1-roles-classe` (réponse « prendre soin de la classe »).
- « Un élève responsable pense à... » présent dans `ce1-responsabilites-eleve` (réponse « ranger après son travail ») et `ce1-roles-classe` (réponse « faire sa tâche correctement »).
- « Parler calmement aide à... » présent dans `ce1-emotions-respect` et `ce1-dialogue-politesse`, avec la même réponse « mieux se comprendre » dans les deux cas — cas le plus redondant des trois.

Pas des doublons techniques stricts (choix parfois différents), mais une redondance de fond qui réduit la variété perçue entre exercices voisins. Correction suggérée : reformuler l'une des deux occurrences de chaque paire.

**Points positifs** : le Bloquant du 11/07 (`ce1-dialogue-politesse` intégralement sans accents sur 8/8 items) est **entièrement corrigé** — vérification item par item, tous les accents sont présents (« s'il te plaît », « de la colère », « désaccord »…) ; le Mineur du 11/07 sur le distracteur positif mal calibré (« Si tout le monde était exactement pareil... → plus juste ») est corrigé : l'explication réfute désormais explicitement ce distracteur (« Ce ne serait pas non plus "plus juste" : forcer tout le monde à être identique... serait au contraire injuste ») ; le traitement du respect des différences (16 items : handicap, multilinguisme, stéréotypes de genre, rythme d'apprentissage, choix alimentaires) reste remarquablement neutre et bienveillant ; sécurité/urgence (8/8 items) entièrement correcte (numéros exacts 18/15/17/112, consignes non dangereuses) ; `emc_matching.json::matching_emc_ce1` (8 items) sans tautologie détectée (contrairement au CP où « bonjour → pour dire bonjour » était signalé, ici « bonjour → pour saluer quelqu'un » est correctement reformulé) ; **0** incohérence `answer`/`choices` sur les 116 items de `emc_ce1.json` + 8 items de `matching_emc_ce1`.

**Résumé** : Bloquant 0, Majeur 0, Mineur 3, Suggestion 1 (6 leçons, 124 items audités)

---

## Récapitulatif des actions suggérées (indicatif — aucune exécution dans cette phase)

### Priorité 1 — Majeurs (3), aucun Bloquant résiduel
1. **Français** — retirer ou reformuler l'item « ___ image est affichée au tableau. → La » de `grammar_det_nom_ce1` (élision fautive enseignée activement : « La image » au lieu de « L'image »).
2. **Géographie** — dédoublonner `ce1-lieux-publics`/`ce1-services-quartier` (item « des besoins différents » quasi identique dans les deux catégories).
3. **Sciences** — déplacer les items ovipare/vivipare/métamorphose de `ce1-vivant` vers `ce1-cycle-vie-simple`, cohérent avec le nom de cette dernière catégorie.

### Priorité 2 — Anomalies transverses
- Étendre la règle R4 (distracteurs de longueur comparable) aux banques `factual-qcm` externes — environ 87 items concernés, concentrés en Sciences (47) et Géographie (20).
- Retirer le BOM UTF-8 de `french_word_order.json`, `geography_matching.json`, `history_ce1.json`, `history_matching.json`, `math_geometry_ce1.json`, `math_matching.json`, `science_ce1.json`, `science_matching.json`, `french/conjugation.json`, `french/homophones.json`.
- Trancher le sort de `data/french_ce1_reading.json`/`data/french_ce1_comprehension.json` (code mort, contenu obsolète et fauté, toujours bundlé) : suppression ou documentation explicite de leur statut d'archive.
- Corriger la faute d'homophone « Le parc est un lieu **ou** l'on peut... » → « **où** » dans `geography_ce1.json::ce1-lieux-publics`.
- Ajouter l'accent manquant sur « Émotions et respect » dans l'exercice EMC `ce1-emc-entraide-emotions`.

### Priorité 3 — Mineurs et suggestions restants
Voir détail par matière ci-dessus (quasi-doublons Histoire `ce1-souvenirs-famille`/`ce1-memoire-famille`, monuments avec noms de région dans `matching_histoire_ce1`, kilomètre en anticipation CE2, verbe « range » répété 13 fois dans `word_order_ce1`, paire de matching géo formellement incohérente, doublons de questions EMC/Sciences à réponses différentes).

## Renvois à `curriculum-auditor` (manques ou anticipations de couverture entrevus, hors périmètre de cet audit)

- **Kilomètre en Mathématiques CE1** (`math_geometry_ce1.json::ce1-longueurs-mesures`) — le référentiel programme situe les conversions mm/cm/m/km en CE2 ; à `curriculum-auditor` de trancher si c'est une anticipation assumée ou un point à déplacer.
- **Précision géographique (villes/régions) dans l'Histoire CE1** (`matching_histoire_ce1`) — la géographie CE1 se limite à l'espace proche (école, quartier, commune) ; la présence de noms de région dans un exercice d'Histoire mériterait un arbitrage sur la cohérence inter-matières du niveau attendu.

## Vérification

Relecture recommandée en priorité des **3 Majeurs** confirmés par lecture directe (élision fautive Français, doublon Géographie, chevauchement Sciences), puis de l'anomalie transverse R4 (la plus répandue en volume, 87 items). Le point qui était la priorité absolue du 11/07 — le bug de branchement Français — s'avère **sans impact pédagogique actuel** : le contenu riche est bien servi via `data/french/reading.json`, seul le nettoyage des deux fichiers orphelins reste à faire, sans urgence. La phase de correction est **distincte de cet audit** : aucune modification n'a été appliquée au contenu, au code ou aux banques ici.

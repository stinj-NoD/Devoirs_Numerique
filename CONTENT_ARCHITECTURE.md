# Architecture des contenus pédagogiques

Document de référence listant, pour chaque niveau, chaque matière, chaque sous-thème : les leçons (J'apprends) et les exercices (Je m'entraîne) avec leur moteur et leurs paramètres.

Objectif : repérer rapidement les manques de contenu (sous-thèmes sans leçon, sans exercice, catégories peu fournies) pour prioriser les ajouts.

> Document généré automatiquement depuis `data/cp.json` à `data/cm2.json` le 2026-06-25. Pour le regénérer après un ajout de contenu, relire ce fichier comme modèle et reproduire le même parcours (`subjects[].subthemes[].lessons`/`exercises`).

---

## Vue d'ensemble

- **775 exercices** et **275 leçons** répartis sur 5 niveaux (CP à CM2).
- Moteurs utilisés :

| Moteur | Nombre d'exercices |
|---|---|
| `choice-engine` | 407 |
| `math-input` | 124 |
| `matching` | 46 |
| `audio-spelling` | 37 |
| `conjugation` | 37 |
| `board-interactive` | 30 |
| `reading` | 28 |
| `conversion` | 26 |
| `timeline` | 22 |
| `clock` | 6 |
| `word-order` | 6 |
| `cloze-fill-in` | 4 |
| `counting` | 2 |

- Types `board-interactive` utilisés :

| Type board-interactive | Nombre d'exercices |
|---|---|
| `map-locate` | 12 |
| `tap-features` | 6 |
| `memory-match` | 3 |
| `symmetry-complete` | 3 |
| `point-on-grid` | 2 |
| `fraction-build` | 2 |
| `shape-classify` | 2 |


---

## Synthèse des manques

Sous-thèmes sans leçon et/ou sans exercice (candidats prioritaires pour de futurs ajouts) :

_Aucun sous-thème sans leçon ni sans exercice détecté._

---

## CP

### Mathématiques (cp-maths)

#### Parcours : Addition `(cp-parcours-addition)`

- **Leçons** (2) :
  - Comprendre l'addition `(cp-lesson-addition-comprendre)` — blocs: paragraph, example, bullets, tip
  - Compléter jusqu'à 10 `(cp-lesson-complement-10)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Petites additions `(add-1)` — engine: `math-input`, type=add-simple, questions=5
  - Additions jusqu'à 20 `(add-2)` — engine: `math-input`, type=add-simple, questions=5
  - Trouver le nombre caché `(add-3)` — engine: `math-input`, type=add-trou, questions=5, min=1, max=50
  - Compléter jusqu'à 10 `(add-4)` — engine: `math-input`, type=complement, questions=5
  - Compléter jusqu'à 20 `(add-5)` — engine: `math-input`, type=complement, questions=5
  - Défi : super additions `(cp-bonus-addition-defi)` — engine: `math-input`, type=add-simple, questions=8, bonus (seuil=2)

#### Parcours : Soustraction `(cp-parcours-soustraction)`

- **Leçons** (2) :
  - Comprendre la soustraction `(cp-lesson-soustraction-comprendre)` — blocs: paragraph, example, bullets, tip
  - Trouver le complément `(cp-lesson-soustraction-complement)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Retirer jusqu'à 10 `(sub-1)` — engine: `math-input`, type=sub-simple, questions=5, min=1, max=10
  - Retirer jusqu'à 20 `(sub-2)` — engine: `math-input`, type=sub-simple, questions=5, min=1, max=20
  - Retirer jusqu'à 30 `(sub-3)` — engine: `math-input`, type=sub-simple, questions=5, min=5, max=30
  - Défi : super soustractions `(cp-bonus-soustraction-defi)` — engine: `math-input`, type=sub-simple, questions=8, min=10, max=30, bonus (seuil=2)

#### Nombres & Comparaison `(cp-nombres-comparaison)`

- **Leçons** (3) :
  - Compter et comparer `(cp-lesson-compter-comparer)` — blocs: paragraph, example, bullets, tip
  - Plus, moins, autant `(cp-lesson-plus-moins-autant)` — blocs: paragraph, example, bullets, tip
  - Doubles et moitiés `(cp-lesson-doubles-moities)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Compter `(math-count-1)` — engine: `counting`, questions=5, min=1, max=20
  - Compter plus loin `(math-count-2)` — engine: `counting`, questions=5, min=20, max=99
  - Comparer jusqu'à 10 `(comp-1)` — engine: `choice-engine`, questions=5
  - Comparer jusqu'à 20 `(comp-2)` — engine: `choice-engine`, questions=5
  - Comparer jusqu'à 50 `(comp-3)` — engine: `choice-engine`, questions=5
  - Défi : grands nombres `(cp-bonus-comparaison-defi)` — engine: `choice-engine`, questions=8, bonus (seuil=2)

#### Cibles & Monnaie `(cp-cibles-monnaie)`

- **Leçons** (2) :
  - Comprendre un problème simple `(cp-lesson-cibles-comprendre)` — blocs: paragraph, example, bullets, tip
  - Utiliser la monnaie `(cp-lesson-cibles-monnaie)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Cible : Niv 1 `(cible-1)` — engine: `math-input`, type=cibles, questions=5
  - Cible : Niv 2 `(cible-2)` — engine: `math-input`, type=cibles, questions=5
  - Cible : Niv 3 `(cible-3)` — engine: `math-input`, type=cibles, questions=5
  - Le Marché `(banquier-1)` — engine: `math-input`, type=cibles, questions=5
  - La Caisse `(banquier-2)` — engine: `math-input`, type=cibles, questions=5
  - Défi : le grand comptoir `(cp-bonus-caisse-defi)` — engine: `math-input`, type=cibles, questions=6, bonus (seuil=2)

#### Défis & Logique `(cp-defis-logique)`

- **Leçons** (2) :
  - Résoudre un petit problème `(cp-lesson-defi-chercher)` — blocs: paragraph, example, bullets, tip
  - Vérifier un calcul `(cp-lesson-defi-verifier)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - L'Oiseau Rapide `(oiseau-1)` — engine: `math-input`, type=oiseau-math, questions=5, min=1, max=10
  - Carré Magique 1 `(carre-1)` — engine: `math-input`, type=carre-somme, questions=5, targetMin=10, targetMax=10, solutionCount=2, gridSize=4
  - Carré Magique 2 `(carre-2)` — engine: `math-input`, type=carre-somme, questions=5, targetMin=10, targetMax=10, solutionCount=2, gridSize=4
  - Carré Magique 3 `(carre-3)` — engine: `math-input`, type=carre-somme, questions=5, targetMin=15, targetMax=15, solutionCount=2, gridSize=4
  - Défi : Carré Magique Expert `(cp-bonus-carre-magique-defi)` — engine: `math-input`, type=carre-somme, questions=6, targetMin=20, targetMax=20, solutionCount=2, gridSize=4, bonus (seuil=2)

#### Formes et mesures `(cp-formes-mesures-subtheme)`

- **Leçons** (5) :
  - Les formes simples `(cp-lesson-formes-simples)` — blocs: paragraph, example, bullets, tip
  - Comparer des longueurs `(cp-lesson-comparer-longueurs)` — blocs: paragraph, example, bullets, tip
  - Les moments de la journée `(cp-lesson-heures-journee)` — blocs: paragraph, example, bullets, tip
  - Lire l'heure `(cp-lesson-lire-heure)` — blocs: paragraph, example, bullets, tip
  - Lourd, léger, plein, vide `(cp-lesson-masses-contenances)` — blocs: paragraph, example, bullets, tip
- **Exercices** (8) :
  - Reconnaître les formes `(cp-geo-formes-reconnaitre)` — engine: `choice-engine`, type=factual-qcm, category=cp-formes-reconnaissance, dataFile=data/math_geometry_cp.json, questions=8
  - Comparer des longueurs `(cp-geo-comparer-longueurs)` — engine: `choice-engine`, type=factual-qcm, category=cp-longueurs-comparaison, dataFile=data/math_geometry_cp.json, questions=8
  - Repères de la journée `(cp-geo-moments-journee)` — engine: `choice-engine`, type=factual-qcm, category=cp-moments-journee, dataFile=data/math_geometry_cp.json, questions=8
  - Lire l'heure `(cp-clock-heures-pleines)` — engine: `clock`, questions=6
  - Lourd ou léger, plein ou vide `(cp-geo-masses-contenances)` — engine: `choice-engine`, type=factual-qcm, category=cp-masses-contenances, dataFile=data/math_geometry_cp.json, questions=6
  - Formes et opérations `(cp-maths-appariement)` — engine: `matching`, category=matching_math_cp, dataFile=data/math_matching.json, questions=3
  - Jeu de mémoire `(cp-maths-memoire)` — engine: `board-interactive`, type=memory-match, category=cp_memory_match, dataFile=data/board_memory_match_cp.json, questions=4
  - Défi : formes et mesures `(cp-bonus-formes-mesures-defi)` — engine: `choice-engine`, type=factual-qcm, category=cp-formes-reconnaissance, dataFile=data/math_geometry_cp.json, questions=10, bonus (seuil=2)

#### Écrire les nombres `(cp-ecriture-nombres)`

- **Leçons** (2) :
  - Lire et écrire les nombres `(cp-lesson-lire-ecrire-nombre)` — blocs: paragraph, example, bullets, tip
  - Dizaines et unités `(cp-lesson-dizaines-unites)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Petits Nombres `(cp-dictee-0-10)` — engine: `math-input`, type=number-spelling, questions=5, min=0, max=10
  - Nombres de 10 à 20 `(cp-dictee-10-20)` — engine: `math-input`, type=number-spelling, questions=5, min=10, max=20
  - Nombres de 20 à 69 `(cp-dictee-20-69)` — engine: `math-input`, type=number-spelling, questions=5, min=20, max=69
  - Défi : écrire les nombres `(cp-bonus-dictee-nombres-defi)` — engine: `math-input`, type=number-spelling, questions=8, min=0, max=69, bonus (seuil=2)

#### Problèmes `(cp-problemes-subtheme)`

- **Leçons** (1) :
  - Résoudre un problème `(cp-lesson-resoudre-probleme)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Petits problèmes `(cp-problemes-simples)` — engine: `choice-engine`, type=factual-qcm, category=cp-problemes-simples, dataFile=data/math_word_problems_cycle2.json, questions=6
  - Défi : petits problèmes `(cp-bonus-problemes-expert)` — engine: `choice-engine`, type=factual-qcm, category=cp-problemes-simples, dataFile=data/math_word_problems_cycle2.json, questions=10, bonus (seuil=2)

### Français (cp-francais)

#### Dictée d'Images `(cp-orthographe)`

- **Leçons** (1) :
  - Écrire le mot d'une image `(cp-lesson-ecrire-mot-image)` — blocs: paragraph, example, bullets, tip
- **Exercices** (7) :
  - Les Animaux `(fr-animaux)` — engine: `math-input`, type=spelling, category=animals, questions=5
  - Le Corps `(fr-corps)` — engine: `math-input`, type=spelling, category=corps, questions=5
  - Manger `(fr-food)` — engine: `math-input`, type=spelling, category=food, questions=5
  - Transports `(fr-transp)` — engine: `math-input`, type=spelling, category=transport, questions=5
  - L'École `(fr-ecole)` — engine: `math-input`, type=spelling, category=school, questions=5
  - La Maison `(fr-maison)` — engine: `math-input`, type=spelling, category=house, questions=5
  - Défi : super dictée d'images `(cp-bonus-dictee-images-defi)` — engine: `math-input`, type=spelling, category=animals, questions=8, bonus (seuil=2)

#### Dictée audio `(cp-dictee-audio)`

- **Leçons** (1) :
  - Écouter pour écrire un mot `(cp-lesson-ecouter-ecrire-mot)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - L'École `(cp-audio-ecole)` — engine: `audio-spelling`, category=school, questions=5
  - La Maison `(cp-audio-maison)` — engine: `audio-spelling`, category=house, questions=5
  - Les Aliments `(cp-audio-aliments)` — engine: `audio-spelling`, category=food, questions=5
  - Les Animaux `(cp-audio-animaux)` — engine: `audio-spelling`, category=animals, questions=5
  - Les Transports `(cp-audio-transports)` — engine: `audio-spelling`, category=transport, questions=5
  - Défi : super dictée audio `(cp-bonus-dictee-audio-defi)` — engine: `audio-spelling`, category=animals, questions=8, bonus (seuil=2)

#### Dictée audio mots outils `(cp-dictee-mots-outils-audio)`

- **Leçons** (1) :
  - Écrire les mots outils `(cp-lesson-dictee-mots-outils)` — blocs: paragraph, example, tip
- **Exercices** (6) :
  - Période 1 `(cp-audio-mots-outils-p1)` — engine: `audio-spelling`, category=cp_mots_outils_p1, questions=6
  - Période 2 `(cp-audio-mots-outils-p2)` — engine: `audio-spelling`, category=cp_mots_outils_p2, questions=6
  - Période 3 `(cp-audio-mots-outils-p3)` — engine: `audio-spelling`, category=cp_mots_outils_p3, questions=6
  - Période 4 `(cp-audio-mots-outils-p4)` — engine: `audio-spelling`, category=cp_mots_outils_p4, questions=6
  - Période 5 `(cp-audio-mots-outils-p5)` — engine: `audio-spelling`, category=cp_mots_outils_p5, questions=6
  - Défi : tous les mots outils `(cp-bonus-mots-outils-defi)` — engine: `audio-spelling`, category=cp_mots_outils_p5, questions=9, bonus (seuil=2)

#### Phrase et ponctuation `(cp-phrase-ponctuation-subtheme)`

- **Leçons** (2) :
  - La phrase simple `(cp-lesson-phrase-simple)` — blocs: paragraph, example, bullets, tip
  - La ponctuation `(cp-lesson-ponctuation)` — blocs: paragraph, example, bullets, tip
- **Exercices** (1) :
  - La phrase et la ponctuation `(cp-phrase-ponctuation-qcm)` — engine: `choice-engine`, type=factual-qcm, category=cp-phrase-ponctuation, dataFile=data/french_cp_grammar.json, questions=6

#### Lecture syllabique `(cp-lecture)`

- **Leçons** (2) :
  - Lire des syllabes `(cp-lesson-lire-syllabes)` — blocs: paragraph, example, bullets, tip
  - Lire des phrases courtes `(cp-lesson-lire-phrases-courtes)` — blocs: paragraph, example, bullets, tip
- **Exercices** (7) :
  - Repérer une syllabe `(cp-lecture-syllabes)` — engine: `reading`, category=cp_reperer_syllabe, questions=5
  - Compter les syllabes `(cp-lecture-mots)` — engine: `reading`, category=cp_compter_syllabes, questions=5
  - Lire le son ou `(cp-lecture-ou)` — engine: `reading`, category=cp_son_ou, questions=5
  - Lire le son on `(cp-lecture-on)` — engine: `reading`, category=cp_son_on, questions=5
  - Lire le son ch `(cp-lecture-ch)` — engine: `reading`, category=cp_son_ch, questions=5
  - Lettres muettes `(cp-lecture-muettes)` — engine: `reading`, category=cp_lettres_muettes, questions=5
  - Défi : super lecture `(cp-bonus-lecture-defi)` — engine: `reading`, category=cp_lettres_muettes, questions=8, bonus (seuil=2)

#### Masculin ou Féminin `(cp-grammaire-genre)`

- **Leçons** (1) :
  - Un ou une ? `(cp-lesson-un-une)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Un ou Une ? `(cp-un-une)` — engine: `choice-engine`, type=gender-articles, category=gender_cp, questions=5
  - Le ou La ? `(cp-le-la)` — engine: `choice-engine`, type=gender-articles, category=gender_cp, questions=5

#### Lecture et compréhension `(cp-lecture-comprehension)`

- **Leçons** (1) :
  - Lire des mots `(cp-lesson-lire-mots)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Lire des mots simples `(cp-lecture-mots-simples)` — engine: `choice-engine`, type=factual-qcm, category=cp_lire_mots_simples, dataFile=data/french_cp_grammar.json, questions=5
  - Comprendre une phrase `(cp-lecture-comprendre-phrase)` — engine: `choice-engine`, type=factual-qcm, category=cp_comprendre_phrase, dataFile=data/french_cp_grammar.json, questions=5

#### Grammaire : nom, verbe et déterminants `(cp-gram-avance)`

- **Leçons** (1) :
  - La phrase `(cp-lesson-la-phrase)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Les déterminants `(cp-gram-determinants)` — engine: `choice-engine`, type=factual-qcm, category=cp-determinants, dataFile=data/french_cp_grammar.json, questions=6
  - Nom ou verbe ? `(cp-gram-nom-verbe)` — engine: `choice-engine`, type=factual-qcm, category=cp-nom-verbe, dataFile=data/french_cp_grammar.json, questions=6
  - Ordre des mots `(cp-francais-ordre-mots)` — engine: `word-order`, category=word_order_cp, dataFile=data/french_word_order.json, questions=4

#### Conjugaison `(cp-conjugaison)`

- **Leçons** (1) :
  - Être et avoir `(cp-lesson-etre-avoir)` — blocs: paragraph, example, example, bullets, tip
- **Exercices** (1) :
  - Être et avoir au présent `(cp-conj-etre-avoir)` — engine: `conjugation`, category=etre_avoir_p, questions=5

### Questionner le temps (cp-histoire-subject)

#### Avant et après `(cp-histoire-temps)`

- **Leçons** (2) :
  - Repères du temps `(cp-lesson-temps-qui-passe)` — blocs: paragraph, example, bullets, tip
  - Les jours de la semaine `(cp-lesson-jours-semaine)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Avant et après `(cp-histoire-avant-apres)` — engine: `choice-engine`, type=factual-qcm, category=cp-avant-apres, dataFile=data/history_cp.json, questions=6
  - Repérer le temps `(cp-histoire-ordre-temps)` — engine: `choice-engine`, type=factual-qcm, category=cp-avant-apres, dataFile=data/history_cp.json, questions=8
  - Jours et saisons `(cp-histoire-jours-saisons)` — engine: `choice-engine`, type=factual-qcm, category=cp-jours-saisons, dataFile=data/history_cp.json, questions=8
  - Défi : jours et saisons `(cp-bonus-jours-saisons-defi)` — engine: `choice-engine`, type=factual-qcm, category=cp-jours-saisons, dataFile=data/history_cp.json, questions=10, bonus (seuil=2)

#### Vivre autrefois `(cp-histoire-vie)`

- **Leçons** (2) :
  - Vivre autrefois `(cp-lesson-vivre-autrefois)` — blocs: paragraph, example, bullets, tip
  - L'école autrefois `(cp-lesson-ecole-autrefois)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Vivre autrefois `(cp-histoire-vie-autrefois)` — engine: `choice-engine`, type=factual-qcm, category=cp-vie-autrefois, dataFile=data/history_cp.json, questions=6
  - Comparer autrefois `(cp-histoire-comparer-autrefois)` — engine: `choice-engine`, type=factual-qcm, category=cp-vie-autrefois, dataFile=data/history_cp.json, questions=8

#### Traces du passé `(cp-histoire-traces-subtheme)`

- **Leçons** (2) :
  - Les traces du passé `(cp-lesson-traces-passe)` — blocs: paragraph, example, bullets, tip
  - Les objets du passé `(cp-lesson-objets-passe)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Traces du passé `(cp-histoire-traces)` — engine: `choice-engine`, type=factual-qcm, category=cp-personnages-traces, dataFile=data/history_cp.json, questions=6
  - Observer les traces `(cp-histoire-observer-traces)` — engine: `choice-engine`, type=factual-qcm, category=cp-personnages-traces, dataFile=data/history_cp.json, questions=8
  - Photos et souvenirs `(cp-histoire-photos-souvenirs)` — engine: `choice-engine`, type=factual-qcm, category=cp-photos-souvenirs, dataFile=data/history_cp.json, questions=6
  - Objets anciens `(cp-histoire-objets-anciens)` — engine: `choice-engine`, type=factual-qcm, category=cp-objets-anciens, dataFile=data/history_cp.json, questions=6
  - Partager le matériel `(cp-emc-partager-materiel)` — engine: `choice-engine`, type=factual-qcm, category=cp-partager-materiel, dataFile=data/emc_cp.json, questions=6
  - Défi : grand musée du passé `(cp-bonus-traces-passe-defi)` — engine: `choice-engine`, type=factual-qcm, category=cp-personnages-traces, dataFile=data/history_cp.json, questions=10, bonus (seuil=2)

### Questionner l'espace (cp-geographie-subject)

#### Plan et quartier `(cp-plan-quartier-subtheme)`

- **Leçons** (2) :
  - Le plan de l'école `(cp-lesson-plan-ecole)` — blocs: paragraph, example, bullets, tip
  - Le quartier `(cp-lesson-quartier)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Le plan et le quartier `(cp-geo-plan-quartier)` — engine: `choice-engine`, type=factual-qcm, category=cp-plan-quartier, dataFile=data/geography_cp.json, questions=6
  - Défi : plan et quartier `(cp-bonus-plan-quartier-defi)` — engine: `choice-engine`, type=factual-qcm, category=cp-plan-quartier, dataFile=data/geography_cp.json, questions=8, bonus (seuil=2)

#### Se repérer `(cp-geo-reperage-subtheme)`

- **Leçons** (2) :
  - Le plan de l'école `(cp-lesson-se-reperer-ecole)` — blocs: paragraph, example, bullets, tip
  - Les repères de position `(cp-lesson-gauche-droite)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Se repérer `(cp-geo-reperer)` — engine: `choice-engine`, type=factual-qcm, category=cp-se-reperer, dataFile=data/geography_cp.json, questions=6
  - Se repérer à l'école `(cp-geo-ecole-trajets)` — engine: `choice-engine`, type=factual-qcm, category=cp-se-reperer, dataFile=data/geography_cp.json, questions=8
  - Les lieux de l'école `(cp-geo-lieux-ecole)` — engine: `choice-engine`, type=factual-qcm, category=cp-lieux-ecole, dataFile=data/geography_cp.json, questions=8
  - Défi : se repérer `(cp-bonus-reperage-defi)` — engine: `choice-engine`, type=factual-qcm, category=cp-lieux-ecole, dataFile=data/geography_cp.json, questions=10, bonus (seuil=2)
  - Carte de France `(cp-geo-carte-regions)` — engine: `board-interactive`, type=map-locate, category=cp_map_regions_france, dataFile=data/board_map_locate_cp.json, mapFile=data/maps/france-regions.svg, mapId=france-regions, questions=3

#### Paysages `(cp-geo-paysages-subtheme)`

- **Leçons** (1) :
  - Reconnaître des paysages `(cp-lesson-paysages-reperes)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Paysages `(cp-geo-paysages)` — engine: `choice-engine`, type=factual-qcm, category=cp-paysages, dataFile=data/geography_cp.json, questions=6
  - Reconnaître les paysages `(cp-geo-reconnaitre-paysages)` — engine: `choice-engine`, type=factual-qcm, category=cp-paysages, dataFile=data/geography_cp.json, questions=8

#### Transports et lieux `(cp-geo-transports-subtheme)`

- **Leçons** (1) :
  - Se déplacer selon les lieux `(cp-lesson-transports-lieux)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Transports et lieux `(cp-geo-transports)` — engine: `choice-engine`, type=factual-qcm, category=cp-transports-lieux, dataFile=data/geography_cp.json, questions=6
  - Se déplacer selon les lieux `(cp-geo-deplacements-lieux)` — engine: `choice-engine`, type=factual-qcm, category=cp-transports-lieux, dataFile=data/geography_cp.json, questions=8
  - Trajets du quotidien `(cp-geo-trajets-quotidiens)` — engine: `choice-engine`, type=factual-qcm, category=cp-trajets-quotidiens, dataFile=data/geography_cp.json, questions=6
  - Lieux publics `(cp-geo-lieux-publics)` — engine: `choice-engine`, type=factual-qcm, category=cp-lieux-publics, dataFile=data/geography_cp.json, questions=6
  - Défi : grand voyageur `(cp-bonus-transports-lieux-defi)` — engine: `choice-engine`, type=factual-qcm, category=cp-transports-lieux, dataFile=data/geography_cp.json, questions=10, bonus (seuil=2)

### Questionner le vivant et la matière (cp-sciences-subject)

#### Le vivant `(cp-sciences-vivant-subtheme)`

- **Leçons** (3) :
  - Les besoins du vivant `(cp-lesson-vivant-besoins)` — blocs: paragraph, example, bullets, tip
  - Plantes et animaux `(cp-lesson-plantes-animaux)` — blocs: paragraph, example, bullets, tip
  - Vivant ou non-vivant `(cp-lesson-vivant-non-vivant)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Le vivant `(cp-sciences-vivant)` — engine: `choice-engine`, type=factual-qcm, category=cp-vivant, dataFile=data/science_cp.json, questions=6
  - Animaux et plantes `(cp-sciences-animaux-plantes)` — engine: `choice-engine`, type=factual-qcm, category=cp-animaux-plantes-quotidien, dataFile=data/science_cp.json, questions=6
  - Défi : le vivant `(cp-bonus-sciences-vivant-defi)` — engine: `choice-engine`, type=factual-qcm, category=cp-vivant, dataFile=data/science_cp.json, questions=9, bonus (seuil=2)

#### Matière et lumière `(cp-sciences-matiere-subtheme)`

- **Leçons** (1) :
  - La matière et ses états `(cp-lesson-matiere-etat)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Matière et lumière `(cp-sciences-matiere)` — engine: `choice-engine`, type=factual-qcm, category=cp-matiere, dataFile=data/science_cp.json, questions=6
  - Objets et usages `(cp-sciences-objets-usages)` — engine: `choice-engine`, type=factual-qcm, category=cp-objets-usages, dataFile=data/science_cp.json, questions=6
  - Défi : matière et lumière `(cp-bonus-sciences-matiere-defi)` — engine: `choice-engine`, type=factual-qcm, category=cp-matiere, dataFile=data/science_cp.json, questions=9, bonus (seuil=2)

#### Corps et sens `(cp-sciences-corps-subtheme)`

- **Leçons** (2) :
  - Les cinq sens `(cp-lesson-corps-sens)` — blocs: paragraph, example, bullets, tip
  - Les organes des sens `(cp-lesson-organes-sens)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Corps et sens `(cp-sciences-corps)` — engine: `choice-engine`, type=factual-qcm, category=cp-corps-sens, dataFile=data/science_cp.json, questions=6
  - Les cinq sens `(cp-sciences-cinq-sens)` — engine: `choice-engine`, type=factual-qcm, category=cp-corps-sens, dataFile=data/science_cp.json, questions=8
  - Les besoins du corps `(cp-sciences-besoins-corps)` — engine: `choice-engine`, type=factual-qcm, category=cp-besoins-corps, dataFile=data/science_cp.json, questions=8
  - Hygiène quotidienne `(cp-sciences-hygiene-quotidienne)` — engine: `choice-engine`, type=factual-qcm, category=cp-hygiene-quotidienne, dataFile=data/science_cp.json, questions=6
  - Défi : grand expert du corps `(cp-bonus-corps-sens-defi)` — engine: `choice-engine`, type=factual-qcm, category=cp-corps-sens, dataFile=data/science_cp.json, questions=10, bonus (seuil=2)

#### Saisons et météo `(cp-sciences-saisons-subtheme)`

- **Leçons** (2) :
  - Les quatre saisons `(cp-lesson-quatre-saisons)` — blocs: paragraph, example, bullets, tip
  - La météo du jour `(cp-lesson-meteo-du-jour)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Les quatre saisons `(cp-sciences-saisons)` — engine: `choice-engine`, type=factual-qcm, category=cp-saisons-meteo, dataFile=data/science_cp.json, questions=6
  - Le temps qu'il fait `(cp-sciences-meteo)` — engine: `choice-engine`, type=factual-qcm, category=cp-saisons-meteo, dataFile=data/science_cp.json, questions=6
  - S'habiller selon la saison `(cp-sciences-habits-saison)` — engine: `choice-engine`, type=factual-qcm, category=cp-saisons-meteo, dataFile=data/science_cp.json, questions=6

#### Où vivent les animaux ? `(cp-sciences-milieux-subtheme)`

- **Leçons** (2) :
  - Près de chez nous `(cp-lesson-milieux-proches)` — blocs: paragraph, example, bullets, tip
  - La forêt, la mare et la mer `(cp-lesson-foret-mare-mer)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Où vivent les animaux ? `(cp-sciences-milieux-vie)` — engine: `choice-engine`, type=factual-qcm, category=cp-milieux-vie, dataFile=data/science_cp.json, questions=6
  - La maison et le jardin `(cp-sciences-maison-jardin)` — engine: `choice-engine`, type=factual-qcm, category=cp-milieux-vie, dataFile=data/science_cp.json, questions=6

#### Objets du quotidien `(cp-sciences-objets-subtheme)`

- **Leçons** (2) :
  - À quoi servent les objets ? `(cp-lesson-fonction-objets)` — blocs: paragraph, example, bullets, tip
  - En quoi sont faits les objets ? `(cp-lesson-materiaux-simples)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - À quoi ça sert ? `(cp-sciences-objets-fonction)` — engine: `choice-engine`, type=factual-qcm, category=cp-objets-quotidien, dataFile=data/science_cp.json, questions=6
  - En quoi c'est fait ? `(cp-sciences-objets-materiaux)` — engine: `choice-engine`, type=factual-qcm, category=cp-objets-quotidien, dataFile=data/science_cp.json, questions=6

### EMC (cp-emc-subject)

#### Vivre ensemble `(cp-emc-vivre-ensemble-subtheme)`

- **Leçons** (4) :
  - Vivre ensemble à l'école `(cp-lesson-vivre-ensemble)` — blocs: paragraph, example, bullets, tip
  - Les règles de la classe `(cp-lesson-regles-classe)` — blocs: paragraph, example, bullets, tip
  - Les droits et les devoirs `(cp-lesson-droits-devoirs)` — blocs: paragraph, example, bullets, tip
  - Respecter le matériel `(cp-lesson-respect-materiel)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Vivre ensemble `(cp-emc-vivre-ensemble)` — engine: `choice-engine`, type=factual-qcm, category=cp-vivre-ensemble, dataFile=data/emc_cp.json, questions=6
  - Respecter les autres `(cp-emc-respecter-autres)` — engine: `choice-engine`, type=factual-qcm, category=cp-vivre-ensemble, dataFile=data/emc_cp.json, questions=8
  - Politesse en classe `(cp-emc-politesse-classe)` — engine: `choice-engine`, type=factual-qcm, category=cp-politesse-classe, dataFile=data/emc_cp.json, questions=8
  - Politesse et émotions `(cp-emc-appariement)` — engine: `matching`, category=matching_emc_cp, dataFile=data/emc_matching.json, questions=3

#### Sécurité `(cp-emc-securite-subtheme)`

- **Leçons** (1) :
  - Être prudent au quotidien `(cp-lesson-securite-quotidienne)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Sécurité `(cp-emc-securite)` — engine: `choice-engine`, type=factual-qcm, category=cp-securite, dataFile=data/emc_cp.json, questions=6
  - Être prudent `(cp-emc-etre-prudent)` — engine: `choice-engine`, type=factual-qcm, category=cp-securite, dataFile=data/emc_cp.json, questions=8

#### Entraide `(cp-emc-entraide-subtheme)`

- **Leçons** (1) :
  - Entraide et respect `(cp-lesson-entraide-respect)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Entraide `(cp-emc-entraide)` — engine: `choice-engine`, type=factual-qcm, category=cp-entraide, dataFile=data/emc_cp.json, questions=6
  - Aider un camarade `(cp-emc-aider-camarade)` — engine: `choice-engine`, type=factual-qcm, category=cp-entraide, dataFile=data/emc_cp.json, questions=8

#### Les émotions `(cp-emc-emotions-subtheme)`

- **Leçons** (2) :
  - Les émotions `(cp-lesson-emotions)` — blocs: paragraph, example, bullets, tip
  - Exprimer ses émotions `(cp-lesson-exprimer-emotions)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Mes émotions `(cp-emc-emotions)` — engine: `choice-engine`, type=factual-qcm, category=cp-emotions, dataFile=data/emc_cp.json, questions=6
  - Exprimer ses émotions `(cp-emc-exprimer-emotions)` — engine: `choice-engine`, type=factual-qcm, category=cp-emotions, dataFile=data/emc_cp.json, questions=8


---

## CE1

### Mathématiques (ce1-maths)

#### Multiplication `(ce1-multiplication)`

- **Leçons** (1) :
  - Comprendre la multiplication `(ce1-lesson-multiplication-bases)` — blocs: paragraph, example, bullets, tip
- **Exercices** (8) :
  - Table de 2 `(mult-2)` — engine: `math-input`, type=mult, questions=10
  - Table de 3 `(mult-3)` — engine: `math-input`, type=mult, questions=10
  - Table de 4 `(mult-4)` — engine: `math-input`, type=mult, questions=10
  - Table de 5 `(mult-5)` — engine: `math-input`, type=mult, questions=10
  - Table de 10 `(mult-10)` — engine: `math-input`, type=mult, questions=10
  - Table de 6 `(mult-6)` — engine: `math-input`, type=mult, questions=10
  - Table de 7 `(mult-7)` — engine: `math-input`, type=mult, questions=10
  - Défi : tables mélangées `(ce1-bonus-mult-melange)` — engine: `math-input`, type=mult, questions=15, bonus (seuil=2)

#### Nombres & Calculs `(ce1-nombres-calculs)`

- **Leçons** (1) :
  - Compléter jusqu'à 20 `(ce1-lesson-complements-20)` — blocs: paragraph
- **Exercices** (12) :
  - Compléments à 100 `(add-100)` — engine: `math-input`, type=add-trou, questions=10, min=10, max=100
  - Calcul rapide `(add-chrono)` — engine: `math-input`, type=oiseau-math, questions=10, min=10, max=30
  - Comparer jusqu'à 100 `(comp-ce1-1)` — engine: `choice-engine`, questions=10
  - Le Marché `(bank-ce1-1)` — engine: `math-input`, type=cibles, questions=5
  - Carré Expert `(carre-ce1-1)` — engine: `math-input`, type=carre-somme, questions=5, targetMin=50, targetMax=50, gridSize=9
  - Additions jusqu'à 20 `(ce1-additions-20)` — engine: `math-input`, type=add-simple, questions=10, min=2
  - Soustractions jusqu'à 20 `(ce1-soustractions-20)` — engine: `math-input`, type=sub-simple, questions=10, min=5, max=20
  - Additions jusqu'à 50 `(ce1-additions-50)` — engine: `math-input`, type=add-simple, questions=10, min=5
  - Comparer jusqu'à 200 `(ce1-comp-200)` — engine: `choice-engine`, questions=10
  - Nombres et opérations `(ce1-maths-appariement)` — engine: `matching`, category=matching_math_ce1, dataFile=data/math_matching.json, questions=3
  - Jeu de mémoire `(ce1-maths-memoire)` — engine: `board-interactive`, type=memory-match, category=ce1_memory_match, dataFile=data/board_memory_match_ce1.json, questions=5
  - Défi : additions jusqu'à 100 `(ce1-bonus-additions-100)` — engine: `math-input`, type=add-simple, questions=12, min=10, bonus (seuil=2)

#### Géométrie et mesures `(ce1-geometrie-mesures-subtheme)`

- **Leçons** (5) :
  - Reconnaître des formes `(ce1-lesson-formes-planes)` — blocs: paragraph, example, bullets, tip
  - Mesurer et comparer `(ce1-lesson-mesurer-comparer)` — blocs: paragraph, example, bullets, tip
  - Se repérer dans la journée `(ce1-lesson-se-reperer-journee)` — blocs: paragraph, example, bullets, tip
  - Lire l'heure `(ce1-lesson-lire-heure)` — blocs: paragraph, example, bullets, tip
  - Masses et contenances `(ce1-lesson-masses-contenances)` — blocs: paragraph, example, bullets, tip
- **Exercices** (7) :
  - Formes planes et solides `(ce1-geo-formes-solides-planes)` — engine: `choice-engine`, type=factual-qcm, category=ce1-formes-solides-planes, dataFile=data/math_geometry_ce1.json, questions=8
  - Mesurer des longueurs `(ce1-geo-longueurs-mesures)` — engine: `choice-engine`, type=factual-qcm, category=ce1-longueurs-mesures, dataFile=data/math_geometry_ce1.json, questions=8
  - Repères de la journée `(ce1-geo-reperes-journee)` — engine: `choice-engine`, type=factual-qcm, category=ce1-reperes-journee, dataFile=data/math_geometry_ce1.json, questions=8
  - Lire l'heure `(ce1-clock-heures-quarts)` — engine: `clock`, questions=6
  - Masses et contenances `(ce1-geo-masses-contenances)` — engine: `choice-engine`, type=factual-qcm, category=ce1-masses-contenances, dataFile=data/math_geometry_ce1.json, questions=8
  - Formes et mesures `(ce1-maths-geo-appariement)` — engine: `matching`, category=matching_math_ce1, dataFile=data/math_matching.json, questions=3
  - Défi : lire l'heure `(ce1-bonus-geo-lire-heure)` — engine: `clock`, questions=10, bonus (seuil=2)

#### Problèmes `(ce1-problemes-subtheme)`

- **Leçons** (1) :
  - Bien lire un problème `(ce1-lesson-bien-lire-probleme)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Problèmes additifs `(ce1-problemes-additifs)` — engine: `choice-engine`, type=factual-qcm, category=ce1-problemes-additifs, dataFile=data/math_word_problems_cycle2.json, questions=8
  - Problèmes à étapes `(ce1-problemes-mixtes)` — engine: `choice-engine`, type=factual-qcm, category=ce1-problemes-mixtes, dataFile=data/math_word_problems_cycle2.json, questions=8
  - Défi : problèmes en rafale `(ce1-bonus-problemes-expert)` — engine: `choice-engine`, type=factual-qcm, category=ce1-problemes-mixtes, dataFile=data/math_word_problems_cycle2.json, questions=10, bonus (seuil=2)

### Français (ce1-francais)

#### Orthographe `(ce1-orthographe)`

- **Leçons** (1) :
  - Réussir une dictée de mots `(ce1-lesson-dictee-mots)` — blocs: paragraph
- **Exercices** (11) :
  - Dictée des animaux `(ce1-sp-animaux)` — engine: `math-input`, type=spelling, category=animals, questions=8
  - Le Corps `(ce1-sp-corps)` — engine: `math-input`, type=spelling, category=corps, questions=8
  - A ou à? `(ce1-homo-aa)` — engine: `choice-engine`, type=homophone-duel, category=a_à, questions=10
  - Et ou est? `(ce1-homo-et)` — engine: `choice-engine`, type=homophone-duel, category=et_est, questions=10
  - L'École `(ce1-sp-ecole)` — engine: `math-input`, type=spelling, category=school, questions=8
  - La Maison `(ce1-sp-maison)` — engine: `math-input`, type=spelling, category=house, questions=8
  - Les Aliments `(ce1-sp-aliments)` — engine: `math-input`, type=spelling, category=food, questions=8
  - Les Transports `(ce1-sp-transport)` — engine: `math-input`, type=spelling, category=transport, questions=8
  - Les vêtements `(ce1-sp-vetements)` — engine: `math-input`, type=spelling, category=vêtements, questions=8
  - Son ou Sont? `(ce1-homo-son)` — engine: `choice-engine`, type=homophone-duel, category=son_sont, questions=10
  - Défi : dictée des vêtements `(ce1-bonus-dictee-vetements)` — engine: `math-input`, type=spelling, category=vêtements, questions=12, bonus (seuil=2)

#### Dictée audio `(ce1-dictee-audio)`

- **Leçons** (1) :
  - Écouter et écrire `(ce1-lesson-ecouter-ecrire)` — blocs: paragraph
- **Exercices** (6) :
  - L'École `(ce1-audio-ecole)` — engine: `audio-spelling`, category=school, questions=6
  - La Maison `(ce1-audio-maison)` — engine: `audio-spelling`, category=house, questions=6
  - Le Corps `(ce1-audio-corps)` — engine: `audio-spelling`, category=corps, questions=6
  - Les Animaux `(ce1-audio-animaux)` — engine: `audio-spelling`, category=animals, questions=6
  - Les aliments `(ce1-audio-aliments)` — engine: `audio-spelling`, category=food, questions=6
  - Défi : super dictée des animaux `(ce1-bonus-audio-animaux-expert)` — engine: `audio-spelling`, category=animals, questions=10, bonus (seuil=2)

#### Dictée mots fréquents `(ce1-dictee-mots-frequents)`

- **Leçons** (1) :
  - Mémoriser les mots fréquents `(ce1-lesson-mots-frequents)` — blocs: paragraph, example, tip
- **Exercices** (6) :
  - Période 1 `(ce1-audio-mots-frequents-p1)` — engine: `audio-spelling`, category=ce1_mots_frequents_p1, questions=8
  - Période 2 `(ce1-audio-mots-frequents-p2)` — engine: `audio-spelling`, category=ce1_mots_frequents_p2, questions=8
  - Période 3 `(ce1-audio-mots-frequents-p3)` — engine: `audio-spelling`, category=ce1_mots_frequents_p3, questions=8
  - Période 4 `(ce1-audio-mots-frequents-p4)` — engine: `audio-spelling`, category=ce1_mots_frequents_p4, questions=8
  - Période 5 `(ce1-audio-mots-frequents-p5)` — engine: `audio-spelling`, category=ce1_mots_frequents_p5, questions=8
  - Défi : révision des mots fréquents `(ce1-bonus-mots-frequents-revision)` — engine: `audio-spelling`, category=ce1_mots_frequents_p5, questions=12, bonus (seuil=2)

#### Lecture `(ce1-lecture-subtheme)`

- **Leçons** (2) :
  - Lire des phrases courtes `(ce1-lesson-lire-phrases-courtes)` — blocs: paragraph, example, bullets, tip
  - Comprendre une phrase `(ce1-lesson-comprendre-phrase)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Lire des phrases courtes `(ce1-lecture-phrases)` — engine: `reading`, category=ce1_lire_phrases_courtes, questions=5
  - Comprendre une phrase `(ce1-lecture-comprendre)` — engine: `reading`, category=ce1_comprendre_phrase_courte, questions=5

#### Vocabulaire `(ce1-vocabulaire-subtheme)`

- **Leçons** (3) :
  - Les familles de mots `(ce1-lesson-vocabulaire-ranger-mots)` — blocs: paragraph, example, bullets, tip
  - Ranger les mots par thème `(ce1-lesson-vocabulaire-theme)` — blocs: paragraph, example, bullets, tip
  - Les contraires `(ce1-lesson-vocabulaire-contraires)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Mots de sens proche `(ce1-vocab-synonymes)` — engine: `reading`, category=ce1_vocabulaire_synonymes, questions=5
  - Ranger les mots `(ce1-vocab-familles)` — engine: `reading`, category=ce1_vocabulaire_champs, questions=5
  - Mots contraires `(ce1-vocab-antonymes)` — engine: `reading`, category=ce1_vocabulaire_antonymes, questions=6
  - Associe les mots `(ce1-vocab-appariement)` — engine: `matching`, category=matching_synonymes_ce1, dataFile=data/french/matching.json, questions=2
  - Défi : super contraires `(ce1-bonus-vocab-antonymes-expert)` — engine: `reading`, category=ce1_vocabulaire_antonymes, questions=10, bonus (seuil=2)

#### Grammaire `(ce1-grammaire-subject)`

- **Leçons** (1) :
  - Les déterminants `(ce1-lesson-determinants)` — blocs: paragraph
- **Exercices** (9) :
  - Un ou Une? `(ce1-gram-un-une)` — engine: `choice-engine`, type=gender-articles, category=gender_ce1_classe, questions=8
  - Le, La ou L'? `(ce1-gram-le-la)` — engine: `choice-engine`, type=gender-articles, category=gender_ce1_maison, questions=8
  - Les noms de la nature `(ce1-gram-nature)` — engine: `choice-engine`, type=gender-articles, category=gender_ce1_nature, questions=8
  - Le bon déterminant `(ce1-gram-cloze-det)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_cloze_ce1, questions=8
  - Écris le bon mot `(ce1-gram-cloze-ecrit)` — engine: `cloze-fill-in`, category=grammar_cloze_ce1, questions=6
  - Singulier ou pluriel `(ce1-gram-pluriel)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_plural_ce1, questions=8
  - Compléter avec le bon mot `(ce1-gram-det-phrase)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_agreement_ce1, questions=8
  - Ordre des mots `(ce1-francais-ordre-mots)` — engine: `word-order`, category=word_order_ce1, dataFile=data/french_word_order.json, questions=5
  - Défi : phrases à compléter `(ce1-bonus-grammaire-cloze-expert)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_cloze_ce1, questions=12, bonus (seuil=2)

#### Conjugaison `(ce1-conjugaison-subject)`

- **Leçons** (1) :
  - Être et avoir au présent `(ce1-lesson-etre-avoir)` — blocs: paragraph
- **Exercices** (8) :
  - Les Indispensables `(ce1-conj-base)` — engine: `conjugation`, category=etre_avoir_p, questions=5
  - Verbes en -ER (1) `(ce1-conj-er-facile)` — engine: `conjugation`, category=present_1, questions=5
  - Le verbe ALLER `(ce1-conj-aller)` — engine: `conjugation`, category=present_3_freq, questions=5
  - Verbes en -ER (2) `(ce1-conj-er-action)` — engine: `conjugation`, category=present_1, questions=5
  - Le Cas du 'Nous' `(ce1-conj-er-regles)` — engine: `conjugation`, category=present_1, questions=6
  - Défi Verbe-o-tron `(ce1-conj-expert)` — engine: `conjugation`, category=present_1, questions=10
  - Être et avoir (2) `(ce1-conj-etre-avoir-plus)` — engine: `conjugation`, category=etre_avoir_p, questions=8
  - Défi : Verbe-o-tron expert `(ce1-bonus-conj-verbe-o-tron-expert)` — engine: `conjugation`, category=present_1, questions=15, bonus (seuil=2)

### Questionner le temps (ce1-histoire-subject)

#### Le temps `(ce1-histoire-temps-subtheme)`

- **Leçons** (1) :
  - Hier, aujourd'hui, demain `(ce1-lesson-hier-aujourdhui-demain)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Le temps `(ce1-histoire-temps)` — engine: `choice-engine`, type=factual-qcm, category=ce1-temps, dataFile=data/history_ce1.json, questions=6
  - Avant, après, longtemps `(ce1-histoire-avant-apres-longtemps)` — engine: `choice-engine`, type=factual-qcm, category=ce1-temps, dataFile=data/history_ce1.json, questions=8
  - Calendrier et repères `(ce1-histoire-calendrier-reperes)` — engine: `choice-engine`, type=factual-qcm, category=ce1-calendrier-reperes, dataFile=data/history_ce1.json, questions=8

#### Vivre autrefois `(ce1-histoire-vie-autrefois-subtheme)`

- **Leçons** (1) :
  - L'école d'autrefois `(ce1-lesson-ecole-autrefois)` — blocs: paragraph
- **Exercices** (3) :
  - Vivre autrefois `(ce1-histoire-vie-autrefois)` — engine: `choice-engine`, type=factual-qcm, category=ce1-vie-autrefois, dataFile=data/history_ce1.json, questions=6
  - Défi : vivre autrefois `(ce1-bonus-histoire-vie-autrefois-defi)` — engine: `choice-engine`, type=factual-qcm, category=ce1-vie-autrefois, dataFile=data/history_ce1.json, questions=9, bonus (seuil=2)
  - L'école d'autrefois `(ce1-histoire-ecole-autrefois)` — engine: `choice-engine`, type=factual-qcm, category=ce1-ecole-autrefois, dataFile=data/history_ce1.json, questions=6

#### Monuments et personnages `(ce1-histoire-monuments-subtheme)`

- **Leçons** (2) :
  - Les monuments et les personnages `(ce1-lesson-monuments-personnages)` — blocs: paragraph, example, bullets, tip
  - Les traces du passé `(ce1-lesson-traces-passe)` — blocs: paragraph
- **Exercices** (2) :
  - Monuments et personnages `(ce1-histoire-monuments)` — engine: `choice-engine`, type=factual-qcm, category=ce1-monuments-personnages, dataFile=data/history_ce1.json, questions=6
  - Monuments du passé `(ce1-histoire-monuments-passe)` — engine: `choice-engine`, type=factual-qcm, category=ce1-monuments-personnages, dataFile=data/history_ce1.json, questions=8

#### Objets du passé `(ce1-histoire-objets-subtheme)`

- **Leçons** (1) :
  - Les objets du passé `(ce1-lesson-objets-passe)` — blocs: paragraph
- **Exercices** (6) :
  - Objets du passé `(ce1-histoire-objets-passe)` — engine: `choice-engine`, type=factual-qcm, category=ce1-objets-passe, dataFile=data/history_ce1.json, questions=6
  - Comparer les objets `(ce1-histoire-comparer-objets)` — engine: `choice-engine`, type=factual-qcm, category=ce1-objets-passe, dataFile=data/history_ce1.json, questions=8
  - Souvenirs de famille `(ce1-histoire-souvenirs-famille)` — engine: `choice-engine`, type=factual-qcm, category=ce1-souvenirs-famille, dataFile=data/history_ce1.json, questions=6
  - Mémoire de famille `(ce1-histoire-memoire-famille)` — engine: `choice-engine`, type=factual-qcm, category=ce1-memoire-famille, dataFile=data/history_ce1.json, questions=6
  - Objets et usages d'autrefois `(ce1-histoire-appariement)` — engine: `matching`, category=matching_histoire_ce1, dataFile=data/history_matching.json, questions=2
  - Défi : objets du passé en détail `(ce1-bonus-histoire-objets-passe-expert)` — engine: `choice-engine`, type=factual-qcm, category=ce1-objets-passe, dataFile=data/history_ce1.json, questions=10, bonus (seuil=2)

### Questionner l'espace (ce1-geographie-subject)

#### Se repérer `(ce1-geo-reperage-subtheme)`

- **Leçons** (2) :
  - Se repérer à l'école `(ce1-lesson-se-reperer-ecole)` — blocs: paragraph, example, bullets, tip
  - La commune `(ce1-lesson-commune)` — blocs: paragraph, example, bullets, tip
- **Exercices** (7) :
  - Se repérer `(ce1-geo-reperage)` — engine: `choice-engine`, type=factual-qcm, category=ce1-reperage, dataFile=data/geography_ce1.json, questions=6
  - Plan du quartier `(ce1-geo-plan-quartier)` — engine: `choice-engine`, type=factual-qcm, category=ce1-plan-quartier, dataFile=data/geography_ce1.json, questions=6
  - Lire la légende `(ce1-geo-legende)` — engine: `choice-engine`, type=factual-qcm, category=ce1-legende-simple, dataFile=data/geography_ce1.json, questions=6
  - Lieux publics `(ce1-geo-lieux-publics)` — engine: `choice-engine`, type=factual-qcm, category=ce1-lieux-publics, dataFile=data/geography_ce1.json, questions=6
  - Services du quartier `(ce1-geo-services-quartier)` — engine: `choice-engine`, type=factual-qcm, category=ce1-services-quartier, dataFile=data/geography_ce1.json, questions=6
  - Carte de France `(ce1-geo-carte-regions)` — engine: `board-interactive`, type=map-locate, category=ce1_map_regions_france, dataFile=data/board_map_locate_ce1.json, mapFile=data/maps/france-regions.svg, mapId=france-regions, questions=4
  - Défi : super repérage `(ce1-bonus-geo-reperage-expert)` — engine: `choice-engine`, type=factual-qcm, category=ce1-reperage, dataFile=data/geography_ce1.json, questions=10, bonus (seuil=2)

#### Paysages `(ce1-geo-paysages-subtheme)`

- **Leçons** (1) :
  - Observer un paysage `(ce1-lesson-paysages-du-quotidien)` — blocs: paragraph
- **Exercices** (3) :
  - Paysages `(ce1-geo-paysages)` — engine: `choice-engine`, type=factual-qcm, category=ce1-paysages, dataFile=data/geography_ce1.json, questions=6
  - Reconnaître les paysages `(ce1-geo-reconnaitre-paysages)` — engine: `choice-engine`, type=factual-qcm, category=ce1-paysages, dataFile=data/geography_ce1.json, questions=8
  - Lieux et paysages `(ce1-geo-appariement)` — engine: `matching`, category=matching_geo_ce1, dataFile=data/geography_matching.json, questions=2

#### France et transports `(ce1-geo-transports-subtheme)`

- **Leçons** (1) :
  - Se déplacer en France `(ce1-lesson-transports-france)` — blocs: paragraph
- **Exercices** (3) :
  - France et transports `(ce1-geo-transports)` — engine: `choice-engine`, type=factual-qcm, category=ce1-transports-france, dataFile=data/geography_ce1.json, questions=6
  - Se déplacer en France `(ce1-geo-se-deplacer-france)` — engine: `choice-engine`, type=factual-qcm, category=ce1-transports-france, dataFile=data/geography_ce1.json, questions=8
  - Trajets du quotidien `(ce1-geo-trajets-quotidiens)` — engine: `choice-engine`, type=factual-qcm, category=ce1-trajets-quotidiens, dataFile=data/geography_ce1.json, questions=8

### Questionner le vivant et la matière (ce1-sciences-subject)

#### Le vivant `(ce1-sciences-vivant-subtheme)`

- **Leçons** (1) :
  - Le vivant a des besoins `(ce1-lesson-vivant-besoins)` — blocs: paragraph
- **Exercices** (6) :
  - Le vivant `(ce1-sciences-vivant)` — engine: `choice-engine`, type=factual-qcm, category=ce1-vivant, dataFile=data/science_ce1.json, questions=6
  - Besoins du vivant `(ce1-sciences-besoins-vivant)` — engine: `choice-engine`, type=factual-qcm, category=ce1-besoins-vivant, dataFile=data/science_ce1.json, questions=6
  - Cycle de vie simple `(ce1-sciences-cycle-vie)` — engine: `choice-engine`, type=factual-qcm, category=ce1-cycle-vie-simple, dataFile=data/science_ce1.json, questions=6
  - Les parties de la plante `(ce1-sciences-tap-plante)` — engine: `board-interactive`, type=tap-features, category=ce1_tap_plante, dataFile=data/board_tap_features_science.json, questions=4
  - Êtres vivants et besoins `(ce1-sciences-appariement)` — engine: `matching`, category=matching_sciences_ce1, dataFile=data/science_matching.json, questions=2
  - Défi : le vivant en détail `(ce1-bonus-sciences-vivant-expert)` — engine: `choice-engine`, type=factual-qcm, category=ce1-vivant, dataFile=data/science_ce1.json, questions=10, bonus (seuil=2)

#### Matière `(ce1-sciences-matiere-subtheme)`

- **Leçons** (1) :
  - Les états de la matière `(ce1-lesson-matiere-eau-lumiere)` — blocs: paragraph
- **Exercices** (4) :
  - Matière `(ce1-sciences-matiere)` — engine: `choice-engine`, type=factual-qcm, category=ce1-matiere, dataFile=data/science_ce1.json, questions=6
  - Les états de l'eau `(ce1-sciences-etats-eau)` — engine: `choice-engine`, type=factual-qcm, category=ce1-etats-eau, dataFile=data/science_ce1.json, questions=6
  - Mélanges simples `(ce1-sciences-melanges)` — engine: `choice-engine`, type=factual-qcm, category=ce1-melanges-simples, dataFile=data/science_ce1.json, questions=6
  - Défi : mélanges simples `(ce1-bonus-sciences-melanges-defi)` — engine: `choice-engine`, type=factual-qcm, category=ce1-melanges-simples, dataFile=data/science_ce1.json, questions=10, bonus (seuil=2)

#### Corps et hygiène `(ce1-sciences-corps-subtheme)`

- **Leçons** (2) :
  - Prendre soin de son corps `(ce1-lesson-prendre-soin-corps)` — blocs: paragraph, example, bullets, tip
  - Les cinq sens `(ce1-lesson-cinq-sens)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Corps et hygiène `(ce1-sciences-corps)` — engine: `choice-engine`, type=factual-qcm, category=ce1-corps-hygiene, dataFile=data/science_ce1.json, questions=6
  - Prendre soin de son corps `(ce1-sciences-prendre-soin-corps)` — engine: `choice-engine`, type=factual-qcm, category=ce1-corps-hygiene, dataFile=data/science_ce1.json, questions=8
  - Sommeil et alimentation `(ce1-sciences-sommeil-alimentation)` — engine: `choice-engine`, type=factual-qcm, category=ce1-sommeil-alimentation, dataFile=data/science_ce1.json, questions=8
  - Hygiène quotidienne `(ce1-sciences-hygiene-quotidienne)` — engine: `choice-engine`, type=factual-qcm, category=ce1-hygiene-quotidienne, dataFile=data/science_ce1.json, questions=6
  - Objets de la maison `(ce1-sciences-objets-maison)` — engine: `choice-engine`, type=factual-qcm, category=ce1-objets-maison, dataFile=data/science_ce1.json, questions=6
  - Défi : super hygiène `(ce1-bonus-sciences-corps-expert)` — engine: `choice-engine`, type=factual-qcm, category=ce1-corps-hygiene, dataFile=data/science_ce1.json, questions=10, bonus (seuil=2)

#### Saisons et météo `(ce1-sciences-saisons-subtheme)`

- **Leçons** (2) :
  - Le cycle des quatre saisons `(ce1-lesson-quatre-saisons)` — blocs: paragraph, example, bullets, tip
  - Les phénomènes météo `(ce1-lesson-phenomenes-meteo)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Les saisons de l'année `(ce1-sciences-saisons-annee)` — engine: `choice-engine`, type=factual-qcm, category=ce1-saisons-meteo, dataFile=data/science_ce1.json, questions=6
  - Observer la météo `(ce1-sciences-observer-meteo)` — engine: `choice-engine`, type=factual-qcm, category=ce1-saisons-meteo, dataFile=data/science_ce1.json, questions=8
  - Climat et activités `(ce1-sciences-climat-activites)` — engine: `choice-engine`, type=factual-qcm, category=ce1-saisons-meteo, dataFile=data/science_ce1.json, questions=6
  - Défi : super saisons et météo `(ce1-bonus-sciences-saisons-expert)` — engine: `choice-engine`, type=factual-qcm, category=ce1-saisons-meteo, dataFile=data/science_ce1.json, questions=10, bonus (seuil=2)

#### Les milieux de vie `(ce1-sciences-milieux-subtheme)`

- **Leçons** (2) :
  - Qu'est-ce qu'un milieu de vie ? `(ce1-lesson-milieu-de-vie)` — blocs: paragraph, example, bullets, tip
  - Des milieux de vie en France `(ce1-lesson-milieux-france)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Les milieux de vie `(ce1-sciences-milieux-vie)` — engine: `choice-engine`, type=factual-qcm, category=ce1-milieux-vie, dataFile=data/science_ce1.json, questions=6
  - Qui vit où ? `(ce1-sciences-qui-vit-ou)` — engine: `choice-engine`, type=factual-qcm, category=ce1-milieux-vie, dataFile=data/science_ce1.json, questions=8
  - S'adapter à son milieu `(ce1-sciences-sadapter-milieu)` — engine: `choice-engine`, type=factual-qcm, category=ce1-milieux-vie, dataFile=data/science_ce1.json, questions=6
  - Défi : super milieux de vie `(ce1-bonus-sciences-milieux-expert)` — engine: `choice-engine`, type=factual-qcm, category=ce1-milieux-vie, dataFile=data/science_ce1.json, questions=10, bonus (seuil=2)

#### Objets et matériaux `(ce1-sciences-objets-subtheme)`

- **Leçons** (2) :
  - Les objets techniques simples `(ce1-lesson-objets-techniques)` — blocs: paragraph, example, bullets, tip
  - Les propriétés des matériaux `(ce1-lesson-proprietes-materiaux)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Les objets techniques `(ce1-sciences-objets-techniques)` — engine: `choice-engine`, type=factual-qcm, category=ce1-objets-materiaux, dataFile=data/science_ce1.json, questions=6
  - Propriétés des matériaux `(ce1-sciences-proprietes-materiaux)` — engine: `choice-engine`, type=factual-qcm, category=ce1-objets-materiaux, dataFile=data/science_ce1.json, questions=8
  - Bien choisir son matériau `(ce1-sciences-choisir-materiau)` — engine: `choice-engine`, type=factual-qcm, category=ce1-objets-materiaux, dataFile=data/science_ce1.json, questions=6

### EMC (ce1-emc-subject)

#### Règles communes `(ce1-emc-regles-subtheme)`

- **Leçons** (2) :
  - Les règles de la classe `(ce1-lesson-regles-communes)` — blocs: paragraph, example, bullets, tip
  - Les rôles dans la classe `(ce1-lesson-roles-classe)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Règles communes `(ce1-emc-regles)` — engine: `choice-engine`, type=factual-qcm, category=ce1-regles, dataFile=data/emc_ce1.json, questions=6
  - Être responsable `(ce1-emc-responsabilites)` — engine: `choice-engine`, type=factual-qcm, category=ce1-responsabilites-eleve, dataFile=data/emc_ce1.json, questions=6
  - Rôles dans la classe `(ce1-emc-roles-classe)` — engine: `choice-engine`, type=factual-qcm, category=ce1-roles-classe, dataFile=data/emc_ce1.json, questions=8
  - Règles et valeurs `(ce1-emc-appariement)` — engine: `matching`, category=matching_emc_ce1, dataFile=data/emc_matching.json, questions=3
  - Émotions et attitudes `(ce1-emc-appariement-2)` — engine: `matching`, category=matching_emc_ce1, dataFile=data/emc_matching.json, questions=3
  - Défi : super règles de classe `(ce1-bonus-emc-regles-expert)` — engine: `choice-engine`, type=factual-qcm, category=ce1-regles, dataFile=data/emc_ce1.json, questions=10, bonus (seuil=2)

#### Être citoyen `(ce1-emc-citoyen-subtheme)`

- **Leçons** (1) :
  - Être citoyen `(ce1-lesson-citoyen-honnetete)` — blocs: paragraph
- **Exercices** (4) :
  - Être citoyen `(ce1-emc-citoyen)` — engine: `choice-engine`, type=factual-qcm, category=ce1-citoyen, dataFile=data/emc_ce1.json, questions=6
  - Défi : être citoyen `(ce1-bonus-emc-citoyen-defi)` — engine: `choice-engine`, type=factual-qcm, category=ce1-citoyen, dataFile=data/emc_ce1.json, questions=9, bonus (seuil=2)
  - Émotions et respect `(ce1-emc-emotions-respect)` — engine: `choice-engine`, type=factual-qcm, category=ce1-emotions-respect, dataFile=data/emc_ce1.json, questions=6
  - Dialogue et politesse `(ce1-emc-dialogue-politesse)` — engine: `choice-engine`, type=factual-qcm, category=ce1-dialogue-politesse, dataFile=data/emc_ce1.json, questions=6

#### Entraide et respect `(ce1-emc-entraide-subtheme)`

- **Leçons** (1) :
  - Entraide et respect `(ce1-lesson-entraide-respect)` — blocs: paragraph
- **Exercices** (2) :
  - Entraide et respect `(ce1-emc-entraide)` — engine: `choice-engine`, type=factual-qcm, category=ce1-entraide-respect, dataFile=data/emc_ce1.json, questions=6
  - S'entraider au quotidien `(ce1-emc-sentraider-quotidien)` — engine: `choice-engine`, type=factual-qcm, category=ce1-entraide-respect, dataFile=data/emc_ce1.json, questions=8


---

## CE2

### Mathématiques (ce2-maths)

#### Tables de multiplication `(ce2-multiplication)`

- **Leçons** (1) :
  - Comprendre la multiplication `(ce2-lesson-comprendre-multiplication)` — blocs: paragraph, example, bullets, tip
- **Exercices** (13) :
  - Table de 2 `(ce2-m2)` — engine: `math-input`, type=mult, questions=10
  - Table de 3 `(ce2-m3)` — engine: `math-input`, type=mult, questions=10
  - Table de 4 `(ce2-m4)` — engine: `math-input`, type=mult, questions=10
  - Table de 5 `(ce2-m5)` — engine: `math-input`, type=mult, questions=10
  - Table de 6 `(ce2-m6)` — engine: `math-input`, type=mult, questions=10
  - Table de 7 `(ce2-m7)` — engine: `math-input`, type=mult, questions=10
  - Table de 8 `(ce2-m8)` — engine: `math-input`, type=mult, questions=10
  - Table de 9 `(ce2-m9)` — engine: `math-input`, type=mult, questions=10
  - Table de 10 `(ce2-m10)` — engine: `math-input`, type=mult, questions=10
  - Table de 11 `(ce2-m11)` — engine: `math-input`, type=mult, questions=10
  - Table de 12 `(ce2-m12)` — engine: `math-input`, type=mult, questions=10
  - Tables de multiplication `(ce2-maths-tables-appariement)` — engine: `matching`, category=matching_math_ce2, dataFile=data/math_matching.json, questions=3
  - Défi : toutes les tables `(ce2-bonus-tables-melangees)` — engine: `math-input`, type=mult, questions=15, bonus (seuil=2)

#### Calculs & Logique `(ce2-calculs-logique)`

- **Leçons** (7) :
  - Chercher le complément `(ce2-lesson-complements-1000)` — blocs: paragraph, example, bullets, tip
  - Lire l'heure `(ce2-lesson-lire-horloge)` — blocs: paragraph, example, mini-table, tip
  - Partager en parts égales `(ce2-lesson-partages-egaux)` — blocs: paragraph, example, bullets, tip
  - Doubles et moitiés `(ce2-lesson-doubles-moities)` — blocs: paragraph, example, bullets, tip
  - Les longueurs `(ce2-lesson-longueurs)` — blocs: paragraph, example, bullets, tip
  - Les formes planes `(ce2-lesson-formes-planes)` — blocs: paragraph, example, bullets, tip
  - Masses et contenances `(ce2-lesson-masses-contenances)` — blocs: paragraph, example, mini-table, tip
- **Exercices** (16) :
  - Le Compte est bon `(ce2-cible-1)` — engine: `math-input`, type=cibles, questions=5
  - Carré Magique `(ce2-carre-magique-1)` — engine: `math-input`, type=carre-somme, questions=6, targetMin=15, targetMax=25, solutionCount=3, gridSize=9
  - Défi : Carré Magique Expert `(ce2-bonus-carre-magique-defi)` — engine: `math-input`, type=carre-somme, questions=6, targetMin=25, targetMax=35, solutionCount=3, gridSize=9, bonus (seuil=2)
  - Compléments à 100 `(ce2-comp-100)` — engine: `math-input`, type=complement, questions=10
  - L'Horloge `(ce2-clock)` — engine: `clock`, questions=5
  - Compléments à 1000 `(ce2-comp-1000)` — engine: `math-input`, type=complement, questions=10
  - Comparer < 1000 `(ce2-comp-1000-compare)` — engine: `choice-engine`, questions=10
  - Compléments à 500 `(ce2-comp-500)` — engine: `math-input`, type=complement, questions=10
  - Compléments à 2000 `(ce2-comp-2000)` — engine: `math-input`, type=complement, questions=10
  - L'horloge (2) `(ce2-clock-2)` — engine: `clock`, questions=8
  - Problèmes additifs `(ce2-problemes-additifs)` — engine: `choice-engine`, type=factual-qcm, category=ce2-problemes-additifs, dataFile=data/math_word_problems_cycle3.json, questions=8
  - Problèmes multiplicatifs `(ce2-problemes-multiplicatifs)` — engine: `choice-engine`, type=factual-qcm, category=ce2-problemes-multiplicatifs, dataFile=data/math_word_problems_cycle3.json, questions=8
  - Défi : problèmes en rafale `(ce2-bonus-problemes-expert)` — engine: `choice-engine`, type=factual-qcm, category=ce2-problemes-multiplicatifs, dataFile=data/math_word_problems_cycle3.json, questions=10, bonus (seuil=2)
  - Convertir des masses `(ce2-conversions-masses)` — engine: `conversion`, questions=6
  - Convertir des contenances `(ce2-conversions-contenances)` — engine: `conversion`, questions=6
  - Défi : compléments à 5000 `(ce2-bonus-comp-5000)` — engine: `math-input`, type=complement, questions=12, bonus (seuil=2)

#### Géométrie `(ce2-geometrie-subtheme)`

- **Leçons** (3) :
  - Figures planes et solides `(ce2-lesson-figures-solides)` — blocs: paragraph, example, bullets, tip
  - L'angle droit et l'équerre `(ce2-lesson-angle-droit-equerre)` — blocs: paragraph, example, bullets, tip
  - Symétrie et quadrillage `(ce2-lesson-symetrie-quadrillage)` — blocs: paragraph, example, bullets, tip
- **Exercices** (9) :
  - Figures et solides `(ce2-geo-figures-solides)` — engine: `choice-engine`, type=factual-qcm, category=ce2-figures-proprietes, dataFile=data/math_geometry_ce2.json, questions=8
  - L'angle droit `(ce2-geo-angle-droit)` — engine: `choice-engine`, type=factual-qcm, category=ce2-angle-droit-equerre, dataFile=data/math_geometry_ce2.json, questions=8
  - Touche les angles droits `(ce2-geo-angle-droit-pratique)` — engine: `board-interactive`, type=tap-features, category=ce2_tap_angle_droit, dataFile=data/board_tap_features_ce2.json, questions=4
  - Symétrie et quadrillage `(ce2-geo-symetrie-quadrillage)` — engine: `choice-engine`, type=factual-qcm, category=ce2-symetrie-quadrillage, dataFile=data/math_geometry_ce2.json, questions=8
  - Complète la figure symétrique `(ce2-geo-symetrie-pratique)` — engine: `board-interactive`, type=symmetry-complete, category=ce2_symmetry_complete, dataFile=data/board_symmetry_complete_ce2.json, questions=4
  - Place le point sur le quadrillage `(ce2-geo-reperage-pratique)` — engine: `board-interactive`, type=point-on-grid, category=ce2_point_on_grid, dataFile=data/board_point_on_grid_ce2.json, questions=6
  - Figures et propriétés `(ce2-maths-geo-appariement)` — engine: `matching`, category=matching_math_ce2, dataFile=data/math_matching.json, questions=3
  - Jeu de mémoire `(ce2-maths-memoire)` — engine: `board-interactive`, type=memory-match, category=ce2_memory_match, dataFile=data/board_memory_match_ce2.json, questions=5
  - Défi : symétrie et quadrillage `(ce2-bonus-geo-symetrie)` — engine: `choice-engine`, type=factual-qcm, category=ce2-symetrie-quadrillage, dataFile=data/math_geometry_ce2.json, questions=12, bonus (seuil=2)

### Français (ce2-francais)

#### Orthographe & Grammaire `(ce2-orthographe-grammaire)`

- **Leçons** (3) :
  - Choisir le bon homophone `(ce2-lesson-homophones-reperes)` — blocs: paragraph, example, bullets, tip
  - Accorder le groupe nominal `(ce2-lesson-accord-groupe-nominal)` — blocs: paragraph, example, bullets, tip
  - La phrase et la ponctuation `(ce2-lesson-phrase-ponctuation)` — blocs: paragraph, example, bullets, tip
- **Exercices** (21) :
  - Et ou Est ? `(ce2-h-et)` — engine: `choice-engine`, type=homophone-duel, category=et_est, questions=8
  - A ou à ? `(ce2-h-a)` — engine: `choice-engine`, type=homophone-duel, category=a_à, questions=8
  - Son ou Sont ? `(ce2-h-son)` — engine: `choice-engine`, type=homophone-duel, category=son_sont, questions=8
  - On ou Ont ? `(ce2-h-on)` — engine: `choice-engine`, type=homophone-duel, category=on_ont, questions=8
  - Ou ou Où ? `(ce2-h-ou)` — engine: `choice-engine`, type=homophone-duel, category=ou_où, questions=8
  - Ce ou Se ? `(ce2-h-ce)` — engine: `choice-engine`, type=homophone-duel, category=ce_se, questions=8
  - Ces ou Ses ? `(ce2-h-ces)` — engine: `choice-engine`, type=homophone-duel, category=ces_ses, questions=8
  - Un ou Une ? `(ce2-g-un-une)` — engine: `choice-engine`, type=gender-articles, category=gender_ce2_objets, questions=8
  - Le, La ou L' ? `(ce2-g-le-la)` — engine: `choice-engine`, type=gender-articles, category=gender_ce2_elision, questions=8
  - Articles malins `(ce2-g-mixte)` — engine: `choice-engine`, type=gender-articles, category=gender_ce2_mixte, questions=8
  - Le bon article `(ce2-g-article-qcm)` — engine: `choice-engine`, type=article-choice, category=article_choice_ce2, questions=8
  - Singulier ou pluriel ? `(ce2-g-pluriel-qcm)` — engine: `choice-engine`, type=plural-choice, category=plural_choice_ce2, questions=8
  - Nom, verbe ou adjectif `(ce2-g-nature-qcm)` — engine: `choice-engine`, type=word-class-choice, category=word_class_choice_ce2, questions=8
  - Le bon déterminant `(ce2-g-cloze-det)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_cloze_ce2, questions=8
  - Écris le bon mot `(ce2-g-cloze-ecrit)` — engine: `cloze-fill-in`, category=grammar_cloze_ce2, questions=6
  - Accorder dans la phrase `(ce2-g-cloze-accord)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_agreement_ce2, questions=8
  - Le pluriel dans la phrase `(ce2-g-cloze-pluriel)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_plural_ce2, questions=8
  - Un ou Une ? (objets) `(ce2-g-objets)` — engine: `choice-engine`, type=gender-articles, category=gender_ce2_objets, questions=8
  - Le, La ou L' ? (2) `(ce2-g-elision)` — engine: `choice-engine`, type=gender-articles, category=gender_ce2_elision, questions=8
  - Ordre des mots `(ce2-francais-ordre-mots)` — engine: `word-order`, category=word_order_ce2, dataFile=data/french_word_order.json, questions=5
  - Défi : phrases mélangées `(ce2-bonus-ordre-mots-expert)` — engine: `word-order`, category=word_order_ce2, dataFile=data/french_word_order.json, questions=10, bonus (seuil=2)

#### Conjugaison `(ce2-conjugaison-subject)`

- **Leçons** (2) :
  - Le verbe aller au présent `(ce2-lesson-se-deplacer)` — blocs: paragraph, mini-table, example, tip
  - Être et avoir au présent `(ce2-lesson-etre-avoir-present)` — blocs: paragraph, mini-table, example, tip
- **Exercices** (11) :
  - Rappel : Le Présent `(ce2-conj-pres-all)` — engine: `conjugation`, category=present_1, questions=10
  - Futur : Être et Avoir `(ce2-conj-etre-avoir-futur)` — engine: `conjugation`, category=etre_avoir_f, questions=6
  - Futur : Verbes en -ER `(ce2-conj-futur-er)` — engine: `conjugation`, category=future_1, questions=8
  - Imparfait : Auxiliaires `(ce2-conj-imp-ea)` — engine: `conjugation`, category=etre_avoir_imp, questions=6
  - Imparfait : Verbes en -ER `(ce2-conj-imp-er)` — engine: `conjugation`, category=imparfait_1, questions=8
  - Défi : Présent ou Futur ? `(ce2-conj-defi-temps)` — engine: `conjugation`, category=future_1, questions=10
  - Le 3ème groupe (1) `(ce2-conj-p3-freq)` — engine: `conjugation`, category=present_3_ce2_a, questions=8
  - Le 3ème groupe (2) `(ce2-conj-p3-pouvoir)` — engine: `conjugation`, category=present_3_ce2_b, questions=8
  - Présent : être et avoir `(ce2-conj-present-ea)` — engine: `conjugation`, category=etre_avoir_p, questions=8
  - Présent : 2e groupe `(ce2-conj-present-2g)` — engine: `conjugation`, category=present_2, questions=8
  - Défi : présent, futur, imparfait `(ce2-bonus-conj-trois-temps)` — engine: `conjugation`, category=future_1, questions=12, bonus (seuil=2)

#### Lecture et vocabulaire `(ce2-lecture-vocabulaire-subtheme)`

- **Leçons** (4) :
  - Comprendre un texte court `(ce2-lesson-comprendre-texte-court)` — blocs: paragraph, example, bullets, tip
  - Comprendre le sens d'un mot `(ce2-lesson-vocabulaire-sens-mot)` — blocs: paragraph, example, bullets, tip
  - Ranger les mots par thème `(ce2-lesson-ranger-mots-theme)` — blocs: paragraph, example, bullets, tip
  - Le champ lexical `(ce2-lesson-champ-lexical)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Trouver l'idée principale `(ce2-lecture-idee-principale)` — engine: `reading`, category=ce2_lecture_idee_principale, questions=5
  - Comprendre le sens d'un mot `(ce2-vocabulaire-sens-mot)` — engine: `reading`, category=ce2_vocabulaire_sens, questions=5
  - Le champ lexical `(ce2-vocabulaire-champ-lexical)` — engine: `reading`, category=ce2_vocabulaire_champ_lexical, questions=6
  - Associe les contraires `(ce2-vocab-appariement)` — engine: `matching`, category=matching_contraires_ce2, dataFile=data/french/matching.json, questions=2
  - Défi : super lecteur `(ce2-bonus-lecture-idee-principale)` — engine: `reading`, category=ce2_lecture_idee_principale, questions=8, bonus (seuil=2)

#### Dictée audio `(ce2-dictee-audio-subtheme)`

- **Leçons** (1) :
  - Bien écouter pour bien écrire `(ce2-lesson-ecoute-attentive)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Les animaux `(ce2-audio-animaux)` — engine: `audio-spelling`, category=animals, questions=6
  - L'école `(ce2-audio-ecole)` — engine: `audio-spelling`, category=school, questions=6
  - La maison `(ce2-audio-maison)` — engine: `audio-spelling`, category=house, questions=6

### Questionner le temps (ce2-histoire-subject)

#### Repères `(ce2-histoire-reperes-subtheme)`

- **Leçons** (1) :
  - Situer les événements dans le temps `(ce2-lesson-situer-temps)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Repères `(ce2-histoire-reperes)` — engine: `choice-engine`, type=factual-qcm, category=ce2-reperes, dataFile=data/history_ce2.json, questions=8
  - Situer dans le temps `(ce2-histoire-situer-temps)` — engine: `choice-engine`, type=factual-qcm, category=ce2-reperes, dataFile=data/history_ce2.json, questions=8

#### Autrefois `(ce2-histoire-vie-subtheme)`

- **Leçons** (2) :
  - Comparer autrefois et aujourd'hui `(ce2-lesson-comparer-autrefois)` — blocs: paragraph, example, bullets, tip
  - Les objets du passé `(ce2-lesson-objets-passe)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Autrefois `(ce2-histoire-vie)` — engine: `choice-engine`, type=factual-qcm, category=ce2-vie-autrefois, dataFile=data/history_ce2.json, questions=8
  - Comparer la vie d'autrefois `(ce2-histoire-comparer-autrefois)` — engine: `choice-engine`, type=factual-qcm, category=ce2-vie-autrefois, dataFile=data/history_ce2.json, questions=8

#### Monuments et personnages `(ce2-histoire-monuments-subtheme)`

- **Leçons** (1) :
  - Les traces du passé `(ce2-lesson-traces-passe)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Monuments et personnages `(ce2-histoire-monuments)` — engine: `choice-engine`, type=factual-qcm, category=ce2-personnages-monuments, dataFile=data/history_ce2.json, questions=6
  - Personnages célèbres `(ce2-histoire-personnages-celebres)` — engine: `choice-engine`, type=factual-qcm, category=ce2-personnages-celebres, dataFile=data/history_ce2.json, questions=6
  - Souvenirs et monuments `(ce2-histoire-souvenirs-monuments)` — engine: `choice-engine`, type=factual-qcm, category=ce2-souvenirs-monuments, dataFile=data/history_ce2.json, questions=6
  - Repères et personnages `(ce2-histoire-appariement)` — engine: `matching`, category=matching_histoire_ce2, dataFile=data/history_matching.json, questions=2
  - Défi : grands personnages `(ce2-bonus-histoire-personnages)` — engine: `choice-engine`, type=factual-qcm, category=ce2-personnages-celebres, dataFile=data/history_ce2.json, questions=10, bonus (seuil=2)

#### L'école d'autrefois `(ce2-histoire-ecole-subtheme)`

- **Leçons** (1) :
  - L'école d'autrefois `(ce2-lesson-ecole-autrefois)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - L'école d'autrefois `(ce2-histoire-ecole-autrefois)` — engine: `choice-engine`, type=factual-qcm, category=ce2-ecole-autrefois, dataFile=data/history_ce2.json, questions=6
  - Écrire et apprendre autrefois `(ce2-histoire-apprendre-autrefois)` — engine: `choice-engine`, type=factual-qcm, category=ce2-ecole-autrefois, dataFile=data/history_ce2.json, questions=8
  - Frise de vie `(ce2-histoire-frise-vie-famille)` — engine: `choice-engine`, type=factual-qcm, category=ce2-frise-vie-famille, dataFile=data/history_ce2.json, questions=6
  - Objets de l'école d'autrefois `(ce2-histoire-ecole-appariement)` — engine: `matching`, category=matching_histoire_ce2, dataFile=data/history_matching.json, questions=2
  - Défi : l'école autrefois `(ce2-bonus-histoire-ecole)` — engine: `choice-engine`, type=factual-qcm, category=ce2-ecole-autrefois, dataFile=data/history_ce2.json, questions=10, bonus (seuil=2)

### Questionner l'espace (ce2-geographie-subject)

#### Espaces `(ce2-geo-espaces-subtheme)`

- **Leçons** (2) :
  - Habiter des espaces différents `(ce2-lesson-habiter-espaces-differents)` — blocs: paragraph, example, bullets, tip
  - La commune et ses services `(ce2-lesson-commune-services)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Espaces `(ce2-geo-espaces)` — engine: `choice-engine`, type=factual-qcm, category=ce2-espaces, dataFile=data/geography_ce2.json, questions=8
  - Habiter et activités `(ce2-geo-habiter)` — engine: `choice-engine`, type=factual-qcm, category=ce2-habiter-activites, dataFile=data/geography_ce2.json, questions=6
  - Services de la commune `(ce2-geo-services-commune)` — engine: `choice-engine`, type=factual-qcm, category=ce2-services-commune, dataFile=data/geography_ce2.json, questions=6
  - Cartes du quartier `(ce2-geo-cartes-quartier)` — engine: `choice-engine`, type=factual-qcm, category=ce2-cartes-quartier, dataFile=data/geography_ce2.json, questions=6
  - Espaces et activités `(ce2-geo-appariement)` — engine: `matching`, category=matching_geo_ce2, dataFile=data/geography_matching.json, questions=2
  - Défi : ville, campagne et services `(ce2-bonus-geo-espaces)` — engine: `choice-engine`, type=factual-qcm, category=ce2-espaces, dataFile=data/geography_ce2.json, questions=12, bonus (seuil=2)

#### La France `(ce2-geo-france-subtheme)`

- **Leçons** (1) :
  - Lire une carte de France `(ce2-lesson-lire-carte-france)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - La France `(ce2-geo-france)` — engine: `choice-engine`, type=factual-qcm, category=ce2-france, dataFile=data/geography_ce2.json, questions=8
  - Reliefs simples `(ce2-geo-reliefs)` — engine: `choice-engine`, type=factual-qcm, category=ce2-reliefs-simples, dataFile=data/geography_ce2.json, questions=6
  - Carte des régions `(ce2-geo-carte-regions)` — engine: `board-interactive`, type=map-locate, category=ce2_map_regions_france, dataFile=data/board_map_locate_ce2.json, mapFile=data/maps/france-regions.svg, mapId=france-regions, questions=6

#### Se repérer `(ce2-geo-reperage-subtheme)`

- **Leçons** (2) :
  - Lire une carte simple `(ce2-lesson-lire-carte-simple)` — blocs: paragraph, example, bullets, tip
  - Le plan du quartier `(ce2-lesson-plan-quartier)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Se repérer `(ce2-geo-reperage)` — engine: `choice-engine`, type=factual-qcm, category=ce2-se-reperer, dataFile=data/geography_ce2.json, questions=6
  - Plan et repères `(ce2-geo-plan-reperes)` — engine: `choice-engine`, type=factual-qcm, category=ce2-se-reperer, dataFile=data/geography_ce2.json, questions=8
  - Cartes et symboles `(ce2-geo-cartes-symboles)` — engine: `choice-engine`, type=factual-qcm, category=ce2-cartes-symboles, dataFile=data/geography_ce2.json, questions=8
  - Symboles et légendes `(ce2-geo-reperage-appariement)` — engine: `matching`, category=matching_geo_ce2, dataFile=data/geography_matching.json, questions=2
  - Défi : super cartographe `(ce2-bonus-geo-reperage)` — engine: `choice-engine`, type=factual-qcm, category=ce2-se-reperer, dataFile=data/geography_ce2.json, questions=12, bonus (seuil=2)

#### Transports `(ce2-geo-transports-subtheme)`

- **Leçons** (1) :
  - Se déplacer selon les lieux `(ce2-lesson-choisir-transport)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Transports `(ce2-geo-transports)` — engine: `choice-engine`, type=factual-qcm, category=ce2-transports, dataFile=data/geography_ce2.json, questions=6
  - Voyager et se déplacer `(ce2-geo-voyager-deplacer)` — engine: `choice-engine`, type=factual-qcm, category=ce2-transports, dataFile=data/geography_ce2.json, questions=8

### Questionner le vivant et la matière (ce2-sciences-subject)

#### Le vivant `(ce2-sciences-vivant-subtheme)`

- **Leçons** (2) :
  - Les besoins des êtres vivants `(ce2-lesson-besoins-vivant)` — blocs: paragraph, example, bullets, tip
  - Les cinq sens `(ce2-lesson-cinq-sens)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Le vivant `(ce2-sciences-vivant)` — engine: `choice-engine`, type=factual-qcm, category=ce2-vivant, dataFile=data/science_ce2.json, questions=8
  - Grandir et se nourrir `(ce2-sciences-grandir-nourrir)` — engine: `choice-engine`, type=factual-qcm, category=ce2-vivant, dataFile=data/science_ce2.json, questions=8
  - Chaînes alimentaires simples `(ce2-sciences-chaines-alimentaires)` — engine: `choice-engine`, type=factual-qcm, category=ce2-chaines-alimentaires-simples, dataFile=data/science_ce2.json, questions=6
  - Défi : chaînes alimentaires `(ce2-bonus-sciences-chaines-alimentaires-defi)` — engine: `choice-engine`, type=factual-qcm, category=ce2-chaines-alimentaires-simples, dataFile=data/science_ce2.json, questions=9, bonus (seuil=2)
  - Les parties du corps `(ce2-sciences-tap-corps)` — engine: `board-interactive`, type=tap-features, category=ce2_tap_corps_humain, dataFile=data/board_tap_features_science.json, questions=4

#### Matière `(ce2-sciences-matiere-subtheme)`

- **Leçons** (2) :
  - L'eau et ses états `(ce2-lesson-etats-eau)` — blocs: paragraph, example, bullets, tip
  - Solide, liquide, gaz `(ce2-lesson-solides-liquides-gaz)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Matière `(ce2-sciences-matiere)` — engine: `choice-engine`, type=factual-qcm, category=ce2-matiere, dataFile=data/science_ce2.json, questions=8
  - Objets du quotidien `(ce2-sciences-objets-techniques)` — engine: `choice-engine`, type=factual-qcm, category=ce2-objets-quotidien, dataFile=data/science_ce2.json, questions=6
  - Eau et transformations `(ce2-sciences-eau-transformations)` — engine: `choice-engine`, type=factual-qcm, category=ce2-eau-transformations, dataFile=data/science_ce2.json, questions=6
  - Matériaux et propriétés `(ce2-sciences-appariement)` — engine: `matching`, category=matching_sciences_ce2, dataFile=data/science_matching.json, questions=2
  - Défi : eau et matière `(ce2-bonus-sciences-matiere)` — engine: `choice-engine`, type=factual-qcm, category=ce2-eau-transformations, dataFile=data/science_ce2.json, questions=10, bonus (seuil=2)

#### Observer `(ce2-sciences-observer-subtheme)`

- **Leçons** (1) :
  - Observer puis classer `(ce2-lesson-observer-classer)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Observer `(ce2-sciences-observer)` — engine: `choice-engine`, type=factual-qcm, category=ce2-observer-experimenter, dataFile=data/science_ce2.json, questions=6
  - Expériences simples `(ce2-sciences-experiences)` — engine: `choice-engine`, type=factual-qcm, category=ce2-experiences-simples, dataFile=data/science_ce2.json, questions=6
  - Objets techniques simples `(ce2-sciences-objets-techniques-simples)` — engine: `choice-engine`, type=factual-qcm, category=ce2-objets-techniques-simples, dataFile=data/science_ce2.json, questions=8
  - Matériaux et usages `(ce2-sciences-materiaux-usages)` — engine: `choice-engine`, type=factual-qcm, category=ce2-materiaux-usages, dataFile=data/science_ce2.json, questions=6
  - Objets techniques et mesures `(ce2-sciences-observer-appariement)` — engine: `matching`, category=matching_sciences_ce2, dataFile=data/science_matching.json, questions=2
  - Défi : super observateur `(ce2-bonus-sciences-observer)` — engine: `choice-engine`, type=factual-qcm, category=ce2-experiences-simples, dataFile=data/science_ce2.json, questions=10, bonus (seuil=2)

#### Saisons et météo `(ce2-sciences-saisons-subtheme)`

- **Leçons** (2) :
  - Le cycle des saisons `(ce2-lesson-cycle-saisons)` — blocs: paragraph, example, bullets, tip
  - Les instruments de la météo `(ce2-lesson-instruments-meteo)` — blocs: paragraph, example, mini-table, tip
- **Exercices** (4) :
  - Le cycle des saisons `(ce2-sciences-cycle-saisons)` — engine: `choice-engine`, type=factual-qcm, category=ce2-saisons-meteo, dataFile=data/science_ce2.json, questions=8
  - Mesurer la météo `(ce2-sciences-mesurer-meteo)` — engine: `choice-engine`, type=factual-qcm, category=ce2-saisons-meteo, dataFile=data/science_ce2.json, questions=6
  - Climat et environnement `(ce2-sciences-climat-environnement)` — engine: `choice-engine`, type=factual-qcm, category=ce2-saisons-meteo, dataFile=data/science_ce2.json, questions=6
  - Défi : saisons et météo `(ce2-bonus-sciences-saisons)` — engine: `choice-engine`, type=factual-qcm, category=ce2-saisons-meteo, dataFile=data/science_ce2.json, questions=10, bonus (seuil=2)

#### Les milieux de vie `(ce2-sciences-milieux-subtheme)`

- **Leçons** (2) :
  - Qu'est-ce qu'un milieu de vie ? `(ce2-lesson-ecosysteme-simple)` — blocs: paragraph, example, bullets, tip
  - La biodiversité d'un milieu `(ce2-lesson-biodiversite-milieux)` — blocs: paragraph, example, mini-table, tip
- **Exercices** (4) :
  - Les écosystèmes simples `(ce2-sciences-ecosystemes-simples)` — engine: `choice-engine`, type=factual-qcm, category=ce2-milieux-vie, dataFile=data/science_ce2.json, questions=8
  - La biodiversité autour de nous `(ce2-sciences-biodiversite)` — engine: `choice-engine`, type=factual-qcm, category=ce2-milieux-vie, dataFile=data/science_ce2.json, questions=6
  - Protéger les milieux `(ce2-sciences-proteger-milieux)` — engine: `choice-engine`, type=factual-qcm, category=ce2-milieux-vie, dataFile=data/science_ce2.json, questions=6
  - Défi : les milieux de vie `(ce2-bonus-sciences-milieux)` — engine: `choice-engine`, type=factual-qcm, category=ce2-milieux-vie, dataFile=data/science_ce2.json, questions=10, bonus (seuil=2)

### EMC (ce2-emc-subject)

#### Règles `(ce2-emc-regles-subtheme)`

- **Leçons** (3) :
  - Respecter les règles `(ce2-lesson-regles)` — blocs: paragraph, example, bullets, tip
  - Les droits et les devoirs `(ce2-lesson-droits-devoirs)` — blocs: paragraph, example, bullets, tip
  - Parler et écouter avec respect `(ce2-lesson-dialogue-respectueux)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Règles `(ce2-emc-regles)` — engine: `choice-engine`, type=factual-qcm, category=ce2-regles, dataFile=data/emc_ce2.json, questions=8
  - Lieux et objets communs `(ce2-emc-lieux-communs)` — engine: `choice-engine`, type=factual-qcm, category=ce2-lieux-objets-communs, dataFile=data/emc_ce2.json, questions=6
  - Défi : règles communes `(ce2-bonus-emc-regles-defi)` — engine: `choice-engine`, type=factual-qcm, category=ce2-lieux-objets-communs, dataFile=data/emc_ce2.json, questions=9, bonus (seuil=2)
  - Droits et devoirs `(ce2-emc-appariement)` — engine: `matching`, category=matching_emc_ce2, dataFile=data/emc_matching.json, questions=3
  - Symboles et valeurs de la République `(ce2-emc-appariement-2)` — engine: `matching`, category=matching_emc_ce2, dataFile=data/emc_matching.json, questions=3

#### Citoyen `(ce2-emc-citoyen-subtheme)`

- **Leçons** (1) :
  - Être citoyen `(ce2-lesson-citoyen)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Citoyen `(ce2-emc-citoyen)` — engine: `choice-engine`, type=factual-qcm, category=ce2-citoyen, dataFile=data/emc_ce2.json, questions=8
  - Coopérer `(ce2-emc-cooperation)` — engine: `choice-engine`, type=factual-qcm, category=ce2-cooperation, dataFile=data/emc_ce2.json, questions=6
  - Décider ensemble `(ce2-emc-decisions-collectives)` — engine: `choice-engine`, type=factual-qcm, category=ce2-decisions-collectives, dataFile=data/emc_ce2.json, questions=8
  - Parole et écoute `(ce2-emc-parole-ecoute)` — engine: `choice-engine`, type=factual-qcm, category=ce2-parole-ecoute, dataFile=data/emc_ce2.json, questions=6
  - Défi : super citoyen `(ce2-bonus-emc-citoyen)` — engine: `choice-engine`, type=factual-qcm, category=ce2-citoyen, dataFile=data/emc_ce2.json, questions=10, bonus (seuil=2)

#### Entraide `(ce2-emc-entraide-subtheme)`

- **Leçons** (1) :
  - Aider un camarade `(ce2-lesson-entraide)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Entraide `(ce2-emc-entraide)` — engine: `choice-engine`, type=factual-qcm, category=ce2-entraide, dataFile=data/emc_ce2.json, questions=6
  - Aider et coopérer `(ce2-emc-aider-cooperer)` — engine: `choice-engine`, type=factual-qcm, category=ce2-entraide, dataFile=data/emc_ce2.json, questions=8

#### Responsabilité `(ce2-emc-responsabilite-subtheme)`

- **Leçons** (1) :
  - Être responsable `(ce2-lesson-responsable)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Responsabilité `(ce2-emc-responsabilite)` — engine: `choice-engine`, type=factual-qcm, category=ce2-responsabilite, dataFile=data/emc_ce2.json, questions=6
  - Être responsable `(ce2-emc-etre-responsable)` — engine: `choice-engine`, type=factual-qcm, category=ce2-responsabilite, dataFile=data/emc_ce2.json, questions=8

#### Esprit critique et symboles `(ce2-emc-esprit-critique-subtheme)`

- **Leçons** (2) :
  - Vrai ou faux ? `(ce2-lesson-esprit-critique)` — blocs: paragraph, example, bullets, tip
  - Les symboles de la République `(ce2-lesson-symboles-republique)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Vrai ou faux ? `(ce2-emc-esprit-critique)` — engine: `choice-engine`, type=factual-qcm, category=ce2-esprit-critique, dataFile=data/emc_ce2.json, questions=6
  - Défi : esprit critique `(ce2-bonus-emc-esprit-critique-defi)` — engine: `choice-engine`, type=factual-qcm, category=ce2-esprit-critique, dataFile=data/emc_ce2.json, questions=9, bonus (seuil=2)
  - Les symboles de la République `(ce2-emc-symboles-republique)` — engine: `choice-engine`, type=factual-qcm, category=ce2-symboles-republique, dataFile=data/emc_ce2.json, questions=7


---

## CM1

### Mathématiques (cm1-maths-subject)

#### Nombres et calculs `(cm1-nombres-calculs)`

- **Leçons** (5) :
  - Lire une fraction `(cm1-lesson-fractions)` — blocs: paragraph, example, bullets, tip
  - Repérer les décimaux `(cm1-lesson-decimaux-reperes)` — blocs: paragraph, example, bullets, tip
  - Résoudre un problème `(cm1-lesson-problemes-calcul)` — blocs: paragraph, example, bullets, tip
  - Résoudre un problème `(cm1-lesson-resoudre-probleme)` — blocs: paragraph, example, bullets, tip
  - La proportionnalité `(cm1-lesson-proportionnalite)` — blocs: paragraph, example, mini-table, bullets, tip
- **Exercices** (23) :
  - Grands Nombres `(cm1-m-big)` — engine: `math-input`, type=dictée-nombres, questions=5, max=1000000
  - Fractions `(cm1-frac-1)` — engine: `math-input`, type=fraction-view, questions=10, maxDenom=8
  - Construis la fraction `(cm1-frac-build)` — engine: `board-interactive`, type=fraction-build, questions=8, minDenom=2, maxDenom=8
  - Décimaux : Positions (1) `(cm1-dec-pos-1)` — engine: `math-input`, type=decimal-place, questions=10
  - Décimaux : Positions (2) `(cm1-dec-pos-2)` — engine: `math-input`, type=decimal-place, questions=10
  - La Moitié `(cm1-div-1)` — engine: `math-input`, type=half, questions=10
  - Divisions Simples `(cm1-div-2)` — engine: `math-input`, type=division-simple, questions=10
  - Le Juste Nombre `(cm1-div-3)` — engine: `math-input`, type=division-reste, questions=10
  - Division posée `(cm1-div-posed-1)` — engine: `math-input`, type=division-posed, questions=5
  - Comparer des décimaux `(cm1-dec-compare)` — engine: `choice-engine`, type=compare-decimals, questions=10
  - Division posée avec reste `(cm1-div-reste)` — engine: `math-input`, type=division-posed, questions=5
  - Lire des fractions `(cm1-frac-2)` — engine: `math-input`, type=fraction-view, questions=10, maxDenom=12
  - Trés grands nombres `(cm1-m-big-2)` — engine: `math-input`, type=dictée-nombres, questions=5, max=10000000
  - Fractions plus précises `(cm1-frac-3)` — engine: `math-input`, type=fraction-view, questions=10, maxDenom=16
  - Grands nombres (3) `(cm1-m-big-3)` — engine: `math-input`, type=dictée-nombres, questions=5, max=100000000
  - Problèmes multiplications/divisions `(cm1-problemes-multi-division)` — engine: `choice-engine`, type=factual-qcm, category=cm1-problemes-multi-division, dataFile=data/math_word_problems_cycle3.json, questions=8
  - Problèmes de mesures `(cm1-problemes-mesures)` — engine: `choice-engine`, type=factual-qcm, category=cm1-problemes-mesures, dataFile=data/math_word_problems_cycle3.json, questions=8
  - Proportionnalité `(cm1-problemes-proportionnalite)` — engine: `choice-engine`, type=factual-qcm, category=cm1-problemes-proportionnalite, dataFile=data/math_word_problems_cycle3.json, questions=8
  - Proportionnalité : la recette `(cm1-proportionnalite-1)` — engine: `math-input`, type=proportionnalite, questions=6
  - Lire une échelle de plan `(cm1-echelle-1)` — engine: `math-input`, type=echelle, questions=6
  - Calculer un pourcentage simple `(cm1-pourcentage-1)` — engine: `math-input`, type=pourcentage, questions=6
  - Défi : proportionnalité experte `(cm1-bonus-proportionnalite-expert)` — engine: `math-input`, type=proportionnalite, questions=8, bonus (seuil=2)
  - Défi : grands calculs `(cm1-bonus-grands-calculs)` — engine: `math-input`, type=division-posed, questions=6, bonus (seuil=2)

#### Grandeurs et mesures `(cm1-grandeurs-mesures)`

- **Leçons** (5) :
  - Comprendre une conversion `(cm1-lesson-conversions-mesures)` — blocs: paragraph, example, bullets, tip
  - Convertir masses et contenances `(cm1-lesson-masses-contenances)` — blocs: paragraph, example, mini-table, bullets, tip
  - Lire les chiffres romains `(cm1-lesson-lire-romains)` — blocs: paragraph, example, mini-table, tip
  - Repérer des formes géométriques `(cm1-lesson-formes-geometriques)` — blocs: paragraph, example, bullets, tip
  - Triangles et quadrilatères `(cm1-lesson-triangles-quadrilateres)` — blocs: paragraph, example, bullets, tip
- **Exercices** (14) :
  - Chiffres romains `(cm1-romains)` — engine: `conversion`, questions=5, max=20
  - Convertir des longueurs `(cm1-longueurs)` — engine: `conversion`, questions=10
  - Convertir les heures `(cm1-durees-appr)` — engine: `conversion`, questions=10
  - Heures et minutes `(cm1-durees-eval)` — engine: `conversion`, questions=10
  - Minutes vers secondes `(cm1-time-sec)` — engine: `conversion`, questions=10
  - Convertir des durées `(cm1-time-hard)` — engine: `conversion`, questions=10
  - Chiffres romains (2) `(cm1-romains-50)` — engine: `conversion`, questions=5, max=50
  - Minutes vers secondes (2) `(cm1-heures-secondes)` — engine: `conversion`, questions=10
  - Chiffres romains (3) `(cm1-romains-100)` — engine: `conversion`, questions=5, max=100
  - Heures et minutes (2) `(cm1-time-hard-2)` — engine: `conversion`, questions=10
  - Convertir des masses `(cm1-conversions-masses)` — engine: `conversion`, questions=6
  - Convertir des contenances `(cm1-conversions-contenances)` — engine: `conversion`, questions=6
  - Mesures et conversions `(cm1-maths-mesures-appariement)` — engine: `matching`, category=matching_math_cm1, dataFile=data/math_matching.json, questions=3
  - Défi : conversions express `(cm1-bonus-conversions-expert)` — engine: `conversion`, questions=12, bonus (seuil=2)

#### Géométrie `(cm1-geometrie-subtheme)`

- **Leçons** (5) :
  - Reconnaître les polygones `(cm1-lesson-polygones)` — blocs: paragraph, example, bullets, tip
  - L'angle droit `(cm1-lesson-angles-droits)` — blocs: paragraph, example, bullets, tip
  - Le périmètre `(cm1-lesson-perimetre)` — blocs: paragraph, example, bullets, tip
  - L'aire du rectangle `(cm1-lesson-aire-rectangle)` — blocs: paragraph, example, bullets, tip
  - Découvrir le volume `(cm1-lesson-volume-pave)` — blocs: paragraph, example, bullets, tip
- **Exercices** (12) :
  - Reconnaître les polygones `(cm1-geo-polygones)` — engine: `choice-engine`, type=factual-qcm, category=cm1-polygones, dataFile=data/math_geometry_cm1.json, questions=8
  - Périmètre et angle droit `(cm1-geo-perimetre-angles)` — engine: `choice-engine`, type=factual-qcm, category=cm1-perimetre-angles, dataFile=data/math_geometry_cm1.json, questions=8
  - Touche les angles droits `(cm1-geo-angle-droit-pratique)` — engine: `board-interactive`, type=tap-features, category=cm1_tap_angle_droit, dataFile=data/board_tap_features_cm1.json, questions=5
  - Symétrie et repérage `(cm1-geo-symetrie-reperage)` — engine: `choice-engine`, type=factual-qcm, category=cm1-symetrie-reperage, dataFile=data/math_geometry_cm1.json, questions=8
  - Place le point sur le quadrillage `(cm1-geo-reperage-pratique)` — engine: `board-interactive`, type=point-on-grid, category=cm1_point_on_grid, dataFile=data/board_point_on_grid_cm1.json, questions=7
  - Complète la figure symétrique `(cm1-geo-symetrie-pratique)` — engine: `board-interactive`, type=symmetry-complete, category=cm1_symmetry_complete, dataFile=data/board_symmetry_complete_cm1.json, questions=5
  - Vocabulaire géométrique `(cm1-geo-vocabulaire)` — engine: `choice-engine`, type=factual-qcm, category=cm1-vocabulaire-geometrique, dataFile=data/math_geometry_cm1.json, questions=8
  - Calculer une aire `(cm1-geo-aire-rectangle)` — engine: `math-input`, type=aire-rectangle, questions=6, max=12
  - Calculer un volume `(cm1-geo-volume-pave)` — engine: `math-input`, type=volume-pave, questions=5, max=6
  - Figures et formules `(cm1-maths-geo-appariement)` — engine: `matching`, category=matching_math_cm1, dataFile=data/math_matching.json, questions=3
  - Classer les formes géométriques `(cm1-geo-classement-formes)` — engine: `board-interactive`, type=shape-classify, category=cm1_shape_classify, dataFile=data/board_shape_classify_cm1.json, questions=6
  - Défi : figures et formules `(cm1-bonus-geo-figures-expert)` — engine: `choice-engine`, type=factual-qcm, category=cm1-perimetre-angles, dataFile=data/math_geometry_cm1.json, questions=12, bonus (seuil=2)

#### Lire un graphique `(cm1-graphiques-subtheme)`

- **Leçons** (1) :
  - Lire un diagramme en barres `(cm1-lesson-lire-graphique)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Lire un diagramme en barres `(cm1-graphique-lecture)` — engine: `math-input`, type=bar-chart-read, questions=6, maxBars=4, maxValue=20
  - Défi : graphiques en rafale `(cm1-bonus-graphique-expert)` — engine: `math-input`, type=bar-chart-read, questions=8, maxBars=5, maxValue=25, bonus (seuil=2)

### Français (cm1-francais-subject)

#### Homophones `(cm1-francais-homophones)`

- **Leçons** (2) :
  - Reconnaître un homophone `(cm1-lesson-homophones-strategie)` — blocs: paragraph, example, bullets, tip
  - A ou à ? `(cm1-lesson-homophones-a-a)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Ce ou Se ? `(cm1-h-ce)` — engine: `choice-engine`, type=homophone-duel, category=ce_se, questions=10
  - Ces ou Ses ? `(cm1-h-ces)` — engine: `choice-engine`, type=homophone-duel, category=ces_ses, questions=10
  - A ou À ? `(cm1-h-aa)` — engine: `choice-engine`, type=homophone-duel, category=a_à, questions=10
  - Son ou Sont ? `(cm1-h-son)` — engine: `choice-engine`, type=homophone-duel, category=son_sont, questions=10
  - On ou Ont ? `(cm1-h-on)` — engine: `choice-engine`, type=homophone-duel, category=on_ont, questions=10
  - Défi : tous les homophones `(cm1-bonus-homophones-mix)` — engine: `choice-engine`, type=homophone-duel, category=on_ont, questions=16, bonus (seuil=2)

#### Conjugaison `(cm1-francais-conjugaison)`

- **Leçons** (2) :
  - L'imparfait des verbes en -ER `(cm1-lesson-imparfait-er)` — blocs: paragraph, example, bullets, tip
  - Choisir avoir ou être `(cm1-lesson-passe-compose-auxiliaires)` — blocs: paragraph, example, mini-table, tip
- **Exercices** (9) :
  - L'Imparfait `(cm1-c-imp)` — engine: `conjugation`, category=imparfait_1, questions=10
  - Passé Composé (1) `(cm1-c-pc-avoir)` — engine: `conjugation`, category=pc_1, questions=5
  - Passé Composé (2) `(cm1-c-pc-etre)` — engine: `conjugation`, category=pc_1, questions=5
  - Passé Composé (Mix) `(cm1-c-pc-mix)` — engine: `conjugation`, category=pc_1, questions=10
  - Passé Composé (Expert) `(cm1-c-pc-3)` — engine: `conjugation`, category=pc_3_cm1, questions=10
  - Le 2ème groupe `(cm1-conj-ir)` — engine: `conjugation`, category=present_2, questions=8
  - Le futur simple `(cm1-c-futur)` — engine: `conjugation`, category=future_1, questions=10
  - Être et avoir à l'imparfait `(cm1-c-ea-imp)` — engine: `conjugation`, category=etre_avoir_imp, questions=8
  - Défi : passé composé expert `(cm1-bonus-conjugaison-passe-compose)` — engine: `conjugation`, category=pc_3_cm1, questions=14, bonus (seuil=2)

#### Articles et genre `(cm1-francais-articles)`

- **Leçons** (1) :
  - Choisir le bon article `(cm1-lesson-articles-genre)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Un ou Une ? `(cm1-g-un-une)` — engine: `choice-engine`, type=gender-articles, category=gender_cm1_scolaire, questions=8
  - Le, La ou L' ? `(cm1-g-le-la)` — engine: `choice-engine`, type=gender-articles, category=gender_cm1_elision, questions=8

#### Grammaire `(cm1-francais-grammaire)`

- **Leçons** (2) :
  - Reconnaître la nature d'un mot `(cm1-lesson-nature-mots)` — blocs: paragraph, example, mini-table, tip
  - Les familles de mots `(cm1-lesson-familles-mots)` — blocs: paragraph, example, bullets, tip
- **Exercices** (9) :
  - Le bon article `(cm1-g-article-qcm)` — engine: `choice-engine`, type=article-choice, category=article_choice_cm1, questions=8
  - Le bon déterminant `(cm1-g-pluriel-qcm)` — engine: `choice-engine`, type=plural-choice, category=plural_choice_cm1, questions=8
  - Nom, verbe ou adjectif `(cm1-g-nature-qcm)` — engine: `choice-engine`, type=word-class-choice, category=word_class_choice_cm1, questions=8
  - Sujet, verbe ou complément `(cm1-g-fonction-qcm)` — engine: `choice-engine`, type=word-class-choice, category=sentence_function_choice_cm1, questions=6
  - Déterminant dans la phrase `(cm1-g-cloze-det)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_cloze_cm1, questions=8
  - Écris le bon mot `(cm1-g-cloze-ecrit)` — engine: `cloze-fill-in`, category=grammar_cloze_cm1, questions=6
  - Accorder dans la phrase `(cm1-g-cloze-accord)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_agreement_cm1, questions=8
  - Ordre des mots `(cm1-francais-ordre-mots)` — engine: `word-order`, category=word_order_cm1, dataFile=data/french_word_order.json, questions=5
  - Défi : accords sans filet `(cm1-bonus-grammaire-accords)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_agreement_cm1, questions=14, bonus (seuil=2)

#### Lecture et vocabulaire `(cm1-francais-lecture-vocabulaire-subtheme)`

- **Leçons** (4) :
  - Comprendre un paragraphe `(cm1-lesson-comprendre-paragraphe)` — blocs: paragraph, example, bullets, tip
  - La famille de mots `(cm1-lesson-vocabulaire-famille-mots)` — blocs: paragraph, example, bullets, tip
  - Comprendre un mot par le contexte `(cm1-lesson-vocabulaire-sens-contexte)` — blocs: paragraph, example, bullets, tip
  - Mots polysémiques et familles de mots `(cm1-lesson-polysemie-familles)` — blocs: paragraph, example, bullets, tip
- **Exercices** (7) :
  - Trouver l'idée principale `(cm1-lecture-idee-principale)` — engine: `reading`, category=cm1_lecture_idee_principale, questions=5
  - Comprendre un mot par le contexte `(cm1-vocabulaire-contexte)` — engine: `reading`, category=cm1_lecture_mot_contexte, questions=5
  - Un mot, plusieurs sens `(cm1-vocabulaire-polysemie)` — engine: `reading`, category=cm1_vocabulaire_polysemie, questions=6
  - Les familles de mots `(cm1-vocabulaire-familles-mots)` — engine: `reading`, category=cm1_vocabulaire_familles_mots, questions=6
  - Familles de mots `(cm1-vocab-appariement)` — engine: `matching`, category=matching_familles_mots_cm1, dataFile=data/french/matching.json, questions=2
  - Champ lexical et familles de mots `(cm1-vocab-appariement-champ-lexical)` — engine: `matching`, category=matching_vocabulaire_cm1, dataFile=data/french/matching.json, questions=2
  - Défi : sens et contexte `(cm1-bonus-vocabulaire-polysemie)` — engine: `reading`, category=cm1_vocabulaire_polysemie, questions=10, bonus (seuil=2)

#### Dictée audio `(cm1-dictee-audio-subtheme)`

- **Leçons** (1) :
  - La dictée, un exercice de vigilance `(cm1-lesson-dictee-vigilance)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Animaux du monde `(cm1-audio-animaux-avances)` — engine: `audio-spelling`, category=animals_advanced, questions=8
  - Transports `(cm1-audio-transports-avances)` — engine: `audio-spelling`, category=transport_advanced, questions=8
  - Mots pièges `(cm1-audio-homophones)` — engine: `audio-spelling`, category=cm1_orthographe_homophones, questions=8
  - Nature et sciences `(cm1-audio-nature-sciences)` — engine: `audio-spelling`, category=cm1_nature_sciences, questions=8
  - Défi : dictée à vitesse réelle `(cm1-bonus-dictee-vitesse-reelle)` — engine: `audio-spelling`, category=cm1_orthographe_homophones, questions=10, bonus (seuil=2)

### Histoire (cm1-histoire-subject)

#### Grandes périodes `(cm1-histoire-periodes)`

- **Leçons** (5) :
  - La Préhistoire `(cm1-lesson-prehistoire)` — blocs: paragraph, example, bullets, tip
  - Antiquité, Moyen Âge, Temps modernes `(cm1-lesson-periodes)` — blocs: paragraph, bullets, example, tip
  - La vie au Moyen Âge `(cm1-lesson-vie-moyen-age)` — blocs: paragraph, example, bullets, tip
  - La Gaule romaine `(cm1-lesson-gaule-romaine)` — blocs: paragraph, example, bullets, tip
  - Vivre au Moyen Âge `(cm1-lesson-vivre-moyen-age)` — blocs: paragraph, example, bullets, tip
- **Exercices** (8) :
  - Préhistoire `(cm1-histoire-prehistoire)` — engine: `choice-engine`, type=factual-qcm, category=cm1-prehistoire, dataFile=data/history_cm1.json, questions=8
  - Antiquité `(cm1-histoire-antiquite)` — engine: `choice-engine`, type=factual-qcm, category=cm1-antiquite, dataFile=data/history_cm1.json, questions=8
  - Moyen Âge `(cm1-histoire-moyen-age)` — engine: `choice-engine`, type=factual-qcm, category=cm1-moyen-age, dataFile=data/history_cm1.json, questions=8
  - Temps modernes `(cm1-histoire-temps-modernes)` — engine: `choice-engine`, type=factual-qcm, category=cm1-temps-modernes, dataFile=data/history_cm1.json, questions=6
  - Renaissance et inventions `(cm1-histoire-renaissance-inventions)` — engine: `choice-engine`, type=factual-qcm, category=cm1-renaissance-inventions, dataFile=data/history_cm1.json, questions=6
  - Humanisme et imprimerie `(cm1-histoire-humanisme-imprimerie)` — engine: `choice-engine`, type=factual-qcm, category=cm1-humanisme-imprimerie, dataFile=data/history_cm1.json, questions=6
  - Périodes et civilisations `(cm1-histoire-appariement)` — engine: `matching`, category=matching_histoire_cm1, dataFile=data/history_matching.json, questions=2
  - Défi : toutes les périodes `(cm1-bonus-histoire-toutes-periodes)` — engine: `choice-engine`, type=factual-qcm, category=cm1-moyen-age, dataFile=data/history_cm1.json, questions=12, bonus (seuil=2)

#### Frises historiques `(cm1-histoire-frises)`

- **Leçons** (1) :
  - Le temps des rois `(cm1-lesson-frise)` — blocs: paragraph, example, bullets, tip
- **Exercices** (11) :
  - Frise historique `(cm1-histoire-frise-ordre)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Placer sur la frise `(cm1-histoire-frise-place)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Placer sur la frise - Niv 1 `(cm1-histoire-frise-place-n1)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Placer sur la frise - Niv 2 `(cm1-histoire-frise-place-n2)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Placer sur la frise - Niv 3 `(cm1-histoire-frise-place-n3)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Frise : Préhistoire `(cm1-histoire-frise-prehistoire-ordre)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Frise : Antiquité `(cm1-histoire-frise-antiquite-ordre)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Frise : Temps modernes `(cm1-histoire-frise-modernes-ordre)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Placer : Antiquité `(cm1-histoire-frise-antiquite-place)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Placer : Temps modernes `(cm1-histoire-frise-modernes-place)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Défi : frise du Moyen Âge `(cm1-bonus-frise-moyen-age-expert)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=8, bonus (seuil=2)

### Géographie (cm1-geographie-subject)

#### Reliefs et fleuves `(cm1-geo-relief-subtheme)`

- **Leçons** (2) :
  - Observer un paysage `(cm1-lesson-relief-paysage)` — blocs: paragraph, example, bullets, tip
  - Les paysages de France `(cm1-lesson-paysages-france)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Reliefs et fleuves `(cm1-geo-relief)` — engine: `choice-engine`, type=factual-qcm, category=cm1-france-relief, dataFile=data/geography_cm1.json, questions=8
  - Fleuves et reliefs de France `(cm1-geo-fleuves-reliefs-france)` — engine: `choice-engine`, type=factual-qcm, category=cm1-france-relief, dataFile=data/geography_cm1.json, questions=10
  - Eaux et paysages `(cm1-geo-eaux-paysages)` — engine: `choice-engine`, type=factual-qcm, category=cm1-eaux-paysages, dataFile=data/geography_cm1.json, questions=8
  - Reliefs et régions `(cm1-geo-appariement)` — engine: `matching`, category=matching_geo_cm1, dataFile=data/geography_matching.json, questions=2
  - Défi : reliefs et fleuves `(cm1-bonus-geo-relief-expert)` — engine: `choice-engine`, type=factual-qcm, category=cm1-eaux-paysages, dataFile=data/geography_cm1.json, questions=12, bonus (seuil=2)

#### Territoires `(cm1-geo-territoires-subtheme)`

- **Leçons** (3) :
  - Repérer un territoire `(cm1-lesson-territoires)` — blocs: paragraph, example, bullets, tip
  - Lire une carte de France `(cm1-lesson-carte-legende)` — blocs: paragraph, example, bullets, tip
  - Lire une carte et sa légende `(cm1-lesson-carte-legende-territoire)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Territoires `(cm1-geo-territoires)` — engine: `choice-engine`, type=factual-qcm, category=cm1-france-regions, dataFile=data/geography_cm1.json, questions=8
  - Types de territoires `(cm1-geo-types-territoires)` — engine: `choice-engine`, type=factual-qcm, category=cm1-types-territoires, dataFile=data/geography_cm1.json, questions=6
  - Défi : types de territoires `(cm1-bonus-geo-territoires-defi)` — engine: `choice-engine`, type=factual-qcm, category=cm1-types-territoires, dataFile=data/geography_cm1.json, questions=10, bonus (seuil=2)
  - Territoires et caractéristiques `(cm1-geo-territoires-appariement)` — engine: `matching`, category=matching_geo_cm1, dataFile=data/geography_matching.json, questions=1

#### Se déplacer `(cm1-geo-deplacements-subtheme)`

- **Leçons** (2) :
  - Se déplacer en France `(cm1-lesson-deplacements)` — blocs: paragraph, example, bullets, tip
  - Se déplacer en France `(cm1-lesson-mobilites-france)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Se déplacer `(cm1-geo-deplacements)` — engine: `choice-engine`, type=factual-qcm, category=cm1-se-deplacer, dataFile=data/geography_cm1.json, questions=6
  - Défi : se déplacer `(cm1-bonus-geo-deplacements-defi)` — engine: `choice-engine`, type=factual-qcm, category=cm1-se-deplacer, dataFile=data/geography_cm1.json, questions=10, bonus (seuil=2)
  - Mobilités en France `(cm1-geo-mobilites-france)` — engine: `choice-engine`, type=factual-qcm, category=cm1-mobilites-france, dataFile=data/geography_cm1.json, questions=6
  - Moyens de transport et usages `(cm1-geo-deplacements-appariement)` — engine: `matching`, category=matching_geo_cm1, dataFile=data/geography_matching.json, questions=1

#### Se situer dans le monde `(cm1-geo-europe-subtheme)`

- **Leçons** (1) :
  - La France en Europe `(cm1-lesson-france-europe)` — blocs: paragraph, example, bullets, tip
- **Exercices** (15) :
  - La France en Europe `(cm1-geo-france-europe)` — engine: `choice-engine`, type=factual-qcm, category=cm1-europe-monde, dataFile=data/geography_cm1.json, questions=6
  - Se situer dans le monde `(cm1-geo-se-situer-monde)` — engine: `choice-engine`, type=factual-qcm, category=cm1-europe-monde, dataFile=data/geography_cm1.json, questions=6
  - Carte du monde `(cm1-geo-carte-continents)` — engine: `board-interactive`, type=map-locate, category=cm1_map_continents_monde, dataFile=data/board_map_locate_world.json, mapFile=data/maps/world-continents.svg, mapId=world-continents, questions=6
  - Carte de l'Europe `(cm1-geo-carte-europe-pays)` — engine: `board-interactive`, type=map-locate, category=cm1_map_pays_europe, dataFile=data/board_map_locate_europe.json, mapFile=data/maps/europe-countries.svg, mapId=europe-countries, questions=8
  - Carte de l'Asie `(cm1-geo-carte-asie-pays)` — engine: `board-interactive`, type=map-locate, category=cm1_map_pays_asie, dataFile=data/board_map_locate_asia.json, mapFile=data/maps/asia-countries.svg, mapId=asia-countries, questions=8
  - Reliefs, territoires et transports `(cm1-geo-europe-appariement)` — engine: `matching`, category=matching_geo_cm1, dataFile=data/geography_matching.json, questions=2
  - Carte de l'Afrique `(cm1-geo-carte-afrique-pays)` — engine: `board-interactive`, type=map-locate, category=cm1_map_pays_afrique, dataFile=data/board_map_locate_africa.json, mapFile=data/maps/africa-countries.svg, mapId=africa-countries, questions=8
  - Carte de l'Amérique du Nord `(cm1-geo-carte-amerique-nord-pays)` — engine: `board-interactive`, type=map-locate, category=cm1_map_pays_amerique_nord, dataFile=data/board_map_locate_north_america.json, mapFile=data/maps/north-america-countries.svg, mapId=north-america-countries, questions=6
  - Carte de l'Amérique du Sud `(cm1-geo-carte-amerique-sud-pays)` — engine: `board-interactive`, type=map-locate, category=cm1_map_pays_amerique_sud, dataFile=data/board_map_locate_south_america.json, mapFile=data/maps/south-america-countries.svg, mapId=south-america-countries, questions=6
  - Capitales d'Europe `(cm1-geo-capitales-europe)` — engine: `choice-engine`, type=factual-qcm, category=cm1-capitales-europe, dataFile=data/geography_capitals_cm1.json, questions=8
  - Capitales d'Afrique `(cm1-geo-capitales-afrique)` — engine: `choice-engine`, type=factual-qcm, category=cm1-capitales-afrique, dataFile=data/geography_capitals_cm1.json, questions=8
  - Capitales d'Asie `(cm1-geo-capitales-asie)` — engine: `choice-engine`, type=factual-qcm, category=cm1-capitales-asie, dataFile=data/geography_capitals_cm1.json, questions=8
  - Capitales d'Amérique du Nord `(cm1-geo-capitales-amerique-nord)` — engine: `choice-engine`, type=factual-qcm, category=cm1-capitales-amerique-nord, dataFile=data/geography_capitals_cm1.json, questions=6
  - Capitales d'Amérique du Sud `(cm1-geo-capitales-amerique-sud)` — engine: `choice-engine`, type=factual-qcm, category=cm1-capitales-amerique-sud, dataFile=data/geography_capitals_cm1.json, questions=6
  - Défi : carte du monde `(cm1-bonus-geo-carte-monde-expert)` — engine: `board-interactive`, type=map-locate, category=cm1_map_continents_monde, dataFile=data/board_map_locate_world.json, mapFile=data/maps/world-continents.svg, mapId=world-continents, questions=12, bonus (seuil=2)

### Sciences (cm1-sciences-subject)

#### Le vivant `(cm1-sciences-vivant-subtheme)`

- **Leçons** (3) :
  - Classer le vivant `(cm1-lesson-vivant)` — blocs: paragraph, example, bullets, tip
  - Vivant ou non-vivant ? `(cm1-lesson-vivant-non-vivant)` — blocs: paragraph, example, bullets, tip
  - La chaîne alimentaire `(cm1-lesson-chaine-alimentaire)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Le vivant `(cm1-sciences-vivant)` — engine: `choice-engine`, type=factual-qcm, category=cm1-vivant, dataFile=data/science_cm1.json, questions=8
  - Classer le vivant `(cm1-sciences-classer-vivant)` — engine: `choice-engine`, type=factual-qcm, category=cm1-vivant, dataFile=data/science_cm1.json, questions=10
  - Écosystèmes et adaptation `(cm1-sciences-ecosystemes)` — engine: `choice-engine`, type=factual-qcm, category=cm1-vivant, dataFile=data/science_cm1.json, questions=10
  - Défi : le vivant `(cm1-bonus-sciences-vivant-defi)` — engine: `choice-engine`, type=factual-qcm, category=cm1-vivant, dataFile=data/science_cm1.json, questions=12, bonus (seuil=2)

#### Matière et énergie `(cm1-sciences-matiere-subtheme)`

- **Leçons** (1) :
  - Matière et énergie `(cm1-lesson-matiere-energie)` — blocs: paragraph, example, bullets, tip
- **Exercices** (9) :
  - Matière et énergie `(cm1-sciences-matiere)` — engine: `choice-engine`, type=factual-qcm, category=cm1-matiere-energie, dataFile=data/science_cm1.json, questions=8
  - Sources d'énergie `(cm1-sciences-sources-energie)` — engine: `choice-engine`, type=factual-qcm, category=cm1-sources-energie, dataFile=data/science_cm1.json, questions=6
  - Solide, liquide ou gaz ? `(cm1-sciences-tap-etats-matiere)` — engine: `board-interactive`, type=tap-features, category=cm1_tap_etats_matiere, dataFile=data/board_tap_features_science.json, questions=3
  - Transformations simples `(cm1-sciences-transformations)` — engine: `choice-engine`, type=factual-qcm, category=cm1-transformations-simples, dataFile=data/science_cm1.json, questions=6
  - Énergie au quotidien `(cm1-sciences-energie-quotidien)` — engine: `choice-engine`, type=factual-qcm, category=cm1-energie-quotidien, dataFile=data/science_cm1.json, questions=6
  - L'eau au quotidien `(cm1-sciences-eau-quotidien)` — engine: `choice-engine`, type=factual-qcm, category=cm1-eau-quotidien, dataFile=data/science_cm1.json, questions=6
  - Objets et mesures `(cm1-sciences-objets-mesures)` — engine: `choice-engine`, type=factual-qcm, category=cm1-objets-mesures, dataFile=data/science_cm1.json, questions=6
  - Énergies et organes `(cm1-sciences-appariement)` — engine: `matching`, category=matching_sciences_cm1, dataFile=data/science_matching.json, questions=2
  - Défi : matière et énergie `(cm1-bonus-sciences-matiere-energie)` — engine: `choice-engine`, type=factual-qcm, category=cm1-transformations-simples, dataFile=data/science_cm1.json, questions=12, bonus (seuil=2)

#### Corps et hygiène `(cm1-sciences-corps-subtheme)`

- **Leçons** (2) :
  - Prendre soin de son corps `(cm1-lesson-corps-hygiene)` — blocs: paragraph, example, bullets, tip
  - Les cinq sens `(cm1-lesson-cinq-sens)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Corps et hygiène `(cm1-sciences-corps)` — engine: `choice-engine`, type=factual-qcm, category=cm1-corps-hygiene, dataFile=data/science_cm1.json, questions=6
  - Hygiène et santé `(cm1-sciences-hygiene-sante)` — engine: `choice-engine`, type=factual-qcm, category=cm1-corps-hygiene, dataFile=data/science_cm1.json, questions=8
  - Alimentation et corps `(cm1-sciences-alimentation-corps)` — engine: `choice-engine`, type=factual-qcm, category=cm1-alimentation-corps, dataFile=data/science_cm1.json, questions=8
  - Organes et fonctions du corps `(cm1-sciences-corps-appariement)` — engine: `matching`, category=matching_sciences_cm1, dataFile=data/science_matching.json, questions=2
  - Défi : corps et hygiène `(cm1-bonus-sciences-corps-hygiene)` — engine: `choice-engine`, type=factual-qcm, category=cm1-alimentation-corps, dataFile=data/science_cm1.json, questions=12, bonus (seuil=2)

#### Électricité `(cm1-sciences-electricite-subtheme)`

- **Leçons** (2) :
  - Le circuit électrique simple `(cm1-lesson-circuit-simple)` — blocs: paragraph, example, bullets, tip
  - La sécurité électrique de base `(cm1-lesson-securite-electrique-base)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Le circuit électrique `(cm1-sciences-circuit-electrique)` — engine: `choice-engine`, type=factual-qcm, category=cm1-electricite-base, dataFile=data/science_cm1.json, questions=6
  - Piles et appareils `(cm1-sciences-piles-appareils)` — engine: `choice-engine`, type=factual-qcm, category=cm1-electricite-base, dataFile=data/science_cm1.json, questions=6
  - Sécurité électrique `(cm1-sciences-securite-electrique)` — engine: `choice-engine`, type=factual-qcm, category=cm1-electricite-base, dataFile=data/science_cm1.json, questions=6
  - Défi : électricité et sécurité `(cm1-bonus-sciences-electricite-base)` — engine: `choice-engine`, type=factual-qcm, category=cm1-electricite-base, dataFile=data/science_cm1.json, questions=10, bonus (seuil=2)

#### Environnement `(cm1-sciences-environnement-subtheme)`

- **Leçons** (2) :
  - Les déchets et le tri simple `(cm1-lesson-tri-dechets-simple)` — blocs: paragraph, example, bullets, tip
  - Des gestes simples pour la nature `(cm1-lesson-gestes-environnement-simples)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Trier ses déchets `(cm1-sciences-trier-dechets)` — engine: `choice-engine`, type=factual-qcm, category=cm1-environnement-gestes, dataFile=data/science_cm1.json, questions=6
  - Économiser les ressources `(cm1-sciences-economiser-ressources)` — engine: `choice-engine`, type=factual-qcm, category=cm1-environnement-gestes, dataFile=data/science_cm1.json, questions=6
  - Protéger la nature `(cm1-sciences-proteger-nature)` — engine: `choice-engine`, type=factual-qcm, category=cm1-environnement-gestes, dataFile=data/science_cm1.json, questions=6
  - Défi : gestes pour l'environnement `(cm1-bonus-sciences-environnement-gestes)` — engine: `choice-engine`, type=factual-qcm, category=cm1-environnement-gestes, dataFile=data/science_cm1.json, questions=10, bonus (seuil=2)

### EMC (cm1-emc-subject)

#### Vivre ensemble `(cm1-emc-vivre-ensemble-subtheme)`

- **Leçons** (1) :
  - Vivre ensemble `(cm1-lesson-vivre-ensemble)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Vivre ensemble `(cm1-emc-vivre-ensemble)` — engine: `choice-engine`, type=factual-qcm, category=cm1-vivre-ensemble, dataFile=data/emc_cm1.json, questions=8
  - Respecter chacun `(cm1-emc-respecter-chacun)` — engine: `choice-engine`, type=factual-qcm, category=cm1-vivre-ensemble, dataFile=data/emc_cm1.json, questions=10
  - Défi : vivre ensemble `(cm1-bonus-emc-vivre-ensemble-defi)` — engine: `choice-engine`, type=factual-qcm, category=cm1-vivre-ensemble, dataFile=data/emc_cm1.json, questions=12, bonus (seuil=2)

#### Droits et devoirs `(cm1-emc-droits-devoirs-subtheme)`

- **Leçons** (2) :
  - Droits et devoirs `(cm1-lesson-droits-devoirs)` — blocs: paragraph, example, bullets, tip
  - La laïcité à l'école `(cm1-lesson-laicite-ecole)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Droits et devoirs `(cm1-emc-droits-devoirs)` — engine: `choice-engine`, type=factual-qcm, category=cm1-droits-devoirs, dataFile=data/emc_cm1.json, questions=8
  - Règles et justice `(cm1-emc-regles-justice)` — engine: `choice-engine`, type=factual-qcm, category=cm1-droits-devoirs, dataFile=data/emc_cm1.json, questions=10
  - Défi : droits et devoirs `(cm1-bonus-emc-droits-devoirs-defi)` — engine: `choice-engine`, type=factual-qcm, category=cm1-droits-devoirs, dataFile=data/emc_cm1.json, questions=12, bonus (seuil=2)
  - Droits, institutions et valeurs `(cm1-emc-appariement)` — engine: `matching`, category=matching_emc_cm1, dataFile=data/emc_matching.json, questions=3
  - Citoyenneté au quotidien `(cm1-emc-appariement-2)` — engine: `matching`, category=matching_emc_cm1, dataFile=data/emc_matching.json, questions=3

#### Citoyenneté `(cm1-emc-citoyennete-subtheme)`

- **Leçons** (3) :
  - Décider ensemble `(cm1-lesson-citoyennete)` — blocs: paragraph, example, bullets, tip
  - Les symboles de la République `(cm1-lesson-symboles-republique)` — blocs: paragraph, example, bullets, tip
  - La laïcité `(cm1-lesson-laicite-republique)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Citoyenneté `(cm1-emc-citoyennete)` — engine: `choice-engine`, type=factual-qcm, category=cm1-citoyennete, dataFile=data/emc_cm1.json, questions=6
  - Participer à la vie collective `(cm1-emc-vie-collective)` — engine: `choice-engine`, type=factual-qcm, category=cm1-citoyennete, dataFile=data/emc_cm1.json, questions=8
  - Débat et coopération `(cm1-emc-debat-cooperation)` — engine: `choice-engine`, type=factual-qcm, category=cm1-debat-cooperation, dataFile=data/emc_cm1.json, questions=8
  - Parole citoyenne `(cm1-emc-parole-citoyenne)` — engine: `choice-engine`, type=factual-qcm, category=cm1-parole-citoyenne, dataFile=data/emc_cm1.json, questions=6
  - Engagement dans la classe `(cm1-emc-engagement-classe)` — engine: `choice-engine`, type=factual-qcm, category=cm1-engagement-classe, dataFile=data/emc_cm1.json, questions=6
  - Défi : citoyen engagé `(cm1-bonus-emc-citoyennete-expert)` — engine: `choice-engine`, type=factual-qcm, category=cm1-debat-cooperation, dataFile=data/emc_cm1.json, questions=12, bonus (seuil=2)


---

## CM2

### Mathématiques (cm2-maths-subject)

#### Nombres & calcul mental `(cm2-nombres-calcul-mental)`

- **Leçons** (1) :
  - Lire et écrire les grands nombres `(cm2-lesson-grands-nombres)` — blocs: paragraph, example, mini-table, tip
- **Exercices** (10) :
  - Les Milliards `(cm2_grands_nombres)` — engine: `math-input`, type=dictée-nombres, questions=10, min=1000000, max=9999999999
  - Division Mentale `(cm2_division_mentale)` — engine: `math-input`, type=calc-mental, questions=10
  - Tables x11 à x15 `(cm2_tables_x)` — engine: `math-input`, type=calc-mental, questions=10
  - Tables x16 à x20 `(cm2_tables_x_16_20)` — engine: `math-input`, type=calc-mental, questions=10
  - Très grands nombres `(cm2_grands_nombres_2)` — engine: `math-input`, type=dictée-nombres, questions=10, min=100000000, max=9999999999
  - Décimaux (2) `(cm2-decimaux-compare-2)` — engine: `choice-engine`, type=compare-decimals, questions=12
  - Problèmes décimaux et fractions `(cm2-problemes-decimaux-fractions)` — engine: `choice-engine`, type=factual-qcm, category=cm2-problemes-decimaux-fractions, dataFile=data/math_word_problems_cycle3.json, questions=8
  - Problèmes de pourcentages `(cm2-problemes-pourcentages)` — engine: `choice-engine`, type=factual-qcm, category=cm2-problemes-pourcentages, dataFile=data/math_word_problems_cycle3.json, questions=8
  - Problèmes à étapes `(cm2-problemes-multi-etapes)` — engine: `choice-engine`, type=factual-qcm, category=cm2-problemes-multi-etapes, dataFile=data/math_word_problems_cycle3.json, questions=8
  - Défi : tables x21 à x25 `(cm2-bonus-tables-x-21-25)` — engine: `math-input`, type=calc-mental, questions=10, bonus (seuil=2)

#### Fractions & décimaux `(cm2-fractions-decimaux)`

- **Leçons** (2) :
  - Comparer des décimaux `(cm2-lesson-decimaux-comparer)` — blocs: paragraph, example, bullets, tip
  - Fraction ou décimal ? `(cm2-lesson-fractions-decimaux-lien)` — blocs: paragraph, example, mini-table, tip
- **Exercices** (8) :
  - Décimaux `(cm2_decimaux_compare)` — engine: `choice-engine`, type=compare-decimals, questions=10
  - Fractions `(cm2_fractions_lecture)` — engine: `math-input`, type=fraction-view, questions=10, maxDenom=12
  - Construis la fraction `(cm2-frac-build)` — engine: `board-interactive`, type=fraction-build, questions=8, minDenom=2, maxDenom=12
  - Décimaux : positions `(cm2_decimaux_positions)` — engine: `math-input`, type=decimal-place, questions=10
  - Décimaux : positions (2) `(cm2_decimaux_positions_2)` — engine: `math-input`, type=decimal-place, questions=10
  - Fractions (2) `(cm2_fractions_lecture_2)` — engine: `math-input`, type=fraction-view, questions=10, maxDenom=20
  - Fractions et décimaux `(cm2-maths-fractions-appariement)` — engine: `matching`, category=matching_math_cm2, dataFile=data/math_matching.json, questions=3
  - Défi : fractions expertes `(cm2-bonus-fractions-expert)` — engine: `math-input`, type=fraction-view, questions=12, maxDenom=24, bonus (seuil=2)

#### Division posée `(cm2-division-posee-subtheme)`

- **Leçons** (2) :
  - Comprendre la division posée `(cm2-lesson-division-comprendre)` — blocs: paragraph, example, bullets, tip
  - Vérifier une division `(cm2-lesson-division-verifier)` — blocs: paragraph, mini-table, example, tip
- **Exercices** (5) :
  - Division posée `(cm2_division_posee)` — engine: `math-input`, type=division-posed, questions=6
  - Division posée : reste `(cm2_division_posee_reste)` — engine: `math-input`, type=division-posed, questions=6
  - Division mentale experte `(cm2_division_simple_expert)` — engine: `math-input`, type=division-simple, questions=10
  - Division avec reste `(cm2_division_reste_expert)` — engine: `math-input`, type=division-reste, questions=10
  - Défi : division posée experte `(cm2-bonus-division-posee-experte)` — engine: `math-input`, type=division-posed, questions=8, bonus (seuil=2)

#### Grandeurs & mesures `(cm2-grandeurs-mesures-subtheme)`

- **Leçons** (3) :
  - Convertir des durées `(cm2-lesson-conversions-temps)` — blocs: paragraph, example, mini-table, tip
  - Mesurer des longueurs `(cm2-lesson-mesures-longueurs)` — blocs: paragraph, mini-table, example, tip
  - Proportionnalité, échelle et vitesse `(cm2-lesson-proportionnalite-echelle)` — blocs: paragraph, example, mini-table, example, bullets, example, tip
- **Exercices** (17) :
  - Conversions de longueurs `(cm2-conversions-longueurs)` — engine: `conversion`, questions=10
  - Heures et minutes `(cm2-heures-minutes)` — engine: `conversion`, questions=10
  - Minutes et secondes `(cm2-minutes-secondes)` — engine: `conversion`, questions=10
  - Lire l'horloge `(cm2-lire-horloge)` — engine: `clock`, questions=8
  - Chiffres Romains `(cm2-romains-100)` — engine: `conversion`, questions=6, max=100
  - Heures et minutes (aide) `(cm2-heures-minutes-aide)` — engine: `conversion`, questions=10
  - Minutes vers Secondes (2) `(cm2-heures-secondes)` — engine: `conversion`, questions=10
  - Conversions de longueurs (2) `(cm2-conversions-longueurs-2)` — engine: `conversion`, questions=12
  - Chiffres romains (3) `(cm2-romains-500)` — engine: `conversion`, questions=6, max=500
  - Proportionnalité et échelle `(cm2-proportionnalite-echelle)` — engine: `math-input`, type=proportionnalite, questions=4
  - Calculer un pourcentage `(cm2-pourcentages)` — engine: `math-input`, type=pourcentage, questions=6
  - Lire une échelle de plan `(cm2-echelle-plan)` — engine: `math-input`, type=echelle, questions=4
  - Vitesse, distance, durée `(cm2-vitesse-1)` — engine: `math-input`, type=vitesse, questions=6
  - Défi : proportionnalité experte `(cm2-bonus-proportionnalite-expert)` — engine: `math-input`, type=pourcentage, questions=8, bonus (seuil=2)
  - Convertir des masses `(cm2-conversions-masses)` — engine: `conversion`, questions=6
  - Convertir des contenances `(cm2-conversions-contenances)` — engine: `conversion`, questions=6
  - Défi : chiffres romains jusqu'à M `(cm2-bonus-romains-1000)` — engine: `conversion`, questions=8, max=1000, bonus (seuil=2)

#### Géométrie `(cm2-geometrie-subtheme)`

- **Leçons** (4) :
  - Droites et angles `(cm2-lesson-droites-angles)` — blocs: paragraph, example, bullets, tip
  - Polygones et cercle `(cm2-lesson-figures-cercle)` — blocs: paragraph, example, bullets, tip
  - La symétrie `(cm2-lesson-symetrie)` — blocs: paragraph, example, bullets, tip
  - Aires et volumes `(cm2-lesson-aires-volumes)` — blocs: paragraph, example, example, bullets, tip
- **Exercices** (10) :
  - Droites et angles `(cm2-geo-droites-angles)` — engine: `choice-engine`, type=factual-qcm, category=cm2-droites-angles, dataFile=data/math_geometry_cm2.json, questions=8
  - Symétrie et figures `(cm2-geo-symetrie-figures)` — engine: `choice-engine`, type=factual-qcm, category=cm2-symetrie-figures, dataFile=data/math_geometry_cm2.json, questions=8
  - Complète la figure symétrique `(cm2-geo-symetrie-pratique)` — engine: `board-interactive`, type=symmetry-complete, category=cm2_symmetry_complete, dataFile=data/board_symmetry_complete_cm2.json, questions=5
  - Construction géométrique `(cm2-geo-vocabulaire-construction)` — engine: `choice-engine`, type=factual-qcm, category=cm2-vocabulaire-construction, dataFile=data/math_geometry_cm2.json, questions=8
  - Nature des angles `(cm2-geo-nature-angles)` — engine: `choice-engine`, type=factual-qcm, category=cm2-nature-angles, dataFile=data/math_geometry_cm2.json, questions=8
  - Calculer une aire `(cm2-geo-aire-rectangle)` — engine: `math-input`, type=aire-rectangle, questions=6, max=20
  - Calculer un volume `(cm2-geo-volume-pave)` — engine: `math-input`, type=volume-pave, questions=5, max=8
  - Figures et propriétés `(cm2-maths-geo-appariement)` — engine: `matching`, category=matching_math_cm2, dataFile=data/math_matching.json, questions=3
  - Classer les formes géométriques `(cm2-geo-classement-formes)` — engine: `board-interactive`, type=shape-classify, category=cm2_shape_classify, dataFile=data/board_shape_classify_cm2.json, questions=6
  - Défi : volumes experts `(cm2-bonus-volume-pave-expert)` — engine: `math-input`, type=volume-pave, questions=6, max=15, bonus (seuil=2)

#### Lire un graphique `(cm2-graphiques-subtheme)`

- **Leçons** (1) :
  - Lire un diagramme en barres `(cm2-lesson-lire-graphique)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Lire un diagramme en barres `(cm2-graphique-lecture)` — engine: `math-input`, type=bar-chart-read, questions=6, maxBars=5, maxValue=30
  - Défi : graphiques en rafale `(cm2-bonus-graphique-expert)` — engine: `math-input`, type=bar-chart-read, questions=8, maxBars=5, maxValue=40, bonus (seuil=2)

### Français (cm2-francais-subject)

#### Conjugaison `(cm2-francais-conjugaison)`

- **Leçons** (2) :
  - Former le passé composé `(cm2-lesson-passe-compose)` — blocs: paragraph, example, bullets, tip
  - Être et avoir à l'imparfait `(cm2-lesson-etre-avoir-imparfait)` — blocs: paragraph, example, mini-table, bullets, tip
- **Exercices** (8) :
  - Présent 3e Groupe `(cm2_conj_present_3)` — engine: `conjugation`, category=present_3_freq, questions=10
  - Futur Simple `(cm2_conj_future)` — engine: `conjugation`, category=future_1, questions=10
  - L'Imparfait `(cm2_conj_imparfait)` — engine: `conjugation`, category=imparfait_1, questions=10
  - Passé Composé `(cm2_conj_pc)` — engine: `conjugation`, category=pc_1, questions=10
  - Passé Composé du 3e groupe `(cm2_conj_pc_3)` — engine: `conjugation`, category=pc_3_cm2, questions=10
  - Présent du 2e groupe `(cm2-conj-present-2g)` — engine: `conjugation`, category=present_2, questions=10
  - Être et avoir à l'imparfait `(cm2-conj-ea-imp)` — engine: `conjugation`, category=etre_avoir_imp, questions=8
  - Défi : passé composé expert `(cm2-bonus-conj-pc-3-expert)` — engine: `conjugation`, category=pc_3_cm2, questions=14, bonus (seuil=2)

#### Homophones `(cm2-francais-homophones)`

- **Leçons** (2) :
  - Choisir le bon homophone `(cm2-lesson-homophones-strategie)` — blocs: paragraph, example, bullets, tip
  - Tester un remplacement `(cm2-lesson-homophones-remplacement)` — blocs: paragraph, example, mini-table, tip
- **Exercices** (8) :
  - Grand Mix Homophones `(cm2_homophones_mix)` — engine: `choice-engine`, type=homophone-duel, category=mix_all, questions=15
  - Ce ou se ? `(cm2_homophones_ce_se)` — engine: `choice-engine`, type=homophone-duel, category=ce_se, questions=10
  - Ces ou ses ? `(cm2_homophones_ces_ses)` — engine: `choice-engine`, type=homophone-duel, category=ces_ses, questions=10
  - A ou à ? `(cm2_homophones_a_a)` — engine: `choice-engine`, type=homophone-duel, category=a_à, questions=10
  - Ou ou où ? `(cm2_homophones_ou_ou)` — engine: `choice-engine`, type=homophone-duel, category=ou_où, questions=10
  - Son ou Sont ? `(cm2-homophones-son-sont)` — engine: `choice-engine`, type=homophone-duel, category=son_sont, questions=10
  - On ou Ont ? `(cm2-homophones-on-ont)` — engine: `choice-engine`, type=homophone-duel, category=on_ont, questions=10
  - Défi : grand mix expert `(cm2-bonus-homophones-mix-expert)` — engine: `choice-engine`, type=homophone-duel, category=mix_all, questions=20, bonus (seuil=2)

#### Grammaire `(cm2-francais-grammaire)`

- **Leçons** (3) :
  - Accorder le groupe nominal `(cm2-lesson-accords-groupe-nominal)` — blocs: paragraph, example, mini-table, tip
  - Trouver le sujet et le verbe `(cm2-lesson-sujet-verbe)` — blocs: paragraph, example, bullets, tip
  - Comprendre le sens des mots `(cm2-lesson-sens-des-mots)` — blocs: paragraph, example, bullets, tip
- **Exercices** (11) :
  - Un ou Une ? `(cm2_g_abstrait)` — engine: `choice-engine`, type=gender-articles, category=gender_cm2_abstrait, questions=8
  - Le, La ou L' ? `(cm2_g_elision)` — engine: `choice-engine`, type=gender-articles, category=gender_cm2_elision, questions=8
  - Le bon article `(cm2_g_article_qcm)` — engine: `choice-engine`, type=article-choice, category=article_choice_cm2, questions=8
  - Singulier ou pluriel ? `(cm2_g_pluriel_qcm)` — engine: `choice-engine`, type=plural-choice, category=plural_choice_cm2, questions=8
  - Nom, verbe ou adjectif `(cm2_g_nature_qcm)` — engine: `choice-engine`, type=word-class-choice, category=word_class_choice_cm2, questions=8
  - Sujet, verbe ou complément `(cm2_g_fonction_qcm)` — engine: `choice-engine`, type=word-class-choice, category=sentence_function_choice_cm2, questions=6
  - Déterminant dans la phrase `(cm2_g_cloze_det)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_cloze_cm2, questions=8
  - Écris le bon mot `(cm2_g_cloze_ecrit)` — engine: `cloze-fill-in`, category=grammar_cloze_cm2, questions=6
  - Accorder dans la phrase `(cm2_g_cloze_accord)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_agreement_cm2, questions=8
  - Ordre des mots `(cm2-francais-ordre-mots)` — engine: `word-order`, category=word_order_cm2, dataFile=data/french_word_order.json, questions=5
  - Défi : accorder sans filet `(cm2-bonus-grammaire-cloze-accord)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_agreement_cm2, questions=14, bonus (seuil=2)

#### Lecture et vocabulaire `(cm2-francais-lecture-vocabulaire-subtheme)`

- **Leçons** (4) :
  - Trouver l'idée principale `(cm2-lesson-idee-principale)` — blocs: paragraph, example, bullets, tip
  - Employer un vocabulaire précis `(cm2-lesson-vocabulaire-precis)` — blocs: paragraph, example, bullets, tip
  - Sens propre et sens figuré `(cm2-lesson-sens-propre-figure)` — blocs: paragraph, example, bullets, tip
  - Polysémie et familles de mots avancées `(cm2-lesson-polysemie-familles-avance)` — blocs: paragraph, example, bullets, tip
- **Exercices** (7) :
  - Trouver l idée principale `(cm2-lecture-idee-principale)` — engine: `reading`, category=cm2_lecture_idee_principale, questions=5
  - Choisir le sens du mot `(cm2-vocabulaire-sens)` — engine: `reading`, category=cm2_vocabulaire_sens, questions=5
  - Sens propre ou sens figuré ? `(cm2-sens-propre-figure)` — engine: `reading`, category=cm2_sens_propre_figure, questions=6
  - Un mot, plusieurs sens `(cm2-vocabulaire-polysemie)` — engine: `reading`, category=cm2_vocabulaire_polysemie, questions=6
  - Les familles de mots `(cm2-vocabulaire-familles-mots)` — engine: `reading`, category=cm2_vocabulaire_familles_mots, questions=6
  - Expressions et synonymes `(cm2-vocab-appariement)` — engine: `matching`, category=matching_expressions_cm2, dataFile=data/french/matching.json, questions=2
  - Défi : polysémie experte `(cm2-bonus-vocabulaire-polysemie-expert)` — engine: `reading`, category=cm2_vocabulaire_polysemie, questions=10, bonus (seuil=2)

#### Dictée audio `(cm2-dictee-audio-subtheme)`

- **Leçons** (1) :
  - Une dictée exigeante `(cm2-lesson-dictee-exigeante)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Vocabulaire scolaire avancé `(cm2-audio-ecole-avancee)` — engine: `audio-spelling`, category=school_advanced, questions=8
  - Vocabulaire de la maison `(cm2-audio-maison-avancee)` — engine: `audio-spelling`, category=house_advanced, questions=8
  - Orthographe avancée `(cm2-audio-orthographe-avancee)` — engine: `audio-spelling`, category=cm2_orthographe_avancee, questions=8
  - Vocabulaire citoyen `(cm2-audio-citoyennete)` — engine: `audio-spelling`, category=cm2_vocabulaire_citoyennete, questions=8
  - Défi : dictée sans ralenti `(cm2-bonus-audio-orthographe-rapide)` — engine: `audio-spelling`, category=cm2_orthographe_avancee, questions=10, bonus (seuil=2)

### Histoire (cm2-histoire-subject)

#### Repères historiques `(cm2-histoire-reperes)`

- **Leçons** (4) :
  - La Révolution française `(cm2-lesson-revolution-francaise)` — blocs: paragraph, example, bullets, tip
  - Le temps de la République `(cm2-lesson-temps-republique)` — blocs: paragraph, example, bullets, tip
  - La France et l'Union européenne `(cm2-lesson-france-europe)` — blocs: paragraph, example, bullets, tip
  - Le XXe siècle en France `(cm2-lesson-reperes-xxe-siecle)` — blocs: paragraph, bullets, example, tip
- **Exercices** (7) :
  - Révolution `(cm2-histoire-revolution)` — engine: `choice-engine`, type=factual-qcm, category=cm2-revolution, dataFile=data/history_cm2.json, questions=8
  - XXe siècle `(cm2-histoire-xxe)` — engine: `choice-engine`, type=factual-qcm, category=cm2-xxe-siecle, dataFile=data/history_cm2.json, questions=8
  - République `(cm2-histoire-republique)` — engine: `choice-engine`, type=factual-qcm, category=cm2-republique, dataFile=data/history_cm2.json, questions=6
  - Symboles de la République `(cm2-histoire-symboles-republique)` — engine: `choice-engine`, type=factual-qcm, category=cm2-symboles-republique, dataFile=data/history_cm2.json, questions=6
  - Vie démocratique `(cm2-histoire-vie-democratique)` — engine: `choice-engine`, type=factual-qcm, category=cm2-vie-democratique, dataFile=data/history_cm2.json, questions=6
  - Dates et symboles `(cm2-histoire-appariement)` — engine: `matching`, category=matching_histoire_cm2, dataFile=data/history_matching.json, questions=2
  - Défi : XXe siècle expert `(cm2-bonus-histoire-xxe-expert)` — engine: `choice-engine`, type=factual-qcm, category=cm2-xxe-siecle, dataFile=data/history_cm2.json, questions=12, bonus (seuil=2)

#### Frises historiques `(cm2-histoire-frises)`

- **Leçons** (2) :
  - Quelques repères du XXe siècle `(cm2-lesson-reperes-xxe-siecle-frise)` — blocs: paragraph, bullets, example, tip
  - Les progrès techniques `(cm2-lesson-progres-techniques)` — blocs: paragraph, bullets, example, tip
- **Exercices** (11) :
  - Frise historique `(cm2-histoire-frise-ordre)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Placer sur la frise `(cm2-histoire-frise-place)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Placer sur la frise - Niv 1 `(cm2-histoire-frise-place-n1)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Placer sur la frise - Niv 2 `(cm2-histoire-frise-place-n2)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Placer sur la frise - Niv 3 `(cm2-histoire-frise-place-n3)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Frise : Révolution `(cm2-histoire-frise-revolution-ordre)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Frise : XIXe siècle `(cm2-histoire-frise-xix-ordre)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Frise : Progrès techniques `(cm2-histoire-frise-progres-ordre)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Placer : République `(cm2-histoire-frise-republique-place)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Placer : Europe `(cm2-histoire-frise-europe-place)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=5
  - Défi : Guerres et paix `(cm2-bonus-histoire-frise-guerres-paix)` — engine: `timeline`, dataFile=data/history_chrono.json, questions=7, bonus (seuil=2)

#### Récits historiques `(cm2-histoire-recits-subtheme)`

- **Leçons** (3) :
  - La Révolution française `(cm2-lesson-revolution-francaise-recit)` — blocs: paragraph, example, bullets, tip
  - La République s'installe `(cm2-lesson-republique-progres)` — blocs: paragraph, example, bullets, tip
  - Le XXe siècle en France `(cm2-lesson-xxe-siecle-changements)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Récits de la Révolution à la République `(cm2-histoire-recits-revolution-republique)` — engine: `choice-engine`, type=factual-qcm, category=cm2-recits-historiques, dataFile=data/history_cm2.json, questions=8
  - Défi : récits historiques `(cm2-bonus-histoire-recits-expert)` — engine: `choice-engine`, type=factual-qcm, category=cm2-recits-historiques, dataFile=data/history_cm2.json, questions=8, bonus (seuil=2)

### Géographie (cm2-geographie-subject)

#### France et Europe `(cm2-geo-europe-subtheme)`

- **Leçons** (2) :
  - Habiter des espaces différents `(cm2-lesson-habiter-espaces-differents)` — blocs: paragraph, example, bullets, tip
  - La France dans l'Union européenne `(cm2-lesson-france-union-europeenne)` — blocs: paragraph, example, bullets, tip
- **Exercices** (8) :
  - France et Europe `(cm2-geo-europe)` — engine: `choice-engine`, type=factual-qcm, category=cm2-france-europe, dataFile=data/geography_cm2.json, questions=8
  - Europe proche `(cm2-geo-europe-proche)` — engine: `choice-engine`, type=factual-qcm, category=cm2-europe-proche, dataFile=data/geography_cm2.json, questions=6
  - Union européenne `(cm2-geo-union-europeenne)` — engine: `choice-engine`, type=factual-qcm, category=cm2-union-europeenne, dataFile=data/geography_cm2.json, questions=6
  - Voyager en Europe `(cm2-geo-voyager-europe)` — engine: `choice-engine`, type=factual-qcm, category=cm2-voyager-europe, dataFile=data/geography_cm2.json, questions=6
  - Pays et capitales `(cm2-geo-appariement)` — engine: `matching`, category=matching_geo_cm2, dataFile=data/geography_matching.json, questions=2
  - Carte de l'Europe `(cm2-geo-carte-europe-pays)` — engine: `board-interactive`, type=map-locate, category=cm1_map_pays_europe, dataFile=data/board_map_locate_europe.json, mapFile=data/maps/europe-countries.svg, mapId=europe-countries, questions=8
  - Capitales d'Europe `(cm2-geo-capitales-europe)` — engine: `choice-engine`, type=factual-qcm, category=cm1-capitales-europe, dataFile=data/geography_capitals_cm1.json, questions=8
  - Défi : situer l'Europe dans le monde `(cm2-bonus-geo-carte-monde-continents)` — engine: `board-interactive`, type=map-locate, category=cm1_map_continents_monde, dataFile=data/board_map_locate_world.json, mapFile=data/maps/world-continents.svg, mapId=world-continents, questions=8, bonus (seuil=2)

#### Habiter `(cm2-geo-habiter-subtheme)`

- **Leçons** (2) :
  - Échanger et circuler dans le monde `(cm2-lesson-mondialisation-echanges)` — blocs: paragraph, example, bullets, tip
  - Les grands territoires français `(cm2-lesson-territoires-france)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Habiter `(cm2-geo-habiter)` — engine: `choice-engine`, type=factual-qcm, category=cm2-habiter, dataFile=data/geography_cm2.json, questions=8
  - Habiter différents espaces `(cm2-geo-habiter-espaces)` — engine: `choice-engine`, type=factual-qcm, category=cm2-habiter, dataFile=data/geography_cm2.json, questions=10
  - Défi : habiter `(cm2-bonus-geo-habiter-defi)` — engine: `choice-engine`, type=factual-qcm, category=cm2-habiter, dataFile=data/geography_cm2.json, questions=7, bonus (seuil=2)

#### Échanges `(cm2-geo-mondialisation-subtheme)`

- **Leçons** (2) :
  - Les acteurs de la mondialisation `(cm2-lesson-acteurs-mondialisation)` — blocs: paragraph, example, bullets, tip
  - Agir pour un développement durable `(cm2-lesson-developpement-durable-echanges)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Échanges `(cm2-geo-mondialisation)` — engine: `choice-engine`, type=factual-qcm, category=cm2-mondialisation, dataFile=data/geography_cm2.json, questions=6
  - Échanges et flux `(cm2-geo-echanges-flux)` — engine: `choice-engine`, type=factual-qcm, category=cm2-echanges-flux, dataFile=data/geography_cm2.json, questions=6
  - Les acteurs de la mondialisation `(cm2-geo-acteurs-mondialisation)` — engine: `choice-engine`, type=factual-qcm, category=cm2-acteurs-mondialisation, dataFile=data/geography_cm2.json, questions=6
  - Mondialisation et vocabulaire `(cm2-geo-mondialisation-appariement)` — engine: `matching`, category=matching_geo_cm2, dataFile=data/geography_matching.json, questions=2
  - Défi : acteurs de la mondialisation `(cm2-bonus-geo-acteurs-mondialisation-expert)` — engine: `choice-engine`, type=factual-qcm, category=cm2-acteurs-mondialisation, dataFile=data/geography_cm2.json, questions=10, bonus (seuil=2)

#### Développement durable `(cm2-geo-durable-subtheme)`

- **Leçons** (3) :
  - Habiter plus durablement `(cm2-lesson-habiter-durablement)` — blocs: paragraph, bullets, tip
  - Le développement durable `(cm2-lesson-developpement-durable)` — blocs: paragraph, example, bullets, tip
  - Protéger les milieux `(cm2-lesson-proteger-environnement)` — blocs: paragraph, bullets, example, tip
- **Exercices** (7) :
  - Développement durable `(cm2-geo-durable)` — engine: `choice-engine`, type=factual-qcm, category=cm2-developpement-durable, dataFile=data/geography_cm2.json, questions=6
  - Agir pour durer `(cm2-geo-agir-pour-durer)` — engine: `choice-engine`, type=factual-qcm, category=cm2-developpement-durable, dataFile=data/geography_cm2.json, questions=8
  - Mobilités durables `(cm2-geo-mobilites-durables)` — engine: `choice-engine`, type=factual-qcm, category=cm2-mobilites-durables, dataFile=data/geography_cm2.json, questions=8
  - Consommation responsable `(cm2-geo-consommation-responsable)` — engine: `choice-engine`, type=factual-qcm, category=cm2-consommation-responsable, dataFile=data/science_cm2.json, questions=6
  - Coopérer en Europe `(cm2-geo-cooperation-europe)` — engine: `choice-engine`, type=factual-qcm, category=cm2-cooperation-europe, dataFile=data/geography_cm2.json, questions=6
  - Gestes et environnement `(cm2-geo-durable-appariement)` — engine: `matching`, category=matching_geo_cm2, dataFile=data/geography_matching.json, questions=2
  - Défi : agir pour durer `(cm2-bonus-geo-agir-pour-durer-expert)` — engine: `choice-engine`, type=factual-qcm, category=cm2-developpement-durable, dataFile=data/geography_cm2.json, questions=12, bonus (seuil=2)

### Sciences (cm2-sciences-subject)

#### Corps et santé `(cm2-sciences-corps-subtheme)`

- **Leçons** (2) :
  - Préserver sa santé `(cm2-lesson-corps-sante)` — blocs: paragraph, bullets, tip
  - Les cinq sens `(cm2-lesson-cinq-sens)` — blocs: paragraph, mini-table, example, tip
- **Exercices** (2) :
  - Corps et santé `(cm2-sciences-corps)` — engine: `choice-engine`, type=factual-qcm, category=cm2-corps-sante, dataFile=data/science_cm2.json, questions=8
  - Préserver sa santé `(cm2-sciences-preserver-sante)` — engine: `choice-engine`, type=factual-qcm, category=cm2-corps-sante, dataFile=data/science_cm2.json, questions=10

#### Énergie `(cm2-sciences-energie-subtheme)`

- **Leçons** (1) :
  - Produire et utiliser l'énergie `(cm2-lesson-sources-energie)` — blocs: paragraph, bullets, tip
- **Exercices** (5) :
  - Énergie `(cm2-sciences-energie)` — engine: `choice-engine`, type=factual-qcm, category=cm2-techno-energie, dataFile=data/science_cm2.json, questions=8
  - Produire et économiser l'énergie `(cm2-sciences-produire-economiser-energie)` — engine: `choice-engine`, type=factual-qcm, category=cm2-techno-energie, dataFile=data/science_cm2.json, questions=10
  - Économies d'énergie `(cm2-sciences-economies-energie)` — engine: `choice-engine`, type=factual-qcm, category=cm2-economies-energie, dataFile=data/science_cm2.json, questions=8
  - Sources d'énergie et risques climatiques `(cm2-sciences-energie-appariement)` — engine: `matching`, category=matching_sciences_cm2, dataFile=data/science_matching.json, questions=2
  - Défi : énergie et économies `(cm2-bonus-sciences-energie-expert)` — engine: `choice-engine`, type=factual-qcm, category=cm2-techno-energie, dataFile=data/science_cm2.json, questions=12, bonus (seuil=2)

#### Environnement `(cm2-sciences-environnement-subtheme)`

- **Leçons** (2) :
  - Protéger les milieux `(cm2-lesson-proteger-environnement-sciences)` — blocs: paragraph, bullets, tip
  - Les états de la matière `(cm2-lesson-etats-matiere)` — blocs: paragraph, mini-table, example, tip
- **Exercices** (5) :
  - Environnement `(cm2-sciences-environnement)` — engine: `choice-engine`, type=factual-qcm, category=cm2-environnement, dataFile=data/science_cm2.json, questions=6
  - Protéger les milieux `(cm2-sciences-proteger-milieux)` — engine: `choice-engine`, type=factual-qcm, category=cm2-environnement, dataFile=data/science_cm2.json, questions=8
  - Éco-gestes `(cm2-sciences-eco-gestes)` — engine: `choice-engine`, type=factual-qcm, category=cm2-eco-gestes, dataFile=data/science_cm2.json, questions=8
  - Gestes et environnement `(cm2-sciences-appariement)` — engine: `matching`, category=matching_sciences_cm2, dataFile=data/science_matching.json, questions=2
  - Défi : éco-gestes au quotidien `(cm2-bonus-sciences-eco-gestes-expert)` — engine: `choice-engine`, type=factual-qcm, category=cm2-eco-gestes, dataFile=data/science_cm2.json, questions=12, bonus (seuil=2)

#### Corps et effort `(cm2-sciences-effort-subtheme)`

- **Leçons** (1) :
  - Le corps pendant l'effort `(cm2-lesson-corps-effort)` — blocs: paragraph, example, tip
- **Exercices** (2) :
  - Corps et effort `(cm2-sciences-effort)` — engine: `choice-engine`, type=factual-qcm, category=cm2-corps-effort, dataFile=data/science_cm2.json, questions=6
  - Respirer et récupérer `(cm2-sciences-respirer-recuperer)` — engine: `choice-engine`, type=factual-qcm, category=cm2-corps-effort, dataFile=data/science_cm2.json, questions=8

#### Électricité `(cm2-sciences-electricite-subtheme)`

- **Leçons** (1) :
  - Faire circuler l'électricité `(cm2-lesson-electricite-circuit)` — blocs: paragraph, bullets, tip
- **Exercices** (6) :
  - Électricité `(cm2-sciences-electricite)` — engine: `choice-engine`, type=factual-qcm, category=cm2-electricite-objets, dataFile=data/science_cm2.json, questions=6
  - Objets techniques `(cm2-sciences-objets-techniques)` — engine: `choice-engine`, type=factual-qcm, category=cm2-objets-techniques-quotidien, dataFile=data/science_cm2.json, questions=6
  - Sécurité électrique `(cm2-sciences-securite-electrique)` — engine: `choice-engine`, type=factual-qcm, category=cm2-securite-electrique, dataFile=data/science_cm2.json, questions=6
  - Le circuit électrique `(cm2-sciences-tap-circuit)` — engine: `board-interactive`, type=tap-features, category=cm2_tap_circuit_electrique, dataFile=data/board_tap_features_science.json, questions=3
  - Sécurité électrique et appareils `(cm2-sciences-electricite-appariement)` — engine: `matching`, category=matching_sciences_cm2, dataFile=data/science_matching.json, questions=2
  - Défi : sécurité électrique experte `(cm2-bonus-sciences-securite-electrique-expert)` — engine: `choice-engine`, type=factual-qcm, category=cm2-securite-electrique, dataFile=data/science_cm2.json, questions=12, bonus (seuil=2)

#### Climat et déchets `(cm2-sciences-climat-subtheme)`

- **Leçons** (1) :
  - Réduire les déchets `(cm2-lesson-climat-dechets)` — blocs: paragraph, bullets, tip
- **Exercices** (4) :
  - Climat et déchets `(cm2-sciences-climat)` — engine: `choice-engine`, type=factual-qcm, category=cm2-climat-dechets, dataFile=data/science_cm2.json, questions=6
  - Prévention des déchets `(cm2-sciences-prevention-dechets)` — engine: `choice-engine`, type=factual-qcm, category=cm2-prevention-dechets, dataFile=data/science_cm2.json, questions=6
  - Risques climatiques `(cm2-sciences-risques-climatiques)` — engine: `choice-engine`, type=factual-qcm, category=cm2-risques-climatiques, dataFile=data/science_cm2.json, questions=6
  - Défi : risques climatiques `(cm2-bonus-sciences-climat-defi)` — engine: `choice-engine`, type=factual-qcm, category=cm2-risques-climatiques, dataFile=data/science_cm2.json, questions=5, bonus (seuil=2)

#### Matière et transformations `(cm2-sciences-matiere-transformations-subtheme)`

- **Leçons** (3) :
  - Les états et les transformations `(cm2-lesson-etats-transformations)` — blocs: paragraph, example, bullets, tip
  - Mélanges et séparations `(cm2-lesson-melanges-separations)` — blocs: paragraph, example, bullets, tip
  - Lumière et son `(cm2-lesson-lumiere-son)` — blocs: paragraph, example, bullets, tip
- **Exercices** (2) :
  - Matière et transformations `(cm2-sciences-matiere-transformations)` — engine: `choice-engine`, type=factual-qcm, category=cm2-matiere-transformations, dataFile=data/science_cm2.json, questions=8
  - Consommation responsable `(cm2-sciences-consommation-responsable-matiere)` — engine: `choice-engine`, type=factual-qcm, category=cm2-consommation-responsable, dataFile=data/science_cm2.json, questions=6

### EMC (cm2-emc-subject)

#### Citoyenneté `(cm2-emc-citoyennete-subtheme)`

- **Leçons** (4) :
  - Droits et devoirs du citoyen `(cm2-lesson-citoyennete-droits-devoirs)` — blocs: paragraph, bullets, tip
  - La laïcité à l'école `(cm2-lesson-laicite-ecole)` — blocs: paragraph, example, bullets, tip
  - Les institutions de la République `(cm2-lesson-institutions-republique)` — blocs: paragraph, bullets, example, tip
  - Les institutions de la République `(cm2-lesson-institutions-republique-citoyens)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Citoyenneté `(cm2-emc-citoyennete)` — engine: `choice-engine`, type=factual-qcm, category=cm2-citoyennete, dataFile=data/emc_cm2.json, questions=8
  - Débattre et choisir `(cm2-emc-debattre-choisir)` — engine: `choice-engine`, type=factual-qcm, category=cm2-citoyennete, dataFile=data/emc_cm2.json, questions=10
  - Institutions et démocratie `(cm2-emc-appariement)` — engine: `matching`, category=matching_emc_cm2, dataFile=data/emc_matching.json, questions=3
  - Valeurs et engagement citoyen `(cm2-emc-appariement-2)` — engine: `matching`, category=matching_emc_cm2, dataFile=data/emc_matching.json, questions=3

#### Solidarité `(cm2-emc-solidarite-subtheme)`

- **Leçons** (1) :
  - Agir pour le bien commun `(cm2-lesson-solidarite-bien-commun)` — blocs: paragraph, example, tip
- **Exercices** (5) :
  - Solidarité `(cm2-emc-solidarite)` — engine: `choice-engine`, type=factual-qcm, category=cm2-solidarite, dataFile=data/emc_cm2.json, questions=8
  - Agir avec solidarité `(cm2-emc-agir-solidarite)` — engine: `choice-engine`, type=factual-qcm, category=cm2-solidarite, dataFile=data/emc_cm2.json, questions=10
  - Solidarité au quotidien `(cm2-emc-solidarite-quotidienne)` — engine: `choice-engine`, type=factual-qcm, category=cm2-solidarite-quotidienne, dataFile=data/emc_cm2.json, questions=6
  - Projet collectif `(cm2-emc-projet-collectif)` — engine: `choice-engine`, type=factual-qcm, category=cm2-projet-collectif, dataFile=data/emc_cm2.json, questions=6
  - Défi : solidarité au quotidien `(cm2-bonus-emc-solidarite-quotidienne-expert)` — engine: `choice-engine`, type=factual-qcm, category=cm2-solidarite-quotidienne, dataFile=data/emc_cm2.json, questions=10, bonus (seuil=2)

#### Engagement `(cm2-emc-engagement-subtheme)`

- **Leçons** (1) :
  - Participer à la vie collective `(cm2-lesson-engagement-participer)` — blocs: paragraph, bullets, example, tip
- **Exercices** (2) :
  - Engagement `(cm2-emc-engagement)` — engine: `choice-engine`, type=factual-qcm, category=cm2-engagement, dataFile=data/emc_cm2.json, questions=6
  - S'engager dans la classe `(cm2-emc-sengager-classe)` — engine: `choice-engine`, type=factual-qcm, category=cm2-engagement, dataFile=data/emc_cm2.json, questions=8

#### Responsabilités `(cm2-emc-responsabilites-subtheme)`

- **Leçons** (2) :
  - Assumer ses responsabilités `(cm2-lesson-responsabilites-justice)` — blocs: paragraph, bullets, tip
  - La loi et la justice `(cm2-lesson-loi-justice)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Responsabilités `(cm2-emc-responsabilites)` — engine: `choice-engine`, type=factual-qcm, category=cm2-responsabilites, dataFile=data/emc_cm2.json, questions=6
  - Assumer ses responsabilités `(cm2-emc-assumer-responsabilites)` — engine: `choice-engine`, type=factual-qcm, category=cm2-responsabilites, dataFile=data/emc_cm2.json, questions=8
  - Liberté et justice `(cm2-emc-liberte-justice)` — engine: `choice-engine`, type=factual-qcm, category=cm2-liberte-justice, dataFile=data/emc_cm2.json, questions=8

#### Institutions et débat `(cm2-emc-institutions-debat-subtheme)`

- **Leçons** (3) :
  - Égalité et dignité `(cm2-lesson-egalite-dignite)` — blocs: paragraph, example, bullets, tip
  - Le débat démocratique `(cm2-lesson-debat-democratique)` — blocs: paragraph, example, bullets, tip
  - La justice protège les droits `(cm2-lesson-justice-proteger)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Égalité, débat et justice `(cm2-emc-institutions-debat-egalite-justice)` — engine: `choice-engine`, type=factual-qcm, category=cm2-institutions-debat, dataFile=data/emc_cm2.json, questions=8
  - Les institutions de la République `(cm2-emc-institutions-republique)` — engine: `choice-engine`, type=factual-qcm, category=cm2-citoyennete, dataFile=data/emc_cm2.json, questions=7
  - Défi : institutions et débat `(cm2-bonus-institutions-debat-expert)` — engine: `choice-engine`, type=factual-qcm, category=cm2-institutions-debat, dataFile=data/emc_cm2.json, questions=9, bonus (seuil=2)


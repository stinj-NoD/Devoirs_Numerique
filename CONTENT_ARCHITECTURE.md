# Architecture des contenus pédagogiques

Document de référence listant, pour chaque niveau, chaque matière, chaque sous-thème : les leçons (J'apprends) et les exercices (Je m'entraîne) avec leur moteur et leurs paramètres.

Objectif : repérer rapidement les manques de contenu (sous-thèmes sans leçon, sans exercice, catégories peu fournies) pour prioriser les ajouts.

> Document généré automatiquement depuis `data/cp.json` à `data/cm2.json` le 2026-07-15 par `scripts/generate-content-architecture.js`. Ne pas éditer à la main : relancer le script après tout ajout de contenu.

---

## Vue d'ensemble

- **965 exercices** et **348 leçons** répartis sur 5 niveaux (CP à CM2).
- Moteurs utilisés :

| Moteur | Nombre d'exercices |
|---|---|
| `choice-engine` | 518 |
| `math-input` | 140 |
| `reading` | 51 |
| `matching` | 49 |
| `conjugation` | 47 |
| `audio-spelling` | 44 |
| `board-interactive` | 42 |
| `conversion` | 26 |
| `timeline` | 22 |
| `word-order` | 13 |
| `clock` | 6 |
| `cloze-fill-in` | 5 |
| `counting` | 2 |

- Types `board-interactive` utilisés :

| Type board-interactive | Nombre d'exercices |
|---|---|
| `tap-features` | 11 |
| `map-locate` | 10 |
| `point-on-grid` | 6 |
| `memory-match` | 3 |
| `symmetry-complete` | 3 |
| `angle-measure` | 3 |
| `fraction-build` | 2 |
| `shape-classify` | 2 |
| `angle-classify` | 1 |
| `construction-report` | 1 |

---

## Synthèse des manques

Sous-thèmes sans leçon et/ou sans exercice (candidats prioritaires pour de futurs ajouts) :

_Aucun sous-thème sans leçon ni sans exercice détecté._

---

## CP

### Mathématiques (cp-maths)

#### Parcours : Addition `(cp-parcours-addition)`

- **Leçons** (2) :
  - Comprendre l'addition `(cp-lesson-addition-comprendre)` — blocs: paragraph, example, bullets, tip, check, check
  - Compléter jusqu'à 10 `(cp-lesson-complement-10)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (6) :
  - Petites additions `(add-1)` — engine: `math-input`, type=add-simple, maxSum=10, questions=5
  - Additions jusqu'à 20 `(add-2)` — engine: `math-input`, type=add-simple, maxSum=20, questions=5
  - Trouver le nombre caché `(add-3)` — engine: `math-input`, type=add-trou, min=1, max=20, questions=5
  - Compléter jusqu'à 10 `(add-4)` — engine: `math-input`, type=complement, target=10, questions=5
  - Compléter jusqu'à 20 `(add-5)` — engine: `math-input`, type=complement, questions=5, target=20
  - Défi : super additions `(cp-bonus-addition-defi)` — engine: `math-input`, type=add-simple, maxSum=50, questions=8, bonus (seuil=2)

#### Parcours : Soustraction `(cp-parcours-soustraction)`

- **Leçons** (2) :
  - Comprendre la soustraction `(cp-lesson-soustraction-comprendre)` — blocs: paragraph, example, bullets, tip, check, check
  - Trouver le complément `(cp-lesson-soustraction-complement)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (4) :
  - Retirer jusqu'à 10 `(sub-1)` — engine: `math-input`, type=sub-simple, min=1, max=10, questions=5
  - Retirer jusqu'à 20 `(sub-2)` — engine: `math-input`, type=sub-simple, min=1, max=20, questions=5
  - Retirer jusqu'à 30 `(sub-3)` — engine: `math-input`, type=sub-simple, min=5, max=30, questions=5
  - Défi : super soustractions `(cp-bonus-soustraction-defi)` — engine: `math-input`, type=sub-simple, min=10, max=30, questions=8, bonus (seuil=2)

#### Nombres & Comparaison `(cp-nombres-comparaison)`

- **Leçons** (3) :
  - Compter et comparer `(cp-lesson-compter-comparer)` — blocs: paragraph, example, bullets, tip, check, check
  - Plus, moins, autant `(cp-lesson-plus-moins-autant)` — blocs: paragraph, example, bullets, tip, check, check
  - Doubles et moitiés `(cp-lesson-doubles-moities)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (7) :
  - Compter `(math-count-1)` — engine: `counting`, min=1, max=20, questions=5
  - Compter plus loin `(math-count-2)` — engine: `counting`, min=20, max=99, questions=5
  - Comparer jusqu'à 10 `(comp-1)` — engine: `choice-engine`, range=10, questions=5
  - Comparer jusqu'à 20 `(comp-2)` — engine: `choice-engine`, range=20, questions=5
  - Comparer jusqu'à 50 `(comp-3)` — engine: `choice-engine`, range=50, questions=5
  - Défi : grands nombres `(cp-bonus-comparaison-defi)` — engine: `choice-engine`, range=99, questions=8, bonus (seuil=2)
  - Doubles et moitiés `(cp-doubles-moities)` — engine: `math-input`, type=double, min=1, max=10, questions=5

#### Cibles & Monnaie `(cp-cibles-monnaie)`

- **Leçons** (2) :
  - Comprendre un problème simple `(cp-lesson-cibles-comprendre)` — blocs: paragraph, example, bullets, tip, check, check
  - Utiliser la monnaie `(cp-lesson-cibles-monnaie)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (6) :
  - Cible : Niv 1 `(cible-1)` — engine: `math-input`, type=cibles, nbFleches=2, questions=5
  - Cible : Niv 2 `(cible-2)` — engine: `math-input`, type=cibles, nbFleches=2, questions=5
  - Cible : Niv 3 `(cible-3)` — engine: `math-input`, type=cibles, nbFleches=3, questions=5
  - Le Marché `(banquier-1)` — engine: `math-input`, type=cibles, skin=money, nbFleches=4, questions=5
  - La Caisse `(banquier-2)` — engine: `math-input`, type=cibles, skin=money, nbFleches=5, questions=5
  - Défi : le grand comptoir `(cp-bonus-caisse-defi)` — engine: `math-input`, type=cibles, skin=money, nbFleches=6, questions=6, bonus (seuil=2)

#### Défis & Logique `(cp-defis-logique)`

- **Leçons** (2) :
  - Résoudre un petit problème `(cp-lesson-defi-chercher)` — blocs: paragraph, example, bullets, tip, check, check
  - Vérifier un calcul `(cp-lesson-defi-verifier)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (5) :
  - L'Oiseau Rapide `(oiseau-1)` — engine: `math-input`, type=oiseau-math, min=1, max=10, vitesse=8, questions=5
  - Carré Magique 1 `(carre-1)` — engine: `math-input`, type=carre-somme, solutionCount=2, targetMin=10, targetMax=10, gridSize=4, showSum=true, questions=5
  - Carré Magique 2 `(carre-2)` — engine: `math-input`, type=carre-somme, solutionCount=2, targetMin=10, targetMax=10, gridSize=4, showSum=false, questions=5
  - Carré Magique 3 `(carre-3)` — engine: `math-input`, type=carre-somme, solutionCount=2, targetMin=15, targetMax=15, gridSize=4, showSum=false, questions=5
  - Défi : Carré Magique Expert `(cp-bonus-carre-magique-defi)` — engine: `math-input`, type=carre-somme, solutionCount=2, targetMin=20, targetMax=20, gridSize=4, showSum=false, questions=6, bonus (seuil=2)

#### Formes et mesures `(cp-formes-mesures-subtheme)`

- **Leçons** (6) :
  - Les formes simples `(cp-lesson-formes-simples)` — blocs: paragraph, example, bullets, tip, check, check
  - Comparer des longueurs `(cp-lesson-comparer-longueurs)` — blocs: paragraph, example, bullets, tip, check, check
  - Les moments de la journée `(cp-lesson-heures-journee)` — blocs: paragraph, example, bullets, tip, check, check
  - Lire l'heure `(cp-lesson-lire-heure)` — blocs: paragraph, example, bullets, tip, check, check
  - Lourd, léger, plein, vide `(cp-lesson-masses-contenances)` — blocs: paragraph, example, bullets, tip, check, check
  - Se repérer sur un quadrillage `(cp-lesson-quadrillage)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (10) :
  - Reconnaître les formes `(cp-geo-formes-reconnaitre)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_cp.json, category=cp-formes-reconnaissance, questions=8
  - Comparer des longueurs `(cp-geo-comparer-longueurs)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_cp.json, category=cp-longueurs-comparaison, questions=8
  - Repères de la journée `(cp-geo-moments-journee)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_cp.json, category=cp-moments-journee, questions=8
  - Lire l'heure `(cp-clock-heures-pleines)` — engine: `clock`, level=1, questions=6
  - Lourd ou léger, plein ou vide `(cp-geo-masses-contenances)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_cp.json, category=cp-masses-contenances, questions=6
  - Formes et opérations `(cp-maths-appariement)` — engine: `matching`, category=matching_math_cp, dataFile=data/math_matching.json, questions=3
  - Jeu de mémoire `(cp-maths-memoire)` — engine: `board-interactive`, type=memory-match, dataFile=data/board_memory_match_cp.json, category=cp_memory_match_maths, questions=4
  - Défi : formes et mesures `(cp-bonus-formes-mesures-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_cp.json, category=cp-formes-reconnaissance, questions=10, bonus (seuil=2)
  - Le quadrillage `(cp-geo-quadrillage)` — engine: `board-interactive`, type=point-on-grid, dataFile=data/board_point_on_grid_cp.json, category=cp_point_on_grid, questions=5
  - Défi : le quadrillage `(cp-bonus-quadrillage-defi)` — engine: `board-interactive`, type=point-on-grid, dataFile=data/board_point_on_grid_cp.json, category=cp_point_on_grid, questions=8, bonus (seuil=2)

#### Écrire les nombres `(cp-ecriture-nombres)`

- **Leçons** (2) :
  - Lire et écrire les nombres `(cp-lesson-lire-ecrire-nombre)` — blocs: paragraph, example, bullets, tip, check, check
  - Dizaines et unités `(cp-lesson-dizaines-unites)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (4) :
  - Petits Nombres `(cp-dictee-0-10)` — engine: `math-input`, type=number-spelling, min=0, max=10, questions=5
  - Nombres de 10 à 20 `(cp-dictee-10-20)` — engine: `math-input`, type=number-spelling, min=10, max=20, questions=5
  - Nombres de 20 à 99 `(cp-dictee-20-69)` — engine: `math-input`, type=number-spelling, min=20, max=99, questions=5
  - Défi : écrire les nombres `(cp-bonus-dictee-nombres-defi)` — engine: `math-input`, type=number-spelling, min=0, max=69, questions=8, bonus (seuil=2)

#### Problèmes `(cp-problemes-subtheme)`

- **Leçons** (2) :
  - Résoudre un problème `(cp-lesson-resoudre-probleme)` — blocs: paragraph, example, bullets, tip, check, check
  - Un problème avec deux calculs `(cp-lesson-probleme-deux-etapes)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (5) :
  - Petits problèmes `(cp-problemes-simples)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle2.json, category=cp-problemes-simples, questions=6
  - Défi : petits problèmes `(cp-bonus-problemes-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle2.json, category=cp-problemes-simples, questions=10, bonus (seuil=2)
  - Problèmes du quotidien `(cp-problemes-quotidien)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle2.json, category=cp-problemes-simples, questions=6
  - Problèmes à deux étapes `(cp-problemes-deux-etapes)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle2.json, category=cp-problemes-deux-etapes, questions=5
  - Défi : problèmes à deux étapes `(cp-bonus-problemes-deux-etapes-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle2.json, category=cp-problemes-deux-etapes, questions=8, bonus (seuil=2)

### Français (cp-francais)

#### Dictée d'Images `(cp-orthographe)`

- **Leçons** (1) :
  - Écrire le mot d'une image `(cp-lesson-ecrire-mot-image)` — blocs: paragraph, example, bullets, tip, check, check
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
  - Écouter pour écrire un mot `(cp-lesson-ecouter-ecrire-mot)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (6) :
  - L'École `(cp-audio-ecole)` — engine: `audio-spelling`, category=school, speechRate=0.78, questions=5
  - La Maison `(cp-audio-maison)` — engine: `audio-spelling`, category=house, speechRate=0.78, questions=5
  - Les Aliments `(cp-audio-aliments)` — engine: `audio-spelling`, category=food, speechRate=0.78, questions=5
  - Les Animaux `(cp-audio-animaux)` — engine: `audio-spelling`, category=animals, speechRate=0.78, questions=5
  - Les Transports `(cp-audio-transports)` — engine: `audio-spelling`, category=transport, speechRate=0.78, questions=5
  - Défi : super dictée audio `(cp-bonus-dictee-audio-defi)` — engine: `audio-spelling`, category=animals, speechRate=0.78, questions=8, bonus (seuil=2)

#### Dictée audio mots outils `(cp-dictee-mots-outils-audio)`

- **Leçons** (1) :
  - Écrire les mots outils `(cp-lesson-dictee-mots-outils)` — blocs: paragraph, example, tip, check, check
- **Exercices** (6) :
  - Période 1 `(cp-audio-mots-outils-p1)` — engine: `audio-spelling`, category=cp_mots_outils_p1, speechRate=0.72, questions=6
  - Période 2 `(cp-audio-mots-outils-p2)` — engine: `audio-spelling`, category=cp_mots_outils_p2, speechRate=0.72, questions=6
  - Période 3 `(cp-audio-mots-outils-p3)` — engine: `audio-spelling`, category=cp_mots_outils_p3, speechRate=0.72, questions=6
  - Période 4 `(cp-audio-mots-outils-p4)` — engine: `audio-spelling`, category=cp_mots_outils_p4, speechRate=0.72, questions=6
  - Période 5 `(cp-audio-mots-outils-p5)` — engine: `audio-spelling`, category=cp_mots_outils_p5, speechRate=0.72, questions=6
  - Défi : tous les mots outils `(cp-bonus-mots-outils-defi)` — engine: `audio-spelling`, category=cp_mots_outils_p5, speechRate=0.72, questions=9, bonus (seuil=2)

#### Mots outils par niveaux `(cp-mots-outils-niveaux-subtheme)`

- **Leçons** (1) :
  - Les mots outils `(cp-lesson-mots-outils-niveaux)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (7) :
  - Niveau 1 : articles `(cp-audio-mots-outils-niv1)` — engine: `audio-spelling`, category=mots_outils_cp_niveau_1, speechRate=0.72, questions=6
  - Niveau 2 : prépositions `(cp-audio-mots-outils-niv2)` — engine: `audio-spelling`, category=mots_outils_cp_niveau_2, speechRate=0.72, questions=6
  - Niveau 3 : connecteurs `(cp-audio-mots-outils-niv3)` — engine: `audio-spelling`, category=mots_outils_cp_niveau_3, speechRate=0.72, questions=6
  - Adverbes 1 `(cp-audio-adverbes-niv1)` — engine: `audio-spelling`, category=adverbes_cp_niveau_1, speechRate=0.72, questions=5
  - Adverbes 2 `(cp-audio-adverbes-niv2)` — engine: `audio-spelling`, category=adverbes_cp_niveau_2, speechRate=0.72, questions=5
  - Défi : tous les mots outils `(cp-bonus-mots-outils-complets)` — engine: `audio-spelling`, category=mots_outils_cp, speechRate=0.72, questions=8, bonus (seuil=3)
  - Défi : adverbes fréquents `(cp-bonus-adverbes-frequents)` — engine: `audio-spelling`, category=adverbes_frequents_cp, speechRate=0.72, questions=8, bonus (seuil=3)

#### Phrase et ponctuation `(cp-phrase-ponctuation-subtheme)`

- **Leçons** (2) :
  - La phrase simple `(cp-lesson-phrase-simple)` — blocs: paragraph, example, bullets, tip, check, check
  - La ponctuation `(cp-lesson-ponctuation)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (3) :
  - La phrase et la ponctuation `(cp-phrase-ponctuation-qcm)` — engine: `choice-engine`, type=factual-qcm, category=cp-phrase-ponctuation, dataFile=data/french_cp_grammar.json, questions=6
  - Remettre les mots en ordre `(cp-ordre-mots-phrase)` — engine: `word-order`, category=word_order_cp, dataFile=data/french_word_order.json, questions=4
  - Défi : phrase ou pas phrase ? `(cp-bonus-phrase-ponctuation)` — engine: `choice-engine`, type=factual-qcm, category=cp-phrase-ponctuation, dataFile=data/french_cp_grammar.json, questions=8, bonus (seuil=2)

#### Lecture syllabique `(cp-lecture)`

- **Leçons** (2) :
  - Lire des syllabes `(cp-lesson-lire-syllabes)` — blocs: paragraph, example, bullets, tip, check, check
  - Lire des phrases courtes `(cp-lesson-lire-phrases-courtes)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (16) :
  - Repérer une syllabe `(cp-lecture-syllabes)` — engine: `reading`, category=cp_reperer_syllabe, questions=5
  - Compter les syllabes `(cp-lecture-mots)` — engine: `reading`, category=cp_compter_syllabes, questions=5
  - Lire le son ou `(cp-lecture-ou)` — engine: `reading`, category=cp_son_ou, questions=5
  - Lire le son on `(cp-lecture-on)` — engine: `reading`, category=cp_son_on, questions=5
  - Lire le son ch `(cp-lecture-ch)` — engine: `reading`, category=cp_son_ch, questions=5
  - Le son an/en `(cp-lecture-an)` — engine: `reading`, category=cp_son_an, questions=5
  - Le son in/ain `(cp-lecture-in)` — engine: `reading`, category=cp_son_in, questions=5
  - Le son eu `(cp-lecture-eu)` — engine: `reading`, category=cp_son_eu, questions=5
  - Le son oi `(cp-lecture-oi)` — engine: `reading`, category=cp_son_oi, questions=5
  - Le son gn `(cp-lecture-gn)` — engine: `reading`, category=cp_son_gn, questions=5
  - Le son oin `(cp-lecture-oin)` — engine: `reading`, category=cp_son_oin, questions=5
  - Le son ien `(cp-lecture-ien)` — engine: `reading`, category=cp_son_ien, questions=5
  - Le son œu `(cp-lecture-oeu)` — engine: `reading`, category=cp_son_oeu, questions=5
  - Le son ph `(cp-lecture-ph)` — engine: `reading`, category=cp_son_ph, questions=5
  - Lettres muettes `(cp-lecture-muettes)` — engine: `reading`, category=cp_lettres_muettes, questions=5
  - Défi : super lecture `(cp-bonus-lecture-defi)` — engine: `reading`, category=cp_lettres_muettes, questions=8, bonus (seuil=2)

#### Masculin ou Féminin `(cp-grammaire-genre)`

- **Leçons** (1) :
  - Un ou une ? `(cp-lesson-un-une)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (4) :
  - Un ou Une ? `(cp-un-une)` — engine: `choice-engine`, type=gender-articles, category=gender_cp, questions=5
  - Le ou La ? `(cp-le-la)` — engine: `choice-engine`, type=gender-articles, category=gender_cp, questions=5
  - Mon ou Ma ? `(cp-mon-ma)` — engine: `choice-engine`, type=gender-articles, category=gender_cp, questions=5
  - Défi genre : un, une, le, la `(cp-bonus-genre-mixte)` — engine: `choice-engine`, type=gender-articles, category=gender_cp, questions=8, bonus (seuil=2)

#### Lecture et compréhension `(cp-lecture-comprehension)`

- **Leçons** (1) :
  - Lire des mots `(cp-lesson-lire-mots)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (3) :
  - Lire des mots simples `(cp-lecture-mots-simples)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/french_cp_grammar.json, category=cp_lire_mots_simples, questions=5
  - Comprendre une phrase `(cp-lecture-comprendre-phrase)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/french_cp_grammar.json, category=cp_comprendre_phrase, questions=5
  - Comprendre une petite histoire `(cp-lecture-comprendre-histoire)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/french_cp_grammar.json, category=cp_comprendre_histoire, questions=5

#### Grammaire : nom, verbe et déterminants `(cp-gram-avance)`

- **Leçons** (1) :
  - La phrase `(cp-lesson-la-phrase)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (3) :
  - Les déterminants `(cp-gram-determinants)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/french_cp_grammar.json, category=cp-determinants, questions=6
  - Nom ou verbe ? `(cp-gram-nom-verbe)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/french_cp_grammar.json, category=cp-nom-verbe, questions=6
  - Ordre des mots `(cp-francais-ordre-mots)` — engine: `word-order`, dataFile=data/french_word_order.json, category=word_order_cp, questions=4

#### Conjugaison `(cp-conjugaison)`

- **Leçons** (1) :
  - Être et avoir `(cp-lesson-etre-avoir)` — blocs: paragraph, example, example, bullets, tip, check, check
- **Exercices** (3) :
  - Être et avoir au présent `(cp-conj-etre-avoir)` — engine: `conjugation`, category=etre_avoir_p, tenses=présent, questions=5
  - Verbes en -er au présent `(cp-conj-verbes-simples)` — engine: `conjugation`, category=present_1, tenses=présent, questions=5
  - Défi : être et avoir `(cp-bonus-conj-etre-avoir)` — engine: `conjugation`, category=etre_avoir_p, tenses=présent, questions=8, bonus (seuil=2)

### Questionner le temps (cp-histoire-subject)

#### Avant et après `(cp-histoire-temps)`

- **Leçons** (2) :
  - Repères du temps `(cp-lesson-temps-qui-passe)` — blocs: paragraph, example, bullets, tip
  - Les jours de la semaine `(cp-lesson-jours-semaine)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Avant et après `(cp-histoire-avant-apres)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cp.json, category=cp-avant-apres, questions=6
  - Repérer le temps `(cp-histoire-ordre-temps)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/history_cp.json, category=cp-avant-apres
  - Jours et saisons `(cp-histoire-jours-saisons)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/history_cp.json, category=cp-jours-saisons
  - Défi : jours et saisons `(cp-bonus-jours-saisons-defi)` — engine: `choice-engine`, type=factual-qcm, questions=10, dataFile=data/history_cp.json, category=cp-jours-saisons, bonus (seuil=2)
  - Les générations `(cp-histoire-generations)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cp.json, category=cp-generations, questions=6
  - Défi : la famille dans le temps `(cp-bonus-generations-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cp.json, category=cp-generations, questions=8, bonus (seuil=2)

#### Vivre autrefois `(cp-histoire-vie)`

- **Leçons** (2) :
  - Vivre autrefois `(cp-lesson-vivre-autrefois)` — blocs: paragraph, example, bullets, tip
  - L'école autrefois `(cp-lesson-ecole-autrefois)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Vivre autrefois `(cp-histoire-vie-autrefois)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cp.json, category=cp-vie-autrefois, questions=6
  - Comparer autrefois `(cp-histoire-comparer-autrefois)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/history_cp.json, category=cp-vie-autrefois
  - Les objets d'autrefois `(cp-histoire-vie-objets-anciens)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cp.json, category=cp-objets-anciens, questions=6
  - Defi : vie autrefois `(cp-bonus-histoire-vie-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cp.json, category=cp-vie-autrefois, questions=8, bonus (seuil=2)
  - Les métiers d'autrefois `(cp-histoire-metiers-autrefois)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cp.json, category=cp-metiers-autrefois, questions=6

#### Traces du passé `(cp-histoire-traces-subtheme)`

- **Leçons** (2) :
  - Les traces du passé `(cp-lesson-traces-passe)` — blocs: paragraph, example, bullets, tip
  - Les objets du passé `(cp-lesson-objets-passe)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Traces du passé `(cp-histoire-traces)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cp.json, category=cp-personnages-traces, questions=6
  - Observer les traces `(cp-histoire-observer-traces)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/history_cp.json, category=cp-personnages-traces
  - Photos et souvenirs `(cp-histoire-photos-souvenirs)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cp.json, category=cp-photos-souvenirs, questions=6
  - Objets anciens `(cp-histoire-objets-anciens)` — engine: `choice-engine`, type=factual-qcm, questions=6, dataFile=data/history_cp.json, category=cp-objets-anciens
  - Partager le matériel `(cp-emc-partager-materiel)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cp.json, category=cp-partager-materiel, questions=6
  - Défi : grand musée du passé `(cp-bonus-traces-passe-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cp.json, category=cp-personnages-traces, questions=10, bonus (seuil=2)

### Questionner l'espace (cp-geographie-subject)

#### Plan et quartier `(cp-plan-quartier-subtheme)`

- **Leçons** (2) :
  - Le plan de l'école `(cp-lesson-plan-ecole)` — blocs: paragraph, example, bullets, tip
  - Le quartier `(cp-lesson-quartier)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Le plan et le quartier `(cp-geo-plan-quartier)` — engine: `choice-engine`, type=factual-qcm, category=cp-plan-quartier, dataFile=data/geography_cp.json, questions=6
  - Défi : plan et quartier `(cp-bonus-plan-quartier-defi)` — engine: `choice-engine`, type=factual-qcm, category=cp-plan-quartier, dataFile=data/geography_cp.json, questions=8, bonus (seuil=2)
  - Se reperer dans l'espace `(cp-geo-se-reperer)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cp.json, category=cp-se-reperer, questions=6
  - Les lieux publics du quartier `(cp-plan-lieux-publics)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cp.json, category=cp-lieux-publics, questions=6

#### Se repérer `(cp-geo-reperage-subtheme)`

- **Leçons** (2) :
  - Se repérer à l'école `(cp-lesson-se-reperer-ecole)` — blocs: paragraph, example, bullets, tip
  - Ma gauche, ma droite `(cp-lesson-gauche-droite)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Se repérer `(cp-geo-reperer)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cp.json, category=cp-se-reperer, questions=6
  - Se repérer à l'école `(cp-geo-ecole-trajets)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/geography_cp.json, category=cp-se-reperer
  - Les lieux de l'école `(cp-geo-lieux-ecole)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/geography_cp.json, category=cp-lieux-ecole
  - Défi : se repérer `(cp-bonus-reperage-defi)` — engine: `choice-engine`, type=factual-qcm, questions=10, dataFile=data/geography_cp.json, category=cp-lieux-ecole, bonus (seuil=2)

#### Paysages `(cp-geo-paysages-subtheme)`

- **Leçons** (1) :
  - Reconnaître des paysages `(cp-lesson-paysages-reperes)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Paysages `(cp-geo-paysages)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cp.json, category=cp-paysages, questions=6
  - Reconnaître les paysages `(cp-geo-reconnaitre-paysages)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/geography_cp.json, category=cp-paysages
  - Transports et lieux `(cp-geo-transports-lieux)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cp.json, category=cp-transports-lieux, questions=6
  - Defi : paysages et deplacements `(cp-bonus-geo-paysages-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cp.json, category=cp-paysages, questions=8, bonus (seuil=2)

#### Transports et lieux `(cp-geo-transports-subtheme)`

- **Leçons** (1) :
  - Se déplacer selon les lieux `(cp-lesson-transports-lieux)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Transports et lieux `(cp-geo-transports)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cp.json, category=cp-transports-lieux, questions=6
  - Se déplacer selon les lieux `(cp-geo-deplacements-lieux)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/geography_cp.json, category=cp-transports-lieux
  - Trajets du quotidien `(cp-geo-trajets-quotidiens)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cp.json, category=cp-trajets-quotidiens, questions=6
  - Lieux publics `(cp-geo-lieux-publics)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cp.json, category=cp-lieux-publics, questions=6
  - Défi : grand voyageur `(cp-bonus-transports-lieux-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cp.json, category=cp-transports-lieux, questions=10, bonus (seuil=2)

### Questionner le vivant et la matière (cp-sciences-subject)

#### Le vivant `(cp-sciences-vivant-subtheme)`

- **Leçons** (3) :
  - Les besoins du vivant `(cp-lesson-vivant-besoins)` — blocs: paragraph, example, bullets, tip, check, check
  - Plantes et animaux `(cp-lesson-plantes-animaux)` — blocs: paragraph, example, bullets, tip, check, check
  - Vivant ou non-vivant `(cp-lesson-vivant-non-vivant)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (3) :
  - Le vivant `(cp-sciences-vivant)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-vivant, questions=6
  - Animaux et plantes `(cp-sciences-animaux-plantes)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-animaux-plantes-quotidien, questions=6
  - Défi : le vivant `(cp-bonus-sciences-vivant-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-vivant, questions=9, bonus (seuil=2)

#### Matière et lumière `(cp-sciences-matiere-subtheme)`

- **Leçons** (1) :
  - La matière et ses états `(cp-lesson-matiere-etat)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (3) :
  - Matière et lumière `(cp-sciences-matiere)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-matiere, questions=6
  - Objets et usages `(cp-sciences-objets-usages)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-objets-usages, questions=6
  - Défi : matière et lumière `(cp-bonus-sciences-matiere-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-matiere, questions=9, bonus (seuil=2)

#### Corps et sens `(cp-sciences-corps-subtheme)`

- **Leçons** (2) :
  - Les cinq sens `(cp-lesson-corps-sens)` — blocs: paragraph, example, bullets, tip, check, check
  - Les organes des sens `(cp-lesson-organes-sens)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (5) :
  - Corps et sens `(cp-sciences-corps)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-corps-sens, questions=6
  - Les cinq sens `(cp-sciences-cinq-sens)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/science_cp.json, category=cp-corps-sens
  - Les besoins du corps `(cp-sciences-besoins-corps)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/science_cp.json, category=cp-besoins-corps
  - Hygiène quotidienne `(cp-sciences-hygiene-quotidienne)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-hygiene-quotidienne, questions=6
  - Défi : grand expert du corps `(cp-bonus-corps-sens-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-corps-sens, questions=10, bonus (seuil=2)

#### Saisons et météo `(cp-sciences-saisons-subtheme)`

- **Leçons** (2) :
  - Les quatre saisons `(cp-lesson-quatre-saisons)` — blocs: paragraph, example, bullets, tip, check, check
  - La météo du jour `(cp-lesson-meteo-du-jour)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (3) :
  - Les quatre saisons `(cp-sciences-saisons)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-saisons-meteo, questions=6
  - Le temps qu'il fait `(cp-sciences-meteo)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-saisons-meteo, questions=6
  - S'habiller selon la saison `(cp-sciences-habits-saison)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-saisons-meteo, questions=6

#### Où vivent les animaux ? `(cp-sciences-milieux-subtheme)`

- **Leçons** (2) :
  - Près de chez nous `(cp-lesson-milieux-proches)` — blocs: paragraph, example, bullets, tip, check, check
  - La forêt, la mare et la mer `(cp-lesson-foret-mare-mer)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (4) :
  - Où vivent les animaux ? `(cp-sciences-milieux-vie)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-milieux-vie, questions=6
  - La maison et le jardin `(cp-sciences-maison-jardin)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-milieux-vie, questions=6
  - Révision : les cinq sens `(cp-sciences-corps-sens)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-corps-sens, questions=6
  - Défi : milieux et sens `(cp-bonus-sciences-milieux-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-milieux-vie, questions=8, bonus (seuil=2)

#### Objets du quotidien `(cp-sciences-objets-subtheme)`

- **Leçons** (2) :
  - À quoi servent les objets ? `(cp-lesson-fonction-objets)` — blocs: paragraph, example, bullets, tip, check, check
  - En quoi sont faits les objets ? `(cp-lesson-materiaux-simples)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (5) :
  - À quoi ça sert ? `(cp-sciences-objets-fonction)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-objets-quotidien, questions=6
  - En quoi c'est fait ? `(cp-sciences-objets-materiaux)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-objets-quotidien, questions=6
  - L'utilité des objets `(cp-sciences-objets-usages-quotidien)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-objets-usages, questions=6
  - L'hygiène au quotidien `(cp-sciences-hygiene)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-hygiene-quotidienne, questions=6
  - Défi : objets et matériaux `(cp-bonus-sciences-objets-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cp.json, category=cp-objets-quotidien, questions=8, bonus (seuil=2)

### EMC (cp-emc-subject)

#### Vivre ensemble `(cp-emc-vivre-ensemble-subtheme)`

- **Leçons** (4) :
  - Vivre ensemble à l'école `(cp-lesson-vivre-ensemble)` — blocs: paragraph, example, bullets, tip
  - Les règles de la classe `(cp-lesson-regles-classe)` — blocs: paragraph, example, bullets, tip
  - Les droits et les devoirs `(cp-lesson-droits-devoirs)` — blocs: paragraph, example, bullets, tip
  - Respecter le matériel `(cp-lesson-respect-materiel)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Vivre ensemble `(cp-emc-vivre-ensemble)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cp.json, category=cp-vivre-ensemble, questions=6
  - Respecter les autres `(cp-emc-respecter-autres)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/emc_cp.json, category=cp-vivre-ensemble
  - Politesse en classe `(cp-emc-politesse-classe)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/emc_cp.json, category=cp-politesse-classe
  - Politesse et émotions `(cp-emc-appariement)` — engine: `matching`, category=matching_emc_cp, dataFile=data/emc_matching.json, questions=3

#### Sécurité `(cp-emc-securite-subtheme)`

- **Leçons** (1) :
  - Être prudent au quotidien `(cp-lesson-securite-quotidienne)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Sécurité `(cp-emc-securite)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cp.json, category=cp-securite, questions=6
  - Être prudent `(cp-emc-etre-prudent)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/emc_cp.json, category=cp-securite
  - Politesse en classe `(cp-emc-sec-politesse)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cp.json, category=cp-politesse-classe, questions=6

#### Entraide `(cp-emc-entraide-subtheme)`

- **Leçons** (1) :
  - Entraide et respect `(cp-lesson-entraide-respect)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Entraide `(cp-emc-entraide)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cp.json, category=cp-entraide, questions=6
  - Aider un camarade `(cp-emc-aider-camarade)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/emc_cp.json, category=cp-entraide
  - Partager à l'école `(cp-emc-partager-classe)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cp.json, category=cp-partager-materiel, questions=5

#### Les émotions `(cp-emc-emotions-subtheme)`

- **Leçons** (2) :
  - Les émotions `(cp-lesson-emotions)` — blocs: paragraph, example, bullets, tip
  - Exprimer ses émotions `(cp-lesson-exprimer-emotions)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Mes émotions `(cp-emc-emotions)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cp.json, category=cp-emotions, questions=6
  - Exprimer ses émotions `(cp-emc-exprimer-emotions)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cp.json, category=cp-emotions, questions=8
  - Reconnaître les émotions `(cp-emc-reconnaitre-emotions)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cp.json, category=cp-emotions, questions=6
  - Défi : émotions et réactions `(cp-bonus-emc-emotions-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cp.json, category=cp-emotions, questions=8, bonus (seuil=2)

#### Décider ensemble `(cp-emc-vote-subtheme)`

- **Leçons** (1) :
  - Décider ensemble `(cp-lesson-vote)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Le vote en classe `(cp-emc-vote)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cp.json, category=cp-vote, questions=5
  - Voter ensemble `(cp-emc-vote-vivre-ensemble)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cp.json, category=cp-vivre-ensemble, questions=5
  - Défi : vote et règles `(cp-bonus-emc-vote-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cp.json, category=cp-vote, questions=6, bonus (seuil=2)

#### Respecter l'environnement `(cp-emc-environnement-subtheme)`

- **Leçons** (1) :
  - Respecter l'environnement `(cp-lesson-environnement)` — blocs: paragraph, bullets, example, tip
- **Exercices** (3) :
  - Prendre soin de l'environnement `(cp-emc-environnement)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cp.json, category=cp-environnement, questions=5
  - Partager le matériel `(cp-emc-env-partager)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cp.json, category=cp-partager-materiel, questions=5
  - Défi : bons gestes `(cp-bonus-emc-environnement-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cp.json, category=cp-environnement, questions=6, bonus (seuil=2)

---

## CE1

### Mathématiques (ce1-maths)

#### Multiplication `(ce1-multiplication)`

- **Leçons** (2) :
  - Comprendre la multiplication `(ce1-lesson-multiplication-bases)` — blocs: paragraph, example, bullets, tip, check, check
  - Apprendre ses tables malin `(ce1-lesson-tables-astuces)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (8) :
  - Table de 2 `(mult-2)` — engine: `math-input`, type=mult, table=2, questions=10
  - Table de 3 `(mult-3)` — engine: `math-input`, type=mult, table=3, questions=10
  - Table de 4 `(mult-4)` — engine: `math-input`, type=mult, table=4, questions=10
  - Table de 5 `(mult-5)` — engine: `math-input`, type=mult, table=5, questions=10
  - Table de 10 `(mult-10)` — engine: `math-input`, type=mult, table=10, questions=10
  - Table de 6 `(mult-6)` — engine: `math-input`, type=mult, table=6, questions=10, bonus (seuil=2)
  - Table de 7 `(mult-7)` — engine: `math-input`, type=mult, table=7, questions=10, bonus (seuil=2)
  - Défi : tables mélangées `(ce1-bonus-mult-melange)` — engine: `math-input`, type=mult, table=mix, questions=15, bonus (seuil=2)

#### Nombres & Calculs `(ce1-nombres-calculs)`

- **Leçons** (4) :
  - Compléter jusqu'à 20 `(ce1-lesson-complements-20)` — blocs: paragraph, example, bullets, tip, check, check
  - Doubles et moitiés `(ce1-lesson-doubles-moities)` — blocs: paragraph, example, bullets, tip, check, check
  - Additionner jusqu'à 100 `(ce1-lesson-additionner-100)` — blocs: paragraph, example, bullets, tip, check, check
  - Soustraire sans se tromper `(ce1-lesson-soustraire)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (19) :
  - Compléments à 100 `(add-100)` — engine: `math-input`, type=add-trou, min=10, max=100, questions=10
  - Calcul rapide `(add-chrono)` — engine: `math-input`, type=oiseau-math, min=10, max=30, vitesse=5, questions=10
  - Comparer jusqu'à 100 `(comp-ce1-1)` — engine: `choice-engine`, range=100, questions=10
  - Le Marché `(bank-ce1-1)` — engine: `math-input`, type=cibles, skin=money, nbFleches=5, questions=5
  - Carré Expert `(carre-ce1-1)` — engine: `math-input`, type=carre-somme, targetMin=50, targetMax=50, gridSize=9, showSum=false, questions=5
  - Additions jusqu'à 20 `(ce1-additions-20)` — engine: `math-input`, type=add-simple, min=2, maxSum=20, questions=10
  - Soustractions jusqu'à 20 `(ce1-soustractions-20)` — engine: `math-input`, type=sub-simple, min=5, max=20, questions=10
  - Additions jusqu'à 50 `(ce1-additions-50)` — engine: `math-input`, type=add-simple, min=5, maxSum=50, questions=10
  - Comparer jusqu'à 200 `(ce1-comp-200)` — engine: `choice-engine`, range=200, questions=10
  - Nombres et opérations `(ce1-maths-appariement)` — engine: `matching`, category=matching_math_ce1, dataFile=data/math_matching.json, questions=3
  - Jeu de mémoire `(ce1-maths-memoire)` — engine: `board-interactive`, type=memory-match, dataFile=data/board_memory_match_ce1.json, category=ce1_memory_match_maths, questions=4
  - Défi : additions jusqu'à 150 `(ce1-bonus-additions-100)` — engine: `math-input`, type=add-simple, min=10, maxSum=150, questions=12, bonus (seuil=2)
  - Les doubles `(ce1-doubles)` — engine: `math-input`, type=double, min=3, max=30, questions=6
  - Les moitiés `(ce1-moities)` — engine: `math-input`, type=half, min=3, max=25, questions=6
  - Compléments à 20 `(ce1-complements-20)` — engine: `math-input`, type=complement, target=20, questions=6
  - Additions jusqu'à 100 `(ce1-additions-100)` — engine: `math-input`, type=add-simple, min=20, maxSum=100, questions=6
  - Soustractions jusqu'à 60 `(ce1-soustractions-60)` — engine: `math-input`, type=sub-simple, min=20, max=60, questions=6
  - Le nombre caché `(ce1-nombre-cache-50)` — engine: `math-input`, type=add-trou, min=20, max=50, questions=6
  - Défi : compléments à 100 `(ce1-bonus-complements-100)` — engine: `math-input`, type=complement, target=100, questions=8, bonus (seuil=2)

#### Géométrie et mesures `(ce1-geometrie-mesures-subtheme)`

- **Leçons** (5) :
  - Reconnaître des formes `(ce1-lesson-formes-planes)` — blocs: paragraph, example, bullets, paragraph, tip, check, check
  - Mesurer et comparer `(ce1-lesson-mesurer-comparer)` — blocs: paragraph, example, bullets, tip, check, check
  - Se repérer dans la journée `(ce1-lesson-se-reperer-journee)` — blocs: paragraph, example, bullets, tip, check, check
  - Lire l'heure `(ce1-lesson-lire-heure)` — blocs: paragraph, example, bullets, tip, check, check
  - Masses et contenances `(ce1-lesson-masses-contenances)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (7) :
  - Formes planes et solides `(ce1-geo-formes-solides-planes)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_ce1.json, category=ce1-formes-solides-planes, questions=8
  - Mesurer des longueurs `(ce1-geo-longueurs-mesures)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_ce1.json, category=ce1-longueurs-mesures, questions=8
  - Repères de la journée `(ce1-geo-reperes-journee)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_ce1.json, category=ce1-reperes-journee, questions=8
  - Lire l'heure `(ce1-clock-heures-quarts)` — engine: `clock`, level=2, questions=6
  - Masses et contenances `(ce1-geo-masses-contenances)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_ce1.json, category=ce1-masses-contenances, questions=8
  - Nombres et notions clés `(ce1-maths-geo-appariement)` — engine: `matching`, category=matching_math_ce1, dataFile=data/math_matching.json, questions=3
  - Défi : lire l'heure `(ce1-bonus-geo-lire-heure)` — engine: `clock`, level=2, questions=10, bonus (seuil=2)

#### Problèmes `(ce1-problemes-subtheme)`

- **Leçons** (2) :
  - Bien lire un problème `(ce1-lesson-bien-lire-probleme)` — blocs: paragraph, example, bullets, tip, check, check
  - Résoudre un petit problème `(ce1-lesson-resoudre-probleme)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (5) :
  - Problèmes additifs `(ce1-problemes-additifs)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle2.json, category=ce1-problemes-additifs, questions=8
  - Problèmes à étapes `(ce1-problemes-mixtes)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle2.json, category=ce1-problemes-mixtes, questions=8
  - Défi : problèmes en rafale `(ce1-bonus-problemes-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle2.json, category=ce1-problemes-mixtes, questions=10, bonus (seuil=2)
  - L'oiseau matheux `(ce1-oiseau-calcul)` — engine: `math-input`, type=oiseau-math, min=5, max=20, vitesse=8, questions=6
  - Le jeu de cibles `(ce1-cibles-adresse)` — engine: `math-input`, type=cibles, nbFleches=3, questions=5

### Français (ce1-francais)

#### Orthographe `(ce1-orthographe)`

- **Leçons** (3) :
  - Réussir une dictée de mots `(ce1-lesson-dictee-mots)` — blocs: paragraph, example, bullets, tip, check, check
  - La règle du m devant m, b, p `(ce1-lesson-m-devant-mbp)` — blocs: paragraph, example, bullets, tip, check, check
  - Les lettres muettes `(ce1-lesson-lettres-finales)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (13) :
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
  - On ou Ont? `(ce1-homo-onont)` — engine: `choice-engine`, type=homophone-duel, category=on_ont, questions=10
  - Ou ou Où? `(ce1-homo-ouou)` — engine: `choice-engine`, type=homophone-duel, category=ou_où, questions=10
  - Défi : dictée des vêtements `(ce1-bonus-dictee-vetements)` — engine: `math-input`, type=spelling, category=vêtements, questions=12, bonus (seuil=2)

#### Dictée audio `(ce1-dictee-audio)`

- **Leçons** (1) :
  - Écouter et écrire `(ce1-lesson-ecouter-ecrire)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (6) :
  - L'École `(ce1-audio-ecole)` — engine: `audio-spelling`, category=school, speechRate=0.74, questions=6
  - La Maison `(ce1-audio-maison)` — engine: `audio-spelling`, category=house, speechRate=0.74, questions=6
  - Le Corps `(ce1-audio-corps)` — engine: `audio-spelling`, category=corps, speechRate=0.74, questions=6
  - Les Animaux `(ce1-audio-animaux)` — engine: `audio-spelling`, category=animals, speechRate=0.74, questions=6
  - Les aliments `(ce1-audio-aliments)` — engine: `audio-spelling`, category=food, speechRate=0.74, questions=6
  - Défi : super dictée des animaux `(ce1-bonus-audio-animaux-expert)` — engine: `audio-spelling`, category=animals, speechRate=0.74, questions=10, bonus (seuil=2)

#### Dictée mots fréquents `(ce1-dictee-mots-frequents)`

- **Leçons** (1) :
  - Mémoriser les mots fréquents `(ce1-lesson-mots-frequents)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (6) :
  - Période 1 `(ce1-audio-mots-frequents-p1)` — engine: `audio-spelling`, category=ce1_mots_frequents_p1, speechRate=0.73, questions=8
  - Période 2 `(ce1-audio-mots-frequents-p2)` — engine: `audio-spelling`, category=ce1_mots_frequents_p2, speechRate=0.73, questions=8
  - Période 3 `(ce1-audio-mots-frequents-p3)` — engine: `audio-spelling`, category=ce1_mots_frequents_p3, speechRate=0.73, questions=8
  - Période 4 `(ce1-audio-mots-frequents-p4)` — engine: `audio-spelling`, category=ce1_mots_frequents_p4, speechRate=0.73, questions=8
  - Période 5 `(ce1-audio-mots-frequents-p5)` — engine: `audio-spelling`, category=ce1_mots_frequents_p5, speechRate=0.73, questions=8
  - Défi : révision des mots fréquents `(ce1-bonus-mots-frequents-revision)` — engine: `audio-spelling`, category=ce1_mots_frequents_p5, speechRate=0.73, questions=12, bonus (seuil=2)

#### Lecture `(ce1-lecture-subtheme)`

- **Leçons** (2) :
  - Lire des phrases courtes `(ce1-lesson-lire-phrases-courtes)` — blocs: paragraph, example, bullets, tip, check, check
  - Comprendre une phrase `(ce1-lesson-comprendre-phrase)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (9) :
  - Lire des phrases courtes `(ce1-lecture-phrases)` — engine: `reading`, category=ce1_lire_phrases_courtes, questions=5
  - Comprendre une phrase `(ce1-lecture-comprendre)` — engine: `reading`, category=ce1_comprendre_phrase_courte, questions=5
  - Comprendre un texte court `(ce1-lecture-comprehension-courte)` — engine: `reading`, category=ce1_comprehension_courte, questions=6
  - Deviner la suite `(ce1-lecture-inference-simple)` — engine: `reading`, category=ce1_lecture_inference_simple, questions=5
  - Quel sens a ce mot ? `(ce1-lecture-mot-contexte)` — engine: `reading`, category=ce1_lecture_mot_contexte, questions=5
  - Dans quel ordre ? `(ce1-lecture-ordre-evenements)` — engine: `reading`, category=ce1_lecture_ordre_evenements, questions=5
  - Une histoire à l'école `(ce1-lecture-texte-ecole)` — engine: `reading`, category=ce1_comprehension_texte_ecole, questions=5
  - Une histoire dans la nature `(ce1-lecture-texte-nature)` — engine: `reading`, category=ce1_comprehension_texte_nature, questions=5
  - Copie le mot manquant `(ce1-lecture-copie-guidee)` — engine: `cloze-fill-in`, category=copie_guidee_ce1, questions=6

#### Vocabulaire `(ce1-vocabulaire-subtheme)`

- **Leçons** (4) :
  - Les familles de mots `(ce1-lesson-vocabulaire-ranger-mots)` — blocs: paragraph, example, bullets, tip, check, check
  - Ranger les mots par thème `(ce1-lesson-vocabulaire-theme)` — blocs: paragraph, example, bullets, tip, check, check
  - Les contraires `(ce1-lesson-vocabulaire-contraires)` — blocs: paragraph, example, bullets, tip, check, check
  - L'ordre alphabétique `(ce1-lesson-ordre-alphabetique)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (7) :
  - Mots de sens proche `(ce1-vocab-synonymes)` — engine: `reading`, category=ce1_vocabulaire_synonymes, questions=5
  - Ranger les mots `(ce1-vocab-familles)` — engine: `reading`, category=ce1_vocabulaire_champs, questions=5
  - Mots contraires `(ce1-vocab-antonymes)` — engine: `reading`, category=ce1_vocabulaire_antonymes, questions=6
  - Associe les mots `(ce1-vocab-appariement)` — engine: `matching`, category=matching_synonymes_ce1, dataFile=data/french/matching.json, questions=2
  - Ordre alphabétique `(ce1-vocab-ordre-alpha)` — engine: `word-order`, category=alpha_order_ce1, dataFile=data/french_word_order.json, questions=5
  - Le dictionnaire `(ce1-vocab-dictionnaire)` — engine: `matching`, category=matching_alphabet_ce1, dataFile=data/french/matching.json, questions=3
  - Défi : super contraires `(ce1-bonus-vocab-antonymes-expert)` — engine: `reading`, category=ce1_vocabulaire_antonymes, questions=10, bonus (seuil=2)

#### Grammaire `(ce1-grammaire-subject)`

- **Leçons** (4) :
  - Les déterminants `(ce1-lesson-determinants)` — blocs: paragraph, example, bullets, tip, check, check
  - Le nom et le verbe `(ce1-lesson-nom-verbe)` — blocs: paragraph, example, bullets, tip, check, check
  - Une phrase bien construite `(ce1-lesson-phrase)` — blocs: paragraph, example, bullets, tip, check, check
  - L'accord déterminant-nom `(ce1-lesson-accord-det-nom)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (12) :
  - Un ou Une? `(ce1-gram-un-une)` — engine: `choice-engine`, type=gender-articles, category=gender_ce1_classe, questions=8
  - Le, La ou L'? `(ce1-gram-le-la)` — engine: `choice-engine`, type=gender-articles, category=gender_ce1_maison, questions=8
  - Les noms de la nature `(ce1-gram-nature)` — engine: `choice-engine`, type=gender-articles, category=gender_ce1_nature, questions=8
  - Le bon déterminant `(ce1-gram-cloze-det)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_cloze_ce1, questions=8
  - Écris le bon mot `(ce1-gram-cloze-ecrit)` — engine: `cloze-fill-in`, category=grammar_cloze_ce1, questions=6
  - Singulier ou pluriel `(ce1-gram-pluriel)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_plural_ce1, questions=8
  - Accord dans le groupe nominal `(ce1-gram-det-phrase)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_agreement_ce1, questions=10
  - Le déterminant et le nom `(ce1-gram-accord-det-nom)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_det_nom_ce1, questions=8
  - Ordre des mots `(ce1-francais-ordre-mots)` — engine: `word-order`, category=word_order_ce1, dataFile=data/french_word_order.json, questions=5
  - Raconte une histoire `(ce1-francais-raconte-histoire)` — engine: `word-order`, category=story_order_ce1, dataFile=data/french_word_order.json, questions=4
  - Types de phrases `(ce1-gram-types-phrases)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_phrase_types_ce1, questions=8
  - Défi : phrases à compléter `(ce1-bonus-grammaire-cloze-expert)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_cloze_ce1, questions=12, bonus (seuil=2)

#### Conjugaison `(ce1-conjugaison-subject)`

- **Leçons** (2) :
  - Être et avoir au présent `(ce1-lesson-etre-avoir)` — blocs: paragraph, example, bullets, tip, check, check
  - Les verbes en -er au présent `(ce1-lesson-verbes-er-present)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (8) :
  - Les Indispensables `(ce1-conj-base)` — engine: `conjugation`, category=etre_avoir_p, tenses=présent, questions=5
  - Verbes en -ER (1) `(ce1-conj-er-facile)` — engine: `conjugation`, category=present_1, tenses=présent, questions=5
  - Le verbe ALLER `(ce1-conj-aller)` — engine: `conjugation`, category=present_3_freq, verbs=aller, tenses=présent, questions=5
  - Verbes en -ER (2) `(ce1-conj-er-action)` — engine: `conjugation`, category=present_1, tenses=présent, questions=5
  - Le Cas du 'Nous' `(ce1-conj-er-regles)` — engine: `conjugation`, category=present_1, tenses=présent, questions=6
  - Défi Verbe-o-tron `(ce1-conj-expert)` — engine: `conjugation`, category=present_1, questions=10
  - Être et avoir (2) `(ce1-conj-etre-avoir-plus)` — engine: `conjugation`, category=etre_avoir_p, tenses=présent, questions=8
  - Défi : Verbe-o-tron expert `(ce1-bonus-conj-verbe-o-tron-expert)` — engine: `conjugation`, category=present_1, questions=15, bonus (seuil=2)

### Questionner le temps (ce1-histoire-subject)

#### Le temps `(ce1-histoire-temps-subtheme)`

- **Leçons** (2) :
  - Hier, aujourd'hui, demain `(ce1-lesson-hier-aujourdhui-demain)` — blocs: paragraph, example, bullets, tip
  - La frise du temps `(ce1-lesson-frise-temps)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Le temps `(ce1-histoire-temps)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce1.json, category=ce1-temps, questions=6
  - Avant, après, longtemps `(ce1-histoire-avant-apres-longtemps)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/history_ce1.json, category=ce1-temps
  - Calendrier et repères `(ce1-histoire-calendrier-reperes)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/history_ce1.json, category=ce1-calendrier-reperes

#### Vivre autrefois `(ce1-histoire-vie-autrefois-subtheme)`

- **Leçons** (2) :
  - L'école d'autrefois `(ce1-lesson-ecole-autrefois)` — blocs: paragraph, example, bullets, tip
  - La vie quotidienne d'autrefois `(ce1-lesson-vie-quotidienne-autrefois)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Vivre autrefois `(ce1-histoire-vie-autrefois)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce1.json, category=ce1-vie-autrefois, questions=6
  - Défi : vivre autrefois `(ce1-bonus-histoire-vie-autrefois-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce1.json, category=ce1-vie-autrefois, questions=9, bonus (seuil=2)
  - L'école d'autrefois `(ce1-histoire-ecole-autrefois)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce1.json, category=ce1-ecole-autrefois, questions=6

#### Monuments et personnages `(ce1-histoire-monuments-subtheme)`

- **Leçons** (2) :
  - Les monuments et les personnages `(ce1-lesson-monuments-personnages)` — blocs: paragraph, example, bullets, tip
  - Les traces du passé `(ce1-lesson-traces-passe)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Monuments et personnages `(ce1-histoire-monuments)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce1.json, category=ce1-monuments-personnages, questions=6
  - Monuments du passé `(ce1-histoire-monuments-passe)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/history_ce1.json, category=ce1-monuments-personnages
  - L'école autrefois `(ce1-histoire-monuments-ecole)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce1.json, category=ce1-ecole-autrefois, questions=6
  - Objets d'autrefois `(ce1-histoire-monuments-objets)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce1.json, category=ce1-objets-passe, questions=6
  - Défi : monuments et personnages `(ce1-bonus-histoire-monuments-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce1.json, category=ce1-monuments-personnages, questions=8, bonus (seuil=2)

#### Objets du passé `(ce1-histoire-objets-subtheme)`

- **Leçons** (2) :
  - Les objets du passé `(ce1-lesson-objets-passe)` — blocs: paragraph, example, bullets, tip
  - Du lavoir au lave-linge `(ce1-lesson-inventions-quotidien)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Objets du passé `(ce1-histoire-objets-passe)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce1.json, category=ce1-objets-passe, questions=6
  - Comparer les objets `(ce1-histoire-comparer-objets)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/history_ce1.json, category=ce1-objets-passe
  - Souvenirs de famille `(ce1-histoire-souvenirs-famille)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce1.json, category=ce1-souvenirs-famille, questions=6
  - Mémoire de famille `(ce1-histoire-memoire-famille)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce1.json, category=ce1-memoire-famille, questions=6
  - Objets et usages d'autrefois `(ce1-histoire-appariement)` — engine: `matching`, category=matching_histoire_ce1, dataFile=data/history_matching.json, questions=2
  - Défi : objets du passé en détail `(ce1-bonus-histoire-objets-passe-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce1.json, category=ce1-objets-passe, questions=10, bonus (seuil=2)

### Questionner l'espace (ce1-geographie-subject)

#### Se repérer `(ce1-geo-reperage-subtheme)`

- **Leçons** (2) :
  - Se repérer à l'école `(ce1-lesson-se-reperer-ecole)` — blocs: paragraph, example, bullets, tip
  - La commune `(ce1-lesson-commune)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Se repérer `(ce1-geo-reperage)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce1.json, category=ce1-reperage, questions=6
  - Plan du quartier `(ce1-geo-plan-quartier)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce1.json, category=ce1-plan-quartier, questions=6
  - Lire la légende `(ce1-geo-legende)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce1.json, category=ce1-legende-simple, questions=6
  - Lieux publics `(ce1-geo-lieux-publics)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce1.json, category=ce1-lieux-publics, questions=6
  - Services du quartier `(ce1-geo-services-quartier)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce1.json, category=ce1-services-quartier, questions=6
  - Défi : super repérage `(ce1-bonus-geo-reperage-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce1.json, category=ce1-reperage, questions=10, bonus (seuil=2)

#### Paysages `(ce1-geo-paysages-subtheme)`

- **Leçons** (3) :
  - Observer un paysage `(ce1-lesson-paysages-du-quotidien)` — blocs: paragraph, example, bullets, tip
  - Mer, montagne, campagne, ville `(ce1-lesson-paysages-france)` — blocs: paragraph, example, bullets, tip
  - Vivre au village ou en ville `(ce1-lesson-village-ville)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Paysages `(ce1-geo-paysages)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce1.json, category=ce1-paysages, questions=6
  - Reconnaître les paysages `(ce1-geo-reconnaitre-paysages)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/geography_ce1.json, category=ce1-paysages
  - Lieux et paysages `(ce1-geo-appariement)` — engine: `matching`, category=matching_geo_ce1, dataFile=data/geography_matching.json, questions=2
  - Mer, montagne, campagne `(ce1-geo-mer-montagne)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce1.json, category=ce1-mer-montagne, questions=6
  - Village ou ville ? `(ce1-geo-village-ville)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce1.json, category=ce1-village-ville, questions=6
  - Défi : paysages de France `(ce1-bonus-paysages-france)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce1.json, category=ce1-mer-montagne, questions=8, bonus (seuil=2)

#### France et transports `(ce1-geo-transports-subtheme)`

- **Leçons** (2) :
  - Se déplacer en France `(ce1-lesson-transports-france)` — blocs: paragraph, example, bullets, tip
  - À chaque trajet son transport `(ce1-lesson-choisir-transport)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - France et transports `(ce1-geo-transports)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce1.json, category=ce1-transports-france, questions=6
  - Se déplacer en France `(ce1-geo-se-deplacer-france)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/geography_ce1.json, category=ce1-transports-france
  - Trajets du quotidien `(ce1-geo-trajets-quotidiens)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/geography_ce1.json, category=ce1-trajets-quotidiens

### Questionner le vivant et la matière (ce1-sciences-subject)

#### Le vivant `(ce1-sciences-vivant-subtheme)`

- **Leçons** (3) :
  - Le vivant a des besoins `(ce1-lesson-vivant-besoins)` — blocs: paragraph, example, bullets, tip, check, check
  - Vivant ou non vivant ? `(ce1-lesson-vivant-non-vivant)` — blocs: paragraph, example, bullets, tip, check, check
  - Le cycle de vie `(ce1-lesson-cycle-vie)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (6) :
  - Le vivant `(ce1-sciences-vivant)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-vivant, questions=6
  - Besoins du vivant `(ce1-sciences-besoins-vivant)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-besoins-vivant, questions=6
  - Cycle de vie simple `(ce1-sciences-cycle-vie)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-cycle-vie-simple, questions=6
  - Les parties de la plante `(ce1-sciences-tap-plante)` — engine: `board-interactive`, type=tap-features, dataFile=data/board_tap_features_science.json, category=ce1_tap_plante, questions=4
  - Êtres vivants et besoins `(ce1-sciences-appariement)` — engine: `matching`, category=matching_sciences_ce1, dataFile=data/science_matching.json, questions=2
  - Défi : le vivant en détail `(ce1-bonus-sciences-vivant-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-vivant, questions=10, bonus (seuil=2)

#### Matière `(ce1-sciences-matiere-subtheme)`

- **Leçons** (2) :
  - Les états de la matière `(ce1-lesson-matiere-eau-lumiere)` — blocs: paragraph, example, bullets, tip, check, check
  - Mélanger et séparer `(ce1-lesson-melanger-separer)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (4) :
  - Matière `(ce1-sciences-matiere)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-matiere, questions=6
  - Les états de l'eau `(ce1-sciences-etats-eau)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-etats-eau, questions=6
  - Mélanges simples `(ce1-sciences-melanges)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-melanges-simples, questions=6
  - Défi : mélanges simples `(ce1-bonus-sciences-melanges-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-melanges-simples, questions=10, bonus (seuil=2)

#### Corps et hygiène `(ce1-sciences-corps-subtheme)`

- **Leçons** (2) :
  - Prendre soin de son corps `(ce1-lesson-prendre-soin-corps)` — blocs: paragraph, example, bullets, tip, check, check
  - Les cinq sens `(ce1-lesson-cinq-sens)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (6) :
  - Corps et hygiène `(ce1-sciences-corps)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-corps-hygiene, questions=6
  - Prendre soin de son corps `(ce1-sciences-prendre-soin-corps)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/science_ce1.json, category=ce1-corps-hygiene
  - Sommeil et alimentation `(ce1-sciences-sommeil-alimentation)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/science_ce1.json, category=ce1-sommeil-alimentation
  - Hygiène quotidienne `(ce1-sciences-hygiene-quotidienne)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-hygiene-quotidienne, questions=6
  - Objets de la maison `(ce1-sciences-objets-maison)` — engine: `choice-engine`, type=factual-qcm, questions=6, dataFile=data/science_ce1.json, category=ce1-objets-maison
  - Défi : super hygiène `(ce1-bonus-sciences-corps-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-corps-hygiene, questions=10, bonus (seuil=2)

#### Saisons et météo `(ce1-sciences-saisons-subtheme)`

- **Leçons** (2) :
  - Le cycle des quatre saisons `(ce1-lesson-quatre-saisons)` — blocs: paragraph, example, bullets, tip, check, check
  - Les phénomènes météo `(ce1-lesson-phenomenes-meteo)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (4) :
  - Les saisons de l'année `(ce1-sciences-saisons-annee)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-saisons-meteo, questions=6
  - Observer la météo `(ce1-sciences-observer-meteo)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-saisons-meteo, questions=8
  - Climat et activités `(ce1-sciences-climat-activites)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-saisons-meteo, questions=6
  - Défi : super saisons et météo `(ce1-bonus-sciences-saisons-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-saisons-meteo, questions=10, bonus (seuil=2)

#### Les milieux de vie `(ce1-sciences-milieux-subtheme)`

- **Leçons** (2) :
  - Qu'est-ce qu'un milieu de vie ? `(ce1-lesson-milieu-de-vie)` — blocs: paragraph, example, bullets, tip, check, check
  - Des milieux de vie en France `(ce1-lesson-milieux-france)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (4) :
  - Les milieux de vie `(ce1-sciences-milieux-vie)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-milieux-vie, questions=6
  - Qui vit où ? `(ce1-sciences-qui-vit-ou)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-milieux-vie, questions=8
  - S'adapter à son milieu `(ce1-sciences-sadapter-milieu)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-milieux-vie, questions=6
  - Défi : super milieux de vie `(ce1-bonus-sciences-milieux-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-milieux-vie, questions=10, bonus (seuil=2)

#### Objets et matériaux `(ce1-sciences-objets-subtheme)`

- **Leçons** (2) :
  - Les objets techniques simples `(ce1-lesson-objets-techniques)` — blocs: paragraph, example, bullets, tip, check, check
  - Les propriétés des matériaux `(ce1-lesson-proprietes-materiaux)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (3) :
  - Les objets techniques `(ce1-sciences-objets-techniques)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-objets-materiaux, questions=6
  - Propriétés des matériaux `(ce1-sciences-proprietes-materiaux)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-objets-materiaux, questions=8
  - Bien choisir son matériau `(ce1-sciences-choisir-materiau)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce1.json, category=ce1-objets-materiaux, questions=6

### EMC (ce1-emc-subject)

#### Règles communes `(ce1-emc-regles-subtheme)`

- **Leçons** (2) :
  - Les règles de la classe `(ce1-lesson-regles-communes)` — blocs: paragraph, example, bullets, tip
  - Les rôles dans la classe `(ce1-lesson-roles-classe)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Règles communes `(ce1-emc-regles)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce1.json, category=ce1-regles, questions=6
  - Être responsable `(ce1-emc-responsabilites)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce1.json, category=ce1-responsabilites-eleve, questions=6
  - Rôles dans la classe `(ce1-emc-roles-classe)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/emc_ce1.json, category=ce1-roles-classe
  - Règles et valeurs `(ce1-emc-appariement)` — engine: `matching`, category=matching_emc_ce1, dataFile=data/emc_matching.json, questions=3
  - Émotions et attitudes `(ce1-emc-appariement-2)` — engine: `matching`, category=matching_emc_ce1, dataFile=data/emc_matching.json, questions=3
  - Défi : super règles de classe `(ce1-bonus-emc-regles-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce1.json, category=ce1-regles, questions=10, bonus (seuil=2)

#### Être citoyen `(ce1-emc-citoyen-subtheme)`

- **Leçons** (2) :
  - Être citoyen `(ce1-lesson-citoyen-honnetete)` — blocs: paragraph, example, bullets, tip
  - Les numéros qui sauvent `(ce1-lesson-numeros-urgence)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Être citoyen `(ce1-emc-citoyen)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce1.json, category=ce1-citoyen, questions=6
  - Défi : être citoyen `(ce1-bonus-emc-citoyen-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce1.json, category=ce1-citoyen, questions=9, bonus (seuil=2)
  - Émotions et respect `(ce1-emc-emotions-respect)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce1.json, category=ce1-emotions-respect, questions=6
  - Dialogue et politesse `(ce1-emc-dialogue-politesse)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce1.json, category=ce1-dialogue-politesse, questions=6
  - Les bons réflexes `(ce1-emc-securite-urgence)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce1.json, category=ce1-securite-urgence, questions=6

#### Entraide et respect `(ce1-emc-entraide-subtheme)`

- **Leçons** (2) :
  - Entraide et respect `(ce1-lesson-entraide-respect)` — blocs: paragraph, example, bullets, tip
  - Tous différents, tous ensemble `(ce1-lesson-differences)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Entraide et respect `(ce1-emc-entraide)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce1.json, category=ce1-entraide-respect, questions=6
  - S'entraider au quotidien `(ce1-emc-sentraider-quotidien)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/emc_ce1.json, category=ce1-entraide-respect
  - Emotions et respect `(ce1-emc-entraide-emotions)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce1.json, category=ce1-emotions-respect, questions=6
  - Dialogue et politesse `(ce1-emc-entraide-dialogue)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce1.json, category=ce1-dialogue-politesse, questions=6
  - Tous différents, tous ensemble `(ce1-emc-respect-differences)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce1.json, category=ce1-respect-differences, questions=6
  - Défi : vivre ensemble `(ce1-bonus-differences-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce1.json, category=ce1-respect-differences, questions=8, bonus (seuil=2)

---

## CE2

### Mathématiques (ce2-maths)

#### Tables de multiplication `(ce2-multiplication)`

- **Leçons** (3) :
  - Comprendre la multiplication `(ce2-lesson-comprendre-multiplication)` — blocs: paragraph, example, bullets, tip, check, check
  - Mémoriser toutes les tables `(ce2-lesson-memoriser-tables)` — blocs: paragraph, example, bullets, tip, check, check
  - Multiplier par 10, 100, 1 000 `(ce2-lesson-multiplier-10-100)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (13) :
  - Table de 2 `(ce2-m2)` — engine: `math-input`, type=mult, table=2, questions=10
  - Table de 3 `(ce2-m3)` — engine: `math-input`, type=mult, table=3, questions=10
  - Table de 4 `(ce2-m4)` — engine: `math-input`, type=mult, table=4, questions=10
  - Table de 5 `(ce2-m5)` — engine: `math-input`, type=mult, table=5, questions=10
  - Table de 6 `(ce2-m6)` — engine: `math-input`, type=mult, table=6, questions=10
  - Table de 7 `(ce2-m7)` — engine: `math-input`, type=mult, table=7, questions=10
  - Table de 8 `(ce2-m8)` — engine: `math-input`, type=mult, table=8, questions=10
  - Table de 9 `(ce2-m9)` — engine: `math-input`, type=mult, table=9, questions=10
  - Table de 10 `(ce2-m10)` — engine: `math-input`, type=mult, table=10, questions=10
  - Table de 11 `(ce2-m11)` — engine: `math-input`, type=mult, table=11, questions=10, bonus (seuil=2)
  - Table de 12 `(ce2-m12)` — engine: `math-input`, type=mult, table=12, questions=10, bonus (seuil=2)
  - Nombres et opérations `(ce2-maths-tables-appariement)` — engine: `matching`, category=matching_math_ce2, dataFile=data/math_matching.json, questions=3
  - Défi : toutes les tables `(ce2-bonus-tables-melangees)` — engine: `math-input`, type=mult, table=mix, questions=15, bonus (seuil=2)

#### Calculs & Logique `(ce2-calculs-logique)`

- **Leçons** (9) :
  - Poser une division `(ce2-lesson-division-posee)` — blocs: paragraph, example, tip, check, check
  - Les fractions simples `(ce2-lesson-fractions-simples)` — blocs: paragraph, bullets, tip, check, check
  - Chercher le complément `(ce2-lesson-complements-1000)` — blocs: paragraph, example, bullets, tip, check, check
  - Lire l'heure `(ce2-lesson-lire-horloge)` — blocs: paragraph, example, mini-table, tip, check, check
  - Partager en parts égales `(ce2-lesson-partages-egaux)` — blocs: paragraph, example, bullets, tip, check, check
  - Doubles et moitiés `(ce2-lesson-doubles-moities)` — blocs: paragraph, example, bullets, tip, check, check
  - Les longueurs `(ce2-lesson-longueurs)` — blocs: paragraph, example, bullets, tip, check, check
  - Les formes planes `(ce2-lesson-formes-planes)` — blocs: paragraph, example, bullets, tip, check, check
  - Masses et contenances `(ce2-lesson-masses-contenances)` — blocs: paragraph, example, mini-table, tip, check, check
- **Exercices** (20) :
  - Le Compte est bon `(ce2-cible-1)` — engine: `math-input`, type=cibles, nbFleches=5, questions=5
  - Carré Magique `(ce2-carre-magique-1)` — engine: `math-input`, type=carre-somme, solutionCount=3, targetMin=15, targetMax=25, gridSize=9, questions=6
  - Défi : Carré Magique Expert `(ce2-bonus-carre-magique-defi)` — engine: `math-input`, type=carre-somme, solutionCount=3, targetMin=25, targetMax=35, gridSize=9, questions=6, bonus (seuil=2)
  - Compléments à 100 `(ce2-comp-100)` — engine: `math-input`, type=complement, target=100, questions=10
  - L'Horloge `(ce2-clock)` — engine: `clock`, questions=5
  - Compléments à 1000 `(ce2-comp-1000)` — engine: `math-input`, type=complement, target=1000, questions=10
  - Comparer < 1000 `(ce2-comp-1000-compare)` — engine: `choice-engine`, range=1000, questions=10
  - Compléments à 500 `(ce2-comp-500)` — engine: `math-input`, type=complement, questions=10, target=500
  - Compléments à 1000 `(ce2-comp-2000)` — engine: `math-input`, type=complement, target=1000, questions=10
  - L'horloge (2) `(ce2-clock-2)` — engine: `clock`, questions=8
  - Problèmes additifs `(ce2-problemes-additifs)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle3.json, category=ce2-problemes-additifs, questions=8
  - Problèmes multiplicatifs `(ce2-problemes-multiplicatifs)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle3.json, category=ce2-problemes-multiplicatifs, questions=8
  - Monnaie et rendu de monnaie `(ce2-maths-monnaie)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle2.json, category=ce2-monnaie, questions=8
  - Défi : problèmes en rafale `(ce2-bonus-problemes-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle3.json, category=ce2-problemes-multiplicatifs, questions=10, bonus (seuil=2)
  - Convertir des masses `(ce2-conversions-masses)` — engine: `conversion`, subtype=metric, unitType=masse, questions=6
  - Convertir des contenances `(ce2-conversions-contenances)` — engine: `conversion`, subtype=metric, unitType=capacite, questions=6
  - Division posée `(ce2-division-posee)` — engine: `math-input`, type=division-posed, level=1, questions=5
  - Division posée avec reste `(ce2-division-posee-reste)` — engine: `math-input`, type=division-posed, level=1, ask=reste, questions=5
  - Lire des fractions simples `(ce2-fractions-simples)` — engine: `math-input`, type=fraction-view, maxDenom=4, questions=8
  - Défi : anticipation CM1 `(ce2-bonus-comp-5000)` — engine: `math-input`, type=complement, target=5000, questions=12, bonus (seuil=2)

#### Géométrie `(ce2-geometrie-subtheme)`

- **Leçons** (3) :
  - Figures planes et solides `(ce2-lesson-figures-solides)` — blocs: paragraph, example, bullets, tip, check, check
  - L'angle droit et l'équerre `(ce2-lesson-angle-droit-equerre)` — blocs: paragraph, example, bullets, tip, check, check
  - Symétrie et quadrillage `(ce2-lesson-symetrie-quadrillage)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (9) :
  - Figures et solides `(ce2-geo-figures-solides)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_ce2.json, category=ce2-figures-proprietes, questions=8
  - L'angle droit `(ce2-geo-angle-droit)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_ce2.json, category=ce2-angle-droit-equerre, questions=8
  - Touche les angles droits `(ce2-geo-angle-droit-pratique)` — engine: `board-interactive`, type=tap-features, dataFile=data/board_tap_features_ce2.json, category=ce2_tap_angle_droit, questions=4
  - Symétrie et quadrillage `(ce2-geo-symetrie-quadrillage)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_ce2.json, category=ce2-symetrie-quadrillage, questions=8
  - Complète la figure symétrique `(ce2-geo-symetrie-pratique)` — engine: `board-interactive`, type=symmetry-complete, dataFile=data/board_symmetry_complete_ce2.json, category=ce2_symmetry_complete, questions=4
  - Place le point sur le quadrillage `(ce2-geo-reperage-pratique)` — engine: `board-interactive`, type=point-on-grid, dataFile=data/board_point_on_grid_ce2.json, category=ce2_point_on_grid, questions=6
  - Notions de maths mélangées `(ce2-maths-geo-appariement)` — engine: `matching`, category=matching_math_ce2, dataFile=data/math_matching.json, questions=3
  - Jeu de mémoire `(ce2-maths-memoire)` — engine: `board-interactive`, type=memory-match, dataFile=data/board_memory_match_ce2.json, category=ce2_memory_match, questions=5
  - Défi : symétrie et quadrillage `(ce2-bonus-geo-symetrie)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_ce2.json, category=ce2-symetrie-quadrillage, questions=12, bonus (seuil=2)

### Français (ce2-francais)

#### Orthographe & Grammaire `(ce2-orthographe-grammaire)`

- **Leçons** (5) :
  - Choisir le bon homophone `(ce2-lesson-homophones-reperes)` — blocs: paragraph, example, bullets, tip, check, check
  - Accorder le groupe nominal `(ce2-lesson-accord-groupe-nominal)` — blocs: paragraph, example, bullets, tip, check, check
  - La phrase et la ponctuation `(ce2-lesson-phrase-ponctuation)` — blocs: paragraph, example, bullets, tip, check, check
  - Le pluriel des noms `(ce2-lesson-pluriel-noms)` — blocs: paragraph, example, bullets, tip, check, check
  - a ou à ? et ou est ? `(ce2-lesson-a-accent-ou-pas)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (23) :
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
  - Un ou Une ? (objets) `(ce2-g-objets)` — engine: `choice-engine`, type=gender-articles, category=gender_ce2_objets_2, questions=8
  - Le, La ou L' ? (2) `(ce2-g-elision)` — engine: `choice-engine`, type=gender-articles, category=gender_ce2_elision_2, questions=8
  - Ordre des mots `(ce2-francais-ordre-mots)` — engine: `word-order`, category=word_order_ce2, dataFile=data/french_word_order.json, questions=5
  - Types et formes de phrases `(ce2-g-types-phrases)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_phrase_types_ce2, questions=8
  - Défi : phrases mélangées `(ce2-bonus-ordre-mots-expert)` — engine: `word-order`, category=word_order_ce2, dataFile=data/french_word_order.json, questions=10, bonus (seuil=2)
  - Raconte une histoire `(ce2-francais-raconte-histoire)` — engine: `word-order`, category=story_order_ce2, dataFile=data/french_word_order.json, questions=4

#### Conjugaison `(ce2-conjugaison-subject)`

- **Leçons** (4) :
  - Le verbe aller au présent `(ce2-lesson-se-deplacer)` — blocs: paragraph, mini-table, example, tip, check, check
  - Être et avoir au présent `(ce2-lesson-etre-avoir-present)` — blocs: paragraph, mini-table, example, tip, check, check
  - Le passé composé `(ce2-lesson-passe-compose)` — blocs: paragraph, example, bullets, tip, check, check
  - Trouver l'infinitif d'un verbe `(ce2-lesson-trouver-infinitif)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (13) :
  - Rappel : Le Présent `(ce2-conj-pres-all)` — engine: `conjugation`, category=present_1, tenses=présent, questions=10
  - Futur : Être et Avoir `(ce2-conj-etre-avoir-futur)` — engine: `conjugation`, category=etre_avoir_f, tenses=futur, questions=6
  - Futur : Verbes en -ER `(ce2-conj-futur-er)` — engine: `conjugation`, category=future_1, tenses=futur, questions=8
  - Imparfait : Auxiliaires `(ce2-conj-imp-ea)` — engine: `conjugation`, category=etre_avoir_imp, tenses=imparfait, questions=6
  - Imparfait : Verbes en -ER `(ce2-conj-imp-er)` — engine: `conjugation`, category=imparfait_1, tenses=imparfait, questions=8
  - Défi : Présent ou Futur ? `(ce2-conj-defi-temps)` — engine: `conjugation`, category=future_1, questions=10
  - Le 3ème groupe (1) `(ce2-conj-p3-freq)` — engine: `conjugation`, category=present_3_ce2_a, tenses=présent, questions=8
  - Le 3ème groupe (2) `(ce2-conj-p3-pouvoir)` — engine: `conjugation`, category=present_3_ce2_b, tenses=présent, questions=8
  - Présent : être et avoir `(ce2-conj-present-ea)` — engine: `conjugation`, category=etre_avoir_p, tenses=présent, questions=8
  - Présent : 2e groupe `(ce2-conj-present-2g)` — engine: `conjugation`, category=present_2, tenses=présent, questions=8
  - Passé composé : avoir `(ce2-conj-pc-avoir)` — engine: `conjugation`, category=pc_1, tenses=passé composé, questions=6
  - Passé composé : être `(ce2-conj-pc-etre)` — engine: `conjugation`, category=pc_1, tenses=passé composé, questions=6
  - Défi : présent, futur, imparfait `(ce2-bonus-conj-trois-temps)` — engine: `conjugation`, category=future_1, questions=12, bonus (seuil=2)

#### Lecture et vocabulaire `(ce2-lecture-vocabulaire-subtheme)`

- **Leçons** (5) :
  - Comprendre un texte court `(ce2-lesson-comprendre-texte-court)` — blocs: paragraph, example, bullets, tip, check, check
  - Comprendre le sens d'un mot `(ce2-lesson-vocabulaire-sens-mot)` — blocs: paragraph, example, bullets, tip, check, check
  - Ranger les mots par thème `(ce2-lesson-ranger-mots-theme)` — blocs: paragraph, example, bullets, tip, check, check
  - Le champ lexical `(ce2-lesson-champ-lexical)` — blocs: paragraph, example, bullets, tip, check, check
  - L'ordre alphabétique et le dictionnaire `(ce2-lesson-ordre-alphabetique-dictionnaire)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (14) :
  - Trouver l'idée principale `(ce2-lecture-idee-principale)` — engine: `reading`, category=ce2_lecture_idee_principale, questions=5
  - Comprendre le sens d'un mot `(ce2-vocabulaire-sens-mot)` — engine: `reading`, category=ce2_vocabulaire_sens, questions=5
  - Le champ lexical `(ce2-vocabulaire-champ-lexical)` — engine: `reading`, category=ce2_vocabulaire_champ_lexical, questions=6
  - Associe les contraires `(ce2-vocab-appariement)` — engine: `matching`, category=matching_contraires_ce2, dataFile=data/french/matching.json, questions=2
  - Ordre alphabétique `(ce2-vocab-ordre-alpha)` — engine: `word-order`, category=alpha_order_ce2, dataFile=data/french_word_order.json, questions=5
  - Utiliser le dictionnaire `(ce2-vocab-dictionnaire-reperes)` — engine: `matching`, category=matching_dictionnaire_ce2, dataFile=data/french/matching.json, questions=2
  - Lire entre les lignes `(ce2-lecture-inferences)` — engine: `reading`, category=ce2_lecture_inferences, questions=6
  - Comprendre un texte court `(ce2-lecture-comprehension-courte)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/french_ce2_reading.json, category=ce2_lecture_comprehension_courte, questions=8
  - Sens d'un mot en contexte `(ce2-lecture-sens-contexte)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/french_ce2_reading.json, category=ce2_lecture_sens_contexte, questions=8
  - Vocabulaire par thèmes `(ce2-vocabulaire-themes)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/french_ce2_reading.json, category=ce2_vocabulaire_themes, questions=8
  - Repérer les informations `(ce2-lecture-reperage-infos)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/french_ce2_reading.json, category=ce2_lecture_reperage_infos, questions=8
  - Les synonymes `(ce2-vocabulaire-synonymes)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/french_ce2_reading.json, category=ce2_vocabulaire_synonymes, questions=8
  - Familles de mots `(ce2-vocabulaire-familles-mots)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/french_ce2_reading.json, category=ce2_vocabulaire_familles_mots, questions=8
  - Défi : super lecteur `(ce2-bonus-lecture-idee-principale)` — engine: `reading`, category=ce2_lecture_idee_principale, questions=8, bonus (seuil=2)

#### Dictée audio `(ce2-dictee-audio-subtheme)`

- **Leçons** (2) :
  - Bien écouter pour bien écrire `(ce2-lesson-ecoute-attentive)` — blocs: paragraph, example, bullets, tip, check, check
  - Se relire comme un détective `(ce2-lesson-relire-dictee)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (3) :
  - Les animaux `(ce2-audio-animaux)` — engine: `audio-spelling`, category=animals, speechRate=0.8, questions=6
  - L'école `(ce2-audio-ecole)` — engine: `audio-spelling`, category=school, speechRate=0.8, questions=6
  - La maison `(ce2-audio-maison)` — engine: `audio-spelling`, category=house, speechRate=0.8, questions=6

### Questionner le temps (ce2-histoire-subject)

#### Repères `(ce2-histoire-reperes-subtheme)`

- **Leçons** (2) :
  - Situer les événements dans le temps `(ce2-lesson-situer-temps)` — blocs: paragraph, example, bullets, tip
  - Jours, années, siècles `(ce2-lesson-siecle-frise)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Repères `(ce2-histoire-reperes)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce2.json, category=ce2-reperes, questions=8
  - Situer dans le temps `(ce2-histoire-situer-temps)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/history_ce2.json, category=ce2-reperes
  - La frise chronologique `(ce2-histoire-frise-chrono)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce2.json, category=ce2-frise-vie-famille, questions=6
  - Défi : repères dans le temps `(ce2-bonus-histoire-reperes-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce2.json, category=ce2-reperes, questions=8, bonus (seuil=2)

#### Autrefois `(ce2-histoire-vie-subtheme)`

- **Leçons** (2) :
  - Comparer autrefois et aujourd'hui `(ce2-lesson-comparer-autrefois)` — blocs: paragraph, example, bullets, tip
  - Les objets du passé `(ce2-lesson-objets-passe)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Autrefois `(ce2-histoire-vie)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce2.json, category=ce2-vie-autrefois, questions=8
  - Comparer la vie d'autrefois `(ce2-histoire-comparer-autrefois)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/history_ce2.json, category=ce2-vie-autrefois
  - Personnages célèbres de notre histoire `(ce2-histoire-personnages-vie-autrefois)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce2.json, category=ce2-personnages-celebres, questions=6
  - Défi : vie autrefois et personnages `(ce2-bonus-histoire-vie-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce2.json, category=ce2-vie-autrefois, questions=8, bonus (seuil=2)

#### Monuments et personnages `(ce2-histoire-monuments-subtheme)`

- **Leçons** (2) :
  - Les traces du passé `(ce2-lesson-traces-passe)` — blocs: paragraph, example, bullets, tip
  - Les monuments, témoins du passé `(ce2-lesson-monuments-indices)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Monuments et personnages `(ce2-histoire-monuments)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce2.json, category=ce2-personnages-monuments, questions=6
  - Personnages célèbres `(ce2-histoire-personnages-celebres)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce2.json, category=ce2-personnages-celebres, questions=6
  - Traces et souvenirs du passé `(ce2-histoire-souvenirs-monuments)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce2.json, category=ce2-souvenirs-monuments, questions=6
  - Repères et personnages `(ce2-histoire-appariement)` — engine: `matching`, category=matching_histoire_ce2, dataFile=data/history_matching.json, questions=2
  - Défi : grands personnages `(ce2-bonus-histoire-personnages)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce2.json, category=ce2-personnages-celebres, questions=10, bonus (seuil=2)

#### L'école d'autrefois `(ce2-histoire-ecole-subtheme)`

- **Leçons** (2) :
  - L'école d'autrefois `(ce2-lesson-ecole-autrefois)` — blocs: paragraph, example, bullets, tip
  - L'école pour tous `(ce2-lesson-jules-ferry)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - L'école d'autrefois `(ce2-histoire-ecole-autrefois)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce2.json, category=ce2-ecole-autrefois, questions=6
  - Écrire et apprendre autrefois `(ce2-histoire-apprendre-autrefois)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/history_ce2.json, category=ce2-ecole-autrefois
  - Frise de vie `(ce2-histoire-frise-vie-famille)` — engine: `choice-engine`, type=factual-qcm, questions=6, dataFile=data/history_ce2.json, category=ce2-frise-vie-famille
  - Repères d'histoire mélangés `(ce2-histoire-ecole-appariement)` — engine: `matching`, category=matching_histoire_ce2, dataFile=data/history_matching.json, questions=2
  - Défi : l'école autrefois `(ce2-bonus-histoire-ecole)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_ce2.json, category=ce2-ecole-autrefois, questions=10, bonus (seuil=2)

### Questionner l'espace (ce2-geographie-subject)

#### Espaces `(ce2-geo-espaces-subtheme)`

- **Leçons** (3) :
  - Habiter des espaces différents `(ce2-lesson-habiter-espaces-differents)` — blocs: paragraph, example, bullets, tip
  - La commune et ses services `(ce2-lesson-commune-services)` — blocs: paragraph, example, bullets, tip
  - Ville et campagne `(ce2-lesson-ville-campagne)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Espaces `(ce2-geo-espaces)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce2.json, category=ce2-espaces, questions=8
  - Habiter et activités `(ce2-geo-habiter)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce2.json, category=ce2-habiter-activites, questions=6
  - Services de la commune `(ce2-geo-services-commune)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce2.json, category=ce2-services-commune, questions=6
  - Cartes du quartier `(ce2-geo-cartes-quartier)` — engine: `choice-engine`, type=factual-qcm, questions=6, dataFile=data/geography_ce2.json, category=ce2-cartes-quartier
  - Espaces et activités `(ce2-geo-appariement)` — engine: `matching`, category=matching_geo_ce2, dataFile=data/geography_matching.json, questions=2
  - Défi : ville, campagne et services `(ce2-bonus-geo-espaces)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce2.json, category=ce2-espaces, questions=12, bonus (seuil=2)

#### La France `(ce2-geo-france-subtheme)`

- **Leçons** (2) :
  - Lire une carte de France `(ce2-lesson-lire-carte-france)` — blocs: paragraph, example, bullets, tip
  - La France en relief `(ce2-lesson-france-releifs-fleuves)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - La France `(ce2-geo-france)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce2.json, category=ce2-france, questions=8
  - Reliefs simples `(ce2-geo-reliefs)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce2.json, category=ce2-reliefs-simples, questions=6
  - Les grandes villes `(ce2-geo-grandes-villes)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce2.json, category=ce2-grandes-villes, questions=8
  - Fleuves, mers et pays voisins `(ce2-geo-fleuves-mers-voisins)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce2.json, category=ce2-fleuves-mers-voisins, questions=8

#### Se repérer `(ce2-geo-reperage-subtheme)`

- **Leçons** (2) :
  - Lire une carte simple `(ce2-lesson-lire-carte-simple)` — blocs: paragraph, example, bullets, tip
  - Le plan du quartier `(ce2-lesson-plan-quartier)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Se repérer `(ce2-geo-reperage)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce2.json, category=ce2-se-reperer, questions=6
  - Plan et repères `(ce2-geo-plan-reperes)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/geography_ce2.json, category=ce2-se-reperer
  - Cartes et symboles `(ce2-geo-cartes-symboles)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/geography_ce2.json, category=ce2-cartes-symboles
  - Symboles et légendes `(ce2-geo-reperage-appariement)` — engine: `matching`, category=matching_geo_ce2, dataFile=data/geography_matching.json, questions=2
  - Défi : super cartographe `(ce2-bonus-geo-reperage)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce2.json, category=ce2-se-reperer, questions=12, bonus (seuil=2)

#### Transports `(ce2-geo-transports-subtheme)`

- **Leçons** (2) :
  - Se déplacer selon les lieux `(ce2-lesson-choisir-transport)` — blocs: paragraph, example, bullets, tip
  - Comparer les transports `(ce2-lesson-transports-comparer)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Transports `(ce2-geo-transports)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce2.json, category=ce2-transports, questions=6
  - Voyager et se déplacer `(ce2-geo-voyager-deplacer)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/geography_ce2.json, category=ce2-transports
  - Lire une carte `(ce2-geo-transports-cartes)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce2.json, category=ce2-cartes-symboles, questions=6
  - Défi : trajets et transports `(ce2-bonus-geo-transports-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_ce2.json, category=ce2-transports, questions=8, bonus (seuil=2)

### Questionner le vivant et la matière (ce2-sciences-subject)

#### Le vivant `(ce2-sciences-vivant-subtheme)`

- **Leçons** (2) :
  - Les besoins des êtres vivants `(ce2-lesson-besoins-vivant)` — blocs: paragraph, example, bullets, tip, check, check
  - Les cinq sens `(ce2-lesson-cinq-sens)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (5) :
  - Le vivant `(ce2-sciences-vivant)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce2.json, category=ce2-vivant, questions=8
  - Grandir et se nourrir `(ce2-sciences-grandir-nourrir)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/science_ce2.json, category=ce2-vivant
  - Chaînes alimentaires simples `(ce2-sciences-chaines-alimentaires)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce2.json, category=ce2-chaines-alimentaires-simples, questions=6
  - Défi : chaînes alimentaires `(ce2-bonus-sciences-chaines-alimentaires-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce2.json, category=ce2-chaines-alimentaires-simples, questions=9, bonus (seuil=2)
  - Les parties du corps `(ce2-sciences-tap-corps)` — engine: `board-interactive`, type=tap-features, dataFile=data/board_tap_features_science.json, category=ce2_tap_corps_humain, questions=4

#### Matière `(ce2-sciences-matiere-subtheme)`

- **Leçons** (2) :
  - L'eau et ses états `(ce2-lesson-etats-eau)` — blocs: paragraph, example, bullets, tip, check, check
  - Solide, liquide, gaz `(ce2-lesson-solides-liquides-gaz)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (5) :
  - Matière `(ce2-sciences-matiere)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce2.json, category=ce2-matiere, questions=8
  - Objets du quotidien `(ce2-sciences-objets-techniques)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce2.json, category=ce2-objets-quotidien, questions=6
  - Eau et transformations `(ce2-sciences-eau-transformations)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce2.json, category=ce2-eau-transformations, questions=6
  - Matériaux et propriétés `(ce2-sciences-appariement)` — engine: `matching`, category=matching_sciences_ce2, dataFile=data/science_matching.json, questions=2
  - Défi : eau et matière `(ce2-bonus-sciences-matiere)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce2.json, category=ce2-eau-transformations, questions=10, bonus (seuil=2)

#### Observer `(ce2-sciences-observer-subtheme)`

- **Leçons** (2) :
  - Observer puis classer `(ce2-lesson-observer-classer)` — blocs: paragraph, example, bullets, tip, check, check
  - Mener une expérience `(ce2-lesson-demarche-experience)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (6) :
  - Observer `(ce2-sciences-observer)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce2.json, category=ce2-observer-experimenter, questions=6
  - Expériences simples `(ce2-sciences-experiences)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce2.json, category=ce2-experiences-simples, questions=6
  - Objets techniques simples `(ce2-sciences-objets-techniques-simples)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/science_ce2.json, category=ce2-objets-techniques-simples
  - Matériaux et usages `(ce2-sciences-materiaux-usages)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce2.json, category=ce2-materiaux-usages, questions=6
  - Objets techniques et mesures `(ce2-sciences-observer-appariement)` — engine: `matching`, category=matching_sciences_ce2, dataFile=data/science_matching.json, questions=2
  - Défi : super observateur `(ce2-bonus-sciences-observer)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce2.json, category=ce2-experiences-simples, questions=10, bonus (seuil=2)

#### Saisons et météo `(ce2-sciences-saisons-subtheme)`

- **Leçons** (2) :
  - Le cycle des saisons `(ce2-lesson-cycle-saisons)` — blocs: paragraph, example, bullets, tip, check, check
  - Les instruments de la météo `(ce2-lesson-instruments-meteo)` — blocs: paragraph, example, mini-table, tip, check, check
- **Exercices** (4) :
  - Le cycle des saisons `(ce2-sciences-cycle-saisons)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce2.json, category=ce2-saisons-meteo, questions=8
  - Mesurer la météo `(ce2-sciences-mesurer-meteo)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce2.json, category=ce2-saisons-meteo, questions=6
  - Climat et environnement `(ce2-sciences-climat-environnement)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce2.json, category=ce2-saisons-meteo, questions=6
  - Défi : saisons et météo `(ce2-bonus-sciences-saisons)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce2.json, category=ce2-saisons-meteo, questions=10, bonus (seuil=2)

#### Les milieux de vie `(ce2-sciences-milieux-subtheme)`

- **Leçons** (2) :
  - Qu'est-ce qu'un milieu de vie ? `(ce2-lesson-ecosysteme-simple)` — blocs: paragraph, example, bullets, tip, check, check
  - La biodiversité d'un milieu `(ce2-lesson-biodiversite-milieux)` — blocs: paragraph, example, mini-table, tip, check, check
- **Exercices** (4) :
  - Les écosystèmes simples `(ce2-sciences-ecosystemes-simples)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce2.json, category=ce2-milieux-vie, questions=8
  - La biodiversité autour de nous `(ce2-sciences-biodiversite)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce2.json, category=ce2-milieux-vie, questions=6
  - Protéger les milieux `(ce2-sciences-proteger-milieux)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce2.json, category=ce2-milieux-vie, questions=6
  - Défi : les milieux de vie `(ce2-bonus-sciences-milieux)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_ce2.json, category=ce2-milieux-vie, questions=10, bonus (seuil=2)

### EMC (ce2-emc-subject)

#### Règles `(ce2-emc-regles-subtheme)`

- **Leçons** (3) :
  - Respecter les règles `(ce2-lesson-regles)` — blocs: paragraph, example, bullets, tip
  - Les droits et les devoirs `(ce2-lesson-droits-devoirs)` — blocs: paragraph, example, bullets, tip
  - Parler et écouter avec respect `(ce2-lesson-dialogue-respectueux)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Règles `(ce2-emc-regles)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce2.json, category=ce2-regles, questions=8
  - Lieux et objets communs `(ce2-emc-lieux-communs)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce2.json, category=ce2-lieux-objets-communs, questions=6
  - Défi : règles communes `(ce2-bonus-emc-regles-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce2.json, category=ce2-lieux-objets-communs, questions=9, bonus (seuil=2)
  - Droits et devoirs `(ce2-emc-appariement)` — engine: `matching`, category=matching_emc_ce2, dataFile=data/emc_matching.json, questions=3
  - Symboles et valeurs de la République `(ce2-emc-appariement-2)` — engine: `matching`, category=matching_emc_ce2, dataFile=data/emc_matching.json, questions=3

#### Citoyen `(ce2-emc-citoyen-subtheme)`

- **Leçons** (2) :
  - Être citoyen `(ce2-lesson-citoyen)` — blocs: paragraph, example, bullets, tip
  - Le vote et les élections `(ce2-lesson-vote-elections)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Citoyen `(ce2-emc-citoyen)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce2.json, category=ce2-citoyen, questions=8
  - Coopérer `(ce2-emc-cooperation)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce2.json, category=ce2-cooperation, questions=6
  - Décider ensemble `(ce2-emc-decisions-collectives)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/emc_ce2.json, category=ce2-decisions-collectives
  - Parole et écoute `(ce2-emc-parole-ecoute)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce2.json, category=ce2-parole-ecoute, questions=6
  - Défi : super citoyen `(ce2-bonus-emc-citoyen)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce2.json, category=ce2-citoyen, questions=10, bonus (seuil=2)

#### Entraide `(ce2-emc-entraide-subtheme)`

- **Leçons** (2) :
  - Aider un camarade `(ce2-lesson-entraide)` — blocs: paragraph, example, bullets, tip
  - La solidarité au quotidien `(ce2-lesson-solidarite-quotidien)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Entraide `(ce2-emc-entraide)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce2.json, category=ce2-entraide, questions=6
  - Aider et coopérer `(ce2-emc-aider-cooperer)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/emc_ce2.json, category=ce2-entraide
  - Coopérer en classe `(ce2-emc-cooperation-classe)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce2.json, category=ce2-cooperation, questions=6
  - Défi : entraide et coopération `(ce2-bonus-emc-entraide-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce2.json, category=ce2-entraide, questions=8, bonus (seuil=2)

#### Responsabilité `(ce2-emc-responsabilite-subtheme)`

- **Leçons** (2) :
  - Être responsable `(ce2-lesson-responsable)` — blocs: paragraph, example, bullets, tip
  - Responsable à l'école et à la maison `(ce2-lesson-responsable-partout)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Responsabilité `(ce2-emc-responsabilite)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce2.json, category=ce2-responsabilite, questions=6
  - Être responsable `(ce2-emc-etre-responsable)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/emc_ce2.json, category=ce2-responsabilite
  - Parole et écoute `(ce2-emc-parole-ecoute-responsable)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce2.json, category=ce2-parole-ecoute, questions=6
  - Défi : responsabilité et engagement `(ce2-bonus-emc-responsabilite-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce2.json, category=ce2-responsabilite, questions=8, bonus (seuil=2)

#### Esprit critique et symboles `(ce2-emc-esprit-critique-subtheme)`

- **Leçons** (2) :
  - Vérifier une information `(ce2-lesson-esprit-critique)` — blocs: paragraph, example, bullets, tip
  - Les symboles de la République `(ce2-lesson-symboles-republique)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Info fiable ou pas ? `(ce2-emc-esprit-critique)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce2.json, category=ce2-esprit-critique, questions=6
  - Défi : esprit critique `(ce2-bonus-emc-esprit-critique-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce2.json, category=ce2-esprit-critique, questions=9, bonus (seuil=2)
  - Les symboles de la République `(ce2-emc-symboles-republique)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_ce2.json, category=ce2-symboles-republique, questions=7

---

## CM1

### Mathématiques (cm1-maths-subject)

#### Nombres et calculs `(cm1-nombres-calculs)`

- **Leçons** (5) :
  - Lire une fraction `(cm1-lesson-fractions)` — blocs: paragraph, example, bullets, tip, check, check
  - Repérer les décimaux `(cm1-lesson-decimaux-reperes)` — blocs: paragraph, example, bullets, tip, check, check
  - Résoudre un problème `(cm1-lesson-problemes-calcul)` — blocs: paragraph, example, bullets, tip, check, check
  - Résoudre un problème `(cm1-lesson-resoudre-probleme)` — blocs: paragraph, example, bullets, tip, check, check
  - La proportionnalité `(cm1-lesson-proportionnalite)` — blocs: paragraph, example, mini-table, bullets, tip, check, check
- **Exercices** (23) :
  - Grands Nombres `(cm1-m-big)` — engine: `math-input`, type=dictée-nombres, max=1000000, questions=5
  - Fractions `(cm1-frac-1)` — engine: `math-input`, type=fraction-view, maxDenom=8, questions=10
  - Construis la fraction `(cm1-frac-build)` — engine: `board-interactive`, type=fraction-build, minDenom=2, maxDenom=8, questions=8
  - Décimaux : Positions (1) `(cm1-dec-pos-1)` — engine: `math-input`, type=decimal-place, trap=false, questions=10
  - Décimaux : Positions (2) `(cm1-dec-pos-2)` — engine: `math-input`, type=decimal-place, trap=true, questions=10
  - La Moitié `(cm1-div-1)` — engine: `math-input`, type=half, questions=10
  - Divisions Simples `(cm1-div-2)` — engine: `math-input`, type=division-simple, questions=10
  - Le Juste Nombre `(cm1-div-3)` — engine: `math-input`, type=division-reste, questions=10
  - Division posée `(cm1-div-posed-1)` — engine: `math-input`, type=division-posed, level=1, questions=5
  - Comparer des décimaux `(cm1-dec-compare)` — engine: `choice-engine`, type=compare-decimals, questions=10
  - Division posée avec reste `(cm1-div-reste)` — engine: `math-input`, type=division-posed, level=1, ask=reste, questions=5
  - Lire des fractions `(cm1-frac-2)` — engine: `math-input`, type=fraction-view, maxDenom=12, questions=10
  - Grands nombres `(cm1-m-big-2)` — engine: `math-input`, type=dictée-nombres, max=100000, questions=5
  - Fractions plus précises `(cm1-frac-3)` — engine: `math-input`, type=fraction-view, maxDenom=12, questions=10
  - Grands nombres (3) `(cm1-m-big-3)` — engine: `math-input`, type=dictée-nombres, max=999999, questions=5
  - Problèmes multiplications/divisions `(cm1-problemes-multi-division)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle3.json, category=cm1-problemes-multi-division, questions=8
  - Problèmes de mesures `(cm1-problemes-mesures)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle3.json, category=cm1-problemes-mesures, questions=8
  - Proportionnalité `(cm1-problemes-proportionnalite)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle3.json, category=cm1-problemes-proportionnalite, questions=8
  - Proportionnalité : la recette `(cm1-proportionnalite-1)` — engine: `math-input`, type=proportionnalite, maxCoef=5, maxBase=6, questions=6
  - Lire une échelle de plan `(cm1-echelle-1)` — engine: `math-input`, type=echelle, questions=6
  - Calculer un pourcentage simple `(cm1-pourcentage-1)` — engine: `math-input`, type=pourcentage, maxMultiple=8, questions=6
  - Défi : proportionnalité experte `(cm1-bonus-proportionnalite-expert)` — engine: `math-input`, type=proportionnalite, maxCoef=9, maxBase=9, questions=8, bonus (seuil=2)
  - Défi : grands calculs `(cm1-bonus-grands-calculs)` — engine: `math-input`, type=division-posed, level=2, questions=6, bonus (seuil=2)

#### Grandeurs et mesures `(cm1-grandeurs-mesures)`

- **Leçons** (5) :
  - Comprendre une conversion `(cm1-lesson-conversions-mesures)` — blocs: paragraph, example, bullets, tip, check, check
  - Convertir masses et contenances `(cm1-lesson-masses-contenances)` — blocs: paragraph, example, mini-table, bullets, tip, check, check
  - Lire les chiffres romains `(cm1-lesson-lire-romains)` — blocs: paragraph, example, mini-table, tip, check, check
  - Repérer des formes géométriques `(cm1-lesson-formes-geometriques)` — blocs: paragraph, example, bullets, tip, check, check
  - Triangles et quadrilatères `(cm1-lesson-triangles-quadrilateres)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (14) :
  - Chiffres romains `(cm1-romains)` — engine: `conversion`, subtype=roman, max=20, questions=5
  - Convertir des longueurs `(cm1-longueurs)` — engine: `conversion`, subtype=metric, questions=10
  - Convertir les heures `(cm1-durees-appr)` — engine: `conversion`, subtype=time, modes=h_to_min, memo=true, questions=10
  - Heures et minutes `(cm1-durees-eval)` — engine: `conversion`, subtype=time, memo=false, questions=10
  - Minutes vers secondes `(cm1-time-sec)` — engine: `conversion`, subtype=time, modes=min_to_sec, memo=true, questions=10
  - Convertir des durées `(cm1-time-hard)` — engine: `conversion`, subtype=time, modes=hmin_to_min, memo=true, randomMinutes=true, questions=10
  - Chiffres romains (2) `(cm1-romains-50)` — engine: `conversion`, subtype=roman, max=50, questions=5
  - Minutes vers secondes (2) `(cm1-heures-secondes)` — engine: `conversion`, subtype=time, modes=min_to_sec, memo=false, questions=10
  - Chiffres romains (3) `(cm1-romains-100)` — engine: `conversion`, questions=5, max=100, subtype=roman
  - Heures et minutes (2) `(cm1-time-hard-2)` — engine: `conversion`, subtype=time, modes=hmin_to_min, memo=false, randomMinutes=true, questions=10
  - Convertir des masses `(cm1-conversions-masses)` — engine: `conversion`, subtype=metric, unitType=masse, questions=6
  - Convertir des contenances `(cm1-conversions-contenances)` — engine: `conversion`, subtype=metric, unitType=capacite, questions=6
  - Mesures et conversions `(cm1-maths-mesures-appariement)` — engine: `matching`, category=matching_math_cm1, dataFile=data/math_matching.json, questions=3
  - Défi : conversions express `(cm1-bonus-conversions-expert)` — engine: `conversion`, subtype=time, memo=false, randomMinutes=true, questions=12, bonus (seuil=2)

#### Géométrie `(cm1-geometrie-subtheme)`

- **Leçons** (8) :
  - Reconnaître les polygones `(cm1-lesson-polygones)` — blocs: paragraph, example, bullets, tip, check, check
  - L'angle droit `(cm1-lesson-angles-droits)` — blocs: paragraph, example, bullets, tip, check, check
  - Les familles d'angles `(cm1-lesson-familles-angles)` — blocs: paragraph, example, bullets, tip, check, check
  - Mesurer un angle en degrés `(cm1-lesson-mesurer-angles)` — blocs: paragraph, example, bullets, tip, check, check
  - Le compas et le cercle `(cm1-lesson-compas-report)` — blocs: paragraph, example, bullets, tip, check, check
  - Le périmètre `(cm1-lesson-perimetre)` — blocs: paragraph, example, bullets, tip, check, check
  - L'aire du rectangle `(cm1-lesson-aire-rectangle)` — blocs: paragraph, example, bullets, tip, check, check
  - Découvrir le volume `(cm1-lesson-volume-pave)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (17) :
  - Reconnaître les polygones `(cm1-geo-polygones)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_cm1.json, category=cm1-polygones, questions=8
  - Périmètre et angle droit `(cm1-geo-perimetre-angles)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_cm1.json, category=cm1-perimetre-angles, questions=8
  - Touche les angles droits `(cm1-geo-angle-droit-pratique)` — engine: `board-interactive`, type=tap-features, dataFile=data/board_tap_features_cm1.json, category=cm1_tap_angle_droit, questions=5
  - Aigu, droit ou obtus ? `(cm1-geo-angle-classify)` — engine: `board-interactive`, type=angle-classify, dataFile=data/board_angle_classify_cm1.json, category=cm1_angle_classify, questions=6
  - Mesure l'angle au rapporteur `(cm1-geo-angle-measure)` — engine: `board-interactive`, type=angle-measure, dataFile=data/board_angle_measure_cm1.json, category=cm1_angle_measure, questions=6
  - Le geste du compas `(cm1-geo-construction-compas)` — engine: `board-interactive`, type=construction-report, dataFile=data/board_construction_cm1.json, category=cm1_construction_report, questions=5
  - Défi : le maître des angles `(cm1-bonus-geo-angles-expert)` — engine: `board-interactive`, type=angle-measure, dataFile=data/board_angle_measure_cm1.json, category=cm1_angle_measure, questions=9, bonus (seuil=2)
  - Droites perpendiculaires `(cm1-geo-perpendiculaires-pratique)` — engine: `board-interactive`, type=tap-features, dataFile=data/board_geometry_cm1.json, category=cm1_perpendiculaires_tap, questions=3
  - Symétrie et repérage `(cm1-geo-symetrie-reperage)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_cm1.json, category=cm1-symetrie-reperage, questions=8
  - Place le point sur le quadrillage `(cm1-geo-reperage-pratique)` — engine: `board-interactive`, type=point-on-grid, dataFile=data/board_point_on_grid_cm1.json, category=cm1_point_on_grid, questions=7
  - Complète la figure symétrique `(cm1-geo-symetrie-pratique)` — engine: `board-interactive`, type=symmetry-complete, dataFile=data/board_symmetry_complete_cm1.json, category=cm1_symmetry_complete, questions=5
  - Vocabulaire géométrique `(cm1-geo-vocabulaire)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_cm1.json, category=cm1-vocabulaire-geometrique, questions=8
  - Calculer une aire `(cm1-geo-aire-rectangle)` — engine: `math-input`, type=aire-rectangle, max=12, questions=6
  - Calculer un volume `(cm1-geo-volume-pave)` — engine: `math-input`, type=volume-pave, max=6, questions=5
  - Figures et formules `(cm1-maths-geo-appariement)` — engine: `matching`, category=matching_math_cm1, dataFile=data/math_matching.json, questions=3
  - Classer les formes géométriques `(cm1-geo-classement-formes)` — engine: `board-interactive`, type=shape-classify, dataFile=data/board_shape_classify_cm1.json, category=cm1_shape_classify, questions=6
  - Défi : figures et formules `(cm1-bonus-geo-figures-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_cm1.json, category=cm1-perimetre-angles, questions=12, bonus (seuil=2)

#### Lire un graphique `(cm1-graphiques-subtheme)`

- **Leçons** (2) :
  - Lire un diagramme en barres `(cm1-lesson-lire-graphique)` — blocs: paragraph, example, bullets, tip, check, check
  - Calculer une moyenne `(cm1-lesson-moyenne)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (3) :
  - Lire un diagramme en barres `(cm1-graphique-lecture)` — engine: `math-input`, type=bar-chart-read, maxBars=4, maxValue=20, questions=6
  - Lire un tableau de données `(cm1-donnees-tableaux)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle3.json, category=cm1-donnees-tableaux, questions=6
  - Défi : graphiques en rafale `(cm1-bonus-graphique-expert)` — engine: `math-input`, type=bar-chart-read, maxBars=5, maxValue=25, questions=8, bonus (seuil=2)

### Français (cm1-francais-subject)

#### Homophones `(cm1-francais-homophones)`

- **Leçons** (2) :
  - Reconnaître un homophone `(cm1-lesson-homophones-strategie)` — blocs: paragraph, example, bullets, tip, check, check
  - A ou à ? `(cm1-lesson-homophones-a-a)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (6) :
  - Ce ou Se ? `(cm1-h-ce)` — engine: `choice-engine`, type=homophone-duel, category=ce_se, questions=10
  - Ces ou Ses ? `(cm1-h-ces)` — engine: `choice-engine`, type=homophone-duel, category=ces_ses, questions=10
  - A ou À ? `(cm1-h-aa)` — engine: `choice-engine`, type=homophone-duel, category=a_à, questions=10
  - Son ou Sont ? `(cm1-h-son)` — engine: `choice-engine`, type=homophone-duel, category=son_sont, questions=10
  - On ou Ont ? `(cm1-h-on)` — engine: `choice-engine`, type=homophone-duel, category=on_ont, questions=10
  - Défi : tous les homophones `(cm1-bonus-homophones-mix)` — engine: `choice-engine`, type=homophone-duel, category=on_ont, questions=16, bonus (seuil=2)

#### Conjugaison `(cm1-francais-conjugaison)`

- **Leçons** (5) :
  - L'imparfait des verbes en -ER `(cm1-lesson-imparfait-er)` — blocs: paragraph, example, bullets, tip, check, check
  - Choisir avoir ou être `(cm1-lesson-passe-compose-auxiliaires)` — blocs: paragraph, example, mini-table, tip, check, check
  - Le passé simple, le temps du récit `(cm1-lesson-passe-simple-recit)` — blocs: paragraph, example, bullets, tip, check, check
  - Le présent des verbes du 3e groupe `(cm1-lesson-present-3e-groupe)` — blocs: paragraph, example, mini-table, tip, check, check
  - Le futur simple `(cm1-lesson-futur-simple)` — blocs: paragraph, example, mini-table, tip, check, check
- **Exercices** (14) :
  - L'Imparfait `(cm1-c-imp)` — engine: `conjugation`, category=imparfait_1, tenses=imparfait, questions=10
  - Passé Composé (1) `(cm1-c-pc-avoir)` — engine: `conjugation`, category=pc_1, tenses=passé composé, questions=5
  - Passé Composé (2) `(cm1-c-pc-etre)` — engine: `conjugation`, category=pc_1, tenses=passé composé, questions=5
  - Passé Composé (Mix) `(cm1-c-pc-mix)` — engine: `conjugation`, category=pc_1, tenses=passé composé, questions=10
  - Passé Composé (Expert) `(cm1-c-pc-3)` — engine: `conjugation`, category=pc_3_cm1, tenses=passé composé, questions=10
  - Le 2ème groupe `(cm1-conj-ir)` — engine: `conjugation`, category=present_2, tenses=présent, questions=8
  - Présent : 3e groupe `(cm1-conj-present-3g)` — engine: `conjugation`, category=present_3_freq, tenses=présent, questions=10
  - Le futur simple `(cm1-c-futur)` — engine: `conjugation`, category=future_1, tenses=futur, questions=10
  - Futur : 2e groupe `(cm1-c-futur-2g)` — engine: `conjugation`, category=future_2, tenses=futur, questions=8
  - Futur : 3e groupe `(cm1-c-futur-3g)` — engine: `conjugation`, category=future_3_freq, tenses=futur, questions=10
  - Être et avoir à l'imparfait `(cm1-c-ea-imp)` — engine: `conjugation`, category=etre_avoir_imp, tenses=imparfait, questions=8
  - Passé Composé avec être `(cm1-c-pc-3-etre)` — engine: `conjugation`, category=pc_3_freq, tenses=passé composé, questions=8
  - Défi : passé composé expert `(cm1-bonus-conjugaison-passe-compose)` — engine: `conjugation`, category=pc_3_cm1, tenses=passé composé, questions=14, bonus (seuil=2)
  - Reconnaître le passé simple `(cm1-conj-passe-simple-reco)` — engine: `choice-engine`, type=word-class-choice, category=passe_simple_recognition_cm1, questions=6

#### Articles et genre `(cm1-francais-articles)`

- **Leçons** (1) :
  - Choisir le bon article `(cm1-lesson-articles-genre)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (2) :
  - Un ou Une ? `(cm1-g-un-une)` — engine: `choice-engine`, type=gender-articles, category=gender_cm1_scolaire, questions=8
  - Le, La ou L' ? `(cm1-g-le-la)` — engine: `choice-engine`, type=gender-articles, category=gender_cm1_elision, questions=8

#### Grammaire `(cm1-francais-grammaire)`

- **Leçons** (3) :
  - Reconnaître la nature d'un mot `(cm1-lesson-nature-mots)` — blocs: paragraph, example, mini-table, tip, check, check
  - Les familles de mots `(cm1-lesson-familles-mots)` — blocs: paragraph, example, bullets, tip, check, check
  - Les connecteurs pour bien écrire `(cm1-lesson-connecteurs)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (12) :
  - Le bon article `(cm1-g-article-qcm)` — engine: `choice-engine`, type=article-choice, category=article_choice_cm1, questions=8
  - Le bon déterminant `(cm1-g-pluriel-qcm)` — engine: `choice-engine`, type=plural-choice, category=plural_choice_cm1, questions=8
  - Nom, verbe ou adjectif `(cm1-g-nature-qcm)` — engine: `choice-engine`, type=word-class-choice, category=word_class_choice_cm1, questions=8
  - Sujet, verbe ou complément `(cm1-g-fonction-qcm)` — engine: `choice-engine`, type=word-class-choice, category=sentence_function_choice_cm1, questions=6
  - Déterminant dans la phrase `(cm1-g-cloze-det)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_cloze_cm1, questions=8
  - Écris le bon mot `(cm1-g-cloze-ecrit)` — engine: `cloze-fill-in`, category=grammar_cloze_cm1, questions=6
  - Accorder dans la phrase `(cm1-g-cloze-accord)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_agreement_cm1, questions=8
  - Ordre des mots `(cm1-francais-ordre-mots)` — engine: `word-order`, category=word_order_cm1, dataFile=data/french_word_order.json, questions=5
  - Structurer un récit ou une lettre `(cm1-francais-structure-recit)` — engine: `word-order`, category=story_order_cm1, dataFile=data/french_word_order.json, questions=4
  - Défi : accords sans filet `(cm1-bonus-grammaire-accords)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_agreement_cm1, questions=14, bonus (seuil=2)
  - Les connecteurs `(cm1-redaction-connecteurs)` — engine: `choice-engine`, type=grammar-cloze, category=redaction_connecteurs_cm1, questions=8
  - La meilleure phrase `(cm1-redaction-meilleure-phrase)` — engine: `choice-engine`, type=word-class-choice, category=redaction_phrase_cm1, questions=6

#### Lecture et vocabulaire `(cm1-francais-lecture-vocabulaire-subtheme)`

- **Leçons** (4) :
  - Comprendre un paragraphe `(cm1-lesson-comprendre-paragraphe)` — blocs: paragraph, example, bullets, tip, check, check
  - La famille de mots `(cm1-lesson-vocabulaire-famille-mots)` — blocs: paragraph, example, bullets, tip, check, check
  - Comprendre un mot par le contexte `(cm1-lesson-vocabulaire-sens-contexte)` — blocs: paragraph, example, bullets, tip, check, check
  - Mots polysémiques et familles de mots `(cm1-lesson-polysemie-familles)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (12) :
  - Trouver l'idée principale `(cm1-lecture-idee-principale)` — engine: `reading`, category=cm1_lecture_idee_principale, questions=5
  - Comprendre un mot par le contexte `(cm1-vocabulaire-contexte)` — engine: `reading`, category=cm1_lecture_mot_contexte, questions=5
  - Un mot, plusieurs sens `(cm1-vocabulaire-polysemie)` — engine: `reading`, category=cm1_vocabulaire_polysemie, questions=6
  - Les familles de mots `(cm1-vocabulaire-familles-mots)` — engine: `reading`, category=cm1_vocabulaire_familles_mots, questions=6
  - Familles de mots `(cm1-vocab-appariement)` — engine: `matching`, category=matching_familles_mots_cm1, dataFile=data/french/matching.json, questions=2
  - Champ lexical et familles de mots `(cm1-vocab-appariement-champ-lexical)` — engine: `matching`, category=matching_vocabulaire_cm1, dataFile=data/french/matching.json, questions=2
  - Lire entre les lignes `(cm1-lecture-inferences)` — engine: `reading`, category=cm1_lecture_inferences, questions=6
  - Expressions imagées `(cm1-lecture-expression-imagee)` — engine: `reading`, category=cm1_lecture_expression_imagee, questions=6
  - Fait ou opinion ? `(cm1-lecture-fait-opinion)` — engine: `reading`, category=cm1_lecture_fait_opinion, questions=6
  - Lire entre les lignes `(cm1-lecture-recit-long)` — engine: `reading`, category=cm1_lecture_recit_long, questions=5
  - Comprendre un documentaire `(cm1-lecture-documentaire-long)` — engine: `reading`, category=cm1_lecture_documentaire_long, questions=5
  - Défi : sens et contexte `(cm1-bonus-vocabulaire-polysemie)` — engine: `reading`, category=cm1_vocabulaire_polysemie, questions=10, bonus (seuil=2)

#### Dictée audio `(cm1-dictee-audio-subtheme)`

- **Leçons** (1) :
  - La dictée, un exercice de vigilance `(cm1-lesson-dictee-vigilance)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (5) :
  - Animaux du monde `(cm1-audio-animaux-avances)` — engine: `audio-spelling`, category=animals_advanced, speechRate=0.85, questions=8
  - Transports `(cm1-audio-transports-avances)` — engine: `audio-spelling`, category=transport_advanced, speechRate=0.85, questions=8
  - Mots pièges `(cm1-audio-homophones)` — engine: `audio-spelling`, category=cm1_orthographe_homophones, speechRate=0.85, questions=8
  - Nature et sciences `(cm1-audio-nature-sciences)` — engine: `audio-spelling`, category=cm1_nature_sciences, speechRate=0.85, questions=8
  - Défi : dictée à vitesse réelle `(cm1-bonus-dictee-vitesse-reelle)` — engine: `audio-spelling`, category=cm1_orthographe_homophones, speechRate=1, questions=10, bonus (seuil=2)

### Histoire (cm1-histoire-subject)

#### Grandes périodes `(cm1-histoire-periodes)`

- **Leçons** (5) :
  - La Préhistoire `(cm1-lesson-prehistoire)` — blocs: paragraph, example, bullets, tip
  - Antiquité, Moyen Âge, Temps modernes `(cm1-lesson-periodes)` — blocs: paragraph, bullets, example, tip
  - La vie au Moyen Âge `(cm1-lesson-vie-moyen-age)` — blocs: paragraph, example, bullets, tip
  - La Gaule romaine `(cm1-lesson-gaule-romaine)` — blocs: paragraph, example, bullets, tip
  - La société féodale `(cm1-lesson-vivre-moyen-age)` — blocs: paragraph, example, bullets, tip
- **Exercices** (8) :
  - Préhistoire `(cm1-histoire-prehistoire)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm1.json, category=cm1-prehistoire, questions=8
  - Antiquité `(cm1-histoire-antiquite)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm1.json, category=cm1-antiquite, questions=8
  - Moyen Âge `(cm1-histoire-moyen-age)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm1.json, category=cm1-moyen-age, questions=8
  - Temps modernes `(cm1-histoire-temps-modernes)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm1.json, category=cm1-temps-modernes, questions=6
  - Renaissance et inventions `(cm1-histoire-renaissance-inventions)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm1.json, category=cm1-renaissance-inventions, questions=6
  - Humanisme et imprimerie `(cm1-histoire-humanisme-imprimerie)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm1.json, category=cm1-humanisme-imprimerie, questions=6
  - Périodes et civilisations `(cm1-histoire-appariement)` — engine: `matching`, category=matching_histoire_cm1, dataFile=data/history_matching.json, questions=2
  - Défi : le Moyen Âge `(cm1-bonus-histoire-toutes-periodes)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm1.json, category=cm1-moyen-age, questions=12, bonus (seuil=2)

#### Frises historiques `(cm1-histoire-frises)`

- **Leçons** (1) :
  - Le temps des rois `(cm1-lesson-frise)` — blocs: paragraph, example, bullets, tip
- **Exercices** (11) :
  - Frise historique `(cm1-histoire-frise-ordre)` — engine: `timeline`, mode=order, grade=cm1, dataFile=data/history_chrono.json, timelineId=cm1-reperes-celebres, questions=5
  - Placer sur la frise `(cm1-histoire-frise-place)` — engine: `timeline`, mode=place, grade=cm1, dataFile=data/history_chrono.json, timelineId=cm1-place-moyen-age, questions=5
  - Placer sur la frise - Niv 1 `(cm1-histoire-frise-place-n1)` — engine: `timeline`, mode=place, grade=cm1, dataFile=data/history_chrono.json, timelineId=cm1-place-moyen-age, difficulty=1, questions=5
  - Placer sur la frise - Niv 2 `(cm1-histoire-frise-place-n2)` — engine: `timeline`, mode=place, grade=cm1, dataFile=data/history_chrono.json, timelineId=cm1-place-moyen-age, difficulty=2, questions=5
  - Placer sur la frise - Niv 3 `(cm1-histoire-frise-place-n3)` — engine: `timeline`, mode=place, grade=cm1, dataFile=data/history_chrono.json, timelineId=cm1-place-moyen-age, difficulty=3, questions=5
  - Frise : Préhistoire `(cm1-histoire-frise-prehistoire-ordre)` — engine: `timeline`, mode=order, grade=cm1, dataFile=data/history_chrono.json, timelineId=cm1-ordre-prehistoire-1, questions=5
  - Frise : Antiquité `(cm1-histoire-frise-antiquite-ordre)` — engine: `timeline`, mode=order, grade=cm1, dataFile=data/history_chrono.json, timelineId=cm1-antiquite-ordre-1, questions=5
  - Frise : Temps modernes `(cm1-histoire-frise-modernes-ordre)` — engine: `timeline`, mode=order, grade=cm1, dataFile=data/history_chrono.json, timelineId=cm1-ordre-modernes-2, questions=5
  - Placer : Antiquité `(cm1-histoire-frise-antiquite-place)` — engine: `timeline`, mode=place, grade=cm1, dataFile=data/history_chrono.json, timelineId=cm1-place-antiquite, questions=5
  - Placer : Temps modernes `(cm1-histoire-frise-modernes-place)` — engine: `timeline`, mode=place, grade=cm1, dataFile=data/history_chrono.json, timelineId=cm1-place-modernes, questions=5
  - Défi : frise du Moyen Âge `(cm1-bonus-frise-moyen-age-expert)` — engine: `timeline`, mode=place, grade=cm1, dataFile=data/history_chrono.json, timelineId=cm1-place-moyen-age, difficulty=3, questions=8, bonus (seuil=2)

### Géographie (cm1-geographie-subject)

#### Reliefs et fleuves `(cm1-geo-relief-subtheme)`

- **Leçons** (2) :
  - Observer un paysage `(cm1-lesson-relief-paysage)` — blocs: paragraph, example, bullets, tip
  - Les paysages de France `(cm1-lesson-paysages-france)` — blocs: paragraph, example, mini-table, tip
- **Exercices** (5) :
  - Reliefs et fleuves `(cm1-geo-relief)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm1.json, category=cm1-france-relief, questions=8
  - Fleuves et reliefs de France `(cm1-geo-fleuves-reliefs-france)` — engine: `choice-engine`, type=factual-qcm, questions=10, dataFile=data/geography_cm1.json, category=cm1-france-relief
  - Eaux et paysages `(cm1-geo-eaux-paysages)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/geography_cm1.json, category=cm1-eaux-paysages
  - Reliefs et régions `(cm1-geo-appariement)` — engine: `matching`, category=matching_geo_cm1, dataFile=data/geography_matching.json, questions=2
  - Défi : reliefs et fleuves `(cm1-bonus-geo-relief-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm1.json, category=cm1-eaux-paysages, questions=12, bonus (seuil=2)

#### Territoires `(cm1-geo-territoires-subtheme)`

- **Leçons** (3) :
  - Repérer un territoire `(cm1-lesson-territoires)` — blocs: paragraph, example, bullets, tip
  - Lire une carte de France `(cm1-lesson-carte-legende)` — blocs: paragraph, example, bullets, tip
  - Les régions de France `(cm1-lesson-regions-france)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Territoires `(cm1-geo-territoires)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm1.json, category=cm1-france-regions, questions=8
  - Types de territoires `(cm1-geo-types-territoires)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm1.json, category=cm1-types-territoires, questions=6
  - Défi : types de territoires `(cm1-bonus-geo-territoires-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm1.json, category=cm1-types-territoires, questions=10, bonus (seuil=2)
  - Territoires et caractéristiques `(cm1-geo-territoires-appariement)` — engine: `matching`, category=matching_geo_cm1, dataFile=data/geography_matching.json, questions=1
  - Carte des régions `(cm1-geo-carte-regions)` — engine: `board-interactive`, type=map-locate, dataFile=data/board_map_locate_cm1.json, mapFile=data/maps/france-regions.svg, mapId=france-regions, category=cm1_map_regions_france, questions=6

#### Se déplacer `(cm1-geo-deplacements-subtheme)`

- **Leçons** (2) :
  - Se déplacer en France `(cm1-lesson-deplacements)` — blocs: paragraph, example, bullets, tip
  - Se déplacer en France `(cm1-lesson-mobilites-france)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Se déplacer `(cm1-geo-deplacements)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm1.json, category=cm1-se-deplacer, questions=6
  - Défi : se déplacer `(cm1-bonus-geo-deplacements-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm1.json, category=cm1-se-deplacer, questions=10, bonus (seuil=2)
  - Mobilités en France `(cm1-geo-mobilites-france)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm1.json, category=cm1-mobilites-france, questions=6
  - Moyens de transport et usages `(cm1-geo-deplacements-appariement)` — engine: `matching`, category=matching_geo_cm1, dataFile=data/geography_matching.json, questions=1

#### Se situer dans le monde `(cm1-geo-europe-subtheme)`

- **Leçons** (1) :
  - La France en Europe `(cm1-lesson-france-europe)` — blocs: paragraph, example, bullets, tip
- **Exercices** (15) :
  - La France en Europe `(cm1-geo-france-europe)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm1.json, category=cm1-europe-monde, questions=6
  - Se situer dans le monde `(cm1-geo-se-situer-monde)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm1.json, category=cm1-europe-monde, questions=6
  - Carte du monde `(cm1-geo-carte-continents)` — engine: `board-interactive`, type=map-locate, dataFile=data/board_map_locate_world.json, mapFile=data/maps/world-continents.svg, mapId=world-continents, category=cm1_map_continents_monde, questions=6
  - Carte de l'Europe `(cm1-geo-carte-europe-pays)` — engine: `board-interactive`, type=map-locate, dataFile=data/board_map_locate_europe.json, mapFile=data/maps/europe-countries.svg, mapId=europe-countries, category=cm1_map_pays_europe, questions=8
  - Carte de l'Asie `(cm1-geo-carte-asie-pays)` — engine: `board-interactive`, type=map-locate, dataFile=data/board_map_locate_asia.json, mapFile=data/maps/asia-countries.svg, mapId=asia-countries, category=cm1_map_pays_asie, questions=8
  - Reliefs, territoires et transports `(cm1-geo-europe-appariement)` — engine: `matching`, category=matching_geo_cm1, dataFile=data/geography_matching.json, questions=2
  - Carte de l'Afrique `(cm1-geo-carte-afrique-pays)` — engine: `board-interactive`, type=map-locate, dataFile=data/board_map_locate_africa.json, mapFile=data/maps/africa-countries.svg, mapId=africa-countries, category=cm1_map_pays_afrique, questions=8
  - Carte de l'Amérique du Nord `(cm1-geo-carte-amerique-nord-pays)` — engine: `board-interactive`, type=map-locate, dataFile=data/board_map_locate_north_america.json, mapFile=data/maps/north-america-countries.svg, mapId=north-america-countries, category=cm1_map_pays_amerique_nord, questions=6
  - Carte de l'Amérique du Sud `(cm1-geo-carte-amerique-sud-pays)` — engine: `board-interactive`, type=map-locate, dataFile=data/board_map_locate_south_america.json, mapFile=data/maps/south-america-countries.svg, mapId=south-america-countries, category=cm1_map_pays_amerique_sud, questions=6
  - Capitales d'Europe `(cm1-geo-capitales-europe)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_capitals_cm1.json, category=cm1-capitales-europe, questions=8
  - Capitales d'Afrique `(cm1-geo-capitales-afrique)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_capitals_cm1.json, category=cm1-capitales-afrique, questions=8
  - Capitales d'Asie `(cm1-geo-capitales-asie)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_capitals_cm1.json, category=cm1-capitales-asie, questions=8
  - Capitales d'Amérique du Nord `(cm1-geo-capitales-amerique-nord)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_capitals_cm1.json, category=cm1-capitales-amerique-nord, questions=6
  - Capitales d'Amérique du Sud `(cm1-geo-capitales-amerique-sud)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_capitals_cm1.json, category=cm1-capitales-amerique-sud, questions=6
  - Défi : carte du monde `(cm1-bonus-geo-carte-monde-expert)` — engine: `board-interactive`, type=map-locate, dataFile=data/board_map_locate_world.json, mapFile=data/maps/world-continents.svg, mapId=world-continents, category=cm1_map_continents_monde, questions=12, bonus (seuil=2)

### Sciences (cm1-sciences-subject)

#### Le vivant `(cm1-sciences-vivant-subtheme)`

- **Leçons** (3) :
  - Classer le vivant `(cm1-lesson-vivant)` — blocs: paragraph, example, bullets, tip, check, check
  - Vivant ou non-vivant ? `(cm1-lesson-vivant-non-vivant)` — blocs: paragraph, example, bullets, tip, check, check
  - La chaîne alimentaire `(cm1-lesson-chaine-alimentaire)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (4) :
  - Le vivant `(cm1-sciences-vivant)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-vivant, questions=8
  - Classer le vivant `(cm1-sciences-classer-vivant)` — engine: `choice-engine`, type=factual-qcm, questions=10, dataFile=data/science_cm1.json, category=cm1-vivant
  - Écosystèmes et adaptation `(cm1-sciences-ecosystemes)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-vivant, questions=10
  - Défi : le vivant `(cm1-bonus-sciences-vivant-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-vivant, questions=12, bonus (seuil=2)

#### Matière et énergie `(cm1-sciences-matiere-subtheme)`

- **Leçons** (1) :
  - Matière et énergie `(cm1-lesson-matiere-energie)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (9) :
  - Matière et énergie `(cm1-sciences-matiere)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-matiere-energie, questions=8
  - Sources d'énergie `(cm1-sciences-sources-energie)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-sources-energie, questions=6
  - Solide, liquide ou gaz ? `(cm1-sciences-tap-etats-matiere)` — engine: `board-interactive`, type=tap-features, dataFile=data/board_tap_features_science.json, category=cm1_tap_etats_matiere, questions=3
  - Transformations simples `(cm1-sciences-transformations)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-transformations-simples, questions=6
  - Énergie au quotidien `(cm1-sciences-energie-quotidien)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-energie-quotidien, questions=6
  - L'eau au quotidien `(cm1-sciences-eau-quotidien)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-eau-quotidien, questions=6
  - Objets et mesures `(cm1-sciences-objets-mesures)` — engine: `choice-engine`, type=factual-qcm, questions=6, dataFile=data/science_cm1.json, category=cm1-objets-mesures
  - Énergies et organes `(cm1-sciences-appariement)` — engine: `matching`, category=matching_sciences_cm1, dataFile=data/science_matching.json, questions=2
  - Défi : matière et énergie `(cm1-bonus-sciences-matiere-energie)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-transformations-simples, questions=12, bonus (seuil=2)

#### Corps et hygiène `(cm1-sciences-corps-subtheme)`

- **Leçons** (2) :
  - Prendre soin de son corps `(cm1-lesson-corps-hygiene)` — blocs: paragraph, example, bullets, tip, check, check
  - Les cinq sens `(cm1-lesson-cinq-sens)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (5) :
  - Corps et hygiène `(cm1-sciences-corps)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-corps-hygiene, questions=6
  - Hygiène et santé `(cm1-sciences-hygiene-sante)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/science_cm1.json, category=cm1-corps-hygiene
  - Alimentation et corps `(cm1-sciences-alimentation-corps)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/science_cm1.json, category=cm1-alimentation-corps
  - Organes et fonctions du corps `(cm1-sciences-corps-appariement)` — engine: `matching`, category=matching_sciences_cm1, dataFile=data/science_matching.json, questions=2
  - Défi : corps et hygiène `(cm1-bonus-sciences-corps-hygiene)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-alimentation-corps, questions=12, bonus (seuil=2)

#### Électricité `(cm1-sciences-electricite-subtheme)`

- **Leçons** (2) :
  - Le circuit électrique simple `(cm1-lesson-circuit-simple)` — blocs: paragraph, example, bullets, tip, check, check
  - La sécurité électrique de base `(cm1-lesson-securite-electrique-base)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (4) :
  - Le circuit électrique `(cm1-sciences-circuit-electrique)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-electricite-base, questions=6
  - Piles et appareils `(cm1-sciences-piles-appareils)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-electricite-base, questions=6
  - Sécurité électrique `(cm1-sciences-securite-electrique)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-electricite-base, questions=6
  - Défi : électricité et sécurité `(cm1-bonus-sciences-electricite-base)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-electricite-base, questions=10, bonus (seuil=2)

#### Environnement `(cm1-sciences-environnement-subtheme)`

- **Leçons** (2) :
  - Les déchets et le tri simple `(cm1-lesson-tri-dechets-simple)` — blocs: paragraph, example, bullets, tip, check, check
  - Des gestes simples pour la nature `(cm1-lesson-gestes-environnement-simples)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (4) :
  - Trier ses déchets `(cm1-sciences-trier-dechets)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-environnement-gestes, questions=6
  - Économiser les ressources `(cm1-sciences-economiser-ressources)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-environnement-gestes, questions=6
  - Protéger la nature `(cm1-sciences-proteger-nature)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-environnement-gestes, questions=6
  - Défi : gestes pour l'environnement `(cm1-bonus-sciences-environnement-gestes)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-environnement-gestes, questions=10, bonus (seuil=2)

#### Objets techniques `(cm1-sciences-techno-subtheme)`

- **Leçons** (2) :
  - Les machines simples `(cm1-lesson-objets-techniques)` — blocs: paragraph, example, tip, check, check
  - Les objets techniques `(cm1-lesson-objets-techniques-fonction)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (4) :
  - Machines simples `(cm1-sciences-techno-objets)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-techno-objets, questions=8
  - Mécanismes en action `(cm1-sciences-techno-energie)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-techno-objets, questions=6
  - Les objets techniques `(cm1-sciences-techno-fonction)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-techno-fonction-usage, questions=8
  - Défi : machines et objets `(cm1-bonus-sciences-techno-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm1.json, category=cm1-techno-objets, questions=10, bonus (seuil=2)

### EMC (cm1-emc-subject)

#### Vivre ensemble `(cm1-emc-vivre-ensemble-subtheme)`

- **Leçons** (2) :
  - Vivre ensemble `(cm1-lesson-vivre-ensemble)` — blocs: paragraph, example, bullets, tip
  - Alerter et secourir `(cm1-lesson-alerte-secours)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Vivre ensemble `(cm1-emc-vivre-ensemble)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cm1.json, category=cm1-vivre-ensemble, questions=8
  - Respecter chacun `(cm1-emc-respecter-chacun)` — engine: `choice-engine`, type=factual-qcm, questions=10, dataFile=data/emc_cm1.json, category=cm1-vivre-ensemble
  - Défi : vivre ensemble `(cm1-bonus-emc-vivre-ensemble-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cm1.json, category=cm1-vivre-ensemble, questions=12, bonus (seuil=2)
  - Égalité et respect `(cm1-emc-egalite-respect)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cm1.json, category=cm1-egalite-respect, questions=6
  - Alerter et secourir `(cm1-emc-alerte-secours)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cm1.json, category=cm1-alerte-secours, questions=6
  - Défi : citoyens solidaires `(cm1-bonus-egalite-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cm1.json, category=cm1-egalite-respect, questions=8, bonus (seuil=2)

#### Droits et devoirs `(cm1-emc-droits-devoirs-subtheme)`

- **Leçons** (2) :
  - Droits et devoirs `(cm1-lesson-droits-devoirs)` — blocs: paragraph, example, bullets, tip
  - La laïcité à l'école `(cm1-lesson-laicite-ecole)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Droits et devoirs `(cm1-emc-droits-devoirs)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cm1.json, category=cm1-droits-devoirs, questions=8
  - Règles et justice `(cm1-emc-regles-justice)` — engine: `choice-engine`, type=factual-qcm, questions=10, dataFile=data/emc_cm1.json, category=cm1-droits-devoirs
  - Défi : droits et devoirs `(cm1-bonus-emc-droits-devoirs-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cm1.json, category=cm1-droits-devoirs, questions=12, bonus (seuil=2)
  - Droits, institutions et valeurs `(cm1-emc-appariement)` — engine: `matching`, category=matching_emc_cm1, dataFile=data/emc_matching.json, questions=3
  - Citoyenneté au quotidien `(cm1-emc-appariement-2)` — engine: `matching`, category=matching_emc_cm1, dataFile=data/emc_matching.json, questions=3

#### Citoyenneté `(cm1-emc-citoyennete-subtheme)`

- **Leçons** (3) :
  - Décider ensemble `(cm1-lesson-citoyennete)` — blocs: paragraph, example, bullets, tip
  - Les symboles de la République `(cm1-lesson-symboles-republique)` — blocs: paragraph, example, bullets, tip
  - La laïcité `(cm1-lesson-laicite-republique)` — blocs: paragraph, example, bullets, tip
- **Exercices** (6) :
  - Citoyenneté `(cm1-emc-citoyennete)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cm1.json, category=cm1-citoyennete, questions=6
  - Participer à la vie collective `(cm1-emc-vie-collective)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/emc_cm1.json, category=cm1-citoyennete
  - Débat et coopération `(cm1-emc-debat-cooperation)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/emc_cm1.json, category=cm1-debat-cooperation
  - Parole citoyenne `(cm1-emc-parole-citoyenne)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cm1.json, category=cm1-parole-citoyenne, questions=6
  - Engagement dans la classe `(cm1-emc-engagement-classe)` — engine: `choice-engine`, type=factual-qcm, questions=6, dataFile=data/emc_cm1.json, category=cm1-engagement-classe
  - Défi : citoyen engagé `(cm1-bonus-emc-citoyennete-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cm1.json, category=cm1-debat-cooperation, questions=12, bonus (seuil=2)

---

## CM2

### Mathématiques (cm2-maths-subject)

#### Nombres & calcul mental `(cm2-nombres-calcul-mental)`

- **Leçons** (1) :
  - Lire et écrire les grands nombres `(cm2-lesson-grands-nombres)` — blocs: paragraph, example, mini-table, tip, check, check
- **Exercices** (10) :
  - Les Milliards `(cm2_grands_nombres)` — engine: `math-input`, type=dictée-nombres, min=1000000, max=9999999999, questions=10
  - Division Mentale `(cm2_division_mentale)` — engine: `math-input`, type=calc-mental, operator=/, questions=10
  - Multiplier par 11 à 15 `(cm2_tables_x)` — engine: `math-input`, type=calc-mental, operator=x, questions=10
  - Multiplier par 16 à 20 `(cm2_tables_x_16_20)` — engine: `math-input`, type=calc-mental, operator=x, questions=10
  - Très grands nombres `(cm2_grands_nombres_2)` — engine: `math-input`, type=dictée-nombres, min=100000000, max=9999999999, questions=10
  - Décimaux (2) `(cm2-decimaux-compare-2)` — engine: `choice-engine`, type=compare-decimals, questions=12
  - Problèmes décimaux et fractions `(cm2-problemes-decimaux-fractions)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle3.json, category=cm2-problemes-decimaux-fractions, questions=8
  - Problèmes de pourcentages `(cm2-problemes-pourcentages)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle3.json, category=cm2-problemes-pourcentages, questions=8
  - Problèmes à étapes `(cm2-problemes-multi-etapes)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle3.json, category=cm2-problemes-multi-etapes, questions=8
  - Défi : multiplier par 21 à 25 `(cm2-bonus-tables-x-21-25)` — engine: `math-input`, type=calc-mental, operator=x, questions=10, bonus (seuil=2)

#### Fractions & décimaux `(cm2-fractions-decimaux)`

- **Leçons** (2) :
  - Comparer des décimaux `(cm2-lesson-decimaux-comparer)` — blocs: paragraph, example, bullets, tip, check, check
  - Fraction ou décimal ? `(cm2-lesson-fractions-decimaux-lien)` — blocs: paragraph, example, mini-table, tip, check, check
- **Exercices** (8) :
  - Décimaux `(cm2_decimaux_compare)` — engine: `choice-engine`, type=compare-decimals, questions=10
  - Fractions `(cm2_fractions_lecture)` — engine: `math-input`, type=fraction-view, maxDenom=12, questions=10
  - Construis la fraction `(cm2-frac-build)` — engine: `board-interactive`, type=fraction-build, minDenom=2, maxDenom=12, questions=8
  - Décimaux : positions `(cm2_decimaux_positions)` — engine: `math-input`, type=decimal-place, trap=true, questions=10
  - Décimaux : positions (2) `(cm2_decimaux_positions_2)` — engine: `math-input`, type=decimal-place, trap=false, questions=10
  - Fractions (2) `(cm2_fractions_lecture_2)` — engine: `math-input`, type=fraction-view, maxDenom=20, questions=10
  - Fractions et décimaux `(cm2-maths-fractions-appariement)` — engine: `matching`, category=matching_math_cm2, dataFile=data/math_matching.json, questions=3
  - Défi : fractions expertes `(cm2-bonus-fractions-expert)` — engine: `math-input`, type=fraction-view, maxDenom=24, questions=12, bonus (seuil=2)

#### Division posée `(cm2-division-posee-subtheme)`

- **Leçons** (2) :
  - Comprendre la division posée `(cm2-lesson-division-comprendre)` — blocs: paragraph, example, bullets, tip, check, check
  - Vérifier une division `(cm2-lesson-division-verifier)` — blocs: paragraph, mini-table, example, tip, check, check
- **Exercices** (5) :
  - Division posée `(cm2_division_posee)` — engine: `math-input`, type=division-posed, level=2, questions=6
  - Division posée : reste `(cm2_division_posee_reste)` — engine: `math-input`, type=division-posed, level=2, ask=reste, questions=6
  - Division mentale experte `(cm2_division_simple_expert)` — engine: `math-input`, type=division-simple, questions=10
  - Division avec reste `(cm2_division_reste_expert)` — engine: `math-input`, type=division-reste, questions=10
  - Défi : division posée experte `(cm2-bonus-division-posee-experte)` — engine: `math-input`, type=division-posed, level=3, questions=8, bonus (seuil=2)

#### Grandeurs & mesures `(cm2-grandeurs-mesures-subtheme)`

- **Leçons** (3) :
  - Convertir des durées `(cm2-lesson-conversions-temps)` — blocs: paragraph, example, mini-table, tip, check, check
  - Mesurer des longueurs `(cm2-lesson-mesures-longueurs)` — blocs: paragraph, mini-table, example, tip, check, check
  - Proportionnalité, échelle et vitesse `(cm2-lesson-proportionnalite-echelle)` — blocs: paragraph, example, mini-table, example, bullets, example, tip, check, check
- **Exercices** (17) :
  - Conversions de longueurs `(cm2-conversions-longueurs)` — engine: `conversion`, subtype=metric, questions=10
  - Heures et minutes `(cm2-heures-minutes)` — engine: `conversion`, subtype=time, memo=false, randomMinutes=true, questions=10
  - Minutes et secondes `(cm2-minutes-secondes)` — engine: `conversion`, subtype=time, modes=min_to_sec, memo=false, questions=10
  - Lire l'horloge `(cm2-lire-horloge)` — engine: `clock`, questions=8
  - Chiffres Romains `(cm2-romains-100)` — engine: `conversion`, subtype=roman, max=100, questions=6
  - Heures et minutes (aide) `(cm2-heures-minutes-aide)` — engine: `conversion`, questions=10, modes=h_to_min, memo=true, subtype=time
  - Minutes vers Secondes (2) `(cm2-heures-secondes)` — engine: `conversion`, subtype=time, modes=min_to_sec, memo=false, questions=10
  - Conversions de longueurs (2) `(cm2-conversions-longueurs-2)` — engine: `conversion`, subtype=metric, questions=12
  - Chiffres romains (3) `(cm2-romains-500)` — engine: `conversion`, subtype=roman, max=500, questions=6
  - Proportionnalité et échelle `(cm2-proportionnalite-echelle)` — engine: `math-input`, type=proportionnalite, maxCoef=8, maxBase=9, questions=4
  - Calculer un pourcentage `(cm2-pourcentages)` — engine: `math-input`, type=pourcentage, maxMultiple=10, questions=6
  - Lire une échelle de plan `(cm2-echelle-plan)` — engine: `math-input`, type=echelle, questions=4
  - Vitesse, distance, durée `(cm2-vitesse-1)` — engine: `math-input`, type=vitesse, maxHeures=5, questions=6
  - Défi : proportionnalité experte `(cm2-bonus-proportionnalite-expert)` — engine: `math-input`, type=pourcentage, maxMultiple=12, questions=8, bonus (seuil=2)
  - Convertir des masses `(cm2-conversions-masses)` — engine: `conversion`, subtype=metric, unitType=masse, questions=6
  - Convertir des contenances `(cm2-conversions-contenances)` — engine: `conversion`, subtype=metric, unitType=capacite, questions=6
  - Défi : chiffres romains jusqu'à M `(cm2-bonus-romains-1000)` — engine: `conversion`, subtype=roman, max=1000, questions=8, bonus (seuil=2)

#### Géométrie `(cm2-geometrie-subtheme)`

- **Leçons** (4) :
  - Droites et angles `(cm2-lesson-droites-angles)` — blocs: paragraph, example, bullets, tip, check, check
  - Polygones et cercle `(cm2-lesson-figures-cercle)` — blocs: paragraph, example, bullets, tip, check, check
  - La symétrie `(cm2-lesson-symetrie)` — blocs: paragraph, example, bullets, tip, check, check
  - Aires et volumes `(cm2-lesson-aires-volumes)` — blocs: paragraph, example, example, bullets, tip, check, check
- **Exercices** (15) :
  - Droites et angles `(cm2-geo-droites-angles)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_cm2.json, category=cm2-droites-angles, questions=8
  - Symétrie et figures `(cm2-geo-symetrie-figures)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_cm2.json, category=cm2-symetrie-figures, questions=8
  - Complète la figure symétrique `(cm2-geo-symetrie-pratique)` — engine: `board-interactive`, type=symmetry-complete, dataFile=data/board_symmetry_complete_cm2.json, category=cm2_symmetry_complete, questions=5
  - Construction géométrique `(cm2-geo-vocabulaire-construction)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_cm2.json, category=cm2-vocabulaire-construction, questions=8
  - Nature des angles `(cm2-geo-nature-angles)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_geometry_cm2.json, category=cm2-nature-angles, questions=8
  - Calculer une aire `(cm2-geo-aire-rectangle)` — engine: `math-input`, type=aire-rectangle, max=20, questions=6
  - Calculer un volume `(cm2-geo-volume-pave)` — engine: `math-input`, type=volume-pave, max=8, questions=5
  - Figures et propriétés `(cm2-maths-geo-appariement)` — engine: `matching`, category=matching_math_cm2, dataFile=data/math_matching.json, questions=3
  - Classer les formes géométriques `(cm2-geo-classement-formes)` — engine: `board-interactive`, type=shape-classify, dataFile=data/board_shape_classify_cm2.json, category=cm2_shape_classify, questions=6
  - Place le point `(cm2-geo-reperage-pratique)` — engine: `board-interactive`, type=point-on-grid, dataFile=data/board_geometry_cm2.json, category=cm2_point_quadrillage, questions=4
  - Droites parallèles `(cm2-geo-droites-paralleles-pratique)` — engine: `board-interactive`, type=tap-features, dataFile=data/board_geometry_cm2.json, category=cm2_droites_paralleles_tap, questions=3
  - Angles droits `(cm2-geo-angles-droits-pratique)` — engine: `board-interactive`, type=tap-features, dataFile=data/board_geometry_cm2.json, category=cm2_angles_droits_tap, questions=3
  - Droites perpendiculaires `(cm2-geo-perpendiculaires-pratique)` — engine: `board-interactive`, type=tap-features, dataFile=data/board_geometry_cm2.json, category=cm2_perpendiculaires_tap, questions=3
  - Mesurer un angle `(cm2-geo-angle-measure)` — engine: `board-interactive`, type=angle-measure, dataFile=data/board_angle_measure_cm2.json, category=cm2_angle_measure, questions=5
  - Défi : volumes experts `(cm2-bonus-volume-pave-expert)` — engine: `math-input`, type=volume-pave, max=15, questions=6, bonus (seuil=2)

#### Lire un graphique `(cm2-graphiques-subtheme)`

- **Leçons** (3) :
  - Lire un diagramme en barres `(cm2-lesson-lire-graphique)` — blocs: paragraph, example, bullets, tip, check, check
  - Lire un tableau et un diagramme circulaire `(cm2-lesson-lire-tableau-diagramme)` — blocs: paragraph, example, bullets, tip, check, check
  - La moyenne `(cm2-lesson-moyenne)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (7) :
  - Lire un diagramme en barres `(cm2-graphique-lecture)` — engine: `math-input`, type=bar-chart-read, maxBars=5, maxValue=30, questions=6
  - Lire un tableau de données `(cm2-donnees-tableaux)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle3.json, category=cm2-donnees-tableaux, questions=6
  - Lire un diagramme circulaire `(cm2-graphique-camembert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/math_word_problems_cycle3.json, category=cm2-problemes-pourcentages, questions=5
  - Défi : graphiques en rafale `(cm2-bonus-graphique-expert)` — engine: `math-input`, type=bar-chart-read, maxBars=5, maxValue=40, questions=8, bonus (seuil=2)
  - Lire un tableau à double entrée `(cm2-tableau-double-entree)` — engine: `math-input`, type=data-table-read, maxRows=4, maxCols=3, maxValue=20, questions=6
  - Lire un diagramme circulaire `(cm2-diagramme-circulaire)` — engine: `math-input`, type=pie-chart-read, questions=5
  - Calculer une moyenne `(cm2-calcul-moyenne)` — engine: `math-input`, type=average-compute, length=5, maxValue=20, questions=6

### Français (cm2-francais-subject)

#### Conjugaison `(cm2-francais-conjugaison)`

- **Leçons** (4) :
  - Former le passé composé `(cm2-lesson-passe-compose)` — blocs: paragraph, example, bullets, tip, check, check
  - Être et avoir à l'imparfait `(cm2-lesson-etre-avoir-imparfait)` — blocs: paragraph, example, mini-table, bullets, tip, check, check
  - Reconnaître le passé simple `(cm2-lesson-passe-simple)` — blocs: paragraph, example, bullets, tip, check, check
  - Conjuguer au passé simple `(cm2-lesson-passe-simple-conjuguer)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (11) :
  - Présent 3e Groupe `(cm2_conj_present_3)` — engine: `conjugation`, category=present_3_freq, tenses=présent, questions=10
  - Futur Simple `(cm2_conj_future)` — engine: `conjugation`, category=future_1, tenses=futur, questions=10
  - L'Imparfait `(cm2_conj_imparfait)` — engine: `conjugation`, category=imparfait_1, tenses=imparfait, questions=10
  - Passé Composé `(cm2_conj_pc)` — engine: `conjugation`, category=pc_1, tenses=passé composé, questions=10
  - Passé Composé du 3e groupe `(cm2_conj_pc_3)` — engine: `conjugation`, category=pc_3_cm2, tenses=passé composé, questions=10
  - Présent du 2e groupe `(cm2-conj-present-2g)` — engine: `conjugation`, category=present_2, tenses=présent, questions=10
  - Être et avoir à l'imparfait `(cm2-conj-ea-imp)` — engine: `conjugation`, category=etre_avoir_imp, tenses=imparfait, questions=8
  - Défi : passé composé expert `(cm2-bonus-conj-pc-3-expert)` — engine: `conjugation`, category=pc_3_cm2, tenses=passé composé, questions=14, bonus (seuil=2)
  - Reconnaître le passé simple `(cm2-conj-passe-simple-reco)` — engine: `choice-engine`, type=word-class-choice, category=passe_simple_recognition_cm2, questions=6
  - Le passé simple des verbes en -er `(cm2-conj-passe-simple-er)` — engine: `conjugation`, category=passe_simple_1, tenses=passé simple, questions=8
  - Le passé simple des verbes fréquents `(cm2-conj-passe-simple-3g)` — engine: `conjugation`, category=passe_simple_3_freq, tenses=passé simple, questions=8

#### Homophones `(cm2-francais-homophones)`

- **Leçons** (2) :
  - Choisir le bon homophone `(cm2-lesson-homophones-strategie)` — blocs: paragraph, example, bullets, tip, check, check
  - Tester un remplacement `(cm2-lesson-homophones-remplacement)` — blocs: paragraph, example, mini-table, tip, check, check
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

- **Leçons** (5) :
  - Accorder le groupe nominal `(cm2-lesson-accords-groupe-nominal)` — blocs: paragraph, example, mini-table, tip, check, check
  - Trouver le sujet et le verbe `(cm2-lesson-sujet-verbe)` — blocs: paragraph, example, bullets, tip, check, check
  - Comprendre le sens des mots `(cm2-lesson-sens-des-mots)` — blocs: paragraph, example, bullets, tip, check, check
  - Écrire des phrases riches et claires `(cm2-lesson-ecrire-phrases-riches)` — blocs: paragraph, example, bullets, tip, check, check
  - Nature et fonction d’un mot `(cm2-lesson-nature-fonction)` — blocs: paragraph, example, mini-table, tip, check, check
- **Exercices** (17) :
  - Un ou Une ? `(cm2_g_abstrait)` — engine: `choice-engine`, type=gender-articles, category=gender_cm2_abstrait, questions=8
  - Le, La ou L' ? `(cm2_g_elision)` — engine: `choice-engine`, type=gender-articles, category=gender_cm2_elision, questions=8
  - Le bon article `(cm2_g_article_qcm)` — engine: `choice-engine`, type=article-choice, category=article_choice_cm2, questions=8
  - Singulier ou pluriel ? `(cm2_g_pluriel_qcm)` — engine: `choice-engine`, type=plural-choice, category=plural_choice_cm2, questions=8
  - Nom, verbe ou adjectif `(cm2_g_nature_qcm)` — engine: `choice-engine`, type=word-class-choice, category=word_class_choice_cm2, questions=8
  - Sujet, verbe ou complément `(cm2_g_fonction_qcm)` — engine: `choice-engine`, type=word-class-choice, category=sentence_function_choice_cm2, questions=6
  - Nature et fonction des mots `(cm2-g-nature-fonction)` — engine: `choice-engine`, type=word-class-choice, category=nature_fonction_cm2, questions=8
  - Déterminant dans la phrase `(cm2_g_cloze_det)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_cloze_cm2, questions=8
  - Écris le bon mot `(cm2_g_cloze_ecrit)` — engine: `cloze-fill-in`, category=grammar_cloze_cm2, questions=6
  - Accorder dans la phrase `(cm2_g_cloze_accord)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_agreement_cm2, questions=8
  - Accorder le verbe avec son sujet `(cm2-g-accord-sujet-verbe)` — engine: `choice-engine`, type=grammar-cloze, category=accord_sujet_verbe_cm2, questions=8
  - Ordre des mots `(cm2-francais-ordre-mots)` — engine: `word-order`, category=word_order_cm2, dataFile=data/french_word_order.json, questions=5
  - Structurer un récit ou une lettre `(cm2-francais-structure-recit)` — engine: `word-order`, category=story_order_cm2, dataFile=data/french_word_order.json, questions=5
  - Accord du participe passé `(cm2-g-pp-accord)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_pp_accord_cm2, questions=8
  - Défi : accorder sans filet `(cm2-bonus-grammaire-cloze-accord)` — engine: `choice-engine`, type=grammar-cloze, category=grammar_agreement_cm2, questions=14, bonus (seuil=2)
  - Les connecteurs experts `(cm2-redaction-connecteurs)` — engine: `choice-engine`, type=grammar-cloze, category=redaction_connecteurs_cm2, questions=8
  - L'atelier d'écriture `(cm2-redaction-meilleure-phrase)` — engine: `choice-engine`, type=word-class-choice, category=redaction_phrase_cm2, questions=6

#### Lecture et vocabulaire `(cm2-francais-lecture-vocabulaire-subtheme)`

- **Leçons** (4) :
  - Trouver l'idée principale `(cm2-lesson-idee-principale)` — blocs: paragraph, example, bullets, tip, check, check
  - Employer un vocabulaire précis `(cm2-lesson-vocabulaire-precis)` — blocs: paragraph, example, bullets, tip, check, check
  - Sens propre et sens figuré `(cm2-lesson-sens-propre-figure)` — blocs: paragraph, example, bullets, tip, check, check
  - Polysémie et familles de mots avancées `(cm2-lesson-polysemie-familles-avance)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (9) :
  - Trouver l'idée principale `(cm2-lecture-idee-principale)` — engine: `reading`, category=cm2_lecture_idee_principale, questions=5
  - Choisir le sens du mot `(cm2-vocabulaire-sens)` — engine: `reading`, category=cm2_vocabulaire_sens, questions=5
  - Sens propre ou sens figuré ? `(cm2-sens-propre-figure)` — engine: `reading`, category=cm2_sens_propre_figure, questions=6
  - Un mot, plusieurs sens `(cm2-vocabulaire-polysemie)` — engine: `reading`, category=cm2_vocabulaire_polysemie, questions=6
  - Les familles de mots `(cm2-vocabulaire-familles-mots)` — engine: `reading`, category=cm2_vocabulaire_familles_mots, questions=6
  - Expressions et synonymes `(cm2-vocab-appariement)` — engine: `matching`, category=matching_expressions_cm2, dataFile=data/french/matching.json, questions=2
  - Comprendre un personnage `(cm2-lecture-inference-personnage)` — engine: `reading`, category=cm2_lecture_inference_personnage, questions=6
  - Connecteurs logiques `(cm2-lecture-connecteurs-logiques)` — engine: `reading`, category=cm2_lecture_connecteurs_logiques, questions=6
  - Défi : polysémie experte `(cm2-bonus-vocabulaire-polysemie-expert)` — engine: `reading`, category=cm2_vocabulaire_polysemie, questions=10, bonus (seuil=2)

#### Dictée audio `(cm2-dictee-audio-subtheme)`

- **Leçons** (1) :
  - Une dictée exigeante `(cm2-lesson-dictee-exigeante)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (5) :
  - Vocabulaire scolaire avancé `(cm2-audio-ecole-avancee)` — engine: `audio-spelling`, category=school_advanced, speechRate=0.9, questions=8
  - Vocabulaire de la maison `(cm2-audio-maison-avancee)` — engine: `audio-spelling`, category=house_advanced, speechRate=0.9, questions=8
  - Orthographe avancée `(cm2-audio-orthographe-avancee)` — engine: `audio-spelling`, category=cm2_orthographe_avancee, speechRate=0.9, questions=8
  - Vocabulaire citoyen `(cm2-audio-citoyennete)` — engine: `audio-spelling`, category=cm2_vocabulaire_citoyennete, speechRate=0.9, questions=8
  - Défi : dictée sans ralenti `(cm2-bonus-audio-orthographe-rapide)` — engine: `audio-spelling`, category=cm2_orthographe_avancee, speechRate=1, questions=10, bonus (seuil=2)

### Histoire (cm2-histoire-subject)

#### Repères historiques `(cm2-histoire-reperes)`

- **Leçons** (7) :
  - La Révolution française `(cm2-lesson-revolution-francaise)` — blocs: paragraph, example, bullets, tip
  - Le temps de la République `(cm2-lesson-temps-republique)` — blocs: paragraph, example, bullets, tip
  - La France et l'Union européenne `(cm2-lesson-france-europe)` — blocs: paragraph, example, bullets, tip
  - Le XXe siècle en France `(cm2-lesson-reperes-xxe-siecle)` — blocs: paragraph, bullets, example, tip
  - La Première Guerre mondiale (1914-1918) `(cm2-lesson-premiere-guerre-mondiale)` — blocs: paragraph, example, bullets, tip
  - La Seconde Guerre mondiale (1939-1945) `(cm2-lesson-seconde-guerre-mondiale)` — blocs: paragraph, example, bullets, tip
  - La décolonisation `(cm2-lesson-decolonisation)` — blocs: paragraph, example, bullets, tip
- **Exercices** (11) :
  - Révolution `(cm2-histoire-revolution)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm2.json, category=cm2-revolution, questions=8
  - XXe siècle `(cm2-histoire-xxe)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm2.json, category=cm2-xxe-siecle, questions=8
  - République `(cm2-histoire-republique)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm2.json, category=cm2-republique, questions=6
  - Symboles de la République `(cm2-histoire-symboles-republique)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm2.json, category=cm2-symboles-republique, questions=6
  - Vie démocratique `(cm2-histoire-vie-democratique)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm2.json, category=cm2-vie-democratique, questions=6
  - Dates et symboles `(cm2-histoire-appariement)` — engine: `matching`, category=matching_histoire_cm2, dataFile=data/history_matching.json, questions=2
  - Guerres mondiales : causes et enjeux `(cm2-histoire-guerres-narratif)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm2.json, category=cm2-guerres-narratif, questions=8
  - La décolonisation `(cm2-histoire-decolonisation)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm2.json, category=cm2-decolonisation, questions=8
  - La Première Guerre mondiale `(cm2-histoire-premiere-guerre)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm2.json, category=cm2-premiere-guerre-mondiale, questions=8
  - La Seconde Guerre mondiale `(cm2-histoire-seconde-guerre)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm2.json, category=cm2-seconde-guerre-mondiale, questions=8
  - Défi : XXe siècle expert `(cm2-bonus-histoire-xxe-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm2.json, category=cm2-xxe-siecle, questions=12, bonus (seuil=2)

#### Frises historiques `(cm2-histoire-frises)`

- **Leçons** (2) :
  - Quelques repères du XXe siècle `(cm2-lesson-reperes-xxe-siecle-frise)` — blocs: paragraph, bullets, example, tip
  - Les progrès techniques `(cm2-lesson-progres-techniques)` — blocs: paragraph, bullets, example, tip
- **Exercices** (11) :
  - Frise historique `(cm2-histoire-frise-ordre)` — engine: `timeline`, mode=order, grade=cm2, dataFile=data/history_chrono.json, timelineId=cm2-revolution-ordre, questions=5
  - Placer sur la frise `(cm2-histoire-frise-place)` — engine: `timeline`, mode=place, grade=cm2, dataFile=data/history_chrono.json, timelineId=cm2-place-xx, questions=5
  - Placer sur la frise - Niv 1 `(cm2-histoire-frise-place-n1)` — engine: `timeline`, mode=place, grade=cm2, dataFile=data/history_chrono.json, timelineId=cm2-place-xx, difficulty=1, questions=5
  - Placer sur la frise - Niv 2 `(cm2-histoire-frise-place-n2)` — engine: `timeline`, mode=place, grade=cm2, dataFile=data/history_chrono.json, timelineId=cm2-place-xx, difficulty=2, questions=5
  - Placer sur la frise - Niv 3 `(cm2-histoire-frise-place-n3)` — engine: `timeline`, mode=place, grade=cm2, dataFile=data/history_chrono.json, timelineId=cm2-place-xx, difficulty=3, questions=5
  - Frise : Révolution `(cm2-histoire-frise-revolution-ordre)` — engine: `timeline`, mode=order, grade=cm2, dataFile=data/history_chrono.json, timelineId=cm2-ordre-revolution-3, questions=5
  - Frise : XIXe siècle `(cm2-histoire-frise-xix-ordre)` — engine: `timeline`, mode=order, grade=cm2, dataFile=data/history_chrono.json, timelineId=cm2-xix-siecle-ordre, questions=5
  - Frise : Progrès techniques `(cm2-histoire-frise-progres-ordre)` — engine: `timeline`, mode=order, grade=cm2, dataFile=data/history_chrono.json, timelineId=cm2-sciences-societe-ordre, questions=5
  - Placer : République `(cm2-histoire-frise-republique-place)` — engine: `timeline`, mode=place, grade=cm2, dataFile=data/history_chrono.json, timelineId=cm2-place-republique, questions=5
  - Placer : Europe `(cm2-histoire-frise-europe-place)` — engine: `timeline`, mode=place, grade=cm2, dataFile=data/history_chrono.json, timelineId=cm2-place-europe, questions=5
  - Défi : Guerres et paix `(cm2-bonus-histoire-frise-guerres-paix)` — engine: `timeline`, mode=order, grade=cm2, dataFile=data/history_chrono.json, timelineId=cm2-guerres-paix-ordre, questions=7, bonus (seuil=2)

#### Récits historiques `(cm2-histoire-recits-subtheme)`

- **Leçons** (3) :
  - La Révolution française `(cm2-lesson-revolution-francaise-recit)` — blocs: paragraph, example, bullets, tip
  - La République s'installe `(cm2-lesson-republique-progres)` — blocs: paragraph, example, bullets, tip
  - Le XXe siècle en France `(cm2-lesson-xxe-siecle-changements)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Récits de la Révolution à la République `(cm2-histoire-recits-revolution-republique)` — engine: `choice-engine`, type=factual-qcm, category=cm2-recits-historiques, dataFile=data/history_cm2.json, questions=8
  - Défi : récits historiques `(cm2-bonus-histoire-recits-expert)` — engine: `choice-engine`, type=factual-qcm, category=cm2-recits-historiques, dataFile=data/history_cm2.json, questions=8, bonus (seuil=2)
  - La Revolution francaise `(cm2-histoire-recits-revolution)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm2.json, category=cm2-revolution, questions=8
  - Le XXe siecle `(cm2-histoire-xxe-siecle)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm2.json, category=cm2-xxe-siecle, questions=8
  - Defi : grands recits de l'histoire `(cm2-bonus-histoire-recits-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/history_cm2.json, category=cm2-recits-historiques, questions=10, bonus (seuil=2)

### Géographie (cm2-geographie-subject)

#### France et Europe `(cm2-geo-europe-subtheme)`

- **Leçons** (2) :
  - Habiter des espaces différents `(cm2-lesson-habiter-espaces-differents)` — blocs: paragraph, example, bullets, tip
  - La France dans l'Union européenne `(cm2-lesson-france-union-europeenne)` — blocs: paragraph, example, bullets, tip
- **Exercices** (8) :
  - France et Europe `(cm2-geo-europe)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm2.json, category=cm2-france-europe, questions=8
  - Europe proche `(cm2-geo-europe-proche)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm2.json, category=cm2-europe-proche, questions=6
  - Union européenne `(cm2-geo-union-europeenne)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm2.json, category=cm2-union-europeenne, questions=6
  - Voyager en Europe `(cm2-geo-voyager-europe)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm2.json, category=cm2-voyager-europe, questions=6
  - Pays et capitales `(cm2-geo-appariement)` — engine: `matching`, category=matching_geo_cm2, dataFile=data/geography_matching.json, questions=2
  - Carte de l'Europe `(cm2-geo-carte-europe-pays)` — engine: `board-interactive`, type=map-locate, dataFile=data/board_map_locate_europe.json, mapFile=data/maps/europe-countries.svg, mapId=europe-countries, category=cm1_map_pays_europe, questions=8
  - Capitales d'Europe `(cm2-geo-capitales-europe)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_capitals_cm1.json, category=cm1-capitales-europe, questions=8
  - Défi : situer l'Europe dans le monde `(cm2-bonus-geo-carte-monde-continents)` — engine: `board-interactive`, type=map-locate, dataFile=data/board_map_locate_world.json, mapFile=data/maps/world-continents.svg, mapId=world-continents, category=cm1_map_continents_monde, questions=8, bonus (seuil=2)

#### Habiter `(cm2-geo-habiter-subtheme)`

- **Leçons** (4) :
  - Échanger et circuler dans le monde `(cm2-lesson-mondialisation-echanges)` — blocs: paragraph, example, bullets, tip
  - Les grands territoires français `(cm2-lesson-territoires-france)` — blocs: paragraph, example, bullets, tip
  - Vivre à la campagne `(cm2-lesson-vivre-campagne)` — blocs: paragraph, example, bullets, tip
  - Vivre sur le littoral ou à la montagne `(cm2-lesson-littoral-montagne)` — blocs: paragraph, example, mini-table, tip
- **Exercices** (8) :
  - Habiter `(cm2-geo-habiter)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm2.json, category=cm2-habiter, questions=8
  - Habiter différents espaces `(cm2-geo-habiter-espaces)` — engine: `choice-engine`, type=factual-qcm, questions=10, dataFile=data/geography_cm2.json, category=cm2-habiter
  - Espaces littoraux `(cm2-geo-espaces-littoraux)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm2.json, category=cm2-espaces-littoraux, questions=8
  - Espaces montagnards `(cm2-geo-espaces-montagnards)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm2.json, category=cm2-espaces-montagnards, questions=8
  - Espaces ruraux `(cm2-geo-espaces-ruraux)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm2.json, category=cm2-espaces-ruraux, questions=8
  - Défi : habiter `(cm2-bonus-geo-habiter-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm2.json, category=cm2-habiter, questions=7, bonus (seuil=2)
  - Les grandes villes de France `(cm2-geo-villes-france)` — engine: `board-interactive`, type=tap-features, dataFile=data/board_geography_cm2.json, category=cm2_villes_france_tap, questions=5
  - Villes sur le quadrillage `(cm2-geo-reperes-villes)` — engine: `board-interactive`, type=point-on-grid, dataFile=data/board_geography_cm2.json, category=cm2_reperes_france_grille, questions=5

#### Échanges `(cm2-geo-mondialisation-subtheme)`

- **Leçons** (2) :
  - Les acteurs de la mondialisation `(cm2-lesson-acteurs-mondialisation)` — blocs: paragraph, example, bullets, tip
  - Le coût environnemental des échanges `(cm2-lesson-developpement-durable-echanges)` — blocs: paragraph, example, bullets, tip
- **Exercices** (5) :
  - Échanges `(cm2-geo-mondialisation)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm2.json, category=cm2-mondialisation, questions=6
  - Échanges et flux `(cm2-geo-echanges-flux)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm2.json, category=cm2-echanges-flux, questions=6
  - Les acteurs de la mondialisation `(cm2-geo-acteurs-mondialisation)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm2.json, category=cm2-acteurs-mondialisation, questions=6
  - Mondialisation et vocabulaire `(cm2-geo-mondialisation-appariement)` — engine: `matching`, category=matching_geo_cm2, dataFile=data/geography_matching.json, questions=2
  - Défi : acteurs de la mondialisation `(cm2-bonus-geo-acteurs-mondialisation-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm2.json, category=cm2-acteurs-mondialisation, questions=10, bonus (seuil=2)

#### Développement durable `(cm2-geo-durable-subtheme)`

- **Leçons** (3) :
  - Habiter plus durablement `(cm2-lesson-habiter-durablement)` — blocs: paragraph, example, bullets, tip
  - Le développement durable `(cm2-lesson-developpement-durable)` — blocs: paragraph, example, bullets, tip
  - Protéger les milieux `(cm2-lesson-proteger-environnement)` — blocs: paragraph, bullets, example, tip
- **Exercices** (7) :
  - Développement durable `(cm2-geo-durable)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm2.json, category=cm2-developpement-durable, questions=6
  - Agir pour durer `(cm2-geo-agir-pour-durer)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/geography_cm2.json, category=cm2-developpement-durable
  - Mobilités durables `(cm2-geo-mobilites-durables)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/geography_cm2.json, category=cm2-mobilites-durables
  - Consommation responsable `(cm2-geo-consommation-responsable)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-consommation-responsable, questions=6
  - Coopérer en Europe `(cm2-geo-cooperation-europe)` — engine: `choice-engine`, type=factual-qcm, questions=6, dataFile=data/geography_cm2.json, category=cm2-cooperation-europe
  - Gestes et environnement `(cm2-geo-durable-appariement)` — engine: `matching`, category=matching_geo_cm2, dataFile=data/geography_matching.json, questions=2
  - Défi : agir pour durer `(cm2-bonus-geo-agir-pour-durer-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/geography_cm2.json, category=cm2-developpement-durable, questions=12, bonus (seuil=2)

### Sciences (cm2-sciences-subject)

#### Le vivant `(cm2-sciences-vivant-subtheme)`

- **Leçons** (3) :
  - Classer les êtres vivants `(cm2-lesson-classification-vivant)` — blocs: paragraph, bullets, bullets, tip, check, check
  - La reproduction des êtres vivants `(cm2-lesson-reproduction-vivant)` — blocs: paragraph, bullets, bullets, example, check, check
  - Chaînes alimentaires et écosystèmes `(cm2-lesson-chaines-alimentaires)` — blocs: paragraph, bullets, example, tip, check, check
- **Exercices** (5) :
  - Classer les êtres vivants `(cm2-sciences-vivant-classification)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-vivant-classification, questions=8
  - La reproduction des êtres vivants `(cm2-sciences-vivant-reproduction)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-vivant-reproduction, questions=6
  - Chaînes alimentaires `(cm2-sciences-vivant-chaines)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-vivant-chaines-alimentaires, questions=7
  - Le vivant : groupes et rôles `(cm2-sciences-vivant-appariement)` — engine: `matching`, category=matching_sciences_cm2, dataFile=data/science_matching.json, questions=2
  - Défi : le vivant `(cm2-bonus-sciences-vivant-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-vivant-classification, questions=10, bonus (seuil=2)

#### Corps et santé `(cm2-sciences-corps-subtheme)`

- **Leçons** (2) :
  - Préserver sa santé `(cm2-lesson-corps-sante)` — blocs: paragraph, bullets, tip, check, check
  - Les cinq sens `(cm2-lesson-cinq-sens)` — blocs: paragraph, mini-table, example, tip, check, check
- **Exercices** (4) :
  - Corps et santé `(cm2-sciences-corps)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-corps-sante, questions=8
  - Préserver sa santé `(cm2-sciences-preserver-sante)` — engine: `choice-engine`, type=factual-qcm, questions=10, dataFile=data/science_cm2.json, category=cm2-corps-sante
  - Hygiène et prévention `(cm2-sciences-corps-prevention)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-prevention-dechets, questions=6
  - Défi : corps et santé `(cm2-bonus-sciences-corps-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-corps-sante, questions=10, bonus (seuil=2)

#### Énergie `(cm2-sciences-energie-subtheme)`

- **Leçons** (1) :
  - Produire et utiliser l'énergie `(cm2-lesson-sources-energie)` — blocs: paragraph, bullets, tip, check, check
- **Exercices** (5) :
  - Énergie `(cm2-sciences-energie)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-techno-energie, questions=8
  - Produire et économiser l'énergie `(cm2-sciences-produire-economiser-energie)` — engine: `choice-engine`, type=factual-qcm, questions=10, dataFile=data/science_cm2.json, category=cm2-techno-energie
  - Économies d'énergie `(cm2-sciences-economies-energie)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/science_cm2.json, category=cm2-economies-energie
  - Sources d'énergie et risques climatiques `(cm2-sciences-energie-appariement)` — engine: `matching`, category=matching_sciences_cm2, dataFile=data/science_matching.json, questions=2
  - Défi : énergie et économies `(cm2-bonus-sciences-energie-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-techno-energie, questions=12, bonus (seuil=2)

#### Environnement `(cm2-sciences-environnement-subtheme)`

- **Leçons** (2) :
  - Protéger les milieux `(cm2-lesson-proteger-environnement-sciences)` — blocs: paragraph, bullets, tip, check, check
  - Les états de la matière `(cm2-lesson-etats-matiere)` — blocs: paragraph, mini-table, example, tip, check, check
- **Exercices** (5) :
  - Environnement `(cm2-sciences-environnement)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-environnement, questions=6
  - Protéger les milieux `(cm2-sciences-proteger-milieux)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/science_cm2.json, category=cm2-environnement
  - Éco-gestes `(cm2-sciences-eco-gestes)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/science_cm2.json, category=cm2-eco-gestes
  - Gestes et environnement `(cm2-sciences-appariement)` — engine: `matching`, category=matching_sciences_cm2, dataFile=data/science_matching.json, questions=2
  - Défi : éco-gestes au quotidien `(cm2-bonus-sciences-eco-gestes-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-eco-gestes, questions=12, bonus (seuil=2)

#### Corps et effort `(cm2-sciences-effort-subtheme)`

- **Leçons** (1) :
  - Le corps pendant l'effort `(cm2-lesson-corps-effort)` — blocs: paragraph, example, tip, check, check
- **Exercices** (4) :
  - Corps et effort `(cm2-sciences-effort)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-corps-effort, questions=6
  - Respirer et récupérer `(cm2-sciences-respirer-recuperer)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/science_cm2.json, category=cm2-corps-effort
  - Lumière et son `(cm2-sciences-effort-lumiere-son)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-lumiere-son, questions=6
  - Défi : mouvement et énergie `(cm2-bonus-sciences-effort-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-corps-effort, questions=10, bonus (seuil=2)

#### Électricité `(cm2-sciences-electricite-subtheme)`

- **Leçons** (1) :
  - Faire circuler l'électricité `(cm2-lesson-electricite-circuit)` — blocs: paragraph, bullets, tip, check, check
- **Exercices** (6) :
  - Électricité `(cm2-sciences-electricite)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-electricite-objets, questions=6
  - Objets techniques `(cm2-sciences-objets-techniques)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-objets-techniques-quotidien, questions=6
  - Sécurité électrique `(cm2-sciences-securite-electrique)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-securite-electrique, questions=6
  - Le circuit électrique `(cm2-sciences-tap-circuit)` — engine: `board-interactive`, type=tap-features, dataFile=data/board_tap_features_science.json, category=cm2_tap_circuit_electrique, questions=3
  - Sécurité électrique et appareils `(cm2-sciences-electricite-appariement)` — engine: `matching`, category=matching_sciences_cm2, dataFile=data/science_matching.json, questions=2
  - Défi : sécurité électrique experte `(cm2-bonus-sciences-securite-electrique-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-securite-electrique, questions=12, bonus (seuil=2)

#### Climat et déchets `(cm2-sciences-climat-subtheme)`

- **Leçons** (1) :
  - Réduire les déchets `(cm2-lesson-climat-dechets)` — blocs: paragraph, bullets, tip, check, check
- **Exercices** (4) :
  - Climat et déchets `(cm2-sciences-climat)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-climat-dechets, questions=6
  - Prévention des déchets `(cm2-sciences-prevention-dechets)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-prevention-dechets, questions=6
  - Risques climatiques `(cm2-sciences-risques-climatiques)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-risques-climatiques, questions=6
  - Défi : risques climatiques `(cm2-bonus-sciences-climat-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-risques-climatiques, questions=5, bonus (seuil=2)

#### Matière et transformations `(cm2-sciences-matiere-transformations-subtheme)`

- **Leçons** (3) :
  - Les états et les transformations `(cm2-lesson-etats-transformations)` — blocs: paragraph, example, bullets, tip, check, check
  - Mélanges et séparations `(cm2-lesson-melanges-separations)` — blocs: paragraph, example, bullets, tip, check, check
  - Lumière et son `(cm2-lesson-lumiere-son)` — blocs: paragraph, example, bullets, tip, check, check
- **Exercices** (7) :
  - Matière et transformations `(cm2-sciences-matiere-transformations)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-matiere-transformations, questions=8
  - Les états de l’eau `(cm2-sciences-etats-eau)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-etats-eau, questions=8
  - Mélanges et solutions `(cm2-sciences-melanges-solutions)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-melanges-solutions, questions=8
  - Lumière et son `(cm2-sciences-lumiere-son)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-lumiere-son, questions=8
  - Lumière et ombres `(cm2-sciences-lumiere-ombres)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-sources-lumiere-ombres, questions=8
  - Le son `(cm2-sciences-son-volume)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-son-propagation, questions=8
  - Consommation responsable `(cm2-sciences-consommation-responsable-matiere)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/science_cm2.json, category=cm2-consommation-responsable, questions=6

### EMC (cm2-emc-subject)

#### Citoyenneté `(cm2-emc-citoyennete-subtheme)`

- **Leçons** (4) :
  - Droits et devoirs du citoyen `(cm2-lesson-citoyennete-droits-devoirs)` — blocs: paragraph, bullets, tip
  - La laïcité à l'école `(cm2-lesson-laicite-ecole)` — blocs: paragraph, example, bullets, tip
  - Les institutions de la République `(cm2-lesson-institutions-republique)` — blocs: paragraph, bullets, example, tip
  - Le rôle du citoyen `(cm2-lesson-institutions-republique-citoyens)` — blocs: paragraph, example, bullets, tip
- **Exercices** (4) :
  - Citoyenneté `(cm2-emc-citoyennete)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cm2.json, category=cm2-citoyennete, questions=8
  - Débattre et choisir `(cm2-emc-debattre-choisir)` — engine: `choice-engine`, type=factual-qcm, questions=10, dataFile=data/emc_cm2.json, category=cm2-citoyennete
  - Institutions et démocratie `(cm2-emc-appariement)` — engine: `matching`, category=matching_emc_cm2, dataFile=data/emc_matching.json, questions=3
  - Valeurs et engagement citoyen `(cm2-emc-appariement-2)` — engine: `matching`, category=matching_emc_cm2, dataFile=data/emc_matching.json, questions=3

#### Solidarité `(cm2-emc-solidarite-subtheme)`

- **Leçons** (1) :
  - Agir pour le bien commun `(cm2-lesson-solidarite-bien-commun)` — blocs: paragraph, example, tip
- **Exercices** (5) :
  - Solidarité `(cm2-emc-solidarite)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cm2.json, category=cm2-solidarite, questions=8
  - Agir avec solidarité `(cm2-emc-agir-solidarite)` — engine: `choice-engine`, type=factual-qcm, questions=10, dataFile=data/emc_cm2.json, category=cm2-solidarite
  - Solidarité au quotidien `(cm2-emc-solidarite-quotidienne)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cm2.json, category=cm2-solidarite-quotidienne, questions=6
  - Projet collectif `(cm2-emc-projet-collectif)` — engine: `choice-engine`, type=factual-qcm, questions=6, dataFile=data/emc_cm2.json, category=cm2-projet-collectif
  - Défi : solidarité au quotidien `(cm2-bonus-emc-solidarite-quotidienne-expert)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cm2.json, category=cm2-solidarite-quotidienne, questions=10, bonus (seuil=2)

#### Engagement `(cm2-emc-engagement-subtheme)`

- **Leçons** (1) :
  - Participer à la vie collective `(cm2-lesson-engagement-participer)` — blocs: paragraph, bullets, example, tip
- **Exercices** (5) :
  - Engagement `(cm2-emc-engagement)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cm2.json, category=cm2-engagement, questions=6
  - S'engager dans la classe `(cm2-emc-sengager-classe)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/emc_cm2.json, category=cm2-engagement
  - Solidarite au quotidien `(cm2-emc-engagement-solidarite)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cm2.json, category=cm2-solidarite-quotidienne, questions=6
  - Le projet collectif `(cm2-emc-engagement-projet)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cm2.json, category=cm2-projet-collectif, questions=6
  - Defi : engagement citoyen `(cm2-bonus-emc-engagement-defi)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cm2.json, category=cm2-engagement, questions=8, bonus (seuil=2)

#### Responsabilités `(cm2-emc-responsabilites-subtheme)`

- **Leçons** (2) :
  - Assumer ses responsabilités `(cm2-lesson-responsabilites-justice)` — blocs: paragraph, bullets, tip
  - La loi et la justice `(cm2-lesson-loi-justice)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Responsabilités `(cm2-emc-responsabilites)` — engine: `choice-engine`, type=factual-qcm, dataFile=data/emc_cm2.json, category=cm2-responsabilites, questions=6
  - Assumer ses responsabilités `(cm2-emc-assumer-responsabilites)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/emc_cm2.json, category=cm2-responsabilites
  - Liberté et justice `(cm2-emc-liberte-justice)` — engine: `choice-engine`, type=factual-qcm, questions=8, dataFile=data/emc_cm2.json, category=cm2-liberte-justice

#### Institutions et débat `(cm2-emc-institutions-debat-subtheme)`

- **Leçons** (3) :
  - Égalité et dignité `(cm2-lesson-egalite-dignite)` — blocs: paragraph, example, bullets, tip
  - Le débat démocratique `(cm2-lesson-debat-democratique)` — blocs: paragraph, example, bullets, tip
  - La justice protège les droits `(cm2-lesson-justice-proteger)` — blocs: paragraph, example, bullets, tip
- **Exercices** (3) :
  - Égalité, débat et justice `(cm2-emc-institutions-debat-egalite-justice)` — engine: `choice-engine`, type=factual-qcm, category=cm2-institutions-debat, dataFile=data/emc_cm2.json, questions=8
  - Les institutions de la République `(cm2-emc-institutions-republique)` — engine: `choice-engine`, type=factual-qcm, category=cm2-citoyennete, dataFile=data/emc_cm2.json, questions=7
  - Défi : institutions et débat `(cm2-bonus-institutions-debat-expert)` — engine: `choice-engine`, type=factual-qcm, category=cm2-institutions-debat, dataFile=data/emc_cm2.json, questions=9, bonus (seuil=2)


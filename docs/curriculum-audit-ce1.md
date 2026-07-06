# Audit programme CE1

Sources officielles utilisées :
- https://www.education.gouv.fr/programmes-et-horaires-l-ecole-elementaire-9011
- https://eduscol.education.gouv.fr/4740/ressources-d-accompagnement-du-programme-de-francais-au-cycle-2
- https://eduscol.education.gouv.fr/4770/ressources-d-accompagnement-pour-questionner-l-espace-et-le-temps-explorer-les-organisations-du-monde-au-cycle-2
- https://eduscol.education.gouv.fr/4446/enseignement-moral-et-civique
- Bulletin officiel n°31 du 30 juillet 2020 (programme cycle 2, en vigueur)

> Revérifié ligne par ligne le 2026-06-29 par lecture intégrale de `data/ce1.json` (5 matières, 18 sous-thèmes, ~115 exercices, ~35 leçons). **Mise à jour 2026-06-30 : ajout de l'exercice « Raconte une histoire » (`ce1-francais-raconte-histoire`, remise en ordre de phrases, catégorie `story_order_ce1` dans `data/french_word_order.json`) pour amorcer la production d'écrit guidée et auto-corrigeable.** Pour le détail exact des exercices par sous-thème, voir [CONTENT_ARCHITECTURE.md](../CONTENT_ARCHITECTURE.md).

## Synthèse

Le CE1 couvre désormais correctement le cœur du programme : calcul (tables, additions/soustractions, comparaisons), géométrie/mesures (formes, longueurs, heure, masses/contenances), questionner le monde (temps, espace, vivant/matière) et EMC sont tous représentés avec leçon + exercice + souvent un bonus. Les manques résiduels sont concentrés en français : la lecture-compréhension et la production d'écrit restent embryonnaires (2 exercices seulement), et il n'existe aucun exercice de copie/écriture autonome ni d'orthographe grammaticale (accords). Le programme « questionner le monde » est en réalité le mieux couvert du CE1, ce qui inverse le diagnostic de l'audit précédent. Les actions prioritaires portent donc sur le français (compréhension de texte plus longue, production d'écrit guidée, accords simples) plutôt que sur les mathématiques ou le vivant/matière, déjà denses.

## État par matière

| Matière | Notions attendues (BO 2020, cycle 2) | Couverture actuelle dans `ce1.json` | État | Action suivante |
|---|---|---|---|---|
| Mathématiques — Nombres et calculs | Nombres jusqu'à 1000, addition/soustraction posée et mentale, multiplication (sens et tables), compléments, comparaison | Tables de 2,3,4,5,6,7,10 ; additions ≤20/≤50/100 (bonus) ; soustractions ≤20 ; compléments à 100 ; comparaisons ≤100/≤200 ; appariement nombres/opérations ; jeu de mémoire | Couvert | Ajouter soustractions ≤50/100 et une notion de numération posée (dizaines/unités jusqu'à 1000) |
| Mathématiques — Géométrie et mesures | Formes planes/solides, longueurs (cm/m), durées et lecture de l'heure, masses (kg/g), contenances (L/mL) | Leçons + exercices sur formes planes/solides, longueurs, repères de la journée, heure (engine clock, niveau 2, + bonus), masses/contenances ; appariement formes/mesures | Couvert | Ajouter un exercice sur les solides en 3D distinctement (cube, pavé) si absent dans `math_geometry_ce1.json` |
| Mathématiques — Problèmes | Résoudre des problèmes additifs/soustractifs et à étapes en contexte | Problèmes additifs, problèmes à étapes, bonus expert, leçon méthodologique | Couvert | Ajouter un type de problème multiplicatif simple (groupes, partage) |
| Français — Lecture et compréhension | Lire avec fluence, comprendre un texte/une phrase, identifier qui/quoi/où | 2 exercices seulement (phrases courtes, qui/quoi/où) + 2 leçons ; pas de texte long ni de questions de compréhension fine | Partiel | Priorité : ajouter des exercices de compréhension sur des textes courts (3-5 phrases), pas seulement des phrases isolées |
| Français — Écriture / Production d'écrit | Copier sans erreur, produire des phrases puis un texte court, ponctuation | « Raconte une histoire » (`story_order_ce1`, remise en ordre de 3 phrases pour reconstituer un mini-récit, ajouté le 2026-06-30) en plus du « word-order » syntaxique ; toujours aucun exercice de copie ni de production libre | Partiel | Ajouter un exercice de copie guidée ; la production libre reste hors périmètre (auto-correction impossible) |
| Français — Vocabulaire | Synonymes, contraires, familles de mots, champs lexicaux, ordre alphabétique | Synonymes, contraires (+bonus), familles de mots, rangement par thème, appariement synonymes | Couvert | Ajouter l'ordre alphabétique (notion explicitement au programme CE1, absente) |
| Français — Grammaire | Nature des mots (nom, déterminant, verbe), genre/nombre, accord simple dans le groupe nominal, ponctuation de la phrase | Déterminants (un/une, le/la/l'), singulier/pluriel des noms, ordre des mots, cloze | Partiel | Ajouter un exercice dédié à l'accord déterminant-nom (le pluriel est traité côté nom seul, pas l'accord complet) et un exercice sur les types de phrases (déclarative/interrogative/ponctuation) |
| Français — Orthographe | Orthographe lexicale (mots fréquents), homophones grammaticaux usuels, correspondances graphème-phonème | Dictées thématiques (8 catégories), dictée audio, mots fréquents par période, homophones a/à, et/est, son/sont | Couvert | Ajouter l'homophone ou/où et on/ont, fréquents au programme CE1 |
| Français — Conjugaison | Être/avoir et verbes en -er au présent, accord sujet-verbe simple | Être/avoir (2 niveaux), verbes en -er (2 séries), aller, cas du « nous » en -ger/-cer, défi mélangé + bonus | Couvert | Aucune action urgente ; envisager le futur proche si le niveau le permet |
| Questionner le monde — Le temps | Repères temporels (avant/après/aujourd'hui), calendrier, vivre autrefois, traces du passé | Temps/avant-après, calendrier, vivre autrefois (+bonus), école d'autrefois, monuments/personnages, objets du passé, souvenirs de famille, appariement objets/usages | Couvert | Aucune action urgente |
| Questionner le monde — L'espace | Se repérer (plan, légende), lieux du quotidien, paysages, la France et ses transports | Plan du quartier, légende, lieux publics, carte de France interactive, paysages (ville/campagne/littoral), appariement lieux/paysages, transports en France | Couvert | Aucune action urgente |
| Questionner le monde — Le vivant | Besoins du vivant, cycle de vie, corps humain, hygiène, cinq sens, saisons/météo, milieux de vie | Besoins du vivant, cycle de vie, parties de la plante (interactif), corps/hygiène, cinq sens, saisons, météo, milieux de vie (+adaptation), appariement multiple | Couvert | Aucune action urgente |
| Questionner le monde — La matière et les objets | États de la matière, mélanges simples, objets techniques, propriétés des matériaux | États de l'eau, mélanges simples (+bonus), objets techniques, propriétés des matériaux (dur/mou/transparent/flotte) | Couvert | Aucune action urgente |
| EMC | Règles de vie collective, rôles et responsabilités, respect, entraide, civilité, gestion des émotions | Règles communes, rôles dans la classe, être citoyen, dialogue et politesse, entraide et respect, émotions et attitudes (appariement) | Couvert | Aucune action urgente ; envisager une notion sur le règlement et les symboles de la République (drapeau, devise) si pas déjà en CE1/CE2 ailleurs |

## Points de vigilance

- Le déséquilibre principal n'est plus entre matières mais interne au français : phonologie/orthographe/conjugaison sont riches, lecture-compréhension et production d'écrit sont sous-dotées.
- Vérifier que `math_geometry_ce1.json`, `math_word_problems_cycle2.json` et `math_matching.json` couvrent bien les catégories citées par les exercices (non audité ligne à ligne ici, seul `ce1.json` a été lu intégralement).
- Le fichier ne présente plus de mauvais classement apparent : les leçons documentaires consultées sont bien rattachées à leur sous-thème de matière.

## Priorités

1. ~~**Production d'écrit guidée**~~ : **fait le 2026-06-30** (« Raconte une histoire », remise en ordre de phrases). **Ajouter (urgent)** : compréhension de texte court (texte de 3-5 phrases + questions), copie guidée.
2. **Ajouter (utile)** : ordre alphabétique, homophones ou/où et on/ont, accord déterminant-nom explicite, type de phrase/ponctuation.
3. **Ajouter (mineur)** : problème multiplicatif simple en mathématiques, numération posée jusqu'à 1000.
4. **Vérifier** : contenu des fichiers JSON externes référencés par les exercices à choix multiples (`math_geometry_ce1.json`, `math_word_problems_cycle2.json`) pour confirmer qu'ils couvrent bien les catégories citées par leurs `category` respectives.

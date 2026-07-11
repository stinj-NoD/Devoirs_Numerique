# Audit programme CP

Sources officielles utilisées :
- https://www.education.gouv.fr/programmes-et-horaires-l-ecole-elementaire-9011
- Bulletin officiel n°31 du 30 juillet 2020 (programme cycle 2 : français, mathématiques, questionner le monde, EMC)
- https://eduscol.education.gouv.fr/4740/ressources-d-accompagnement-du-programme-de-francais-au-cycle-2
- https://eduscol.education.gouv.fr/4770/ressources-d-accompagnement-pour-questionner-l-espace-et-le-temps-explorer-les-organisations-du-monde-au-cycle-2
- https://eduscol.education.gouv.fr/4446/enseignement-moral-et-civique

> Audit relu intégralement le 2026-06-29 par lecture exhaustive de `data/cp.json` (6 matières, 34 sous-thèmes, 130 exercices, 62 leçons). L'audit précédent (25/06/2026) sous-estimait fortement le contenu réel : français et questionner le monde sont bien plus avancés qu'indiqué. Pour le détail exact des exercices par sous-thème, voir [CONTENT_ARCHITECTURE.md](../CONTENT_ARCHITECTURE.md).

## Synthèse

Le CP est le niveau le plus mûr de l'application : les 6 matières attendues au programme (hors EPS/arts, hors scope) sont toutes représentées avec une volumétrie significative (130 exercices, 62 leçons). Les manques ne sont plus structurels mais ciblés : en mathématiques il manque le repérage sur quadrillage et la résolution de problèmes à plusieurs étapes ; en français la phonologie systématique (tous les sons complexes, pas seulement ou/on/ch) et la lecture de phrases longues restent légères ; en EMC le vote/la décision collective et le respect de l'environnement ne sont pas traités. Les autres matières (questionner le temps/l'espace, sciences) sont déjà solides au regard du programme 2020.

## État par matière

| Matière | Notions attendues (BO 2020, cycle 2 - CP) | Couverture actuelle (data/cp.json) | État | Action suivante |
|---|---|---|---|---|
| Mathématiques | Nombres entiers ≤ 100 (désignations orale/écrite, dizaines-unités), addition et soustraction (sens et techniques), doubles/moitiés, résolution de problèmes (1 puis 2 étapes), comparaison de nombres, monnaie, grandeurs (longueur, masse, contenance), repérage dans l'espace, figures planes simples (carré, rectangle, triangle, cercle), lecture de l'heure (heures pleines/demies) | Couvert : add/sub jusqu'à 50, compléments à 10/20, comparaison jusqu'à 99, doubles/moitiés, écriture des nombres en lettres jusqu'à 100, dizaines/unités, monnaie (pièces/billets, "Le Marché"/"La Caisse"), problèmes à une étape, formes planes, longueurs, masses/contenances, heure (pleine/demie), repérage spatial (carte de France, plan/quartier) | Couvert | Ajouter : problèmes à 2 étapes, repérage sur quadrillage/grille de cases, comparaison/lecture de tableaux simples |
| Français - lecture/phonologie | Principe alphabétique, combinatoire (voyelles, consonnes, digraphes/sons complexes : ou, on, ch, an, in, eu, oi...), syllabation, fluence de lecture de mots et phrases courtes, compréhension de phrases et textes courts | Couvert pour le socle : repérage/comptage de syllabes, sons ou/on/ch, lettres muettes, lecture de mots simples, compréhension de phrases courtes | Partiel | Ajouter d'autres sons fréquents non couverts (an/en, in/ain, eu/œu, oi, gn, ph) et un parcours de lecture de phrases/petits textes plus long |
| Français - écriture/orthographe | Copie et écriture autonome de mots, dictée de mots/phrases, mots invariables (mots-outils) fréquents, correspondances phonie-graphie | Couvert : dictée d'images, dictée audio (mots), dictée audio mots-outils par période (1 à 5), repères genre (un/une, le/la) | Couvert | Ajouter dictée de phrases courtes complètes (pas seulement des mots isolés) |
| Français - grammaire/vocabulaire | Phrase (majuscule, point, ponctuation simple), distinction nom/verbe, déterminants, ordre des mots dans la phrase, premiers repères de conjugaison (être/avoir au présent) | Couvert : phrase et ponctuation, nom vs verbe, déterminants (un/une/le/la/l'), ordre des mots, conjugaison être/avoir au présent | Couvert | Niveau bien couvert ; envisager pluriel simple (un chat / des chats) en lien avec le programme CE1 |
| Questionner le monde - temps | Repères temporels du quotidien (jours, semaines, moments de la journée), distinction passé/présent/futur, traces du passé, vie quotidienne d'autrefois vs aujourd'hui | Couvert : repères jours/semaine, avant/après, hier/aujourd'hui/demain, vie autrefois (école d'autrefois), traces du passé (objets, photos, monuments) | Couvert | Pas de priorité immédiate |
| Questionner le monde - espace | Espace proche (école, quartier), plans et représentations simples, se repérer (gauche/droite, devant/derrière), paysages (ville, campagne, littoral, montagne), modes de déplacement | Couvert : plan de l'école/quartier, repérage spatial, carte de France interactive, paysages, transports et lieux publics | Couvert | Pas de priorité immédiate |
| Questionner le monde - vivant/matière | Caractéristiques du vivant vs non-vivant, besoins du vivant, cycle de vie simple, états de la matière, sens et fonctions du corps, hygiène, saisons et météo, milieux de vie des animaux, matériaux et fonction des objets | Couvert : vivant/non-vivant, besoins du vivant, plantes/animaux, états de la matière (solide/liquide/gaz), 5 sens, hygiène, 4 saisons, météo, milieux (forêt/mare/mer/jardin), matériaux des objets (bois/plastique/métal/papier/tissu) | Couvert | Pas de priorité immédiate ; éventuellement ajouter le cycle de vie d'un être vivant (graine → plante, œuf → animal) |
| EMC | Règles de vie collective, respect d'autrui, droits et devoirs de l'élève, politesse, expression et reconnaissance des émotions, entraide, prudence/sécurité, premiers repères sur la prise de décision collective (vote simple), respect de l'environnement | Couvert : règles de classe, droits et devoirs, respect du matériel, politesse, émotions (reconnaître/exprimer), entraide, prudence/sécurité | Partiel | Ajouter : décision collective simple (vote, règle votée ensemble), respect de l'environnement/des espaces communs |

## Points de vigilance

- L'audit précédent ne reflétait plus le contenu réel : français et questionner le monde sont nettement plus riches qu'annoncé (grammaire avancée, conjugaison, milieux de vie, matériaux). Veiller à mettre à jour ce fichier après chaque vague d'ajout de contenu plutôt qu'à le laisser dériver.
- Le contenu phonologique reste centré sur 3 sons complexes (ou, on, ch) : c'est la zone la plus en retrait par rapport à un parcours CP complet de combinatoire.
- EMC manque la dimension "décision collective" (vote, règle commune) qui est explicitement un attendu du programme 2020.

## Priorités

- `Ajouter` (français) : sons complexes manquants (an/en, in/ain, eu/œu, oi, gn) et un parcours de lecture de phrases/petits textes plus étoffé.
- `Ajouter` (maths) : problèmes à deux étapes, repérage sur quadrillage/tableau simple.
- `Ajouter` (EMC) : décision collective (vote simple en classe), respect de l'environnement.
- `Ajuster` : reformuler les dernières leçons encore trop procédurales ("mode d'emploi d'exercice") en rappels de notion.
- `Maintenir` : tenir ce tableau à jour à chaque ajout de contenu CP pour éviter une nouvelle dérive entre audit et contenu réel.

# Audit programme CM2

Sources officielles utilisées :
- https://www.education.gouv.fr/programmes-et-horaires-l-ecole-elementaire-9011
- https://www.education.gouv.fr/sites/default/files/bulletin-officiel-n-17-du-24-avril-2025-439935.pdf
- https://eduscol.education.gouv.fr/4470/histoire-geographie
- https://eduscol.education.gouv.fr/4446/enseignement-moral-et-civique
- https://eduscol.education.gouv.fr/31167/domaines-enseignement/enseigner-l-ecole-elementaire

## Synthese

Le CM2 est dense et bien fourni, mais encore inegal. Les lecons d'histoire, geographie, sciences et EMC ont une bonne base, tandis que francais et maths doivent etre moins conceptuels et plus completement alignés au programme. Le principal point bloquant reste l'encodage.

## Etat par matiere

| Matiere | Notions attendues | Couverture actuelle | Etat | Lecon | Action suivante |
|---|---|---|---|---|---|
| Mathematiques | nombres, fractions/decimaux, division, geometrie, mesures, problemes | nombres, fractions-decimaux, temps, calcul | Partiel | Conforme | Ajouter division posee, geometrie, grandeurs/mesures, problemes |
| Francais | orthographe, grammaire, homophones, conjugaison, vocabulaire, lecture-comprehension | passe compose, imparfait de etre/avoir, homophones, accords | Partiel | Partiellement conforme | Transformer homophones en vraies fiches, ajouter vocabulaire, syntaxe, lecture |
| Histoire | Revolution, Republique, XIXe/XXe siecle, Europe, repères historiques | Revolution, Republique, XXe siecle, Europe | Partiel | Conforme mais encore repères | Renforcer le contenu historique et réduire les lecons trop "frise" |
| Geographie | territoire francais, Europe, mobilites, espaces habites, developpement durable | espaces differents, mobilites, mondialisation, durable, Europe | Partiel | Partiellement conforme | Ajouter territoire francais concret, espaces urbains/ruraux/littoraux/montagnards |
| Sciences | corps et sante, energie, electricite, matiere, vivant, environnement | corps/sante, effort, energie, electricite, environnement | Partiel | Partiellement conforme | Ajouter matiere, vivant, transformations, lumiere/son |
| EMC | citoyennete, responsabilite, justice, laicite, institutions, debat democratique | citoyennete, solidarite, engagement, responsabilites | Partiel | Partiellement conforme | Ajouter laicite, institutions, egalite/dignite, loi, justice, debat |

## Points de vigilance

- `cm2.json` est la plus forte priorite QA : nombreux accents cassés, `?` parasites, mojibake.
- Les datasets `geography_cm2.json`, `science_cm2.json` et `emc_cm2.json` demandent aussi une passe UTF-8 stricte.
- Plusieurs lecons restent trop methodologiques : homophones, repères du XXe siecle, developpement durable, ecogestes.

## Priorites

- `Ajouter` : geometrie, division, mesures, vocabulaire, lecture-comprehension, matière/vivant/transformations, institutions.
- `Ajuster` : convertir les lecons "strategie" en vraies lecons de revision disciplinaire.
- `Corriger` : nettoyer `cm2.json` et les datasets liés en premier.
- `Perfectionner` : structurer la bibliotheque CM2 comme un mini-manuel de revision.

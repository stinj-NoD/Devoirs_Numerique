# Audit programme CM1

Sources officielles utilisées :
- https://www.education.gouv.fr/programmes-et-horaires-l-ecole-elementaire-9011
- https://www.education.gouv.fr/sites/default/files/bulletin-officiel-n-17-du-24-avril-2025-439935.pdf
- https://eduscol.education.gouv.fr/4470/histoire-geographie
- https://eduscol.education.gouv.fr/4446/enseignement-moral-et-civique
- https://eduscol.education.gouv.fr/31167/domaines-enseignement/enseigner-l-ecole-elementaire

## Synthese

Le CM1 est structurellement solide et deja riche en lecons. Les principales marges de progression concernent l'histoire et la geographie, encore un peu trop orientées repérage, puis la geometrie, les problemes et le vocabulaire.

## Etat par matiere

| Matiere | Notions attendues | Couverture actuelle | Etat | Lecon | Action suivante |
|---|---|---|---|---|---|
| Mathematiques | fractions, decimaux, conversions, geometrie, problemes, donnees | fractions, decimaux, conversions, chiffres romains | Partiel | Conforme | Ajouter geometrie, problemes, organisation de donnees |
| Francais | grammaire, homophones, conjugaison, vocabulaire, lecture, ecriture | homophones, conjugaison, articles, grammaire | Partiel | Conforme mais incomplet | Ajouter vocabulaire, accords, lecture-comprehension |
| Histoire | grandes periodes, Antiquite, Moyen Age, Temps modernes, recits historiques | periodes, frise, temps des rois, repères | Partiel | Partiellement conforme | Ajouter vie au Moyen Age, humanisme, imprimerie, Antiquite plus incarnee |
| Geographie | territoires francais, espaces, mobilites, cartes et repères | relief, territoires, deplacements | Partiel | Conforme mais leger | Ajouter carte/légende, espaces et activites, services |
| Sciences | vivant, matiere, energie, corps, hygiene, classification | vivant, matiere/energie, corps/hygiene | Partiel | Conforme | Ajouter classification, etats de la matiere, chaines alimentaires |
| EMC | vivre ensemble, droits/devoirs, citoyennete, laicite, Republique | vivre ensemble, droits/devoirs, citoyennete | Partiel | Conforme mais incomplet | Ajouter laicite, symboles, debat, bien commun |

## Points de vigilance

- `science_cm1.json` et `emc_cm1.json` gardent des reliquats de mojibake.
- Deux lecons d'histoire restent encore trop proches d'un outil de repérage.

## Priorites

- `Ajouter` : geometrie, problemes, vocabulaire, histoire plus narrative, symboles et laicite.
- `Ajuster` : convertir les lecons de repérage historique en vraies lecons de contenu.
- `Corriger` : nettoyer l'encodage des datasets sciences et EMC.
- `Perfectionner` : enrichir chaque lecon avec davantage de vocabulaire disciplinaire.

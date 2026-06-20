# Audit programme CE1

Sources officielles utilisées :
- https://www.education.gouv.fr/programmes-et-horaires-l-ecole-elementaire-9011
- https://eduscol.education.gouv.fr/4740/ressources-d-accompagnement-du-programme-de-francais-au-cycle-2
- https://eduscol.education.gouv.fr/4770/ressources-d-accompagnement-pour-questionner-l-espace-et-le-temps-explorer-les-organisations-du-monde-au-cycle-2
- https://eduscol.education.gouv.fr/4446/enseignement-moral-et-civique

## Synthese

Le CE1 est deja riche en volume, mais plusieurs lecons restent trop methodologiques ou rangees dans la mauvaise discipline. Le sujet principal est maintenant l'alignement pedagogique et la proprete editoriale.

## Etat par matiere

| Matiere | Notions attendues | Couverture actuelle | Etat | Lecon | Action suivante |
|---|---|---|---|---|---|
| Mathematiques | additions/soustractions, multiplication initiale, comparaison, temps, mesures, monnaie, problemes | multiplication, complements, comparaison, additions rapides | Partiel | Conforme mais parfois strategique | Ajouter soustraction, geometrie, mesures, temps, monnaie, problemes |
| Francais | lecture-comprehension, ecriture, lexique, orthographe, grammaire, conjugaison | orthographe, dictee, grammaire, conjugaison, lecture courte, vocabulaire partiel | Partiel | Conforme mais inegal | Ajouter comprehension, vocabulaire structuré, production ecrite |
| Questionner le temps | repères temporels, autrefois/aujourd'hui, traces du passé, vie quotidienne | repères, avant/apres, traces du passe, monuments, autrefois | Partiel | Partiellement conforme | Replacer les lecons mal classees, enrichir l'histoire quotidienne |
| Questionner l'espace | espace proche, plan, paysages, mobilites simples | plan, paysage, transports, repérage | Partiel | Conforme mais leger | Ajouter quartier, commune, directions, comparaison d'espaces |
| Sciences | vivant, besoins, corps, hygiene, matiere, eau, sens | besoins du vivant, etats de la matiere, corps/hygiene | Partiel | Conforme mais trop court | Ajouter cinq sens explicites, cycle de vie, vocabulaire scientifique |
| EMC | regles, respect, citoyennete, entraide, droits/devoirs | regles, citoyennete, entraide et respect | Partiel | Partiellement conforme | Ajouter roles, dialogue respectueux, bien commun, emotions |

## Points de vigilance

- `ce1.json` contient encore des reliquats d'encodage et d'apostrophes echappees.
- Certaines lecons documentaires sont dans la mauvaise matiere.
- Plusieurs lecons de dictee racontent surtout la procedure au lieu d'enseigner une notion.

## Priorites

- `Ajouter` : comprehension, vocabulaire, geometrie, temps, commune, cinq sens.
- `Ajuster` : reclasser les lecons mal placees et clarifier une lecon = une notion.
- `Corriger` : nettoyer `ce1.json` de `\\u0027` et des caracteres remplaces.
- `Perfectionner` : reformuler toutes les lecons au format mini-fiche de manuel.

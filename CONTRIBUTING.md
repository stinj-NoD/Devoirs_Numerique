# Contribution Guide

## Périmètre

Le dépôt est fortement data-driven. Une contribution peut toucher :
- les contenus [data/*.json](d:/Apps%20Dev/Devoirs_Numerique/data)
- les bibliothèques [data/french/*.json](d:/Apps%20Dev/Devoirs_Numerique/data/french)
- l'UI
- les moteurs
- les validateurs
- la documentation

## Règles générales

- ne pas mélanger plusieurs zones critiques sans raison claire
- conserver les `id` stables
- respecter strictement l'UTF-8 et la langue française
- ne pas introduire de `?` parasites, mojibake, `\uXXXX` inutiles ou apostrophes dégradées dans les contenus visibles
- ne pas changer un contrat `engine + params` sans mettre à jour les validateurs
- ne pas modifier la structure `lessons[]` sans mettre à jour :
  - [validators.js](d:/Apps%20Dev/Devoirs_Numerique/js/validators.js)
  - [validate-data.ps1](d:/Apps%20Dev/Devoirs_Numerique/scripts/validate-data.ps1)

## Règles sur les leçons

Une leçon doit :
- porter une notion réelle du programme
- être une mini-fiche de rappel, pas un mode d'emploi de l'application
- être courte, claire et structurée
- utiliser un français correct et accentué

Référence éditoriale :
- [lesson-guidelines.md](d:/Apps%20Dev/Devoirs_Numerique/docs/lesson-guidelines.md)

## Workflow obligatoire

Après tout changement dans `data/` ou `js/validators.js` :

1. lancer [validate-data.ps1](d:/Apps%20Dev/Devoirs_Numerique/scripts/validate-data.ps1)
2. régénérer [data-bundle.js](d:/Apps%20Dev/Devoirs_Numerique/js/data-bundle.js)
3. vérifier au minimum :
   - une leçon
   - un exercice maths
   - un exercice français
   - un exercice documentaire
   - un retour vers résultats

## Conventions de contenu

- `choices` doivent toujours contenir `answer`
- les textes visibles doivent être relus
- éviter les doublons pédagogiques inutiles
- préférer plusieurs petits lots cohérents à une grosse vague instable
- si une catégorie reste trop faible, l'épaissir avant d'ouvrir de nouvelles surfaces visibles

## Conventions de structure

### Sous-thème

Un sous-thème peut contenir :
- `lessons[]`
- `exercises[]`
- ou les deux

### Leçon

Format minimal :

```json
{
  "id": "cm1-lesson-fractions",
  "title": "Lire une fraction",
  "subtitle": "Numérateur et dénominateur",
  "format": "lesson-card",
  "blocks": []
}
```

Blocs supportés :
- `paragraph`
- `example`
- `tip`
- `bullets`
- `mini-table`

## Contributions docs

Toute évolution importante doit être répercutée dans la doc concernée :
- [README.md](d:/Apps%20Dev/Devoirs_Numerique/README.md)
- [technicalaspect.md](d:/Apps%20Dev/Devoirs_Numerique/technicalaspect.md)
- [SECURITY.md](d:/Apps%20Dev/Devoirs_Numerique/SECURITY.md)
- [curriculum-delta-cp-cm2.md](d:/Apps%20Dev/Devoirs_Numerique/docs/curriculum-delta-cp-cm2.md)

## Priorités qualité actuelles

- fiabilité de la structure `lessons[]/blocks[]`
- qualité de langue et d'encodage
- alignement programme des leçons
- homogénéité UI et éditoriale
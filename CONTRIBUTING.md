# Contribution Guide

## Périmètre

Le dépôt est fortement data-driven. Une contribution peut toucher :
- les contenus [data/*.json](data)
- les bibliothèques [data/french/*.json](data/french)
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
  - [validators.js](js/validators.js)
  - [validate-data.ps1](scripts/validate-data.ps1)

## Règles sur les leçons

Une leçon doit :
- porter une notion réelle du programme
- être une mini-fiche de rappel, pas un mode d'emploi de l'application
- être courte, claire et structurée
- utiliser un français correct et accentué

Référence éditoriale :
- [lesson-guidelines.md](docs/lesson-guidelines.md)

## Workflow obligatoire

Après tout changement dans `data/` ou `js/validators.js` :

1. lancer [validate-data.ps1](scripts/validate-data.ps1)
2. lancer `node scripts/build-content-index.js --check` (anti-doublon : ids uniques inter-niveaux + cohérence du registre des moteurs — échoue si un `id` est dupliqué ou si `CONTENT_INDEX.json` est périmé)
3. régénérer [data-bundle.js](js/data-bundle.js) via [regenerate-data-bundle.ps1](scripts/regenerate-data-bundle.ps1)
4. régénérer l'index anti-doublon : `node scripts/build-content-index.js --write` (met à jour `CONTENT_INDEX.json`)
5. lancer les validateurs complémentaires si pertinent : `node scripts/validate-subjects.js`, `node scripts/validate-maps.js` (après ajout d'une carte `map-locate`)
6. vérifier au minimum :
   - une leçon
   - un exercice maths
   - un exercice français
   - un exercice documentaire
   - un retour vers résultats

## Conventions de contenu

- `choices` doivent toujours contenir `answer`
- les textes visibles doivent être relus
- éviter les doublons pédagogiques inutiles : `CONTENT_INDEX.json` (généré) inventorie tous les exercices/leçons et les viviers `dataFile::category` déjà utilisés ; `build-content-index.js --check` les remonte en avertissement. Avant d'ajouter un exercice, vérifier que son vivier n'est pas déjà couvert sur le même sous-thème.
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
- [README.md](README.md)
- [technicalaspect.md](technicalaspect.md)
- [SECURITY.md](SECURITY.md)
- [curriculum-delta-cp-cm2.md](docs/curriculum-delta-cp-cm2.md)
- [maps-architecture.md](docs/maps-architecture.md) pour toute évolution du sous-système `map-locate`
- [grimoire-economy.md](docs/grimoire-economy.md) pour toute évolution de l'économie du Grimoire

## Priorités qualité actuelles

- fiabilité de la structure `lessons[]/blocks[]`
- qualité de langue et d'encodage
- alignement programme des leçons
- homogénéité UI et éditoriale
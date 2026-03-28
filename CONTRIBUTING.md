# Contribution Guide

## Perimetre

Ce depot est data-driven. Une contribution peut toucher :
- les contenus `data/*.json`
- les renderers UI
- les engines
- la documentation

## Regles de modification

- ne pas changer plusieurs zones critiques dans le meme lot
- ne pas changer le contrat `engine + params` sans mettre a jour les validateurs
- ne pas modifier `js/app.js`, `js/ui.js` et `js/engines.js` en meme temps sans raison explicite
- regenerer `js/data-bundle.js` apres tout changement dans `data/`

## Checks obligatoires

1. lancer `scripts/validate-data.ps1`
2. si les contenus changent, relancer `scripts/regenerate-data-bundle.ps1`
3. si des images sont ajoutees ou retirees, lancer `scripts/inventory-assets.ps1`
4. verifier manuellement au moins :
   - un exercice math
   - un exercice francais
   - un QCM documentaire
   - une frise

## Conventions data

- garder les `id` stables
- ne pas introduire de doublons dans `grades`, `themes`, `exercises`
- fournir `choices` coherents avec `answer`
- garder les textes en UTF-8

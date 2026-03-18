# Devoir Numérique

Application éducative web en Vanilla JavaScript, data-driven, du CP au CM2.

Le projet fonctionne :
- sans framework front
- sans backend
- avec stockage local
- avec contenus JSON versionnés
- avec mode offline/PWA

## État du projet

Le projet est aujourd’hui stabilisé sur trois axes :
- couverture pédagogique CP à CM2
- navigation homogène `niveau -> matière -> sous-thème -> exercice`
- robustesse locale/offline renforcée

État actuel :
- mathématiques, français, histoire, géographie, sciences et EMC présents sur tous les niveaux
- bibliothèque française modulaire dans `data/french/`
- moteurs de grammaire en contexte et dictée audio en service
- service worker et bundle local alignés avec la structure actuelle

## Vue d’ensemble

`Devoir Numérique` est une SPA pédagogique qui charge :
- un index des niveaux dans `data/index.json`
- un fichier de niveau par classe : `cp.json`, `ce1.json`, `ce2.json`, `cm1.json`, `cm2.json`
- une bibliothèque de langue modulaire :
  - `data/french/spelling.json`
  - `data/french/conjugation.json`
  - `data/french/homophones.json`
  - `data/french/grammar.json`
  - `data/french/reading.json`

L’application gère :
- profils locaux
- scores et étoiles par exercice
- claviers virtuels
- exercices visuels, textuels et documentaires
- fallback offline/local via `js/data-bundle.js`

## Stack

- HTML
- CSS
- JavaScript ES6+
- JSON data-driven
- Service Worker
- `localStorage`

## Architecture actuelle

### Fichiers principaux

- `index.html` : shell SPA
- `css/app.css` : styles globaux, responsive, surfaces d’exercice
- `js/app.js` : orchestration, navigation, cycle de jeu, audio, offline local
- `js/ui.js` : façade UI et rendu DOM principal
- `js/ui-keyboards.js` : claviers virtuels
- `js/ui-visuals.js` : renderers visuels maths
- `js/ui-documentary.js` : renderers documentaires et frises
- `js/engines.js` : point d’entrée des moteurs
- `js/engines-core.js` : utilitaires communs
- `js/engines-math.js` : générateurs maths / logique
- `js/engines-french.js` : générateurs français
- `js/engines-documentary.js` : générateurs documentaires et frises
- `js/storage.js` : profils, utilisateur courant, records
- `js/validators.js` : validation runtime des JSON
- `js/data-bundle.js` : bundle embarqué pour mode local/offline
- `sw.js` : cache offline/PWA
- `offline.html` : page de secours hors ligne

### Principe de fonctionnement

1. `App.init()` charge la bibliothèque française modulaire.
2. L’application charge `data/index.json`.
3. L’utilisateur choisit un profil puis une classe.
4. Le JSON du niveau expose ses matières, sous-thèmes et exercices.
5. Un moteur génère un problème standardisé.
6. `UI` rend le problème selon sa famille visuelle.
7. La réponse est validée, puis le score local est mis à jour.

## Contenu pédagogique

### Niveaux disponibles

- CP
- CE1
- CE2
- CM1
- CM2

### Matières actuellement présentes

- Mathématiques
- Français
- Histoire
- Géographie
- Sciences
- EMC

### Français

Le français repose sur 5 bibliothèques spécialisées :
- orthographe lexicale
- conjugaison
- homophones
- grammaire
- lecture

Couverture actuelle :
- dictées visuelles
- dictées audio CP / CE1
- homophones
- conjugaison
- grammaire de genre / article
- grammaire en contexte via phrase à trou
- lecture syllabique CP

### Documentaires

Les documentaires utilisent principalement :
- `engine: "choice-engine"`
- `params.type: "factual-qcm"`
- `params.dataFile: "data/<matiere>_<niveau>.json"`
- `params.category: "<categorie>"`

Les frises historiques utilisent :
- `engine: "timeline"`
- `params.dataFile: "data/history_chrono.json"`

## Moteurs en service

Moteurs principaux :
- `math-input`
- `choice-engine`
- `conjugation`
- `conversion`
- `clock`
- `reading`
- `audio-spelling`
- `timeline`
- `counting`

Sous-types français et documentaires notables :
- `factual-qcm`
- `gender-articles`
- `article-choice`
- `plural-choice`
- `word-class-choice`
- `grammar-cloze`
- `homophone-duel`

## Contrat data actuel

### Index

`data/index.json` déclare les niveaux via `grades[]`.

### Niveau

Le contrat principal est maintenant :
- `gradeId`
- `title`
- `subjects[]`

Chaque matière contient :
- `id`
- `title`
- `icon`
- `subthemes[]`

Chaque sous-thème contient :
- `id`
- `title`
- `icon`
- `exercises[]`

Chaque exercice contient :
- `id`
- `title`
- `subtitle`
- `engine`
- `params`

Compatibilité :
- le runtime sait encore lire `themes[]`
- le corpus actuel CP → CM2 est déjà migré sur `subjects[]`

### Bibliothèques et datasets

- les bibliothèques françaises vivent dans `data/french/*.json`
- les datasets documentaires vivent dans `data/<matiere>_<niveau>.json`
- les frises vivent dans `data/history_chrono.json`

## Workflow local

1. Servir le projet depuis un serveur statique local.
2. Vérifier les données avec :

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\validate-data.ps1
```

3. Régénérer le bundle embarqué après toute modification de `data/` :

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\regenerate-data-bundle.ps1
```

4. Optionnellement rafraîchir les données locales via :

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\refresh-local-data.ps1
```

## Vérification manuelle minimale

- création et sélection de profil
- chargement d’un niveau
- parcours `matière -> sous-thème -> exercice`
- lancement d’un exercice `math-input`
- lancement d’un exercice `choice-engine`
- lancement d’un exercice `timeline`
- lancement d’une dictée audio
- retour résultats et sauvegarde du score
- vérification hors connexion après activation du service worker

## Offline et mode local

Le projet peut être ouvert :
- via un serveur local classique
- en local avec fallback embarqué via `js/data-bundle.js`
- en PWA cachée via `sw.js`

Le service worker pré-cache :
- les assets applicatifs
- les JSON critiques
- la bibliothèque française modulaire

## Stockage local

Les données utilisateur sont stockées en `localStorage` :
- profils
- profil courant
- records par niveau / exercice

Le stockage a été durci pour :
- nettoyer les noms de profils
- refuser les doublons logiques
- ignorer les records corrompus
- borner les valeurs de score
- réconcilier proprement l’utilisateur courant

## Audit rapide

### Solide aujourd’hui

- structure data-driven claire
- navigation homogène sur tous les niveaux
- bibliothèque française modulaire
- grammaire plus riche qu’au départ
- offline/local aligné avec le corpus réel

### À poursuivre

- enrichir encore la grammaire en contexte
- reprendre plus tard la qualité audio du moteur `audio-spelling`
- enrichir CE1 / CE2 en lecture-compréhension si le chantier est relancé
- réduire la densité de `js/ui.js`

## Documentation associée

- `technicalaspect.md` : référence technique
- `SECURITY.md` : sécurité et robustesse

## Licence

GNU GPL v3

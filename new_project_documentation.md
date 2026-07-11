# Devoir Numérique - Documentation Complète

Application éducative web en Vanilla JavaScript, data-driven, du CP au CM2. Ce document fournit une vue d'ensemble exhaustive du projet, de son architecture à ses aspects techniques et de sécurité.

## État du projet

Le projet est aujourd’hui stabilisé sur trois axes :
- couverture pédagogique CP à CM2
- navigation homogène `niveau -> matière -> sous-thème -> exercice`
- robustesse locale/offline renforcée

État actuel :
- mathématiques, français, histoire, géographie, sciences et EMC présents sur tous les niveaux (775+ exercices)
- bibliothèque française modulaire dans `data/french/`
- moteurs de grammaire en contexte et dictée audio en service
- activités interactives non-QCM (`board-interactive`) : cartes à toucher, classement de figures, mémoire, point sur quadrillage, symétrie, fraction à construire, carte à localiser
- lecture de graphiques en barres (`bar-chart-read`), gamification par badges, série de jours
- bouton de mise à jour forcée de l'application (menu ☰), utile sur iOS où le service worker peut rester bloqué sur une ancienne version
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

## Stack Technique

- HTML
- CSS
- JavaScript ES6+
- JSON data-driven
- Service Worker
- `localStorage`

## Architecture Détaillée

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
- `js/engines-board.js` : générateurs des activités interactives non-QCM
- `js/ui-board.js` : rendu des activités interactives
- `js/storage.js` : profils, utilisateur courant, records, badges
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

### Rôles des modules

- **`app.js`**
  Responsable de :
  - l’initialisation globale
  - la navigation SPA
  - le chargement résilient des JSON
  - l’injection des datasets dans les engines
  - le cycle question -> validation -> score -> résultat
  - la gestion de la synthèse vocale pour `audio-spelling`
  - les garde-fous runtime sur les états incohérents

- **`ui.js`**
  Responsable de :
  - l’affichage des écrans
  - la façade UI publique
  - la composition des cartes, sous-thèmes et surfaces d’exercice
  - la délégation vers :
    - `ui-keyboards.js`
    - `ui-visuals.js`
    - `ui-documentary.js`

- **`engines.js`**
  Responsable de :
  - exposer `run()`
  - standardiser le point d’entrée des moteurs
  - déléguer vers :
    - `engines-core.js`
    - `engines-math.js`
    - `engines-french.js`
    - `engines-documentary.js`
    - `engines-board.js`

- **`storage.js`**
  Responsable de :
  - profils
  - utilisateur courant
  - records
  - badges (étoiles, sans-faute, séries, exercices essayés)
  - sanitation et durcissement du stockage local

- **`validators.js`**
  Responsable de :
  - vérifier la forme minimale des JSON chargés
  - vérifier la bibliothèque française modulaire
  - vérifier les datasets documentaires et frises
  - éviter les états incohérents au runtime

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

### Structure des Leçons (Lessons Structure)

Les fichiers de niveau (`cm1.json`, `cm2.json`, etc.) peuvent inclure des blocs de leçons structurés. Ces leçons sont composées d'éléments variés pour une présentation pédagogique riche :
- `paragraph`: Texte simple.
- `example`: Exemple illustratif.
- `mini-table`: Petits tableaux de données.
- `bullets`: Listes à puces.
- `tip`: Conseils ou astuces.

## Moteurs en service

Moteurs principaux (`engine` dans les exercices) :
- `choice-engine` (le plus utilisé)
- `math-input`
- `matching`
- `audio-spelling`
- `conjugation`
- `board-interactive`
- `reading`
- `conversion`
- `timeline`
- `clock`
- `word-order`
- `cloze-fill-in`
- `counting`

Types `board-interactive` (`params.type`, gérés par `engines-board.js` / `ui-board.js`) :
- `map-locate` : toucher une zone sur une carte SVG
- `tap-features` : toucher les bons éléments d'un schéma
- `memory-match` : jeu de mémoire par paires
- `symmetry-complete` : compléter une figure symétrique sur quadrillage
- `point-on-grid` : placer un point sur un quadrillage
- `fraction-build` : construire une fraction en touchant des parts de disque
- `shape-classify` : classer des figures par glisser/cliquer

Sous-types maths notables (`params.type` pour `math-input`) :
- `proportionnalite`, `pourcentage`, `echelle`, `vitesse` (proportionnalité et grandeurs)
- `bar-chart-read` : lecture de diagramme en barres (max/min/valeur/total/différence)
- `carre-somme` : carré magique, avec `solutionCount` (2 valeurs en CP, 3 dès CE2)

Sous-types français et documentaires notables :
- `factual-qcm`
- `gender-articles`
- `article-choice`
- `plural-choice`
- `word-class-choice` (inclut la fonction des mots : sujet/verbe/complément en CM1-CM2)
- `grammar-cloze`
- `homophone-duel`

## Contrat de Données (Data Contract)

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
powershell -ExecutionPolicy Bypass -File .\scripts/regenerate-data-bundle.ps1
```

4. Optionnellement rafraîchir les données locales via :

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts/refresh-local-data.ps1
```

## Offline et mode local

Le projet peut être ouvert :
- via un serveur local classique
- en local avec fallback embarqué via `js/data-bundle.js`
- en PWA cachée via `sw.js`

Le service worker pré-cache :
- les assets applicatifs
- les JSON critiques (l'ensemble de `data/`, y compris les datasets `board_*`, `math_word_problems_*`, `french_*_reading`)
- la bibliothèque française modulaire

`CACHE_NAME` (dans `sw.js`) doit être incrémenté à chaque déploiement de contenu ou de code, sinon le navigateur ne détecte jamais la nouvelle version (particulièrement sensible sur iOS/Safari). Le bouton « Mettre à jour l'application » (menu ☰, `App.forceAppUpdate()`) force la vérification immédiate sans attendre le cycle automatique du navigateur.

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

## Sécurité et Robustesse

### Périmètre

Le projet est une application front-only :
- pas de backend
- pas d’authentification serveur
- stockage local via `localStorage`
- rendu HTML généré côté client
- service worker actif pour le mode offline/PWA
- bibliothèque française modulaire chargée depuis `data/french/*.json`

La sécurité vise donc surtout :
- la robustesse des données
- la réduction des états incohérents
- la fiabilité du mode offline
- la limitation des comportements fragiles côté client

### Durcissements en place

1.  **Validation des données**
    - `js/validators.js` contrôle :
      - `data/index.json`
      - les fichiers de niveau
      - les exercices
      - la bibliothèque française modulaire
      - les datasets `factual-qcm`
      - les datasets `timeline`
    - `scripts/validate-data.ps1` vérifie l’ensemble du corpus avant runtime
    - les exercices invalides sont bloqués avant exécution
    - les problèmes invalides sont bloqués avant rendu

2.  **Protection du runtime**
    - `js/app.js` ajoute des garde-fous sur :
      - niveau invalide
      - matière ou sous-thème vide
      - exercice sans paramètres exploitables
      - question moteur sans `answer`
      - affichage de résultats sans total valide
    - un chemin de sortie de secours remet l’état dans une situation saine si un exercice devient incohérent
    - les choix QCM sont mélangés à la génération pour éviter les schémas de clics trop prévisibles

3.  **Durcissement des profils**
    - `js/storage.js` normalise les noms de profils
    - les noms sont nettoyés et limités
    - les doublons logiques sont refusés
    - les noms vides, trop courts ou invalides sont bloqués

4.  **Durcissement du stockage local**
    - lecture défensive du JSON issu de `localStorage`
    - nettoyage des records invalides ou corrompus
    - vérification d’intégrité via hash simple des records
    - bornage de `score`, `total`, `percent`, `stars`
    - résolution canonique du profil courant

    Important :
    - `localStorage` n’est pas un mécanisme de sécurité fort
    - il sert ici à contenir les erreurs et manipulations triviales, pas à protéger contre un attaquant local déterminé

5.  **Durcissement offline/PWA**
    - `sw.js` pré-cache les assets applicatifs critiques
    - `sw.js` pré-cache l'ensemble des datasets utiles au fonctionnement offline
    - les anciens caches sont purgés au changement de version
    - le fallback `offline.html` est renvoyé pour les navigations hors ligne
    - seules les origines internes et les fonts whitelistees sont prises en compte
    - le service worker ne référence plus de bibliothèque française legacy
    - un bouton de mise à jour manuelle (`App.forceAppUpdate()`) permet de forcer la détection d'une nouvelle version sans attendre le cycle automatique du navigateur

6.  **Audio côté navigateur**
    - la dictée audio repose sur `speechSynthesis`
    - l’application détecte sa disponibilité avant usage
    - la lecture en cours peut être annulée proprement
    - un état UI explicite évite les doubles clics pendant la lecture

    Limite :
    - la qualité de la voix dépend du navigateur et du système hôte
    - ce mécanisme améliore l’usage, mais ne constitue pas une surface de sécurité forte

### Points sensibles

- les contenus JSON influencent le rendu visuel et le comportement pédagogique
- toute régression du service worker impacte directement le mode offline
- les renderers UI utilisent encore du HTML généré côté client
- `js/ui.js` reste dense, donc plus exposé aux régressions de maintenance
- le moteur audio dépend des voix françaises disponibles localement

### Règles de maintenance

- valider les JSON avant runtime
- ne pas introduire de contenu HTML arbitraire dans `data/*.json`
- vérifier local/offline après changement de `sw.js`
- régénérer `js/data-bundle.js` après changement dans `data/`
- ne pas traiter `localStorage` comme une source totalement fiable
- garder les bibliothèques françaises synchronisées avec leur contrat de validation

### Vérification manuelle recommandée

- création et sélection de profil
- refus profil vide / trop court / dupliqué
- lancement exercice simple
- lancement exercice documentaire
- lancement dictée audio
- sauvegarde du score
- recharge navigateur
- vérification de l’état des profils et records
- vérification hors ligne avec service worker actif

### Limites connues

- pas de tests automatisés de sécurité
- pas de chiffrement du stockage local
- pas de protection serveur, l’application étant purement front-end
- hash de record utile contre la corruption simple, pas contre une falsification locale avancée
- qualité audio dépendante de `speechSynthesis`

## Licence

GNU GPL v3
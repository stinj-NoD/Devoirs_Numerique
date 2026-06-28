## Technical Aspect

Document de référence technique de `Devoir Numérique`.

## 1. Architecture générale

Le projet est une SPA en JavaScript vanilla.

Principes structurants :
- contenu piloté par JSON
- séparation entre données, moteurs, rendu UI et stockage
- exécution 100% locale
- fonctionnement offline via service worker et bundle embarqué
- coexistence de deux parcours : `J'apprends` et `Je m'entraîne`

## 2. Structure du projet

- [index.html](index.html)
- [css/app.css](css/app.css)
- [js/app.js](js/app.js)
- [js/ui.js](js/ui.js)
- [js/ui-keyboards.js](js/ui-keyboards.js)
- [js/ui-visuals.js](js/ui-visuals.js)
- [js/ui-documentary.js](js/ui-documentary.js)
- [js/engines.js](js/engines.js)
- [js/engines-core.js](js/engines-core.js)
- [js/engines-math.js](js/engines-math.js)
- [js/engines-french.js](js/engines-french.js)
- [js/engines-documentary.js](js/engines-documentary.js)
- [js/engines-board.js](js/engines-board.js)
- [js/ui-board.js](js/ui-board.js)
- [js/storage.js](js/storage.js)
- [js/validators.js](js/validators.js)
- [js/data-bundle.js](js/data-bundle.js)
- [data/](data)
- [data/french/](data/french)
- [scripts/validate-data.ps1](scripts/validate-data.ps1)
- [scripts/regenerate-data-bundle.ps1](scripts/regenerate-data-bundle.ps1)
- [sw.js](sw.js)

## 3. Responsabilités des modules

### `app.js`

Responsable de :
- l'initialisation globale
- la navigation SPA
- le chargement des niveaux
- le split `J'apprends / Je m'entraîne`
- l'ouverture des leçons
- le cycle question -> correction -> score -> résultat
- le retour vers la leçon depuis les résultats

### `ui.js`

Responsable de :
- l'affichage des écrans
- les cartes de profils, niveaux, matières, sous-thèmes, leçons et exercices
- le rendu des blocs de leçon
- la composition des sections et badges

### `engines*.js`

Responsables de :
- la génération des questions
- la normalisation des sorties moteur
- les moteurs maths, français et documentaires
- `engines-board.js` : activités interactives non-QCM (cartes à toucher, classement de figures, mémoire, point sur quadrillage, symétrie, fraction à construire, carte à localiser, lecture de graphique)

### `storage.js`

Responsable de :
- la gestion des profils
- l'utilisateur courant
- les records par exercice
- les badges et la série de jours consécutifs
- les fallbacks de stockage

### `validators.js`

Responsable de :
- valider la structure des niveaux
- valider les exercices
- valider les leçons et blocs de leçon
- sécuriser le chargement runtime avant affichage

## 4. Modèle de données actuel

### Niveau

```json
{
  "gradeId": "ce2",
  "title": "CE2",
  "subjects": []
}
```

### Matière

```json
{
  "id": "ce2-maths-subject",
  "title": "Mathématiques",
  "icon": "📘",
  "subthemes": []
}
```

### Sous-thème

```json
{
  "id": "ce2-multiplication",
  "title": "Tables de multiplication",
  "icon": "📘",
  "lessons": [],
  "exercises": []
}
```

### Leçon

```json
{
  "id": "ce2-lesson-present-er",
  "title": "Le présent des verbes en -ER",
  "subtitle": "Observer, retenir, appliquer",
  "format": "lesson-card",
  "blocks": []
}
```

### Blocs de leçon supportés

- `paragraph`
- `example`
- `tip`
- `bullets`
- `mini-table`

## 5. Navigation produit

Flux actuel :

1. profils
2. classe
3. parcours
4. matière ou bibliothèque globale des leçons
5. sous-thème
6. leçon ou exercice
7. résultats

Le mode `J'apprends` s'appuie sur une bibliothèque globale par niveau. Le mode `Je m'entraîne` reste centré sur les sous-thèmes et exercices.

## 6. Validation technique

Deux couches doivent rester synchronisées :

- validation frontend :
  - [validators.js](js/validators.js)
- validation hors runtime :
  - [validate-data.ps1](scripts/validate-data.ps1)

Règle absolue :
- aucun changement de contrat JSON sans mise à jour des deux validateurs

## 7. Bundle et offline

Le projet embarque un bundle local :
- [data-bundle.js](js/data-bundle.js)

Il sert :
- de fallback de chargement
- d'appui à l'offline
- de sécurité locale quand les JSON externes ne sont pas disponibles

Le service worker :
- versionne les caches via `CACHE_NAME` dans [sw.js](sw.js)
- purge les anciens caches
- garantit un minimum de fonctionnement hors ligne

**Important** : `CACHE_NAME` doit être incrémenté à chaque déploiement qui modifie du contenu (`data/*.json`) ou du code. Sans ce changement, le navigateur considère `sw.js` identique et ne télécharge jamais la nouvelle version, même en rechargeant la page — c'est particulièrement sensible sur iOS/Safari.

Un bouton « Mettre à jour l'application » (menu ☰, `App.forceAppUpdate()` dans [app.js](js/app.js)) permet à l'utilisateur de forcer la vérification immédiate : `registration.update()`, puis activation du nouveau worker (`SKIP_WAITING`) et rechargement automatique dès qu'une nouvelle version est détectée.

## 8. Dette technique restante

Les points encore sensibles sont :
- reliquats d'encodage UTF-8 dans certains fichiers historiques
- cohérence pédagogique des leçons
- hétérogénéité éditoriale entre niveaux
- besoin d'un suivi plus fin des usages leçon/exercice
- `CACHE_NAME` (sw.js) à incrémenter manuellement à chaque déploiement de contenu

## 9. Cap suivant

Le cap produit/technique n'est plus la structure, mais :
- améliorer la qualité du corpus
- densifier les notions manquantes
- renforcer la bibliothèque des leçons comme outil de révision
- préparer à terme un meilleur suivi de progression
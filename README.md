# Devoir Numérique

Application éducative web, locale et offline-first, du `CP` au `CM2`.

Le projet est une SPA en JavaScript vanilla, sans backend, pilotée par des fichiers JSON versionnés. Il combine désormais deux parcours complémentaires :
- `J'apprends` : bibliothèque de leçons courtes par niveau, matière et sous-thème
- `Je m'entraîne` : exercices interactifs générés par moteurs

## État actuel

Le socle est aujourd'hui stable sur quatre axes :
- navigation locale profils -> classe -> parcours -> matière -> sous-thème
- bibliothèque globale de leçons par niveau
- corpus de 775+ exercices CP à CM2 sur maths, français, histoire, géographie, sciences et EMC
- validation forte des données avant runtime et bundle offline régénéré

Le projet propose aussi :
- des activités interactives non-QCM (`board-interactive` : cartes à toucher, classement de figures, mémoire, fractions à construire, lecture de graphiques...)
- un système de badges et de collection pour suivre la progression
- une mise à jour forcée de l'application depuis le menu (utile sur iOS, où le service worker peut rester bloqué sur une ancienne version)

Le projet continue par ailleurs son alignement pédagogique :
- leçons conformes au programme scolaire français
- qualité de langue et encodage UTF-8 strict
- meilleure couverture des notions encore partielles

## Fonctionnement

L'application charge :
- [data/index.json](data/index.json)
- un fichier de niveau par classe :
  - [cp.json](data/cp.json)
  - [ce1.json](data/ce1.json)
  - [ce2.json](data/ce2.json)
  - [cm1.json](data/cm1.json)
  - [cm2.json](data/cm2.json)
- une bibliothèque de langue modulaire :
  - [spelling.json](data/french/spelling.json)
  - [conjugation.json](data/french/conjugation.json)
  - [homophones.json](data/french/homophones.json)
  - [grammar.json](data/french/grammar.json)
  - [reading.json](data/french/reading.json)

Elle gère :
- profils locaux
- scores et étoiles
- progression simple par exercice
- mode offline via service worker
- fallback données via [data-bundle.js](js/data-bundle.js)

## Architecture

Fichiers principaux :
- [index.html](index.html) : shell SPA
- [app.css](css/app.css) : styles globaux
- [app.js](js/app.js) : orchestration, navigation, runtime
- [ui.js](js/ui.js) : rendu UI et cartes
- [ui-keyboards.js](js/ui-keyboards.js) : claviers virtuels
- [ui-visuals.js](js/ui-visuals.js) : rendu visuel maths
- [ui-documentary.js](js/ui-documentary.js) : rendu documentaire et frises
- [engines.js](js/engines.js) : point d'entrée des moteurs
- [engines-core.js](js/engines-core.js) : utilitaires partagés (random, mélange, sélection)
- [engines-math.js](js/engines-math.js)
- [engines-french.js](js/engines-french.js)
- [engines-documentary.js](js/engines-documentary.js)
- [engines-board.js](js/engines-board.js) : activités interactives (cartes, classement, mémoire, fractions...)
- [ui-board.js](js/ui-board.js) : rendu des activités interactives
- [storage.js](js/storage.js) : profils, records et badges
- [validators.js](js/validators.js) : validation runtime
- [validate-data.ps1](scripts/validate-data.ps1) : validation hors runtime
- [sw.js](sw.js) : cache offline/PWA

## Structure des niveaux

Chaque niveau expose des `subjects`, puis des `subthemes`.

Un sous-thème peut contenir :
- `lessons[]`
- `exercises[]`
- ou les deux

Format minimal d'une leçon :

```json
{
  "id": "ce2-lesson-present-er",
  "title": "Le présent des verbes en -ER",
  "subtitle": "Observer, retenir, appliquer",
  "format": "lesson-card",
  "blocks": [
    { "type": "paragraph", "text": "..." },
    { "type": "example", "label": "Exemple", "content": "..." },
    { "type": "tip", "label": "À retenir", "content": "..." }
  ]
}
```

Blocs supportés :
- `paragraph`
- `example`
- `tip`
- `bullets`
- `mini-table`

## Parcours utilisateur

1. choix ou création d'un profil
2. choix d'une classe
3. choix du parcours :
   - `J'apprends`
   - `Je m'entraîne`
4. sélection d'une matière
5. sélection d'un sous-thème
6. consultation d'une leçon ou lancement d'un exercice

Le flux de résultats permet aussi un retour vers la ou les leçons du sous-thème.

## Documentation utile

- [technicalaspect.md](technicalaspect.md) : référence technique
- [SECURITY.md](SECURITY.md) : sécurité et robustesse
- [CONTRIBUTING.md](CONTRIBUTING.md) : règles de contribution
- [CONTENT_ARCHITECTURE.md](CONTENT_ARCHITECTURE.md) : détail des leçons/exercices par niveau et matière (généré depuis `data/`)
- [lesson-guidelines.md](docs/lesson-guidelines.md) : règles éditoriales des leçons
- [curriculum-delta-cp-cm2.md](docs/curriculum-delta-cp-cm2.md) : delta programme vs application
- [content-production-backlog.md](docs/content-production-backlog.md) : historique et backlog de production

## Workflow minimal

Après toute modification de `data/` :

1. lancer [validate-data.ps1](scripts/validate-data.ps1)
2. régénérer [data-bundle.js](js/data-bundle.js)
3. vérifier au moins :
   - une leçon
   - un exercice maths
   - un exercice français
   - un exercice documentaire

## Direction produit

Les prochaines vagues visent :
- des leçons plus proches d'un manuel scolaire concis
- une couverture plus complète des notions du programme
- une qualité de langue irréprochable
- une UX unifiée entre révision et entraînement
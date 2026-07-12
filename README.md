# Devoir Numérique

Application éducative web, locale et offline-first, du `CP` au `CM2`.

Le projet est une SPA en JavaScript vanilla — **sans backend, sans build step, sans framework, sans `package.json`** — pilotée par des fichiers JSON versionnés. HTML/CSS/JS sont servis tels quels et fonctionnent aussi bien en ouverture directe (`file://`) que sur GitHub Pages. Il combine deux parcours complémentaires :
- `J'apprends` : bibliothèque de leçons courtes par niveau, matière et sous-thème
- `Je m'entraîne` : exercices interactifs générés par moteurs

Une couche de gamification annexe (le **Grimoire**) vient soutenir l'engagement : cartes à collectionner via boosters achetés avec des pièces gagnées en jouant, évolution d'avatar, Mode Champions chronométré, Grand Quiz cross-profil.

## État actuel

Le socle est aujourd'hui stable sur quatre axes :
- navigation locale profils -> classe -> parcours -> matière -> sous-thème
- bibliothèque globale de leçons par niveau
- corpus de **775 exercices et 275 leçons** CP à CM2 sur maths, français, histoire, géographie, sciences et EMC (chiffres de [CONTENT_ARCHITECTURE.md](CONTENT_ARCHITECTURE.md), généré depuis `data/`)
- validation forte des données avant runtime et bundle offline régénéré

Le projet propose aussi :
- des activités interactives non-QCM (`board-interactive` : cartes à toucher, classement de figures, mémoire, fractions à construire, symétrie, cartes interactives `map-locate`, lecture de graphiques...)
- un système Grimoire complet : économie de pièces, boosters, collection de cartes, arbre d'évolution d'avatar (voir [grimoire-economy.md](docs/grimoire-economy.md))
- un système de badges de maîtrise par matière et de séries de jours consécutifs (streak) pour suivre la progression
- un Mode Champions (épreuve chronométrée) et un Grand Quiz cross-profil
- PIN parental et export/import complet des données d'un profil
- une mise à jour forcée de l'application depuis le menu (utile sur iOS, où le service worker peut rester bloqué sur une ancienne version)

Le projet continue par ailleurs son alignement pédagogique :
- leçons conformes au programme scolaire français (voir les audits par niveau dans `docs/curriculum-audit-*.md`)
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
- [app.js](js/app.js) : orchestration, navigation, runtime, Grimoire, Mode Champions, Grand Quiz
- [bootstrap.js](js/bootstrap.js) : amorçage, désenregistrement du service worker en dev local
- [security.js](js/security.js) : échappement HTML/attributs, sanitation des IDs (`SecurityUtils`)
- [ui.js](js/ui.js) : rendu UI et cartes
- [ui-keyboards.js](js/ui-keyboards.js) : claviers virtuels
- [ui-visuals.js](js/ui-visuals.js) : rendu visuel maths
- [ui-documentary.js](js/ui-documentary.js) : rendu documentaire et frises
- [ui-board.js](js/ui-board.js) : rendu des activités interactives
- [audio-feedback.js](js/audio-feedback.js) : retours sonores
- [engines.js](js/engines.js) : point d'entrée des moteurs (`Engines.run`)
- [engines-core.js](js/engines-core.js) : utilitaires partagés (random, mélange, sélection sans répétition)
- [engines-math.js](js/engines-math.js)
- [engines-french.js](js/engines-french.js)
- [engines-documentary.js](js/engines-documentary.js)
- [engines-board.js](js/engines-board.js) : activités interactives (cartes, classement, mémoire, fractions, cartes `map-locate`...)
- [storage.js](js/storage.js) : profils, records, badges, économie Grimoire, streak, PIN parental, export/import
- [validators.js](js/validators.js) : validation runtime
- [data-bundle.js](js/data-bundle.js) : bundle `data/**/*.{json,svg}` encodé en base64 pour `file://` et le fallback offline
- [sw.js](sw.js) : cache offline/PWA
- [preview-local.html](preview-local.html) : aperçu autonome des leçons hors flux SPA complet, utile pour itérer vite sur le contenu

Scripts (`scripts/`, PowerShell ou Node pur, sans dépendance npm) :
- [validate-data.ps1](scripts/validate-data.ps1) : validation hors runtime des données (à lancer après tout changement dans `data/`)
- [regenerate-data-bundle.ps1](scripts/regenerate-data-bundle.ps1) : régénère `js/data-bundle.js`
- `validate-subjects.js` : vérifie que chaque sujet des 5 niveaux est reconnu par `Storage.canonicalizeSubjectId`
- `validate-maps.js` : cohérence croisée des cartes interactives `map-locate` (SVG, banque de questions, collection)
- `repair-json-encoding.ps1` / `fix-french-lib-visible.ps1` / `repair-french-lib.ps1` : réparation du mojibake UTF-8 récurrent dans les JSON historiques
- `inventory-assets.ps1`, `enrich-documentary-data.ps1`, `refresh-local-data.ps1` : utilitaires de contenu
- `process-card-images.py` : pipeline images de cartes du Grimoire (PNG → WebP, intégration catalogue)

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

Le **Grimoire** est accessible en dehors de ce parcours principal, via un bouton dédié du menu.

## Documentation utile

- [technicalaspect.md](technicalaspect.md) : référence technique
- [SECURITY.md](SECURITY.md) : sécurité et robustesse
- [CONTRIBUTING.md](CONTRIBUTING.md) : règles de contribution
- [CONTENT_ARCHITECTURE.md](CONTENT_ARCHITECTURE.md) : détail des leçons/exercices par niveau et matière (généré depuis `data/`)
- [lesson-guidelines.md](docs/lesson-guidelines.md) : règles éditoriales des leçons
- [maps-architecture.md](docs/maps-architecture.md) : sous-système des cartes interactives `map-locate`
- [grimoire-economy.md](docs/grimoire-economy.md) : équilibrage économique du système de cartes à collectionner
- [curriculum-delta-cp-cm2.md](docs/curriculum-delta-cp-cm2.md) : delta programme vs application
- `docs/curriculum-audit-{cp,ce1,ce2,cm1,cm2}.md` : audits d'alignement avec le programme scolaire, par niveau
- `docs/content-quality-audit-{cp,ce1,ce2,cm1,cm2}.md` : audits de qualité pédagogique, par niveau
- [content-production-backlog.md](docs/content-production-backlog.md) : historique et backlog de production
- [platform-target.md](docs/platform-target.md), [storage-gap.md](docs/storage-gap.md) : notes de plateforme et de stockage

## Workflow minimal

Après toute modification de `data/` :

1. lancer [validate-data.ps1](scripts/validate-data.ps1)
2. régénérer le bundle offline avec [regenerate-data-bundle.ps1](scripts/regenerate-data-bundle.ps1)
3. lancer les validateurs complémentaires si pertinent :
   - `node scripts/validate-subjects.js` (sujets reconnus pour les badges)
   - `node scripts/validate-maps.js` (après ajout d'une carte `map-locate` ou d'un exercice `board-interactive`)
4. vérifier manuellement au moins :
   - une leçon
   - un exercice maths
   - un exercice français
   - un exercice documentaire
   - un retour vers les résultats

## Direction produit

Les prochaines vagues visent :
- des leçons plus proches d'un manuel scolaire concis
- une couverture plus complète des notions du programme
- une qualité de langue irréprochable
- une UX unifiée entre révision et entraînement
# Devoir Numérique

Application éducative web, locale et offline-first, du `CP` au `CM2`.

Le projet est une SPA en JavaScript vanilla, sans backend, pilotée par des fichiers JSON versionnés. Il combine désormais deux parcours complémentaires :
- `J'apprends` : bibliothèque de leçons courtes par niveau, matière et sous-thème
- `Je m'entraîne` : exercices interactifs générés par moteurs

## État actuel

Le socle est aujourd'hui stable sur quatre axes :
- navigation locale profils -> classe -> parcours -> matière -> sous-thème
- bibliothèque globale de leçons par niveau
- corpus d'exercices CP à CM2 sur maths, français, histoire, géographie, sciences et EMC
- validation forte des données avant runtime et bundle offline régénéré

Le projet vise maintenant moins l'ajout brut de contenu que l'alignement pédagogique :
- leçons conformes au programme scolaire français
- qualité de langue et encodage UTF-8 strict
- meilleure couverture des notions encore partielles

## Fonctionnement

L'application charge :
- [data/index.json](d:/Apps%20Dev/Devoirs_Numerique/data/index.json)
- un fichier de niveau par classe :
  - [cp.json](d:/Apps%20Dev/Devoirs_Numerique/data/cp.json)
  - [ce1.json](d:/Apps%20Dev/Devoirs_Numerique/data/ce1.json)
  - [ce2.json](d:/Apps%20Dev/Devoirs_Numerique/data/ce2.json)
  - [cm1.json](d:/Apps%20Dev/Devoirs_Numerique/data/cm1.json)
  - [cm2.json](d:/Apps%20Dev/Devoirs_Numerique/data/cm2.json)
- une bibliothèque de langue modulaire :
  - [spelling.json](d:/Apps%20Dev/Devoirs_Numerique/data/french/spelling.json)
  - [conjugation.json](d:/Apps%20Dev/Devoirs_Numerique/data/french/conjugation.json)
  - [homophones.json](d:/Apps%20Dev/Devoirs_Numerique/data/french/homophones.json)
  - [grammar.json](d:/Apps%20Dev/Devoirs_Numerique/data/french/grammar.json)
  - [reading.json](d:/Apps%20Dev/Devoirs_Numerique/data/french/reading.json)

Elle gère :
- profils locaux
- scores et étoiles
- progression simple par exercice
- mode offline via service worker
- fallback données via [data-bundle.js](d:/Apps%20Dev/Devoirs_Numerique/js/data-bundle.js)

## Architecture

Fichiers principaux :
- [index.html](d:/Apps%20Dev/Devoirs_Numerique/index.html) : shell SPA
- [app.css](d:/Apps%20Dev/Devoirs_Numerique/css/app.css) : styles globaux
- [app.js](d:/Apps%20Dev/Devoirs_Numerique/js/app.js) : orchestration, navigation, runtime
- [ui.js](d:/Apps%20Dev/Devoirs_Numerique/js/ui.js) : rendu UI et cartes
- [ui-keyboards.js](d:/Apps%20Dev/Devoirs_Numerique/js/ui-keyboards.js) : claviers virtuels
- [ui-visuals.js](d:/Apps%20Dev/Devoirs_Numerique/js/ui-visuals.js) : rendu visuel maths
- [ui-documentary.js](d:/Apps%20Dev/Devoirs_Numerique/js/ui-documentary.js) : rendu documentaire et frises
- [engines.js](d:/Apps%20Dev/Devoirs_Numerique/js/engines.js) : point d'entrée des moteurs
- [engines-math.js](d:/Apps%20Dev/Devoirs_Numerique/js/engines-math.js)
- [engines-french.js](d:/Apps%20Dev/Devoirs_Numerique/js/engines-french.js)
- [engines-documentary.js](d:/Apps%20Dev/Devoirs_Numerique/js/engines-documentary.js)
- [storage.js](d:/Apps%20Dev/Devoirs_Numerique/js/storage.js) : profils et records
- [validators.js](d:/Apps%20Dev/Devoirs_Numerique/js/validators.js) : validation runtime
- [validate-data.ps1](d:/Apps%20Dev/Devoirs_Numerique/scripts/validate-data.ps1) : validation hors runtime
- [sw.js](d:/Apps%20Dev/Devoirs_Numerique/sw.js) : cache offline/PWA

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

- [technicalaspect.md](d:/Apps%20Dev/Devoirs_Numerique/technicalaspect.md) : référence technique
- [SECURITY.md](d:/Apps%20Dev/Devoirs_Numerique/SECURITY.md) : sécurité et robustesse
- [CONTRIBUTING.md](d:/Apps%20Dev/Devoirs_Numerique/CONTRIBUTING.md) : règles de contribution
- [lesson-guidelines.md](d:/Apps%20Dev/Devoirs_Numerique/docs/lesson-guidelines.md) : règles éditoriales des leçons
- [curriculum-delta-cp-cm2.md](d:/Apps%20Dev/Devoirs_Numerique/docs/curriculum-delta-cp-cm2.md) : delta programme vs application
- [content-production-backlog.md](d:/Apps%20Dev/Devoirs_Numerique/docs/content-production-backlog.md) : historique et backlog de production

## Workflow minimal

Après toute modification de `data/` :

1. lancer [validate-data.ps1](d:/Apps%20Dev/Devoirs_Numerique/scripts/validate-data.ps1)
2. régénérer [data-bundle.js](d:/Apps%20Dev/Devoirs_Numerique/js/data-bundle.js)
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
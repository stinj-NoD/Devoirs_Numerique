## Technical Aspect

Document de référence technique du projet `Devoir Numérique`.

## 1. Architecture

Le projet est une SPA Vanilla JavaScript, sans framework.

Principes :
- contenu piloté par JSON
- logique pédagogique isolée dans les engines
- rendu centralisé dans la couche UI
- stockage local via `localStorage`
- mode offline via Service Worker et bundle embarqué

## 2. Structure réelle

- `index.html`
- `css/app.css`
- `js/app.js`
- `js/ui.js`
- `js/ui-keyboards.js`
- `js/ui-visuals.js`
- `js/ui-documentary.js`
- `js/engines.js`
- `js/engines-core.js`
- `js/engines-math.js`
- `js/engines-french.js`
- `js/engines-documentary.js`
- `js/storage.js`
- `js/validators.js`
- `js/data-bundle.js`
- `data/`
- `data/french/`
- `sw.js`
- `offline.html`

## 3. Rôles des modules

### `app.js`

Responsable de :
- l’initialisation globale
- la navigation SPA
- le chargement résilient des JSON
- l’injection des datasets dans les engines
- le cycle question -> validation -> score -> résultat
- la gestion de la synthèse vocale pour `audio-spelling`
- les garde-fous runtime sur les états incohérents

### `ui.js`

Responsable de :
- l’affichage des écrans
- la façade UI publique
- la composition des cartes, sous-thèmes et surfaces d’exercice
- la délégation vers :
  - `ui-keyboards.js`
  - `ui-visuals.js`
  - `ui-documentary.js`

### `engines.js`

Responsable de :
- exposer `run()`
- standardiser le point d’entrée des moteurs
- déléguer vers :
  - `engines-core.js`
  - `engines-math.js`
  - `engines-french.js`
  - `engines-documentary.js`

### `storage.js`

Responsable de :
- profils
- utilisateur courant
- records
- sanitation et durcissement du stockage local

### `validators.js`

Responsable de :
- vérifier la forme minimale des JSON chargés
- vérifier la bibliothèque française modulaire
- vérifier les datasets documentaires et frises
- éviter les états incohérents au runtime

## 4. Cycle d’exécution

1. chargement de la bibliothèque française modulaire
2. chargement de `data/index.json`
3. sélection d’un profil
4. sélection d’un niveau
5. sélection d’une matière
6. sélection d’un sous-thème
7. sélection d’un exercice
8. génération d’un problème par engine
9. rendu par la couche UI
10. validation de la réponse
11. sauvegarde du résultat

## 5. Data-driven

Le projet repose sur 4 types de JSON.

### Index

Liste des niveaux disponibles.

### Niveau

Contient :
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

### Bibliothèque française modulaire

Sections actuelles :
- `spelling`
- `conjugation`
- `homophones`
- `grammar`
- `reading`

Fichiers :
- `data/french/spelling.json`
- `data/french/conjugation.json`
- `data/french/homophones.json`
- `data/french/grammar.json`
- `data/french/reading.json`

### Dataset spécialisé

Utilisé pour les matières documentaires ou les frises.

Exemples :
- `data/history_cm1.json`
- `data/geography_cm2.json`
- `data/science_ce2.json`
- `data/emc_cm1.json`
- `data/history_chrono.json`

## 6. Engines actifs

Engines principaux :
- `math-input`
- `choice-engine`
- `conjugation`
- `conversion`
- `clock`
- `reading`
- `audio-spelling`
- `timeline`
- `counting`

Sous-types notables dans `choice-engine` :
- `factual-qcm`
- `gender-articles`
- `article-choice`
- `plural-choice`
- `word-class-choice`
- `grammar-cloze`
- `homophone-duel`

## 7. Contenu pédagogique

Le contenu couvre :
- CP
- CE1
- CE2
- CM1
- CM2

Matières intégrées sur tous les niveaux :
- Mathématiques
- Français
- Histoire
- Géographie
- Sciences
- EMC

Le français couvre maintenant :
- orthographe lexicale
- dictée audio CP / CE1
- homophones
- conjugaison
- grammaire de genre
- grammaire en contexte
- lecture syllabique CP

## 8. Rendu UI actuel

Le shell visuel a été harmonisé et modernisé.

Familles de rendu :
- `formula`
- `choice`
- `language`
- `diagram`
- `documentary`

Renderers spécialisés actifs :
- division posée
- conversion
- horloge
- aide-mémoire temps
- monnaie
- comptage
- lecture syllabique
- dictée audio
- QCM documentaires
- frises chronologiques

## 9. Offline / PWA

Le projet supporte :
- chargement online classique
- chargement offline via `sw.js`
- ouverture locale avec fallback via `js/data-bundle.js`

État actuel :
- `sw.js` pré-cache les assets critiques et les datasets utiles
- les anciens caches sont supprimés lors des mises à jour
- le fallback `offline.html` couvre les navigations hors ligne
- le bundle local embarque les fichiers `data/french/*.json`

Commande :

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\regenerate-data-bundle.ps1
```

## 10. Robustesse et sécurisation

Durcissements actuellement en place :
- validation des JSON en amont
- garde-fous runtime dans `app.js`
- validation plus stricte des profils
- lecture défensive du `localStorage`
- records assainis et vérifiés avant usage
- mode offline plus fiable
- suppression du fallback legacy `french_lib.json`

## 11. Contraintes de maintenance

- garder `engines.js` stable
- faire évoluer le contenu via `data/*.json` et `data/french/*.json`
- regrouper les changements par lot cohérent
- tester après `Ctrl+F5`
- vérifier le mode local/offline après changement de data ou de cache
- privilégier des changements petits, testables, réversibles

## 12. État technique actuel

Points solides :
- architecture lisible
- séparation correcte entre data, logique, rendu et stockage
- navigation homogène `subjects -> subthemes -> exercises`
- bibliothèque française modulaire
- couverture pédagogique CP à CM2
- durcissement du runtime et du stockage
- fallback offline/local en place

Dette restante :
- `ui.js` reste un fichier important et dense
- certains renderers complexes gardent encore du HTML ou des styles dynamiques
- pas de suite de tests automatisée
- le service worker reste volontairement simple et non outillé par build
- le moteur audio dépend de la qualité de `speechSynthesis`

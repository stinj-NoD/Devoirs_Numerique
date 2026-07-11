# Architecture du sous-système cartes (map-locate)

Une page pour ne plus jamais se perdre. **Après toute modification :
`node scripts/validate-maps.js`** (vérifie toutes les cohérences ci-dessous).

## Les 4 fichiers d'un exercice de carte

```
data/{niveau}.json                 l'exercice et ses params
  └─ params: {
       type: "map-locate",
       mapId: "europe-countries",        ← identifiant logique (Collection)
       mapFile: "data/maps/europe-countries.svg",  ← le dessin
       dataFile: "data/board_map_locate_europe.json", ← les questions
       category: "cm1_map_pays_europe"
     }

data/board_map_locate_*.json       banque de questions
  └─ entrées: { targetZoneId, targetLabel, prompt }
     ⚠ targetZoneId DOIT être un id de <path> du SVG

data/maps/*.svg                    la carte
  └─ un <path id="zone" data-name="Nom"> par zone cliquable
     (chargé par fetchText, embarqué dans le bundle pour file://)

js/app.js → mapCollectionDefinitions   la Collection "Cartes du monde"
  └─ un mapId par carte à débloquer (récompense ≥ 50 % sur un exercice)
```

## Points d'attention

- **`data/maps/*.json`** (métadonnées zones/capitales) : **jamais lus par le
  code**. Conservés sur disque comme référence (futurs quiz capitales ?) mais
  **exclus du bundle** par `regenerate-data-bundle.ps1`.
- **Mode Champions** : les exercices map-locate en sont exclus (le SVG n'y est
  pas préchargé, et une carte ne colle pas à un sprint chronométré) — filtre
  dans `startChampionMode`.
- **Rendu** : `ui-board.js` recadre aléatoirement la vue autour de la zone
  cible (`computedViewBox`, calculé une fois par question). La carte
  France utilise la classe `board-map-svg--flat` (fills pastel, pas de stroke —
  les tracés régionaux contiennent les frontières départementales).
- **Ajout d'une carte** (checklist) :
  1. SVG propre dans `data/maps/` (un path/zone, ids kebab-case, `data-name`),
     source + licence dans `CREDITS.md`
  2. Banque `data/board_map_locate_<nom>.json`
  3. Exercice(s) dans le(s) fichier(s) de niveau
  4. `mapCollectionDefinitions` dans `js/app.js` (sinon warning du validateur)
  5. SVG dans `DATA_ASSETS` de `sw.js` si servi hors bundle + bump CACHE_NAME
  6. `node scripts/validate-maps.js` puis régénérer le bundle

## Plateaux interactifs (board-interactive, hors cartes)

Mêmes règles de banque (`dataFile` + `category`, pool = tableau). Le validateur
contrôle aussi ces exercices (catégorie existante, non vide, ≥ 4 entrées
recommandées pour la rejouabilité). Les entrées de géométrie sont générées et
vérifiées mathématiquement (voir scratchpad des sessions passées) : symétries
recalculées, perpendicularité par produit scalaire, points sur segments.

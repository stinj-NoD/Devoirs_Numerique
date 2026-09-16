# Registre des moteurs d'exercices

Référence lisible des 13 moteurs (`engine`) et de leurs sous-types (`params.type`).
Version humaine de **`data/engine-registry.json`**, la source machine-lisible.

> **Ces deux fichiers sont de l'OUTILLAGE.** Ils ne sont pas embarqués dans
> `js/data-bundle.js` et ne sont jamais lus au runtime — ils servent à l'agent
> `exercise-author` et au garde-fou de cohérence de `scripts/build-content-index.js`.
> Ils n'ont **aucun** impact sur le poids servi ni sur le mode `file://`.

## Où vit la vérité (et pourquoi ce registre existe)

Le dispatch réel des moteurs est un `switch` impératif dans
[`js/engines.js`](../js/engines.js) (`Engines.run`), qui délègue aux modules
`js/engines-{math,french,board,documentary,core}.js`. La liste blanche des
`engine` autorisés est aujourd'hui **répétée à l'identique dans trois endroits** :

- `Validators.knownEngines` — [`js/validators.js`](../js/validators.js)
- `$knownEngines` — [`scripts/validate-data.ps1`](../scripts/validate-data.ps1)
- `engines` — [`data/engine-registry.json`](../data/engine-registry.json)

On ne fusionne **pas** ces sources en une seule consommée au runtime (le risque
sur le dispatch critique est disproportionné). À la place,
`scripts/build-content-index.js --check` **échoue** si ces trois listes
divergent : toute dérive future est attrapée en validation, pas en production.

Le même garde-fou compare aussi trois énumérations littérales imbriquées,
dupliquées mot pour mot entre `js/validators.js` et `scripts/validate-data.ps1`
sans qu'aucune vérification croisée n'existait auparavant : les types valides
de `board-interactive` (colonne ci-dessous), les subtypes valides de
`conversion`, et ses modes `time`. Même classe de risque que les trois listes
`knownEngines`, à l'échelle d'un `engine` particulier plutôt que de la liste
globale.

## Trois natures de moteur (`sourceKind`)

| `sourceKind` | Ce que ça implique pour `params` | Doublon = ? |
|---|---|---|
| `pool` | requiert `dataFile` + `category` (banque `data/*.json` externe) | **même `dataFile::category`** → contenu identique |
| `library` | s'appuie sur `data/french/*.json` (aucun `dataFile`) | contenu dans la lib, pas dans les params |
| `generator` | params autonomes, contenu tiré au hasard | contenu dans le code, pas dans les params |

**Conséquence pour détecter les doublons** : deux exercices `pool` qui pointent
le même `dataFile::category` tirent leurs questions du **même vivier** — c'est le
signal fort d'habillage redondant. Pour `library`/`generator`, un même contrat
`engine+params` ne signifie **pas** un contenu identique (d'où : contrat identique
= *warning informatif*, jamais bloquant).

## Les 13 moteurs

| `engine` | Nature | `params.type` | Ex. dans les données |
|---|---|---|---|
| `math-input` | generator | `add-simple`, `add-trou`, `sub-simple`, `mult`, `complement`, `decimal-place`, `dictée-nombres`, `calc-mental`, `oiseau-math`, `cibles`, `half`, `double`, `division-simple`, `division-reste`, `division-posed`, `operation-posed`, `place-value`, `proportionnalite`, `pourcentage`, `aire-rectangle`, `volume-pave`, `echelle`, `vitesse`, `bar-chart-read`, `data-table-read`, `pie-chart-read`, `average-compute`, `spelling`¹, `clock`, `fraction-view`, `fraction-operation`³, `number-spelling`, `carre-somme` | ~164 |
| `choice-engine` | mixed | `factual-qcm` (**pool**), `gender-articles`, `article-choice`, `plural-choice`, `word-class-choice`, `grammar-cloze`, `homophone-duel` (library), `compare-decimals`, *(défaut)* `compare` | ~539 |
| `board-interactive` | pool | `tap-features`, `shape-classify`, `point-on-grid`, `symmetry-complete`, `map-locate`, `memory-match`, `angle-classify`, `angle-measure`, `construction-report`, `fraction-build`² | ~42 |
| `conversion` | generator | — (`modes`, `memo`), `metric-area`⁴ | ~28 |
| `conjugation` | library | — | ~47 |
| `reading` | library | — | ~51 |
| `audio-spelling` | library | — | ~44 |
| `cloze-fill-in` | library | — | ~5 |
| `matching` | pool | — (`dataFile`, `category`) | ~49 |
| `word-order` | pool | — (`dataFile`, `category`) | ~13 |
| `timeline` | pool | — (`dataFile`, `grade`, `mode`∈{order,place}, `timelineId`) | ~22 |
| `clock` | generator | — | ~6 |
| `counting` | generator | — | ~2 |

¹ `spelling`, `clock`, `fraction-view`, `number-spelling`, `carre-somme` sont
branchés **avant** `calculate()` dans [`js/engines.js`](../js/engines.js).
² `fraction-build` est le seul type `board-interactive` **sans** `dataFile`.
³ `fraction-operation` (addition/soustraction de fractions) est un moteur
distinct de `fraction-view` (lecture/représentation d'une fraction unique) —
ne pas les confondre. `level` 1-2 = dénominateurs identiques ; `level` 3 =
dénominateurs différents mais l'un multiple de l'autre (dénominateur commun
donné dans l'énoncé, pas de PPCM demandé à l'élève ; cas général hors scope).
⁴ `metric-area` convertit cm²/dm²/m²/mm² avec une progression **x100** par
palier, contrairement au subtype `metric` existant (x10) — tableau d'unités
et facteurs dédiés dans `js/engines-math.js`.

**Alias normalisés en entrée** (`js/engines.js`) : `compare`/`choice` → `choice-engine` ;
`oiseau` → `math-input` + `type:oiseau-math`.

## Ajouter un moteur ou un `params.type` (procédure)

1. Implémenter le générateur dans le module `js/engines-*.js` concerné et le
   brancher dans le `switch` de `js/engines.js`.
2. Ajouter les règles de validation en **miroir** dans `js/validators.js` **et**
   `scripts/validate-data.ps1` (cf. `CONTRIBUTING.md` — la double validation doit
   rester synchronisée).
3. Ajouter l'`engine`/le `type` dans `data/engine-registry.json`, puis
   régénérer ce document.
4. Lancer `node scripts/build-content-index.js --check` : il refusera de passer
   tant que les trois listes `knownEngines` ne coïncident pas.

## Champs détaillés par type

Les champs `params` attendus par chaque `params.type` (requis/optionnels et
contraintes numériques) sont énumérés dans `data/engine-registry.json`
(`engines.<engine>.paramsTypes.<type>.params` + `note`). L'agent `exercise-author`
lit ce JSON pour construire des `params` valides sans deviner.

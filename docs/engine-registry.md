# Registre des moteurs d'exercices

Référence lisible des 13 moteurs (`engine`) et de leurs sous-types (`params.type`).
Version humaine de **`data/engine-registry.json`**, la source machine-lisible.

> **Ces deux fichiers sont de l'OUTILLAGE.** Ils ne sont pas embarqués dans
> les bundles (`js/data-bundle-common.js`/`data-bundle-<niveau>.js`) et ne
> sont jamais lus au runtime — ils servent à l'agent
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
| `math-input` | generator | `add-simple`, `add-trou`, `sub-simple`, `mult`¹², `complement`¹², `decimal-place`¹², `dictée-nombres`, `calc-mental`, `oiseau-math`, `cibles`, `half`, `double`, `division-simple`¹⁰, `division-reste`¹⁰, `division-posed`¹², `operation-posed`⁶¹², `place-value`, `proportionnalite`, `pourcentage`¹⁰, `aire-rectangle`, `volume-pave`, `echelle`, `vitesse`, `bar-chart-read`, `data-table-read`, `pie-chart-read`, `average-compute`, `spelling`¹, `clock`¹², `fraction-view`, `fraction-operation`³, `number-spelling`, `carre-somme` | ~164 |
| `choice-engine` | mixed | `factual-qcm` (**pool**), `gender-articles`, `article-choice`, `plural-choice`, `word-class-choice`, `grammar-cloze`, `homophone-duel` (library)¹², `compare-decimals`¹⁰, *(défaut)* `compare` | ~539 |
| `board-interactive` | pool | `tap-features`¹¹, `shape-classify`, `point-on-grid`⁹, `symmetry-complete`, `map-locate`, `memory-match`, `angle-classify`, `angle-measure`, `construction-report`, `fraction-build`², `number-line-place`⁵, `number-line-frame`⁵ | ~42 |
| `conversion` | generator | — (`modes`, `memo`, `units`, `decimals`¹²), `metric-area`⁴ | ~29 |
| `conjugation` | library | — (`persons`) | ~47 |
| `reading` | library | — (item `plain`¹³) | ~51 |
| `audio-spelling` | library | — (`unit`¹³) | ~44 |
| `cloze-fill-in` | library | — | ~5 |
| `matching` | pool | — (`dataFile`, `category`) | ~49 |
| `word-order` | pool | — (`dataFile`, `category`), item `variantes`⁷ | ~13 |
| `timeline` | pool | — (`dataFile`, `grade`, `mode`∈{order,place}, `timelineId`, `difficulty`)⁸ | ~22 |
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
⁵ `number-line-place`/`number-line-frame` (ligne numérique graduée) n'acceptent
que des graduations **discrètes indexées** (`board.tickCount`), jamais un
placement continu avec marge d'erreur — le seul mode de validation réellement
câblé par `App.validateAnswer()` est une égalité stricte de chaîne canonique.
`number-line-place` : `task.targetIndex` (un point). `number-line-frame` :
`targetIndices` (exactement 2, encadrement). La conversion valeur réelle
(nombre entier, fraction...) → index de graduation se fait à l'écriture du
contenu, jamais au runtime.
⁶ `operation-posed` accepte un paramètre optionnel `decimals` (0-2, défaut 0) et un paramètre optionnel `maxResult` (entier 20-20000, addition seulement) qui plafonne la somme : `ce1-addition-posee-centaines` l'emploie (`maxResult: 1000`) pour tenir son titre « jusqu'à 1000 ». Absent, comportement historique inchangé (CE2 et CM1 partagent le niveau 2).
pour poser des opérations avec des nombres décimaux — implémenté en entiers
mis à l'échelle (jamais de flottant JS), formaté en chaîne virgule côté
moteur avant `standardize()`. `mult` + `decimals>0` est restreint à
décimal × entier (le second opérande reste toujours un entier), jamais
décimal × décimal.

⁷ `word-order` : un item de phrase accepte un champ optionnel `variantes` (tableau de
phrases tout aussi justes, faites **exactement des mêmes mots** : adverbe avant ou
après le participe, par ex.). Le moteur ignore toute variante qui n'a pas le même
multiensemble de mots, et `App.validateAnswer` les accepte en plus de l'ordre attendu
(jamais plus qu'une phrase identique mot pour mot) ; les deux validateurs refusent un
item narratif (`sentences`) ou une variante dont les mots diffèrent.
⁸ `timeline` mode `order` : la frise `timelineId` est un **vivier**. Dès qu'elle compte
plus de 4 repères, le moteur en tire 4 au hasard à chaque question (puis les trie par
année, puis par `order`) ; une frise de 4 repères sert donc toujours le même puzzle. Le
quatuor n'est jamais reposé deux fois dans une séance (`usedSet`). Deux repères de même année
portent un champ `order` (1, 2…) qui fixe leur classement : sans lui l'ordre attendu dépendait
du tirage. Un vivier de 7 à 12 repères suffit à varier les puzzles.
Mode `place` : `difficulty` (entier ou liste) filtre les repères ; chaque niveau doit
compter au moins autant de repères que de questions. Les dates proposées en distracteurs
sont écartées de plus de 2 ans de la bonne date tant que le vivier le permet.

⁹ `point-on-grid` : la grille a `board.width` colonnes et `board.height` lignes,
numérotées à partir de 0 ; une cible `task.target` hors de `[0, width − 1] × [0, height − 1]`
n'a aucune intersection à toucher et est **refusée par les deux validateurs** (elle avait
rendu deux exercices injouables au CM1 et au CM2). Champ facultatif `board.outline` : suite
d'au moins 3 points `[x, y]` en coordonnées de la grille, dessinée derrière le quadrillage
(contour de la France de `cm2_reperes_france_grille`).

¹⁰ Paramètres de calcul ajoutés au CM2 (v4.63.0), tous optionnels, comportement historique inchangé s'ils sont absents :
`division-simple` et `division-reste` acceptent `divisors` (liste des diviseurs tirés) et `quotient` (`[min, max]`) ;
`division-reste` accepte en plus `ask: "reste"` pour demander le reste de la division plutôt que le quotient ;
`pourcentage` accepte `minMultiple` (le nombre de départ vaut au moins `minMultiple` × le pas, ce qui écarte « 20 % de 10 ») ;
`operation-posed` accepte `level` 4 et 5 (nombres de 5 et de 6 chiffres) pour l'addition et la soustraction ;
`compare-decimals` accepte `wholeParts: "mix"` (parties entières différentes) et `distinctWriting: true` (jamais deux écritures identiques).
`division-posed` n'affiche plus les produits partiels en mode quotient (ils laissaient lire le quotient) ; ils restent visibles en mode `ask: "reste"`.

¹¹ `tap-features` : `drawing.markersOnReveal: true` ne dessine les chevrons d'angle droit qu'à la correction ;
`drawing.texts` (liste `{ x, y, text, anchor }`, `anchor` ∈ {start, middle, end}) pose des étiquettes sur le dessin
(noms des villes de `cm2_villes_france_tap`). Le dessin lui-même (`lines`, `circles`) ne porte aucune réponse.

¹² Paramètres de **progression entre niveaux** (v4.64.0), tous optionnels, comportement historique inchangé s'ils sont absents. Ils servent à
ce qu'un même exercice ne soit plus identique d'un niveau à l'autre (contrôle `contrat-identique` de `build-content-index.js`) :
`mult` accepte `mode` (`produit` par défaut, `facteur` « 7 × ? = 56 », `division` « 56 : 7 = ? », `mixte`) et `tables` (tables tirées quand `table` vaut `mix`) ;
`complement` accepte `multipleOf` (le nombre donné est un multiple de ce pas : dizaines entières, puis multiples de 5) ;
`decimal-place` accepte `decimals: 3` (ajoute les millièmes) ;
`division-posed` accepte `divisors` (liste d'entiers 2-99) et `dividend` (`[min, max]`, 10-99 999) qui recalibrent le niveau ;
`operation-posed` accepte `carry: true` (au moins une retenue ou un emprunt, addition et soustraction) ;
`conversion` `metric` accepte `decimals` (0, 1 ou 2 : valeur de départ décimale) ;
`clock` accepte `level: 4` (lecture à la minute près, avec graduations des minutes) ;
`homophone-duel` accepte `level` (`ce1`, `ce2`, `cm1`, `cm2`) : les phrases de `data/french/homophones.json` portent un champ `level`, et un exercice ne tire que
celles de son niveau (une phrase sans champ reste disponible pour tous). `mix_all` tire d'abord une catégorie qui compte au moins une phrase du niveau.

¹³ Ajouts de la passe « Mineurs du CP » (v4.65.0), optionnels : `audio-spelling` accepte `unit` (`mot` par défaut, `syllabe`) qui fixe
la consigne affichée et lue (une réponse à espaces est reconnue comme phrase : « Écoute la phrase puis écris-la ») ; un item de `reading` accepte
`plain: true` (le mot s'affiche d'un bloc, sans coloration des syllabes). Le générateur procédural d'un `math-input`, d'un `conversion`, d'un `clock`
ou d'un `counting` ne répète plus une question dans une série (`Engines.unique` : jusqu'à 30 retirages) ; la pastille Jour/Nuit de `clock` n'apparaît
qu'à partir du niveau 3 (cadran à 24 heures).

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

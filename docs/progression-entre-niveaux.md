# Progression entre niveaux : un même exercice, un contenu qui évolue

*Ajouté le 2026-10-10 (v4.64.0), à la demande du responsable du produit : « quelque chose d'évolutif, de scolaire, quelque chose qui fonctionne ».*

## Pourquoi ce document

Plusieurs compétences se travaillent sur **plusieurs années** : les homophones de CE1 à CM2, les tables de multiplication, la conjugaison, les conversions de mesures. Jusqu'à la v4.63.0, un même exercice existait presque à l'identique d'un niveau à l'autre (mêmes `engine` et `params`, donc le même vivier). Le contrôle `contrat-identique` de `scripts/build-content-index.js` les signalait : 57 groupes, de CP à CM2.

Un exercice répété d'un niveau à l'autre est légitime quand il **consolide** (c'est le principe de la spirale). Il ne l'est plus quand l'élève de CM2 retrouve, mot pour mot, les phrases du CE1. Chaque groupe a donc reçu **un palier propre à son niveau**, calé sur le programme.

**État au 2026-10-10 : aucun contrat n'est partagé entre deux niveaux** (`node scripts/build-content-index.js --check` ne signale plus de groupe multi-niveaux). Les répétitions restantes sont à l'intérieur d'un même niveau (un exercice et son défi), traitées par un vivier propre à chacun là où l'audit du niveau l'a demandé.

## Sources

- `PROGRAMME_SCOLAIRE_REFERENCE.md` : attendus de fin d'année par niveau (programmes 2020 et textes 2024-2026), recroisé aux arrêtés le 2026-09-22.
- Repères annuels de progression d'Éduscol, par la fiche de l'académie de Nancy-Metz (« faits mémorisés ») : *fin de CE1 : tables de multiplication de 2, 3, 4 et 5 ; fin de CE2 : tables de 2 à 9*. La table de 10 est travaillée dès le CE1 comme « ajouter un zéro ».
- **Limite assumée** : la répartition fine des homophones entre CE1, CE2 et CM1 n'a pas de tableau officiel lisible (les documents trouvés divergent). Elle suit `PROGRAMME_SCOLAIRE_REFERENCE.md` : *CE1 a/à, et/est, son/sont, on/ont, ou/où ; CE2 + ce/se, ces/ses ; CM1 + leur/leurs, c'est/s'est ; CM2 tous, en situation complexe*. Un relecteur enseignant peut la réajuster : elle ne tient qu'à un champ `level` des phrases.

## Les paliers, compétence par compétence

### Mathématiques

| Compétence | CP | CE1 | CE2 | CM1 | CM2 |
|---|---|---|---|---|---|
| **Compléments** | à 10, puis à 20 | à 100 : dizaines entières (`multipleOf: 10`), puis multiples de 5 (défi) | à 100 (tous nombres), 500, 1 000, 2 000 | — | — |
| **Tables de multiplication** | — | 2, 3, 4, 5 et 10 ; produit seul (`a × b = ?`). Les tables 6 à 9 restent en défi. Mélange limité à `tables: [2,3,4,5,10]` | 2 à 10 « mémorisées » : `mode: "mixte"` (produit dans les deux sens, nombre manquant `? × 7 = 56`, division `56 : 7 = ?`) | — | — |
| **Comparer des entiers** | — | jusqu'à 1 000 | jusqu'à **10 000** | — | — |
| **Addition posée** | — | 2 chiffres, puis 3 chiffres (somme ≤ 1 000) | 3 chiffres **avec retenue garantie** (`carry`), puis 4 chiffres | **5 chiffres** (niveau 4) | 6 chiffres (« expert »), décimaux |
| **Soustraction posée** | — | 2 chiffres, puis 3 chiffres | 3 chiffres **avec emprunt garanti**, puis 4 chiffres | **5 chiffres** (niveau 4), décimaux | 6 chiffres (« expert »), décimaux |
| **Division posée** | — | — | **diviseur 2 à 5, dividende 20 à 99** | diviseur 3 à 9, dividende 50 à 900 ; défi : dividende à **4 chiffres** | diviseur à **2 chiffres** (niveaux 2 et 3) |
| **Fractions (lecture)** | — | parts jusqu'à 4 | parts jusqu'à **5** | parts jusqu'à 6, 8, puis 12 | parts jusqu'à **16**, 20, puis 24 |
| **Décimaux (rang des chiffres)** | — | — | — | dixièmes et centièmes | **+ millièmes** (`decimals: 3`) |
| **Échelle d'un plan** | — | — | — | 1/50, 1/100, 1/200 (plan d'une pièce ou d'une maison) | 1/500 à 1/10 000 (plan de quartier) |
| **Chiffres romains** | — | — | — | jusqu'à XX, puis L, puis **LI à C** (`min: 51`) | de I à C, puis D, puis M |
| **Conversions de mesures** | — | — | km, m, cm, mm ; kg, g ; L, mL (unités du programme, `units`) | tableau complet, **nombres entiers** | tableau complet avec **décimaux** (`decimals: 1`), puis km, m, cm, mm au centième (`decimals: 2`) |
| **Lire l'heure** | heures pleines et demies | + quarts d'heure | 24 h, **de 5 en 5 minutes** | — | **à la minute près**, graduations dessinées (`level: 4`) |

### Français

| Compétence | CE1 | CE2 | CM1 | CM2 |
|---|---|---|---|---|
| **Homophones** (champ `level` des phrases, 12 à 14 par niveau et par paire) | phrases courtes (sujet + verbe + complément), test de remplacement **« avait », « était », « mon »...** | phrases plus longues ; *son* devant un nom féminin à voyelle (*son école*), *ces/ses* avec indice | sujet éloigné, expressions et « il y a » ; *ou* de choix ou *où* de lieu et de temps ; *ces/ses* **sans** l'indice « les siens » | les pièges : « il a **à** faire », inversion (*a-t-il*), « *grâce à* », « *qu'on* », « *jusqu'où* », « *ce qui* / *ce que* » |
| **Être et avoir** | présent | présent ou futur (`tenses`) | imparfait | présent, futur et imparfait mêlés |
| **Futur** | — | verbes en -er réguliers | 1er groupe **à particularités** : -ger, -cer, -ier, -yer (*mangerai, étudierai, nettoierai*) ; 2e et 3e groupes fréquents | tous groupes, **verbes irréguliers** (*saurai, courrai, tiendrai, enverrai*) |
| **Imparfait** | — | verbes en -er (dont *mangeais, lançais*) | 1er groupe à particularités (*nous commencions, nous étudiions*) | **tous les groupes** (*nous faisions, vous voyiez, ils buvaient*) |
| **Présent des verbes en -ir** | — | 2e groupe : verbes usuels (*finir, choisir, grandir*) | **2e ou 3e groupe ?** test du « nous » (*finissons* / *dormons*) | 2e groupe : verbes moins fréquents (*bâtir, atterrir, accomplir*) |
| **Présent du 3e groupe** | *aller* | 12 verbes fréquents (deux séries) | 16 verbes fréquents | verbes moins fréquents (*recevoir, tenir, vivre, croire, peindre*) |
| **Passé composé** | — | avoir : 5 verbes ; être : 3 verbes | avoir : 10 autres verbes ; être : *aller, venir, partir, sortir* ; mélange du 1er groupe | **tous groupes**, avoir ou être (*a su, est né, est devenue*) |
| **Dictée thématique** (animaux, corps, aliments, transports, école, maison) | mots plus longs ou plus délicats (accents, lettres muettes, consonnes doubles) : *poussin, genou, fromage, bicyclette, compas, assiette* | (vivier propre au CE2, déjà en place) | (vivier avancé, déjà en place) | (vivier avancé, déjà en place) |

Au CP, les mêmes thèmes se travaillent avec des mots courts (*chat, bras, pain, vélo, livre, lit*).

### Géographie

| | CM1 | CM2 |
|---|---|---|
| **Carte de l'Europe** | `cm1_map_europe_proche` : la France et 11 pays proches, voisins directs ou non (Espagne, Portugal, Italie, Allemagne, Royaume-Uni, Irlande, Belgique, Pays-Bas, Luxembourg, Suisse, Autriche) | `cm2_map_pays_europe` : les 37 pays (« situer la France en Europe, identifier les pays de l'Union européenne ») |
| **Capitales** | `cm1-capitales-europe-proche` : les 12 capitales correspondantes, distracteurs pris parmi elles | `cm2-capitales-europe` : les 37 capitales |

## Ce qui est volontairement resté identique

- **Les défis (« bonus ») d'un même niveau** partagent parfois le contrat de leur exercice : variante plus longue d'un même entraînement. Ce sont les *Mineurs* des audits par niveau.
- **Les tables 6 à 9 du CE1** restent proposées en défi, avec la même forme que les tables 2 à 5 : elles anticipent le CE2 (`ce2-m6` à `ce2-m9`) sous une forme plus difficile.

## Comment ajouter un nouveau palier

1. Vérifier si le **moteur** a déjà un paramètre de niveau (voir `docs/engine-registry.md`, note 12) ; sinon en ajouter un **optionnel** et mettre à jour les **deux validateurs** (`js/validators.js`, `scripts/validate-data.ps1`).
2. Pour une **bibliothèque** (`data/french/*.json`) : créer un vivier par palier. Les catégories de conjugaison ne doivent **pas** contenir de motif `_<chiffre>` (le moteur dérive une catégorie `prefixe_1`, `prefixe_2`... depuis le nom : `future_particularites` est sûr, `future_1_cm1` serait remplacé par `future_1`).
3. Écrire une **leçon** quand le palier introduit une notion (millièmes, conversions décimales, verbes en -yer...) : le contrôle `check-lesson-quiz.js` exige deux quiz non recopiables.
4. Lancer la chaîne de validation, puis `node scripts/build-content-index.js --check` : plus aucun `contrat-identique` entre deux niveaux.

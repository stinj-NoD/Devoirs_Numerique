# Audit de sécurité — 2026-08-05

**Périmètre** : audit de sécurité et de robustesse périodique, complet, de
toute la base de code JS/HTML/CSS de « Devoir Numérique ». Aucun correctif
n'est appliqué dans cette phase — ce document est un diagnostic. La
correction éventuelle des points listés ci-dessous est une décision séparée,
à prendre par l'utilisateur ou à confier à une intervention ciblée
ultérieure.

**Modèle de menace rappelé** : application front-only, sans backend, sans
authentification serveur, sans session, sans base de données. Pas d'injection
SQL possible, pas de CSRF (pas de cookie d'auth), pas de secret serveur à
voler. Le risque réel se limite à :
- l'injection DOM/XSS côté client (contenu inséré en `innerHTML` sans
  échappement, qu'il vienne d'un JSON de `data/`, d'une saisie utilisateur —
  nom de profil, import de sauvegarde — ou d'un moteur procédural) ;
- la robustesse du stockage local (`localStorage` n'est pas un coffre-fort,
  fait assumé du projet — pas un finding en soi) ;
- la fiabilité du mode offline (service worker, cohérence de version) ;
- l'intégrité des données (encodage, contrats moteur/validateur synchronisés).

Aucun audit de sécurité antérieur (`docs/security-audit-*.md`) n'existait
avant celui-ci : premier passage complet de ce type, pas de section
« régressions » à produire.

## Tableau de synthèse

| Sévérité      | Injection DOM/XSS | Stockage local | Intégrité runtime/offline | Encodage | Total |
|---------------|:---:|:---:|:---:|:---:|:---:|
| Bloquant      | 0 | 0 | 0 | 0 | **0** |
| Majeur        | 2 | 0 | 0 | 0 | **2** |
| Mineur        | 1 | 1 | 2 | 1 | **5** |
| Suggestion    | 1 | 1 | 0 | 0 | **2** |
| **Total**     | **4** | **2** | **2** | **1** | **9** |

Aucun chemin d'exploitation Bloquant identifié : les points d'entrée
utilisateur réels (nom de profil, import JSON de sauvegarde, réponse libre
aux exercices) sont systématiquement échappés ou revalidés avant toute
insertion DOM ou écriture en stockage.

## Findings détaillés

### Injection DOM / XSS

**Majeur — Injection DOM/XSS** — `js/ui.js:1802` (`js/ui-visuals.js` non
concerné, c'est bien `ui.js:drawSpelling`) — `imgPath = d.img` (issu de
`data/french/*.json`, champ `item.img` construit dans
`js/engines-french.js:275`) est inséré **sans aucun échappement** dans
`<img src="${imgPath}" ...>` — ni `escapeHtml`, ni `escapeAttr`, ni
`SecurityUtils.safeImagePath`. Aujourd'hui le champ `img` n'est peuplé dans
aucun fichier `data/french/*.json` (vérifié par recherche) : le chemin n'est
donc pas atteint en production actuelle, ce qui écarte le Bloquant. Mais si
un contributeur peuple ce champ un jour (ou copie ce pattern pour un autre
moteur), une valeur contenant `"` ou `<` casserait l'attribut et permettrait
une injection de balise/attribut arbitraire. Ni `js/validators.js` ni
`scripts/validate-data.ps1` ne valident ce champ `img` (absent des deux).
Correctif suggéré : passer `d.img`/`item.img` par
`SecurityUtils.safeImagePath` (déjà conçu exactement pour ce cas : whitelist
stricte d'extensions et de préfixes de chemin) avant insertion en `src=`, et
ajouter une validation du champ `img` dans les deux validateurs si le champ
est destiné à être utilisé.

**Majeur — Injection DOM/XSS (helper non utilisé)** — `js/security.js:37`
(`safeImagePath`) — Le helper `SecurityUtils.safeImagePath` existe, est
exporté, mais **n'est appelé nulle part dans le code** (`grep` sur tout le
dépôt : zéro appel hors sa propre définition). Toutes les insertions
`<img src="${...}">` dynamiques du projet (`js/ui.js:335`, `549`, `2462`,
`2546`, `2762` pour les cartes du Grimoire ; `js/ui.js:1802` ci-dessus pour
l'orthographe) utilisent `escapeHtml`/`_escapeText` (échappement de
caractères HTML) au lieu de `safeImagePath` (whitelist de chemin). Dans le
cas des cartes du Grimoire, la source (`card.image`, `data/cards.json`) est
un JSON entièrement contrôlé par les auteurs — le risque est donc
aujourd'hui latent, pas exploitable par un utilisateur. Mais `escapeHtml`
neutralise l'injection de balise, pas l'injection de **schéma d'URL**
(`javascript:`, `data:text/html`, etc.) : un `card.image` malformé (erreur
de contenu, script de génération défaillant) passerait tel quel en `src=`
sans que l'échappement de caractères ne l'empêche. Correctif suggéré :
router les 6 points d'insertion `<img src=...>` identifiés à travers
`SecurityUtils.safeImagePath`, en conservant `escapeAttr` en complément pour
le `alt=`/les autres attributs texte.

**Mineur — Injection DOM/XSS (échappement d'attribut non homogène)** —
`js/ui.js:396,420,906,2293,2460` — Ces 5 insertions dans des attributs
`data-*` (`data-starter-id`, `data-evolve-id`, `data-lesson-id`, `data-fact`,
`data-card-id`) utilisent `this._escapeText(...)` (= `escapeHtml`, qui
échappe `& < > " '` mais pas le backtick) alors que `js/ui.js` ne définit
localement **aucun** helper `_safeAttr`/`escapeAttr` — contrairement à
`js/ui-keyboards.js` et `js/ui-documentary.js`, qui définissent tous deux un
`_safeAttr` local en miroir de `SecurityUtils.escapeAttr`. Un seul point
(`js/ui.js:1022`, `data-choice`) appelle `SecurityUtils.escapeAttr`
directement. Analyse d'exploitabilité : ces valeurs sont insérées dans un
attribut HTML **entre guillemets doubles** ; le backtick n'a aucune
signification pour un parseur HTML d'attribut, et `escapeHtml` échappe bien
le caractère `"` qui permettrait la sortie d'attribut — donc **aucun de ces
5 points n'est exploitable en pratique aujourd'hui**. C'est une
incohérence de convention interne (pas d'chemin d'exploitation), qui mérite
d'être corrigée pour que `js/ui.js` respecte la même discipline que le
reste du projet, en prévision d'un futur point d'insertion moins anodin.
Correctif suggéré : ajouter un `_safeAttr` local à `js/ui.js` (ou appeler
`SecurityUtils.escapeAttr` directement) sur ces 5 sites, par cohérence.

**Suggestion — Injection DOM/XSS (défense en profondeur absente à la
source)** — `js/engines-documentary.js` (tout le fichier, ex. lignes 16, 52,
88, 152, 214) — Contrairement à `js/engines-math.js`, `js/engines-french.js`
et `js/engines-board.js`, qui appellent systématiquement
`SecurityUtils.escapeHtml` sur tout texte interpolé venant de JSON
(`item.title`, `entry.prompt`, etc.) au moment de construire `question`, les
générateurs de `js/engines-documentary.js` renvoient `item.title`,
`item.instruction`, `timelineDef.title` **non échappés** dans `question`.
Ce n'est pas exploitable aujourd'hui : les `visualType` produits par ce
fichier (`factualCard`, `matching`, `wordOrder`, `timelineOrder`,
`timelinePlace`) sont tous rendus par `js/ui-documentary.js`, qui échappe
correctement chaque champ à la lecture (`_escape`/`_safeAttr` sur `d.title`,
`entry.label`, `card.label`, etc.) — le champ `question` brut du retour de
l'engine n'est réutilisé que dans `drawFactualCard` (`js/ui-documentary.js:196`),
où il est ré-échappé avant affichage. Le risque est purement une dette de
cohérence : si un contributeur réutilise un jour la valeur `question` de ces
engines dans un contexte qui ne ré-échappe pas (comme le fait
`updateGameDisplay` pour les moteurs texte/maths), l'absence d'échappement à
la source deviendrait exploitable. Correctif suggéré, non urgent : aligner
`js/engines-documentary.js` sur le pattern des autres modules `engines-*.js`
(échapper à la génération, pas seulement au rendu).

### Stockage local

**Mineur — Stockage local (préfixe `dn_` non systématique)** —
`js/storage.js` (ensemble du fichier) — `SECURITY.md` §3 et `CLAUDE.md`
documentent des « clés préfixées `dn_` pour isoler les données de
l'application ». En pratique, seules 4 clés respectent ce préfixe
(`dn_current_user`, `dn_profiles_list`, `dn_parent_pin`, `dn_quiz_scores`).
Toutes les autres — `coins_*`, `cards_*`, `records_*`, `streak_*`,
`champion_*`, `avatar_state_*`, `activity_log_*`, `daily_challenge_*`,
`redemptions_*`, `appearance_*`, `lesson_views_*`, `news_seen_*`, `pref_*` —
n'ont pas ce préfixe. Ce n'est pas un vecteur d'injection ni une fuite de
données (le stockage reste scopé à l'origine du site par le navigateur), mais
cela affaiblit l'isolation documentée : une autre application partageant la
même origine (peu probable ici, mais concevable en `file://` ou sur un
sous-chemin GitHub Pages partagé) pourrait entrer en collision avec ces clés
génériques (`coins_Marie`, `streak_Léo`, etc.) plus facilement qu'avec un
préfixe dédié. Correctif suggéré : soit préfixer systématiquement toutes les
clés en `dn_` (migration à prévoir, casserait la compatibilité des données
existantes sans une étape de migration), soit corriger `SECURITY.md` pour
documenter fidèlement l'état réel (seules les clés globales, pas les clés
par profil, sont préfixées).

**Suggestion — Stockage local (absence de borne haute sur `boostersSansNouvelle`
et compteurs analogues)** — `js/storage.js:255,542` — `boostersSansNouvelle`
est borné en bas (`Math.max(0, ...)`) mais pas en haut. Une édition manuelle
du `localStorage` (le PIN parental ne protège qu'un accès UI, pas les
données stockées) pourrait pousser ce compteur à une valeur absurdement
grande sans effet cassant (il ne fait que déclencher plus vite le pity),
donc l'impact réel est nul à faible. Mentionné pour mémoire, cohérent avec
la grille de contrôle de la mission, mais sans urgence : aucune logique de
déblocage ni d'affichage ne peut être cassée par une valeur haute ici,
contrairement à un score/pourcentage qui dépasserait 100.

### Intégrité runtime et offline

**Mineur — Intégrité runtime** — `js/app.js:920-1024` (`goBack()`) — Le
correctif récent (glissement d'écran « retour » cohérent même via des
méthodes intermédiaires asynchrones) réassigne temporairement
`UI.showScreen` par une fermeture englobante, restaurée dans un bloc
`finally`. En cas de double invocation rapprochée de `goBack()` (ex. double
tap sur le bouton retour) où le premier appel n'a pas encore atteint son
`finally` quand le second démarre, le second appel capture comme
« original » la version déjà wrappée par le premier, puis le `finally` du
premier appel restaure ensuite une version de `UI.showScreen` qui n'est pas
la toute première fonction native — un empilement de fermetures se forme.
Cela ne casse pas la navigation de façon visible dans les scénarios observés
(le comportement fonctionnel reste correct, seule la direction d'animation
d'un écran suivant pourrait ponctuellement être mal évaluée), mais c'est un
état runtime plus fragile que nécessaire pour une fonction de navigation
appelée très fréquemment. Correctif suggéré : utiliser un compteur de
profondeur de réentrance (n'assigner le wrapper que si `UI.showScreen` est
encore la fonction native, ne restaurer que quand le compteur retombe à 0)
plutôt qu'une capture/restauration simple.

**Mineur — Intégrité runtime** — `js/ui.js:79-94`
(`trapOverlayFocus`) et ses 2 points d'appel
(`js/ui.js:2557`, `js/app.js:1842`) — La fonction ajoute un écouteur
`keydown` global à chaque appel, retourné sous forme de callback de nettoyage
à invoquer par l'appelant. Dans `App.showNews()` (`js/app.js:1832`), si
`showNews()` est invoqué une seconde fois avant qu'un `closeNews()`
intermédiaire n'ait eu lieu (ex. double-clic sur le bouton nouveautés avant
que l'overlay n'intercepte les clics suivants), `this._newsFocusTrapCleanup`
est écrasé par la référence du second appel : le premier écouteur `keydown`
global n'est alors plus jamais retiré. Impact réel faible (un écouteur
`keydown` supplémentaire, pas une fuite mémoire significative sur une
session d'app éducative), mais c'est un gain de robustesse facile.
Correctif suggéré : dans `trapOverlayFocus` ou à l'appel, nettoyer
l'éventuel piège de focus précédent avant d'en poser un nouveau sur le même
overlay (garde d'idempotence).

### Encodage et intégrité des données

**Mineur — Encodage** — `js/app.js:3475` — Mojibake UTF-8 confirmé au niveau
octet : la chaîne de séparation dans
`.join("  â†’  ")` (retour visuel de l'exercice `timelineOrder` en cas de
réponse fausse) contient la séquence d'octets `C3 A2 E2 80 A0 E2 80 99`, qui
se décode en `â†’` au lieu du caractère `→` (flèche droite) attendu — un
UTF-8 encodé une fois de trop puis mal réinterprété, le motif de dette
d'encodage déjà documenté comme récurrent dans `CLAUDE.md`. Sans risque
d'exécution (insertion via `.textContent`, jamais interprété comme HTML),
mais l'enfant verra un texte garbled dans le feedback d'une frise
chronologique mal répondue. Hors périmètre strict de cet audit sécurité
(c'est un défaut de contenu/texte, pas une faille), signalé ici parce qu'il
est dans du code JS (donc hors du radar habituel de `content-quality-auditor`,
qui audite `data/*.json`) et parce que `SECURITY.md` §"Risques connus"
liste explicitement la dette d'encodage UTF-8 comme un risque résiduel du
projet. Correctif suggéré : remplacer par le caractère `→` correctement
encodé (ou l'entité `→` en JS), et vérifier le fichier source avec un
outil qui détecte le double encodage plutôt qu'une relecture visuelle
(cette classe de mojibake n'est pas toujours visible selon l'éditeur/la
police).

## Findings déjà connus, non corrigés

Sans objet — aucun audit de sécurité antérieur (`docs/security-audit-*.md`)
n'existait avant celui-ci.

## Hors modèle de menace

- **Robustesse de `App.fetchJson` en mode `file://` bundle** (`js/app.js:300-351`) :
  examiné en détail — le chemin `readBundled()` synchrone (branché quand
  `useBundledFirst` est vrai, c'est-à-dire en `file://`) n'est **pas** enrobé
  d'un `try/catch` local avant son premier appel (ligne 324), contrairement
  au chemin réseau qui, lui, protège son `JSON.parse`. Un `data-bundle.js`
  corrompu (déjà arrivé par le passé selon l'historique du projet — dette
  d'encodage documentée) ferait alors remonter une exception non interceptée
  au lieu d'un repli propre. Classé en **Mineur** dans la section Intégrité
  runtime plutôt qu'écarté, car c'est exactement le scénario offline que le
  projet dit vouloir couvrir (`SECURITY.md` §4) — mentionné ici pour
  transparence sur la frontière retenue : ce n'est pas une injection ni un
  vecteur d'attaque, seulement un défaut de repli.
- **PIN parental (`js/storage.js:1412-1429`)** : volontairement non traité
  comme une authentification forte manquante, conformément au modèle de
  menace du projet — c'est un verrou d'accès UI local (4 chiffres, valeur
  par défaut `0000`), pas une protection de données sensibles chiffrées.
  Aucune recommandation de renforcement (hash, verrouillage anti-bruteforce)
  n'est faite : il n'y a rien de chiffré à protéger derrière, et
  l'attaquant potentiel (l'enfant lui-même, sur le même appareil) a de toute
  façon un accès physique complet au `localStorage`.
- **`localStorage` non chiffré / éditable à la main** : fait assumé et déjà
  documenté dans `SECURITY.md` (« ce stockage n'est pas une sécurité
  forte »). Non re-signalé comme un finding : cet audit a vérifié que les
  *conséquences* d'une édition manuelle restent bornées (scores, pièces,
  états d'avatar tous revalidés à la lecture par `storage.js`), ce qui est
  le seul point réellement actionnable dans ce modèle de menace.
- **Aucune dépendance externe recommandée** : conforme à la contrainte du
  projet (pas de bibliothèque de sanitisation HTML tierce type DOMPurify
  suggérée) — les helpers `SecurityUtils` internes couvrent le besoin réel
  et une dépendance externe serait hors cadre pour ce projet sans backend et
  sans build step.

## Vérifications lancées en filet

- `node --check` sur `js/app.js`, `js/ui.js`, `js/ui-keyboards.js`,
  `js/engines-math.js`, `js/validators.js`, `js/storage.js`,
  `js/security.js`, `js/bootstrap.js`, `js/ui-documentary.js`,
  `js/ui-board.js`, `js/ui-visuals.js`, `js/engines-french.js`,
  `js/engines-documentary.js`, `js/engines-board.js`, `js/engines-core.js`,
  `js/engines.js`, `sw.js`, `js/version.js` — **tous OK**, aucune erreur de
  syntaxe.
- `node scripts/build-content-index.js --check` —
  `CONTENT_INDEX_CHECK_OK — 1013 exercices, 367 leçons, 74 banques,
  482 avertissement(s)` (avertissements = doublons « mous » légitimes déjà
  documentés dans `CLAUDE.md`, non bloquants).
- `node scripts/validate-subjects.js` —
  `OK — toutes les matières des fichiers de niveaux sont canonicalisables.`
- `powershell -File scripts/validate-data.ps1` —
  `DATA_VALIDATION_OK` (94 fichiers vérifiés, 564 références d'exercices).
- Comparaison manuelle `js/validators.js` (`knownEngines`) vs
  `scripts/validate-data.ps1` (`$knownEngines`) — listes strictement
  identiques (13 moteurs). Comparaison du contrat `conversion`/`params.modes`
  ajouté récemment dans les deux validateurs — logique de validation
  équivalente de part et d'autre (tableau ou valeur scalaire acceptés,
  4 modes autorisés identiques).
- `git diff --stat` sur les fichiers signalés comme récemment modifiés
  (`css/app.css`, `js/app.js`, `js/engines-math.js`, `js/ui-keyboards.js`,
  `js/ui.js`, `js/validators.js`, `scripts/validate-data.ps1`) : lu en
  entier pour confirmer que le correctif d'uniformisation de l'échappement
  du clavier virtuel (`data-val`) et le correctif du moteur de conversion
  (`params.modes` normalisé en tableau) sont cohérents entre eux et avec
  leurs validateurs — aucune régression trouvée dans ces changements.

## Rappel

**Aucun correctif n'a été appliqué au code par cet audit.** Les 9 points
listés ci-dessus (0 Bloquant, 2 Majeurs, 5 Mineurs, 2 Suggestions) sont un
diagnostic. La décision de corriger, de prioriser ou d'écarter chaque point
revient à l'utilisateur ou à une intervention ciblée séparée.

# Audit de sécurité — 2026-09-16

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

**Contexte de ce passage** : le dernier audit (`docs/security-audit-2026-08-05.md`)
date de six semaines. Deux commits ont depuis touché la surface sécurité/UI
(`0ee779f` — correctifs cross-theme/échappement/validateurs, `d813b7c` —
correction du mojibake de `preview-local.html` et durcissement de `ui.js`).
Conformément à la procédure, **chaque point de l'audit précédent a été
revérifié sur le code actuel**, pas recopié : deux points étaient bien
corrigés, un point avait été sous-vérifié en août et est ici corrigé à la
hausse (voir « Régressions et corrections d'appréciation »).

## Tableau de synthèse

| Sévérité      | Injection DOM/XSS | Stockage local | Intégrité runtime/offline | Encodage | Total |
|---------------|:---:|:---:|:---:|:---:|:---:|
| Bloquant      | 0 | 0 | 0 | 0 | **0** |
| Majeur        | 3 | 0 | 0 | 0 | **3** |
| Mineur        | 2 | 1 | 2 | 0 | **5** |
| Suggestion    | 1 | 1 | 0 | 0 | **2** |
| **Total**     | **6** | **2** | **2** | **0** | **10** |

Aucun chemin d'exploitation Bloquant identifié : les trois entrées utilisateur
réelles (nom de profil, import JSON de sauvegarde, réponse aux exercices via
le clavier virtuel à jeu de caractères fermé) restent systématiquement
échappées, sanitées ou re-validées avant toute insertion DOM ou écriture en
stockage — vérifié en traçant chaque flux de bout en bout (voir détail
ci-dessous). Les trois Majeurs concernent tous des champs texte issus de
`data/*.json` (contenu d'auteur, pas de saisie utilisateur), insérés en
`innerHTML` sans passer par `SecurityUtils.escapeHtml`.

## Findings détaillés

### Injection DOM / XSS

**Majeur — Injection DOM/XSS** — `js/engines-documentary.js:52,88,152,214` +
`js/ui.js:1288` — Les moteurs `matching`, `wordOrder` et `timeline`
(modes `order`/`place`) renvoient `question: item.title || "..."`,
`question: item.instruction || "..."` et `question: timelineDef.title || "..."`
**sans passer par `SecurityUtils.escapeHtml`** — contrairement aux moteurs
`engines-math.js`/`engines-board.js` qui échappent systématiquement leur
`question`. Ce champ `p.question` est ensuite injecté **tel quel** dans
`instructionZone.innerHTML = rendersQuestionInProblemZone ? "" : (p.question || "")`
(`js/ui.js:1288`, dans `updateGameDisplay`), pour tout `visualType` non listé
dans `['homophones', 'timeMemo']` — ce qui couvre précisément `matching`,
`wordOrder`, `timelineOrder` et `timelinePlace`. `item.title`/`item.instruction`
proviennent de `data/*.json` réellement chargés en production
(`data/french_word_order.json` contient par ex. `"instruction": "Remets les
mots dans le bon ordre."` ; `data/history_chrono.json` peuple `timelineDef.title`
pour les frises CP→CM2) : ce n'est donc **pas** un cas latent/inutilisé comme
le champ `img` corrigé en août, mais un chemin réellement emprunté à chaque
exercice `matching`/`wordOrder`/`timeline` des cinq niveaux. Le risque reste
classé Majeur et non Bloquant car la source est un JSON d'auteur (contenu
éditorial), pas une saisie d'utilisateur final — mais un caractère `<`/`>`/`&`
introduit par erreur (ou copié depuis une source externe lors d'une future
vague de contenu) casserait le rendu ou injecterait du HTML/JS arbitraire dans
le navigateur de l'enfant. Correctif suggéré : envelopper les 4 retours
`question:` cités avec `SecurityUtils.escapeHtml(...)`, à l'image de
`js/engines-board.js`.
> Note méthodologique : l'audit du 2026-08-05 avait classé ce point en
> **Suggestion**, en concluant que `question` n'était « réutilisé que dans
> `drawFactualCard`, où il est ré-échappé ». Cette conclusion était incomplète —
> `drawFactualCard` n'est qu'un des cinq `visualType` concernés, et
> `updateGameDisplay` (le chemin générique) ne ré-échappe pas `p.question`.
> Voir « Régressions et corrections d'appréciation ».

**Majeur — Injection DOM/XSS** — `js/engines-math.js:102-121` (cas
`proportionnalite`) et `js/engines-math.js:470-486` (cas `moyenne`) — Les deux
générateurs construisent `question` en interpolant directement `ctx.label`,
`ctx.unit` et `context` issus de `p.contexts` (un paramètre `params.contexts`
non documenté, non validé) sans passer par `SecurityUtils.escapeHtml`, avant
de renvoyer `question: \`<span class="small-question">${question}</span>\``
— qui atterrit ensuite en `innerHTML` via `updateGameDisplay`. Recherche
confirmée : **aucun** fichier `data/*.json` ne définit `contexts` aujourd'hui
(les deux moteurs retombent systématiquement sur leur tableau de secours
interne, composé de chaînes statiques sûres) — le risque est donc latent,
exactement comme le champ `img` corrigé lors de l'audit précédent. Ni
`js/validators.js` ni `scripts/validate-data.ps1` ne valident ce paramètre.
Correctif suggéré : échapper `ctx.label`/`ctx.unit`/`context` à la
construction (ou échapper `question` en sortie, comme déjà fait pour les cas
`bar-chart-read`/`data-table-read` du même fichier), et ajouter une validation
de `params.contexts` dans les deux validateurs si ce paramètre est
véritablement destiné à être utilisé par du contenu futur.

**Majeur — Injection DOM/XSS (groupe : rendu de champs JSON non échappés dans
`js/ui.js`)** — Plusieurs fonctions de rendu insèrent en `innerHTML` un champ
texte issu de `data/*.json` sans passer par `_escapeText`/`SecurityUtils.escapeHtml`,
alors que des champs voisins de la même fonction sont, eux, bien échappés —
signe d'un oubli localisé plutôt que d'un choix : 
- `js/ui.js:215-220` (`safeIcon`) : ce helper ne fait que rejeter les valeurs
  vides ou détectées comme mojibake (`�`, `Ã`, `ï¿`) — il **n'appelle
  jamais `escapeHtml`**. Il est pourtant utilisé comme unique filtre avant
  insertion `innerHTML` sur des champs `icon` provenant de JSON d'auteur :
  `js/ui.js:648` (`resolveMenuIcon(item, ...)` dans `renderMenu`, source :
  `icon` de `data/index.json` grades et `data/{grade}.json` subjects/subthemes),
  `js/ui.js:794` (`subject.icon`, écran de progression, même source),
  `js/ui.js:1795` (`d.icon` dans `drawSpelling`, source : champ `icon` de
  `data/french/spelling.json`/`grammar.json`), et indirectement
  `js/ui.js:873` via `js/app.js:1886-1892` (`level.icon` de
  `data/quiz_culture.json`, transmis par `renderBrowseModes`). Tous ces champs
  ne contiennent aujourd'hui qu'un unique emoji, mais rien ne le garantit
  structurellement (aucun validateur ne borne ce champ).
- `js/ui.js:1794,1801` (`drawSpelling`) : `word` (= `d.word`, provenant de
  `picked.word`/`displayWord` dans `data/french/spelling.json` ou
  `data/french/grammar.json` via `EnginesFrench.genderArticles`) est inséré
  tel quel dans `<div class="word-full">${word}</div>` sur la branche QCM
  (`isQCM === true`, empruntée par tous les exercices `genderArticles`) — sans
  échappement. La branche non-QCM (affichage lettre par lettre) est saine car
  bâtie caractère par caractère depuis la saisie du clavier virtuel, à
  l'alphabet fermé.
- `js/ui.js:1732-1734` (`drawReading`) : chaque caractère de `d.syllables`/
  `d.text` (texte de lecture issu de `data/french/reading.json` et des
  fichiers `french_*_reading.json`) est inséré un par un dans
  `<span>${char}</span>` sans échappement.
- `js/ui.js:1833-1842` (`drawConjugation`) : `temps` (dérivé de
  `p.tenses`/`selectedTense`) et `infinitif` (= `verb.infinitive`, issu de
  `data/french/conjugation.json`) sont insérés bruts dans `tense-badge`/
  `verb-infinitive`. `saisie` (la frappe de l'enfant) n'est pas concernée :
  elle provient exclusivement des touches du clavier virtuel (alphabet fermé,
  jamais `<`/`>`/`"`), donc sans risque même non échappée.

Aucun de ces points n'est exploitable aujourd'hui (contenu actuel = texte
français ou emoji simple, sans `<`/`>`/`&`), mais c'est la même classe de
risque latent que le champ `img` corrigé en août 2026 dans ce même fichier —
et il touche ici davantage de points d'insertion. Correctif suggéré : faire
appeler `escapeHtml` par `safeIcon` lui-même (il resterait alors un filtre
mojibake + un échappement, sans changer sa signature ni ses appelants), et
passer `word`/chaque `char`/`infinitif`/`temps` par `_escapeText` avant
insertion.

**Mineur — Injection DOM/XSS (échappement d'attribut non homogène, persiste)**
— `js/ui.js:396,420,924,2311,2478` — Ces 5 insertions dans des attributs
`data-*` (`data-starter-id`, `data-evolve-id`, `data-lesson-id`, `data-fact`,
`data-card-id`) utilisent toujours `this._escapeText(...)` (=`escapeHtml`, qui
n'échappe pas le backtick) plutôt que `this._safeAttr(...)` (=`escapeAttr`).
Comme lors de l'audit précédent : ces valeurs sont dans un attribut entre
guillemets doubles, où le backtick n'a aucun effet et où `"` est bien échappé
par `escapeHtml` — donc **toujours pas exploitable en pratique**, seulement
une incohérence de convention interne face à `_safeAttr` déjà utilisé ailleurs
dans le même fichier (ex. `js/ui.js:1040`, `data-choice`). Voir
« Findings déjà connus, non corrigés ».

**Mineur — Injection DOM/XSS (nouveau, faible impact)** — `js/ui.js:200` —
`img.src = appearance.cardImage;` (dans `renderHeaderAvatar`, avatar de
carte du Grimoire affiché dans l'en-tête) assigne directement la propriété
DOM `src` sans passer par `this._safeImagePath`, contrairement au point
d'insertion équivalent `js/ui.js:335` (`<img src="${this._safeImagePath(p.cardImage)}">`)
qui affiche la même donnée (`Storage.getProfileAppearance().cardImage`, déjà
validée en amont contre la collection possédée — voir
`js/storage.js:1370-1371`) dans la liste des profils. Une assignation directe
de propriété `.src` n'est pas interprétée comme du HTML par le navigateur
(pas de risque d'injection de balise/attribut, contrairement à une
concaténation dans une chaîne `innerHTML`), donc l'impact réel est nul avec
la source actuelle. Signalé pour cohérence de discipline de code plutôt que
pour un risque concret. Correctif suggéré : router ce point aussi par
`this._safeImagePath` pour que toute source d'image dans `ui.js` passe
uniformément par la même whitelist.

### Stockage local

**Mineur — Stockage local (préfixe `dn_` non systématique, persiste)** —
`js/storage.js` (ensemble du fichier) — Toujours seulement 4 clés globales
préfixées `dn_` (`dn_current_user`, `dn_profiles_list`, `dn_parent_pin`,
`dn_quiz_scores` — confirmé aux lignes 10-11, 1412, 1842). Toutes les clés
par profil (`coins_*`, `cards_*`, `records_*`, `streak_*`, `champion_*`,
`avatar_state_*`, `activity_log_*`, `redemptions_*`, `appearance_*`,
`lesson_views_*`) restent sans préfixe. Aucun changement depuis l'audit du
2026-08-05 (cohérent : les deux commits examinés ne touchaient pas
`storage.js`). Voir « Findings déjà connus, non corrigés ».

**Suggestion — Stockage local (absence de borne haute sur `boostersSansNouvelle`,
persiste)** — `js/storage.js:255,542` — Toujours borné en bas
(`Math.max(0, ...)`) mais pas en haut. Impact toujours nul à faible (accélère
seulement le pity). Voir « Findings déjà connus, non corrigés ».

*Point vérifié et confirmé sain* : l'import de sauvegarde
(`Storage.importAllData`, `js/storage.js:1205-1293`) écrit certes plusieurs
blocs (`records`, `lessonViews`, `activityLog`, `champion`, `cards`) « tels
quels » dans le stockage, mais **chaque lecteur correspondant**
(`_readRecords`, `_readLessonViews`, `getTodayActivity`/`getWeeklyActivity`,
`getChampionScores`, `_readCardState`) revalide intégralement à la lecture
(coercition numérique stricte, `_generateHash` pour les records, whitelist
pour `avatarState`/`appearance`/`cardAvatar`) — un fichier de sauvegarde édité
à la main ne peut donc pas faire apparaître de score/compteur incohérent
côté UI, ni d'image/carte non possédée. `JSON.parse` du fichier importé est
bien protégé par un `try/catch` (`js/app.js:220-225`). Ce point, explicitement
dans le périmètre de la mission (« un import est une entrée utilisateur comme
une autre »), a été vérifié en détail et ne donne lieu à aucun finding.

### Intégrité runtime et offline

**Mineur — Intégrité runtime (persiste, inchangé)** — `js/app.js:1014-1021`
(`goBack()`) — Le mécanisme de capture/restauration temporaire de
`UI.showScreen` (pour forcer la direction d'animation « retour ») reste une
simple capture/restauration sans compteur de réentrance : un double appel
rapproché de `goBack()` peut toujours empiler des fermetures. Comportement
fonctionnel inchangé (pas de plantage observé), juste plus fragile que
nécessaire. Voir « Findings déjà connus, non corrigés ».

**Mineur — Intégrité runtime (persiste, inchangé)** — `js/ui.js:79-94`
(`trapOverlayFocus`) + `js/app.js:1842-1850` (`App.showNews`/`closeNews`) —
Toujours pas de garde d'idempotence : un second appel à `showNews()` avant
fermeture du premier écraserait `this._newsFocusTrapCleanup` et laisserait un
écouteur `keydown` global orphelin. Impact réel toujours faible. Voir
« Findings déjà connus, non corrigés ».

*Point vérifié et confirmé sain* : `sw.js` — `CACHE_NAME = 'dn-v' + self.APP_VERSION`
(ligne 11) reste bien dérivé de `js/version.js` (`APP_VERSION = '4.39.0'`),
la purge des anciens caches à l'activation est intacte (lignes 406-415), les
320 chemins de `DATA_ASSETS`/`CARD_ASSETS`/`APP_ASSETS` référencés existent
tous sur le disque (vérifié par script), et `isAllowedRequest`/
`isCacheableResponse` restreignent bien le cache à l'origine du site et à des
types de contenu attendus. Aucune régression, aucun nouveau finding.

*Point vérifié et confirmé sain* : le chargement des cartes interactives
(`map-locate`) valide le SVG distant via `Validators.isSafeSvgMarkup`
(`js/validators.js:34-59`, whitelist stricte de balises `svg`/`path`/`g` et
d'attributs, rejet de `script`/`on*=`/`javascript:`) **avant** insertion dans
le DOM (`js/app.js:2904`), et l'insertion elle-même passe par
`DOMParser.parseFromString` (`js/ui-board.js:703`) plutôt que par
`innerHTML` — une défense en profondeur à deux niveaux, cohérente avec le
modèle de menace, sans finding associé.

### Encodage et intégrité des données

Aucun finding. Le mojibake identifié lors de l'audit précédent
(`js/app.js:3487`, séparateur `â†’` dans le feedback de frise chronologique)
est **corrigé** : vérification au niveau octet, la chaîne contient désormais
le caractère `→` correctement encodé. Un balayage de tous les fichiers JS
listés dans les vérifications ci-dessous ne révèle aucun autre motif de
mojibake (`Ã.`, `Â.`, `â€`, `ï¿½`). `preview-local.html` (corrigé par
`d813b7c`) a également été revérifié : plus aucun octet suspect, et les blocs
`<script>` inline restent syntaxiquement valides (`new Function(...)` sans
erreur).

## Régressions et corrections d'appréciation par rapport à l'audit précédent

- **Corrigé, confirmé** : `js/ui.js:1802` (`drawSpelling`, champ `img`) passe
  désormais par `SecurityUtils.safeImagePath` (`js/ui.js:1796`) — le Majeur
  de l'audit du 2026-08-05 est résolu.
- **Corrigé, confirmé** : `SecurityUtils.safeImagePath` est maintenant appelé
  à tous les points d'insertion `<img src>` dynamiques recensés en août
  (cartes du Grimoire : `js/ui.js:335,549,2480,2564,2780` ; orthographe :
  `js/ui.js:1796`) — le second Majeur de l'audit précédent est résolu.
- **Corrigé, confirmé** : le mojibake `â†’` de `js/app.js` (Mineur, Encodage)
  est réparé.
- **Corrigé, confirmé** : `preview-local.html` ne contient plus le guillemet
  mojibake qui cassait sa syntaxe JS (corrigé par `d813b7c`, hors périmètre
  strict de l'audit précédent car non signalé alors, mais vérifié ici comme
  toujours sain).
- **Correction d'appréciation (escalade Suggestion → Majeur)** : le point
  « défense en profondeur absente à la source » sur `js/engines-documentary.js`,
  classé Suggestion le 2026-08-05 au motif que `question` n'était « réutilisé
  que dans `drawFactualCard` », est requalifié en **Majeur** ce jour-ci : une
  revérification complète des consommateurs de `p.question` montre que
  `js/ui.js:1288` (`updateGameDisplay`, chemin générique de rendu) l'insère
  aussi tel quel pour les `visualType` `matching`/`wordOrder`/`timelineOrder`/
  `timelinePlace` — un chemin réellement emprunté par du contenu de
  production sur les 5 niveaux, pas une hypothèse. Ce n'est pas une
  régression du code (le comportement n'a pas changé depuis août), mais une
  correction du diagnostic : l'audit précédent n'avait pas tracé tous les
  points de consommation de `question` avant de conclure à la non-exploitabilité.
- **Nouveaux findings** (pas présents en août, ou non détaillés alors) : les
  deux occurrences `p.contexts` dans `js/engines-math.js` et le groupe
  `safeIcon`/`drawSpelling`/`drawReading`/`drawConjugation` dans `js/ui.js` —
  probablement déjà présents en août mais non repérés lors du passage
  précédent (aucun de ces fichiers n'a été modifié par les deux commits
  examinés ici, donc il ne s'agit pas d'une régression introduite entre les
  deux audits).

## Findings déjà connus, non corrigés

- Mineur — préfixe `dn_` non systématique sur les clés par profil
  (`js/storage.js`).
- Mineur — échappement d'attribut non homogène (`_escapeText` au lieu de
  `_safeAttr`) sur 5 attributs `data-*` de `js/ui.js` (non exploitable).
- Mineur — réentrance de `goBack()` (`js/app.js:1014-1021`).
- Mineur — non-idempotence de `trapOverlayFocus`/`showNews`
  (`js/ui.js:79-94`, `js/app.js:1842-1850`).
- Suggestion — absence de borne haute sur `boostersSansNouvelle`
  (`js/storage.js:255,542`).

Aucun de ces cinq points n'a été touché par les deux commits examinés dans ce
passage ; ils restent dans l'état diagnostiqué le 2026-08-05, revérifiés et
confirmés inchangés (pas recopiés à l'aveugle).

## Hors modèle de menace

- **PIN parental (`js/storage.js:1412-1429`)** : toujours volontairement non
  traité comme une authentification forte manquante — verrou d'accès UI
  local, pas une protection de données chiffrées.
- **`localStorage` non chiffré / éditable à la main** : fait assumé et
  documenté dans `SECURITY.md`. Vérifié une nouvelle fois que les
  *conséquences* d'une édition manuelle restent bornées par les lecteurs de
  `storage.js` (voir « Point vérifié et confirmé sain » ci-dessus sur
  l'import) — seul point réellement actionnable dans ce modèle de menace.
- **Absence de hachage cryptographique fort pour les records de score**
  (`_generateHash`, `js/storage.js:56-64`, simple hash non cryptographique
  avec sel visible dans le code source) : envisagé puis écarté — ce mécanisme
  ne protège pas contre un utilisateur technique qui éditerait son propre
  `localStorage` pour gonfler son propre score (il a de toute façon un accès
  physique complet à l'appareil), il sert seulement à filtrer une corruption
  accidentelle. Le seul cas où ça affecterait un tiers est le classement
  partagé du Grand Quiz sur un même appareil (podium entre profils du même
  foyer) — un risque de triche locale entre membres d'une même famille, pas
  une vulnérabilité de sécurité au sens du modèle de menace de ce projet.
- **Aucune dépendance externe recommandée** : conforme à la contrainte du
  projet (pas de bibliothèque de sanitisation HTML tierce suggérée).

## Vérifications lancées en filet

- `node --check` sur `js/app.js`, `js/ui.js`, `js/ui-keyboards.js`,
  `js/ui-board.js`, `js/ui-visuals.js`, `js/ui-documentary.js`,
  `js/storage.js`, `js/security.js`, `js/bootstrap.js`, `js/engines-math.js`,
  `js/engines-french.js`, `js/engines-documentary.js`, `js/engines-board.js`,
  `js/engines-core.js`, `js/engines.js`, `js/validators.js`, `sw.js`,
  `js/version.js` — **tous OK**, aucune erreur de syntaxe.
- `node scripts/build-content-index.js --check` —
  `CONTENT_INDEX_CHECK_OK — 1013 exercices, 367 leçons, 74 banques,
  482 avertissement(s)` (doublons « mous » légitimes déjà documentés,
  non bloquants ; aucune désynchronisation de routes de validation détectée
  entre `js/validators.js` et `scripts/validate-data.ps1`).
- `node scripts/validate-subjects.js` —
  `OK — toutes les matières des fichiers de niveaux sont canonicalisables.`
- `powershell -File scripts/validate-data.ps1` —
  `DATA_VALIDATION_OK` (94 fichiers vérifiés, 564 références d'exercices).
- `node scripts/validate-maps.js` — `OK — sous-système cartes cohérent`
  (3 avertissements de banques orphelines, hors périmètre sécurité).
- Comparaison manuelle `js/validators.js` (`knownEngines`, 13 moteurs) vs
  `scripts/validate-data.ps1` (`$knownEngines`) — listes strictement
  identiques, confirmé ligne à ligne.
- Vérification octet par octet de `js/app.js` autour du séparateur de frise
  chronologique et balayage regex (`Ã.`, `Â.`, `â€`, `ï¿½`) sur les 18 fichiers
  JS listés ci-dessus, et sur `preview-local.html` — aucun mojibake résiduel.
- Vérification que les 320 chemins `data/*` référencés dans `sw.js`
  (`APP_ASSETS`+`DATA_ASSETS`+`CARD_ASSETS`) existent tous sur le disque —
  confirmé.
- Traçage complet des consommateurs de `p.question` (moteurs → `ui.js`/
  `ui-documentary.js`) et de `Storage.importAllData` → chaque lecteur
  associé, pour distinguer risque latent de risque réellement atteint.

## Rappel

**Aucun correctif n'a été appliqué au code par cet audit.** Les 10 points
listés ci-dessus (0 Bloquant, 3 Majeurs, 5 Mineurs, 2 Suggestions) sont un
diagnostic. La décision de corriger, de prioriser ou d'écarter chaque point
revient à l'utilisateur ou à une intervention ciblée séparée.

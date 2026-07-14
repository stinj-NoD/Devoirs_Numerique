# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Ce que c'est

**Devoir Numérique** : application éducative pour le primaire (CP → CM2), en français. SPA JavaScript vanilla, **sans backend, sans build step, sans framework** — HTML/CSS/JS servis tels quels. Contenu pédagogique entièrement piloté par des fichiers JSON dans `data/`. Doit fonctionner offline (service worker) et en ouverture directe du fichier (`file://`), sur GitHub Pages.

Deux parcours cohabitent : `J'apprends` (bibliothèque de leçons courtes) et `Je m'entraîne` (exercices générés par moteurs). Il existe aussi un système de gamification annexe (Grimoire : cartes à collectionner via boosters, pièces gagnées en jouant, Mode Champions chronométré, Grand Quiz cross-profil).

## Commandes

Pas de build, pas de `package.json`, pas de gestionnaire de paquets — ne pas en introduire. Tous les scripts sont PowerShell (`.ps1`) ou Node pur (aucune dépendance npm).

**Après toute modification dans `data/` (workflow obligatoire) :**
```powershell
powershell -ExecutionPolicy Bypass -File scripts/validate-data.ps1
powershell -ExecutionPolicy Bypass -File scripts/regenerate-data-bundle.ps1
```
Puis vérifier manuellement au minimum : une leçon, un exercice maths, un exercice français, un exercice documentaire, un retour vers résultats.

**Validateurs complémentaires (Node, sans dépendance) :**
```bash
node scripts/validate-subjects.js   # chaque sujet des 5 niveaux doit être reconnu par Storage.canonicalizeSubjectId (sinon ses records n'ont pas de matière pour les badges)
node scripts/validate-maps.js       # à lancer après tout ajout de carte map-locate ou d'exercice board-interactive
```

**Vérification de syntaxe rapide sur un fichier JS modifié :**
```bash
node --check js/app.js
```

**Autres scripts utilitaires (`scripts/`)** : `repair-json-encoding.ps1` / `fix-french-lib-visible.ps1` (répare le mojibake UTF-8 récurrent dans les JSON historiques), `generate-content-architecture.js` (régénère `CONTENT_ARCHITECTURE.md` depuis les fichiers de niveau — à relancer après toute vague de contenu), `inventory-assets.ps1`, `enrich-documentary-data.ps1`, `refresh-local-data.ps1`, `process-card-images.py` (pipeline images de cartes du Grimoire, voir l'agent `card-image-processor`).

Il n'y a pas de suite de tests automatisés au sens classique — la vérification passe par les validateurs ci-dessus + un test manuel dans le navigateur.

## Lancer l'app

Pas de serveur dédié requis : ouvrir `index.html` directement (`file://`) ou via n'importe quel serveur statique. Le code gère les deux : en `file://`, `App.fetchJson`/`fetchText` lisent en priorité `js/data-bundle.js` (JSON/SVG encodés en base64) plutôt que de `fetch()` (qui échoue sous `file://`) ; sinon fetch réseau d'abord, avec repli sur le bundle si le fetch échoue.

En dev servi en local (`localhost`/`127.0.0.1`/`192.168.*`), `js/bootstrap.js` **désenregistre automatiquement le service worker et vide les caches** au chargement (avec un reload forcé une fois) — évite de servir une version cachée pendant le développement. Ce comportement ne s'applique pas en production.

`preview-local.html` : aperçu autonome des leçons (hors flux SPA complet), utile pour itérer vite sur le contenu.

## Architecture

### Chaîne de rendu d'un exercice

`data/{niveau}.json` déclare un exercice avec `engine` + `params` → `js/engines.js` (`Engines.run`) dispatch selon `engine`/`params.type` vers le bon générateur dans un des modules `engines-*.js` → sortie standardisée (`question`, `answer`, `inputType`, `isVisual`, `visualType`, `data`) → `js/ui.js` (ou `ui-board.js`/`ui-visuals.js`/`ui-documentary.js` selon `visualType`) rend le HTML → `js/app.js` orchestre le cycle question → validation → score → résultat.

**Ne jamais changer un contrat `engine` + `params` sans mettre à jour les deux validateurs** (`js/validators.js` runtime + `scripts/validate-data.ps1` hors-runtime) — ils doivent rester strictement synchronisés, sinon un contenu invalide passe en prod ou un contenu valide est rejeté à tort.

Modules `engines-*.js` :
- `engines-core.js` : utils partagés (`rnd`, `pick`, `pickUnused` — tirage sans répétition dans une session, `shuffle`, romanisation)
- `engines-math.js`, `engines-french.js`, `engines-documentary.js` : générateurs par domaine
- `engines-board.js` : activités interactives non-QCM (tap-features, shape-classify, point-on-grid, symmetry-complete, fraction-build, map-locate, memory-match, angle-classify, angle-measure, construction-report) — rendues par `ui-board.js`

### Structure du contenu (`data/`)

Niveau → `subjects[]` → `subthemes[]` → `lessons[]` et/ou `exercises[]`. Une leçon est `{ id, title, subtitle, format: "lesson-card", blocks[] }`, blocs supportés : `paragraph`, `example`, `tip`, `bullets`, `mini-table`. Voir `technicalaspect.md` section 4 pour le modèle complet et `docs/lesson-guidelines.md` pour la règle éditoriale (une notion par leçon, exemple concret obligatoire, 3-5 blocs).

`data/french/*.json` (spelling, conjugation, homophones, grammar, reading) est une bibliothèque partagée chargée une fois, indépendante des fichiers de niveau, passée en `lib` aux moteurs français.

### Bundle et offline

`js/data-bundle.js` embarque **tout** `data/**/*.{json,svg}` en base64 (sauf `data/maps/*.json`, jamais lus au runtime, exclus par le script). Il doit être régénéré après **tout** changement dans `data/`, sinon le mode `file://` et le fallback offline servent du contenu périmé.

`sw.js` : le `CACHE_NAME` dérive de `APP_VERSION` (`js/version.js`, source unique, aussi affichée dans l'UI) — `APP_VERSION` doit être incrémentée à **chaque** déploiement modifiant `data/*.json` ou du code JS/CSS, sans ça le navigateur considère `sw.js` inchangé et ne retélécharge jamais rien (particulièrement bloquant sur iOS/Safari). Un bouton « Mettre à jour l'application » (`App.forceAppUpdate()`) force la vérification côté utilisateur.

### Cartes interactives (`map-locate`)

Sous-système à part avec ses propres règles — lire `docs/maps-architecture.md` avant tout ajout/modif. En résumé : un exercice `map-locate` relie un SVG (`data/maps/*.svg`, un `<path id="zone" data-name="Nom">` par zone cliquable), une banque de questions (`targetZoneId` doit matcher un id du SVG), et une entrée dans `mapCollectionDefinitions` (`js/app.js`) pour la collection à débloquer. `node scripts/validate-maps.js` vérifie ces cohérences croisées.

### `storage.js` (localStorage)

Bien plus large que "profils/scores" : gère aussi l'économie du Grimoire (pièces, boosters, cartes possédées, poids de tirage par rareté — voir `docs/grimoire-economy.md` pour la logique d'équilibrage), l'évolution d'avatar, les séries de jours consécutifs (streak), les badges de maîtrise par matière (`canonicalizeSubjectId`), le Mode Champions, le Grand Quiz, les préférences (PIN parental, vitesse de synthèse vocale), export/import complet des données d'un profil. Toute lecture/écriture passe par des clés préfixées `dn_`, avec fallback `localStorage → sessionStorage → mémoire` et sanitation défensive (voir `SECURITY.md` §3).

### Sécurité / robustesse

Pas de backend, donc la sécurité porte sur la robustesse des données et l'absence d'injection DOM. `js/security.js` (`SecurityUtils.escapeHtml`/`escapeAttr`/`sanitizeId`/`safeImagePath`) doit systématiquement échapper tout texte dynamique inséré en HTML (questions générées, libellés, contenu de moteurs procéduraux) — jamais de `innerHTML` avec du contenu non échappé. Détail complet dans `SECURITY.md`.

## Conventions de contribution

- Ne pas mélanger plusieurs zones critiques (data / UI / moteurs / validateurs) dans un même changement sans raison claire.
- IDs (`exercise.id`, `lesson.id`, `card.id`, etc.) doivent rester stables une fois publiés — ils sont utilisés comme clés de records/scores sauvegardés côté utilisateur.
- UTF-8 strict partout, français correct et accentué. Ne jamais introduire de mojibake, `\uXXXX` inutiles ou apostrophes dégradées dans du contenu visible — c'est une dette technique récurrente du projet (voir les scripts `repair-*-encoding*.ps1`).
- `choices` dans un exercice à choix doit toujours contenir la valeur `answer`.
- Préférer plusieurs petits lots de contenu cohérents à une grosse vague instable ; épaissir une catégorie trop faible avant d'ouvrir une nouvelle surface visible dessus.
- Toute évolution significative doit être répercutée dans la doc concernée (`README.md`, `technicalaspect.md`, `SECURITY.md`, `docs/curriculum-delta-cp-cm2.md`).

## Documentation existante (à consulter selon le sujet touché)

- `README.md` — vue d'ensemble produit et fonctionnement général
- `technicalaspect.md` — référence technique détaillée (modules, modèle de données, navigation)
- `CONTRIBUTING.md` — règles de contribution complètes
- `SECURITY.md` — surface de sécurité et contrôles en place
- `CONTENT_ARCHITECTURE.md` — inventaire généré des leçons/exercices par niveau et matière (régénérer via `node scripts/generate-content-architecture.js`)
- `docs/lesson-guidelines.md` — règle éditoriale des leçons
- `docs/maps-architecture.md` — sous-système cartes interactives
- `docs/grimoire-economy.md` — équilibrage économique du système de cartes à collectionner
- `docs/curriculum-delta-cp-cm2.md`, `docs/curriculum-audit-*.md` — alignement avec le programme scolaire français
- `docs/content-production-backlog.md` — historique et backlog de production de contenu
- `docs/platform-target.md`, `docs/storage-gap.md` — notes de plateforme/stockage
- `.claude/agents/card-image-processor.md` — agent dédié au pipeline des illustrations de cartes du Grimoire (traitement PNG → WebP, intégration catalogue)

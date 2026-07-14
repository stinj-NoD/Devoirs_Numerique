---
name: verify
description: Lancer et piloter Devoir Numérique dans un navigateur pour vérifier un changement de bout en bout (leçons, exercices, storage, thèmes clair/sombre).
---

# Vérifier Devoir Numérique en conditions réelles

SPA JS vanilla, **sans build step, sans npm** : rien à compiler, on sert et on pilote.
Il n'y a **aucun test automatisé** — la vérification passe par le navigateur.

## 1. Servir l'app

`file://` fonctionne (grâce à `js/data-bundle.js`), mais pour piloter, servir en HTTP :

```bash
cd "c:/Users/fayne/Documents/DN Git" && node -e "
const http=require('http'), fs=require('fs'), path=require('path');
const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png'};
http.createServer((req,res)=>{
  const u=decodeURIComponent(req.url.split('?')[0]);
  const f=path.join(process.cwd(), u==='/'?'index.html':u);
  fs.readFile(f,(e,d)=>{ if(e){res.writeHead(404);res.end('404');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'}); res.end(d); });
}).listen(8877,()=>console.log('SERVER_READY'));
" &
```

En dev local, `js/bootstrap.js` **désenregistre le service worker et vide les caches** (avec un reload forcé) — normal, pas un bug.

## 2. Piloter avec Playwright

Playwright n'est **pas** une dépendance du projet (et ne doit pas le devenir). Il vit dans le cache npx :

```bash
export NODE_PATH="C:/Users/fayne/AppData/Local/npm-cache/_npx/48b1ca104c3549f4/node_modules"
node mon-pilote.js
```

Si ce chemin a changé : `for d in ~/AppData/Local/npm-cache/_npx/*/node_modules/; do [ -d "$d/playwright" ] && echo "$d"; done`

## 3. Naviguer — l'API réelle

**Il n'y a pas de router** (pas de hash, pas de pushState). `UI.showScreen(id)` bascule le `display` de `<section class="screen">`.

Le chemin d'entrée, avec les **vrais** noms de fonctions (`selectGrade`/`selectProfile` **n'existent pas**) :

```js
// 1. profil
await page.evaluate(() => { Storage.addProfile('Zoe'); Storage.setCurrentUser('Zoe'); });
// 2. écran des niveaux (charge data/index.json)
await page.evaluate(() => App.loadGradesMenu());
// 3. cliquer une classe → App.loadGrade(g) → screen-mode
await page.evaluate(() => {
  for (const c of document.querySelectorAll('#grades-list .menu-card'))
    if (/\bCP\b/.test(c.textContent)) { c.click(); return; }
});
// 4. ouvrir une leçon précise via son sous-thème
await page.evaluate((id) => {
  for (const s of App.state.currentGrade.subjects)
    for (const st of (s.subthemes || [])) {
      const l = (st.lessons || []).find(x => x.id === id);
      if (l) { App.state.currentSubject = s; App.state.currentTheme = st; App.startLesson(l); return; }
    }
}, 'cp-lesson-addition-comprendre');
```

`App.state.currentGrade.gradeId` vient de l'entrée de `data/index.json`, pas du fichier de niveau.
Objets globaux disponibles dans la page : `App`, `UI`, `Storage`, `Engines`, `Validators`.

## 4. Ce qu'il faut vérifier (invariants du projet)

- **Les leçons ne doivent JAMAIS créer de record.** `Storage.getTotalStars()` est dérivé de `records` (`_sumStars`) et alimente aussi `exercisesAttempted`/`perfectCount`/`subjectMastery`. Après une leçon : `getTotalStars()` **inchangé**, `getCoins()` en hausse.
- **Anti-farm** : relire une leçon déjà comprise ne rapporte rien (`completeLessonView` → `justCompleted: false`).
- **Le CTA de fin de leçon n'est jamais un no-op** : il mène à un exercice, ou à la bibliothèque, ou au menu.
- **Non-régression** : une leçon *sans* bloc `check` doit avoir un CTA actif d'emblée (344 leçons sur 348).
- **Thème sombre obligatoire** : `Storage.setPreference('dark_mode', true); App.applyPreferences();` puis capture.

## 5. Pièges rencontrés (vécus, pas théoriques)

- **`header { }` est une règle globale** qui peint TOUT `<header>` en dégradé bleu avec `color: white`. Ne jamais utiliser `<header>` dans un composant : le fond bleu écrase le token et le texte devient illisible. Utiliser `<div>`.
- Le mode sombre **redéfinit les variables** dans `#app.theme-dark` (~ligne 173). Un composant qui n'utilise **que des tokens** fonctionne automatiquement. Les surcharges sélecteur-par-sélecteur ne servent qu'aux couleurs **codées en dur** (ex. `.lesson-card` : `#fffdf7`).
- `Storage.isQuietMode()` **n'existe pas** → `Storage.getPreference('quiet_mode')`. `AudioFeedback` gère déjà `sound_muted` en interne, ne pas re-tester la préférence avant de l'appeler.
- Toasts : `UI.showSimpleToast(icon, texte)` (pas `showToast`). Il retire le toast visible → espacer de **3500 ms** (durée de vie 3200 ms) et garder les timers dans `this._badgeToastTimers` pour pouvoir les annuler.

## 6. Après toute modif de `data/` (obligatoire, dans l'ordre)

```powershell
powershell -ExecutionPolicy Bypass -File scripts/validate-data.ps1
node scripts/build-content-index.js --check
powershell -ExecutionPolicy Bypass -File scripts/regenerate-data-bundle.ps1
node scripts/build-content-index.js --write
```
Plus `node scripts/validate-subjects.js` et `node scripts/validate-maps.js` selon la zone.
**Incrémenter `js/version.js`** (`APP_VERSION`) sinon le SW ne retélécharge jamais rien (bloquant iOS/Safari).

Vérifier que le bundle a bien pris :
```bash
node -e "global.window={};require('./js/data-bundle.js');
const j=JSON.parse(Buffer.from(window.DataBundle['data/cp.json'],'base64').toString('utf8'));
console.log('cles:',Object.keys(window.DataBundle).length);"
```

## 🧱 Pile Technique

> **Architecture volontairement minimaliste, robuste et lisible, pensée pour durer sans dette technique.**  
> Zéro framework inutile. Zéro magie opaque. Juste du code clair qui fait exactement ce qu’on lui demande.

[![Language](https://img.shields.io/badge/Language-JavaScript_ES6+-yellow.svg)]()
[![Architecture](https://img.shields.io/badge/Architecture-SPA_Vanilla-critical.svg)]()
[![Data](https://img.shields.io/badge/Data-JSON_Data--Driven-blue.svg)]()
[![Rendering](https://img.shields.io/badge/Rendering-DOM_Natif-lightgrey.svg)]()
[![Graphics](https://img.shields.io/badge/Graphics-SVG-green.svg)]()

---

### 🧠 Langage & Runtime

- **JavaScript ES6+**
  - Modules natifs (`import / export`)
  - Classes, arrow functions, destructuring
  - Aucun transpileur requis
- **Navigateur moderne**
  - Pas de dépendance Node côté client
  - Compatible tablettes et postes scolaires standards

---

### 🏗 Architecture Applicative

- **SPA (Single Page Application)**
  - Chargement unique
  - Navigation interne sans rechargement
- **Event-driven**
  - Communication par événements simples
  - Pas de state manager usine à gaz
- **Séparation stricte**
  - `engines.js` → logique métier
  - `data/*.json` → contenu pédagogique
  - `ui/` → rendu et interactions

---

### 📦 Gestion des Données

- **100 % Data-Driven**
  - Tout le contenu est externalisé en JSON
  - Aucun exercice codé en dur
- **Chargement initial unique**
  - Données chargées via `App.init()`
  - Cache mémoire pour performances constantes
- **Validation stricte**
  - JSON valide obligatoire
  - Schémas implicites respectés par les engines

---

### 🧩 Moteurs (Engines)

- **Engines indépendants**
  - `math-input`
  - `conjugation`
  - `choice-engine`
  - `reading`
  - `clock`
- **Contrats clairs**
  - Chaque engine consomme un `params` normalisé
  - Aucun engine ne connaît le contexte global
- **Extensibilité**
  - Ajout d’un moteur sans modifier les autres
  - Ajout de contenu sans toucher au code

---

### 🎨 UI & Rendu

- **DOM natif**
  - Pas de virtual DOM
  - Pas de framework CSS
- **SVG**
  - Horloges, feedback visuel, icônes interactives
- **CSS sobre**
  - Lisibilité > effets
  - Animations minimales, intentionnelles

---

### ⌨️ Interaction Utilisateur

- **Claviers virtuels internes**
  - Numérique
  - AZERTY avec accents
  - Vrai / Faux
- **Contrôle total des entrées**
  - Pas de dépendance au clavier système
  - Expérience homogène tablette / desktop

---

### 🔒 Contraintes Assumées

- Pas de backend
- Pas d’authentification
- Pas de tracking
- Pas de dépendance externe critique

> **Choix assumé** : moins de couches, moins de bugs, moins de maintenance.  
> Le logiciel éducatif n’a pas besoin d’être à la mode pour être fiable.

---

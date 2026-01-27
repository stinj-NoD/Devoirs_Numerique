# 🎓 Devoir Numérique

> **Une plateforme d'apprentissage minimaliste et ludique pour les élèves de l'école primaire (CP au CM2).**

[![Status](https://img.shields.io/badge/Status-Stable-success.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tech](https://img.shields.io/badge/Stack-Vanilla_JS-orange.svg)]()

---

## 🌟 Vision du Projet

**Devoir Numérique** a été conçu pour offrir aux enfants un environnement d'apprentissage **sans distraction**. Contrairement aux plateformes souvent surchargées, cette application se concentre sur l'essentiel : l'acquisition des fondamentaux (Maths, Français, Conjugaison) à travers une interface épurée et rassurante.

### 🇫🇷 Points Clés (Français)
* **Minimalisme & Focus** : Pas de publicités, pas de menus complexes. L'enfant se concentre uniquement sur l'exercice.
* **Pédagogie Positive** : Un système de 1 à 3 étoiles récompense l'effort. En cas d'erreur, la correction est affichée immédiatement pour favoriser la mémorisation visuelle.
* **Autonomie** : Utilisation de la police *Quicksand* (lisibilité scolaire) et de repères visuels colorés.

### 🇺🇸 Project Vision (English)
* **Minimalism & Focus**: No ads, no complex menus. The child focuses solely on the exercise.
* **Positive Reinforcement**: A 1 to 3 star system rewards effort. When a mistake occurs, the correct answer is shown immediately to encourage visual learning.
* **Autonomy**: Uses the *Quicksand* font (school-standard readability) and intuitive color-coded cues.

---

## 🧩 Les Moteurs d'Apprentissage

L'application intègre plusieurs moteurs spécialisés pour varier les plaisirs et les méthodes :

| Moteur | Description | Visuel |
| :--- | :--- | :---: |
| **Math-Input** | Calcul mental, tables, additions à trous. | ➕ |
| **Verbe-o-tron** | Apprentissage de la conjugaison par blocs (Radical/Terminaison). | ✍️ |
| **Horloge** | Apprentissage de l'heure analogique (SVG) vers digital. | 🕒 |
| **Dictée d'Images** | Orthographe illustrée avec fallback automatique sur Emojis. | 🖼️ |
| **Fractions** | Visualisation dynamique de parts de gâteaux via SVG. | 🍕 |

---

## 🛠 Pile Technique (Tech Stack)

Le projet repose sur une architecture **"Vanilla"** robuste, garantissant rapidité et compatibilité, même sur des tablettes anciennes :

* **Frontend** : HTML5, CSS3 (Variables natives, Flexbox/Grid).
* **Logic** : JavaScript pur (ES6+ Modulaire).
* **Architecture** : 
    * `app.js` : Gestion de l'état et de la logique de jeu.
    * `engines.js` : Génération algorithmique des questions.
    * `ui.js` : Rendu dynamique piloté par les données.
* **Data** : Fichiers JSON hiérarchiques par niveau scolaire.
* **Persistence** : `localStorage` pour les profils et les scores.

---

## 📂 Structure des fichiers

```bash
├── data/           # Contenu pédagogique (cp.json, ce1.json...)
├── app.js          # Coordination globale et gestion des profils
├── engines.js      # Logique de génération des exercices
├── ui.js           # Gestionnaire d'affichage unique
├── storage.js      # Sauvegarde des scores et préférences
└── index.html      # Point d'entrée unique (SPA)

# 🎓 Devoir Numérique

> **Plateforme éducative web (SPA) minimaliste, sans distraction, conçue pour l'excellence pédagogique du CP au CM2.**

[![Status](https://img.shields.io/badge/Status-Stable-success.svg)]()
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stack](https://img.shields.io/badge/Stack-Vanilla_JS_ES6+-orange.svg)]()

---

## 🌟 Philosophie & Vision Pédagogique

**Devoir Numérique** n'est pas qu'un simple exerciseur ; c'est un outil conçu pour le **focus total**. À l'heure où les applications éducatives regorgent de publicités et d'animations superflues, ce projet mise sur :

* **Le Minimalisme Cognitif** : Une interface épurée avec la police *Quicksand* pour réduire la fatigue visuelle et maximiser la concentration.
* **La Gamification Bienveillante** : Un système de 1 à 3 étoiles basé sur la précision, encourageant l'élève à se dépasser sans le stress d'un chronomètre.
* **Le Feedback Immédiat** :
    * ✅ **Vert** : Succès immédiat (1 seconde de pause).
    * ❌ **Rouge** : Correction affichée (2.5 secondes) pour forcer la mémorisation de la réponse correcte.
* **L'Accessibilité Tactile** : Claviers virtuels intégrés (Numérique ou AZERTY avec accents) pour éviter l'encombrement des claviers natifs sur tablettes.

---

## 🧩 Les Moteurs de Jeu (Engines)

L'application utilise une logique modulaire permettant de piloter différents types d'exercices :

| Moteur | Usage | Particularité |
| :--- | :--- | :--- |
| **`math-input`** | Calcul & Orthographe | Gère les additions à trous, tables, dictées de nombres et dictée d'images. |
| **`conjugation`**| **Verbe-o-tron** | Découpe visuelle du Radical et de la Terminaison pour une meilleure structure mentale. |
| **`clock`** | Lecture d'heure | Horloge analogique en SVG avec saisie digitale HH:MM. |
| **`choice-engine`**| Homophones & Logique | Interface "Vrai/Faux" ou duel de choix (ex: ce/se, a/à). |
| **`reading`** | Lecture (Sons) | Système de lecture de syllabes ou de sons complexes (Taoki). |

---

## ⚙️ Configuration du Contenu (JSON)

L'application est entièrement **Data-Driven**. Vous pouvez modifier le programme scolaire sans toucher à une ligne de code JavaScript en éditant les fichiers dans `/data`.

### Structure d'un fichier de niveau (`ce1.json`) :

```json
{
  "gradeId": "ce1",
  "title": "CE1",
  "themes": [
    {
      "id": "ce1-tables",
      "title": "Multiplication",
      "icon": "✖️",
      "exercises": [
        { 
          "id": "mult-2", 
          "title": "Table de 2", 
          "subtitle": "Les doubles", 
          "engine": "math-input", 
          "params": { "type": "mult", "table": 2, "questions": 10 }
        }
      ]
    }
  ]
}

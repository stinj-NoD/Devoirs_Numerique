# 🎓 Devoir Numérique

> **Plateforme éducative web (SPA) minimaliste, sans distraction, conçue pour l'apprentissage du CP au CM2.**

[![Status](https://img.shields.io/badge/Status-Stable-success.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stack](https://img.shields.io/badge/Stack-Vanilla_JS_ES6+-orange.svg)]()
[![UI](https://img.shields.io/badge/UI-Data--Driven-blueviolet.svg)]()

---

## 🌟 Philosophie & Vision Pédagogique

**Devoir Numérique** est un outil conçu pour le **focus total**. À l'heure où les applications éducatives regorgent de publicités et d'animations superflues, ce projet mise sur la sobriété et l'efficacité pédagogique.

* **Autonomie & Design** : Une interface épurée utilisant la police *Quicksand* pour une lisibilité maximale. L'enfant navigue seul grâce à des codes couleurs et des icônes explicites.
* **Gamification Bienveillante** : Un système d'étoiles (1 à 3) récompense la précision. L'absence de chronomètre permet à l'élève d'avancer à son propre rythme.
* **Pédagogie du Feedback** : 
    * ✅ **Succès** : Feedback vert rapide.
    * ❌ **Erreur** : La correction s'affiche immédiatement en rouge. L'élève doit observer la réponse correcte avant de valider la suite, favorisant la mémorisation visuelle.
* **Claviers Virtuels Intégrés** : L'application propose ses propres claviers (Numérique, AZERTY avec accents, Vrai/Faux) pour éviter l'encombrement des claviers natifs sur tablettes.

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

L'application est entièrement **Data-Driven**. Tout le contenu pédagogique est piloté par des fichiers JSON situés dans le dossier `/data`.

> [!IMPORTANT]
> **Note sur l'exemple :** La structure ci-dessous est un **modèle type**. Elle montre comment imbriquer les thèmes et les exercices pour qu'ils soient reconnus par les moteurs de rendu.

### Exemple de structure (`ce1.json`)

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
        },
        { 
          "id": "ce1-conj-1", 
          "title": "Verbes en -ER", 
          "subtitle": "Présent de l'indicatif", 
          "engine": "conjugation", 
          "params": { "verbs": ["chanter", "jouer"], "tenses": ["présent"], "questions": 5 }
        }
      ]
    }
  ]
}


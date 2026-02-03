# 🎓 Devoir Numérique

> **Plateforme éducative web (SPA) minimaliste, sans distraction, conçue pour l'apprentissage du CP au CM2.**

[![Status](https://img.shields.io/badge/Status-Active_Dev-success.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stack](https://img.shields.io/badge/Stack-Vanilla_JS_ES6+-orange.svg)]()
[![UI](https://img.shields.io/badge/UI-CSS_Grid_%26_Flex-blueviolet.svg)]()

---

## 🌟 Philosophie & Vision Pédagogique

**Devoir Numérique** est un outil conçu pour le **focus total**. À l'heure où les applications éducatives regorgent de publicités et d'animations superflues, ce projet mise sur la sobriété et l'efficacité pédagogique.

* **Autonomie & Design** : Une interface épurée utilisant la police *Quicksand* pour une lisibilité maximale. L'enfant navigue seul grâce à des codes couleurs et des icônes explicites.
* **Gamification Bienveillante** : Un système d'étoiles (1 à 3) récompense la précision. L'absence de chronomètre (sauf exercice de vitesse spécifique) permet à l'élève d'avancer à son propre rythme.
* **Pédagogie du Feedback** :
    * ✅ **Succès** : Feedback vert immédiat.
    * ❌ **Erreur** : La correction s'affiche avec une animation visuelle ("Shake"). L'élève doit observer la réponse correcte avant de valider la suite, favorisant la mémorisation.
* **UX Adaptative** : L'application détecte le contexte pour afficher le bon clavier virtuel (Pavé Numérique, Clavier Alphabétique avec accents/tirets, ou QCM) afin de limiter la charge cognitive.

---

## 🚀 Nouveautés & Fonctionnalités Avancées

Cette version introduit des moteurs visuels complexes pour couvrir les programmes du **CM1 et CM2** :

### ➗ La Division Posée (Pixel Perfect ou presque 🫣)
Un moteur de rendu visuel basé sur **CSS Grid** qui simule parfaitement la "potence" sur une feuille de cahier.
* Alignement automatique des chiffres (unités sous unités).
* Affichage des soustractions intermédiaires et des descentes de chiffres.
* Gestion des étapes (Quotient, Reste).

### 📝 Dictée de Nombres "Intelligente"
Un moteur bidirectionnel pour l'apprentissage de la numération :
* **Aléatoire** : Alterne entre "Lire le nombre" (Chiffres → Lettres) et "Écrire le nombre" (Lettres → Chiffres).
* **Tolérance** : Accepte les réponses avec ou sans tirets (ex: *dix-sept* ou *dix sept*) selon le niveau de difficulté configuré.

### 🔡 Gestion Fine de la Langue
* **Moteur Genre** : Exercices "Un/Une" ou "Le/La" avec détection automatique de l'élision (gestion du **L'** devant voyelles/H muet).
* **Clavier Amélioré** : Intégration des caractères spéciaux français (é, è, à, ç, -) accessibles directement.

---

## 🧩 Architecture : Les Moteurs Pédagogiques

L'application repose sur une série de moteurs spécialisés ("Engines") qui génèrent les exercices et valident les réponses. Voici les technologies sous le capot :

### 📐 Moteurs Mathématiques

| Moteur | Description | Visuels Clés |
| :--- | :--- | :--- |
| **`division-posed`** <br>*(Nouveau)* | **La Division Euclidienne**<br>Génère une "potence" parfaite (CSS Grid) avec alignement automatique des chiffres, gestion des retenues, soustractions intermédiaires et reste. | 🏗️ Potence dynamique<br>📉 Descente des chiffres |
| **`math-input`** | **Le Couteau Suisse**<br>Gère 80% des interactions numériques : calcul mental, tables de multiplication, moitiés/doubles, et décimaux. | ⌨️ Pavé Numérique<br>🔢 Grands Nombres |
| **`number-spelling`** | **Dictée de Nombres Intelligente**<br>Bi-directionnel : demande d'écrire "17" en lettres ("dix-sept") ou inversement. Gère la tolérance orthographique (tirets). | 🔤 Clavier AZERTY<br>↔️ Chiffres ⇄ Lettres |
| **`square`** | **Carré Magique**<br>Jeu de logique où l'enfant doit sélectionner 3 cases pour atteindre une somme cible. | 🧮 Grille interactive<br>👆 Sélection tactile |
| **`fraction-view`** | **Visualiseur de Fractions**<br>Génère des camemberts ou des barres pour apprendre la notion de numérateur/dénominateur. | 🍕 Camemberts SVG |
| **`clock`** | **Maître du Temps**<br>Horloge analogique interactive. Gère les concepts de matin/après-midi et la conversion analogique → numérique. | 🕒 Horloge SVG<br>☀️/🌙 Mode Jour/Nuit |

### 📚 Moteurs de Langue

| Moteur | Description | Visuels Clés |
| :--- | :--- | :--- |
| **`conjugation`** | **Le Verbe-o-Tron**<br>Moteur unique qui sépare visuellement le **Radical** de la **Terminaison** pour aider l'enfant à comprendre la structure du verbe. Gère les exceptions (*-cer*, *-ger*). | 🔡 Radical + Terminaison<br>👤 Pronoms |
| **`spelling`** | **Dictée Visuelle**<br>Affiche une image (ex: un Chat) et des cases vides. L'enfant doit composer le mot. | 🖼️ Images<br>🔠 Lettres à trous |
| **`choice-engine`** | **Grammaire & Logique**<br>Moteur de QCM universel. Utilisé pour :<br>• Le Genre (*Un/Une*)<br>• Les Homophones (*a/à*, *et/est*)<br>• Les Comparaisons (*<, >, =*) | ✅/❌ Boutons QCM<br>⚡ Feedback immédiat |
---

## ⚙️ Configuration du Contenu (JSON)

L'application est entièrement **Data-Driven**. Tout le contenu pédagogique est piloté par des fichiers JSON situés dans le dossier `/data`.

> [!TIP]
> **Flexibilité :** Vous pouvez créer des variantes infinies d'un exercice simplement en changeant les paramètres JSON (ex: passer d'une division par 2 à une division par 9).

### Exemple de structure (`cm1.json`)

```json
{
  "gradeId": "cm1",
  "title": "CM1",
  "themes": [
    {
      "id": "cm1-maths",
      "title": "Mathématiques",
      "icon": "📐",
      "exercises": [
        { 
          "id": "cm1-div-posed", 
          "title": "Division Posée", 
          "subtitle": "Diviseur à 1 chiffre", 
          "engine": "math-input", 
          "params": { "type": "division-posed", "level": 1, "questions": 5 }
        },
        { 
          "id": "cm1-dictee-nb", 
          "title": "Les Nombres", 
          "subtitle": "Chiffres et Lettres", 
          "engine": "math-input", 
          "params": { "type": "number-spelling", "min": 0, "max": 100, "strict": false }
        }
      ]
    }
  ]
}

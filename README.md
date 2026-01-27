# Devoirs Numérique
🎓 Devoir Numérique (Digital Homework)
🇫🇷 Version Française
🌟 Philosophie Pédagogique
Devoir Numérique est une application web éducative conçue pour les élèves de l'école primaire (du CP au CM2). Elle offre un environnement d'apprentissage sécurisant et ludique pour s'entraîner aux fondamentaux sans distraction.

L'Autonomie par le Design : Interface minimaliste avec la police Quicksand pour une lisibilité maximale. L'utilisation d'émojis et de codes couleurs permet à l'enfant de naviguer sans l'aide constante d'un adulte.

La Gamification Bienveillante : Pas de chronomètre stressant. Le succès est récompensé par un système d'étoiles (1 à 3), encourageant l'élève à s'améliorer à son rythme.

Le Droit à l'Erreur : En cas de faute, la correction s'affiche immédiatement en rouge, permettant une mémorisation visuelle avant de passer à la question suivante.

🧩 Moteurs d'Exercices
Mathématiques : Calcul mental, fractions visuelles (SVG), tables de multiplication et lecture de l'heure.

Français & Orthographe : Dictée d'images, exercices sur les homophones et lecture.

Le "Verbe-o-tron" : Une interface dédiée à la conjugaison qui décompose pronom, radical et terminaison.

🛠 Architecture Technique
JS Pur (Vanilla ES6+) : Aucun framework lourd (React/Vue), garantissant une rapidité absolue même sur d'anciennes tablettes.

Data-Driven : Les exercices sont générés via des fichiers JSON hiérarchiques (par niveau scolaire).

Offline-Ready : Utilisation du localStorage pour sauvegarder les profils et les scores localement.

🇺🇸 English Version
🌟 Pedagogical Philosophy
Devoir Numérique is an educational web application designed for elementary school students (Grades 1 to 5). it provides a secure and playful learning environment to practice core skills without distractions.

Autonomy through Design: A minimalist interface using the Quicksand font for maximum readability. Emojis and color-coding allow children to navigate without constant adult supervision.

Kind Gamification: No stressful timers. Success is rewarded with a star system (1 to 3 stars), encouraging students to try again and improve at their own pace.

The Right to Error: When a mistake is made, the correction is immediately displayed in red, ensuring visual memorization before moving to the next question.

🧩 Exercise Engines
Mathematics: Mental math, visual fractions (SVG), multiplication tables, and clock reading.

Language Arts: Image-based spelling, homophone duels, and reading exercises.

The "Verbe-o-tron": A dedicated conjugation interface that breaks down pronouns, stems, and endings for better grammar acquisition.

🛠 Technical Stack
Pure JS (Vanilla ES6+): No heavy frameworks (React/Vue), ensuring lightning-fast performance even on older tablets.

Data-Driven: Exercises are dynamically generated via hierarchical JSON files (structured by school grade).

Offline-Ready: Uses localStorage to save student profiles and scores locally on the device.

📂 Structure du Projet / Project Structure
Bash
├── data/          # JSON levels (cp.json, ce1.json...)
├── app.js         # Core logic & State management
├── engines.js     # Question generation logic
├── ui.js          # Rendering & SVG components
├── storage.js     # Local persistence
└── index.html     # Main entry point
📝 License
Distribué sous licence MIT. Voir LICENSE pour plus d'informations. / Distributed under the MIT License. See LICENSE for more information.

# Storage Gap

## �?tat actuel

Le stockage local conserve aujourd'hui :
- profils
- utilisateur courant
- records par exercice

Le modèle reste volontairement léger pour garantir simplicité et résilience locale.

## Limites actuelles

- pas de journal de tentatives
- pas de temps passé
- pas de différenciation leçon/exercice dans la progression
- pas d'historique de consultation des leçons
- pas de suivi par notion
- pas de séparation enseignant/élève

## Impact produit

- impossible de distinguer révision et entraînement
- impossible d'identifier les leçons vraiment consultées
- impossible de construire des indicateurs fiables de progression
- impossible d'alimenter une future vue enseignant sans nouvelle couche de données

## �?volution compatible recommandée

- ajouter `attempts[]` sans casser `records`
- ajouter `lessonViews[]` pour les leçons
- conserver les records comme résumé rapide pour l'UI actuelle
- calculer ensuite un `progress` dérivé

## Priorité

Ce chantier n'est pas bloquant pour l'application actuelle, mais il devient important maintenant que la bibliothèque des leçons fait partie du parcours principal.
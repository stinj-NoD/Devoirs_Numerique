# Storage Gap

## Etat actuel

Le stockage local conserve :
- profils
- utilisateur courant
- records par exercice

## Limites actuelles

- pas de journal de tentatives
- pas de temps passe
- pas de progression par competence
- pas de separation eleve / enseignant

## Impact

- impossible de rejouer analytiquement une session
- impossible de construire un suivi de progression fiable
- impossible de deriver des rapports de classe

## Evolution compatible

- ajouter `attempts[]` sans casser `records`
- conserver la lecture de `records` pour l'UI actuelle
- peupler progressivement `progress` a partir des nouvelles tentatives

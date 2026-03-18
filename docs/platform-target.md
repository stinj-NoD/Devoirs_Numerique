# Platform Target

## Objectif

Definir la cible minimale pour passer d'une application solo locale a une base de plateforme educative.

## Modele cible

- `user`
  - `id`
  - `displayName`
  - `role`
- `attempt`
  - `userId`
  - `exerciseId`
  - `engine`
  - `startedAt`
  - `finishedAt`
  - `answer`
  - `expectedAnswer`
  - `isCorrect`
- `progress`
  - `userId`
  - `gradeId`
  - `themeId`
  - `exerciseId`
  - `bestScore`
  - `attemptCount`
  - `lastPlayedAt`

## Ecart avec l'etat actuel

- profils locaux sans role
- pas d'historique des tentatives
- score agrege uniquement
- pas de competence ni d'assignation classe

## Migration recommandee

1. conserver `storage.js` compatible avec les profils existants
2. introduire un historique `attempts` en lecture optionnelle
3. calculer la progression a partir des tentatives
4. seulement ensuite introduire roles et vues enseignant

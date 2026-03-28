# Platform Target

## Objectif

Définir la cible technique minimale pour faire évoluer `Devoir Numérique` d'une application locale de révision vers une plateforme pédagogique plus suivie, sans casser l'existant.

## État actuel

Le projet gère déjà :
- profils locaux
- utilisateur courant
- records par exercice
- leçons et exercices par sous-thème
- parcours `J'apprends` / `Je m'entraîne`

Il ne gère pas encore :
- historique complet de tentatives
- temps passé
- suivi fin des parcours de leçons
- rôles enseignant/parent/élève
- assignation pédagogique

## Modèle cible

- `user`
  - `id`
  - `displayName`
  - `role`
- `attempt`
  - `userId`
  - `gradeId`
  - `subjectId`
  - `subthemeId`
  - `exerciseId`
  - `startedAt`
  - `finishedAt`
  - `isCorrect`
  - `score`
- `lessonView`
  - `userId`
  - `gradeId`
  - `subjectId`
  - `subthemeId`
  - `lessonId`
  - `openedAt`
  - `completed`
- `progress`
  - `userId`
  - `gradeId`
  - `subjectId`
  - `subthemeId`
  - `mastery`
  - `lastActivityAt`

## Écart avec l'application actuelle

- pas d'historique détaillé
- progression encore centrée sur le record d'exercice
- aucune métrique sur l'usage réel des leçons
- aucune vision enseignant
- aucune compétence ou notion explicitement suivie

## Migration recommandée

1. conserver [storage.js](d:/Apps%20Dev/Devoirs_Numerique/js/storage.js) compatible avec les profils existants
2. ajouter un journal léger `attempts[]`
3. ajouter un journal léger `lessonViews[]`
4. dériver ensuite une couche `progress`
5. seulement après, introduire rôles et vues étendues

## Principes de migration

- compatibilité ascendante
- pas de rupture sur les profils actuels
- pas de backend requis au départ
- séparation claire entre contenu, usage et analytics
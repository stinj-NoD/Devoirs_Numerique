# Platform Target

## Objectif

Définir la cible technique minimale pour faire évoluer `Devoir Numérique` d'une application locale de révision vers une plateforme pédagogique plus suivie, sans casser l'existant.

## État actuel

Le projet gère déjà :
- profils locaux
- utilisateur courant
- records par exercice
- badges et série de jours consécutifs
- leçons et exercices par sous-thème
- parcours `J'apprends` / `Je m'entraîne`

- **suivi des leçons consultées et comprises** (`lessonViews`, v4.18.0 — voir [storage-gap.md](storage-gap.md))

Il ne gère pas encore :
- historique complet de tentatives
- temps passé
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

1. ~~conserver [storage.js](js/storage.js) compatible avec les profils existants~~ **fait**
2. ajouter un journal léger `attempts[]`
3. ~~ajouter un journal léger `lessonViews[]`~~ **fait (v4.18.0)** — objet indexé plutôt
   que tableau, pour l'idempotence de la relecture et une taille bornée
4. dériver ensuite une couche `progress`
5. seulement après, introduire rôles et vues étendues

> Les étapes 2 et 3 sont indépendantes : `lessonViews` a été livrée en premier parce que la
> bibliothèque de leçons faisait déjà partie du parcours principal sans laisser aucune trace.

## Principes de migration

- compatibilité ascendante
- pas de rupture sur les profils actuels
- pas de backend requis au départ
- séparation claire entre contenu, usage et analytics
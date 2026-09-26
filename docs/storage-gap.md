# Storage Gap

## État actuel

Le stockage local conserve aujourd'hui :
- profils
- utilisateur courant
- records par exercice (avec `subject` et, depuis la v4.18.0, `subtheme`)
- **journal de consultation des leçons** (`lesson_views_<profil>`, depuis la v4.18.0)
- badges débloqués (calculés dynamiquement depuis les records + les leçons, pas stockés séparément)
- série de jours consécutifs (streak)

Le modèle reste volontairement léger pour garantir simplicité et résilience locale.

## Fait — `lessonViews` (v4.18.0)

Clé `lesson_views_<profil>`, **objet indexé** par `gradeId::lessonId` (et non tableau : la
relecture doit être idempotente et la taille bornée par le catalogue, ~350 leçons × ~120 o
≈ 40 Ko max par profil). Champs courts : `g`/`s`/`st` (grade, matière canonique, sous-thème),
`o`/`l` (première/dernière ouverture), `n` (nombre d'ouvertures), `c`/`ca` (comprise + date),
`q` (score du quiz d'ancrage).

API : `recordLessonView` (ouverture, n'attribue rien), `completeLessonView` (retourne
`justCompleted` — garde one-shot qui empêche de farmer des pièces en relisant),
`getLessonView`, `isLessonCompleted`, `getLessonViews`, `getLessonStats`.
Couvert par `removeProfile`, `exportAllData` et `importAllData`.

> **Invariant critique** : une leçon n'écrit **jamais** dans `records`. `getTotalStars()` est
> dérivé de `records` (`_sumStars`) et alimente aussi `exercisesAttempted`, `perfectCount` et
> `subjectMastery` : y injecter une leçon rendrait les badges de maîtrise (« Maître des maths »)
> gagnables sans faire un seul exercice. Les leçons rapportent des **pièces** et des **badges
> dédiés**, jamais des étoiles. Même raison pour `recordDailyActivity`, qui incrémente le
> compteur `attempts` du tableau de bord parent : il n'est pas appelé par les leçons.

## Limites restantes

- pas de journal de tentatives (`attempts[]`)
- pas de temps passé
- pas de suivi par notion
- pas de séparation enseignant/élève

## Impact produit

- ~~impossible d'identifier les leçons vraiment consultées~~ → résolu par `lessonViews`
- impossible de distinguer révision et entraînement (demande `attempts[]`)
- indicateurs de progression encore partiels (demande la couche `progress`)
- impossible d'alimenter une future vue enseignant sans nouvelle couche de données

## Évolution compatible recommandée

- ~~ajouter `lessonViews[]` pour les leçons~~ **fait (v4.18.0)**
- ajouter `attempts[]` sans casser `records`
- conserver les records comme résumé rapide pour l'UI actuelle
- calculer ensuite un `progress` dérivé

## Priorité

Le volet leçons est traité. Le reste (`attempts[]`, puis `progress`) n'est pas bloquant :
à reprendre quand un suivi fin des tentatives ou une vue enseignant deviendra nécessaire.
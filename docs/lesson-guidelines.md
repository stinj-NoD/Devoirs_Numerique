# Guide des leçons

Ce document définit la règle éditoriale des leçons dans `Devoir Numérique`.

## Rôle d'une leçon

Une leçon est une fiche courte d'appui à l'apprentissage. Elle sert à :
- introduire une notion
- soutenir la révision
- rappeler un point du programme avant ou après les exercices

Une leçon ne doit pas expliquer seulement comment réussir un exercice ou comment utiliser l'application.

## Règles éditoriales

- une seule notion principale par leçon
- texte concis et lisible pour le niveau visé
- vocabulaire cohérent avec le programme scolaire français
- français correct, accentué et encodé proprement en UTF-8
- exemple concret obligatoire
- idée centrale explicite dans les premiers blocs
- 3 à 5 blocs **de contenu** dans la plupart des cas, suivis du quiz d'ancrage

## Format recommandé

Chaque leçon suit le format `lesson-card`.

Blocs de contenu autorisés :
- `paragraph`
- `example`
- `tip`
- `bullets`
- `mini-table`

Bloc de fin, en plus des blocs de contenu :
- `check` — le quiz d'ancrage (voir la section dédiée ci-dessous)

Structure cible :
1. titre de la notion
2. sous-titre court
3. explication simple
4. exemple
5. repères ou mots-clés
6. idée à retenir
7. exactement 2 blocs `check`

## Quiz d'ancrage (blocs `check`)

Chaque leçon se termine par **exactement 2 blocs `check`** : un QCM court qui
conditionne le bouton de fin de leçon. Tant que les 2 questions ne sont pas
justes, la leçon n'est pas « comprise » : pas de pièces, pas de badge, pas de
progression. C'est ce qui distingue une leçon lue d'une leçon acquise.

Contrat du bloc :

```json
{ "type": "check",
  "question": "…",
  "choices": ["…", "…", "…"],
  "answer": "…",
  "explanation": "…" }
```

- `choices` : 2 à 4 propositions, sans doublon strict.
- `answer` : **copie caractère pour caractère** d'un élément de `choices`. Le
  runtime compare en strict (`===`) : un écart de casse rend la leçon
  injouable — aucun choix n'est jamais correct et le bouton reste verrouillé.
- pas d'`id` : un `check` ne crée jamais de record, sinon il fausserait les
  étoiles et les badges de maîtrise.

### Les 5 règles

- **R1 — Pas de réponse verbatim.** La réponse ne doit pas être recopiable
  depuis la prose de la leçon. *(vérifié par `scripts/check-lesson-quiz.js`)*
- **R2 — Au moins un check de transfert.** Sur les 2, au moins 1 porte sur un
  cas **nouveau**, jamais l'exemple déjà donné dans la leçon.
- **R3 — Distracteurs = erreurs réelles d'élèves.** Pour une addition : le
  résultat de la soustraction, ou l'un des termes. Jamais l'absurde, qui
  transforme le QCM en question à un seul choix plausible.
- **R4 — Réponse non déductible de la forme.** Choix de longueur comparable ;
  la bonne réponse ne reprend pas les mots saillants de la question.
  *(partiellement vérifié par le script)*
- **R5 — `explanation` obligatoire de fait et explicative.** Le validateur la
  rend facultative, l'éditorial l'exige : « J'ajoute les deux quantités : 4 et
  2 font 6 », jamais « Bravo ». C'est le seul retour que reçoit l'enfant qui
  se trompe.

### Exemple conforme

La leçon `cp-lesson-addition-comprendre` (`data/cp.json`) sert de modèle : son
premier check applique la notion à un cas neuf (4 + 2, alors que la leçon
montre 2 + 3), le second demande de **choisir l'opération** face à une
situation nouvelle plutôt que de réciter une définition.

### Anti-patterns spécifiques

- « Par quoi commence une phrase ? » quand un bullet dit « une phrase commence
  par une majuscule » → teste la relecture, pas la compréhension (R1).
- « Que veut dire additionner ? » quand la leçon définit le mot juste au-dessus
  → même défaut ; préférer une situation à résoudre (R2).
- `explanation` du type « C'est ça ! » → n'apprend rien à qui s'est trompé (R5).

## Attentes par cycle

### Cycle 2 : CP, CE1, CE2

Les leçons doivent être :
- très concrètes
- proches du vécu de l'élève
- courtes
- appuyées sur des exemples simples

Exemples attendus :
- nombres, calculs, monnaie, temps, formes
- phrase simple, déterminants, verbes usuels, homophones fréquents
- autrefois/aujourd'hui, espace proche, paysages, corps, sens, règles de vie

### Cycle 3 : CM1, CM2

Les leçons doivent ressembler à une mini-fiche de manuel :
- notion explicite
- exemple net
- vocabulaire disciplinaire
- synthèse mémorisable

Exigences particulières :
- histoire : vraies leçons d'histoire, pas seulement lecture de frise
- géographie : territoires, espaces, cartes, mobilités, activités humaines
- sciences : vocabulaire scientifique, phénomènes, corps, matière, énergie, vivant
- EMC : droits, devoirs, règles, institutions, débat, responsabilité

## Anti-patterns

- leçon purement méthodologique
- texte trop long
- plusieurs notions mélangées
- contenu trop abstrait pour le niveau
- formulation trop technique sans exemple
- encodage dégradé

## Checklist avant intégration

- la notion existe dans le programme du niveau
- la leçon est utile sans l'exercice
- le français est correct
- les accents sont présents
- l'exemple est pertinent
- le titre et le sous-titre sont compréhensibles par un élève
- la leçon renvoie à un sous-thème cohérent
- la leçon se termine par 2 blocs `check` conformes aux règles R1-R5
- `node scripts/check-lesson-quiz.js` renvoie `LESSON_QUIZ_OK`
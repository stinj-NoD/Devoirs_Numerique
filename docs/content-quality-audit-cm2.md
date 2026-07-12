# Audit qualité de contenu — CM2

> Audit indépendant de la qualité intrinsèque de chaque leçon et exercice du niveau CM2 (dernier niveau du primaire), exactitude factuelle, clarté pédagogique, adéquation au niveau, cohérence technique — distinct de [`curriculum-audit-cm2.md`](curriculum-audit-cm2.md). Réalisé le 2026-07-11, même méthode que les audits CP/CE1/CE2/CM1.
>
> Sources faisant autorité : BO cycle 3 (2020/2018), ressources Eduscol, dictionnaire/Bescherelle, IGN/Insee.
>
> **Aucune correction n'a été appliquée dans cette phase.**

## Synthèse générale

| Sévérité | Maths | Français | Histoire | Géographie | Sciences | EMC | Total |
|---|---|---|---|---|---|---|---|
| Bloquant | 1 | 3 | 1 | 0 | 0 | 0 | **5** |
| Majeur | 3 | 1 | 1 | 1 | 0 | 3 | **9** |
| Mineur | 4 | 3 | 3 | 4 | 12 | 6 | **32** |
| Suggestion | 1 | 1 | 2 | 4 | 4 | 4 | **16** |

Environ 71 leçons et ~2200 items audités.

**Découverte la plus significative** : le même bug de branchement de fichier trouvé au CE1 et au CM1 se reproduit une troisième fois — `data/french_cm2_reading.json` (505 items) est orphelin. Fait aggravant propre au CM2 : le contenu orphelin contient de vraies erreurs de contenu (pas seulement un problème de branchement) : "Le chenille"/"Le iceberg" (erreurs de genre), une réponse de pronom incohérente avec sa propre phrase, et un ordre biologique inversé sur la métamorphose du têtard — donc une simple réactivation ne suffirait pas, il faut d'abord corriger le contenu.

**Pattern récurrent confirmé sur tout l'audit** : le bug de paramétrage "niveau supérieur non différencié" (déjà vu en Maths CE1/CE2 et Histoire CM1) apparaît une nouvelle fois en Maths CM2 — l'exercice "division posée experte" (niveau 3) génère des questions statistiquement identiques au niveau 2 à cause d'une branche de code manquante.

**Point rassurant** : Sciences CM2 obtient le meilleur bilan de tout l'audit (0 Bloquant, 0 Majeur) et la corruption d'encodage massive du CM1 ne se reproduit pas sur ce niveau. Le traitement de l'Histoire (Shoah, décolonisation) et des sujets économiques sensibles (mondialisation) en Géographie est factuel et mesuré.

**Défaut EMC récurrent non corrigé depuis le CM1** : des questions de niveau institutionnel trop avancé (Conseil constitutionnel, séparation des pouvoirs) réapparaissent en CM2 malgré le signalement déjà fait au CM1.

---

## Mathématiques CM2

### Leçons
**Mineur** — apostrophes manquantes dans la leçon sur la symétrie.

### Exercices

**Bloquant — bug de paramétrage** — exercice id=`cm2-bonus-division-posee-experte` (niveau 3) — le code (`js/engines-math.js`, case `division-posed`) ne distingue que `level===1` du reste ; les niveaux 2 et 3 tombent dans la même branche avec des bornes identiques. Le "défi expert" n'est donc pas plus difficile que l'exercice de base malgré la promesse du titre.

**Majeur — couverture non garantie** — exercice id=`cm2-bonus-graphique-expert` ("Toutes les questions, sans erreur") — le tirage des types de questions est aléatoire sans garantie de couverture ; l'élève peut ne recevoir que 2-3 types sur 5 possibles.
**Majeur — progressivité incohérente** — exercices "tables x11 à x25" génèrent en réalité des multiplications à deux chiffres (ex. 23×9), au-delà de ce qu'on attend d'un exercice de "calcul mental" au CM2.
**Majeur — niveau hors-programme** — `math_matching.json`, paire "disque → π × rayon²" introduit une formule de collège alors que la leçon du même sous-thème se limite sciemment au rectangle/pavé droit.

**Points positifs** : aucune incohérence answer/choices sur ~90 items ; moteurs `division-posed`, `pourcentage` et `bar-chart-read` mathématiquement rigoureux (résultats toujours entiers/cohérents, pas d'égalité ambiguë) ; classement des figures géométriques rigoureux y compris sur les cas particuliers délicats (carré = cas particulier de losange et de rectangle).

**Résumé** : Bloquant 1, Majeur 3, Mineur 4, Suggestion 1 (13 leçons, ~90 items audités)

---

## Français CM2

### Anomalie de branchement (troisième occurrence du pattern CE1/CM1)

`data/french_cm2_reading.json` (505 items, 5 catégories) confirmé orphelin par grep (`loadFrenchLibrary` ne le référence pas ; aucun `dataFile` dans `cm2.json` ne le cite). 2 catégories dupliquent du contenu déjà servi en version pauvre (20 items au lieu de 100-105) ; 3 catégories entières (300 items) ne sont jamais jouées. **Différence clé avec le CE1** : l'audit qualité du contenu orphelin révèle de vraies erreurs qui empêcheraient une simple réactivation :
- "Le chenille tisse son cocon..." — erreur de genre, devrait être "La chenille".
- "Le iceberg se détache..." (×2) — élision manquante, devrait être "L'iceberg".
- Item sur le têtard — ordre biologique inversé (le têtard développe les pattes avant de perdre sa queue, pas l'inverse).
- Item sur des enfants ramassant des coquillages — la réponse "Qui désigne ils ?" est "Les coquillages", alors que grammaticalement "ils" désigne "les enfants".
- Item "laisser sa place ? une personne âgée" — le "?" est une vraie corruption de caractère confirmée en octets bruts (contrairement à un faux positif similaire écarté au CP).

Recommandation : fusion avec dédoublonnage **après correction de ces 4-5 erreurs de contenu**, pas une simple réactivation.

### Leçons
**Mineur** — apostrophes manquantes dans 2 titres d'exercices ("Trouver l idée principale").

### Exercices
**Mineur** — registre lexical de `cm2_vocabulaire_contexte_precis` trop avancé (mots de niveau 6e/5e : "éloquence", "altruisme", "saumâtre").

**Points positifs** : accord du participe passé (`grammar_pp_accord_cm2`) et passé simple, les deux points grammaticaux les plus difficiles du primaire, tous deux traités sans erreur ; `french_word_order.json` intégralement correct sur les catégories CM2.

**Résumé** : Bloquant 3, Majeur 1, Mineur 3, Suggestion 1 (~63 leçons/exercices cm2.json + ~900 items audités au total dont les 505 du fichier orphelin)

---

## Histoire CM2

### Leçons
**Suggestion** — la conquête spatiale ("premier homme sur la Lune") classée un peu maladroitement parmi les "inventions techniques".

### Exercices

**Majeur — accents systématiquement absents** — `history_cm2.json`, catégorie `cm2-symboles-republique` — plusieurs items sans accents sur des mots-clés du programme ("Republique", "Liberte, Egalite, Fraternite"), gênant particulièrement pour une catégorie qui enseigne justement ces termes.
**Mineur** — doublon de contenu entre `cm2-recits-historiques` et `cm2-revolution` (choix légèrement différents selon la catégorie).

**Bloquant — ambiguïté technique de tri** — timeline id=`cm2-ordre-revolution-3` — deux paires d'événements partagent exactement la même année (Bastille/Déclaration des droits de l'homme en 1789 ; Marseillaise/proclamation de la République en 1792). Le tri par année du moteur ne peut pas départager ces paires de façon stable : l'ordre "correct" attendu varie selon le tirage aléatoire préalable, ce qui peut pénaliser à tort un élève ayant donné le bon ordre historique. Correction suggérée : ajouter une granularité mensuelle aux dates ou remplacer un des événements.

**Points positifs** : traitement remarquable des sujets sensibles — Shoah, régime de Vichy, décolonisation abordés de façon factuelle et mesurée, sans dramatisation ni banalisation ; toutes les autres dates vérifiées exactes (1789 à 1970) ; 7 des 8 timelines auditées sans aucune ambiguïté.

**Résumé** : Bloquant 1, Majeur 1, Mineur 3, Suggestion 2 (8 leçons, 102 items QCM + 8 matching + 8 timelines)

---

## Géographie CM2

### Leçons
**Mineur** — doublon entre 2 leçons du sous-thème développement durable (même paragraphe d'intro, même exemple).
**Mineur** — déséquilibre leçon/exercices sur l'UE : les exercices testent Brexit/subsidiarité/mégalopole européenne, jamais introduits dans les leçons du sous-thème.

### Exercices

**Majeur — niveau hors-programme** — `geography_cm2.json`, cat. `cm2-france-europe`, 4 items marqués difficulty 3 ("subsidiarité", "mégalopole européenne", "Northern Range", "politique de cohésion") — notions de géographie économique de lycée/collège avancé, sans aucune base dans les leçons du niveau.

**Conclusion sur la réutilisation du matériel cartographique CM1** : partiellement justifiée (Europe/capitales stables d'une année sur l'autre, pas besoin de dupliquer un contenu déjà correct) mais révèle un **vrai trou pédagogique** : les sous-thèmes distinctifs du CM2 (mondialisation, espaces littoraux/montagnards) n'ont aucune carte interactive dédiée — ni carte des grands ports/hubs mondiaux, ni carte du relief français avec littoraux/massifs montagneux.

**Points positifs** : 0 incohérence answer/choices sur 214 items ; traitement neutre et factuel des sujets économiques sensibles (délocalisation, commerce équitable) évitant la caricature ("gagnants et perdants") ; vocabulaire précis et exact sur les espaces littoraux/montagnards (conchyliculture, transhumance).

**Résumé** : Bloquant 0, Majeur 1, Mineur 4, Suggestion 4 (9 leçons, 214 + 74 items de matériel CM1 réutilisé)

---

## Sciences CM2 — meilleur bilan de l'audit

### Leçons
**Mineur** — titres d'exercices sans accents dans 2 sous-thèmes ; doublon entre 2 leçons sur les états de la matière (Environnement vs Matière et transformations).

### Exercices
**Mineur (×10)** — accents ponctuellement manquants, concentrés presque exclusivement dans `cm2-securite-electrique` (frappe manuelle probable) — pas de corruption systématique comme au CM1.
**Mineur** — doublon quasi-paraphrase dans `cm2-corps-sante` ("Bien dormir..." / "Dormir suffisamment...").

**Points positifs** : **0 Bloquant, 0 Majeur** — le meilleur résultat de tout l'audit CP→CM2 ; traitement du changement climatique factuel et bien équilibré (cause humaine correctement attribuée, ni catastrophisme ni minimisation) ; sécurité électrique irréprochable sur le fond malgré les coquilles d'accents ; classification du vivant sans généralisation fausse ; aucune corruption d'encodage massive contrairement au CM1.

**Résumé** : Bloquant 0, Majeur 0, Mineur 12, Suggestion 4 (14 leçons, 264 + 6 items audités)

---

## EMC CM2

### Leçons
**Suggestion** — 2 leçons quasi-doublons sur les institutions de la République.

### Exercices

**Majeur — niveau institutionnel trop avancé (récidive non corrigée du défaut CM1)** — cat. `cm2-citoyennete`, items "Conseil constitutionnel" et "séparation des pouvoirs" (théorie de Montesquieu) — exactement le type de notion déjà signalée hors-programme au CM1, qui réapparaît ici sans être corrigée.
**Mineur** — accents ponctuellement manquants dans 3 catégories (coquilles isolées, pas de corruption massive comme au CM1) ; 2 distracteurs grammaticalement incorrects ("Une déclaration guerre" au lieu de "de guerre").

**Points positifs** : traitement rigoureux et neutre de la liberté/justice (limites légales de la liberté d'expression bien posées) ; solidarité/engagement présentés factuellement sans biais idéologique (Restos du Cœur, Téléthon, UNICEF) ; 0 incohérence answer/choices sur 152 items.

**Résumé** : Bloquant 0, Majeur 3, Mineur 6, Suggestion 4 (11 leçons, 152 items audités)

---

## Récapitulatif des actions suggérées (indicatif — aucune exécution dans cette phase)

### Priorité 1 — Bloquants (5)
1. Corriger les 4-5 erreurs de contenu du fichier orphelin `french_cm2_reading.json` (genre, élision, ordre biologique du têtard, réponse pronom incohérente, caractère corrompu) avant toute décision de rebranchement.
2. Corriger l'ambiguïté de tri de la timeline `cm2-ordre-revolution-3` (deux paires d'événements à égalité stricte d'année).
3. Corriger le bug de paramétrage `cm2-bonus-division-posee-experte` (niveau 3 identique au niveau 2).

### Priorité 2 — Majeurs (9)
- Retirer ou nuancer les 4 items de géographie économique de lycée (subsidiarité, Northern Range...).
- Retirer les questions EMC de niveau institutionnel trop avancé, déjà signalées au CM1 et non corrigées.
- Réaccentuer systématiquement `cm2-symboles-republique` en Histoire.
- Reformuler les exercices "tables x11-x25" et le tirage non garanti de `cm2-bonus-graphique-expert` en Maths.
- Retirer la formule de l'aire du disque (π×r²) hors-programme du matching Maths.

### Priorité 3 — Mineurs et suggestions (48)
Voir détail par matière ci-dessus.

## Vérification

Sciences CM2 confirme qu'un contenu de haute qualité (0 Bloquant/Majeur) est atteignable à ce niveau de volumétrie — à utiliser comme référence pour prioriser les corrections des autres matières de ce niveau.

# Audit qualité de contenu — CE2

> Audit indépendant de la qualité intrinsèque de chaque leçon et exercice du niveau CE2 (exactitude factuelle, clarté pédagogique, adéquation au niveau, cohérence technique), distinct de [`curriculum-audit-ce2.md`](curriculum-audit-ce2.md). Réalisé le 2026-07-11, même méthode que [`content-quality-audit-cp.md`](content-quality-audit-cp.md) et [`content-quality-audit-ce1.md`](content-quality-audit-ce1.md).
>
> Sources faisant autorité : BO n°31 du 30/07/2020 (programme cycle 2), ressources Eduscol, dictionnaire/Bescherelle, IGN/Insee.
>
> **Aucune correction n'a été appliquée dans cette phase.**

## Synthèse générale

| Sévérité | Maths | Français | Histoire | Géographie | Sciences | EMC | Total |
|---|---|---|---|---|---|---|---|
| Bloquant | 1 | 2 | 8 | 1 | 1 | 0 | **13** |
| Majeur | 2 | 1 | 6 | 2 | 0 | 2 | **13** |
| Mineur | 6 | 7 | 5 | 4 | 2 | 5 | **29** |
| Suggestion | 2 | 5 | 1 | 3 | 2 | 4 | **17** |

Environ 68 leçons et ~1900 items audités.

**Découverte la plus grave de tout l'audit à ce stade (CP+CE1+CE2)** : l'Histoire CE2 contient une **fuite de programme caractérisée vers le cycle 3**, bien plus sévère que celle du CP. Le CE1 n'en avait aucune ; le CE2 en a 8 : des dates précises («l'an 800 » pour Charlemagne, « 1492 » pour Christophe Colomb, « 1804 » pour Napoléon, « au XVe siècle » pour Jeanne d'Arc, « au XVIIe siècle » pour Louis XIV) et des périodes nommées (« Moyen Âge », « guerre de Cent Ans ») apparaissent comme réponses ou explications attendues dans des QCM et un exercice d'appariement, alors que le programme cycle 2 (BO n°31) doit rester sur des repères simples sans dates ni périodes nommées — ce contenu relève du CM1 (frise chronologique).

**Deuxième découverte notable** : la carte des régions de France (`ce2_map_regions_france`) couvre cette fois les 13 régions en entier (contre 13 en fuite nette au CP, 6 en fuite atténuée au CE1) — confirmée comme la fuite de programme géographique la plus large des trois niveaux, et non préparée par les leçons du sous-thème (qui ne mentionnent jamais la notion de région).

**Point rassurant** : contrairement au CE1, aucun bug de branchement de fichier — `french_ce2_reading.json` (633 items) est bien chargé et utilisé, confirmé par lecture de code.

**Bug applicatif récurrent** : le même bug de paramétrage "tables mélangées" trouvé en CE1 (`table: <nombre>` au lieu de `"mix"`) se reproduit en CE2 sur `ce2-bonus-tables-melangees`.

---

## Mathématiques CE2

### Leçons
Aucune anomalie bloquante ; 15 leçons conformes au programme (multiplication/division posées, fractions simples, angle droit, symétrie, mesures, monnaie).
**Mineur** — leçon id=`ce2-lesson-multiplier-10-100` mélange la règle des zéros (×10/100/1000) avec un exemple de produit de deux dizaines (30×40), deux notions dans une même leçon.

### Exercices

**Bloquant — bug de paramétrage identique à celui trouvé en CE1** — exercice id=`ce2-bonus-tables-melangees` ("Défi : toutes les tables", "Multiplications mélangées de 2 à 12") — `params.table: 12` au lieu de `"mix"` : ne génère en réalité que des questions de la table de 12. Même si corrigé, la branche `"mix"` du moteur ne tire que dans `rnd(2,9)`, ne couvrant pas 10/11/12 promis par le titre — il faudrait aussi étendre la plage. Correction suggérée : `"table": "mix"` + étendre `rnd(2,12)` dans `js/engines-math.js`.

**Majeur — niveau hors-programme** — exercices id=`ce2-comp-2000` et id=`ce2-bonus-comp-5000` — le programme CE2 limite les nombres à 1000 ; ces deux exercices de compléments à 2000/5000 anticipent largement sur le CM1.

**Mineur** — pool `matching_math_ce2` (8 items) réutilisé pour deux exercices aux titres thématiques différents ("Nombres et opérations" vs "Mesures et grandeurs") sans sous-catégorisation réelle.
**Mineur** — tables 11/12 non marquées `isBonus` contrairement à d'autres extensions du même sous-thème.
**Mineur** — distracteur "0,50 centime" mélangeant unités € et centimes dans un problème de monnaie.

**Points positifs** : mécanisme `carre-somme` avec garde-fous anti-blocage robustes ; division posée et fractions bornées correctement (jamais de division par 0, dénominateurs 2-4 seulement) ; coordonnées de symétrie vérifiées exactes sur les 10 items de `board_symmetry_complete_ce2.json`.

**Résumé** : Bloquant 1, Majeur 2, Mineur 6, Suggestion 2 (15 leçons, ~120 items de banque)

---

## Français CE2

### Leçons
Aucune anomalie bloquante sur les 15 leçons ; couverture complète (homophones étendus ce/se-ces/ses, genre avec élision, accords, passé composé/imparfait/futur nouveaux au CE2).
**Suggestion** — leçon passé composé n'explique pas l'accord du participe passé avec "être" alors que son propre exemple l'illustre ("elle est tombée").

### Exercices

**Bloquant — erreur linguistique factuelle (famille de mots)** — `data/french_ce2_reading.json`, cat. `ce2_vocabulaire_familles_mots`, item "chantier" présenté comme même famille que "chant" — étymologiquement faux (chantier vient de *cantherius*, chant de *cantare*). Correction suggérée : remplacer par "chanteur"/"chanson".

**Bloquant — ordre alphabétique incorrect** — `data/french_word_order.json`, cat. `alpha_order_ce2`, item "pelouse peluche pendule pendu" — l'ordre alphabétique réel place "pendu" avant "pendule" (chaîne plus courte à préfixe égal), l'explication fournie dans le fichier est elle-même incohérente sur ce point. À vérifier contre le comportement du moteur `word-order` avant correction.

**Majeur** — distracteur "fumier" pour la famille de "fumée" — historiquement apparenté, ambigu pour un élève curieux.
**Mineur** — vocabulaire trop avancé pour CE2 dans `ce2_vocabulaire_synonymes` ("perspicace", "laborieux", "insipide" — niveau plutôt CM1/CM2).
**Mineur** — pools de conjugaison `present_3_ce2_a`/`present_3_ce2_b` limités à 4 verbes chacun, répétitions probables sur 8 questions.
**Mineur** — 2 paires de doublons fonctionnels purs (`ce2-g-un-une`/`ce2-g-objets`, `ce2-g-le-la`/`ce2-g-elision`).

**Points positifs** : les 633 items de `french_ce2_reading.json` d'excellente qualité rédactionnelle ; formes conjuguées du passé composé/imparfait/futur toutes vérifiées exactes (y compris cédilles -ger/-cer) ; homophones ce/se et ces/ses bien traités.

**Résumé** : Bloquant 2, Majeur 1, Mineur 7, Suggestion 5 (15 leçons, ~950 items audités)

---

## Histoire CE2 — fuite de programme la plus sévère de l'audit à ce stade

### Leçons

**Bloquant — dates et période nommée** — leçon id=`ce2-lesson-monuments-indices` — mentionne explicitement « le Moyen Âge » et rattache les remparts de Carcassonne à cette période nommée. Programme cycle 2 = "traces du passé" sans nommer les périodes historiques (réservé au CM1).

**Bloquant — repère chronologique fin** — leçon id=`ce2-lesson-siecle-frise` — introduit siècle/millénaire avec estimation chiffrée précise (« environ 8 siècles » pour un château fort) supposant une frise déjà repérée par grandes périodes, exercice de cycle 3.

**Majeur** — leçon Jules Ferry introduit "laïque" sans exemple concret contrairement à "gratuite"/"obligatoire".
**Mineur** — plusieurs titres/sous-titres sans accents, incohérents avec le reste du fichier.

### Exercices

**6 items Bloquants dans `data/history_ce2.json`, catégorie `ce2-personnages-celebres`** — dates précises données comme réponse ou explication attendue :
- Jeanne d'Arc : « au XVe siècle »
- Louis XIV : « au XVIIe siècle », « plus de 70 ans » de règne
- Charlemagne : réponse elle-même = « un empereur couronné en l'an 800 »
- Vercingétorix : « il y a plus de 2000 ans » face à Jules César
- Christophe Colomb : réponse = « voyage vers l'Amérique en 1492 »

**Bloquant supplémentaire — matching** — `data/history_matching.json`, cat. `matching_histoire_ce2`, item "Relie chaque personnage historique à son rôle" — paires nommant explicitement « guerre de Cent Ans » et « Moyen Âge », périodes de cycle 3.

**Majeur (×4)** — dates précises également données pour Gutenberg (« vers 1450 »), les frères Montgolfier (« en 1783 »), Napoléon (« empereur en 1804 »), et répétition de « lois de 1881-1882 » pour Jules Ferry (déjà présente dans la leçon).

Correction suggérée générale : retirer systématiquement toute date à 4 chiffres, tout nom de siècle et toute période nommée (Moyen Âge, Antiquité, guerre de Cent Ans) des réponses/explications de `ce2-personnages-celebres` et du matching associé ; garder des formulations de type « il y a très longtemps » ou « a marqué l'histoire de France ».

**Mineur** — chevauchement de contenu entre `ce2-personnages-monuments` et `ce2-souvenirs-monuments` ; pool `matching_histoire_ce2` multi-thématique utilisé par 2 exercices à titres spécifiques différents.

**Points positifs** : leçons hors du sous-thème "personnages/monuments" bien calibrées (situer le temps, comparer autrefois, école autrefois) ; 0 incohérence answer/choices sur les 97 items ; catégorie `ce2-ecole-autrefois` (20 items) riche et vivante, sans dérive de dates.

**Résumé** : Bloquant 8, Majeur 6, Mineur 5, Suggestion 1 (8 leçons, 97 items audités)

---

## Géographie CE2

### Leçons
Aucune erreur factuelle bloquante sur les 15 leçons.
**Mineur** — coquille d'id (`ce2-lesson-france-releifs-fleuves`) ; le Rhin présenté comme un des "cinq grands fleuves" français alors qu'il ne l'est que sur sa portion frontalière.
**Suggestion** — aucune des 2 leçons du sous-thème France ne mentionne la notion de région, alors que l'exercice de carte l'exige entièrement (voir ci-dessous).

### Exercices

**Bloquant — fuite de programme la plus large des 3 niveaux, non préparée** — `data/board_map_locate_ce2.json`, cat. `ce2_map_regions_france`, 13 items (couverture complète des régions, contre 13 en fuite nette au CP et 6 en fuite atténuée au CE1) — le programme cycle 2 reste sur l'espace proche ; le découpage régional complet relève du CM1. Aucune leçon du sous-thème ne prépare cette notion (jamais le mot "région" mentionné). Correction suggérée : retirer du parcours CE2 ou réduire drastiquement (2-3 régions) et ajouter une leçon dédiée.

**Majeur** — catégorie `ce2-cartes-symboles` (générique) réutilisée pour un exercice intitulé "Symboles et réseaux" (transports) sans item réellement spécifique aux réseaux de transport.
**Majeur** — item sur les DROM introduit sans aucune préparation dans les leçons, vocabulaire institutionnel non enseigné.
**Mineur** — répétitions de questions sur le rôle de la légende dans 3 catégories différentes du même sous-thème.

**Points positifs** : 0 incohérence answer/choices sur 165 items ; les 13 targetZoneId de la carte des régions cohérents avec le SVG et conformes au découpage administratif réel ; excellente qualité sur les notions de proximité (commune, quartier, services).

**Résumé** : Bloquant 1, Majeur 2, Mineur 4, Suggestion 3 (15 leçons, 165 items audités)

---

## Sciences CE2

### Leçons
Aucune anomalie sur les 10 leçons ; bonne rigueur (la leçon sur les saisons évite explicitement la fausse croyance "distance Terre-Soleil").

### Exercices

**Bloquant — contradiction scientifique inter-fichiers** — `data/science_matching.json`, cat. `matching_sciences_ce2`, paire "le renard → il mange seulement de la viande" contredit directement l'explication de `data/science_ce2.json` (« Le renard est un omnivore ») — le renard est un omnivore opportuniste, pas un carnivore strict. Correction suggérée : reformuler la paire ou choisir un exemple de carnivore strict (loup, lion).

**Mineur** — catégorie `ce2-materiaux-usages` (8 items) systématiquement sans accents.
**Mineur** — "Une espace naturel" au lieu de "Un espace naturel" (erreur de genre).

**Points positifs** : distinction changement d'état (fusion/solidification/évaporation/condensation) vs dissolution/mélange bien maintenue et enrichie (cycle de l'eau, températures de référence) ; chaînes alimentaires globalement rigoureuses ; démarche expérimentale fidèle au programme (hypothèse, variable unique, reproductibilité).

**Résumé** : Bloquant 1, Majeur 0, Mineur 2, Suggestion 2 (10 leçons, 172 items audités)

---

## EMC CE2

### Leçons
Aucune anomalie bloquante sur les 11 leçons.
**Suggestion** — leçon esprit critique ne distingue pas explicitement "fait vérifiable" vs "opinion personnelle", pourtant central à la notion.

### Exercices

**Majeur** — item "Un lieu partagé doit rester..." dupliqué à l'identique entre `ce2-cooperation` et `ce2-lieux-objets-communs`, cassant la cohérence thématique de l'exercice "Coopérer".
**Majeur** — distracteur "annuler le projet" (en cas d'égalité de vote) présenté comme faux alors que c'est une option légitime et fréquemment utilisée en pratique.
**Mineur** — catégorie `ce2-parole-ecoute` (8/8 items) et une partie de `ce2-esprit-critique`/`ce2-symboles-republique` systématiquement sans accents/apostrophes typographiques.

**Points positifs** : symboles de la République (14 items) tous factuellement exacts (drapeau, devise, hymne, Marianne, laïcité, étymologie de "République") ; esprit critique traité avec justesse et nuance (évite complotisme et relativisme) ; 0 incohérence answer/choices sur 153 items.

**Résumé** : Bloquant 0, Majeur 2, Mineur 5, Suggestion 4 (11 leçons, 161 items audités)

---

## Récapitulatif des actions suggérées (indicatif — aucune exécution dans cette phase)

### Priorité 1 — Bloquants (13), à traiter en urgence
1. **Purger toutes les dates précises et périodes nommées (Moyen Âge, guerre de Cent Ans, siècles) de `history_ce2.json` cat. `ce2-personnages-celebres` et de `history_matching.json`** — 8 items concernés, le point le plus grave de tout l'audit à ce stade.
2. Retirer ou réduire drastiquement la carte des 13 régions (`ce2_map_regions_france`) — fuite de programme la plus large des 3 niveaux.
3. Corriger l'item "chantier"/famille de "chant" et l'ordre alphabétique "pendu"/"pendule" en Français.
4. Corriger la contradiction renard omnivore/carnivore entre `science_ce2.json` et `science_matching.json`.
5. Corriger le bug `table: 12` → `"mix"` en Mathématiques.

### Priorité 2 — Majeurs (13)
- Retirer les compléments à 2000/5000 (hors-programme CE2) en Mathématiques.
- Corriger les 4 dates précises supplémentaires (Gutenberg, Montgolfier, Napoléon, Jules Ferry) en Histoire.
- Retirer ou nuancer l'item DROM en Géographie sans préparation ; clarifier la catégorie "cartes-symboles"/transports.
- Corriger le distracteur "fumier" en Français et les 2 items EMC (doublon coopération, distracteur vote à égalité).

### Priorité 3 — Mineurs et suggestions (46)
Voir détail par matière ci-dessus.

## Vérification

Relecture prioritaire recommandée du bloc Histoire CE2 (8 Bloquants) — c'est, à ce stade de l'audit (CP+CE1+CE2), la zone de contenu la plus problématique rencontrée, avec un motif clair et systématique (dates/périodes de cycle 3 dans une seule catégorie) qui suggère une correction ciblée et rapide plutôt qu'une refonte complète.

# Économie du Grimoire — équilibrage et règles de scaling

Mesures issues de `scratchpad/sim_economy.js` (simulation Monte-Carlo sur le
vrai code de `js/storage.js`, 60 runs par scénario). À refaire tourner après
tout changement de taux, de prix ou d'ajout massif de cartes.

## Paramètres actuels (réajustés juillet 2026, taux calibrés sur 141 cartes)

- Booster : **25 pièces**, **4 cartes**, dernier emplacement = slot rare garanti
- **Pity : 1** — une carte non possédée est forcée dès le 1er booster stérile
  (`_pityThreshold`). C'est le **vrai levier du rythme de découverte** : voir
  « Réduction du temps d'écran » plus bas.
- Tirage (slots 1-2) : commune 50 / rare 33 / épique 14 / légendaire 1 / prismatique 2
- Tirage (slot 3) : rare 72 / épique 22 / légendaire 3,5 / prismatique 2,5
- Doublons remboursés : **3 / 6 / 12 / 22 / 38** → **3 / 4 / 8 / 18 / 30**
  (recalibré v4.20.0, voir « Recalibrage à 176 cartes » plus bas). L'affirmation
  précédente — « n'accélère quasi pas la complétion » — était **fausse** : les
  remboursements finançaient ~81 % des boosters et divisaient la durée par ~2.
- Pity : jamais 2 boosters d'affilée sans nouvelle carte (seuil abaissé de 2 à 1
  en v4.21.0 — mesuré : un enfant ne subit jamais plus d'**1** paquet stérile)
- Revenu : étoiles gagnées (0-3/exercice) + 3 (défi du jour) + 5 (rattrapage) + 5 (nouveau badge)
- Revenu Grand Quiz : `score/2` arrondi bas + 3 si sans-faute (max 8/partie).
  Volontairement sous le rendement des exercices : le quiz est rejouable à
  volonté et ne doit pas devenir la ferme à pièces optimale.
- **Revenu leçon** (v4.18.0) : **2 pièces** par leçon comprise (quiz d'ancrage
  réussi), **une seule fois** — la relecture rapporte 0. La garde one-shot est
  côté `Storage.completeLessonView` (`justCompleted`), pas côté UI : relire une
  leçon en boucle ne peut pas devenir une ferme à pièces. Plafond théorique
  **~696 pièces** (348 leçons) sur toute la scolarité CP→CM2, à comparer aux
  ~3 440 pièces de complétion : réel mais non dominant, et non répétable.
  Une leçon ne rapporte **jamais d'étoile** (voir `docs/storage-gap.md`).
- **Bonus de série** : compléter les cartes de base d'une famille (hors ✨)
  crédite `5 × taille + 5` pièces, une seule fois. S'auto-calibre avec le
  nombre de familles — rien à retoucher à chaque ajout.
- **Lots de boosters** (v4.20.0, reprix en v4.21.0) : ×5 = **120 p** (−5) et ×10 = **235 p** (−15),
  déclarés dans `Storage._boosterBundles`. Remise **progressive** (5 % puis
  7,5 %) pour que le ×10 soit réellement plus intéressant que le ×5 — une remise
  identique (ex. −10 / −20) rendrait le ×10 inutile hors gain de clics.
  Volontairement modeste : **la ristourne baisse le prix effectif du booster,
  donc remonte mécaniquement le taux de récupération** (≈16,3 p remboursés ÷
  prix effectif). Mesuré : à 18 p effectifs (remise 10 %) on atteindrait 90 %,
  trop près des 100 % où le booster s'auto-finance, et la complétion retombait
  à ~3,4 mois. À 18,5-19 p, on reste à ~85-88 % et ~4,2 mois.
  Le pity court d'un booster à l'autre dans un lot : vérifié, l'écart de
  rendement lot/unitaire est de ~5 % (280 vs 266 boosters pour compléter).

## Pourquoi ce réajustement (contexte de la décision)

Le catalogue est passé de 92 → 115 → **141 cartes** (ajout des familles Loup
et Fennec, 24 cartes) sans que les taux de tirage suivent. Avec les anciens
taux (commune 70 / rare 24,5 / épique 5 / légendaire 0,35 / brillante 0,15 à
25 pièces/booster), la simulation donnait **~14 mois** de complétion pour un
enfant moyen — bien au-delà de l'année scolaire, alors que le repère
historique (92 cartes) était ~6 mois.

Point clé de calibrage : le revenu ne se mesure pas bien "par jour" mais
**par session** (l'enfant joue ~25 min à 1h par session, pas par petites
touches réparties sur la journée). Une session courte (~6 exercices) rapporte
~18 pièces, une session moyenne (~9 exercices) ~24 pièces, une longue
(~12-15 exercices) ~30 pièces.

## État mesuré (176 cartes, remboursements recalibrés v4.20.0)

> Les chiffres ci-dessous remplacent le tableau « 141 cartes » précédent, qui
> décrivait un catalogue et des remboursements qui n'existent plus.

| Profil | Revenu | Collection complète en |
|---|---|---|
| Léger (~3 exos/j) | ~7 p/j | ~8,7 mois |
| **Moyen (~5 exos/j)** | **~13 p/j** | **~4,7 mois ≈ année scolaire** ✓ |
| Assidu (~8 exos/j) | ~22 p/j | ~2,7 mois |

- Coût net de complétion : **~5 300 pièces** (médiane, p95 ~5 600)
- Boosters pour tout débloquer : médiane ~266 (p95 ~282)
- Première légendaire : médiane au booster **n°14** (p95 ~n°50) — reste un
  événement, sans être inaccessible.
- Récupération par doublons : **~81 %** du prix du booster (un booster reste une
  perte nette d'environ 4 pièces, donc les exercices restent la source de revenu).

## Règle de scaling (à retenir)

Le coût de complétion croît avec la taille du catalogue. Avec les taux
réajustés, chaque carte ajoutée pèse moins qu'avant en proportion (poids
rare/épique plus généreux qu'avant), mais la règle de vigilance reste valable :

> Reprojeter avec `sim_economy.js` dès qu'on dépasse ~180-200 cartes, ou si
> le temps de complétion sort de la fourchette **~4-7 mois** pour une session
> moyenne — **dans un sens comme dans l'autre**. Une complétion trop *rapide*
> est un symptôme aussi sérieux qu'une complétion trop lente : en 2026 elle a
> révélé que le booster s'auto-finançait.

**Deux indicateurs à surveiller, pas un seul** :
1. la **durée de complétion** au profil moyen (cible ~4-7 mois) ;
2. la **récupération par doublons** — doit rester nettement sous 100 % du prix
   du booster. Au-delà, le booster s'auto-finance et l'effort scolaire cesse
   d'être la source de progression : c'est le cœur du produit qui casse.

`sim_economy.js` affiche les deux et **lit ses paramètres dans `js/storage.js`** :
ne jamais y recopier les valeurs à la main (c'est ce qui a masqué la dérive
pendant toute la période 141 → 176 cartes).

### État du catalogue (mise à jour)

Ajout de la branche **Bestiaire Mythologique** (`family: "mythologie"`,
100 % légendaire/prismatique, aucune commune/rare/épique) : catalogue passé
de 141 → **176 cartes** (35 cartes mythologie : 4 loups + 31 créatures
diverses, 5 prismatiques). **Le seuil de vigilance des 180-200 cartes est
désormais tout proche** (à 4-24 cartes près) — pas encore atteint, mais le
prochain ajout de cartes, même modeste, devra être suivi d'une nouvelle
passe `sim_economy.js` avant d'ajouter davantage.

### Réduction du temps d'écran (v4.21.0) — le pity est le vrai levier

Constat produit : compléter les 176 cartes demandait **~266 boosters**, soit
beaucoup trop de temps devant l'écran pour un enfant.

**La découverte contre-intuitive** : ni les poids de tirage, ni le nombre de
cartes par booster ne pilotent vraiment ce chiffre. En fin de collection presque
tout est doublon, donc **c'est le pity qui dicte la cadence**. Mesuré :

| Cartes/booster | Boosters pour compléter |
|---|---|
| 3 (avant) | 266 |
| 4 | 245 |
| 5 | 228 |
| 6 | 219 |

Passer de 3 à 6 cartes ne fait gagner que ~47 boosters. En revanche, abaisser le
**pity de 2 à 1** fait tomber le total à **~185**. Le pity plafonne tout le reste.

**Changements retenus** : 4 cartes/booster, pity à 1, prix 20 → 25 p.

> Le prix devait suivre : à 20 p pour 4 cartes, la récupération par doublons
> remontait à **101 %** — le booster s'auto-finançait de nouveau, exactement le
> bug corrigé en v4.20.0, et la complétion tombait à 2,1 mois. À 25 p elle reste
> à **~81 %**, inchangée.

| Mesure | Avant (v4.20.0) | Après (v4.21.0) |
|---|---|---|
| Boosters pour compléter | 266 | **186** (−30 %) |
| Profil moyen | 4,7 mois | **3,8 mois** |
| Profil léger | 8,7 mois | **7,1 mois** |
| Récupération par doublons | 81 % | **81 %** (inchangée) |
| 1re légendaire | booster n°14 | **booster n°14** (inchangée) |
| Pire série sans nouveauté | 2 paquets | **1 paquet** |
| Ouvertures en lots ×10 | 27 | **19** |

Les lots ont été reprix en conséquence : ×5 = **120 p** (−5), ×10 = **235 p** (−15),
soit 84-86 % de récupération effective — sous le seuil des 90 %.

> **Ne pas descendre le pity à 0** (une nouveauté à chaque paquet) : testé, la
> collection tombe à ~112 boosters / 2,8 mois et perd toute valeur. 1 est le
> compromis entre « jamais frustrant » et « ça reste une collection ».

### ⚠️ Anomalie connue, non corrigée : 39 légendaires pour 1 % de poids

La branche mythologie a **triplé** le nombre de légendaires (13 → 39) sans que
leur poids de tirage bouge. Conséquence mesurée :

| Rareté | Cartes | Poids (slots 1-2) | Proba d'UNE carte précise |
|---|---|---|---|
| commune | 29 | 50 % | 1,724 % |
| rare | 48 | 33 % | 0,688 % |
| épique | 32 | 14 % | 0,438 % |
| **légendaire** | **39** | **1 %** | **0,026 %** |
| prismatique | 28 | 2 % | 0,071 % |

> **Attention à ne pas mal lire ce tableau.** Une projection *théorique* dit que
> compléter les seules légendaires demanderait ~3 000 boosters **en tirage pur,
> pity désactivé** — contre ~115 pour les communes (facteur 26×). **Ce n'est PAS
> le vécu réel** : le pity court-circuite les poids en fin de collection et
> ramène le total à **~186 boosters**. Le chiffre de 3 000 ne sert qu'à montrer
> que les poids seuls sont insuffisants ; ne jamais le citer comme une durée.

**L'équilibrage repose donc entièrement sur ce filet de sécurité**, et c'est
d'ailleurs pour ça que le pity est le levier n°1 du rythme (voir « Réduction du
temps d'écran »). Ce n'est pas sain sur le principe, mais desserrer le légendaire
a été testé et **rejeté** : à 6-8 % de poids, la première légendaire tombe dès le
booster n°3-5 et cesse d'être un événement (elle est aujourd'hui au n°14). Le
compromis est assumé ; à rouvrir avant d'ajouter une nouvelle famille de hautes
raretés.

Point notable : la branche mythologie n'ayant que des hautes raretés, elle
pèse plus lourd par carte sur le temps de complétion que les familles
standards (pas de communes/rares pour absorber du volume à bas coût) — à
prendre en compte dans la prochaine simulation, pas seulement le nombre
total de cartes.

### Recalibrage à 176 cartes (v4.20.0) — le booster s'auto-finançait

Le simulateur a été **réécrit pour lire ses paramètres dans `js/storage.js`**
plutôt que de les coder en dur : c'est précisément cette recopie qui avait
laissé la dérive passer inaperçue (il mesurait encore un booster à 25 p et des
remboursements 2/4/8/15/25, alors que le code était à 20 p et 3/6/12/22/38).

**Le vrai problème n'était pas la lenteur, mais l'inverse.** Mesures sur le
catalogue réel (176 cartes), avant correction :

| Mesure | Annoncé (141 cartes) | Réel mesuré (176 cartes) |
|---|---|---|
| Complétion, revenu moyen 13 p/j | ~4,8 mois | **~2,5 mois** |
| Récupération par doublons | (non mesurée) | **~105 % du prix du booster** |
| Part du financement venant des exercices | — | **~19 %** |

Un booster coûtait 20 pièces et en remboursait ~21 en doublons : il
**s'auto-finançait**. Une fois la collection avancée, l'enfant pouvait enchaîner
les boosters sans jamais manquer de pièces — **81 % des pièces venaient des
doublons, pas des exercices**. Le lien « je travaille → je progresse » était rompu,
et la collection se bouclait en 2,5 mois au lieu de l'année scolaire visée.

Cause : le ×1.5 sur les remboursements (juillet 2026) combiné au **slot rare
garanti**, qui sort une `rare` dans 72 % des boosters — remboursée 6 pièces,
`rare` pesait à elle seule 8,3 p sur les ~21 p remboursés par booster.

**Correction : remboursements `3/6/12/22/38` → `3/4/8/18/30`.** Seul levier touché
(le prix du booster reste à 20 p — règle de ce document : « en dernier recours »).
Les hautes raretés sont **augmentées** (légendaire 15→18, prismatique 25→30) : le
doublon qui fait mal reste bien consolé ; ce sont les communes/rares, moteur de la
machine à pièces, qui sont resserrées.

| Profil | Avant | Après |
|---|---|---|
| Léger (3 exos/j, 7 p/j) | 4,7 mois | **8,7 mois** |
| **Moyen (5 exos/j, 13 p/j)** | 2,5 mois | **4,7 mois ≈ année scolaire** ✓ |
| Assidu (8 exos/j, 22 p/j) | 1,4 mois | **2,7 mois** |
| Récupération par doublons | ~105 % | **~81 %** (mesuré sur 2 000 boosters réels) |
| 1re légendaire | booster n°15 | **booster n°14** (inchangé, reste un événement) |

Vérifié en conditions réelles dans le navigateur : l'ouverture affiche bien
« doublon +3 🪙 » / « +4 🪙 », le solde perd ~10 p nettes par booster, le pity
complète toujours les 176 cartes, et les bonus de série se déclenchent.

> **Piège de mesure à connaître** : le calcul théorique naïf (`Σ poids × remboursement`)
> donne ~77 %, mais le **pity** force une carte non possédée tous les 2 boosters sans
> nouveauté, ce qui tire la distribution réelle vers les hautes raretés — mieux
> remboursées. Le taux réellement mesuré est ~81 %. Toujours mesurer sur des boosters
> réels, pas seulement sur la formule.

> **Autre piège** : ne jamais estimer la durée de complétion par `coût ÷ revenu quotidien`.
> Les remboursements réinjectent la majorité des pièces : ce calcul surestime la durée
> d'un facteur ~5. Utiliser le nombre de jours simulés par `sim_economy.js`.

### Impact du revenu leçon (v4.18.0) : négligeable

Reprojection à 176 cartes, 120 runs, revenu de référence 13 p/j :

Le revenu leçon est **one-shot** : 696 pièces maximum sur toute la scolarité
CP→CM2 (348 leçons × 2), non répétable, contre ~5 300 pièces de complétion.
Il ne constitue donc pas une source pérenne et ne déplace pas l'équilibrage —
mesuré à quelques pourcents près sur la durée de complétion, très en deçà du
garde-fou posé à la conception (*si la complétion passait sous ~4 mois, ramener
le revenu leçon à +1 pièce*), **non déclenché**. Le +2 est conservé.

> Une première mesure annonçait ici « ~13,6 mois de complétion, −4,1 % avec les
> leçons ». **Ce chiffre était faux** : il estimait la durée par `coût ÷ revenu
> quotidien`, en ignorant que les remboursements de doublons réinjectent la
> majorité des pièces — ce qui surestimait la durée d'un facteur ~5. La vraie
> mesure (jours simulés) a révélé le problème inverse : la complétion était
> **trop rapide** (~2,5 mois). Voir « Recalibrage à 176 cartes ».

## Quand rééquilibrer ?

- **Ajout de cartes modéré (jusqu'à ~20-30 cartes) : ne rien changer.** La
  marge actuelle (~4,7 mois pour une session moyenne, contre une fourchette
  visée ~4-7 mois) absorbe une extension normale.
- **Au-delà : revoir en priorité, dans l'ordre :**
  1. Le **remboursement des doublons** (`_duplicateRefund`) — levier le plus
     puissant ET le plus dangereux (voir ci-dessous).
  2. Les poids de tirage (`_rarityWeights` / `_rareSlotWeights`) — attention,
     desserrer les hautes raretés détruit l'effet « événement » de la première
     légendaire (testé : à 6-8 % de poids, elle tombe au booster n°3-5).
  3. Le revenu par session (défi du jour, badges) si le rythme de jeu réel
     des enfants évolue.
  4. Le prix du booster, en dernier recours — un repère mental trop bas
     perd son sens (« 20 pièces » doit rester perçu comme un petit effort).

> ### ⚠️ Correction d'une idée fausse qui a coûté cher
>
> Ce document affirmait : *« ne pas partir du principe que rembourser plus les
> doublons accélère la collection — effet quasi nul, c'est un levier de confort,
> pas de vitesse »*. **C'est faux, et c'est ce qui a cassé l'économie.**
>
> Le remboursement n'arrive certes qu'*après* l'achat, mais il est **réinjecté
> dans le booster suivant**. Sur ~266 boosters, cette boucle finançait ~81 % des
> achats : le levier de « confort » était devenu la principale source de pièces
> du jeu, et divisait la durée de complétion par ~2. C'est **le levier le plus
> puissant du système**, pas le plus anodin.
>
> Règle de sûreté : la récupération moyenne par booster doit rester **nettement
> sous 100 % de son prix**. À 100 %, le booster s'auto-finance et l'application
> cesse de récompenser le travail scolaire.

## Piste future (optionnelle)

Pity légendaire à la Hearthstone : garantir une légendaire dans les X premiers
boosters (X ≈ 40) pour couvrir le p95 malchanceux. À envisager seulement si
des retours d'enfants frustrés remontent malgré le réajustement de juillet 2026.

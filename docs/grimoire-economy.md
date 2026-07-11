# Économie du Grimoire — équilibrage et règles de scaling

Mesures issues de `scratchpad/sim_economy.js` (simulation Monte-Carlo sur le
vrai code de `js/storage.js`, 60 runs par scénario). À refaire tourner après
tout changement de taux, de prix ou d'ajout massif de cartes.

## Paramètres actuels (réajustés juillet 2026, taux calibrés sur 141 cartes)

- Booster : **20 pièces** (était 25), 3 cartes, 3e emplacement = slot rare garanti
- Tirage (slots 1-2) : commune 50 / rare 33 / épique 14 / légendaire 1 / prismatique 2
- Tirage (slot 3) : rare 72 / épique 22 / légendaire 3,5 / prismatique 2,5
- Doublons remboursés (×1.5 vs version d'origine) : 3 / 6 / 12 / 22 / 38 selon
  rareté. N'accélère quasi pas la complétion (le remboursement arrive après
  coup, pas avant l'achat) — sert surtout à adoucir le ressenti du doublon.
- Pity : jamais 3 boosters d'affilée sans nouvelle carte
- Revenu : étoiles gagnées (0-3/exercice) + 3 (défi du jour) + 5 (rattrapage) + 5 (nouveau badge)
- Revenu Grand Quiz : `score/2` arrondi bas + 3 si sans-faute (max 8/partie).
  Volontairement sous le rendement des exercices : le quiz est rejouable à
  volonté et ne doit pas devenir la ferme à pièces optimale.
- **Bonus de série** : compléter les cartes de base d'une famille (hors ✨)
  crédite `5 × taille + 5` pièces, une seule fois. S'auto-calibre avec le
  nombre de familles — rien à retoucher à chaque ajout.

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

## État mesuré (141 cartes, nouveaux taux)

| Session | Pièces/session | Collection complète en |
|---|---|---|
| Courte (~6 exos) | ~18 | ~6,4 mois |
| **Moyenne (~9 exos)** | **~24** | **~4,8 mois ≈ année scolaire** ✓ |
| Longue (~12-15 exos) | ~30 | ~3,8 mois |

- Coût net de complétion : **~3 440 pièces** (médiane, p95 ~3 800)
- Boosters pour tout débloquer : médiane ~172 (p95 ~190)
- Première légendaire/prismatique : médiane au booster **n°10 à 15** selon le
  profil (p95 ~50-60) — reste un petit événement, sans être un horizon
  inaccessible comme avec les anciens taux (médiane n°38-81).

## Règle de scaling (à retenir)

Le coût de complétion croît avec la taille du catalogue. Avec les taux
réajustés, chaque carte ajoutée pèse moins qu'avant en proportion (poids
rare/épique plus généreux qu'avant), mais la règle de vigilance reste valable :

> Reprojeter avec `sim_economy.js` dès qu'on dépasse ~180-200 cartes, ou si
> le temps de complétion dérive au-delà de ~6-7 mois pour une session moyenne.

### État du catalogue (mise à jour)

Ajout de la branche **Bestiaire Mythologique** (`family: "mythologie"`,
100 % légendaire/prismatique, aucune commune/rare/épique) : catalogue passé
de 141 → **176 cartes** (35 cartes mythologie : 4 loups + 31 créatures
diverses, 5 prismatiques). **Le seuil de vigilance des 180-200 cartes est
désormais tout proche** (à 4-24 cartes près) — pas encore atteint, mais le
prochain ajout de cartes, même modeste, devra être suivi d'une nouvelle
passe `sim_economy.js` avant d'ajouter davantage. Les taux de tirage n'ont
volontairement pas été retouchés à ce stade (décision explicite : ne pas
ajuster tant que le seuil n'est pas franchi).

Point notable : la branche mythologie n'ayant que des hautes raretés, elle
pèse plus lourd par carte sur le temps de complétion que les familles
standards (pas de communes/rares pour absorber du volume à bas coût) — à
prendre en compte dans la prochaine simulation, pas seulement le nombre
total de cartes.

## Quand rééquilibrer ?

- **Ajout de cartes modéré (jusqu'à ~20-30 cartes) : ne rien changer.** La
  marge actuelle (4,8 mois pour une session moyenne, contre un plafond visé
  ~6-7 mois) absorbe une extension normale.
- **Au-delà : revoir en priorité, dans l'ordre :**
  1. Les poids de tirage (`_rarityWeights` / `_rareSlotWeights`) — c'est le
     levier qui a le plus d'effet, contrairement au remboursement de doublons.
  2. Le revenu par session (défi du jour, badges) si le rythme de jeu réel
     des enfants évolue.
  3. Le prix du booster, en dernier recours — un repère mental trop bas
     perd son sens (« 20 pièces » doit rester perçu comme un petit effort).
- **Ne pas partir du principe que rembourser plus les doublons accélère la
  collection** : la simulation montre un effet quasi nul sur le temps de
  complétion (le remboursement arrive après l'achat, pas avant). C'est un
  levier de confort/ressenti, pas de vitesse.

## Piste future (optionnelle)

Pity légendaire à la Hearthstone : garantir une légendaire dans les X premiers
boosters (X ≈ 40) pour couvrir le p95 malchanceux. À envisager seulement si
des retours d'enfants frustrés remontent malgré le réajustement de juillet 2026.

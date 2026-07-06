# Économie du Grimoire — équilibrage et règles de scaling

Mesures issues de `scratchpad/sim_economy.js` (simulation Monte-Carlo sur le
vrai code de `js/storage.js`, 60 runs par scénario). À refaire tourner après
tout changement de taux, de prix ou d'ajout massif de cartes.

## Paramètres actuels

- Booster : **25 pièces**, 3 cartes, 3e emplacement = slot rare garanti
- Tirage (slots 1-2) : commune 70 / rare 24,5 / épique 5 / légendaire 0,35 / prismatique 0,15
- Tirage (slot 3) : rare 86 / épique 12,5 / légendaire 1 / prismatique 0,5
- Doublons remboursés : 2 / 4 / 8 / 15 / 25 selon rareté
- Pity : jamais 3 boosters d'affilée sans nouvelle carte
- Revenu : étoiles gagnées (0-3/exercice) + 3 (défi du jour) + 5 (rattrapage) + 5 (nouveau badge)
- Revenu Grand Quiz : `score/2` arrondi bas + 3 si sans-faute (max 8/partie).
  Volontairement sous le rendement des exercices : le quiz est rejouable à
  volonté et ne doit pas devenir la ferme à pièces optimale.
- **Bonus de série** : compléter les cartes de base d'une famille (hors ✨)
  crédite `5 × taille + 5` pièces, une seule fois (de 20 pièces pour une
  lignée de 3 à 115 pour la famille Zéphyr). Total sur les 11 familles :
  **425 pièces** ≈ 17 boosters offerts → coût net de complétion ~2 045
  pièces, soit ~5,3 mois pour un enfant moyen (toujours dans l'année
  scolaire). En ajoutant des familles, le bonus s'auto-calibre avec la
  formule — rien à retoucher.

## État mesuré (92 cartes)

| Profil enfant | Pièces/jour | 1 booster tous les | Collection complète en |
|---|---|---|---|
| Léger (3 exos/j) | ~7 | 3,6 j | ~1 an calendaire |
| Moyen (5 exos/j) | ~13 | 1,9 j | **~6 mois ≈ année scolaire** ✓ |
| Assidu (8 exos/j) | ~22 | 1,1 j | ~4 mois |

- Coût net de complétion : **~2 470 pièces** (médiane, très faible variance :
  p95 = 2 620 — le pity et les remboursements lissent bien la malchance)
- Première légendaire/prismatique : médiane au booster n°19 (~1 mois pour un
  enfant moyen) ; p95 au n°72 (long, mais des épiques tombent entre-temps)

## Règle de scaling (à retenir)

Le coût de complétion croît **linéairement** avec la taille du catalogue :

> **1 carte ajoutée ≈ +27 pièces de coût net ≈ +2 jours de jeu** (enfant moyen)

| Catalogue | Coût net | Enfant moyen |
|---|---|---|
| 92 (actuel) | ~2 470 | ~6 mois |
| 122 | ~3 080 | ~8 mois |
| 152 | ~4 120 | ~10,5 mois |
| 200 | ~5 350 | ~14 mois ⚠ |

## Quand rééquilibrer ?

- **Jusqu'à ~150 cartes : ne rien changer.** La complétion reste dans l'année
  scolaire pour un enfant régulier ; chaque extension prolonge sainement la
  chasse.
- **Au-delà de ~150 cartes : augmenter le revenu, pas baisser le prix.**
  Leviers par ordre de préférence :
  1. Défi du jour : +3 → +5 pièces (récompense la régularité, pas le volume)
  2. Bonus hebdomadaire (ex. +10 pièces à 5 jours actifs dans la semaine)
  3. En dernier recours : +1 pièce par exercice réussi (inflation générale)
- **Ne pas toucher** aux taux légendaire/prismatique (rare = précieux, choix
  produit) ni au prix du booster (25 = repère mental simple).

## Piste future (optionnelle)

Pity légendaire à la Hearthstone : garantir une légendaire dans les X premiers
boosters (X ≈ 40) pour couvrir le p95 malchanceux. À envisager seulement si
des retours d'enfants frustrés remontent.

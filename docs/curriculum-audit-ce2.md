# Audit programme CE2

Sources officielles utilisées :
- https://www.education.gouv.fr/programmes-et-horaires-l-ecole-elementaire-9011
- https://eduscol.education.gouv.fr/4740/ressources-d-accompagnement-du-programme-de-francais-au-cycle-2
- https://eduscol.education.gouv.fr/4770/ressources-d-accompagnement-pour-questionner-l-espace-et-le-temps-explorer-les-organisations-du-monde-au-cycle-2
- https://eduscol.education.gouv.fr/4446/enseignement-moral-et-civique
- Bulletin officiel n°31 du 30 juillet 2020 (programme cycle 2)

> Audit revérifié intégralement le 2026-06-29 par lecture complète de `data/ce2.json` (3753 lignes, inventaire exhaustif matière par matière, sous-thème par sous-thème). **Mise à jour 2026-06-29 (suite) : division posée (avec/sans reste, `division-posed` niveau 1) et fractions simples demi/tiers/quart (`fraction-view`, maxDenom 4) ont été ajoutées dans `ce2-calculs-logique`, avec leçons associées.** **Mise à jour 2026-06-30 : ajout de l'exercice « Raconte une histoire » (`ce2-francais-raconte-histoire`, catégorie `story_order_ce2`) pour la production d'écrit guidée.** Pour le détail exact des exercices, voir [CONTENT_ARCHITECTURE.md](../CONTENT_ARCHITECTURE.md).

## Inventaire réel du contenu (data/ce2.json)

- **Mathématiques** : Tables de multiplication (2 à 12 + appariement + bonus), Calculs & Logique (cibles, carré magique, compléments à 100/500/1000/2000/5000, horloge x2, comparaison <1000, problèmes additifs/multiplicatifs, conversions masses/contenances), Géométrie (figures/solides, angle droit/équerre, symétrie/quadrillage, repérage sur quadrillage, appariement, mémoire, bonus).
- **Français** : Orthographe & Grammaire (7 séries d'homophones, genre des articles, pluriel, nature des mots, déterminant, accord GN, ordre des mots, ponctuation/types de phrase en leçon), Conjugaison (présent -ER/-IR, être/avoir au présent, futur être/avoir/-ER, imparfait auxiliaires/-ER, 3e groupe x2, verbe aller), Lecture et vocabulaire (idée principale, sens d'un mot, champ lexical, contraires), Dictée audio (3 dictées + leçon écoute), Production d'écrit guidée (« Raconte une histoire », remise en ordre de phrases, ajouté le 2026-06-30).
- **Questionner le temps** (histoire) : Repères, Autrefois (vie/objets du passé), Monuments et personnages, École d'autrefois.
- **Questionner l'espace** (géographie) : Espaces (ville/campagne/commune/services), La France (relief, régions, carte), Se repérer (plans, légendes, symboles), Transports.
- **Questionner le vivant et la matière** (sciences) : Le vivant (besoins, chaînes alimentaires, parties du corps, 5 sens), Matière (eau/états, matériaux), Observer (expériences, objets techniques), Saisons et météo, Les milieux de vie (écosystèmes, biodiversité).
- **EMC** : Règles (respect, droits/devoirs, symboles République), Citoyen (solidarité, coopération, décision collective, parole/écoute), Entraide, Responsabilité, Esprit critique et symboles (vrai/faux, symboles République).

Constat général : la dernière version corrige une bonne partie des manques identifiés précédemment (ponctuation/types de phrase, lecture-compréhension, vocabulaire, dictée, chaînes alimentaires, écosystèmes/biodiversité, esprit critique et symboles de la République sont désormais présents). Le contenu mathématique reste cependant centré sur le calcul et la géométrie, sans la division posée ni les fractions ; le français n'a toujours pas de passé composé ni de dictionnaire/usage du dictionnaire.

## Synthèse

Le CE2 est nettement plus complet qu'au précédent audit : français (lecture, vocabulaire, dictée, ponctuation) et EMC (esprit critique, symboles République) ont rattrapé une grande partie de leur retard, et les sciences couvrent désormais les écosystèmes/biodiversité. Le point faible structurel reste les mathématiques : la division (notion phare du CE2, actuellement réduite à une leçon de "partage" sans exercice dédié) et les fractions simples (moitié/quart en contexte, demi/tiers) sont absentes en tant qu'exercices. Histoire et géographie restent solides en repères et cartes mais pourraient gagner en richesse documentaire (sources/traces du passé, échelles). La conjugaison manque le passé composé, pourtant abordé en CE2 dans plusieurs manuels et utile pour la suite en CM1.

## État par matière

| Matière | Notions attendues (programme officiel CE2) | Couverture actuelle (data/ce2.json) | État | Action suivante |
|---|---|---|---|---|
| Mathématiques — Nombres et calcul | numération jusqu'à 10 000, tables de multiplication, addition/soustraction posées, **division simple (quotitive/partitive, avec ou sans reste)**, calcul mental, doubles/moitiés | tables 2-12, compléments à 100/500/1000/2000/5000, comparaison <1000, doubles/moitiés (leçon seule), **division posée avec/sans reste (ajouté le 2026-06-29)** | Couvert | Ajouter de la numération/décomposition des grands nombres si besoin d'aller plus loin |
| Mathématiques — Fractions | premières fractions simples (demi, tiers, quart) en contexte concret | **fractions simples demi/tiers/quart ajoutées le 2026-06-29 (`fraction-view`, maxDenom 4)** | Couvert | RAS |
| Mathématiques — Grandeurs et mesures | longueurs (m, cm), masses (kg, g), contenances (L, mL), durées, monnaie | conversions masses/contenances, longueurs (leçon), horloge/durées | Couvert | Ajouter un exercice "monnaie" explicite (rendu de monnaie, euros/centimes) si absent ailleurs |
| Mathématiques — Géométrie | figures planes/solides, angle droit, symétrie, repérage sur quadrillage | figures/solides, angle droit/équerre, symétrie, repérage quadrillage, exercices interactifs (board) | Couvert | RAS, niveau déjà riche |
| Mathématiques — Résolution de problèmes | problèmes à une ou deux étapes (addition, soustraction, multiplication, début de division) | problèmes additifs et multiplicatifs (+ bonus), division posée disponible séparément | Couvert | Optionnel : ajouter un problème narratif combinant explicitement division et contexte concret |
| Français — Lecture et compréhension | lire un texte, comprendre l'implicite, idée principale, vocabulaire en contexte | idée principale, sens d'un mot, champ lexical, contraires + leçons associées | Couvert | Ajouter un ou deux textes longs avec questions de compréhension fine (inférence) |
| Français — Étude de la langue : grammaire | nature des mots, groupe nominal, accord en genre/nombre, types et formes de phrase, ponctuation | nature des mots, accord GN, pluriel, types de phrase/ponctuation (leçon), ordre des mots | Couvert | Ajouter un exercice dédié type/forme de phrase (déclarative/interrogative/exclamative) au-delà de la leçon |
| Français — Orthographe | homophones grammaticaux (a/à, et/est, son/sont, on/ont, ou/où, ce/se, ces/ses), accords | 7 séries d'homophones complètes + accords | Couvert | RAS |
| Français — Conjugaison | présent, futur, imparfait, **passé composé** (1er contact), verbes être/avoir/aller/3e groupe | présent 1er/2e/3e groupe, futur, imparfait, être/avoir/aller | Partiel | Ajouter un premier contact avec le passé composé (auxiliaires + participe passé simple) |
| Français — Vocabulaire | usage du dictionnaire, ordre alphabétique, familles de mots, champ lexical | champ lexical, contraires, sens d'un mot | Partiel | Ajouter un exercice "ordre alphabétique / usage du dictionnaire" |
| Français — Oral / dictée | dictée, écoute active | 3 dictées audio + leçon écoute | Couvert | RAS |
| Questionner le monde — Temps (histoire) | se repérer dans le temps, traces du passé, Antiquité/Moyen Âge (premiers repères), vie quotidienne d'autrefois | repères temporels, vie/école d'autrefois, monuments, personnages célèbres | Couvert | Ajouter quelques repères de grandes périodes historiques (Antiquité, Moyen Âge) pour préparer le CM1 |
| Questionner le monde — Espace (géographie) | se repérer sur une carte/un plan, échelles, paysages, mobilités, la commune, la France | espaces (ville/campagne/commune), carte de France, relief/régions, plans/légendes, transports | Couvert | RAS, niveau déjà riche |
| Questionner le monde — Le vivant | caractéristiques du vivant, besoins, cycle de vie, chaînes alimentaires, classification simple | besoins des êtres vivants, 5 sens, parties du corps, chaînes alimentaires, écosystèmes/biodiversité | Couvert | RAS |
| Questionner le monde — La matière | états de l'eau, changements d'état, matériaux et propriétés | eau et transformations, matériaux, objets techniques | Couvert | RAS |
| Questionner le monde — Objets techniques | usages, fonctionnement simple, sécurité | objets techniques simples, usages et sécurité | Couvert | RAS |
| EMC — Sensibilité (soi et les autres) | exprimer ses émotions, respecter autrui, entraide | entraide, gentillesse, coopération | Couvert | RAS |
| EMC — Droit et règle | règles de la classe/école, droits et devoirs de l'enfant | règles, droits et devoirs, lieux/objets communs | Couvert | RAS |
| EMC — Jugement (esprit critique) | distinguer le vrai du faux, vérifier une information | "Vrai ou faux ?" + leçon esprit critique | Couvert | RAS |
| EMC — Engagement (citoyenneté) | symboles de la République, décision collective, coopération | symboles République (drapeau, devise, hymne, Marianne), décider ensemble, coopérer | Couvert | RAS |

## Priorités

1. ~~**Division posée et fractions simples**~~ : **fait le 2026-06-29.**
2. **Ajouter en priorité** : passé composé (1er contact).
3. **Ajouter ensuite** : exercice dédié "ordre alphabétique / dictionnaire", exercice "monnaie" en mathématiques, exercice dédié types/formes de phrase.
4. **Optionnel / enrichissement** : repères de grandes périodes historiques (Antiquité, Moyen Âge) pour mieux préparer le CM1, un ou deux textes de lecture plus longs avec questions d'inférence.
5. **Pas d'action requise** : géométrie, division/fractions, grandeurs (hors monnaie), sciences (vivant/matière/objets techniques), histoire-géo (hors enrichissement optionnel), et les quatre piliers de l'EMC sont déjà bien couverts.

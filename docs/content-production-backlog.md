# Backlog de Production Contenu

Ce document sert de socle de pilotage pour l'ajout de contenu pedagogique dans `Devoir Numerique`.
Le backlog initial est largement couvert ; les prochaines vagues doivent maintenant etre derivees du delta programme et de la QA langue.

## Règles de suivi

- Statuts autorises : `todo`, `in_progress`, `done`, `blocked`
- Travailler par petits lots reversibles
- Ne pas ouvrir un lot de vague superieure si un lot critique de vague inferieure bloque encore
- Toute modification de `data/` doit etre suivie d'une validation
- Toute nouvelle lecon doit rester alignee sur une notion scolaire, pas sur une mecanique d'application

## Etat actuel

- Lots historiques `L01` a `L60` soldes
- Lecons et exercices coexistent desormais sur tous les niveaux
- Les prochaines priorites sont la QA langue, la re-ecriture des lecons trop methodologiques et la densification des notions encore legeres

## Vagues

| Vague | Objectif |
|---|---|
| 1 | Gains rapides sans dette technique |
| 2 | Densification de la couverture visible |
| 3 | Chantiers a cadrage technique ou editorial plus fort |
| 4 | Enrichissement massif des banques de questions deja exposees |
| 5 | Densification des banques de français transversales |

## Priorites de reprise

- `P1` : corriger la langue et l'encodage sur les fichiers de niveau et les docs sensibles
- `P1` : re-ecrire les lecons qui restent trop methodologiques
- `P2` : densifier les notions encore legeres en maths et francais
- `P2` : poursuivre les lecons disciplinaires histoire / geographie / sciences / EMC
- `P3` : harmoniser les titres, sous-titres et messages d'interface

## Backlog

| Lot | Statut | Vague | Niveau(x) | Matiere | Objectif | Fichiers impactes | Volume cible | Notes |
|---|---|---|---|---|---|---|---|---|
| L01 | done | 1 | CM1 | Histoire | Exposer plus de frises existantes | `data/cm1.json` | 5 a 8 exercices | 5 exercices ajoutes et valides |
| L02 | done | 1 | CM2 | Histoire | Exposer plus de frises existantes | `data/cm2.json` | 5 a 8 exercices | 5 exercices ajoutes et valides |
| L03 | done | 1 | CE1 | Géographie | Densifier le repérage | `data/geography_ce1.json`, `data/ce1.json` | 2 catégories, 14 à 16 items | 2 catégories et 2 exercices ajoutés |
| L04 | done | 1 | CE2 | Geographie | Renforcer France et espaces | `data/geography_ce2.json`, `data/ce2.json` | 2 categories, 14 a 16 items | 2 categories et 2 exercices ajoutes |
| L05 | done | 1 | CP | Sciences | Renforcer Questionner le monde | `data/science_cp.json`, `data/cp.json` | 2 categories, 12 a 14 items | 2 categories et 2 exercices ajoutes |
| L06 | done | 1 | CE1 | Sciences | Étendre vivant et matière | `data/science_ce1.json`, `data/ce1.json` | 2 catégories, 12 à 14 items | 2 catégories et 2 exercices ajoutés |
| L07 | done | 1 | CE2 | Sciences | Introduire observation et objets | `data/science_ce2.json`, `data/ce2.json` | 2 categories, 12 a 16 items | 2 categories et 2 exercices ajoutes |
| L08 | done | 1 | CE1 | EMC | Structurer règles et respect | `data/emc_ce1.json`, `data/ce1.json` | 2 catégories, 12 à 14 items | 2 catégories et 2 exercices ajoutés |
| L09 | done | 1 | CE2 | EMC | Structurer responsabilité et coopération | `data/emc_ce2.json`, `data/ce2.json` | 2 catégories, 12 à 14 items | 2 catégories et 2 exercices ajoutés |
| L10 | done | 2 | CE1 | Histoire | Enrichir autrefois | `data/history_ce1.json`, `data/ce1.json` | 2 categories, 12 a 14 items | 2 categories et 2 exercices ajoutes |
| L11 | done | 2 | CE2 | Histoire | Renforcer repères simples | `data/history_ce2.json`, `data/ce2.json` | 2 catégories, 12 à 14 items | 2 catégories et 2 exercices ajoutés |
| L12 | done | 2 | CP-CE2 | Editorial transverse | Harmoniser le corpus documentaire | fichiers de niveau et datasets associes | reprise transverse | Passe de lisibilite sur fichiers de niveau et corpus touches |
| L13 | done | 2 | CM1 | Geographie | Mieux couvrir territoire et mobilites | `data/geography_cm1.json`, `data/cm1.json` | 2 categories, 14 a 16 items | 2 categories et 2 exercices ajoutes |
| L14 | done | 2 | CM2 | Geographie | Renforcer France-Europe-monde | `data/geography_cm2.json`, `data/cm2.json` | 2 categories, 14 a 16 items | 2 categories et 2 exercices ajoutes |
| L15 | done | 2 | CM1 | Sciences | Renforcer matière et énergie | `data/science_cm1.json`, `data/cm1.json` | 2 catégories, 14 à 16 items | 2 catégories et 2 exercices ajoutés |
| L16 | done | 2 | CM2 | Sciences | Mieux couvrir environnement et techniques | `data/science_cm2.json`, `data/cm2.json` | 2 categories, 12 a 16 items | 2 categories et 2 exercices ajoutes |
| L17 | done | 3 | CP-CE2 | Questionner le monde | Mieux refleter le cycle 2 dans les intitules | fichiers de niveau CP a CE2 | reprise structurelle legere | Intitules Cycle 2 realignes sans toucher aux IDs |
| L18 | done | 2 | CM2 | Mathematiques | Reequilibrer le niveau | `data/cm2.json` | 3 a 5 exercices | 4 exercices ajoutes avec moteurs existants |
| L19 | done | 3 | CE1-CM2 | Francais | Preparer lecture-comprehension | `data/french/reading.json`, niveaux associes | 2 a 4 categories pilotes | Pilote CE1 realise avec 2 categories et 2 exercices |
| L20 | done | 3 | CE1-CM2 | Francais | Preparer vocabulaire | data/french/reading.json, data/ce1.json | cadrage | Pilote CE1 realise avec 2 categories et 2 exercices |
| L21 | done | 4 | CP | Documentaires | Densifier les banques CP deja exposees | data/history_cp.json, data/geography_cp.json, data/science_cp.json, data/emc_cp.json | +20 a +30 questions utiles | Reecriture propre UTF-8, doublons supprimes, categories enrichies |
| L22 | done | 4 | CE1 | Documentaires | Densifier les banques CE1 deja exposees | `data/history_ce1.json`, `data/geography_ce1.json`, `data/science_ce1.json`, `data/emc_ce1.json` | +20 a +30 questions utiles | Datasets reconstruits proprement, accents corriges et categories enrichies |
| L23 | done | 4 | CE2 | Documentaires | Densifier les banques CE2 deja exposees | `data/history_ce2.json`, `data/geography_ce2.json`, `data/science_ce2.json`, `data/emc_ce2.json` | +20 a +30 questions utiles | Datasets reecrits proprement, encodage corrige et categories enrichies |
| L24 | done | 4 | CM1 | Documentaires | Densifier les banques CM1 deja exposees | `data/history_cm1.json`, `data/geography_cm1.json`, `data/science_cm1.json`, `data/emc_cm1.json` | +20 a +30 questions utiles | Categories exposees reecrites proprement et enrichies |
| L25 | done | 4 | CM2 | Documentaires | Densifier les banques CM2 deja exposees | data/history_cm2.json, data/geography_cm2.json, data/science_cm2.json, data/emc_cm2.json | +20 a +30 questions utiles | Categories exposees verifiees et assainies sur le perimetre utile |
| L26 | done | 5 | CP-CE1 | Francais | Enrichir l'orthographe lexicale recurrente | `data/french/spelling.json` | +20 a +35 mots utiles | Categories partagees enrichies et encodage assaini |
| L27 | done | 5 | CE1-CM2 | Francais | Densifier les banques d'homophones les plus jouees | `data/french/homophones.json` | +40 a +60 phrases utiles | Categories exposees reecrites sans doublons ni mojibake |
| L28 | done | 5 | CE1-CM2 | Francais | Densifier les banques de grammaire et accords les plus jouees | `data/french/grammar.json` | +80 a +120 items utiles | Categories exposees reecrites et perimetre CP preserve |
| L29 | done | 5 | CE1-CM2 | Francais | Densifier les banques de conjugaison les plus jouees | `data/french/conjugation.json` | +60 a +90 formes utiles | Categories exposees reecrites avec stock plus dense par temps |
| L30 | done | 2 | CE1-CM2 | Mathematiques | Densifier l'offre visible avec les moteurs existants | `data/ce1.json`, `data/cm1.json`, `data/cm2.json` | +8 exercices visibles | Ajouts cibles sur calcul mental, reste, decimaux et chiffres romains |
| L31 | done | 2 | CP-CE2 | Mathematiques | Epaissir les parcours et calculs visibles avec les moteurs existants | `data/cp.json`, `data/ce2.json` | +7 exercices visibles | Renfort sur complements, soustractions, ecriture des nombres, tables et comparaison |
| L32 | done | 2 | CM1-CM2 | Mathematiques | Ajouter un second palier sur nombres, fractions, decimaux et durees | `data/cm1.json`, `data/cm2.json` | +7 exercices visibles | Renfort sur dictee de nombres, fractions, decimaux et conversions |
| L33 | done | 4 | CP-CM2 | Sciences / EMC | Densifier massivement les banques exposees sans changer l'UX | `data/science_*.json`, `data/emc_*.json` | +90 a +100 questions utiles | Enrichissement transverse des categories exposees avec controle complet |
| L34 | done | 4 | CP-CM2 | Histoire / Geographie | Densifier massivement les banques exposees sans changer l'UX | `data/history_*.json`, `data/geography_*.json` | +85 a +95 questions utiles | Enrichissement transverse des categories exposees avec controle complet |
| L35 | done | 5 | CP-CM2 | Francais | Densifier les banques transversales de francais les plus rejouees | `data/french/spelling.json`, `data/french/homophones.json`, `data/french/grammar.json` | +70 a +90 items utiles | Encodage assaini puis enrichissement cible sur orthographe, homophones et grammaire |
| L36 | done | 5 | CE1-CM2 | Francais | Densifier la conjugaison la plus rejouee sans toucher aux sous-ensembles verrouilles | `data/french/conjugation.json` | +25 a +35 formes utiles | Reprise d'encodage puis enrichissement cible sur presents, futur, imparfait et passe compose |
| L39 | done | 4 | CE2-CM2 | Documentaires | Ajouter de nouvelles categories pour repousser la redondance des sous-themes visibles deja epaissis | data/geography_ce2.json, data/science_ce2.json, data/emc_ce2.json, data/geography_cm1.json, data/science_cm1.json, data/emc_cm1.json, data/geography_cm2.json, data/science_cm2.json, data/emc_cm2.json, data/ce2.json, data/cm1.json, data/cm2.json | +10 categories, +10 exercices visibles | Nouvelles banques creees puis branchees immediatement dans les niveaux |
| L40 | done | 4 | CP-CE1 | Documentaires | Creer de nouvelles categories sur les debuts de parcours tres rejoues pour continuer a reduire la redondance | data/history_cp.json, data/geography_cp.json, data/science_cp.json, data/emc_cp.json, data/history_ce1.json, data/geography_ce1.json, data/science_ce1.json, data/emc_ce1.json, data/cp.json, data/ce1.json | +8 categories, +8 exercices visibles | Nouvelles banques CP-CE1 creees puis branchees immediatement |
| L41 | done | 3 | CE2-CM2 | Documentaires | Ouvrir un nouveau palier de categories visibles sur les zones encore courtes apres L39-L40 | data/geography_ce2.json, data/science_cm1.json, data/history_cm2.json, data/ce2.json, data/cm1.json, data/cm2.json | +3 categories, +3 exercices visibles | Nouvelles categories ciblees puis branchees immediatement avec controle complet |
| L42 | done | 4 | CP-CM2 | Documentaires | Ajouter un nouveau passage de categories visibles sur des sous-themes encore rentables et courts | data/geography_cp.json, data/emc_ce1.json, data/science_ce2.json, data/geography_cm2.json, data/cp.json, data/ce1.json, data/ce2.json, data/cm2.json | +4 categories, +4 exercices visibles | Nouvelles categories reparties sur quatre niveaux avec controle complet |
| L43 | done | 4 | CP-CM2 | Documentaires | Poursuivre l'ouverture de categories visibles en histoire, sciences et EMC sur des sous-themes encore compacts | data/history_cp.json, data/science_ce1.json, data/emc_ce2.json, data/science_cm2.json, data/cp.json, data/ce1.json, data/ce2.json, data/cm2.json | +4 categories, +4 exercices visibles | Nouvelles categories reparties puis branchees immediatement avec controle complet |
| L44 | done | 4 | CE1-CM2 | Documentaires | Ajouter un nouveau palier visible sur histoire, geographie et EMC en renforcant les zones encore compactes | data/history_ce1.json, data/geography_ce1.json, data/emc_cm1.json, data/history_cm2.json, data/ce1.json, data/cm1.json, data/cm2.json | +4 categories, +4 exercices visibles | Nouvelles categories reparties puis branchees immediatement avec controle complet |
| L45 | done | 4 | CP-CM2 | Documentaires | Ajouter un nouveau palier visible sur geographie, histoire, sciences et EMC sur des zones encore peu denses | data/geography_cp.json, data/history_ce2.json, data/science_cm1.json, data/emc_cm2.json, data/cp.json, data/ce2.json, data/cm1.json, data/cm2.json | +4 categories, +4 exercices visibles | Nouvelles categories reparties puis branchees immediatement avec controle complet |
| L46 | done | 4 | CP-CM2 | Documentaires | Continuer la densification visible avec accents normalises sur sciences, histoire et geographie | data/science_cp.json, data/history_ce1.json, data/history_cm1.json, data/geography_cm2.json, data/cp.json, data/ce1.json, data/cm1.json, data/cm2.json | +4 categories, +4 exercices visibles | Nouvelles categories reparties puis branchees immediatement avec libelles accentues correctement |
| L47 | done | 4 | CP-CM2 | Documentaires | Ajouter un nouveau palier visible sur EMC CP, geographie CE1, histoire CM1 et sciences CM2 | data/emc_cp.json, data/geography_ce1.json, data/history_cm1.json, data/science_cm2.json, data/cp.json, data/ce1.json, data/cm1.json, data/cm2.json | +4 categories, +4 exercices visibles | Nouvelles categories reparties puis branchees immediatement avec controle complet |

## Memo d'execution

| Date | Lot | Action | Resultat |
|---|---|---|---|
| 2026-03-20 | L01 | Backlog initialise puis 5 frises CM1 ajoutees | Termine |
| 2026-03-20 | L02 | 5 frises CM2 ajoutées pour diversifier les repères | Termine |
| 2026-03-20 | L03 | 2 catégories CE1 et 2 exercices de repérage ajoutés | Termine |
| 2026-03-20 | L04 | 2 categories CE2 et 2 exercices de geographie ajoutes | Termine |
| 2026-03-20 | L05 | 2 categories CP et 2 exercices de sciences ajoutes | Termine |
| 2026-03-20 | L06 | 2 categories CE1 et 2 exercices de sciences ajoutes | Termine |
| 2026-03-20 | L07 | 2 categories CE2 et 2 exercices de sciences ajoutes | Termine |
| 2026-03-20 | L08 | 2 categories CE1 et 2 exercices EMC ajoutes | Termine |
| 2026-03-20 | L09 | 2 categories CE2 et 2 exercices EMC ajoutes | Termine |
| 2026-03-20 | L10 | 2 categories CE1 et 2 exercices d'histoire ajoutes | Termine |
| 2026-03-20 | L11 | 2 categories CE2 et 2 exercices d'histoire ajoutes | Termine |
| 2026-03-20 | L12 | Passe editoriale de lisibilite sur corpus CP-CE2 touches | Termine |
| 2026-03-20 | L13 | 2 categories CM1 et 2 exercices de geographie ajoutes | Termine |
| 2026-03-20 | L14 | 2 categories CM2 et 2 exercices de geographie ajoutes | Termine |
| 2026-03-20 | L15 | 2 categories CM1 et 2 exercices de sciences ajoutes | Termine |
| 2026-03-20 | L16 | 2 categories CM2 et 2 exercices de sciences ajoutes | Termine |
| 2026-03-20 | L17 | Intitules Cycle 2 realignes sur Questionner le monde | Termine |
| 2026-03-20 | L18 | 4 exercices de mathematiques CM2 ajoutes | Termine |
| 2026-03-20 | L19 | Pilote CE1 lecture de phrases courtes avec moteur reading | Termine |
| 2026-03-20 | L20 | Pilote CE1 vocabulaire avec moteur reading | Termine |
| 2026-03-20 | L21 | Datasets documentaires CP reecrits proprement et enrichis | Termine |
| 2026-03-20 | L22 | Datasets documentaires CE1 normalises et enrichis | Termine |
| 2026-03-20 | L23 | Datasets documentaires CE2 reecrits et enrichis | Termine |
| 2026-03-20 | L24 | Datasets documentaires CM1 reecrits sur les categories exposees | Termine |
| 2026-03-20 | L25 | Datasets documentaires CM2 controles, assainis et verifies sur les categories exposees | Termine |
| 2026-03-20 | L26 | Banque spelling enrichie pour CP-CE1 avec controle complet | Termine |
| 2026-03-20 | L27 | Banque homophones reecrite sur les categories exposees avec validation | Termine |
| 2026-03-20 | L28 | Banque grammar reecrite sur les categories exposees avec validation | Termine |
| 2026-03-20 | L29 | Banque conjugation reecrite sur les categories exposees avec validation | Termine |
| 2026-03-20 | L30 | Exercices maths CE1, CM1 et CM2 ajoutes avec controle complet des fichiers touches | Termine |
| 2026-03-20 | L31 | Exercices maths CP et CE2 ajoutes avec controle complet des fichiers touches | Termine |
| 2026-03-20 | L32 | Exercices maths CM1 et CM2 ajoutes avec controle complet des fichiers touches | Termine |
| 2026-03-20 | L33 | Banques sciences et EMC exposees densifiees sur tous les niveaux avec controle complet | Termine |
| 2026-03-20 | L34 | Banques histoire et geographie exposees densifiees sur tous les niveaux avec controle complet | Termine |
| 2026-03-23 | L35 | Banques spelling, homophones et grammar enrichies avec reprise d'encodage et validation | Termine |
| 2026-03-23 | L36 | Banque conjugation enrichie avec reprise d'encodage et validation | Termine |
| 2026-03-23 | L39 | Nouvelles categories documentaires CE2-CM2 creees puis exposees avec validation complete | Termine |
| 2026-03-23 | L40 | Nouvelles categories documentaires CP-CE1 creees puis exposees avec validation complete | Termine |
| 2026-03-23 | L41 | Nouvelles categories documentaires CE2, CM1 et CM2 creees puis exposees avec validation complete | Termine |
| 2026-03-23 | L42 | Nouvelles categories documentaires CP, CE1, CE2 et CM2 creees puis exposees avec validation complete | Termine |
| 2026-03-23 | L43 | Nouvelles categories documentaires CP, CE1, CE2 et CM2 creees puis exposees avec validation complete | Termine |
| 2026-03-23 | L44 | Nouvelles categories documentaires CE1, CM1 et CM2 creees puis exposees avec validation complete | Termine |
| 2026-03-23 | L45 | Nouvelles categories documentaires CP, CE2, CM1 et CM2 creees puis exposees avec validation complete | Termine |
| 2026-03-24 | L46 | Nouvelles categories documentaires CP, CE1, CM1 et CM2 creees puis exposees avec accents normalises et validation complete | Termine |
| 2026-03-24 | L47 | Nouvelles categories EMC CP, geographie CE1, histoire CM1 et sciences CM2 creees puis exposees avec controle complet | Termine |
| L48 | done | 4 | CE1-CM2 | Documentaires | Ajouter un nouveau palier visible sur histoire CE2, sciences CE1, EMC CM1 et geographie CM2 | data/history_ce2.json, data/science_ce1.json, data/emc_cm1.json, data/geography_cm2.json, data/ce2.json, data/ce1.json, data/cm1.json, data/cm2.json | +4 categories, +4 exercices visibles | Nouvelles categories reparties puis branchees immediatement avec controle complet |
| L49 | done | 4 | CP-CM2 | Documentaires | Ajouter un nouveau palier visible sur histoire CP, geographie CE2, sciences CM1 et EMC CM2 | data/history_cp.json, data/geography_ce2.json, data/science_cm1.json, data/emc_cm2.json, data/cp.json, data/ce2.json, data/cm1.json, data/cm2.json | +4 categories, +4 exercices visibles | Nouvelles categories reparties puis branchees immediatement avec controle complet |
| L50 | done | 2 | CP-CM2 | Mathematiques | Ajouter un nouveau palier visible sur complements, chiffres romains et durees | data/cp.json, data/ce2.json, data/cm1.json, data/cm2.json | +4 exercices visibles | Renfort visible sans nouveau moteur avec controle complet |
| 2026-03-24 | L48 | 4 categories et 4 exercices visibles CE1-CM2 ajoutes avec controle complet | Termine |
| 2026-03-24 | L49 | 4 categories et 4 exercices visibles CP-CM2 ajoutes avec controle complet | Termine |
| 2026-03-24 | L50 | 4 exercices mathematiques visibles ajoutes avec controle complet | Termine |

| L51 | terminé | 2026-03-24 | Vague massive français/maths CE1-CM2 | 20 exercices visibles ajoutés sur les moteurs existants |
| L52 | terminé | 2026-03-24 | Vague de leçons pilotes CE1-CM2 | 6 leçons ajoutées en maths et français sur la nouvelle structure `lessons[]` |
| L53 | terminé | 2026-03-24 | Vague de leçons pilotes CP-CM2 | 7 leçons supplémentaires ajoutées en maths et français avec contrôle d'encodage et validation |
| L54 | terminé | 2026-03-24 | UX multi-leçons et nouvelles leçons liées | mini-sommaire cliquable ajouté et 4 leçons complémentaires branchées avec validation |
| L55 | terminé | 2026-03-24 | Bloc mini-table pour les leçons | support validateur/UI ajouté puis branché sur conjugaison et conversions avec validation |
| L56 | terminé | 2026-03-24 | Retour des résultats vers les leçons | bouton contextuel ajouté sur l'écran de résultats pour revoir une ou plusieurs leçons du sous-thème |
| L57 | terminé | 2026-03-24 | Vague massive de leçons CP-CE2 | 10 leçons supplémentaires ajoutées en maths et français, bundle régénéré et validation OK |
| L58 | terminé | 2026-03-24 | Vague massive de leçons CM1-CM2 | 8 leçons supplémentaires ajoutées en maths et français, bundle régénéré et validation OK |
| L59 | terminé | 2026-03-24 | Navigation structurée des leçons | sections Leçons/Exercices ajoutées dans le sous-thème avec bundle régénéré et validation OK |
| L60 | terminé | 2026-03-24 | Première vague de leçons documentaires CP-CE2 | 6 leçons ajoutées en histoire, géographie et sciences avec bundle régénéré et validation OK |

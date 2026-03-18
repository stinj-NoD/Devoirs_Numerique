# Security Notes

## Périmètre

Le projet est une application front-only :
- pas de backend
- pas d’authentification serveur
- stockage local via `localStorage`
- rendu HTML généré côté client
- service worker actif pour le mode offline/PWA
- bibliothèque française modulaire chargée depuis `data/french/*.json`

La sécurité vise donc surtout :
- la robustesse des données
- la réduction des états incohérents
- la fiabilité du mode offline
- la limitation des comportements fragiles côté client

## Durcissements en place

### 1. Validation des données

- `js/validators.js` contrôle :
  - `data/index.json`
  - les fichiers de niveau
  - les exercices
  - la bibliothèque française modulaire
  - les datasets `factual-qcm`
  - les datasets `timeline`
- `scripts/validate-data.ps1` vérifie l’ensemble du corpus avant runtime
- les exercices invalides sont bloqués avant exécution
- les problèmes invalides sont bloqués avant rendu

### 2. Protection du runtime

- `js/app.js` ajoute des garde-fous sur :
  - niveau invalide
  - matière ou sous-thème vide
  - exercice sans paramètres exploitables
  - question moteur sans `answer`
  - affichage de résultats sans total valide
- un chemin de sortie de secours remet l’état dans une situation saine si un exercice devient incohérent
- les choix QCM sont mélangés à la génération pour éviter les schémas de clics trop prévisibles

### 3. Durcissement des profils

- `js/storage.js` normalise les noms de profils
- les noms sont nettoyés et limités
- les doublons logiques sont refusés
- les noms vides, trop courts ou invalides sont bloqués

### 4. Durcissement du stockage local

- lecture défensive du JSON issu de `localStorage`
- nettoyage des records invalides ou corrompus
- vérification d’intégrité via hash simple des records
- bornage de `score`, `total`, `percent`, `stars`
- résolution canonique du profil courant

Important :
- `localStorage` n’est pas un mécanisme de sécurité fort
- il sert ici à contenir les erreurs et manipulations triviales, pas à protéger contre un attaquant local déterminé

### 5. Durcissement offline/PWA

- `sw.js` pré-cache les assets applicatifs critiques
- `sw.js` pré-cache les datasets utiles au fonctionnement offline
- les anciens caches sont purgés au changement de version
- le fallback `offline.html` est renvoyé pour les navigations hors ligne
- seules les origines internes et les fonts whitelistees sont prises en compte
- le service worker ne référence plus de bibliothèque française legacy

### 6. Audio côté navigateur

- la dictée audio repose sur `speechSynthesis`
- l’application détecte sa disponibilité avant usage
- la lecture en cours peut être annulée proprement
- un état UI explicite évite les doubles clics pendant la lecture

Limite :
- la qualité de la voix dépend du navigateur et du système hôte
- ce mécanisme améliore l’usage, mais ne constitue pas une surface de sécurité forte

## Points sensibles

- les contenus JSON influencent le rendu visuel et le comportement pédagogique
- toute régression du service worker impacte directement le mode offline
- les renderers UI utilisent encore du HTML généré côté client
- `js/ui.js` reste dense, donc plus exposé aux régressions de maintenance
- le moteur audio dépend des voix françaises disponibles localement

## Règles de maintenance

- valider les JSON avant runtime
- ne pas introduire de contenu HTML arbitraire dans `data/*.json`
- vérifier local/offline après changement de `sw.js`
- régénérer `js/data-bundle.js` après changement dans `data/`
- ne pas traiter `localStorage` comme une source totalement fiable
- garder les bibliothèques françaises synchronisées avec leur contrat de validation

## Vérification manuelle recommandée

- création profil valide
- refus profil vide / trop court / dupliqué
- lancement exercice simple
- lancement exercice documentaire
- lancement dictée audio
- sauvegarde du score
- recharge navigateur
- vérification de l’état des profils et records
- vérification hors ligne avec service worker actif

## Limites connues

- pas de tests automatisés de sécurité
- pas de chiffrement du stockage local
- pas de protection serveur, l’application étant purement front-end
- hash de record utile contre la corruption simple, pas contre une falsification locale avancée
- qualité audio dépendante de `speechSynthesis`

# Security Notes

## Périmètre

`Devoir Numérique` est une application front-only :
- pas de backend
- pas d'authentification serveur
- stockage local uniquement
- rendu HTML généré côté client
- service worker pour l'offline
- contenu pédagogique chargé depuis des JSON versionnés

La sécurité porte donc surtout sur :
- la robustesse des données
- la prévention des états runtime incohérents
- la fiabilité du mode offline
- la qualité du stockage local

## Contrôles en place

### 1. Validation des données

- [validators.js](js/validators.js) valide au runtime :
  - `index.json`
  - les fichiers de niveau
  - les exercices
  - les leçons et leurs blocs
  - la bibliothèque de français
  - les datasets documentaires
- [validate-data.ps1](scripts/validate-data.ps1) vérifie l'ensemble du corpus avant intégration

Les points bloqués explicitement :
- sous-thème vide
- `lessons` non tableau
- `blocks` absents ou vides
- format de leçon non reconnu
- exercice sans `engine` ou `params` valides
- références documentaires cassées

### 2. Garde-fous runtime

[app.js](js/app.js) gère des sorties de secours sur :
- niveau invalide
- matière ou sous-thème vide
- exercice sans question valide
- réponse attendue absente
- score final incohérent
- écran cible introuvable

Objectif :
- éviter le plantage silencieux
- ramener l'application vers un état navigable

### 3. Stockage local défensif

[storage.js](js/storage.js) protège :
- profils
- utilisateur courant
- records

Mesures en place :
- sanitation des noms de profils
- refus des profils vides ou incohérents
- lecture défensive du JSON local
- nettoyage des records invalides
- fallback localStorage -> sessionStorage -> mémoire

Limite importante :
- ce stockage n'est pas une sécurité forte
- il limite surtout les corruptions et erreurs triviales

### 4. Service worker et offline

[sw.js](sw.js) :
- pré-cache les assets critiques
- purge les anciens caches à chaque changement de version
- sert [offline.html](offline.html) comme fallback de navigation

Le bundle [data-bundle.js](js/data-bundle.js) offre un filet de sécurité local si certains chargements JSON échouent.

### 5. Surface d'entrée utilisateur

Les seules entrées réellement libres côté utilisateur sont limitées :
- nom du profil
- réponses aux exercices

Les contenus pédagogiques ne doivent jamais injecter de HTML arbitraire. Les leçons restent rendues comme données structurées, pas comme markup libre. [security.js](js/security.js) (`SecurityUtils.escapeHtml`/`escapeAttr`) échappe systématiquement le texte dynamique inséré dans le DOM (questions générées, libellés de cartes, contenus de moteurs procéduraux).

### 6. Mise à jour forcée du service worker

Le bouton « Mettre à jour l'application » (`App.forceAppUpdate()` dans [app.js](js/app.js)) appelle `registration.update()` puis active le nouveau worker via `SKIP_WAITING`. Il n'expose aucune nouvelle surface d'entrée : c'est un appel à l'API standard `ServiceWorkerRegistration`, sans paramètre fourni par l'utilisateur.

## Risques connus

Les risques résiduels du projet sont aujourd'hui :
- dette d'encodage UTF-8 dans certains fichiers historiques
- altération de JSON par outillage de sérialisation
- divergence entre validateur hors runtime et validateur frontend si les contrats évoluent sans synchronisation
- corruption manuelle du `localStorage`

## Règles de sécurité projet

À chaque évolution de structure :

1. mettre à jour [validators.js](js/validators.js)
2. mettre à jour [validate-data.ps1](scripts/validate-data.ps1)
3. relancer la validation complète
4. vérifier un parcours live :
   - profil
   - classe
   - leçon
   - exercice
   - résultat

## Priorités sécurité actuelles

- maintenir le contrat `lessons[]` et `blocks[]` strictement aligné entre frontend et scripts
- éliminer les reliquats d'encodage qui peuvent casser l'affichage ou le sens
- éviter toute régression sur la navigation locale et l'offline
# TODO — Rendre fonctionnel le bouton "Modifier" sur MesAvisPage

## Étapes

- [x] Plan approuvé
- [x] **1. Créer** `src/components/avis/ModifierAvisModal.jsx` — Modal d'édition (note + commentaire)
- [x] **2. Modifier** `src/services/apprenantExperienceService.js` — Ajouter `updateAvis()` avec localStorage
- [x] **3. Modifier** `src/pages/apprenant/MesAvisPage.jsx` — Câbler le modal, état, toast
- [x] **3b. Corriger** `src/App.jsx` — Déplacer tous les imports en haut du fichier (erreur eslint pré-existante)
- [x] **4. Vérifier** `npm run build` passe sans erreur

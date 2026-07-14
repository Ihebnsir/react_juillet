# TODO - SkillBridge (Centre: Mes offres)

## Étape 1 — Normalisation & fondations
- [x] Vérifier l’état actuel : pages `MesOffresPage` et `NouvelleOffrePage` (contenu vide/simulé)
- [ ] Normaliser strictement le champ de centre : `centreId` partout (jamais `centerId`)
- [ ] Adapter/étendre `formationsService` pour filtrer avec `centreId` et persister via `localStorage`
- [ ] Refactor `ReservationContext` selon le contrat attendu (getReservationsParFormation/ParCentre, confirmer/annuler)
- [ ] Créer `services/reservationsService.js` (read/write mockReservations + localStorage)

## Étape 2 — UI centre (CRUD)
- [ ] Ajouter composants :
  - [ ] `components/centre/OffreCard.jsx`
  - [ ] `components/centre/OffreForm.jsx` (react-hook-form multi-sections)
  - [ ] `components/centre/ListeInscritsTable.jsx`
- [ ] Implémenter page liste : `pages/centre/MesOffresPage.jsx`
- [ ] Implémenter page création/édition : `pages/centre/NouvelleOffrePage.jsx`
- [ ] Implémenter page détail : `pages/centre/DetailOffrePage.jsx`

## Étape 3 — Routing
- [ ] Ajouter routes dans `src/App.jsx` :
  - `/centre/offres/:id/modifier`
  - `/centre/offres/:id`

## Étape 4 — Validation
- [ ] Vérifier isolation centre : `formation.centreId === user.id`
- [ ] Vérifier suppression bloquée si réservation active (status `en_attente` ou `confirmee`)
- [ ] Vérifier empty state (aucune offre)
- [ ] Vérifier `npm run build` passe sans erreur


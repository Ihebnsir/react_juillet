# TODO - Corrections Espace Centre

## Partie 1 : Notifications
- [x] 1.1 Refactoriser `NotificationCenter.jsx` → utiliser `useNotifications()` du contexte
- [x] 1.2 Supprimer le fichier dupliqué `src/components/UI/NotificationsPage.jsx`
- [x] 1.3 Mettre à jour `CentreLayout.jsx` : déplacer Notifications dans section "Compte"
- [x] 1.4 Mettre à jour `DashboardPage.jsx` (NotificationCenter sans props)
- [x] 1.5 Vérifier la synchronisation Topbar ↔ Sidebar ↔ Page ↔ Dashboard
  - 1 seul NotificationProvider dans App.jsx✓
  - NotificationCenter utilise useNotifications()✓
  - AppTopbar utilise useNotifications()✓
  - CentreLayout/AdminLayout/ApprenantLayout utilisent useNotifications()✓
  - NotificationsPage utilise useNotifications()✓
  - Aucun état local concurrent✓
  - Aucun NotificationContext secondaire✓
  - Aucune duplication de données✓

## Partie 2 : Recherche globale
- [x] 2.1 Créer la logique de recherche dans `GlobalSearchModal`
- [x] 2.2 Ajouter les résultats groupés par catégorie
- [x] 2.3 Navigation clavier (↑↓ Entrée Échap)
- [x] 2.4 Animations et feedback visuel
- [x] 2.5 Highlight du texte recherché

## Partie 3 : Vérifications
- [x] 3.1 Vérifier la compilation (build réussi)
- [ ] 3.2 Tester les 3 rôles (Centre, Apprenant, Admin) — recommandé test manuel
- [ ] 3.3 Vérifier toutes les routes — recommandé test manuel
- [x] 3.4 Vérifier qu'aucun import n'est cassé
- [x] 3.5 Rapport final

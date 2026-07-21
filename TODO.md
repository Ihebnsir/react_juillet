# SkillBridge — Navigation Accessibility & UX for Authenticated Users

## Etapes
- [x] Add `nav.dashboard` and `nav.backToDashboard` to i18n locales (fr, en, ar)
- [x] Update Navbar.jsx:
  - [x] Import `useLocation`
  - [x] Create `getDashboardPath(user)` helper
  - [x] Create `isOnDashboard(pathname, user)` helper
  - [x] Add "Tableau de bord" button (desktop) with highlight on active
  - [x] Make avatar + username clickable → dashboard
  - [x] Highlight button when on dashboard path
  - [x] Add dashboard link to mobile menu (first item when authenticated)
  - [x] Add profile link + logout to mobile menu for auth users
- [x] Verify build passes: `npm run build`


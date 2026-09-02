# SkillBridge backend/frontend audit

## Real backend

- Project: `backend_aout2026`
- Entry point: `app.js`
- Start command: `npm start` (`node app.js`)
- Development command: `npm run dev`
- Port: `process.env.point`, default `5000`
- MongoDB: `MONGO_URL` (configured in the backend environment)
- API prefixes mounted in `app.js`: `/api/auth`, `/api/users`, `/api/centres`, `/api/formations`, `/api/reservations`, `/api/centre-documents`, `/api/certifications`, `/api/notes`, `/api/notifications`, `/api/signalements`, `/api/litiges`, `/api/admin/dashboard`

## Authentication contract

| Frontend module | Backend endpoint | Method | Request | Response | Auth | Roles |
| --- | --- | --- | --- | --- | --- | --- |
| `LoginForm` -> `authService.login` | `/api/auth/login` | POST | `{ email, password }` | `{ success, message, data: { user, token } }` | No | Any active user |
| `RegisterPage` -> `AuthContext.register` -> `authService.register` | `/api/auth/register` | POST | Learner: `{ role: "apprenant", nom, prenom, email, password, telephone?, ville? }`; centre: `{ role: "centre", name, responsable, email, password, telephone?, ville?, matriculeFiscal?, numeroRNE?, adresse?, description?, domaine?, siteWeb? }` | `{ success, message, data: { user, token } }` | No | `apprenant` or `centre`; backend defaults omitted role to `apprenant` |
| `AuthContext` session restoration -> `authService.getAuthenticatedUser` | `/api/auth/me` | GET | None | `{ success, data: user }` | `Authorization: Bearer <token>` | Any active user |
| `AuthContext.logout` -> `authService.logout` | No backend logout route exists | Local cleanup | None | None | N/A | N/A |

The backend sanitizes `password` and `__v`, returns Mongo `_id` as string `id`, signs JWTs for one hour, and accepts `apprenant`, `centre`, and `admin` roles. The backend email service is best-effort during registration and is not required by the frontend contract.

## Frontend changes

- `src/services/apiClient.js`: single JSON client, `REACT_APP_API_URL`, Bearer token attachment, normalized HTTP errors.
- `src/services/authService.js`: real login/register calls, exact `data.token`/`data.user` handling, `/me`, token and safe-user persistence.
- `src/context/AuthContext.jsx`: restores an existing token through `/api/auth/me`; clears invalid sessions; no `mockUsers` authentication.
- `src/pages/RegisterPage.jsx`: sends backend field names for centre registration and collects required learner `prenom`; handles async errors.
- `src/components/Forms/LoginForm.jsx`: preserves UI and adds user-friendly network/status errors.
- `.env`: `REACT_APP_API_URL=http://localhost:5000`.

## Mock data audit

These remain intentionally unmigrated. They are not used as the source of email/password authentication.

- `mockUsers`: admin/search/demo pages and local admin dashboard data. Must be connected to `/api/users` later; `/api/users` is admin-protected except owner operations.
- `mockFormations`: home, learner, centre and admin views. Must be connected to `/api/formations` later.
- `mockCentres`: public, centre and admin views. Must be connected to `/api/centres` later.
- `mockReservations`: learner, centre, admin and export views. Must be connected to `/api/reservations` later.
- `mockNotifications`: `NotificationContext`. Must be connected to `/api/notifications` later.
- `mockSignalements`: admin dashboard data. Must be connected to `/api/signalements` later.
- `mockLitiges`: admin views. Must be connected to `/api/litiges` later.
- `mockCertificates`: centre and reservation-related views. Must be connected to `/api/certifications` later.
- `mockPayments`: centre payment view. No dedicated payment prefix exists; payment is represented by `/api/reservations/:id/pay` and needs a focused contract review.
- `mockDocuments`: centre documents view. Must be connected to `/api/centre-documents` later.
- `mockStudents`: centre/admin presentation data. Likely derived from `/api/users`, but no dedicated students prefix exists.
- `mockRevenueHistory`: centre statistics presentation data. Backend has `/api/admin/dashboard/revenue` for admin only; no centre revenue endpoint was found.
- Static/local-only data also exists in `mockData.js` and related UI fixtures.

## Compatibility findings

- Fixed: backend response is nested under `data`; frontend now reads `data.user` and `data.token`.
- Fixed: centre registration UI names are translated to backend keys `name`, `responsable`, and `adresse`.
- Fixed: learner registration now supplies backend-required `prenom`.
- Compatible: frontend routes use the backend role values `apprenant`, `centre`, and `admin`.
- Compatible: frontend ID consumers can use backend `user.id` string, but local mock modules still assume numeric/demo IDs and must be reviewed during migration.
- Backend status is `active`/`inactive`/`suspended`/`banned`; local mock data uses additional French statuses such as `actif`, `suspendu`, `en_attente`, and `desactive`.
- JWT expiry is one hour; `/me` now validates the token on every frontend initialization.
- No backend logout endpoint exists, so logout is client-side token removal.
- Existing GitHub/LinkedIn callback code still targets the separate legacy `server/index.js` service on port `3001`; it was not migrated because those routes are not part of `backend_aout2026` authentication.

## Non-auth route map

The real backend provides route families for users, centres, formations, reservations, centre documents, certifications, notes, notifications, signalements, litiges, and admin dashboard metrics. Existing frontend services/pages still use mocks for these families; no blind migration was performed.

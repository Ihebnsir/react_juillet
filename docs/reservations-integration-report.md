# Reservation frontend integration report

## Files modified

- `src/services/reservationsService.js`: replaced localStorage/mock operations with the real reservation API and response normalization.
- `src/context/ReservationContext.jsx`: loads authenticated learner reservations from `/api/reservations/me`, exposes `loading` and `error`, refreshes after mutations.
- `src/pages/FormationDetailPage.jsx`: creates reservations with only the real formation MongoDB ID and reports backend errors.
- `src/pages/apprenant/PaymentCheckoutPage.jsx`: loads context reservations and calls the real payment endpoint without artificial delay or generated transactions.

No backend files were modified.

## Real endpoints used

- `GET /api/reservations/me`: learner's paginated reservations.
- `POST /api/reservations`: body `{ formationId }`; learner, centre and price are derived by the backend from JWT and Formation.
- `GET /api/reservations/:id`: authenticated owner/admin detail endpoint.
- `GET /api/reservations/formation/:formationId`: centre/admin formation reservation listing.
- `PATCH /api/reservations/:id/cancel`: learner cancellation.
- `PATCH /api/reservations/:id/pay`: body `{ paymentMethod }`; learner payment.
- `PATCH /api/reservations/:id/confirm`: centre/admin confirmation.

No frontend call was added for `complete` because no existing reservation UI required it.

## Mapping

Backend reservation fields are normalized at the service boundary: `_id` to `id`, populated `learnerId`, `formationId`, and `centreId` to their IDs, populated formation/centre fields to the existing UI names, and backend statuses `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED` to the UI status names.

The backend rejects client-supplied `learnerId`, `centreId`, `price`, payment fields, status, and history on create; the frontend no longer sends those fields.

## Mock dependencies remaining

`mockReservations.js` remains used by:

- `src/hooks/useAdminDashboardData.js`
- `src/pages/admin/StatistiquesPage.jsx`
- `src/pages/apprenant/DashboardPage.jsx`
- `src/pages/centre/DashboardPage.jsx`
- `src/pages/centre/ReservationsRecuesPage.jsx`
- `src/services/apprenantExperienceService.js`
- `src/components/centre/ExportReportButton.jsx`

These legacy views were not migrated in this task. The main learner reservation page uses `ReservationContext` and no longer reads mock reservations directly.

## Unsupported or limited features

- No certificate route is mounted under the backend reservation API; the frontend no longer fabricates certificates and reports the feature as unavailable.
- There is no backend reservation-by-centre endpoint; centre views should use `/api/reservations/formation/:formationId` per formation when migrated.
- Payment is a backend local state update, not an external card gateway. The frontend calls the backend endpoint and uses its returned transaction data; it does not claim external payment authorization.
- Existing payment card validation UI remains present, but card details are not sent to the backend because its contract accepts only `paymentMethod`.

## Tests and verification

- Frontend production build: passed.
- Frontend full tests: 9 suites passed, 1 pre-existing `App.test.js` suite failed because `TextEncoder` is unavailable while loading `jspdf`.
- Real backend reservation API without token: `GET /api/reservations/me` returned `401`; `GET /api/reservations` returned `401`.
- Reservation creation, listing with a valid learner, cancellation, payment and logout were not executed with a real account because no test account/session was created and no data was modified.
- No reservation page integrated in this task falls back to mock data after an API failure.

# Formations: backend/frontend integration audit

## Backend API (`backend_aout2026`)

Backend entry point: `app.js`. Port: `process.env.point`, default `5000`.

| Method | URL | Auth | Roles | Contract |
| --- | --- | --- | --- | --- |
| GET | `/api/formations` | Public | Any | Query: `page`, `limit`, `centre`, `category`, `categorie`, `status`, `offreStage`, `search`; response `{ success, data: Formation[], pagination: { page, limit, total, pages } }`; newest first by `createdAt` |
| GET | `/api/formations/:id` | Public | Any | Mongo ObjectId; response `{ success, data: Formation }`; invalid ID `400`, missing formation `404` |
| POST | `/api/formations` | Bearer JWT | `centre` | Body validated with `title`, `price`, `duration`; optional `description`, `category`, `categorie`, `status`, `offreStage`, `entreprisesPartenaires`, `progress`, `startDate`, `endDate`, `image`; response `201 { success, message, data: Formation }` |
| PUT | `/api/formations/:id` | Bearer JWT | `centre`, `admin`; centre must own formation | Partial update with the same formation fields; `centre`, `_id`, timestamps rejected; response `200 { success, message, data: Formation }` |
| DELETE | `/api/formations/:id` | Bearer JWT | `centre`, `admin`; centre must own formation | Response `200 { success, message, data: deletedFormation }` |

Formation model fields: `centre`, `title`, `description`, `price` (number), `duration`, `category`, `categorie`, `status` (`pending`, `confirmed`, `in-progress`, `completed`), `offreStage`, `entreprisesPartenaires`, `startDate`, `endDate`, `progress`, `image`, `createdAt`, `updatedAt`. The populated `centre` is a `Centre` document and includes `userId`, `name`, `ville`, `logo`, etc.

No backend formation endpoints exist for reviews, trending, program/modules, capacity, ratings, or sorting by price/popularity.

## Frontend changes

- `src/services/formationsService.js` now uses `apiClient.js` for all supported formation operations.
- It sends backend-compatible payloads and normalizes `_id` to `id`, `centre.ville` to `centre.city`, and derives display `city`/`domain` aliases.
- `search` delegates text/category/stage filters to backend and applies city/price filtering locally because those backend filters do not exist.
- `getTrending` uses the backend newest-first listing because no trending endpoint exists.
- Reviews return an empty list and review creation explicitly fails with `FORMATION_REVIEWS_UNAVAILABLE`; no mock fallback remains.
- `FormationsPage` displays a backend error state and handles an empty result without fallback.
- `HomePage` uses formations loaded from the API for the competence section.
- `NouvelleOffrePage` checks the populated centre ownership instead of the old mock `centreId`.
- The service test now mocks `apiClient`, not formation mock data.

## Data mismatches

- `city` is not a Formation model field; the UI alias is derived from populated `centre.ville`.
- `domain` maps to backend `category`/`categorie` for display and request compatibility.
- Frontend mock fields `availablePlaces`, `maxPlaces`, `averageRating`, `reviewCount`, `program`, `mode`, and `bookingSessions` do not exist in the backend Formation model and cannot be persisted.
- Frontend mock status `active` is translated to backend `pending` on create/update; backend statuses are English enums.
- Backend IDs are Mongo ObjectId strings; mock IDs are inconsistent strings such as `form1` and `form-1`.
- Backend has no formation review route, so existing review UI cannot be migrated in this phase.
- The centre creation form still contains capacity/program/mode controls; those values are intentionally filtered out before the API request and require a later product/backend contract decision.

## Remaining mock formation usage

`mockFormations` remains in dashboard/admin/search/export/favorites and related legacy presentation code. It was not deleted and is not used by `formationsService`, `FormationsPage`, or the home competence section. Other mock modules were not migrated.

## Verification

- Real backend started from `backend_aout2026` with MongoDB configured.
- `GET http://localhost:5000/api/formations`: `200`, empty `data`, valid pagination.
- Invalid formation ID: `400`.
- Create/update/delete were not executed to avoid modifying the configured database; their route contracts were verified statically.
- Targeted `formationsService.test.js`: passed.
- Production frontend build: passed.

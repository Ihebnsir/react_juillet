import { apiRequest } from "./apiClient";

const statusMap = { PENDING: "en_attente", CONFIRMED: "confirmee", COMPLETED: "terminee", CANCELLED: "annulee" };
const getId = (value) => (value && typeof value === "object" ? value.id || value._id : value);

const normalizeReservation = (reservation) => {
  if (!reservation || typeof reservation !== "object") return reservation;
  const formation = reservation.formationId && typeof reservation.formationId === "object" ? reservation.formationId : null;
  const centre = reservation.centreId && typeof reservation.centreId === "object" ? reservation.centreId : null;
  const learner = reservation.learnerId && typeof reservation.learnerId === "object" ? reservation.learnerId : null;
  const status = statusMap[reservation.status] || reservation.status || "";
  return {
    ...reservation,
    id: reservation.id || reservation._id,
    learnerId: getId(reservation.learnerId),
    formationId: getId(reservation.formationId),
    centreId: getId(reservation.centreId),
    status,
    statut: status,
    titre: formation?.title || reservation.titre || "",
    formationTitle: formation?.title || reservation.formationTitle || "",
    image: formation?.image || reservation.image || "",
    prix: formation?.price ?? reservation.price ?? 0,
    price: formation?.price ?? reservation.price ?? 0,
    duree: formation?.duration || reservation.duree || "",
    centreNom: centre?.name || reservation.centreNom || "",
    centreName: centre?.name || reservation.centreName || "",
    formationCategory: formation?.category || reservation.formationCategory || "",
    learnerName: learner ? `${learner.prenom || ""} ${learner.nom || ""}`.trim() : reservation.learnerName || "",
    dateReservation: reservation.createdAt || reservation.dateReservation || "",
    date: reservation.createdAt || reservation.date || reservation.dateReservation || "",
  };
};

const toQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) query.set(key, String(value));
  });
  return query.toString() ? `?${query}` : "";
};

const normalizeListResponse = (result) => ({
  ...result,
  data: Array.isArray(result?.data) ? result.data.map(normalizeReservation) : [],
});

const updateReservation = async (reservationId, action) => {
  const result = await apiRequest(`/api/reservations/${encodeURIComponent(reservationId)}/${action}`, { method: "PATCH" });
  return normalizeReservation(result?.data);
};

export const reservationsService = {
  getMyReservations: async (params = {}) => normalizeListResponse(await apiRequest(`/api/reservations/me${toQuery(params)}`)),
  getAll: async (params = {}) => normalizeListResponse(await apiRequest(`/api/reservations${toQuery(params)}`)),
  getById: async (reservationId) => normalizeReservation((await apiRequest(`/api/reservations/${encodeURIComponent(reservationId)}`))?.data),
  addReservation: async ({ formationId }) => normalizeReservation((await apiRequest("/api/reservations", { method: "POST", body: JSON.stringify({ formationId }) }))?.data),
  getReservationsParFormation: async (formationId, params = {}) => (await normalizeListResponse(await apiRequest(`/api/reservations/formation/${encodeURIComponent(formationId)}${toQuery(params)}`))).data,
  confirmerReservation: async (reservationId) => updateReservation(reservationId, "confirm"),
  annulerReservation: async (reservationId) => updateReservation(reservationId, "cancel"),
  payerReservation: async (reservationId, paymentMethod = "Carte bancaire") => normalizeReservation((await apiRequest(`/api/reservations/${encodeURIComponent(reservationId)}/pay`, { method: "PATCH", body: JSON.stringify({ paymentMethod }) }))?.data),
  getReservationsParCentre: async () => { throw new Error("CENTRE_RESERVATIONS_USE_FORMATION_ENDPOINT"); },
  getCertificateForReservation: async () => { throw new Error("RESERVATION_CERTIFICATE_ENDPOINT_UNAVAILABLE"); },
  hasActiveReservationsForFormation: async (formationId) => {
    const result = await reservationsService.getReservationsParFormation(formationId);
    return result.some((reservation) => ["en_attente", "confirmee"].includes(reservation.status));
  },
};

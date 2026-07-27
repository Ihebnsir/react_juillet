import { mockReservations } from "../data/mockReservations";
import { mockCertificates } from "../data/mockCertificates";
import { formationsService } from "./formationsService";

const STORAGE_KEY = "skillBridgeReservations";

const normalizeStatus = (status) => {
  if (!status) return "";
  // On accepte quelques variantes, mais on normalise vers snake_case sans accents
  const s = String(status).trim().toLowerCase();

  const map = new Map([
    // français accents
    ["en attente", "en_attente"],
    ["en_attente", "en_attente"],
    ["confirmée", "confirmee"],
    ["confirmee", "confirmee"],
    ["annulée", "annulee"],
    ["annulee", "annulee"],
    ["terminée", "terminee"],
    ["terminee", "terminee"],
    ["remboursée", "remboursee"],
    ["remboursee", "remboursee"],

    // possibles anglais
    ["pending", "en_attente"],
    ["confirmed", "confirmee"],
    ["cancelled", "annulee"],
    ["completed", "terminee"],
    ["refunded", "remboursee"],
  ]);

  return map.get(s) ?? s.replace(/\s+/g, "_").replace(/[àáâãäå]/g, "a")
    .replace(/ç/g, "c")
    .replace(/èéêë/g, "e")
    .replace(/ìíîï/g, "i")
    .replace(/ñ/g, "n")
    .replace(/òóôõö/g, "o")
    .replace(/ùúûü/g, "u")
    .replace(/ýÿ/g, "y")
    .replace(/[^a-z0-9_]/g, "");
};

const loadFromStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

const persist = (next) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};

const hydrateDataset = () => {
  const stored = loadFromStorage();
  const base = stored ?? mockReservations;
  // Normaliser statuts dès l'hydratation
  return (base ?? []).map((r) => ({
    ...r,
    status: normalizeStatus(r.status),
  }));
};

const saveDataset = (dataset) => {
  const normalized = dataset.map((r) => ({
    ...r,
    status: normalizeStatus(r.status),
  }));
  persist(normalized);
  return normalized;
};

const getActiveStatuses = () => new Set(["en_attente", "confirmee"]);

export const reservationsService = {
  getAll: async () => {
    return hydrateDataset();
  },

  getReservationsParFormation: async (formationId) => {
    const all = hydrateDataset();
    return all.filter((r) => r.formationId === formationId);
  },

  getReservationsParCentre: async (centreId) => {
    const all = hydrateDataset();
    // join : formationId -> formation.centreId
    const formations = await formationsService.getMesFormations(centreId);
    const formationIds = new Set(formations.map((f) => f.id));
    return all.filter((r) => formationIds.has(r.formationId));
  },

  confirmerReservation: async (reservationId) => {
    const all = hydrateDataset();
    const active = all.find((r) => r.id === reservationId);
    if (!active) return null;
    const now = new Date().toISOString().split('T')[0];
    const next = all.map((r) => {
      if (r.id !== reservationId) return r;
      const historyEntry = { date: now, action: 'Réservation confirmée', icon: 'confirm' };
      return {
        ...r,
        status: "confirmee",
        history: [...(r.history || []), historyEntry],
      };
    });
    saveDataset(next);
    return next.find((r) => r.id === reservationId) || null;
  },

  annulerReservation: async (reservationId, motif) => {
    const all = hydrateDataset();
    const active = all.find((r) => r.id === reservationId);
    if (!active) return null;
    const now = new Date().toISOString().split('T')[0];
    const next = all.map((r) => {
      if (r.id !== reservationId) return r;
      const historyEntry = { date: now, action: 'Réservation annulée', icon: 'cancel' };
      return {
        ...r,
        status: "annulee",
        cancellationReason: motif,
        history: [...(r.history || []), historyEntry],
      };
    });
    saveDataset(next);
    return next.find((r) => r.id === reservationId) || null;
  },

  payerReservation: async (reservationId) => {
    const all = hydrateDataset();
    const active = all.find((r) => r.id === reservationId);
    if (!active) return null;
    const now = new Date().toISOString().split('T')[0];
    const txnId = `TXN-${Date.now()}`;
    const next = all.map((r) => {
      if (r.id !== reservationId) return r;
      const historyEntries = [
        { date: now, action: 'Paiement effectué', icon: 'payment' },
        { date: now, action: 'Réservation confirmée', icon: 'confirm' },
      ];
      return {
        ...r,
        status: "confirmee",
        paid: true,
        paymentDate: now,
        paymentMethod: 'Carte bancaire',
        transactionId: txnId,
        history: [...(r.history || []), ...historyEntries],
      };
    });
    saveDataset(next);
    return next.find((r) => r.id === reservationId) || null;
  },

  getCertificateForReservation: async (reservationId, userName) => {
    const all = hydrateDataset();
    const reservation = all.find((r) => r.id === reservationId);
    if (!reservation) return null;

    const formations = await formationsService.getAll();
    const formation = formations.find((f) => f.id === reservation.formationId);

    const certificate = mockCertificates.find(
      (c) => c.formation === (formation?.title || reservation.formationId)
    );

    if (!certificate && formation) {
      return {
        id: `cert-${reservationId}`,
        trainee: userName || 'Apprenant',
        formation: formation.title,
        formationCategory: formation.categorie || formation.domain || '',
        centreName: formation.centre?.name || '',
        issuedAt: new Date().toISOString().split('T')[0],
        startDate: formation.startDate || '',
        endDate: formation.endDate || '',
        status: 'Émis',
        downloadUrl: '#',
      };
    }

    return certificate || null;
  },

  // Helper utile pour bloquer la suppression d'une offre
  hasActiveReservationsForFormation: async (formationId) => {
    const all = hydrateDataset();
    const activeStatuses = getActiveStatuses();
    return all.some(
      (r) => r.formationId === formationId && activeStatuses.has(normalizeStatus(r.status))
    );
  },
};


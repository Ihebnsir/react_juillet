import { apiRequest } from './apiClient';

const normalizeCentre = (centre) => {
  if (!centre || typeof centre !== 'object') return null;
  return { ...centre, id: centre.id || centre._id, city: centre.city || centre.ville || '' };
};

const normalizeFormation = (formation) => {
  if (!formation || typeof formation !== 'object') return formation;
  const centre = normalizeCentre(formation.centre);
  return {
    ...formation,
    id: formation.id || formation._id,
    centre,
    city: formation.city || centre?.city || '',
    domain: formation.domain || formation.category || formation.categorie || '',
    availablePlaces: formation.availablePlaces ?? null,
    averageRating: formation.averageRating ?? 0,
    reviewCount: formation.reviewCount ?? 0,
  };
};

const toBackendPayload = (formationData = {}) => {
  const payload = {};
  const allowedFields = ['title', 'description', 'price', 'duration', 'category', 'categorie', 'status', 'offreStage', 'entreprisesPartenaires', 'startDate', 'endDate', 'progress', 'image'];
  allowedFields.forEach((field) => {
    if (formationData[field] !== undefined) payload[field] = formationData[field];
  });
  if (payload.category === undefined && formationData.domain !== undefined) payload.category = formationData.domain;
  if (payload.status === 'active') payload.status = 'pending';
  return payload;
};

const list = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) query.set(key, String(value));
  });
  const result = await apiRequest(`/api/formations${query.toString() ? `?${query}` : ''}`);
  return {
    ...result,
    data: Array.isArray(result?.data) ? result.data.map(normalizeFormation) : [],
  };
};

export const formationsService = {
  getAll: async () => (await list({ page: 1, limit: 100 })).data,

  getById: async (id) => {
    const result = await apiRequest(`/api/formations/${encodeURIComponent(id)}`);
    return normalizeFormation(result?.data);
  },

  search: async (filters = {}) => {
    const result = await list({
      search: filters.keyword,
      category: filters.domain,
      categorie: filters.categorie,
      offreStage: filters.stageOnly ? true : undefined,
    });
    let formations = result.data;
    if (filters.city) formations = formations.filter((formation) => formation.city.toLowerCase() === filters.city.toLowerCase());
    if (filters.priceMin !== undefined && filters.priceMin !== 0) formations = formations.filter((formation) => formation.price >= filters.priceMin);
    if (filters.priceMax !== undefined && filters.priceMax !== Infinity) formations = formations.filter((formation) => formation.price <= filters.priceMax);
    if (filters.sortBy === 'price_low') formations.sort((a, b) => a.price - b.price);
    if (filters.sortBy === 'price_high') formations.sort((a, b) => b.price - a.price);
    return formations;
  },

  // No backend trending endpoint exists; the API's newest-first order is used.
  getTrending: async (limit = 5) => (await formationsService.getAll()).slice(0, limit),

  create: async (formationData) => {
    const result = await apiRequest('/api/formations', { method: 'POST', body: JSON.stringify(toBackendPayload(formationData)) });
    return normalizeFormation(result?.data);
  },

  update: async (id, updates) => {
    const result = await apiRequest(`/api/formations/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(toBackendPayload(updates)) });
    return normalizeFormation(result?.data);
  },

  delete: async (id) => {
    const result = await apiRequest(`/api/formations/${encodeURIComponent(id)}`, { method: 'DELETE' });
    return normalizeFormation(result?.data);
  },

  getCenterFormations: async (centreId) => {
    const formations = await formationsService.getAll();
    return formations.filter((formation) => formation.centre?.id === centreId || formation.centre?.userId === centreId);
  },

  getMesFormations: async (centreId) => formationsService.getCenterFormations(centreId),

  // No formation review routes exist in backend_aout2026.
  getReviews: async () => [],
  addReview: async () => { throw new Error('FORMATION_REVIEWS_UNAVAILABLE'); },
};

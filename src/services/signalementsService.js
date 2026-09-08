import { apiRequest } from './apiClient';

const getData = (result) => result?.data ?? result;

const normalizeSignalement = (item) => {
  if (!item) return item;
  return {
    ...item,
    id: item.id || item._id,
    createdAt: item.createdAt || item.date,
    resolutionNote: item.resolutionNote || item.noteResolution,
  };
};

const normalizeList = (result) => {
  const data = getData(result);
  if (Array.isArray(data)) return { ...result, data: data.map(normalizeSignalement) };
  if (data && Array.isArray(data.items)) return { ...data, items: data.items.map(normalizeSignalement) };
  return { ...result, data: [] };
};

const queryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
  });
  return query.toString() ? `?${query}` : '';
};

export const signalementsService = {
  async create(data) {
    const result = await apiRequest('/api/signalements', { method: 'POST', body: JSON.stringify(data) });
    return normalizeSignalement(getData(result));
  },

  async getMine(params = {}) {
    return normalizeList(await apiRequest(`/api/signalements/mine${queryString(params)}`));
  },

  async getAdminList(params = {}) {
    return normalizeList(await apiRequest(`/api/signalements${queryString(params)}`));
  },

  async getById(id) {
    return normalizeSignalement(getData(await apiRequest(`/api/signalements/${encodeURIComponent(id)}`)));
  },

  async updateStatus(id, data) {
    return normalizeSignalement(getData(await apiRequest(`/api/signalements/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify(data) })));
  },

  async escalate(id, data = {}) {
    return normalizeSignalement(getData(await apiRequest(`/api/signalements/${encodeURIComponent(id)}/escalate`, { method: 'PATCH', body: JSON.stringify(data) })));
  },

  async remove(id) {
    return apiRequest(`/api/signalements/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  async getAdminStats() {
    return getData(await apiRequest('/api/admin/dashboard/signalements-stats'));
  },
};

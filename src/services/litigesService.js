import { apiRequest } from './apiClient';

const getData = (result) => result?.data ?? result;

const normalizeLitige = (item) => {
  if (!item) return item;
  return { ...item, id: item.id || item._id };
};

const normalizeList = (result) => {
  const data = getData(result);
  if (Array.isArray(data)) return { ...result, data: data.map(normalizeLitige) };
  if (data && Array.isArray(data.items)) return { ...data, items: data.items.map(normalizeLitige) };
  return { ...result, data: [] };
};

const queryString = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
  });
  return query.toString() ? `?${query}` : '';
};

const request = (path, options) => apiRequest(path, options).then((result) => normalizeLitige(getData(result)));

export const litigesService = {
  async getAll(params = {}) { return normalizeList(await apiRequest(`/api/litiges${queryString(params)}`)); },
  async getMine(params = {}) { return normalizeList(await apiRequest(`/api/litiges/me${queryString(params)}`)); },
  async getById(id) { return request(`/api/litiges/${encodeURIComponent(id)}`); },
  async updateStatus(id, data) { return request(`/api/litiges/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify(data) }); },
  async assign(id, data) { return request(`/api/litiges/${encodeURIComponent(id)}/assign`, { method: 'PATCH', body: JSON.stringify(data) }); },
  async addMessage(id, data) { return request(`/api/litiges/${encodeURIComponent(id)}/messages`, { method: 'POST', body: JSON.stringify(data) }); },
  async addAttachmentMetadata(id, data) { return request(`/api/litiges/${encodeURIComponent(id)}/pieces-jointes`, { method: 'POST', body: JSON.stringify(data) }); },
  async addNote(id, data) { return request(`/api/litiges/${encodeURIComponent(id)}/notes`, { method: 'POST', body: JSON.stringify(data) }); },
  async close(id, data) { return request(`/api/litiges/${encodeURIComponent(id)}/cloturer`, { method: 'PATCH', body: JSON.stringify(data) }); },
  async archive(id) { return request(`/api/litiges/${encodeURIComponent(id)}/archiver`, { method: 'PATCH' }); },
};

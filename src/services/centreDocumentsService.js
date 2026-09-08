import { apiRequest } from './apiClient';

const normalizeDocument = (item) => item ? { ...item, id: item.id || item._id } : item;
const normalizeList = (result) => ({ ...result, data: Array.isArray(result?.data) ? result.data.map(normalizeDocument) : [] });
const query = (params = {}) => {
  const values = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== '') values.set(key, String(value)); });
  return values.toString() ? `?${values}` : '';
};
const data = (result) => normalizeDocument(result?.data ?? result);

export const centreDocumentsService = {
  async create(payload) { return data(await apiRequest('/api/centre-documents', { method: 'POST', body: JSON.stringify(payload) })); },
  async getMine(params = {}) { return normalizeList(await apiRequest(`/api/centre-documents${query(params)}`)); },
  async getById(id) { return data(await apiRequest(`/api/centre-documents/${encodeURIComponent(id)}`)); },
  async remove(id) { return apiRequest(`/api/centre-documents/${encodeURIComponent(id)}`, { method: 'DELETE' }); },
  async getAdminList(params = {}) { return normalizeList(await apiRequest(`/api/centre-documents/admin${query(params)}`)); },
  async validate(id) { return data(await apiRequest(`/api/centre-documents/${encodeURIComponent(id)}/validate`, { method: 'PATCH' })); },
  async reject(id, commentaireAdmin) { return data(await apiRequest(`/api/centre-documents/${encodeURIComponent(id)}/reject`, { method: 'PATCH', body: JSON.stringify({ commentaireAdmin }) })); },
};

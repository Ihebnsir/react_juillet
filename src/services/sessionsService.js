import { apiRequest } from './apiClient';

const idOf = (value) => (value && typeof value === 'object' ? value.id || value._id : value);
export const normalizeSession = (item = {}) => ({ ...item, id: item.id || item._id, formationId: idOf(item.formation), formationTitle: item.formation?.title || item.formationTitle || '', centreId: idOf(item.centre), date: item.date || '', status: item.status || 'scheduled' });
const unwrapList = (result) => ({ ...result, data: Array.isArray(result?.data) ? result.data.map(normalizeSession) : [] });
const unwrap = (result) => normalizeSession(result?.data || result);
const query = (params = {}) => { const values = new URLSearchParams(); Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== '') values.set(key, String(value)); }); return values.toString() ? `?${values}` : ''; };

export const sessionsService = {
  async list(params = {}) { return unwrapList(await apiRequest(`/api/sessions${query(params)}`)); },
  async getById(id) { return unwrap(await apiRequest(`/api/sessions/${encodeURIComponent(id)}`)); },
  async create(payload) { return unwrap(await apiRequest('/api/sessions', { method: 'POST', body: JSON.stringify(payload) })); },
  async update(id, payload) { return unwrap(await apiRequest(`/api/sessions/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(payload) })); },
  async remove(id) { return apiRequest(`/api/sessions/${encodeURIComponent(id)}`, { method: 'DELETE' }); },
};

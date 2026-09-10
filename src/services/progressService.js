import { apiRequest } from './apiClient';

const idOf = (value) => (value && typeof value === 'object' ? value.id || value._id : value);
export const normalizeProgress = (item = {}) => ({ ...item, id: item.id || item._id, learnerId: idOf(item.learner), learnerName: [item.learner?.prenom, item.learner?.nom].filter(Boolean).join(' ') || item.learner?.email || '', formationId: idOf(item.formation), formationTitle: item.formation?.title || '', reservationId: idOf(item.reservation), reservationStatus: item.reservation?.status || '', percentage: item.percentage ?? null, completedSessions: item.completedSessions ?? null, totalSessions: item.totalSessions ?? null });
const list = (result) => ({ ...result, data: Array.isArray(result?.data) ? result.data.map(normalizeProgress) : [] });
const one = (result) => normalizeProgress(result?.data || result);

export const progressService = {
  async mine() { return list(await apiRequest('/api/progress/me')); },
  async byId(id) { return one(await apiRequest(`/api/progress/${encodeURIComponent(id)}`)); },
  async byFormation(formationId) { return list(await apiRequest(`/api/progress/formation/${encodeURIComponent(formationId)}`)); },
  async create(payload) { return one(await apiRequest('/api/progress', { method: 'POST', body: JSON.stringify(payload) })); },
  async update(id, payload) { return one(await apiRequest(`/api/progress/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(payload) })); },
};

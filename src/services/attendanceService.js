import { apiRequest } from './apiClient';

const idOf = (value) => (value && typeof value === 'object' ? value.id || value._id : value);
export const normalizeAttendance = (item = {}) => ({ ...item, id: item.id || item._id, sessionId: idOf(item.session), sessionTitle: item.session?.title || '', sessionDate: item.session?.date || '', learnerId: idOf(item.learner), learnerName: [item.learner?.prenom, item.learner?.nom].filter(Boolean).join(' ') || item.learner?.email || '', formationId: idOf(item.formation), formationTitle: item.formation?.title || '', status: item.status || '' });
const list = (result) => ({ ...result, data: Array.isArray(result?.data) ? result.data.map(normalizeAttendance) : [] });
const one = (result) => normalizeAttendance(result?.data || result);
const query = (params = {}) => { const values = new URLSearchParams(); Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== '') values.set(key, String(value)); }); return values.toString() ? `?${values}` : ''; };

export const attendanceService = {
  async list(params = {}) { return list(await apiRequest(`/api/attendance${query(params)}`)); },
  async mine(params = {}) { return list(await apiRequest(`/api/attendance/me${query(params)}`)); },
  async bySession(sessionId) { return list(await apiRequest(`/api/attendance/session/${encodeURIComponent(sessionId)}`)); },
  async getById(id) { return one(await apiRequest(`/api/attendance/${encodeURIComponent(id)}`)); },
  async create(payload) { return one(await apiRequest('/api/attendance', { method: 'POST', body: JSON.stringify(payload) })); },
  async update(id, payload) { return one(await apiRequest(`/api/attendance/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(payload) })); },
};

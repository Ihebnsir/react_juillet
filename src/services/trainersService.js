import { apiRequest } from './apiClient';

export const normalizeTrainer = (item = {}) => ({ ...item, id: item.id || item._id, firstName: item.prenom || item.firstName || '', lastName: item.nom || item.lastName || '', name: [item.prenom, item.nom].filter(Boolean).join(' ') || item.name || '', phone: item.telephone || item.phone || '', speciality: item.specialite || item.speciality || '', status: item.status === 'active' ? 'Actif' : item.status === 'inactive' ? 'Inactif' : item.status || '', assignedCourses: Array.isArray(item.assignedCourses) ? item.assignedCourses : [] });
const one = (result) => normalizeTrainer(result?.data || result);
const list = (result) => ({ ...result, data: Array.isArray(result?.data) ? result.data.map(normalizeTrainer) : [] });

export const trainersService = {
  async list() { return list(await apiRequest('/api/centres/me/trainers')); },
  async getById(id) { return one(await apiRequest(`/api/centres/me/trainers/${encodeURIComponent(id)}`)); },
  async create(payload) { return one(await apiRequest('/api/centres/me/trainers', { method: 'POST', body: JSON.stringify(payload) })); },
  async update(id, payload) { return one(await apiRequest(`/api/centres/me/trainers/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(payload) })); },
  async updateStatus(id, status) { return one(await apiRequest(`/api/centres/me/trainers/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })); },
  async remove(id) { return apiRequest(`/api/centres/me/trainers/${encodeURIComponent(id)}`, { method: 'DELETE' }); },
};

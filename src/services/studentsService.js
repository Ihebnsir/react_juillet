import { apiRequest } from './apiClient';

const query = (params = {}) => { const values = new URLSearchParams(); Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== '') values.set(key, String(value)); }); return values.toString() ? `?${values}` : ''; };

export const normalizeStudent = (item = {}) => ({ ...item, id: item.learner?.id || item.learner?._id || item.id || item._id, learnerId: item.learner?.id || item.learner?._id, name: [item.learner?.prenom, item.learner?.nom].filter(Boolean).join(' ') || item.learner?.email || '', email: item.learner?.email || '', formationId: item.formation?.id || item.formation?._id, formationTitle: item.formation?.title || '', reservationStatus: item.reservationStatus || '', paid: item.paid ?? null, progress: item.progress ? { ...item.progress, id: item.progress.id || item.progress._id } : null, attendance: item.attendance || null });

export const studentsService = {
  async list(params = {}) {
    const result = await apiRequest(`/api/centres/me/students${query(params)}`);
    return { ...result, data: Array.isArray(result?.data) ? result.data.map(normalizeStudent) : [] };
  },
};

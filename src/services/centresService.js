import { apiRequest } from './apiClient';

const normalizeCentre = (centre = {}) => ({
  ...centre,
  id: centre.id || centre._id,
  userId: centre.userId?.id || centre.userId?._id || centre.userId || null,
  name: centre.name || '',
  email: centre.email || '',
  telephone: centre.telephone || centre.phone || '',
  ville: centre.ville || centre.city || '',
  profileCompletion: centre.profileCompletion ?? centre.progressionProfil ?? null,
});

export const centresService = {
  async getMyCentre() {
    const result = await apiRequest('/api/centres/me');
    return normalizeCentre(result?.data);
  },
  async getById(id) {
    const result = await apiRequest(`/api/centres/${encodeURIComponent(id)}`);
    return normalizeCentre(result?.data);
  },
  async getAll(params = {}) {
    const query = new URLSearchParams({ page: 1, limit: 100, ...params });
    const result = await apiRequest(`/api/centres?${query}`);
    return { ...result, data: Array.isArray(result?.data) ? result.data.map(normalizeCentre) : [] };
  },
  async verify(id) {
    const result = await apiRequest(`/api/centres/${encodeURIComponent(id)}/verify`, { method: 'PATCH' });
    return normalizeCentre(result?.data);
  },
  async reject(id, motifRejet) {
    const result = await apiRequest(`/api/centres/${encodeURIComponent(id)}/reject`, { method: 'PATCH', body: JSON.stringify({ motifRejet }) });
    return normalizeCentre(result?.data);
  },
  async suspend(id) {
    const result = await apiRequest(`/api/centres/${encodeURIComponent(id)}/suspend`, { method: 'PATCH' });
    return normalizeCentre(result?.data);
  },
};

export { normalizeCentre };

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
};

export { normalizeCentre };

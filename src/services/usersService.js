import { apiRequest } from './apiClient';

const statusMap = { active: 'actif', inactive: 'desactive', suspended: 'suspendu', banned: 'suspendu' };
const toBackendStatus = { actif: 'active', suspendu: 'suspended', desactive: 'inactive' };
const normalizeUserStatus = (status) => statusMap[status] || status || 'desactive';

const normalizeUser = (user = {}) => ({
  ...user,
  id: user.id || user._id,
  nom: [user.prenom, user.nom].filter(Boolean).join(' ') || user.email || 'Utilisateur',
  email: user.email || '',
  telephone: user.telephone || '',
  ville: user.ville || '',
  statut: normalizeUserStatus(user.status),
  workflow: normalizeUserStatus(user.status),
  emailVerifie: Boolean(user.emailVerified),
  profilVerifie: Boolean(user.profileVerified),
  profilComplete: null,
  dateInscription: user.createdAt || null,
  derniereConnexion: user.lastLoginAt || null,
  formations: [],
  historique: [],
  activiteRecente: [],
  notesInternes: [],
});

export const usersService = {
  async getAll(params = {}) {
    const query = new URLSearchParams({ page: 1, limit: 100, ...params });
    const result = await apiRequest(`/api/users?${query}`);
    return { ...result, data: Array.isArray(result?.data) ? result.data.map(normalizeUser) : [] };
  },
  async getById(id) {
    const result = await apiRequest(`/api/users/${encodeURIComponent(id)}`);
    return normalizeUser(result?.data);
  },
  async update(id, updates) {
    const payload = {};
    ['nom', 'prenom', 'email', 'telephone', 'ville'].forEach((field) => {
      if (updates[field] !== undefined) payload[field] = updates[field];
    });
    if (updates.statut && toBackendStatus[updates.statut]) payload.status = toBackendStatus[updates.statut];
    const result = await apiRequest(`/api/users/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) });
    return normalizeUser(result?.data);
  },
  async remove(id) {
    const result = await apiRequest(`/api/users/${encodeURIComponent(id)}`, { method: 'DELETE' });
    return normalizeUser(result?.data);
  },
};

export { normalizeUser, normalizeUserStatus };

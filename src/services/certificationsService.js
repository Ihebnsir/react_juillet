import { apiRequest } from './apiClient';

const getId = (value) => (value && typeof value === 'object' ? value.id || value._id : value);

const normalizeCertification = (item = {}) => ({
  ...item,
  id: item.id || item._id,
  certificateNumber: item.numeroCertificat || item.certificateNumber || '',
  formation: item.formation?.title || item.formationTitle || '',
  centre: item.centre?.name || item.centreName || '',
  date: item.dateObtention || item.issueDate || item.createdAt || '',
  status: item.status || '',
  formationId: getId(item.formation),
  centreId: getId(item.centre),
});

export const certificationsService = {
  async getMine(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
    });
    const result = await apiRequest(`/api/certifications${query.toString() ? `?${query}` : ''}`);
    return {
      ...result,
      data: Array.isArray(result?.data) ? result.data.map(normalizeCertification) : [],
    };
  },
  async verify(certificateNumber) {
    const result = await apiRequest(`/api/certifications/verify/${encodeURIComponent(certificateNumber)}`);
    return normalizeCertification(result?.data);
  },
  async getById(id) {
    const result = await apiRequest(`/api/certifications/${encodeURIComponent(id)}`);
    return normalizeCertification(result?.data);
  },
  async create(payload) {
    const result = await apiRequest('/api/certifications', { method: 'POST', body: JSON.stringify(payload) });
    return normalizeCertification(result?.data);
  },
  async revoke(id) {
    const result = await apiRequest(`/api/certifications/${encodeURIComponent(id)}/revoke`, { method: 'PATCH' });
    return normalizeCertification(result?.data);
  },
};

export { normalizeCertification };

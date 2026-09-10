import { apiRequest } from './apiClient';

const get = (path, params = {}) => { const values = new URLSearchParams(); Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== '') values.set(key, String(value)); }); return apiRequest(`${path}${values.toString() ? `?${values}` : ''}`).then((result) => result?.data ?? result); };

export const analyticsService = {
  centreOverview: (params) => get('/api/centres/me/analytics/overview', params),
  centreReservations: (params) => get('/api/centres/me/analytics/reservations', params),
  centreRevenue: (params) => get('/api/centres/me/analytics/revenue', params),
  centreFormations: (params) => get('/api/centres/me/analytics/formations', params),
  adminOverview: (params) => get('/api/admin/analytics/overview', params),
  adminGrowth: (params) => get('/api/admin/analytics/growth', params),
  adminRevenue: (params) => get('/api/admin/analytics/revenue', params),
  adminFormations: (params) => get('/api/admin/analytics/formations', params),
  adminCentres: (params) => get('/api/admin/analytics/centres', params),
};

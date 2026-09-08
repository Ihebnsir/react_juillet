import { apiRequest } from './apiClient';

const getData = (result) => result?.data ?? result;

const get = (path) => apiRequest(path).then(getData);

export const adminDashboardService = {
  getOverview: () => get('/api/admin/dashboard/overview'),
  getGrowth: (params = {}) => {
    const query = new URLSearchParams({ period: 'month', months: '6', ...params });
    return get(`/api/admin/dashboard/growth?${query}`);
  },
  getRevenue: (params = {}) => {
    const query = new URLSearchParams({ period: 'month', months: '6', ...params });
    return get(`/api/admin/dashboard/revenue?${query}`);
  },
  getRepartitionReservations: () => get('/api/admin/dashboard/repartition/reservations'),
  getRepartitionFormations: () => get('/api/admin/dashboard/repartition/formations'),
  getRepartitionCentres: () => get('/api/admin/dashboard/repartition/centres'),
  getTopCentres: () => get('/api/admin/dashboard/top/centres?limit=5'),
  getTopFormations: () => get('/api/admin/dashboard/top/formations?limit=5'),
  getRecentActivity: () => get('/api/admin/dashboard/activite-recente?limit=20'),
  getLitigesStats: () => get('/api/admin/dashboard/litiges-stats'),
  getSignalementsStats: () => get('/api/admin/dashboard/signalements-stats'),
};

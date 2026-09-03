import { apiRequest } from './apiClient';

const normalizeNotification = (notification) => ({
  ...notification,
  id: notification.id || notification._id,
  title: notification.title || 'Notification',
  message: notification.message || '',
  category: notification.category || 'system',
  kind: notification.kind || notification.category || 'system',
  lu: Boolean(notification.lu),
  createdAt: notification.createdAt || notification.date,
});

export const notificationsService = {
  async getAll(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
    });
    const result = await apiRequest(`/api/notifications${query.toString() ? `?${query}` : ''}`);
    return {
      ...result,
      data: Array.isArray(result?.data) ? result.data.map(normalizeNotification) : [],
    };
  },

  async getUnreadCount() {
    const result = await apiRequest('/api/notifications/unread-count');
    return Number(result?.data?.count || 0);
  },

  async markAsRead(id) {
    const result = await apiRequest(`/api/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH' });
    return normalizeNotification(result?.data);
  },

  async markAllAsRead() {
    const result = await apiRequest('/api/notifications/read-all', { method: 'PATCH' });
    return result?.data;
  },

  async delete(id) {
    return apiRequest(`/api/notifications/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
};
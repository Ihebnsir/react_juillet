import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { notificationsService } from '../services/notificationsService';

const NotificationContext = createContext(null);
const normalizeNotification = (item) => ({
  ...item,
  id: item.id || item._id,
  title: item.title || item.texte || 'Notification',
  message: item.message || item.texte || '',
  category: item.category || 'system',
  kind: item.kind || item.category || 'system',
  lu: Boolean(item.lu),
  createdAt: item.createdAt || item.date,
});

const NotificationProviderInner = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [listResult, count] = await Promise.all([
        notificationsService.getAll({ page: 1, limit: 100 }),
        notificationsService.getUnreadCount(),
      ]);
      setNotifications(listResult.data.map(normalizeNotification));
      setUnreadCount(count);
    } catch (requestError) {
      setNotifications([]);
      setUnreadCount(0);
      setError(requestError);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const markAsRead = useCallback(async (id) => {
    try {
      const current = notifications.find((item) => item.id === id);
      const updated = await notificationsService.markAsRead(id);
      setNotifications((previous) => previous.map((item) => item.id === id ? updated : item));
      if (current && !current.lu) setUnreadCount((count) => Math.max(0, count - 1));
    } catch (requestError) {
      setError(requestError);
    }
  }, [notifications]);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications((previous) => previous.map((item) => ({ ...item, lu: true })));
      setUnreadCount(0);
    } catch (requestError) {
      setError(requestError);
    }
  }, []);

  const deleteNotification = useCallback(async (id) => {
    try {
      const current = notifications.find((item) => item.id === id);
      await notificationsService.delete(id);
      setNotifications((previous) => previous.filter((item) => item.id !== id));
      if (current && !current.lu) setUnreadCount((count) => Math.max(0, count - 1));
    } catch (requestError) {
      setError(requestError);
    }
  }, [notifications]);

  const addNotification = useCallback(() => null, []);

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    loading,
    error,
    refresh,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }), [notifications, unreadCount, loading, error, refresh, markAsRead, markAllAsRead, deleteNotification, addNotification]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const NotificationProvider = ({ children }) => <NotificationProviderInner>{children}</NotificationProviderInner>;

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications doit être utilisé avec NotificationProvider');
  return ctx;
};

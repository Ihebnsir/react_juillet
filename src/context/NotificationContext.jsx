import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { mockNotifications } from '../data/mockNotifications';

const NotificationContext = createContext(null);
const STORAGE_KEY = 'skillbridge_notifications';

const normalizeNotification = (item) => ({
  id: item.id || `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  userId: item.userId ?? 1,
  title: item.title || item.texte || 'Notification',
  message: item.message || item.texte || '',
  category: item.category || 'system',
  kind: item.kind || 'system',
  lu: Boolean(item.lu),
  createdAt: item.createdAt || item.date || new Date().toISOString(),
});

const readStoredNotifications = () => {
  if (typeof window === 'undefined') return mockNotifications.map(normalizeNotification);
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return mockNotifications.map(normalizeNotification);
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed.map(normalizeNotification) : mockNotifications.map(normalizeNotification);
  } catch {
    return mockNotifications.map(normalizeNotification);
  }
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(readStoredNotifications);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }
  }, [notifications]);

  const addNotification = (payload) => {
    const next = normalizeNotification({
      ...payload,
      id: payload.id || `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: payload.createdAt || new Date().toISOString(),
    });
    setNotifications((prev) => [next, ...prev]);
    return next;
  };

  const markAsRead = (notificationId) => {
    setNotifications((prev) => prev.map((item) => item.id === notificationId ? { ...item, lu: true } : item));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, lu: true })));
  };

  const deleteNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((item) => item.id !== notificationId));
  };

  const value = useMemo(() => ({
    notifications,
    unreadCount: notifications.filter((item) => !item.lu).length,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }), [notifications]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications doit être utilisé avec NotificationProvider');
  }
  return context;
};

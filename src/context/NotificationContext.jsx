import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { mockNotifications } from '../data/mockNotifications';

const NotificationContext = createContext(null);
const STORAGE_KEY = 'skillbridge_notifications';

const normalizeNotification = (item) => ({
  id: item.id || `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  role: item.role || 'system',
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

/**
 * Filtre les notifications selon le rôle de l'utilisateur.
 *
 * Règles :
 * - admin     → notifications dont role === 'admin' (boîte partagée)
 * - centre    → notifications dont role === 'centre' ET userId === user.id
 * - apprenant → notifications dont role === 'apprenant' ET userId === user.id
 */
const filterByRole = (notifications, user) => {
  if (!user) return [];
  const { role, id } = user;
  if (role === 'admin') return notifications.filter((n) => n.role === 'admin');
  if (role === 'centre') return notifications.filter((n) => n.role === 'centre' && n.userId === id);
  if (role === 'apprenant' || role === 'learner') return notifications.filter((n) => n.role === 'apprenant' && n.userId === id);
  return [];
};

const NotificationProviderInner = ({ children }) => {
  const { user } = useAuth();
  const [all, setAll] = useState(readStoredNotifications);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }
  }, [all]);

  const notifications = useMemo(() => filterByRole(all, user), [all, user]);
  const unreadCount = useMemo(() => notifications.filter((n) => !n.lu).length, [notifications]);

  const addNotification = (payload) => {
    const next = normalizeNotification({
      ...payload,
      id: payload.id || `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: payload.createdAt || new Date().toISOString(),
    });
    setAll((prev) => [next, ...prev]);
    return next;
  };

  const markAsRead = (id) => setAll((prev) => prev.map((n) => n.id === id ? { ...n, lu: true } : n));
  const markAllAsRead = () => setAll((prev) => prev.map((n) => ({ ...n, lu: true })));
  const deleteNotification = (id) => setAll((prev) => prev.filter((n) => n.id !== id));

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }), [notifications, unreadCount]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const NotificationProvider = ({ children }) => <NotificationProviderInner>{children}</NotificationProviderInner>;

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications doit être utilisé avec NotificationProvider');
  return ctx;
};

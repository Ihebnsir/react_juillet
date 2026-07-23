import React, { useMemo, useState } from 'react';
import { FiBell, FiTrash2, FiCheck, FiFilter, FiX } from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';

const categoryOptions = [
  { value: 'all', label: 'Toutes' },
  { value: 'unread', label: 'Non lues' },
  { value: 'system', label: 'Système' },
  { value: 'formations', label: 'Formations' },
  { value: 'users', label: 'Utilisateurs' },
];

const formatTimestamp = (value) => new Date(value).toLocaleString('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, unreadCount } = useNotifications();
  const [filter, setFilter] = useState('all');

  const visibleNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (filter === 'all') return true;
      if (filter === 'unread') return !item.lu;
      if (filter === 'system') return item.category === 'system' || item.kind === 'system';
      if (filter === 'formations') return item.category === 'formations' || item.kind === 'formations';
      if (filter === 'users') return item.category === 'users' || item.kind === 'users';
      return true;
    });
  }, [filter, notifications]);

  return (
    <div className="space-y-6 rounded-[28px] bg-white p-5 shadow-sm dark:bg-slate-800">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Notifications</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Centre d’activité et alertes métier de la plateforme.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={markAllAsRead} className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">Tout marquer comme lu</button>
          <span className="rounded-full bg-brand-500/10 px-3 py-2 text-sm font-medium text-brand-700 dark:text-brand-300">{unreadCount} non lues</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <FiFilter className="mt-2 text-slate-400" />
        {categoryOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={`rounded-full px-3 py-1.5 text-sm ${filter === option.value ? 'bg-brand-600 text-white' : 'border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visibleNotifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">Aucune notification pour ce filtre.</div>
        ) : (
          visibleNotifications.map((notification) => (
            <div key={notification.id} className={`rounded-2xl border p-4 transition ${notification.lu ? 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/50' : 'border-brand-200 bg-brand-50/70 dark:border-brand-800 dark:bg-brand-900/10'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                    <FiBell size={16} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{notification.title}</h3>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-600 dark:bg-slate-700 dark:text-slate-300">{notification.category || notification.kind}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{notification.message}</p>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{formatTimestamp(notification.createdAt)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!notification.lu ? (
                    <button type="button" onClick={() => markAsRead(notification.id)} className="rounded-lg border border-emerald-200 p-2 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900/20"><FiCheck size={16} /></button>
                  ) : null}
                  <button type="button" onClick={() => deleteNotification(notification.id)} className="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/20"><FiTrash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;

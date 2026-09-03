import React, { useMemo, useState } from 'react';
import { FiBell, FiCheckCircle, FiFilter, FiTrash2 } from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';

const filters = [
  { value: 'all', label: 'Toutes' },
  { value: 'unread', label: 'Non lues' },
  { value: 'system', label: 'Système' },
  { value: 'formations', label: 'Formations' },
  { value: 'users', label: 'Utilisateurs' },
];

export const AdminNotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, unreadCount, loading, error } = useNotifications();
  const [filter, setFilter] = useState('all');

  const visibleNotifications = useMemo(() => {
    if (filter === 'unread') return notifications.filter((item) => !item.lu);
    if (filter === 'all') return notifications;
    return notifications.filter((item) => item.category === filter || item.kind === filter);
  }, [filter, notifications]);

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">Centre de notifications</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Notifications admin</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Surveillez les événements critiques, les validations en attente et les alertes de plateforme.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={markAllAsRead} className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-700">Tout marquer comme lu</button>
          <div className="rounded-full bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700 dark:bg-brand-900/20 dark:text-brand-300">{unreadCount} non lues</div>
        </div>
      </div>

      {loading ? <div className="text-sm text-slate-500 dark:text-slate-400">Chargement des notifications...</div> : null}
      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">Impossible de charger les notifications. Vérifiez votre session et réessayez.</div> : null}

      <div className="flex flex-wrap items-center gap-2">
        <FiFilter className="text-slate-400" />
        {filters.map((item) => (
          <button key={item.value} type="button" onClick={() => setFilter(item.value)} className={`rounded-full px-3 py-1.5 text-sm ${filter === item.value ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'}`}>
            {item.label}
          </button>
        ))}
      </div>

      {visibleNotifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Aucune notification ne correspond à ce filtre.
        </div>
      ) : (
        <div className="space-y-3">
          {visibleNotifications.map((notification) => (
            <div key={notification.id} className={`rounded-2xl border p-4 ${notification.lu ? 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/40' : 'border-brand-200 bg-brand-50/70 dark:border-brand-700 dark:bg-brand-900/10'}`}>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-3">
                  <div className="rounded-2xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                    <FiBell size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{notification.title}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{notification.message}</p>
                    <p className="mt-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{notification.category || notification.kind}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!notification.lu ? (
                    <button type="button" onClick={() => markAsRead(notification.id)} className="rounded-lg border border-emerald-200 p-2 text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900/20"><FiCheckCircle size={16} /></button>
                  ) : null}
                  <button type="button" onClick={() => deleteNotification(notification.id)} className="rounded-lg border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/20"><FiTrash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotificationsPage;

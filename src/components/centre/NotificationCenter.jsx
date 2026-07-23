import React from 'react';
import { FiBell, FiCheck } from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';
import { motion } from 'framer-motion';

const formatRelativeDate = (dateValue) => {
  const date = new Date(dateValue);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  return `${diffDays} jours`;
};

export const NotificationCenter = () => {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const visibleNotifications = notifications.slice(0, 5);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100">Notifications</h4>
        {unreadCount > 0 ? (
          <button
            type="button"
            onClick={markAllAsRead}
            className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
          >
            Marquer tout lu
          </button>
        ) : (
          <span className="text-sm text-slate-400">À jour</span>
        )}
      </div>
      <div className="mt-3 space-y-2">
        {visibleNotifications.length === 0 ? (
          <div className="py-4 text-center text-sm text-slate-500">
            Aucune notification pour le moment.
          </div>
        ) : (
          visibleNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className={`flex items-start gap-3 rounded-xl p-3 transition-all duration-200 ${
                !notification.lu
                  ? 'bg-brand-50/70 dark:bg-brand-900/10 border border-brand-200/50 dark:border-brand-800/30'
                  : 'bg-slate-50/50 dark:bg-slate-700/30 border border-transparent'
              }`}
            >
              <div className={`rounded-full p-2 text-white shrink-0 ${
                !notification.lu ? 'bg-brand-500' : 'bg-slate-400 dark:bg-slate-500'
              }`}>
                <FiBell size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`text-sm truncate ${
                      !notification.lu
                        ? 'font-medium text-slate-900 dark:text-slate-100'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}>
                      {notification.title || notification.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatRelativeDate(notification.createdAt || notification.date)}
                    </p>
                  </div>
                  {!notification.lu && (
                    <button
                      type="button"
                      onClick={() => markAsRead(notification.id)}
                      className="shrink-0 rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20 transition-colors"
                      title="Marquer comme lu"
                    >
                      <FiCheck size={14} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
        {notifications.length > 5 && (
          <p className="text-center text-xs text-slate-400 pt-1">
            +{notifications.length - 5} autres notifications
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;

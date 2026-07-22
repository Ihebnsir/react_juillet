import React from 'react';
import { FiBell } from 'react-icons/fi';

export const NotificationCenter = ({ notifications = [] }) => (
  <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800">
    <div className="flex items-center justify-between">
      <h4 className="font-semibold text-slate-900 dark:text-slate-100">Notifications</h4>
      <button title="Fonction disponible prochainement" disabled className="text-sm text-slate-500 cursor-not-allowed opacity-60">Marquer tout lu</button>
    </div>
    <div className="mt-3 space-y-3">
      {notifications.length === 0 ? (
        <div className="text-sm text-slate-500">Aucune notification</div>
      ) : (
        notifications.map((n) => (
          <div key={n.id} className={`flex items-start gap-3 rounded-lg p-3 ${n.unread ? 'bg-slate-50 dark:bg-slate-700' : ''}`}>
            <div className="rounded-full bg-brand-500 p-2 text-white"><FiBell /></div>
            <div>
              <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{n.title}</div>
              <div className="text-xs text-slate-500">{n.time}</div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default NotificationCenter;

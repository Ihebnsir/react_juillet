import React, { useMemo } from 'react';
import { FiActivity, FiClock, FiUser } from 'react-icons/fi';

const auditEntries = [
  { id: 1, user: 'Admin', action: 'A validé un centre', date: '2026-07-28', time: '09:15', category: 'Centres' },
  { id: 2, user: 'Admin', action: 'A supprimé une formation', date: '2026-07-27', time: '18:40', category: 'Formations' },
  { id: 3, user: 'Centre ABC', action: 'A été validé', date: '2026-07-27', time: '16:20', category: 'Centres' },
  { id: 4, user: 'Admin', action: 'A modéré un signalement', date: '2026-07-26', time: '12:00', category: 'Modération' },
];

export const ActivityLogPage = () => {
  const groupedEntries = useMemo(() => auditEntries, []);

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">Audit log</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Historique des actions admin</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Suivez les opérations critiques de la plateforme pour garder une trace claire des décisions.</p>
      </div>

      <div className="space-y-3">
        {groupedEntries.map((entry) => (
          <div key={entry.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between dark:border-slate-700">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                <FiActivity size={16} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{entry.action}</p>
                <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <FiUser size={14} />
                  <span>{entry.user}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide dark:bg-slate-700 dark:text-slate-300">{entry.category}</span>
              <span className="inline-flex items-center gap-2">
                <FiClock size={14} /> {entry.date} • {entry.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLogPage;

import React, { useMemo, useState } from 'react';
import { FiSearch, FiFilter, FiClock } from 'react-icons/fi';
import { useActivityLog } from '../../context/ActivityContext';

const formatTimestamp = (value) => new Date(value).toLocaleString('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const ActivityHistoryPage = () => {
  const { activities } = useActivityLog();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');

  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      const haystack = [item.user, item.action, item.details, item.type].join(' ').toLowerCase();
      const matchQuery = haystack.includes(query.toLowerCase());
      const matchType = type === 'all' || item.type === type;
      return matchQuery && matchType;
    });
  }, [activities, query, type]);

  return (
    <div className="space-y-6 rounded-[28px] bg-white p-5 shadow-sm dark:bg-slate-800">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Historique des actions</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Suivi complet des activités métier de la plateforme.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-3 top-3 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une action" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
        </div>
        <div className="relative">
          <FiFilter className="pointer-events-none absolute left-3 top-3 text-slate-400" />
          <select value={type} onChange={(event) => setType(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm dark:border-slate-700 dark:bg-slate-900">
            <option value="all">Tous types</option>
            <option value="formation">Formation</option>
            <option value="users">Utilisateurs</option>
            <option value="certificate">Certificat</option>
            <option value="system">Système</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {filteredActivities.length === 0
            ? 'Aucune activité trouvée'
            : `${filteredActivities.length} activité${filteredActivities.length > 1 ? 's' : ''} trouvée${filteredActivities.length > 1 ? 's' : ''}`
          }
        </p>
        {filteredActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
            <FiClock size={36} className="mb-3 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Aucune activité trouvée</p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Essayez de modifier vos filtres ou vos termes de recherche.</p>
          </div>
        ) : (
          <div className="relative border-l border-slate-200 pl-5 dark:border-slate-700">
            {filteredActivities.map((item) => (
              <div key={item.id} className="relative mb-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/50">
                <div className="absolute -left-[1.22rem] top-4 h-3 w-3 rounded-full bg-brand-500" />
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.user}</span>
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-700 dark:bg-slate-700 dark:text-slate-200">{item.type}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{item.action}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.details}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <FiClock size={14} /> {formatTimestamp(item.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityHistoryPage;

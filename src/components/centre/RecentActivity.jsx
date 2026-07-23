import React from 'react';

const ActivityItem = ({ icon: Icon, title, time, tone }) => (
  <div className="flex items-start gap-3">
    <div className={`mt-1 rounded-lg p-2 text-white ${tone || 'bg-slate-400'}`}><Icon /></div>
    <div>
      <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{title}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{time}</div>
    </div>
  </div>
);

export const RecentActivity = ({ items = [] }) => (
  <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800">
    <h4 className="font-semibold text-slate-900 dark:text-slate-100">Activité récente</h4>
    <div className="mt-3 space-y-3">
      {items.length === 0 ? (
        <div className="text-sm text-slate-500 dark:text-slate-400">Aucune activité récente.</div>
      ) : (
        items.map((it) => (<ActivityItem key={it.id} icon={it.icon} title={it.title} time={it.time} tone={it.tone} />))
      )}
    </div>
  </div>
);

export default RecentActivity;

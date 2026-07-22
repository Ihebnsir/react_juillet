import React from 'react';

export const ProfileProgress = ({ percent = 56, tasks = [] }) => (
  <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800">
    <h4 className="font-semibold text-slate-900 dark:text-slate-100">Complétion du profil</h4>
    <div className="mt-4 flex items-center gap-4">
      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white text-2xl font-bold">{percent}%</div>
      <div className="flex-1">
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div style={{ width: `${percent}%` }} className="h-full bg-gradient-to-r from-brand-600 to-brand-500" />
        </div>
        <ul className="mt-3 text-sm text-slate-600 dark:text-slate-300 space-y-2">
          {tasks.map(t => (
            <li key={t.id} className="flex items-center gap-2">
              <input type="checkbox" checked={t.done} readOnly />
              <span className={t.done ? 'line-through text-slate-400' : ''}>{t.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default ProfileProgress;

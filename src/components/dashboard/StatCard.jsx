import React from 'react';

export const StatCard = ({ icon: Icon, value, label, variation, tone = 'teal' }) => {
  const toneClasses = {
    teal: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-200',
    green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
    orange: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200',
    red: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200',
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-slate-100">{value}</p>
        </div>
        <div className={`rounded-lg p-3 ${toneClasses[tone]}`}>
          <Icon size={20} />
        </div>
      </div>
      {variation ? <p className="mt-3 text-sm text-gray-500 dark:text-slate-400">{variation}</p> : null}
    </div>
  );
};

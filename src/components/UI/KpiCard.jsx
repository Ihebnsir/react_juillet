import React from 'react';

export const KpiCard = ({ label, value, delta, icon: Icon, tone = 'brand' }) => {
  const toneClasses = {
    brand: 'text-brand-500 bg-brand-100/70 border-brand-200',
    sky: 'text-sky-500 bg-sky-100/70 border-sky-200',
    emerald: 'text-emerald-500 bg-emerald-100/70 border-emerald-200',
    amber: 'text-amber-500 bg-amber-100/70 border-amber-200',
    rose: 'text-rose-500 bg-rose-100/70 border-rose-200',
    slate: 'text-slate-700 bg-slate-100/70 border-slate-200',
  };

  return (
    <div className={`rounded-3xl border p-6 shadow-sm transition hover:shadow-xl ${toneClasses[tone] || toneClasses.brand}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600 dark:text-slate-300">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
        {Icon ? <Icon className="h-8 w-8 text-current opacity-80" /> : null}
      </div>
      {delta ? <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{delta}</p> : null}
    </div>
  );
};

export default KpiCard;

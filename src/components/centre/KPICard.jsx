import React from 'react';

export const KPICard = ({ icon: Icon, title, value, subtitle, trend }) => {
  return (
    <div className="rounded-3xl bg-white/80 p-4 shadow-sm transition hover:shadow-md dark:bg-slate-800">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-brand-500/15 to-brand-500/5 p-3 text-xl text-slate-800 dark:text-slate-100">
            <Icon />
          </div>
          <div>
            <div className="text-sm text-slate-500 dark:text-slate-300">{title}</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</div>
            {subtitle && <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</div>}
            {trend ? <div className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-300">{trend}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPICard;

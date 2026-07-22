import React from 'react';

export const KPICard = ({ icon: Icon, title, value, subtitle }) => {
  return (
    <div className="rounded-2xl bg-white/70 dark:bg-slate-800 p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-white/60 to-white/40 p-3 text-xl text-slate-800 dark:text-slate-100">
            <Icon />
          </div>
          <div>
            <div className="text-sm text-slate-500 dark:text-slate-300">{title}</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</div>
            {subtitle && <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPICard;

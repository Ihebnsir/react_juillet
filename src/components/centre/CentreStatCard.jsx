import React from 'react';

const CentreStatCard = ({ icon: Icon, title, value, trend, tone = 'slate' }) => {
  const toneMap = {
    emerald: 'from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-300',
    sky: 'from-sky-500/15 to-sky-500/5 text-sky-600 dark:text-sky-300',
    amber: 'from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-300',
    slate: 'from-slate-500/15 to-slate-500/5 text-slate-600 dark:text-slate-300',
  };

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm transition hover:shadow-md dark:bg-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
          {trend ? <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-300">{trend}</p> : null}
        </div>
        <div className={`rounded-2xl bg-gradient-to-br p-3 ${toneMap[tone] || toneMap.slate}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

export default CentreStatCard;

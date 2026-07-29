import React from 'react';

const statusClasses = {
  stable: 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20',
  pending: 'bg-sky-500/10 text-sky-200 border border-sky-500/20',
  warning: 'bg-amber-500/10 text-amber-200 border border-amber-500/20',
  critical: 'bg-rose-500/10 text-rose-200 border border-rose-500/20',
  archived: 'bg-slate-700/80 text-slate-100 border border-slate-600',
};

export const StatusChip = ({ label, tone = 'stable', className = '' }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusClasses[tone] || statusClasses.stable} ${className}`}>
    {label}
  </span>
);

export default StatusChip;

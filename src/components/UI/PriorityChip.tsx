import React from 'react';

const priorityClasses = {
  low: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
  medium: 'bg-amber-500/10 text-amber-200 border border-amber-500/20',
  high: 'bg-rose-500/10 text-rose-200 border border-rose-500/20',
  critical: 'bg-rose-600/10 text-rose-100 border border-rose-500/20',
};

export const PriorityChip = ({ label, tone = 'medium', className = '' }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${priorityClasses[tone] || priorityClasses.medium} ${className}`}>
    {label}
  </span>
);

export default PriorityChip;

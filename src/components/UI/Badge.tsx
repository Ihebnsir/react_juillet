import React from 'react';

const toneClasses = {
  brand: 'bg-brand-500/10 text-brand-600 border border-brand-200',
  success: 'bg-emerald-500/10 text-emerald-600 border border-emerald-200',
  warning: 'bg-amber-500/10 text-amber-600 border border-amber-200',
  danger: 'bg-rose-500/10 text-rose-600 border border-rose-200',
  slate: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
};

export const Badge = ({ label, tone = 'brand', className = '' }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${toneClasses[tone] || toneClasses.brand} ${className}`}>
    {label}
  </span>
);

export default Badge;

import React from 'react';
import { FiInbox } from 'react-icons/fi';

export const EmptyState = ({ icon: Icon = FiInbox, title, description, actionLabel, onAction }) => (
  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
      <Icon size={28} />
    </div>
    <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
    <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">{description}</p>
    {actionLabel && onAction ? (
      <button onClick={onAction} className="btn-primary">
        {actionLabel}
      </button>
    ) : null}
  </div>
);

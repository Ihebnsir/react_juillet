import React from 'react';
import { motion } from 'framer-motion';

export const AdminPageShell = ({ eyebrow, title, subtitle, badge, children, className = '' }) => (
  <div className={`space-y-6 ${className}`.trim()}>
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[28px] border border-slate-800 bg-slate-950/95 p-6 shadow-[0_12px_35px_rgba(0,0,0,0.48)] backdrop-blur"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">{eyebrow}</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-100">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-slate-400">{subtitle}</p> : null}
        </div>
        {badge ? (
          <div className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
            {badge}
          </div>
        ) : null}
      </div>
    </motion.header>

    <div>{children}</div>
  </div>
);

export default AdminPageShell;

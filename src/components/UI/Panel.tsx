import React from 'react';
import { motion } from 'framer-motion';

export const Panel = ({ eyebrow, title, description, actions, children, className = '', borderless = false, opaque = false }) => {
  const wrapperClass = borderless
    ? `rounded-3xl ${opaque ? 'bg-slate-950' : 'bg-slate-950/70'} p-6 shadow-2xl shadow-slate-950/20`
    : `rounded-3xl border border-white/10 ${opaque ? 'bg-slate-950' : 'bg-slate-950/80'} p-6 shadow-2xl shadow-slate-950/20`;

  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${wrapperClass} ${className}`}>
      {(eyebrow || title || description || actions) && (
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-2">
            {eyebrow ? <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{eyebrow}</p> : null}
            {title ? <h2 className="text-2xl font-semibold text-white">{title}</h2> : null}
            {description ? <p className="text-sm text-slate-400">{description}</p> : null}
          </div>
          {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
        </div>
      )}
      {children}
    </motion.section>
  );
};

export default Panel;

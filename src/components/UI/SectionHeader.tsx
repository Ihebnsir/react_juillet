import React from 'react';

export const SectionHeader = ({ eyebrow, title, description, actions, className = '' }) => (
  <div className={`flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20 ${className}`}>
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div className="min-w-0 space-y-2">
        {eyebrow ? <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{eyebrow}</p> : null}
        {title ? <h2 className="text-2xl font-semibold text-white">{title}</h2> : null}
        {description ? <p className="text-sm text-slate-400">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  </div>
);

export default SectionHeader;

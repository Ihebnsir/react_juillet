import React from 'react';
import { Clock3, UserCheck } from 'lucide-react';

const AdminActionTimeline = ({ items }) => {
  return (
    <section className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Historique des actions</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Journal d’administration</h2>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-slate-300">
          {items.length} entrées récentes
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4 text-slate-300">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                <Clock3 size={14} /> {item.date}
              </span>
              <span className="inline-flex rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                {item.ip}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-white">{item.admin}</p>
                <p className="mt-1 text-sm text-slate-400">{item.action} • {item.target}</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200">
                <UserCheck size={14} /> Action enregistrée
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminActionTimeline;

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldOff, CheckCircle2, Eye, FileText, XCircle } from 'lucide-react';

const typeConfig = {
  danger: { border: 'border-rose-500/20', bg: 'bg-rose-500/10', text: 'text-rose-100' },
  warning: { border: 'border-amber-500/20', bg: 'bg-amber-500/10', text: 'text-amber-100' },
  info: { border: 'border-sky-500/20', bg: 'bg-sky-500/10', text: 'text-sky-100' },
};

const RiskAlerts = ({ alerts, onViewDetail, onCreateLitige, onSuspend, onIgnore, onResolve }) => {
  return (
    <section className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Alertes nécessitant une attention</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Surveillance prioritaire</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-slate-300">
          <AlertTriangle size={16} /> Priorité la plus élevée
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <AnimatePresence>
          {alerts.map((alert, index) => {
            const config = typeConfig[alert.severity] || typeConfig.info;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`rounded-3xl border ${config.border} ${config.bg} p-5 shadow-lg shadow-slate-950/10`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">{alert.type}</span>
                      <span className="rounded-full bg-slate-900/40 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-200">
                        {alert.riskLevel}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-white">{alert.user} • {alert.role}</p>
                    <p className="text-sm leading-6 text-slate-200">{alert.message}</p>
                  </div>
                  <div className="space-y-2 text-right text-sm text-slate-300">
                    <p>{alert.date}</p>
                    <p className="text-slate-400">{alert.category}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => onViewDetail(alert)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 transition hover:border-white/20"
                  >
                    <Eye size={14} /> Voir détail
                  </button>
                  <button
                    type="button"
                    onClick={() => onCreateLitige(alert)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-500"
                  >
                    <FileText size={14} /> Créer un litige
                  </button>
                  <button
                    type="button"
                    onClick={() => onSuspend(alert)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 transition hover:bg-white/10"
                  >
                    <ShieldOff size={14} /> Suspendre compte
                  </button>
                  <button
                    type="button"
                    onClick={() => onResolve(alert)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
                  >
                    <CheckCircle2 size={14} /> Marquer traité
                  </button>
                  <button
                    type="button"
                    onClick={() => onIgnore(alert)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                  >
                    <XCircle size={14} /> Ignorer
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default RiskAlerts;

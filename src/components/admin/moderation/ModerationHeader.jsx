import React from 'react';
import { Clock3, ShieldCheck, ShieldAlert, RefreshCcw } from 'lucide-react';

const badgeClass = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold';

const ModerationHeader = ({ overview, onCreateLitige }) => {
  return (
    <section className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-2xl bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Centre de Modération
            </span>
            <span className="rounded-2xl bg-slate-800/80 px-3 py-1 text-xs text-slate-400">
              Tableau de bord SaaS Enterprise
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Surveillez la qualité, la sécurité et la conformité de SkillBridge</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Analyse automatique des signalements, des comportements utilisateurs et des risques de contenu. Passez rapidement de l’alerte au litige lorsque nécessaire.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCreateLitige}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-500"
        >
          <ShieldCheck size={18} />
          Créer un litige
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Sécurité plateforme</span>
            <ShieldAlert size={16} className="text-emerald-300" />
          </div>
          <div className="mt-4 flex items-end gap-4">
            <p className="text-4xl font-semibold text-white">{overview.securityScore}%</p>
            <span className="rounded-2xl bg-emerald-500/10 px-2 py-1 text-xs uppercase tracking-[0.18em] text-emerald-300">Stable</span>
          </div>
          <p className="mt-3 text-sm text-slate-500">Analyse de confiance, détection anomalies et conformité.</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Alertes actives</span>
            <span className="rounded-full bg-rose-500/10 px-2 py-1 text-xs font-semibold text-rose-200">{overview.activeAlerts}</span>
          </div>
          <p className="mt-4 text-4xl font-semibold text-white">{overview.activeAlerts}</p>
          <p className="mt-3 text-sm text-slate-500">Alertes critiques, importantes et informations.</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Date actuelle</span>
            <Clock3 size={16} className="text-slate-300" />
          </div>
          <p className="mt-4 text-4xl font-semibold text-white">{overview.currentDate}</p>
          <p className="mt-3 text-sm text-slate-500">Dernière synchronisation {overview.lastSync}.</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Dernière analyse</span>
            <RefreshCcw size={16} className="text-slate-300" />
          </div>
          <p className="mt-4 text-4xl font-semibold text-white">{overview.analysisLatency}</p>
          <p className="mt-3 text-sm text-slate-500">Mises à jour en temps réel pour les comportements suspects.</p>
        </div>
      </div>
    </section>
  );
};

export default ModerationHeader;

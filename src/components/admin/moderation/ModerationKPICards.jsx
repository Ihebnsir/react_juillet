import React from 'react';
import { CheckCircle2, ShieldAlert, ShieldCheck, Clock3 } from 'lucide-react';
import KPIPremiumCard from '../KPIPremiumCard';

const ICONS = {
  'Signalements actifs': ShieldAlert,
  'Contenus vérifiés aujourd’hui': CheckCircle2,
  'Utilisateurs sous surveillance': ShieldCheck,
  'Temps moyen de résolution': Clock3,
};

const ModerationKPICards = ({ kpis }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">KPIs de surveillance</h2>
          <p className="text-sm text-slate-400">Tableau de bord d’impact pour évaluer la qualité et la réactivité.</p>
        </div>
        <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 md:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" /> En temps réel
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-2">
        {kpis.map((metric, index) => {
          const Icon = ICONS[metric.label] || ShieldCheck;
          return (
            <KPIPremiumCard
              key={metric.label}
              icon={Icon}
              label={metric.label}
              value={metric.value}
              growth={metric.growth}
              target={metric.target}
              progress={metric.progress}
              sparklineData={metric.sparklineData}
              delay={index * 0.08}
              format={metric.format || 'number'}
            />
          );
        })}
      </div>
    </section>
  );
};

export default ModerationKPICards;

import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiActivity } from 'react-icons/fi';

const TrendCard = ({ label, value, growth, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="rounded-xl bg-white/5 border border-white/10 p-4"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/15">
          <Icon className="text-brand-400" size={14} />
        </div>
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <span className={`flex items-center gap-0.5 text-xs font-medium ${
        growth >= 0 ? 'text-emerald-400' : 'text-rose-400'
      }`}>
        {growth >= 0 ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
        {Math.abs(growth)}%
      </span>
    </div>
    <p className="text-xl font-bold text-white mt-2">{value}</p>
  </motion.div>
);

const PlatformTrends = ({ trends }) => {
  if (!trends) return null;

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiActivity className="text-slate-400" size={16} />
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Tendances de la plateforme
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <TrendCard
          label="Hausse des inscriptions"
          value={`${trends.inscriptionGrowth >= 0 ? '+' : ''}${trends.inscriptionGrowth}%`}
          growth={trends.inscriptionGrowth}
          icon={FiTrendingUp}
          delay={0}
        />
        <TrendCard
          label="Évolution réservations"
          value={`${trends.reservationGrowth >= 0 ? '+' : ''}${trends.reservationGrowth}%`}
          growth={trends.reservationGrowth}
          icon={FiTrendingUp}
          delay={0.05}
        />
        <TrendCard
          label="Croissance centres"
          value={`${trends.centreGrowth >= 0 ? '+' : ''}${trends.centreGrowth}%`}
          growth={trends.centreGrowth}
          icon={FiTrendingUp}
          delay={0.1}
        />
        <TrendCard
          label="Activité hebdomadaire"
          value={`${trends.weeklyActivity}%`}
          growth={trends.previousMonthComparison}
          icon={FiActivity}
          delay={0.15}
        />
      </div>

      <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Comparaison mois précédent</span>
          <span className={`font-medium ${
            (trends.previousMonthComparison || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {(trends.previousMonthComparison || 0) >= 0 ? '+' : ''}{trends.previousMonthComparison || 0}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlatformTrends;


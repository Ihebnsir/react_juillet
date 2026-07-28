import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiCheckCircle } from 'react-icons/fi';

const MonthlyObjectives = ({ objectives = [] }) => {
  if (!objectives.length) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <p className="text-sm text-slate-400">Aucun objectif défini.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiTarget className="text-slate-400" size={16} />
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Objectifs mensuels
        </h3>
      </div>

      <div className="space-y-4">
        {objectives.map((obj, idx) => {
          const pct = obj.target > 0 ? Math.min(100, Math.round((obj.current / obj.target) * 100)) : 0;
          return (
            <div key={idx}>
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-2">
                  {obj.unlocked ? (
                    <FiCheckCircle className="text-emerald-400" size={14} />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-600" />
                  )}
                  <span className="text-slate-300">{obj.label}</span>
                </div>
                <span className="text-xs text-slate-500">
                  {obj.current}/{obj.target}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className={`h-full rounded-full ${
                    pct >= 90 ? 'bg-emerald-400' : pct >= 60 ? 'bg-brand-400' : pct >= 30 ? 'bg-amber-400' : 'bg-rose-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-slate-600">Progression</span>
                <span className="text-[10px] text-slate-500">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyObjectives;


import React from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2 } from 'react-icons/fi';

const colorMap = {
  emerald: { bar: 'bg-emerald-400', bg: 'bg-emerald-500/10', text: 'text-emerald-300' },
  brand: { bar: 'bg-brand-400', bg: 'bg-brand-500/10', text: 'text-brand-300' },
  blue: { bar: 'bg-blue-400', bg: 'bg-blue-500/10', text: 'text-blue-300' },
  purple: { bar: 'bg-purple-400', bg: 'bg-purple-500/10', text: 'text-purple-300' },
  amber: { bar: 'bg-amber-400', bg: 'bg-amber-500/10', text: 'text-amber-300' },
  rose: { bar: 'bg-rose-400', bg: 'bg-rose-500/10', text: 'text-rose-300' },
};

const PlatformMetrics = ({ metrics = [] }) => {
  if (!metrics.length) return null;

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiBarChart2 className="text-slate-400" size={16} />
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Métriques plateforme
        </h3>
      </div>

      <div className="space-y-4">
        {metrics.map((metric, idx) => {
          const colors = colorMap[metric.color] || colorMap.brand;
          const pct = metric.max > 0 ? Math.min(100, Math.round((metric.value / metric.max) * 100)) : 0;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-300">{metric.label}</span>
                <span className={`text-xs font-medium ${colors.text}`}>
                  {metric.value}{metric.unit} / {metric.max}{metric.unit}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className={`h-full rounded-full ${colors.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.05 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformMetrics;


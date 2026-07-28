import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const Sparkline = ({ data = [], color = '#0E9A80' }) => {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 60;
  const h = 24;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const useCountUp = (target, duration = 800) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === undefined || target === null) return;
    const safeTarget = Number(target);
    if (!Number.isFinite(safeTarget)) {
      setValue(target);
      return;
    }
    let start = 0;
    const stepTime = Math.max(Math.floor(duration / Math.max(safeTarget, 1)), 16);
    const timer = setInterval(() => {
      start += Math.ceil(safeTarget / (duration / stepTime));
      if (start >= safeTarget) {
        setValue(safeTarget);
        clearInterval(timer);
      } else {
        setValue(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
};

const KPIPremiumCard = ({ icon: Icon, label, value, growth = 0, target, progress = 0, sparklineData = [], delay = 0, format = 'number' }) => {
  const animatedValue = useCountUp(value, 1000);
  const isPositive = growth >= 0;
  const progressPercent = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;

  const formattedValue = format === 'currency'
    ? `${animatedValue.toLocaleString()} DT`
    : format === 'percent'
      ? `${animatedValue}%`
      : animatedValue.toLocaleString();

  const sparkColor = isPositive ? '#10B981' : '#EF4444';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-5 hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400">
            <Icon size={18} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-white mt-0.5 font-mono">{formattedValue}</p>
          </div>
        </div>
        <Sparkline data={sparklineData} color={sparkColor} />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
          isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
        }`}>
          {isPositive ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
          <span>{Math.abs(growth)}%</span>
        </div>
        {target > 0 && (
          <span className="text-xs text-slate-500">
            Objectif: {format === 'currency' ? `${target.toLocaleString()} DT` : target}
          </span>
        )}
      </div>

      {target > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Progression</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, delay: delay + 0.2 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default KPIPremiumCard;


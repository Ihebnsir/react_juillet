import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const useCountUp = (target, duration = 1000) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === undefined || target === null) {
      setValue(0);
      return undefined;
    }

    const safeTarget = Number(target);
    if (!Number.isFinite(safeTarget)) {
      setValue(target);
      return undefined;
    }

    let start = 0;
    const stepTime = Math.max(Math.floor(duration / Math.max(safeTarget, 1)), 16);
    const timer = window.setInterval(() => {
      start += Math.ceil(safeTarget / (duration / stepTime));
      if (start >= safeTarget) {
        setValue(safeTarget);
        window.clearInterval(timer);
      } else {
        setValue(start);
      }
    }, stepTime);

    return () => window.clearInterval(timer);
  }, [target, duration]);

  return value;
};

export const AnimatedStatCard = ({ icon: Icon, label, value, tone = 'brand', delay = 0, subtitle }) => {
  const animatedValue = useCountUp(value);
  const toneClasses = {
    brand: 'bg-brand-500/15 text-brand-600 dark:text-brand-300',
    accent: 'bg-accent-500/15 text-accent-600 dark:text-accent-300',
    sunset: 'bg-sunset-500/15 text-sunset-600 dark:text-sunset-300',
    emerald: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card"
    >
      <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${toneClasses[tone] || toneClasses.brand}`}>
        <Icon size={20} />
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{animatedValue}</p>
      <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p>
      {subtitle ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
    </motion.div>
  );
};

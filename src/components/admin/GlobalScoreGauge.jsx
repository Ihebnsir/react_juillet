import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiTrendingUp, FiStar, FiUsers, FiLock } from 'react-icons/fi';

const ScoreRing = ({ score, label, icon: Icon, delay = 0 }) => {
  const [animScore, setAnimScore] = useState(0);
  const circumference = 2 * Math.PI * 40;

  useEffect(() => {
    if (score === undefined) return;
    let start = 0;
    const end = score;
    const duration = 1200;
    const stepTime = Math.max(Math.floor(duration / Math.max(end, 1)), 16);
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / stepTime));
      if (start >= end) {
        setAnimScore(end);
        clearInterval(timer);
      } else {
        setAnimScore(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [score]);

  const offset = circumference - ((animScore || 0) / 100) * circumference;

  const getColor = (val) => {
    if (val >= 90) return '#10B981';
    if (val >= 70) return '#0E9A80';
    if (val >= 50) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="flex flex-col items-center gap-1"
    >
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <motion.circle
            cx="45"
            cy="45"
            r="40"
            fill="none"
            stroke={getColor(animScore)}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, delay: delay + 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-white">{animScore}%</span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-slate-400">
        {Icon && <Icon size={10} />}
        <span>{label}</span>
      </div>
    </motion.div>
  );
};

const GlobalScoreGauge = ({ globalScore, performanceScore, securityScore, availabilityScore, satisfactionScore, growthScore }) => {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
        Score global plateforme
      </h3>

      <div className="flex items-center justify-center">
        <ScoreRing score={globalScore || 0} label="Global" delay={0} />
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
        <ScoreRing score={performanceScore || 0} label="Performance" icon={FiTrendingUp} delay={0.1} />
        <ScoreRing score={securityScore || 0} label="Sécurité" icon={FiLock} delay={0.15} />
        <ScoreRing score={availabilityScore || 0} label="Disponibilité" icon={FiShield} delay={0.2} />
        <ScoreRing score={satisfactionScore || 0} label="Satisfaction" icon={FiStar} delay={0.25} />
        <ScoreRing score={growthScore || 0} label="Croissance" icon={FiUsers} delay={0.3} />
      </div>
    </div>
  );
};

export default GlobalScoreGauge;


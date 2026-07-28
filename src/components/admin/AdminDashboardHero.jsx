import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiCalendar, FiRefreshCw } from 'react-icons/fi';

const AdminDashboardHero = ({ data }) => {
  const [time, setTime] = useState(new Date());
  const [healthScore, setHealthScore] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (data?.globalScore) {
      let start = 0;
      const end = data.globalScore;
      const duration = 1000;
      const stepTime = Math.max(Math.floor(duration / end), 16);
      const timer = setInterval(() => {
        start += Math.ceil(end / (duration / stepTime));
        if (start >= end) {
          setHealthScore(end);
          clearInterval(timer);
        } else {
          setHealthScore(start);
        }
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [data?.globalScore]);

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const score = healthScore || data?.globalScore || 0;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 p-6 md:p-8 shadow-xl border border-white/10"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-6">
        {/* Left side - Greeting */}
        <div className="flex-1">
          <div className="flex items-center gap-3 text-sm text-slate-400 mb-2">
            <FiClock className="w-4 h-4" />
            <span>{formatTime(time)}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <FiCalendar className="w-4 h-4" />
            <span className="capitalize">{formatDate(time)}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">
            Bonjour Admin,
          </h1>
          <p className="text-slate-300 mt-1 text-lg">
            Bienvenue sur le centre de contrôle <span className="text-brand-400 font-semibold">SkillBridge</span>.
          </p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <p className="text-2xl font-bold text-brand-400">{data?.newUsersThisMonth || 0}</p>
              <p className="text-xs text-slate-400 mt-1">Nouveaux inscrits</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <p className="text-2xl font-bold text-sunset-400">{data?.centersToVerify || 0}</p>
              <p className="text-xs text-slate-400 mt-1">Centres à vérifier</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <p className="text-2xl font-bold text-rose-400">{data?.criticalLitiges || 0}</p>
              <p className="text-xs text-slate-400 mt-1">Litiges urgents</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <p className="text-2xl font-bold text-blue-400">{data?.pendingSignalements || 0}</p>
              <p className="text-xs text-slate-400 mt-1">Contenus à modérer</p>
            </div>
          </div>
        </div>

        {/* Right side - Health Score */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="8"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0E9A80" />
                  <stop offset="100%" stopColor="#42D1B3" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.p
                  className="text-3xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {score}%
                </motion.p>
                <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider">Health Score</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <FiRefreshCw className="w-3 h-3" />
            <span>Dernière sync. {formatTime(time)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboardHero;


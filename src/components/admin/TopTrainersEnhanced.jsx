import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiBookOpen, FiUsers } from 'react-icons/fi';

const TopTrainersEnhanced = ({ trainers = [] }) => {
  if (!trainers.length) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <p className="text-sm text-slate-400">Aucun formateur disponible.</p>
      </div>
    );
  }

  const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
        Top Formateurs
      </h3>
      <div className="space-y-3">
        {trainers.slice(0, 5).map((trainer, idx) => (
          <motion.div
            key={trainer.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full overflow-hidden bg-white/10">
              <img
                src={trainer.avatar || defaultAvatar}
                alt={trainer.name}
                className="h-full w-full object-cover"
                onError={(e) => { e.target.src = defaultAvatar; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white truncate">{trainer.name}</span>
                <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                  trainer.status === 'Actif' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {trainer.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{trainer.speciality}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
              <span className="flex items-center gap-1"><FiUsers size={11} />{trainer.students}</span>
              <span className="flex items-center gap-1"><FiBookOpen size={11} />{trainer.courses}</span>
              <span className="flex items-center gap-1"><FiStar size={11} className="text-amber-400" />{trainer.rating}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TopTrainersEnhanced;


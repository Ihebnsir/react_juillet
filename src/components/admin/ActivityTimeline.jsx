import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiChevronRight } from 'react-icons/fi';
import { useActivityLog } from '../../context/ActivityContext';

const typeConfig = {
  formation: { bg: 'bg-brand-500/20', text: 'text-brand-300', label: 'Formation' },
  users: { bg: 'bg-blue-500/20', text: 'text-blue-300', label: 'Utilisateur' },
  certificate: { bg: 'bg-purple-500/20', text: 'text-purple-300', label: 'Certificat' },
  system: { bg: 'bg-slate-500/20', text: 'text-slate-300', label: 'Système' },
};

const ActivityTimeline = () => {
  const { activities } = useActivityLog();
  const recentActivities = activities.slice(0, 8);

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiClock className="text-slate-400" size={18} />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Activité récente
          </h3>
        </div>
      </div>

      <div className="relative max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-white/5" />

        <div className="space-y-0">
          {recentActivities.map((activity, idx) => {
            const config = typeConfig[activity.type] || typeConfig.system;
            const time = new Date(activity.createdAt);
            const hours = time.getHours().toString().padStart(2, '0');
            const minutes = time.getMinutes().toString().padStart(2, '0');
            const initials = (activity.user || '?').slice(0, 2).toUpperCase();

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative flex items-start gap-4 pb-5 group"
              >
                {/* Timeline dot */}
                <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.bg} border-2 border-slate-800`}>
                  <span className="text-[10px] font-bold text-white">{initials}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-slate-400">
                      {hours}:{minutes}
                    </span>
                    <span className="text-xs font-bold text-white">{activity.user}</span>
                    <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${config.bg} ${config.text}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mt-0.5">{activity.action}</p>
                  {activity.details && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{activity.details}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => window.location.href = '/activity-history'}
        className="mt-2 w-full flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition py-2"
      >
        Voir toute l'activité
        <FiChevronRight size={12} />
      </button>
    </div>
  );
};

export default ActivityTimeline;


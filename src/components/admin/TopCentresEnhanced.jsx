import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiStar, FiMapPin, FiUsers, FiBookOpen, FiTrendingUp, FiEye } from 'react-icons/fi';

const TopCentresEnhanced = ({ centres = [] }) => {
  const navigate = useNavigate();

  if (!centres.length) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <p className="text-sm text-slate-400">Aucun centre disponible.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
        Top Centres
      </h3>
      <div className="space-y-3">
        {centres.map((centre, idx) => (
          <motion.div
            key={centre.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 overflow-hidden">
              {centre.logo ? (
                <img src={centre.logo} alt={centre.name} className="h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span class="text-xs font-bold text-slate-400">${(centre.name || '?')[0]}</span>`; }} />
              ) : (
                <span className="text-xs font-bold text-slate-400">{(centre.name || '?')[0]}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white truncate">{centre.name}</span>
                {centre.verified && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Vérifié" />}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1"><FiMapPin size={10} />{centre.city}</span>
                <span className="flex items-center gap-1"><FiUsers size={10} />{centre.students}</span>
                <span className="flex items-center gap-1"><FiBookOpen size={10} />{centre.formations}</span>
                <span className="flex items-center gap-1"><FiStar size={10} className="text-amber-400" />{centre.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <FiTrendingUp size={12} />
                +{centre.monthlyProgress}%
              </span>
              <button
                onClick={() => navigate(`/centres/${centre.id}`)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                title="Voir profil"
              >
                <FiEye size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TopCentresEnhanced;


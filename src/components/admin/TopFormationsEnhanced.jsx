import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen, FiTag, FiEye, FiDollarSign } from 'react-icons/fi';

const TopFormationsEnhanced = ({ formations = [] }) => {
  const navigate = useNavigate();

  if (!formations.length) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <p className="text-sm text-slate-400">Aucune formation disponible.</p>
      </div>
    );
  }

  const defaultImg = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&q=60';

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
        Top Formations
      </h3>
      <div className="space-y-3">
        {formations.map((formation, idx) => (
          <motion.div
            key={formation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition group"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg overflow-hidden bg-white/10">
              <img
                src={formation.image || defaultImg}
                alt={formation.title}
                className="h-full w-full object-cover"
                onError={(e) => { e.target.src = defaultImg; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white truncate">{formation.title}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1"><FiTag size={10} />{formation.category}</span>
                <span className="flex items-center gap-1"><FiBookOpen size={10} />{formation.centre}</span>
                <span className="flex items-center gap-1"><FiDollarSign size={10} />{formation.price} DT</span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <p className="text-xs text-slate-400">{formation.bookings} rés.</p>
                <p className="text-xs text-slate-500">{formation.progress}%</p>
              </div>
              <button
                onClick={() => navigate(`/formations/${formation.id}`)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                title="Voir"
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

export default TopFormationsEnhanced;


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiCpu, FiChevronRight } from 'react-icons/fi';

const AIAssistant = ({ suggestions = [] }) => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(new Set());

  const visibleSuggestions = suggestions.filter(s => !dismissed.has(s.id));

  const handleAction = (suggestion) => {
    if (suggestion.link) navigate(suggestion.link);
    setDismissed(prev => new Set(prev).add(suggestion.id));
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-brand-500/10 to-accent-500/5 border border-brand-500/20 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20">
          <FiCpu className="text-brand-400" size={20} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Assistant SkillBridge IA</h3>
          <p className="text-xs text-slate-400">Recommandations basées sur vos données</p>
        </div>
      </div>

      {!visibleSuggestions.length ? (
        <div className="text-center py-4">
          <div className="text-2xl mb-2">✨</div>
          <p className="text-sm text-slate-400">Tout est à jour, aucune recommandation pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {visibleSuggestions.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition"
              >
                <p className="text-sm text-slate-300 flex-1">{s.text}</p>
                <button
                  onClick={() => handleAction(s)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition whitespace-nowrap"
                >
                  {s.action || 'Voir'}
                  <FiChevronRight size={12} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;


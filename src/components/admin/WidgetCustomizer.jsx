import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSettings, FiEye, FiEyeOff, FiChevronUp, FiChevronDown, FiRotateCcw, FiX } from 'react-icons/fi';

const WidgetCustomizer = ({ widgets, toggleWidget, moveWidget, resetWidgets }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10 transition"
      >
        <FiSettings size={16} />
        Personnaliser
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 z-50 w-72 rounded-2xl bg-slate-800 border border-white/10 shadow-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white">Widgets</h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { resetWidgets(); setOpen(false); }}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
                  title="Réinitialiser"
                >
                  <FiRotateCcw size={12} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
                >
                  <FiX size={12} />
                </button>
              </div>
            </div>

            <div className="space-y-1 max-h-80 overflow-y-auto custom-scrollbar">
              {widgets.map((w, idx) => (
                <div
                  key={w.id}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    w.visible ? 'bg-white/[0.04]' : 'bg-white/[0.02] opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWidget(w.id)}
                      className={`p-1 rounded transition ${
                        w.visible ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-600 hover:text-slate-400'
                      }`}
                      title={w.visible ? 'Masquer' : 'Afficher'}
                    >
                      {w.visible ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                    </button>
                    <span className="text-sm text-slate-300">{w.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveWidget(w.id, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-white/10 text-slate-500 hover:text-white transition disabled:opacity-30"
                    >
                      <FiChevronUp size={12} />
                    </button>
                    <button
                      onClick={() => moveWidget(w.id, 'down')}
                      disabled={idx === widgets.length - 1}
                      className="p-1 rounded hover:bg-white/10 text-slate-500 hover:text-white transition disabled:opacity-30"
                    >
                      <FiChevronDown size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WidgetCustomizer;


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiEye, FiCheckCircle, FiXCircle, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AlertsCenter = ({ alerts = [] }) => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(new Set());
  const [processed, setProcessed] = useState(new Set());

  const visibleAlerts = alerts.filter(a => !dismissed.has(a.id) && !processed.has(a.id));

  const handleView = (alert) => {
    if (alert.actionLink) navigate(alert.actionLink);
  };

  const handleProcess = (alert) => {
    setProcessed(prev => new Set(prev).add(alert.id));
  };

  const handleDismiss = (alert) => {
    setDismissed(prev => new Set(prev).add(alert.id));
  };

  if (!visibleAlerts.length) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiBell className="text-slate-400" size={18} />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Alertes prioritaires</h3>
        </div>
        <div className="text-center py-6">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-sm text-slate-400">Aucune alerte en attente</p>
          <p className="text-xs text-slate-500 mt-1">Tout est sous contrôle</p>
        </div>
      </div>
    );
  }

  const typeConfig = {
    danger: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-300' },
    warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-300' },
    info: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-300' },
  };

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiBell className="text-slate-400" size={18} />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Alertes prioritaires</h3>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-300">
            {visibleAlerts.length}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {visibleAlerts.map((alert, idx) => {
            const config = typeConfig[alert.type] || typeConfig.info;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl ${config.bg} ${config.border} border`}
              >
                <span className="text-lg shrink-0">{alert.icon}</span>
                <p className={`flex-1 text-sm ${config.text}`}>{alert.message}</p>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleView(alert)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
                    title="Voir"
                  >
                    <FiEye size={14} />
                  </button>
                  <button
                    onClick={() => handleProcess(alert)}
                    className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 transition"
                    title="Traiter"
                  >
                    <FiCheckCircle size={14} />
                  </button>
                  <button
                    onClick={() => handleDismiss(alert)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition"
                    title="Ignorer"
                  >
                    <FiXCircle size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {visibleAlerts.length > 0 && (
        <button
          onClick={() => navigate('/admin/litiges')}
          className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition py-2"
        >
          Voir toutes les alertes
          <FiChevronRight size={12} />
        </button>
      )}
    </div>
  );
};

export default AlertsCenter;


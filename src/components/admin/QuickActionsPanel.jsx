import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiPlusCircle, FiFileText, FiMapPin, FiUserPlus,
  FiSend, FiBarChart2, FiDownload, FiBell
} from 'react-icons/fi';

const actions = [
  { id: 'formation', icon: FiPlusCircle, label: 'Créer une formation', link: '/formations', color: 'bg-brand-500/15 text-brand-400 hover:bg-brand-500/25' },
  { id: 'annonce', icon: FiFileText, label: 'Créer une annonce', link: '/admin/contenu-accueil', color: 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25' },
  { id: 'centre', icon: FiMapPin, label: 'Ajouter un centre', link: '/admin/centres-en-attente', color: 'bg-purple-500/15 text-purple-400 hover:bg-purple-500/25' },
  { id: 'apprenant', icon: FiUserPlus, label: 'Ajouter un apprenant', link: '/admin/utilisateurs', color: 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25' },
  { id: 'notification', icon: FiBell, label: 'Envoyer notification', link: '/notifications', color: 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25' },
  { id: 'rapport', icon: FiBarChart2, label: 'Ouvrir Analytics', link: '/admin/analytics', color: 'bg-rose-500/15 text-rose-400 hover:bg-rose-500/25' },
  { id: 'export', icon: FiDownload, label: 'Exporter statistiques', link: '#export', color: 'bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25' },
  { id: 'message', icon: FiSend, label: 'Support & Messages', link: '/admin/contact', color: 'bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25' },
];

const QuickActionsPanel = () => {
  const navigate = useNavigate();

  const handleClick = (action) => {
    if (action.id === 'export') {
      window.print();
      return;
    }
    navigate(action.link);
  };

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
        Actions rapides
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, idx) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.03 }}
            onClick={() => handleClick(action)}
            className={`flex items-center gap-3 p-3 rounded-xl ${action.color} transition-all duration-200 active:scale-95`}
          >
            <action.icon size={18} />
            <span className="text-xs font-medium text-left leading-tight">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsPanel;


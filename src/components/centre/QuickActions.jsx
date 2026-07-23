import React from 'react';
import { FiCalendar, FiMessageSquare, FiShield } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Action = ({ icon: Icon, label, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white/70 dark:bg-slate-800 hover:shadow-md transition shadow-sm">
    <span className="rounded-full bg-gradient-to-br from-brand-600 to-brand-500 p-2 text-white"><Icon /></span>
    <span className="font-medium text-sm text-slate-800 dark:text-slate-100">{label}</span>
  </button>
);

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-3 md:grid-cols-3">
      <Action icon={FiCalendar} label="Réservations" onClick={() => navigate('/centre/reservations')} />
      <Action icon={FiMessageSquare} label="Messages" onClick={() => navigate('/centre/messagerie')} />
      <Action icon={FiShield} label="Vérification" onClick={() => navigate('/centre/verification')} />
    </div>
  );
};

export default QuickActions;

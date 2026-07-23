import React from 'react';
import { FiPlusCircle, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-white/5 p-4 shadow-md border border-white/6">
      <h3 className="text-sm text-slate-300">Actions rapides</h3>
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          onClick={() => navigate('/admin/centres-en-attente')}
          className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-sm text-white"
        >
          <FiPlusCircle /> Nouvelle annonce
        </button>
        <button
          onClick={() => navigate('/admin/utilisateurs')}
          className="inline-flex items-center gap-2 rounded-md bg-white/6 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
        >
          <FiSearch /> Rechercher
        </button>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-md bg-white/6 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
        >
          <FiRefreshCw /> Rafraîchir
        </button>
      </div>
    </div>
  );
};

export default QuickActions;

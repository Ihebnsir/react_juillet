import React from 'react';
import { FiPlusCircle, FiSearch, FiRefreshCw } from 'react-icons/fi';

export const QuickActions = () => (
  <div className="rounded-2xl bg-white/5 p-4 shadow-md border border-white/6">
    <h3 className="text-sm text-slate-300">Actions rapides</h3>
    <div className="mt-3 flex flex-wrap gap-3">
      <button className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-sm text-white"> <FiPlusCircle /> Nouvelle annonce</button>
      <button className="inline-flex items-center gap-2 rounded-md bg-white/6 px-3 py-2 text-sm text-white/80" disabled title="Disponible prochainement"> <FiSearch /> Rechercher</button>
      <button className="inline-flex items-center gap-2 rounded-md bg-white/6 px-3 py-2 text-sm text-white/80" title="Disponible prochainement"> <FiRefreshCw /> Rafraîchir</button>
    </div>
  </div>
);

export default QuickActions;

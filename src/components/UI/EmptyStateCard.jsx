import React from 'react';
import { FiPlus } from 'react-icons/fi';

export const EmptyStateCard = ({ icon: Icon, title, description, onPrimary, primaryLabel = 'Ajouter' }) => {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-700 bg-slate-900/60 p-10 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-brand-400">
        {Icon ? <Icon size={24} /> : <FiPlus size={24} />}
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">{description}</p>
      <button
        type="button"
        onClick={onPrimary}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500"
      >
        <FiPlus size={16} /> {primaryLabel}
      </button>
    </div>
  );
};

export default EmptyStateCard;

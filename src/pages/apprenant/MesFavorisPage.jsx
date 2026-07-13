import React from 'react';
import { mockFormations } from '../../data/mockFormations';

export const MesFavorisPage = () => {
  const favorites = mockFormations.slice(0, 3);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Mes favoris</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">Vous pouvez comparer jusqu’à 3 formations.</p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {favorites.map((formation) => (
          <div key={formation.id} className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
            <p className="font-semibold text-gray-900 dark:text-slate-100">{formation.title}</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">{formation.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

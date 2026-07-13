import React from 'react';
import { mockCentres } from '../../data/mockCentres';

export const StatutVerificationPage = () => {
  const centre = mockCentres[1];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Statut de vérification</h1>
      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
        <p className="font-semibold">{centre.name}</p>
        <p className="mt-1">Vérification en attente — justificatifs à soumettre.</p>
      </div>
    </div>
  );
};

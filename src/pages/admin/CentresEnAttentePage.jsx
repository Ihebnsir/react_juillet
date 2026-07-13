import React from 'react';
import { mockCentres } from '../../data/mockCentres';

export const CentresEnAttentePage = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Centres en attente de vérification</h1>
    <div className="mt-4 space-y-3">
      {mockCentres.filter((centre) => !centre.verifie).map((centre) => (
        <div key={centre.id} className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
          <p className="font-semibold text-gray-900 dark:text-slate-100">{centre.name}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{centre.ville}</p>
        </div>
      ))}
    </div>
  </div>
);

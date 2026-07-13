import React from 'react';
import { mockLitiges } from '../../data/mockLitiges';

export const LitigesPage = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Litiges signalés</h1>
    <div className="mt-4 space-y-3">
      {mockLitiges.map((litige) => (
        <div key={litige.id} className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
          <p className="font-semibold text-gray-900 dark:text-slate-100">{litige.titre}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Statut : {litige.status}</p>
          <p className="mt-2 text-sm text-rose-600">Priorité : {litige.priorite}</p>
        </div>
      ))}
    </div>
  </div>
);

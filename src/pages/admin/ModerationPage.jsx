import React from 'react';
import { mockSignalements } from '../../data/mockSignalements';

export const ModerationPage = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Modération du contenu</h1>
    <div className="mt-4 space-y-3">
      {mockSignalements.map((signalement) => (
        <div key={signalement.id} className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
          <p className="font-semibold text-gray-900 dark:text-slate-100">{signalement.type}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{signalement.contenu}</p>
          <p className="mt-2 text-sm text-teal-600">{signalement.status}</p>
        </div>
      ))}
    </div>
  </div>
);

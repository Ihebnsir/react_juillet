import React from 'react';
import { mockFormations } from '../../data/mockFormations';

export const MesOffresPage = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Mes offres de formation</h1>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      {mockFormations.filter((formation) => formation.centreId === 'centre-1').map((formation) => (
        <div key={formation.id} className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
          <p className="font-semibold text-gray-900 dark:text-slate-100">{formation.title}</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">{formation.category}</p>
          <p className="mt-2 text-sm text-teal-600">{formation.offreStage ? 'Avec stage' : 'Sans stage'}</p>
        </div>
      ))}
    </div>
  </div>
);

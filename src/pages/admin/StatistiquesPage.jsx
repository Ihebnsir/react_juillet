import React from 'react';
import { DataChart } from '../../components/dashboard/DataChart';

export const StatistiquesPage = () => {
  const reservations = [
    { name: 'Jan', value: 8 },
    { name: 'Fév', value: 10 },
    { name: 'Mar', value: 12 },
    { name: 'Avr', value: 15 },
    { name: 'Mai', value: 17 },
    { name: 'Jui', value: 21 },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Statistiques détaillées</h1>
      <div className="mt-6">
        <DataChart data={reservations} dataKey="value" label="Réservations mensuelles" />
      </div>
    </div>
  );
};

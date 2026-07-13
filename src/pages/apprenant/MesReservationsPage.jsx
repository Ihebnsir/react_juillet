import React from 'react';
import { mockReservations } from '../../data/mockReservations';
import { mockFormations } from '../../data/mockFormations';

export const MesReservationsPage = () => {
  const reservations = mockReservations.filter((reservation) => reservation.learnerId === 1);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Mes réservations</h1>
      <div className="mt-4 space-y-3">
        {reservations.map((reservation) => {
          const formation = mockFormations.find((item) => item.id === reservation.formationId);
          return (
            <div key={reservation.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-slate-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-slate-100">{formation?.title}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">{reservation.date}</p>
              </div>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-700 dark:bg-teal-900/30 dark:text-teal-200">{reservation.status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

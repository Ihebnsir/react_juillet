import React from 'react';
import { mockReservations } from '../../data/mockReservations';
import { mockFormations } from '../../data/mockFormations';
import { FiCalendar, FiBookOpen } from 'react-icons/fi';

export const MesReservationsPage = () => {
  const reservations = mockReservations.filter((reservation) => reservation.learnerId === 1);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Mes réservations</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Suivez l’état de vos inscriptions en temps réel.</p>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {reservations.length > 0 ? reservations.map((reservation) => {
          const formation = mockFormations.find((item) => item.id === reservation.formationId);
          return (
            <div key={reservation.id} className="flex flex-col gap-3 rounded-2xl border border-gray-200 p-4 shadow-sm dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-teal-50 p-2 text-teal-600 dark:bg-teal-900/20 dark:text-teal-300"><FiBookOpen /></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-slate-100">{formation?.title}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400"><FiCalendar /> {reservation.date}</p>
                </div>
              </div>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-700 dark:bg-teal-900/30 dark:text-teal-200">{reservation.status}</span>
            </div>
          );
        }) : <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">Aucune réservation pour le moment.</div>}
      </div>
    </div>
  );
};

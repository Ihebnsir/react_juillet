import React from 'react';
import { mockReservations } from '../../data/mockReservations';

export const ReservationsRecuesPage = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Réservations reçues</h1>
    <div className="mt-4 space-y-3">
      {mockReservations.slice(0, 4).map((reservation) => (
        <div key={reservation.id} className="rounded-lg border border-gray-200 p-4 dark:border-slate-700">
          <p className="font-semibold text-gray-900 dark:text-slate-100">Réservation #{reservation.id}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Statut : {reservation.status}</p>
        </div>
      ))}
    </div>
  </div>
);

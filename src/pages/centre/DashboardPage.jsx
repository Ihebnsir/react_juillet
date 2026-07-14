import React from 'react';
import { mockCentres } from '../../data/mockCentres';
import { mockFormations } from '../../data/mockFormations';
import { mockReservations } from '../../data/mockReservations';
import { StatCard } from '../../components/dashboard/StatCard';
import { DataChart } from '../../components/dashboard/DataChart';
import { FiBookOpen, FiCalendar, FiTrendingUp, FiStar } from 'react-icons/fi';

export const DashboardPage = () => {
  const centre = mockCentres[0];
  const reservations = mockReservations.filter((reservation) => reservation.formationId === 'form-1' || reservation.formationId === 'form-2');
  const data = [
    { name: 'Jan', value: 2 },
    { name: 'Fév', value: 4 },
    { name: 'Mar', value: 3 },
    { name: 'Avr', value: 5 },
    { name: 'Mai', value: 6 },
    { name: 'Jui', value: 8 },
  ];

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl p-6 text-white ${centre.verifie ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-amber-600 to-orange-600'}`}>
        <p className="text-sm uppercase tracking-wide">Centre de formation</p>
        <h1 className="mt-2 text-2xl font-semibold">{centre.name}</h1>
        <p className="mt-2 text-sm text-white/80">{centre.verifie ? 'Centre vérifié' : 'En attente de vérification'}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={FiBookOpen} value={mockFormations.filter((item) => item.centreId === 'centre-1').length} label="Formations publiées" tone="teal" />
        <StatCard icon={FiCalendar} value={reservations.length} label="Réservations en cours" tone="orange" />
        <StatCard icon={FiTrendingUp} value="78%" label="Taux de remplissage" tone="green" />
        <StatCard icon={FiStar} value={centre.noteMoyenne.toFixed(1)} label="Note moyenne" tone="teal" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <DataChart data={data} dataKey="value" label="Réservations par mois" />
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Dernières réservations reçues</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-slate-300">
            {reservations.map((reservation) => (
              <li key={reservation.id} className="rounded-lg bg-gray-50 p-3 dark:bg-slate-700">{reservation.status} — {reservation.date}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

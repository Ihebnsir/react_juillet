import React from 'react';
import { mockUsers } from '../../data/mockUsers';
import { mockCentres } from '../../data/mockCentres';
import { mockFormations } from '../../data/mockFormations';
import { mockReservations } from '../../data/mockReservations';
import { mockLitiges } from '../../data/mockLitiges';
import { mockSignalements } from '../../data/mockSignalements';
import { StatCard } from '../../components/dashboard/StatCard';
import { DataChart } from '../../components/dashboard/DataChart';
import { FiUsers, FiBookOpen, FiCalendar, FiDollarSign, FiAlertTriangle } from 'react-icons/fi';

export const DashboardPage = () => {
  const data = [
    { name: 'Jan', value: 12 },
    { name: 'Fév', value: 18 },
    { name: 'Mar', value: 15 },
    { name: 'Avr', value: 22 },
    { name: 'Mai', value: 19 },
    { name: 'Jui', value: 27 },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-white">
        <p className="text-sm uppercase tracking-wide text-slate-300">Administration</p>
        <h1 className="mt-2 text-2xl font-semibold">Tableau de bord global</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <StatCard icon={FiUsers} value={mockUsers.length} label="Utilisateurs" tone="teal" />
        <StatCard icon={FiBookOpen} value={mockCentres.length} label="Centres" tone="green" />
        <StatCard icon={FiCalendar} value={mockFormations.length} label="Formations publiées" tone="orange" />
        <StatCard icon={FiDollarSign} value="12500€" label="Chiffre d'affaires" tone="teal" />
        <StatCard icon={FiAlertTriangle} value={mockLitiges.length + mockSignalements.length} label="Signalements / litiges" tone="red" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <DataChart data={data} dataKey="value" label="Inscriptions par mois" />
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Actions en attente</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-slate-300">
            <li className="rounded-lg bg-gray-50 p-3 dark:bg-slate-700">2 centres à valider</li>
            <li className="rounded-lg bg-gray-50 p-3 dark:bg-slate-700">3 signalements à traiter</li>
            <li className="rounded-lg bg-gray-50 p-3 dark:bg-slate-700">1 litige ouvert</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

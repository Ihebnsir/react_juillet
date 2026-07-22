import React from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminStatGrid from '../../components/admin/AdminStatGrid';
import QuickActions from '../../components/admin/QuickActions';
import TopList from '../../components/admin/TopList';
import { DataChart } from '../../components/dashboard/DataChart';
import { mockUsers } from '../../data/mockUsers';
import { mockCentres } from '../../data/mockCentres';
import { mockFormations } from '../../data/mockFormations';

export const DashboardPage = () => {
  const monthly = [
    { name: 'Jan', value: 12 },
    { name: 'Fév', value: 18 },
    { name: 'Mar', value: 15 },
    { name: 'Avr', value: 22 },
    { name: 'Mai', value: 19 },
    { name: 'Jui', value: 27 },
  ];

  const stats = [
    { label: 'Utilisateurs', value: mockUsers.length, delta: '+4% ce mois' },
    { label: 'Centres', value: mockCentres.length, delta: '+1% ce mois' },
    { label: 'Formations', value: mockFormations.length, delta: '-2% ce mois' },
    { label: 'Réservations', value: 1245, delta: '+8% ce mois' },
  ];

  const topCentres = mockCentres.slice(0, 5).map(c => ({ name: c.name || c.id, meta: c.city, value: `${c.averageRating || 4.5}★` }));
  const topFormations = mockFormations.slice(0, 5).map(f => ({ name: f.title, meta: f.category, value: `${f.progress || 0}%` }));

  return (
    <div className="space-y-6">
      <AdminHeader title="Control Center" subtitle="Vue d'ensemble et actions rapides" />

      <AdminStatGrid stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white/5 p-6 shadow-md border border-white/6">
            <h3 className="text-lg font-semibold text-white">Inscriptions — dernier trimestre</h3>
            <div className="mt-4">
              <DataChart data={monthly} dataKey="value" label="Inscriptions" />
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 shadow-md border border-white/6">
            <h3 className="text-lg font-semibold text-white">Activité récente</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>Nouvelle formation publiée: React Avancé</li>
              <li>Centre validé: Web Academy</li>
              <li>Signalement trié: Utilisateur X</li>
            </ul>
          </div>
        </div>

        <aside className="space-y-6">
          <QuickActions />
          <TopList title="Top centres" items={topCentres} />
          <TopList title="Top formations" items={topFormations} />
        </aside>
      </div>
    </div>
  );
}

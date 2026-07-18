import React from 'react';
import { motion } from 'framer-motion';
import { mockCentres } from '../../data/mockCentres';
import { mockFormations } from '../../data/mockFormations';
import { mockReservations } from '../../data/mockReservations';
import { AnimatedStatCard } from '../../components/dashboard/AnimatedStatCard';
import { DataChart } from '../../components/dashboard/DataChart';
import { EmptyState } from '../../components/dashboard/EmptyState';
import { FiBookOpen, FiCalendar, FiTrendingUp, FiStar, FiCheckCircle, FiClock, FiShield, FiXCircle } from 'react-icons/fi';

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

  const statutConfig = {
    active: { color: 'brand', icon: FiCheckCircle, label: 'Active' },
    en_attente: { color: 'sunset', icon: FiClock, label: 'En attente' },
    verifie: { color: 'brand', icon: FiShield, label: 'Vérifié' },
    rejete: { color: 'red', icon: FiXCircle, label: 'Rejeté' },
  };

  const StatutBadge = ({ statut }) => {
    const config = statutConfig[statut] || statutConfig.en_attente;
    const Icon = config.icon;
    return (
      <span className={`badge inline-flex items-center gap-1.5 bg-${config.color}-500/15 text-${config.color}-600 dark:text-${config.color}-400`}>
        <Icon size={13} /> {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className={`relative overflow-hidden rounded-3xl p-8 text-white ${centre.verifie ? 'bg-gradient-to-br from-brand-600 to-brand-800' : 'bg-gradient-to-br from-sunset-600 to-sunset-700'}`}>
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10">
          <p className="mb-1 text-sm font-medium uppercase tracking-wide text-white/80">Centre de formation</p>
          <h1 className="text-2xl font-display font-bold md:text-3xl">{centre.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium">{centre.verifie ? 'Centre vérifié' : 'En attente de vérification'}</span>
            <StatutBadge statut={centre.verifie ? 'verifie' : 'en_attente'} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <AnimatedStatCard icon={FiBookOpen} value={mockFormations.filter((item) => item.centreId === 'centre-1').length} label="Formations publiées" tone="brand" delay={0.04} />
        <AnimatedStatCard icon={FiCalendar} value={reservations.length} label="Réservations en cours" tone="accent" delay={0.1} />
        <AnimatedStatCard icon={FiTrendingUp} value="78" label="Taux de remplissage" tone="emerald" delay={0.16} />
        <AnimatedStatCard icon={FiStar} value={centre.noteMoyenne.toFixed(1)} label="Note moyenne" tone="sunset" delay={0.22} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <DataChart data={data} dataKey="value" label="Réservations par mois" />
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Dernières réservations reçues</h2>
          {reservations.length > 0 ? (
            <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-slate-300">
              {reservations.map((reservation, index) => (
                <motion.li
                  key={reservation.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-700"
                >
                  {reservation.status} — {reservation.date}
                </motion.li>
              ))}
            </ul>
          ) : <EmptyState title="Aucune réservation" description="Vos réservations apparaîtront ici dès qu’elles seront reçues." />}
        </div>
      </div>
    </div>
  );
};

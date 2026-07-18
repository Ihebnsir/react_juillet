import React from 'react';
import { motion } from 'framer-motion';
import { mockUsers } from '../../data/mockUsers';
import { mockCentres } from '../../data/mockCentres';
import { mockFormations } from '../../data/mockFormations';
import { mockLitiges } from '../../data/mockLitiges';
import { mockSignalements } from '../../data/mockSignalements';
import { AnimatedStatCard } from '../../components/dashboard/AnimatedStatCard';
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
      <div className="relative mb-2 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10">
          <p className="mb-1 text-sm font-medium uppercase tracking-wide text-brand-100">Administration</p>
          <h1 className="text-2xl font-display font-bold md:text-3xl">Vue d'ensemble de la plateforme</h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <AnimatedStatCard icon={FiUsers} value={mockUsers.length} label="Utilisateurs" tone="brand" delay={0.04} />
        <AnimatedStatCard icon={FiBookOpen} value={mockCentres.length} label="Centres" tone="accent" delay={0.08} />
        <AnimatedStatCard icon={FiCalendar} value={mockFormations.length} label="Formations publiées" tone="emerald" delay={0.12} />
        <AnimatedStatCard icon={FiDollarSign} value="12500" label="Chiffre d'affaires" tone="sunset" delay={0.16} />
        <AnimatedStatCard icon={FiAlertTriangle} value={mockLitiges.length + mockSignalements.length} label="Signalements / litiges" tone="brand" delay={0.2} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <DataChart data={data} dataKey="value" label="Inscriptions par mois" />
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Actions en attente</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-slate-300">
            {['2 centres à valider', '3 signalements à traiter', '1 litige ouvert'].map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-700"
              >
                {item}
              </motion.li>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

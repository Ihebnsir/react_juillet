import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { mockReservations } from '../../data/mockReservations';
import { mockFormations } from '../../data/mockFormations';
import { AnimatedStatCard } from '../../components/dashboard/AnimatedStatCard';
import { ProgressBar } from '../../components/dashboard/ProgressBar';
import { EmptyState } from '../../components/dashboard/EmptyState';
import { FiCalendar, FiBookOpen, FiCheckCircle, FiAward } from 'react-icons/fi';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const learnerReservations = mockReservations.filter((reservation) => reservation.learnerId === 1);
  const activeFormations = mockFormations.filter((formation) => formation.learnerId === 'learner-1' && formation.status !== 'completed');
  const completed = learnerReservations.filter((reservation) => reservation.status === 'terminée').length;
  const pending = learnerReservations.filter((reservation) => reservation.status === 'en attente').length;
  const confirmed = learnerReservations.filter((reservation) => reservation.status === 'confirmée').length;
  const certificationCount = completed > 0 ? 2 : 1;
  const displayName = user?.name || user?.nom || user?.email?.split('@')[0] || 'Apprenant';
  const firstName = displayName.toString().split(' ')[0];

  return (
    <div className="space-y-6">
      <div className="relative mb-2 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10">
          <p className="mb-1 text-sm font-medium uppercase tracking-wide text-brand-100">{t('dashboard.eyebrow')}</p>
          <h1 className="text-2xl font-display font-bold md:text-3xl">{t('dashboard.greeting', { name: firstName })} 👋</h1>
          <p className="mt-2 max-w-2xl text-sm text-brand-100">Voici un résumé de votre activité sur SkillBridge</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <AnimatedStatCard icon={FiBookOpen} value={confirmed} label="Réservations confirmées" subtitle="Données réelles" tone="brand" delay={0.04} />
        <AnimatedStatCard icon={FiCalendar} value={pending} label="En attente" subtitle="À valider" tone="accent" delay={0.1} />
        <AnimatedStatCard icon={FiCheckCircle} value={completed} label="Terminées" subtitle="Certificats disponibles" tone="emerald" delay={0.16} />
        <AnimatedStatCard icon={FiAward} value={certificationCount} label="Certifications" subtitle="1 stage à télécharger" tone="sunset" delay={0.22} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Progression des formations en cours</h2>
          <div className="mt-4 space-y-4">
            {activeFormations.length > 0 ? activeFormations.map((formation, index) => (
              <motion.div
                key={formation.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProgressBar value={formation.progress} label={formation.title} />
              </motion.div>
            )) : <EmptyState title="Aucune formation en cours" description="Vous n’avez encore aucune formation en progression." />}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Prochaines sessions</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-slate-300">
            {['React Avancé — 15 août — Tech Academy Tunis', 'UI/UX Design — 20 juillet — Digital Design Institute'].map((item, index) => (
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
          </ul>
        </div>
      </div>
    </div>
  );
};

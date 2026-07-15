import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { mockReservations } from '../../data/mockReservations';
import { mockFormations } from '../../data/mockFormations';
import { StatCard } from '../../components/dashboard/StatCard';
import { ProgressBar } from '../../components/dashboard/ProgressBar';
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
      <div className="rounded-3xl bg-gradient-to-r from-teal-600 to-cyan-700 p-6 text-white shadow-sm">
        <p className="text-sm uppercase tracking-wide text-teal-100">{t('dashboard.eyebrow')}</p>
        <h1 className="mt-2 text-2xl font-semibold">{t('dashboard.greeting', { name: firstName })}</h1>
        <p className="mt-2 max-w-2xl text-sm text-teal-50">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={FiBookOpen} value={confirmed} label="Réservations confirmées" variation="Données réelles" tone="green" />
        <StatCard icon={FiCalendar} value={pending} label="En attente" variation="À valider" tone="orange" />
        <StatCard icon={FiCheckCircle} value={completed} label="Terminées" variation="Certificats disponibles" tone="teal" />
        <StatCard icon={FiAward} value={certificationCount} label="Certifications" variation="1 stage à télécharger" tone="teal" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Progression des formations en cours</h2>
          <div className="mt-4 space-y-4">
            {activeFormations.length > 0 ? activeFormations.map((formation) => (
              <ProgressBar key={formation.id} value={formation.progress} label={formation.title} />
            )) : <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Aucune formation en cours pour le moment.</p>}
          </div>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Prochaines sessions</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-slate-300">
            <li className="rounded-2xl bg-gray-50 p-3 dark:bg-slate-700">React Avancé — 15 août — Tech Academy Tunis</li>
            <li className="rounded-2xl bg-gray-50 p-3 dark:bg-slate-700">UI/UX Design — 20 juillet — Digital Design Institute</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { mockReservations } from '../../data/mockReservations';
import { mockFormations } from '../../data/mockFormations';
import { AnimatedStatCard } from '../../components/dashboard/AnimatedStatCard';
import { ProgressBar } from '../../components/dashboard/ProgressBar';
import { EmptyState } from '../../components/dashboard/EmptyState';
import { ActivityHeatmap } from '../../components/dashboard/ActivityHeatmap';
import { FiCalendar, FiBookOpen, FiCheckCircle, FiAward, FiTarget, FiArrowRight, FiDollarSign, FiDownload } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { FormationCard } from '../../components/Cards/FormationCard';
import { getRecommandationsForUser } from '../../services/apprenantExperienceService';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const learnerReservations = mockReservations.filter((reservation) => reservation.learnerId === 1);
  const activeFormations = mockFormations.filter((formation) => formation.learnerId === 'learner-1' && formation.status !== 'completed');
  const completed = learnerReservations.filter((reservation) => reservation.status === 'terminée').length;
  const pending = learnerReservations.filter((reservation) => reservation.status === 'en attente').length;
  const confirmed = learnerReservations.filter((reservation) => reservation.status === 'confirmée').length;
  const certificationCount = completed > 0 ? 2 : 1;
  const totalInvesti = learnerReservations.reduce((sum, reservation) => {
    const formation = mockFormations.find((item) => item.id === reservation.formationId);
    return sum + (formation?.price || 0);
  }, 0);
  const recommandations = getRecommandationsForUser(user?.id || 1);
  const competences = [
    { domaine: 'Dev Web', niveau: 80 },
    { domaine: 'UI/UX', niveau: 65 },
    { domaine: 'Data', niveau: 40 },
    { domaine: 'Agile', niveau: 72 },
    { domaine: 'Marketing', niveau: 35 },
  ];
  const sessionsDuMois = [
    { date: '2026-07-15', title: 'React Avancé' },
    { date: '2026-07-20', title: 'UI/UX Design' },
  ];
  const certifications = [
    { id: 'cert-1', titre: 'React Avancé' },
    { id: 'cert-2', titre: 'UI/UX Design' },
  ];
  const displayName = user?.name || user?.nom || user?.email?.split('@')[0] || 'Apprenant';
  const firstName = displayName.toString().split(' ')[0];
  const activiteParJour = React.useMemo(() => {
    const entries = [];
    for (let i = 83; i >= 0; i -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      entries.push({ date: date.toISOString().slice(0, 10), niveau: 0 });
    }

    learnerReservations.forEach((reservation) => {
      const existing = entries.find((entry) => entry.date === reservation.date);
      if (existing) existing.niveau += 1;
    });

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dayBefore = new Date(today);
    dayBefore.setDate(today.getDate() - 2);

    const todayEntry = entries.find((entry) => entry.date === today.toISOString().slice(0, 10));
    const yesterdayEntry = entries.find((entry) => entry.date === yesterday.toISOString().slice(0, 10));
    const dayBeforeEntry = entries.find((entry) => entry.date === dayBefore.toISOString().slice(0, 10));

    if (todayEntry) todayEntry.niveau += 1;
    if (yesterdayEntry) yesterdayEntry.niveau += 2;
    if (dayBeforeEntry) dayBeforeEntry.niveau += 1;

    return entries;
  }, [learnerReservations]);

  const genererJoursDuMois = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const days = [];
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().slice(0, 10);
      days.push({
        numero: date.getDate(),
        dateStr,
        estAujourdhui: date.toDateString() === today.toDateString(),
      });
    }
    return days;
  };

  const telechargerCertificat = (id) => {
    window.alert(`Téléchargement du certificat ${id}`);
  };

  const joursDuMois = genererJoursDuMois();

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

      <div className="grid gap-4 md:grid-cols-5">
        <AnimatedStatCard icon={FiBookOpen} value={confirmed} label="Réservations confirmées" subtitle="Données réelles" tone="brand" delay={0.04} />
        <AnimatedStatCard icon={FiCalendar} value={pending} label="En attente" subtitle="À valider" tone="accent" delay={0.1} />
        <AnimatedStatCard icon={FiCheckCircle} value={completed} label="Terminées" subtitle="Certificats disponibles" tone="emerald" delay={0.16} />
        <AnimatedStatCard icon={FiAward} value={certificationCount} label="Certifications" subtitle="1 stage à télécharger" tone="sunset" delay={0.22} />
        <AnimatedStatCard icon={FiDollarSign} value={totalInvesti} label="Total investi" subtitle="DT" tone="sunset" delay={0.28} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="card border-accent-500/30 bg-gradient-to-br from-accent-600/20 to-transparent p-6">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent-400">
              <FiTarget size={14} /> Prochaine étape
            </div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              Il vous reste {activeFormations[0]?.progress ? 100 - activeFormations[0].progress : 35} modules pour terminer {activeFormations[0]?.title || 'React Avancé'}
            </p>
            <Link to={activeFormations[0] ? `/formations/${activeFormations[0].id}` : '/formations'} className="btn-primary mt-3 inline-flex items-center gap-2 text-sm">
              Continuer <FiArrowRight size={14} />
            </Link>
          </div>

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
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Recommandé pour vous</h3>
              <Link to="/recommandations" className="text-sm text-accent-400 hover:underline">Tout voir →</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {recommandations.slice(0, 3).map((reco) => (
                <div key={reco.id} className="w-40 shrink-0">
                  <FormationCard formation={reco.formation} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ActivityHeatmap activiteParJour={activiteParJour} />
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Mes compétences</h3>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={competences}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="domaine" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <Radar dataKey="niveau" stroke="#42D1B3" fill="#42D1B3" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
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
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Calendrier du mois</h3>
            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((jour, index) => (
                <div key={`${jour}-${index}`} className="pb-1 font-medium text-slate-500">{jour}</div>
              ))}
              {joursDuMois.map((jour, index) => {
                const aUneSession = sessionsDuMois.some((session) => session.date === jour.dateStr);
                return (
                  <div
                    key={`${jour.dateStr}-${index}`}
                    className={`flex aspect-square items-center justify-center rounded-lg ${aUneSession ? 'bg-brand-500 font-semibold text-white' : jour.estAujourdhui ? 'bg-slate-700 text-slate-100' : 'text-slate-400'}`}
                  >
                    {jour.numero}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Téléchargements rapides</h3>
            <div className="mt-4 space-y-2">
              {certifications.map((certification) => (
                <div key={certification.id} className="flex items-center justify-between rounded-lg p-2.5 hover:bg-white/5">
                  <span className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"><FiAward size={14} className="text-amber-400" /> {certification.titre}</span>
                  <button type="button" onClick={() => telechargerCertificat(certification.id)} className="text-accent-400 hover:text-accent-300">
                    <FiDownload size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

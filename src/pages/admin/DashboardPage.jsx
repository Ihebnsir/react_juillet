import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBell, FiBookOpen, FiCheckCircle, FiMapPin, FiUsers, FiZap } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { useAdminDashboardData } from '../../hooks/useAdminDashboardData';
import { useNotifications } from '../../context/NotificationContext';
import AlertsCenter from '../../components/admin/AlertsCenter';
import QuickActionsPanel from '../../components/admin/QuickActionsPanel';
import ActivityTimeline from '../../components/admin/ActivityTimeline';
import { getPlatformHealthLabel } from '../../utils/adminDashboardUtils';

const DashboardSkeleton = () => (
  <div className="space-y-6 pb-8">
    <div className="h-40 animate-pulse rounded-3xl bg-slate-800/70" />
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <div className="h-60 animate-pulse rounded-3xl bg-slate-800/70" />
        <div className="h-48 animate-pulse rounded-3xl bg-slate-800/70" />
      </div>
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-3xl bg-slate-800/70" />
        <div className="h-48 animate-pulse rounded-3xl bg-slate-800/70" />
      </div>
    </div>
  </div>
);

const OverviewCards = ({ data }) => {
  const items = [
    { label: 'Apprenants', value: data.totalUsers, icon: FiUsers, tone: 'text-brand-500' },
    { label: 'Centres actifs', value: data.verifiedCentres, icon: FiMapPin, tone: 'text-sky-500' },
    { label: 'Formations actives', value: data.totalFormations, icon: FiBookOpen, tone: 'text-violet-500' },
    { label: 'Alertes', value: data.alerts.length, icon: FiBell, tone: 'text-amber-500' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
            <item.icon className={item.tone} />
          </div>
          <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export const DashboardPage = () => {
  const data = useAdminDashboardData();
  const [loading, setLoading] = useState(true);
  const healthLabel = getPlatformHealthLabel(data.globalScore);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 250);
    return () => window.clearTimeout(timer);
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 pb-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">Centre de pilotage</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Supervision quotidienne SkillBridge</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">Vue simple et claire de la santé plateforme, des alertes et des actions prioritaires.</p>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">{healthLabel} • {data.globalScore}%</div>
        </div>
      </motion.div>

      <OverviewCards data={data} />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <AlertsCenter alerts={data.alerts} />
          <QuickActionsPanel />
          <ActivityTimeline />
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-2">
              <FiZap className="text-amber-500" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Santé plateforme</h3>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">État général de la plateforme calculé à partir de l’activité, des centres et des signalements.</p>
            <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-700/40">Utilisateurs actifs : <span className="font-semibold text-slate-900 dark:text-slate-100">{data.activeUsers}</span></div>
              <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-700/40">Nouveaux inscrits ce mois : <span className="font-semibold text-slate-900 dark:text-slate-100">{data.newUsersThisMonth}</span></div>
              <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-700/40">Centres à valider : <span className="font-semibold text-slate-900 dark:text-slate-100">{data.centersToVerify}</span></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-2">
              <FiBell className="text-brand-500" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Actions prioritaires</h3>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {data.alerts.slice(0, 3).map((alert) => (
                <li key={alert.id} className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-700/40">{alert.message}</li>
              ))}
            </ul>
            <button type="button" onClick={() => navigate('/admin/analytics')} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600">
              Ouvrir Analytics <FiArrowRight />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


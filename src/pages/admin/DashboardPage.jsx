import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiArrowRight, FiBell, FiHome, FiShield, FiUsers, FiBookOpen, FiFileText } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { useAdminDashboardData } from '../../hooks/useAdminDashboardData';
import ActivityTimeline from '../../components/admin/ActivityTimeline';
import { AdminPageShell } from '../../components/admin/AdminPageShell';
import { Badge } from '../../components/UI/Badge';
import { KpiCard } from '../../components/UI/KpiCard';
import { Panel } from '../../components/UI/Panel';
import { SectionHeader } from '../../components/UI/SectionHeader';

const DashboardSkeleton = () => (
  <div className="space-y-6 pb-8">
    <div className="h-32 animate-pulse rounded-[32px] bg-slate-800/70" />
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.95fr]">
      <div className="space-y-6">
        <div className="h-72 animate-pulse rounded-[32px] bg-slate-800/70" />
        <div className="h-56 animate-pulse rounded-[32px] bg-slate-800/70" />
      </div>
      <div className="space-y-6">
        <div className="h-56 animate-pulse rounded-[32px] bg-slate-800/70" />
        <div className="h-44 animate-pulse rounded-[32px] bg-slate-800/70" />
      </div>
    </div>
  </div>
);

const SectionKpis = ({ items }) => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    {items.map((metric) => (
      <KpiCard
        key={metric.label}
        label={metric.label}
        value={metric.value}
        delta={metric.delta}
        icon={metric.icon}
        tone={metric.tone}
      />
    ))}
  </div>
);

const ModuleCard = ({ title, summary, status, badge, onOpen, icon: Icon }) => (
  <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-slate-950/20">
    <div className="flex items-center justify-between gap-3">
      <div className="rounded-2xl bg-white/5 p-3 text-slate-200">
        <Icon size={18} />
      </div>
      <Badge label={status} tone={status === 'Critique' ? 'danger' : status === 'Attention' ? 'warning' : 'brand'} />
    </div>
    <p className="mt-5 text-sm uppercase tracking-[0.24em] text-slate-500">{title}</p>
    <p className="mt-3 text-2xl font-semibold text-white">{summary}</p>
    <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
      <span>{badge}</span>
      <button
        type="button"
        onClick={onOpen}
        className="text-sm font-semibold text-brand-400 transition hover:text-brand-300"
      >
        Ouvrir
      </button>
    </div>
  </div>
);

const TaskCard = ({ title, description, priority, route, onNavigate }) => {
  const classes = priority === 'Haute'
    ? 'bg-rose-500/10 text-rose-200 border-rose-500/20'
    : priority === 'Moyenne'
      ? 'bg-amber-500/10 text-amber-200 border-amber-500/20'
      : 'bg-slate-700/80 text-slate-200 border-slate-700';

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-white">{title}</p>
          <p className="mt-2 text-sm text-slate-400">{description}</p>
        </div>
        <span className={`rounded-2xl border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${classes}`}>
          {priority}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onNavigate(route)}
        className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500"
      >
        Ouvrir
        <FiArrowRight size={16} />
      </button>
    </div>
  );
};

const AlertEvent = ({ event, onNavigate }) => (
  <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-slate-950/20">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400 uppercase tracking-[0.2em]">
          <Badge label={event.priority} tone={event.priority === 'Critique' ? 'danger' : event.priority === 'Élevée' ? 'warning' : 'slate'} />
          <span>{event.time}</span>
          <span>{event.user}</span>
        </div>
        <p className="text-base font-semibold text-white">{event.title}</p>
        <p className="text-sm text-slate-400">{event.details}</p>
      </div>
      <button
        type="button"
        onClick={() => onNavigate(event.route)}
        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        Détail
      </button>
    </div>
  </div>
);

const RecommendationCard = ({ recommendation, onNavigate }) => (
  <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-slate-950/20">
    <p className="font-semibold text-white">{recommendation.title}</p>
    <button
      type="button"
      onClick={() => onNavigate(recommendation.route)}
      className="mt-3 rounded-2xl bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
    >
      {recommendation.action}
    </button>
  </div>
);

const ShortcutButton = ({ label, route, onNavigate }) => (
  <button
    type="button"
    onClick={() => onNavigate(route)}
    className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4 text-left text-sm font-semibold text-white transition hover:border-brand-500 hover:bg-slate-900"
  >
    {label}
  </button>
);

const CalendarCard = ({ event }) => (
  <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-slate-950/20">
    <div className="flex items-center gap-3">
      <span className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold text-white ${event.dot}`} />
      <div>
        <p className="font-semibold text-white">{event.title}</p>
        <p className="text-sm text-slate-400">{event.label}</p>
      </div>
    </div>
    <p className="mt-4 text-sm text-slate-300">{event.time}</p>
  </div>
);

const HealthRow = ({ label, value, status }) => (
  <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200">
    <div>
      <p className="font-semibold text-white">{label}</p>
      <p className="text-slate-400">{value}</p>
    </div>
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status === 'OK' ? 'bg-emerald-500/10 text-emerald-200' : status === 'Élevée' ? 'bg-amber-500/10 text-amber-200' : 'bg-rose-500/10 text-rose-200'}`}>
      {status}
    </span>
  </div>
);

const DashboardPage = () => {
  const data = useAdminDashboardData();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const mainKpis = useMemo(() => [
    { label: 'Alertes critiques', value: data.alerts.length, delta: `${data.slaBreached} SLA`, icon: FiAlertTriangle, tone: 'rose' },
    { label: 'Litiges ouverts', value: data.openLitiges, delta: `${data.criticalLitiges} critiques`, icon: FiShield, tone: 'brand' },
    { label: 'Centres à valider', value: data.centersToVerify, delta: `${data.pendingCentres} en attente`, icon: FiHome, tone: 'amber' },
    { label: 'Signalements', value: data.pendingSignalements, delta: `${data.pendingSignalements > 0 ? 'Action requise' : 'À jour'}`, icon: FiBell, tone: 'sky' },
  ], [data]);

  const alertFeed = useMemo(() => {
    const users = ['Julie', 'Support', 'Centre Nova', 'Équipe Produit', 'Administrateur'];
    return data.alerts.map((alert, idx) => ({
      id: alert.id,
      title: alert.message,
      details: `Un événement détecté sur ${users[idx % users.length]}.`,
      priority: alert.type === 'danger' ? 'Critique' : alert.type === 'warning' ? 'Élevée' : 'Normale',
      time: `${9 + idx}:${10 + idx * 7 < 10 ? `0${10 + idx * 7}` : 10 + idx * 7}`,
      user: users[idx % users.length],
      route: alert.actionLink || '/admin',
    }));
  }, [data.alerts]);

  const tasks = useMemo(() => [
    {
      id: 'litiges',
      title: `${data.openLitiges} litiges en attente`,
      description: 'Traiter les dossiers ouverts depuis plus de 48h.',
      priority: 'Haute',
      route: '/admin/litiges',
    },
    {
      id: 'moderation',
      title: `${data.pendingSignalements} contenus à modérer`,
      description: 'Vérifier les signalements récents.',
      priority: 'Moyenne',
      route: '/admin/moderation',
    },
    {
      id: 'centres',
      title: `${data.centersToVerify} centres en validation`,
      description: 'Finaliser les validations en attente.',
      priority: 'Haute',
      route: '/admin/centres-en-attente',
    },
    {
      id: 'support',
      title: `${Math.max(2, data.pendingSignalements)} demandes d’assistance`,
      description: 'Répondre aux tickets urgents.',
      priority: 'Moyenne',
      route: '/admin/contact',
    },
  ], [data.openLitiges, data.pendingSignalements, data.centersToVerify]);

  const moduleCards = useMemo(() => [
    {
      title: 'Utilisateurs',
      summary: `${data.totalUsers} total`,
      status: data.userGrowth >= 0 ? 'Sain' : 'Attention',
      badge: `${data.userGrowth >= 0 ? '+' : ''}${data.userGrowth}%`,
      icon: FiUsers,
      route: '/admin/utilisateurs',
    },
    {
      title: 'Centres',
      summary: `${data.verifiedCentres}/${data.totalCentres} vérifiés`,
      status: data.centreValidationRate >= 80 ? 'Sain' : 'Attention',
      badge: `${data.centreGrowth >= 0 ? '+' : ''}${data.centreGrowth}%`,
      icon: FiHome,
      route: '/admin/centres-en-attente',
    },
    {
      title: 'Formations',
      summary: `${data.totalFormations} publiées`,
      status: data.totalFormations > 10 ? 'Sain' : 'Attention',
      badge: `${data.reservationGrowth >= 0 ? '+' : ''}${data.reservationGrowth}%`,
      icon: FiBookOpen,
      route: '/admin/analytics',
    },
    {
      title: 'Litiges',
      summary: `${data.openLitiges} ouverts`,
      status: data.criticalLitiges > 0 ? 'Critique' : 'Sain',
      badge: `${data.slaBreached} SLA`,
      icon: FiShield,
      route: '/admin/litiges',
    },
    {
      title: 'Modération',
      summary: `${data.pendingSignalements} signalements`,
      status: data.pendingSignalements > 3 ? 'Attention' : 'Sain',
      badge: data.pendingSignalements > 0 ? 'En attente' : 'N/A',
      icon: FiFileText,
      route: '/admin/moderation',
    },
  ], [data]);

  const systemEvents = useMemo(() => [
    { time: '10:15', title: 'Connexion administrateur', description: 'Session administrateur active.' },
    { time: '10:22', title: 'Nouveau litige', description: `${data.openLitiges} litiges ouverts.` },
    { time: '10:31', title: 'Formation publiée', description: `${data.totalFormations} formations disponibles.` },
    { time: '10:40', title: 'Centre validé', description: `${data.verifiedCentres} centres vérifiés.` },
  ], [data.openLitiges, data.totalFormations, data.verifiedCentres]);

  const recommendations = useMemo(() => {
    const items = [];
    if (data.slaBreached > 0) {
      items.push({
        id: 'sla',
        title: 'Un litige dépasse le SLA.',
        action: 'Traiter maintenant',
        route: '/admin/litiges',
      });
    }
    if (data.pendingSignalements > 0) {
      items.push({
        id: 'signalements',
        title: 'Plusieurs signalements nécessitent une vérification.',
        action: 'Voir la modération',
        route: '/admin/moderation',
      });
    }
    if (data.centersToVerify > 0) {
      items.push({
        id: 'centres',
        title: 'Des centres restent en attente de validation.',
        action: 'Valider les centres',
        route: '/admin/centres-en-attente',
      });
    }
    if (items.length === 0) {
      items.push({
        id: 'smooth',
        title: 'Aucun risque critique détecté pour le moment.',
        action: 'Voir le tableau de bord',
        route: '/admin',
      });
    }
    return items.slice(0, 4);
  }, [data.centersToVerify, data.pendingSignalements, data.slaBreached]);

  const shortcuts = useMemo(() => [
    { id: 'add-centre', label: 'Ajouter un centre', route: '/admin/centres-en-attente' },
    { id: 'create-formation', label: 'Créer une formation', route: '/formations' },
    { id: 'manage-users', label: 'Gérer les utilisateurs', route: '/admin/utilisateurs' },
    { id: 'open-litiges', label: 'Ouvrir les litiges', route: '/admin/litiges' },
    { id: 'open-moderation', label: 'Ouvrir la modération', route: '/admin/moderation' },
    { id: 'reports', label: 'Voir les rapports', route: '/admin/analytics' },
  ], []);

  const calendarEvents = useMemo(() => [
    { id: 'audit', time: '09:00', title: 'Audit de conformité', label: 'Audit', dot: 'bg-brand-500' },
    { id: 'deadline', time: '11:30', title: 'Échéance SLA', label: 'Échéance', dot: 'bg-amber-500' },
    { id: 'meeting', time: '14:00', title: 'Réunion équipe produit', label: 'Réunion', dot: 'bg-sky-500' },
    { id: 'maintenance', time: '16:15', title: 'Maintenance API', label: 'Maintenance', dot: 'bg-rose-500' },
  ], []);

  const healthChecks = useMemo(() => [
    { label: 'Disponibilité services', value: '99.98%', status: 'OK' },
    { label: 'File d’attente', value: `${data.pendingSignalements} items`, status: data.pendingSignalements > 5 ? 'Élevée' : 'Faible' },
    { label: 'Synchronisation', value: 'Stable', status: 'OK' },
    { label: 'Sauvegarde', value: 'Terminée', status: 'OK' },
    { label: 'API', value: 'Réponse 120ms', status: 'OK' },
  ], [data.pendingSignalements]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 250);
    return () => window.clearTimeout(timer);
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <AdminPageShell
      eyebrow="Centre de pilotage"
      title="Dashboard opérationnel"
      subtitle="Priorisez les actions, surveillez les risques et pilotez l’activité sans perdre de temps."
      badge={`${data.globalScore}% santé plateforme`}
    >
      <div className="space-y-6 pb-10">
        <SectionHeader
          eyebrow="Vue opérationnelle"
          title="Ce qui mérite votre attention maintenant"
          description="Un vrai cockpit pour les administrateurs : alertes, tâches urgentes, événements et recommandations."
          actions={(
            <button
              type="button"
              onClick={() => navigate('/admin/analytics')}
              className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500"
            >
              Voir Analytics
            </button>
          )}
        />

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <SectionKpis items={mainKpis} />
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.95fr]">
          <div className="space-y-6">
            <Panel eyebrow="Centre d’alertes" title="Événements critiques" description="Alertes opérationnelles nécessitant une action immédiate.">
              <div className="space-y-4">
                {alertFeed.length > 0 ? alertFeed.map((event) => (
                  <AlertEvent key={event.id} event={event} onNavigate={navigate} />
                )) : (
                  <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-center text-slate-400">Aucune alerte critique détectée.</div>
                )}
              </div>
            </Panel>

            <Panel eyebrow="Activité récente" title="Timeline en temps réel" description="Les actions récentes qui impactent la plateforme.">
              <ActivityTimeline />
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel eyebrow="Actions prioritaires" title="Tâches à traiter" description="Interventions urgentes qui doivent être assignées rapidement.">
              <div className="space-y-4">
                {tasks.map((task) => (
                  <TaskCard key={task.id} {...task} onNavigate={navigate} />
                ))}
              </div>
            </Panel>

            <Panel eyebrow="Vue globale" title="Modules essentiels" description="État rapide des quatre modules principaux.">
              <div className="grid gap-4 sm:grid-cols-2">
                {moduleCards.map((card) => (
                  <ModuleCard key={card.title} {...card} onOpen={() => navigate(card.route)} />
                ))}
              </div>
            </Panel>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.95fr]">
          <div className="space-y-6">
            <Panel eyebrow="Flux système" title="Événements récents" description="Dernières actions importantes en provenance du système.">
              <div className="space-y-3">
                {systemEvents.map((event) => (
                  <div key={event.time} className="grid gap-3 rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-slate-950/20 sm:grid-cols-[auto_1fr] sm:items-center">
                    <div className="rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">{event.time}</div>
                    <div>
                      <p className="font-semibold text-white">{event.title}</p>
                      <p className="text-sm text-slate-400">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel eyebrow="Recommandations" title="Actions suggérées" description="Suggestions opérationnelles générées par le système.">
              <div className="space-y-3">
                {recommendations.map((recommendation) => (
                  <RecommendationCard key={recommendation.id} recommendation={recommendation} onNavigate={navigate} />
                ))}
              </div>
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel eyebrow="Raccourcis" title="Accès rapide" description="Actions les plus utilisées par les administrateurs.">
              <div className="grid gap-3 sm:grid-cols-2">
                {shortcuts.map((shortcut) => (
                  <ShortcutButton key={shortcut.id} {...shortcut} onNavigate={navigate} />
                ))}
              </div>
            </Panel>

            <Panel eyebrow="Santé de la plateforme" title="Indicateurs clés" description="Un aperçu synthétique de l’état des services.">
              <div className="space-y-3">
                {healthChecks.map((check) => (
                  <HealthRow key={check.label} {...check} />
                ))}
              </div>
            </Panel>
          </div>
        </div>

        <Panel eyebrow="Calendrier" title="Événements importants" description="Audits, échéances, réunions et maintenances planifiés.">
          <div className="grid gap-4 lg:grid-cols-2">
            {calendarEvents.map((event) => (
              <CalendarCard key={event.id} event={event} />
            ))}
          </div>
        </Panel>
      </div>
    </AdminPageShell>
  );
};

export default DashboardPage;


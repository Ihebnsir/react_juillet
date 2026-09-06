import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiBookOpen, FiCalendar, FiDollarSign, FiMessageCircle, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { centresService } from '../../services/centresService';
import { formationsService } from '../../services/formationsService';
import { reservationsService } from '../../services/reservationsService';
import { messagingService } from '../../services/messagingService';
import { AnimatedStatCard } from '../../components/dashboard/AnimatedStatCard';
import { EmptyState } from '../../components/dashboard/EmptyState';

const statusLabels = { PENDING: 'En attente', CONFIRMED: 'Confirmée', COMPLETED: 'Terminée', CANCELLED: 'Annulée' };
const statusClasses = { PENDING: 'bg-amber-100 text-amber-700', CONFIRMED: 'bg-teal-100 text-teal-700', COMPLETED: 'bg-emerald-100 text-emerald-700', CANCELLED: 'bg-rose-100 text-rose-700' };

const SectionState = ({ loading, error, empty, title, description, onRetry }) => {
  if (loading) return <div className="animate-pulse rounded-2xl bg-slate-100 p-8 text-sm text-slate-500 dark:bg-slate-800">Chargement…</div>;
  if (error) return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">Impossible de charger cette section. <button type="button" onClick={onRetry} className="ml-2 font-semibold underline">Réessayer</button></div>;
  if (empty) return <EmptyState title={title} description={description} />;
  return null;
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [centre, setCentre] = useState(null);
  const [formations, setFormations] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [state, setState] = useState({ profile: 'loading', formations: 'idle', reservations: 'idle', conversations: 'loading' });
  const [errors, setErrors] = useState({});

  const loadProfileAndFormations = async () => {
    setState((current) => ({ ...current, profile: 'loading', formations: 'idle' }));
    try {
      const profile = await centresService.getMyCentre();
      setCentre(profile);
      setState((current) => ({ ...current, profile: 'ready', formations: 'loading' }));
      const ownedFormations = await formationsService.getByCentre(profile.id);
      setFormations(ownedFormations);
      setErrors((current) => ({ ...current, profile: null, formations: null }));
      setState((current) => ({ ...current, formations: 'ready' }));
    } catch (error) {
      setErrors((current) => ({ ...current, profile: error, formations: error }));
      setState((current) => ({ ...current, profile: 'error', formations: 'error' }));
    }
  };

  const loadReservations = useCallback(async (ownedFormations = formations) => {
    if (!ownedFormations.length) {
      setReservations([]);
      setState((current) => ({ ...current, reservations: 'ready' }));
      return;
    }
    setState((current) => ({ ...current, reservations: 'loading' }));
    try {
      const responses = await Promise.all(ownedFormations.map((formation) => reservationsService.getReservationsParFormation(formation.id)));
      setReservations(responses.flat());
      setErrors((current) => ({ ...current, reservations: null }));
      setState((current) => ({ ...current, reservations: 'ready' }));
    } catch (error) {
      setErrors((current) => ({ ...current, reservations: error }));
      setState((current) => ({ ...current, reservations: 'error' }));
    }
  }, [formations]);

  const loadConversations = async () => {
    try {
      setConversations(await messagingService.getConversations());
      setState((current) => ({ ...current, conversations: 'ready' }));
    } catch (error) {
      setErrors((current) => ({ ...current, conversations: error }));
      setState((current) => ({ ...current, conversations: 'error' }));
    }
  };

  useEffect(() => { loadProfileAndFormations(); loadConversations(); }, []);
  useEffect(() => { if (state.formations === 'ready') loadReservations(formations); }, [state.formations, formations, loadReservations]);

  const stats = useMemo(() => ({
    formations: formations.length,
    reservations: reservations.length,
    learners: new Set(reservations.map((item) => String(item.learnerId || item.learner?._id || item.learner?.id)).filter((id) => id && id !== 'undefined')).size,
    paid: reservations.filter((item) => item.paid).reduce((total, item) => total + Number(item.price || 0), 0),
  }), [formations, reservations]);

  const profilePercent = centre?.profileCompletion ?? (centre?.checklist ? Math.round(Object.values(centre.checklist).filter(Boolean).length / Object.values(centre.checklist).length * 100) : null);
  const displayName = centre?.name || user?.name || 'Centre';

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.15)]"><p className="text-sm uppercase tracking-wide text-brand-100">Espace centre</p><h1 className="mt-2 text-2xl font-display font-bold md:text-3xl">Bonjour, {displayName}</h1><p className="mt-2 text-sm text-brand-100">{centre?.ville || centre?.email || user?.email || ''}</p></section>
      {state.profile === 'error' ? <SectionState error={errors.profile} onRetry={loadProfileAndFormations} /> : null}
      <div className="grid gap-4 md:grid-cols-4"><AnimatedStatCard icon={FiBookOpen} value={stats.formations} label="Formations" subtitle="Catalogue réel" tone="brand" /><AnimatedStatCard icon={FiCalendar} value={stats.reservations} label="Réservations" subtitle="Données réelles" tone="accent" /><AnimatedStatCard icon={FiUsers} value={stats.learners} label="Apprenants" subtitle="Dérivés des réservations" tone="emerald" /><AnimatedStatCard icon={FiDollarSign} value={stats.paid} label="Montant payé" subtitle="Calculé sur les réservations" tone="sunset" /></div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="card p-6"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Mes formations</h2><p className="text-sm text-slate-500">Centre ID: {centre?.id || '…'}</p></div><Link to="/centre/formations" className="text-sm text-accent-400 hover:underline">Gérer →</Link></div><SectionState loading={state.formations === 'loading'} error={errors.formations} empty={state.formations === 'ready' && formations.length === 0} title="Aucune formation" description="Publiez votre première formation pour la rendre visible." onRetry={loadProfileAndFormations} />{state.formations === 'ready' && formations.length > 0 ? <div className="space-y-3">{formations.slice(0, 6).map((formation) => <div key={formation.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3 dark:border-slate-700"><img src={formation.image || '/images/hero-fallback.jpg'} alt="" className="h-14 w-14 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="truncate font-semibold text-slate-900 dark:text-slate-100">{formation.title}</p><p className="truncate text-sm text-slate-500">{formation.category || formation.domain || 'Domaine non renseigné'} · {formation.duration || '-'}</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-200">{formation.status || 'Non renseigné'}</span></div>)}</div> : null}</section>
          <section className="card p-6"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Réservations</h2><Link to="/centre/reservations" className="text-sm text-accent-400 hover:underline">Voir →</Link></div><SectionState loading={state.reservations === 'loading'} error={errors.reservations} empty={state.reservations === 'ready' && reservations.length === 0} title="Aucune réservation" description="Les inscriptions à vos formations apparaîtront ici." onRetry={() => loadReservations()} />{state.reservations === 'ready' && reservations.length > 0 ? <div className="space-y-3">{reservations.slice(0, 6).map((reservation) => <div key={reservation.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3 dark:border-slate-700"><div className="min-w-0 flex-1"><p className="truncate font-medium text-slate-900 dark:text-slate-100">{reservation.learnerName || reservation.learner?.email || 'Apprenant'}</p><p className="text-sm text-slate-500">{reservation.formation?.title || reservation.formationTitle || 'Formation'} · {Number(reservation.price || 0).toLocaleString('fr-FR')} DT</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[reservation.status] || 'bg-slate-100 text-slate-600'}`}>{statusLabels[reservation.status] || reservation.status || 'Non renseigné'}</span></div>)}</div> : null}</section>
        </div>
        <div className="space-y-6">
          <section className="card p-6"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Notifications</h2><span className="rounded-full bg-brand-500/10 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300">{unreadCount} non lues</span></div>{notifications.length === 0 ? <p className="text-sm text-slate-500">Aucune notification récente.</p> : <div className="space-y-3">{notifications.slice(0, 4).map((item) => <div key={item.id} className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-700"><p className="font-medium text-slate-900 dark:text-slate-100">{item.title}</p><p className="mt-1 text-sm text-slate-500">{item.message}</p></div>)}</div>}</section>
          <section className="card p-6"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Messages</h2><Link to="/centre/messagerie" className="text-sm text-accent-400 hover:underline">Ouvrir →</Link></div><SectionState loading={state.conversations === 'loading'} error={errors.conversations} empty={state.conversations === 'ready' && conversations.length === 0} title="Aucun message" description="Les conversations avec vos apprenants apparaîtront ici." onRetry={loadConversations} />{state.conversations === 'ready' && conversations.length > 0 ? <div className="space-y-3">{conversations.slice(0, 4).map((conversation) => <div key={conversation.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-700"><FiMessageCircle className="text-brand-500" /><div className="min-w-0 flex-1"><p className="truncate font-medium text-slate-900 dark:text-slate-100">{conversation.participantName}</p><p className="truncate text-sm text-slate-500">{conversation.lastMessage || 'Aucun message'}</p></div>{conversation.unreadCount > 0 ? <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">{conversation.unreadCount}</span> : null}</div>)}</div> : null}</section>
          <section className="card p-6"><h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Profil et vérification</h2><p className="mt-2 text-sm text-slate-500">Statut: {centre?.statutVerification || 'Non renseigné'}</p>{centre?.motifRejet ? <p className="mt-2 text-sm text-rose-600">Motif: {centre.motifRejet}</p> : null}{profilePercent !== null ? <div className="mt-4"><div className="mb-1 flex justify-between text-sm"><span>Profil complété</span><span>{profilePercent}%</span></div><div className="h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-brand-500" style={{ width: `${profilePercent}%` }} /></div></div> : <p className="mt-3 text-sm text-slate-500">Progression du profil indisponible.</p>}</section>
          <section className="card p-6"><div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100"><FiAlertTriangle /> Données non disponibles</div><p className="mt-2 text-sm text-slate-500">Les revenus, sessions, présence, progression des apprenants et analytics globaux ne sont pas fournis par le backend.</p></section>
        </div>
      </div>
    </div>
  );
};

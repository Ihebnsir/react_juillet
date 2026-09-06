import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiAward, FiBookOpen, FiCalendar, FiCheckCircle, FiClock, FiDollarSign, FiMessageCircle } from 'react-icons/fi';
import { AnimatedStatCard } from '../../components/dashboard/AnimatedStatCard';
import { EmptyState } from '../../components/dashboard/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { messagingService } from '../../services/messagingService';
import { reservationsService } from '../../services/reservationsService';
import { certificationsService } from '../../services/certificationsService';

const statusLabels = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  COMPLETED: 'Terminée',
  CANCELLED: 'Annulée',
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  terminee: 'Terminée',
  annulee: 'Annulée',
};

const statusTone = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-teal-100 text-teal-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-rose-100 text-rose-700',
  en_attente: 'bg-amber-100 text-amber-700',
  confirmee: 'bg-teal-100 text-teal-700',
  terminee: 'bg-emerald-100 text-emerald-700',
  annulee: 'bg-rose-100 text-rose-700',
};

const formatDate = (value) => value ? new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

const SectionState = ({ loading, error, empty, title, description, onRetry }) => {
  if (loading) return <div className="animate-pulse rounded-2xl bg-slate-100 p-8 text-sm text-slate-500 dark:bg-slate-800">Chargement…</div>;
  if (error) return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">Impossible de charger cette section. <button type="button" onClick={onRetry} className="ml-2 font-semibold underline">Réessayer</button></div>;
  if (empty) return <EmptyState title={title} description={description} />;
  return null;
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const { t } = useTranslation();
  const [reservations, setReservations] = useState([]);
  const [reservationMeta, setReservationMeta] = useState({ total: 0 });
  const [certifications, setCertifications] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [state, setState] = useState({ reservations: 'loading', certifications: 'loading', conversations: 'loading' });
  const [errors, setErrors] = useState({});

  const loadReservations = async () => {
    setState((current) => ({ ...current, reservations: 'loading' }));
    try {
      const result = await reservationsService.getMyReservations({ page: 1, limit: 100 });
      setReservations(result.data || []);
      setReservationMeta(result.pagination || { total: result.data?.length || 0 });
      setErrors((current) => ({ ...current, reservations: null }));
      setState((current) => ({ ...current, reservations: 'ready' }));
    } catch (error) {
      setErrors((current) => ({ ...current, reservations: error }));
      setState((current) => ({ ...current, reservations: 'error' }));
    }
  };

  const loadCertifications = async () => {
    setState((current) => ({ ...current, certifications: 'loading' }));
    try {
      const result = await certificationsService.getMine({ page: 1, limit: 100 });
      setCertifications(result.data || []);
      setErrors((current) => ({ ...current, certifications: null }));
      setState((current) => ({ ...current, certifications: 'ready' }));
    } catch (error) {
      setErrors((current) => ({ ...current, certifications: error }));
      setState((current) => ({ ...current, certifications: 'error' }));
    }
  };

  const loadConversations = async () => {
    setState((current) => ({ ...current, conversations: 'loading' }));
    try {
      setConversations(await messagingService.getConversations());
      setErrors((current) => ({ ...current, conversations: null }));
      setState((current) => ({ ...current, conversations: 'ready' }));
    } catch (error) {
      setErrors((current) => ({ ...current, conversations: error }));
      setState((current) => ({ ...current, conversations: 'error' }));
    }
  };

  useEffect(() => {
    loadReservations();
    loadCertifications();
    loadConversations();
  }, []);

  const stats = useMemo(() => ({
    total: Number(reservationMeta.total ?? reservations.length),
    pending: reservations.filter((item) => ['PENDING', 'en_attente'].includes(item.status)).length,
    confirmed: reservations.filter((item) => ['CONFIRMED', 'confirmee'].includes(item.status)).length,
    completed: reservations.filter((item) => ['COMPLETED', 'terminee'].includes(item.status)).length,
    invested: reservations.filter((item) => item.paid).reduce((sum, item) => sum + Number(item.price || item.prix || 0), 0),
  }), [reservationMeta.total, reservations]);

  const displayName = user?.name || user?.nom || user?.email?.split('@')[0] || 'Apprenant';
  const firstName = displayName.split(' ')[0];
  const recentNotifications = notifications.slice(0, 4);
  const upcoming = reservations.filter((item) => ['PENDING', 'CONFIRMED', 'en_attente', 'confirmee'].includes(item.status)).slice(0, 4);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
        <div className="relative z-10">
          <p className="mb-1 text-sm font-medium uppercase tracking-wide text-brand-100">{t('dashboard.eyebrow')}</p>
          <h1 className="text-2xl font-display font-bold md:text-3xl">{t('dashboard.greeting', { name: firstName })} 👋</h1>
          <p className="mt-2 text-sm text-brand-100">{user?.email}{user?.ville ? ` · ${user.ville}` : ''}</p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-5">
        <AnimatedStatCard icon={FiBookOpen} value={stats.total} label="Réservations" subtitle="Données backend" tone="brand" />
        <AnimatedStatCard icon={FiClock} value={stats.pending} label="En attente" subtitle="À valider" tone="accent" />
        <AnimatedStatCard icon={FiCheckCircle} value={stats.completed} label="Terminées" subtitle="Réservations" tone="emerald" />
        <AnimatedStatCard icon={FiAward} value={certifications.length} label="Certifications" subtitle="Émises" tone="sunset" />
        <AnimatedStatCard icon={FiDollarSign} value={stats.invested} label="Total payé" subtitle="DT" tone="sunset" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div><h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Mes formations</h2><p className="text-sm text-slate-500">Réservations et statuts réels</p></div>
              <Link to="/reservations" className="text-sm text-accent-400 hover:underline">Tout voir →</Link>
            </div>
            <SectionState loading={state.reservations === 'loading'} error={errors.reservations} empty={state.reservations === 'ready' && reservations.length === 0} title="Aucune réservation" description="Vos formations réservées apparaîtront ici." onRetry={loadReservations} />
            {state.reservations === 'ready' && reservations.length > 0 ? <div className="space-y-3">{reservations.slice(0, 5).map((reservation) => <div key={reservation.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3 dark:border-slate-700"><img src={reservation.image || '/images/hero-fallback.jpg'} alt="" className="h-14 w-14 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="truncate font-semibold text-slate-900 dark:text-slate-100">{reservation.formationTitle || reservation.titre || 'Formation'}</p><p className="truncate text-sm text-slate-500">{reservation.centreName || reservation.centreNom || 'Centre non renseigné'}</p><p className="text-xs text-slate-400">Réservée le {formatDate(reservation.createdAt || reservation.date)}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone[reservation.status] || 'bg-slate-100 text-slate-600'}`}>{statusLabels[reservation.status] || reservation.status || 'Non renseigné'}</span></div>)}</div> : null}
          </section>

          <section className="card p-6">
            <div className="mb-4 flex items-center gap-2"><FiCalendar className="text-brand-500" /><h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Prochaines formations</h2></div>
            {upcoming.length === 0 ? <p className="text-sm text-slate-500">Aucune formation à venir.</p> : <div className="space-y-3">{upcoming.map((reservation) => <div key={reservation.id} className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-700"><p className="font-medium text-slate-900 dark:text-slate-100">{reservation.formationTitle || reservation.titre}</p><p className="text-sm text-slate-500">{reservation.centreName || reservation.centreNom} · {formatDate(reservation.formationStartDate)}</p></div>)}</div>}
          </section>
        </div>

        <div className="space-y-6">
          <section className="card p-6"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Notifications</h2><span className="rounded-full bg-brand-500/10 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300">{unreadCount} non lues</span></div>{recentNotifications.length === 0 ? <p className="text-sm text-slate-500">Aucune notification récente.</p> : <div className="space-y-3">{recentNotifications.map((item) => <div key={item.id} className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-700"><p className="font-medium text-slate-900 dark:text-slate-100">{item.title}</p><p className="mt-1 text-sm text-slate-500">{item.message}</p></div>)}</div>}</section>
          <section className="card p-6"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Messages</h2><Link to="/messagerie" className="text-sm text-accent-400 hover:underline">Ouvrir →</Link></div><SectionState loading={state.conversations === 'loading'} error={errors.conversations} empty={state.conversations === 'ready' && conversations.length === 0} title="Aucun message" description="Vos conversations apparaîtront ici." onRetry={loadConversations} />{state.conversations === 'ready' && conversations.length > 0 ? <div className="space-y-3">{conversations.slice(0, 3).map((conversation) => <div key={conversation.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-700"><FiMessageCircle className="text-brand-500" /><div className="min-w-0 flex-1"><p className="truncate font-medium text-slate-900 dark:text-slate-100">{conversation.participantName}</p><p className="truncate text-sm text-slate-500">{conversation.lastMessage || 'Aucun message'}</p></div>{conversation.unreadCount > 0 ? <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">{conversation.unreadCount}</span> : null}</div>)}</div> : null}</section>
          <section className="card p-6"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Certifications</h2><Link to="/certifications" className="text-sm text-accent-400 hover:underline">Tout voir →</Link></div><SectionState loading={state.certifications === 'loading'} error={errors.certifications} empty={state.certifications === 'ready' && certifications.length === 0} title="Aucune certification" description="Les certifications émises apparaîtront ici." onRetry={loadCertifications} />{state.certifications === 'ready' && certifications.length > 0 ? <div className="space-y-3">{certifications.slice(0, 3).map((certification) => <div key={certification.id} className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-700"><p className="font-medium text-slate-900 dark:text-slate-100">{certification.formation || 'Certification'}</p><p className="text-sm text-slate-500">{certification.centre} · {formatDate(certification.date)}</p><p className="mt-1 text-xs text-slate-400">{certification.status || 'Statut non renseigné'}</p>{certification.fileUrl ? <a href={certification.fileUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-semibold text-accent-500">Ouvrir le fichier</a> : null}</div>)}</div> : null}</section>
          <section className="card p-6"><h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Progression d’apprentissage</h2><p className="mt-2 text-sm text-slate-500">Le suivi détaillé de la progression, de l’assiduité et des séances n’est pas encore fourni par le backend.</p></section>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { mockCentres } from '../../data/mockCentres';
import { mockFormations } from '../../data/mockFormations';
import { mockReservations } from '../../data/mockReservations';
import { mockSessions } from '../../data/mockSessions';
import { FiBookOpen, FiCalendar, FiStar, FiUserPlus, FiPackage, FiCheckCircle, FiMessageCircle, FiAlertTriangle, FiClock, FiFileText } from 'react-icons/fi';
import DashboardHero from '../../components/centre/DashboardHero';
import KPICard from '../../components/centre/KPICard';
import QuickActions from '../../components/centre/QuickActions';
import RecentActivity from '../../components/centre/RecentActivity';
import NotificationCenter from '../../components/centre/NotificationCenter';
import MessagesPreview from '../../components/centre/MessagesPreview';
import ProfileProgress from '../../components/centre/ProfileProgress';
import CalendarCard from '../../components/centre/CalendarCard';
import ExportReportButton from '../../components/centre/ExportReportButton';

export const DashboardPage = () => {
  const centre = mockCentres[0];
  const centreFormationIds = mockFormations.filter((f) => f.centreId === centre.id).map((f) => f.id);
  const reservations = mockReservations.filter((reservation) => centreFormationIds.includes(reservation.formationId));
  const studentsCount = Array.from(new Set(reservations.map((r) => r.learnerId))).length || 0;
  const upcomingSessions = mockSessions.slice(0, 3);

  return (
    <div className="space-y-6">
      <DashboardHero centre={{ ...centre, students: studentsCount, courses: mockFormations.filter((f) => f.centreId === centre.id).length }} />

      <div className="flex justify-end">
        <ExportReportButton />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <KPICard icon={FiBookOpen} title="Formations publiées" value={mockFormations.filter((item) => item.centreId === centre.id).length} subtitle="Total" trend="+12% vs le mois dernier" />
        <KPICard icon={FiCalendar} title="Réservations" value={reservations.length} subtitle="Actives" trend="+8% vs semaine dernière" />
        <KPICard icon={FiUserPlus} title="Étudiants" value={studentsCount} subtitle="Inscrits" trend="+5% vs le mois dernier" />
        <KPICard icon={FiStar} title="Note moyenne" value={centre.noteMoyenne.toFixed(1)} subtitle="Basé sur avis" trend="+0.4 pt" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6">
          <QuickActions />

          <section className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Aujourd’hui</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Activité du centre en temps réel</p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-600 dark:text-emerald-300">Système sain</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><FiClock size={16} /> Sessions à venir</div>
                <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{upcomingSessions.length}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/60">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><FiFileText size={16} /> Certificats en attente</div>
                <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">3</div>
              </div>
            </div>
          </section>

          <RecentActivity items={[
            { id: 'a1', icon: FiUserPlus, title: 'Nouvel apprenant inscrit', time: '2h', tone: 'bg-emerald-500' },
            { id: 'a2', icon: FiPackage, title: 'Formation publiée: React Avancé', time: '1j', tone: 'bg-sky-500' },
            { id: 'a3', icon: FiCheckCircle, title: 'Réservation confirmée', time: '3j', tone: 'bg-emerald-500' },
            { id: 'a4', icon: FiMessageCircle, title: 'Message reçu de Youssef', time: '5j', tone: 'bg-slate-400' },
          ]} />

          <ProfileProgress percent={72} tasks={[
            { id: 1, label: 'Télécharger le logo', done: true },
            { id: 2, label: 'Ajouter description', done: false },
            { id: 3, label: 'Ajouter formateurs', done: false },
          ]} />
        </div>

        <div className="space-y-6">
          <NotificationCenter notifications={[
            { id: 'n1', title: 'Nouvelle réservation', time: 'Il y a 2h', unread: true },
            { id: 'n2', title: 'Nouveau avis', time: 'Il y a 1j' },
          ]} />

          <CalendarCard events={[
            { id: 1, title: 'Session React', date: '2026-08-05', time: '10:00' },
            { id: 2, title: 'Webinaire SEO', date: '2026-08-12', time: '14:00' },
          ]} />

          <MessagesPreview messages={[
            { id: 'm1', name: 'Sana', preview: 'Bonjour, je souhaite...', time: '1h', unread: 1 },
            { id: 'm2', name: 'Khaled', preview: 'Merci pour la formation', time: '3j' },
          ]} />

          <section className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100"><FiAlertTriangle size={16} /> Alertes plateforme</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>• 2 documents administratifs à valider.</li>
              <li>• 1 centre en attente de vérification documentaire.</li>
              <li>• 1 session a besoin d’un formateur suplémentaire.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

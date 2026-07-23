import React from 'react';
import { mockCentres } from '../../data/mockCentres';
import { mockFormations } from '../../data/mockFormations';
import { mockReservations } from '../../data/mockReservations';
import { FiBookOpen, FiCalendar, FiStar, FiUserPlus, FiPackage, FiCheckCircle, FiMessageCircle } from 'react-icons/fi';
import DashboardHero from '../../components/centre/DashboardHero';
import KPICard from '../../components/centre/KPICard';
import QuickActions from '../../components/centre/QuickActions';
import AnalyticsSection from '../../components/centre/AnalyticsSection';
import TopFormations from '../../components/centre/TopFormations';
import RecentActivity from '../../components/centre/RecentActivity';
import NotificationCenter from '../../components/centre/NotificationCenter';
import MessagesPreview from '../../components/centre/MessagesPreview';
import ProfileProgress from '../../components/centre/ProfileProgress';
import CalendarCard from '../../components/centre/CalendarCard';

export const DashboardPage = () => {
  const centre = mockCentres[0];
  const centreFormationIds = mockFormations.filter((f) => f.centreId === centre.id).map((f) => f.id);
  const reservations = mockReservations.filter((reservation) => centreFormationIds.includes(reservation.formationId));
  const studentsCount = Array.from(new Set(reservations.map((r) => r.learnerId))).length || 0;
  const monthlyData = [
    { name: 'Jan', value: 2 },
    { name: 'Fév', value: 4 },
    { name: 'Mar', value: 3 },
    { name: 'Avr', value: 5 },
    { name: 'Mai', value: 6 },
    { name: 'Jui', value: 8 },
  ];
  const donutData = [
    { name: 'Confirmé', value: 42 },
    { name: 'En attente', value: 18 },
    { name: 'Annulé', value: 6 },
  ];

  return (
    <div className="space-y-6">
      <DashboardHero centre={{ ...centre, students: 342, courses: mockFormations.filter(f => f.centreId === centre.id).length }} />

      <div className="grid gap-4 md:grid-cols-4">
        <KPICard icon={FiBookOpen} title="Formations publiées" value={mockFormations.filter((item) => item.centreId === centre.id).length} subtitle="Total" />
        <KPICard icon={FiCalendar} title="Réservations" value={reservations.length} subtitle="Actives" />
        <KPICard icon={FiUserPlus} title="Étudiants" value={studentsCount} subtitle="Inscrits" />
        <KPICard icon={FiStar} title="Note moyenne" value={centre.noteMoyenne.toFixed(1)} subtitle="Basé sur avis" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6">
          <QuickActions />
          <AnalyticsSection monthlyData={monthlyData} donutData={donutData} />
          <TopFormations formations={mockFormations.filter(f => f.centreId === centre.id).slice(0,6)} />
          <ProfileProgress percent={72} tasks={[{id:1,label:'Télécharger le logo',done:true},{id:2,label:'Ajouter description',done:false},{id:3,label:'Ajouter formateurs',done:false}]} />
        </div>

        <div className="space-y-6">
          <RecentActivity items={[
            { id: 'a1', icon: FiUserPlus, title: 'Nouvel apprenant inscrit', time: '2h' , tone: 'bg-emerald-500'},
            { id: 'a2', icon: FiPackage, title: 'Formation publiée: React Avancé', time: '1j' , tone: 'bg-sky-500'},
            { id: 'a3', icon: FiCheckCircle, title: 'Réservation confirmée', time: '3j' , tone: 'bg-emerald-500'},
            { id: 'a4', icon: FiMessageCircle, title: 'Message reçu de Youssef', time: '5j' , tone: 'bg-slate-400'},
          ]} />

          <NotificationCenter notifications={[{id:'n1',title:'Nouvelle réservation',time:'Il y a 2h',unread:true},{id:'n2',title:'Nouveau avis',time:'Il y a 1j'}]} />

          <CalendarCard events={[{id:1,title:'Session React',date:'2026-08-05',time:'10:00'},{id:2,title:'Webinaire SEO',date:'2026-08-12',time:'14:00'}]} />

          <MessagesPreview messages={[{id:'m1',name:'Sana',preview:'Bonjour, je souhaite...',time:'1h',unread:1},{id:'m2',name:'Khaled',preview:'Merci pour la formation',time:'3j'}]} />
        </div>
      </div>
    </div>
  );
};

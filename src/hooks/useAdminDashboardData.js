import { useMemo } from 'react';
import { mockUsers } from '../data/mockUsers';
import { mockCentres } from '../data/mockCentres';
import { mockFormations } from '../data/mockFormations';
import { mockReservations } from '../data/mockReservations';
import { mockLitiges } from '../data/mockLitiges';
import { mockSignalements } from '../data/mockSignalements';
import { mockStudents } from '../data/mockStudents';
import { mockTrainers } from '../data/mockTrainers';

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const generateMonthlyData = (base, variance = 5) => {
  return MONTHS.map((name, i) => ({
    name,
    value: Math.max(0, Math.round(base + (Math.random() - 0.5) * variance * 2)),
  }));
};

export const useAdminDashboardData = () => {
  return useMemo(() => {
    // ===== USERS =====
    const totalUsers = mockUsers.length;
    const activeUsers = mockUsers.filter(u => u.statut === 'actif').length;
    const suspendedUsers = mockUsers.filter(u => u.statut === 'suspendu').length;
    const pendingUsers = mockUsers.filter(u => u.statut === 'en_attente' || u.statut === 'desactive').length;
    const usersToday = mockUsers.filter(u => {
      const d = new Date(u.dateInscription);
      const today = new Date();
      return d.toDateString() === today.toDateString();
    }).length;
    const newUsersThisMonth = mockUsers.filter(u => {
      const d = new Date(u.dateInscription);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    const previousMonthUsers = Math.max(1, totalUsers - Math.round(totalUsers * 0.12));
    const userGrowth = totalUsers > 0 ? Math.round(((totalUsers - previousMonthUsers) / previousMonthUsers) * 100) : 0;

    // ===== CENTRES =====
    const totalCentres = mockCentres.length;
    const verifiedCentres = mockCentres.filter(c => c.verifie === true).length;
    const pendingCentres = mockCentres.filter(c => c.statutVerification === 'en_attente').length;
    const rejectedCentres = mockCentres.filter(c => c.statutVerification === 'rejete').length;
    const suspendedCentres = mockCentres.filter(c => c.statutVerification === 'suspendu').length;
    const centersToVerify = mockCentres.filter(c => c.statutVerification === 'en_attente' || c.statutVerification === 'documents_recus').length;
    const activeCentres = mockCentres.filter(c => c.verifie === true).length;
    const centreValidationRate = totalCentres > 0 ? Math.round((verifiedCentres / totalCentres) * 100) : 0;
    const centreGrowth = totalCentres > 0 ? Math.round(((totalCentres - Math.max(1, totalCentres - 2)) / Math.max(1, totalCentres - 2)) * 100) : 0;

    // ===== FORMATIONS =====
    const totalFormations = mockFormations.length;
    const formationsByCategory = mockFormations.reduce((acc, f) => {
      const cat = f.category || 'Général';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    const topCategories = Object.entries(formationsByCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    const avgFormationPrice = mockFormations.length > 0
      ? Math.round(mockFormations.reduce((s, f) => s + (f.price || 0), 0) / mockFormations.length)
      : 0;

    // ===== RESERVATIONS =====
    const totalReservations = mockReservations.length;
    const confirmedReservations = mockReservations.filter(r => r.status === 'confirmée').length;
    const pendingReservations = mockReservations.filter(r => r.status === 'en attente').length;
    const cancelledReservations = mockReservations.filter(r => r.status === 'annulée').length;
    const completedReservations = mockReservations.filter(r => r.status === 'terminée').length;
    const reservationsToday = mockReservations.filter(r => {
      const d = new Date(r.date);
      const today = new Date();
      return d.toDateString() === today.toDateString();
    }).length;
    const reservationGrowth = totalReservations > 0 ? 8 : 0;

    // ===== REVENUE (simulated from reservations) =====
    const totalRevenue = mockReservations
      .filter(r => r.paid)
      .reduce((sum, r) => sum + (r.price || 0), 0);
    const monthlyRevenue = mockReservations
      .filter(r => r.paid)
      .reduce((sum, r) => sum + (r.price || 0), 0);

    // ===== LITIGES =====
    const totalLitiges = mockLitiges.length;
    const openLitiges = mockLitiges.filter(l => l.statut === 'ouvert').length;
    const criticalLitiges = mockLitiges.filter(l => l.priorite === 'critique' && l.statut !== 'resolu' && l.statut !== 'archive').length;
    const highLitiges = mockLitiges.filter(l => l.priorite === 'haute' && l.statut !== 'resolu' && l.statut !== 'archive').length;
    const resolvedLitiges = mockLitiges.filter(l => l.statut === 'resolu').length;
    const slaBreached = mockLitiges.filter(l => {
      if (l.statut === 'resolu' || l.statut === 'archive') return false;
      const daysOpen = parseInt(l.tempsEcoule) || 0;
      const slaHours = parseInt(l.sla) || 48;
      return daysOpen * 24 > slaHours;
    }).length;

    // ===== SIGNALEMENTS =====
    const pendingSignalements = mockSignalements.filter(s => s.status === 'En attente').length;

    // ===== SATISFACTION =====
    const avgRating = mockCentres.length > 0
      ? (mockCentres.reduce((s, c) => s + (c.noteMoyenne || 0), 0) / mockCentres.length)
      : 4.5;

    // ===== TRAINERS =====
    const totalTrainers = mockTrainers.length;
    const activeTrainers = mockTrainers.filter(t => t.status === 'Actif').length;

    // ===== STUDENTS =====
    const totalStudents = mockStudents.length;
    const avgAttendance = mockStudents.length > 0
      ? Math.round(mockStudents.reduce((s, st) => s + (st.attendance || 0), 0) / mockStudents.length)
      : 0;

    // ===== PROFILES =====
    const incompleteProfiles = mockUsers.filter(u => u.profilVerifie === false).length;

    // ===== ACTIVITY =====
    const loginToday = mockUsers.filter(u => {
      const d = new Date(u.derniereConnexion);
      const today = new Date();
      return d.toDateString() === today.toDateString();
    }).length;

    // ===== CHART DATA =====
    const registrationChartData = generateMonthlyData(totalUsers > 0 ? Math.round(totalUsers / 6) : 10);
    const revenueChartData = generateMonthlyData(totalRevenue > 0 ? Math.round(totalRevenue / 6) : 5000);
    const userChartData = generateMonthlyData(activeUsers > 0 ? Math.round(activeUsers / 6) : 15);
    const reservationChartData = generateMonthlyData(totalReservations > 0 ? Math.round(totalReservations / 6) : 8);
    const satisfactionChartData = [
      { name: 'Satisfaction', value: Math.round(avgRating * 20) },
      { name: 'Neutre', value: Math.round(100 - avgRating * 20) },
    ];

    // ===== TOP CENTRES =====
    const topCentres = [...mockCentres]
      .sort((a, b) => (b.noteMoyenne || 0) - (a.noteMoyenne || 0))
      .slice(0, 5)
      .map(c => ({
        id: c.id,
        name: c.name,
        city: c.ville,
        logo: c.logo,
        rating: c.noteMoyenne,
        students: c.nombreEtudiants || 0,
        formations: c.formationsPubliees || 0,
        verified: c.verifie,
        monthlyProgress: Math.round(5 + Math.random() * 15),
      }));

    // ===== TOP FORMATIONS =====
    const topFormations = [...mockFormations]
      .sort((a, b) => (b.progress || 0) - (a.progress || 0))
      .slice(0, 5)
      .map(f => {
        const reservations = mockReservations.filter(r => r.formationId === f.id);
        const centre = mockCentres.find(c => c.id === f.centreId);
        return {
          id: f.id,
          title: f.title,
          category: f.category || 'Général',
          centre: centre?.name || 'Inconnu',
          price: f.price,
          bookings: reservations.length,
          progress: f.progress || 0,
          image: f.image,
        };
      });

    // ===== TOP TRAINERS =====
    const topTrainers = mockTrainers.map(t => ({
      id: t.id,
      name: t.name,
      speciality: t.speciality,
      avatar: t.avatar,
      status: t.status,
      courses: t.assignedCourses?.length || 0,
      rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
      students: Math.round(20 + Math.random() * 80),
    }));

    // ===== ALERTS =====
    const alerts = [
      ...(centersToVerify > 0 ? [{
        id: 'alert-centers',
        type: 'danger',
        icon: '🔴',
        message: `${centersToVerify} centre${centersToVerify > 1 ? 's' : ''} attend${centersToVerify > 1 ? 'ent' : ''} une validation`,
        actionLink: '/admin/centres-en-attente',
      }] : []),
      ...(slaBreached > 0 ? [{
        id: 'alert-litiges',
        type: 'warning',
        icon: '🟠',
        message: `${slaBreached} litige${slaBreached > 1 ? 's' : ''} dépasse${slaBreached > 1 ? 'nt' : ''} le SLA`,
        actionLink: '/admin/litiges',
      }] : []),
      ...(pendingSignalements > 0 ? [{
        id: 'alert-signalements',
        type: 'info',
        icon: '🔵',
        message: `${pendingSignalements} nouvel${pendingSignalements > 1 ? 's' : ''} avis signalé${pendingSignalements > 1 ? 's' : ''}`,
        actionLink: '/admin/moderation',
      }] : []),
      ...(incompleteProfiles > 0 ? [{
        id: 'alert-profiles',
        type: 'warning',
        icon: '🟡',
        message: `${incompleteProfiles} profil${incompleteProfiles > 1 ? 's' : ''} incomplet${incompleteProfiles > 1 ? 's' : ''}`,
        actionLink: '/admin/utilisateurs',
      }] : []),
      ...(openLitiges > 0 ? [{
        id: 'alert-open-litiges',
        type: 'danger',
        icon: '🔴',
        message: `${openLitiges} litige${openLitiges > 1 ? 's' : ''} ouvert${openLitiges > 1 ? 's' : ''} à traiter`,
        actionLink: '/admin/litiges',
      }] : []),
    ];

    // ===== AI SUGGESTIONS =====
    const aiSuggestions = [];
    if (centersToVerify > 0) aiSuggestions.push({
      id: 'ai-1',
      text: `Valider ${centersToVerify} centre${centersToVerify > 1 ? 's' : ''} en attente`,
      link: '/admin/centres-en-attente',
      action: 'Valider',
    });
    if (criticalLitiges > 0) aiSuggestions.push({
      id: 'ai-2',
      text: `Traiter ${criticalLitiges} litige${criticalLitiges > 1 ? 's' : ''} critique${criticalLitiges > 1 ? 's' : ''}`,
      link: '/admin/litiges',
      action: 'Traiter',
    });
    if (pendingSignalements > 0) aiSuggestions.push({
      id: 'ai-3',
      text: `Répondre à ${pendingSignalements} signalement${pendingSignalements > 1 ? 's' : ''}`,
      link: '/admin/moderation',
      action: 'Modérer',
    });
    if (incompleteProfiles > 0) aiSuggestions.push({
      id: 'ai-4',
      text: `Compléter ${incompleteProfiles} profil${incompleteProfiles > 1 ? 's' : ''} incomplet${incompleteProfiles > 1 ? 's' : ''}`,
      link: '/admin/utilisateurs',
      action: 'Voir',
    });

    // ===== OBJECTIVES =====
    const objectives = [
      { label: 'Nouveaux centres', current: verifiedCentres, target: Math.max(verifiedCentres, 10), unlocked: true },
      { label: 'Réservations', current: confirmedReservations, target: Math.max(confirmedReservations, 20), unlocked: completedReservations > 0 },
      { label: 'Satisfaction', current: Math.round(avgRating * 20), target: 95, unlocked: avgRating >= 4.5 },
      { label: 'Centres vérifiés', current: verifiedCentres, target: totalCentres, unlocked: centreValidationRate >= 80 },
    ];

    // ===== GLOBAL SCORE =====
    const performanceScore = Math.min(100, Math.round((activeCentres / Math.max(1, totalCentres)) * 100));
    const securityScore = Math.min(100, Math.round(85 + Math.random() * 10));
    const availabilityScore = Math.min(100, Math.round(90 + Math.random() * 8));
    const satisfactionScore = Math.min(100, Math.round(avgRating * 20));
    const growthScore = Math.min(100, Math.max(50, Math.round(70 + (userGrowth * 2))));
    const globalScore = Math.round((performanceScore + securityScore + availabilityScore + satisfactionScore + growthScore) / 5);

    // ===== PLATFORM TRENDS =====
    const platformTrends = {
      inscriptionGrowth: userGrowth,
      reservationGrowth: reservationGrowth,
      centreGrowth: centreGrowth,
      weeklyActivity: Math.round(65 + Math.random() * 30),
      previousMonthComparison: Math.round(userGrowth - 3),
    };

    // ===== PLATFORM METRICS =====
    const platformMetrics = [
      { label: 'Centres actifs', value: activeCentres, max: totalCentres, unit: '', color: 'emerald' },
      { label: 'Formations publiées', value: totalFormations, max: Math.max(totalFormations, 15), unit: '', color: 'brand' },
      { label: 'Réservations aujourd\'hui', value: reservationsToday, max: Math.max(reservationsToday, 15), unit: '', color: 'blue' },
      { label: 'Taux validation centres', value: centreValidationRate, max: 100, unit: '%', color: 'purple' },
      { label: 'Satisfaction utilisateurs', value: Math.round(avgRating * 20), max: 100, unit: '%', color: 'amber' },
      { label: 'Taux complétion profils', value: totalUsers > 0 ? Math.round(((totalUsers - incompleteProfiles) / totalUsers) * 100) : 0, max: 100, unit: '%', color: 'rose' },
    ];

    return {
      // Users
      totalUsers, activeUsers, suspendedUsers, pendingUsers, usersToday, newUsersThisMonth, userGrowth, loginToday,
      // Centres
      totalCentres, verifiedCentres, pendingCentres, rejectedCentres, suspendedCentres, centersToVerify, activeCentres, centreValidationRate, centreGrowth,
      // Formations
      totalFormations, formationsByCategory, topCategories, avgFormationPrice,
      // Reservations
      totalReservations, confirmedReservations, pendingReservations, cancelledReservations, completedReservations, reservationsToday, reservationGrowth,
      // Revenue
      totalRevenue, monthlyRevenue,
      // Litiges
      totalLitiges, openLitiges, criticalLitiges, highLitiges, resolvedLitiges, slaBreached,
      // Signalements
      pendingSignalements,
      // Satisfaction
      avgRating,
      // Trainers
      totalTrainers, activeTrainers,
      // Students
      totalStudents, avgAttendance,
      // Profiles
      incompleteProfiles,
      // Charts
      registrationChartData, revenueChartData, userChartData, reservationChartData, satisfactionChartData,
      // Top lists
      topCentres, topFormations, topTrainers,
      // Alerts & AI
      alerts, aiSuggestions,
      // Objectives
      objectives,
      // Global Score
      globalScore, performanceScore, securityScore, availabilityScore, satisfactionScore, growthScore,
      // Trends
      platformTrends,
      // Metrics
      platformMetrics,
    };
  }, []);
};


import { useCallback, useEffect, useState } from 'react';
import { adminDashboardService } from '../services/adminDashboardService';

const emptyData = {
  totalUsers: 0, activeUsers: null, suspendedUsers: null, pendingUsers: null, usersToday: null,
  newUsersThisMonth: 0, userGrowth: null, loginToday: null,
  totalCentres: 0, verifiedCentres: 0, pendingCentres: 0, rejectedCentres: 0, suspendedCentres: 0,
  centersToVerify: 0, activeCentres: 0, centreValidationRate: 0, centreGrowth: null,
  totalFormations: 0, formationsByCategory: {}, topCategories: [], avgFormationPrice: null,
  totalReservations: 0, confirmedReservations: 0, pendingReservations: 0, cancelledReservations: 0,
  completedReservations: 0, reservationsToday: null, reservationGrowth: null,
  totalRevenue: 0, monthlyRevenue: 0,
  totalLitiges: 0, openLitiges: 0, criticalLitiges: 0, highLitiges: 0, resolvedLitiges: 0, slaBreached: null,
  pendingSignalements: 0, avgRating: null, totalTrainers: null, activeTrainers: null, totalStudents: null,
  avgAttendance: null, incompleteProfiles: null, registrationChartData: [], revenueChartData: [],
  userChartData: [], reservationChartData: [], satisfactionChartData: [], topCentres: [], topFormations: [],
  topTrainers: [], alerts: [], aiSuggestions: [], objectives: [], globalScore: null, performanceScore: null,
  securityScore: null, availabilityScore: null, satisfactionScore: null, growthScore: null,
  platformTrends: {}, platformMetrics: [], recentActivity: [], repartitionReservations: [],
  repartitionCentres: [], litigesStats: null, signalementsStats: null, loading: true, error: null,
};

const toChartData = (series = [], valueKey) => series.map((item) => ({
  name: item.label,
  value: Number(item[valueKey] || 0),
}));

const countLabel = (items = [], label) => Number(items.find((item) => item.label === label)?.count || 0);

const mapData = ([overview, growth, revenue, reservationSplit, formationSplit, centreSplit, topCentres, topFormations, recentActivity, litigesStats, signalementsStats]) => {
  const users = overview?.users || {};
  const centres = overview?.centres || {};
  const formations = overview?.formations || {};
  const reservations = overview?.reservations || {};
  const revenu = overview?.revenu || {};
  const litiges = overview?.litiges || {};
  const signalements = overview?.signalements || {};
  const topCategories = (formationSplit || []).map((item) => ({ name: item.label, value: item.count }));
  const satisfaction = Number(overview?.satisfactionMoyenne || 0);

  return {
    ...emptyData,
    totalUsers: users.total || 0,
    newUsersThisMonth: users.nouveauxCeMois || 0,
    totalCentres: centres.total || 0,
    verifiedCentres: centres.verifies || 0,
    pendingCentres: centres.enAttente || 0,
    rejectedCentres: centres.rejetes || 0,
    suspendedCentres: centres.suspendus || 0,
    centersToVerify: centres.enAttente || 0,
    activeCentres: centres.verifies || 0,
    centreValidationRate: centres.total ? Math.round((centres.verifies / centres.total) * 100) : 0,
    totalFormations: formations.total || 0,
    topCategories,
    formationsByCategory: Object.fromEntries(topCategories.map((item) => [item.name, item.value])),
    totalReservations: reservations.total || 0,
    confirmedReservations: reservations.confirmees || 0,
    pendingReservations: reservations.enCours || 0,
    cancelledReservations: reservations.annulees || 0,
    completedReservations: reservations.terminees || 0,
    totalRevenue: revenu.total || 0,
    monthlyRevenue: revenu.ceMois || 0,
    totalLitiges: litiges.total || 0,
    openLitiges: litiges.ouverts || 0,
    resolvedLitiges: litiges.resolus || 0,
    criticalLitiges: countLabel(litigesStats?.parPriorite, 'critique'),
    pendingSignalements: signalements.enAttente || 0,
    avgRating: satisfaction || null,
    registrationChartData: toChartData(growth?.series, 'apprenants'),
    userChartData: toChartData(growth?.series, 'centres'),
    revenueChartData: toChartData(revenue?.series, 'revenu'),
    satisfactionChartData: satisfaction ? [
      { name: 'Satisfaction', value: Math.round(satisfaction * 20) },
      { name: 'Autres', value: Math.max(0, 100 - Math.round(satisfaction * 20)) },
    ] : [],
    topCentres: (topCentres || []).map((item) => ({
      id: item.centre?._id,
      name: item.centre?.nom || 'Centre',
      logo: item.centre?.logo,
      rating: item.noteMoyenne,
      students: null,
      formations: null,
      verified: null,
    })),
    topFormations: (topFormations || []).map((item) => ({
      id: item.formation?._id,
      title: item.formation?.titre || 'Formation',
      category: item.formation?.categorie || '',
      bookings: item.nombreReservations || 0,
      progress: null,
    })),
    recentActivity: recentActivity || [],
    alerts: [
      ...(centres.enAttente ? [{ id: 'centres', type: 'warning', message: `${centres.enAttente} centre(s) en attente de validation`, actionLink: '/admin/centres-en-attente' }] : []),
      ...(signalements.enAttente ? [{ id: 'signalements', type: 'warning', message: `${signalements.enAttente} signalement(s) en attente`, actionLink: '/admin/moderation' }] : []),
      ...(litiges.ouverts ? [{ id: 'litiges', type: 'danger', message: `${litiges.ouverts} litige(s) ouvert(s)`, actionLink: '/admin/litiges' }] : []),
    ],
    platformMetrics: [
      { label: 'Centres actifs', value: centres.verifies || 0, max: centres.total || 1, unit: '', color: 'emerald' },
      { label: 'Formations publiées', value: formations.total || 0, max: formations.total || 1, unit: '', color: 'brand' },
      { label: 'Réservations', value: reservations.total || 0, max: reservations.total || 1, unit: '', color: 'blue' },
      { label: 'Taux validation centres', value: centres.total ? Math.round((centres.verifies / centres.total) * 100) : 0, max: 100, unit: '%', color: 'purple' },
    ],
    repartitionReservations: reservationSplit || [],
    repartitionCentres: centreSplit || [],
    litigesStats,
    signalementsStats,
  };
};

export const useAdminDashboardData = () => {
  const [state, setState] = useState(emptyData);
  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const result = await Promise.all([
        adminDashboardService.getOverview(), adminDashboardService.getGrowth(), adminDashboardService.getRevenue(),
        adminDashboardService.getRepartitionReservations(), adminDashboardService.getRepartitionFormations(),
        adminDashboardService.getRepartitionCentres(), adminDashboardService.getTopCentres(),
        adminDashboardService.getTopFormations(), adminDashboardService.getRecentActivity(),
        adminDashboardService.getLitigesStats(), adminDashboardService.getSignalementsStats(),
      ]);
      setState({ ...mapData(result), loading: false, error: null });
    } catch (error) {
      setState((current) => ({ ...current, loading: false, error }));
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { ...state, refresh };
};

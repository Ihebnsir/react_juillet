export const getAdminQuickStats = ({ totalUsers, totalCentres, totalFormations, totalReservations, totalRevenue, avgRating, activeUsers, loginToday }) => {
  const satisfactionPercent = Math.round((avgRating || 0) * 20);

  return [
    { label: 'Utilisateurs', value: totalUsers, delta: '+12%', tone: 'teal' },
    { label: 'Centres', value: totalCentres, delta: '+3%', tone: 'blue' },
    { label: 'Formations', value: totalFormations, delta: '+8%', tone: 'violet' },
    { label: 'Réservations', value: totalReservations, delta: '+11%', tone: 'amber' },
    { label: 'Revenus', value: `${totalRevenue.toLocaleString('fr-FR')} DT`, delta: '+9%', tone: 'emerald' },
    { label: 'Satisfaction', value: `${satisfactionPercent}%`, delta: '+2%', tone: 'rose' },
  ];
};

export const getPlatformHealthLabel = (score) => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Stable';
  return 'À surveiller';
};

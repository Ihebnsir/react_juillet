import { getAdminQuickStats, getPlatformHealthLabel } from './adminDashboardUtils';

describe('admin dashboard utils', () => {
  it('creates a concise set of essential KPI cards', () => {
    const cards = getAdminQuickStats({
      totalUsers: 120,
      totalCentres: 18,
      totalFormations: 42,
      totalReservations: 87,
      totalRevenue: 45000,
      avgRating: 4.6,
      activeUsers: 74,
      loginToday: 39,
    });

    expect(cards).toHaveLength(6);
    expect(cards[0]).toMatchObject({ label: 'Utilisateurs', value: 120 });
    expect(cards[5]).toMatchObject({ label: 'Satisfaction', value: '92%' });
  });

  it('maps health scores to a simple status label', () => {
    expect(getPlatformHealthLabel(92)).toBe('Excellent');
    expect(getPlatformHealthLabel(71)).toBe('Stable');
    expect(getPlatformHealthLabel(44)).toBe('À surveiller');
  });
});

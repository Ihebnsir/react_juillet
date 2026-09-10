import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { StatisticsPage } from './StatisticsPage';
import { analyticsService } from '../../services/analyticsService';

jest.mock('../../services/analyticsService', () => ({
  analyticsService: {
    centreOverview: jest.fn(),
    centreReservations: jest.fn(),
    centreRevenue: jest.fn(),
    centreFormations: jest.fn(),
  },
}));

test('renders centre analytics revenue aggregation returned by the backend', async () => {
  analyticsService.centreOverview.mockResolvedValue({ formations: 2, reservations: 2, uniqueLearners: 1 });
  analyticsService.centreReservations.mockResolvedValue({ total: 2, byStatus: [] });
  analyticsService.centreRevenue.mockResolvedValue({ totalRevenue: [{ _id: null, total: 250 }], byMonth: [] });
  analyticsService.centreFormations.mockResolvedValue([]);

  render(<StatisticsPage />);

  await waitFor(() => expect(screen.getByText('Statistiques')).toBeInTheDocument());
  expect(screen.getByText('250')).toBeInTheDocument();
  expect(screen.getByText('1')).toBeInTheDocument();
});
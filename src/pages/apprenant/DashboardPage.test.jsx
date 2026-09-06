import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardPage } from './DashboardPage';
import { reservationsService } from '../../services/reservationsService';
import { certificationsService } from '../../services/certificationsService';
import { messagingService } from '../../services/messagingService';

jest.mock('../../context/AuthContext', () => ({ useAuth: () => ({ user: { id: 'learner-1', name: 'Amine Test', email: 'amine@test.com', role: 'apprenant' } }) }));
jest.mock('../../context/NotificationContext', () => ({ useNotifications: () => ({ notifications: [], unreadCount: 0 }) }));
jest.mock('../../services/reservationsService');
jest.mock('../../services/certificationsService');
jest.mock('../../services/messagingService');
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (_key, values) => values?.name ? `Bonjour ${values.name}` : _key }) }));

jest.mock('../../components/dashboard/AnimatedStatCard', () => ({ AnimatedStatCard: ({ label, value }) => <div>{label}: {value}</div> }));
jest.mock('../../components/dashboard/EmptyState', () => ({ EmptyState: ({ title, description }) => <div>{title} {description}</div> }));

describe('Learner dashboard', () => {
  beforeEach(() => {
    reservationsService.getMyReservations.mockResolvedValue({ data: [
      { id: 'r1', status: 'CONFIRMED', price: 100, paid: true, formationTitle: 'React', centreName: 'Centre A', createdAt: '2026-01-01' },
      { id: 'r2', status: 'COMPLETED', price: 200, paid: true, formationTitle: 'Node', centreName: 'Centre B', createdAt: '2026-01-02' },
      { id: 'r3', status: 'PENDING', price: 300, paid: false, formationTitle: 'Data', centreName: 'Centre C', createdAt: '2026-01-03' },
    ], pagination: { total: 8 } });
    certificationsService.getMine.mockResolvedValue({ data: [], pagination: { total: 0 } });
    messagingService.getConversations.mockResolvedValue([]);
  });

  it('derives statistics from real reservations and pagination totals', async () => {
    render(<MemoryRouter><DashboardPage /></MemoryRouter>);
    expect(await screen.findByText('Réservations: 8')).toBeInTheDocument();
    expect(screen.getByText('En attente: 1')).toBeInTheDocument();
    expect(screen.getByText('Terminées: 1')).toBeInTheDocument();
    expect(screen.getByText('Total payé: 300')).toBeInTheDocument();
  });

  it('shows API empty states and does not fall back to mock data', async () => {
    reservationsService.getMyReservations.mockRejectedValueOnce(new Error('API down'));
    render(<MemoryRouter><DashboardPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText(/Impossible de charger cette section/)).toBeInTheDocument());
    expect(screen.queryByText('React Avancé')).not.toBeInTheDocument();
  });
});

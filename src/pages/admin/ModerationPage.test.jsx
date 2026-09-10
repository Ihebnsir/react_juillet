import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ModerationPage } from './ModerationPage';
import { signalementsService } from '../../services/signalementsService';

jest.mock('../../services/signalementsService', () => ({
  signalementsService: {
    getAdminList: jest.fn(),
    getById: jest.fn(),
    updateStatus: jest.fn(),
    escalate: jest.fn(),
    remove: jest.fn(),
  },
}));

describe('ModerationPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders moderation records returned by the backend service', async () => {
    signalementsService.getAdminList.mockResolvedValue({ data: [{ id: 'report-1', type: 'Spam', contenu: 'Signalement réel', status: 'En attente', createdAt: '2026-09-10T10:00:00.000Z' }] });
    render(<MemoryRouter><ModerationPage /></MemoryRouter>);

    expect(screen.getByRole('heading', { name: /Modération des signalements/i })).toBeInTheDocument();
    expect(await screen.findByText('Signalement réel')).toBeInTheDocument();
    expect(signalementsService.getAdminList).toHaveBeenCalledWith({ page: 1, limit: 10, type: '', status: '' });
  });

  it('shows a backend error instead of fabricating moderation records', async () => {
    signalementsService.getAdminList.mockRejectedValue(new Error('Service indisponible.'));
    render(<MemoryRouter><ModerationPage /></MemoryRouter>);

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Service indisponible.'));
    expect(screen.queryByText(/Fraude détectée/i)).not.toBeInTheDocument();
  });
});

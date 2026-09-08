import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SignalementsPage } from './SignalementsPage';
import { signalementsService } from '../services/signalementsService';

jest.mock('../services/signalementsService', () => ({ signalementsService: { getMine: jest.fn(), create: jest.fn() } }));
jest.mock('../context/NotificationContext', () => ({ useNotifications: () => ({ refresh: jest.fn() }) }));

describe('SignalementsPage', () => {
  beforeEach(() => { jest.clearAllMocks(); signalementsService.getMine.mockResolvedValue({ data: [] }); });

  it('validates required fields and does not show fake success after API failure', async () => {
    render(<SignalementsPage />);
    fireEvent.click(screen.getByRole('button', { name: /Envoyer/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/Renseignez/i);
    fireEvent.change(screen.getByRole('combobox', { name: /Type/i }), { target: { value: 'Spam' } });
    fireEvent.change(screen.getByRole('textbox', { name: /Contenu/i }), { target: { value: 'Un signalement' } });
    signalementsService.create.mockRejectedValue(new Error('HTTP_500'));
    fireEvent.click(screen.getByRole('button', { name: /Envoyer/i }));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/HTTP_500|erreur/i));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders history data and exact statuses', async () => {
    signalementsService.getMine.mockResolvedValue({ data: [{ id: 'sig-1', type: 'Spam', contenu: 'Publicité', status: 'Résolu', createdAt: '2026-09-01' }] });
    render(<SignalementsPage />);
    expect(await screen.findByText('Résolu')).toBeInTheDocument();
    expect(screen.getByText('Publicité')).toBeInTheDocument();
  });
});

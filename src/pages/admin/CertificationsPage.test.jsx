import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CertificationsPage from './CertificationsPage';
import { certificationsService } from '../../services/certificationsService';

jest.mock('../../services/certificationsService', () => ({ certificationsService: { create: jest.fn(), revoke: jest.fn() } }));
jest.mock('../../context/NotificationContext', () => ({ useNotifications: () => ({ refresh: jest.fn() }) }));

describe('CertificationsPage', () => {
  beforeEach(() => { jest.clearAllMocks(); certificationsService.create.mockResolvedValue({ id: 'cert-1', certificateNumber: 'CERT-1', status: 'emise' }); certificationsService.revoke.mockResolvedValue({ id: 'cert-1', status: 'revoquee' }); });
  it('issues and revokes through real service operations', async () => {
    render(<CertificationsPage />);
    fireEvent.change(screen.getByLabelText('Apprenant'), { target: { value: 'learner-1' } });
    fireEvent.change(screen.getByLabelText('Formation'), { target: { value: 'formation-1' } });
    fireEvent.change(screen.getByLabelText('Centre'), { target: { value: 'centre-1' } });
    fireEvent.change(screen.getByLabelText("Date d'obtention *"), { target: { value: '2026-09-11' } });
    fireEvent.click(screen.getByRole('button', { name: 'Émettre' }));
    await waitFor(() => expect(certificationsService.create).toHaveBeenCalledWith({ apprenantId: 'learner-1', formationId: 'formation-1', centreId: 'centre-1', dateObtention: '2026-09-11' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Révoquer' }));
    await waitFor(() => expect(certificationsService.revoke).toHaveBeenCalledWith('cert-1'));
  });
  it('shows duplicate issuance errors without fake success', async () => {
    certificationsService.create.mockRejectedValue({ status: 409, message: 'HTTP_409' });
    render(<CertificationsPage />);
    fireEvent.change(screen.getByLabelText('Apprenant'), { target: { value: 'learner-1' } });
    fireEvent.change(screen.getByLabelText('Formation'), { target: { value: 'formation-1' } });
    fireEvent.change(screen.getByLabelText('Centre'), { target: { value: 'centre-1' } });
    fireEvent.change(screen.getByLabelText("Date d'obtention *"), { target: { value: '2026-09-11' } });
    fireEvent.click(screen.getByRole('button', { name: 'Émettre' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/existe déjà|révoquée/i);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
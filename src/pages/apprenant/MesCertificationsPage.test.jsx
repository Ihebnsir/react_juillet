import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MesCertificationsPage } from './MesCertificationsPage';
import { certificationsService } from '../../services/certificationsService';

jest.mock('../../services/certificationsService', () => ({ certificationsService: { getMine: jest.fn() } }));

describe('MesCertificationsPage', () => {
  beforeEach(() => { jest.clearAllMocks(); certificationsService.getMine.mockResolvedValue({ data: [{ id: 'cert-1', certificateNumber: 'CERT-1', formation: 'React', centre: 'Centre', date: '2026-01-02', status: 'emise' }] }); });
  it('renders backend certificates and filters through the API', async () => {
    render(<MemoryRouter><MesCertificationsPage /></MemoryRouter>);
    expect(await screen.findByText('CERT-1')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Statut'), { target: { value: 'revoquee' } });
    expect(await screen.findByText('Page 1')).toBeInTheDocument();
    expect(certificationsService.getMine).toHaveBeenLastCalledWith({ page: 1, limit: 10, status: 'revoquee' });
  });
  it('does not show certificates after API failure', async () => {
    certificationsService.getMine.mockRejectedValue(new Error('HTTP_500'));
    render(<MemoryRouter><MesCertificationsPage /></MemoryRouter>);
    expect(await screen.findByRole('alert')).toHaveTextContent(/Impossible|HTTP_500/i);
    expect(screen.queryByText('CERT-1')).not.toBeInTheDocument();
  });
});
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import VerifierCertificatPage from './VerifierCertificatPage';
import { certificationsService } from '../services/certificationsService';

jest.mock('../services/certificationsService', () => ({ certificationsService: { verify: jest.fn() } }));

describe('VerifierCertificatPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders a public certificate verification form and safe public fields', async () => {
    certificationsService.verify.mockResolvedValue({ certificateNumber: 'CERT-1', formation: 'React', centre: 'Centre', date: '2026-01-02', status: 'emise' });

    render(
      <MemoryRouter initialEntries={['/verifier-certificat']}>
        <Routes>
          <Route path="/verifier-certificat" element={<VerifierCertificatPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/numéro de certificat/i), { target: { value: 'CERT-1' } });
    fireEvent.click(screen.getByRole('button', { name: /vérifier/i }));

    await waitFor(() => expect(certificationsService.verify).toHaveBeenCalledWith('CERT-1'));
    expect(await screen.findByText('Certificat authentique')).toBeInTheDocument();
    expect(screen.queryByText(/@/)).not.toBeInTheDocument();
  });

  it('shows invalid input and backend not found states without fabricating a result', async () => {
    certificationsService.verify.mockRejectedValue({ status: 404, message: 'HTTP_404' });

    render(
      <MemoryRouter initialEntries={['/verifier-certificat']}>
        <Routes>
          <Route path="/verifier-certificat" element={<VerifierCertificatPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/numéro de certificat/i), { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: /vérifier/i }));
    expect(screen.getByText(/numéro de certificat invalide/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/numéro de certificat/i), { target: { value: 'CERT-REVOKED' } });
    fireEvent.click(screen.getByRole('button', { name: /vérifier/i }));

    expect(await screen.findByText(/Certificat introuvable/i)).toBeInTheDocument();
  });
});
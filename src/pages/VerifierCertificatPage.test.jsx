import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import VerifierCertificatPage from './VerifierCertificatPage';
import { certificationsService } from '../services/certificationsService';

jest.mock('../services/certificationsService', () => ({ certificationsService: { verify: jest.fn() } }));

describe('VerifierCertificatPage', () => {
  it('renders safe public certificate fields', async () => {
    certificationsService.verify.mockResolvedValue({ certificateNumber: 'CERT-1', formation: 'React', centre: 'Centre', date: '2026-01-02' });
    render(<MemoryRouter initialEntries={['/verifier-certificat/CERT-1']}><Routes><Route path="/verifier-certificat/:id" element={<VerifierCertificatPage />} /></Routes></MemoryRouter>);
    expect(await screen.findByText('Certificat authentique')).toBeInTheDocument();
    expect(screen.queryByText(/@/)).not.toBeInTheDocument();
  });
  it('does not fabricate a result for revoked or unavailable certificates', async () => {
    certificationsService.verify.mockRejectedValue({ status: 404, message: 'HTTP_404' });
    render(<MemoryRouter initialEntries={['/verifier-certificat/CERT-REVOKED']}><Routes><Route path="/verifier-certificat/:id" element={<VerifierCertificatPage />} /></Routes></MemoryRouter>);
    expect(await screen.findByText('Certificat introuvable')).toBeInTheDocument();
  });
});
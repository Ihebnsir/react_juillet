import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CentresEnAttentePage } from './CentresEnAttentePage';
import { centresService } from '../../services/centresService';

jest.mock('../../services/centresService', () => ({
  centresService: {
    getAll: jest.fn(),
    verify: jest.fn(),
    reject: jest.fn(),
    suspend: jest.fn(),
  },
}));

jest.mock('../../context/NotificationContext', () => ({
  useNotifications: () => ({ addNotification: jest.fn() }),
}));

describe('CentresEnAttentePage', () => {
  beforeEach(() => {
    centresService.getAll.mockResolvedValue({
      data: [
        {
          id: 'centre-1',
          name: 'Centre Alpha',
          ville: 'Tunis',
          email: 'contact@centrealpha.test',
          telephone: '+21600000000',
          responsable: 'Mohamed',
          domaine: 'Digital',
          dateDemande: '2024-01-10',
          statutVerification: 'en_attente',
          profileCompletion: 100,
          documents: [{ id: 'doc-1', name: 'doc.pdf', type: 'PDF', date: '2024-01-10' }],
          historique: [],
          notesInternes: [],
        },
      ],
    });
  });

  it('does not claim the contact email was sent when the backend does not support it', async () => {
    render(<CentresEnAttentePage />);

    await waitFor(() => expect(screen.getByText('Centre Alpha')).toBeInTheDocument());

    fireEvent.click(screen.getByTitle('Contact'));
    fireEvent.change(screen.getByPlaceholderText('Sujet du message'), { target: { value: 'Demande' } });
    fireEvent.change(screen.getByPlaceholderText('Votre message...'), { target: { value: 'Bonjour' } });
    fireEvent.click(screen.getByRole('button', { name: /envoyer/i }));

    expect(screen.getAllByText(/Action non disponible/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Message envoyé|Un email a été envoyé/i)).not.toBeInTheDocument();
  });
});

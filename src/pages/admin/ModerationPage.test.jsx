import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { NotificationProvider } from '../../context/NotificationContext';
import { ModerationPage } from './ModerationPage';
import { LitigesPage } from './LitigesPage';

describe('ModerationPage', () => {
  it('supports filtering and the main moderation actions', () => {
    window.localStorage.clear();
    render(
      <MemoryRouter>
        <ModerationPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Centre de modération/i })).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Recherche globale/i), {
      target: { value: 'fraude' },
    });

    expect(screen.getAllByText(/Fraude détectée/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getAllByRole('button', { name: /Voir détail/i })[0]);
    expect(screen.getByText(/Profil risque/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Créer un litige/i })[0]);
    expect(screen.getByText(/Litige créé/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Suspendre compte/i })[0]);
    expect(screen.getByText(/Compte de/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Marquer traité/i })[0]);
    expect(screen.getAllByText(/Alerte/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getAllByRole('button', { name: /Ignorer/i })[0]);
    expect(screen.getAllByText(/Alerte/i).length).toBeGreaterThan(0);
  });

  it('creates a real dispute dossier visible in the litiges page', () => {
    window.localStorage.clear();
    const { unmount } = render(
      <MemoryRouter>
        <ModerationPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByRole('button', { name: /Créer un litige/i })[0]);
    expect(screen.getByText(/Litige créé/i)).toBeInTheDocument();

    unmount();
    cleanup();

    render(
      <AuthProvider>
        <NotificationProvider>
          <MemoryRouter>
            <LitigesPage />
          </MemoryRouter>
        </NotificationProvider>
      </AuthProvider>
    );

    expect(screen.getAllByText(/Litige Fraude détectée/i).length).toBeGreaterThan(0);
  });
});

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { NotificationProvider } from '../../context/NotificationContext';
import { ModerationPage } from './ModerationPage';
import { LitigesPage } from './LitigesPage';

describe('ModerationPage', () => {
  it('supports filtering and the main moderation actions without fabricating backend success', () => {
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
    expect(screen.getByText(/Cette action est indisponible: cette vue utilise des données legacy/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Suspendre compte/i })[0]);
    expect(screen.getByText(/Cette action est indisponible: cette vue utilise des données legacy/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Marquer traité/i })[0]);
    expect(screen.getByText(/Cette action est indisponible: cette vue utilise des données legacy/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Ignorer/i })[0]);
    expect(screen.getByText(/Cette action est indisponible: cette vue utilise des données legacy/i)).toBeInTheDocument();
  });

  it('does not fabricate a dispute dossier in the litiges view', () => {
    window.localStorage.clear();
    const { unmount } = render(
      <MemoryRouter>
        <ModerationPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByRole('button', { name: /Créer un litige/i })[0]);
    expect(screen.getByText(/Cette action est indisponible: cette vue utilise des données legacy/i)).toBeInTheDocument();
    expect(screen.queryByText(/Litige créé/i)).not.toBeInTheDocument();

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

    expect(screen.queryByText(/Litige Fraude détectée/i)).not.toBeInTheDocument();
  });
});

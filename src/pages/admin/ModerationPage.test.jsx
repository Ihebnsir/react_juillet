import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ModerationPage } from './ModerationPage';

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

    fireEvent.click(screen.getAllByRole('button', { name: /Créer un litige/i })[1]);
    expect(screen.getByText(/Litige créé/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Suspendre compte/i })[0]);
    expect(screen.getByText(/Compte de/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Marquer traité/i })[0]);
    expect(screen.getAllByText(/Alerte/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getAllByRole('button', { name: /Ignorer/i })[0]);
    expect(screen.getAllByText(/Alerte/i).length).toBeGreaterThan(0);
  });
});

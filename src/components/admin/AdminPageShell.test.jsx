import { render, screen } from '@testing-library/react';
import { AdminPageShell } from './AdminPageShell';

describe('AdminPageShell', () => {
  it('renders the shared admin header and content', () => {
    render(
      <AdminPageShell
        eyebrow="Pilotage"
        title="Centre de pilotage"
        subtitle="Vue consolidée pour les équipes admin"
        badge="Live"
      >
        <div>Contenu de test</div>
      </AdminPageShell>
    );

    expect(screen.getByText('Pilotage')).toBeInTheDocument();
    expect(screen.getByText('Centre de pilotage')).toBeInTheDocument();
    expect(screen.getByText('Vue consolidée pour les équipes admin')).toBeInTheDocument();
    expect(screen.getByText('Live')).toBeInTheDocument();
    expect(screen.getByText('Contenu de test')).toBeInTheDocument();
  });
});

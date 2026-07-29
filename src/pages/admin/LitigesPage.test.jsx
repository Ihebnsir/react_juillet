import { fireEvent, render, screen } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import { NotificationProvider } from '../../context/NotificationContext';
import { LitigesPage } from './LitigesPage';

describe('LitigesPage', () => {
  it('supports the main litiges actions', () => {
    render(
      <AuthProvider>
        <NotificationProvider>
          <LitigesPage />
        </NotificationProvider>
      </AuthProvider>
    );

    expect(screen.getAllByText(/Gestion des dossiers|Case Management/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getAllByRole('button', { name: /Voir dossier/i })[0]);
    expect(screen.getByText(/Informations/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Justificatifs/i })[0]);
    expect(screen.getByText(/Documents/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Arbitrer/i })[0]);
    expect(screen.getAllByText(/Décision finale/i).length).toBeGreaterThan(0);
  });
});

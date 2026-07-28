import { fireEvent, render, screen } from '@testing-library/react';
import { ModerationPage } from './ModerationPage';

describe('ModerationPage', () => {
  it('filters items, toggles the view and resolves selected items in bulk', () => {
    render(<ModerationPage />);

    expect(screen.getByText(/Signalements en attente/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Rechercher par mot-clé, ID ou auteur/i), {
      target: { value: 'spam' },
    });

    expect(screen.getAllByText(/Spam/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: /tableau/i }));
    expect(screen.getByText(/Auteur/i)).toBeInTheDocument();

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    expect(screen.getByText(/Actions groupées/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Tout marquer comme résolu/i }));

    expect(screen.getAllByText(/Résolu/i).length).toBeGreaterThan(0);
  });
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotificationsBell } from './AppTopbar';

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 1, name: 'Amine' }, logout: jest.fn() }),
}));

jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'dark', setTheme: jest.fn() }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key, i18n: { language: 'fr', changeLanguage: jest.fn() } }),
}));

describe('NotificationsBell', () => {
  it('affiche le compteur des notifications non lues', () => {
    render(
      <MemoryRouter>
        <NotificationsBell />
      </MemoryRouter>
    );

    expect(screen.getByText('2')).toBeInTheDocument();
  });
});

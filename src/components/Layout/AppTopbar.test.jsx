import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotificationsBell } from './AppTopbar';
import { NotificationProvider } from '../../context/NotificationContext';

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 1, name: 'Amine', role: 'admin' }, logout: jest.fn() }),
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
        <NotificationProvider>
          <NotificationsBell />
        </NotificationProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('6')).toBeInTheDocument();
  });
});

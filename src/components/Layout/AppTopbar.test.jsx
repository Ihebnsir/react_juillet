import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { NotificationsBell } from './AppTopbar';
const mockMarkAsRead = jest.fn();
const mockNotifications = [{ id: 'notif-1', title: 'Nouveau message', message: 'Bonjour', category: 'messages', lu: false, conversationId: 'conv-1', createdAt: new Date().toISOString() }];

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 1, name: 'Centre', role: 'centre' }, logout: jest.fn() }),
}));

jest.mock('../../context/NotificationContext', () => ({
  useNotifications: () => ({ notifications: mockNotifications, unreadCount: 1, markAsRead: mockMarkAsRead }),
}));

const LocationProbe = () => {
  const location = useLocation();
  return <output data-testid="location-state">{`${location.pathname}:${location.state?.conversationId || ''}`}</output>;
};

jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'dark', setTheme: jest.fn() }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key, i18n: { language: 'fr', changeLanguage: jest.fn() } }),
}));

describe('NotificationsBell', () => {
  beforeEach(() => {
    mockMarkAsRead.mockClear();
  });

  it('affiche la notification message et son compteur après chargement réel', async () => {
    render(
      <MemoryRouter><NotificationsBell /><LocationProbe /></MemoryRouter>
    );

    expect(await screen.findByText('1')).toBeInTheDocument();
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
  });

  it('affiche le contenu message dans le dropdown', async () => {
    render(
      <MemoryRouter><NotificationsBell /><LocationProbe /></MemoryRouter>
    );

    await screen.findByText('1');
    await act(async () => {
      fireEvent.click(screen.getByLabelText('Notifications'));
    });
    expect(await screen.findByText('Bonjour')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('Bonjour'));
    });
    await waitFor(() => expect(screen.getByTestId('location-state')).toHaveTextContent('/centre/messagerie:conv-1'));
  });
});

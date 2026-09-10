import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationProvider, useNotifications } from './NotificationContext';
import { notificationsService } from '../services/notificationsService';

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'learner-1', role: 'apprenant' } }),
}));

jest.mock('../services/notificationsService', () => ({
  notificationsService: {
    getAll: jest.fn(),
    getUnreadCount: jest.fn(),
    markAllAsRead: jest.fn(),
  },
}));

const Consumer = () => {
  const { unreadCount, loading, markAllAsRead } = useNotifications();
  return <><span data-testid="count">{unreadCount}</span><span data-testid="loading">{String(loading)}</span><button onClick={markAllAsRead}>Tout marquer comme lu</button></>;
};

test('re-synchronizes notification state from the backend after mark-all-read', async () => {
  notificationsService.getAll.mockImplementation(() => Promise.resolve({
    data: [{ id: 'notification-1', lu: notificationsService.markAllAsRead.mock.calls.length > 0 }],
  }));
  notificationsService.getUnreadCount.mockImplementation(() => Promise.resolve(
    notificationsService.markAllAsRead.mock.calls.length > 0 ? 0 : 1
  ));
  notificationsService.markAllAsRead.mockResolvedValue({ updatedCount: 1 });

  render(<NotificationProvider><Consumer /></NotificationProvider>);
  await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('1'));

  await userEvent.click(screen.getByRole('button', { name: 'Tout marquer comme lu' }));

  await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('0'));
  expect(notificationsService.markAllAsRead).toHaveBeenCalledTimes(1);
  expect(notificationsService.getUnreadCount.mock.calls.length).toBeGreaterThanOrEqual(2);
});
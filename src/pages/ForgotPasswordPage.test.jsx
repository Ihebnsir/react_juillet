import { fireEvent, render, screen } from '@testing-library/react';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { MemoryRouter } from 'react-router-dom';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('ForgotPasswordPage', () => {
  it('does not simulate a successful password reset when the backend route is unavailable', () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/login.email/i), { target: { value: 'user@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /login.forgotSubmit/i }));

    expect(screen.getAllByText(/n’est pas disponible via le backend|not available via the backend/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/login.forgotSent|recovery link has been sent/i)).not.toBeInTheDocument();
  });
});

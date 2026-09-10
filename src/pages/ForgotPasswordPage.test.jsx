import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { ResetPasswordPage, VerifyResetCodePage } from './PasswordRecoveryPages';
import { forgotPassword, resetPassword, verifyResetCode } from '../services/authService';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock('../services/authService', () => ({
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  verifyResetCode: jest.fn(),
}));

const renderWithRoutes = (initialEntries, routes) => render(
  <MemoryRouter initialEntries={initialEntries}>
    <Routes>{routes}</Routes>
  </MemoryRouter>
);

describe('password recovery flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it('submits the email once, shows loading, and navigates to OTP without storage', async () => {
    let resolveRequest;
    forgotPassword.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve; }));
    renderWithRoutes(['/forgot-password'], <><Route path="/forgot-password" element={<ForgotPasswordPage />} /><Route path="/verify-reset-code" element={<p>Code de vérification</p>} /></>);

    fireEvent.change(screen.getByLabelText('login.email'), { target: { value: 'user@example.com' } });
    const submit = screen.getByRole('button', { name: 'Envoyer le code' });
    fireEvent.click(submit);
    fireEvent.click(submit);

    expect(forgotPassword).toHaveBeenCalledTimes(1);
    expect(forgotPassword).toHaveBeenCalledWith('user@example.com');
    expect(submit).toBeDisabled();
    expect(window.localStorage.length).toBe(0);

    resolveRequest({ success: true, message: 'generic' });
    await waitFor(() => expect(screen.getByText('Code de vérification')).toBeInTheDocument());
  });

  it('rejects an invalid email before calling the service', () => {
    renderWithRoutes(['/forgot-password'], <Route path="*" element={<ForgotPasswordPage />} />);
    fireEvent.change(screen.getByLabelText('login.email'), { target: { value: 'invalid' } });
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer le code' }));
    expect(forgotPassword).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('login.emailInvalid');
  });

  it('verifies the six-digit OTP with the backend contract', async () => {
    verifyResetCode.mockResolvedValue({ data: { resetToken: 'memory-token' } });
    renderWithRoutes(
      [{ pathname: '/verify-reset-code', state: { email: 'user@example.com' } }],
      <><Route path="/verify-reset-code" element={<VerifyResetCodePage />} /><Route path="/reset-password" element={<p>reset step</p>} /></>
    );
    fireEvent.change(screen.getByLabelText('Code de vérification'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier le code' }));
    await waitFor(() => expect(verifyResetCode).toHaveBeenCalledWith('user@example.com', '123456'));
    expect(await screen.findByText('reset step')).toBeInTheDocument();
    expect(window.localStorage.length).toBe(0);
  });

  it('rejects an invalid OTP without calling the backend', () => {
    renderWithRoutes(
      [{ pathname: '/verify-reset-code', state: { email: 'user@example.com' } }],
      <Route path="*" element={<VerifyResetCodePage />} />
    );
    fireEvent.change(screen.getByLabelText('Code de vérification'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Vérifier le code' }));
    expect(verifyResetCode).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('exactement 6 chiffres');
  });

  it('validates password confirmation and sends the exact reset payload', async () => {
    resetPassword.mockResolvedValue({ success: true });
    renderWithRoutes(
      [{ pathname: '/reset-password', state: { resetToken: 'memory-token' } }],
      <Route path="*" element={<ResetPasswordPage />} />
    );
    fireEvent.change(screen.getByLabelText('Nouveau mot de passe'), { target: { value: 'NewPassword123!' } });
    fireEvent.change(screen.getByLabelText('Confirmer le nouveau mot de passe'), { target: { value: 'different' } });
    fireEvent.click(screen.getByRole('button', { name: 'Réinitialiser le mot de passe' }));
    expect(resetPassword).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('ne correspondent pas');

    fireEvent.change(screen.getByLabelText('Confirmer le nouveau mot de passe'), { target: { value: 'NewPassword123!' } });
    fireEvent.click(screen.getByRole('button', { name: 'Réinitialiser le mot de passe' }));
    await waitFor(() => expect(resetPassword).toHaveBeenCalledWith('memory-token', 'NewPassword123!', 'NewPassword123!'));
    expect(await screen.findByText('Votre mot de passe a été réinitialisé avec succès.')).toBeInTheDocument();
    expect(window.localStorage.length).toBe(0);
  });
});

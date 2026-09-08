import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { ProtectedRoute } from './ProtectedRoute';

const mockUseAuth = jest.fn();
jest.mock('../../context/AuthContext', () => ({ useAuth: () => mockUseAuth() }));

describe('ProtectedRoute', () => {
  let consoleLog;

  beforeEach(() => {
    consoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLog.mockRestore();
  });

  it('does not log authentication or user data', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, user: { id: 'user-1', role: 'admin', email: 'admin@example.test' }, isLoading: false });

    render(<MemoryRouter><ProtectedRoute allowedRoles={['admin']}><div>Admin</div></ProtectedRoute></MemoryRouter>);

    expect(consoleLog).not.toHaveBeenCalled();
  });
});

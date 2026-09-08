import { API_URL } from './apiClient';
import { completeOAuthCallback } from './oauthService';

describe('oauthService', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('uses the configured API URL for provider callback exchange without hardcoded localhost:3001', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ email: 'user@example.com', nom: 'User', avatar: 'avatar.png' }),
    });

    await completeOAuthCallback('github', { code: 'abc' });

    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/auth/github/callback`, expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({ Accept: 'application/json' }),
    }));
    expect(`${API_URL}/auth/github/callback`).not.toContain('localhost:3001');
    expect(global.fetch.mock.calls[0][0]).not.toContain('localhost:3001');
  });
});

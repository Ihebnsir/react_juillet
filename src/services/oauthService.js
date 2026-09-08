import { API_URL } from './apiClient';

export async function completeOAuthCallback(provider, payload) {
  const response = await fetch(`${API_URL}/auth/${provider}/callback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  let result = null;
  try {
    result = await response.json();
  } catch {
    // Some provider failures do not include a JSON body.
  }

  if (!response.ok) {
    const error = new Error(result?.error || result?.message || `HTTP_${response.status}`);
    error.status = response.status;
    throw error;
  }

  return result;
}

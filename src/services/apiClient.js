const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const TOKEN_KEY = 'skillbridge_token';

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');

  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError('NETWORK_ERROR', 0);
  }

  let result = null;
  try {
    result = await response.json();
  } catch {
    // Some server failures do not include a JSON body.
  }

  if (!response.ok) {
    throw new ApiError(
      result?.message || result?.error || `HTTP_${response.status}`,
      response.status,
      result?.errors
    );
  }

  return result;
}

export { API_URL, TOKEN_KEY };

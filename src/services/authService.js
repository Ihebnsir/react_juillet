import { apiRequest, TOKEN_KEY } from './apiClient';

const STORAGE_KEY = 'skillbridge_user';

const normalizeUser = (user) => {
  if (!user) return null;
  const resolvedName = user.name || user.nom || user.email?.split('@')[0] || 'Utilisateur';
  return {
    ...user,
    name: resolvedName,
    nom: user.nom || resolvedName,
  };
};

function persistAuthResponse(result) {
  const token = result?.data?.token;
  const rawUser = result?.data?.user;

  if (!token || !rawUser || typeof rawUser !== 'object') {
    throw new Error('INVALID_AUTH_RESPONSE');
  }

  const user = normalizeUser(rawUser);
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export async function login(email, password) {
  const result = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return persistAuthResponse(result);
}

export async function register(userData) {
  const result = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  return { ...result, user: result?.data?.user ? normalizeUser(result.data.user) : undefined };
}

export async function getAuthenticatedUser() {
  const result = await apiRequest('/api/auth/me');
  const rawUser = result?.data?.user || result?.data;
  if (!rawUser || typeof rawUser !== 'object') {
    throw new Error('INVALID_AUTH_RESPONSE');
  }
  const user = normalizeUser(rawUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function getCurrentUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? normalizeUser(JSON.parse(raw)) : null;
}

export function saveUser(user) {
  const normalizedUser = normalizeUser(user);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedUser));
  return normalizedUser;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

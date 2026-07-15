import { mockUsers } from '../data/mockUsers';

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

export async function login(email, password) {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const user = mockUsers.find(
    (candidate) =>
      candidate.email.trim().toLowerCase() === email.trim().toLowerCase() &&
      candidate.password === password
  );

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const { password: _, ...safeUser } = user;
  const normalizedUser = normalizeUser(safeUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedUser));
  return normalizedUser;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
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

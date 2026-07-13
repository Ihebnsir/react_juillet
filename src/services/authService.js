import { mockUsers } from '../data/mockUsers';

const STORAGE_KEY = 'skillbridge_user';

export async function login(email, password) {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const user = mockUsers.find(
    (candidate) => candidate.email === email && candidate.password === password
  );

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const { password: _, ...safeUser } = user;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
  return safeUser;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

const STORAGE_KEYS = {
  stats: 'skillbridge_home_stats',
  temoignages: 'skillbridge_home_testimonials',
  categories: 'skillbridge_home_categories',
};

const defaultStats = {
  centres: 120,
  formations: 350,
  apprenants: 10,
  satisfaction: 4.8,
};

const defaultCategories = [
  { id: 'dev-web', label: 'Développement Web', visible: true },
  { id: 'data-bi', label: 'Data & BI', visible: true },
  { id: 'iot', label: 'IoT', visible: true },
  { id: 'python', label: 'Python', visible: true },
  { id: 'cybersecurite', label: 'Cybersécurité', visible: true },
  { id: 'langues', label: 'Langues', visible: true },
];

const readStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export function getStats() {
  return readStorage(STORAGE_KEYS.stats, defaultStats);
}

export function updateStats(newStats) {
  const safeStats = { ...defaultStats, ...newStats };
  writeStorage(STORAGE_KEYS.stats, safeStats);
  return safeStats;
}

export function getTemoignages() {
  return readStorage(STORAGE_KEYS.temoignages, []);
}

export function addTemoignage(temoignage) {
  const current = getTemoignages();
  const next = [{ id: Date.now(), ...temoignage }, ...current];
  writeStorage(STORAGE_KEYS.temoignages, next);
  return next;
}

export function updateTemoignage(id, updatedTemoignage) {
  const current = getTemoignages();
  const next = current.map((item) => (item.id === id ? { ...item, ...updatedTemoignage } : item));
  writeStorage(STORAGE_KEYS.temoignages, next);
  return next;
}

export function deleteTemoignage(id) {
  const current = getTemoignages();
  const next = current.filter((item) => item.id !== id);
  writeStorage(STORAGE_KEYS.temoignages, next);
  return next;
}

export function getCategoriesVisibles() {
  return readStorage(STORAGE_KEYS.categories, defaultCategories);
}

export function toggleCategorieVisible(id) {
  const current = getCategoriesVisibles();
  const next = current.map((cat) => (cat.id === id ? { ...cat, visible: !cat.visible } : cat));
  writeStorage(STORAGE_KEYS.categories, next);
  return next;
}

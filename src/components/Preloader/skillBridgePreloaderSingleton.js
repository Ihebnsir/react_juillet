const STORAGE_KEY = 'skillbridge_preloader_shown_v1';

// Requirement: show preloader once per app start/refresh, but NEVER on React Router navigation.
// Using sessionStorage achieves: cleared on refresh/close tab, persists across route changes.
export function shouldShowPreloader() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== 'true';
  } catch {
    // If storage is blocked/unavailable, fall back to showing on current page load.
    return true;
  }
}

export function markPreloaderShown() {
  try {
    sessionStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // ignore
  }
}



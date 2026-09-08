export const CENTRE_DOCUMENT_STATUSES = ['en_attente', 'valide', 'refuse'];
export const CENTRE_DOCUMENT_STATUS_LABELS = { en_attente: 'En attente', valide: 'Validé', refuse: 'Refusé' };
export const CENTRE_DOCUMENT_STATUS_CLASSES = { en_attente: 'bg-amber-100 text-amber-800', valide: 'bg-emerald-100 text-emerald-800', refuse: 'bg-rose-100 text-rose-800' };
export const isSafeExternalUrl = (value) => {
  if (typeof value !== 'string' || value.length > 500) return false;
  try { const url = new URL(value); return url.protocol === 'http:' || url.protocol === 'https:'; } catch { return false; }
};

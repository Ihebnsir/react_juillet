export const LITIGE_STATUSES = ['ouvert', 'analyse', 'attente_justificatifs', 'en_cours', 'decision', 'resolu', 'archive'];

export const LITIGE_STATUS_LABELS = {
  ouvert: 'Ouvert',
  analyse: 'Analyse',
  attente_justificatifs: 'Attente de justificatifs',
  en_cours: 'En cours',
  decision: 'Décision',
  resolu: 'Résolu',
  archive: 'Archivé',
};

export const LITIGE_STATUS_CLASSES = {
  ouvert: 'bg-amber-100 text-amber-800',
  analyse: 'bg-sky-100 text-sky-800',
  attente_justificatifs: 'bg-violet-100 text-violet-800',
  en_cours: 'bg-indigo-100 text-indigo-800',
  decision: 'bg-rose-100 text-rose-800',
  resolu: 'bg-emerald-100 text-emerald-800',
  archive: 'bg-slate-100 text-slate-700',
};

export const LITIGE_NEXT_STATUSES = {
  ouvert: ['analyse'],
  analyse: ['attente_justificatifs', 'en_cours'],
  attente_justificatifs: ['en_cours'],
  en_cours: ['decision'],
  decision: ['resolu'],
  resolu: ['archive'],
  archive: [],
};

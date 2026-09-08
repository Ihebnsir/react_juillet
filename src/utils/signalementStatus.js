export const SIGNALEMENT_STATUSES = ['En attente', 'En cours', 'Résolu'];

export const signalementStatusClasses = {
  'En attente': 'bg-amber-100 text-amber-800',
  'En cours': 'bg-sky-100 text-sky-800',
  'Résolu': 'bg-emerald-100 text-emerald-800',
};

export const getSignalementStatusClass = (status) => signalementStatusClasses[status] || 'bg-slate-100 text-slate-700';

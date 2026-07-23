import React from 'react';
import { FiCheckCircle, FiPlusSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const DashboardHero = ({ centre }) => {
  const navigate = useNavigate();
  const initials = (centre?.name || 'Centre')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogoError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.style.display = 'none';
    event.currentTarget.parentElement?.querySelector('[data-logo-fallback]')?.classList.remove('hidden');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br from-slate-50 via-white to-white/60 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 shadow-md">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 p-1 shadow-lg">
            {centre?.logo ? (
              <img
                src={centre.logo}
                alt={centre.name || 'logo'}
                onError={handleLogoError}
                className="h-full w-full rounded-md object-cover"
              />
            ) : null}
            <div data-logo-fallback className={`${centre?.logo ? 'hidden' : 'flex'} h-full w-full items-center justify-center rounded-md bg-white text-lg font-bold text-brand-700 dark:bg-slate-900 dark:text-brand-200`}>
              {initials}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{centre.name}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xl">Bienvenue sur votre tableau de bord — gérez vos formations et réservations.</p>
            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200">{centre.verifie ? <FiCheckCircle /> : null} {centre.verifie ? 'Vérifié' : 'Non vérifié'}</span>
              <span className="text-sm text-slate-600 dark:text-slate-300">⭐ {centre.noteMoyenne.toFixed(1)}</span>
              <span className="text-sm text-slate-600 dark:text-slate-300">👥 {centre.students || 124}</span>
              <span className="text-sm text-slate-600 dark:text-slate-300">📚 {centre.courses || 12} formations</span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => navigate('/centre/offres/nouvelle')}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2 text-white shadow hover:scale-[1.02] transition"
          >
            <FiPlusSquare /> Nouvelle formation
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;

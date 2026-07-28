import React from 'react';
import { X, ShieldCheck, ShieldAlert } from 'lucide-react';

const UserRiskDrawer = ({ open, user, onClose }) => {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden bg-slate-950/80 backdrop-blur-sm">
      <div className="flex flex-1 flex-col bg-slate-950 shadow-2xl sm:max-w-xl sm:pb-6">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Profil risque</p>
            <h2 className="text-2xl font-semibold text-white">{user.name}</h2>
          </div>
          <button onClick={onClose} className="rounded-full bg-white/5 p-2 text-slate-200 hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto p-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">Score de confiance</p>
                <p className="mt-2 text-4xl font-semibold text-white">{user.trustScore}%</p>
              </div>
              <div className="rounded-3xl bg-slate-800 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-300">
                {user.role}
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">{user.profileSummary}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">Email</p>
              <p className="mt-2 text-sm text-white">{user.email}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
              <p className="text-sm text-slate-400">Inscrit le</p>
              <p className="mt-2 text-sm text-white">{user.joined}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
            <div className="flex items-center gap-3 text-slate-300">
              <ShieldCheck size={18} />
              <p className="font-semibold">Activité normale</p>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-400">
              <p>Compte ancien avec des actions administrateur limitées.</p>
              <p>Confiance en progression grâce à la vérification récente.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
            <div className="flex items-center gap-3 text-slate-300">
              <ShieldAlert size={18} />
              <p className="font-semibold">Historique du profil</p>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              {user.history.map((event, index) => (
                <li key={index} className="rounded-2xl bg-slate-950/70 p-3">{event}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <button className="flex-1" onClick={onClose} aria-label="Fermer le drawer" />
    </div>
  );
};

export default UserRiskDrawer;

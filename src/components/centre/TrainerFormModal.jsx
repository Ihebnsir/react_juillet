import React, { useEffect, useState } from 'react';
import { ModalShell } from '../UI/ModalShell';

const emptyTrainer = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  speciality: '',
  status: 'active',
};

export const TrainerFormModal = ({ open, mode = 'add', initialData = {}, onClose, onSave }) => {
  const [form, setForm] = useState(emptyTrainer);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (!open) return;

    setForm({
      id: initialData?.id || '',
      firstName: initialData?.firstName || initialData?.name?.split(' ')[0] || '',
      lastName: initialData?.lastName || initialData?.name?.split(' ').slice(1).join(' ') || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      speciality: initialData?.speciality || '',
      status: initialData?.status === 'Actif' ? 'active' : initialData?.status === 'Inactif' ? 'inactive' : initialData?.status || 'active',
    });
  }, [open, initialData]);

  const isReadOnly = mode === 'view';

  const handleSave = () => {
    const payload = { ...form, id: form.id || undefined };

    if (!payload.firstName || !payload.lastName || !payload.email || !payload.speciality || !payload.status) {
      setValidationMessage('Tous les champs requis doivent être renseignés.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      setValidationMessage('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    setValidationMessage('');
    onSave(payload);
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
      >
        Annuler
      </button>
      {!isReadOnly ? (
        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500"
        >
          Enregistrer
        </button>
      ) : null}
    </>
  );

  return (
    <ModalShell
      open={open}
      title={mode === 'edit' ? 'Modifier le formateur' : mode === 'view' ? 'Détails du formateur' : 'Ajouter un formateur'}
      subtitle={mode === 'view' ? 'Fiche de consultation' : 'Complétez tous les champs pour créer le profil.'}
      onClose={onClose}
      footer={footer}
    >
      {validationMessage ? (
        <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{validationMessage}</div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="flex h-full items-center justify-center text-center text-sm text-slate-400">Les données d’avatar, biographie et cours assignés ne sont pas fournies par le backend.</div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm text-slate-300">
            <span>Prénom *</span>
            <input
              value={form.firstName}
              onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-300">
            <span>Nom *</span>
            <input
              value={form.lastName}
              onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-300">
            <span>Email *</span>
            <input
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-300">
            <span>Téléphone</span>
            <input
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-300">
            <span>Spécialité *</span>
            <input
              value={form.speciality}
              onChange={(event) => setForm((prev) => ({ ...prev, speciality: event.target.value }))}
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-300 md:col-span-2">
            <span>Statut</span>
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-500"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </label>
        </div>
      </div>
    </ModalShell>
  );
};

export default TrainerFormModal;

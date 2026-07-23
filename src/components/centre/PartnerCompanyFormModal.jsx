import React, { useEffect, useMemo, useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import fileToBase64 from '../../utils/fileToBase64';
import { ModalShell } from '../UI/ModalShell';

const emptyCompany = {
  id: '',
  name: '',
  sector: '',
  city: '',
  address: '',
  contactPerson: '',
  email: '',
  phone: '',
  website: '',
  internships: '',
  status: 'Actif',
  logo: '',
};

export const PartnerCompanyFormModal = ({ open, mode = 'add', initialData = {}, onClose, onSave }) => {
  const [form, setForm] = useState(emptyCompany);
  const [uploading, setUploading] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (!open) return;

    setForm({
      id: initialData?.id || '',
      name: initialData?.name || '',
      sector: initialData?.sector || '',
      city: initialData?.city || '',
      address: initialData?.address || '',
      contactPerson: initialData?.contactPerson || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      website: initialData?.website || '',
      internships: initialData?.internships || '',
      status: initialData?.status || 'Actif',
      logo: initialData?.logo || '',
    });
  }, [open, initialData]);

  const isReadOnly = mode === 'view';

  const previewLogo = useMemo(() => {
    if (form.logo) return form.logo;
    return `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(form.name || 'company')}`;
  }, [form.logo, form.name]);

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const base64 = await fileToBase64(file);
      setForm((prev) => ({ ...prev, logo: base64 }));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    const payload = {
      ...form,
      id: form.id || `company-${Date.now()}`,
      internships: Number(form.internships || 0),
      logo: form.logo || previewLogo,
    };

    if (!payload.name || !payload.sector || !payload.city || !payload.address || !payload.contactPerson || !payload.email || !payload.phone || !payload.website || !payload.status) {
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
      title={mode === 'edit' ? 'Modifier l’entreprise' : mode === 'view' ? 'Détails de l’entreprise' : 'Ajouter une entreprise'}
      subtitle={mode === 'view' ? 'Fiche de consultation' : 'Renseignez les informations de votre partenaire.'}
      onClose={onClose}
      footer={footer}
    >
      {validationMessage ? (
        <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{validationMessage}</div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="flex flex-col items-center gap-3">
            <img src={previewLogo} alt={form.name || 'Entreprise'} className="h-32 w-32 rounded-2xl object-cover ring-2 ring-brand-500/40" />
            {!isReadOnly ? (
              <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-brand-500 hover:text-white">
                <FiUploadCloud size={16} />
                {uploading ? 'Chargement...' : 'Télécharger'}
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm text-slate-300 md:col-span-2">
            <span>Nom de l’entreprise *</span>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-300">
            <span>Secteur d’activité *</span>
            <input
              value={form.sector}
              onChange={(event) => setForm((prev) => ({ ...prev, sector: event.target.value }))}
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-300">
            <span>Ville *</span>
            <input
              value={form.city}
              onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-300 md:col-span-2">
            <span>Adresse *</span>
            <input
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-300">
            <span>Contact *</span>
            <input
              value={form.contactPerson}
              onChange={(event) => setForm((prev) => ({ ...prev, contactPerson: event.target.value }))}
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
            <span>Téléphone *</span>
            <input
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-300">
            <span>Site web *</span>
            <input
              value={form.website}
              onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-300">
            <span>Capacité de stages</span>
            <input
              type="number"
              min="0"
              value={form.internships}
              onChange={(event) => setForm((prev) => ({ ...prev, internships: event.target.value }))}
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-300">
            <span>Statut</span>
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-500"
            >
              <option value="Actif">Actif</option>
              <option value="En attente">En attente</option>
              <option value="Suspendu">Suspendu</option>
            </select>
          </label>
        </div>
      </div>
    </ModalShell>
  );
};

export default PartnerCompanyFormModal;

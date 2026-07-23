import React, { useEffect, useMemo, useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import fileToBase64 from '../../utils/fileToBase64';
import { ModalShell } from '../UI/ModalShell';

const courseOptions = [
  'React Avancé',
  'Node.js Backend',
  'UI/UX Design',
  'Data Science Basics',
  'Python pour Data',
  'Gestion Agile',
  'Cloud Foundations',
  'Tableau de bord BI',
];

const emptyTrainer = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  speciality: '',
  yearsOfExperience: '',
  assignedCourses: [],
  biography: '',
  status: 'Actif',
  avatar: '',
};

export const TrainerFormModal = ({ open, mode = 'add', initialData = {}, onClose, onSave }) => {
  const [form, setForm] = useState(emptyTrainer);
  const [uploading, setUploading] = useState(false);
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
      yearsOfExperience: initialData?.yearsOfExperience || initialData?.experience || '',
      assignedCourses: initialData?.assignedCourses || [],
      biography: initialData?.biography || '',
      status: initialData?.status || 'Actif',
      avatar: initialData?.avatar || '',
    });
  }, [open, initialData]);

  const isReadOnly = mode === 'view';

  const previewPhoto = useMemo(() => {
    if (form.avatar) return form.avatar;
    const seed = [form.firstName, form.lastName].filter(Boolean).join(' ') || 'trainer';
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
  }, [form.avatar, form.firstName, form.lastName]);

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const base64 = await fileToBase64(file);
      setForm((prev) => ({ ...prev, avatar: base64 }));
    } finally {
      setUploading(false);
    }
  };

  const handleToggleCourse = (course) => {
    setForm((prev) => {
      const exists = prev.assignedCourses.includes(course);
      return {
        ...prev,
        assignedCourses: exists
          ? prev.assignedCourses.filter((item) => item !== course)
          : [...prev.assignedCourses, course],
      };
    });
  };

  const handleSave = () => {
    const payload = {
      ...form,
      id: form.id || `trainer-${Date.now()}`,
      name: `${form.firstName} ${form.lastName}`.trim(),
      yearsOfExperience: Number(form.yearsOfExperience || 0),
      assignedCourses: form.assignedCourses,
      avatar: form.avatar || previewPhoto,
    };

    if (!payload.firstName || !payload.lastName || !payload.email || !payload.phone || !payload.speciality || !payload.biography || !payload.status) {
      setValidationMessage('Tous les champs requis doivent être renseignés.');
      return;
    }

    if (!payload.assignedCourses.length) {
      setValidationMessage('Sélectionnez au moins un cours assigné.');
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
          <div className="flex flex-col items-center gap-3">
            <img src={previewPhoto} alt={form.firstName ? `${form.firstName} ${form.lastName}`.trim() || 'Formateur' : 'Formateur'} className="h-32 w-32 rounded-2xl object-cover ring-2 ring-brand-500/40" />
            {!isReadOnly ? (
              <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-brand-500 hover:text-white">
                <FiUploadCloud size={16} />
                {uploading ? 'Chargement...' : 'Télécharger'}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            ) : null}
          </div>
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
            <span>Téléphone *</span>
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

          <label className="space-y-1 text-sm text-slate-300">
            <span>Années d'expérience *</span>
            <input
              type="number"
              min="0"
              value={form.yearsOfExperience}
              onChange={(event) => setForm((prev) => ({ ...prev, yearsOfExperience: event.target.value }))}
              disabled={isReadOnly}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition focus:border-brand-500"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-300 md:col-span-2">
            <span>Biographie *</span>
            <textarea
              rows={3}
              value={form.biography}
              onChange={(event) => setForm((prev) => ({ ...prev, biography: event.target.value }))}
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
              <option value="Actif">Actif</option>
              <option value="Disponibilité limitée">Disponibilité limitée</option>
              <option value="En pause">En pause</option>
            </select>
          </label>

          <div className="space-y-2 text-sm text-slate-300 md:col-span-2">
            <span>Cours assignés *</span>
            <div className="grid gap-2 md:grid-cols-2">
              {courseOptions.map((course) => {
                const checked = form.assignedCourses.includes(course);
                return (
                  <label key={course} className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleCourse(course)}
                      disabled={isReadOnly}
                    />
                    <span>{course}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
};

export default TrainerFormModal;

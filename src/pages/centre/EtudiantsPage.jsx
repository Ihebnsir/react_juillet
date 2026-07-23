import React, { useEffect, useMemo, useState } from 'react';
import { FiEye, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import { ToastMessage } from '../../components/UI/ToastMessage';
import { ModalShell } from '../../components/UI/ModalShell';
import { ConfirmDialog } from '../../components/UI/ConfirmDialog';
import { EmptyStateCard } from '../../components/UI/EmptyStateCard';
import { ManagementPageLayout } from '../../components/centre/ManagementPageLayout';
import { mockStudents } from '../../data/mockStudents';
import { useAuth } from '../../context/AuthContext';
import { useTrash } from '../../context/TrashContext';
import { useActivityLog } from '../../context/ActivityContext';
import fileToBase64 from '../../utils/fileToBase64';

const STORAGE_KEY = 'skillbridge_students';
const PAGE_SIZE = 4;

const readStoredStudents = () => {
  if (typeof window === 'undefined') return mockStudents;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return mockStudents;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : mockStudents;
  } catch {
    return mockStudents;
  }
};

const normalizeStudent = (payload) => ({
  ...payload,
  id: payload.id || `student-${Date.now()}`,
  firstName: payload.firstName || payload.name?.split(' ')[0] || '',
  lastName: payload.lastName || payload.name?.split(' ').slice(1).join(' ') || '',
  enrolledFormations: Array.isArray(payload.enrolledFormations) ? payload.enrolledFormations : String(payload.enrolledFormations || '').split(',').map((item) => item.trim()).filter(Boolean),
  attendance: Number(payload.attendance || 0),
  progress: Number(payload.progress || 0),
  avatar: payload.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(payload.email || payload.firstName || 'student')}`,
});

const emptyStudent = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  birthDate: '',
  gender: 'Femme',
  currentFormation: '',
  session: '',
  status: 'En cours',
  notes: '',
  enrolledFormations: [],
  attendance: 0,
  progress: 0,
  certificateStatus: 'En cours',
  avatar: '',
};

const StudentModal = ({ open, mode = 'add', initialData = {}, onClose, onSave }) => {
  const [form, setForm] = useState(emptyStudent);
  const [uploading, setUploading] = useState(false);
  const isReadOnly = mode === 'view';

  useEffect(() => {
    if (!open) return;
    const payload = normalizeStudent(initialData);
    setForm({
      ...emptyStudent,
      ...payload,
      firstName: payload.firstName || '',
      lastName: payload.lastName || '',
      enrolledFormations: payload.enrolledFormations || [],
      avatar: payload.avatar || '',
    });
  }, [open, initialData]);

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setForm((prev) => ({ ...prev, avatar: base64 }));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone) return;
    const nextStudent = normalizeStudent({
      ...form,
      name: `${form.firstName} ${form.lastName}`.trim(),
      currentFormation: form.currentFormation || form.enrolledFormations?.[0] || '',
    });
    onSave(nextStudent);
  };

  return (
    <ModalShell
      open={open}
      title={mode === 'edit' ? 'Modifier l’étudiant' : mode === 'view' ? 'Détails de l’étudiant' : 'Ajouter un étudiant'}
      subtitle={mode === 'view' ? 'Lecture seule' : 'Complétez le dossier de l’apprenant.'}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-sm">Annuler</button>
          {!isReadOnly ? <button type="button" onClick={handleSave} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Enregistrer</button> : null}
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2 flex items-center gap-3">
          <img src={form.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=student'} alt="avatar" className="h-16 w-16 rounded-2xl object-cover" />
          {!isReadOnly ? (
            <label className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-200">
              {uploading ? 'Chargement...' : 'Ajouter une photo'}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          ) : null}
        </div>
        <label className="space-y-1 text-sm text-slate-300"><span>Prénom *</span><input disabled={isReadOnly} value={form.firstName} onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Nom *</span><input disabled={isReadOnly} value={form.lastName} onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Email *</span><input type="email" disabled={isReadOnly} value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Téléphone *</span><input disabled={isReadOnly} value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300 md:col-span-2"><span>Adresse</span><input disabled={isReadOnly} value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Date de naissance</span><input type="date" disabled={isReadOnly} value={form.birthDate} onChange={(e) => setForm((prev) => ({ ...prev, birthDate: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Genre</span><select disabled={isReadOnly} value={form.gender} onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white"><option>Femme</option><option>Homme</option><option>Autre</option></select></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Formation actuelle</span><input disabled={isReadOnly} value={form.currentFormation} onChange={(e) => setForm((prev) => ({ ...prev, currentFormation: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Session</span><input disabled={isReadOnly} value={form.session} onChange={(e) => setForm((prev) => ({ ...prev, session: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Statut</span><select disabled={isReadOnly} value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white"><option>Actif</option><option>En cours</option><option>À relancer</option><option>Terminé</option></select></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Progression</span><input type="number" disabled={isReadOnly} value={form.progress} onChange={(e) => setForm((prev) => ({ ...prev, progress: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300 md:col-span-2"><span>Notes</span><textarea disabled={isReadOnly} value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} className="min-h-24 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
      </div>
    </ModalShell>
  );
};

export const EtudiantsPage = () => {
  const { user } = useAuth();
  const { softDelete } = useTrash();
  const { recordActivity } = useActivityLog();
  const [students, setStudents] = useState(readStoredStudents);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [formation, setFormation] = useState('all');
  const [page, setPage] = useState(1);
  const [modalState, setModalState] = useState({ open: false, mode: 'add', selected: null });
  const [confirmState, setConfirmState] = useState({ open: false, id: null });
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  const formationOptions = useMemo(() => ['all', ...new Set(students.flatMap((student) => student.enrolledFormations || []).filter(Boolean))], [students]);

  const filteredStudents = useMemo(() => students.filter((student) => {
    const haystack = [student.name, student.email, student.phone, student.currentFormation, student.session, student.status].join(' ').toLowerCase();
    const matchSearch = haystack.includes(search.toLowerCase());
    const matchStatus = status === 'all' || student.status === status || student.certificateStatus === status;
    const matchFormation = formation === 'all' || (student.enrolledFormations || []).includes(formation) || student.currentFormation === formation;
    return matchSearch && matchStatus && matchFormation;
  }), [students, search, status, formation]);

  const pageCount = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visibleStudents = filteredStudents.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, status, formation]);

  const handleSave = (payload) => {
    setStudents((prev) => {
      const exists = prev.some((item) => item.id === payload.id);
      if (exists) {
        return prev.map((item) => (item.id === payload.id ? payload : item));
      }
      return [payload, ...prev];
    });

    const actionLabel = modalState.mode === 'edit' ? 'Étudiant mis à jour.' : 'Étudiant ajouté.';
    recordActivity({
      user: user?.name || 'Système',
      action: modalState.mode === 'edit' ? 'Étudiant modifié' : 'Étudiant ajouté',
      type: 'users',
      details: `${payload.name || payload.firstName || 'Étudiant'} • ${actionLabel}`,
    });

    setToast({ type: 'success', message: actionLabel });
    setModalState({ open: false, mode: 'add', selected: null });
  };

  const handleDelete = () => {
    const studentToRemove = students.find((item) => item.id === confirmState.id);
    if (!studentToRemove) return;

    setStudents((prev) => prev.filter((item) => item.id !== confirmState.id));
    softDelete({
      type: 'étudiant',
      item: studentToRemove,
      deletedBy: user?.name || 'Système',
    });
    recordActivity({
      user: user?.name || 'Système',
      action: 'Étudiant supprimé',
      type: 'users',
      details: `${studentToRemove.name || 'Étudiant'} déplacé vers la corbeille.`,
    });
    setConfirmState({ open: false, id: null });
    setToast({ type: 'success', message: 'Étudiant supprimé.' });
  };

  return (
    <div className="space-y-6">
      <ToastMessage type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />

      <ManagementPageLayout
        title="Étudiants"
        description="Pilotage du dossier apprenant, sa progression, sa session et son statut administratif."
        primaryActionLabel="Ajouter un étudiant"
        onPrimaryAction={() => setModalState({ open: true, mode: 'add', selected: emptyStudent })}
        searchValue={search}
        onSearchChange={setSearch}
        filterValue={status}
        onFilterChange={setStatus}
        filterLabel="Tous statuts"
        filterOptions={['all', 'Actif', 'En cours', 'À relancer', 'Terminé', 'Émis', 'En attente', 'Archivé']}
        emptyState={filteredStudents.length === 0 ? <EmptyStateCard icon={FiUsers} title="Aucun étudiant" description="Ajoutez un étudiant pour gérer sa progression, sa session et son certificat." primaryLabel="Ajouter" onPrimary={() => setModalState({ open: true, mode: 'add', selected: emptyStudent })} /> : null}
      >
        <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="mb-3 grid gap-3 md:grid-cols-2">
            <select value={formation} onChange={(event) => setFormation(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option value="all">Toutes formations</option>
              {formationOptions.filter((option) => option !== 'all').map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <th className="px-3 py-3">Apprenant</th>
                  <th className="px-3 py-3">Formation</th>
                  <th className="px-3 py-3">Session</th>
                  <th className="px-3 py-3">Progression</th>
                  <th className="px-3 py-3">Statut</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleStudents.map((student) => (
                  <tr key={student.id} className="border-b border-slate-200 last:border-none dark:border-slate-700">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <img src={student.avatar} alt={student.name} className="h-10 w-10 rounded-xl object-cover" />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{student.name}</div>
                          <div className="text-xs text-slate-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{student.currentFormation || student.enrolledFormations?.[0] || '—'}</td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{student.session || '—'}</td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{student.progress}%</td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{student.status || student.certificateStatus || '—'}</td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setModalState({ open: true, mode: 'view', selected: student })} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"><FiEye size={16} /></button>
                        <button type="button" onClick={() => setModalState({ open: true, mode: 'edit', selected: student })} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"><FiEdit2 size={16} /></button>
                        <button type="button" onClick={() => setConfirmState({ open: true, id: student.id })} className="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/20"><FiTrash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ManagementPageLayout>

      {filteredStudents.length > 0 ? (
        <div className="flex items-center justify-between rounded-3xl bg-white px-4 py-3 text-sm shadow-sm dark:bg-slate-800">
          <div className="text-slate-500 dark:text-slate-400">Page {safePage} / {pageCount}</div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 dark:border-slate-700">Précédent</button>
            <button type="button" onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 dark:border-slate-700">Suivant</button>
          </div>
        </div>
      ) : null}

      <StudentModal open={modalState.open} mode={modalState.mode} initialData={modalState.selected} onClose={() => setModalState({ open: false, mode: 'add', selected: null })} onSave={handleSave} />
      <ConfirmDialog open={confirmState.open} title="Supprimer l’étudiant" message="Voulez-vous vraiment retirer cet étudiant ?" onCancel={() => setConfirmState({ open: false, id: null })} onConfirm={handleDelete} />
    </div>
  );
};

export default EtudiantsPage;

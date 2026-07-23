import React, { useEffect, useMemo, useState } from 'react';
import { FiCalendar, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { ToastMessage } from '../../components/UI/ToastMessage';
import { ModalShell } from '../../components/UI/ModalShell';
import { ConfirmDialog } from '../../components/UI/ConfirmDialog';
import { EmptyStateCard } from '../../components/UI/EmptyStateCard';
import { ManagementPageLayout } from '../../components/centre/ManagementPageLayout';
import { mockSessions } from '../../data/mockSessions';
import { useAuth } from '../../context/AuthContext';
import { useTrash } from '../../context/TrashContext';
import { useActivityLog } from '../../context/ActivityContext';

const STORAGE_KEY = 'skillbridge_sessions';

const readStoredSessions = () => {
  if (typeof window === 'undefined') return mockSessions;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return mockSessions;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : mockSessions;
  } catch {
    return mockSessions;
  }
};

const emptySession = {
  id: '',
  title: '',
  formation: '',
  trainer: '',
  room: '',
  startDate: '',
  endDate: '',
  capacity: '',
  seatsLeft: '',
  status: 'Ouverte',
};

const SessionModal = ({ open, mode = 'add', initialData = {}, onClose, onSave }) => {
  const [form, setForm] = useState(emptySession);
  const isReadOnly = mode === 'view';

  useEffect(() => {
    if (!open) return;
    setForm({ ...emptySession, ...initialData });
  }, [open, initialData]);

  const handleSave = () => {
    if (!form.title || !form.formation || !form.trainer || !form.room || !form.startDate || !form.endDate || !form.capacity) {
      return;
    }

    onSave({
      ...form,
      id: form.id || `session-${Date.now()}`,
      capacity: Number(form.capacity || 0),
      seatsLeft: Number(form.seatsLeft || 0),
    });
  };

  return (
    <ModalShell
      open={open}
      title={mode === 'edit' ? 'Modifier la session' : mode === 'view' ? 'Détails de la session' : 'Ajouter une session'}
      subtitle={mode === 'view' ? 'Lecture seule' : 'Renseignez les informations de la session.'}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white">Annuler</button>
          {!isReadOnly ? <button type="button" onClick={handleSave} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500">Enregistrer</button> : null}
        </>
      }
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm text-slate-300"><span>Titre *</span><input disabled={isReadOnly} value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Formation *</span><input disabled={isReadOnly} value={form.formation} onChange={(e) => setForm((prev) => ({ ...prev, formation: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Formateur *</span><input disabled={isReadOnly} value={form.trainer} onChange={(e) => setForm((prev) => ({ ...prev, trainer: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Salle *</span><input disabled={isReadOnly} value={form.room} onChange={(e) => setForm((prev) => ({ ...prev, room: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Date de début *</span><input type="date" disabled={isReadOnly} value={form.startDate} onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Date de fin *</span><input type="date" disabled={isReadOnly} value={form.endDate} onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Capacité *</span><input type="number" disabled={isReadOnly} value={form.capacity} onChange={(e) => setForm((prev) => ({ ...prev, capacity: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Places restantes</span><input type="number" disabled={isReadOnly} value={form.seatsLeft} onChange={(e) => setForm((prev) => ({ ...prev, seatsLeft: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300 md:col-span-2"><span>Statut</span><select disabled={isReadOnly} value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white"><option>Ouverte</option><option>À venir</option><option>Complète</option></select></label>
      </div>
    </ModalShell>
  );
};

export const SessionsPage = () => {
  const { user } = useAuth();
  const { softDelete } = useTrash();
  const { recordActivity } = useActivityLog();
  const [sessions, setSessions] = useState(readStoredSessions);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [modalState, setModalState] = useState({ open: false, mode: 'add', selected: null });
  const [confirmState, setConfirmState] = useState({ open: false, id: null });
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchSearch = [session.title, session.formation, session.trainer, session.room].join(' ').toLowerCase().includes(search.toLowerCase());
      const matchStatus = status === 'all' || session.status === status;
      return matchSearch && matchStatus;
    });
  }, [sessions, search, status]);

  const handleSave = (payload) => {
    setSessions((prev) => {
      const exists = prev.some((item) => item.id === payload.id);
      return exists ? prev.map((item) => item.id === payload.id ? payload : item) : [payload, ...prev];
    });
    recordActivity({
      user: user?.name || 'Système',
      action: modalState.mode === 'edit' ? 'Session modifiée' : 'Session créée',
      type: 'formation',
      details: `${payload.title || 'Session'} • ${modalState.mode === 'edit' ? 'mise à jour' : 'création'} de l’offre de session.`,
    });
    setToast({ type: 'success', message: modalState.mode === 'edit' ? 'Session mise à jour.' : 'Session ajoutée.' });
    setModalState({ open: false, mode: 'add', selected: null });
  };

  const handleDelete = () => {
    const sessionToRemove = sessions.find((item) => item.id === confirmState.id);
    if (!sessionToRemove) return;

    setSessions((prev) => prev.filter((item) => item.id !== confirmState.id));
    softDelete({
      type: 'session',
      item: sessionToRemove,
      deletedBy: user?.name || 'Système',
    });
    recordActivity({
      user: user?.name || 'Système',
      action: 'Session supprimée',
      type: 'formation',
      details: `${sessionToRemove.title || 'Session'} déplacée vers la corbeille.`,
    });
    setConfirmState({ open: false, id: null });
    setToast({ type: 'success', message: 'Session supprimée.' });
  };

  return (
    <div className="space-y-6">
      <ToastMessage type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />
      <ManagementPageLayout
        title="Sessions"
        description="Pilotage des sessions de formation, planification et capacité restante."
        primaryActionLabel="Ajouter une session"
        onPrimaryAction={() => setModalState({ open: true, mode: 'add', selected: null })}
        searchValue={search}
        onSearchChange={setSearch}
        filterValue={status}
        onFilterChange={setStatus}
        filterLabel="Tous statuts"
        filterOptions={['all', 'Ouverte', 'À venir', 'Complète']}
        emptyState={
          filteredSessions.length === 0 ? (
            <EmptyStateCard icon={FiCalendar} title="Aucune session" description="Créez une nouvelle session pour organiser vos formations." primaryLabel="Ajouter" onPrimary={() => setModalState({ open: true, mode: 'add', selected: null })} />
          ) : null
        }
      >
        <div className="grid gap-4">
          {filteredSessions.map((session) => (
            <div key={session.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{session.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{session.formation} • {session.trainer}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-700">Salle {session.room}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-700">{session.startDate} → {session.endDate}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-700">{session.capacity} places</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-700">{session.seatsLeft} restantes</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setModalState({ open: true, mode: 'view', selected: session })} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"><FiEye size={16} /></button>
                  <button type="button" onClick={() => setModalState({ open: true, mode: 'edit', selected: session })} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"><FiEdit2 size={16} /></button>
                  <button type="button" onClick={() => setConfirmState({ open: true, id: session.id })} className="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/20"><FiTrash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ManagementPageLayout>

      <SessionModal open={modalState.open} mode={modalState.mode} initialData={modalState.selected} onClose={() => setModalState({ open: false, mode: 'add', selected: null })} onSave={handleSave} />
      <ConfirmDialog open={confirmState.open} title="Supprimer la session" message="Voulez-vous vraiment supprimer cette session ?" onCancel={() => setConfirmState({ open: false, id: null })} onConfirm={handleDelete} />
    </div>
  );
};

export default SessionsPage;

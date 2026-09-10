import React, { useEffect, useMemo, useState } from 'react';
import { FiCalendar, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { ToastMessage } from '../../components/UI/ToastMessage';
import { ModalShell } from '../../components/UI/ModalShell';
import { ConfirmDialog } from '../../components/UI/ConfirmDialog';
import { EmptyStateCard } from '../../components/UI/EmptyStateCard';
import { ManagementPageLayout } from '../../components/centre/ManagementPageLayout';
import { sessionsService } from '../../services/sessionsService';
import { formationsService } from '../../services/formationsService';

const emptySession = {
  id: '',
  title: '',
  formationId: '',
  description: '',
  date: '',
  startTime: '',
  endTime: '',
  location: '',
  meetingUrl: '',
  status: 'scheduled',
};

const SessionModal = ({ open, mode = 'add', initialData = {}, formations = [], onClose, onSave }) => {
  const [form, setForm] = useState(emptySession);
  const isReadOnly = mode === 'view';

  useEffect(() => {
    if (!open) return;
    setForm({ ...emptySession, ...initialData });
  }, [open, initialData]);

  const handleSave = () => {
    if (!form.title || !form.formationId || !form.date) {
      return;
    }

    onSave(form);
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
        <label className="space-y-1 text-sm text-slate-300"><span>Formation *</span><select disabled={isReadOnly} value={form.formationId} onChange={(e) => setForm((prev) => ({ ...prev, formationId: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white"><option value="">Sélectionner</option>{formations.map((formation) => <option key={formation.id} value={formation.id}>{formation.title}</option>)}</select></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Date *</span><input type="date" disabled={isReadOnly} value={form.date?.slice(0, 10)} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Heure de début</span><input type="time" disabled={isReadOnly} value={form.startTime} onChange={(e) => setForm((prev) => ({ ...prev, startTime: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Heure de fin</span><input type="time" disabled={isReadOnly} value={form.endTime} onChange={(e) => setForm((prev) => ({ ...prev, endTime: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Lieu</span><input disabled={isReadOnly} value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300"><span>Lien de réunion</span><input disabled={isReadOnly} value={form.meetingUrl} onChange={(e) => setForm((prev) => ({ ...prev, meetingUrl: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300 md:col-span-2"><span>Description</span><textarea disabled={isReadOnly} value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white" /></label>
        <label className="space-y-1 text-sm text-slate-300 md:col-span-2"><span>Statut</span><select disabled={isReadOnly} value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white"><option value="scheduled">Planifiée</option><option value="ongoing">En cours</option><option value="completed">Terminée</option><option value="cancelled">Annulée</option></select></label>
      </div>
    </ModalShell>
  );
};

export const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [modalState, setModalState] = useState({ open: false, mode: 'add', selected: null });
  const [confirmState, setConfirmState] = useState({ open: false, id: null });
  const [toast, setToast] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formations, setFormations] = useState([]);

  const loadSessions = async () => {
    setLoading(true); setError('');
    try {
      const result = await sessionsService.list({ page: 1, limit: 100 });
      setSessions(result.data || []);
      setFormations(await formationsService.getAll());
    } catch (requestError) {
      setSessions([]);
      setError(requestError?.status === 401 ? 'Session expirée.' : requestError?.status === 403 ? 'Accès refusé.' : requestError?.message || 'Impossible de charger les sessions.');
    } finally { setLoading(false); }
  };

  useEffect(() => { loadSessions(); }, []);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchSearch = [session.title, session.formationTitle, session.location, session.description].join(' ').toLowerCase().includes(search.toLowerCase());
      const matchStatus = status === 'all' || session.status === status;
      return matchSearch && matchStatus;
    });
  }, [sessions, search, status]);

  const handleSave = async (payload) => {
    try {
      const request = { ...payload, formation: payload.formationId };
      delete request.id; delete request.formationId; delete request.formationTitle; delete request.centreId;
      const saved = modalState.mode === 'edit' ? await sessionsService.update(payload.id, request) : await sessionsService.create(request);
      setSessions((prev) => modalState.mode === 'edit' ? prev.map((item) => item.id === saved.id ? saved : item) : [saved, ...prev]);
      setToast({ type: 'success', message: modalState.mode === 'edit' ? 'Session mise à jour.' : 'Session ajoutée.' });
      setModalState({ open: false, mode: 'add', selected: null });
    } catch (requestError) { setToast({ type: 'error', message: requestError?.message || 'Impossible d’enregistrer la session.' }); }
  };

  const handleDelete = async () => {
    const sessionToRemove = sessions.find((item) => item.id === confirmState.id);
    if (!sessionToRemove) return;
    try { await sessionsService.remove(sessionToRemove.id); setSessions((prev) => prev.filter((item) => item.id !== confirmState.id)); setConfirmState({ open: false, id: null }); setToast({ type: 'success', message: 'Session supprimée.' }); }
    catch (requestError) { setToast({ type: 'error', message: requestError?.message || 'Impossible de supprimer la session.' }); }
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
        filterOptions={['all', 'scheduled', 'ongoing', 'completed', 'cancelled']}
        emptyState={
          filteredSessions.length === 0 ? (
            <EmptyStateCard icon={FiCalendar} title="Aucune session" description="Créez une nouvelle session pour organiser vos formations." primaryLabel="Ajouter" onPrimary={() => setModalState({ open: true, mode: 'add', selected: null })} />
          ) : null
        }
      >
        {loading ? <p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-500">Chargement...</p> : null}
        {error ? <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error} <button type="button" onClick={loadSessions} className="ml-2 underline">Réessayer</button></p> : null}
        <div className="grid gap-4">
          {filteredSessions.map((session) => (
            <div key={session.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{session.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{session.formationTitle || 'Formation'} • {session.status}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-700">{session.location || 'Lieu non renseigné'}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-700">{new Date(session.date).toLocaleDateString('fr-FR')} {session.startTime || ''}{session.endTime ? ` → ${session.endTime}` : ''}</span>
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

      <SessionModal open={modalState.open} mode={modalState.mode} initialData={modalState.selected} formations={formations} onClose={() => setModalState({ open: false, mode: 'add', selected: null })} onSave={handleSave} />
      <ConfirmDialog open={confirmState.open} title="Supprimer la session" message="Voulez-vous vraiment supprimer cette session ?" onCancel={() => setConfirmState({ open: false, id: null })} onConfirm={handleDelete} />
    </div>
  );
};

export default SessionsPage;

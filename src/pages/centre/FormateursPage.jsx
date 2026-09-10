import React, { useMemo, useState } from 'react';
import { FiSearch, FiEye, FiEdit2, FiTrash2, FiPlus, FiFilter, FiUserCheck } from 'react-icons/fi';
import { ToastMessage } from '../../components/UI/ToastMessage';
import { TrainerFormModal } from '../../components/centre/TrainerFormModal';
import { ConfirmDialog } from '../../components/UI/ConfirmDialog';
import { EmptyStateCard } from '../../components/UI/EmptyStateCard';
import { trainersService } from '../../services/trainersService';

const PAGE_SIZE = 3;
export const FormateursPage = () => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [specialityFilter, setSpecialityFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [trainers, setTrainers] = useState([]);
  const [modalState, setModalState] = useState({ open: false, mode: 'add', selected: null });
  const [confirmState, setConfirmState] = useState({ open: false, trainerId: null });
  const [toast, setToast] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTrainers = async () => {
    setLoading(true); setError('');
    try { const result = await trainersService.list(); setTrainers(result.data || []); }
    catch (requestError) { setTrainers([]); setError(requestError?.status === 401 ? 'Session expirée.' : requestError?.status === 403 ? 'Accès refusé.' : requestError?.message || 'Impossible de charger les formateurs.'); }
    finally { setLoading(false); }
  };

  React.useEffect(() => { loadTrainers(); }, []);

  const specialityOptions = useMemo(() => {
    return ['all', ...new Set(trainers.map((trainer) => trainer.speciality).filter(Boolean))];
  }, [trainers]);

  const filteredTrainers = useMemo(() => {
    return trainers.filter((trainer) => {
      const haystack = [trainer.name, trainer.speciality, trainer.email, trainer.phone].join(' ').toLowerCase();
      const matchQuery = haystack.includes(query.toLowerCase());
      const matchStatus = statusFilter === 'all' || trainer.status === statusFilter;
      const matchSpeciality = specialityFilter === 'all' || trainer.speciality === specialityFilter;
      return matchQuery && matchStatus && matchSpeciality;
    });
  }, [query, statusFilter, specialityFilter, trainers]);

  const pageCount = Math.max(1, Math.ceil(filteredTrainers.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleTrainers = filteredTrainers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openAddModal = () => {
    setModalState({ open: true, mode: 'add', selected: null });
  };

  const openEditModal = (trainer) => {
    setModalState({ open: true, mode: 'edit', selected: trainer });
  };

  const openViewModal = (trainer) => {
    setModalState({ open: true, mode: 'view', selected: trainer });
  };

  const closeModal = () => {
    setModalState({ open: false, mode: 'add', selected: null });
  };

  const handleSaveTrainer = async (payload) => {
    try {
      const request = { nom: payload.lastName || '', prenom: payload.firstName || '', email: payload.email, telephone: payload.phone, specialite: payload.speciality, status: payload.status };
      const saved = modalState.mode === 'edit' ? await trainersService.update(payload.id, request) : await trainersService.create(request);
      setTrainers((prev) => modalState.mode === 'edit' ? prev.map((item) => item.id === saved.id ? saved : item) : [saved, ...prev]);
      setToast({ type: 'success', message: modalState.mode === 'edit' ? 'Formateur mis à jour.' : 'Formateur ajouté.' }); closeModal();
    } catch (requestError) { setToast({ type: 'error', message: requestError?.message || 'Impossible d’enregistrer le formateur.' }); }
  };

  const removeTrainer = (trainerId) => {
    setConfirmState({ open: true, trainerId });
  };

  const confirmDeleteTrainer = async () => {
    const trainerToRemove = trainers.find((trainer) => trainer.id === confirmState.trainerId);
    if (!trainerToRemove) return;

    try { await trainersService.remove(trainerToRemove.id); setTrainers((prev) => prev.filter((trainer) => trainer.id !== confirmState.trainerId)); setConfirmState({ open: false, trainerId: null }); setToast({ type: 'success', message: 'Formateur supprimé.' }); }
    catch (requestError) { setToast({ type: 'error', message: requestError?.message || 'Impossible de supprimer le formateur.' }); }
  };

  return (
    <div className="space-y-6">
      <ToastMessage type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />
      {loading ? <p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-500">Chargement...</p> : null}
      {error ? <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error} <button type="button" onClick={loadTrainers} className="ml-2 underline">Réessayer</button></p> : null}

      <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Formateurs</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Gérez vos intervenants, leur disponibilité et leurs cours assignés.</p>
          </div>

          <button type="button" onClick={openAddModal} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500">
            <FiPlus size={16} /> Ajouter un formateur
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-3 top-3 text-slate-400" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Rechercher un formateur"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="relative">
            <FiFilter className="pointer-events-none absolute left-3 top-3 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="all">Tous statuts</option>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
            </select>
          </div>

          <div className="relative">
            <FiFilter className="pointer-events-none absolute left-3 top-3 text-slate-400" />
            <select
              value={specialityFilter}
              onChange={(event) => {
                setSpecialityFilter(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="all">Toutes spécialités</option>
              {specialityOptions.filter((option) => option !== 'all').map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {visibleTrainers.length === 0 ? (
        <EmptyStateCard
          icon={FiUserCheck}
          title="Aucun formateur trouvé"
          description="Commencez par ajouter un formateur pour construire votre équipe d’intervenants et gérer leur visibilité rapidement."
          primaryLabel="Ajouter"
          onPrimary={openAddModal}
        />
      ) : (
        <div className="grid gap-4">
          {visibleTrainers.map((trainer) => (
            <div key={trainer.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition dark:border-slate-700 dark:bg-slate-800">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={trainer.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trainer.name || 'Formateur')}`}
                    alt={trainer.name}
                    className="h-16 w-16 rounded-2xl object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trainer.name)}`;
                    }}
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{trainer.name}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{trainer.speciality}</p>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      <div>{trainer.email}</div>
                      <div>{trainer.phone}</div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Cours assignés</div>
                    <div className="mt-1 font-medium">{trainer.assignedCourses.length ? trainer.assignedCourses.join(', ') : 'Indisponible'}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Statut</div>
                    <div className="mt-1 font-medium">{trainer.status}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => openViewModal(trainer)} className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"><FiEye size={16} /></button>
                  <button type="button" onClick={() => openEditModal(trainer)} className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"><FiEdit2 size={16} /></button>
                  <button type="button" onClick={async () => { try { const saved = await trainersService.updateStatus(trainer.id, trainer.status === 'Actif' ? 'inactive' : 'active'); setTrainers((prev) => prev.map((item) => item.id === saved.id ? saved : item)); } catch (requestError) { setToast({ type: 'error', message: requestError?.message || 'Impossible de modifier le statut.' }); } }} className="rounded-lg border border-amber-200 p-2 text-amber-600" aria-label={trainer.status === 'Actif' ? 'Désactiver' : 'Activer'}><FiUserCheck size={16} /></button>
                  <button type="button" onClick={() => removeTrainer(trainer.id)} className="rounded-lg border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/20"><FiTrash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredTrainers.length > 0 ? (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500 dark:text-slate-400">Page {currentPage} / {pageCount}</div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700">Précédent</button>
            <button type="button" onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700">Suivant</button>
          </div>
        </div>
      ) : null}

      <TrainerFormModal
        open={modalState.open}
        mode={modalState.mode}
        initialData={modalState.selected}
        onClose={closeModal}
        onSave={handleSaveTrainer}
      />

      <ConfirmDialog
        open={confirmState.open}
        title="Supprimer le formateur"
        message="Voulez-vous vraiment retirer ce formateur de la liste ?"
        onCancel={() => setConfirmState({ open: false, trainerId: null })}
        onConfirm={confirmDeleteTrainer}
      />
    </div>
  );
};

export default FormateursPage;

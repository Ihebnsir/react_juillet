import React, { useEffect, useMemo, useState } from 'react';
import { FiSearch, FiEye, FiEdit2, FiTrash2, FiPlus, FiFilter, FiBriefcase } from 'react-icons/fi';
import { mockPartnerCompanies } from '../../data/mockPartnerCompanies';
import { ToastMessage } from '../../components/UI/ToastMessage';
import { PartnerCompanyFormModal } from '../../components/centre/PartnerCompanyFormModal';
import { ConfirmDialog } from '../../components/UI/ConfirmDialog';
import { EmptyStateCard } from '../../components/UI/EmptyStateCard';
import { useAuth } from '../../context/AuthContext';
import { useTrash } from '../../context/TrashContext';
import { useActivityLog } from '../../context/ActivityContext';

const PAGE_SIZE = 3;
const STORAGE_KEY = 'skillbridge_partner_companies';

const readStoredCompanies = () => {
  if (typeof window === 'undefined') return mockPartnerCompanies;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return mockPartnerCompanies;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : mockPartnerCompanies;
  } catch {
    return mockPartnerCompanies;
  }
};

export const EntreprisesPartenairesPage = () => {
  const { user } = useAuth();
  const { softDelete } = useTrash();
  const { recordActivity } = useActivityLog();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [companies, setCompanies] = useState(readStoredCompanies);
  const [modalState, setModalState] = useState({ open: false, mode: 'add', selected: null });
  const [confirmState, setConfirmState] = useState({ open: false, companyId: null });
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
  }, [companies]);

  const sectorOptions = useMemo(() => {
    return ['all', ...new Set(companies.map((company) => company.sector).filter(Boolean))];
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const haystack = [company.name, company.sector, company.city, company.contactPerson, company.email].join(' ').toLowerCase();
      const matchQuery = haystack.includes(query.toLowerCase());
      const matchStatus = statusFilter === 'all' || company.status === statusFilter;
      const matchSector = sectorFilter === 'all' || company.sector === sectorFilter;
      return matchQuery && matchStatus && matchSector;
    });
  }, [query, statusFilter, sectorFilter, companies]);

  const pageCount = Math.max(1, Math.ceil(filteredCompanies.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleCompanies = filteredCompanies.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openAddModal = () => {
    setModalState({ open: true, mode: 'add', selected: null });
  };

  const openEditModal = (company) => {
    setModalState({ open: true, mode: 'edit', selected: company });
  };

  const openViewModal = (company) => {
    setModalState({ open: true, mode: 'view', selected: company });
  };

  const closeModal = () => {
    setModalState({ open: false, mode: 'add', selected: null });
  };

  const handleSaveCompany = (payload) => {
    const normalized = {
      ...payload,
      logo: payload.logo || `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(payload.name || 'company')}`,
    };

    setCompanies((prev) => {
      const exists = prev.some((item) => item.id === payload.id);
      if (exists) {
        return prev.map((item) => (item.id === payload.id ? normalized : item));
      }
      return [normalized, ...prev];
    });

    recordActivity({
      user: user?.name || 'Système',
      action: modalState.mode === 'edit' ? 'Entreprise modifiée' : 'Entreprise ajoutée',
      type: 'users',
      details: `${normalized.name} • ${modalState.mode === 'edit' ? 'mise à jour' : 'ajout'} partenaire entreprise.`,
    });

    setToast({ type: 'success', message: modalState.mode === 'edit' ? 'Entreprise mise à jour avec succès.' : 'Entreprise ajoutée avec succès.' });
    closeModal();
  };

  const removeCompany = (companyId) => {
    setConfirmState({ open: true, companyId });
  };

  const confirmDeleteCompany = () => {
    const companyToRemove = companies.find((company) => company.id === confirmState.companyId);
    if (!companyToRemove) return;

    setCompanies((prev) => prev.filter((company) => company.id !== confirmState.companyId));
    softDelete({
      type: 'entreprise',
      item: companyToRemove,
      deletedBy: user?.name || 'Système',
    });
    recordActivity({
      user: user?.name || 'Système',
      action: 'Entreprise supprimée',
      type: 'users',
      details: `${companyToRemove.name || 'Entreprise'} déplacée vers la corbeille.`,
    });
    setConfirmState({ open: false, companyId: null });
    setToast({ type: 'success', message: 'Entreprise supprimée avec succès.' });
  };

  return (
    <div className="space-y-6">
      <ToastMessage type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />

      <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Entreprises partenaires</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Gérez les partenaires académiques et entreprises de stage.</p>
          </div>
          <button type="button" onClick={openAddModal} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500">
            <FiPlus size={16} /> Ajouter une entreprise
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
              placeholder="Rechercher une entreprise"
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
              <option value="En attente">En attente</option>
              <option value="Suspendu">Suspendu</option>
            </select>
          </div>

          <div className="relative">
            <FiFilter className="pointer-events-none absolute left-3 top-3 text-slate-400" />
            <select
              value={sectorFilter}
              onChange={(event) => {
                setSectorFilter(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="all">Tous secteurs</option>
              {sectorOptions.filter((option) => option !== 'all').map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {visibleCompanies.length === 0 ? (
        <EmptyStateCard
          icon={FiBriefcase}
          title="Aucune entreprise partenaire"
          description="Ajoutez un partenaire pour créer une base solide de stages, missions et collaborations avec vos centres de formation."
          primaryLabel="Ajouter"
          onPrimary={openAddModal}
        />
      ) : (
        <div className="grid gap-4">
          {visibleCompanies.map((company) => (
            <div key={company.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition dark:border-slate-700 dark:bg-slate-800">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-16 w-16 rounded-2xl object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(company.name)}`;
                    }}
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{company.name}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{company.sector} • {company.city}</p>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      <div>Contact : {company.contactPerson}</div>
                      <div>{company.email}</div>
                      <div>{company.phone}</div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Stagiaires</div>
                    <div className="mt-1 font-medium">{company.internships}</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Statut</div>
                    <div className="mt-1 font-medium">{company.status}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => openViewModal(company)} className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"><FiEye size={16} /></button>
                  <button type="button" onClick={() => openEditModal(company)} className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"><FiEdit2 size={16} /></button>
                  <button type="button" onClick={() => removeCompany(company.id)} className="rounded-lg border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/20"><FiTrash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredCompanies.length > 0 ? (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500 dark:text-slate-400">Page {currentPage} / {pageCount}</div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700">Précédent</button>
            <button type="button" onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-700">Suivant</button>
          </div>
        </div>
      ) : null}

      <PartnerCompanyFormModal
        open={modalState.open}
        mode={modalState.mode}
        initialData={modalState.selected}
        onClose={closeModal}
        onSave={handleSaveCompany}
      />

      <ConfirmDialog
        open={confirmState.open}
        title="Supprimer l’entreprise"
        message="Voulez-vous vraiment retirer cette entreprise de la liste ?"
        onCancel={() => setConfirmState({ open: false, companyId: null })}
        onConfirm={confirmDeleteCompany}
      />
    </div>
  );
};

export default EntreprisesPartenairesPage;

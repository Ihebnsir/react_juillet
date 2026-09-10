import React, { useEffect, useState } from 'react';
import { FiUsers } from 'react-icons/fi';
import { EmptyStateCard } from '../../components/UI/EmptyStateCard';
import { ManagementPageLayout } from '../../components/centre/ManagementPageLayout';
import { studentsService } from '../../services/studentsService';

const PAGE_SIZE = 20;

export const EtudiantsPage = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true); setError('');
      try {
        const result = await studentsService.list({ page, limit: PAGE_SIZE, search });
        setStudents(result.data || []);
        setPageMeta(result.pagination || { page, pages: 1, total: result.data?.length || 0 });
      } catch (requestError) { setStudents([]); setError(requestError?.status === 401 ? 'Session expirée.' : requestError?.status === 403 ? 'Accès refusé.' : requestError?.message || 'Impossible de charger les étudiants.'); }
      finally { setLoading(false); }
    };
    loadStudents();
  }, [page, search]);

  const [pageMeta, setPageMeta] = useState({ page: 1, pages: 1, total: 0 });

  const filteredStudents = students;
  const pageCount = pageMeta.pages || 1;
  const safePage = pageMeta.page || page;
  const visibleStudents = filteredStudents;

  useEffect(() => { setPage(1); }, [search]);


  return (
    <div className="space-y-6">
      {loading ? <p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-500">Chargement...</p> : null}
      {error ? <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}

      <ManagementPageLayout
        title="Étudiants"
        description="Pilotage du dossier apprenant, sa progression, sa session et son statut administratif."
        primaryActionLabel=""
        searchValue={search}
        onSearchChange={setSearch}
        filterOptions={[]}
        emptyState={filteredStudents.length === 0 ? <EmptyStateCard icon={FiUsers} title="Aucun étudiant" description="Les apprenants associés à vos formations apparaîtront ici." /> : null}
      >
        <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-800">
          <div className="mb-3 grid gap-3 md:grid-cols-2">
            <p className="text-sm text-slate-500">Recherche et pagination sont traitées par le backend.</p>
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-sm font-semibold text-brand-700">{student.name?.slice(0, 1) || '?'}</div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{student.name}</div>
                          <div className="text-xs text-slate-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{student.formationTitle || '—'}</td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">—</td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{student.progress?.percentage ?? 'Indisponible'}{student.progress?.percentage !== undefined ? '%' : ''}</td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{student.reservationStatus || '—'}</td>
                    <td className="px-3 py-3 text-right text-slate-500">Lecture seule</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ManagementPageLayout>

      {filteredStudents.length > 0 ? (
        <div className="flex items-center justify-between rounded-3xl bg-white px-4 py-3 text-sm shadow-sm dark:bg-slate-800">
          <div className="text-slate-500 dark:text-slate-400">Page {safePage} / {pageCount} · {pageMeta.total} apprenants</div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 dark:border-slate-700">Précédent</button>
            <button type="button" onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 dark:border-slate-700">Suivant</button>
          </div>
        </div>
      ) : null}

    </div>
  );
};

export default EtudiantsPage;

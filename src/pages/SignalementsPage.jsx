import React, { useCallback, useEffect, useState } from 'react';
import { signalementsService } from '../services/signalementsService';
import { useNotifications } from '../context/NotificationContext';
import { getSignalementStatusClass } from '../utils/signalementStatus';

const TYPES = ['Contenu inapproprié', 'Fausse information', 'Spam', 'Harcelement', 'Problème technique'];
const TARGET_TYPES = [['autre', 'Autre'], ['formation', 'Formation'], ['centre', 'Centre'], ['message', 'Message']];

const getErrorMessage = (error) => {
  if (error?.status === 401) return 'Votre session a expiré. Veuillez vous reconnecter.';
  if (error?.status === 403) return 'Vous n’êtes pas autorisé à effectuer cette action.';
  if (error?.status === 404) return 'La ressource demandée est introuvable.';
  return error?.message === 'NETWORK_ERROR' ? 'Service indisponible. Vérifiez votre connexion.' : (error?.message || 'Une erreur est survenue.');
};

const listItems = (result) => result?.data || result?.items || [];

export const SignalementsPage = () => {
  const { refresh: refreshNotifications } = useNotifications();
  const [form, setForm] = useState({ type: '', contenu: '', cibleType: 'autre', cibleId: '' });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState('');

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setReports(listItems(await signalementsService.getMine({ page: 1, limit: 10 })));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadReports(); }, [loadReports]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setSuccess('');
    if (!form.type || !form.contenu.trim() || form.contenu.length > 2000 || (form.cibleType !== 'autre' && !form.cibleId.trim())) {
      setSubmitError('Renseignez un type, un contenu de 2000 caractères maximum et une cible valide.');
      return;
    }

    setSubmitting(true);
    try {
      await signalementsService.create({
        type: form.type,
        contenu: form.contenu.trim(),
        cibleType: form.cibleType,
        ...(form.cibleType !== 'autre' ? { cibleId: form.cibleId.trim() } : {}),
      });
      setForm({ type: '', contenu: '', cibleType: 'autre', cibleId: '' });
      setSuccess('Votre signalement a été envoyé.');
      await loadReports();
      await refreshNotifications();
    } catch (requestError) {
      setSubmitError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header><p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Sécurité</p><h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Mes signalements</h1><p className="mt-2 text-slate-500">Signalez un contenu ou un comportement nécessitant une vérification.</p></header>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="card p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Nouveau signalement</h2>
          {success ? <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p> : null}
          {submitError ? <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{submitError}</p> : null}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="block text-sm font-medium">Type<select required value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-3"><option value="">Sélectionner</option>{TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
            <label className="block text-sm font-medium">Contenu<textarea required maxLength={2000} value={form.contenu} onChange={(event) => setForm({ ...form, contenu: event.target.value })} className="mt-1 min-h-32 w-full rounded-xl border border-slate-200 p-3" /><span className="text-xs text-slate-500">{form.contenu.length}/2000</span></label>
            <label className="block text-sm font-medium">Cible<select value={form.cibleType} onChange={(event) => setForm({ ...form, cibleType: event.target.value, cibleId: '' })} className="mt-1 w-full rounded-xl border border-slate-200 p-3">{TARGET_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            {form.cibleType !== 'autre' ? <label className="block text-sm font-medium">Identifiant de la cible<input required value={form.cibleId} onChange={(event) => setForm({ ...form, cibleId: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 p-3" /></label> : null}
            <button disabled={submitting} className="w-full rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white disabled:opacity-50">{submitting ? 'Envoi…' : 'Envoyer le signalement'}</button>
          </form>
        </section>
        <section className="card p-6">
          <div className="flex items-center justify-between gap-4"><h2 className="text-xl font-semibold text-slate-900 dark:text-white">Historique</h2><button type="button" onClick={loadReports} className="text-sm font-semibold text-brand-600">Actualiser</button></div>
          {loading ? <p className="mt-6 text-sm text-slate-500">Chargement…</p> : null}
          {error ? <div role="alert" className="mt-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error} <button type="button" onClick={loadReports} className="ml-2 font-semibold underline">Réessayer</button></div> : null}
          {!loading && !error && reports.length === 0 ? <p className="mt-6 text-sm text-slate-500">Aucun signalement.</p> : null}
          <div className="mt-5 space-y-3">{reports.map((report) => <article key={report.id} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold">{report.type}</p><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getSignalementStatusClass(report.status)}`}>{report.status}</span></div><p className="mt-2 text-sm text-slate-600">{report.contenu}</p><p className="mt-2 text-xs text-slate-500">{report.cibleType || 'autre'}{report.cibleId ? ` · ${report.cibleId}` : ''} · {report.createdAt ? new Date(report.createdAt).toLocaleDateString('fr-FR') : 'Date indisponible'}</p>{report.resolutionNote ? <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{report.resolutionNote}</p> : null}</article>)}</div>
        </section>
      </div>
    </div>
  );
};

export default SignalementsPage;

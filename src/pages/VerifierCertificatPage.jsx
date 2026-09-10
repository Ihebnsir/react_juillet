import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi';
import { certificationsService } from '../services/certificationsService';

const errorMessageOf = (error) => {
  if (!error) return 'Une erreur est survenue.';
  if (error.status === 400 || error.message === 'HTTP_400') return 'Numéro de certificat invalide.';
  if (error.status === 404 || error.message === 'HTTP_404') return 'Certificat introuvable.';
  if (error.status === 401) return 'Session expirée.';
  if (error.message === 'NETWORK_ERROR' || error.status === 0) return 'Service indisponible. Vérifiez votre connexion.';
  return error.message || 'Une erreur est survenue.';
};

function VerifierCertificatPage() {
  const { id } = useParams();
  const [input, setInput] = useState(id || '');
  const [certification, setCertification] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    verifyCertificate(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const verifyCertificate = async (value) => {
    const normalized = String(value ?? '').trim();
    if (!normalized) {
      setCertification(null);
      setError('Numéro de certificat invalide.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    setCertification(null);

    try {
      const result = await certificationsService.verify(normalized);
      setCertification(result);
      if (result?.status === 'revoquee') {
        setError('Certificat révoqué ou non actif.');
      }
    } catch (requestError) {
      setError(errorMessageOf(requestError));
      setCertification(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    verifyCertificate(input);
  };

  const isRevoked = certification?.status === 'revoquee';

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-600"><FiInfo size={22} /></div>
          <div>
            <h1 className="text-xl font-bold">Vérification de certificat</h1>
            <p className="text-sm text-slate-500">Saisissez le numéro du certificat à contrôler.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="certificate-number" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Numéro de certificat</label>
          <input
            id="certificate-number"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="EX: CERT-2026-0001"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-600 dark:bg-slate-700"
          />
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-medium text-white disabled:opacity-60">
            {loading ? 'Vérification…' : 'Vérifier'}
          </button>
        </form>

        {loading ? (
          <div className="mt-6 text-center text-sm text-slate-500">Vérification en cours...</div>
        ) : null}

        {error && !certification ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex items-center gap-2">
              <FiXCircle className="flex-none" />
              <span>{error}</span>
            </div>
          </div>
        ) : null}

        {certification && !isRevoked ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-left dark:border-emerald-900/40 dark:bg-emerald-900/10">
            <div className="mb-3 flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <FiCheckCircle size={18} />
              <span className="font-semibold">Certificat authentique</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">Cet identifiant a bien été vérifié par SkillBridge.</p>
            <dl className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <div><dt className="font-semibold">Formation</dt><dd>{certification.formation || '—'}</dd></div>
              <div><dt className="font-semibold">Centre</dt><dd>{certification.centre || '—'}</dd></div>
              <div><dt className="font-semibold">Date de délivrance</dt><dd>{certification.date || '—'}</dd></div>
              <div><dt className="font-semibold">Statut</dt><dd>{certification.status || 'emise'}</dd></div>
              <div><dt className="font-semibold">Identifiant</dt><dd>{certification.certificateNumber || certification.id || '—'}</dd></div>
            </dl>
          </div>
        ) : null}

        {certification && isRevoked ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <div className="flex items-center gap-2">
              <FiXCircle className="flex-none" />
              <span>Certificat révoqué ou non actif.</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default VerifierCertificatPage;

import React, { useEffect, useState } from 'react';
import { FiAward } from 'react-icons/fi';
import QRCodeCertificat from '../../components/certifications/QRCodeCertificat';
import { certificationsService } from '../../services/certificationsService';

export const MesCertificationsPage = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCertifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await certificationsService.getMine();
      setCertifications(result.data);
    } catch (requestError) {
      setCertifications([]);
      setError(requestError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCertifications(); }, []);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300"><FiAward /></div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Mes certifications</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Accédez à vos attestations et badges de réussite.</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? <p className="text-sm text-slate-500">Chargement des certifications...</p> : null}
        {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">Impossible de charger vos certifications. <button type="button" onClick={loadCertifications} className="ml-2 font-semibold underline">Réessayer</button></div> : null}
        {!loading && !error && certifications.length === 0 ? <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">Aucune certification disponible.</p> : null}
        {!loading && !error && certifications.map((certification) => (
          <div key={certification.id} className="rounded-2xl border border-gray-200 p-5 shadow-sm dark:border-slate-700">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-brand-400">Certificat de formation</p>
                <h2 className="mt-1 text-xl font-semibold text-gray-900 dark:text-slate-100">{certification.formation || 'Formation'}</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Délivré le {certification.date || '—'}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Centre : {certification.centre || '—'}</p>
                <p className="mt-3 text-xs text-slate-500">Identifiant de vérification : {certification.certificateNumber || certification.id}</p>
              </div>
              <QRCodeCertificat certificationId={certification.certificateNumber || certification.id} taille={110} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

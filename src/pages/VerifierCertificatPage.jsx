import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { certificationsService } from '../services/certificationsService';

function VerifierCertificatPage() {
  const { id } = useParams();
  const [certification, setCertification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    certificationsService.verify(id)
      .then((result) => { if (mounted) setCertification(result); })
      .catch((requestError) => { if (mounted) setError(requestError); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="mx-auto flex min-h-screen max-w-lg items-center justify-center px-4 py-16 text-center">Vérification en cours...</div>;

  if (error || !certification) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10"><FiXCircle className="text-red-500" size={32} /></div>
        <h1 className="text-xl font-bold">Certificat introuvable</h1>
        <p className="mt-2 text-slate-400">Cet identifiant ne correspond à aucun certificat vérifiable.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10"><FiCheckCircle className="text-brand-500" size={32} /></div>
      <h1 className="mb-2 text-xl font-bold">Certificat authentique</h1>
      <p className="text-sm text-slate-500">Cet identifiant a bien été vérifié par SkillBridge.</p>
      <div className="mt-6 w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="font-semibold text-slate-900 dark:text-slate-100">{certification.formation || 'Formation'}</p>
        <p className="mt-1 text-sm text-slate-500">Délivré le {certification.date || '—'}</p>
        <p className="mt-1 text-sm text-slate-500">Centre : {certification.centre || '—'}</p>
        <p className="mt-4 text-xs uppercase tracking-wide text-slate-400">Identifiant : {certification.certificateNumber || certification.id}</p>
      </div>
    </div>
  );
}

export default VerifierCertificatPage;

import React from 'react';
import { useParams } from 'react-router-dom';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { MOCK_CERTIFICATIONS } from '../data/mockData';

function VerifierCertificatPage() {
  const { id } = useParams();
  const certification = MOCK_CERTIFICATIONS.find((item) => item.id === id);

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      {certification ? (
        <>
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/10">
            <FiCheckCircle className="text-brand-500" size={32} />
          </div>
          <h1 className="mb-2 text-xl font-bold">Certificat authentique ✓</h1>
          <p className="text-sm text-slate-500">Cet identifiant a bien été émis par SkillBridge.</p>
          <div className="mt-6 w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <p className="font-semibold text-slate-900 dark:text-slate-100">{certification.title}</p>
            <p className="mt-1 text-sm text-slate-500">Délivré le {certification.issueDate}</p>
            <p className="mt-1 text-sm text-slate-500">Centre : {certification.center}</p>
            {certification.enterprise && (
              <p className="mt-1 text-sm text-slate-500">Entreprise partenaire : {certification.enterprise}</p>
            )}
            <p className="mt-4 text-xs uppercase tracking-wide text-slate-400">Identifiant : {certification.id}</p>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <FiXCircle className="text-red-500" size={32} />
          </div>
          <h1 className="text-xl font-bold">Certificat introuvable</h1>
          <p className="mt-2 text-slate-400">
            Cet identifiant ne correspond à aucun certificat émis par SkillBridge.
          </p>
        </>
      )}
    </div>
  );
}

export default VerifierCertificatPage;

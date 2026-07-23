import React from 'react';
import { FiAward } from 'react-icons/fi';
import QRCodeCertificat from '../../components/certifications/QRCodeCertificat';
import { MOCK_CERTIFICATIONS } from '../../data/mockData';

export const MesCertificationsPage = () => (
  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div className="flex items-center gap-3">
      <div className="rounded-2xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300"><FiAward /></div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Mes certifications</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Accédez à vos attestations et badges de réussite.</p>
      </div>
    </div>

    <div className="mt-6 space-y-4">
      {MOCK_CERTIFICATIONS.map((certification) => (
        <div key={certification.id} className="rounded-2xl border border-gray-200 p-5 shadow-sm dark:border-slate-700">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-brand-400">
                {certification.type === 'attestationStage' ? 'Attestation de stage' : 'Certificat de formation'}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-gray-900 dark:text-slate-100">{certification.title}</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Délivré le {certification.issueDate}</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Centre : {certification.center}</p>
              {certification.enterprise && (
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Entreprise partenaire : {certification.enterprise}</p>
              )}
              <p className="mt-3 text-xs text-slate-500">Identifiant de vérification : {certification.id}</p>
            </div>
            <QRCodeCertificat certificationId={certification.id} taille={110} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

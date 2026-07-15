import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

export const NewSupportConversationModal = ({ isOpen, onClose, onSubmit }) => {
  const [subject, setSubject] = useState('Paiement');
  const [customSubject, setCustomSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSubject('Paiement');
      setCustomSubject('');
      setMessage('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const resolvedSubject = subject === 'Autre' ? customSubject : subject;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl transition-all duration-300 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Nouvelle conversation support</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Décrivez votre besoin pour ouvrir un ticket.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Sujet</label>
            <select value={subject} onChange={(event) => setSubject(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-800">
              <option value="Paiement">Paiement</option>
              <option value="Réservation">Réservation</option>
              <option value="Litige">Litige</option>
              <option value="Compte">Compte</option>
              <option value="Autre">Autre</option>
            </select>
            {subject === 'Autre' && (
              <input
                value={customSubject}
                onChange={(event) => setCustomSubject(event.target.value)}
                placeholder="Précisez le sujet"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
              />
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Message initial</label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              placeholder="Expliquez votre problème..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            Annuler
          </button>
          <button
            onClick={() => onSubmit({ subject: resolvedSubject, message })}
            className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            Ouvrir le ticket
          </button>
        </div>
      </div>
    </div>
  );
};

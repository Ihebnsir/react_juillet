import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FiStar, FiX } from 'react-icons/fi';

function ModifierAvisModal({ avis, onClose, onSave }) {
  const [note, setNote] = useState(avis.note);
  const [commentaire, setCommentaire] = useState(avis.commentaire);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(avis.id, { note, commentaire });
    setSaving(false);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4" onClick={onClose}>
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-700" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Modifier mon avis</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <FiX size={20} />
          </button>
        </div>

        <p className="text-sm text-slate-400 mb-1">{avis.formationTitre}</p>

        <div className="flex gap-1 my-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setNote(n)}>
              <FiStar
                size={26}
                className={n <= note ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}
              />
            </button>
          ))}
        </div>

        <textarea
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          rows={4}
          className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          placeholder="Votre commentaire..."
        />

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">Annuler</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ModifierAvisModal;

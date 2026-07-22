import React, { useEffect, useState } from 'react';

const defaultStatuses = ['Upcoming', 'Completed', 'Cancelled'];

const CalendarModal = ({ open, onClose, onSave, onDelete, initialData = {} }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [color, setColor] = useState('#2563eb');
  const [status, setStatus] = useState('Upcoming');

  useEffect(() => {
    if (!open) return;
    setTitle(initialData?.title || '');
    setDescription(initialData?.extendedProps?.description || initialData?.description || '');
    setStart(initialData?.start || initialData?.startStr || initialData?.start || '');
    setEnd(initialData?.end || initialData?.endStr || initialData?.end || initialData?.start || '');
    setColor(initialData?.color || '#2563eb');
    setStatus(initialData?.extendedProps?.status || initialData?.status || 'Upcoming');
  }, [open, initialData]);

  const handleSave = () => {
    const payload = {
      id: initialData?.id,
      title,
      description,
      start,
      end,
      color,
      status,
    };
    onSave(payload);
  };

  const handleDelete = () => {
    if (!initialData?.id) return;
    onDelete(initialData.id);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg dark:bg-slate-800">
        <h3 className="text-lg font-semibold">{initialData?.id ? 'Modifier l\u2019événement' : 'Nouvel événement'}</h3>
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm text-slate-600">Titre</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-slate-600">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600">Date début</label>
              <input type="date" value={start?.slice(0,10)} onChange={e => setStart(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-slate-600">Date fin</label>
              <input type="date" value={end?.slice(0,10)} onChange={e => setEnd(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-slate-600">Couleur</label>
              <input type="color" value={color} onChange={e => setColor(e.target.value)} className="mt-1 h-10 w-full rounded-md border p-1" />
            </div>
            <div>
              <label className="block text-sm text-slate-600">Statut</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 text-sm">
                {defaultStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          {initialData?.id && (
            <button onClick={handleDelete} className="rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50">Supprimer</button>
          )}
          <button onClick={onClose} className="rounded-md px-3 py-2 text-sm">Annuler</button>
          <button onClick={handleSave} className="rounded-md bg-brand-600 px-4 py-2 text-sm text-white">Enregistrer</button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;

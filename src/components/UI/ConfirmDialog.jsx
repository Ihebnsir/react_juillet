import React from 'react';
import { ModalShell } from './ModalShell';

export const ConfirmDialog = ({ open, title, message, onCancel, onConfirm }) => {
  return (
    <ModalShell
      open={open}
      title={title}
      subtitle="Cette action est irréversible."
      onClose={onCancel}
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
          >
            Confirmer
          </button>
        </>
      }
    >
      <p className="text-sm text-slate-300">{message}</p>
    </ModalShell>
  );
};

export default ConfirmDialog;

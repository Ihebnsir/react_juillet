import React from 'react';

export const ModalShell = ({ open, title, subtitle, onClose, children, footer }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-slate-700/70 bg-slate-900 p-5 text-slate-100 shadow-2xl shadow-slate-950/60">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700 px-2.5 py-1.5 text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mt-5">{children}</div>

        {footer ? <div className="mt-6 flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
};

export default ModalShell;

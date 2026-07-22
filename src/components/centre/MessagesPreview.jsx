import React from 'react';
import { useNavigate } from 'react-router-dom';

export const MessagesPreview = ({ messages = [] }) => {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800">
      <h4 className="font-semibold text-slate-900 dark:text-slate-100">Messages récents</h4>
      <div className="mt-3 space-y-3">
        {messages.length === 0 ? <div className="text-sm text-slate-500">Aucun message.</div> : messages.map(m => (
          <div key={m.id} onClick={() => navigate('/centre/messagerie')} className="flex cursor-pointer items-center justify-between gap-3 rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700" />
              <div>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{m.name} {m.unread && <span className="ml-2 inline-block rounded-full bg-red-500 px-2 py-0.5 text-white text-xs">{m.unread}</span>}</div>
                <div className="text-xs text-slate-500">{m.preview}</div>
              </div>
            </div>
            <div className="text-xs text-slate-400">{m.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesPreview;

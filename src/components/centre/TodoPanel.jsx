import React from 'react';

export const TodoPanel = ({ tasks = [] }) => (
  <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800">
    <h4 className="font-semibold text-slate-900 dark:text-slate-100">À faire aujourd'hui</h4>
    <ul className="mt-3 space-y-2">
      {tasks.length === 0 ? <li className="text-sm text-slate-500">Aucune tâche.</li> : tasks.map(t => (
        <li key={t.id} className="flex items-center gap-3">
          <label className={`inline-flex items-center gap-2 ${t.done ? 'opacity-60' : ''}`}>
            <input type="checkbox" checked={t.done} readOnly className="h-4 w-4" />
            <span className="text-sm text-slate-700 dark:text-slate-200">{t.label}</span>
          </label>
        </li>
      ))}
    </ul>
  </div>
);

export default TodoPanel;

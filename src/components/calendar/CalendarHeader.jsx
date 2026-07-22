import React from 'react';

export const CalendarHeader = ({ calendarRef }) => {
  const api = () => calendarRef.current && calendarRef.current.getApi();

  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex gap-2 rounded-md bg-slate-100 p-1 dark:bg-slate-700">
        <button onClick={() => api() && api().prev()} className="rounded px-3 py-1 text-sm hover:bg-slate-200 dark:hover:bg-slate-600">Prev</button>
        <button onClick={() => api() && api().today()} className="rounded px-3 py-1 text-sm hover:bg-slate-200 dark:hover:bg-slate-600">Today</button>
        <button onClick={() => api() && api().next()} className="rounded px-3 py-1 text-sm hover:bg-slate-200 dark:hover:bg-slate-600">Next</button>
      </div>

      <div className="inline-flex gap-2">
        <button onClick={() => api() && api().changeView('dayGridMonth')} className="rounded-md bg-brand-600 px-3 py-1 text-sm text-white">Month</button>
        <button onClick={() => api() && api().changeView('timeGridWeek')} className="rounded-md bg-slate-100 px-3 py-1 text-sm hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600">Week</button>
        <button onClick={() => api() && api().changeView('timeGridDay')} className="rounded-md bg-slate-100 px-3 py-1 text-sm hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600">Day</button>
      </div>
    </div>
  );
};

export default CalendarHeader;

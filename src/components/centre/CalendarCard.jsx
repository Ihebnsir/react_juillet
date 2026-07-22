import React from 'react';
import { useNavigate } from 'react-router-dom';

export const CalendarCard = ({ events = [] }) => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate('/centre/calendar')} className="cursor-pointer rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800">
      <h4 className="font-semibold text-slate-900 dark:text-slate-100">Calendrier</h4>
      <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        {events.length === 0 ? <div>Aucun événement à venir.</div> : events.map(e => (
          <div key={e.id} className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            <div>
              <div className="font-medium text-slate-800 dark:text-slate-100">{e.title}</div>
              <div className="text-xs text-slate-500">{e.date}</div>
            </div>
            <div className="text-sm text-slate-500">{e.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarCard;

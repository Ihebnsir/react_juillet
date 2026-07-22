import React from 'react';

export const CalendarEventCard = ({ event }) => (
  <div className="rounded-md border p-3">
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium">{event.title}</div>
        <div className="text-xs text-slate-500">{event.start} — {event.end}</div>
      </div>
      <div style={{ background: event.color }} className="h-8 w-8 rounded" />
    </div>
  </div>
);

export default CalendarEventCard;

import React, { useEffect, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarHeader } from '../../components/calendar/CalendarHeader';
import { sessionsService } from '../../services/sessionsService';
// FullCalendar CSS imports removed (handled via Tailwind + custom styles)

export const CentreCalendarPage = () => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    sessionsService.list({ page: 1, limit: 100 })
      .then((result) => {
        if (!mounted) return;
        setEvents(result.data || []);
      })
      .catch((requestError) => {
        if (mounted) setError(requestError?.message || 'Calendrier backend indisponible.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [events]);

  const calendarEvents = useMemo(() => events.map(e => ({
    id: e.id,
    title: e.title,
    start: e.date,
    end: e.date,
    extendedProps: { description: e.description, status: e.status, formationTitle: e.formationTitle }
  })), [events]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Calendrier</h2>
          <CalendarHeader calendarRef={calendarRef} />
        </div>
        {loading ? <p className="mt-4 text-sm text-slate-500">Chargement des sessions...</p> : null}
        {error ? <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}
        {!loading && !error && events.length === 0 ? <p className="mt-4 rounded-xl border border-dashed p-6 text-sm text-slate-500">Aucune session backend disponible.</p> : null}
        <div className="mt-4">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={false}
            events={calendarEvents}
            height="auto"
            dayMaxEvents={3}
          />
        </div>
      </div>

    </div>
  );
};

export default CentreCalendarPage;

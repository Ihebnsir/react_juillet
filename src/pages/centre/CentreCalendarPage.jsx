import React, { useEffect, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarHeader } from '../../components/calendar/CalendarHeader';
import CalendarModal from '../../components/calendar/CalendarModal';
// FullCalendar CSS imports removed (handled via Tailwind + custom styles)

const STORAGE_KEY = 'centre_calendar_events_v1';

export const CentreCalendarPage = () => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setEvents(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to load calendar events', e);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save calendar events', e);
    }
  }, [events]);

  const handleDateClick = (arg) => {
    setEditingEvent({ start: arg.dateStr, end: arg.dateStr });
    setModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const ev = clickInfo.event;
    setEditingEvent({
      id: ev.id,
      title: ev.title,
      start: ev.startStr,
      end: ev.endStr || ev.startStr,
      extendedProps: ev.extendedProps || {},
    });
    setModalOpen(true);
  };

  const handleEventDrop = (changeInfo) => {
    const ev = changeInfo.event;
    setEvents((prev) => prev.map(e => e.id === ev.id ? { ...e, start: ev.startStr, end: ev.endStr || ev.startStr } : e));
  };

  const handleEventResize = (resizeInfo) => {
    const ev = resizeInfo.event;
    setEvents((prev) => prev.map(e => e.id === ev.id ? { ...e, start: ev.startStr, end: ev.endStr || ev.startStr } : e));
  };

  const handleSave = (data) => {
    if (data.id) {
      setEvents((prev) => prev.map(e => e.id === data.id ? { ...e, ...data } : e));
    } else {
      const id = String(Date.now());
      setEvents((prev) => [...prev, { ...data, id }]);
    }
    setModalOpen(false);
    setEditingEvent(null);
  };

  const handleDelete = (id) => {
    setEvents((prev) => prev.filter(e => e.id !== id));
    setModalOpen(false);
    setEditingEvent(null);
  };

  const calendarEvents = useMemo(() => events.map(e => ({
    id: e.id,
    title: e.title,
    start: e.start,
    end: e.end,
    backgroundColor: e.color,
    borderColor: e.color,
    extendedProps: { description: e.description, status: e.status }
  })), [events]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Calendrier</h2>
          <CalendarHeader calendarRef={calendarRef} />
        </div>
        <div className="mt-4">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={false}
            editable
            selectable
            droppable
            events={calendarEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            height="auto"
            dayMaxEvents={3}
          />
        </div>
      </div>

      {modalOpen && (
        <CalendarModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditingEvent(null); }}
          onSave={handleSave}
          onDelete={handleDelete}
          initialData={editingEvent}
        />
      )}
    </div>
  );
};

export default CentreCalendarPage;

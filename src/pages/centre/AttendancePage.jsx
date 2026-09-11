import React, { useCallback, useEffect, useState } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { sessionsService } from '../../services/sessionsService';
import { studentsService } from '../../services/studentsService';

const statuses = ['present', 'absent', 'late'];
const errorMessage = (error) => error?.status === 401 ? 'Session expirée.' : error?.status === 403 ? 'Accès refusé.' : error?.message || 'Impossible de gérer les présences.';

export const AttendancePage = () => {
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadSessions = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const result = await sessionsService.list({ page: 1, limit: 100 });
      const available = result.data || [];
      setSessions(available);
      setSessionId((current) => current || available[0]?.id || '');
    } catch (requestError) { setError(errorMessage(requestError)); }
    finally { setLoading(false); }
  }, []);

  const loadAttendance = useCallback(async () => {
    if (!sessionId) { setItems([]); return; }
    setLoading(true); setError('');
    try {
      const session = sessions.find((item) => item.id === sessionId);
      const [attendanceResult, studentsResult] = await Promise.all([attendanceService.bySession(sessionId), studentsService.list({ page: 1, limit: 100 })]);
      const existing = attendanceResult.data || [];
      const existingLearners = new Set(existing.map((item) => item.learnerId));
      const learners = (studentsResult.data || []).filter((student) => !session?.formationId || student.formationId === session.formationId);
      const missing = learners.filter((student) => !existingLearners.has(student.learnerId)).map((student) => ({ learnerId: student.learnerId, learnerName: student.name, formationId: student.formationId, formationTitle: student.formationTitle, status: 'present' }));
      setItems([...existing, ...missing]);
    }
    catch (requestError) { setItems([]); setError(errorMessage(requestError)); }
    finally { setLoading(false); }
  }, [sessionId, sessions]);

  useEffect(() => { loadSessions(); }, [loadSessions]);
  useEffect(() => { loadAttendance(); }, [loadAttendance]);

  const saveExisting = async (item, status) => {
    setSaving(item.id); setError(''); setNotice('');
    try {
      const saved = await attendanceService.update(item.id, { session: item.sessionId, learner: item.learnerId, formation: item.formationId, centre: item.centreId, status, note: item.note || '' });
      setItems((current) => current.map((entry) => entry.id === saved.id ? saved : entry));
      setNotice('Présence mise à jour.');
    } catch (requestError) { setError(errorMessage(requestError)); }
    finally { setSaving(''); }
  };

  const createMissing = async (item, status) => {
    const key = `new-${item.learnerId}`;
    setSaving(key); setError(''); setNotice('');
    try {
      const saved = await attendanceService.create({ session: sessionId, learner: item.learnerId, formation: item.formationId, centre: item.centreId, status, note: '' });
      setItems((current) => [...current, saved]);
      setNotice('Présence enregistrée.');
    } catch (requestError) { setError(errorMessage(requestError)); }
    finally { setSaving(''); }
  };

  if (loading && sessions.length === 0) return <p className="rounded-xl bg-slate-100 p-5 text-sm text-slate-500">Chargement...</p>;

  return <div className="space-y-6"><header><h1 className="text-2xl font-semibold">Présences</h1><p className="mt-1 text-sm text-slate-500">Gérez les présences des apprenants par session.</p></header>{error ? <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}{notice ? <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">{notice}</p> : null}<label className="block max-w-xl text-sm font-medium text-slate-700">Session<select aria-label="Session" value={sessionId} onChange={(event) => setSessionId(event.target.value)} className="mt-1 w-full rounded-lg border p-2"><option value="">Sélectionner une session</option>{sessions.map((session) => <option key={session.id} value={session.id}>{session.title} · {session.date ? new Date(session.date).toLocaleDateString('fr-FR') : 'date inconnue'}</option>)}</select></label>{!sessionId ? <p className="rounded-xl border border-dashed p-8 text-center text-sm text-slate-500">Sélectionnez une session pour gérer les présences.</p> : items.length === 0 ? <p className="rounded-xl border border-dashed p-8 text-center text-sm text-slate-500">Aucune présence ou inscription disponible pour cette session.</p> : <div className="overflow-x-auto rounded-2xl bg-white shadow-sm dark:bg-slate-800"><table className="min-w-full text-left text-sm"><thead><tr className="border-b"><th className="p-4">Apprenant</th><th className="p-4">Formation</th><th className="p-4">Statut</th></tr></thead><tbody>{items.map((item) => <tr key={item.id || item.learnerId} className="border-b last:border-0"><td className="p-4">{item.learnerName || 'Apprenant'}</td><td className="p-4">{item.formationTitle || 'Formation'}</td><td className="p-4"><select aria-label={`Présence ${item.learnerName || item.learnerId}`} value={item.status || 'present'} disabled={saving === item.id || saving === `new-${item.learnerId}`} onChange={(event) => item.id ? saveExisting(item, event.target.value) : createMissing(item, event.target.value)} className="rounded-lg border p-2">{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div>}</div>;
};

export default AttendancePage;
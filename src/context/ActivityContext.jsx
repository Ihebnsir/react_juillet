import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ActivityContext = createContext(null);
const STORAGE_KEY = 'skillbridge_activity_history';

const seedActivity = [
  {
    id: 'activity-1',
    user: 'Amine',
    action: 'Formation React créée',
    type: 'formation',
    details: 'La formation React Avancé a été publiée sur le catalogue.',
    createdAt: '2026-07-23T15:42:00Z',
  },
  {
    id: 'activity-2',
    user: 'Sara',
    action: 'Étudiant ajouté',
    type: 'users',
    details: 'Le dossier apprenant a été créé avec succès.',
    createdAt: '2026-07-23T15:55:00Z',
  },
  {
    id: 'activity-3',
    user: 'Mourad',
    action: 'Certificat généré',
    type: 'certificate',
    details: 'Le certificat a été préparé et envoyé au destinataire.',
    createdAt: '2026-07-23T16:20:00Z',
  },
];

const readStoredActivities = () => {
  if (typeof window === 'undefined') return seedActivity;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return seedActivity;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : seedActivity;
  } catch {
    return seedActivity;
  }
};

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState(readStoredActivities);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    }
  }, [activities]);

  const recordActivity = (payload) => {
    const nextEntry = {
      id: payload.id || `activity-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      user: payload.user || 'Système',
      action: payload.action || 'Action métier',
      type: payload.type || 'system',
      details: payload.details || '',
      createdAt: payload.createdAt || new Date().toISOString(),
    };

    setActivities((prev) => [nextEntry, ...prev]);
    return nextEntry;
  };

  const value = useMemo(() => ({
    activities,
    recordActivity,
  }), [activities]);

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
};

export const useActivityLog = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivityLog doit être utilisé avec ActivityProvider');
  }
  return context;
};

import React, { createContext, useContext, useMemo } from 'react';

const ActivityContext = createContext(null);
const unavailableActivities = [];

export const ActivityProvider = ({ children }) => {
  const activities = unavailableActivities;

  const recordActivity = (payload) => {
    return null;
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

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const TrashContext = createContext(null);
const STORAGE_KEY = 'skillbridge_trash';

const readStoredTrash = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const TrashProvider = ({ children }) => {
  const [trashItems, setTrashItems] = useState(readStoredTrash);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trashItems));
    }
  }, [trashItems]);

  const softDelete = (payload) => {
    const entry = {
      id: payload.id || `${payload.type}-${Date.now()}`,
      type: payload.type,
      item: payload.item,
      deletedBy: payload.deletedBy || 'Centre',
      deletedAt: payload.deletedAt || new Date().toISOString(),
    };
    setTrashItems((prev) => [entry, ...prev]);
    return entry;
  };

  const restoreItem = (trashId) => {
    setTrashItems((prev) => prev.filter((item) => item.id !== trashId));
  };

  const deletePermanently = (trashId) => {
    setTrashItems((prev) => prev.filter((item) => item.id !== trashId));
  };

  const value = useMemo(() => ({
    trashItems,
    softDelete,
    restoreItem,
    deletePermanently,
  }), [trashItems]);

  return <TrashContext.Provider value={value}>{children}</TrashContext.Provider>;
};

export const useTrash = () => {
  const context = useContext(TrashContext);
  if (!context) {
    throw new Error('useTrash doit être utilisé avec TrashProvider');
  }
  return context;
};

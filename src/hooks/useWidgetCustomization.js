import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'skillbridge_admin_widgets';

const DEFAULT_WIDGETS = [
  { id: 'hero', label: 'Hero Dashboard', visible: true, order: 0 },
  { id: 'kpi', label: 'KPI Premium', visible: true, order: 1 },
  { id: 'alerts', label: 'Alertes prioritaires', visible: true, order: 2 },
  { id: 'charts', label: 'Graphiques Analytics', visible: true, order: 3 },
  { id: 'timeline', label: 'Activité récente', visible: true, order: 4 },
  { id: 'quickActions', label: 'Actions rapides', visible: true, order: 5 },
  { id: 'topCentres', label: 'Top centres', visible: true, order: 6 },
  { id: 'topFormations', label: 'Top formations', visible: true, order: 7 },
  { id: 'topTrainers', label: 'Top formateurs', visible: true, order: 8 },
  { id: 'objectives', label: 'Objectifs mensuels', visible: true, order: 9 },
  { id: 'aiAssistant', label: 'Assistant IA', visible: true, order: 10 },
  { id: 'platformMetrics', label: 'Métriques plateforme', visible: true, order: 11 },
  { id: 'performance', label: 'Performance plateforme', visible: true, order: 12 },
  { id: 'calendar', label: 'Mini calendrier', visible: true, order: 13 },
  { id: 'weather', label: 'Météo business', visible: true, order: 14 },
  { id: 'notifications', label: 'Notifications système', visible: true, order: 15 },
  { id: 'globalScore', label: 'Score global', visible: true, order: 16 },
  { id: 'export', label: 'Export', visible: true, order: 17 },
];

const loadWidgets = () => {
  if (typeof window === 'undefined') return DEFAULT_WIDGETS;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_WIDGETS;
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const byId = new Map(parsed.map((widget) => [widget.id, widget]));
      return DEFAULT_WIDGETS.map((widget) => ({ ...widget, ...(byId.get(widget.id) || {}) }));
    }
    return DEFAULT_WIDGETS;
  } catch {
    return DEFAULT_WIDGETS;
  }
};

export const useWidgetCustomization = () => {
  const [widgets, setWidgets] = useState(loadWidgets);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
    }
  }, [widgets]);

  const toggleWidget = useCallback((widgetId) => {
    setWidgets(prev => prev.map(w =>
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    ));
  }, []);

  const moveWidget = useCallback((widgetId, direction) => {
    setWidgets(prev => {
      const idx = prev.findIndex(w => w.id === widgetId);
      if (idx === -1) return prev;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const result = [...prev];
      const temp = result[idx].order;
      result[idx] = { ...result[idx], order: result[newIdx].order };
      result[newIdx] = { ...result[newIdx], order: temp };
      return result.sort((a, b) => a.order - b.order);
    });
  }, []);

  const resetWidgets = useCallback(() => {
    setWidgets(DEFAULT_WIDGETS);
  }, []);

  const visibleWidgets = widgets
    .filter(w => w.visible)
    .sort((a, b) => a.order - b.order);

  return { widgets, visibleWidgets, toggleWidget, moveWidget, resetWidgets };
};


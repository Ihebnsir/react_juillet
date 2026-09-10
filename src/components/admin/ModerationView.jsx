import React from 'react';
import { SignalementsModerationPanel } from './SignalementsModerationPanel';
import { AdminPageShell } from './AdminPageShell';

export const ModerationView = () => (
  <AdminPageShell
    eyebrow="Surveillance"
    title="Modération des signalements"
    subtitle="Les signalements et leurs actions sont chargés depuis les endpoints de modération du backend."
    badge="API"
    className="px-4 py-6 sm:px-6 lg:px-8"
  >
    <SignalementsModerationPanel />
  </AdminPageShell>
);

export default ModerationView;

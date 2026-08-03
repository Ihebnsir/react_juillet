/**
 * LITIGES — Résolution formelle des dossiers escaladés.
 * Rôle : suivi procédural et financier des dossiers déjà ouverts (via Modération
 * ou directement signalés par un utilisateur), avec SLA, priorité et arbitrage.
 * Frontière claire : cette vue ne détecte pas les risques en amont ; elle traite
 * les dossiers déjà escaladés par ModerationPage.
 */
import React from 'react';
import { LitigesView } from '../../components/admin/LitigesView';

export const LitigesPage = () => <LitigesView />;

export default LitigesPage;

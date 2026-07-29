/**
 * MODÉRATION — Surveillance et détection en amont.
 * Rôle : repérer les contenus/comportements à risque (signalements, scores IA, fraude).
 * Frontière claire : cette vue détecte, surveille et escalade vers un litige formel,
 * mais ne gère pas le suivi procédural, le SLA ni l'arbitrage financier.
 * C'est le rôle de LitigesPage.
 */
import React from 'react';
import { ModerationView } from '../../components/admin/ModerationView';

export const ModerationPage = () => <ModerationView />;

export default ModerationPage;

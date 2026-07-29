export const SECURITY_OVERVIEW = {
  securityScore: 98,
  activeAlerts: 7,
  lastSync: 'Il y a 3 minutes',
  platformStatus: 'Stable',
  analysisLatency: '5 minutes',
};

export const USER_ROLES = ['Apprenant', 'Centre', 'Formateur', 'Entreprise'];
export const RISK_LEVELS = ['Faible', 'Moyen', 'Élevé', 'Critique'];
export const MODERATION_STATUSES = ['Nouveau', 'Analyse', 'Bloqué', 'Traité'];

export const mockModerationAlerts = [
  {
    id: 'AL-1001',
    userId: 'user-101',
    type: 'Fraude détectée',
    user: 'Mohamed Chaker',
    role: 'Apprenant',
    date: '2026-07-28 09:18',
    riskLevel: 'Critique',
    severity: 'danger',
    message: 'Tentative de paiement multiple avec carte étrangère et contrôle KYC échoué.',
    category: 'Comptes à risque',
    status: 'A traiter',
    decision: 'Créez un litige et suspendez temporairement le compte.',
  },
  {
    id: 'AL-1002',
    userId: 'user-102',
    type: 'Compte suspect',
    user: 'Sofia Ben Youssef',
    role: 'Formateur',
    date: '2026-07-28 08:42',
    riskLevel: 'Important',
    severity: 'warning',
    message: 'Taux de refus élevé sur les séances, comportement de publication irrégulier.',
    category: 'Qualité contenu',
    status: 'En cours',
    decision: 'Vérifier les dernières annonces avant escalade.',
  },
  {
    id: 'AL-1003',
    userId: 'user-103',
    type: 'Activité anormale',
    user: 'Moncef Triki',
    role: 'Entreprise',
    date: '2026-07-27 22:17',
    riskLevel: 'Critique',
    severity: 'danger',
    message: 'Basculement de rôle administrateur détecté sans authentification multi-facteur.',
    category: 'Sécurité comptes',
    status: 'A traiter',
    decision: 'Bloquer l’accès et réinitialiser la session.',
  },
  {
    id: 'AL-1004',
    type: 'Contenu problématique',
    user: 'Yasmine Khelifi',
    role: 'Formateur',
    date: '2026-07-27 16:04',
    riskLevel: 'Important',
    severity: 'warning',
    message: 'Commentaires inappropriés sur un module de formation sensibilisation.',
    category: 'Conformité plateforme',
    status: 'En cours',
    decision: 'Envoyer une alerte qualité au centre et vérifier les contenus associés.',
  },
  {
    id: 'AL-1005',
    type: 'Plusieurs signalements',
    user: 'Amina Ghribi',
    role: 'Apprenant',
    date: '2026-07-26 11:50',
    riskLevel: 'Élevé',
    severity: 'info',
    message: 'Signalements répétés sur la même session de formation.',
    category: 'Qualité contenu',
    status: 'Analyse',
    decision: 'Suivre et confirmer si un litige doit être ouvert.',
  },
];

export const mockRiskUsers = [
  {
    id: 'user-101',
    name: 'Sami Triki',
    email: 'sami.triki@skillbridge.tn',
    role: 'Apprenant',
    joined: '2023-11-14',
    reportsReceived: 3,
    adminActions: 4,
    suspiciousLogins: 2,
    trainingsPublished: 0,
    trustScore: 72,
    profileSummary: 'Compte récent avec activité de paiement inhabituel et plusieurs signalements sur la dernière semaine.',
    history: [
      'Signalement de contenu inapproprié',
      'Connexion depuis un nouvel appareil',
      'Mode de paiement modifié',
    ],
  },
  {
    id: 'user-102',
    name: 'Leila Khelif',
    email: 'leila.khelif@skillbridge.tn',
    role: 'Formateur',
    joined: '2021-05-02',
    reportsReceived: 1,
    adminActions: 2,
    suspiciousLogins: 0,
    trainingsPublished: 18,
    trustScore: 87,
    profileSummary: 'Formateur stable avec un signalement récent lié à un commentaire désactivé.',
    history: ['Contenu vérifié', 'Avertissement envoyé au formateur', 'Révision de session demandée'],
  },
  {
    id: 'user-103',
    name: 'Ariane Saad',
    email: 'ariane.saad@skillbridge.tn',
    role: 'Centre',
    joined: '2020-09-18',
    reportsReceived: 2,
    adminActions: 1,
    suspiciousLogins: 1,
    trainingsPublished: 120,
    trustScore: 91,
    profileSummary: 'Centre premium avec historique solide, mais une alerte récente sur la qualité de formation.',
    history: ['Vérification qualité effectuée', 'Réponse à avis négatif'],
  },
];

export const mockModerationTable = [
  {
    id: 'MOD-4201',
    type: 'Fraude détectée',
    user: 'Mohamed Chaker',
    role: 'Apprenant',
    category: 'Comptes à risque',
    risk: 'Critique',
    date: '2026-07-28',
    status: 'Nouveau',
    userId: 'user-101',
    description: 'Tentative de paiement multiple avec carte étrangère et contrôle KYC échoué.',
  },
  {
    id: 'MOD-4202',
    type: 'Contenu signalé',
    user: 'Yasmine Khelifi',
    role: 'Formateur',
    category: 'Qualité contenu',
    risk: 'Élevé',
    date: '2026-07-28',
    status: 'Nouveau',
    userId: 'user-102',
    description: 'Publication de supports suspects avec allégations non conformes aux standards du programme.',
  },
  {
    id: 'MOD-4203',
    type: 'Connexion inhabituelle',
    user: 'Sami Triki',
    role: 'Apprenant',
    category: 'Sécurité comptes',
    risk: 'Critique',
    date: '2026-07-28',
    status: 'Analyse',
    userId: 'user-101',
    description: 'Plusieurs tentatives de connexion déclenchées depuis une localisation non reconnue.',
  },
  {
    id: 'MOD-4204',
    type: 'Signalement multiple',
    user: 'Amina Ghribi',
    role: 'Apprenant',
    category: 'Conformité plateforme',
    risk: 'Moyen',
    date: '2026-07-27',
    status: 'En cours',
    userId: 'user-101',
    description: 'Signalements répétés de contenu inadapté sur le fil de discussion.',
  },
  {
    id: 'MOD-4205',
    type: 'Compte suspect',
    user: 'Moncef Triki',
    role: 'Entreprise',
    category: 'Sécurité comptes',
    risk: 'Critique',
    date: '2026-07-27',
    status: 'Nouveau',
    userId: 'user-103',
    description: 'Modifications d’accès administrateur détectées sans MFA.',
  },
  {
    id: 'MOD-4206',
    type: 'Publication sensée',
    user: 'Nora Ayadi',
    role: 'Formateur',
    category: 'Qualité contenu',
    risk: 'Faible',
    date: '2026-07-26',
    status: 'Traité',
    userId: 'user-102',
    description: 'Signalement d’un contenu jugé ambigu, vérifié et classé sans suite.',
  },
  {
    id: 'MOD-4207',
    type: 'Activité anormale',
    user: 'Karim Hachemi',
    role: 'Centre',
    category: 'Comptes à risque',
    risk: 'Élevé',
    date: '2026-07-26',
    status: 'Analyse',
    userId: 'user-103',
    description: 'Volume de publication très élevé associé à des activités de facturation atypiques.',
  },
];

export const mockActionTimeline = [
  {
    id: 'act-001',
    admin: 'Admin Ahmed',
    action: 'A suspendu un compte',
    target: 'Mohamed Chaker',
    date: '28/07/2026 14:32',
    ip: '196.201.45.12',
  },
  {
    id: 'act-002',
    admin: 'Admin Sarah',
    action: 'A supprimé un contenu signalé',
    target: 'Yasmine Khelifi',
    date: '28/07/2026 13:15',
    ip: '196.201.45.55',
  },
  {
    id: 'act-003',
    admin: 'Admin Karim',
    action: 'A demandé une vérification de conformité',
    target: 'Moncef Triki',
    date: '28/07/2026 11:02',
    ip: '196.201.45.73',
  },
];

export const mockModerationKPIs = [
  {
    label: 'Signalements actifs',
    value: 24,
    growth: 12,
    target: 30,
    progress: 80,
    sparklineData: [4, 6, 8, 12, 15, 18, 24],
    icon: () => null,
    tone: 'text-rose-400',
    helper: 'Urgence élevée sur la dernière journée',
  },
  {
    label: 'Contenus vérifiés aujourd’hui',
    value: 156,
    growth: 8,
    target: 180,
    progress: 87,
    sparklineData: [120, 130, 145, 150, 158, 152, 156],
    icon: () => null,
    tone: 'text-sky-400',
    helper: 'Controle de qualité continu',
  },
  {
    label: 'Utilisateurs sous surveillance',
    value: 8,
    growth: 4,
    target: 12,
    progress: 66,
    sparklineData: [5, 6, 7, 7, 8, 8, 8],
    icon: () => null,
    tone: 'text-amber-400',
    helper: 'Profils en surveillance renforcée',
  },
  {
    label: 'Temps moyen de résolution',
    value: 2.58,
    growth: -5,
    target: 3,
    progress: 86,
    sparklineData: [3.8, 3.5, 3.2, 3.0, 2.9, 2.7, 2.58],
    icon: () => null,
    tone: 'text-emerald-400',
    helper: 'Objectif de 3h atteint',
    format: 'number',
  },
];

export const mockRiskActionMap = {
  Critique: 'danger',
  Important: 'warning',
  Élevé: 'warning',
  Moyen: 'info',
  Faible: 'info',
};

export const mockModerationNotes = [
  {
    id: 'note-101',
    admin: 'Admin Fatma',
    date: '28/07/2026 09:08',
    summary: 'Contacté le centre pour vérifier le contenu de la session React Avancé.',
  },
  {
    id: 'note-102',
    admin: 'Admin Walid',
    date: '27/07/2026 17:24',
    summary: 'Demande de révision de publication envoyée au formateur.',
  },
];

export const MODERATION_ALERTS_STORAGE_KEY = 'skillbridge_admin_moderation_alerts';
export const MODERATION_TABLE_STORAGE_KEY = 'skillbridge_admin_moderation_table';

export const loadModerationAlertsFromStorage = () => {
  if (typeof window === 'undefined') return mockModerationAlerts;
  try {
    const raw = window.localStorage.getItem(MODERATION_ALERTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : mockModerationAlerts;
  } catch (error) {
    return mockModerationAlerts;
  }
};

export const saveModerationAlertsToStorage = (alerts) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(MODERATION_ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  } catch (error) {
    // ignore storage errors
  }
};

export const loadModerationTableFromStorage = () => {
  if (typeof window === 'undefined') return mockModerationTable;
  try {
    const raw = window.localStorage.getItem(MODERATION_TABLE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : mockModerationTable;
  } catch (error) {
    return mockModerationTable;
  }
};

export const saveModerationTableToStorage = (rows) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(MODERATION_TABLE_STORAGE_KEY, JSON.stringify(rows));
  } catch (error) {
    // ignore storage errors
  }
};

export const mockModerationCenters = [
  {
    id: 'centre-verify-1',
    nom: 'Digital Design Institute',
    verificationRisk: 88,
    alertCount: 6,
    lastReview: '2026-07-26',
    status: 'En attente de vérification',
  },
  {
    id: 'centre-verify-2',
    nom: 'Elite Formation Pro',
    verificationRisk: 74,
    alertCount: 4,
    lastReview: '2026-07-27',
    status: 'Action requise',
  },
  {
    id: 'centre-verify-3',
    nom: 'Coding Academy Tunisie',
    verificationRisk: 65,
    alertCount: 3,
    lastReview: '2026-07-25',
    status: 'Surveillance active',
  },
];

export const mockModerationWatchlist = [
  {
    id: 'watch-001',
    name: 'Sami Triki',
    role: 'Apprenant',
    trustScore: 72,
    alerts: 3,
    lastActivity: 'Connexion inhabituelle',
  },
  {
    id: 'watch-002',
    name: 'Leila Khelif',
    role: 'Formateur',
    trustScore: 87,
    alerts: 2,
    lastActivity: 'Contenu signalé',
  },
  {
    id: 'watch-003',
    name: 'Ariane Saad',
    role: 'Centre',
    trustScore: 91,
    alerts: 1,
    lastActivity: 'Révision qualité requise',
  },
];

export const mockModerationHeatmap = [
  { label: 'Comptes', values: [2, 5, 3, 4, 6, 5, 3] },
  { label: 'Contenus', values: [1, 3, 6, 4, 5, 3, 2] },
  { label: 'Conformité', values: [0, 2, 2, 3, 4, 2, 1] },
  { label: 'Signaux IA', values: [3, 4, 5, 4, 6, 5, 4] },
];

export const mockModerationCompliance = [
  { label: 'Vérification KYC', score: 82, tone: 'warning' },
  { label: 'Contrôle contenu', score: 91, tone: 'success' },
  { label: 'MFA activé', score: 77, tone: 'warning' },
  { label: 'Données personnelles', score: 95, tone: 'success' },
];

export const mockModerationAISuggestions = [
  { id: 'ai-001', text: 'Renforcer les contrôles MFA pour les comptes sensibles.', action: 'Voir', link: '/admin/moderation' },
  { id: 'ai-002', text: 'Planifier une vérification d’identité pour 3 centres à risque.', action: 'Planifier', link: '/admin/moderation' },
  { id: 'ai-003', text: 'Segmenter les comptes sous surveillance pour détection accélérée.', action: 'Explorer', link: '/admin/moderation' },
];

# Rapport d’audit — Espace Admin SkillBridge

## 1. Problèmes constatés

- Le dashboard admin contenait trop de contenus analytiques et de widgets détaillés, ce qui le rendait moins lisible.
- Les KPI et graphiques étaient mélangés entre supervision quotidienne et analyse approfondie.
- L’interface Analytics n’était pas suffisamment structurée pour une utilisation entreprise.
- Certaines actions rapides pointaient vers des routes utiles mais non contextualisées.
- Le dashboard comportait plusieurs blocs décoratifs ou trop détaillés pour une vue de supervision rapide.

## 2. Architecture cible

- Dashboard : vue de supervision quotidienne claire et rapide.
- Analytics : espace dédié aux métriques, tendances, comparaison de périodes et exports.
- Sidebar : navigation claire et orientée produit.
- Données : centralisées dans le hook admin et organisées autour d’objets métier cohérents.

## 3. Plan de restructuration

- Simplifier le dashboard autour de :
  - vue globale plateforme,
  - actions rapides,
  - activité récente,
  - santé plateforme,
  - notifications/alertes prioritaires.
- Développer Analytics autour de :
  - utilisateurs,
  - formations,
  - centres,
  - engagement,
  - rapports/export.

## 4. Fichiers principaux concernés

- src/pages/admin/DashboardPage.jsx
- src/pages/admin/AnalyticsPage.jsx
- src/hooks/useAdminDashboardData.js
- src/layouts/AdminLayout.jsx
- src/utils/adminDashboardUtils.js
- src/components/admin/QuickActionsPanel.jsx

## 5. Points validés

- Les routes admin existantes sont conservées.
- Les interactions principales restent fonctionnelles.
- Le build de production reste valide après la restructuration.

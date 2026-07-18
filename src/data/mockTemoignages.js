const createAvatar = (initials, bg) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
      <rect width="96" height="96" rx="24" fill="${bg}" />
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#ffffff">${initials}</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const mockTemoignages = [
  {
    id: 1,
    nom: 'Amine T.',
    avatar: createAvatar('AT', '#1AB899'),
    role: 'Développeur Web, Tunis',
    citation: "SkillBridge m'a permis de trouver une formation React avec un centre vérifié près de chez moi. J'ai décroché un poste 2 mois après ma certification.",
  },
  {
    id: 2,
    nom: 'Sarra B.',
    avatar: createAvatar('SB', '#8B5CF6'),
    role: 'Data Analyst, Sfax',
    citation: "La possibilité de comparer les centres et de voir les avis d'autres apprenants m'a évité de perdre du temps sur des formations peu sérieuses.",
  },
  {
    id: 3,
    nom: 'Mehdi K.',
    avatar: createAvatar('MK', '#F97316'),
    role: 'Responsable centre de formation',
    citation: "En tant que centre, le badge Centre vérifié nous a apporté beaucoup plus de visibilité et de confiance auprès des apprenants.",
  },
  {
    id: 4,
    nom: 'Nour H.',
    avatar: createAvatar('NH', '#0E9A80'),
    role: 'Étudiante en cybersécurité',
    citation: "Le suivi de progression et les certifications téléchargeables directement depuis mon profil m'ont vraiment aidée à rester motivée.",
  },
];

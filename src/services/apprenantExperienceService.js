import { mockFormations } from '../data/mockFormations';
import { mockReservations } from '../data/mockReservations';

export const mockAvis = [
  {
    id: 'avis-1',
    apprenantId: 1,
    formationId: 'form-1',
    formationTitre: 'React Avancé',
    note: 5,
    commentaire: 'Très bon accompagnement et contenu pertinent.',
  },
  {
    id: 'avis-2',
    apprenantId: 1,
    formationId: 'form-2',
    formationTitre: 'UI/UX Design',
    note: 4,
    commentaire: 'Exercices clairs, un peu plus de pratique serait appréciable.',
  },
  {
    id: 'avis-3',
    apprenantId: 2,
    formationId: 'form-4',
    formationTitre: 'Marketing Digital',
    note: 3,
    commentaire: 'Bon aperçu général du sujet.',
  },
];

export const getRecommandationsForUser = (userId) => {
  const reservations = mockReservations.filter((reservation) => reservation.learnerId === userId);
  const followedFormationIds = reservations.map((reservation) => reservation.formationId);
  const followedFormations = mockFormations.filter((formation) => followedFormationIds.includes(formation.id));

  return mockFormations
    .filter((formation) => !followedFormationIds.includes(formation.id))
    .slice(0, 4)
    .map((formation, index) => ({
      id: `${formation.id}-rec-${index}`,
      formation,
      raison: followedFormations.length > 0
        ? `Car vous avez suivi ${followedFormations[0].title}`
        : 'Basé sur votre profil de formation',
    }));
};

const AVIS_STORAGE_KEY = 'skillbridge_avis';

// Initialiser depuis localStorage si des données existent
const getInitialAvis = () => {
  if (typeof window === 'undefined') return mockAvis;
  try {
    const stored = window.localStorage.getItem(AVIS_STORAGE_KEY);
    if (!stored) return mockAvis;
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return mockAvis;
  } catch {
    return mockAvis;
  }
};

// État mutable des avis (synchronisé avec localStorage)
let avisData = getInitialAvis();

export const getMesAvisForUser = (userId) => avisData.filter((avis) => avis.apprenantId === userId);

export const updateAvis = async (id, { note, commentaire }) => {
  const index = avisData.findIndex((a) => a.id === id);
  if (index !== -1) {
    avisData[index] = { ...avisData[index], note, commentaire };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AVIS_STORAGE_KEY, JSON.stringify(avisData));
    }
  }
  return avisData[index];
};

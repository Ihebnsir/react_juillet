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

export const getMesAvisForUser = (userId) => mockAvis.filter((avis) => avis.apprenantId === userId);

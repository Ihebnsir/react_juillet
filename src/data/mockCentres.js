export const mockCentres = [
  {
    id: 'centre-1',
    name: 'Tech Academy Tunis',
    ville: 'Tunis',
    // Source de vérité
    statutVerification: 'verifie',
    dateDemande: '2026-05-12',
    dateValidation: '2026-06-01',
    motifRejet: null,

    // Champs dérivés (temporaire compat)
    verifie: true,

    noteMoyenne: 4.8,
    formationsPubliees: 4,
    reservationsEnCours: 12,
  },
  {
    id: 'centre-2',
    name: 'Digital Design Institute',
    ville: 'Sfax',
    // Source de vérité
    statutVerification: 'non_soumis',
    dateDemande: null,
    dateValidation: null,
    motifRejet: null,

    // Champs dérivés (temporaire compat)
    verifie: false,

    noteMoyenne: 4.4,
    formationsPubliees: 3,
    reservationsEnCours: 8,
  },
  {
    id: 'centre-3',
    name: 'Business Skills Center',
    ville: 'Kasserine',
    // Source de vérité
    statutVerification: 'en_attente',
    dateDemande: '2026-06-10',
    dateValidation: null,
    motifRejet: null,

    // Champs dérivés (temporaire compat)
    verifie: false,

    noteMoyenne: 4.2,
    formationsPubliees: 2,
    reservationsEnCours: 5,
  },
  // 4e état de démo: rejete
  {
    id: 'centre-4',
    name: 'Centre Nord Academy',
    ville: 'Ariana',
    statutVerification: 'rejete',
    dateDemande: '2026-05-20',
    dateValidation: null,
    motifRejet: 'Documents incomplets (reçus non conformes).',
    verifie: false,
    noteMoyenne: 4.1,
    formationsPubliees: 1,
    reservationsEnCours: 2,
  },
];


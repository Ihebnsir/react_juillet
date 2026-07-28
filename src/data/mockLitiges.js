/**
 * Données mockées pour le Centre de résolution des litiges.
 * Conflits entre utilisateurs (pas de modération de contenu).
 * Catégories : remboursement, réservation, certificat, paiement,
 *              absence formateur, inscription, qualité formation,
 *              communication, retard, annulation
 */

const now = new Date();
const d = (offset) => {
  const date = new Date(now);
  date.setDate(date.getDate() + offset);
  return date.toISOString().split('T')[0];
};

export const CATEGORIES_LITIGES = [
  'Remboursement',
  'Réservation',
  'Certificat',
  'Paiement',
  'Absence formateur',
  'Inscription',
  'Qualité formation',
  'Communication',
  'Retard',
  'Annulation',
];

export const STATUS_LITIGES = [
  'ouvert',
  'analyse',
  'attente_justificatifs',
  'en_cours',
  'decision',
  'resolu',
  'archive',
];

export const PRIORITES = ['basse', 'moyenne', 'haute', 'critique'];

export const generateMockLitiges = () => {
  const etudiants = [
    { id: 'student-1', nom: 'Amine Bensaid', email: 'amine.bensaid@skillbridge.tn', tel: '+216 52 111 222', litigesAnterieurs: 1, dossiersResolus: 1 },
    { id: 'student-2', nom: 'Salma Trabelsi', email: 'salma.trabelsi@skillbridge.tn', tel: '+216 58 333 444', litigesAnterieurs: 0, dossiersResolus: 0 },
    { id: 'student-3', nom: 'Houssem Gharbi', email: 'houssem.gharbi@skillbridge.tn', tel: '+216 71 777 888', litigesAnterieurs: 2, dossiersResolus: 1 },
    { id: 'student-4', nom: 'Mariem Ben Ali', email: 'mariem.benali@skillbridge.tn', tel: '+216 20 123 456', litigesAnterieurs: 0, dossiersResolus: 0 },
    { id: 'student-5', nom: 'Youssef Karray', email: 'youssef.karray@skillbridge.tn', tel: '+216 50 987 654', litigesAnterieurs: 3, dossiersResolus: 2 },
    { id: 'student-6', nom: 'Nour Dammak', email: 'nour.dammak@skillbridge.tn', tel: '+216 22 333 444', litigesAnterieurs: 1, dossiersResolus: 0 },
    { id: 'student-7', nom: 'Ahmed Ben Salah', email: 'ahmed.bensalah@skillbridge.tn', tel: '+216 55 666 777', litigesAnterieurs: 0, dossiersResolus: 0 },
  ];

  const centres = [
    { id: 'centre-1', nom: 'Tech Academy Tunis', email: 'karim.benali@techacademy.tn', tel: '+216 71 123 456', litigesTotal: 5, tempsMoyen: '3.2j', litigesResolus: 4 },
    { id: 'centre-2', nom: 'Digital Design Institute', email: 'sonia.mejri@digitaldesign.tn', tel: '+216 74 456 789', litigesTotal: 3, tempsMoyen: '4.1j', litigesResolus: 2 },
    { id: 'centre-3', nom: 'Business Skills Center', email: 'msalah@businesskasserine.tn', tel: '+216 77 789 012', litigesTotal: 4, tempsMoyen: '5.0j', litigesResolus: 3 },
    { id: 'centre-5', nom: 'Elite Formation Pro', email: 'nadia.khemiri@eliteformation.tn', tel: '+216 73 234 567', litigesTotal: 2, tempsMoyen: '2.5j', litigesResolus: 2 },
    { id: 'centre-6', nom: 'Coding Academy Tunisie', email: 'youssef@codingacademy.tn', tel: '+216 71 555 666', litigesTotal: 1, tempsMoyen: '1.0j', litigesResolus: 1 },
  ];

  const formations = [
    { id: 'form-1', titre: 'React Avancé' },
    { id: 'form-2', titre: 'UI/UX Design' },
    { id: 'form-3', titre: 'Node.js Backend' },
    { id: 'form-4', titre: 'Marketing Digital' },
    { id: 'form-5', titre: 'Data Science Basics' },
    { id: 'form-6', titre: 'Gestion Agile' },
    { id: 'form-7', titre: 'Photoshop Pro' },
    { id: 'form-8', titre: 'Python pour Data' },
  ];

  const responsables = [
    { id: 'admin-1', nom: 'Admin Principal', email: 'admin@skillbridge.tn' },
    { id: 'admin-2', nom: 'Sophie Martin', email: 'sophie.martin@skillbridge.tn' },
    { id: 'admin-3', nom: 'Karim Jelliti', email: 'karim.jelliti@skillbridge.tn' },
  ];

  const templates = [
    { titre: 'Demande de remboursement formation', description: "L'étudiant a demandé un remboursement après avoir suivi seulement 2 séances, estimant que le contenu ne correspond pas à la description.", categorie: 'Remboursement', priorite: 'haute', statut: 'en_cours', etudiantIdx: 0, centreIdx: 0, formationIdx: 0, sla: '24h' },
    { titre: 'Certificat de formation non reçu', description: "L'étudiant a terminé sa formation il y a 3 semaines mais n'a toujours pas reçu son certificat. Relances restées sans réponse.", categorie: 'Certificat', priorite: 'haute', statut: 'analyse', etudiantIdx: 1, centreIdx: 1, formationIdx: 1, sla: '48h' },
    { titre: 'Paiement en double constaté', description: "L'étudiant a été débité deux fois pour la même inscription. Le centre refuse de rembourser le paiement en trop.", categorie: 'Paiement', priorite: 'critique', statut: 'attente_justificatifs', etudiantIdx: 2, centreIdx: 2, formationIdx: 3, sla: '12h' },
    { titre: 'Absence du formateur sans préavis', description: "Le formateur ne s'est pas présenté à 3 séances consécutives. Aucune communication du centre pour expliquer ces absences.", categorie: 'Absence formateur', priorite: 'critique', statut: 'ouvert', etudiantIdx: 3, centreIdx: 3, formationIdx: 0, sla: '12h' },
    { titre: "Problème d'inscription à la formation", description: "L'étudiant s'est inscrit et a payé, mais son nom n'apparaît pas dans la liste des inscrits. Il ne peut pas accéder aux cours.", categorie: 'Inscription', priorite: 'haute', statut: 'en_cours', etudiantIdx: 4, centreIdx: 4, formationIdx: 4, sla: '24h' },
    { titre: 'Qualité de formation insuffisante', description: "Plusieurs étudiants se plaignent du contenu obsolète et du manque de préparation du formateur. Demandent un remboursement partiel.", categorie: 'Qualité formation', priorite: 'moyenne', statut: 'analyse', etudiantIdx: 5, centreIdx: 0, formationIdx: 5, sla: '72h' },
    { titre: 'Annulation de dernière minute', description: "Le centre a annulé la session 24h avant le début. L'étudiant avait déjà pris des dispositions (congé, déplacement).", categorie: 'Annulation', priorite: 'haute', statut: 'ouvert', etudiantIdx: 6, centreIdx: 1, formationIdx: 2, sla: '24h' },
    { titre: 'Retard de livraison des supports de cours', description: "Les supports pédagogiques promis n'ont toujours pas été fournis après 2 semaines de formation.", categorie: 'Retard', priorite: 'moyenne', statut: 'attente_justificatifs', etudiantIdx: 0, centreIdx: 2, formationIdx: 6, sla: '48h' },
    { titre: 'Problème de communication avec le centre', description: "Aucune réponse aux emails et appels depuis 5 jours. L'étudiant ne peut pas joindre le centre pour un problème urgent.", categorie: 'Communication', priorite: 'moyenne', statut: 'en_cours', etudiantIdx: 1, centreIdx: 3, formationIdx: 7, sla: '48h' },
    { titre: 'Réservation non confirmée', description: "L'étudiant a réservé et payé une place, mais le centre affirme ne pas avoir reçu le paiement.", categorie: 'Réservation', priorite: 'haute', statut: 'analyse', etudiantIdx: 2, centreIdx: 4, formationIdx: 0, sla: '24h' },
    { titre: 'Demande de remboursement pour formation annulée', description: "Formation annulée par le centre, mais le remboursement n'a pas été effectué après 15 jours.", categorie: 'Remboursement', priorite: 'critique', statut: 'ouvert', etudiantIdx: 3, centreIdx: 0, formationIdx: 1, sla: '12h' },
    { titre: 'Certificat erroné', description: "Le certificat émis contient des erreurs dans le nom de l'étudiant et le titre de la formation.", categorie: 'Certificat', priorite: 'moyenne', statut: 'resolu', etudiantIdx: 4, centreIdx: 1, formationIdx: 2, sla: '72h' },
    { titre: 'Litige sur les frais de dossier', description: "Le centre facture des frais de dossier non mentionnés dans le contrat de formation.", categorie: 'Paiement', priorite: 'moyenne', statut: 'analyse', etudiantIdx: 5, centreIdx: 2, formationIdx: 3, sla: '48h' },
    { titre: 'Formateur non qualifié', description: "Le formateur ne maîtrise pas le sujet. Plusieurs étudiants ont signalé des erreurs techniques dans les cours.", categorie: 'Qualité formation', priorite: 'haute', statut: 'decision', etudiantIdx: 6, centreIdx: 3, formationIdx: 4, sla: '24h' },
    { titre: 'Double réservation sur la même session', description: "L'étudiant a été inscrit deux fois à la même session sans son consentement, engendrant des frais supplémentaires.", categorie: 'Réservation', priorite: 'moyenne', statut: 'en_cours', etudiantIdx: 0, centreIdx: 4, formationIdx: 5, sla: '48h' },
    { titre: 'Absence de support technique', description: "La plateforme en ligne est inaccessible depuis 4 jours. Le centre n'a pas fourni de solution alternative.", categorie: 'Communication', priorite: 'haute', statut: 'ouvert', etudiantIdx: 1, centreIdx: 0, formationIdx: 6, sla: '24h' },
    { titre: 'Remboursement partiel demandé', description: "L'étudiant n'a suivi que 30% de la formation pour raisons médicales et demande un remboursement au prorata.", categorie: 'Remboursement', priorite: 'basse', statut: 'attente_justificatifs', etudiantIdx: 2, centreIdx: 1, formationIdx: 7, sla: '96h' },
    { titre: 'Conflit sur les horaires de formation', description: "Les horaires annoncés ont été modifiés sans préavis, rendant la formation inaccessible pour l'étudiant.", categorie: 'Communication', priorite: 'moyenne', statut: 'en_cours', etudiantIdx: 3, centreIdx: 2, formationIdx: 0, sla: '48h' },
    { titre: "Non-délivrance de l'attestation de stage", description: "L'étudiant a besoin de son attestation pour un emploi mais le centre tarde à la délivrer.", categorie: 'Certificat', priorite: 'haute', statut: 'analyse', etudiantIdx: 4, centreIdx: 3, formationIdx: 1, sla: '24h' },
    { titre: 'Problème de paiement par carte', description: "Le paiement a été refusé mais le compte bancaire a été débité. L'étudiant réclame son argent.", categorie: 'Paiement', priorite: 'critique', statut: 'ouvert', etudiantIdx: 5, centreIdx: 4, formationIdx: 2, sla: '12h' },
    { titre: 'Inscription non traitée après paiement', description: "L'étudiant a payé il y a 10 jours mais son inscription n'est toujours pas active sur la plateforme.", categorie: 'Inscription', priorite: 'haute', statut: 'en_cours', etudiantIdx: 6, centreIdx: 0, formationIdx: 3, sla: '24h' },
    { titre: 'Formation non conforme au programme', description: "Le contenu réel de la formation diffère significativement du programme annoncé sur la plateforme.", categorie: 'Qualité formation', priorite: 'moyenne', statut: 'analyse', etudiantIdx: 0, centreIdx: 1, formationIdx: 4, sla: '72h' },
    { titre: 'Absence injustifiée du formateur', description: "Le formateur a manqué 4 séances sur 10, sans remplacement ni rattrapage proposé.", categorie: 'Absence formateur', priorite: 'haute', statut: 'resolu', etudiantIdx: 1, centreIdx: 2, formationIdx: 5, sla: '24h' },
    { titre: 'Annulation de formation sans remboursement', description: "Le centre a annulé la formation sans proposer de remboursement, seulement un avoir.", categorie: 'Annulation', priorite: 'critique', statut: 'decision', etudiantIdx: 2, centreIdx: 3, formationIdx: 6, sla: '12h' },
    { titre: 'Retard dans la correction des examens', description: "Les examens n'ont pas été corrigés après 3 semaines, retardant l'obtention des certificats.", categorie: 'Retard', priorite: 'basse', statut: 'attente_justificatifs', etudiantIdx: 3, centreIdx: 4, formationIdx: 7, sla: '96h' },
    { titre: "Problème d'accès à la plateforme e-learning", description: "L'étudiant n'arrive pas à se connecter à la plateforme depuis son inscription. Le support ne répond pas.", categorie: 'Communication', priorite: 'haute', statut: 'ouvert', etudiantIdx: 4, centreIdx: 0, formationIdx: 0, sla: '24h' },
  ];

  const generateConversation = (etudiant, centre, responsable) => [
    { auteur: etudiant.nom, role: 'etudiant', message: "Bonjour, je rencontre un problème et j'aimerais obtenir de l'aide.", date: d(-10), time: '09:15' },
    { auteur: 'Système', role: 'system', message: 'Litige ouvert. Notification envoyée au centre et à l\'administrateur.', date: d(-10), time: '09:16' },
    { auteur: centre.nom, role: 'centre', message: 'Nous avons bien reçu votre message. Nous allons examiner la situation et revenir vers vous rapidement.', date: d(-9), time: '14:30' },
    { auteur: etudiant.nom, role: 'etudiant', message: 'Merci. Pouvez-vous me donner un délai précis ?', date: d(-8), time: '10:00' },
    { auteur: responsable.nom, role: 'admin', message: "Bonjour, je suis l'administrateur en charge du dossier. Nous allons suivre ce litige de près.", date: d(-7), time: '11:45' },
    { auteur: centre.nom, role: 'centre', message: 'Nous avons besoin de plus d\'informations pour traiter votre demande. Pouvez-vous nous fournir les justificatifs ?', date: d(-5), time: '16:00' },
    { auteur: etudiant.nom, role: 'etudiant', message: "Oui, je vais vous envoyer les documents demandés aujourd'hui.", date: d(-4), time: '08:30' },
  ];

  const generateHistorique = (statut, etudiant, centre, responsable) => {
    const hist = [
      { date: d(-10), action: 'Ouverture du litige', auteur: etudiant.nom, details: "Litige créé par l'étudiant" },
      { date: d(-9), action: 'Notification', auteur: 'Système', details: 'Centre et administrateur notifiés' },
    ];
    if (statut === 'analyse' || ['attente_justificatifs', 'en_cours', 'decision', 'resolu', 'archive'].includes(statut)) {
      hist.push({ date: d(-7), action: 'Prise en charge', auteur: responsable.nom, details: "Dossier pris en charge par l'administration" });
    }
    if (statut === 'attente_justificatifs' || ['en_cours', 'decision', 'resolu', 'archive'].includes(statut)) {
      hist.push({ date: d(-5), action: 'Demande de justificatifs', auteur: centre.nom, details: 'Documents supplémentaires demandés' });
    }
    if (statut === 'en_cours' || ['decision', 'resolu', 'archive'].includes(statut)) {
      hist.push({ date: d(-3), action: 'Justificatifs reçus', auteur: etudiant.nom, details: "Documents fournis par l'étudiant" });
    }
    if (statut === 'decision' || ['resolu', 'archive'].includes(statut)) {
      hist.push({ date: d(-2), action: 'Analyse terminée', auteur: responsable.nom, details: 'Analyse du dossier finalisée, en attente de décision' });
    }
    if (statut === 'resolu' || statut === 'archive') {
      hist.push({ date: d(-1), action: 'Résolution', auteur: responsable.nom, details: 'Litige résolu : accord trouvé entre les parties' });
    }
    if (statut === 'archive') {
      hist.push({ date: d(0), action: 'Archivage', auteur: responsable.nom, details: 'Dossier archivé' });
    }
    return hist;
  };

  const generateNotesInternes = () => [
    { id: `note-${Math.random().toString(36).slice(2, 8)}`, date: d(-6), auteur: 'Admin Principal', contenu: 'Vérifier les échanges précédents entre les deux parties. Le centre a déjà eu des litiges similaires.' },
    { id: `note-${Math.random().toString(36).slice(2, 8)}`, date: d(-3), auteur: 'Sophie Martin', contenu: "Contacter le centre pour obtenir leur version des faits. L'étudiant semble de bonne foi." },
  ];

  const generateDocuments = () => [
    { id: `doc-${Math.random().toString(36).slice(2, 8)}`, nom: 'Contrat de formation.pdf', type: 'Contrat', date: d(-10), taille: '2.4 MB' },
    { id: `doc-${Math.random().toString(36).slice(2, 8)}`, nom: 'Justificatif_paiement.png', type: 'Paiement', date: d(-8), taille: '1.1 MB' },
    { id: `doc-${Math.random().toString(36).slice(2, 8)}`, nom: 'Échange_emails.pdf', type: 'Communication', date: d(-5), taille: '856 KB' },
  ];

  return templates.map((tpl, index) => {
    const etudiant = etudiants[tpl.etudiantIdx];
    const centre = centres[tpl.centreIdx];
    const formation = formations[tpl.formationIdx];
    const responsable = responsables[index % responsables.length];
    const dateOuverture = d(-10 + index);
    const joursEcoules = Math.floor((now - new Date(dateOuverture)) / (1000 * 60 * 60 * 24));
    const priorite = tpl.priorite;
    const niveauUrgence = priorite === 'critique' ? 'Urgent' : priorite === 'haute' ? 'Élevé' : priorite === 'moyenne' ? 'Normal' : 'Faible';

    return {
      id: `litige-${index + 1}`,
      numeroDossier: `LTG-${String(2026000 + index + 1).slice(-4)}`,
      titre: tpl.titre,
      description: tpl.description,
      categorie: tpl.categorie,
      priorite,
      statut: tpl.statut,
      dateOuverture,
      derniereMAJ: d(-1 * (index % 5)),
      tempsEcoule: `${joursEcoules}j`,
      sla: tpl.sla,
      niveauUrgence,
      responsable,
      etudiant,
      centre,
      formation,
      piecesJointes: generateDocuments(),
      conversation: generateConversation(etudiant, centre, responsable),
      historique: generateHistorique(tpl.statut, etudiant, centre, responsable),
      notesInternes: index % 3 === 0 ? generateNotesInternes() : [],
      decisionFinale: tpl.statut === 'resolu' || tpl.statut === 'archive' ? 'Accord trouvé : remboursement partiel de 50% accepté par les deux parties.' : null,
      aiAnalysis: generateAIAnalysis(tpl.categorie, tpl.priorite),
    };
  });
};

const generateAIAnalysis = (categorie, priorite) => {
  const analyses = {
    Remboursement: { risque: 'Élevé', recommandation: "Vérifier les conditions d'annulation. Recommander un remboursement au prorata.", confiance: 87, alerte: 'Litige récurrent signalé pour ce centre' },
    Certificat: { risque: 'Moyen', recommandation: 'Contacter le centre pour accélérer la délivrance du certificat.', confiance: 92, alerte: 'Délai de traitement dépassé' },
    Paiement: { risque: 'Élevé', recommandation: 'Vérifier les relevés bancaires. Contacter le support paiement.', confiance: 85, alerte: 'Transaction suspecte détectée' },
    'Absence formateur': { risque: 'Élevé', recommandation: 'Proposer un remplacement du formateur ou un remboursement.', confiance: 90, alerte: 'Non-respect du contrat de formation' },
    Inscription: { risque: 'Moyen', recommandation: "Vérifier le statut de l'inscription dans le système du centre.", confiance: 88, alerte: 'Délai de traitement anormal' },
    'Qualité formation': { risque: 'Moyen', recommandation: "Organiser une session d'évaluation avec le responsable pédagogique.", confiance: 75, alerte: 'Plusieurs signalements similaires' },
    Annulation: { risque: 'Élevé', recommandation: "Vérifier les conditions d'annulation. Proposer un dédommagement.", confiance: 82, alerte: 'Annulation sans préavis' },
    Communication: { risque: 'Faible', recommandation: 'Établir un canal de communication direct entre les parties.', confiance: 95, alerte: "Aucune réponse du centre depuis 48h" },
    Retard: { risque: 'Faible', recommandation: 'Définir un calendrier contraignant avec le centre.', confiance: 78, alerte: 'Retard accumulé' },
  };
  return analyses[categorie] || { risque: 'Non évalué', recommandation: 'Analyse en cours...', confiance: 50, alerte: 'Aucune alerte' };
};

export const mockLitiges = generateMockLitiges();

export const LITIGES_STORAGE_KEY = 'skillbridge_admin_litiges';

export const loadLitigesFromStorage = () => {
  if (typeof window === 'undefined') return generateMockLitiges();
  try {
    const raw = window.localStorage.getItem(LITIGES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : generateMockLitiges();
  } catch (error) {
    return generateMockLitiges();
  }
};

export const saveLitigesToStorage = (litiges) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LITIGES_STORAGE_KEY, JSON.stringify(litiges));
  } catch (error) {
    // ignore write errors in private mode
  }
};


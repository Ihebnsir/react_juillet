export const mockChatResponses = {
  default: "Je peux vous aider à explorer les formations, à gérer vos réservations ou à trouver les bons centres de formation.",
  greetings: "Bienvenue sur SkillBridge ! Je peux vous accompagner dans la recherche de formations, l'organisation de votre parcours et l'accès à votre espace personnel.",
  help: "Je peux vous aider à naviguer sur la plateforme, vérifier vos réservations, découvrir des centres et répondre à vos questions sur les formations.",
  formation: "Je peux vous recommander des parcours adaptés à vos objectifs, votre niveau et votre disponibilité.",
  reservation: "Pour vos réservations, je peux vous aider à vérifier l'état d'une inscription ou à préparer votre prochain passage.",
};

export function getMockChatResponse(input) {
  const normalized = input.trim().toLowerCase();

  if (!normalized) {
    return mockChatResponses.default;
  }

  if (normalized.includes("bonjour") || normalized.includes("salut")) {
    return mockChatResponses.greetings;
  }

  if (normalized.includes("formation") || normalized.includes("parcours")) {
    return mockChatResponses.formation;
  }

  if (normalized.includes("réservation") || normalized.includes("reservation") || normalized.includes("inscription")) {
    return mockChatResponses.reservation;
  }

  if (normalized.includes("aide") || normalized.includes("help")) {
    return mockChatResponses.help;
  }

  return mockChatResponses.default;
}

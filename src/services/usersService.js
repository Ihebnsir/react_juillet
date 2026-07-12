import { MOCK_USERS } from "../data/mockData";

// Service pour la gestion des utilisateurs et centres
export const usersService = {
  // Récupérer un utilisateur par ID
  getById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS.find((u) => u.id === id);
        if (user) {
          resolve(user);
        } else {
          reject("Utilisateur non trouvé");
        }
      }, 300);
    });
  },

  // Récupérer tous les centres
  getAllCenters: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const centers = MOCK_USERS.filter((u) => u.role === "center");
        resolve(centers);
      }, 400);
    });
  },

  // Récupérer les centres vérifiés
  getVerifiedCenters: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const centers = MOCK_USERS.filter(
          (u) => u.role === "center" && u.profile.verified
        );
        resolve(centers);
      }, 300);
    });
  },

  // Mettre à jour le profil d'un utilisateur
  updateProfile: async (userId, profileData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = MOCK_USERS.find((u) => u.id === userId);
        if (user) {
          user.profile = { ...user.profile, ...profileData };
          resolve(user);
        }
      }, 400);
    });
  },

  // Récupérer le centre d'une formation
  getCenterByFormation: async (formationId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Dans une vraie app, on cherchait le centerId de la formation
        // Ici on simule simplement
        resolve(MOCK_USERS.find((u) => u.role === "center"));
      }, 200);
    });
  },
};

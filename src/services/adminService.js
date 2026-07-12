import { MOCK_USERS, MOCK_FORMATIONS } from "../data/mockData";

// Service pour l'administration
export const adminService = {
  // Obtenir les statistiques du dashboard
  getStatistics: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          totalUsers: MOCK_USERS.length,
          totalLearners: MOCK_USERS.filter((u) => u.role === "learner").length,
          totalCenters: MOCK_USERS.filter((u) => u.role === "center").length,
          verifiedCenters: MOCK_USERS.filter(
            (u) => u.role === "center" && u.profile.verified
          ).length,
          totalFormations: MOCK_FORMATIONS.length,
          averageFormationPrice:
            MOCK_FORMATIONS.reduce((sum, f) => sum + f.price, 0) /
            MOCK_FORMATIONS.length,
        };
        resolve(stats);
      }, 500);
    });
  },

  // Récupérer tous les utilisateurs
  getAllUsers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_USERS);
      }, 400);
    });
  },

  // Récupérer les demandes de vérification de centre
  getVerificationRequests: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const requests = MOCK_USERS.filter(
          (u) => u.role === "center" && !u.profile.verified
        ).map((u) => ({
          id: u.id,
          centerName: u.name,
          email: u.email,
          description: u.profile.description,
          city: u.profile.city,
          website: u.profile.website,
          status: "pending",
        }));
        resolve(requests);
      }, 400);
    });
  },

  // Approuver une demande de vérification
  approveCenterVerification: async (centerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const center = MOCK_USERS.find((u) => u.id === centerId);
        if (center) {
          center.profile.verified = true;
          resolve({ success: true, message: "Centre vérifié avec succès" });
        } else {
          resolve({ success: false, message: "Centre non trouvé" });
        }
      }, 400);
    });
  },

  // Rejeter une demande de vérification
  rejectCenterVerification: async (centerId, reason) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const center = MOCK_USERS.find((u) => u.id === centerId);
        if (center) {
          center.profile.verificationRejectionReason = reason;
          resolve({ success: true, message: "Demande rejetée" });
        } else {
          resolve({ success: false, message: "Centre non trouvé" });
        }
      }, 400);
    });
  },

  // Suspendre un utilisateur
  suspendUser: async (userId, reason) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = MOCK_USERS.find((u) => u.id === userId);
        if (user) {
          user.suspended = true;
          user.suspensionReason = reason;
          resolve({ success: true, message: "Utilisateur suspendu" });
        } else {
          resolve({ success: false, message: "Utilisateur non trouvé" });
        }
      }, 400);
    });
  },

  // Supprimer un compte utilisateur
  deleteUser: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = MOCK_USERS.findIndex((u) => u.id === userId);
        if (index !== -1) {
          MOCK_USERS.splice(index, 1);
          resolve({ success: true, message: "Utilisateur supprimé" });
        } else {
          resolve({ success: false, message: "Utilisateur non trouvé" });
        }
      }, 400);
    });
  },
};

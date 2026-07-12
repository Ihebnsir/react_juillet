import { MOCK_FORMATIONS, MOCK_REVIEWS } from "../data/mockData";

// Service pour gérer les formations
export const formationsService = {
  // Récupérer toutes les formations
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_FORMATIONS), 500);
    });
  },

  // Récupérer une formation par ID
  getById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const formation = MOCK_FORMATIONS.find((f) => f.id === id);
        if (formation) {
          resolve(formation);
        } else {
          reject("Formation non trouvée");
        }
      }, 300);
    });
  },

  // Rechercher les formations avec filtres
  search: async (filters) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = MOCK_FORMATIONS;

        if (filters.keyword) {
          const keyword = filters.keyword.toLowerCase();
          results = results.filter(
            (f) =>
              f.title.toLowerCase().includes(keyword) ||
              f.description.toLowerCase().includes(keyword)
          );
        }

        if (filters.domain) {
          results = results.filter((f) => f.domain === filters.domain);
        }

        if (filters.city) {
          results = results.filter((f) => f.city === filters.city);
        }

        if (filters.priceMin !== undefined && filters.priceMax !== undefined) {
          results = results.filter(
            (f) => f.price >= filters.priceMin && f.price <= filters.priceMax
          );
        }

        // Tri par popularité si demandé
        if (filters.sortBy === "trending") {
          results = results.sort((a, b) => b.reviewCount - a.reviewCount);
        } else if (filters.sortBy === "price_low") {
          results = results.sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === "price_high") {
          results = results.sort((a, b) => b.price - a.price);
        }

        resolve(results);
      }, 600);
    });
  },

  // Récupérer les formations tendances
  getTrending: async (limit = 5) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trending = MOCK_FORMATIONS.filter((f) => f.trending).slice(0, limit);
        resolve(trending);
      }, 400);
    });
  },

  // Créer une nouvelle formation (pour les centres)
  create: async (formationData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFormation = {
          id: `form${Date.now()}`,
          ...formationData,
          averageRating: 0,
          reviewCount: 0,
          trending: false,
        };
        MOCK_FORMATIONS.push(newFormation);
        resolve(newFormation);
      }, 500);
    });
  },

  // Récupérer les formations d'un centre
  getCenterFormations: async (centerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const formations = MOCK_FORMATIONS.filter(
          (f) => f.centerId === centerId
        );
        resolve(formations);
      }, 400);
    });
  },

  // Obtenir les avis d'une formation
  getReviews: async (formationId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reviews = MOCK_REVIEWS.filter(
          (r) => r.formationId === formationId
        );
        resolve(reviews);
      }, 300);
    });
  },

  // Ajouter un avis
  addReview: async (formationId, review) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReview = {
          id: `rev${Date.now()}`,
          formationId,
          ...review,
          date: new Date().toISOString().split("T")[0],
        };
        MOCK_REVIEWS.push(newReview);
        
        // Mettre à jour la notation de la formation
        const formation = MOCK_FORMATIONS.find((f) => f.id === formationId);
        if (formation) {
          const allReviews = MOCK_REVIEWS.filter((r) => r.formationId === formationId);
          const avgRating =
            allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
          formation.averageRating = parseFloat(avgRating.toFixed(1));
          formation.reviewCount = allReviews.length;
        }
        
        resolve(newReview);
      }, 400);
    });
  },
};

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formationsService } from "../services/formationsService";
import { FormationCard } from "../components/Cards/FormationCard";
import { FiSearch, FiArrowRight } from "react-icons/fi";

export const HomePage = () => {
  const [trendingFormations, setTrendingFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadFormations = async () => {
      try {
        const trending = await formationsService.getTrending(4);
        setTrendingFormations(trending);
      } finally {
        setLoading(false);
      }
    };

    loadFormations();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // La recherche sera gérée via le routing vers /formations
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Bienvenue sur SkillBridge
            </h1>
            <p className="text-xl text-teal-100">
              Connectez-vous avec les meilleures formations et développez vos
              compétences
            </p>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-4 flex gap-2"
          >
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher une formation..."
                className="w-full pl-10 pr-4 py-2 text-gray-800 focus:outline-none"
              />
            </div>
            <Link
              to={`/formations?search=${searchTerm}`}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
            >
              Rechercher
            </Link>
          </form>
        </div>
      </section>

      {/* Trending Formations */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Formations Tendances
              </h2>
              <Link
                to="/formations"
                className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition font-medium"
              >
                Voir tout <FiArrowRight />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingFormations.map((formation) => (
                <FormationCard key={formation.id} formation={formation} />
              ))}
            </div>
          </section>

          {/* Benefits Section */}
          <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12">
                Pourquoi choisir SkillBridge?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Large Catalogue",
                    description:
                      "Des centaines de formations dans divers domaines",
                  },
                  {
                    title: "Centres Vérifiés",
                    description: "Tous nos centres de formation sont vérifiés et approuvés",
                  },
                  {
                    title: "Flexibilité",
                    description:
                      "Apprenez à votre rythme avec nos formations adaptables",
                  },
                ].map((benefit, index) => (
                  <div key={index} className="text-center p-6 bg-white rounded-lg">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-teal-600 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Prêt à commencer?</h2>
              <p className="mb-6 text-teal-100">
                Explorez nos formations et développez vos compétences dès
                aujourd'hui
              </p>
              <Link
                to="/formations"
                className="inline-block px-8 py-3 bg-white text-teal-600 rounded-lg hover:bg-gray-100 transition font-bold"
              >
                Explorer les formations
              </Link>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

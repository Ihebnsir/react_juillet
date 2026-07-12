import { useFavorites } from "../context/FavoritesContext";
import { FormationCard } from "../components/Cards/FormationCard";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";

export const FavoritesPage = () => {
  const { favorites, clearFavorites } = useFavorites();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <FiHeart className="text-red-500" size={28} />
          <h1 className="text-3xl font-bold">Mes Favoris</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FiHeart size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg mb-6">
              Vous n'avez pas encore ajouté de formations à vos favoris
            </p>
            <Link
              to="/formations"
              className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              Découvrir les formations
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                {favorites.length} formation{favorites.length > 1 ? "s" : ""} dans vos favoris
              </p>
              <button
                onClick={clearFavorites}
                className="text-red-600 hover:text-red-700 transition"
              >
                Vider
              </button>
            </div>

            {/* Comparative View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((formation) => (
                <FormationCard key={formation.id} formation={formation} />
              ))}
            </div>

            {/* Comparison Table */}
            {favorites.length > 1 && (
              <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-6 py-4 text-left font-bold">Formation</th>
                      <th className="px-6 py-4 text-left font-bold">Prix</th>
                      <th className="px-6 py-4 text-left font-bold">Durée</th>
                      <th className="px-6 py-4 text-left font-bold">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {favorites.map((formation) => (
                      <tr key={formation.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{formation.title}</td>
                        <td className="px-6 py-4 font-bold">
                          {formation.price} DT
                        </td>
                        <td className="px-6 py-4">{formation.duration}</td>
                        <td className="px-6 py-4">⭐ {formation.averageRating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

import { Link } from "react-router-dom";
import { FiMapPin, FiClock, FiStar, FiHeart, FiBriefcase } from "react-icons/fi";
import { FaTag } from "react-icons/fa";
import { useFavorites } from "../../context/FavoritesContext";
import { formatPriceTND } from "../../utils/formatPrice";

export const FormationCard = ({ formation }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(formation.id);

  const toggleFavorite = (e) => {
    e.preventDefault();
    if (favorite) {
      removeFavorite(formation.id);
    } else {
      addFavorite(formation);
    }
  };

  return (
    <Link to={`/formations/${formation.id}`}>
      <div className="card cursor-pointer group overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-200">
          <img
            src={formation.image}
            alt={formation.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
          >
            <FiHeart
              size={20}
              className={favorite ? "fill-red-500 text-red-500" : "text-gray-400"}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-800 dark:text-slate-100 group-hover:text-teal-600 transition line-clamp-2">
              {formation.title}
            </h3>
          </div>

          {formation.centre && (
            <Link to={`/centres/${formation.centre.id}`} className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700">
              <img src={formation.centre.logo} alt={formation.centre.name} className="w-6 h-6 rounded-full object-cover" />
              <span>{formation.centre.name}</span>
            </Link>
          )}

          {formation.offreStage && (
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              <FiBriefcase size={12} /> Stage + attestation
            </div>
          )}

          <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-2">
            {formation.description}
          </p>

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
              <FiMapPin size={16} /> {formation.city}
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
              <FiClock size={16} /> {formation.duration}
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
              <FaTag size={16} /> {formatPriceTND(formation.price)}
            </div>
          </div>

          {/* Rating and Price Footer */}
          <div className="pt-3 border-t flex justify-between items-center">
            <div className="flex items-center gap-1">
              <FiStar size={16} className="fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-gray-800 dark:text-slate-100">
                {formation.averageRating}
              </span>
              <span className="text-xs text-gray-500 dark:text-slate-400">
                ({formation.reviewCount})
              </span>
            </div>
            <span className="text-xs bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 px-2 py-1 rounded-full">
              {formation.availablePlaces} places
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

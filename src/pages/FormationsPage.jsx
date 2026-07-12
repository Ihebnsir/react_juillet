import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { formationsService } from "../services/formationsService";
import { FormationCard } from "../components/Cards/FormationCard";
import { DOMAINS, CITIES, PRICE_RANGES } from "../data/mockData";
import { FiSearch, FiFilter } from "react-icons/fi";

export const FormationsPage = () => {
  const [searchParams] = useSearchParams();
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: searchParams?.get("search") || "",
    domain: searchParams.get("domain") || "",
    city: searchParams.get("city") || "",
    priceMin: 0,
    priceMax: Infinity,
    sortBy: "trending",
  });

  useEffect(() => {
    const loadFormations = async () => {
      setLoading(true);
      try {
        const results = await formationsService.search(filters);
        setFormations(results);
      } finally {
        setLoading(false);
      }
    };

    loadFormations();
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Catalogue de formations</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FiFilter /> Filtres
              </h3>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Recherche
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={filters.keyword}
                    onChange={(e) => handleFilterChange("keyword", e.target.value)}
                    placeholder="Mots-clés..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Domain */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Domaine
                </label>
                <select
                  value={filters.domain}
                  onChange={(e) => handleFilterChange("domain", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Tous les domaines</option>
                  {DOMAINS.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ville
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Toutes les villes</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Budget
                </label>
                <select
                  onChange={(e) => {
                    const range = PRICE_RANGES.find(
                      (r) => r.label === e.target.value
                    );
                    if (range) {
                      handleFilterChange("priceMin", range.min);
                      handleFilterChange("priceMax", range.max);
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Tous les prix</option>
                  {PRICE_RANGES.map((range) => (
                    <option key={range.label} value={range.label}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Trier par
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="trending">Tendance</option>
                  <option value="price_low">Prix: bas au haut</option>
                  <option value="price_high">Prix: haut au bas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Formations Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              </div>
            ) : formations.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 text-lg">
                  Aucune formation trouvée. Essayez d'ajuster vos filtres.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-6">
                  {formations.length} formation{formations.length !== 1 ? "s" : ""} trouvée{formations.length !== 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formations.map((formation) => (
                    <FormationCard key={formation.id} formation={formation} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

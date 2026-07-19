import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formationsService } from "../services/formationsService";
import { FormationCard } from "../components/Cards/FormationCard";
import { DOMAINS, CITIES, PRICE_RANGES } from "../data/mockData";
import { FiSearch, FiFilter } from "react-icons/fi";

const CATEGORY_TO_DOMAIN = {
  "dev-web": "Développement Web",
  "data-bi": "Data Science",
  "iot": "Data Science",
  "python": "Data Science",
  "cybersecurite": "Marketing",
  "langues": "Management",
};

export const FormationsPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(false);
  const initialCategorie = searchParams.get("categorie") || "";
  const initialDomain = CATEGORY_TO_DOMAIN[initialCategorie] || searchParams.get("domain") || "";
  const [filters, setFilters] = useState({
    keyword: searchParams?.get("q") || searchParams?.get("search") || "",
    stageOnly: false,
    categorie: initialCategorie,
    domain: initialDomain,
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
    if (field === "domain") {
      const categorie = Object.entries(CATEGORY_TO_DOMAIN).find(([, domain]) => domain === value)?.[0] || "";
      setFilters((prev) => ({ ...prev, domain: value, categorie }));
      return;
    }
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-slate-100">{t('catalog.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-slate-100">
                <FiFilter /> {t('catalog.filters')}
              </h3>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('catalog.search')}
                </label>
                <div className="relative">
                  <FiSearch className="absolute top-3 start-3 text-gray-400" />
                  <input
                    type="text"
                    value={filters.keyword}
                    onChange={(e) => handleFilterChange("keyword", e.target.value)}
                    placeholder="Mots-clés..."
                    className="w-full ps-10 pe-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Domain */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('catalog.domain')}
                </label>
                <select
                  value={filters.domain}
                  onChange={(e) => handleFilterChange("domain", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Tous les domaines</option>
                  {DOMAINS.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
                {filters.domain ? (
                  <p className="mt-2 text-xs font-medium text-brand-700 dark:text-brand-300">
                    Filtre actif : {filters.domain}
                  </p>
                ) : null}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('catalog.city')}
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  {t('catalog.budget')}
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  {t('catalog.sort')}
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="trending">Tendance</option>
                  <option value="price_low">Prix: bas au haut</option>
                  <option value="price_high">Prix: haut au bas</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={filters.stageOnly}
                  onChange={(e) => handleFilterChange('stageOnly', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                Formations avec stage en entreprise
              </label>
            </div>
          </div>

          {/* Formations Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              </div>
            ) : formations.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 dark:text-slate-300 text-lg">
                  {t('catalog.noResults')}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 dark:text-slate-300 mb-6">
                  {formations.length} {t('catalog.results')}
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

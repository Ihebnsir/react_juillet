import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formationsService } from "../services/formationsService";
import { FormationCard } from "../components/Cards/FormationCard";
import { FiSearch, FiArrowRight } from "react-icons/fi";

export const HomePage = () => {
  const { t } = useTranslation();
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
    <main className="relative overflow-hidden bg-brand-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-brand-400/25 blur-3xl" />
        <div className="absolute top-10 left-[-160px] h-[480px] w-[480px] rounded-full bg-accent-400/20 blur-3xl" />
        <div className="absolute bottom-[-220px] left-[40%] h-[520px] w-[520px] rounded-full bg-sunset-400/15 blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,theme(colors.brand.900)_0%,theme(colors.slate.950)_60%)] dark:bg-[radial-gradient(circle_at_top_right,theme(colors.brand.900)_0%,theme(colors.slate.950)_60%)]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-900/70 via-brand-900/30 to-transparent" />

        <div className="text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur">
                <span className="inline-block h-2 w-2 rounded-full bg-brand-400" />
                <span className="text-sm font-semibold text-white/85">SkillBridge</span>
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                {t("home.title")}
              </h1>
              <p className="mt-4 text-xl text-brand-100/90">{t("home.subtitle")}</p>
            </div>

            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="relative mx-auto max-w-2xl bg-white/90 dark:bg-slate-900/40 border border-white/20 backdrop-blur rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.25)] p-4 flex gap-2"
            >
              <div className="flex-1 relative">
                <FiSearch className="absolute top-3 start-3 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t("home.searchPlaceholder")}
                  className="w-full ps-10 pe-4 py-2 text-slate-900 dark:text-slate-100 bg-transparent placeholder:text-slate-500 focus:outline-none"
                />
              </div>
              <Link
                to={`/formations?search=${searchTerm}`}
                className="btn-primary inline-flex items-center justify-center"
              >
                {t("common.search")}
              </Link>
            </form>
          </div>
        </div>
      </section>

      {/* Trending formations */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
        </div>
      ) : (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t("home.trendingTitle")}</h2>
            <Link
              to="/formations"
              className="flex items-center gap-2 text-brand-600 hover:text-brand-700 transition font-medium"
            >
              {t("common.viewAll")} <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingFormations.map((formation) => (
              <FormationCard key={formation.id} formation={formation} />
            ))}
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="bg-brand-50 dark:bg-slate-900/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">Pourquoi choisir SkillBridge?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Large Catalogue",
                description: "Des centaines de formations dans divers domaines",
              },
              {
                title: "Centres Vérifiés",
                description: "Tous nos centres de formation sont vérifiés et approuvés",
              },
              {
                title: "Flexibilité",
                description: "Apprenez à votre rythme avec nos formations adaptables",
              },
            ].map((benefit, index) => (
              <div key={index} className="card text-center">
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">{benefit.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("home.ctaTitle")}</h2>
          <p className="mb-6 text-brand-50/90">{t("home.ctaText")}</p>
          <Link
            to="/formations"
            className="inline-block px-8 py-3 bg-white/95 text-brand-700 rounded-xl hover:bg-white transition font-bold shadow-[0_10px_30px_rgba(255,255,255,0.12)]"
          >
            {t("common.viewAll")}
          </Link>
        </div>
      </section>
    </main>
  );
};


import { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formationsService } from "../services/formationsService";
import { FormationCard } from "../components/Cards/FormationCard";
import { FiSearch, FiArrowRight, FiCheckCircle, FiShield, FiGlobe } from "react-icons/fi";

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
    <main className="relative overflow-hidden sb-page">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-brand-400/25 blur-3xl" />
        <div className="absolute top-10 left-[-160px] h-[480px] w-[480px] rounded-full bg-accent-400/20 blur-3xl" />
        <div className="absolute bottom-[-220px] left-[40%] h-[520px] w-[520px] rounded-full bg-sunset-400/15 blur-3xl" />
      </div>

      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
        <img src="/images/hero-bg.svg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(26,184,153,0.35),transparent_45%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-white sm:px-6 lg:px-8">
          <div className="max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm sm:p-10 lg:p-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <span className="text-lg">🎓</span>
              <span>{t("home.heroBadge")}</span>
            </div>

            <h1 className="mb-4 font-display text-4xl font-extrabold leading-tight md:text-6xl">
              {t("home.heroTitleLine1")}
              <br />
              <span className="text-brand-400">{t("home.heroTitleLine2")}</span>
            </h1>

            <p className="mb-8 max-w-xl text-lg leading-relaxed text-slate-300">
              {t("home.heroSubtitle")}
            </p>

            <div className="mb-8 flex flex-wrap gap-4">
              <Link to="/formations" className="btn-primary inline-flex items-center gap-2">
                {t("home.heroPrimaryCta")} <FiArrowRight />
              </Link>
              <Link to="/register" className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                {t("home.heroSecondaryCta")}
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-slate-300">
              <span className="flex items-center gap-2"><FiCheckCircle className="text-brand-400" /> {t("home.heroTrust1")}</span>
              <span className="flex items-center gap-2"><FiShield className="text-brand-400" /> {t("home.heroTrust2")}</span>
              <span className="flex items-center gap-2"><FiGlobe className="text-brand-400" /> {t("home.heroTrust3")}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-20 -mt-6 mx-4 md:-mt-8 md:mx-16">
        <form
          onSubmit={handleSearch}
          className="rounded-2xl border border-slate-200/70 bg-white/95 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.15)] backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/95"
        >
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <FiSearch className="absolute start-3 top-3 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("home.searchPlaceholder")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 ps-10 pe-4 text-slate-900 outline-none placeholder:text-slate-500 focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <Link to={`/formations?search=${searchTerm}`} className="btn-primary inline-flex items-center justify-center">
              {t("common.search")}
            </Link>
          </div>
        </form>
      </div>

      <section className="relative z-10 mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sb-surface rounded-3xl px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[ 
              { label: "Centres vérifiés", value: "120+", tone: "badge-status-success" },
              { label: "Formations", value: "350+", tone: "badge-status-warning" },
              { label: "Apprenants", value: "10k+", tone: "badge-status-success" },
              { label: "Satisfaction", value: "4.8/5", tone: "badge-status-warning" },
            ].map((stat, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/30 border border-white/50 dark:border-slate-700/50">
                <div className={`flex items-center gap-2 ${idx % 2 === 0 ? 'justify-start' : 'justify-start'} animate-[fadeInUp_0.5s_ease-out_0.05s_both]`}>
                  <span className={stat.tone}>{stat.value}</span>
                </div>
                <p className="mt-2 sb-p text-slate-600 dark:text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending formations */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
        </div>
      ) : (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
            <div>
              <h2 className="sb-h2 text-slate-900 dark:text-white">{t("home.trendingTitle")}</h2>
              <p className="mt-2 sb-p">
                Les formations les plus réservées en ce moment — choisissez votre prochain apprentissage.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="badge-soft">Nouveautés</span>
              <span className="badge-soft">Populaires</span>
              <Link
                to="/formations"
                className="btn-outline inline-flex items-center gap-2 justify-center px-5 py-2 rounded-xl border-brand-200"
              >
                {t("common.viewAll")} <FiArrowRight />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingFormations.map((formation, idx) => (
              <div key={formation.id} className="animate-[fadeInUp_0.55s_ease-out_both]" style={{ animationDelay: `${idx * 60}ms` }}>
                <FormationCard formation={formation} />
              </div>
            ))}
          </div>
        </section>
      )}


      {/* Benefits (asymmetric, designed composition) */}
      <section className="sb-page py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
            {/* Dominant feature */}
            <div className="card p-8 relative overflow-hidden">
              <div className="absolute -top-10 -left-10 h-40 w-40 rounded-3xl bg-brand-400/15 blur-2xl" />
              <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-3xl bg-accent-400/15 blur-2xl" />

              <div className="flex items-center justify-between gap-6 flex-wrap">
                <div>
                  <h2 className="sb-h2 text-slate-900 dark:text-white">Pourquoi choisir SkillBridge?</h2>
                  <p className="mt-3 sb-p text-slate-600 dark:text-slate-300">
                    Une expérience EdTech premium : trouvez, réservez et évoluez — en toute confiance.
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="badge-soft">Centres vérifiés</span>
                  <span className="badge-soft">Certificats</span>
                  <span className="badge-soft">Support</span>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="rounded-2xl border border-slate-200/70 bg-white/70 dark:bg-slate-900/30 p-5">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Catologue</p>
                  <p className="mt-2 font-extrabold text-slate-900 dark:text-slate-100 text-lg">Large Catalogue</p>
                  <p className="mt-2 sb-p text-slate-600 dark:text-slate-300">
                    Des centaines de formations dans divers domaines.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-white/70 dark:bg-slate-900/30 p-5">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Confiance</p>
                  <p className="mt-2 font-extrabold text-slate-900 dark:text-slate-100 text-lg">Centres Vérifiés</p>
                  <p className="mt-2 sb-p text-slate-600 dark:text-slate-300">
                    Tous nos centres sont vérifiés et approuvés.
                  </p>
                </div>

                <div className="sm:col-span-2 rounded-2xl border border-brand-200/80 bg-gradient-to-r from-brand-500/10 to-accent-500/10 p-6">
                  <p className="text-xs uppercase tracking-wide text-brand-700 dark:text-brand-200">Flexibilité</p>
                  <p className="mt-2 font-extrabold text-slate-900 dark:text-slate-100 text-lg">Flexibilité</p>
                  <p className="mt-2 sb-p text-slate-600 dark:text-slate-300">
                    Apprenez à votre rythme avec des parcours adaptables.
                  </p>
                  <div className="mt-4 h-px w-full bg-gradient-to-r from-brand-400/0 via-brand-400/60 to-brand-400/0" />
                </div>
              </div>
            </div>

            {/* Supporting benefits list */}
            <div className="space-y-4">
              {[ 
                { k: "S1", title: "Parcours guidés", desc: "Des étapes claires pour avancer sans perdre de temps." },
                { k: "S2", title: "Expérience fiable", desc: "Une sélection cohérente de formations et de centres." },
                { k: "S3", title: "Impact carrière", desc: "Des certificats pour valoriser vos compétences." },
              ].map((item) => (
                <div key={item.k} className="sb-surface rounded-2xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-brand-500/15 flex items-center justify-center text-brand-700 dark:text-brand-200 font-extrabold">
                      {item.k}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 dark:text-slate-100">{item.title}</p>
                      <p className="mt-2 sb-p text-slate-600 dark:text-slate-300">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Final CTA (premium landing conclusion) */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-700" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.8)_0%,transparent_60%)]" />
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-brand-100/90">Prêt à commencer ?</p>
                <h2 className="sb-h2 text-white mt-2">{t("home.ctaTitle")}</h2>
                <p className="mt-4 sb-p text-brand-50/90 max-w-xl">{t("home.ctaText")}</p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <span className="badge-soft bg-white/10 text-white border border-white/20">Inscription rapide</span>
                  <span className="badge-soft bg-white/10 text-white border border-white/20">Centres vérifiés</span>
                  <span className="badge-soft bg-white/10 text-white border border-white/20">Certificats</span>
                </div>
              </div>

              <div className="sb-surface rounded-3xl p-6 border-white/20 bg-white/10">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-sm font-semibold text-white">Commencez avec un choix sûr</p>
                    <p className="mt-2 sb-p text-white/80">Explorez les formations les plus populaires et trouvez le bon centre.</p>
                  </div>
                  <div className="w-12 h-12 rounded-3xl bg-white/15 flex items-center justify-center">
                    <FiArrowRight size={20} className="text-white" />
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/formations"
                    className="btn-primary inline-flex items-center justify-center px-8 py-3 rounded-xl shadow-[0_10px_30px_rgba(26,184,153,0.35)]"
                  >
                    {t("common.viewAll")}
                  </Link>
                  <Link
                    to="/favoris"
                    className="btn-outline inline-flex items-center justify-center px-8 py-3 rounded-xl border-white/30 text-white hover:bg-white/10"
                  >
                    Voir les favoris
                  </Link>
                </div>

                <div className="mt-6 h-px bg-white/15" />
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[{ v: "4.8/5", l: "Satisfaction" }, { v: "+120", l: "Centres" }].map((s) => (
                    <div key={s.l}>
                      <p className="text-lg font-extrabold text-white">{s.v}</p>
                      <p className="text-xs uppercase tracking-wide text-white/70 mt-1">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};


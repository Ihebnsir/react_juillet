import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { LoginForm } from "../components/Forms/LoginForm";
import { FiArrowLeft } from "react-icons/fi";

export const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    const fallbackPath = user?.role === "centre" ? "/centre" : user?.role === "admin" ? "/admin" : "/dashboard";
    return <Navigate to={fallbackPath} replace />;
  }

  const isRtl = i18n.language === "ar";

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className={`overflow-hidden rounded-[2rem] bg-white/95 shadow-2xl ring-1 ring-slate-900/10 backdrop-blur-sm dark:bg-slate-900/95 ${isRtl ? "text-right" : "text-left"}`}>
          <div className="p-8 sm:p-10 lg:p-12">
            <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-teal-600 text-lg font-bold text-white">SB</div>
                <div>
                  <p className="text-xs uppercase tracking-[0.42em] text-teal-600">SkillBridge</p>
                  <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{t("login.title")}</h1>
                </div>
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-300"
              >
                <FiArrowLeft className="h-4 w-4" />
                {t("login.back")}
              </Link>
            </div>

            <p className="max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">{t("login.subtitle")}</p>
            <div className="mt-10">
              <LoginForm />
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("login.noAccount")}</p>
              <Link
                to="/register"
                className="mt-4 inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500"
              >
                {t("login.createAccount")}
              </Link>
            </div>
          </div>
        </section>

        <aside className="hidden overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-600 via-cyan-600 to-slate-900 p-10 text-white shadow-2xl lg:block">
          <div className="flex h-full flex-col justify-between gap-8">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-2 text-xs uppercase tracking-[0.35em] text-white/80">Premium Learning</span>
              <h2 className="mt-6 text-4xl font-semibold leading-tight">{t("login.heroTitle")}</h2>
              <p className="mt-4 max-w-lg text-base leading-7 text-white/80">{t("login.heroDescription")}</p>
            </div>
            <div className="grid gap-4 text-sm text-white/90">
              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm">
                <p className="text-slate-200/90">{t("login.featureOneTitle")}</p>
                <p className="mt-3 text-3xl font-semibold">{t("login.featureOneValue")}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm">
                <p className="text-slate-200/90">{t("login.featureTwoTitle")}</p>
                <p className="mt-3 text-3xl font-semibold">{t("login.featureTwoValue")}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

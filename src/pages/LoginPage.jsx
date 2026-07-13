import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { LoginForm } from "../components/Forms/LoginForm";
import { FiArrowLeft, FiBookOpen } from "react-icons/fi";

export const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    const fallbackPath = user?.role === "centre" ? "/centre" : user?.role === "admin" ? "/admin" : "/dashboard";
    return <Navigate to={fallbackPath} replace />;
  }

  const isRtl = i18n.language === "ar";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-800 md:flex-row">
        <div className={`flex flex-1 flex-col justify-center p-8 md:p-10 ${isRtl ? "items-end text-right" : "items-start text-left"}`}>
          <Link to="/" className={`mb-6 flex items-center gap-2 text-sm font-medium text-teal-600 transition hover:text-teal-700 ${isRtl ? "self-end" : "self-start"}`}>
            <FiArrowLeft /> {t("login.back")}
          </Link>
          <div className="mb-6 flex items-center gap-3 rounded-full bg-teal-50 px-3 py-2 text-teal-700 dark:bg-slate-700 dark:text-teal-200">
            <FiBookOpen size={20} />
            <span className="font-semibold">SkillBridge</span>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-slate-100">{t("login.title")}</h1>
          <p className="mb-8 text-gray-600 dark:text-slate-300">{t("login.subtitle")}</p>
          <LoginForm />
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-slate-300">
            <span>{t("login.createAccount")}</span>{" "}
            <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-700">
              {t("nav.register")}
            </Link>
          </div>
        </div>
        <div className="hidden flex-1 bg-gradient-to-br from-teal-600 to-cyan-700 p-10 text-white md:flex md:flex-col md:justify-center">
          <h2 className="mb-4 text-2xl font-semibold">{t("home.title")}</h2>
          <p className="max-w-sm text-teal-50">{t("home.subtitle")}</p>
        </div>
      </div>
    </div>
  );
};

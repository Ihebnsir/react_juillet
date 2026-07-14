import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import { ToastMessage } from "../components/UI/ToastMessage";

export const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setToast({ type: "error", message: t("login.emailInvalid") });
      return;
    }

    setSubmitted(true);
    setToast({ type: "success", message: t("login.forgotSent") });
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <ToastMessage type={toast.type} message={toast.message} onClose={() => setToast({ type: "", message: "" })} />
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="overflow-hidden rounded-[2rem] bg-white/95 p-10 shadow-2xl ring-1 ring-slate-900/10 backdrop-blur-sm dark:bg-slate-900/95">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-teal-600">SkillBridge</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{t("login.forgotTitle")}</h1>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">{t("login.forgotDescription")}</p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <FiArrowLeft className="h-4 w-4" />
                {t("login.forgotBackToLogin")}
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition focus-within:border-teal-500 dark:border-slate-700 dark:bg-slate-900">
                <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("login.emailPlaceholder")}
                  aria-label={t("login.email")}
                  className="w-full border-0 bg-transparent pl-14 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:ring-0 dark:text-slate-100"
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-3xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                {t("login.forgotSubmit")}
              </button>
            </form>

            {submitted && (
              <div className="rounded-3xl border border-teal-100 bg-teal-50 p-4 text-sm text-slate-700 dark:border-teal-900/50 dark:bg-slate-800 dark:text-slate-200">
                {t("login.forgotSent")}
              </div>
            )}
          </div>
        </section>

        <aside className="hidden overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-600 via-cyan-600 to-slate-900 p-10 text-white shadow-2xl lg:block">
          <div className="flex h-full flex-col justify-between gap-8">
            <div>
              <h2 className="text-4xl font-semibold leading-tight">Secure your account</h2>
              <p className="mt-4 max-w-lg text-base text-white/80">Use a secure email address to recover access and stay connected with premium courses.</p>
            </div>
            <div className="grid gap-4 text-sm text-white/90">
              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm">
                <p className="text-slate-200/90">Fast recovery</p>
                <p className="mt-3 text-3xl font-semibold">{t("login.featureOneValue")}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm">
                <p className="text-slate-200/90">Account protection</p>
                <p className="mt-3 text-3xl font-semibold">{t("login.featureTwoValue")}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

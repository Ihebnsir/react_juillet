import { Link } from "react-router-dom";
import { RegisterForm } from "../components/Forms/RegisterForm";
import { FiArrowLeft } from "react-icons/fi";

export const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="overflow-hidden rounded-[2rem] bg-white/95 p-8 shadow-2xl ring-1 ring-slate-900/10 backdrop-blur-sm dark:bg-slate-900/95">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-3 rounded-3xl bg-teal-600 px-4 py-3 text-white">
                  <span className="font-bold">SB</span>
                  <span className="text-sm uppercase tracking-[0.35em]">SkillBridge</span>
                </div>
                <h1 className="mt-6 text-3xl font-semibold text-slate-900 dark:text-white">Inscription</h1>
                <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">Créez un compte professionnel pour accéder à SkillBridge.</p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <FiArrowLeft className="h-4 w-4" />
                Se connecter
              </Link>
            </div>

            <RegisterForm />
          </div>
        </section>

        <aside className="hidden overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-600 via-cyan-600 to-slate-900 p-10 text-white shadow-2xl lg:block">
          <div className="flex h-full flex-col justify-between gap-8">
            <div>
              <h2 className="text-4xl font-semibold leading-tight">Rejoignez SkillBridge</h2>
              <p className="mt-4 max-w-lg text-base text-white/80">Accédez à des formations premium, des parcours sur mesure et des outils de développement de carrière.</p>
            </div>
            <div className="grid gap-4 text-sm text-white/90">
              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm">
                <p className="text-slate-200/90">Offres exclusives</p>
                <p className="mt-3 text-3xl font-semibold">Cours recommandés</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm">
                <p className="text-slate-200/90">Suivi personnalisé</p>
                <p className="mt-3 text-3xl font-semibold">Progression claire</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiArrowLeft, FiBriefcase, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { ToastMessage } from "../components/UI/ToastMessage";

export const RegisterPage = () => {
  const [typeCompte, setTypeCompte] = useState(null); // "apprenant" ou "centre"
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onTouched" });

  const [toast, setToast] = useState({ type: "", message: "" });

  const toastMessage = useMemo(() => {
    if (toast.message && toast.type) return toast;
    return toast;
  }, [toast]);

  const onSubmit = async (data) => {
    const nouvelUtilisateur = {
      ...data,
      role: typeCompte,
    };

    if (typeCompte === "centre") {
      nouvelUtilisateur.statutVerification = "non_soumis";
    }

    const result = registerUser(nouvelUtilisateur);
    if (result?.success) {
      if (typeCompte === "apprenant") {
        setToast({ type: "success", message: "Compte créé avec succès, connectez-vous." });
      } else {
        setToast({
          type: "success",
          message: "Compte créé. Rendez-vous dans la section Vérification pour soumettre vos justificatifs.",
        });
      }
      reset();
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="overflow-hidden rounded-[2rem] bg-white/95 p-8 shadow-2xl ring-1 ring-slate-900/10 backdrop-blur-sm dark:bg-slate-900/95">
          <div className="flex flex-col gap-6">
            <ToastMessage
              type={toastMessage.type}
              message={toastMessage.message}
              onClose={() => setToast({ type: "", message: "" })}
            />

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

            {/** STEP 1 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setTypeCompte("apprenant")}
                className={`p-6 rounded-xl border-2 text-left ${
                  typeCompte === "apprenant"
                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <FiUser size={28} className="mb-2 text-teal-600" />
                <p className="font-bold">Je suis apprenant</p>
                <p className="text-sm text-slate-500">Je cherche une formation</p>
              </button>

              <button
                type="button"
                onClick={() => setTypeCompte("centre")}
                className={`p-6 rounded-xl border-2 text-left ${
                  typeCompte === "centre"
                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <FiBriefcase size={28} className="mb-2 text-teal-600" />
                <p className="font-bold">Je suis un centre de formation</p>
                <p className="text-sm text-slate-500">Je propose des formations</p>
              </button>
            </div>

            {/** Rule: if typeCompte is null, do not show any form fields */}
            {typeCompte && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {typeCompte === "apprenant" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom complet</label>
                      <input
                        type="text"
                        {...register("nom", { required: "Nom complet est obligatoire" })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.nom && <p className="text-sm text-red-500 mt-1">{errors.nom.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        {...register("email", { required: "Email est obligatoire" })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Mot de passe</label>
                      <input
                        type="password"
                        {...register("password", { required: "Mot de passe est obligatoire", minLength: { value: 8, message: "Minimum 8 caractères" } })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Date de naissance</label>
                      <input
                        type="date"
                        {...register("dateNaissance", { required: "La date de naissance est obligatoire" })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.dateNaissance && (
                        <p className="text-sm text-red-500">{errors.dateNaissance.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Niveau d'études</label>
                      <select
                        {...register("niveauEtudes", { required: "Niveau d'études est obligatoire" })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value=""> </option>
                        <option value="Collège">Collège</option>
                        <option value="Lycée">Lycée</option>
                        <option value="Baccalauréat">Baccalauréat</option>
                        <option value="Bac+2">Bac+2</option>
                        <option value="Bac+3 et plus">Bac+3 et plus</option>
                        <option value="Autre">Autre</option>
                      </select>
                      {errors.niveauEtudes && <p className="text-sm text-red-500 mt-1">{errors.niveauEtudes.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Ville</label>
                      <input
                        type="text"
                        {...register("ville", { required: "Ville est obligatoire" })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.ville && <p className="text-sm text-red-500 mt-1">{errors.ville.message}</p>}
                    </div>
                  </>
                )}

                {typeCompte === "centre" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom du centre</label>
                      <input
                        type="text"
                        {...register("nom", { required: "Nom du centre est obligatoire" })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.nom && <p className="text-sm text-red-500 mt-1">{errors.nom.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email professionnel</label>
                      <input
                        type="email"
                        {...register("email", { required: "Email professionnel est obligatoire" })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Mot de passe</label>
                      <input
                        type="password"
                        {...register("password", { required: "Mot de passe est obligatoire", minLength: { value: 8, message: "Minimum 8 caractères" } })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Nom et prénom du directeur / responsable légal</label>
                      <input
                        type="text"
                        {...register("nomDirecteur", { required: "Nom du directeur est obligatoire" })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.nomDirecteur && <p className="text-sm text-red-500 mt-1">{errors.nomDirecteur.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Matricule fiscal</label>
                      <input
                        type="text"
                        {...register("matriculeFiscal", { required: "Matricule fiscal est obligatoire", minLength: { value: 6, message: "Minimum 6 caractères" } })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.matriculeFiscal && <p className="text-sm text-red-500 mt-1">{errors.matriculeFiscal.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Numéro RNE (Registre National des Entreprises)</label>
                      <input
                        type="text"
                        {...register("numeroRNE", { required: "Numéro RNE est obligatoire" })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.numeroRNE && <p className="text-sm text-red-500 mt-1">{errors.numeroRNE.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Adresse du siège social</label>
                      <input
                        type="text"
                        {...register("adresseSiege", { required: "Adresse du siège social est obligatoire" })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.adresseSiege && <p className="text-sm text-red-500 mt-1">{errors.adresseSiege.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Ville</label>
                      <input
                        type="text"
                        {...register("ville", { required: "Ville est obligatoire" })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      {errors.ville && <p className="text-sm text-red-500 mt-1">{errors.ville.message}</p>}
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition"
                >
                  S'inscrire
                </button>
              </form>
            )}
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


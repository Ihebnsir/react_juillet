import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiArrowLeft, FiEye, FiEyeOff, FiLoader, FiMail, FiShield } from "react-icons/fi";
import { forgotPassword, resetPassword, verifyResetCode } from "../services/authService";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getApiMessage = (error, fallback) => {
  if (error?.message === "NETWORK_ERROR") return "Le serveur est indisponible. Réessayez dans quelques instants.";
  return error?.details?.[0]?.message || error?.message || fallback;
};

const RecoveryLayout = ({ title, description, children }) => (
  <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="overflow-hidden rounded-[2rem] bg-white/95 p-8 shadow-2xl ring-1 ring-slate-900/10 backdrop-blur-sm dark:bg-slate-900/95 sm:p-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-teal-600">SkillBridge</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{title}</h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>
            </div>
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-600 dark:text-slate-300"><FiArrowLeft className="h-4 w-4" />Se connecter</Link>
          </div>
          {children}
        </div>
      </section>
      <aside className="hidden overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-600 via-cyan-600 to-slate-900 p-10 text-white shadow-2xl lg:block">
        <div className="flex h-full flex-col justify-between gap-8">
          <div><FiShield className="h-10 w-10" /><h2 className="mt-6 text-4xl font-semibold leading-tight">Votre compte reste protégé.</h2><p className="mt-4 max-w-lg text-base leading-7 text-white/80">La vérification par email permet de reprendre l’accès à votre espace SkillBridge en toute sécurité.</p></div>
          <p className="text-sm text-white/70">Le code est valable pendant une durée limitée.</p>
        </div>
      </aside>
    </div>
  </div>
);

const ErrorMessage = ({ message }) => message && <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-200">{message}</p>;

export const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!emailPattern.test(email.trim())) { setError(t("login.emailInvalid")); return; }
    setError(""); setLoading(true);
    try { await forgotPassword(email.trim()); navigate("/verify-reset-code", { state: { email: email.trim() } }); }
    catch (requestError) { setError(getApiMessage(requestError, "Impossible d’envoyer le code. Réessayez.")); }
    finally { setLoading(false); }
  };

  return <RecoveryLayout title="Mot de passe oublié ?" description="Entrez votre adresse email. Si elle existe, un code de vérification vous sera envoyé.">
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <label htmlFor="recovery-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t("login.email")}</label>
      <div className="relative rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition focus-within:border-teal-500 dark:border-slate-700 dark:bg-slate-900"><FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input id="recovery-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t("login.emailPlaceholder")} className="w-full border-0 bg-transparent pl-10 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:ring-0 dark:text-slate-100" autoComplete="email" /></div>
      <ErrorMessage message={error} />
      <button type="submit" disabled={loading} aria-busy={loading} className="inline-flex w-full items-center justify-center rounded-3xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-400">{loading ? <><FiLoader className="mr-2 h-5 w-5 animate-spin" />Envoi en cours...</> : "Envoyer le code"}</button>
    </form>
  </RecoveryLayout>;
};

export const VerifyResetCodePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  if (!email) return <RecoveryLayout title="Code de vérification" description="Votre session de récupération a expiré."><Link to="/forgot-password" className="font-semibold text-teal-600">Demander un nouveau code</Link></RecoveryLayout>;

  const handleVerify = async (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) { setError("Le code doit contenir exactement 6 chiffres."); return; }
    setError(""); setLoading(true);
    try {
      const result = await verifyResetCode(email, code);
      const resetToken = result?.data?.resetToken;
      if (!resetToken) throw new Error("Réponse de vérification invalide");
      navigate("/reset-password", { state: { resetToken } });
    } catch (requestError) { setError(getApiMessage(requestError, "Code invalide ou expiré. Demandez un nouveau code si nécessaire.")); }
    finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (resendCooldown || resending) return;
    setError(""); setFeedback(""); setResending(true);
    try {
      await forgotPassword(email);
      setFeedback("Si cette adresse existe, un nouveau code a été envoyé.");
      setResendCooldown(30);
      const interval = window.setInterval(() => setResendCooldown((value) => { if (value <= 1) { window.clearInterval(interval); return 0; } return value - 1; }), 1000);
    } catch (requestError) { setError(getApiMessage(requestError, "Impossible de renvoyer le code.")); }
    finally { setResending(false); }
  };

  return <RecoveryLayout title="Vérifier le code" description={`Un code à 6 chiffres a été envoyé à ${email}.`}>
    <form onSubmit={handleVerify} className="space-y-6" noValidate>
      <label htmlFor="reset-code" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Code de vérification</label>
      <input id="reset-code" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-4 text-center text-2xl tracking-[0.5em] text-slate-950 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" aria-label="Code de vérification" />
      <ErrorMessage message={error} />
      {feedback && <p role="status" className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700 dark:border-teal-700 dark:bg-teal-900/20 dark:text-teal-200">{feedback}</p>}
      <button type="submit" disabled={loading} aria-busy={loading} className="inline-flex w-full items-center justify-center rounded-3xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-400">{loading ? <><FiLoader className="mr-2 h-5 w-5 animate-spin" />Vérification...</> : "Vérifier le code"}</button>
      <button type="button" onClick={handleResend} disabled={resending || resendCooldown > 0} className="w-full text-sm font-semibold text-teal-600 disabled:cursor-not-allowed disabled:text-slate-400">{resending ? "Renvoi en cours..." : resendCooldown ? `Renvoyer le code (${resendCooldown}s)` : "Renvoyer le code"}</button>
    </form>
  </RecoveryLayout>;
};

export const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resetToken = location.state?.resetToken;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!resetToken) return <RecoveryLayout title="Réinitialiser le mot de passe" description="Votre autorisation de réinitialisation a expiré."><Link to="/forgot-password" className="font-semibold text-teal-600">Recommencer</Link></RecoveryLayout>;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    if (newPassword !== confirmPassword) { setError("Les mots de passe ne correspondent pas."); return; }
    setError(""); setLoading(true);
    try { await resetPassword(resetToken, newPassword, confirmPassword); setSuccess(true); }
    catch (requestError) { setError(getApiMessage(requestError, "Impossible de réinitialiser le mot de passe.")); }
    finally { setLoading(false); }
  };

  if (success) return <RecoveryLayout title="Mot de passe réinitialisé" description="Votre mot de passe a été réinitialisé avec succès."><button type="button" onClick={() => navigate("/login", { replace: true })} className="inline-flex w-full items-center justify-center rounded-3xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700">Se connecter</button></RecoveryLayout>;

  return <RecoveryLayout title="Nouveau mot de passe" description="Choisissez un nouveau mot de passe sécurisé pour votre compte.">
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nouveau mot de passe</label>
      <div className="relative rounded-3xl border border-slate-200 bg-white px-4 py-4 focus-within:border-teal-500 dark:border-slate-700 dark:bg-slate-900"><input id="new-password" type={showPassword ? "text" : "password"} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" className="w-full border-0 bg-transparent pr-10 text-sm text-slate-950 outline-none focus:ring-0 dark:text-white" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <FiEyeOff /> : <FiEye />}</button></div>
      <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirmer le nouveau mot de passe</label>
      <input id="confirm-password" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-950 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
      <p className="text-xs text-slate-500 dark:text-slate-400">Le mot de passe doit contenir au moins 8 caractères.</p>
      <ErrorMessage message={error} />
      <button type="submit" disabled={loading} aria-busy={loading} className="inline-flex w-full items-center justify-center rounded-3xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-400">{loading ? <><FiLoader className="mr-2 h-5 w-5 animate-spin" />Réinitialisation...</> : "Réinitialiser le mot de passe"}</button>
    </form>
  </RecoveryLayout>;
};

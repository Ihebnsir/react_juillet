import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import { FaGoogle, FaGithub, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { ToastMessage } from "../UI/ToastMessage";

export const LoginForm = () => {
  const rememberedEmail = localStorage.getItem("skillbridge_remembered_email") || "";
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      email: rememberedEmail,
      password: "",
      rememberMe: !!rememberedEmail,
    },
  });

  const handleToastClose = () => setToast({ type: "", message: "" });

  const handleSocialLogin = (provider) => {
    setToast({
      type: "success",
      message: t("login.providerSoonAvailable", { provider }),
    });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    handleToastClose();

    if (data.rememberMe) {
      localStorage.setItem("skillbridge_remembered_email", data.email);
    } else {
      localStorage.removeItem("skillbridge_remembered_email");
    }

    const start = Date.now();

    try {
      const user = await login(data.email, data.password);
      const delay = Math.max(0, 2000 - (Date.now() - start));
      await new Promise((resolve) => setTimeout(resolve, delay));
      setToast({ type: "success", message: t("login.successToast") });
      const roleRedirect =
        user.role === "admin"
          ? "/admin"
          : user.role === "centre"
          ? "/centre"
          : "/dashboard";

      setTimeout(() => navigate(roleRedirect, { replace: true }), 700);
    } catch (err) {
      const delay = Math.max(0, 2000 - (Date.now() - start));
      await new Promise((resolve) => setTimeout(resolve, delay));
      const message = t("login.invalidCredentials");
      setError(message);
      setToast({ type: "error", message: t("login.errorToast") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastMessage type={toast.type} message={toast.message} onClose={handleToastClose} />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {error && (
          <div
            className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-200"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: t("login.google"), icon: FaGoogle },
            { label: t("login.github"), icon: FaGithub },
            { label: t("login.facebook"), icon: FaFacebookF },
            { label: t("login.linkedin"), icon: FaLinkedinIn },
          ].map(({ label, icon: Icon }) => (
            <button
              type="button"
              key={label}
              onClick={() => handleSocialLogin(label)}
              className="flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-white"
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          <span>{t("login.orLabel")}</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              {t("login.email")}
            </label>
            <div className="relative rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition focus-within:border-teal-500 dark:border-slate-700 dark:bg-slate-900">
              <FiMail className="absolute top-1/2 -translate-y-1/2 start-4 text-slate-400 pointer-events-none" size={18} />
              <input
                type="email"
                id="email"
                placeholder={t("login.emailPlaceholder")}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email", {
                  required: t("login.emailRequired"),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("login.emailInvalid"),
                  },
                })}
                className="w-full border-0 bg-transparent ps-10 pe-4 py-2.5 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:ring-0 dark:text-slate-100"
              />
            </div>
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              {t("login.password")}
            </label>
            <div className="relative rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition focus-within:border-teal-500 dark:border-slate-700 dark:bg-slate-900">
              <FiLock className="absolute top-1/2 -translate-y-1/2 start-4 text-slate-400 pointer-events-none" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder={t("login.passwordPlaceholder")}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined}
                {...register("password", {
                  required: t("login.passwordRequired"),
                  minLength: {
                    value: 6,
                    message: t("login.passwordMin"),
                  },
                })}
                className="w-full border-0 bg-transparent ps-10 pe-10 py-2.5 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:ring-0 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 end-3 text-slate-400 transition hover:text-slate-600"
                aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
              >
                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4 text-sm text-slate-600 dark:text-slate-300">
              <label className="inline-flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>{t("login.remember")}</span>
              </label>
              <Link to="/forgot-password" className="font-semibold text-teal-600 transition hover:text-teal-700">
                {t("login.forgot")}
              </Link>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative flex w-full items-center justify-center rounded-3xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          aria-busy={loading}
        >
          {loading ? (
            <>
              <FiLoader className="mr-2 h-5 w-5 animate-spin text-white" />
              {t("login.signingIn")}
            </>
          ) : (
            t("login.submit")
          )}
        </button>

        {/* Demo accounts block removed */}
      </form>
    </>
  );
};

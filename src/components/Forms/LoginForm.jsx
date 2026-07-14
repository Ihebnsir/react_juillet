import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import { FaGoogle, FaGithub, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { mockUsers } from "../../data/mockUsers";
import { ToastMessage } from "../UI/ToastMessage";

const passwordStrength = (password) => {
  if (!password) return { level: "weak", score: 0 };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (score <= 1) return { level: "weak", score };
  if (score === 2 || score === 3) return { level: "medium", score };
  return { level: "strong", score };
};

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
    watch,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      email: rememberedEmail,
      password: "",
      rememberMe: !!rememberedEmail,
    },
  });

  const passwordValue = watch("password", "");
  const strength = passwordStrength(passwordValue);
  const strengthBarWidth = passwordValue
    ? strength.level === "weak"
      ? "w-1/3"
      : strength.level === "medium"
      ? "w-2/3"
      : "w-full"
    : "w-0";

  const handleToastClose = () => setToast({ type: "", message: "" });

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
      const result = await login(data.email, data.password);
      const delay = Math.max(0, 2000 - (Date.now() - start));
      await new Promise((resolve) => setTimeout(resolve, delay));
      setToast({ type: "success", message: t("login.successToast") });
      const userRole = result.user?.role;
      let roleRedirect = "/dashboard";
      if (userRole === "admin") roleRedirect = "/admin";
      else if (userRole === "centre") roleRedirect = "/centre";
      else roleRedirect = "/dashboard";

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
          <div className="relative rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition focus-within:border-teal-500 dark:border-slate-700 dark:bg-slate-900">
            <FiMail
              className="absolute top-1/2 -translate-y-1/2 start-4 text-slate-400 pointer-events-none"
              size={18}
            />
            <input
              type="email"
              id="email"
              placeholder=" "
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email", {
                required: t("login.emailRequired"),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("login.emailInvalid"),
                },
              })}
              className="peer w-full border-0 bg-transparent ps-10 pe-4 py-2.5 text-sm text-slate-950 outline-none placeholder:text-transparent focus:ring-0 dark:text-slate-100"
            />
            <label
              htmlFor="email"
              className="pointer-events-none absolute start-14 top-1/2 -translate-y-1/2 text-sm text-slate-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-teal-600"
            >
              {t("login.email")}
            </label>
          </div>
          {errors.email && (
            <p id="email-error" className="text-sm text-red-500">
              {errors.email.message}
            </p>
          )}

          <div className="relative rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition focus-within:border-teal-500 dark:border-slate-700 dark:bg-slate-900">
            <FiLock
              className="absolute top-1/2 -translate-y-1/2 start-4 text-slate-400 pointer-events-none"
              size={18}
            />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder=" "
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "password-error" : "password-strength"}
              {...register("password", {
                required: t("login.passwordRequired"),
                minLength: {
                  value: 8,
                  message: t("login.passwordMin"),
                },
              })}
              className="peer w-full border-0 bg-transparent ps-10 pe-12 py-2.5 text-sm text-slate-950 outline-none placeholder:text-transparent focus:ring-0 dark:text-slate-100"
            />
            <label
              htmlFor="password"
              className="pointer-events-none absolute start-14 top-1/2 -translate-y-1/2 text-sm text-slate-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-teal-600"
            >
              {t("login.password")}
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
              aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
            >
              {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-sm text-red-500">
              {errors.password.message}
            </p>
          )}

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
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-slate-100">{t("login.passwordStrengthLabel")}</p>
              <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className={`h-full rounded-full ${strength.level === "weak" ? "bg-red-500" : strength.level === "medium" ? "bg-amber-400" : "bg-emerald-500"} ${strengthBarWidth}`}
                />
              </div>
              <p id="password-strength" className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {passwordValue ? t(`login.${strength.level}`) : t("login.passwordStrengthLabel")}
              </p>
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

        <div className="rounded-3xl border border-teal-100 bg-teal-50 p-4 text-sm text-slate-700 dark:border-teal-900/50 dark:bg-slate-800 dark:text-slate-200">
          <p className="mb-3 font-semibold text-slate-900 dark:text-slate-100">{t("login.demoTitle")}</p>
          <ul className="space-y-2">
            {mockUsers.map((user) => (
              <li key={user.id} className="rounded-2xl bg-white px-3 py-2 shadow-sm dark:bg-slate-900/90">
                <span className="font-medium text-slate-900 dark:text-slate-100">{user.email}</span>
                <span className="text-slate-500 dark:text-slate-400"> / {user.password}</span>
              </li>
            ))}
          </ul>
        </div>
      </form>
    </>
  );
};

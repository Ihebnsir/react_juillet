import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { mockUsers } from "../../data/mockUsers";

export const LoginForm = () => {
  const { register: registerUser, login } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "apprenant@demo.com",
      password: "123456",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    const result = await login(data.email, data.password);
    if (result.success) {
      const roleRedirect = result.user?.role === "centre" ? "/centre" : result.user?.role === "admin" ? "/admin" : "/dashboard";
      navigate(roleRedirect);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const isRtl = i18n.language === "ar";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-200">
          {t("login.email")}
        </label>
        <div className="relative">
          <FiMail className={`absolute ${isRtl ? "right-3" : "left-3"} top-3 text-gray-400`} />
          <input
            type="email"
            id="email"
            {...register("email", {
              required: t("login.emailRequired"),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t("login.emailInvalid"),
              },
            })}
            className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100`}
            placeholder={t("login.emailPlaceholder")}
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-200">
          {t("login.password")}
        </label>
        <div className="relative">
          <FiLock className={`absolute ${isRtl ? "right-3" : "left-3"} top-3 text-gray-400`} />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            {...register("password", {
              required: t("login.passwordRequired"),
              minLength: {
                value: 6,
                message: t("login.passwordMin"),
              },
            })}
            className={`w-full ${isRtl ? "pr-10 pl-10" : "pl-10 pr-10"} py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100`}
            placeholder={t("login.passwordPlaceholder")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute ${isRtl ? "left-3" : "right-3"} top-3 text-gray-400`}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between gap-2 text-sm text-gray-600 dark:text-slate-300">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded border-gray-300" />
          <span>{t("login.remember")}</span>
        </label>
        <span className="text-teal-600">{t("login.forgot")}</span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-lg bg-teal-600 px-4 py-2 font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {loading ? t("common.loading") : t("login.submit")}
      </button>

      <div className="rounded-lg border border-teal-100 bg-teal-50 p-3 text-sm text-gray-700 dark:border-teal-900/50 dark:bg-slate-800 dark:text-slate-200">
        <p className="mb-2 font-semibold">{t("login.demoTitle")}</p>
        <ul className="space-y-1">
          {mockUsers.map((user) => (
            <li key={user.id}>
              <span className="font-medium">{user.email}</span> / {user.password}
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
};

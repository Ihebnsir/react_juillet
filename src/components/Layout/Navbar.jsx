import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { FiMenu, FiX, FiLogOut, FiBook, FiUser, FiMoon, FiSun, FiGrid } from "react-icons/fi";
import { useState } from "react";

/**
 * Returns the correct dashboard path based on the user's role.
 * @param {object} user - The authenticated user object
 * @returns {string} The dashboard path
 */
const getDashboardPath = (user) => {
  if (!user?.role) return "/";
  switch (user.role) {
    case "admin":
      return "/admin";
    case "centre":
      return "/centre";
    case "apprenant":
    case "learner":
      return "/dashboard";
    default:
      return "/";
  }
};

/**
 * Checks if the current pathname corresponds to the user's dashboard.
 * @param {string} pathname - The current URL path
 * @param {object} user - The authenticated user object
 * @returns {boolean} True if user is on their dashboard
 */
const isOnDashboard = (pathname, user) => {
  if (!user?.role) return false;
  const dashboardPath = getDashboardPath(user);
  // Match exact path or sub-paths (e.g., /admin/users is still in admin dashboard)
  return pathname.startsWith(dashboardPath);
};

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { count: favoriteCount } = useFavorites();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isLearner = user?.role === 'apprenant' || user?.role === 'learner';
  const isCentreUser = user?.role === 'centre';
  const langActive = i18n.language;
  const dashboardPath = isAuthenticated ? getDashboardPath(user) : "/";
  const onDashboard = isOnDashboard(location.pathname, user);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleDashboardClick = () => {
    setIsOpen(false);
    navigate(dashboardPath);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="group flex items-center gap-3"
            onClick={() => setIsOpen(false)}
            aria-label="SkillBridge"
          >
            <div className="relative">
              <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-brand-500/40 to-accent-500/30 blur" />
              <div className="relative rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 p-2.5 font-extrabold text-lg text-white shadow-[0_10px_30px_rgba(26,184,153,0.25)]">
                SB
              </div>
            </div>
            <span className="hidden text-lg font-extrabold tracking-tight text-slate-900 transition group-hover:text-brand-700 dark:text-slate-100 dark:group-hover:text-brand-300 sm:inline">
              SkillBridge
            </span>
          </Link>

          <div className="ml-10 hidden items-center gap-8 md:flex">
            <Link to="/" className="whitespace-nowrap font-medium text-slate-700 transition hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-300">
              {t('nav.home')}
            </Link>
            <Link to="/formations" className="flex items-center gap-2 whitespace-nowrap font-medium text-slate-700 transition hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-300">
              <FiBook size={18} className="text-current" /> {t('nav.formations')}
            </Link>
            <Link to="/centres" className="whitespace-nowrap font-medium text-slate-700 transition hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-300">
              {t('nav.centres')}
            </Link>
            <Link to="/a-propos" className="whitespace-nowrap font-medium text-slate-700 transition hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-300">
              {t('nav.about')}
            </Link>
            <Link to="/temoignages" className="whitespace-nowrap font-medium text-slate-700 transition hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-300">
              {t('nav.testimonials')}
            </Link>
            <Link to="/contact" className="whitespace-nowrap font-medium text-slate-700 transition hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-300">
              {t('nav.contact')}
            </Link>
          </div>

          <div className="ml-8 flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* "Tableau de bord" button - visible on desktop */}
                <Link
                  to={dashboardPath}
                  className={`hidden items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 sm:inline-flex ${
                    onDashboard
                      ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md"
                      : "border border-brand-200 text-brand-700 hover:bg-brand-50 hover:-translate-y-0.5 dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-900/30"
                  }`}
                >
                  <FiGrid size={16} className="text-current" />
                  {t('nav.dashboard')}
                </Link>

                {/* Profile avatar + username — clickable → dashboard */}
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-2 rounded-lg transition hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1"
                  title={t('nav.dashboard')}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.name ?? 'Avatar'} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-gray-700 dark:bg-slate-700 dark:text-slate-200">
                      <FiUser size={16} className="text-current" />
                    </div>
                  )}
                  <span className="hidden text-sm font-medium text-gray-700 dark:text-slate-200 sm:inline">{user?.name}</span>
                </Link>

                {/* Profile link */}
                <Link to="/profil" className="text-gray-700 transition hover:text-teal-600 dark:text-slate-200">
                  <FiUser size={20} className="text-current" />
                </Link>

                {/* Logout */}
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 transition hover:text-red-700">
                  <FiLogOut size={20} className="text-current" />
                  <span className="hidden sm:inline">{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-outline inline-flex items-center justify-center rounded-xl border-brand-200 px-5 py-2 hover:-translate-y-0.5">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn-primary inline-flex items-center justify-center rounded-xl px-5 py-2 hover:-translate-y-0.5">
                  {t('nav.register')}
                </Link>
              </div>
            )}

            <div className="ml-2 flex items-center border-l border-slate-200 pl-3 dark:border-slate-700">
              <select
                value={langActive}
                onChange={(event) => changeLanguage(event.target.value)}
                className="rounded-full border border-gray-300/70 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                aria-label="Sélecteur de langue"
              >
                <option value="fr">🇫🇷 FR</option>
                <option value="en">🇬🇧 EN</option>
                <option value="ar">🇹🇳 AR</option>
              </select>
            </div>

            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full border border-gray-300 p-2 text-gray-700 dark:border-slate-700 dark:text-slate-200">
              {theme === 'dark' ? <FiSun size={18} className="text-current" /> : <FiMoon size={18} className="text-current" />}
            </button>

            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FiX size={24} className="text-current" /> : <FiMenu size={24} className="text-current" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="space-y-3 border-t pt-4 pb-4 md:hidden">
            {/* Dashboard link — always first when authenticated */}
            {isAuthenticated && (
              <Link
                to={dashboardPath}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  onDashboard
                    ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white"
                    : "text-gray-700 hover:text-teal-600 dark:text-slate-200"
                }`}
                onClick={() => setIsOpen(false)}
              >
                <FiGrid size={18} className="text-current" />
                {t('nav.dashboard')}
              </Link>
            )}

            <Link to="/" className="block text-gray-700 transition hover:text-teal-600 dark:text-slate-200" onClick={() => setIsOpen(false)}>{t('nav.home')}</Link>
            <Link to="/formations" className="block text-gray-700 transition hover:text-teal-600 dark:text-slate-200" onClick={() => setIsOpen(false)}>{t('nav.formations')}</Link>
            <Link to="/centres" className="block text-gray-700 transition hover:text-teal-600 dark:text-slate-200" onClick={() => setIsOpen(false)}>{t('nav.centres')}</Link>
            <Link to="/a-propos" className="block text-gray-700 transition hover:text-teal-600 dark:text-slate-200" onClick={() => setIsOpen(false)}>{t('nav.about')}</Link>
            <Link to="/temoignages" className="block text-gray-700 transition hover:text-teal-600 dark:text-slate-200" onClick={() => setIsOpen(false)}>{t('nav.testimonials')}</Link>
            <Link to="/contact" className="block text-gray-700 transition hover:text-teal-600 dark:text-slate-200" onClick={() => setIsOpen(false)}>{t('nav.contact')}</Link>

            {/* Profile, favorites, reservations for authenticated users */}
            {isAuthenticated && (
              <>
                <hr className="border-slate-200 dark:border-slate-700" />
                <Link to="/profil" className="flex items-center gap-2 text-gray-700 transition hover:text-teal-600 dark:text-slate-200" onClick={() => setIsOpen(false)}>
                  <FiUser size={18} /> {t('nav.profile')}
                </Link>
                {isLearner && (
                  <>
                    <Link to="/favoris" className="block text-gray-700 transition hover:text-teal-600 dark:text-slate-200" onClick={() => setIsOpen(false)}>{t('nav.favorites')} ({favoriteCount})</Link>
                    <Link to="/reservations" className="block text-gray-700 transition hover:text-teal-600 dark:text-slate-200" onClick={() => setIsOpen(false)}>{t('nav.reservations')}</Link>
                  </>
                )}
                {isCentreUser && (
                  <Link to="/centre/offres" className="block text-gray-700 transition hover:text-teal-600 dark:text-slate-200" onClick={() => setIsOpen(false)}>Mes offres</Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 transition hover:text-red-700">
                  <FiLogOut size={18} /> {t('nav.logout')}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};


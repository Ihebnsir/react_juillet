import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ReservationProvider } from "./context/ReservationContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Navbar } from "./components/Layout/Navbar";
import { Footer } from "./components/Layout/Footer";
import { ProtectedRoute } from "./components/Layout/ProtectedRoute";
import { CenterProfilePage } from "./pages/CenterProfilePage";
import { ApprenantLayout } from "./layouts/ApprenantLayout";
import { CentreLayout } from "./layouts/CentreLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import "./i18n";

import { SkillBridgePreloader } from "./components/Preloader/SkillBridgePreloader";
import {
  markPreloaderShown,
  shouldShowPreloader,
} from "./components/Preloader/skillBridgePreloaderSingleton";


// Pages
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { FormationsPage } from "./pages/FormationsPage";
import { FormationDetailPage } from "./pages/FormationDetailPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { ReservationsPage } from "./pages/ReservationsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { DashboardPage as ApprenantDashboardPage } from "./pages/apprenant/DashboardPage";
import { MesReservationsPage } from "./pages/apprenant/MesReservationsPage";
import { MesFavorisPage } from "./pages/apprenant/MesFavorisPage";
import { MesCertificationsPage } from "./pages/apprenant/MesCertificationsPage";
import { DashboardPage as CentreDashboardPage } from "./pages/centre/DashboardPage";
import { MesOffresPage } from "./pages/centre/MesOffresPage";
import { NouvelleOffrePage } from "./pages/centre/NouvelleOffrePage";
import { ReservationsRecuesPage } from "./pages/centre/ReservationsRecuesPage";
import { StatutVerificationPage } from "./pages/centre/StatutVerificationPage";
import { DashboardPage as AdminDashboardPage } from "./pages/admin/DashboardPage";
import { ModerationPage } from "./pages/admin/ModerationPage";
import { CentresEnAttentePage } from "./pages/admin/CentresEnAttentePage";
import { UtilisateursPage } from "./pages/admin/UtilisateursPage";
import { LitigesPage } from "./pages/admin/LitigesPage";
import { StatistiquesPage } from "./pages/admin/StatistiquesPage";

function App() {
  const [showPreloader, setShowPreloader] = useState(() => shouldShowPreloader());
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (!showPreloader) return;

    // Requirement: keep visible for ~2 seconds then fade out smoothly.
    const t1 = window.setTimeout(() => {
      setFadingOut(true);
    }, 2000);

    // Match CSS fadeout duration (650ms)
    const t2 = window.setTimeout(() => {
      setShowPreloader(false);
      markPreloaderShown();
    }, 2650);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [showPreloader]);


  return (
    <Router>
      <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <ReservationProvider>
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 transition-colors duration-300">
              {showPreloader && <SkillBridgePreloader fadingOut={fadingOut} />}
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />

                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/formations" element={<FormationsPage />} />
                  <Route path="/formations/:id" element={<FormationDetailPage />} />
                  <Route path="/centres/:id" element={<CenterProfilePage />} />

                  <Route element={<ProtectedRoute allowedRoles={["apprenant"]} />}>
                    <Route element={<ApprenantLayout />}>
                      <Route path="/dashboard" element={<ApprenantDashboardPage />} />
                      <Route path="/reservations" element={<MesReservationsPage />} />
                      <Route path="/favoris" element={<MesFavorisPage />} />
                      <Route path="/certifications" element={<MesCertificationsPage />} />
                    </Route>
                  </Route>

                  <Route element={<ProtectedRoute allowedRoles={["centre"]} />}>
                    <Route element={<CentreLayout />}>
                      <Route path="/centre" element={<CentreDashboardPage />} />
                      <Route path="/centre/offres" element={<MesOffresPage />} />
                      <Route path="/centre/offres/nouvelle" element={<NouvelleOffrePage />} />
                      <Route path="/centre/reservations" element={<ReservationsRecuesPage />} />
                      <Route path="/centre/verification" element={<StatutVerificationPage />} />
                    </Route>
                  </Route>

                  <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route element={<AdminLayout />}>
                      <Route path="/admin" element={<AdminDashboardPage />} />
                      <Route path="/admin/moderation" element={<ModerationPage />} />
                      <Route path="/admin/centres-en-attente" element={<CentresEnAttentePage />} />
                      <Route path="/admin/utilisateurs" element={<UtilisateursPage />} />
                      <Route path="/admin/litiges" element={<LitigesPage />} />
                      <Route path="/admin/statistiques" element={<StatistiquesPage />} />
                    </Route>
                  </Route>

                  <Route
                    path="/profil"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </ReservationProvider>
        </FavoritesProvider>
      </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

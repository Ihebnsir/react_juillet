import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ReservationProvider } from "./context/ReservationContext";
import { Navbar } from "./components/Layout/Navbar";
import { Footer } from "./components/Layout/Footer";
import { ProtectedRoute } from "./components/Layout/ProtectedRoute";

// Pages
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { FormationsPage } from "./pages/FormationsPage";
import { FormationDetailPage } from "./pages/FormationDetailPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { ReservationsPage } from "./pages/ReservationsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminVerificationsPage } from "./pages/AdminVerificationsPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <FavoritesProvider>
          <ReservationProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/formations" element={<FormationsPage />} />
                  <Route path="/formations/:id" element={<FormationDetailPage />} />

                  {/* Learner Routes */}
                  <Route
                    path="/favoris"
                    element={
                      <ProtectedRoute requiredRole="learner">
                        <FavoritesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/reservations"
                    element={
                      <ProtectedRoute requiredRole="learner">
                        <ReservationsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Profile Route (accessible to all authenticated users) */}
                  <Route
                    path="/profil"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/centres-verifies"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminVerificationsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/utilisateurs"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminUsersPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Center Routes (placeholder for future implementation) */}
                  <Route
                    path="/centre/offres"
                    element={
                      <ProtectedRoute requiredRole="center">
                        <div className="min-h-screen bg-gray-50 py-8">
                          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold mb-8">
                              Mes offres de formation
                            </h1>
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                              <p className="text-gray-600 mb-6">
                                Module en développement
                              </p>
                              <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
                                Ajouter une nouvelle offre
                              </button>
                            </div>
                          </div>
                        </div>
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
    </Router>
  );
}

export default App;

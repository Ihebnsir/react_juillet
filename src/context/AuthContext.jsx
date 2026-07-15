import React, { createContext, useState, useContext, useEffect } from "react";
import { getCurrentUser, login as loginService, logout as logoutService, saveUser } from "../services/authService";

const AuthContext = createContext();

const normalizeUser = (user) => {
  if (!user) return null;
  const resolvedName = user.name || user.nom || user.email?.split("@")[0] || "Utilisateur";
  return {
    ...user,
    name: resolvedName,
    nom: user.nom || resolvedName,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => normalizeUser(getCurrentUser()));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = normalizeUser(getCurrentUser());
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const authenticatedUser = normalizeUser(await loginService(email, password));
    // Mettre à jour l'état avant de résoudre pour éviter les redirections désynchronisées
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const register = (formData) => {
    const newUser = normalizeUser({
      id: `user${Date.now()}`,
      name: formData.name,
      nom: formData.name,
      email: formData.email,
      role: formData.role,
      profile: formData.role === "centre"
        ? { description: "", city: "", phone: "", verified: false }
        : { cv: "", portfolio: "", city: "" },
      favorites: [],
      reservations: [],
      avatar: formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
    });
    setUser(newUser);
    saveUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    logoutService();
  };

  const updateProfile = (updatedProfile) => {
    const updated = normalizeUser({ ...user, profile: { ...(user?.profile || {}), ...updatedProfile } });
    if (updatedProfile.avatar !== undefined) {
      updated.avatar = updatedProfile.avatar;
    }
    setUser(updated);
    saveUser(updated);
    return updated;
  };

  const updateUser = (updatedUser) => {
    const normalized = normalizeUser(updatedUser);
    setUser(normalized);
    saveUser(normalized);
    return normalized;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé avec AuthProvider");
  }
  return context;
};

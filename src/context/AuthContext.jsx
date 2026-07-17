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
    console.log('[AuthContext] storedUser:', storedUser);
    setUser(storedUser);
    setIsLoading(false);
  }, []);


  const login = async (email, password) => {
    const authenticatedUser = normalizeUser(await loginService(email, password));
    // Mettre à jour l'état avant de résoudre pour éviter les redirections désynchronisées
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const register = (userData) => {
    // Extends registration payload: preserve every field coming from the form.
    const newUserRaw = {
      id: `user${Date.now()}`,
      ...userData,
      name: userData?.name ?? userData?.nom ?? userData?.email?.split("@")[0] ?? "Utilisateur",
      nom: userData?.nom ?? userData?.name ?? userData?.email?.split("@")[0] ?? "Utilisateur",
      avatar:
        userData.avatar ??
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${(userData?.name ?? userData?.nom ?? "user").toString()}`,
      favorites: [],
      reservations: [],
    };

    // Ensure profile shape exists (only used by the rest of the app later)
    newUserRaw.profile = newUserRaw.profile ??
      (newUserRaw.role === "centre"
        ? { description: "", city: "", phone: "", verified: false }
        : { cv: "", portfolio: "", city: "" });

    // Strict rule: centre accounts start with statutVerification = 'non_soumis'
    if (newUserRaw.role === "centre") {
      newUserRaw.statutVerification = "non_soumis";
    }

    const newUser = normalizeUser(newUserRaw);
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

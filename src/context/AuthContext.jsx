import React, { createContext, useState, useContext, useEffect } from "react";
import { getCurrentUser, login as loginService, logout as logoutService, saveUser } from "../services/authService";
import { mockUsers } from "../data/mockUsers";

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


  const login = async (emailOrParams, password) => {
    if (typeof emailOrParams === "object" && (emailOrParams?.provider || emailOrParams?.viaGoogle)) {
      const { email, nom, avatar, provider = emailOrParams?.viaGoogle ? "google" : undefined } = emailOrParams;
      return loginViaProvider({ email, nom, avatar, provider });
    }

    const authenticatedUser = normalizeUser(await loginService(emailOrParams, password));
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const loginViaProvider = async ({ email, nom, avatar, provider }) => {
    const existingUser = mockUsers.find(
      (candidate) => candidate.email?.trim().toLowerCase() === email?.trim().toLowerCase()
    );

    const userToUse = existingUser
      ? existingUser
      : {
          id: `provider-${Date.now()}`,
          nom: nom || email?.split("@")[0] || "Utilisateur",
          name: nom || email?.split("@")[0] || "Utilisateur",
          email,
          avatar,
          role: "apprenant",
          provider,
          favorites: [],
          reservations: [],
        };

    if (!existingUser) {
      mockUsers.push(userToUse);
    }

    const normalizedUser = normalizeUser(userToUse);
    setUser(normalizedUser);
    saveUser(normalizedUser);
    return normalizedUser;
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
        loginViaProvider,
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

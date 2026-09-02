import React, { createContext, useState, useContext, useEffect } from "react";
import { getCurrentUser, getAuthenticatedUser, login as loginService, logout as logoutService, register as registerService, saveUser, getToken } from "../services/authService";

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
    const restoreSession = async () => {
      if (!getToken()) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        setUser(await getAuthenticatedUser());
      } catch {
        logoutService();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
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
    const userToUse = {
      id: `provider-${Date.now()}`,
      nom: nom || email?.split("@")[0] || "Utilisateur",
      name: nom || email?.split("@")[0] || "Utilisateur",
      email,
      avatar,
      role: "apprenant",
      provider,
    };
    const normalizedUser = normalizeUser(userToUse);
    setUser(normalizedUser);
    saveUser(normalizedUser);
    return normalizedUser;
  };

  const register = async (userData) => {
    const result = await registerService(userData);
    return { success: true, user: result.user };
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

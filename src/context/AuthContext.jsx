import React, { createContext, useState, useContext, useEffect } from "react";
import { getCurrentUser, login as loginService, logout as logoutService, saveUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getCurrentUser();
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const authenticatedUser = await loginService(email, password);
      // Mettre à jour l'état avant de résoudre pour éviter les redirections désynchronisées
      setUser(authenticatedUser);
      return { success: true, user: authenticatedUser };
    } catch (error) {
      return { success: false, error: "Email ou mot de passe incorrect" };
    }
  };

  const register = (formData) => {
    const newUser = {
      id: `user${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      profile: formData.role === "centre"
        ? { description: "", city: "", phone: "", verified: false }
        : { cv: "", portfolio: "", city: "" },
      favorites: [],
      reservations: [],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
    };
    setUser(newUser);
    saveUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    logoutService();
  };

  const updateProfile = (updatedProfile) => {
    const updated = { ...user, profile: { ...user.profile, ...updatedProfile } };
    setUser(updated);
    saveUser(updated);
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

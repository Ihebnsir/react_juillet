import React, { createContext, useState, useContext, useEffect } from "react";
import { MOCK_USERS } from "../data/mockData";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating checking if user is already logged in from localStorage
    const storedUser = localStorage.getItem("skillBridgeUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock authentication - in real app this would call an API
    const foundUser = MOCK_USERS.find((u) => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("skillBridgeUser", JSON.stringify(foundUser));
      return { success: true };
    }
    return { success: false, error: "Email ou mot de passe incorrect" };
  };

  const register = (formData) => {
    // Mock registration
    const newUser = {
      id: `user${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      profile: formData.role === "center" 
        ? { description: "", city: "", phone: "", verified: false }
        : { cv: "", portfolio: "", city: "" },
      favorites: [],
      reservations: [],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
    };
    setUser(newUser);
    localStorage.setItem("skillBridgeUser", JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("skillBridgeUser");
  };

  const updateProfile = (updatedProfile) => {
    const updated = { ...user, profile: { ...user.profile, ...updatedProfile } };
    setUser(updated);
    localStorage.setItem("skillBridgeUser", JSON.stringify(updated));
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

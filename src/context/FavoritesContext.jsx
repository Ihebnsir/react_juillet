import React, { createContext, useState, useContext } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("skillBridgeFavorites");
    return stored ? JSON.parse(stored) : [];
  });

  const addFavorite = (formation) => {
    if (favorites.length >= 3) {
      return {
        success: false,
        error: "Maximum 3 formations dans les favoris",
      };
    }
    if (favorites.find((f) => f.id === formation.id)) {
      return { success: false, error: "Formation déjà dans les favoris" };
    }
    const updated = [...favorites, formation];
    setFavorites(updated);
    localStorage.setItem("skillBridgeFavorites", JSON.stringify(updated));
    return { success: true };
  };

  const removeFavorite = (formationId) => {
    const updated = favorites.filter((f) => f.id !== formationId);
    setFavorites(updated);
    localStorage.setItem("skillBridgeFavorites", JSON.stringify(updated));
  };

  const isFavorite = (formationId) => {
    return favorites.some((f) => f.id === formationId);
  };

  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem("skillBridgeFavorites");
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        clearFavorites,
        count: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites doit être utilisé avec FavoritesProvider");
  }
  return context;
};

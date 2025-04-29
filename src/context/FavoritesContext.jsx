import { createContext, useState } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (dog) => {
    setFavorites(prev => [...prev, dog]);
  };

  const removeFavorite = (dogId) => {
    setFavorites(prev => prev.filter(d => d.id !== dogId));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

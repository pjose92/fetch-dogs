import { createContext, useState } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (dog) => {
    if (!favorites.some((f) => f.id === dog.id)) {
      setFavorites((prev) => [...prev, dog]);
    }
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((dog) => dog.id !== id));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, setFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};


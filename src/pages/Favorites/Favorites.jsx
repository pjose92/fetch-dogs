import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import fetchApi from "../../api/fetchApi";
import { FavoritesContext } from "../../context/FavoritesContext";
import "./Favorites.css";

function Favorites() {
  const { favorites, removeFavorite, setFavorites } = useContext(FavoritesContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [matchedDog, setMatchedDog] = useState(null);

  const handleMatch = async () => {
    try {
      const favoriteIds = favorites.map((dog) => dog.id);
      if (favoriteIds.length === 0) {
        alert("You need to favorite some dogs first!");
        return;
      }

      const res = await fetchApi.post("/dogs/match", favoriteIds);
      const matchedId = res.data.match;

      const dogRes = await fetchApi.post("/dogs", [matchedId]);
      setMatchedDog(dogRes.data[0]);
    } catch (err) {
      console.error("Error finding match:", err);
    }
  };

  const handleClearFavorites = () => {
    const confirmClear = window.confirm("Are you sure you want to clear all favorites?");
    if (confirmClear) {
      setFavorites([]);
    }
  };

  // ESC key closes modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setMatchedDog(null);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", fontSize: "1.5rem" }}>
        You must be logged in to see favorites!
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h2 className="favorites-title">🐾 My Favorite Dogs</h2>

      {/* Favorites Grid */}
      <div className="favorites-grid">
        {favorites.length > 0 ? (
          favorites.map((dog) => (
            <div key={dog.id} className="favorite-card">
              <img src={dog.img} alt={dog.name} className="favorite-image" />
              <div className="favorite-details">
                <h4>{dog.name}</h4>
                <p>Breed: {dog.breed}</p>
                <p>Age: {dog.age}</p>
                <p>Zip: {dog.zip_code}</p>
                <button
                  onClick={() => removeFavorite(dog.id)}
                  className="remove-button">
                  🗑 Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-favorites">
            No favorite dogs yet. Go add some from the Search page!
          </p>
        )}
      </div>

      {/* Match & Clear Buttons */}
      {favorites.length > 0 && (
        <div className="match-button">
          <button onClick={handleMatch}>🐾 Find My Match!</button>
          <button
            onClick={handleClearFavorites}
            className="clear-button"
            style={{ marginLeft: "1rem" }}>
            🗑 Clear Favorites
          </button>
        </div>
      )}

      {/* Match Modal */}
      {matchedDog && (
        <div className="overlay" onClick={() => setMatchedDog(null)}>
          <div
            className="matched-dog-card"
            onClick={(e) => e.stopPropagation()}>
            <h3>🎉 Your Matched Dog!</h3>
            <img src={matchedDog.img} alt={matchedDog.name} />
            <h4>{matchedDog.name}</h4>
            <p>Breed: {matchedDog.breed}</p>
            <p>Age: {matchedDog.age}</p>
            <p>Zip: {matchedDog.zip_code}</p>
            <button
              onClick={() => setMatchedDog(null)}
              className="close-button">
              ✖ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Favorites;

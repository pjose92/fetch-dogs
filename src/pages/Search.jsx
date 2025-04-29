import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import fetchApi from "../api/fetchApi";
import { FavoritesContext } from "../context/FavoritesContext";
import "./Search.css";

function Search() {
  const { favorites, addFavorite, removeFavorite } =
    useContext(FavoritesContext);

  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [searchText, setSearchText] = useState("");
  const [dogIds, setDogIds] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const res = await fetchApi.get("/dogs/breeds");
        setBreeds(res.data);
      } catch (err) {
        console.error("Error fetching breeds:", err);
      }
    };

    fetchBreeds();
  }, []);

  const fetchSearchResults = async (customURL = null) => {
    try {
      let res;
      if (customURL) {
        res = await fetchApi.get(customURL);
      } else {
        const params = {
          sort: `breed:${sortOrder}`,
          breeds: selectedBreed ? [selectedBreed] : undefined,
        };
        res = await fetchApi.get("/dogs/search", { params });
      }

      setDogIds(res.data.resultIds || []);
      setNextPage(res.data.next || null);
      setPrevPage(res.data.prev || null);
    } catch (err) {
      console.error("Error fetching dog search:", err);
    }
  };

  useEffect(() => {
    if (selectedBreed !== null) {
      fetchSearchResults();
    }
  }, [selectedBreed, sortOrder]);

  useEffect(() => {
    const loadDogData = async () => {
      if (dogIds.length === 0) {
        setDogs([]);
        return;
      }

      try {
        const res = await fetchApi.post("/dogs", dogIds.slice(0, 10));
        setDogs(res.data);
      } catch (err) {
        console.error("Error fetching dog details:", err);
      }
    };

    loadDogData();
  }, [dogIds]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchText.trim() === "") {
        setSelectedBreed("");
        return;
      }

      const matched = breeds.find((breed) =>
        breed.toLowerCase().includes(searchText.toLowerCase())
      );

      if (matched) {
        setSelectedBreed(matched);
      } else {
        setSelectedBreed(null);
        setDogs([]);
        setDogIds([]);
        setNextPage(null);
        setPrevPage(null);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchText, breeds]);

  const isFavorited = (dogId) => {
    return favorites.some((fav) => fav.id === dogId);
  };

  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", fontSize: "1.5rem" }}>
        You must be logged in to see pets!
      </div>
    );
  }

  return (
    <div className="search-container">
      <h2 className="search-title">🐶 Find Your New Best Friend</h2>

      {/* Search Controls */}
      <div className="search-controls">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Start typing breed name..."
        />

        <select
          value={selectedBreed || ""}
          onChange={(e) => {
            setSelectedBreed(e.target.value || "");
            setSearchText("");
          }}>
          <option value="">All Breeds</option>
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>

        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
          Sort: {sortOrder.toUpperCase()}
        </button>
      </div>

      {/* Dogs Grid */}
      <div className="dogs-grid">
        {dogs.length > 0 ? (
          dogs.map((dog) => (
            <div key={dog.id} className="dog-card">
              <img src={dog.img} alt={dog.name} className="dog-image" />
              <div className="dog-details">
                <h4>{dog.name}</h4>
                <p>Breed: {dog.breed}</p>
                <p>Age: {dog.age}</p>
                <p>Zip: {dog.zip_code}</p>

                {isFavorited(dog.id) ? (
                  <button
                    onClick={() => removeFavorite(dog.id)}
                    className="remove-favorite-button">
                    ❤️ Favorited (Click to Remove)
                  </button>
                ) : (
                  <button
                    onClick={() => addFavorite(dog)}
                    className="favorite-button">
                    🤍 Add to Favorites
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-dogs">
            No dogs found. Try searching for a different breed!
          </p>
        )}
      </div>

      {/* Pagination Buttons */}
      <div className="pagination-buttons">
        <button
          onClick={() => fetchSearchResults(prevPage)}
          disabled={!prevPage}
          className={prevPage ? "enabled" : "disabled"}>
          ⬅ Prev
        </button>
        <button
          onClick={() => fetchSearchResults(nextPage)}
          disabled={!nextPage}
          className={nextPage ? "enabled" : "disabled"}>
          Next ➡
        </button>
      </div>
    </div>
  );
}

export default Search;

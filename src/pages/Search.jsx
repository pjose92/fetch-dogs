import { useEffect, useState, useContext } from 'react';
import fetchApi from '../api/fetchApi';
import { FavoritesContext } from '../context/FavoritesContext'; 

function Search() {
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);

  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [searchText, setSearchText] = useState('');
  const [dogIds, setDogIds] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch all breeds on first load
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const res = await fetchApi.get('/dogs/breeds');
        setBreeds(res.data);
      } catch (err) {
        console.error('Error fetching breeds:', err);
      }
    };

    fetchBreeds();
  }, []);

  // Fetch dog search results
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
        res = await fetchApi.get('/dogs/search', { params });
      }

      setDogIds(res.data.resultIds || []);
      setNextPage(res.data.next || null);
      setPrevPage(res.data.prev || null);
    } catch (err) {
      console.error('Error fetching dog search:', err);
    }
  };

  // Handle changes to selectedBreed and sortOrder
  useEffect(() => {
    if (selectedBreed !== null) {
      fetchSearchResults();
    }
  }, [selectedBreed, sortOrder]);

  // Fetch dog details based on dog IDs
  useEffect(() => {
    const loadDogData = async () => {
      if (dogIds.length === 0) {
        setDogs([]);
        return;
      }

      try {
        const res = await fetchApi.post('/dogs', dogIds.slice(0, 10));
        setDogs(res.data);
      } catch (err) {
        console.error('Error fetching dog details:', err);
      }
    };

    loadDogData();
  }, [dogIds]);

  // Update selectedBreed automatically as user types (with debounce)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchText.trim() === '') {
        setSelectedBreed('');
        return;
      }

      const matched = breeds.find(breed =>
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

  // Helper to check if dog is favorited
  const isFavorited = (dogId) => {
    return favorites.some(fav => fav.id === dogId);
  };

  return (
    <div>
      <h2>Search for Dogs</h2>

      {/* Search Input */}
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Search Breed:
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Start typing breed name..."
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
      </div>

      {/* Breed Dropdown */}
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Or select breed manually:
          <select
            value={selectedBreed || ''}
            onChange={(e) => {
              setSelectedBreed(e.target.value || '');
              setSearchText('');
            }}
          >
            <option value="">All</option>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Sort Button */}
      <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
        Sort: {sortOrder.toUpperCase()}
      </button>

      {/* Dogs Grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
        {dogs.length > 0 ? (
          dogs.map((dog) => (
            <div
              key={dog.id}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                width: '200px',
                textAlign: 'center',
              }}
            >
              <img
                src={dog.img}
                alt={dog.name}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              />
              <h4>{dog.name}</h4>
              <p>Breed: {dog.breed}</p>
              <p>Age: {dog.age}</p>
              <p>Zip: {dog.zip_code}</p>

              {/* Favorite Button */}
              {isFavorited(dog.id) ? (
                <button onClick={() => removeFavorite(dog.id)} style={{ marginTop: '10px' }}>
                  ❤️ Favorited (Click to Remove)
                </button>
              ) : (
                <button onClick={() => addFavorite(dog)} style={{ marginTop: '10px' }}>
                  🤍 Add to Favorites
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No dogs found. Try searching for a different breed!</p>
        )}
      </div>

      {/* Pagination Buttons */}
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => fetchSearchResults(prevPage)} disabled={!prevPage}>
          ⬅ Prev
        </button>
        <button onClick={() => fetchSearchResults(nextPage)} disabled={!nextPage}>
          Next ➡
        </button>
      </div>
    </div>
  );
}

export default Search;

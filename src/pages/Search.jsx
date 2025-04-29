import { useEffect, useState } from 'react';
import fetchApi from '../api/fetchApi';

function Search() {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [dogIds, setDogIds] = useState([]);
  const [dogs, setDogs] = useState([]);

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

  // Fetch dog IDs (search results)
  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const params = {
          sort: 'breed:asc',
          breeds: selectedBreed ? [selectedBreed] : undefined,
        };

        const res = await fetchApi.get('/dogs/search', { params });
        setDogIds(res.data.resultIds || []);
      } catch (err) {
        console.error('Error fetching dog search:', err);
      }
    };

    fetchDogs();
  }, [selectedBreed]);

  // Fetch dog objects by ID
  useEffect(() => {
    const loadDogData = async () => {
      if (dogIds.length === 0) {
        setDogs([]);
        return;
      }

      try {
        const res = await fetchApi.post('/dogs', dogIds.slice(0, 10)); // limit to 10 for now
        setDogs(res.data);
      } catch (err) {
        console.error('Error fetching dog details:', err);
      }
    };

    loadDogData();
  }, [dogIds]);

  return (
    <div>
      <h2>Search for Dogs</h2>

      <label>
        Filter by Breed:
        <select
          value={selectedBreed}
          onChange={(e) => setSelectedBreed(e.target.value)}
        >
          <option value="">All</option>
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </label>

      <ul>
        {dogs.map((dog) => (
          <li key={dog.id}>
            {dog.name} - {dog.breed}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Search;

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import Login from './pages/Login';
import Search from './pages/Search';
import Favorites from './pages/Favorites';

function App() {
  return (
    <FavoritesProvider>
      <Router>
        {/* Navigation Bar */}
        <nav style={{
          padding: '1rem',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
          <Link to="/search" style={{ textDecoration: 'none', fontWeight: 'bold' }}>Search Dogs</Link>
          <Link to="/favorites" style={{ textDecoration: 'none', fontWeight: 'bold' }}>Favorites</Link>
        </nav>

        {/* Pages */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Router>
    </FavoritesProvider>
  );
}

export default App;

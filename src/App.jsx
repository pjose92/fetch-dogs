import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { useContext } from "react";
import { FavoritesProvider } from "./context/FavoritesContext";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import fetchApi from "./api/fetchApi";
import Login from "./pages/Login";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";

function AppContent() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetchApi.post("/auth/logout");
      setIsAuthenticated(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav
        style={{
          padding: "1rem",
          backgroundColor: "#f0f0f0",
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          marginBottom: "2rem",
        }}>
        {!isAuthenticated && (
          <Link to="/" style={{ textDecoration: "none", fontWeight: "bold" }}>
            Login
          </Link>
        )}

        {isAuthenticated && (
          <>
            <Link
              to="/search"
              style={{ textDecoration: "none", fontWeight: "bold" }}>
              Search Dogs
            </Link>
            <Link
              to="/favorites"
              style={{ textDecoration: "none", fontWeight: "bold" }}>
              Favorites
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "none",
                fontWeight: "bold",
                cursor: "pointer",
                color: "blue",
              }}>
              Logout
            </button>
          </>
        )}
      </nav>

      {/* Pages */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <AppContent />
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;

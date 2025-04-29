import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import fetchApi from "../../api/fetchApi";
import "./Navbar.css";

function Navbar() {
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
    <nav className="navbar">
      {!isAuthenticated && (
        <Link to="/" className="nav-link">
          Login
        </Link>
      )}

      {isAuthenticated && (
        <>
          <Link to="/search" className="nav-link">
            Search Dogs
          </Link>
          <Link to="/favorites" className="nav-link">
            Favorites
          </Link>
          <button onClick={handleLogout} className="nav-button">
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;

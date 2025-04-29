import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    // If not logged in, redirect to login page
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;

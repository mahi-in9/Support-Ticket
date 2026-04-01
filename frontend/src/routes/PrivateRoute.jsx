import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user is admin, redirect to admin dashboard
  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  // Otherwise, allow access
  return children;
};

export default PrivateRoute;
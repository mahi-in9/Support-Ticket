import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../app/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!token) return null;

  const isAdmin = user?.role === "ADMIN";

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link
              to={isAdmin ? "/admin" : "/dashboard"}
              className="text-xl font-bold text-indigo-600"
            >
              AI Support Ticket
            </Link>
            {isAdmin && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                ADMIN
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 text-sm">
              {user?.email} ({user?.role})
            </span>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                All Tickets
              </Link>
            )}
            {!isAdmin && (
              <Link
                to="/create"
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Create Ticket
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
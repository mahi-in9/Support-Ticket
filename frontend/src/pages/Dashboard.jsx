import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyTickets } from "../app/ticketSlice";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import TicketCard from "../components/TicketCard";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tickets, loading, error } = useSelector((state) => state.ticket);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMyTickets());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
              <p className="text-sm text-gray-500 mt-1">
                Welcome, {user?.title}
              </p>
            </div>
            <Link
              to="/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              + Create Ticket
            </Link>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error?.message || "Failed to load tickets"}
            </div>
          )}

          {loading ? (
            <Loader count={5} />
          ) : tickets.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No tickets yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new support ticket.
              </p>
              <div className="mt-6">
                <Link
                  to="/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Create Ticket
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.ticketId} ticket={ticket} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
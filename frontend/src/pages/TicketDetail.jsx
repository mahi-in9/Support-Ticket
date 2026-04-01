import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getTicketById, updateTicketStatus, updateTicketReply } from "../app/ticketSlice";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ticket, loading, error } = useSelector((state) => state.ticket);
  const { user } = useSelector((state) => state.auth);
  const [reply, setReply] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    dispatch(getTicketById(id));
  }, [dispatch, id]);

  // Auto-refresh every 3 seconds while AI is processing
  useEffect(() => {
    let interval;
    if (ticket && !ticket.isAIProcessed) {
      interval = setInterval(() => {
        dispatch(getTicketById(id));
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [ticket?.isAIProcessed, id, dispatch]);

  useEffect(() => {
    if (ticket?.aiReply) {
      setReply(ticket.aiReply);
    }
  }, [ticket]);

  const handleUpdateReply = async () => {
    const result = await dispatch(updateTicketReply({ id, reply }));
    if (updateTicketReply.fulfilled.match(result)) {
      setIsEditing(false);
    }
  };

  const handleMarkResolved = async () => {
    const result = await dispatch(updateTicketStatus({ id, status: "RESOLVED" }));
    if (updateTicketStatus.fulfilled.match(result)) {
      dispatch(getTicketById(id));
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setReply(suggestion);
    setIsEditing(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    return status === "RESOLVED"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  if (loading && !ticket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Loader count={1} />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error?.message || "Failed to load ticket"}
            </div>
            <button
              onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}
              className="mt-4 text-indigo-600 hover:text-indigo-500"
            >
              ← Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <button
            onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}
            className="mb-4 text-indigo-600 hover:text-indigo-500 flex items-center"
          >
            ← Back to Dashboard
          </button>

          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {ticket.name}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {ticket.email}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </span>
                {!ticket.isAIProcessed ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 animate-pulse">
                    Generating suggestions...
                  </span>
                ) : ticket.category ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {ticket.category}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>
            </div>

            {/* Suggested Replies (for Admin) */}
            {isAdmin && ticket.isAIProcessed && ticket.suggestedReplies && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Suggested AI Replies
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {ticket.suggestedReplies.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className={`text-left p-3 rounded-lg border transition-all ${
                        selectedSuggestion === suggestion
                          ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500"
                          : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-sm text-gray-700">
                        {suggestion}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Reply */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                AI Reply {isAdmin && "(Editable)"}
              </h2>
              {!ticket.isAIProcessed ? (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    <span className="text-purple-700">
                      Generating suggestions... (Auto-refreshing)
                    </span>
                  </div>
                </div>
              ) : isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter AI reply..."
                    disabled={!isAdmin}
                  />
                  {isAdmin && (
                    <div className="flex space-x-3">
                      <button
                        onClick={handleUpdateReply}
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {loading ? "Saving..." : "Save Reply"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setReply(ticket.aiReply || "");
                          setSelectedSuggestion(null);
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {ticket.aiReply || "No reply yet"}
                  </p>
                  {isAdmin && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-3 text-indigo-600 hover:text-indigo-500 text-sm"
                    >
                      Edit Reply
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                Created: {formatDate(ticket.createdAt)}
              </p>
              {isAdmin && ticket.status !== "RESOLVED" && (
                <button
                  onClick={handleMarkResolved}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketDetail;
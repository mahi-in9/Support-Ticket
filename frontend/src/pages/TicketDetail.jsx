import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTicketById,
  fetchTicketMessages,
  sendReply,
  updateTicketStatus,
} from "../app/ticketSlice";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ticket, messages, loading, messagesLoading, error } = useSelector(
    (state) => state.ticket
  );
  const { user } = useSelector((state) => state.auth);
  const [reply, setReply] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const messagesEndRef = useRef(null);

  const isAdmin = user?.role === "ADMIN";

  // Fetch ticket and messages
  useEffect(() => {
    dispatch(getTicketById(id));
    dispatch(fetchTicketMessages(id));
  }, [dispatch, id]);

  // Auto-refresh every 3 seconds while AI is processing
  useEffect(() => {
    let interval;
    if (ticket && !ticket.isAIProcessed) {
      interval = setInterval(() => {
        dispatch(getTicketById(id));
        dispatch(fetchTicketMessages(id));
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [ticket?.isAIProcessed, id, dispatch]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update reply when ticket loads
  useEffect(() => {
    if (ticket?.aiReply) {
      setReply(ticket.aiReply);
    }
  }, [ticket]);

  const handleSendReply = async () => {
    if (!reply.trim()) return;

    const result = await dispatch(sendReply({ id, reply }));
    if (sendReply.fulfilled.match(result)) {
      setReply("");
      setIsEditing(false);
      setSelectedSuggestion(null);
      dispatch(fetchTicketMessages(id));
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
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
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

  const getMessageStyle = (sender) => {
    if (sender === "USER") {
      return "bg-indigo-600 text-white ml-auto rounded-br-none";
    } else if (sender === "ADMIN") {
      return "bg-gray-600 text-white mr-auto rounded-bl-none";
    } else if (sender === "AI") {
      return "bg-purple-100 text-purple-800 border border-purple-200";
    }
    return "bg-gray-100 text-gray-800";
  };

  const getMessageAlignment = (sender) => {
    if (sender === "USER") {
      return "justify-end";
    } else if (sender === "ADMIN") {
      return "justify-start";
    } else if (sender === "AI") {
      return "justify-center";
    }
    return "justify-start";
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

  if (error && !ticket) {
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

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {ticket.name}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">{ticket.email}</p>
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
                      Generating...
                    </span>
                  ) : ticket.category ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {ticket.category}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Thread/Messages */}
            <div className="p-6 border-b border-gray-200 bg-gray-50 max-h-96 overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Conversation
              </h2>

              {messagesLoading ? (
                <div className="flex justify-center py-4">
                  <Loader count={1} />
                </div>
              ) : messages.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No messages yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${getMessageAlignment(msg.sender)}`}
                    >
                      <div
                        className={`max-w-md px-4 py-2 rounded-lg ${getMessageStyle(
                          msg.sender
                        )}`}
                      >
                        {msg.sender === "AI" && (
                          <span className="block text-xs font-semibold mb-1 opacity-75">
                            🤖 AI Suggestion
                          </span>
                        )}
                        {msg.sender === "ADMIN" && (
                          <span className="block text-xs font-semibold mb-1 opacity-75">
                            👤 Support Agent
                          </span>
                        )}
                        {msg.sender === "USER" && (
                          <span className="block text-xs font-semibold mb-1 opacity-75">
                            👤 You
                          </span>
                        )}
                        <p className="text-sm">{msg.message}</p>
                        <span className="text-xs opacity-75 mt-1 block">
                          {formatDate(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Suggested Replies (Admin Only) */}
            {isAdmin && ticket.isAIProcessed && ticket.suggestedReplies && (
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Suggested Replies
                </h2>
                <div className="grid grid-cols-1 gap-2">
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

            {/* Reply Section */}
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {isAdmin ? "Reply to Customer" : "Add a Reply"}
              </h2>

              {!ticket.isAIProcessed ? (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    <span className="text-purple-700">
                      AI is generating suggestions... (Auto-refreshing)
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Type your reply..."
                  />

                  <div className="flex justify-between mt-3">
                    <div>
                      {isAdmin && ticket.status !== "RESOLVED" && (
                        <button
                          onClick={handleMarkResolved}
                          disabled={loading}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                        >
                          Mark as Resolved
                        </button>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setReply(ticket.aiReply || "");
                          setIsEditing(false);
                          setSelectedSuggestion(null);
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleSendReply}
                        disabled={loading || !reply.trim()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm"
                      >
                        {loading ? "Sending..." : "Send Reply"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketDetail;
import { Link } from "react-router-dom";

const TicketCard = ({ ticket }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
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

  const getCategoryBadge = (category, isAIProcessed) => {
    if (!isAIProcessed) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          Processing AI...
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {category}
      </span>
    );
  };

  return (
    <Link
      to={`/tickets/${ticket.ticketId}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-900 truncate flex-1 mr-4">
          {ticket.description?.substring(0, 50)}
          {ticket.description?.length > 50 ? "..." : ""}
        </p>
        {getCategoryBadge(ticket.category, ticket.isAIProcessed)}
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {ticket.description}
      </p>

      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            ticket.status
          )}`}
        >
          {ticket.status}
        </span>
        <span className="text-gray-500 text-xs">
          {formatDate(ticket.createdAt)}
        </span>
      </div>
    </Link>
  );
};

export default TicketCard;

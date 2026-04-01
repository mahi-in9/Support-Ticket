import { Link } from "react-router-dom";

const TicketCard = ({ ticket, isAdmin = false }) => {
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
          Processing...
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {category}
      </span>
    );
  };

  // For admin, show full description. For user, truncate.
  const description = isAdmin 
    ? ticket.description 
    : ticket.description?.substring(0, 80) + (ticket.description?.length > 80 ? "..." : "");

  return (
    <Link
      to={`/tickets/${ticket.ticketId}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
    >
      <div className="flex items-center justify-between mb-3">
        {isAdmin && ticket.name && (
          <p className="text-sm font-semibold text-gray-900">
            {ticket.name}
          </p>
        )}
        {getCategoryBadge(ticket.category, ticket.isAIProcessed)}
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {description}
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

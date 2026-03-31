import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getTicketById,
  updateTicketStatus,
  updateTicketReply,
} from "../app/ticketSlice";
import { useParams } from "react-router-dom";

function TicketDetails() {
  const { ticket, loading, error } = useSelector((state) => state.ticket);
  const [status, setStatus] = useState("");
  const [reply, setReply] = useState("");
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getTicketById(id));
  }, [dispatch, id]);

  const handleStatus = (e) => {
    e.preventDefault();
    dispatch(updateTicketStatus({ id, status: status }));
  };

  const handleReply = (e) => {
    e.preventDefault();
    dispatch(updateTicketReply({ id, reply: reply }));
    setReply("");
  };

  console.log(ticket);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error?.message}</p>;
  return (
    <div className="m-3">
      <h2 className="text-center font-semibold text-2xl">Ticket Details</h2>

      <div className="rounded shadow-2xl w-fit p-7 m-4">
        {ticket ? (
          <>
            <div className="flex flex-row-reverse">
              <p className="opacity-50 text-shadow-2xs">{ticket.status}</p>
            </div>
            <h2>Name: {ticket.name}</h2>
            <h4>Email: {ticket.email}</h4>
            <p>Category: {ticket.category}</p>
            <p>Description: {ticket.description}</p>
            <p>Reply: {ticket.aiReply}</p>
            <div className="flex flex-col gap-3 justify-center mt-5 cursor-pointer">
              <form>
                <select
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="OPEN">Open</option>
                  <option value="PENDING">Pending</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
                <button
                  className="py-1 px-2 bg-blue-400 rounded cursor-pointer text-white font-semibold"
                  type="submit"
                  onClick={handleStatus}
                >
                  Change Status
                </button>
              </form>
              <form className="flex flex-col">
                <div>
                  <label className="flex flex-row">Reply:</label>
                  <textarea
                    type="text"
                    name="reply"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    cols="15"
                    rows="5"
                    className="w-5xl p-3 border rounded ml-12"
                  ></textarea>
                </div>
                <button
                  className="py-1 px-2 bg-blue-400 rounded cursor-pointer text-white font-semibold w-fit"
                  type="submit"
                  onClick={handleReply}
                >
                  Change Reply
                </button>
              </form>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default TicketDetails;

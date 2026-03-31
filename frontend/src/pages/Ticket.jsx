import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTickets } from "../app/ticketSlice";
import { useNavigate } from "react-router-dom";

function Ticket() {
  const { tickets, loading, error } = useSelector((state) => state.ticket);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  console.log(tickets);
  const hanldeClick = (tktId) => {
    const id = tktId.split("_")[1];
    navigate(`/tickets/${id}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="m-3  ">
      <h2 className="text-2xl font-semibold text-center">Tickets</h2>

      <div className="w-1/2">
        {tickets.map((t) => (
          <div
            key={t.ticketId}
            className="border m-3 px-3 py-2 rounded cursor-pointer "
            onClick={() => hanldeClick(t.ticketId)}
          >
            <div className="flex flex-row-reverse">
              <p className="text-end border flex px-1 bg-gray-300 font-semibold opacity-50 text-[10px] rounded ">{t.status}</p>
            </div>
            <p className="font-semibold">{t.category}</p>
            <p className="text-end opacity-50 text-sm">
              {t.createdAt.split("T")[0]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Ticket;

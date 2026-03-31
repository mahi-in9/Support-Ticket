import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTicket } from "../app/ticketSlice";

function TicketForm() {
  const { loading, error } = useSelector((state) => state.ticket);
  const [ticketData, setTicketData] = useState({
    name: "",
    email: "",
    description: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTicketData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(createTicket(ticketData));

    setTicketData({
      name: "",
      email: "",
      description: "",
    });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="m-3">
      <h2 className="m-3 text-2xl font-bold">Tickets</h2>
      <form
        className="flex flex-3 flex-col gap-2  w-fit p-3  shadow-2xl"
        onSubmit={handleSubmit}
      >
        <div className="flex">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            className="border mx-2 rounded hover:shadow-gray-400 hover:shadow-xl p-2"
            value={ticketData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            className="border mx-2 rounded hover:shadow-gray-400 hover:shadow-xl p-2"
            value={ticketData.email}
            onChange={handleChange}
          />
        </div>
        <div className="flex">
          <label>Descripton</label>
          <textarea
            name="description"
            value={ticketData.description}
            cols="100"
            rows="8"
            className="border mx-2 p-5 rounded hover:shadow-gray-400 hover:shadow-xl duration-300"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="">
          <button
            className=" border rounded py-2 px-3 cursor-pointer items-center  bg-blue-400 hover:scale-105 duration-150 hover:bg-blue-500 text-white font-semibold"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default TicketForm;

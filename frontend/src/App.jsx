import { Routes, Route } from "react-router-dom";

import "./App.css";
import TicketDetails from "./pages/TicketDetails";
import Ticket from "./pages/Ticket";
import TicketForm from "./pages/TicketForm";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tickets/" element={<Ticket />} />
        <Route path="/tickets/new" element={<TicketForm />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
      </Routes>
    </>
  );
}

export default App;

import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen m-3 flex items-center justify-center  ">
      <h2 className="text-2xl font-semibold">Go to ticket page</h2>
      <Link to={"/tickets"} className="mt-1 mx-2 p-1 rounded bg-blue-200 text-shadow-2xs">
        Ticket
      </Link>
    </div>
  );
}
export default Home;

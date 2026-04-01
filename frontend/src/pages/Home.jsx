import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen m-3 flex flex-row items-center justify-center  ">
      <h2 className="text-2xl font-semibold">Go to ticket page</h2>
      <Link
        to={"/tickets"}
        className="mt-1 mx-2 p-1 rounded bg-blue-200 text-shadow-2xs"
      >
        Ticket
      </Link>

      <div className="flex justify-center m-3">
        <Link
          to={"/admin"}
          className="bg-[#ffc2c2] px-2 py-1 rounded font-semibold shadow-sm hover:bg-[#ff4646] active:bg-[#d14d4d] hover:scale-105 hover: duration-150 hover:shadow-md "
        >
          Admin Panel
        </Link>
      </div>
    </div>
  );
}
export default Home;

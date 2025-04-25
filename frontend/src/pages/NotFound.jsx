import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-blue-300">
      <div className="bg-blue-400 px-8 py-8 flex flex-col items-center justify-center gap-4">
        <p className="text-xl">Ruta nije pronadjena</p>
        <p className="text-4xl text-red-700">404</p>
        <Link to="/" className="hover:text-gray-800 border-1 p-2">
          Pocetna
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

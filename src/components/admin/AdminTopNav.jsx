import { Link } from "react-router-dom";

export default function AdminTopNav() {
  return (
    <header className="flex justify-between items-center px-8 py-4 bg-gray-800 shadow-md fixed w-full z-50">
        <Link to="/" className="text-white text-2xl font-bold">
          Admin TimeBank
        </Link>
      </header>
  );
}
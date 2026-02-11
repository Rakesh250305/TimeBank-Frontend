import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false)
    const handlelogout = () => {
        sessionStorage.removeItem("adminToken");
        navigate("/admin/login");
    };
    return (
        <nav className="flex justify-between items-center px-8 py-4 bg-gray-800 shadow-md fixed w-full z-50">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold text-blue-500 hover:drop-shadow-md "
      >
        TimeBank Admin
      </Link>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-6 text-white font-medium">
        <li className="hover:text-blue-500">
          <Link to="/">Home</Link>
        </li>
        <li className="hover:text-blue-500">
          <Link to="/">Users</Link>
        </li>
        <li className="hover:text-blue-500">
          <Link to="/">Services</Link>
        </li>
        <li className="hover:text-blue-500">
          <Link to="/">Transactions</Link>
        </li>
        <li className="hover:text-blue-500">
          <Link to="/">Contacts</Link>
        </li>
        <li className="hover:text-blue-500">
          <Link to="/">Reports</Link>
        </li>
      </ul>

      {/* Desktop Right Side */}
      <div className="hidden md:flex gap-4 items-center">

        <button
          onClick={() => handlelogout()}
          className="px-4 py-2 border font-extrabold border-red-500 text-red-500 rounded hover:bg-red-600 hover:text-white transition"
        >
          Logout
        </button>
      </div>

      {/* Hamburger Button */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 relative group"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span
          className={`block w-6 h-0.5 bg-gray-700 my-1 transition-all ${
            menuOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-gray-700 my-1 transition-all ${
            menuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-gray-700 my-1 transition-all ${
            menuOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full right-0 w-full bg-white shadow-lg rounded-lg flex flex-col items-center p-4 md:hidden z-50 transition">
          <Link
            to="/profile"
            className="py-2 px-3 hover:bg-gray-100 rounded"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/service"
            className="py-2 px-3 hover:bg-gray-100 rounded"
            onClick={() => setMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            to="/transactions"
            className="py-2 px-3 hover:bg-gray-100 rounded"
            onClick={() => setMenuOpen(false)}
          >
            Transactions
          </Link>
          <Link
            to="/account"
            className="py-2 px-3 hover:bg-gray-100 rounded"
            onClick={() => setMenuOpen(false)}
          >
            Account
          </Link>
          

        
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition"
        >
          Logout
        </button>
        </div>
      )}
    </nav>
    )
}

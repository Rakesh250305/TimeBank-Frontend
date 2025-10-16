import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
const socket = io("http://localhost:5000");

export default function Navbar({ token }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [wallet, setWallet] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchUnread = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        "http://localhost:5000/api/notifications/unread/count",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error("Error fetching unread notifications:", err);
    }
  };

  const fetchWallet = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWallet(res.data.data.wallet);
    } catch (err) {
      console.error("Error fetching wallet:", err);
    }
  };

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    if (!token) return;

    const decoded = parseJwt(token);
    if (!decoded) return;

    const userId = decoded.id || decoded._id;
    socket.emit("join", userId);

    fetchUnread();
    fetchWallet();

    socket.on("notification", () => {
      fetchUnread();
    });

    return () => {
      socket.off("notification");
    };
  }, [token]);

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md fixed w-full z-50">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold text-blue-600 hover:drop-shadow-md hover:drop-shadow-blue-500 "
      >
        TimeBank
      </Link>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
        <li className="hover:text-blue-600 hover:underline underline-offset-2">
          <Link to="/profile">Home</Link>
        </li>
        <li className="hover:text-blue-600 hover:underline underline-offset-2">
          <Link to="/service">Services</Link>
        </li>
        <li className="hover:text-blue-600 hover:underline underline-offset-2">
          <Link to="/transactions">Transactions</Link>
        </li>
        <li className="hover:text-blue-600 hover:underline underline-offset-2">
          <Link to="/account">Account</Link>
        </li>
      </ul>

      {/* Desktop Right Side */}
      <div className="hidden md:flex gap-4 items-center">
        {wallet !== null && (
          <span className="font-semibold text-green-600">💰 {wallet} credits</span>
        )}
        <Link
          to="/notifications"
          className="relative hover:shadow-lg p-1 rounded-xl hover:bg-gray-200 transition"
        >
          <span className="text-2xl">🔔</span>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
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
          <Link
            to="/notifications"
            className="py-2 px-3 hover:bg-gray-100 rounded"
            onClick={() => setMenuOpen(false)}
          >
            Notification
          </Link>

        {wallet !== null && (
          <span className="font-semibold text-green-600 mt-2 mb-5">💰 {wallet} credits</span>
        )}
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
  );
}

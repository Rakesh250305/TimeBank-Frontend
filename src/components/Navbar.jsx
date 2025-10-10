import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
const socket = io("http://localhost:5000");

export default function Navbar({ token }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [wallet, setWallet] = useState(null);

  const fetchUnread = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/notifications/unread/count", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

 // Add this helper function somewhere in your file
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

  const userId = decoded.id || decoded._id; // depends on your JWT payload
  socket.emit("join", userId);

  // Fetch unread notifications and wallet immediately on load
  fetchUnread();
  fetchWallet();

  // Listen for real-time notifications
  socket.on("notification", () => {
    fetchUnread(); // update unread count
  });

  // Cleanup on unmount
  return () => {
    socket.off("notification");
  };
}, [token]);


  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md fixed w-full z-50">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600 hover:drop-shadow-md hover:drop-shadow-blue-500 ">
        TimeBank
      </Link>

      {/* Links */}
      <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
        <li className="hover:text-blue-600 hover:underline underline-offset-2"><Link to="/profile">Home</Link></li>
        <li className="hover:text-blue-600 hover:underline underline-offset-2"><Link to="/service">Services</Link></li>
        <li className="hover:text-blue-600 hover:underline underline-offset-2"><Link to="/transactions">Transactions</Link></li>
        <li className="hover:text-blue-600 hover:underline underline-offset-2"><Link to="/account">Account</Link></li>
      </ul>

      {/* Right Side */}
      <div className="flex gap-4 items-center">
        {/* 💰 Wallet */}
        {wallet !== null && (
          <span className="font-semibold text-green-600">
            💰 {wallet} credits
          </span>
        )}
        {/* 🔔 Notifications */}
        <Link to="/notifications" className="relative hover:shadow-lg p-1 rounded-xl hover:bg-gray-200 transition">
          <span className="text-2xl">🔔</span>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Auth Buttons */}
        {!token ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Signup
            </Link>
          </>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

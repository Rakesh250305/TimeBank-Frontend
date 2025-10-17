import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

// const API_URL = "http://localhost:5000/api/notifications";
const API_URL = "https://timebank-backend-67l5.onrender.com/api/notifications";

export default function Notifications({ token }) {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // ✅ Mark all as read once opened
    const markAllRead = async () => {
      try {
        await axios.put(
          `${API_URL}/mark-all-read`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (err) {
        console.error("Error marking all notifications as read:", err);
      }
    };

    markAllRead();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar token={token} />
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl text-blue-600 font-bold mt-20 mb-4">
          Notifications
        </h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications yet.</p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li
                key={n._id}
                className={`flex justify-between items-center p-4 border rounded-lg shadow-sm transition cursor-pointer ${
                  n.read ? "bg-white" : "bg-yellow-50"
                }`}
                                  onClick={() => {
                    // Redirect to same host + the link
                    window.location.href = `${window.location.origin}${n.link}`;
                  }}
              >
                <div>
                  <p className="text-gray-800 font-medium">{n.message}</p>
                </div>

                
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

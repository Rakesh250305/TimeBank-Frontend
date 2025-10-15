import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/notifications";

export default function Notifications({ token }) {
  const [notifications, setNotifications] = useState([]);
  const Navigate = useNavigate();

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
      await axios.put(`${API_URL}/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      <h2 className="text-2xl text-blue-600 font-bold mt-20 mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-grey-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`p-3 border rounded ${
                n.read ? "bg-gray-100" : "bg-yellow-100"
              }`}
            >
              {n.message}
            </li>
            
          ))}
        </ul>
      )}
    </div>
   </div>
  );
}

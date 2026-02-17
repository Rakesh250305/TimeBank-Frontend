import { useEffect, useState } from "react";
import axios from "axios";
import { showCustomToast } from "../../utils/toast";
import { Send, Coins, Megaphone, Clock } from "lucide-react";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function BroadcastNotification() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [credits, setCredits] = useState("");
  const [history, setHistory] = useState([]);

  const token = sessionStorage.getItem("adminToken");

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/getBroadcast`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const sendBroadcast = async () => {
    if (!message.trim())
      return showCustomToast(
        "error",
        "Message required",
        "You must write an announcement."
      );

    setLoading(true);
    try {
      await axios.post(
        `${apiUrl}/api/admin/sendBroadcast`,
        { message, credits },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showCustomToast(
        "success",
        "Broadcast Delivered ",
        "All users received the announcement."
      );

      setMessage("");
      setCredits("");
      fetchHistory();
    } catch (err) {
      showCustomToast("error", "Broadcast failed", "Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 pb-10 bg-slate-100 min-h-screen">

      {/* HEADER */}
      <div className="bg-white px-8 py-4 shadow-sm sticky top-0 flex gap-2 items-center mb-6">
        <Megaphone className="text-indigo-600" size={24} />

                  <h1 className="text-2xl font-bold flex items-center gap-2">
                      Platform Broadcast Center
                  </h1>
      
                     
                    
              </div>

      {/* ANNOUNCEMENT PANEL */}
      <div className="bg-white rounded-2xl shadow-xl p-6 m-6 mb-10 ">

        <h2 className="font-semibold text-lg mb-3">Create Announcement</h2>

        <textarea
          rows="5"
          maxLength={300}
          placeholder="Write a platform-wide announcement to all users..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />

        <div className="flex justify-between text-sm mt-1 text-gray-500">
          <span>{message.length}/300 characters</span>
        </div>

        {/* CREDIT BOX */}
        <div className="mt-5 flex items-center gap-3">
          <Coins className="text-yellow-500" />
          <input
            type="number"
            placeholder="Reward Credits (optional)"
            className="border rounded-lg p-2 w-52 focus:ring-2 focus:ring-indigo-400 outline-none"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
          />
        </div>

        {/* PREVIEW */}
        {(message || credits) && (
          <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <p className="font-medium text-indigo-700 mb-1">Preview</p>
            <p className="text-gray-800">
              {message}
            </p>
          </div>
        )}

        <button
          disabled={loading}
          onClick={sendBroadcast}
          className={`mt-6 flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition 
          ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          <Send size={18} />
          {loading ? "Sending..." : "Send Broadcast"}
        </button>
      </div>

      {/* HISTORY SECTION */}
      <div className="bg-white rounded-2xl shadow-xl m-6">

        <div className="flex items-center gap-2 p-5 border-b">
          <Clock className="text-gray-600" />
          <h2 className="text-xl font-semibold">Broadcast History</h2>
        </div>

        {history.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No broadcasts sent yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-gray-700">
                <tr>
                  <th className="p-4 text-left">Message</th>
                  <th className="p-4">Credits</th>
                  <th className="p-4">Users</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {history.map((b) => (
                  <tr key={b._id} className="border-t hover:bg-slate-50">
                    <td className="p-4 max-w-xl">{b.message}</td>

                    <td className="p-4 text-center font-semibold text-green-600">
                      {b.creditsAdded > 0 ? `${b.creditsAdded} credits` : "—"}
                    </td>

                    <td className="p-4 text-center">{b.totalUsers}</td>

                    <td className="p-4 text-center text-gray-500">
                      {new Date(b.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display&display=swap');`;

const getNotifMeta = (message = "") => {
  const m = message.toLowerCase();
  if (m.includes("accepted") || m.includes("approved") || m.includes("completed"))
    return { icon: "✅", bg: "bg-emerald-50", border: "border-emerald-100", dot: "bg-emerald-400" };
  if (m.includes("rejected") || m.includes("declined") || m.includes("cancel"))
    return { icon: "❌", bg: "bg-red-50", border: "border-red-100", dot: "bg-red-400" };
  if (m.includes("new") || m.includes("request") || m.includes("applied"))
    return { icon: "📋", bg: "bg-blue-50", border: "border-blue-100", dot: "bg-blue-400" };
  if (m.includes("credit") || m.includes("payment") || m.includes("wallet"))
    return { icon: "💰", bg: "bg-amber-50", border: "border-amber-100", dot: "bg-amber-400" };
  if (m.includes("review") || m.includes("rating"))
    return { icon: "⭐", bg: "bg-yellow-50", border: "border-yellow-100", dot: "bg-yellow-400" };
  return { icon: "🔔", bg: "bg-slate-50", border: "border-slate-100", dot: "bg-slate-400" };
};

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {month:"short", day:"numeric"});
};

export default function Notifications({ token }) {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/notifications`, { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(res.data);
    } catch (err) { console.error("Error fetching notifications:", err); }
  };

  useEffect(() => {
    fetchNotifications();
    const markAllRead = async () => {
      try {
        await axios.put(`${apiUrl}/api/notifications/mark-all-read`, {}, { headers: { Authorization: `Bearer ${token}` } });
      } catch (err) { console.error("Error marking notifications as read:", err); }
    };
    markAllRead();
  }, []);

  const unread = notifications.filter(n => !n.read);
  const filtered = filter === "unread" ? unread : notifications;

  return (
    <div className="min-h-screen bg-slate-50" style={{fontFamily:"'DM Sans', sans-serif"}}>
      <style>{FONTS}{`
        .card{background:white;border-radius:20px;box-shadow:0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)}
        .section-header{font-family:'DM Serif Display',serif}
        .notif-item{transition:all 0.2s;cursor:pointer}
        .notif-item:hover{transform:translateX(4px)}
        .filter-tab{padding:6px 16px;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.15s}
        .filter-tab.active{background:#3b82f6;color:white}
        .filter-tab.inactive{background:white;color:#64748b;border:1.5px solid #e2e8f0}
        .filter-tab.inactive:hover{border-color:#94a3b8}
      `}</style>

      <Navbar token={token} />

      <div className="max-w-2xl max-w-7xl mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 section-header">Notifications</h1>
            <p className="text-sm text-slate-500 mt-1">
              {unread.length > 0 ? `${unread.length} unread` : "All caught up"}
            </p>
          </div>
          <div className="flex gap-2">
            {["all", "unread"].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`filter-tab ${filter === f ? "active" : "inactive"}`}>
                {f === "all" ? `All (${notifications.length})` : `Unread (${unread.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Notification List */}
        {filtered.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="text-5xl mb-4">🔔</div>
            <p className="text-slate-600 font-medium">No notifications yet</p>
            <p className="text-sm text-slate-400 mt-1">We'll let you know when something happens</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((n, idx) => {
              const meta = getNotifMeta(n.message);
              return (
                <div
                  key={n._id}
                  className={`notif-item card p-0 overflow-hidden border ${n.read ? "border-transparent" : meta.border}`}
                  onClick={() => { window.location.href = `${window.location.origin}${n.link}`; }}
                >
                  <div className={`flex items-start gap-4 p-4 ${!n.read ? meta.bg : ""}`}>
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${!n.read ? "bg-white shadow-sm" : "bg-slate-100"}`}>
                      {meta.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-relaxed ${n.read ? "text-slate-600" : "text-slate-800 font-medium"}`}>
                        {n.message}
                      </p>
                      {n.createdAt && (
                        <p className="text-xs text-slate-400 mt-1">{timeAgo(n.createdAt)}</p>
                      )}
                    </div>

                    {/* Unread dot + arrow */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!n.read && <span className={`w-2 h-2 rounded-full ${meta.dot}`}></span>}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
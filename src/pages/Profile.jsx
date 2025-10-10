import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import defaultavatar from "../assets/default-profile.webp";
import io from "socket.io-client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const socket = io("http://localhost:5000");

export default function Profile({ token }) {
  const [user, setUser] = useState(null);
  const [welcome, setWelcome] = useState(false);
  const [appliedServices, setAppliedServices] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch user profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = {
        ...res.data.data,
        profilePhoto: res.data.data.profilePhoto
          ? `${res.data.data.profilePhoto}`
          : null,
      };

      setUser({
        ...userData,
        requestedServices: res.data.requestedServices || [],
      });

      // after profile is fetched, also fetch applied services
      fetchAppliedServices(res.data._id);
    } catch (err) {
      console.error("Fetch profile error:", err);
    }
  };

  // ✅ Fetch services I applied for
  const fetchAppliedServices = async (userId) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/services/applied",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // filter services where I am the requester
      const myApplied = res.data.filter(
        (srv) => srv.requestedBy?._id === userId
      );

      setAppliedServices(myApplied);
    } catch (err) {
      console.error("Fetch applied services error:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

    // ✅ Show congratulations popup if user just signed up
  useEffect(() => {
    console.log("FirstLogin:", localStorage.getItem("firstLogin")); 
    if (localStorage.getItem("firstLogin")) {
      setWelcome(true);
      localStorage.removeItem("firstLogin");

      setWelcome(false);
    }
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", user._id);

    socket.on("notification", (notif) => {
      setUser((prev) => ({
        ...prev,
        requestedServices: prev.requestedServices.map((s) =>
          String(s._id) === String(notif.serviceId)
            ? { ...s, status: notif.status }
            : s
        ),
        notifications: [notif, ...(prev.notifications || [])],
      }));
    });

    return () => {
      socket.off("notification");
    };
  }, [user?._id]);

  if (!user) return <p className="text-center mt-24 text-lg">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar token={token} />

      <div className="max-w-screen min-h-screen mt-24 p-2">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 relative">
          <div
            className="absolute top-6 right-6 cursor-pointer"
            onClick={() => navigate("/account")}
          >
            <img
              src={user?.profilePhoto || defaultavatar}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-blue-600 object-cover"
            />
          </div>
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            Hello, {user?.firstName || "User"} {user?.lastName || ""}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-gray-700">
                <strong>Location:</strong>{" "}
                {user?.address
                  ? [
                      user.address.street1,
                      user.address.street2,
                      user.address.city,
                      user.address.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  : "-"}
              </p>
              <p className="text-gray-700">
                <strong>State:</strong> {user.address.state || "-"}
              </p>
              <p className="text-gray-700">
                <strong>Country:</strong> {user.address.country || "-"}
              </p>
              <p className="text-gray-700">
                <strong>Skills:</strong> {(user.skills || []).join(", ") || "-"}
              </p>
              <p className="text-gray-700">
                <strong>Availability:</strong> {user.availability || "-"}
              </p>
              <p className="text-gray-700">
                <strong>Total Credits:</strong> {user.wallet || "0"}
              </p>
            </div>
          </div>
        </div>

        {/* ✅ My Service Requests */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold text-blue-600 mb-4">
            My Service Requests
          </h3>
          {appliedServices.length > 0 ? (
            <ul className="space-y-3">
              {appliedServices.map((srv) => (
                <li
                  key={srv._id}
                  className="border p-3 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{srv.title}</p>
                    <p className="text-sm text-gray-600">
                      Offered By: {srv.offeredBy?.name}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      srv.status === "requested"
                        ? "bg-yellow-100 text-yellow-700"
                        : srv.status === "processing"
                        ? "bg-blue-100 text-blue-700"
                        : srv.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {srv.status === "requested" && "⏳ Pending"}
                    {srv.status === "processing" && "✅ Accepted (In Progress)"}
                    {srv.status === "completed" && "🎉 Completed"}
                    {srv.status === "open" && "❌ Rejected - Service Reopened"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              You haven’t applied to any services yet.
            </p> 
          )}
        </div>
      </div>
      <Footer />

      {/* 🎉 Animated Congratulations Popup */}
 {welcome && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-8 rounded-3xl text-center shadow-[0_0_40px_rgba(59,130,246,0.5)] border border-blue-400/30 w-[360px]">
      {/* Decorative confetti icon */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-yellow-400 p-2 rounded-full shadow-lg">
        <span className="text-white text-xl">🎉</span>
      </div>

      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-400 mt-4">
        Congratulations!
      </h2>

      <p className="text-gray-200 text-lg mt-2 font-medium">{user?.firstName} {user?.lastName}</p>

      <p className="text-gray-400 mt-4 mb-6 leading-relaxed">
        You’ve successfully joined TimeBank!  
        Click below to claim your <br /> <span className="text-blue-300 text-xl font-semibold">50 Time Credits</span>.
      </p>

      <button
        onClick={() => setWelcome(false)}
        className="px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 transition-all"
      >
        Claim
      </button>
    </div>
  </div>
)}


    </div>
  );
}

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL = "http://localhost:5000/api/services";

export default function Services({ token }) {
  const [services, setServices] = useState([]);
  const [userId, setUserId] = useState(null);
  const [credits, setCredits] = useState(1);
  const navigate = useNavigate();

  // 🔹 Get logged-in user profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserId(res.data._id);
    } catch (err) {
      console.error("❌ Error fetching profile:", err.response?.data || err.message);
    }
  };

  // 🔹 Get open services
  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_URL}/open`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data); // ✅ backend already excludes user's own services
    } catch (err) {
      console.error("❌ Error fetching services:", err.response?.data || err.message);
    }
  };

  // 🔹 Apply/Request service
  const handleRequest = async (id) => {
    try {
      await axios.post(
        `${API_URL}/${id}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchServices();
    } catch (err) {
      console.error("❌ Error applying service:", err.response?.data || err.message);
    }
  };

  // 🔹 Request completion (user asks owner to confirm)
  const handleRequestCompletion = async (id) => {
    try {
      await axios.post(
        `${API_URL}/${id}/request-completion`,
        { credits },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchServices();
    } catch (err) {
      console.error("❌ Error requesting completion:", err.response?.data || err.message);
    }
  };

  // 🔹 Owner confirms completion
  const handleConfirmCompletion = async (id) => {
    try {
      await axios.put(
        `${API_URL}/confirm-completion/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchServices();
    } catch (err) {
      console.error("❌ Error confirming completion:", err.response?.data || err.message);
    }
  };

  // 🔹 Owner rejects completion
  const handleRejectCompletion = async (id) => {
    try {
      await axios.put(
        `${API_URL}/reject-completion/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchServices();
    } catch (err) {
      console.error("❌ Error rejecting completion:", err.response?.data || err.message);
    }
  };

  // Load profile on mount
  useEffect(() => {
    fetchProfile();
    fetchServices();
  }, []);;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar token={token} />
      <div className="p-6 min-h-screen max-w-7xl mx-auto">
        {/* Header with buttons */}
        <div className="flex justify-between items-center mt-24 mb-6">
          <h2 className="text-2xl font-bold text-blue-600">All Services</h2>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/applied-services")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Applied Services
            </button>
            <button
              onClick={() => navigate("/my-services")}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              My Services
            </button>
            <button
              onClick={() => navigate("/create-service")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Create Service
            </button>
          </div>
        </div>

        {/* Services List */}
        <div className="grid gap-4">
          {services.length === 0 ? (
            <p className="text-gray-500">No available services right now.</p>
          ) : (
            services.map((s) => (
              <div
                key={s._id}
                className="border p-4 rounded bg-white shadow flex flex-col gap-2"
              >
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p>{s.description}</p>
                <p>
                  <strong>Time Period:</strong> {s.timePeriod}
                </p>
                <p>
                  <strong>Skills Required:</strong>{" "}
                  {(s.skillsRequired || []).join(", ")}
                </p>
                <p>
                  <strong>Offered By:</strong> {s.offeredBy?.name}
                </p>
                <p>
                  <strong>Status:</strong> {s.status}
                </p>

                {/* 🔹 Buttons based on status */}
                <div className="flex gap-2 mt-2">
                  {/* Open services */}
                  {s.status === "open" && (
                    <button
                      onClick={() => handleRequest(s._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Apply
                    </button>
                  )}

                  {/* Requested */}
                  {s.status === "requested" && s.requestedBy?._id === userId && (
                    <span className="text-yellow-600 font-semibold">⏳ Pending</span>
                  )}

                  {/* Processing (user → request completion) */}
                  {s.status === "processing" && s.requestedBy?._id === userId && (
                    <button
                      onClick={() => handleRequestCompletion(s._id)}
                      className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                    >
                      Request Completion
                    </button>
                  )}

                  {/* Completion requested (waiting for owner → show approve/reject) */}
                  {s.status === "completion_requested" &&
                    s.offeredBy?._id === userId && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirmCompletion(s._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Confirm ✅
                        </button>
                        <button
                          onClick={() => handleRejectCompletion(s._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Reject ❌
                        </button>
                      </div>
                    )}

                  {/* Completed */}
                  {s.status === "completed" && (
                    <span className="text-green-600 font-semibold">✅ Completed</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

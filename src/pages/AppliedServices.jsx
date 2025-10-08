import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL = "http://localhost:5000/api/services";

export default function AppliedServices({ token, userId }) {
  const [services, setServices] = useState([]);

  const fetchApplied = async () => {
    try {
      const res = await axios.get(`${API_URL}/applied`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching applied services:", err);
    }
  };

  // 🔹 Apply for a service
  const handleRequest = async (serviceId) => {
    try {
      await axios.post(
        `${API_URL}/${serviceId}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplied();
    } catch (err) {
      console.error("Error applying to service:", err);
    }
  };

  // 🔹 Mark as "completion requested"
  const handleCompleteRequest = async (serviceId) => {
    try {
      alert("Completion requested!");
      await axios.post(
        `${API_URL}/${serviceId}/request-completion`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplied();
    } catch (err) {
      console.error("Error requesting completion:", err);
    }
  };

  useEffect(() => {
    fetchApplied();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar token={token} />
          
    <div className="p-6 min-h-screen max-w-7xl mx-auto">
      
      <h2 className="text-2xl font-bold text-blue-600 mb-6 mt-24">
        My Applied Services
      </h2>

      <div className="grid gap-4">
        {services.length === 0 ? (
          <p className="text-gray-500">You haven’t applied to any services yet.</p>
        ) : (
          services.map((s) => (
            <div
              key={s._id}
              className="border p-4 rounded bg-white shadow flex flex-col gap-2"
            >
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p>{s.description}</p>
              <p>
                <strong>Time Period:</strong> {s.timePeriod || "N/A"}
              </p>
              <p>
                <strong>Skills Required:</strong>{" "}
                {(s.skillsRequired || []).join(", ")}
              </p>
              <p>
                <strong>Offered By:</strong> {s.offeredBy?.name || "Unknown"}
              </p>
              <p>
                <strong>Status:</strong> {s.status}
              </p>

              {/* Buttons / Status handling */}
              <div className="flex gap-2 mt-2">
                {s.status === "open" && s.offeredBy?._id !== userId && (
                  <button
                    onClick={() => handleRequest(s._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Apply
                  </button>
                )}

                {s.status === "requested" && s.requestedBy?._id === userId && (
                  <span className="text-yellow-600 font-semibold">
                    ⏳ Waiting for owner approval
                  </span>
                )}

                {s.status === "processing" && s.requestedBy?._id === userId && (
                  <button
                    onClick={() => handleCompleteRequest(s._id)}
                    className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-900"
                  >
                    Mark Complete
                  </button>
                )}

                {s.status === "completion_requested" &&
                  s.requestedBy?._id === userId && (
                    <span className="text-blue-600 font-semibold">
                      ✅ Completion requested, waiting for owner confirmation
                    </span>
                  )}

                {s.status === "processing" &&
                  s.requestedBy?._id !== userId && (
                    <span className="text-gray-500">
                      In Progress / Owner Reviewing
                    </span>
                  )}

                {s.status === "completed" && (
                  <span className="text-green-600 font-semibold">
                    ✅ Completed
                  </span>
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

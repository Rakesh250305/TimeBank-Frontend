import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { showCustomToast } from "../utils/toast";
// const API_URL = "http://localhost:5000/api/services";
const API_URL = "https://timebank-backend-67l5.onrender.com/api/services";

export default function Services({ token }) {
  const [services, setServices] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [applyingIds, setApplyingIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 5; // Adjust how many per page
  const navigate = useNavigate();

  const getApplicantUserId = (applicant) => {
  if (!applicant) return null;
  const u = applicant.user;
  if (!u) return null;

  // Handle both populated and plain ObjectId cases
  if (typeof u === "object" && u._id) return String(u._id);
  if (typeof u === "object" && u.toString) return u.toString();
  return String(u);
};


  const hasUserApplied = (service) => {
    if (!userId) return false;
    if (!service?.applicants || !Array.isArray(service.applicants)) return false;
    return service.applicants.some((a) => getApplicantUserId(a) === String(userId));
  };

  // Fetch logged-in user profile
  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const res = await axios.get(
        // "http://localhost:5000/api/user/profile", 
        "https://timebank-backend-67l5.onrender.com/api/user/profile", 
        {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserId(res.data.data._id);
    } catch (err) {
      console.error(
        "❌ Error fetching profile:",
        err.response?.data || err.message
      );
    }
    finally{
      setLoadingProfile(false);
    }
  };

  // Fetch open services
  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_URL}/open`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data || []);
    } catch (err) {
      console.error(
        "❌ Error fetching services:",
        err.response?.data || err.message
      );
    }
  };

  // Apply / request service handlers
  const handleRequest = async (id) => {
    if (!userId) {
    showCustomToast("warning", "Please wait", "Loading your profile — try again in a moment.");
    return;
  }
  if (applyingIds.includes(id)) return;

    try {
      setApplyingIds((prev) => [...prev, id]);
      await axios.post(
        `${API_URL}/${id}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showCustomToast("success", "Applied successfully", "Application send successfully")
      await fetchServices();
    } catch (err) {
      showCustomToast("error", "Failed to apply", err);
      console.error(
        "❌ Error applying service:",
        err.response?.data || err.message
      );
    }finally {
    setApplyingIds((prev) => prev.filter((x) => x !== id));
  }
  };

  // Load profile and services on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      await fetchProfile();
      if (!mounted) return;
      await fetchServices();
    })();
    return () => (mounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(services.length / servicesPerPage);
  const startIndex = (currentPage - 1) * servicesPerPage;
  const endIndex = startIndex + servicesPerPage;
  const paginatedServices = services.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar token={token} />
      <div className="p-6 min-h-screen max-w-7xl mx-auto">
        {/* Header with buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-24 mb-6">
          <h2 className="text-2xl font-bold text-blue-600">All Services</h2>
          <div className="flex flex-col md:flex-row w-full md:w-md gap-3 mt-5 md:mt-0">
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
       <div className="grid gap-2">
          {paginatedServices.length === 0 ? (
            <p className="text-gray-500">No available services right now.</p>
          ) : (
            paginatedServices.map((s) => {
              const applied = hasUserApplied(s);
              const applying = applyingIds.includes(s._id);

              return (
                <div key={s._id} className="border p-4 rounded bg-white shadow flex flex-col gap-1 relative">
                  <h3 className="text-lg font-semibold">Title: {s.title}</h3>
                  <p>{s.description}</p>
                  <p><strong>Time Period:</strong> {s.timePeriod}</p>
                  <p><strong>Skills Required:</strong> {(s.skillsRequired || []).join(", ")}</p>
                  <p><strong>Offered By:</strong> {s.offeredBy?.email || "N/A"}</p>

                  <div className={`py-2 px-4 text-lg border-2 rounded-lg capitalize font-semibold absolute top-5 right-5 ${s.status === "open" ? "bg-green-100 text-green-700 border-green-500" : "bg-red-100 text-red-500 border-red-500"}`}>
                    {s.status}
                  </div>

                  <div className="flex gap-2 mt-5">
                    {s.status === "open" && (
                      <button
                        onClick={() => handleRequest(s._id)}
                        disabled={applied || applying || loadingProfile}
                        className={`w-full px-3 py-1 rounded font-medium transition-all duration-300 ${
                          applied ? "bg-gray-600 text-white cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
                        } ${applying ? "opacity-80" : ""}`}
                      >
                        {applying ? "Applying..." : applied ? "Applied" : "Apply"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-700 text-white disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-700 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

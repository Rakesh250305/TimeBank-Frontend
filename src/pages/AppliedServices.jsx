import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { showCustomToast } from "../utils/toast";

export default function AppliedServices({ token, userId }) {
   const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [services, setServices] = useState([]);

  // 🔹 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchApplied = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/services/applied`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching applied services:", err);
    }
  };

  // 🔹 Mark as "completion requested"
  const handleCompleteRequest = async (serviceId) => {
    try {
      await axios.post(
        `${apiUrl}/api/services/${serviceId}/request-completion`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplied();
      showCustomToast(
        "success",
        "Completion request sent",
        "Request for completion is sent seccessfully"
      );
    } catch (err) {
      console.error("Error requesting completion:", err);
      showCustomToast("error", "Error requesting completion", err);
    }
  };

  useEffect(() => {
    fetchApplied();
  }, []);

  // ✅ Pagination logic
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentServices = services.slice(indexOfFirst, indexOfLast);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar token={token} />

      <div className="p-6 min-h-screen max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 mt-24">
          My Applied Services
        </h2>

        <div className="grid gap-4">
          {currentServices.length === 0 ? (
            <p className="text-gray-500">
              You haven't applied to any services yet.
            </p>
          ) : (
            currentServices.map((s) => {
              // ✅ FIX: Check if current user is the selected applicant
              const isSelectedApplicant = s.selectedApplicant && 
                String(s.selectedApplicant._id || s.selectedApplicant) === String(userId);

              return (
                <div
                  key={s._id}
                  className={`border p-4 rounded bg-white shadow flex flex-col gap-1 relative
                    ${
                      s.status === "requested"
                        ? "bg-red-100 text-black border-gray-400 border-3"
                        : s.status === "processing"
                        ? "bg-yellow-100 text-black border-yellow-500 border-3"
                        : s.status === "completion_requested"
                        ? "bg-red-100 text-black border-fuchsia-500 border-3"
                        : s.status === "completed"
                        ? "bg-blue-100 text-black border-blue-500 border-3"
                        : "bg-red-100 text-black border-red-500 border-3"
                    }`}
                >
                  <h3 className="text-lg font-semibold">Title: {s.title}</h3>
                  <p>{s.description}</p>
                  <p>
                    <strong>Time Period:</strong> {s.timePeriod || "N/A"} Hour
                  </p>
                  <p>
                    <strong>Skills Required:</strong>{" "}
                    {(s.skillsRequired || []).join(", ")}
                  </p>
                  <p>
                    <strong>Offered By:</strong> {s.offeredBy?.email || "Unknown"}
                  </p>

                  {/* 🔹 Status Badge */}
                  <div
                    className={`py-1 md:py-2 px-2 md:px-4 text-sm md:text-lg border-2 rounded-lg capitalize font-semibold absolute right-5 top-5
                      ${
                        s.status === "requested"
                          ? "bg-red-100 text-gray-700 border-gray-400"
                          : s.status === "processing"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-500"
                          : s.status === "completion_requested"
                          ? "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-500"
                          : s.status === "completed"
                          ? "bg-blue-100 text-blue-700 border-blue-500"
                          : "bg-red-100 text-red-500 border-red-500"
                      }`}
                  >
                    {s.status === "open"
                      ? "Requested"
                      : s.status === "processing"
                      ? "Processing"
                      : s.status === "completion_requested"
                      ? "Completion Requested"
                      : s.status === "completed"
                      ? "Completed"
                      : s.status}
                  </div>

                  {s.approvalMessage && (
                    <p>
                      <strong>Owner's Message:</strong> {s.approvalMessage}
                    </p>
                  )}

                  {/* <div
                    className={`mt-2 py-2 px-1 md:text-lg rounded-lg capitalize font-semibold
                      ${
                        s.status === "requested"
                          ? "bg-red-100 text-gray-700 border-gray-400"
                          : s.status === "processing"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-500"
                          : s.status === "completion_requested"
                          ? "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-500"
                          : s.status === "completed"
                          ? "bg-blue-100 text-blue-700 border-blue-500"
                          : "bg-red-100 text-red-500 border-red-500"
                      }`}
                  >
                    {s.status === "open" || s.status === "requested"
                      ? "⏳ Waiting for Owner's Approval"
                      : s.status === "processing" && !isSelectedApplicant
                      ? "❌ Not Selected - Another applicant was chosen"
                      : s.status === "processing" && isSelectedApplicant
                      ? "🟡 Approved – In Progress"
                      : s.status === "completion_requested"
                      ? "🟣 Completion Requested"
                      : s.status === "completed"
                      ? "💙 Completed"
                      : s.status}
                  </div> */}

                  {/* 🔹 Buttons / Status handling */}
                  <div className="flex gap-2 mt-2">
                    {(s.status === "requested" || s.status === "open") &&
                      s.applicants?.some((a) => a.user === userId) && (
                        <span className="text-yellow-600 font-semibold">
                          ⏳ Waiting for owner's approval
                        </span>
                      )}

                    {/* FIX: Only show button if user is the selected applicant */}
                    {s.status === "processing" && isSelectedApplicant && (
                      <div className="flex flex-col gap-2 w-full">
                      <span className=" text-yellow-700 w-full">
                        🟡 Approved – In Progress
                      </span>
                      <button
                        onClick={() => handleCompleteRequest(s._id)}
                        className="bg-purple-500 text-white px-3 py-1 w-full rounded hover:bg-purple-900"
                      >
                        Mark Complete
                      </button>
                      </div>
                    )}

                    {/* Show rejection message for non-selected users */}
                    {s.status === "processing" && !isSelectedApplicant && (
                      <span className="text-red-600 font-semibold">
                        ❌ Your application was not selected
                      </span>
                    )}

                    {s.status === "completion_requested" && isSelectedApplicant && (
                      <span className="text-purple-600 font-semibold">
                        ⏳ Completion requested, waiting for owner confirmation
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ✅ Pagination Controls */}
        {services.length > itemsPerPage && (
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
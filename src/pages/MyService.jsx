import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = "http://localhost:5000/api/services";

export default function MyServices({ token }) {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    timePeriod: "",
    skillsRequired: "",
  });

  const [modalService, setModalService] = useState(null);
  const [modalType, setModalType] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchMyServices = async () => {
    try {
      const res = await axios.get(`${API_URL}/my-services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching my services:", err);
    }
  };

  const handleApprove = async () => {
    try {
      await axios.put(
        `${API_URL}/${modalService._id}/approve`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      closeModal();
      fetchMyServices();
      toast.success("Approved Successfully");
    } catch (err) {
      toast.error("Error approving application")
      console.error("Error approving application:", err);
    }
  };

  const handleConfirmCompletion = async () => {
    try {
      await axios.put(
        `${API_URL}/${modalService._id}/confirm-completion`,
        { message, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      closeModal();
      fetchMyServices();
      await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Conifrmed Completion");
    } catch (err) {
      toast.error("Error confirming completion");
      console.error("Error confirming completion:", err);
    }
  };

  const handleReject = async (serviceId) => {
    try {
      await axios.put(
        `${API_URL}/reject-completion/${serviceId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMyServices();
      toast.Success("Completion Rejected");
    } catch (err) {
      console.error("Error rejecting completion:", err);
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    try {
      await axios.delete(`${API_URL}/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices((prev) => prev.filter((s) => s._id !== serviceId));
      toast.success("Deleted Successfully");
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setForm({
      title: service.title,
      description: service.description,
      timePeriod: service.timePeriod,
      skillsRequired: service.skillsRequired,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/${editingService._id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices((prev) =>
        prev.map((s) => (s._id === editingService._id ? res.data : s))
      );
      setEditingService(null);
      toast.success("Updated Successfully")
    } catch (err) {
      toast.error("Error updating service");
      console.error("Error editing service:", err);
    }
  };

  const openModal = (service, type) => {
    setModalService(service);
    setModalType(type);
    setMessage("");
  };

  const closeModal = () => {
    setModalService(null);
    setModalType("");
    setMessage("");
  };

  useEffect(() => {
    fetchMyServices();
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
          My Services
        </h2>

        <div className="grid gap-4">
          {currentServices.length === 0 ? (
            <p className="text-gray-500">
              You haven’t created any services yet.
            </p>
          ) : (
            currentServices.map((s) => (
              <div
                key={s._id}
                className={`border p-4 rounded bg-white flex flex-col gap-1 relative
                               ${
                                    s.status === "open"
                                    ? "bg-green-100 text-black border-green-500 border-3"
                                    : s.status === "requested"
                                    ? "bg-gray-100 text-black border-gray-400 border-3"
                                    : s.status === "processing"
                                    ? "bg-yellow-10 text-black border-yellow-500 border-3"
                                    : s.status === "completion_requested"
                                    ? "bg-red-100 text-black border-fuchsia-500 border-3"
                                    : s.status === "completed"
                                    ? "bg-blue-100 text-black border-blue-500 border-3"
                                    : "bg-red-100 text-black border-red-500 border-3"
                                }`}
              >
                <h3 className="text-lg font-semibold">Title: {s.title}</h3>
                <p>{s.description}</p>
                <p className="capitalize"> 
                  <strong>Status:</strong> {s.status}
                </p>
                <p>
                  <strong>Time Period:</strong> {s.timePeriod} hours
                </p>
                <p>
                  <strong>Applied By:</strong>{" "}
                  <span
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={() => navigate(`/applicant/${s.requestedBy?._id}`)}
                  >
                    {s.requestedBy?.email || "N/A"}
                  </span>
                </p>

                {s.status === "processing" && s.requestedBy && (
                  <p>
                    <strong className="text-green-600">Assigned To:</strong>{" "}
                    {s.requestedBy.name} ({s.requestedBy.email})
                  </p>
                )}

                {s.status === "requested" && (
                  <div className="flex gap-2 mt-2 text-xs md:text-base">
                    <button
                      onClick={() => openModal(s, "approveApplication")}
                      className="bg-green-600 w-1/2 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      ✅ Approve Application
                    </button>
                    <button
                      onClick={async () => {
                        await axios.put(
                          `${API_URL}/${s._id}/reject-application`,
                          {},
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        fetchMyServices();
                      }}
                      className="bg-red-600 w-1/2 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      ❌ Reject Application
                    </button>
                  </div>
                )}

                {(s.completionRequested ||
                  s.status === "completion_requested") &&
                  s.status !== "completed" && (
                    <div className="flex gap-2 mt-2 text-xs md:text-base  ">
                      <button
                        onClick={() => openModal(s, "confirmCompletion")}
                        className="bg-green-600 w-1/2 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        ✅ Confirm Completion
                      </button>
                      <button
                        onClick={() => handleReject(s._id)}
                        className="bg-red-600 w-1/2 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        ❌ Reject Completion
                      </button>
                    </div>
                  )}

                <div className="flex gap-2 mt-0 lg:mt-3 absolute right-2 md:right-10">
                  <button
                    onClick={() => {
                      if (s.status !== "open") {
                        alert(
                          "This service can only be edited when status is Open."
                        );
                        return;
                      }
                      openEditModal(s);
                    }}
                    className={`px-3 py-1 rounded text-white ${
                      s.status === "open"
                        ? "bg-blue-400 hover:bg-blue-600"
                        : "bg-gray-200 cursor-not-allowed"
                    }`}
                    disabled={s.status !== "open"}
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => {
                      if (s.status !== "open") {
                        alert(
                          "This service can only be deleted when status is Open."
                        );
                        return;
                      }
                      handleDelete(s._id);
                    }}
                    className={`px-3 py-1 rounded text-white ${
                      s.status === "open"
                        ? "bg-red-400 hover:bg-red-600"
                        : "bg-gray-200 cursor-not-allowed"
                    }`}
                    disabled={s.status !== "open"}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
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

      {/* ✅ Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Service</h2>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border p-2 rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="border p-2 rounded"
                required
              />
              <div>
                <input
                  type="number"
                  placeholder="Time Period"
                  value={form.timePeriod}
                  disabled
                  className="w-1/2 mr-5 border p-0.5 rounded"
                />
                <span className="text-gray-700">Hours</span>
                <br />
                <small className="text-gray-500">
                  Time Period (e.g. 2 hours)
                </small>
              </div>

              <input
                type="text"
                placeholder="Skills Required"
                value={form.skillsRequired}
                onChange={(e) =>
                  setForm({ ...form, skillsRequired: e.target.value })
                }
                className="border p-2 rounded"
              />

              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Approve / Confirm Modal */}
      {modalService && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-10 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            {modalType === "approveApplication" ? (
              <>
                <h2 className="text-lg font-bold mb-4">Approve Application</h2>
                <textarea
                  placeholder="Optional message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border p-2 rounded mb-3"
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={closeModal}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    OK
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-4">Write a Review</h2>
                <textarea
                  placeholder="Add Your Review here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border p-2 rounded mb-3"
                  rows={3}
                />

                <div className="flex items-center space-x-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <FaStar
                        className={`h-6 w-6 transition-colors duration-200 ${
                          rating >= star ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={closeModal}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmCompletion}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    OK
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
      <Footer />
       <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

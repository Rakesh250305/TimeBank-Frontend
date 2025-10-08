import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:5000/api/services";

export default function MyServices({ token }) {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    timePeriod: "",
    skillsRequired: "",
  });

  // ✅ For modals
  const [modalService, setModalService] = useState(null);
  const [modalType, setModalType] = useState(""); // "approve" | "confirmCompletion"
  const [message, setMessage] = useState("");

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

  // ✅ Approve Application with message
  const handleApprove = async () => {
    try {
      await axios.put(
        `${API_URL}/${modalService._id}/approve`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      closeModal();
      fetchMyServices();
    } catch (err) {
      console.error("Error approving application:", err);
    }
  };

  // ✅ Confirm Completion with message
  const handleConfirmCompletion = async () => {
    try {
      await axios.put(
        `${API_URL}/${modalService._id}/confirm-completion`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      closeModal();
      fetchMyServices();

      // 🔄 Re-fetch wallet so Navbar updates
      await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Error confirming completion:", err);
    }
  };

  // ✅ Reject completion
  const handleReject = async (serviceId) => {
    try {
      await axios.put(
        `${API_URL}/reject-completion/${serviceId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMyServices();
    } catch (err) {
      console.error("Error rejecting completion:", err);
    }
  };

  // ✅ Delete service
  const handleDelete = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    try {
      await axios.delete(`${API_URL}/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices((prev) => prev.filter((s) => s._id !== serviceId));
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  // ✅ Open Edit Modal
  const openEditModal = (service) => {
    setEditingService(service);
    setForm({
      title: service.title,
      description: service.description,
      timePeriod: service.timePeriod,
      skillsRequired: service.skillsRequired,
    });
  };

  // ✅ Submit Edit
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
    } catch (err) {
      console.error("Error editing service:", err);
    }
  };

  // ✅ Open modal
  const openModal = (service, type) => {
    setModalService(service);
    setModalType(type);
    setMessage("");
  };

  // ✅ Close modal
  const closeModal = () => {
    setModalService(null);
    setModalType("");
    setMessage("");
  };

  useEffect(() => {
    fetchMyServices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar token={token} />
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 mt-24">
          My Services
        </h2>

        <div className="grid gap-4">
          {services.length === 0 ? (
            <p className="text-gray-500">
              You haven’t created any services yet.
            </p>
          ) : (
            services.map((s) => (
              <div
                key={s._id}
                className="border p-4 rounded bg-white shadow flex flex-col gap-2 relative"
              >
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p>{s.description}</p>
                <p>
                  <strong>Status:</strong> {s.status}
                </p>

                {s.status === "processing" && s.requestedBy && (
                  <p>
                    <strong className="text-green-600">Assigned To:</strong>{" "}
                    {s.requestedBy.name} ({s.requestedBy.email})
                  </p>
                )}

                {/* Application approval */}
                {s.status === "requested" && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => openModal(s, "approve")}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
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
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      ❌ Reject Application
                    </button>
                  </div>
                )}

                {/* Completion request */}
                {(s.completionRequested ||
                  s.status === "completion_requested") &&
                  s.status !== "completed" && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => openModal(s, "confirmCompletion")}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        ✅ Confirm Completion
                      </button>
                      <button
                        onClick={() => handleReject(s._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        ❌ Reject Completion
                      </button>
                    </div>
                  )}

                {/* Edit + Delete */}
                <div className="flex gap-2 mt-3 absolute right-10">
                  <button
                    onClick={() => {
                      if (
                        s.status === "processing" ||
                        s.status === "completed"
                      ) {
                        alert(
                          "This service cannot be edited because it is already assigned."
                        );
                        return;
                      }
                      openEditModal(s);
                    }}
                    className={`px-3 py-1 rounded text-white ${
                      s.status === "processing" || s.status === "completed"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    disabled={
                      s.status === "processing" || s.status === "completed"
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => {
                      if (
                        s.status === "processing" ||
                        s.status === "completed"
                      ) {
                        alert(
                          "This service cannot be deleted because it is already assigned to a user."
                        );
                        return;
                      }
                      handleDelete(s._id);
                    }}
                    className={`px-3 py-1 rounded text-white ${
                      s.status === "processing" || s.status === "completed"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                    disabled={
                      s.status === "processing" || s.status === "completed"
                    }
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal */}
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
                  onChange={(e) =>
                    setForm({ ...form, timePeriod: e.target.value })
                  }
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

      {/* Approve/Confirm Modal with message */}
      {modalService && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-10 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {modalType === "approve"
                ? "Approve Application"
                : "Confirm Completion"}
            </h2>
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
                onClick={
                  modalType === "approve"
                    ? handleApprove
                    : handleConfirmCompletion
                }
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    <Footer />
    </div>
  );
}

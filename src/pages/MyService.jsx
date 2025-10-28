import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { showCustomToast } from "../utils/toast";

import { FaClipboardList, FaRegClock, FaStar, FaTools } from "react-icons/fa";
import { MdTitle } from "react-icons/md";
import { RiArrowGoBackLine } from "react-icons/ri";
import { IoMdSend } from "react-icons/io";

// const API_URL = "http://localhost:5000/api/services";
const API_URL = "https://timebank-backend-67l5.onrender.com/api/services";

export default function MyServices({ token }) {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [deleteModalService, setDeleteModalService] = useState(null);
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
  const [selectedApplicant, setSelectedApplicant] = useState(null);

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

  const handleAction = async (e, s, applicantId) => {
    const action = e.target.value;
    if (!action) return;

    if (action === "approve") {
      openModal({ ...s, applicantId }, "approveApplication"); // store applicantId too
    } else if (action === "reject") {
      try {
        await axios.put(
          `${API_URL}/${s._id}/reject-application`,
          { applicantId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showCustomToast("reject", "Rejected Successfully");
        fetchMyServices();
      } catch (err) {
        console.error(err);
        showCustomToast("error", "Something went wrong");
      }
    }

    e.target.value = "";
  };

  const handleApprove = async () => {
    try {
      await axios.put(
        `${API_URL}/${modalService._id}/approve`,
        { applicantId: modalService.applicantId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      closeModal();
      showCustomToast(
        "success",
        "Approved Successfully",
        "The Applicant is Approved successfully"
      );
      fetchMyServices();
    } catch (err) {
      showCustomToast("error", "Error approving application", err);
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
      showCustomToast(
        "success",
        "Conifrmed Completion",
        "The Applicant is Confirmed for completion of the Service"
      );
    } catch (err) {
      showCustomToast("error", "Error confirming completion", err);
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
      showCustomToast(
        "reject",
        "Rejected successfully",
        "The applicant is rejected successsfully"
      );
    } catch (err) {
      showCustomToast("error", "Error rejecting completion", err);
      console.error("Error rejecting completion:", err);
    }
  };

  const handleDelete = (service) => {
    if (service.status !== "open") {
      showCustomToast(
        "warning",
        "This service can only be deleted when status is Open."
      );
      return;
    }
    setDeleteModalService(service);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalService) return;
    try {
      await axios.delete(`${API_URL}/${deleteModalService._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices((prev) =>
        prev.filter((s) => s._id !== deleteModalService._id)
      );
      showCustomToast(
        "success",
        "Deleted Successfully",
        "Service is deleted successfully"
      );
      setDeleteModalService(null);
    } catch (err) {
      console.error("Error deleting service:", err);
      showCustomToast("error", "Error deleting service");
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
      showCustomToast(
        "success",
        "Updated Successfully",
        "The service is updated successfully"
      );
    } catch (err) {
      showCustomToast("error", "Error Updating Service", err);
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
                {/* <p>
                  <strong>Applied By:</strong>{" "}
                  <span
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={() => navigate(`/applicant/${s.requestedBy?._id}`)}
                  >
                    {s.requestedBy?.email || "N/A"}
                  </span>
                </p> */}

                {/* {s.status === "processing" && s.requestedBy && (
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
                        showCustomToast("reject", "Rejected Successfully");
                        fetchMyServices();
                      }}
                      className="bg-red-600 w-1/2 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      ❌ Reject Application
                    </button>
                  </div>
                )} */}

                {Array.isArray(s.applicants) && s.applicants.length > 0 ? (
                  <div className="mt-1">
                    <strong>Applicants:</strong>

                    {s.applicants.length <= 2 ? (
                      // ✅ Show directly if 2 or fewer
                      <ul className="ml-1 mt-1 list-disc">
                        {s.applicants.map((applicant) => (
                          <li
                            key={applicant._id}
                            className="flex justify-between gap-2 items-center py-1 border-b border-gray-200"
                          >
                            <div
                              className="text-blue-600 hover:underline cursor-pointer"
                              onClick={() =>
                                navigate(`/applicant/${applicant.user._id}`)
                              }
                            >
                              {applicant.user.firstName}{" "}
                              {applicant.user.lastName} ({applicant.user.email})
                            </div>

                            {(s.status === "open" ||
                              s.status === "requested") && (
                              <select
                                className="appearance-none bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs cursor-pointer transition duration-200 focus:ring-2 focus:ring-green-400 outline-none"
                                onChange={(e) =>
                                  handleAction(e, s, applicant.user._id)
                                }
                              >
                                <option value="">Action</option>
                                <option value="approve">Approve</option>
                                <option value="reject">Reject</option>
                              </select>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      // ✅ More than 2 → show View List button
                      <button
                        onClick={() => openModal(s, "viewApplicants")}
                        className="text-blue-600 text-sm cursor-pointer hover:text-blue-900 hover:underline  ml-2"
                      >
                        View List ({s.applicants.length})
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    <strong>No applicants yet.</strong>
                  </p>
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
                    onClick={() => handleDelete(s)}
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
        <div className="fixed inset-0 px-2 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="bg-white md:p-10 px-5 py-10 md:mt-10 w-full max-h-screen max-w-7xl transform transition-all scale-100 animate-fadeIn">
            <h2 className="text-2xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              Edit Service
            </h2>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MdTitle className="text-blue-600" /> Service Title
                </label>
                <input
                  type="text"
                  placeholder="Service title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-4 py-2 transition-all duration-200"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaClipboardList className="text-blue-600" /> Description
                </label>
                <textarea
                  placeholder="Describe your service..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-4 py-2 resize-none transition-all duration-200"
                  required
                />
              </div>

              {/* Time Period */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaRegClock className="text-blue-600" /> Estimated Time
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={form.timePeriod}
                    disabled
                    className="w-1/2 border border-gray-300 bg-gray-100 text-gray-600 rounded-lg px-3 py-2 cursor-not-allowed"
                  />
                  <span className="text-gray-600 font-medium">hours</span>
                </div>
                <small className="text-gray-500 ml-1">
                  Time Period (cannot be edited)
                </small>
              </div>

              {/* Skills Required */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaTools className="text-blue-600" /> Skills Required
                </label>
                <input
                  type="text"
                  placeholder="e.g. ReactJS, Communication"
                  value={form.skillsRequired}
                  onChange={(e) =>
                    setForm({ ...form, skillsRequired: e.target.value })
                  }
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-4 py-2 transition-all duration-200"
                />
                <small className="text-gray-500 ml-1">
                  Separate multiple skills with commas (,)
                </small>
              </div>

              {/* Buttons */}
              <div className="flex justify-between gap-3 mt-6 ">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-200"
                >
                  <RiArrowGoBackLine /> Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                >
                  <IoMdSend className="text-lg" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🗑 Delete Confirmation Modal */}
      {deleteModalService && (
        <div className="fixed inset-0 p-2 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl animate-fadeIn">
            <h2 className="text-2xl font-extrabold text-center mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Delete Service
            </h2>

            <p className="text-gray-700 text-center mb-6">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-red-500">
                “{deleteModalService.title}”
              </span>
              ? <br />
              This action <strong>cannot be undone.</strong>
            </p>

            <div className="flex justify-evenly gap-4 mt-6">
              <button
                onClick={() => setDeleteModalService(null)}
                className="px-5 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-200"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                className="px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Approve / Confirm Modal */}
      {modalService && (
        <div className="fixed inset-0 p-2 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-xl shadow-2xl animate-fadeIn relative">
            {modalType === "approveApplication" ? (
              <>
                <h2 className="text-2xl font-extrabold text-center mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Approve Application
                </h2>

                <textarea
                  placeholder="Optional message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  rows={3}
                />

                <div className="flex justify-between gap-4 mt-4">
                  <button
                    onClick={closeModal}
                    className="flex justify-center item-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-200"
                  >
                    <RiArrowGoBackLine className="mt-1" /> Cancel
                  </button>

                  <button
                    onClick={handleApprove}
                    className="px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
                  >
                    OK
                  </button>
                </div>
              </>
            ) : modalType === "confirmCompletion" ? (
              <>
                <h2 className="text-2xl font-extrabold text-center  mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  Write a Review
                </h2>

                <textarea
                  placeholder="Add your review here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 mb-1 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all"
                  rows={3}
                />

                <div className="flex justify-start space-x-1 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <FaStar
                        className={`h-7 w-7 transition-transform duration-200 ${
                          rating >= star
                            ? "text-yellow-400 scale-110"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="flex justify-between gap-4 mt-4">
                  <button
                    onClick={closeModal}
                    className="flex justify-center item-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-200"
                  >
                    <RiArrowGoBackLine className="mt-1" /> Cancel
                  </button>

                  <button
                    onClick={handleConfirmCompletion}
                    className="px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-md"
                  >
                    OK
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-center mb-4 text-blue-600">
                  Applicants List
                </h2>

                <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                  {modalService && Array.isArray(modalService.applicants) && (
                    <>
                      <h3 className="text-base text-gray-500 right-5 absolute font-semibold mb-2">
                        Total Applicants: {modalService.applicants.length}
                      </h3>

                      <div className="mt-5">
                        {modalService.applicants.map((applicant, index) => (
                          <li
                            key={applicant._id || index}
                            className="py-2 flex justify-between items-center"
                          >
                            {/* ✅ User info or fallback */}
                            {applicant.user ? (
                              <div
                                className="text-blue-600 hover:underline cursor-pointer"
                                onClick={() =>
                                  navigate(`/applicant/${applicant.user._id}`)
                                }
                              >
                                {applicant.user.firstName}{" "}
                                {applicant.user.lastName}{" "}
                                <span className="text-gray-500 text-sm">
                                  ({applicant.user.email})
                                </span>
                              </div>
                            ) : (
                              <div className="text-gray-400 italic">
                                User details unavailable
                              </div>
                            )}

                            {/* ✅ Single select radio */}
                            {applicant.user && (
                              <input
                                type="radio"
                                name="selectedApplicant"
                                className="accent-green-600 cursor-pointer w-4 h-4"
                                onChange={() =>
                                  setSelectedApplicant(applicant.user._id)
                                }
                                checked={
                                  selectedApplicant === applicant.user._id
                                }
                              />
                            )}
                          </li>
                        ))}
                      </div>
                    </>
                  )}
                </ul>

                {/* ✅ Approve + Close buttons */}
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={async () => {
                      if (!selectedApplicant) {
                        showCustomToast(
                          "error",
                          "Please select an applicant first"
                        );
                        return;
                      }
                      try {
                        await axios.put(
                          `${API_URL}/${modalService._id}/approve`,
                          { applicantId: selectedApplicant },
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        showCustomToast(
                          "success",
                          "Applicant approved successfully!"
                        );
                        fetchMyServices();
                        closeModal();
                      } catch (err) {
                        console.error("Approval failed:", err);
                        showCustomToast("error", "Failed to approve applicant");
                      }
                    }}
                    className={`px-5 py-2 rounded-lg text-white font-semibold ${
                      selectedApplicant
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!selectedApplicant}
                  >
                    Approve
                  </button>

                  <button
                    onClick={closeModal}
                    className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      

      <Footer />
    </div>
  );
}

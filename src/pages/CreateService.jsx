import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { showCustomToast } from "../utils/toast";
import { FaRegClock, FaClipboardList, FaTools } from "react-icons/fa";
import { MdTitle } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { RiArrowGoBackLine } from "react-icons/ri";

const API_URL = "http://localhost:5000/api/services";

export default function CreateService({ token }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    timePeriod: "",
    skillsRequired: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        API_URL,
        {
          ...form,
          skillsRequired: form.skillsRequired.split(",").map((s) => s.trim()),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showCustomToast("success","Service created successfully", "New service is Open Publically");
      setTimeout(() => navigate("/service"), 1200); // ⏳ small delay
    } catch (err) {
      console.error("Error creating service:", err);
      showCustomToast("error", "Error creating Service", err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 font-sans">
      <Navbar token={token} />

      <div className="flex justify-center items-center pt-22 pb-5">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-xl p-10 w-full max-w-7xl transition-all"
        >
          <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
            Create New Service
          </h2>

          {/* Title */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MdTitle className="text-blue-600" /> Service Title
            </label>
            <input
              type="text"
              placeholder="Enter service title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-4 py-2 transition-all duration-200"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FaClipboardList className="text-blue-600" /> Description
            </label>
            <textarea
              placeholder="Describe your service..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-4 py-2 resize-none transition-all duration-200"
            />
          </div>

          {/* Time Period */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FaRegClock className="text-blue-600" /> Estimated Time Period
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="e.g. 2"
                value={form.timePeriod}
                onChange={(e) =>
                  setForm({ ...form, timePeriod: e.target.value })
                }
                className="w-1/2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 transition-all duration-200"
              />
              <span className="text-gray-600 font-medium">hours</span>
            </div>
            <small className="text-gray-500 ml-1">
              Example: 2 hours, 4 hours, etc.
            </small>
          </div>

          {/* Skills Required */}
          <div className="mb-10">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FaTools className="text-blue-600" /> Skills Required
            </label>
            <input
              type="text"
              placeholder="e.g. Design, Communication, ReactJS"
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
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate("/service")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-200"
            >
              <RiArrowGoBackLine /> Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white shadow-md transition-all duration-300 ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              }`}
            >
              <IoMdSend className="text-lg" />
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

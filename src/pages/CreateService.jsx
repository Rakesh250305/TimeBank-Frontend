// src/pages/CreateService.js
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL = "http://localhost:5000/api/services";

export default function CreateService({ token }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    timePeriod: "",
    skillsRequired: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
      navigate("/service");
    } catch (err) {
      console.error("Error creating service:", err);
      alert("Something went wrong while creating the service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar token={token} />

      <div className="flex justify-center items-center py-20 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-10 w-full max-w-lg border border-blue-100"
        >
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center">
            Create New Service
          </h2>

          {/* Title */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service Title
            </label>
            <input
              type="text"
              placeholder="Enter service title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-4 py-2 transition duration-200"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe the service..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-4 py-2 resize-none transition duration-200"
            />
          </div>

          {/* Time Period */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estimated Time Period
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="e.g. 2"
                value={form.timePeriod}
                onChange={(e) =>
                  setForm({ ...form, timePeriod: e.target.value })
                }
                className="w-1/2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 transition duration-200"
              />
              <span className="text-gray-600 font-medium">hours</span>
            </div>
            <small className="text-gray-500 ml-1">
              Example: 2 hours, 4 hours, etc.
            </small>
          </div>

          {/* Skills Required */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Skills Required
            </label>
            <input
              type="text"
              placeholder="e.g. Graphic Design, Communication, Photoshop"
              value={form.skillsRequired}
              onChange={(e) =>
                setForm({ ...form, skillsRequired: e.target.value })
              }
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-4 py-2 transition duration-200"
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
              className="px-5 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 rounded-lg font-semibold text-white shadow-md transition duration-200 ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

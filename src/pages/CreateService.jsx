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

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      API_URL,
      {
        ...form,
        skillsRequired: form.skillsRequired.split(",").map((s) => s.trim()),
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    navigate("/service"); // redirect back to list after creating
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar token={token} />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-blue-600 mb-6">
          Create New Service
        </h2>

        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2 mb-3 rounded"
        />

        <div className="mb-3">
          <input
          type="number"
          placeholder="Time Period"
          value={form.timePeriod}
          onChange={(e) => setForm({ ...form, timePeriod: e.target.value })}
          className="w-1/2 mr-5 border p-0.5 rounded"
        /> 
        <span className="text-gray-700">Hours</span>
        <br />
        <small className="text-gray-500">Time Period (e.g. 2 hours)</small>

        </div>

        <input
          type="text"
          placeholder="Skills Required (comma separated)"
          value={form.skillsRequired}
          onChange={(e) =>
            setForm({ ...form, skillsRequired: e.target.value })
          }
          className="w-full border p-2 mb-3 rounded"
        />

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => navigate("/service")}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>  
    <Footer />  
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";

// const API_URL = "http://localhost:5000/api/services";
const API_URL = "https://timebank-backend-67l5.onrender.com/api/services";

export default function EditService({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    timePeriod: "",
    skillsRequired: "",
  });

  // ✅ Fetch service details from "my-services"
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`${API_URL}/my-services`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const service = res.data.find((s) => s._id === id);
        if (service) {
          setForm({
            title: service.title,
            description: service.description,
            timePeriod: service.timePeriod,
            skillsRequired: (service.skillsRequired || []).join(", "),
          });
        }
      } catch (err) {
        console.error("Failed to fetch service:", err);
      }
    };

    fetchService();
  }, [id, token]);

  // ✅ Update service
  const handleUpdate = async () => {
    try {
      await axios.put(
        `${API_URL}/${id}`,
        {
          ...form,
          skillsRequired: form.skillsRequired
            .split(",")
            .map((s) => s.trim()),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/service");
    } catch (err) {
      console.error("Failed to update service:", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto mt-24 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Service</h2>
      <input
        className="border p-2 mb-2 w-full"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Title"
      />
      <textarea
        className="border p-2 mb-2 w-full"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Description"
      />
      <input
        className="border p-2 mb-2 w-full"
        value={form.timePeriod}
        // onChange={(e) => setForm({ ...form, timePeriod: e.target.value })}
        placeholder="Time Period"
        disabled
      />
      <input
        className="border p-2 mb-4 w-full"
        value={form.skillsRequired}
        onChange={(e) => setForm({ ...form, skillsRequired: e.target.value })}
        placeholder="Skills (comma separated)"
      />
      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Update
      </button>
    <Footer />
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import defaultavatar from "../assets/default-profile.webp";

export default function Account({ token }) {
  const [user, setUser] = useState(null);
  const [editData, setEditData] = useState({
    location: "",
    skills: "",
    availability: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch user data
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = {
        ...res.data.data,
        profilePhoto: res.data.data.profilePhoto
          ? `${res.data.data.profilePhoto}`
          : null,
      };

      setUser(userData);
      setEditData({
        location: userData.location || "",
        skills: (userData.skills || []).join(", "),
        availability: userData.availability || "",
      });
    } catch (err) {
      console.error("Fetch profile error:", err);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  // Update user profile
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const payload = {
        location: editData.location,
        skills: editData.skills.split(",").map((s) => s.trim()),
        availability: editData.availability,
      };
      const res = await axios.put(
        "http://localhost:5000/api/user/profile",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = {
        ...res.data.data,
        profilePhoto: res.data.data.profilePhoto
          ? `http://localhost:5000/${res.data.data.profilePhoto}`
          : null,
      };

      setUser(updatedUser);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Upload profile photo
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      setLoading(true);
      const res = await axios.put(
        "http://localhost:5000/api/user/profile/photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = {
        ...res.data.data,
        profilePhoto: res.data.data.profilePhoto
          ? `${res.data.profilePhoto}`
          : null,

        url: res,
      };

      setUser(updatedUser);
      alert("Profile photo updated!");
    } catch (err) {
      console.error("Photo upload error:", err);
      alert("Failed to upload photo");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-center mt-24 text-lg">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-24 px-4 md:px-0">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-8 relative">
        <h2 className="text-3xl font-bold text-blue-600 mb-6">
          Account Settings
        </h2>

        {/* Profile Photo */}
        <div className="flex items-center mb-6">
          <img
            src={user?.profilePhoto || defaultavatar}
            alt="Profile"
            className="w-24 h-24 rounded-full border-3 border-blue-600 p-0.5 mr-6 object-cover"
          />
          <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-900 transition">
            Change Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </label>
        </div>

        {/* Profile Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Name:</label>
            <input
              value={user.name}
              disabled
              className="w-full p-3 border rounded-xl bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Email:</label>
            <input
              value={user.email}
              disabled
              className="w-full p-3 border rounded-xl bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Location:</label>
            <input
              value={editData.location}
              onChange={(e) =>
                setEditData({ ...editData, location: e.target.value })
              }
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Skills (comma separated):
            </label>
            <input
              value={editData.skills}
              onChange={(e) =>
                setEditData({ ...editData, skills: e.target.value })
              }
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Availability:
            </label>
            <input
              value={editData.availability}
              onChange={(e) =>
                setEditData({ ...editData, availability: e.target.value })
              }
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition"
          >
            {loading ? "Saving..." : "Update Profile"}
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
}

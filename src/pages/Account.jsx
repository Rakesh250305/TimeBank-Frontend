import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import defaultAvatar from "../assets/default-profile.webp";
import { FaArrowLeft, FaRegEdit } from "react-icons/fa";
import { showCustomToast } from "../utils/toast";
import { RiArrowGoBackLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
export default function Account({ token }) {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    skills: "",
    availability: "",
    bio: "",
    academics: [],
    experiences: [],
  });
  const [loading, setLoading] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoPreviewOpen, setPhotoPreviewOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile
  const fetchProfile = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(
        // "http://localhost:5000/api/user/profile",
        "https://timebank-backend-67l5.onrender.com/api/user/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const u = data.data;
      setUser(u);
      setFormData({
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        email: u.email || "",
        phone: u.phone || "",
        street1: u.address?.street1 || "",
        street2: u.address?.street2 || "",
        city: u.address?.city || "",
        state: u.address?.state || "",
        postalCode: u.address?.postalCode || "",
        country: u.address?.country || "",
        skills: (u.skills || []).join(", "),
        availability: u.availability || "",
        bio: u.bio || "",
        academics: u.academics || [],
        experiences: u.experiences || [],
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  // Update profile
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bio: formData.bio,
        address: {
          street1: formData.street1,
          street2: formData.street2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        skills: formData.skills.split(",").map((s) => s.trim()),
        availability: formData.availability,
        academics: formData.academics,
        experiences: formData.experiences,
      };

      const { data } = await axios.put(
        // "http://localhost:5000/api/user/profile",
        "https://timebank-backend-67l5.onrender.com/api/user/profile",

        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(data.data);
      showCustomToast("success", "Profile updated successfully");
      navigate("/profile");
    } catch (err) {
      console.error("Update error:", err);
      showCustomToast("error", "Failed to update profile", err);
    } finally {
      setLoading(false);
    }
  };

  // Photo Upload
  const handlePhotoUpload = async () => {
    if (!photoFile) return;
    const photoData = new FormData();
    photoData.append("profilePhoto", photoFile);
    setLoading(true);
    try {
      const { data } = await axios.put(
        // "http://localhost:5000/api/user/profile/photo",
        "https://timebank-backend-67l5.onrender.com/api/user/profile/photo",
        photoData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser((prev) => ({
        ...prev,
        profilePhoto: data.data.profilePhoto || null,
      }));
      showCustomToast(
        "success",
        "Profile Photo Changed",
        "your profile photo is uploaded"
      );
      setPhotoModalOpen(false);
      setPhotoFile(null);
    } catch (err) {
      showCustomToast("error", "Error in Updating Profile", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
        <div className="flex flex-col items-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24 mb-4"></div>
          <p className="text-white text-lg">Loading, please wait...</p>
        </div>

        <style jsx>{`
          .loader {
            border-top-color: #3b82f6;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full bg-white shadow-2xl rounded-2xl p-8">
        <div className="flex text-3xl font-bold text-blue-600 mb-6">
          <FaArrowLeft
            onClick={() => navigate("/profile")}
            className="mr-5 mt-1"
          />
          <h2> Edit Profile</h2>
        </div>
        {/* Profile Photo */}
        <div className="flex items-center justify-center mb-6 relative">
          <img
            onClick={() => setPhotoPreviewOpen(true)}
            src={user.profilePhoto || defaultAvatar}
            alt="Profile"
            className="h-[10rem] w-[10rem] rounded-full border-3 border-blue-600 p-0.5 object-cover"
          />
          {/* edit icon */}
          <div
            onClick={() => setPhotoModalOpen(true)}
            className="bg-blue-300 rounded-full p-3 absolute bottom-0 ml-22"
          >
            <FaRegEdit />
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="First Name" value={formData.firstName} disabled />
          <InputField label="Last Name" value={formData.lastName} disabled />
          <InputField label="Email" value={formData.email} disabled />
          <InputField
            label="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <InputField
            label="Street 1"
            value={formData.street1}
            onChange={(e) =>
              setFormData({ ...formData, street1: e.target.value })
            }
          />
          <InputField
            label="Street 2"
            value={formData.street2}
            onChange={(e) =>
              setFormData({ ...formData, street2: e.target.value })
            }
          />
          <InputField
            label="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
          <InputField
            label="State"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
          />
          <InputField
            label="Postal Code"
            value={formData.postalCode}
            onChange={(e) =>
              setFormData({ ...formData, postalCode: e.target.value })
            }
          />
          <InputField
            label="Country"
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
          />
          <InputField
            label="Skills (comma separated)"
            value={formData.skills}
            onChange={(e) =>
              setFormData({ ...formData, skills: e.target.value })
            }
          />
          <InputField
            label="Availability"
            value={formData.availability}
            onChange={(e) =>
              setFormData({ ...formData, availability: e.target.value })
            }
          />
          <InputField
            label="Bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        {/* Academics */}
        <CollapsibleList
          title="Academics"
          items={formData.academics}
          fields={["title", "university", "percentage", "year"]}
          onAdd={() =>
            setFormData({
              ...formData,
              academics: [
                ...formData.academics,
                { title: "", university: "", percentage: "", year: "" },
              ],
            })
          }
          onRemove={(idx) =>
            setFormData({
              ...formData,
              academics: formData.academics.filter((_, i) => i !== idx),
            })
          }
          onChange={(updated) =>
            setFormData({ ...formData, academics: updated })
          }
        />

        {/* Experiences */}
        <CollapsibleList
          title="Experiences"
          items={formData.experiences}
          fields={["title", "role", "description", "years"]}
          onAdd={() =>
            setFormData({
              ...formData,
              experiences: [
                ...formData.experiences,
                { title: "", role: "", description: "", years: "" },
              ],
            })
          }
          onRemove={(idx) =>
            setFormData({
              ...formData,
              experiences: formData.experiences.filter((_, i) => i !== idx),
            })
          }
          onChange={(updated) =>
            setFormData({ ...formData, experiences: updated })
          }
        />

        {/* Action Buttons */}
        <div className="mt-6 flex lg:justify-evenly justify-between lg:gap-20 items-center">
          <button
            onClick={() => navigate("/profile")}
            className="flex gap-2 px-6 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-700 transition"
          >
            <RiArrowGoBackLine className="mt-1" /> Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-semibold text-white transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            }`}
          >
            {loading ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </div>

      {/* Modal for Photo Upload */}
      <Dialog
        open={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <Dialog.Title className="text-xl font-bold mb-4">
              Upload Profile Photo
            </Dialog.Title>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files[0])}
              className="bg-gray-400 w-[70%] px-5 py-2 border-2 rounded-xl"
            ></input>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setPhotoModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePhotoUpload}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Upload
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Modal for profile photo photoPreviewOpen */}
      <Dialog
        open={photoPreviewOpen}
        onClose={() => setPhotoPreviewOpen(false)}
        className="fixed z-50 backdrop-blur-50 bg-black/85 inset-0 h-screen"
      >
        <div className="flex h-screen w-screen items-center justify-center">
          <h1 className="fixed top-10 text-2xl font-bold text-gray-300">
            Profile Photo
          </h1>
          <img src={user.profilePhoto} alt="" className="h-80 w-auto" />
          <button
            onClick={() => setPhotoPreviewOpen(false)}
            className="flex text-3xl rounded-full px-2 py-2 text-gray-300 hover:bg-gray-400 transition justify-center absolute top-5 right-8"
          >
            <RxCross2 />
          </button>
        </div>
      </Dialog>
    </div>
  );
}

// Input field
const InputField = ({ label, value, onChange, disabled = false }) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-1">{label}:</label>
    <input
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
  </div>
);

// Collapsible List (Academics/Experiences)
const CollapsibleList = ({
  title,
  items,
  fields,
  onAdd,
  onRemove,
  onChange,
}) => {
  const [openIndices, setOpenIndices] = useState(items.map(() => true));

  const toggleOpen = (idx) => {
    const newOpen = [...openIndices];
    newOpen[idx] = !newOpen[idx];
    setOpenIndices(newOpen);
  };

  const moveUp = (idx) => {
    if (idx === 0) return;
    const newItems = [...items];
    [newItems[idx - 1], newItems[idx]] = [newItems[idx], newItems[idx - 1]];
    onChange(newItems);
  };

  const moveDown = (idx) => {
    if (idx === items.length - 1) return;
    const newItems = [...items];
    [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
    onChange(newItems);
  };

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold text-gray-700 mb-2">{title}</h3>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="border p-4 rounded-xl mb-4 bg-gray-50 relative"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">
              {title.slice(0, -1)} {idx + 1}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => toggleOpen(idx)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                {openIndices[idx] ? "▲" : "▼"}
              </button>
              <button
                onClick={() => moveUp(idx)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                ↑
              </button>
              <button
                onClick={() => moveDown(idx)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                ↓
              </button>
              <button
                onClick={() => onRemove(idx)}
                className="px-2 py-1 bg-red-200 rounded hover:bg-red-300"
              >
                ✕
              </button>
            </div>
          </div>
          {openIndices[idx] && (
            <div className="space-y-2">
              {fields.map((field) => (
                <InputField
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={item[field]}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[idx][field] = e.target.value;
                    onChange(updated);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ))}
      <button
        onClick={onAdd}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Add {title.slice(0, -1)}
      </button>
    </div>
  );
};

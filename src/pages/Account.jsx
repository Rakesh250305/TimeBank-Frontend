import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { FaRegEdit } from "react-icons/fa";
import { showCustomToast } from "../utils/toast";
import { RxCross2 } from "react-icons/rx";
import Navbar from "../components/Navbar";
import { Award, Briefcase, GraduationCap, MapPin, User } from "lucide-react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display&display=swap');`;

export default function Account({ token }) {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    street1: "", street2: "", city: "", state: "", postalCode: "", country: "",
    skills: "", availability: "", bio: "", academics: [], experiences: [],
  });
  const [loading, setLoading] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoPreviewOpen, setPhotoPreviewOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [activeSection, setActiveSection] = useState("personal");
  const navigate = useNavigate();

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${apiUrl}/api/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
      const u = data.data;
      setUser(u);
      setFormData({
        firstName: u.firstName || "", lastName: u.lastName || "", email: u.email || "", phone: u.phone || "",
        street1: u.address?.street1 || "", street2: u.address?.street2 || "", city: u.address?.city || "",
        state: u.address?.state || "", postalCode: u.address?.postalCode || "", country: u.address?.country || "",
        skills: (u.skills || []).join(", "), availability: u.availability || "", bio: u.bio || "",
        academics: u.academics || [], experiences: u.experiences || [],
      });
    } catch (err) { console.error("Error fetching profile:", err); }
  };

  useEffect(() => { fetchProfile(); }, [token]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const payload = {
        firstName: formData.firstName, lastName: formData.lastName, phone: formData.phone, bio: formData.bio,
        address: { street1: formData.street1, street2: formData.street2, city: formData.city, state: formData.state, postalCode: formData.postalCode, country: formData.country },
        skills: formData.skills.split(",").map((s) => s.trim()),
        availability: formData.availability, academics: formData.academics, experiences: formData.experiences,
      };
      const { data } = await axios.put(`${apiUrl}/api/user/profile`, payload, { headers: { Authorization: `Bearer ${token}` } });
      setUser(data.data);
      showCustomToast("success", "Profile updated successfully");
      navigate("/profile");
    } catch (err) {
      showCustomToast("error", "Failed to update profile", err);
    } finally { setLoading(false); }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;
    const photoData = new FormData();
    photoData.append("profilePhoto", photoFile);
    setLoading(true);
    try {
      const { data } = await axios.put(`${apiUrl}/api/user/profile/photo`, photoData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setUser((prev) => ({ ...prev, profilePhoto: data.data.profilePhoto || null }));
      showCustomToast("success", "Profile Photo Changed");
      setPhotoModalOpen(false); setPhotoFile(null);
    } catch (err) { showCustomToast("error", "Error in Updating Profile", err); }
    finally { setLoading(false); }
  };

  if (!user) return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950">
      <style>{FONTS}{`.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div className="flex flex-col items-center gap-4">
        <div className="spin w-10 h-10 rounded-full border-2 border-slate-700 border-t-blue-400"></div>
        <p className="text-slate-400 text-sm tracking-widest uppercase" style={{fontFamily:"DM Sans"}}>Loading</p>
      </div>
    </div>
  );

  const avatarUrl = user?.profilePhoto || `https://ui-avatars.com/api/?name=${user.firstName.slice(0,1)}${user.lastName.slice(0,1)}&background=3b82f6&color=fff&bold=true`;

  const sections = [
    { id: "personal", label: "Personal", icon: User },
    { id: "address", label: "Address", icon: MapPin },
    { id: "professional", label: "Professional", icon: Briefcase },
    { id: "academics", label: "Academics", icon: GraduationCap },
    { id: "experiences", label: "Experience", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-slate-50" style={{fontFamily:"'DM Sans', sans-serif"}}>
        <Navbar token={token} />

      <div className="max-w-7xl mx-auto pt-25 px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
         
          <div>
            <h1 className="text-2xl font-bold text-blue-600 section-header">Edit Profile</h1>
            <p className="text-sm text-slate-500">Update your personal information</p>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 p-6 mb-6 flex items-center gap-6">
          <div className="relative">
            <div className="p-[3px] rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
              <img
                onClick={() => user.profilePhoto && setPhotoPreviewOpen(true)}
                src={avatarUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover block cursor-pointer"
              />
            </div>
            <button
              onClick={() => setPhotoModalOpen(true)}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
            >
              <FaRegEdit size={12} color="white" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-slate-800">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
            <button onClick={() => setPhotoModalOpen(true)} className="text-sm text-blue-600 hover:underline mt-1 font-medium">Change photo</button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {sections.map(s => (
            
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition
${activeSection === s.id 
  ? "bg-blue-600 text-white" 
  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
}`}>
              <s.icon size={16}/> {s.label}
            </button>
          ))}
        </div>

        {/* Form Sections */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 p-6 mb-6">

          {activeSection === "personal" && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 section-header mb-5">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First Name" value={formData.firstName} disabled />
                <Field label="Last Name" value={formData.lastName} disabled />
                <Field label="Email" value={formData.email} disabled />
                <Field label="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                    placeholder="Tell others about yourself..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "address" && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 section-header mb-5">Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><Field label="Street 1" value={formData.street1} onChange={e => setFormData({...formData, street1: e.target.value})} /></div>
                <div className="sm:col-span-2"><Field label="Street 2 (Optional)" value={formData.street2} onChange={e => setFormData({...formData, street2: e.target.value})} /></div>
                <Field label="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                <Field label="State" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                <Field label="Postal Code" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} />
                <Field label="Country" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
              </div>
            </div>
          )}

          {activeSection === "professional" && (
            <div>
              <h2 className="text-lg font-semibold text-slate-800 section-header mb-5">Professional</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Skills <span className="text-slate-400 normal-case font-normal">(comma separated)</span></label>
                  <input value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g. Design, JavaScript, Writing" />
                  {formData.skills && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.skills.split(",").map((s,i) => s.trim() && <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">{s.trim()}</span>)}
                    </div>
                  )}
                </div>
                <Field label="Availability" value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})} placeholder="e.g. Weekends, Evenings, Full-time" />
              </div>
            </div>
          )}

          {activeSection === "academics" && (
            <CollapsibleList
              title="Academics"
              items={formData.academics}
              fields={[
                {key:"title", label:"Degree / Course"},
                {key:"university", label:"University / Institution"},
                {key:"percentage", label:"Grade / Percentage / CGPA"},
                {key:"year", label:"Year"},
              ]}
              onAdd={() => setFormData({...formData, academics: [...formData.academics, {title:"",university:"",percentage:"",year:""}]})}
              onRemove={idx => setFormData({...formData, academics: formData.academics.filter((_,i) => i !== idx)})}
              onChange={updated => setFormData({...formData, academics: updated})}
            />
          )}

          {activeSection === "experiences" && (
            <CollapsibleList
              title="Experiences"
              items={formData.experiences}
              fields={[
                {key:"title", label:"Company / Organization"},
                {key:"role", label:"Role / Position"},
                {key:"description", label:"Description"},
                {key:"years", label:"Duration (Years)"},
              ]}
              onAdd={() => setFormData({...formData, experiences: [...formData.experiences, {title:"",role:"",description:"",years:""}]})}
              onRemove={idx => setFormData({...formData, experiences: formData.experiences.filter((_,i) => i !== idx)})}
              onChange={updated => setFormData({...formData, experiences: updated})}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={() => navigate("/profile")} className="w-full py-3 rounded-xl border border-slate-300 text-slate-600 font-semibold text-sm hover:bg-slate-100 transition flex-1">Cancel</button>
          <button onClick={handleUpdate} disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 flex-1 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>
                Saving...
              </span>
            ) : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Photo Upload Modal */}
      <Dialog open={photoModalOpen} onClose={() => setPhotoModalOpen(false)} className="fixed z-50 inset-0">
        <div className="flex items-center justify-center min-h-screen px-4" style={{background:"rgba(0,0,0,0.5)"}}>
          <Dialog.Panel className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <Dialog.Title className="text-lg font-semibold text-slate-800 mb-1 section-header">Change Photo</Dialog.Title>
            <p className="text-sm text-slate-500 mb-4">Upload a new profile picture</p>
            <label className="block w-full border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition">
              <div className="text-3xl mb-2">📷</div>
              <p className="text-sm font-medium text-slate-600">{photoFile ? photoFile.name : "Click to select image"}</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
              <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files[0])} className="hidden" />
            </label>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setPhotoModalOpen(false)} className="w-full py-3 rounded-xl border border-slate-300 text-slate-600 font-semibold text-sm hover:bg-slate-100 transition flex-1" style={{padding:"10px 20px"}}>Cancel</button>
              <button onClick={handlePhotoUpload} disabled={!photoFile || loading} className="btn-primary flex-1 disabled:opacity-50" style={{padding:"10px 20px"}}>
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Photo Preview Modal */}
      <Dialog open={photoPreviewOpen} onClose={() => setPhotoPreviewOpen(false)} className="fixed z-50 inset-0">
        <div className="flex h-screen w-screen items-center justify-center" style={{background:"rgba(0,0,0,0.9)"}}>
          <img src={user.profilePhoto} alt="" className="max-h-[80vh] max-w-[90vw] rounded-2xl" />
          <button onClick={() => setPhotoPreviewOpen(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
            <RxCross2 color="white" size={18} />
          </button>
        </div>
      </Dialog>
    </div>
  );
}

const Field = ({ label, value, onChange, disabled = false, placeholder = "" }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</label>
    <input
      value={value} onChange={onChange} disabled={disabled} placeholder={placeholder}
      className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    />
  </div>
);

const CollapsibleList = ({ title, items, fields, onAdd, onRemove, onChange }) => {
  const [openIndices, setOpenIndices] = useState(items.map(() => true));

  const toggleOpen = (idx) => {
    const n = [...openIndices]; n[idx] = !n[idx]; setOpenIndices(n);
  };
  const moveUp = (idx) => {
    if (idx === 0) return;
    const n = [...items]; [n[idx-1], n[idx]] = [n[idx], n[idx-1]]; onChange(n);
  };
  const moveDown = (idx) => {
    if (idx === items.length-1) return;
    const n = [...items]; [n[idx], n[idx+1]] = [n[idx+1], n[idx]]; onChange(n);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-slate-800 section-header">{title}</h2>
        <button onClick={onAdd} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Add {title.slice(0,-1)}
        </button>
      </div>

      {items.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-slate-400 text-sm">No {title.toLowerCase()} added yet</p>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 bg-slate-50">
              <span className="text-sm font-semibold text-slate-700">{title.slice(0,-1)} {idx+1}</span>
              <div className="flex gap-1">
                {[
                  {action: () => toggleOpen(idx), icon: openIndices[idx] ? "▲" : "▼", title: "Toggle"},
                  {action: () => moveUp(idx), icon: "↑", title: "Move up"},
                  {action: () => moveDown(idx), icon: "↓", title: "Move down"},
                ].map((b,i) => (
                  <button key={i} onClick={b.action} title={b.title}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-xs text-slate-500 hover:bg-slate-100 transition flex items-center justify-center">
                    {b.icon}
                  </button>
                ))}
                <button onClick={() => onRemove(idx)} className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 text-xs text-red-500 hover:bg-red-100 transition flex items-center justify-center">✕</button>
              </div>
            </div>
            {openIndices[idx] && (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fields.map(f => (
                  <div key={f.key} className={f.key === "description" ? "sm:col-span-2" : ""}>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{f.label}</label>
                    {f.key === "description" ? (
                      <textarea value={item[f.key]} rows={3}
                        onChange={e => { const u = [...items]; u[idx][f.key] = e.target.value; onChange(u); }}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none" />
                    ) : (
                      <input value={item[f.key]}
                        onChange={e => { const u = [...items]; u[idx][f.key] = e.target.value; onChange(u); }}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Search, User, X } from "lucide-react";
import { FaSearch } from "react-icons/fa";

export default function AllContacts() {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = sessionStorage.getItem("adminToken");

  const [contacts, setContacts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data.contacts);
      setFiltered(res.data.contacts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // SEARCH FILTER
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.message.toLowerCase().includes(q)
      )
    );
  }, [search, contacts]);

  return (
    <div className="mt-20 pb-10 bg-slate-100 min-h-screen">

      {/* HEADER */}
       <div className="bg-white px-8 py-4 shadow-sm sticky top-0 flex flex-col lg:flex-row gap-3 justify-between lg:items-center mb-6">
                  <h1 className="text-2xl font-bold flex items-center gap-2">
          <Mail className="text-indigo-600" size={28} />

                      Support inbox
                  </h1>
      
                      {/* SEARCH */}
                      <div className="relative">
                          <FaSearch className="absolute left-3 top-3 text-gray-400" />
                          <input
                              type="text"
                              placeholder="Search user email..."
                              className="pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                              onChange={(e) => setSearch(e.target.value)}
                          />
                      </div>
      
                    
              </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-xl mx-6 overflow-x-auto">

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No contact messages found.
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-gray-700 uppercase">
              <tr>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Message Preview</th>
                <th className="p-4 text-center">Date</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c._id}
                  onClick={() => setSelected(c)}
                  className="border-t hover:bg-indigo-50 cursor-pointer transition"
                >
                  <td className="p-4 flex items-center gap-2 font-medium">
                    <User size={16} />
                    {c.name}
                  </td>

                  <td className="p-4 text-indigo-600">{c.email}</td>

                  <td className="p-4 text-gray-600 truncate max-w-xs">
                    {c.message}
                  </td>

                  <td className="p-4 text-center text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MESSAGE MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-2xl w-[95%] md:w-[600px] p-6 relative">

            {/* CLOSE */}
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-4">Contact Message</h2>

            <div className="space-y-2">
              <p>
                <span className="font-semibold">Name:</span> {selected.name}
              </p>

              <p>
                <span className="font-semibold">Email:</span>{" "}
                <span className="text-indigo-600">{selected.email}</span>
              </p>

              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(selected.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="mt-4 p-4 bg-slate-100 rounded-lg whitespace-pre-wrap">
              {selected.message}
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex gap-3">
              <a
                href={`mailto:${selected.email}?subject=TimeBank Support Reply`}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
              >
                Reply via Email
              </a>

              <button
                onClick={() => setSelected(null)}
                className="bg-gray-300 px-5 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

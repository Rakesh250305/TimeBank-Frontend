import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes, FaUsers } from "react-icons/fa";
import defaultavatar from "../../assets/default-profile.webp";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function AllUsers() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openView, setOpenView] = useState(false);
    const [search, setSearch] = useState("");

    const token = sessionStorage.getItem("adminToken");

    const fetchUsers = async () => {
        const res = await axios.get(`${apiUrl}/api/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data.users)
        setUsers(res.data.users);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUser = users.filter((u) => {

        const user =
            `${u.firstName} ${u.lastName} ${u.email}`
                .toLowerCase();
        const keyword = search.toLowerCase();

        return (
            user.includes(keyword)
        );
    });

    return (
        <div className="mt-20">

            {/* headers */}
            <div className="bg-white px-8 py-4 shadow-sm sticky top-0 flex flex-col lg:flex-row gap-3 justify-between lg:items-center">
                <h1 className="text-2xl font-bold flex gap-2 items-center">
                    <FaUsers className="text-blue-500 " size={24} />
                    User Management
                </h1>

                {/* SEARCH */}
                <div className="relative">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search user name, email..."
                        className="pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-x-auto m-6">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-left">
                        <tr>
                            <th className="p-3">User</th>
                            <th>Skills</th>
                            <th>Credits</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUser.length === "0" ? (
                            <tr className="border-t hover:bg-indigo-50">
                                <td className="text-center">
                                    No user found
                                </td>
                            </tr>
                        ) : (
                            filteredUser.map((user) => (
                                <tr key={user._id} className="border-t hover:bg-indigo-50">

                                    <td className="p-3">
                                        <div className="font-semibold">
                                            {user.firstName} {user.lastName}
                                        </div>
                                        <div className="text-gray-500 text-xs">{user.email}</div>
                                    </td>

                                    <td>{user.skills?.join(", ")}</td>
                                    <td className="font-semibold text-blue-600">
                                        {user.wallet || 0}
                                    </td>

                                    <td>
                  <span className={`px-2 py-1 rounded-full text-xs
                    ${user?.isBanned === true
                      ? "bg-red-200 text-red-600"
                      : user?.isSuspended === true
                        ? "bg-yellow-200 text-yellow-600"
                        : "bg-green-200 text-green-600"
                    }
                  `}>
                    {user.isBanned ? "Banned" :
                      user.isSuspended ? "Suspend" : "Active"
                    }
                  </span>
                </td>

                                    <td>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>

                                    <td className="text-center space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setOpenView(true);
                                            }}
                                            className="bg-indigo-500 hover:bg-indigo-600 cursor-pointer text-white px-3 py-1 rounded-lg"
                                        >
                                            view
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}

                    </tbody>
                </table>
            </div>

            {/* ================= USER PROFILE MODAL ================= */}
            {openView && selectedUser && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto py-10">
                    <div className="bg-white rounded-xl w-[70vw] max-w-[95%] h-[80vh] p-0 shadow-2xl relative overflow-auto">

                        {/* Close Button */}
                        <button
                            onClick={() => setOpenView(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
                        >
                            <FaTimes />
                        </button>

                        {/* HEADER */}
                        <div className="bg-gray-900 text-white px-6 pt-10 pb-5 rounded-t-xl flex justify-between items-center">
                            <div className="flex gap-5 items-center">
                                <img className="h-12 w-12 border-2 border-gray-500 shadow rounded-full" src={selectedUser.profilePhoto || "https://ui-avatars.com/api/?name=" + selectedUser.firstName.slice(0, 1) + selectedUser.lastName.slice(0, 1)} alt="" />
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {selectedUser.firstName} {selectedUser.lastName}
                                    </h2>
                                    <p className="text-sm text-gray-300">{selectedUser.email}</p>
                                </div>
                            </div>


                            <div className="text-right">
                                <p className="text-sm">Joined</p>
                                <p className="font-semibold">
                                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* BODY */}
                        <div className="p-6">

                            {/* Top */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                                {/* LEFT COLUMN */}
                                <div className="space-y-5">
                                    {/* Account Info */}
                                    <div className="bg-gray-50 p-4 rounded-lg border">
                                        <h3 className="font-bold mb-2">Account Information</h3>
                                        <p><b>Phone:</b> {selectedUser.phone}</p>
                                        <p><b>Credits (Wallet):</b> ₹ {selectedUser.wallet || 0}</p>
                                        <p><b>Trust Score:</b> {selectedUser.trustScore?.toFixed(2) || 0}</p>
                                        <p>
                                            <b>Status:</b>{" "}
                                            {selectedUser.isBlocked ? (
                                                <span className="text-red-600 font-semibold">Suspended</span>
                                            ) : (
                                                <span className="text-green-600 font-semibold">Active</span>
                                            )}
                                        </p>
                                        <p><b>Availability:</b> {selectedUser.availability || "Not Set"}</p>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN */}
                                <div className="space-y-5">
                                    {/* Address */}
                                    {selectedUser.address && (
                                        <div className="bg-gray-50 p-4 rounded-lg border">
                                            <h3 className="font-bold mb-2">Address</h3>
                                            {selectedUser.address.street1},
                                            {selectedUser.address.street2?.length > 0 && (<span>{selectedUser.address.street2}, </span>)}
                                            {selectedUser.address.city}, {selectedUser.address.state}, {selectedUser.address.country} - {selectedUser.address.postalCode}
                                        </div>
                                    )}

                                    {/* Skills */}
                                    <div className="bg-gray-50 p-4 rounded-lg border">
                                        <h3 className="font-bold mb-2">Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedUser.skills?.map((skill, i) => (
                                                <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* bottom */}
                            <div className="space-y-2 w-full">
                                {/* Bio */}
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                    <h3 className="font-bold mb-2">Bio</h3>
                                    <p className="text-sm text-gray-700">
                                        {selectedUser.bio || "No bio provided"}
                                    </p>
                                </div>


                                {/* Academics */}
                                {selectedUser.academics?.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg border">
                                        <h3 className="font-bold mb-2">Education</h3>
                                        {selectedUser.academics.map((edu, index) => (
                                            <div key={index} className="mb-2 text-sm">

                                                <p className="font-semibold"><span>{index + 1}. </span>{edu.title}</p>
                                                <p className="ml-4">{edu.university} ({edu.year})</p>
                                                <p className="ml-4">Percentage: {edu.percentage}%</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Experience */}
                                {selectedUser.experiences?.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg border">
                                        <h3 className="font-bold mb-2">Experience</h3>
                                        {selectedUser.experiences.map((exp, index) => (
                                            <div key={index} className="mb-2 text-sm">
                                                <p className="font-semibold"><span>{index + 1}. </span>{exp.title}</p>
                                                <p className="ml-4">{exp.years} years</p>
                                                <p className="text-gray-600 ml-4">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Reviews */}
                                {selectedUser.reviews?.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg border max-h-[250px] overflow-y-auto">
                                        <h3 className="font-bold mb-2">
                                            Reviews ({selectedUser.reviews.length})
                                        </h3>

                                        {selectedUser.reviews.slice(-0).reverse().map((review, i) => (
                                            <div key={i} className="border-b py-2 text-sm">
                                                <h3 className="font-semibold">{i + 1}. Service: {review.serviceTitle}</h3>
                                                <p className="text-gray-600 ml-3">
                                                    ⭐ {review.rating} - {review.comment}
                                                </p>
                                                <p className="font-semibold text-gray-700 flex items-center gap-1 ml-3">
                                                    <img
                                                        src={review.profilePhoto || defaultavatar}
                                                        alt="Reviewer"
                                                        className="w-4 h-4 rounded-full object-cover"
                                                    />
                                                    {review.createdBy || "Anonymous"}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                </div>
            )}

        </div>
    );
}

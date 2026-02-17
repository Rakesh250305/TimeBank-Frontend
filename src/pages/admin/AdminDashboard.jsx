import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaUsers,
    FaTools,
    FaExchangeAlt,
    FaEnvelope,
    FaFlag,
    FaUserCircle
} from "react-icons/fa";

export default function AdminDashboard() {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        users: 0,
        services: 0,
        transactions: 0,
        contacts: 0,
        reports: 0,
    });

    const [users, setUsers] = useState([]);

    const token = sessionStorage.getItem("adminToken");

    /* ================= PROTECT ROUTE ================= */
    useEffect(() => {
        if (!token) navigate("/admin/login");
    }, []);

    /* ================= FETCH ANALYTICS ================= */
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/admin/analytics`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStats(res.data.stats);
            } catch (err) {
                console.log(err);
            }
        };
        fetchDashboard();
    }, []);

    /* ================= FETCH USERS ================= */
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(res.data.users);
            } catch (err) {
                console.log(err);
            }
        };
        fetchUsers();
    }, []);

    /* ================= STAT CARD COMPONENT ================= */
    const StatCard = ({ title, value, icon, color }) => (
        <div className={`p-6 rounded-2xl shadow-md text-white ${color} hover:scale-[1.02] transition`}> <div className="flex items-center justify-between"> <div> <p className="text-sm opacity-80">{title}</p> <h2 className="text-3xl font-bold mt-1">{value}</h2> </div> <div className="text-4xl opacity-80">{icon}</div> </div> </div>
    );

    return (<div className="min-h-screen bg-gray-100">


        {/* TOP NAVBAR */}
        <div className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-40">
            <h1 className="text-2xl font-bold text-indigo-700">
                TimeBank Admin Panel
            </h1>

            <div className="flex items-center gap-4">
                <span className="text-gray-500 hidden md:block">Super Admin</span>
                <FaUserCircle className="text-3xl text-gray-600" />
            </div>
        </div>

        {/* MAIN */}
        <div className="p-8">

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">

                <StatCard
                    title="Users"
                    value={stats.users}
                    icon={<FaUsers />}
                    color="bg-gradient-to-r from-indigo-500 to-indigo-700"
                />

                <StatCard
                    title="Services"
                    value={stats.services}
                    icon={<FaTools />}
                    color="bg-gradient-to-r from-blue-500 to-blue-700"
                />

                <StatCard
                    title="Transactions"
                    value={stats.transactions}
                    icon={<FaExchangeAlt />}
                    color="bg-gradient-to-r from-green-500 to-green-700"
                />

                <StatCard
                    title="Contacts"
                    value={stats.contacts}
                    icon={<FaEnvelope />}
                    color="bg-gradient-to-r from-yellow-500 to-orange-500"
                />

                <StatCard
                    title="Reports"
                    value={stats.reports}
                    icon={<FaFlag />}
                    color="bg-gradient-to-r from-red-500 to-red-700"
                />

            </div>

            {/* QUICK ACTIONS */}
            <div className="grid md:grid-cols-4 gap-6 mb-10">

                <button
                    onClick={() => navigate("/admin/services")}
                    className="bg-white p-5 rounded-xl shadow hover:shadow-lg cursor-pointer transition text-left"
                >
                    <h3 className="font-semibold text-lg text-indigo-700">Service Moderation</h3>
                    <p className="text-gray-500 text-sm mt-1">
                        Review suspicious services & resolve disputes
                    </p>
                </button>

                <button
                    onClick={() => navigate("/admin/reports")}
                    className="bg-white p-5 rounded-xl shadow hover:shadow-lg cursor-pointer transition text-left"
                >
                    <h3 className="font-semibold text-lg text-red-600">User Reports</h3>
                    <p className="text-gray-500 text-sm mt-1">
                        Ban, warn or review reported users
                    </p>
                </button>

                <button
                    onClick={() => navigate("/admin/transactions")}
                    className="bg-white p-5 rounded-xl shadow hover:shadow-lg cursor-pointer transition text-left"
                >
                    <h3 className="font-semibold text-lg text-green-600">Transactions</h3>
                    <p className="text-gray-500 text-sm mt-1">
                        Monitor credits and suspicious activity
                    </p>
                </button>

                <button
                    onClick={() => navigate("/admin/broadcast")}
                    className="bg-white p-5 rounded-xl shadow hover:shadow-lg cursor-pointer transition text-left"
                >
                    <h3 className="font-semibold text-lg text-blue-600">Broadcast</h3>
                    <p className="text-gray-500 text-sm mt-1">
                        Send message or credits to all users
                    </p>
                </button>

            </div>

            {/* RECENT USERS */}
            <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-semibold mb-6">Recently Registered Users</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b text-gray-500">
                            <tr>
                                <th className="py-3">User</th>
                                <th>Skills</th>
                                <th>Bio</th>
                                <th>Joined</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.slice(0, 3).map((user) => (
                                <tr key={user._id} className="border-b hover:bg-gray-50">

                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.profilePhoto || "https://ui-avatars.com/api/?name=" + user.firstName.slice(0,1) + user.lastName.slice(0,1)}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-semibold">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <p className="text-gray-500 text-xs">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="text-gray-600">
                                        {user.skills?.length
                                            ? user.skills.slice(0, 3).join(", ")
                                            : "—"}
                                    </td>

                                    <td className="text-gray-500 max-w-xs truncate">
                                        {user.bio || "No bio"}
                                    </td>

                                    <td className="text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>


    );
}

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/admin/Navbar";

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

    // protect route
    useEffect(() => {
        if (!token) navigate("/admin/login");
    }, []);

    // fetch dashboard data
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/admin/analytics`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = res.data
                setStats(data.stats);
            } catch (err) {
                console.log(err);
            }
        };
        fetchDashboard();

    }, []);

        useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(res);
                setUsers(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchUsers();
    }, []);

    return (<div className="min-h-screen bg-gray-100 flex">
        <Navbar token={token} />

        {/* MAIN CONTENT */}
        <div className="flex-1 p-8">

            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500">Total Users</h3>
                    <p className="text-3xl font-bold">{stats.users}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500">Total Services</h3>
                    <p className="text-3xl font-bold">{stats.services}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500">Transactions</h3>
                    <p className="text-3xl font-bold">{stats.transactions}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500">Contacts</h3>
                    <p className="text-3xl font-bold">{stats.contacts}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500">Reports</h3>
                    <p className="text-3xl font-bold">{stats.reports}</p>
                </div>
            </div>

            {/* USERS REGISTERED */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">New User Registered</h2>

                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2">S.No</th>
                            <th>Name</th>
                            <th>Skills</th>
                            <th>Bio</th>
                            <th>Join On</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.slice(0, 3).map((item, index) => (
                            <tr key={item._id} className="border-b">
                                <td>{index + 1}</td>
                                <td className="py-3">
                                    <p>{item.firstName} {item.lastName}</p>
                                    <small>{item.email}</small>
                                </td>
                                <td>{item.skills?.join(', ')}</td>
                                <td className="font-semibold">{item.bio}</td>
                                <td>{new Date(item.createdAt).toUTCString().split(' ').slice(0, 4).join(' ')}</td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    </div>

    );
}

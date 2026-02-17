import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowDown, FaArrowUp, FaCoins, FaExchangeAlt, FaSearch } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function AdminTransactions() {
const navigate = useNavigate();
const [transactions, setTransactions] = useState([]);
const [filter, setFilter] = useState("all");
const [search, setSearch] = useState("");
const [openModal, setOpenModal] = useState(false);
const [selectedTx, setSelectedTx] = useState(null);

/* ================= FETCH ================= */
useEffect(() => {
    const token = sessionStorage.getItem("adminToken");

    const fetchTransactions = async () => {
        try {
            const res = await axios.get(`${apiUrl}/api/admin/transactions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTransactions(res.data.transactions);
        } catch (err) {
            console.error(err);
        }
    };
    fetchTransactions();
}, []);

/* ================= FILTER ================= */
const filteredTransactions = transactions
    .filter((t) => (filter === "all" ? true : t.type === filter))
    .filter((t) =>
        t.user?.email?.toLowerCase().includes(search.toLowerCase())
    );

/* ================= ANALYTICS ================= */
const total = transactions.length;
const earn = transactions.filter((t) => t.type === "earn").length;
const spend = transactions.filter((t) => t.type === "spend").length;

return (
    <div className="min-h-screen bg-gray-100 mt-20">

        {/* HEADER */}
        <div className="bg-white px-8 py-4 shadow-sm sticky top-0 flex flex-col lg:flex-row gap-3 justify-between lg:items-center">
            <h1 className="text-xl lg:text-2xl font-bold flex gap-2 items-center">
                <FaExchangeAlt className="text-blue-500" size={24}/>
                Transactions Control Center
            </h1>

            <div className="flex gap-3 items-center">

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

                {/* FILTER */}
                <select
                    className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="earn">Earn</option>
                    <option value="spend">Spend</option>
                </select>
            </div>
        </div>

        <div className="p-8">

            {/* METRIC CARDS */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">

                <div className="bg-indigo-500 text-white p-4 rounded-2xl shadow"><p>Total Transactions</p>
                    <h2 className="text-3xl font-bold">{total}</h2>
                    <FaCoins className="text-4xl opacity-70 mt-2" />
                </div>

                <div className="bg-green-500 text-white p-4 rounded-2xl shadow">
                    <p className="opacity-80">Earn Credits</p>
                    <h2 className="text-3xl font-bold">{earn}</h2>
                    <FaArrowUp className="text-4xl opacity-70 mt-2" />
                </div>

                <div className="bg-red-500 text-white p-4 rounded-2xl shadow">
                    <p className="opacity-80">Spend Credits</p>
                    <h2 className="text-3xl font-bold">{spend}</h2>
                    <FaArrowDown className="text-4xl opacity-70 mt-2" />
                </div>

            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs text-left">
                        <tr>
                            <th className="p-4 text-center">User</th>
                            <th>Description</th>
                            <th className="text-center">Amount</th>
                            <th className="text-center">Type</th>
                            <th className="text-center">Date</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredTransactions.map((tx) => {

                            return (
                                <tr key={tx._id} className="border-t hover:bg-indigo-50 transition">

                                    {/* USER */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={
                                                    tx.user?.profilePhoto ||
                                                    "https://ui-avatars.com/api/?name="+ tx.user?.firstName.slice(0,1) + tx.user?.lastName.slice(0,1)
                                                }
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-semibold">
                                                    {tx.user?.firstName} {tx.user?.lastName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {tx.user?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="text-gray-600">{tx.description}</td>

                                    {/* AMOUNT */}
                                    <td className={`text-center font-bold ${tx.type === "earn"
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`}>
                                        {tx.type === "earn" ? "+" : "-"} {tx.amount}
                                    </td>

                                    {/* TYPE BADGE */}
                                    <td className="text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                            ${tx.type === "earn"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}>
                                            {tx.type}
                                        </span>
                                    </td>

                                    <td className="text-center text-gray-500">
                                        {new Date(tx.createdAt).toLocaleString()}
                                    </td>

                                    <td className="text-center">
                                        <button
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-lg"
                                            onClick={() => {
                                                setSelectedTx(tx);
                                                setOpenModal(true);
                                            }}
                                        >
                                            view
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>

        {/* INVESTIGATION MODAL */}
        {openModal && selectedTx && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                <div className="bg-white rounded-2xl shadow-2xl w-[650px] p-7 relative">

                    <button
                        onClick={() => setOpenModal(false)}
                        className="absolute right-5 top-4 text-xl text-gray-500 hover:text-red-500"
                    >
                        ✕
                    </button>

                    <h2 className="text-2xl font-bold mb-6">
                        Transaction Investigation
                    </h2>

                    {/* USER CARD */}
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-6">
                        <div className="flex items-center gap-4">
                            <img
                                src={selectedTx.user?.profilePhoto ||
                                    `https://ui-avatars.com/api/?name=${selectedTx.user?.firstName}`}
                                className="w-14 h-14 rounded-full"
                            />
                            <div>
                                <p className="font-semibold text-lg">
                                    {selectedTx.user?.firstName} {selectedTx.user?.lastName}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {selectedTx.user?.email}
                                </p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400">
                            ID: {selectedTx.user?._id}
                        </span>
                    </div>

                    {/* DETAILS */}
                    <div className="space-y-3 mb-6">

                        <div className="flex justify-between">
                            <span className="text-gray-500">Amount</span>
                            <span className={`font-bold text-lg ${selectedTx.type === "earn"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}>
                                {selectedTx.type === "earn" ? "+" : "-"} {selectedTx.amount} credits
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Type</span>
                            <span className="font-semibold">{selectedTx.type}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Date</span>
                            <span>{new Date(selectedTx.createdAt).toLocaleString()}</span>
                        </div>

                        <div>
                            <p className="text-gray-500 mb-1">Description</p>
                            <div className="bg-gray-100 p-3 rounded-lg text-sm">
                                {selectedTx.description}
                            </div>
                        </div>
                    </div>

                    {/* ACTION */}
                    <button
                        onClick={() => navigate(`/applicant/${selectedTx.user._id}`)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold"
                    >
                        Open User Profile
                    </button>

                </div>
            </div>
        )}
    </div>
);

}

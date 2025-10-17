import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Transactions({ token }) {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        // "http://localhost:5000/api/transactions",
        "https://timebank-backend-67l5.onrender.com/api/transactions", 
        {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    if (token) fetchTransactions();
  }, [token]);

  return (
   <div className="min-h-screen bg-gray-100">
    <Navbar token={token} />
    <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-600 mt-20 mb-4">Transaction History</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {transactions.map((tx) => (
              <li key={tx._id} className="flex justify-between py-3">
                <div>
                  <p className="font-medium">
                    {tx.type === "earn" ? "✅ Earned" : "💸 Spent"} {tx.amount} credits
                  </p>
                  <p className="text-sm text-gray-500">{tx.description}</p>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(tx.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
   </div>
  );
}

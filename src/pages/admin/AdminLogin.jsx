import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showCustomToast } from "../../utils/toast";

export default function AdminLogin() {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(`${apiUrl}/api/admin/login`, 
                { username, password }
            );

            const data = res.data;
            if (data.success) {
                sessionStorage.setItem("adminToken", data.token);
                navigate("/admin/dashboard");
                showCustomToast(
                        "success",
                        data.message || "Login successful",
                        "Admin login successful"
                      );
            } else {
                showCustomToast(
                        "warning",
                         data.message || "Invalid username or password",
                        "Admin login failed"
                      );
            }
        } catch (err) {
            showCustomToast(
                        "error",
                         err.response?.data?.message || "Server error. Try again.",
                        "Admin login error"
                      );
        } finally {
            setLoading(false);
        }

    };

    return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black px-4">
        {/* CARD */}
        <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">

            {/* LEFT PANEL */}
            <div className="md:w-1/2 bg-blue-600 text-white p-10 flex flex-col justify-center">
                <h1 className="text-4xl font-bold mb-4">TimeBank Admin</h1>
                <p className="text-lg text-blue-100 leading-relaxed">
                    Secure access to the administration dashboard.
                    Manage users, monitor services, approve requests
                    and control the entire platform from one place.
                </p>
            </div>

            {/* RIGHT PANEL */}
            <form
                onSubmit={handleLogin}
                className="md:w-1/2 p-8 md:p-12 text-white flex flex-col justify-center"
            >
                <h2 className="text-3xl font-semibold mb-6 text-center">
                    Admin Login
                </h2>

                {/* USERNAME */}
                <div className="mb-4">
                    <label className="block text-sm mb-1 text-gray-300">
                        Username
                    </label>
                    <input
                        type="text"
                        required
                        placeholder="Enter admin username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-500/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                </div>

                {/* PASSWORD */}
                <div className="mb-6">
                    <label className="block text-sm mb-1 text-gray-300">
                        Password
                    </label>
                    <input
                        type="password"
                        required
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-500/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                </div>

                {/* BUTTON */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition duration-300
        ${loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                        }`}
                >
                    {loading ? "Logging in..." : "Login to Dashboard"}
                </button>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Authorized personnel only. All activities are monitored.
                </p>
            </form>
        </div>
    </div>

    );
}

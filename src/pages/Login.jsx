import { useState } from "react";
import { login } from "../api/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import login_bg from "../assets/login_page_bg.png";

export default function Login({ setToken }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, email: form.email.toLowerCase() };
      const res = await login(payload);

      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="flex justify-center items-center min-h-screen bg-cover bg-bottom"
        style={{
          backgroundImage: `url(${login_bg})`,
        }}
      >
        <div className="bg-gray-800 shadow-2xl p-5 max-w-4xl w-[60%] text-white">
          <div>
            <h1 className="text-4xl font-bold text-center mb-2 text-blue-500">
            TimeBank
          </h1>
          <p className="text-center text-gray-300 mb-8">
            A place to share your skills and help others grow
          </p>
          </div>

          <div className="flex flex-row">

          <div className="flex flex-col gap-5 w-[50%] border-r-1 border-gray-500 p-5">
            <p className="text-s">By continuing you indicate that you agree to Quora’s <a className="text-blue-500 hover:underline underline-offset-2" href="/terms">Terms of Service</a> and <a className="text-blue-500 hover:underline underline-offset-2" href="/privacy">Privacy Policy</a>.</p>
            <button className="flex items-center justify-center gap-3 bg-gray-900 border-gray-700 border-1 text-white p-3 rounded-lg hover:bg-gray-700 transition">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>
            <button className="flex items-center justify-center gap-3 bg-gray-900 border-gray-700 border-1 text-white p-3 rounded-lg hover:bg-gray-700 transition">
              <img
                src="https://www.svgrepo.com/show/448224/facebook.svg"
                alt="Facebook"
                className="w-5 h-5"
              />
              Continue with Facebook
            </button>
            <p className="text-sm text-center mt-6 text-gray-300">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-500 font-semibold cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>
          </div>

           <form className="flex flex-col w-[50%] px-5" onSubmit={handleSubmit}>
            <h2 className="border-b-1 py-2 border-gray-500">Login</h2>
            <h2 className="py-2">Email</h2>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={form.email}
              onChange={handleChange}
              className="p-3 mb-2 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
              required
            />
            <h2 className="py-2">Password</h2>
            <input
              type="password"
              name="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              className="p-3 mb-5 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="text-s flex justify-center mt-2 text-gray-400">Forgot Password?</p>
          </form>
          </div>
        <div className="mt-10 text-center text-gray-400 text-xs border-t-1 border-gray-500 pt-5">
          <span>About</span>
          <span className="mx-2">|</span>
          <span>Features</span>
          <span className="mx-2">|</span>
          <span>Privacy Policy</span>
          <span className="mx-2">|</span>
          <span>Terms & Conditions</span>
          <span className="mx-2">|</span>
          <span>Contact</span>
          <span className="mx-2">|</span>
          <span>© TimeBank, Inc. 2025</span>
          </div>
          
        </div>
      </div>
    </>
  );
}

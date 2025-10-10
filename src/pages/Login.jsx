import { useState } from "react";
import { login } from "../api/api";
import { useNavigate } from "react-router-dom";
import login_bg from "../assets/login_page_bg.png";
import googleLogo from '../assets/Google_logo.png'
import microsoftLogo from "../assets/Microsoft-logo.png";

export default function Login({ setToken }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error , setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = { ...form, email: form.email.toLowerCase() };
      const res = await login(payload);

      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed, please try again.");
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
        <div className="bg-gray-800 shadow-2xl p-5 max-w-4xl w-[90%] lg:w-[60%] my-[10%] lg:my-0 text-white">
          <div>
            <h1 className="lg:text-4xl text-2xl font-bold text-center mb-2 text-blue-500">
              TimeBank
            </h1>
            <p className="text-center text-gray-300 mb-8">
              A place to share your skills and help others grow
            </p>
          </div>

          <div className="flex lg:flex-row flex-col">
            {/* left info */}
            <form
              className="flex flex-col w-full lg:w-[50%] lg:px-5 gap-1"
              onSubmit={handleSubmit}
            >
              <h2 className="border-b-1 py-2 border-gray-500 text-xl font-bold">Login</h2>
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
              <p className="text-s flex justify-center mt-2 text-gray-400">
                Forgot Password?
              </p>

              {error && (
  <p className="text-red-500 text-sm text-center mt-2">{error}</p>
)}
            </form>

            {/* right Form */}
            <div className="flex flex-col gap-5 lg:gap-10 w-full lg:w-[50%] lg:border-l-1 border-t lg:border-t-0 border-gray-600 pt-5 lg:p-5 mt-5 lg:mt-0">
              <p className="text-sm lg:block hidden">
                By continuing you indicate that you agree to TimeBank's{" "}
                <a
                  className="text-blue-500 hover:underline underline-offset-2"
                  href="/terms"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  className="text-blue-500 hover:underline underline-offset-2"
                  href="/privacy"
                >
                  Privacy Policy
                </a>
                .
              </p>
              <button className="flex items-center justify-center gap-3 bg-gray-900 border-gray-700 border text-white p-3 rounded-lg hover:bg-gray-700 transition">
                <img
                  src={googleLogo}
                  alt="Google"
                  className="w-5 h-5"
                />
                <p className="text-sm">Continue with Google</p>
              </button>
              <button className="flex items-center justify-center gap-3 bg-gray-900 border-gray-700 border text-white p-3 rounded-lg hover:bg-gray-700 transition">
                <img
                  src={microsoftLogo}
                  alt="Microsoft"
                  className="w-5 h-5"
                />
                <p className="text-sm">Continue with Microsoft</p>
              </button>
              <p className="text-sm text-center lg:mt-6 text-gray-300">
                Don’t have an account?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  className="text-blue-500 font-semibold cursor-pointer hover:underline"
                >
                  Sign up
                </span>
              </p>
            </div>
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

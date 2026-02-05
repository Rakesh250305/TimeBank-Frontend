import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import login_bg from "../assets/login_page_bg.png";
import googleLogo from "../assets/Google_logo.png";
import microsoftLogo from "../assets/Microsoft-logo.png";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(0);
    const [sendLoading, setSendLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const sendOtp = async () => {
        try {
            setSendLoading(true);
            await axios.post(`${apiUrl}/api/auth/forgot-password/send-otp`, { email });
            setOtpSent(true);
            setTimer(120);
        } catch (err) {
            setError(err.response?.data?.message);
        } finally {
            setSendLoading(false);
        }
    };

    const verifyOtp = async () => {
        try {
            setLoading(true);
            await axios.post(`${apiUrl}/api/auth/forgot-password/verify-otp`, {
                email,
                otp,
            });
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async () => {
        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${apiUrl}/api/auth/forgot-password/reset`, {
                email,
                password,
            });
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let countdown;
        if (!otpSent || timer <= 0) return;
        if (otpSent && timer > 0) {
            countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }

        return () => clearInterval(countdown);
    }, [otpSent, timer]);

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
                        <div className="flex flex-col w-full lg:w-[50%] lg:px-5 gap-1">
                            <h2 className="border-b-1 py-2 border-gray-500 text-xl font-bold">
                                Reset Password
                            </h2>
                            {step === 1 && (
                                <div className="flex flex-col gap-3 mt-3">
                                    <h2 className="py-2">Email</h2>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Registered Email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="p-3 mb-2 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
                                        required
                                    />

                                    {!otpSent ? (
                                        <button
                                            onClick={sendOtp}
                                            disabled={loading}
                                            className="bg-blue-600 py-2 rounded-lg hover:bg-blue-800 transition"
                                        >
                                            {sendLoading ? "Sending OTP..." : "Send OTP"}
                                        </button>
                                    ) : (
                                        <>
                                            <h2 className="py-2">Enter OTP</h2>
                                            <input
                                                type="text"
                                                placeholder="O T P"
                                                required
                                                onChange={(e) => setOtp(e.target.value)}
                                        className="p-3 mb-2 rounded-lg bg-gray-900 text-center tracking-widest text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"                                            />

                                            <button
                                                onClick={verifyOtp}
                                                disabled={loading}
                                                className="bg-green-600 py-2 rounded-lg hover:bg-green-700 transition"
                                            >
                                                {sendLoading ? "Sending" : (
                                                    <>
                                                    {loading ? "Verifying..." : "Verify & Continue"}
                                                    </>
                                                )}
                                            </button>

                                            {/* Countdown Timer & Resend Button */}
                                            <div className="text-sm mt-2 text-gray-300 flex justify-between items-center">
                                                {timer > 0 ? (
                                                    <span>
                                                        Resend available in: {Math.floor(timer / 60)}:
                                                        {String(timer % 60).padStart(2, "0")}
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={sendOtp}
                                                        className="text-blue-500 font-semibold hover:underline"
                                                    >
                                                        Resend OTP
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )} 
                                </div>
                            )}    

                            {step === 2 && (
                                        <>
                                            <h2 className="py-2">New Password</h2>
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="p-3 mb-2 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
                                                required
                                            />
                                            <h2 className="py-2">Confirm Password</h2>
                                            <input
                                                type="password"
                                                placeholder="Confirm Password"
                                                onChange={(e) => setConfirm(e.target.value)}
                                                className="p-3 mb-2 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700"
                                                required
                                            />
                                            <button
                                                disabled={loading}
                                                className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition"
                                                onClick={resetPassword}>
                                                {loading ? "Updating..." : "Reset Password"}
                                            </button>
                                        </>
                            )}
                            {error && (
                                <p className="text-red-500 text-sm text-center mt-2">{error}</p>
                            )}
                        </div>

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
                                    <img src={googleLogo} alt="Google" className="w-5 h-5" />
                                    <p className="text-sm">Continue with Google</p>
                                </button>
                                <button className="flex items-center justify-center gap-3 bg-gray-900 border-gray-700 border text-white p-3 rounded-lg hover:bg-gray-700 transition">
                                    <img src={microsoftLogo} alt="Microsoft" className="w-5 h-5" />
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

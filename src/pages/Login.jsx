import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

function Login() {
    const navigate = useNavigate();

    // Step: "login" or "otp"
    const [step, setStep] = useState("login");
    const [form, setForm] = useState({ email: "", password: "" });
    const [otpCode, setOtpCode] = useState("");
    const [otpToken, setOtpToken] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [riskInfo, setRiskInfo] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ── Step 1: Login ──
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await API.post("/auth/login", form);
            const data = res.data;

            if (data.action === "require_otp") {
                // Save otp_token for verification step
                setOtpToken(data.otp_token);
                setStep("otp");
            } else {
                // Direct login success
                localStorage.setItem("token", data.access_token);
                setRiskInfo(data.risk_assessment);
                navigate("/dashboard");
            }

        } catch (err) {
            const detail = err.response?.data?.detail;
            if (typeof detail === "object") {
                setError(detail.message || "Login blocked.");
            } else {
                setError(detail || "Login failed. Try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // ── Step 2: Verify OTP ──
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await API.post("/auth/verify-otp", {
                otp_token: otpToken,
                otp_code: otpCode
            });

            localStorage.setItem("token", res.data.access_token);
            navigate("/dashboard");

        } catch (err) {
            setError(err.response?.data?.detail || "Invalid OTP. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <span className="text-4xl">{step === "otp" ? "📧" : "🔐"}</span>
                    <h1 className="text-2xl font-bold mt-2">
                        {step === "otp" ? "Verify Your Identity" : "Welcome Back"}
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {step === "otp"
                            ? "Enter the 6-digit code sent to your email"
                            : "Login to your account"}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

                    {/* Error */}
                    {error && (
                        <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {/* ── Login Form ── */}
                    {step === "login" && (
                        <form onSubmit={handleLogin} className="flex flex-col gap-5">

                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="pawan@gmail.com"
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg py-3 font-medium transition mt-2"
                            >
                                {loading ? "Analyzing risk..." : "Login"}
                            </button>

                        </form>
                    )}

                    {/* ── OTP Form ── */}
                    {step === "otp" && (
                        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">

                            {/* OTP notice */}
                            <div className="bg-yellow-900/30 border border-yellow-700/50 text-yellow-300 text-sm px-4 py-3 rounded-lg">
                                ⚠️ Suspicious activity detected. Please verify via OTP sent to your email.
                            </div>

                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">
                                    6-Digit OTP Code
                                </label>
                                <input
                                    type="text"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    placeholder="482910"
                                    maxLength={6}
                                    required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-center tracking-widest text-lg focus:outline-none focus:border-indigo-500 transition"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg py-3 font-medium transition"
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setStep("login"); setError(""); }}
                                className="text-sm text-gray-400 hover:text-white text-center transition"
                            >
                                ← Back to Login
                            </button>

                        </form>
                    )}

                    {/* Links */}
                    {step === "login" && (
                        <div className="mt-6 space-y-2">
                            <p className="text-center text-gray-400 text-sm">
                                Don't have an account?{" "}
                                <Link to="/signup" className="text-indigo-400 hover:underline">
                                    Sign up
                                </Link>
                            </p>
                            <p className="text-center text-gray-400 text-sm">
                                Already logged in?{" "}
                                <Link to="/dashboard" className="text-indigo-400 hover:underline">
                                    Go to Dashboard
                                </Link>
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Login;
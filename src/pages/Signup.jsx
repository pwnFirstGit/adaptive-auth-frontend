import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await API.post("/auth/signup", form);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.detail || "Signup failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <span className="text-4xl">🔐</span>
                    <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Sign up to experience adaptive authentication
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

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {/* Email */}
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

                        {/* Password */}
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

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg py-3 font-medium transition mt-2"
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>

                    </form>

                    {/* Login link */}
                    <p className="text-center text-gray-400 text-sm mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-400 hover:underline">
                            Login
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}

export default Signup;
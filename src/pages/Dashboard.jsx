import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function getRiskColor(score) {
    if (score === 0) return "text-green-400";
    if (score <= 30) return "text-yellow-400";
    if (score <= 70) return "text-orange-400";
    return "text-red-400";
}

function getRiskLabel(score) {
    if (score === 0) return "✅ Safe";
    if (score <= 30) return "⚠️ Low Risk";
    if (score <= 70) return "🚨 Medium Risk";
    return "🔴 High Risk";
}

function getRiskBadge(score) {
    if (score === 0) return "bg-green-900/40 border-green-700 text-green-300";
    if (score <= 30) return "bg-yellow-900/40 border-yellow-700 text-yellow-300";
    if (score <= 70) return "bg-orange-900/40 border-orange-700 text-orange-300";
    return "bg-red-900/40 border-red-700 text-red-300";
}

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [userRes, historyRes] = await Promise.all([
                API.get("/user/me"),
                API.get("/user/me/login-history")
            ]);
            setUser(userRes.data);
            setHistory(historyRes.data);
        } catch (err) {
            setError("Session expired. Please login again.");
            localStorage.removeItem("token");
            setTimeout(() => navigate("/login"), 2000);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">🔐</div>
                    <p className="text-gray-400">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
                <div className="text-center text-red-400">{error}</div>
            </div>
        );
    }

    // Stats
    const totalLogins = history.length;
    const avgRisk = totalLogins > 0
        ? (history.reduce((sum, h) => sum + h.risk_score, 0) / totalLogins).toFixed(1)
        : 0;
    const highRiskCount = history.filter(h => h.risk_score >= 70).length;

    return (
        <div className="min-h-screen bg-gray-950 text-white">

            {/* Navbar */}
            <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🔐</span>
                    <span className="font-bold text-lg">AdaptiveAuth</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">{user?.email}</span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm border border-gray-700 hover:border-gray-500 rounded-lg transition"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-6 py-10">

                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Welcome back 👋</h1>
                    <p className="text-gray-400 mt-1">{user?.email}</p>
                    <p className="text-gray-600 text-sm mt-1">
                        Member since {new Date(user?.created_at).toLocaleDateString()}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    {[
                        {
                            label: "Total Logins",
                            value: totalLogins,
                            icon: "🔑",
                            color: "text-indigo-400"
                        },
                        {
                            label: "Average Risk Score",
                            value: avgRisk,
                            icon: "📊",
                            color: avgRisk > 30 ? "text-orange-400" : "text-green-400"
                        },
                        {
                            label: "High Risk Logins",
                            value: highRiskCount,
                            icon: "🚨",
                            color: highRiskCount > 0 ? "text-red-400" : "text-green-400"
                        }
                    ].map((stat, i) => (
                        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                            <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Login History */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl">

                    <div className="px-6 py-4 border-b border-gray-800">
                        <h2 className="font-semibold text-lg">Recent Login History</h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Your last {history.length} login attempts with risk analysis
                        </p>
                    </div>

                    {history.length === 0 ? (
                        <div className="px-6 py-10 text-center text-gray-500">
                            No login history yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-800">
                            {history.map((h, i) => (
                                <div key={i} className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">

                                    {/* Left side */}
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-400">🕐</span>
                                            <span>{new Date(h.login_time).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <span>🌍</span>
                                            <span>{h.location || "Unknown"}</span>
                                            <span>•</span>
                                            <span>💻</span>
                                            <span>{h.device || "Unknown"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span>🌐</span>
                                            <span>{h.ip_address}</span>
                                        </div>
                                    </div>

                                    {/* Right side — Risk Score */}
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className={`text-2xl font-bold ${getRiskColor(h.risk_score)}`}>
                                                {h.risk_score}
                                            </div>
                                            <div className="text-xs text-gray-500">risk score</div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getRiskBadge(h.risk_score)}`}>
                                            {getRiskLabel(h.risk_score)}
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}

                </div>

                {/* Risk Score Legend */}
                <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Risk Score Guide</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: "Safe", range: "0", color: "bg-green-900/40 border-green-700 text-green-300" },
                            { label: "Low Risk", range: "1–30", color: "bg-yellow-900/40 border-yellow-700 text-yellow-300" },
                            { label: "Medium Risk", range: "31–70", color: "bg-orange-900/40 border-orange-700 text-orange-300" },
                            { label: "High Risk", range: "71–100+", color: "bg-red-900/40 border-red-700 text-red-300" },
                        ].map((item, i) => (
                            <div key={i} className={`px-3 py-2 rounded-lg border text-xs text-center ${item.color}`}>
                                <div className="font-semibold">{item.label}</div>
                                <div className="opacity-70 mt-1">Score: {item.range}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;
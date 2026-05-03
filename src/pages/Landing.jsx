import { useNavigate } from "react-router-dom";

function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col">

            {/* Navbar */}
            <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🔐</span>
                    <span className="font-bold text-lg">AdaptiveAuth</span>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate("/login")}
                        className="px-4 py-2 text-sm text-gray-300 hover:text-white transition"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate("/signup")}
                        className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <div className="flex flex-col items-center justify-center flex-1 text-center px-4 py-20">
                <div className="inline-block bg-indigo-900/40 text-indigo-300 text-sm px-4 py-1 rounded-full mb-6 border border-indigo-700">
                    Production-Level Security System
                </div>

                <h1 className="text-5xl font-bold mb-6 leading-tight">
                    Authentication That
                    <span className="text-indigo-400"> Thinks</span>
                </h1>

                <p className="text-gray-400 text-lg max-w-xl mb-10">
                    Every login is analyzed in real time. Device fingerprinting,
                    geolocation, behavioral patterns — combined into a risk score
                    that decides how to protect your account.
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate("/signup")}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition"
                    >
                        Try it Free
                    </button>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-3 border border-gray-700 hover:border-gray-500 rounded-lg font-medium transition"
                    >
                        Login
                    </button>
                </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pb-20 max-w-5xl mx-auto w-full">
                {[
                    {
                        icon: "📱",
                        title: "Device Fingerprinting",
                        desc: "Detects new or unrecognized devices on every login attempt."
                    },
                    {
                        icon: "🌍",
                        title: "Geolocation Analysis",
                        desc: "Flags impossible travel — India to Russia in 5 minutes."
                    },
                    {
                        icon: "⚡",
                        title: "Real-time Risk Score",
                        desc: "Combines signals to allow, verify via OTP, or block login."
                    }
                ].map((f, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <div className="text-3xl mb-3">{f.icon}</div>
                        <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                        <p className="text-gray-400 text-sm">{f.desc}</p>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="text-center text-gray-600 text-sm pb-6">
                Built by Pawan Kumar Dangi • FastAPI + PostgreSQL + Redis
            </div>

        </div>
    );
}

export default Landing;
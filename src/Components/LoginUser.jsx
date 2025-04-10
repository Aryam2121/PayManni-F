import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginUser = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [responseMsg, setResponseMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");
    try {
      const res = await axios.post(
        `https://${import.meta.env.VITE_BACKEND}/api/login`,
        formData
      );
  
      setResponseMsg(res.data.msg);
      localStorage.setItem("token", res.data.token); // ✅ Save token
      localStorage.setItem("paymanni_user", JSON.stringify(res.data.user));
  
      setTimeout(() => {
        navigate("/home"); // ✅ Redirect to home
      }, 1000);
    } catch (err) {
      setResponseMsg(err.response?.data?.msg || "Login failed");
    }
    setLoading(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">
          Welcome Back 👋
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute top-3.5 left-3 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute top-3.5 left-3 text-gray-400" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Response Message */}
        {responseMsg && (
          <p
            className={`text-center mt-4 text-sm font-medium animate-pulse ${
              responseMsg.includes("successful")
                ? "text-green-400"
                : "text-red-500"
            }`}
          >
            {responseMsg}
          </p>
        )}

        {/* Register Footer */}
        <p className="text-sm text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <span
            className="text-indigo-400 hover:underline cursor-pointer"
            onClick={() => navigate("/register-user")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginUser;

import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [responseMsg, setResponseMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");
    try {
      const res = await axios.post(
        `https://${import.meta.env.VITE_BACKEND}/api/register`,
        formData
      );
      setResponseMsg(res.data.msg);

      if (res.data.msg.includes("successfully")) {
        setTimeout(() => {
          navigate("/login-user");
        }, 1000);
      }
    } catch (err) {
      setResponseMsg(err.response?.data?.msg || "Error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-gray-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-800 p-8 rounded-2xl shadow-2xl border border-zinc-700">
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-6">
          Create Account
        </h2>
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Name Input */}
          <div className="relative">
            <User className="absolute top-3.5 left-3 text-gray-400" size={20} />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-600 bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute top-3.5 left-3 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-600 bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-600 bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-lg transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Response Message */}
        {responseMsg && (
          <p
            className={`text-center mt-4 text-sm font-medium animate-pulse ${
              responseMsg.includes("successfully")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {responseMsg}
          </p>
        )}

        {/* Footer */}
        <p className="text-sm text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <span
            className="text-indigo-400 hover:underline cursor-pointer"
            onClick={() => navigate("/login-user")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterUser;

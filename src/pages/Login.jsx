import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import login from "../assets/login.jpg";
import axios from "axios";

const LoginPage = () => {
  const [loginMethod, setLoginMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(""); // Mocked OTP
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
const response = await axios.post("http://localhost:8000/api/users/login", { email, password });
      if (response.data.success) {
        alert("Login Successful!");
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!validatePhone(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
const response = await axios.post("http://localhost:8000/api/users/send-otp", { phone });
      if (response.data.success) {
        setGeneratedOtp(response.data.otp); // Save OTP for verification
        alert(`Your OTP is ${response.data.otp}`); // Replace with real OTP service
      } else {
        setError("Failed to send OTP. Try again later.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp === generatedOtp) {
      alert("Login Successful!");
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
      <div className="w-full md:w-2/3 flex rounded-lg shadow-2xl overflow-hidden">
        <div className="hidden md:block w-1/2 bg-cover bg-center relative">
          <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${login})` }}></div>
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>

        <div className="w-full md:w-1/2 bg-white p-8 rounded-r-lg shadow-lg">
          <h2 className="text-4xl font-semibold text-center text-gray-800 mb-8">Login to PayManni</h2>

          <div className="flex justify-center mb-6">
            <button
              onClick={() => setLoginMethod("email")}
              className={`px-6 py-2 rounded-l-lg border ${loginMethod === "email" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              Email
            </button>
            <button
              onClick={() => setLoginMethod("phone")}
              className={`px-6 py-2 rounded-r-lg border ${loginMethod === "phone" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              Phone
            </button>
          </div>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          {loginMethod === "email" && (
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Enter your email"
              />

              <label htmlFor="password" className="block text-lg font-medium text-gray-700 mt-4">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Enter your password"
              />

              <button
                onClick={handleEmailLogin}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 mt-6"
                disabled={isLoading}
              >
                {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : "Login"}
              </button>
            </div>
          )}

          {loginMethod === "phone" && (
            <div>
              <label htmlFor="phone" className="block text-lg font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Enter your phone number"
              />

              <button
                onClick={handleSendOtp}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 mt-6"
                disabled={isLoading}
              >
                {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : "Send OTP"}
              </button>

              <label htmlFor="otp" className="block text-lg font-medium text-gray-700 mt-4">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Enter the OTP"
              />

              <button
                onClick={handleVerifyOtp}
                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 mt-6"
              >
                Verify OTP
              </button>
            </div>
          )}

          <div className="mt-4 text-center">
            <Link to="/signup" className="text-blue-600 hover:underline text-sm">Don't have an account? Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

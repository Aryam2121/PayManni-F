import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import Signup from "../assets/signup.webp";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

 

  const handleGoogleLogin = async (response) => {
    try {
      const res = await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/auth/google`, {
        token: response.credential,
      });
      localStorage.setItem("authToken", res.data.token);
      alert("Google Sign-Up Successful!");
    } catch (err) {
      setError("Error during Google Sign-Up. Please try again.");
      console.error(err);
    }
  };

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      setError("Please enter your phone number.");
      return;
    }
    try {
      const res = await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/auth/send-otp`, { phoneNumber });
      if (res.data.success) {
        setIsOtpSent(true);
        setError("");
        alert(`OTP sent to ${phoneNumber}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP. Please try again.");
      console.error(err);
    }
  };

  const handleSignup = async () => {
    if (!email && !phoneNumber) {
      setError("Please enter either your phone number or email.");
      return;
    }
    if (phoneNumber && !otp) {
      setError("Please enter the OTP sent to your phone.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const signupData = phoneNumber
        ? { phoneNumber, otp }
        : { email, password };

      const res = await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/auth/signup`, signupData);
      alert("Signup Successful!");
      localStorage.setItem("authToken", res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Error during signup. Please try again.");
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
      <div className="w-full md:w-2/3 flex rounded-lg shadow-xl">
        {/* Left side (Image) */}
        <div className="hidden md:block w-1/2 rounded-l-lg overflow-hidden">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${Signup})` }}
          ></div>
        </div>

        {/* Right side (Form) */}
        <div className="w-full md:w-1/2 bg-white p-8 rounded-r-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Sign Up for PayManni</h2>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

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
          </div>

          <div className="mt-4">
            <label htmlFor="phone" className="block text-lg font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Enter your phone number"
            />
            {!isOtpSent && (
              <button
                onClick={handleSendOtp}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Send OTP
              </button>
            )}
          </div>

          {isOtpSent && (
            <div className="mt-4">
              <label htmlFor="otp" className="block text-lg font-medium text-gray-700">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Enter the OTP"
              />
            </div>
          )}

          <div className="mt-4">
            <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Enter your password"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="confirm-password" className="block text-lg font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="Confirm your password"
            />
          </div>

          <div className="mt-6">
            <button
              onClick={handleSignup}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : "Sign Up"}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link to="/login" className="text-blue-600 hover:underline text-sm">
              Already have an account? Login
            </Link>
          </div>

          {/* Google Sign-Up Button */}
          <div className="mt-4 text-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Google Sign-Up failed. Try again.")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

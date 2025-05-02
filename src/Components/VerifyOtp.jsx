import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../firebase"; // Assuming you have a custom verification function here

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  // Get the passed confirmation result and phone number from state
  const { confirmationResult, phoneNumber } = location.state || {};

  // Handle OTP input change
  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");

    try {
      // Confirm OTP with Firebase using confirmationResult from state
      const result = await confirmationResult.confirm(otp);

      if (result.user) {
        // Successfully verified OTP
        setResponseMsg("Phone number verified successfully!");
        // Navigate to the next step (e.g., navigate to home page or complete registration)
        setTimeout(() => {
          navigate("/home"); // Adjust based on your app flow
        }, 1000);
      }
    } catch (error) {
      // Handle verification errors
      setResponseMsg("Failed to verify OTP. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-gray-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-800 p-8 rounded-2xl shadow-2xl border border-zinc-700">
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-6">Verify OTP</h2>

        <form onSubmit={handleOtpSubmit} className="space-y-5">
          {/* OTP Input */}
          <div className="relative">
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleChange}
              className="w-full pl-4 pr-4 py-2 rounded-lg border border-zinc-600 bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-lg transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Response Message */}
        {responseMsg && (
          <p
            className={`text-center mt-4 text-sm font-medium animate-pulse ${responseMsg.includes("successfully") ? "text-green-400" : "text-red-400"}`}
          >
            {responseMsg}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;

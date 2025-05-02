// pages/VerifyOtp.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import axios from "axios";

const VerifyOtp = () => {
  const { state } = useLocation();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const handleVerify = async () => {
    try {
      const result = await state.confirmationResult.confirm(otp);
      const user = result.user;

      // Register the user in your backend
      await axios.post(
        `https://${import.meta.env.VITE_BACKEND}/api/register`,
        {
          name: state.name,
          phoneNumber: state.phoneNumber,
          firebaseUid: user.uid,
        }
      );

      setMessage("Phone registration successful!");
      navigate("/login-user");
    } catch (err) {
      console.error(err);
      setMessage("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-zinc-900 px-4">
      <div className="max-w-md w-full p-6 bg-zinc-800 rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-indigo-400">
          Verify OTP
        </h2>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full px-4 py-2 rounded-lg border border-zinc-600 bg-zinc-700 focus:outline-none"
        />
        <button
          onClick={handleVerify}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
        >
          Verify
        </button>
        {message && <p className="text-center mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default VerifyOtp;

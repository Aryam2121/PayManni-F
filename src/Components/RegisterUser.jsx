import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, Phone, User } from "lucide-react";
import {
  getAuth,
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
 
} from "firebase/auth";
import { setUpRecaptcha } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
const RegisterUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [responseMsg, setResponseMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPhoneRegister, setIsPhoneRegister] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const setUpRecaptcha = (containerId) => {
  //   if (!window.recaptchaVerifier) {
  //     window.recaptchaVerifier = new RecaptchaVerifier(
  //       containerId,
  //       {
  //         size: "invisible",
  //         callback: (response) => console.log("reCAPTCHA solved"),
  //       },
  //       auth
  //     );
  //   }
  // };
  

  // 👉 Function to send user data to backend
  const saveUserToBackend = async (userData) => {
    try {
      const response = await axios.post(
        `https://${import.meta.env.VITE_BACKEND}/api/register`,
        userData
      );
      console.log("User saved to backend:", response.data);
    } catch (error) {
      console.error("Error saving user to backend:", error);
    }
  };

  const handlePhoneVerification = async (e) => {
    e.preventDefault();
    setUpRecaptcha("recaptcha-container");

    try {
      setLoading(true);
      const phoneNumber = `+91${formData.phoneNumber}`;
      const appVerifier = window.recaptchaVerifier;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );

      setResponseMsg("OTP sent to your phone");
      navigate("/verify-otp", {
        state: {
          confirmationResult,
          phoneNumber,
          name: formData.name,
          password: formData.password, // optional
        },
      });
    } catch (err) {
      setResponseMsg("Error verifying phone number.");
      console.error(err);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");
  
    try {
      if (isPhoneRegister) {
        // Validate phone number format
        const phoneNumber = `+91${formData.phoneNumber}`;
        if (!/^\+91\d{10}$/.test(phoneNumber)) {
          setResponseMsg("Invalid phone number.");
          setLoading(false);
          return;
        }
  
        // Setup recaptcha only once
        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha-container",
            {
              size: "invisible",
              callback: () => console.log("reCAPTCHA Solved"),
            },
            auth
          );
        }
  
        const appVerifier = window.recaptchaVerifier;
  
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          appVerifier
        );
  
        setResponseMsg("OTP sent to your phone");
        navigate("/verify-otp", {
          state: {
            confirmationResult,
            phoneNumber,
            name: formData.name,
            password: formData.password,
          },
        });
      } else {
        // Email registration
        if (formData.password !== formData.confirmPassword) {
          setResponseMsg("Passwords do not match!");
          setLoading(false);
          return;
        }
  
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
  
        await saveUserToBackend({
          name: formData.name,
          email: formData.email,
          firebaseUid: userCredential.user.uid,
        });
  
        setResponseMsg("Registration successful!");
        navigate("/login-user");
      }
    } catch (err) {
      setResponseMsg(err.message || "Error occurred");
      console.error("Register Error:", err);
    }
  
    setLoading(false);
  };
  
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Send the user to backend
      await saveUserToBackend({
        name: user.displayName,
        email: user.email,
        firebaseUid: user.uid,
      });
  
      setResponseMsg("Google Sign-In successful!");
      navigate("/login-user");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setResponseMsg("Google Sign-In failed.");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-gray-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-800 p-8 rounded-2xl shadow-2xl border border-zinc-700">
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-6">
          Create Account
        </h2>

        <form onSubmit={isPhoneRegister ? handlePhoneVerification : handleRegister} className="space-y-5">
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

          {!isPhoneRegister && (
            <div className="relative">
              <Mail className="absolute top-3.5 left-3 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-600 bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          )}

          {isPhoneRegister && (
            <div className="relative">
              <Phone className="absolute top-3.5 left-3 text-gray-400" size={20} />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-600 bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          )}

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

          {!isPhoneRegister && (
            <div className="relative">
              <Lock className="absolute top-3.5 left-3 text-gray-400" size={20} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-600 bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            </div>
          )}
<button
  onClick={loginWithGoogle}
  disabled={loading}
  className={`w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow-lg transition ${
    loading && "opacity-50 cursor-not-allowed"
  }`}
>
  Sign up with Google
</button>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-lg transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div id="recaptcha-container" className="hidden"></div>
        

        {responseMsg && (
          <p
            className={`text-center mt-4 text-sm font-medium animate-pulse ${
              responseMsg.includes("successful")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {responseMsg}
          </p>
        )}

        <p className="text-sm text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <span
            className="text-indigo-400 hover:underline cursor-pointer"
            onClick={() => navigate("/login-user")}
          >
            Login
          </span>
        </p>

        <p
          className="text-sm text-center text-indigo-400 mt-4 cursor-pointer"
          onClick={() => setIsPhoneRegister((prev) => !prev)}
        >
          {isPhoneRegister
            ? "Register with Email instead"
            : "Register with Phone instead"}
        </p>
      </div>
    </div>
  );
};

export default RegisterUser;

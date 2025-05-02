import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPhoneNumber, signInWithEmailAndPassword, RecaptchaVerifier, GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import { firebaseApp } from "../firebase"; // Import the initialized Firebase app

const LoginUser = () => {
  const [formData, setFormData] = useState({ email: "", password: "", phone: "" });
  const [responseMsg, setResponseMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);  // State to toggle between email and phone login
  const [otp, setOtp] = useState("");  // OTP state
  const [confirmationResult, setConfirmationResult] = useState(null); // Store Firebase confirmation result
  const [isOtpSent, setIsOtpSent] = useState(false); // Flag to track if OTP was sent
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");

    try {
      if (isPhoneLogin) {
        if (confirmationResult) {
          // Verify OTP after sending phone number
          const userCredential = await confirmationResult.confirm(otp);
          const user = userCredential.user;

          const token = await user.getIdToken();
          const userData = { userId: user.uid, user: { name: user.displayName } }; // Mocked user data

          setResponseMsg("Phone login successful");
          localStorage.setItem("paymanni_token", token);
          localStorage.setItem("paymanni_user", JSON.stringify(userData.user));

          setTimeout(() => {
            navigate("/home");
          }, 1000);
        } else {
          setResponseMsg("OTP verification failed. Try again.");
        }
      } else {
        // Email and password login using Firebase Authentication
        const auth = getAuth(firebaseApp);
        const { email, password } = formData;

        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;

            user.getIdToken().then((token) => {
              const userData = { userId: user.uid, user: { name: user.displayName } }; // Mocked user data

              setResponseMsg("Email login successful");
              localStorage.setItem("paymanni_token", token);
              localStorage.setItem("paymanni_user", JSON.stringify(userData.user));

              setTimeout(() => {
                navigate("/home");
              }, 1000);
            });
          })
          .catch((error) => {
            setResponseMsg("Email login failed: " + error.message);
          });
      }
    } catch (err) {
      setResponseMsg(err.response?.data?.msg || "Login failed");
    }
    setLoading(false);
  };
  const loginWithGoogle = async () => {
    setLoading(true);
    setResponseMsg("");
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();
  
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
  
      const userData = {
        userId: user.uid,
        user: { name: user.displayName, email: user.email },
      };
  
      localStorage.setItem("paymanni_token", token);
      localStorage.setItem("paymanni_user", JSON.stringify(userData.user));
      setResponseMsg("Google login successful");
  
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      console.error(error);
      setResponseMsg("Google login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const handlePhoneLogin = () => {
    const auth = getAuth(firebaseApp);
  
    // Initialize reCAPTCHA only if it's not initialized already
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          console.log('Recaptcha verified', response);
        },
      }, auth);
    }
  
    const phoneNumber = `+${formData.phone}`;
    const appVerifier = window.recaptchaVerifier;
  
    setLoading(true); // Show loading state while OTP is being sent
  
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setConfirmationResult(confirmationResult);
        setIsOtpSent(true); // OTP has been sent
        setResponseMsg("OTP sent to your phone number.");
      })
      .catch((error) => {
        console.error("Error during phone login:", error);
        setResponseMsg("Failed to send OTP. Please try again.");
      })
      .finally(() => {
        setLoading(false); // Hide loading after OTP is sent
      });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">
          Welcome Back 👋
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Toggle between Email and Phone Login */}
          <div className="flex justify-between">
            <button 
              type="button" 
              onClick={() => setIsPhoneLogin(!isPhoneLogin)} 
              className="text-sm text-indigo-400 hover:underline cursor-pointer"
            >
              {isPhoneLogin ? "Login with Email" : "Login with Phone"}
            </button>
          </div>

          {/* Phone Number Input (if phone login selected) */}
          {isPhoneLogin ? (
            <>
              <div className="relative">
                <Phone className="absolute top-3.5 left-3 text-gray-400" size={20} />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number (e.g. 1234567890)"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
              </div>

              {/* OTP Input */}
              {isOtpSent && (
                <div className="relative">
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    required
                  />
                </div>
              )}

              {/* Submit OTP or Send OTP */}
              <button
                type="button"
                onClick={confirmationResult ? handleLogin : handlePhoneLogin}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : confirmationResult ? (loading ? "Verifying..." : "Verify OTP") : "Send OTP"}
              </button>
            </>
          ) : (
            <>
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
              <div className="mt-4">
  <button
    onClick={loginWithGoogle}
    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
    disabled={loading}
  >
    {loading ? "Loading..." : "Login with Google"}
  </button>
</div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </>
          )}
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

      {/* Invisible reCAPTCHA */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default LoginUser;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FaEnvelope, 
  FaLock, 
  FaPhone, 
  FaGoogle, 
  FaApple, 
  FaFingerprint,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaArrowLeft,
  FaShieldAlt
} from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import axios from "axios";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "firebase/auth";
import { firebaseApp } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { setAuthSession } from "../utils/authStorage";

const LoginUser = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  
  // Enhanced State Management
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email"); // "email", "email-otp", "phone-otp"
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (loginMethod === "email-otp") {
        // Email OTP Login
        const response = await axios.post(apiUrl(`/api/auth/login`), {
          email: formData.email,
          otp: otp
        });

        if (response.data.message === "Login successful.") {
          const { token, user } = response.data;
          setAuthSession({ token, user });
          setUser({ ...user, id: user.id || user._id, _id: user._id || user.id });

          toast.success("Email OTP login successful! 🎉");
          setStep(3);
          
          setTimeout(() => {
            navigate("/home");
          }, 1500);
        } else {
          toast.error(response.data.message || "OTP verification failed");
        }
      } else if (loginMethod === "phone-otp") {
        // Phone OTP Login
        const response = await axios.post(apiUrl(`/api/auth/login`), {
          phoneNumber: formData.phone,
          otp: otp
        });

        if (response.data.message === "Login successful.") {
          const { token, user } = response.data;
          setAuthSession({ token, user });
          setUser({ ...user, id: user.id || user._id, _id: user._id || user.id });

          toast.success("Phone OTP login successful! 🎉");
          setStep(3);
          
          setTimeout(() => {
            navigate("/home");
          }, 1500);
        } else {
          toast.error(response.data.message || "OTP verification failed");
        }
      } else {
        const auth = getAuth(firebaseApp);
        const { email, password } = formData;

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();

        try {
          const res = await axios.post(apiUrl(`/api/login`), {
            idToken: token,
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const userData = res.data;
          setAuthSession({ token, user: userData.user });
          setUser({ ...userData.user, id: userData.userId, _id: userData.userId });

          toast.success("Email login successful! 🎉");
          setStep(3);
          
          setTimeout(() => {
            navigate("/home");
          }, 1500);
        } catch (apiErr) {
          toast.error("Backend login failed: " + (apiErr.response?.data?.msg || apiErr.message));
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login failed");
    }
    setLoading(false);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      const userData = {
        userId: user.uid,
        user: { id: user.uid, _id: user.uid, name: user.displayName, email: user.email },
      };

      setAuthSession({ token, user: userData.user });
      setUser(userData.user);

      toast.success("Google login successful! 🎉");
      setStep(3);
      
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Google login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpRequest = async () => {
    setLoading(true);

    try {
      let payload = {};
      
      if (loginMethod === "email-otp") {
        const email = formData.email;
        if (!email || !email.includes('@')) {
          toast.error("Please enter a valid email address");
          setLoading(false);
          return;
        }
        payload = { email };
      } else if (loginMethod === "phone-otp") {
        const phone = formData.phone;
        if (!phone || phone.length < 10) {
          toast.error("Please enter a valid phone number");
          setLoading(false);
          return;
        }
        payload = { phoneNumber: phone };
      }

      const response = await axios.post(apiUrl(`/api/auth/send-otp`), payload);

      if (response.data.message.includes("OTP sent successfully")) {
        setIsOtpSent(true);
        setStep(2);
        
        if (loginMethod === "email-otp") {
          toast.success(`OTP sent to ${response.data.email}! 📧`, { autoClose: 5000 });
        } else {
          toast.success(`OTP sent to ${response.data.phone}! 📱`, { autoClose: 5000 });
        }
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error during OTP send:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    } flex items-center justify-center px-4 py-8`}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <motion.div
        className={`relative w-full max-w-md ${
          darkMode ? 'bg-gray-900/50' : 'bg-white/80'
        } backdrop-blur-xl p-8 rounded-3xl shadow-2xl border ${
          darkMode ? 'border-gray-700' : 'border-white/20'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            className="flex justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <img src={Paymanniicon} alt="PayManni" className="w-10 h-10" />
            </div>
          </motion.div>
          
          <motion.h1
            className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Welcome Back! 👋
          </motion.h1>
          
          <motion.p
            className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Sign in to your PayManni account
          </motion.p>
        </div>

        {/* Login Method Toggle */}
        <motion.div 
          className="flex mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button
            type="button"
            onClick={() => {
              setLoginMethod("email");
              setStep(1);
              setIsOtpSent(false);
            }}
            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg transition-all duration-300 ${
              loginMethod === "email"
                ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <FaLock className="mr-1 text-sm" />
            <span className="text-sm">Password</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod("email-otp");
              setStep(1);
              setIsOtpSent(false);
            }}
            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg transition-all duration-300 ${
              loginMethod === "email-otp"
                ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <FaEnvelope className="mr-1 text-sm" />
            <span className="text-sm">Email OTP</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod("phone-otp");
              setStep(1);
              setIsOtpSent(false);
            }}
            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg transition-all duration-300 ${
              loginMethod === "phone-otp"
                ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <FaPhone className="mr-1 text-sm" />
            <span className="text-sm">Phone OTP</span>
          </button>
        </motion.div>

        {/* Step Indicator */}
        {(loginMethod === "email-otp" || loginMethod === "phone-otp") && (
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    step >= stepNum 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {step > stepNum ? <FaCheckCircle /> : stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-8 h-1 mx-2 transition-all duration-300 ${
                      step > stepNum ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step1"
              onSubmit={(loginMethod === "email-otp" || loginMethod === "phone-otp") ? (e) => { e.preventDefault(); handleOtpRequest(); } : handleLogin}
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {loginMethod === "email-otp" ? (
                <div className="space-y-4">
                  <div className="relative">
                    <FaEnvelope className={`absolute top-4 left-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email for OTP"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-200 text-gray-800 focus:border-blue-500'
                      } focus:outline-none transition-all duration-300`}
                      required
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending OTP...
                      </div>
                    ) : (
                      "Send OTP to Email"
                    )}
                  </motion.button>
                </div>
              ) : loginMethod === "phone-otp" ? (
                <div className="space-y-4">
                  <div className="relative">
                    <FaPhone className={`absolute top-4 left-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter phone (e.g., +919876543210)"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-200 text-gray-800 focus:border-blue-500'
                      } focus:outline-none transition-all duration-300`}
                      required
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending OTP...
                      </div>
                    ) : (
                      "Send OTP"
                    )}
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <FaEnvelope className={`absolute top-4 left-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-200 text-gray-800 focus:border-blue-500'
                      } focus:outline-none transition-all duration-300`}
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <FaLock className={`absolute top-4 left-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-200 text-gray-800 focus:border-blue-500'
                      } focus:outline-none transition-all duration-300`}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className={`absolute top-4 right-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-blue-500 transition-colors`}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Remember me
                      </span>
                    </label>
                    <button
                      type="button"
                      className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <FaLock className="mr-2" />
                        Sign In
                      </div>
                    )}
                  </motion.button>

                  {/* Social Login */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className={`w-full border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className={`px-2 ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'}`}>
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <motion.button
                      type="button"
                      onClick={loginWithGoogle}
                      disabled={loading}
                      className={`flex items-center justify-center py-3 px-4 rounded-xl border-2 ${
                        darkMode 
                          ? 'border-gray-700 hover:border-gray-600 bg-gray-800' 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      } transition-all duration-300 disabled:opacity-50`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaGoogle className="text-red-500 text-xl" />
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      className={`flex items-center justify-center py-3 px-4 rounded-xl border-2 ${
                        darkMode 
                          ? 'border-gray-700 hover:border-gray-600 bg-gray-800' 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      } transition-all duration-300`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaApple className={`${darkMode ? 'text-white' : 'text-black'} text-xl`} />
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      className={`flex items-center justify-center py-3 px-4 rounded-xl border-2 ${
                        darkMode 
                          ? 'border-gray-700 hover:border-gray-600 bg-gray-800' 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      } transition-all duration-300`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaFingerprint className="text-blue-500 text-xl" />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.form>
          )}

          {step === 2 && isPhoneLogin && (
            <motion.div
              key="step2"
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPhone className="text-blue-600 dark:text-blue-400 text-2xl" />
                </div>
                <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                  Verify Your Phone
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  We've sent a 6-digit code to +{formData.phone}
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  className={`w-full text-center text-2xl py-4 rounded-xl border-2 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                      : 'bg-white border-gray-200 text-gray-800 focus:border-blue-500'
                  } focus:outline-none transition-all duration-300 tracking-widest`}
                />
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-blue-500 transition-colors`}
                >
                  <FaArrowLeft className="mr-2" />
                  Back
                </button>
                <button
                  type="button"
                  className="text-blue-500 hover:text-blue-600 transition-colors text-sm"
                >
                  Resend OTP
                </button>
              </div>

              <motion.button
                onClick={handleLogin}
                disabled={loading || otp.length < 6}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify OTP"
                )}
              </motion.button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              className="text-center space-y-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <FaCheckCircle className="text-green-600 dark:text-green-400 text-3xl" />
              </div>
              <div>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                  Welcome Back! 🎉
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  You've successfully signed in to PayManni
                </p>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Redirecting to dashboard...
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        {step === 1 && (
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register-user")}
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                Sign up
              </button>
            </p>
            
            <div className="flex items-center justify-center mt-4 space-x-4">
              <div className="flex items-center text-xs text-gray-500">
                <MdSecurity className="mr-1" />
                Secure Login
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <FaShieldAlt className="mr-1" />
                256-bit Encryption
              </div>
            </div>
          </motion.div>
        )}

        {/* Dark Mode Toggle */}
        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {darkMode ? "☀️" : "🌙"}
        </motion.button>
      </motion.div>

      {/* Invisible reCAPTCHA */}
      <div id="recaptcha-container"></div>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
};

export default LoginUser;
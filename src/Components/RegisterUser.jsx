import { apiUrl, setAuthSession } from "../utils/authStorage";
import { normalizeIndianPhone } from "../utils/phone";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FaEnvelope, 
  FaLock, 
  FaPhone, 
  FaUser,
  FaGoogle, 
  FaApple, 
  FaGithub,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaArrowLeft,
  FaShieldAlt,
  FaClock,
  FaExclamationTriangle
} from "react-icons/fa";
import { MdSecurity, MdVerifiedUser } from "react-icons/md";
import { BiFingerprint } from "react-icons/bi";
import { HiSparkles } from "react-icons/hi";
import axios from "axios";
import {
  getAuth,
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { firebaseApp } from "../firebase";
import Paymanniicon from "../assets/Paymanniicon.png";
import AuthLayout from "./layout/AuthLayout";
import { useTheme } from "../context/ThemeContext";

const RegisterUser = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const auth = getAuth(firebaseApp);

  // Enhanced State Management
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isPhoneRegister, setIsPhoneRegister] = useState(false);
  const [registrationMethod, setRegistrationMethod] = useState("email");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [phoneE164, setPhoneE164] = useState("");
  const { darkMode } = useTheme();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength < 25) return "bg-red-500";
    if (strength < 50) return "bg-yellow-500";
    if (strength < 75) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = (strength) => {
    if (strength < 25) return "Weak";
    if (strength < 50) return "Fair";
    if (strength < 75) return "Good";
    return "Strong";
  };

  // Save user to backend
  const saveUserToBackend = async (userData) => {
    try {
      const response = await axios.post(
        apiUrl(`/api/register`),
        userData
      );
      console.log("User saved to backend:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error saving user to backend:", error);
      throw error;
    }
  };

  const handlePhoneRegistration = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    const normalized = normalizeIndianPhone(formData.phoneNumber);
    if (!normalized) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      setPhoneE164(normalized);

      const response = await axios.post(apiUrl("/api/auth/send-otp"), {
        phoneNumber: normalized,
      });

      if (response.data.smsUnavailable) {
        toast.warning("Phone SMS is not configured. Please register with Email instead.");
        return;
      }

      if (response.data.devOtp) {
        setOtp(String(response.data.devOtp));
        toast.info(`Dev OTP: ${response.data.devOtp}`, { autoClose: 30000 });
      }

      setStep(2);
      toast.success("OTP sent to your phone!");
    } catch (error) {
      console.error("Phone registration error:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    const otpValue = otp.replace(/\D/g, "");
    if (otpValue.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(apiUrl("/api/auth/signup"), {
        name: formData.name.trim(),
        phoneNumber: phoneE164 || normalizeIndianPhone(formData.phoneNumber),
        otp: otpValue,
      });

      if (response.data.message === "User registered successfully.") {
        const { token, user } = response.data;
        setAuthSession({
          token,
          user: {
            ...user,
            id: user.id || user._id,
            _id: user._id || user.id,
            phoneNumber: phoneE164,
          },
        });
        setUser({
          ...user,
          id: user.id || user._id,
          _id: user._id || user.id,
          phoneNumber: phoneE164,
        });
        setStep(3);
        toast.success("Phone verified! Welcome to PayManni!");
        setTimeout(() => navigate("/home"), 1500);
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match!");
        setLoading(false);
        return;
      }

      if (passwordStrength < 50) {
        toast.warning("Please use a stronger password");
        setLoading(false);
        return;
      }

      if (!acceptTerms) {
        toast.error("Please accept the terms and conditions");
        setLoading(false);
        return;
      }

      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Save to backend
      await saveUserToBackend({
        name: formData.name,
        email: formData.email,
        firebaseUid: userCredential.user.uid,
      });

      setEmailVerificationSent(true);
      setStep(3);
      toast.success("Registration successful! Welcome to PayManni! 🎉");
      
      setTimeout(() => {
        navigate("/login-user");
      }, 2000);
    } catch (error) {
      console.error("Email registration error:", error);
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user to backend
      await saveUserToBackend({
        name: user.displayName,
        email: user.email,
        firebaseUid: user.uid,
      });

      toast.success("Google registration successful! 🎉");
      setStep(3);
      
      setTimeout(() => {
        navigate("/login-user");
      }, 1500);
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error("Google registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <AuthLayout
      title="Start your journey"
      subtitle="Create an account in seconds and unlock every PayManni feature."
      badge="Free welcome bonus on signup"
    >
      <ToastContainer position="top-center" theme={darkMode ? "dark" : "light"} />

      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-display font-bold text-foreground">Create account</h2>
          <p className="text-sm text-muted-foreground mt-1">Join millions managing money smarter</p>
        </div>

        {/* Registration Method Toggle */}
        <motion.div 
          className="flex mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button
            type="button"
            onClick={() => {
              setIsPhoneRegister(false);
              setRegistrationMethod("email");
              setStep(1);
            }}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg transition-all duration-300 ${
              !isPhoneRegister
                ? 'bg-white dark:bg-gray-700 shadow-md text-purple-600 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <FaEnvelope className="mr-2" />
            Email
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPhoneRegister(true);
              setRegistrationMethod("phone");
              setStep(1);
            }}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg transition-all duration-300 ${
              isPhoneRegister
                ? 'bg-white dark:bg-gray-700 shadow-md text-purple-600 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <FaPhone className="mr-2" />
            Phone
          </button>
        </motion.div>

        {/* Step Indicator */}
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
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {step > stepNum ? <FaCheckCircle /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-8 h-1 mx-2 transition-all duration-300 ${
                    step > stepNum ? 'bg-purple-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step1"
              onSubmit={isPhoneRegister ? (e) => { e.preventDefault(); handlePhoneRegistration(); } : handleEmailRegistration}
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Name Input */}
              <div className="relative">
                <FaUser className={`absolute top-4 left-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-purple-500' 
                      : 'bg-white border-gray-200 text-gray-800 focus:border-purple-500'
                  } focus:outline-none transition-all duration-300`}
                  required
                />
              </div>

              {isPhoneRegister ? (
                <div className="relative">
                  <FaPhone className={`absolute top-4 left-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter 10-digit phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-purple-500' 
                        : 'bg-white border-gray-200 text-gray-800 focus:border-purple-500'
                    } focus:outline-none transition-all duration-300`}
                    maxLength="10"
                    required
                  />
                </div>
              ) : (
                <>
                  {/* Email Input */}
                  <div className="relative">
                    <FaEnvelope className={`absolute top-4 left-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-purple-500' 
                          : 'bg-white border-gray-200 text-gray-800 focus:border-purple-500'
                      } focus:outline-none transition-all duration-300`}
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <FaLock className={`absolute top-4 left-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-purple-500' 
                          : 'bg-white border-gray-200 text-gray-800 focus:border-purple-500'
                      } focus:outline-none transition-all duration-300`}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className={`absolute top-4 right-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-purple-500 transition-colors`}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Password Strength
                        </span>
                        <span className={`text-sm font-medium ${
                          passwordStrength < 25 ? 'text-red-500' :
                          passwordStrength < 50 ? 'text-yellow-500' :
                          passwordStrength < 75 ? 'text-blue-500' : 'text-green-500'
                        }`}>
                          {getPasswordStrengthText(passwordStrength)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Confirm Password Input */}
                  <div className="relative">
                    <FaLock className={`absolute top-4 left-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-purple-500' 
                          : 'bg-white border-gray-200 text-gray-800 focus:border-purple-500'
                      } focus:outline-none transition-all duration-300 ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword 
                          ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className={`absolute top-4 right-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-purple-500 transition-colors`}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className="flex items-center space-x-2">
                      {formData.password === formData.confirmPassword ? (
                        <>
                          <FaCheckCircle className="text-green-500" />
                          <span className="text-sm text-green-500">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <FaExclamationTriangle className="text-red-500" />
                          <span className="text-sm text-red-500">Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="acceptTerms" className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      I agree to PayManni&apos;s{" "}
                      <button type="button" className="text-purple-500 hover:text-purple-600 underline">
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button type="button" className="text-purple-500 hover:text-purple-600 underline">
                        Privacy Policy
                      </button>
                    </label>
                  </div>
                </>
              )}

              <motion.button
                type="submit"
                disabled={loading || (!isPhoneRegister && !acceptTerms)}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isPhoneRegister ? "Sending OTP..." : "Creating Account..."}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <HiSparkles className="mr-2" />
                    {isPhoneRegister ? "Send OTP" : "Create Account"}
                  </div>
                )}
              </motion.button>

              {/* Social Registration */}
              {!isPhoneRegister && (
                <>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className={`w-full border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className={`px-2 ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'}`}>
                        Or sign up with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <motion.button
                      type="button"
                      onClick={handleGoogleSignup}
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
                      <FaGithub className={`${darkMode ? 'text-white' : 'text-black'} text-xl`} />
                    </motion.button>
                  </div>
                </>
              )}
            </motion.form>
          )}

          {step === 2 && isPhoneRegister && (
            <motion.div
              key="step2"
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPhone className="text-purple-600 dark:text-purple-400 text-2xl" />
                </div>
                <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                  Verify Your Phone
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  We&apos;ve sent a 6-digit code to +91{formData.phoneNumber}
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  className={`w-full text-center text-2xl py-4 rounded-xl border-2 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-purple-500' 
                      : 'bg-white border-gray-200 text-gray-800 focus:border-purple-500'
                  } focus:outline-none transition-all duration-300 tracking-widest`}
                />
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-purple-500 transition-colors`}
                >
                  <FaArrowLeft className="mr-2" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePhoneRegistration}
                  className="text-purple-500 hover:text-purple-600 transition-colors text-sm"
                >
                  Resend OTP
                </button>
              </div>

              <motion.button
                onClick={verifyOTP}
                disabled={loading || otp.replace(/\D/g, "").length < 6}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <MdVerifiedUser className="mr-2" />
                    Verify OTP
                  </div>
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
                  Welcome to PayManni! 🎉
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your account has been created successfully
                </p>
                {emailVerificationSent && (
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mt-2`}>
                    Please check your email for verification link
                  </p>
                )}
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                  Redirecting to login...
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
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-primary hover:underline font-semibold transition-colors"
              >
                Sign in
              </button>
            </p>
            
            <div className="flex items-center justify-center mt-4 space-x-4">
              <div className="flex items-center text-xs text-gray-500">
                <MdSecurity className="mr-1" />
                Secure Registration
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <FaShieldAlt className="mr-1" />
                Data Protection
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <BiFingerprint className="mr-1" />
                Verified Identity
              </div>
            </div>
          </motion.div>
        )}

      </motion.div>

      <div id="recaptcha-container"></div>
    </AuthLayout>
  );
};

export default RegisterUser;
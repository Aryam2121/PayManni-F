import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGoogle, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { MdPhoneAndroid, MdEmail } from "react-icons/md";
import axios from "axios";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../firebase";
import AuthLayout from "./layout/AuthLayout";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { setAuthSession, getApiBase, apiUrl, updateStoredUser } from "../utils/authStorage";
import { normalizeIndianPhone, isValidIndianPhone } from "../utils/phone";

const LoginUserNew = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { setUser } = useAuth();
  const otpInputs = useRef([]);

  const [loginMethod, setLoginMethod] = useState("phone");
  const [step, setStep] = useState(1);
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
    if (timer === 0) setCanResend(true);
  }, [step, timer]);

  const handleSendOTP = async () => {
    if (!phoneOrEmail.trim()) {
      toast.error(loginMethod === "phone" ? "Enter phone number" : "Enter email address");
      return;
    }

    if (loginMethod === "phone" && !isValidIndianPhone(phoneOrEmail)) {
      toast.error("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    setLoading(true);
    try {
      const payload =
        loginMethod === "phone"
          ? { phoneNumber: normalizeIndianPhone(phoneOrEmail) }
          : { email: phoneOrEmail.trim() };

      const response = await axios.post(
        `${getApiBase()}/api/auth/send-otp`,
        payload
      );

      if (response.data.smsUnavailable) {
        toast.warning("Phone SMS is not configured on the server. Please use the Email tab.");
        return;
      }

      if (response.data.message?.toLowerCase().includes("otp sent")) {
        toast.success(`OTP sent to ${loginMethod === "phone" ? "your phone" : "your email"}!`);
        if (response.data.devOtp) {
          const digits = String(response.data.devOtp).split("");
          setOtp([...digits, ...Array(6 - digits.length).fill("")].slice(0, 6));
          toast.info(`Dev OTP auto-filled: ${response.data.devOtp}`, { autoClose: 30000 });
        }
        setStep(2);
        setTimer(30);
        setCanResend(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        (error.code === "ERR_NETWORK" ? "Cannot reach server. Is the backend running on port 8000?" : null) ||
        "Failed to send OTP";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);
    if (value && index < 5) otpInputs.current[index + 1]?.focus();
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleOTPPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    const newOTP = pastedData.split("");
    setOtp([...newOTP, ...Array(6 - newOTP.length).fill("")]);
    otpInputs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setLoading(true);
    try {
      const payload =
        loginMethod === "phone"
          ? { phoneNumber: normalizeIndianPhone(phoneOrEmail), otp: otpValue }
          : { email: phoneOrEmail, otp: otpValue };

      const response = await axios.post(
        `${getApiBase()}/api/auth/login`,
        payload
      );

      if (response.data.message === "Login successful.") {
        const { token, user } = response.data;
        setAuthSession({ token, user });
        setUser({ ...user, id: user.id || user._id, _id: user._id || user.id });

        setStep(3);
        toast.success("Welcome back!");
        setTimeout(() => navigate("/home"), 1500);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
      setOtp(["", "", "", "", "", ""]);
      otpInputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await axios.post(apiUrl("/api/auth/google-auth"), { token: idToken });

      if (response.data.message === "Google auth successful.") {
        const { token, user } = response.data;
        setAuthSession({ token, user });
        setUser({ ...user, id: user.id || user._id, _id: user._id || user.id });
        toast.success("Google login successful!");
        setTimeout(() => navigate("/home"), 1000);
      } else {
        toast.error(response.data.message || "Google login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ["Sign in", "Verify OTP", "All set!"];

  return (
    <AuthLayout
      title="Pay smarter, live easier"
      subtitle="Recharge, pay bills, send money & book travel — all in one beautiful app."
      badge="Trusted by thousands across India"
    >
      <ToastContainer position="top-center" theme={darkMode ? "dark" : "light"} />

      {/* Step header */}
      <div className="mb-6">
        {step > 1 && step < 3 && (
          <button
            type="button"
            onClick={() => {
              setStep(step - 1);
              setOtp(["", "", "", "", "", ""]);
            }}
            className="mb-4 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <FaArrowLeft />
          </button>
        )}
        <h2 className="text-2xl font-display font-bold text-foreground">{stepLabels[step - 1]}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {step === 1 && "Enter your details to continue"}
          {step === 2 && "We sent a 6-digit code to your device"}
          {step === 3 && "Redirecting to your dashboard…"}
        </p>

        {/* Progress dots */}
        <div className="flex gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                step >= s ? "bg-gradient-to-r from-indigo-500 to-violet-500" : "bg-secondary"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="space-y-5"
          >
            <div className="segment-control">
              <button
                type="button"
                onClick={() => setLoginMethod("phone")}
                className={`segment-btn ${loginMethod === "phone" ? "segment-btn-active" : "segment-btn-inactive"}`}
              >
                <MdPhoneAndroid className="inline mr-1.5 -mt-0.5" />
                Phone
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod("email")}
                className={`segment-btn ${loginMethod === "email" ? "segment-btn-active" : "segment-btn-inactive"}`}
              >
                <MdEmail className="inline mr-1.5 -mt-0.5" />
                Email
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {loginMethod === "phone" ? "Mobile number" : "Email address"}
              </label>
              <div className="relative">
                {loginMethod === "phone" && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">
                    +91
                  </span>
                )}
                <input
                  type={loginMethod === "phone" ? "tel" : "email"}
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder={loginMethod === "phone" ? "9876543210" : "you@email.com"}
                  className={`input-modern ${loginMethod === "phone" ? "pl-14" : ""}`}
                  maxLength={loginMethod === "phone" ? 10 : undefined}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {loginMethod === "phone" ? "We'll send a one-time password via SMS" : "OTP will be sent to your email"}
              </p>
            </div>

            <button type="button" onClick={handleSendOTP} disabled={loading} className="btn-primary">
              {loading ? "Sending OTP…" : "Continue"}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs text-muted-foreground bg-card">or</span>
              </div>
            </div>

            <button type="button" onClick={loginWithGoogle} className="btn-secondary flex items-center justify-center gap-3">
              <FaGoogle className="text-red-500" />
              Continue with Google
            </button>

            <p className="text-center text-sm text-muted-foreground">
              New to PayManni?{" "}
              <Link to="/register-user" className="text-primary font-semibold hover:underline">
                Create account
              </Link>
            </p>

            <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
              By continuing you agree to our Terms of Service and Privacy Policy
            </p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="space-y-6"
          >
            <p className="text-sm text-muted-foreground text-center">
              Code sent to{" "}
              <span className="font-semibold text-foreground">
                {loginMethod === "phone"
                  ? `+91 ${phoneOrEmail.slice(0, 2)}****${phoneOrEmail.slice(-2)}`
                  : phoneOrEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
              </span>
            </p>

            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  onPaste={index === 0 ? handleOTPPaste : undefined}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-2 border-input bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
                />
              ))}
            </div>

            <div className="text-center text-sm">
              {canResend ? (
                <button
                  type="button"
                  onClick={() => {
                    setTimer(30);
                    setCanResend(false);
                    handleSendOTP();
                  }}
                  className="text-primary font-semibold hover:underline"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-muted-foreground">
                  Resend in <span className="text-primary font-semibold">{timer}s</span>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleVerifyOTP}
              disabled={loading || otp.join("").length !== 6}
              className="btn-primary"
            >
              {loading ? "Verifying…" : "Verify & sign in"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp(["", "", "", "", "", ""]);
              }}
              className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Change {loginMethod === "phone" ? "number" : "email"}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-5 ring-4 ring-emerald-500/20"
            >
              <FaCheckCircle className="text-emerald-500 text-4xl" />
            </motion.div>
            <h3 className="text-xl font-display font-bold text-foreground">You're in!</h3>
            <p className="text-muted-foreground mt-2">Taking you to your dashboard…</p>
            <div className="mt-6 flex justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default LoginUserNew;

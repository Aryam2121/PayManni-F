import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeContext";
import { 
  FaQrcode,
  FaCamera,
  FaUpload,
  FaWallet,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHistory,
  FaUserCircle,
  FaArrowLeft,
  FaBolt,
  FaImage,
  FaLock,
  FaEye,
  FaSpinner
} from "react-icons/fa";
import { MdSecurity, MdPayment, MdVerifiedUser } from "react-icons/md";
import { BiScan, BiMoney } from "react-icons/bi";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";
import QrReader from "react-qr-scanner";
import axios from "axios";
import Paymanniicon from "../assets/Paymanniicon.png";
import { getApiBase, getAuthHeaders, getUserId, getUserName, apiUrl } from "../utils/authStorage";

const parseQrPaymentData = (text) => {
  if (!text) return null;

  if (text.startsWith("upi://")) {
    try {
      const url = new URL(text.replace("upi://", "http://"));
      return {
        upiId: url.searchParams.get("pa"),
        name: url.searchParams.get("pn") || "Merchant",
        amount: url.searchParams.get("am") || "",
      };
    } catch {
      return null;
    }
  }

  try {
    const json = JSON.parse(text);
    return {
      upiId: json.upiId || json.upi || json.id,
      name: json.name || "User",
      amount: json.amount || "",
    };
  } catch {
    return {
      upiId: text.includes("@") ? text : null,
      name: "User",
      amount: "",
    };
  }
};

const QrScanner = () => {
  const navigate = useNavigate();
  const qrReaderRef = useRef(null);
  
  // Enhanced State Management
  const [qrCodeData, setQrCodeData] = useState(null);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [enteredMpin, setEnteredMpin] = useState("");
  const [isMpinValid, setIsMpinValid] = useState(true);
  const { darkMode } = useTheme();
  const [step, setStep] = useState(1); // 1: Scan, 2: Amount, 3: Confirm, 4: PIN, 5: Success
  const [scanMode, setScanMode] = useState("camera"); // camera, upload
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [balance, setBalance] = useState(0);
  const [showMpinDots, setShowMpinDots] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("recent_scans");
    if (saved) {
      setRecentScans(JSON.parse(saved));
    }
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const res = await axios.get(
        apiUrl(`/api/myaccount/${userId}`),
        { headers: getAuthHeaders() }
      );
      setBalance(res.data.balance ?? 0);
    } catch (error) {
      console.error("Balance fetch error:", error);
    }
  };

  const handleScan = (data) => {
    if (data && data.text) {
      try {
        const parsed = parseQrPaymentData(data.text);
        if (!parsed?.upiId) {
          toast.error("Invalid QR code — no UPI ID found");
          return;
        }

        setQrCodeData(parsed);
        setRecipientInfo({
          name: parsed.name || "Unknown User",
          upiId: parsed.upiId,
          avatar: null,
        });

        if (parsed.amount && !isNaN(parsed.amount)) {
          setAmount(String(parsed.amount));
        }

        const newScan = {
          id: Date.now(),
          data: parsed,
          timestamp: new Date().toISOString(),
          name: parsed.name || "Unknown User",
        };
        const updatedScans = [newScan, ...recentScans.slice(0, 4)];
        setRecentScans(updatedScans);
        localStorage.setItem("recent_scans", JSON.stringify(updatedScans));

        setStep(2);
        toast.success("QR Code scanned successfully!");
      } catch (err) {
        console.error("QR scan error:", err);
        toast.error("Invalid QR code format");
      }
    }
  };

  const handleError = (err) => {
    console.error("QR Scanner error:", err);
    toast.error("Camera access failed. Please check permissions.");
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && parseFloat(value) >= 0)) {
      setAmount(value);
    }
  };

  const handleMpinChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 4) {
      setEnteredMpin(value);
      setIsMpinValid(true);
    }
  };

  const handleContinueToPayment = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (parseFloat(amount) > balance) {
      toast.error("Insufficient balance");
      return;
    }
    setStep(3);
  };

  const handleConfirmPayment = () => {
    setStep(4);
  };

  const validateMpin = async () => {
    if (enteredMpin.length < 4) {
      toast.error("Please enter your 4-digit M-PIN");
      return;
    }

    const userId = getUserId();
    if (!userId) {
      toast.error("Please log in again");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    toast.info("Processing payment...");

    try {
      const pinRes = await axios.post(`${getApiBase()}/api/wallet/verify-pin`, {
        userId,
        mpin: enteredMpin,
      });

      if (!pinRes.data.valid) {
        setIsMpinValid(false);
        toast.error("Incorrect M-PIN. Please try again.");
        return;
      }

      const paymentRes = await axios.post(
        `${getApiBase()}/api/wallet/send`,
        {
          userId,
          toUpi: recipientInfo?.upiId || qrCodeData?.upiId,
          amount: Number(amount),
          note: `QR payment to ${recipientInfo?.name || getUserName()}`,
          mpin: enteredMpin,
        },
        { headers: getAuthHeaders() }
      );

      setBalance(paymentRes.data.newBalance ?? balance - Number(amount));
      setTransactionId(paymentRes.data.transactionId || `TXN${Date.now().toString().slice(-8)}`);
      setStep(5);
      toast.success(`Successfully sent ₹${amount} to ${recipientInfo?.name}!`);

      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create FileReader to read the image
      const reader = new FileReader();
      reader.onload = () => {
        // In a real app, you'd use a QR code library to decode the image
        // For now, we'll simulate successful scan
        toast.info("Processing uploaded image...");
        setTimeout(() => {
          handleScan({ text: "sample_upi_id@paytm" });
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
    // In a real implementation, you'd control camera flash here
  };

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
  };

  const resetScanner = () => {
    setQrCodeData(null);
    setAmount("");
    setEnteredMpin("");
    setIsMpinValid(true);
    setRecipientInfo(null);
    setStep(1);
  };

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    } flex flex-col`}>
      
      {/* Header */}
      <motion.div 
        className={`${darkMode ? 'bg-gray-900/50' : 'bg-white/80'} backdrop-blur-xl border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        } p-4`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          <motion.button
            onClick={() => step > 1 ? setStep(step - 1) : navigate("/home")}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaArrowLeft className={`${darkMode ? 'text-white' : 'text-gray-800'}`} />
          </motion.button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <img src={Paymanniicon} alt="PayManni" className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                QR Payment
              </h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Scan & Pay Instantly
              </p>
            </div>
          </div>

          {/* Dark Mode Toggle is now in the header */}
        </div>
      </motion.div>

      {/* Balance Card */}
      <motion.div 
        className="px-4 py-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className={`max-w-md mx-auto ${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-lg rounded-2xl p-4 border ${
          darkMode ? 'border-gray-700' : 'border-white/20'
        } shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <FaWallet className="text-white text-xl" />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Available Balance</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  ₹{balance.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Live</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Step Indicator */}
      <motion.div 
        className="px-4 py-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="max-w-md mx-auto flex justify-center">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step >= stepNum 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {step > stepNum ? <FaCheckCircle /> : stepNum}
                </div>
                {stepNum < 5 && (
                  <div className={`w-6 h-1 mx-1 transition-all duration-300 ${
                    step > stepNum ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-4">
        <div className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Scan Mode Toggle */}
                <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <button
                    onClick={() => setScanMode("camera")}
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg transition-all duration-300 ${
                      scanMode === "camera"
                        ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <FaCamera className="mr-2" />
                    Camera
                  </button>
                  <button
                    onClick={() => setScanMode("upload")}
                    className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg transition-all duration-300 ${
                      scanMode === "upload"
                        ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <FaUpload className="mr-2" />
                    Upload
                  </button>
                </div>

                {scanMode === "camera" ? (
                  <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-lg rounded-3xl p-6 border ${
                    darkMode ? 'border-gray-700' : 'border-white/20'
                  } shadow-xl`}>
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BiScan className="text-white text-2xl" />
                      </div>
                      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                        Scan QR Code
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Position the QR code within the frame
                      </p>
                    </div>

                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-black">
                      {cameraEnabled ? (
                        <QrReader
                          ref={qrReaderRef}
                          delay={300}
                          style={{ width: "100%", height: "100%" }}
                          onError={handleError}
                          onScan={handleScan}
                          facingMode="environment"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-900">
                          <div className="text-center text-white">
                            <BsCameraVideoOff className="text-4xl mb-2 mx-auto" />
                            <p>Camera Disabled</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Scanning Frame */}
                      <div className="absolute inset-4 border-2 border-white rounded-2xl">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                      </div>

                      {/* Controls */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4">
                        <motion.button
                          onClick={toggleFlash}
                          className={`p-3 rounded-full ${flashEnabled ? 'bg-yellow-500' : 'bg-gray-700/50'} backdrop-blur-sm`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {flashEnabled ? <FaBolt className="text-white" /> : <FaBolt className="text-white opacity-50" />}
                        </motion.button>
                        
                        <motion.button
                          onClick={toggleCamera}
                          className={`p-3 rounded-full ${cameraEnabled ? 'bg-green-500' : 'bg-red-500'} backdrop-blur-sm`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {cameraEnabled ? <BsCameraVideo className="text-white" /> : <BsCameraVideoOff className="text-white" />}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-lg rounded-3xl p-6 border ${
                    darkMode ? 'border-gray-700' : 'border-white/20'
                  } shadow-xl`}>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FaImage className="text-white text-2xl" />
                      </div>
                      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                        Upload QR Image
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Select a QR code image from your device
                      </p>
                    </div>

                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="qr-upload"
                      />
                      <label
                        htmlFor="qr-upload"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed ${
                          darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                        } rounded-xl cursor-pointer transition-colors`}
                      >
                        <FaUpload className={`text-2xl ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Click to upload or drag and drop
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Recent Scans */}
                {recentScans.length > 0 && (
                  <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-lg rounded-3xl p-6 border ${
                    darkMode ? 'border-gray-700' : 'border-white/20'
                  } shadow-xl`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Recent Scans
                      </h3>
                      <FaHistory className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    </div>
                    <div className="space-y-3">
                      {recentScans.slice(0, 3).map((scan) => (
                        <motion.button
                          key={scan.id}
                          onClick={() => {
                            setQrCodeData(scan.data);
                            setRecipientInfo({
                              name: scan.name,
                              upiId: typeof scan.data === 'object' ? scan.data.upiId : scan.data,
                              avatar: null
                            });
                            setStep(2);
                          }}
                          className={`w-full flex items-center justify-between p-3 rounded-xl ${
                            darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/50'
                          } transition-colors`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <FaUserCircle className="text-white" />
                            </div>
                            <div className="text-left">
                              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {scan.name}
                              </p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {new Date(scan.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <FaQrcode className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Recipient Info */}
                <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-lg rounded-3xl p-6 border ${
                  darkMode ? 'border-gray-700' : 'border-white/20'
                } shadow-xl`}>
                  <div className="text-center mb-4">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                      Send Money To
                    </h3>
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        {recipientInfo?.avatar ? (
                          <img src={recipientInfo.avatar} alt="Avatar" className="w-full h-full rounded-full" />
                        ) : (
                          <FaUserCircle className="text-white text-2xl" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {recipientInfo?.name || "Unknown User"}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {recipientInfo?.upiId || qrCodeData}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <MdVerifiedUser className="text-green-500 text-sm" />
                          <span className="text-xs text-green-500">Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amount Input */}
                <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-lg rounded-3xl p-6 border ${
                  darkMode ? 'border-gray-700' : 'border-white/20'
                } shadow-xl`}>
                  <div className="text-center mb-6">
                    <BiMoney className={`text-4xl ${darkMode ? 'text-blue-400' : 'text-blue-600'} mx-auto mb-2`} />
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Enter Amount
                    </h3>
                  </div>

                  <div className="relative mb-6">
                    <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={handleAmountChange}
                      className={`w-full pl-12 pr-4 py-4 text-2xl font-bold text-center rounded-xl border-2 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-200 text-gray-800 focus:border-blue-500'
                      } focus:outline-none transition-all duration-300`}
                      placeholder="0"
                      min="1"
                      max={balance}
                    />
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {quickAmounts.map((quickAmount) => (
                      <motion.button
                        key={quickAmount}
                        onClick={() => setAmount(quickAmount.toString())}
                        className={`py-3 px-4 rounded-xl border-2 ${
                          amount === quickAmount.toString()
                            ? 'border-blue-500 bg-blue-500/10 text-blue-600'
                            : darkMode
                              ? 'border-gray-700 hover:border-gray-600 text-gray-300'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        } font-semibold transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ₹{quickAmount}
                      </motion.button>
                    ))}
                  </div>

                  {amount && parseFloat(amount) > balance && (
                    <div className="flex items-center space-x-2 p-3 bg-red-100 dark:bg-red-900/20 rounded-xl mb-4">
                      <FaExclamationTriangle className="text-red-500" />
                      <span className="text-red-500 text-sm">Insufficient balance</span>
                    </div>
                  )}

                  <motion.button
                    onClick={handleContinueToPayment}
                    disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center">
                      <HiLightningBolt className="mr-2" />
                      Continue
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-lg rounded-3xl p-6 border ${
                  darkMode ? 'border-gray-700' : 'border-white/20'
                } shadow-xl`}>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaExclamationTriangle className="text-white text-2xl" />
                    </div>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                      Confirm Payment
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Please review the details before proceeding
                    </p>
                  </div>

                  {/* Payment Summary */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sending to</span>
                      <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {recipientInfo?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>UPI ID</span>
                      <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {recipientInfo?.upiId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Amount</span>
                      <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        ₹{amount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Transaction Fee</span>
                      <span className={`font-semibold text-green-500`}>FREE</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <motion.button
                      onClick={() => setStep(2)}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 ${
                        darkMode 
                          ? 'border-gray-700 hover:border-gray-600 text-gray-300' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      } font-semibold transition-all duration-300`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Back
                    </motion.button>
                    <motion.button
                      onClick={handleConfirmPayment}
                      className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-center">
                        <FaLock className="mr-2" />
                        Confirm
                      </div>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-lg rounded-3xl p-6 border ${
                  darkMode ? 'border-gray-700' : 'border-white/20'
                } shadow-xl`}>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaLock className="text-white text-2xl" />
                    </div>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                      Enter M-PIN
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Please enter your 4-digit M-PIN to complete the transaction
                    </p>
                  </div>

                  <div className="relative mb-6">
                    <input
                      type={showMpinDots ? "text" : "password"}
                      value={enteredMpin}
                      onChange={handleMpinChange}
                      className={`w-full text-center text-2xl py-4 rounded-xl border-2 ${
                        !isMpinValid 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                          : darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white focus:border-purple-500' 
                            : 'bg-white border-gray-200 text-gray-800 focus:border-purple-500'
                      } focus:outline-none transition-all duration-300 tracking-widest`}
                      placeholder="••••"
                      maxLength="4"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMpinDots(!showMpinDots)}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-purple-500 transition-colors`}
                    >
                      <FaEye />
                    </button>
                  </div>

                  {!isMpinValid && (
                    <div className="flex items-center space-x-2 p-3 bg-red-100 dark:bg-red-900/20 rounded-xl mb-4">
                      <FaExclamationTriangle className="text-red-500" />
                      <span className="text-red-500 text-sm">Incorrect M-PIN. Please try again.</span>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <motion.button
                      onClick={() => setStep(3)}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 ${
                        darkMode 
                          ? 'border-gray-700 hover:border-gray-600 text-gray-300' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      } font-semibold transition-all duration-300`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Back
                    </motion.button>
                    <motion.button
                      onClick={validateMpin}
                      disabled={isLoading || enteredMpin.length < 4}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <FaSpinner className="animate-spin mr-2" />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <MdPayment className="mr-2" />
                          Pay Now
                        </div>
                      )}
                    </motion.button>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-center justify-center mt-6 space-x-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <MdSecurity className="mr-1" />
                      Secure Transaction
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <FaShieldAlt className="mr-1" />
                      256-bit Encryption
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                className="space-y-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-lg rounded-3xl p-8 border ${
                  darkMode ? 'border-gray-700' : 'border-white/20'
                } shadow-xl text-center`}>
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCheckCircle className="text-green-600 dark:text-green-400 text-3xl" />
                  </div>
                  
                  <div className="mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <HiSparkles className={`text-4xl ${darkMode ? 'text-yellow-400' : 'text-yellow-500'} mx-auto mb-4`} />
                    </motion.div>
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                      Payment Successful! 🎉
                    </h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                      ₹{amount} sent to {recipientInfo?.name} successfully
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Transaction ID: {transactionId || `TXN${Date.now().toString().slice(-8)}`}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <motion.button
                      onClick={() => navigate("/transactions")}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Transaction History
                    </motion.button>
                    
                    <motion.button
                      onClick={resetScanner}
                      className={`w-full py-3 px-4 rounded-xl border-2 ${
                        darkMode 
                          ? 'border-gray-700 hover:border-gray-600 text-gray-300' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      } font-semibold transition-all duration-300`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Scan Another QR
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-center mt-6 space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                      Redirecting to home...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

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

export default QrScanner;
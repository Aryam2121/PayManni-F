import { apiUrl, getAuthHeaders, getUserId } from "../utils/authStorage";
import { useState, useEffect } from "react";
import { FaPlane, FaTrain, FaBus, FaWallet, FaRegMoneyBillAlt, FaQrcode, FaHeadset, FaUserCircle, FaBalanceScale, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdMovie, MdNotifications, MdClose, MdPayment } from "react-icons/md";
import { HiLightningBolt, HiCash } from "react-icons/hi";
import { BiTransfer } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";  
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import boy from "../assets/boy.png"
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import axios from "axios";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { darkMode } = useTheme();

  const [chatOpen, setChatOpen] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, message: " Cashback of ₹50 credited", time: "2 min ago", type: "success" },
    { id: 2, message: " Bill payment due tomorrow", time: "1 hour ago", type: "warning" }
  ]);
  const [loanAmount, setLoanAmount] = useState(0);
  const [accountDetails, setAccountDetails] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        // Check if user is available from context or localStorage
        const userId = getUserId();
        
        if (!userId) {
          navigate("/login");
          return;
        }

        const res = await axios.get(
          apiUrl(`/api/myaccount/${userId}`),
          { headers: getAuthHeaders() }
        );
  
        setAccountDetails(res.data);
        setLoading(false);
      } catch (error) {
        console.error("❌ Failed to fetch account details", error);
        setLoading(false);
      }
    };
  
    if (user) {
      fetchAccountDetails();
    } else {
      // Optionally handle the case when the user is not authenticated yet
      setLoading(false);
    }
  }, [user, navigate]);
  
  
  
  const { logout } = useAuth();

  const toggleChat = () => setChatOpen(!chatOpen);

  const handleLoanApplication = () => {
    if (loanAmount <= 0) {
      toast.error("Please enter a valid loan amount.");
      return;
    }
    toast.success(`Loan application submitted for ₹${loanAmount}!`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login-user");
  };
  
  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      {/* Header Section */}
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>

        {/* Header Content */}
        <div className="relative z-10 px-6 py-8">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-8">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-blue-600 font-bold text-xl">P</span>
              </div>
              <h1 className="text-2xl font-bold text-white">PayManni</h1>
            </motion.div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <motion.button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MdNotifications className="text-white text-xl" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </motion.button>

              {/* Dark Mode Toggle is now in the header */}
            </div>
          </div>

          {/* Balance Card */}
          {!loading ? (
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src={user?.profilePic || boy} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full border-2 border-white/30 shadow-lg" 
                  />
                  <div>
                    <h2 className="text-white font-semibold text-lg">
                      Hello, {accountDetails?.name || "User"}!
                    </h2>
                    <p className="text-white/70 text-sm">Welcome back</p>
                  </div>
                </div>
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="p-2 hover:bg-white/20 rounded-full transition-all duration-300"
                >
                  {balanceVisible ? <FaEye className="text-white" /> : <FaEyeSlash className="text-white" />}
                </button>
              </div>

              <div className="mb-6">
                <p className="text-white/70 text-sm mb-1">Available Balance</p>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-white">
                    {balanceVisible ? `₹${accountDetails?.balance || 0}` : "₹****"}
                  </span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full"
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: <BiTransfer className="text-xl" />, label: "Send", path: "/transfer" },
                  { icon: <MdPayment className="text-xl" />, label: "Pay", path: "/pay-bills" },
                  { icon: <FaQrcode className="text-xl" />, label: "Scan", path: "/qr-scanner" },
                  { icon: <FaWallet className="text-xl" />, label: "Recharge", path: "/recharge" }
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="text-white mb-1">{action.icon}</div>
                    <span className="text-white text-xs font-medium">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full border-4 border-t-4 border-white h-16 w-16"></div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-4 relative z-10">
        {/* Services Grid */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Services
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: <FaPlane className="text-2xl" />,
                title: "Flights",
                subtitle: "Book flights",
                path: "/flight-booking",
                gradient: "from-blue-500 to-blue-600",
                delay: 0.1
              },
              {
                icon: <FaTrain className="text-2xl" />,
                title: "Trains", 
                subtitle: "Book trains",
                path: "/train-booking",
                gradient: "from-green-500 to-green-600",
                delay: 0.2
              },
              {
                icon: <FaBus className="text-2xl" />,
                title: "Bus",
                subtitle: "Book buses", 
                path: "/bus-booking",
                gradient: "from-orange-500 to-orange-600",
                delay: 0.3
              },
              {
                icon: <MdMovie className="text-2xl" />,
                title: "Movies",
                subtitle: "Book tickets",
                path: "/movies",
                gradient: "from-purple-500 to-purple-600", 
                delay: 0.4
              },
              {
                icon: <FaRegMoneyBillAlt className="text-2xl" />,
                title: "Bills",
                subtitle: "Pay bills",
                path: "/pay-bills",
                gradient: "from-red-500 to-red-600",
                delay: 0.5
              },
              {
                icon: <FaUserCircle className="text-2xl" />,
                title: "Contacts",
                subtitle: "Pay contacts",
                path: "/pay-contacts", 
                gradient: "from-indigo-500 to-indigo-600",
                delay: 0.6
              },
              {
                icon: <FaBalanceScale className="text-2xl" />,
                title: "History",
                subtitle: "View transactions",
                path: "/balance-history",
                gradient: "from-teal-500 to-teal-600",
                delay: 0.7
              },
              {
                icon: <HiLightningBolt className="text-2xl" />,
                title: "Loans",
                subtitle: "Apply for loan",
                path: "/loan-application",
                gradient: "from-yellow-500 to-yellow-600",
                delay: 0.8
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                onClick={() => navigate(service.path)}
                className={`bg-gradient-to-r ${service.gradient} rounded-2xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: service.delay }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-white mb-3">{service.icon}</div>
                <h4 className="text-white font-semibold text-sm">{service.title}</h4>
                <p className="text-white/80 text-xs">{service.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Instant Loan Section */}
        <motion.div
          className={`rounded-2xl p-6 shadow-lg mb-8 ${
            darkMode 
              ? 'bg-gradient-to-r from-gray-800 to-gray-700' 
              : 'bg-gradient-to-r from-yellow-50 to-orange-50'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
              <HiCash className="text-white text-xl" />
            </div>
            <div>
              <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Instant Loan
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Get up to ₹50,000 instantly
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="Enter amount"
              className="flex-1 p-3 rounded-xl border-2 border-gray-200 focus:border-yellow-400 outline-none transition-all duration-300"
            />
            <motion.button
              onClick={() => {
                handleLoanApplication();
                navigate("/loan-application");
              }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Apply
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
                >
                  <MdClose className="text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    className="p-4 bg-gray-50 rounded-xl border-l-4 border-blue-500"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-gray-800 font-medium">{notification.message}</p>
                    <p className="text-gray-500 text-sm mt-1">{notification.time}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Support */}
      <motion.div
        className={`fixed bottom-6 right-6 ${
          chatOpen ? 'w-80 h-96' : 'w-14 h-14'
        } bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl transition-all duration-500 overflow-hidden z-40`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        {chatOpen ? (
          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-white font-semibold">Support Chat</h4>
              <button
                onClick={toggleChat}
                className="text-white hover:bg-white/20 p-1 rounded-full transition-all duration-300"
              >
                <MdClose />
              </button>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl p-3 mb-3 overflow-y-auto">
              <div className="text-white/80 text-sm">
                <p>👋 Hi! How can we help you today?</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none"
              />
              <button className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-all duration-300">
                <span className="text-white">→</span>
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={toggleChat}
            className="w-full h-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
          >
            <FaHeadset className="text-xl" />
          </button>
        )}
      </motion.div>

      {/* Logout Button */}
      <motion.button
        onClick={handleLogout}
        className="fixed bottom-6 left-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow-lg transition-all duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Logout
      </motion.button>

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

export default Home;
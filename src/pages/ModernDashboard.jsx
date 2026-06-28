import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaQrcode,
  FaPhoneAlt,
  FaBolt,
  FaCreditCard,
  FaUniversity,
  FaShoppingCart,
  FaFilm,
  FaBus,
  FaTrain,
  FaPlane,
  FaMoneyBillWave,
  FaChartLine,
  FaTrophy,
  FaGift,
  FaBell,
  FaUser,
  FaEllipsisV,
  FaSearch,
  FaStar,
  FaFire,
  FaHistory,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaCog,
} from "react-icons/fa";
import {
  MdPayment,
  MdAccountBalance,
  MdTrendingUp,
  MdTrendingDown,
  MdVerifiedUser,
  MdNotifications,
} from "react-icons/md";
import { BiMoney, BiTransfer } from "react-icons/bi";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import { RiShieldStarLine } from "react-icons/ri";
import axios from "axios";
import { getAuthToken, getStoredUser, getUserId, getAuthHeaders, getApiBase } from "../utils/authStorage";

const ModernDashboard = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalSpent: 0,
    totalReceived: 0,
    monthlySpending: 0,
    savingsRate: 0,
  });
  const [quickActions, setQuickActions] = useState([]);
  const [offers, setOffers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    initializeDashboard();
    setGreetingMessage();
  }, []);

  const setGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  };

  const initializeDashboard = async () => {
    try {
      setLoading(true);
      
      // Get user data
      const userData = getStoredUser() || {};
      setUser(userData);

      // Fetch wallet balance
      await fetchWalletBalance();
      
      // Fetch recent transactions
      await fetchRecentTransactions();
      
      // Calculate analytics
      calculateAnalytics();
      
      // Load quick actions
      loadQuickActions();
      
      // Load offers
      loadOffers();
      
      // Load notifications
      loadNotifications();
      
    } catch (error) {
      console.error("Dashboard initialization error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const userId = getUserId();
      const response = await axios.get(
        `${getApiBase()}/api/myaccount/${userId}`,
        { headers: getAuthHeaders() }
      );
      setBalance(response.data.balance || 0);
    } catch (error) {
      console.error("Balance fetch error:", error);
      setBalance(0);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const response = await axios.get(
        `${getApiBase()}/api/transactions/all`,
        { headers: getAuthHeaders() }
      );
      const txns = (response.data.transactions || response.data || []).slice(0, 4);
      setRecentTransactions(txns.length ? txns : getDemoTransactions());
    } catch (error) {
      console.error("Transactions fetch error:", error);
      setRecentTransactions(getDemoTransactions());
    }
  };

  const getDemoTransactions = () => [
    {
      id: 1,
      type: "sent",
      amount: 500,
      recipient: "John Doe",
      timestamp: new Date().toISOString(),
      status: "completed",
      icon: "user",
    },
    {
      id: 2,
      type: "received",
      amount: 1200,
      sender: "Sarah Wilson",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: "completed",
      icon: "user",
    },
    {
      id: 3,
      type: "bill",
      amount: 850,
      service: "Electricity Bill",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: "completed",
      icon: "bolt",
    },
    {
      id: 4,
      type: "recharge",
      amount: 299,
      service: "Mobile Recharge",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: "completed",
      icon: "phone",
    },
  ];

  const calculateAnalytics = () => {
    const sent = recentTransactions
      .filter((t) => t.type === "sent" || t.type === "bill" || t.type === "recharge")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const received = recentTransactions
      .filter((t) => t.type === "received")
      .reduce((sum, t) => sum + t.amount, 0);

    setAnalytics({
      totalSpent: sent,
      totalReceived: received,
      monthlySpending: sent,
      savingsRate: received > 0 ? ((received - sent) / received * 100).toFixed(1) : 0,
    });
  };

  const loadQuickActions = () => {
    setQuickActions([
      {
        id: 1,
        title: "Send Money",
        icon: <FaArrowUp />,
        color: "from-blue-500 to-blue-600",
        route: "/send-money",
      },
      {
        id: 2,
        title: "Receive",
        icon: <FaArrowDown />,
        color: "from-green-500 to-green-600",
        route: "/receive-money",
      },
      {
        id: 3,
        title: "Scan QR",
        icon: <FaQrcode />,
        color: "from-purple-500 to-purple-600",
        route: "/qr-scanner",
      },
      {
        id: 4,
        title: "Pay Bills",
        icon: <FaBolt />,
        color: "from-orange-500 to-orange-600",
        route: "/pay-bills",
      },
      {
        id: 5,
        title: "Recharge",
        icon: <FaPhoneAlt />,
        color: "from-pink-500 to-pink-600",
        route: "/recharge",
      },
      {
        id: 6,
        title: "To Bank",
        icon: <FaUniversity />,
        color: "from-indigo-500 to-indigo-600",
        route: "/transfer",
      },
      {
        id: 7,
        title: "Contacts",
        icon: <FaUser />,
        color: "from-teal-500 to-teal-600",
        route: "/pay-contacts",
      },
      {
        id: 8,
        title: "More",
        icon: <FaEllipsisV />,
        color: "from-gray-500 to-gray-600",
        route: "/home",
      },
    ]);
  };

  const loadOffers = () => {
    setOffers([
      {
        id: 1,
        title: "Cashback Bonanza! 🎉",
        description: "Get 10% cashback on recharges above ₹299",
        discount: "10% OFF",
        color: "from-yellow-400 to-orange-500",
        icon: <FaGift />,
      },
      {
        id: 2,
        title: "Bill Payment Offer",
        description: "Save ₹50 on electricity bill payments",
        discount: "₹50 OFF",
        color: "from-green-400 to-teal-500",
        icon: <FaBolt />,
      },
      {
        id: 3,
        title: "Bank Transfer Free",
        description: "Zero charges on bank transfers today!",
        discount: "FREE",
        color: "from-blue-400 to-indigo-500",
        icon: <FaUniversity />,
      },
    ]);
  };

  const loadNotifications = () => {
    setNotifications([
      {
        id: 1,
        title: "Payment Received",
        message: "You received ₹1,200 from Sarah Wilson",
        time: "2 min ago",
        read: false,
        icon: <FaCheckCircle className="text-green-500" />,
      },
      {
        id: 2,
        title: "New Offer Available",
        message: "Get 10% cashback on your next recharge",
        time: "1 hour ago",
        read: false,
        icon: <FaGift className="text-yellow-500" />,
      },
      {
        id: 3,
        title: "Bill Due Reminder",
        message: "Your electricity bill is due in 2 days",
        time: "3 hours ago",
        read: true,
        icon: <FaClock className="text-orange-500" />,
      },
    ]);
  };

  const getTransactionIcon = (transaction) => {
    switch (transaction.icon) {
      case "user":
        return <FaUser />;
      case "bolt":
        return <FaBolt />;
      case "phone":
        return <FaPhoneAlt />;
      default:
        return <FaMoneyBillWave />;
    }
  };

  const services = [
    { name: "Shopping", icon: <FaShoppingCart />, route: "/merchant-dashboard" },
    { name: "Movies", icon: <FaFilm />, route: "/movies" },
    { name: "Bus", icon: <FaBus />, route: "/bus-booking" },
    { name: "Train", icon: <FaTrain />, route: "/train-booking" },
    { name: "Flight", icon: <FaPlane />, route: "/flight-booking" },
    { name: "Loan", icon: <FaMoneyBillWave />, route: "/loan-application" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20 transition-colors duration-300">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-6 rounded-b-3xl shadow-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <motion.h1
                className="text-3xl font-bold mb-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {greeting}, {user?.name || "User"}! 👋
              </motion.h1>
              <motion.p
                className="text-purple-100 text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Welcome back to your financial hub
              </motion.p>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaBell className="text-xl" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </motion.button>
              
              <motion.button
                onClick={() => navigate("/profile")}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUser className="text-xl" />
              </motion.button>
            </div>
          </div>

          {/* Balance Card */}
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-purple-100 text-sm mb-1">Total Balance</p>
                <div className="flex items-center space-x-2">
                  <motion.h2
                    className="text-4xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    ₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </motion.h2>
                  <div className="flex items-center text-green-300 text-sm">
                    <MdTrendingUp className="mr-1" />
                    <span>+2.5%</span>
                  </div>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <FaWallet className="text-3xl" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <motion.button
                onClick={() => navigate("/wallet")}
                className="bg-white text-purple-600 py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaArrowDown />
                <span>Add Money</span>
              </motion.button>
              
              <motion.button
                onClick={() => navigate("/send-money")}
                className="bg-purple-500 py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaArrowUp />
                <span>Send Money</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            className="fixed top-20 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{notification.icon}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">
                        {notification.title}
                      </p>
                      <p className="text-gray-600 text-xs mt-1">
                        {notification.message}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <HiLightningBolt className="text-yellow-500 mr-2" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                onClick={() => navigate(action.route)}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center text-white text-2xl mb-3 mx-auto`}
                >
                  {action.icon}
                </div>
                <p className="text-gray-800 font-semibold text-sm">{action.title}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Analytics Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Spent</p>
                <h3 className="text-2xl font-bold">
                  ₹{analytics.totalSpent.toLocaleString()}
                </h3>
              </div>
              <FaArrowUp className="text-3xl opacity-50" />
            </div>
            <div className="flex items-center text-blue-100 text-sm">
              <MdTrendingDown className="mr-1" />
              <span>This month</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-green-100 text-sm mb-1">Received</p>
                <h3 className="text-2xl font-bold">
                  ₹{analytics.totalReceived.toLocaleString()}
                </h3>
              </div>
              <FaArrowDown className="text-3xl opacity-50" />
            </div>
            <div className="flex items-center text-green-100 text-sm">
              <MdTrendingUp className="mr-1" />
              <span>This month</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-purple-100 text-sm mb-1">Transactions</p>
                <h3 className="text-2xl font-bold">{recentTransactions.length}</h3>
              </div>
              <FaHistory className="text-3xl opacity-50" />
            </div>
            <div className="flex items-center text-purple-100 text-sm">
              <FaClock className="mr-1" />
              <span>Recent activity</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-orange-100 text-sm mb-1">Savings Rate</p>
                <h3 className="text-2xl font-bold">{analytics.savingsRate}%</h3>
              </div>
              <FaTrophy className="text-3xl opacity-50" />
            </div>
            <div className="flex items-center text-orange-100 text-sm">
              <FaStar className="mr-1" />
              <span>Keep it up!</span>
            </div>
          </div>
        </motion.div>

        {/* Offers Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaFire className="text-red-500 mr-2" />
            Hot Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {offers.map((offer, index) => (
              <motion.div
                key={offer.id}
                className={`bg-gradient-to-r ${offer.color} text-white p-6 rounded-2xl shadow-lg cursor-pointer relative overflow-hidden`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                  {offer.discount}
                </div>
                <div className="text-4xl mb-3 opacity-80">{offer.icon}</div>
                <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                <p className="text-sm opacity-90">{offer.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <HiSparkles className="text-purple-500 mr-2" />
            More Services
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {services.map((service, index) => (
              <motion.button
                key={index}
                onClick={() => navigate(service.route)}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-4xl text-purple-600 mb-2">{service.icon}</div>
                <p className="text-gray-800 font-semibold text-sm">{service.name}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FaHistory className="text-blue-500 mr-2" />
              Recent Transactions
            </h2>
            <button
              onClick={() => navigate("/transactions")}
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              View All →
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {recentTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.05 }}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      transaction.type === "received"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {getTransactionIcon(transaction)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {transaction.recipient || transaction.sender || transaction.service}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold text-lg ${
                      transaction.type === "received" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.type === "received" ? "+" : "-"}₹
                    {transaction.amount.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-end text-xs text-gray-500">
                    <FaCheckCircle className="text-green-500 mr-1" />
                    {transaction.status}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Security Badge */}
        <motion.div
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <FaShieldAlt className="text-3xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Your Money is Safe</h3>
                <p className="text-purple-100 text-sm">
                  256-bit encryption • RBI certified • 24/7 security monitoring
                </p>
              </div>
            </div>
            <MdVerifiedUser className="text-5xl opacity-50" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernDashboard;

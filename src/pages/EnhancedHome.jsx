import { apiUrl, getAuthHeaders, getUserId } from "../utils/authStorage";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FaWallet, 
  FaCreditCard, 
  FaRegMoneyBillAlt, 
  FaQrcode, 
  FaUserCircle, 
  FaBalanceScale,
  FaPlane, 
  FaTrain, 
  FaBus,
  FaHeadset,
  FaMobile,
  FaLightbulb,
  FaWifi,
  FaTv,
  FaGamepad,
  FaShoppingCart,
  FaGift,
  FaStar,
  FaTrophy,
  FaShieldAlt
} from "react-icons/fa";
import { MdMovie, MdLocalOffer, MdTrendingUp, MdSecurity, MdFlashOn } from "react-icons/md";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import boy from "../assets/boy.png";
import { useAuth } from "../context/AuthContext";
import { ServiceCard } from "../Components/ui/Card";
import { Button } from "../Components/ui/Button";
import axios from "axios";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [accountDetails, setAccountDetails] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [currentOffer, setCurrentOffer] = useState(0);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Sample offers data (like Paytm)
  const offers = [
    {
      id: 1,
      title: "Cashback Bonanza!",
      description: "Get up to ₹100 cashback on recharges",
      gradient: "from-purple-500 to-pink-600",
      icon: <FaGift />
    },
    {
      id: 2,
      title: "Movie Magic",
      description: "Book 2 tickets & get 1 FREE popcorn",
      gradient: "from-blue-500 to-cyan-600",
      icon: <MdMovie />
    },
    {
      id: 3,
      title: "Travel Special",
      description: "Flat ₹500 off on flight bookings",
      gradient: "from-green-500 to-emerald-600",
      icon: <FaPlane />
    }
  ];

  // Services data with Paytm-like categories
  const services = [
    {
      category: "Money Transfer",
      items: [
        {
          title: "Send Money",
          description: "To Bank/UPI/Wallet",
          icon: <FaCreditCard />,
          route: "/transfer",
          gradient: "from-blue-500 to-blue-600"
        },
        {
          title: "Receive Money",
          description: "Share QR & get paid",
          icon: <FaQrcode />,
          route: "/receive-money",
          gradient: "from-green-500 to-green-600"
        }
      ]
    },
    {
      category: "Recharge & Bills",
      items: [
        {
          title: "Mobile Recharge",
          description: "Prepaid/Postpaid",
          icon: <FaMobile />,
          route: "/recharge",
          gradient: "from-orange-500 to-red-500"
        },
        {
          title: "Pay Bills",
          description: "Electricity/Water/Gas",
          icon: <FaLightbulb />,
          route: "/pay-bills",
          gradient: "from-yellow-500 to-orange-500"
        },
        {
          title: "DTH/Cable",
          description: "TV recharge",
          icon: <FaTv />,
          route: "/recharge",
          gradient: "from-purple-500 to-pink-500"
        },
        {
          title: "Broadband",
          description: "Internet bills",
          icon: <FaWifi />,
          route: "/pay-bills",
          gradient: "from-cyan-500 to-blue-500"
        }
      ]
    },
    {
      category: "Travel & Entertainment",
      items: [
        {
          title: "Flight Tickets",
          description: "Book domestic/international",
          icon: <FaPlane />,
          route: "/flight-booking",
          gradient: "from-indigo-500 to-purple-500"
        },
        {
          title: "Train Tickets",
          description: "IRCTC booking",
          icon: <FaTrain />,
          route: "/train-booking",
          gradient: "from-green-500 to-teal-500"
        },
        {
          title: "Bus Tickets",
          description: "Intercity travel",
          icon: <FaBus />,
          route: "/bus-booking",
          gradient: "from-red-500 to-pink-500"
        },
        {
          title: "Movie Tickets",
          description: "Book shows nearby",
          icon: <MdMovie />,
          route: "/movies",
          gradient: "from-purple-500 to-indigo-500"
        }
      ]
    }
  ];

  // Quick actions like Paytm
  const quickActions = [
    { title: "Scan QR", icon: <FaQrcode />, route: "/qr-scanner" },
    { title: "Pay Contacts", icon: <FaUserCircle />, route: "/pay-contacts" },
    { title: "Check Balance", icon: <FaBalanceScale />, route: "/balance-history" },
    { title: "My Wallet", icon: <FaWallet />, route: "/wallet" }
  ];

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          navigate("/login-user");
          return;
        }

        const res = await axios.get(
          apiUrl(`/api/myaccount/${userId}`)
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
      setLoading(false);
    }
  }, [user, navigate]);

  // Auto-rotate offers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [offers.length]);

  const handleLogout = () => {
    logout();
    navigate("/login-user");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your PayManni experience...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <motion.div
        className="px-6 pt-6 pb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Welcome Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h1
              className="text-3xl font-bold text-white mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Hi, {accountDetails?.name || "User"}! 👋
            </motion.h1>
            <motion.p
              className="text-blue-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              What would you like to do today?
            </motion.p>
          </div>
          <motion.button
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/profile")}
          >
            <img 
              src={user?.profilePic || boy} 
              alt="Profile" 
              className="w-12 h-12 rounded-full border-2 border-white/30" 
            />
          </motion.button>
        </div>

        {/* Balance Card */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 mb-1">Total Balance</p>
              <motion.h2
                className="text-3xl font-bold text-white"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                ₹{accountDetails?.balance?.toLocaleString() || "0"}
              </motion.h2>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={() => navigate("/wallet")}
              >
                <FaWallet className="mr-2" />
                Add Money
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={() => navigate("/transactions")}
              >
                History
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-4 gap-4 mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center cursor-pointer border border-white/20"
              onClick={() => navigate(action.route)}
            >
              <div className="text-2xl text-white mb-2 flex justify-center">
                {action.icon}
              </div>
              <p className="text-xs text-blue-200 font-medium">{action.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Offers Carousel */}
        <motion.div
          className="relative h-32 mb-6 overflow-hidden rounded-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentOffer}
              className={`absolute inset-0 bg-gradient-to-r ${offers[currentOffer].gradient} p-6 flex items-center justify-between`}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">
                  {offers[currentOffer].title}
                </h3>
                <p className="text-white/90 text-sm">
                  {offers[currentOffer].description}
                </p>
              </div>
              <div className="text-4xl text-white/80">
                {offers[currentOffer].icon}
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Offer Indicators */}
          <div className="absolute bottom-2 left-6 flex space-x-2">
            {offers.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentOffer ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Services Section */}
      <div className="bg-white rounded-t-3xl px-6 pt-8 pb-20">
        {services.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + categoryIndex * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">{category.category}</h3>
              <HiSparkles className="text-yellow-500" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {category.items.map((service, index) => (
                <ServiceCard
                  key={service.title}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  gradient={service.gradient}
                  onClick={() => navigate(service.route)}
                  className="h-28"
                />
              ))}
            </div>
          </motion.div>
        ))}

        {/* Special Features */}
        <motion.div
          className="mt-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Special Features</h3>
            <MdFlashOn className="text-yellow-500" />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Loan Application */}
            <motion.div
              className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-2xl text-white"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold mb-2">💰 Instant Loan</h4>
                  <p className="text-sm opacity-90 mb-4">Get up to ₹50,000 instantly</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    onClick={() => navigate("/loan-application")}
                  >
                    Apply Now
                  </Button>
                </div>
                <div className="text-4xl opacity-80">
                  <HiLightningBolt />
                </div>
              </div>
            </motion.div>

            {/* Customer Support */}
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-2xl text-white"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold mb-2">🎧 24/7 Support</h4>
                  <p className="text-sm opacity-90 mb-4">Get help anytime, anywhere</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    onClick={() => navigate("/customer-support")}
                  >
                    Contact Us
                  </Button>
                </div>
                <div className="text-4xl opacity-80">
                  <FaHeadset />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full"
          >
            Logout
          </Button>
        </motion.div>
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
        theme="dark"
      />
    </div>
  );
};

export default Home;
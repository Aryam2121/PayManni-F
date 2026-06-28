import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { 
  FaSearch, 
  FaBell, 
  FaChevronDown, 
  FaBars, 
  FaTimes, 
  FaSun, 
  FaMoon,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaWallet,
  FaHistory
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import Paymanniicon from "../assets/Paymanniicon.png";
import panda from "../assets/panda.jpg";
import { clearAuthStorage, apiUrl, getAuthHeaders, getUserId } from "../utils/authStorage";
import { useAuth } from "../context/AuthContext";

const EnhancedHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { darkMode, toggleDarkMode } = useTheme();
  const [notifications] = useState([
    { id: 1, message: "Cashback of ₹50 credited to your wallet", time: "2m ago", unread: true },
    { id: 2, message: "Mobile recharge successful", time: "1h ago", unread: true },
    { id: 3, message: "Bill payment reminder", time: "3h ago", unread: false }
  ]);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const quickSearchSuggestions = [
    { title: "Mobile Recharge", route: "/recharge", icon: "📱" },
    { title: "Pay Bills", route: "/pay-bills", icon: "⚡" },
    { title: "Book Movie", route: "/movies", icon: "🎬" },
    { title: "Send Money", route: "/send-money", icon: "💸" },
    { title: "Flight Booking", route: "/flight-booking", icon: "✈️" }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = async () => {
    clearAuthStorage();
    logout();
    navigate("/login");
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      // Navigate to search results or specific service
      const suggestion = quickSearchSuggestions.find(s => 
        s.title.toLowerCase().includes(query.toLowerCase())
      );
      if (suggestion) {
        navigate(suggestion.route);
      }
      setSearchQuery("");
      setIsSearchFocused(false);
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <motion.header
        className={`${
          darkMode
            ? "bg-background/80 text-foreground border-border/60"
            : "bg-white/80 text-foreground border-border/60"
        } backdrop-blur-xl border-b px-4 sm:px-6 py-3 flex justify-between items-center shadow-sm fixed w-full z-50 transition-all duration-300`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer group"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/home")}
        >
          <div className="relative">
            <img src={Paymanniicon} alt="PayManni Logo" className="h-10 w-10" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
          </div>
          <div>
            <motion.span
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              PayManni
            </motion.span>
            <div className="flex items-center gap-1">
              <HiSparkles className="text-yellow-500 text-xs" />
              <span className="text-xs text-gray-500">Premium</span>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Search Bar */}
        <motion.div
          className={`hidden md:flex relative w-1/2 max-w-md ${
            darkMode ? "bg-gray-800" : "bg-gray-50"
          } rounded-2xl transition-all duration-300 ${
            isSearchFocused ? "ring-2 ring-blue-500 shadow-lg" : ""
          }`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center px-4 py-3">
            <FaSearch className={`text-gray-400 mr-3 transition-colors ${
              isSearchFocused ? "text-blue-500" : ""
            }`} />
            <input
              type="text"
              placeholder="Search services, recharge, bills..."
              className="w-full bg-transparent outline-none placeholder:text-gray-400 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            />
          </div>
          
          {/* Search Suggestions */}
          <AnimatePresence>
            {isSearchFocused && (
              <motion.div
                className={`absolute top-full mt-2 w-full ${
                  darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                } border rounded-xl shadow-xl z-50 overflow-hidden`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-2">
                  <p className="text-xs text-gray-500 px-3 py-2 font-medium">Quick Access</p>
                  {quickSearchSuggestions.map((suggestion) => (
                    <motion.div
                      key={suggestion.title}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                      whileHover={{ x: 5 }}
                      onClick={() => {
                        navigate(suggestion.route);
                        setIsSearchFocused(false);
                        setSearchQuery("");
                      }}
                    >
                      <span className="text-lg">{suggestion.icon}</span>
                      <span className="text-sm">{suggestion.title}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-8">
          {[
            { name: "Home", path: "/home" },
            { name: "Wallet", path: "/wallet" },
            { name: "Recharge", path: "/recharge" },
            { name: "Transactions", path: "/transactions" }
          ].map((item) => (
            <motion.button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`relative text-sm font-medium transition-colors duration-200 ${
                location.pathname === item.path
                  ? "text-blue-600"
                  : darkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {item.name}
              {location.pathname === item.path && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <motion.button
            type="button"
            className="relative cursor-pointer"
            onClick={() => navigate("/notifications")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Notifications"
          >
            <FaBell className="text-xl" />
            {unreadCount > 0 && (
              <motion.span
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>

          {/* Profile Dropdown */}
          <div className="relative">
            <motion.div
              className="cursor-pointer flex items-center space-x-3 group"
              onClick={toggleProfileDropdown}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <img 
                  src={user?.profilePic || panda} 
                  alt="Profile" 
                  className="rounded-full w-10 h-10 border-2 border-blue-500 shadow-md group-hover:border-blue-400 transition-colors" 
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500">Premium Member</p>
              </div>
              <FaChevronDown className={`text-sm text-gray-500 transition-transform duration-200 ${
                isProfileOpen ? "rotate-180" : ""
              }`} />
            </motion.div>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  className={`absolute right-0 mt-2 w-64 rounded-xl shadow-xl overflow-hidden ${
                    darkMode 
                      ? "bg-gray-900 text-white border border-gray-700" 
                      : "bg-white text-gray-900 border border-gray-200"
                  } z-50`}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Profile Header */}
                  <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={user?.profilePic || panda} 
                        alt="Profile" 
                        className="w-12 h-12 rounded-full border-2 border-blue-500" 
                      />
                      <div>
                        <p className="font-semibold">{user?.name || "User"}</p>
                        <p className="text-sm text-gray-500">Premium Member</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FaWallet className="text-xs text-green-500" />
                          <span className="text-xs text-green-500 font-medium">₹{user?.balance || "0"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {[
                      { icon: FaUser, label: "Profile", route: "/profile" },
                      { icon: FaHistory, label: "Transaction History", route: "/transactions" },
                      { icon: FaCog, label: "Settings", route: "/settings" }
                    ].map((item) => (
                      <motion.button
                        key={item.label}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                          darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                        }`}
                        whileHover={{ x: 5 }}
                        onClick={() => {
                          navigate(item.route);
                          setIsProfileOpen(false);
                        }}
                      >
                        <item.icon className="text-gray-500" />
                        <span>{item.label}</span>
                      </motion.button>
                    ))}
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                      <motion.button
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 transition-colors ${
                          darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                        }`}
                        whileHover={{ x: 5 }}
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark Mode Toggle */}
          <motion.button
            onClick={toggleDarkMode}
            className={`p-2 rounded-xl shadow-md transition-all duration-300 ${
              darkMode 
                ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300" 
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {darkMode ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
          </motion.button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleMenu} 
            className="lg:hidden text-2xl focus:outline-none ml-2"
          >
            <motion.div 
              animate={{ rotate: isMenuOpen ? 90 : 0 }} 
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </motion.div>
          </button>
        </div>
      </motion.header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className={`fixed top-20 left-0 right-0 p-4 shadow-xl z-40 lg:hidden ${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              {/* Mobile Search */}
              <div className={`flex items-center px-4 py-3 rounded-xl ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}>
                <FaSearch className="text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search services..."
                  className="w-full bg-transparent outline-none placeholder:text-gray-400 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
                />
              </div>

              {/* Mobile Menu Items */}
              <div className="space-y-2">
                {[
                  { name: "Home", path: "/home" },
                  { name: "Wallet", path: "/wallet" },
                  { name: "Recharge", path: "/recharge" },
                  { name: "Transactions", path: "/transactions" }
                ].map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => {
                      navigate(item.path);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                      location.pathname === item.path
                        ? "bg-blue-500 text-white"
                        : darkMode
                        ? "hover:bg-gray-800 text-gray-300"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                    whileHover={{ x: 5 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedHeader;
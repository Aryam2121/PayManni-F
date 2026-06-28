// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import PayManni from "../assets/PayManni.png";
// import Paymanniicon from "../assets/Paymanniicon.png";
// import { FaSearch, FaBell, FaChevronDown, FaBars, FaTimes, FaSun, FaMoon } from "react-icons/fa";
// import panda from "../assets/panda.jpg";
// import { useAuth } from "../context/AuthContext"; // Assuming you have an AuthContext for authentication
// import { useNavigate } from "react-router-dom";

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

//   const { logout } = useAuth(); // Assuming you have a signOut function from your auth context or library
//   const navigate = useNavigate();

//   // Toggle Functions
//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen);
//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem("darkMode", newMode);
//   };

//   const handleLogout = async () => {
//     // Clear any stored tokens
//     localStorage.removeItem("authToken");
//     sessionStorage.removeItem("authToken"); // if you're using this
  
//     // Call logout from AuthContext to clear state
//     logout();
  
//     // Navigate to login page
//     navigate("/login-user");
//   };

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", darkMode);
//   }, [darkMode]);

//   return (
//     <motion.header
//       className={`${
//         darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
//       } px-6 py-4 flex justify-between items-center shadow-md fixed w-full z-50 transition-all duration-300`}
//       initial={{ opacity: 0, y: -10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//     >
//       {/* Logo */}
//       <motion.div className="flex items-center cursor-pointer" whileHover={{ scale: 1.05 }}>
//         <img src={Paymanniicon} alt="PayManni Logo" className="h-10" />
//         <span className="ml-2 text-2xl font-bold">PayManni</span>
//       </motion.div>

//       {/* Search Bar */}
//       <motion.div
//         className={`hidden md:flex items-center px-4 py-2 rounded-full shadow-sm w-1/3 transition-all duration-300 ${
//           darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
//         }`}
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.4, duration: 0.6 }}
//       >
//         <FaSearch className="text-gray-500 mr-2" />
//         <input type="text" placeholder="Search for services..." className="w-full bg-transparent outline-none" />
//       </motion.div>

//       {/* Desktop Navigation */}
//       <nav className="hidden md:flex space-x-6">
//         {["Home", "Wallet", "Recharge", "Transactions"].map((item) => (
//           <motion.a
//             key={item}
//             href={`/${item.toLowerCase()}`}
//             className="text-lg font-medium hover:text-indigo-500 transition duration-300"
//             whileHover={{ scale: 1.1 }}
//           >
//             {item}
//           </motion.a>
//         ))}
//       </nav>

//       {/* Actions */}
//       <div className="flex items-center space-x-6">
//         {/* Notifications */}
//         <motion.div className="relative cursor-pointer" whileHover={{ scale: 1.1 }}>
//           <FaBell className="text-lg" />
//           <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">3</span>
//         </motion.div>

//         {/* Profile Dropdown */}
//         <div className="relative">
//           <motion.div className="cursor-pointer flex items-center space-x-2" onClick={toggleProfileDropdown} whileHover={{ scale: 1.1 }}>
//             <img src={panda} alt="Profile" className="rounded-full w-10 h-10 border-2 border-indigo-500" />
//             <FaChevronDown className="text-lg text-gray-500" />
//           </motion.div>

//           {isProfileOpen && (
//             <motion.div
//               className={`absolute right-0 mt-2 w-48 rounded-lg shadow-md overflow-hidden ${
//                 darkMode ? "bg-gray-900 text-white border border-gray-700" : "bg-white text-gray-900 border border-gray-200"
//               }`}
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <ul>
//                 {["Profile", "Settings"].map((item) => (
//                   <li
//                     key={item}
//                     className={`px-4 py-3 cursor-pointer transition duration-200 ${
//                       darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
//                     }`}
//                     onClick={() => setIsProfileOpen(false)}
//                   >
//                     <a href={`/${item.toLowerCase()}`} className="block w-full">
//                       {item}
//                     </a>
//                   </li>
//                 ))}
//                 <li
//                   className={`px-4 py-3 cursor-pointer transition duration-200 ${
//                     darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
//                   }`}
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </li>
//               </ul>
//             </motion.div>
//           )}
//         </div>

//         {/* Dark Mode Toggle */}
//         <motion.button
//           onClick={toggleDarkMode}
//           className={`p-2 rounded-full shadow-md transition duration-300 ease-in-out transform ${
//             darkMode ? "bg-yellow-500 text-gray-800" : "bg-gray-800 text-white"
//           }`}
//           whileHover={{ scale: 1.1 }}
//         >
//           {darkMode ? <FaSun /> : <FaMoon />}
//         </motion.button>
//       </div>

//       {/* Mobile Menu Toggle */}
//       <button onClick={toggleMenu} className="md:hidden text-2xl focus:outline-none">
//         <motion.div animate={{ rotate: isMenuOpen ? 90 : 0 }} transition={{ duration: 0.5 }}>
//           {isMenuOpen ? <FaTimes /> : <FaBars />}
//         </motion.div>
//       </button>

//       {/* Mobile Navigation */}
//       {isMenuOpen && (
//         <motion.div
//           className={`absolute top-16 left-0 w-full p-4 shadow-md z-50 ${
//             darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
//           }`}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <ul className="space-y-4 text-lg font-medium">
//             {["Home", "Wallet", "Recharge", "Transactions"].map((item) => (
//               <li key={item} onClick={() => setIsMenuOpen(false)}>
//                 <a href={`/${item.toLowerCase()}`} className="block hover:text-indigo-500">
//                   {item}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </motion.div>
//       )}
//     </motion.header>
//   );
// };

// export default Header;
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Paymanniicon from "../assets/Paymanniicon.png";
import { 
  FaSearch, 
  FaBell, 
  FaChevronDown, 
  FaBars, 
  FaTimes, 
  FaSun, 
  FaMoon,
  FaWallet,
  FaUser,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaCreditCard,
  FaQrcode,
  FaPhoneAlt
} from "react-icons/fa";
import { 
  MdNotifications, 
  MdAccountBalance, 
  MdTrendingUp,
  MdClose,
  MdSearch,
  MdPayment
} from "react-icons/md";
import { HiSparkles } from "react-icons/hi";
import panda from "../assets/panda.jpg";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [searchTerm, setSearchTerm] = useState("");

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Mock notifications
  const notifications = [
    { id: 1, title: "Payment Successful", message: "₹500 sent to John Doe", time: "2 min ago", type: "success" },
    { id: 2, title: "Bill Reminder", message: "Electricity bill due tomorrow", time: "1 hour ago", type: "warning" },
    { id: 3, title: "Cashback Earned", message: "₹25 cashback on your last transaction", time: "3 hours ago", type: "success" }
  ];

  const quickSearchSuggestions = [
    { icon: <FaHome />, title: "Home", path: "/home" },
    { icon: <FaWallet />, title: "Wallet", path: "/wallet" },
    { icon: <FaCreditCard />, title: "Recharge", path: "/recharge" },
    { icon: <FaQrcode />, title: "QR Pay", path: "/qr-scanner" },
    { icon: <FaHistory />, title: "History", path: "/balance-history" },
    { icon: <FaPhoneAlt />, title: "Support", path: "/customer-support" }
  ];

  const filteredSuggestions = quickSearchSuggestions.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleNotifications = () => setIsNotificationOpen(!isNotificationOpen);
  
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    toast.success(`${newMode ? 'Dark' : 'Light'} mode enabled!`);
  };

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    logout();
    toast.success("Logged out successfully!");
    navigate("/login-user");
  };

  const handleSearch = (suggestion) => {
    navigate(suggestion.path);
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsProfileOpen(false);
        setIsNotificationOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <motion.header
        className={`${
          darkMode 
            ? "bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white" 
            : "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white"
        } px-6 py-4 flex justify-between items-center shadow-xl fixed w-full z-50 backdrop-blur-lg border-b border-white/10`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/home")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
            <img src={Paymanniicon} alt="PayManni Logo" className="h-8 w-8" />
          </div>
          <div>
            <motion.span
              className="text-2xl font-bold tracking-wide"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              PayManni
            </motion.span>
            <p className="text-xs text-white/70 -mt-1">Digital Wallet</p>
          </div>
        </motion.div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center relative dropdown-container">
          <motion.div
            className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 w-96 hover:bg-white/15 transition-all duration-300"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <MdSearch className="text-white/70 mr-3 text-xl" />
            <input
              type="text"
              placeholder="Search payments, bills, recharge..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full bg-transparent outline-none text-white placeholder:text-white/60 text-sm"
            />
          </motion.div>

          {/* Search Dropdown */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                className="absolute top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">Quick Access</h4>
                  <div className="space-y-2">
                    {filteredSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        onClick={() => handleSearch(suggestion)}
                        className="flex items-center p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 dark:text-blue-400">{suggestion.icon}</span>
                        </div>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{suggestion.title}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Mobile Search Toggle */}
          <motion.button
            onClick={toggleSearch}
            className="md:hidden p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaSearch className="text-white text-lg" />
          </motion.button>

          {/* Notifications */}
          <div className="relative dropdown-container hidden md:block">
            <motion.button
              onClick={toggleNotifications}
              className="relative p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MdNotifications className="text-white text-xl" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {notifications.length}
                </span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">Notifications</h4>
                      <button
                        onClick={() => setIsNotificationOpen(false)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      >
                        <MdClose className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        whileHover={{ backgroundColor: darkMode ? '#374151' : '#f9fafb' }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                              {notification.title}
                            </h5>
                            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                              {notification.message}
                            </p>
                            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative dropdown-container">
            <motion.div
              className="cursor-pointer flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full p-1 pr-3 hover:bg-white/20 transition-all duration-300"
              onClick={toggleProfileDropdown}
              whileHover={{ scale: 1.05 }}
            >
              <img 
                src={user?.profilePic || panda} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-white/30 shadow-lg object-cover" 
              />
              <div className="hidden md:block text-left">
                <p className="text-white text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-white/70 text-xs">Premium</p>
              </div>
              <FaChevronDown className={`text-white/70 text-sm transition-transform duration-300 ${
                isProfileOpen ? 'rotate-180' : ''
              }`} />
            </motion.div>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Profile Header */}
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={user?.profilePic || panda} 
                        alt="Profile" 
                        className="w-12 h-12 rounded-full border-2 border-white/30 object-cover" 
                      />
                      <div>
                        <h4 className="font-semibold">{user?.name || "User"}</h4>
                        <p className="text-white/80 text-sm">{user?.phone || "Premium Member"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {[
                      { icon: <FaUser />, label: "My Profile", path: "/profile" },
                      { icon: <FaWallet />, label: "Wallet", path: "/wallet" },
                      { icon: <FaHistory />, label: "Transaction History", path: "/balance-history" },
                      { icon: <FaCog />, label: "Settings", path: "/settings" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        onClick={() => {
                          navigate(item.path);
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200"
                        whileHover={{ x: 4 }}
                      >
                        <span className="text-gray-600 dark:text-gray-400 mr-3">{item.icon}</span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{item.label}</span>
                      </motion.div>
                    ))}
                    
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    
                    <motion.div
                      onClick={handleLogout}
                      className="flex items-center px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-all duration-200"
                      whileHover={{ x: 4 }}
                    >
                      <FaSignOutAlt className="text-red-500 mr-3" />
                      <span className="text-red-500 font-medium">Logout</span>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark Mode Toggle */}
          <motion.button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full shadow-lg transition-all duration-300 ${
              darkMode 
                ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300" 
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
          >
            {darkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
          </motion.button>

          {/* Mobile Menu Toggle */}
          <button onClick={toggleMenu} className="md:hidden p-2 focus:outline-none">
            <motion.div 
              animate={{ rotate: isMenuOpen ? 180 : 0 }} 
              transition={{ duration: 0.3 }}
            >
              {isMenuOpen ? (
                <FaTimes className="text-white text-xl" />
              ) : (
                <FaBars className="text-white text-xl" />
              )}
            </motion.div>
          </button>
        </div>
      </motion.header>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && window.innerWidth < 768 && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <MdSearch className="text-gray-600 dark:text-gray-400 text-xl" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <MdClose className="text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {filteredSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    onClick={() => handleSearch(suggestion)}
                    className="flex items-center p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 dark:text-blue-400">{suggestion.icon}</span>
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{suggestion.title}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute right-0 top-20 w-80 max-w-[90vw] h-[calc(100vh-5rem)] bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                <div className="space-y-6">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white">
                    <img 
                      src={user?.profilePic || panda} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full border-2 border-white/30 object-cover" 
                    />
                    <div>
                      <h4 className="font-semibold">{user?.name || "User"}</h4>
                      <p className="text-white/80 text-sm">Premium Member</p>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-2">
                    {[
                      { icon: <FaHome />, label: "Home", path: "/home" },
                      { icon: <FaWallet />, label: "Wallet", path: "/wallet" },
                      { icon: <FaCreditCard />, label: "Recharge", path: "/recharge" },
                      { icon: <FaHistory />, label: "Transactions", path: "/balance-history" },
                      { icon: <FaQrcode />, label: "QR Pay", path: "/qr-scanner" },
                      { icon: <FaPhoneAlt />, label: "Support", path: "/customer-support" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        onClick={() => {
                          navigate(item.path);
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200"
                        whileHover={{ x: 4 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="text-gray-600 dark:text-gray-400 mr-4 text-lg">{item.icon}</span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{item.label}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Logout */}
                  <motion.div
                    onClick={handleLogout}
                    className="flex items-center p-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-all duration-200 mt-8"
                    whileHover={{ x: 4 }}
                  >
                    <FaSignOutAlt className="text-red-500 mr-4 text-lg" />
                    <span className="text-red-500 font-medium">Logout</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

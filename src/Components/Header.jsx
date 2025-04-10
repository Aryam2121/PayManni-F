import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PayManni from "../assets/PayManni.png";
import { FaSearch, FaBell, FaChevronDown, FaBars, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import panda from "../assets/panda.jpg";
import { useAuth } from "../context/AuthContext"; // Assuming you have an AuthContext for authentication
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  const { logout } = useAuth(); // Assuming you have a signOut function from your auth context or library
  const navigate = useNavigate();

  // Toggle Functions
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen);
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  const handleLogout = async () => {
    // Clear any stored tokens
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken"); // if you're using this
  
    // Call logout from AuthContext to clear state
    logout();
  
    // Navigate to login page
    navigate("/login-user");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <motion.header
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } px-6 py-4 flex justify-between items-center shadow-md fixed w-full z-50 transition-all duration-300`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo */}
      <motion.div className="flex items-center cursor-pointer" whileHover={{ scale: 1.05 }}>
        <img src={PayManni} alt="PayManni Logo" className="h-10" />
        <span className="ml-2 text-2xl font-bold">PayManni</span>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        className={`hidden md:flex items-center px-4 py-2 rounded-full shadow-sm w-1/3 transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <FaSearch className="text-gray-500 mr-2" />
        <input type="text" placeholder="Search for services..." className="w-full bg-transparent outline-none" />
      </motion.div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6">
        {["Home", "Wallet", "Recharge", "Transactions"].map((item) => (
          <motion.a
            key={item}
            href={`/${item.toLowerCase()}`}
            className="text-lg font-medium hover:text-indigo-500 transition duration-300"
            whileHover={{ scale: 1.1 }}
          >
            {item}
          </motion.a>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <motion.div className="relative cursor-pointer" whileHover={{ scale: 1.1 }}>
          <FaBell className="text-lg" />
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">3</span>
        </motion.div>

        {/* Profile Dropdown */}
        <div className="relative">
          <motion.div className="cursor-pointer flex items-center space-x-2" onClick={toggleProfileDropdown} whileHover={{ scale: 1.1 }}>
            <img src={panda} alt="Profile" className="rounded-full w-10 h-10 border-2 border-indigo-500" />
            <FaChevronDown className="text-lg text-gray-500" />
          </motion.div>

          {isProfileOpen && (
            <motion.div
              className={`absolute right-0 mt-2 w-48 rounded-lg shadow-md overflow-hidden ${
                darkMode ? "bg-gray-900 text-white border border-gray-700" : "bg-white text-gray-900 border border-gray-200"
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ul>
                {["Profile", "Settings"].map((item) => (
                  <li
                    key={item}
                    className={`px-4 py-3 cursor-pointer transition duration-200 ${
                      darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
                    }`}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <a href={`/${item.toLowerCase()}`} className="block w-full">
                      {item}
                    </a>
                  </li>
                ))}
                <li
                  className={`px-4 py-3 cursor-pointer transition duration-200 ${
                    darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
                  }`}
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </motion.div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <motion.button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full shadow-md transition duration-300 ease-in-out transform ${
            darkMode ? "bg-yellow-500 text-gray-800" : "bg-gray-800 text-white"
          }`}
          whileHover={{ scale: 1.1 }}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </motion.button>
      </div>

      {/* Mobile Menu Toggle */}
      <button onClick={toggleMenu} className="md:hidden text-2xl focus:outline-none">
        <motion.div animate={{ rotate: isMenuOpen ? 90 : 0 }} transition={{ duration: 0.5 }}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </motion.div>
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          className={`absolute top-16 left-0 w-full p-4 shadow-md z-50 ${
            darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ul className="space-y-4 text-lg font-medium">
            {["Home", "Wallet", "Recharge", "Transactions"].map((item) => (
              <li key={item} onClick={() => setIsMenuOpen(false)}>
                <a href={`/${item.toLowerCase()}`} className="block hover:text-indigo-500">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;

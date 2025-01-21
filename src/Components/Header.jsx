import React, { useState } from "react";
import { motion } from "framer-motion";
import PayManni from "../assets/PayManni.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <motion.header
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      } px-6 py-4 flex justify-between items-center shadow-lg fixed w-full z-50`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Logo */}
      <motion.h1
        className="text-3xl font-extrabold cursor-pointer flex items-center"
        whileHover={{ scale: 1.1 }}
      >
        <img src={PayManni} alt="PayManni Logo" className="h-10" />
        <span className="ml-2">PayManni</span>
      </motion.h1>

      {/* Search Bar */}
      <motion.div
        className={`hidden md:flex bg-gray-100 rounded-full px-4 py-2 shadow-md items-center w-1/3 ${
          darkMode ? "bg-gray-700 text-white" : "text-gray-700"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        <i className="fas fa-search text-gray-500 mr-2"></i>
        <input
          type="text"
          placeholder="Search for services..."
          className={`w-full bg-transparent outline-none ${
            darkMode ? "text-white" : "text-gray-700"
          }`}
        />
      </motion.div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6">
        {["Home", "Wallet", "Recharge", "Transactions"].map((item) => (
          <motion.a
            key={item}
            href={`/${item.toLowerCase()}`}
            className="text-lg font-medium hover:underline hover:text-indigo-500 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
          >
            {item}
          </motion.a>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <motion.div
          className="relative cursor-pointer"
          whileHover={{ scale: 1.1 }}
        >
          <i className="fas fa-bell text-lg"></i>
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
            3
          </span>
        </motion.div>

        {/* Profile Dropdown */}
        <div className="relative">
          <motion.div
            className="cursor-pointer flex items-center space-x-2"
            onClick={toggleProfileDropdown}
            whileHover={{ scale: 1.1 }}
          >
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="rounded-full w-10 h-10"
            />
            <i className="fas fa-chevron-down text-lg"></i>
          </motion.div>
          {isProfileOpen && (
            <motion.div
              className={`absolute right-0 mt-2 ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              } rounded-lg shadow-lg w-48 scale-95 origin-top transition-all duration-300`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <a href="/profile">Profile</a>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <a href="/settings">Settings</a>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <a href="/logout">Logout</a>
                </li>
              </ul>
            </motion.div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <motion.button
          onClick={toggleDarkMode}
          className={`${
            darkMode ? "bg-yellow-500 text-gray-800" : "bg-gray-800 text-white"
          } p-2 rounded-full shadow-md transition-all duration-300 ease-in-out transform`}
          whileHover={{ scale: 1.1 }}
        >
          {darkMode ? "🌞" : "🌙"}
        </motion.button>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleMenu}
        className="md:hidden text-2xl focus:outline-none"
      >
        <motion.i
          className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}
          animate={{ rotate: isMenuOpen ? 90 : 0 }}
          transition={{ duration: 0.5 }}
        ></motion.i>
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          className={`absolute top-16 left-0 w-full ${
            darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
          } shadow-lg z-50 p-4`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ul className="space-y-4 text-lg font-medium">
            {["Home", "Wallet", "Recharge", "Transactions"].map((item) => (
              <li key={item}>
                <a
                  href={`/${item.toLowerCase()}`}
                  className="block hover:underline hover:text-indigo-500"
                  onClick={() => setIsMenuOpen(false)}
                >
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

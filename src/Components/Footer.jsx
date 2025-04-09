import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

const Footer = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <motion.footer
      className="py-10 bg-gradient-to-br from-gray-800 via-indigo-700 to-purple-600 dark:from-gray-900 dark:via-gray-800 dark:to-black text-white text-center shadow-2xl relative transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-lg font-semibold tracking-wide">
          © 2025 <span className="font-bold text-yellow-400">PayManni</span>. All rights reserved.
        </p>

        {/* Links Section */}
        <div className="mt-5 flex justify-center space-x-6">
  <Link
    to="/privacy-policy"
    className="text-sm font-medium transition-all duration-300 hover:text-blue-300 dark:hover:text-yellow-400 hover:scale-105"
  >
    Privacy Policy
  </Link>
  <Link
    to="/terms-and-conditions"
    className="text-sm font-medium transition-all duration-300 hover:text-blue-300 dark:hover:text-yellow-400 hover:scale-105"
  >
    Terms of Service
  </Link>
  <Link
    to="/customer-support"
    className="text-sm font-medium transition-all duration-300 hover:text-blue-300 dark:hover:text-yellow-400 hover:scale-105"
  >
    Contact Support
  </Link>
</div>


        {/* Social Icons */}
        <div className="mt-6 flex justify-center space-x-5">
          {[
            { icon: Facebook, link: "https://facebook.com", color: "hover:text-blue-500 dark:hover:text-blue-300" },
            { icon: Twitter, link: "https://twitter.com", color: "hover:text-blue-400 dark:hover:text-blue-300" },
            { icon: Instagram, link: "https://instagram.com", color: "hover:text-pink-400 dark:hover:text-pink-300" },
          ].map(({ icon: Icon, link, color }, index) => (
            <motion.a
              key={index}
              href={link}
              className={`text-2xl ${color} transition-all`}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon size={28} />
            </motion.a>
          ))}
        </div>

        {/* Dark Mode Toggle Button */}
        <div className="mt-6">
          {/* <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 dark:text-yellow-300 text-gray-800 shadow-md transition-all hover:scale-105"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-sm font-medium">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button> */}
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;

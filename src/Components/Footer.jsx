import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    // Footer
    <motion.footer
      className=" py-8 bg-gradient-to-r from-gray-700 to-indigo-600 text-white text-center shadow-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      <div className="max-w-screen-xl mx-auto px-4">
        <p className="text-lg font-semibold">
          © 2024 <span className="font-bold text-yellow-400">PayManni</span>. All rights reserved.
        </p>
        
        {/* Links Section */}
        <div className="mt-4 flex justify-center space-x-6">
          <Link
            to="/privacy"
            className="text-sm hover:text-blue-300 transition-all duration-300"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="text-sm hover:text-blue-300 transition-all duration-300"
          >
            Terms of Service
          </Link>
          <Link
            to="/support"
            className="text-sm hover:text-blue-300 transition-all duration-300"
          >
            Need Help? Contact Support
          </Link>
        </div>
        
        {/* Social Icons Section */}
        <div className="mt-6 flex justify-center space-x-4">
          <motion.a
            href="https://facebook.com"
            className="text-2xl hover:text-blue-500"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          >
            <i className="fab fa-facebook"></i>
          </motion.a>
          <motion.a
            href="https://twitter.com"
            className="text-2xl hover:text-blue-400"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          >
            <i className="fab fa-twitter"></i>
          </motion.a>
          <motion.a
            href="https://instagram.com"
            className="text-2xl hover:text-pink-400"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          >
            <i className="fab fa-instagram"></i>
          </motion.a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;

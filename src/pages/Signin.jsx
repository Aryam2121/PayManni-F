import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const SigninPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "https://profound-scorpion-72.accounts.dev/sign-in";

    }, 2500); 
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center p-6 bg-gray-800 rounded-lg shadow-lg"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="flex justify-center items-center w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full"
        ></motion.div>
        <p className="mt-6 text-lg font-semibold tracking-wide">Redirecting to sign-in...</p>
        <p className="text-sm text-gray-400 mt-2">Please wait while we securely sign you in.</p>
      </motion.div>
    </div>
  );
};

export default SigninPage;
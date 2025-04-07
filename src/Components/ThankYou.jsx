import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ThankYou() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home"); // Redirect to homepage after 6 seconds
    }, 6000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 p-10 rounded-3xl shadow-2xl max-w-md w-full text-center"
      >
        <CheckCircle2 className="text-green-400 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">Thank You!</h1>
        <p className="text-gray-300 mb-4 text-lg">
          Your movie booking was successful 🎬
        </p>
        <p className="text-sm text-gray-400">You'll be redirected to the homepage shortly.</p>

        <div className="mt-6">
          <button
            onClick={() => navigate("/")}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-all"
          >
            Go to Home Now
          </button>
        </div>
      </motion.div>
    </div>
  );
}

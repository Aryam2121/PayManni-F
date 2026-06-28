import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaWallet, FaHistory, FaPaperPlane, FaCog } from "react-icons/fa";
import { MdAccountBalance } from "react-icons/md";

const tabs = [
  { path: "/home", label: "Home", icon: FaWallet },
  { path: "/transactions", label: "History", icon: FaHistory },
  { path: "/send-money", label: "Send", icon: FaPaperPlane, center: true },
  { path: "/bank-services", label: "Banking", icon: MdAccountBalance },
  { path: "/settings", label: "Settings", icon: FaCog },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4 sm:pb-6">
        <motion.div
          className="glass-dark backdrop-blur-2xl rounded-3xl px-4 sm:px-6 py-3 border border-gray-700/50 shadow-2xl pointer-events-auto"
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <div className="flex items-center justify-around">
            {tabs.map((tab) => {
              const active = location.pathname === tab.path;
              const Icon = tab.icon;

              if (tab.center) {
                return (
                  <motion.button
                    key={tab.path}
                    type="button"
                    onClick={() => navigate(tab.path)}
                    className="relative -mt-8"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={tab.label}
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                      <Icon className="text-white text-xl sm:text-2xl" />
                    </div>
                  </motion.button>
                );
              }

              return (
                <motion.button
                  key={tab.path}
                  type="button"
                  onClick={() => navigate(tab.path)}
                  className={`flex flex-col items-center gap-0.5 py-1 min-w-[3rem] relative ${
                    active ? "text-blue-400" : "text-gray-400 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {active && (
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-500 rounded-full" />
                  )}
                  <Icon className="text-xl sm:text-2xl" />
                  <span className="text-[10px] sm:text-xs font-medium">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

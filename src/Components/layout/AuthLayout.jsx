import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { FaShieldAlt, FaBolt, FaWallet, FaQrcode } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { useTheme } from "../../context/ThemeContext";
import Paymanniicon from "../../assets/Paymanniicon.png";

const features = [
  { icon: FaBolt, text: "Instant UPI payments" },
  { icon: FaWallet, text: "Smart digital wallet" },
  { icon: FaQrcode, text: "Scan & pay anywhere" },
  { icon: FaShieldAlt, text: "Bank-grade security" },
];

export default function AuthLayout({
  children,
  title = "PayManni",
  subtitle = "India's smartest payment app",
  badge,
}) {
  const { darkMode } = useTheme();

  return (
    <div className={`auth-page min-h-screen flex ${darkMode ? "dark" : ""}`}>
      {/* Brand panel — desktop */}
      <motion.aside
        className="hidden lg:flex lg:w-[44%] xl:w-[42%] relative overflow-hidden auth-brand-panel"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center ring-1 ring-white/20">
                <img src={Paymanniicon} alt="PayManni" className="w-8 h-8 rounded-lg" />
              </div>
              <span className="text-2xl font-display font-bold text-white tracking-tight">
                PayManni
              </span>
            </div>

            <motion.h1
              className="text-4xl xl:text-5xl font-display font-bold text-white leading-tight mb-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {title}
            </motion.h1>
            <motion.p
              className="text-lg text-white/75 max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {subtitle}
            </motion.p>

            {badge && (
              <motion.div
                className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20 text-sm text-white/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <HiSparkles className="text-amber-300" />
                {badge}
              </motion.div>
            )}
          </div>

          <div className="space-y-4">
            {features.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                className="flex items-center gap-3 text-white/80"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
              >
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Icon className="text-white/90 text-sm" />
                </div>
                <span className="text-sm font-medium">{text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative orbs */}
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
      </motion.aside>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 app-mesh-bg">
        <motion.div
          className="w-full max-w-[440px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <img src={Paymanniicon} alt="PayManni" className="w-11 h-11 rounded-2xl shadow-glow" />
            <div>
              <p className="font-display font-bold text-xl text-foreground">PayManni</p>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>

          <div className="auth-card">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  badge: PropTypes.string,
};

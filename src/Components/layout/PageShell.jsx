import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import BottomNav from "./BottomNav";

export default function PageShell({
  title,
  subtitle,
  backTo = "/home",
  showBack = true,
  showBottomNav = true,
  headerRight,
  children,
  maxWidth = "max-w-4xl",
  noPadding = false,
}) {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen app-mesh-bg ${noPadding ? "" : "px-4 sm:px-6 py-6 pb-28"}`}>
      <div className={`${maxWidth} mx-auto`}>
        {(title || showBack) && (
          <motion.header
            className="flex items-start justify-between gap-4 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-start gap-3">
              {showBack && (
                <motion.button
                  type="button"
                  onClick={() => navigate(backTo)}
                  className={`mt-0.5 p-2.5 rounded-xl transition-colors ${
                    darkMode
                      ? "bg-white/5 hover:bg-white/10 text-white"
                      : "bg-white/80 hover:bg-white text-gray-700 shadow-sm"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Go back"
                >
                  <FaArrowLeft />
                </motion.button>
              )}
              <div>
                {title && (
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm sm:text-base text-muted-foreground mt-1">{subtitle}</p>
                )}
              </div>
            </div>
            {headerRight && <div className="flex-shrink-0">{headerRight}</div>}
          </motion.header>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          {children}
        </motion.div>
      </div>
      {showBottomNav && <BottomNav />}
    </div>
  );
}

PageShell.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  backTo: PropTypes.string,
  showBack: PropTypes.bool,
  showBottomNav: PropTypes.bool,
  headerRight: PropTypes.node,
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.string,
  noPadding: PropTypes.bool,
};

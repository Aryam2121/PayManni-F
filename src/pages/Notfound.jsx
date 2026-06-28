import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaThLarge, FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-8xl font-display font-bold text-gradient mb-2">404</p>
        <h1 className="text-2xl font-bold text-foreground mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex items-center justify-center gap-2 !w-auto px-6">
            <FaArrowLeft /> Go back
          </button>
          <Link to="/home" className="btn-primary flex items-center justify-center gap-2 !w-auto px-6">
            <FaHome /> Home
          </Link>
          <Link to="/services" className="btn-secondary flex items-center justify-center gap-2 !w-auto px-6">
            <FaThLarge /> Services
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

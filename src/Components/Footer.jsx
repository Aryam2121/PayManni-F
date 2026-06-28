import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Heart } from "lucide-react";
import Paymanniicon from "../assets/Paymanniicon.png";

const Footer = () => {
  return (
    <footer className="relative mt-auto border-t border-border/60 bg-card/50 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex items-center gap-3">
            <img src={Paymanniicon} alt="PayManni" className="w-10 h-10 rounded-xl" />
            <div>
              <p className="font-display font-bold text-lg text-foreground">PayManni</p>
              <p className="text-xs text-muted-foreground">Smart payments for modern India</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link to="/terms-and-conditions" className="text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <Link to="/customer-support" className="text-muted-foreground hover:text-primary transition-colors">
              Support
            </Link>
          </div>

          <div className="flex gap-3">
            {[
              { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
              { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
              { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2.5 rounded-xl bg-secondary/80 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} PayManni. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={12} className="text-rose-500 fill-rose-500" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

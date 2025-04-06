import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white px-4 py-12 md:px-16 font-inter relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-10 left-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full pointer-events-none animate-pulse" />

      <div className="max-w-5xl mx-auto backdrop-blur-sm bg-white/5 p-6 md:p-10 rounded-2xl shadow-2xl border border-white/10 space-y-10">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-blue-400 w-7 h-7" />
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Privacy Policy
            </h1>
          </div>
          <Link
            to="/home"
            className="flex items-center text-sm text-white/70 hover:text-blue-400 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </motion.div>

        {/* Content */}
        <motion.div
          className="space-y-10 text-white/90 text-sm leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p className="text-white/80">
            At <span className="text-white font-semibold">PayManni</span>, we take your privacy seriously. This policy outlines how we collect, use, and protect your information.
          </p>

          <PolicySection
            title="1. Information We Collect"
            items={[
              "Personal data such as name, email, and contact information.",
              "Transaction data including payments and top-ups.",
              "Device and usage data such as IP address and device type.",
            ]}
          />

          <PolicySection
            title="2. How We Use Your Information"
            items={[
              "Provide and improve our services.",
              "Process transactions and customer support requests.",
              "Ensure security and prevent fraud.",
            ]}
          />

          <PolicySection
            title="3. Data Protection"
            description="We implement advanced security measures and encryption protocols to protect your data. We do not sell or share your personal data with third parties without your consent."
          />

          <PolicySection
            title="4. Cookies"
            description="PayManni uses cookies to enhance user experience and collect analytics. You can manage cookies through your browser settings."
          />

          <PolicySection
            title="5. Your Rights"
            description={
              <>
                You can request to view, update, or delete your personal data at any time. Please contact us at{" "}
                <a
                  href="mailto:support@paymanni.com"
                  className="text-blue-400 underline hover:text-blue-300 transition"
                >
                  support@paymanni.com
                </a>
                .
              </>
            }
          />

          <PolicySection
            title="6. Updates to This Policy"
            description="This privacy policy may be updated occasionally. Any changes will be reflected on this page with an updated revision date."
          />

          <p className="text-white/60 text-xs text-right mt-8">
            Last updated: April 6, 2025
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const PolicySection = ({ title, items, description }) => (
  <div className="space-y-2">
    <h2 className="text-white text-lg font-semibold border-l-4 border-blue-500 pl-3">{title}</h2>
    {description && <p className="text-white/80">{description}</p>}
    {items && (
      <ul className="list-disc ml-6 space-y-1 text-white/80">
        {items.map((item, idx) => (
          <li key={idx} className="hover:text-blue-400 transition">{item}</li>
        ))}
      </ul>
    )}
  </div>
);

export default PrivacyPolicy;

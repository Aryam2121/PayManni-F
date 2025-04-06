import React from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white px-4 py-12 md:px-16 font-inter relative overflow-hidden">
      {/* Glowing Background */}
      <div className="absolute top-10 left-0 w-72 h-72 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-500/10 blur-3xl rounded-full pointer-events-none animate-pulse" />

      <div className="max-w-5xl mx-auto backdrop-blur-sm bg-white/5 p-6 md:p-10 rounded-2xl shadow-2xl border border-white/10 space-y-10">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <FileText className="text-indigo-400 w-7 h-7" />
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Terms & Conditions
            </h1>
          </div>
          <Link
            to="/home"
            className="flex items-center text-sm text-white/70 hover:text-indigo-400 transition-all"
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
            Welcome to <span className="font-semibold text-white">PayManni</span>. By accessing or using our services, you agree to be bound by the following terms and conditions.
          </p>

          <Section
            title="1. Acceptance of Terms"
            description="By creating an account or using any PayManni services, you agree to comply with and be legally bound by these terms."
          />

          <Section
            title="2. User Responsibilities"
            items={[
              "Provide accurate and up-to-date information during registration.",
              "Maintain confidentiality of your login credentials.",
              "Use the service only for lawful purposes.",
            ]}
          />

          <Section
            title="3. Service Usage"
            description="PayManni may suspend or terminate your access if any suspicious, fraudulent, or unauthorized activity is detected."
          />

          <Section
            title="4. Intellectual Property"
            description="All content, branding, and software on PayManni are the intellectual property of the company and protected by copyright laws."
          />

          <Section
            title="5. Limitation of Liability"
            description="We are not liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services."
          />

          <Section
            title="6. Modifications"
            description="We reserve the right to update or modify these terms at any time. Continued use of the service indicates acceptance of the revised terms."
          />

          <Section
            title="7. Contact Us"
            description={
              <>
                For any questions, please contact our support at{" "}
                <a
                  href="mailto:support@paymanni.com"
                  className="text-indigo-400 underline hover:text-indigo-300 transition"
                >
                  support@paymanni.com
                </a>
                .
              </>
            }
          />

          <p className="text-white/60 text-xs text-right mt-8">
            Last updated: April 6, 2025
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const Section = ({ title, items, description }) => (
  <div className="space-y-2">
    <h2 className="text-white text-lg font-semibold border-l-4 border-indigo-500 pl-3">{title}</h2>
    {description && <p className="text-white/80">{description}</p>}
    {items && (
      <ul className="list-disc ml-6 space-y-1 text-white/80">
        {items.map((item, i) => (
          <li key={i} className="hover:text-indigo-400 transition">{item}</li>
        ))}
      </ul>
    )}
  </div>
);

export default TermsAndConditions;

import React, { useState, useEffect } from "react";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { motion } from "framer-motion";
import axios from "axios";

const Transactions = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTxnId, setExpandedTxnId] = useState(null); // for toggling

  const fetchTransactions = async (token) => {
    try {
   
      const res = await axios.get(
        `https://${import.meta.env.VITE_BACKEND}/api/transactions/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactions(res.data.transactions || []);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem("paymanni_token");
    if (token) {
      fetchTransactions(token); // Pass token here
    }
  }, []);
  

  return (
    <div
      className={`min-h-screen px-6 py-12 transition-all ${
        isDarkMode ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed top-6 right-6 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all"
      >
        {isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>

      <motion.h2
        className="text-4xl font-extrabold text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Transaction History
      </motion.h2>

      {loading ? (
        <div className="text-center text-lg font-semibold animate-pulse">Loading...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center text-xl font-semibold mt-10">No transactions found.</div>
      ) : (
        <motion.ul
          className="w-full max-w-4xl mx-auto space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          
{transactions.map((txn, index) => {
  const details = txn.details || {};
  const isExpanded = expandedTxnId === details._id;

  return (
    <motion.li
      key={details._id || `txn-${index}`}
      onClick={() => setExpandedTxnId(isExpanded ? null : details._id)}
      className={`cursor-pointer flex flex-col gap-4 p-6 rounded-2xl shadow-xl border transition-all transform ${
        details.type === "debit"
          ? "bg-red-500/10 border-red-400/50"
          : "bg-green-500/10 border-green-400/50"
      } hover:scale-[1.02]`}
      whileHover={{ scale: 1.03 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {details.type === "debit" ? (
            <AiOutlineArrowDown className="text-red-400 text-3xl" />
          ) : (
            <AiOutlineArrowUp className="text-green-400 text-3xl" />
          )}
          <div>
            <p className="text-lg font-bold">{txn.type}</p>
            <p className="text-sm opacity-70">
              {new Date(txn.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <span
          className={`text-2xl font-bold ${
            details.type === "debit" ? "text-red-400" : "text-green-400"
          }`}
        >
          ₹{txn.amount.toLocaleString()}
        </span>
      </div>

      {/* Expanded Section */}
      {isExpanded && (
        <motion.div
          className="bg-white/5 p-4 rounded-xl border border-white/10 text-sm space-y-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <p><strong>Description:</strong> {details.description}</p>
          <p><strong>Amount:</strong> ₹{details.amount}</p>
          <p><strong>Date:</strong> {new Date(details.date).toLocaleDateString()}</p>
          <p><strong>Type:</strong> {details.type}</p>
          <p><strong>Type Tag:</strong> {txn.typeTag}</p>
        </motion.div>
      )}
    </motion.li>
  );
})}
        </motion.ul>
      )}
    </div>
  );
};

export default Transactions;

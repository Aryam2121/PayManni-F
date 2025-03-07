import React, { useState } from "react";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { motion } from "framer-motion";

const Transactions = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const transactions = [
    { id: 1, date: "2024-12-25", amount: 500, type: "Debit" },
    { id: 2, date: "2024-12-20", amount: 1000, type: "Credit" },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-6 py-12 transition-all ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-6 right-6 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all"
      >
        {isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>

      <motion.h2
        className="text-4xl font-extrabold text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Transactions
      </motion.h2>

      <motion.ul
        className="w-full max-w-3xl space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {transactions.map((txn) => (
          <motion.li
            key={txn.id}
            className={`flex justify-between items-center p-5 rounded-lg shadow-md transition-all transform ${
              txn.type === "Debit"
                ? "bg-red-500/20 border-red-400"
                : "bg-green-500/20 border-green-400"
            } border hover:scale-105`}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center space-x-3">
              {txn.type === "Debit" ? (
                <AiOutlineArrowDown className="text-red-400 text-3xl" />
              ) : (
                <AiOutlineArrowUp className="text-green-400 text-3xl" />
              )}
              <span className="text-lg font-semibold">{txn.date}</span>
            </div>

            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-white text-sm font-bold ${
                  txn.type === "Debit" ? "bg-red-500" : "bg-green-500"
                }`}
              >
                {txn.type}
              </span>
              <span
                className={`text-2xl font-bold ${
                  txn.type === "Debit" ? "text-red-400" : "text-green-400"
                }`}
              >
                ₹{txn.amount.toLocaleString()}
              </span>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default Transactions;

import React, { useEffect, useState } from 'react';
import {
  Banknote,
  RefreshCw,
  CreditCard,
  History,
  ShieldCheck,
  KeyRound,
  Copy
} from "lucide-react";
import { motion } from "framer-motion";


import axios from 'axios';


const BankServices = () => {
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState(null);
  const [bankData, setBankData] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleCopy = () => {
    if (bankData?.upiId) {
      navigator.clipboard.writeText(bankData.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 }
    })
  };
  const fetchBankData = async (id) => {
    const userToFetch = typeof id === "string" ? id : userId;
    if (!userToFetch || typeof userToFetch !== "string") {
      console.error("Invalid userId:", userToFetch);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`https://${import.meta.env.VITE_BACKEND}/api/myaccount/${userToFetch}`);
      setBankData(res.data);
    } catch (err) {
      console.error('Error fetching bank data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("paymanni_user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (parsedUser && parsedUser._id) {
      setUserId(parsedUser._id);
      fetchBankData(parsedUser._id);
    } else {
      console.warn("No valid user found");
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchBankData();
    }
  }, [userId]);

  return (
    <div className="p-6 text-gray-100 dark:bg-[#0f172a] min-h-screen transition-colors">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-4xl font-bold flex items-center gap-3 text-indigo-400">
          <Banknote className="w-8 h-8 animate-pulse" />
          Banking Services
        </h2>
        <button
          onClick={fetchBankData}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-700 hover:bg-indigo-600 transition-colors text-white rounded-xl shadow-md"
        >
          <RefreshCw className="w-4 h-4 animate-spin-slow" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-24 text-gray-400 animate-pulse">
          Loading banking data...
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Linked Bank Accounts */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={0}
            className="bg-[#1e293b] rounded-2xl shadow-xl p-6 border border-gray-700 hover:shadow-indigo-500/20 transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-400">
              <CreditCard className="w-6 h-6" />
              Linked Bank Accounts
            </h3>
            <ul className="space-y-4">
              {bankData?.linkedAccounts?.length ? (
                bankData.linkedAccounts.map((acc, i) => (
                  <li
                    key={i}
                    className="bg-[#0f172a] p-4 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all"
                  >
                    <p className="font-semibold text-base">{acc.bankName}</p>
                    <p className="text-sm text-gray-400">{acc.accountNumberMasked}</p>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500">No linked accounts.</p>
              )}
            </ul>
          </motion.div>

          {/* Mini Statement */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={1}
            className="bg-[#1e293b] rounded-2xl shadow-xl p-6 border border-gray-700 hover:shadow-green-500/20 transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-400">
              <History className="w-6 h-6" />
              Recent Transactions
            </h3>
            <ul className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {bankData?.transactions?.length ? (
                bankData.transactions.map((txn, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center p-3 rounded-lg bg-[#0f172a] border border-gray-700"
                  >
                    <div>
                      <p className="text-base font-medium">{txn.description}</p>
                      <p className="text-xs text-gray-500">{txn.date}</p>
                    </div>
                    <span
                      className={`text-sm font-semibold ${txn.type === 'debit'
                        ? 'text-red-400'
                        : 'text-green-400'
                        }`}
                    >
                      {txn.type === 'debit' ? '-' : '+'}₹{txn.amount}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500">No transactions yet.</p>
              )}
            </ul>
          </motion.div>

          {/* Virtual UPI ID */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={2}
            className="bg-[#1e293b] rounded-2xl shadow-xl p-6 border border-gray-700 hover:shadow-purple-500/20 transition-shadow flex flex-col justify-between"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-purple-400">
              <ShieldCheck className="w-6 h-6" />
              Virtual UPI ID
            </h3>
            <div className="flex items-center gap-2 mt-6">
              <p className="text-2xl font-bold text-indigo-400 truncate">{bankData?.upiId}</p>
              {bankData?.upiId && (
                <button onClick={handleCopy} title="Copy to clipboard">
                  <Copy className="w-5 h-5 text-gray-400 hover:text-white transition" />
                </button>
              )}
            </div>
            {copied && (
              <p className="text-sm text-green-400 mt-2 animate-fadeIn">Copied!</p>
            )}
          </motion.div>

          {/* UPI PIN Management */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={3}
            className="bg-[#1e293b] rounded-2xl shadow-xl p-6 border border-gray-700 hover:shadow-yellow-500/20 transition-shadow flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-yellow-400">
                <KeyRound className="w-6 h-6" />
                Manage UPI PIN
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Securely set or change your UPI PIN linked with your account.
              </p>
            </div>
            <button className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm rounded-xl font-semibold shadow-lg">
              Set / Change PIN
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BankServices;
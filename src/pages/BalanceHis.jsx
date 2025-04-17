import React, { useEffect, useState } from 'react';
import {
  Wallet,
  RefreshCw,
  History,
  ArrowDown,
  ArrowUp,
  IndianRupee,
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const BalanceHis = () => {
  const [userId, setUserId] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  const fetchAllData = async (id) => {
    const storedUser = localStorage.getItem("paymanni_user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const userToFetch = id || parsedUser?._id;
    const token = parsedUser?.token;

    if (!token || !userToFetch) {
      console.warn("Token or userId not found");
      return;
    }

    setLoading(true);
    try {
      const [walletRes, txnRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND}/api/myaccount/${userToFetch}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${import.meta.env.VITE_BACKEND}/api/transactions/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setWallet(walletRes.data);
      setTransactions(txnRes.data?.transactions || []);
    } catch (err) {
      console.error("Error fetching wallet or transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("paymanni_user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (parsedUser && parsedUser._id) {
      setUserId(parsedUser._id);
      fetchAllData(parsedUser._id);
    } else {
      console.warn("No valid user found");
    }
  }, []);

  return (
    <div className="p-6 text-gray-100 dark:bg-[#0f172a] min-h-screen transition-colors">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-4xl font-bold flex items-center gap-3 text-indigo-400">
          <Wallet className="w-8 h-8 animate-bounce" />
          Wallet Summary
        </h2>
        <button
          onClick={() => fetchAllData(userId)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-700 hover:bg-indigo-600 transition-colors text-white rounded-xl shadow-md"
        >
          <RefreshCw className="w-4 h-4 animate-spin-slow" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-24 text-gray-400 animate-pulse">Loading data...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Balance Card */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-[#1e293b] rounded-2xl p-6 shadow-lg border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Current Balance
            </h3>
            <p className="text-4xl font-bold text-green-400">
              ₹{wallet?.balance?.toLocaleString("en-IN") || "0"}
            </p>
          </motion.div>

          {/* Transaction List */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-[#1e293b] rounded-2xl p-6 shadow-lg border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
              <History className="w-5 h-5" />
              All Transactions
            </h3>
            <ul className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {transactions?.length ? (
                transactions.map((txn, i) => (
                  <li
                    key={txn._id || i}
                    className="flex justify-between items-center p-3 rounded-lg bg-[#0f172a] border border-gray-700"
                  >
                    <div>
                      <p className="text-base font-medium">{txn.description}</p>
                      <p className="text-xs text-gray-500">{new Date(txn.date).toLocaleString()}</p>
                    </div>
                    <span
                      className={`text-sm font-semibold flex items-center gap-1 ${
                        txn.type === 'debit' ? 'text-red-400' : 'text-green-400'
                      }`}
                    >
                      {txn.type === 'debit' ? (
                        <ArrowDown className="w-4 h-4" />
                      ) : (
                        <ArrowUp className="w-4 h-4" />
                      )}
                      ₹{txn.amount.toLocaleString("en-IN")}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500">No transactions found.</p>
              )}
            </ul>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BalanceHis;

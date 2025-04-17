import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [customAmount, setCustomAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showConfirmWithdraw, setShowConfirmWithdraw] = useState(false);

  const targetBalance = 10000;
  const { user } = useAuth();

  const userId = user?._id || localStorage.getItem("userId");



  const addTransaction = (amount, type) => {
    const newTransaction = {
      id: Date.now() + Math.random(), // ensures uniqueness
      amount,
      type,
      date: new Date().toLocaleString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };
  const handleDeposit = async (amount) => {
    try {
      const response = await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/deposit`, {
        amount,
        userId,
      });
      console.log("API Response for Deposit:", response.data); // Log the response to check
  
      // Use 'walletBalance' instead of 'balance'
      if (response.data.walletBalance) {
        setBalance(response.data.walletBalance);
        addTransaction(amount, "Deposit");
        console.log("✅ Deposit successful. New balance:", response.data.walletBalance);
      } else {
        console.error("❌ Deposit failed - Invalid walletBalance response.");
      }
    } catch (error) {
      console.error("❌ Error during deposit:", error);
    }
  };
  
  
  
  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
  
    if (isNaN(amount) || amount <= 0) {
      alert("⚠️ Please enter a valid withdrawal amount.");
      return;
    }
  
    try {
      const response = await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/withdraw`, {
        amount,
        userId,
      });
  
      if (response.data?.success) {
        setBalance(response.data.balance); // updated backend balance
        addTransaction(amount, "Withdraw");
        setWithdrawAmount('');
        setShowConfirmWithdraw(false);
        console.log("✅ Withdrawal successful");
      } else {
        alert(` ${response.data?.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert("❌ Error during withdrawal. See console.");
      console.error("❌ Withdrawal error:", error);
    }
  };
  
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        if (!userId) {
          console.warn("⚠️ No userId found");
          return;
        }

        const response = await axios.get(`https://${import.meta.env.VITE_BACKEND}/api/myaccount/${userId}`);
        setBalance(response.data.balance || 0);
        setTransactions(response.data.transactions || []);
      } catch (error) {
        console.error("❌ Error fetching wallet data:", error);
      }
    };

    fetchWalletData();
  }, [userId]);

  const progressPercentage = Math.min((balance / targetBalance) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-black text-white p-6 flex flex-col items-center">
      <motion.div
        className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-wide mb-4">Wallet Balance</h2>
          <motion.p
            className="text-5xl font-extrabold text-green-400 mt-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            ₹ {typeof balance === "number" ? balance.toLocaleString() : "0"}
          </motion.p>
        </div>

        <div className="mt-6">
          <div className="text-sm text-gray-400">Target: ₹ {targetBalance}</div>
          <div className="w-full bg-gray-700 rounded-full h-4 mt-2">
            <motion.div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
        </div>

        <div className="flex justify-between mt-8 space-x-4">
          <motion.button
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-md hover:scale-105 transition duration-300"
            onClick={() => handleDeposit(1000)}
          >
            Deposit ₹1000
          </motion.button>
          <motion.button
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-md hover:scale-105 transition duration-300"
            onClick={() => setShowConfirmWithdraw(true)}
          >
            Withdraw ₹
          </motion.button>
        </div>

        <div className="mt-8 flex justify-between items-center space-x-4">
          <input
            type="number"
            className="border rounded-lg p-4 w-full bg-gray-700 text-white shadow-md"
            placeholder="Enter custom amount"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
          />
          <motion.button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-md"
            onClick={() => {
              if (customAmount) {
                handleDeposit(parseFloat(customAmount));
                setCustomAmount('');
              }
            }}
            whileHover={{ scale: 1.1 }}
          >
            Deposit
          </motion.button>
        </div>

        <motion.div
          className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-2xl mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h3 className="text-2xl font-semibold mb-4">Transaction History</h3>
          {Array.isArray(transactions) && transactions.length > 0 ? (
            <ul className="space-y-4">
              {transactions.map((txn, index) => (
                <motion.li
                  key={txn.id || index}
                  className={`flex justify-between items-center p-4 rounded-lg ${
                    txn.type === "Deposit" ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"
                  } shadow-md`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <span>{txn.type}</span>
                  <span>₹ {txn.amount}</span>
                  <span className="text-sm text-gray-400">{txn.date}</span>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-gray-400">No transactions yet.</p>
          )}
        </motion.div>
      </motion.div>

      {showConfirmWithdraw && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-75 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-gray-800 p-8 rounded-lg shadow-lg w-80"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4">Enter Withdraw Amount</h4>
            <input
              type="number"
              className="border rounded-lg p-4 w-full bg-gray-700 text-white shadow-md"
              placeholder="Enter amount to withdraw"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <div className="mt-6 flex justify-between space-x-4">
              <motion.button
                className="bg-red-500 text-white px-6 py-3 rounded-full"
                onClick={() => setShowConfirmWithdraw(false)}
                whileHover={{ scale: 1.1 }}
              >
                Cancel
              </motion.button>
              <motion.button
                className="bg-green-500 text-white px-6 py-3 rounded-full"
                onClick={handleWithdraw}
                whileHover={{ scale: 1.1 }}
              >
                Confirm
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Wallet;

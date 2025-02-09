import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Wallet = () => {
  const [balance, setBalance] = useState(5000);
  const [transactions, setTransactions] = useState([]);
  const [customAmount, setCustomAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showConfirmWithdraw, setShowConfirmWithdraw] = useState(false);
  
  const targetBalance = 10000;

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/wallet");
        setBalance(response.data.balance);
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    fetchWalletData();
  }, []);

  const addTransaction = (amount, type) => {
    const newTransaction = {
      id: transactions.length + 1,
      amount,
      type,
      date: new Date().toLocaleString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const handleDeposit = async (amount) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/deposit`, { amount });
      setBalance(response.data.balance);
      addTransaction(amount, "Deposit");
    } catch (error) {
      console.error("Error making deposit:", error);
    }
  };

  const handleWithdraw = async () => {
    if (parseFloat(withdrawAmount) <= balance) {
      try {
        const response = await axios.post(`http://localhost:8000/api/withdraw`, { amount: withdrawAmount });
        setBalance(response.data.balance);
        addTransaction(parseFloat(withdrawAmount), "Withdraw");
        setWithdrawAmount('');
        setShowConfirmWithdraw(false);
      } catch (error) {
        alert("Error during withdrawal!");
        console.error("Error making withdrawal:", error);
      }
    } else {
      alert("Insufficient balance!");
    }
  };

  const progressPercentage = Math.min((balance / targetBalance) * 100, 100);


  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-6 flex flex-col items-center">
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Wallet Balance */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 tracking-wide mb-4">Wallet Balance</h2>
          <motion.p
            className="text-5xl font-extrabold text-indigo-600 mt-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            ₹ {balance ? balance.toLocaleString() : 1000}
          </motion.p>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="text-sm text-gray-600">Target: ₹ {targetBalance}</div>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <motion.div
              className="bg-indigo-600 h-4 rounded-full"
              style={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
        </div>

        {/* Deposit and Withdraw Buttons */}
        <div className="flex justify-between mt-8 space-x-4">
          <motion.button
            className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-full shadow-md hover:scale-105 transition duration-300"
            onClick={() => handleDeposit(1000)}
          >
            Deposit ₹1000
          </motion.button>
          <motion.button
            className="bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-3 rounded-full shadow-md hover:scale-105 transition duration-300"
            onClick={() => setShowConfirmWithdraw(true)}
          >
            Withdraw ₹
          </motion.button>
        </div>

        {/* Custom Deposit */}
        <div className="mt-8 flex justify-between items-center space-x-4">
          <input
            type="number"
            className="border rounded-lg p-4 w-full bg-gray-50 shadow-md"
            placeholder="Enter custom amount"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
          />
          <motion.button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-md"
            onClick={() => {
              if (customAmount) {
                handleDeposit(parseInt(customAmount));
                setCustomAmount('');
              }
            }}
            whileHover={{ scale: 1.1 }}
          >
            Deposit
          </motion.button>
        </div>

        {/* Deposit via UPI or Card */}
        <div className="mt-6 space-y-4">
          <motion.button
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-full shadow-md w-full"
            onClick={() => handleDeposit(5000)}
          >
            Deposit via UPI ₹5000
          </motion.button>

          <motion.button
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-3 rounded-full shadow-md w-full"
            onClick={() => handleDeposit(10000)}
          >
            Deposit via Card ₹10000
          </motion.button>
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Transaction History</h3>
        {Array.isArray(transactions) && transactions.length > 0 ? (
          <ul className="space-y-4">
            {transactions.map((txn) => (
              <motion.li
                key={txn.id}
                className={`flex justify-between items-center p-4 rounded-lg ${
                  txn.type === "Deposit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                } shadow-md`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <span>{txn.type}</span>
                <span>₹ {txn.amount}</span>
                <span className="text-sm text-gray-500">{txn.date}</span>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-500">No transactions yet.</p>
        )}
      </motion.div>

      {/* Withdraw Confirmation Modal */}
      {showConfirmWithdraw && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-50 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg w-80"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Enter Withdraw Amount</h4>
            <input
              type="number"
              className="border rounded-lg p-4 w-full bg-gray-50 shadow-md"
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

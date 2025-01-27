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
        const response = await axios.get("/api/wallet");
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
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/deposit`, { amount });
      setBalance(response.data.balance);
      addTransaction(amount, "Deposit");
    } catch (error) {
      console.error("Error making deposit:", error);
    }
  };

  const handleWithdraw = async () => {
    if (parseFloat(withdrawAmount) <= balance) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND}/api/withdraw`, { amount: withdrawAmount });
        setBalance(response.data.balance);
        addTransaction(parseFloat(withdrawAmount), "Withdraw");
        setWithdrawAmount(''); // Reset withdraw amount
        setShowConfirmWithdraw(false); // Close confirmation
      } catch (error) {
        alert("Error during withdrawal!");
        console.error("Error making withdrawal:", error);
      }
    } else {
      alert("Insufficient balance!");
    }
  };

  const progressPercentage = (balance / targetBalance) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 p-6 flex flex-col items-center">
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Wallet Balance */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Wallet Balance</h2>
          <motion.p
  className="text-4xl font-extrabold text-indigo-600 mt-4"
  initial={{ scale: 0.8 }}
  animate={{ scale: 1 }}
  transition={{ duration: 0.5 }}
>
  ₹ {balance ? balance.toLocaleString() : 1000}
</motion.p>

        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="text-sm text-gray-500">Target: ₹ {targetBalance}</div>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <motion.div
              className="bg-indigo-600 h-4 rounded-full"
              style={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
        </div>

        {/* Deposit and Withdraw Buttons */}
        <div className="flex justify-between mt-6">
          <motion.button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow-md"
            onClick={() => handleDeposit(1000)}
            whileHover={{ scale: 1.1 }}
            transition={{ delay: 0.2 }}
          >
            Deposit ₹1000
          </motion.button>
          <motion.button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-md"
            onClick={() => setShowConfirmWithdraw(true)}
            whileHover={{ scale: 1.1 }}
            transition={{ delay: 0.2 }}
          >
            Withdraw ₹
          </motion.button>
        </div>

        {/* Custom Deposit */}
        <div className="mt-6 flex justify-between items-center">
          <input
            type="number"
            className="border rounded-lg p-2 w-full max-w-xs"
            placeholder="Enter custom amount"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
          />
          <motion.button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md ml-4"
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
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow-md w-full"
            onClick={() => handleDeposit(5000)} // Mock deposit via UPI
            whileHover={{ scale: 1.1 }}
          >
            Deposit via UPI ₹5000
          </motion.button>

          <motion.button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md w-full"
            onClick={() => handleDeposit(10000)} // Mock deposit via Card
            whileHover={{ scale: 1.1 }}
          >
            Deposit via Card ₹10000
          </motion.button>
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 w-full mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
       <h3 className="text-xl font-semibold text-gray-800">Transaction History</h3>
{Array.isArray(transactions) && transactions.length > 0 ? (
  <ul className="mt-4 space-y-3">
    {transactions.map((txn) => (
      <motion.li
        key={txn.id}
        className={`flex justify-between items-center px-4 py-2 rounded-lg ${
          txn.type === "Deposit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
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
            className="bg-white p-6 rounded-lg shadow-md w-80"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-gray-800">Enter Withdraw Amount</h4>
            <input
              type="number"
              className="border rounded-lg p-2 w-full mt-4"
              placeholder="Enter amount to withdraw"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <div className="mt-4 flex justify-between">
              <motion.button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setShowConfirmWithdraw(false)}
                whileHover={{ scale: 1.1 }}
              >
                Cancel
              </motion.button>
              <motion.button
                className="bg-green-500 text-white px-4 py-2 rounded"
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

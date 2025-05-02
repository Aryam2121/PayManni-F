import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Recharge = () => {
  const [amount, setAmount] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isValid, setIsValid] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [paymentId, setPaymentId] = useState(""); // NEW: store payment ID after initiating
  const [userLanguage, setUserLanguage] = useState("English");
  const [rating, setRating] = useState(0);
  const { user } = useAuth();

  const userId = user?._id || localStorage.getItem("userId");

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const response = await axios.get(
          `https://${import.meta.env.VITE_BACKEND}/api/recharges/${userId}`
        );
        setTransactionHistory(response.data);
      } catch (error) {
        console.error("Error fetching transaction history", error);
        alert("Error fetching transaction history. Please try again later.");
      }
    };
    fetchTransactionHistory();
  }, [userId]);

  const validateAmount = (amount) => {
    return !isNaN(amount) && amount > 0;
  };

  const handleRecharge = async () => {
    if (!amount || !validateAmount(amount)) {
      setIsValid(false);
      return;
    }
    setIsValid(true);
    setIsProcessing(true);

    let finalAmount = parseFloat(amount);
    if (promoCode.toLowerCase() === "discount10") {
      finalAmount = finalAmount * 0.9;
    }

    try {
      const response = await axios.post(
        `https://${import.meta.env.VITE_BACKEND}/api/recharge`,
        {
          userId,
          amount: finalAmount,
          paymentMethod,
          promoCode,
        }
      );

      setIsProcessing(false);
      setPaymentId(response.data.paymentId); // Save payment ID for verification
      setIsSuccess(true);

      // Add the transaction optimistically
      setTransactionHistory((prev) => [response.data.transaction, ...prev]);
      
      setAmount("");
      setPromoCode("");
    } catch (error) {
      setIsProcessing(false);
      console.error("Error during recharge", error);
      alert("Error processing your recharge. Please try again later.");
    }
  };

  // New: Payment Verification Function
  const verifyPayment = async () => {
    if (!paymentId) return;

    setIsProcessing(true);
    try {
      const response = await axios.post(
        `https://${import.meta.env.VITE_BACKEND}/api/verify-payment`,
        {
          paymentId,
          userId,
        }
      );

      if (response.data.success) {
        alert("Payment Verified Successfully!");
        // Update Transaction History again (optional)
        const updatedTransactions = await axios.get(
          `https://${import.meta.env.VITE_BACKEND}/api/recharges/${userId}`
        );
        setTransactionHistory(updatedTransactions.data);
      } else {
        alert("Payment verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying payment", error);
      alert("Error verifying payment. Please try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`p-8 mx-auto rounded-xl shadow-lg transition-all duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Dark Mode Toggle */}
      <motion.button
        className="absolute top-4 right-4 p-3 rounded-full focus:outline-none bg-gray-600 hover:bg-gray-500"
        onClick={() => setIsDarkMode(!isDarkMode)}
        whileHover={{ scale: 1.1 }}
      >
        {isDarkMode ? "🌞" : "🌙"}
      </motion.button>

      {/* Title */}
      <motion.h2
        className="text-3xl font-semibold text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Recharge Your Account
      </motion.h2>

      {/* Amount Input */}
      <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <input
          type="number"
          className={`p-4 border rounded-lg w-full focus:outline-none ${
            isDarkMode
              ? "bg-gray-800 border-gray-600 text-white focus:ring-blue-500"
              : "bg-gray-100 border-gray-300 focus:ring-blue-500"
          } ${!isValid && "border-red-500"}`}
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {!isValid && (
          <p className="text-red-500 text-sm mt-2">Please enter a valid amount.</p>
        )}
      </motion.div>

      {/* Promo Code Input */}
      <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <input
          type="text"
          className={`p-4 border rounded-lg w-full focus:outline-none ${
            isDarkMode
              ? "bg-gray-800 border-gray-600 text-white focus:ring-blue-500"
              : "bg-gray-100 border-gray-300 focus:ring-blue-500"
          }`}
          placeholder="Enter promo code (optional)"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
      </motion.div>

      {/* Payment Method Dropdown */}
      <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <select
          className={`p-4 border rounded-lg w-full focus:outline-none ${
            isDarkMode
              ? "bg-gray-800 border-gray-600 text-white focus:ring-blue-500"
              : "bg-gray-100 border-gray-300 focus:ring-blue-500"
          }`}
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="UPI">UPI</option>
          <option value="Debit/Credit">Debit/Credit Card</option>
          <option value="Wallet">Wallet</option>
        </select>
      </motion.div>

      {/* QR Code for Payment */}
      {paymentMethod === "UPI" && (
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-xl font-semibold">Scan to Pay (UPI)</h3>
          <QRCode
            className="mt-3 mx-auto p-2 bg-white rounded-lg"
            value={`upi://pay?pa=someone@upi&pn=Paytm&mc=123456&tid=789&url=upi&am=${amount}`}
          />
        </motion.div>
      )}

      {/* Recharge Button */}
      <motion.button
        className="mt-6 w-full py-3 rounded-lg shadow-lg font-semibold transition-all text-white bg-blue-600 hover:bg-blue-700"
        onClick={handleRecharge}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Recharge"}
      </motion.button>

      {/* Verify Payment Button */}
      {paymentId && (
        <motion.button
          className="mt-4 w-full py-3 rounded-lg shadow-lg font-semibold transition-all text-white bg-green-600 hover:bg-green-700"
          onClick={verifyPayment}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          disabled={isProcessing}
        >
          {isProcessing ? "Verifying..." : "Verify Payment"}
        </motion.button>
      )}

      {/* Success Message */}
      {isSuccess && (
        <motion.div className="mt-4 text-green-500 font-semibold text-center">
          Recharge initiated! Please complete your payment and click Verify.
        </motion.div>
      )}

      {/* Rating System */}
      <motion.div className="mt-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h3 className="font-semibold">Rate your Experience</h3>
        <div className="flex justify-center mt-2 space-x-2">
          {[1, 2, 3, 4, 5].map((rate) => (
            <motion.button
              key={rate}
              className={`px-4 py-3 rounded-lg text-lg font-semibold ${
                rating >= rate ? "bg-yellow-500" : isDarkMode ? "bg-gray-700" : "bg-gray-300"
              }`}
              onClick={() => setRating(rate)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {rate}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Recharge;

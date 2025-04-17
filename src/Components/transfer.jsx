import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const MoneyTransferPage = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isLoading, setIsLoading] = useState(false);
  const [transferStatus, setTransferStatus] = useState(null);
  const [transferHistory, setTransferHistory] = useState([]);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [paypalId, setPaypalId] = useState("");
  const [upiId, setUpiId] = useState("");
  const { user } = useAuth();
  const userId = user?._id || localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("paymanni_user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const userToFetch =  parsedUser?._id;
        const token = parsedUser?.token;
        const baseUrl = import.meta.env.VITE_BACKEND;
        
        const [balanceRes, historyRes] = await Promise.all([
          axios.get(`https://${baseUrl}/api/myaccount/${userToFetch}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`https://${baseUrl}/api/transfers`, {
           
          }),
        ]);

        setBalance(balanceRes.data.balance || 0);
        setTransferHistory(historyRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to fetch account data!");
      }
    };

    if (userId) fetchData();
  }, [userId]);

  const validateForm = () => {
    if (!recipient.trim() || !amount || Number(amount) <= 0) {
      setError("Please enter a valid recipient and amount.");
      return false;
    }
    if (paymentMethod === "card" && (!cardDetails.number.trim() || !cardDetails.expiry.trim() || !cardDetails.cvv.trim())) {
      setError("Please fill in all card details.");
      return false;
    }
    if (paymentMethod === "paypal" && !paypalId.trim()) {
      setError("Please provide a valid PayPal ID.");
      return false;
    }
    if (paymentMethod === "upi" && !/^[\w.-]+@[\w.-]+$/.test(upiId)) {
      setError("Please enter a valid UPI ID (e.g., aryaman@paymanni).");
      return false;
    }
    setError("");
    return true;
  };

  const handleTransfer = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setTransferStatus(null);

    const paymentData = {
      recipient: recipient.trim(),
      amount: Number(amount),
      paymentMethod,
      cardDetails: paymentMethod === "card" ? cardDetails : undefined,
      paypalId: paymentMethod === "paypal" ? paypalId.trim() : undefined,
      upiId: paymentMethod === "upi" ? upiId.trim() : undefined,
    };

    try {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND;

      const response = await axios.post(`https://${baseUrl}/api/transfer`, paymentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newTransfer = response.data.transfer;

      setTransferStatus("success");
      setBalance((prev) => prev - Number(amount));
      setTransferHistory([newTransfer, ...transferHistory]);
      toast.success("Money transferred successfully!");

      // Reset form
      setRecipient("");
      setAmount("");
      setPaymentMethod("card");
      setCardDetails({ number: "", expiry: "", cvv: "" });
      setPaypalId("");
      setUpiId("");

    } catch (err) {
      console.error("Transfer error:", err);
      setTransferStatus("fail");
      toast.error(err.response?.data?.message || "Transfer failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 w-full min-h-screen flex flex-col items-center">
      <motion.h2
        className="text-4xl font-semibold mb-6 text-green-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Money Transfer
      </motion.h2>

      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-xl space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-bold text-green-300 text-center"
        >
          Balance: ₹{balance.toFixed(2)}
        </motion.div>

        {error && <p className="text-red-400 text-center">{error}</p>}

        <div className="space-y-4">
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-green-400"
            placeholder="Recipient's Name"
          />

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-green-400"
            placeholder="Amount"
            min="1"
          />

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-green-400"
          >
            <option value="card">Credit/Debit Card</option>
            <option value="paypal">PayPal</option>
            <option value="upi">UPI</option>
          </select>

          {paymentMethod === "card" && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Card Number"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                className="w-full p-4 bg-gray-700 border border-gray-600 rounded-md"
              />
              <input
                type="text"
                placeholder="Expiry (MM/YY)"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                className="w-full p-4 bg-gray-700 border border-gray-600 rounded-md"
              />
              <input
                type="text"
                placeholder="CVV"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                className="w-full p-4 bg-gray-700 border border-gray-600 rounded-md"
              />
            </div>
          )}

          {paymentMethod === "paypal" && (
            <input
              type="text"
              placeholder="PayPal ID"
              value={paypalId}
              onChange={(e) => setPaypalId(e.target.value)}
              className="w-full p-4 bg-gray-700 border border-gray-600 rounded-md"
            />
          )}

          {paymentMethod === "upi" && (
            <input
              type="text"
              placeholder="UPI ID (e.g., aryaman@paymanni)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full p-4 bg-gray-700 border border-gray-600 rounded-md"
            />
          )}

          <motion.button
            onClick={handleTransfer}
            className="w-full bg-green-600 text-white py-3 mt-4 rounded-md hover:bg-green-500 transition duration-300"
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : "Transfer Money"}
          </motion.button>
        </div>

        {transferStatus === "success" && (
          <p className="text-green-400 mt-4 text-center">Transfer Successful!</p>
        )}
        {transferStatus === "fail" && (
          <p className="text-red-400 mt-4 text-center">Transfer Failed!</p>
        )}
      </div>
    </div>
  );
};

export default MoneyTransferPage;

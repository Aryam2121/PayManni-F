import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const balanceRes = await axios.get(`https://${import.meta.env.VITE_BACKEND}/api/user/balance`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(balanceRes.data.balance);

        const historyRes = await axios.get(`https://${import.meta.env.VITE_BACKEND}/api/transfers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransferHistory(historyRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    if (!recipient || !amount || Number(amount) <= 0) {
      setError("Please enter a valid recipient and amount.");
      return false;
    }
    if (paymentMethod === "card" && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
      setError("Please enter complete card details.");
      return false;
    }
    if (paymentMethod === "paypal" && !paypalId) {
      setError("Please enter a PayPal ID.");
      return false;
    }
    if (paymentMethod === "upi" && !/^\d{10}@upi$/.test(upiId)) {
      setError("Please enter a valid UPI ID.");
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
      recipient,
      amount: Number(amount),
      paymentMethod,
      cardDetails: paymentMethod === "card" ? cardDetails : undefined,
      paypalId: paymentMethod === "paypal" ? paypalId : undefined,
      upiId: paymentMethod === "upi" ? upiId : undefined,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/transfer`, paymentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransferStatus("success");
      setBalance((prev) => prev - Number(amount));
      setTransferHistory([response.data.transfer, ...transferHistory]);
      toast.success("Transfer Successful!");

      // Reset inputs
      setRecipient("");
      setAmount("");
      setCardDetails({ number: "", expiry: "", cvv: "" });
      setPaypalId("");
      setUpiId("");
    } catch (error) {
      setTransferStatus("fail");
      toast.error("Transfer Failed!");
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
          Balance: ${balance}
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
                placeholder="MM/YY"
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
              placeholder="UPI ID (e.g., 1234567890@upi)"
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

        {transferStatus === "success" && <p className="text-green-400 mt-4 text-center">Transfer Successful!</p>}
        {transferStatus === "fail" && <p className="text-red-400 mt-4 text-center">Transfer Failed!</p>}
      </div>
    </div>
  );
};

export default MoneyTransferPage;

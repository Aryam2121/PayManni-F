import { apiUrl, getAuthHeaders, getUserId } from "../utils/authStorage";
import React, { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa"; // Icons for success, failure, and loading
import { useLocalStorage } from "react-use"; // Custom hook for persistent storage (local storage)
import axios from "axios"; // Axios for making API requests
import { useTheme } from "../context/ThemeContext";
import PageShell from "./layout/PageShell";

const BillPaymentPage = () => {
  const { darkMode } = useTheme();
  const [selectedBill, setSelectedBill] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentHistory, setPaymentHistory] = useLocalStorage("paymentHistory", []); // Save payment history
  const [billAmounts, setBillAmounts] = useState({
    electricity: 500,
    water: 250,
    internet: 1000,
    gas: 300,
    phone: 150,
    tv: 600,
    insurance: 1200,
    rent: 15000,
    subscription: 499,
  }); // Dynamic amounts for each bill

  const [billTypesList, setBillTypesList] = useState([
    { id: 1, name: "Electricity", icon: "⚡" },
    { id: 2, name: "Water", icon: "💧" },
    { id: 3, name: "Internet", icon: "🌐" },
    { id: 4, name: "Gas", icon: "🔥" },
    { id: 5, name: "Phone", icon: "📱" },
    { id: 6, name: "TV", icon: "📺" },
    { id: 7, name: "Insurance", icon: "🛡️" },
    { id: 8, name: "Rent", icon: "🏠" },
    { id: 9, name: "Subscription", icon: "🎧" },
  ]);
  useEffect(() => {
    axios.get(apiUrl(`/api/bills`))
      .then((response) => {
        setBillTypesList(response.data.bills);
        setBillAmounts(response.data.billAmounts);
      })
      .catch((error) => console.error("Error fetching bills:", error));
  }, []);

  const handleAmountChange = (billKey, value) => {
    const amount = parseFloat(value) || 0;
    setBillAmounts((prev) => ({ ...prev, [billKey]: amount }));
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(apiUrl(`/api/payments`), {
        bill: selectedBill.name,
        amount: billAmounts[selectedBill.name.toLowerCase()],
        method: paymentMethod,
        userId: localStorage.getItem("userId"),
      });
      setPaymentStatus(response.data.success ? "success" : "failure");
      if (response.data.success) {
        setPaymentHistory([
          ...paymentHistory,
          {
            bill: selectedBill.name,
            amount: billAmounts[selectedBill.name.toLowerCase()],
            date: new Date(),
            status: "success",
          },
        ]);
      }
    } catch (error) {
      setPaymentStatus("failure");
    }
    setIsLoading(false);
  };

  const PaymentForm = ({ bill }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-6 p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg border-t-4 border-blue-500 dark:bg-gray-800 dark:border-blue-400"
    >
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">Pay {bill.name} Bill</h3>
      <p className="text-gray-600 mt-2">Amount: ₹{billAmounts[bill.name.toLowerCase()]}</p>

      <div className="mt-4">
        <label htmlFor="payment-method" className="block text-gray-700 dark:text-gray-300 mb-2">Payment Method</label>
        <select
          id="payment-method"
          className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-2"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="card">Credit/Debit Card</option>
          <option value="upi">UPI</option>
          <option value="paypal">PayPal</option>
        </select>

        {paymentMethod === "card" && (
          <>
            <input
              type="text"
              placeholder="Enter card number"
              className="w-full p-3 border border-gray-300 rounded-md mt-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input
              type="text"
              placeholder="Enter CVV"
              className="w-full p-3 border border-gray-300 rounded-md mt-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input
              type="text"
              placeholder="Enter Expiry Date"
              className="w-full p-3 border border-gray-300 rounded-md mt-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </>
        )}

        <button
          onClick={handlePayment}
          className="w-full bg-blue-600 text-white py-3 mt-6 rounded-md hover:bg-blue-700 transition-all"
          disabled={isLoading}
        >
          {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : "Pay Now"}
        </button>
      </div>
    </motion.div>
  );

  const PaymentNotification = ({ status }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`mt-4 p-6 text-center rounded-lg shadow-lg ${status === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
    >
      {status === "success" ? (
        <FaCheckCircle className="text-4xl mb-2" />
      ) : (
        <FaTimesCircle className="text-4xl mb-2" />
      )}
      <h4 className="font-semibold">{status === "success" ? "Payment Successful!" : "Payment Failed!"}</h4>
      <p>{status === "success" ? "Your payment was successful." : "Please try again or contact support."}</p>
    </motion.div>
  );

  return (
    <PageShell title="Pay Bills" subtitle="Electricity, water, gas, internet & more">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {billTypesList.map((bill) => (
          <motion.div
            key={bill.id}
            className="page-card cursor-pointer hover:shadow-xl transition-all"
            onClick={() => setSelectedBill(bill)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center mb-4">
              <span className="text-5xl mr-4">{bill.icon}</span>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{bill.name} Bill</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-300">Amount: ₹{billAmounts[bill.name.toLowerCase()]}</p>
            <input
              type="number"
              value={billAmounts[bill.name.toLowerCase()]}
              onChange={(e) =>
                handleAmountChange(bill.name.toLowerCase(), e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-md mt-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="0"
              placeholder="Enter amount"
            />
          </motion.div>
        ))}
      </div>

      {selectedBill && <PaymentForm bill={selectedBill} />}
      {paymentStatus && <PaymentNotification status={paymentStatus} />}

      <div className="mt-12">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Payment History</h3>
        <ul className="space-y-4">
          {paymentHistory.map((history, index) => (
            <li key={index} className="p-4 bg-gray-100 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
              <p className="text-gray-800 dark:text-white">{history.bill} - ₹{history.amount}</p>
              <p className="text-gray-500 dark:text-gray-400">{new Date(history.date).toLocaleString()}</p>
              <p className={`${history.status === "success" ? "text-green-500" : "text-red-500"}`}>{history.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
};

export default BillPaymentPage;

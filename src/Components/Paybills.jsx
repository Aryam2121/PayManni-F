import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa"; // Icons for success, failure, and loading
import { useLocalStorage } from "react-use"; // Custom hook for persistent storage (local storage)

const BillPaymentPage = () => {
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

  const billTypes = [
    { id: 1, name: "Electricity", icon: "⚡" },
    { id: 2, name: "Water", icon: "💧" },
    { id: 3, name: "Internet", icon: "🌐" },
    { id: 4, name: "Gas", icon: "🔥" },
    { id: 5, name: "Phone", icon: "📱" },
    { id: 6, name: "TV", icon: "📺" },
    { id: 7, name: "Insurance", icon: "🛡️" },
    { id: 8, name: "Rent", icon: "🏠" },
    { id: 9, name: "Subscription", icon: "🎧" },
  ];

  const handlePayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPaymentStatus("success");
      // Save payment to history
      setPaymentHistory([
        ...paymentHistory,
        {
          bill: selectedBill.name,
          amount: billAmounts[selectedBill.name.toLowerCase()],
          date: new Date(),
          status: "success",
        },
      ]);
    }, 2000);
  };

  const handleAmountChange = (billName, amount) => {
    setBillAmounts((prev) => ({
      ...prev,
      [billName]: amount,
    }));
  };

  const PaymentForm = ({ bill }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-6 p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg"
    >
      <h3 className="text-xl font-semibold text-gray-800">Pay {bill.name} Bill</h3>
      <p className="text-gray-600 mt-2">Amount: ₹{billAmounts[bill.name.toLowerCase()]}</p>

      <div className="mt-4">
        <label htmlFor="payment-method" className="block text-gray-700 mb-2">Payment Method</label>
        <select
          id="payment-method"
          className="w-full p-2 border border-gray-300 rounded-md mt-2"
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
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
            />
            <input
              type="text"
              placeholder="Enter CVV"
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
            />
            <input
              type="text"
              placeholder="Enter Expiry Date"
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
            />
          </>
        )}
        {/* Add other payment method inputs here */}

        <button
          onClick={handlePayment}
          className="w-full bg-blue-600 text-white py-2 mt-4 rounded-md hover:bg-blue-700 transition-all"
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
      className={`mt-4 p-4 text-center rounded-md ${status === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
    >
      {status === "success" ? (
        <FaCheckCircle className="text-3xl" />
      ) : (
        <FaTimesCircle className="text-3xl" />
      )}
      <h4 className="font-semibold">{status === "success" ? "Payment Successful!" : "Payment Failed!"}</h4>
      <p>{status === "success" ? "Your payment was successful." : "Please try again or contact support."}</p>
    </motion.div>
  );

  return (
    <div className="p-6 w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Select Bill to Pay</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {billTypes.map((bill) => (
          <motion.div
            key={bill.id}
            className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl transform transition-all hover:scale-105 dark:bg-gray-800 dark:border-gray-700"
            onClick={() => setSelectedBill(bill)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center">
              <span className="text-4xl mr-4">{bill.icon}</span>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{bill.name} Bill</h3>
            </div>
            <p className="text-gray-500 mt-2">Amount: ₹{billAmounts[bill.name.toLowerCase()]}</p>
            <input
              type="number"
              value={billAmounts[bill.name.toLowerCase()]}
              onChange={(e) =>
                handleAmountChange(bill.name.toLowerCase(), e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
              min="0"
              placeholder="Enter amount"
            />
          </motion.div>
        ))}
      </div>

      {selectedBill && <PaymentForm bill={selectedBill} />}
      {paymentStatus && <PaymentNotification status={paymentStatus} />}

      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Payment History</h3>
        <ul className="space-y-2">
          {paymentHistory.map((history, index) => (
            <li key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
              <p>{history.bill} - ₹{history.amount}</p>
              <p>{new Date(history.date).toLocaleString()}</p>
              <p className={`${history.status === "success" ? "text-green-500" : "text-red-500"}`}>{history.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BillPaymentPage;

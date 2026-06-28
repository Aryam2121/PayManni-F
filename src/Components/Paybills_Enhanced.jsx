import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import {
  FaBolt,
  FaTint,
  FaWifi,
  FaFire,
  FaPhoneAlt,
  FaTv,
  FaShieldAlt,
  FaHome,
  FaMusic,
  FaCheckCircle,
  FaSpinner,
  FaTimes,
  FaCreditCard,
  FaWallet,
  FaUniversity,
  FaHistory,
  FaStar,
  FaClock,
} from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { HiLightningBolt } from "react-icons/hi";
import { apiUrl, getAuthHeaders, getUserId } from "../utils/authStorage";

const BillPaymentPage = () => {
  const [selectedBill, setSelectedBill] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [balance, setBalance] = useState(0);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    cvv: "",
    expiry: "",
  });
  
  const [billTypes, setBillTypes] = useState([
    { id: 1, name: "Electricity", icon: "bolt", color: "from-yellow-500 to-orange-500", saved: true },
    { id: 2, name: "Water", icon: "water", color: "from-blue-500 to-cyan-500", saved: false },
    { id: 3, name: "Internet", icon: "wifi", color: "from-purple-500 to-indigo-500", saved: true },
    { id: 4, name: "Gas", icon: "fire", color: "from-red-500 to-orange-500", saved: false },
    { id: 5, name: "Phone", icon: "phone", color: "from-green-500 to-teal-500", saved: true },
    { id: 6, name: "TV", icon: "tv", color: "from-pink-500 to-purple-500", saved: false },
    { id: 7, name: "Insurance", icon: "shield", color: "from-indigo-500 to-blue-500", saved: false },
    { id: 8, name: "Rent", icon: "home", color: "from-gray-600 to-gray-700", saved: false },
    { id: 9, name: "Subscription", icon: "music", color: "from-rose-500 to-pink-500", saved: true },
  ]);

  const [billAmounts, setBillAmounts] = useState({
    electricity: 850,
    water: 250,
    internet: 999,
    gas: 450,
    phone: 299,
    tv: 599,
    insurance: 2500,
    rent: 15000,
    subscription: 499,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const userId = getUserId();
      const balanceRes = await axios.get(apiUrl(`/api/myaccount/${userId}`), { headers: getAuthHeaders() });
      setBalance(balanceRes.data.balance || 0);

      const history = JSON.parse(localStorage.getItem("paymentHistory") || "[]");
      setPaymentHistory(history);

      const billsRes = await axios.get(apiUrl("/api/bills"));
      if (billsRes.data.bills) setBillTypes(billsRes.data.bills);
      if (billsRes.data.billAmounts) setBillAmounts(billsRes.data.billAmounts);
    } catch (error) {
      console.error("Error fetching data:", error);
      setBalance(0);
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      bolt: <FaBolt />,
      water: <FaTint />,
      wifi: <FaWifi />,
      fire: <FaFire />,
      phone: <FaPhoneAlt />,
      tv: <FaTv />,
      shield: <FaShieldAlt />,
      home: <FaHome />,
      music: <FaMusic />,
    };
    return icons[iconName] || <FaBolt />;
  };

  const handleAmountChange = (billName, value) => {
    setBillAmounts({
      ...billAmounts,
      [billName]: parseFloat(value) || 0,
    });
  };

  const handlePayment = async () => {
    if (!selectedBill) {
      toast.error("Please select a bill");
      return;
    }

    const amount = billAmounts[selectedBill.name.toLowerCase()];
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (paymentMethod === "wallet" && amount > balance) {
      toast.error("Insufficient wallet balance");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardDetails.number || !cardDetails.cvv || !cardDetails.expiry) {
        toast.error("Please fill in all card details");
        return;
      }
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        apiUrl("/api/payments"),
        {
          bill: selectedBill.name,
          amount,
          method: paymentMethod,
          userId: getUserId(),
          cardDetails: paymentMethod === "card" ? cardDetails : null,
        },
        { headers: getAuthHeaders() }
      );

      setPaymentStatus("success");
      
      // Add to payment history
      const newHistory = [
        {
          bill: selectedBill.name,
          amount,
          date: new Date().toISOString(),
          status: "success",
          method: paymentMethod,
        },
        ...paymentHistory,
      ];
      setPaymentHistory(newHistory);
      localStorage.setItem("paymentHistory", JSON.stringify(newHistory));

      toast.success(`${selectedBill.name} bill paid successfully!`);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setSelectedBill(null);
        setPaymentStatus(null);
        setCardDetails({ number: "", cvv: "", expiry: "" });
      }, 2000);
    } catch (error) {
      setPaymentStatus("failure");
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-2xl shadow-2xl mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <FaBolt className="mr-3" />
                Pay Bills
              </h1>
              <p className="text-orange-100 mt-1">Quick & secure bill payments</p>
            </div>
            <div className="text-right">
              <p className="text-orange-100 text-sm">Wallet Balance</p>
              <p className="text-2xl font-bold">₹{balance.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </motion.div>

        {!selectedBill ? (
          <>
            {/* Bill Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <HiLightningBolt className="text-yellow-500 mr-2" />
                Select Bill Category
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {billTypes.map((bill, index) => (
                  <motion.button
                    key={bill.id}
                    onClick={() => setSelectedBill(bill)}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {bill.saved && (
                      <div className="absolute top-2 right-2">
                        <FaStar className="text-yellow-500" />
                      </div>
                    )}
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${bill.color} rounded-xl flex items-center justify-center text-white text-3xl mb-4 mx-auto group-hover:scale-110 transition-transform`}
                    >
                      {getIcon(bill.icon)}
                    </div>
                    <p className="text-gray-800 font-bold text-lg mb-1">{bill.name}</p>
                    <p className="text-gray-600 text-sm">
                      ₹{billAmounts[bill.name.toLowerCase()]}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Payment History */}
            {paymentHistory.length > 0 && (
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaHistory className="text-blue-500 mr-2" />
                  Recent Payments
                </h2>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {paymentHistory.slice(0, 5).map((payment, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-all"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white">
                          <FaBolt />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{payment.bill}</p>
                          <p className="text-gray-500 text-sm">
                            {new Date(payment.date).toLocaleDateString()} •{" "}
                            {payment.method}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">
                          -₹{payment.amount.toLocaleString()}
                        </p>
                        <div className="flex items-center text-green-600 text-xs">
                          <FaCheckCircle className="mr-1" />
                          {payment.status}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        ) : (
          /* Payment Form */
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <button
              onClick={() => {
                setSelectedBill(null);
                setPaymentStatus(null);
              }}
              className="text-orange-600 font-semibold mb-6 hover:text-orange-700 flex items-center"
            >
              ← Back to Bills
            </button>

            <div className="text-center mb-6">
              <div
                className={`w-20 h-20 bg-gradient-to-r ${selectedBill.color} rounded-2xl flex items-center justify-center text-white text-4xl mx-auto mb-4`}
              >
                {getIcon(selectedBill.icon)}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Pay {selectedBill.name} Bill
              </h2>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bill Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  value={billAmounts[selectedBill.name.toLowerCase()]}
                  onChange={(e) =>
                    handleAmountChange(selectedBill.name.toLowerCase(), e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-4 text-2xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setPaymentMethod("wallet")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "wallet"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <FaWallet
                    className={`text-2xl mx-auto mb-2 ${
                      paymentMethod === "wallet" ? "text-orange-600" : "text-gray-600"
                    }`}
                  />
                  <p className="text-sm font-semibold">Wallet</p>
                </button>

                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "card"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <FaCreditCard
                    className={`text-2xl mx-auto mb-2 ${
                      paymentMethod === "card" ? "text-orange-600" : "text-gray-600"
                    }`}
                  />
                  <p className="text-sm font-semibold">Card</p>
                </button>

                <button
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "upi"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <HiLightningBolt
                    className={`text-2xl mx-auto mb-2 ${
                      paymentMethod === "upi" ? "text-orange-600" : "text-gray-600"
                    }`}
                  />
                  <p className="text-sm font-semibold">UPI</p>
                </button>
              </div>
            </div>

            {/* Card Details */}
            {paymentMethod === "card" && (
              <motion.div
                className="space-y-4 mb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardDetails.number}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, number: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  maxLength="16"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, expiry: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    maxLength="5"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cvv: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    maxLength="3"
                  />
                </div>
              </motion.div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <MdPayment />
                  <span>
                    Pay ₹{billAmounts[selectedBill.name.toLowerCase()].toLocaleString()}
                  </span>
                </>
              )}
            </button>

            {/* Payment Status */}
            <AnimatePresence>
              {paymentStatus && (
                <motion.div
                  className={`mt-6 p-6 rounded-xl text-center ${
                    paymentStatus === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  {paymentStatus === "success" ? (
                    <>
                      <FaCheckCircle className="text-5xl mx-auto mb-3 text-green-600" />
                      <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
                      <p>Your {selectedBill.name} bill has been paid</p>
                    </>
                  ) : (
                    <>
                      <FaTimes className="text-5xl mx-auto mb-3 text-red-600" />
                      <h3 className="text-xl font-bold mb-2">Payment Failed</h3>
                      <p>Please try again or contact support</p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BillPaymentPage;

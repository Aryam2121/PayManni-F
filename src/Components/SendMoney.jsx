import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import {
  FaArrowUp,
  FaUser,
  FaQrcode,
  FaUniversity,
  FaPhone,
  FaCheckCircle,
  FaHistory,
  FaWallet,
  FaStar,
  FaClock,
  FaTimes,
} from "react-icons/fa";
import { MdContactPhone, MdAccountBalance } from "react-icons/md";
import { HiLightningBolt } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { getApiBase, getAuthHeaders, getUserId, getUserUpi, apiUrl } from "../utils/authStorage";
import PageShell from "./layout/PageShell";

const SendMoney = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [step, setStep] = useState(1);
  const [sendMethod, setSendMethod] = useState("");
  const [fromUpi, setFromUpi] = useState("");
  const [toUpi, setToUpi] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [contacts, setContacts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = getUserId();
      setFromUpi(getUserUpi());

      if (userId) {
        const balanceRes = await axios.get(
          apiUrl(`/api/myaccount/${userId}`),
          { headers: getAuthHeaders() }
        );
        setBalance(balanceRes.data.balance ?? 0);
      }

      const contactsRes = await axios.get(
        `${getApiBase()}/api/contacts${userId ? `/${userId}` : ""}`,
        { headers: getAuthHeaders() }
      );
      const contactList = Array.isArray(contactsRes.data)
        ? contactsRes.data
        : contactsRes.data.contacts || [];
      setContacts(contactList.length ? contactList : getDemoContacts());

      if (userId) {
        const transactionsRes = await axios.get(
          `${getApiBase()}/api/transactions/recent?userId=${userId}`,
          { headers: getAuthHeaders() }
        );
        setRecentTransactions(transactionsRes.data.transactions || getDemoTransactions());
      }
    } catch (error) {
      console.error("Data fetch error:", error);
      setFromUpi(getUserUpi());
      setContacts(getDemoContacts());
      setRecentTransactions(getDemoTransactions());
    }
  };

  const getDemoContacts = () => [
    { id: 1, name: "John Doe", upi: "john@paymanni", avatar: "👨", lastTransaction: "₹500" },
    { id: 2, name: "Sarah Wilson", upi: "sarah@paymanni", avatar: "👩", lastTransaction: "₹1,200" },
    { id: 3, name: "Mike Johnson", upi: "mike@paymanni", avatar: "👨‍💼", lastTransaction: "₹750" },
    { id: 4, name: "Emma Davis", upi: "emma@paymanni", avatar: "👩‍💼", lastTransaction: "₹2,000" },
  ];

  const getDemoTransactions = () => [
    { id: 1, name: "John Doe", amount: 500, time: "2 hours ago" },
    { id: 2, name: "Sarah Wilson", amount: 1200, time: "Yesterday" },
    { id: 3, name: "Mike Johnson", amount: 750, time: "2 days ago" },
  ];

  const sendMethods = [
    {
      id: "upi",
      title: "UPI ID",
      icon: <HiLightningBolt />,
      color: "from-purple-500 to-purple-600",
      description: "Send using UPI ID",
    },
    {
      id: "contact",
      title: "To Contact",
      icon: <FaUser />,
      color: "from-blue-500 to-blue-600",
      description: "Send to saved contacts",
    },
    {
      id: "qr",
      title: "Scan QR",
      icon: <FaQrcode />,
      color: "from-green-500 to-green-600",
      description: "Scan & pay instantly",
    },
    {
      id: "bank",
      title: "To Bank",
      icon: <FaUniversity />,
      color: "from-orange-500 to-orange-600",
      description: "Bank account transfer",
    },
    {
      id: "phone",
      title: "Phone Number",
      icon: <FaPhone />,
      color: "from-pink-500 to-pink-600",
      description: "Send to mobile number",
    },
  ];

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const handleSend = async () => {
    if (!amount || !toUpi) {
      toast.error("Please fill all required fields");
      return;
    }

    if (parseFloat(amount) > balance) {
      toast.error("Insufficient balance");
      return;
    }

    setLoading(true);
    try {
      const userId = getUserId();
      const res = await axios.post(
        `${getApiBase()}/api/wallet/send`,
        {
          userId,
          toUpi,
          amount: Number(amount),
          note,
        },
        { headers: getAuthHeaders() }
      );

      setBalance(res.data.newBalance ?? balance - Number(amount));
      setShowSuccess(true);
      toast.success("Money sent successfully!");
      
      setTimeout(() => {
        resetForm();
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSendMethod("");
    setToUpi("");
    setAmount("");
    setNote("");
    setShowSuccess(false);
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageShell
      title="Send Money"
      subtitle="Fast, secure & instant transfers"
      headerRight={
        <div className="page-card py-2.5 px-4 text-right min-w-[120px]">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Balance</p>
          <p className="text-lg font-bold text-foreground">₹{balance.toLocaleString("en-IN")}</p>
        </div>
      }
    >
      <div className="space-y-6">

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-5xl text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-4">₹{amount} sent to {toUpi}</p>
                <button
                  onClick={resetForm}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold"
                >
                  Done
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 1: Choose Method */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Choose Payment Method</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {sendMethods.map((method) => (
                <motion.button
                  key={method.id}
                  onClick={() => {
                    setSendMethod(method.id);
                    setStep(2);
                  }}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center text-white text-3xl mb-3 mx-auto`}
                  >
                    {method.icon}
                  </div>
                  <p className="text-gray-800 font-bold text-sm mb-1">{method.title}</p>
                  <p className="text-gray-500 text-xs">{method.description}</p>
                </motion.button>
              ))}
            </div>

            {/* Recent Transactions */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaHistory className="text-blue-500 mr-2" />
                Send Again
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentTransactions.map((transaction) => (
                  <motion.button
                    key={transaction.id}
                    onClick={() => {
                      setToUpi(transaction.name.toLowerCase().replace(" ", "") + "@paymanni");
                      setSendMethod("upi");
                      setStep(2);
                    }}
                    className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center space-x-3"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                      <FaUser />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-gray-800">{transaction.name}</p>
                      <p className="text-gray-500 text-sm">₹{transaction.amount} • {transaction.time}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Enter Details */}
        {step === 2 && (
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button
              onClick={() => setStep(1)}
              className="text-purple-600 font-semibold mb-4 flex items-center hover:text-purple-700"
            >
              ← Back
            </button>

            {sendMethod === "contact" && (
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none mb-4"
                />
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredContacts.map((contact) => (
                    <motion.button
                      key={contact.id}
                      onClick={() => {
                        setToUpi(contact.upi);
                        setStep(3);
                      }}
                      className="w-full bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-all flex items-center space-x-3"
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                        {contact.avatar}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-gray-800">{contact.name}</p>
                        <p className="text-gray-500 text-sm">{contact.upi}</p>
                      </div>
                      <p className="text-gray-600 text-sm">{contact.lastTransaction}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {sendMethod === "upi" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter UPI ID
                  </label>
                  <input
                    type="text"
                    placeholder="username@paymanni"
                    value={toUpi}
                    onChange={(e) => setToUpi(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setStep(3)}
                  disabled={!toUpi}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            )}

            {sendMethod === "qr" && (
              <div className="text-center py-8">
                <FaQrcode className="text-8xl text-purple-500 mx-auto mb-4" />
                <p className="text-gray-600">QR Scanner will open here</p>
                <button
                  onClick={() => navigate("/qr-scanner")}
                  className="mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold"
                >
                  Open QR Scanner
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Enter Amount */}
        {step === 3 && (
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button
              onClick={() => setStep(2)}
              className="text-purple-600 font-semibold mb-4 flex items-center hover:text-purple-700"
            >
              ← Back
            </button>

            <div className="text-center mb-6">
              <p className="text-gray-600 mb-2">Sending to</p>
              <p className="text-xl font-bold text-gray-800">{toUpi}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-2xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Quick Select</p>
              <div className="grid grid-cols-3 gap-3">
                {quickAmounts.map((amt) => (
                  <motion.button
                    key={amt}
                    onClick={() => setAmount(amt.toString())}
                    className="bg-gray-100 hover:bg-purple-100 text-gray-800 py-3 rounded-xl font-semibold transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ₹{amt}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Add Note (Optional)
              </label>
              <input
                type="text"
                placeholder="What's this for?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!amount || loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : `Send ₹${amount || "0"}`}
            </button>
          </motion.div>
        )}
      </div>
    </PageShell>
  );
};

export default SendMoney;

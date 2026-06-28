import { apiUrl, getAuthHeaders, getUserId } from "../utils/authStorage";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { 
  FaWallet, 
  FaEye, 
  FaEyeSlash, 
  FaPlus, 
  FaMinus, 
  FaHistory, 
  FaCreditCard,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaFilter,
  FaSearch,
  FaChartLine,
  FaBell,
  FaDownload
} from "react-icons/fa";
import { 
  MdAccountBalance, 
  MdTrendingUp, 
  MdTrendingDown,
  MdRefresh,
  MdSecurity,
  MdClose,
  MdNotifications
} from "react-icons/md";
import { HiSparkles, HiCash } from "react-icons/hi";
import { BiTransfer } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [customAmount, setCustomAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showConfirmWithdraw, setShowConfirmWithdraw] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { darkMode } = useTheme();

  const targetBalance = 50000;
  const { user } = useAuth();
  const userId = getUserId();



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
      const response = await axios.post(apiUrl(`/api/deposit`), {
        amount,
        userId,
      });
      
      if (response.data.walletBalance !== undefined) {
        setBalance(response.data.walletBalance);
        addTransaction(amount, "Deposit");
        toast.success(`₹${amount} deposited successfully!`);
      } else {
        toast.error("Deposit failed - Invalid response.");
      }
    } catch (error) {
      console.error("❌ Error during deposit:", error);
      toast.error("Failed to deposit money. Please try again.");
    }
  };
  
  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
  
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid withdrawal amount.");
      return;
    }
  
    try {
      const response = await axios.post(apiUrl(`/api/withdraw`), {
        amount,
        userId,
      });
  
      if (response.data?.success) {
        setBalance(response.data.balance);
        addTransaction(amount, "Withdraw");
        setWithdrawAmount('');
        setShowConfirmWithdraw(false);
        toast.success(`₹${amount} withdrawn successfully!`);
      } else {
        toast.error(response.data?.message || 'Withdrawal failed');
      }
    } catch (error) {
      console.error("❌ Withdrawal error:", error);
      toast.error("Failed to withdraw money. Please try again.");
    }
  };
  
  // Mock analytics data
  const analytics = {
    totalSpent: 15000,
    totalReceived: 25000,
    monthlySpending: 8500,
    savingsGoal: 30000
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.type?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         txn.amount?.toString().includes(searchTerm);
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'credit' && txn.type === 'Deposit') ||
                         (filterType === 'debit' && txn.type === 'Withdraw');
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        if (!userId) {
          console.warn("⚠️ No userId found");
          setLoading(false);
          return;
        }

        const response = await axios.get(apiUrl(`/api/myaccount/${userId}`));
        setBalance(response.data.balance || 0);
        setTransactions(response.data.transactions || []);
        toast.success("Wallet data loaded successfully!");
      } catch (error) {
        console.error("❌ Error fetching wallet data:", error);
        toast.error("Failed to load wallet data");
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [userId]);

  const progressPercentage = Math.min((balance / targetBalance) * 100, 100);

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
        <div className="relative z-10 px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <FaWallet className="text-blue-600 text-xl" />
              </div>
              <h1 className="text-2xl font-bold text-white">My Wallet</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Dark mode toggle is now in the header */}
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300">
                <MdNotifications className="text-white text-xl" />
              </button>
            </div>
          </div>

          {/* Balance Card */}
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full border-4 border-t-4 border-white h-16 w-16"></div>
            </div>
          ) : (
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-white/70 text-sm">Available Balance</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-white">
                      {balanceVisible ? `₹${balance?.toLocaleString() || 0}` : "₹****"}
                    </span>
                    <button
                      onClick={() => setBalanceVisible(!balanceVisible)}
                      className="p-1 hover:bg-white/20 rounded-full transition-all duration-300"
                    >
                      {balanceVisible ? <FaEye className="text-white" /> : <FaEyeSlash className="text-white" />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
                >
                  <MdRefresh className="text-white text-xl" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70 text-sm">Goal Progress</span>
                  <span className="text-white/70 text-sm">₹{targetBalance.toLocaleString()}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  onClick={() => setShowAddMoney(true)}
                  className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPlus className="text-sm" />
                  <span className="font-semibold">Add Money</span>
                </motion.button>
                
                <motion.button
                  onClick={() => setShowConfirmWithdraw(true)}
                  className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaMinus className="text-sm" />
                  <span className="font-semibold">Withdraw</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="px-6 -mt-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Spent", value: analytics.totalSpent, icon: <FaArrowDown />, color: "red" },
            { label: "Total Received", value: analytics.totalReceived, icon: <FaArrowUp />, color: "green" },
            { label: "This Month", value: analytics.monthlySpending, icon: <FaChartLine />, color: "blue" },
            { label: "Savings Goal", value: analytics.savingsGoal, icon: <HiSparkles />, color: "purple" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-xl shadow-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } hover:shadow-xl transition-all duration-300`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`w-10 h-10 rounded-full bg-${stat.color}-100 flex items-center justify-center mb-3`}>
                <span className={`text-${stat.color}-600`}>{stat.icon}</span>
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                ₹{stat.value.toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Transaction History */}
        <motion.div
          className={`rounded-2xl shadow-lg p-6 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Transaction History
            </h3>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <FaSearch className={`absolute left-3 top-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search transactions"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`px-4 py-2 rounded-xl border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-200 text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredTransactions && filteredTransactions.length > 0 ? (
              filteredTransactions.map((txn, index) => (
                <motion.div
                  key={txn.id || index}
                  className={`p-4 rounded-xl ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } hover:shadow-md transition-all duration-300`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        txn.type === "Deposit" ? "bg-green-100" : "bg-red-100"
                      }`}>
                        {txn.type === "Deposit" ? (
                          <FaArrowDown className="text-green-600" />
                        ) : (
                          <FaArrowUp className="text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {txn.type}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {txn.date}
                        </p>
                      </div>
                    </div>
                    <span className={`font-bold ${
                      txn.type === "Deposit" ? "text-green-600" : "text-red-600"
                    }`}>
                      {txn.type === "Deposit" ? "+" : "-"}₹{txn.amount}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <FaHistory className={`mx-auto text-4xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No transactions found
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Add Money Modal */}
      <AnimatePresence>
        {showAddMoney && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`w-full max-w-md rounded-2xl p-6 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-2xl`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Add Money
                </h3>
                <button
                  onClick={() => setShowAddMoney(false)}
                  className={`p-2 rounded-full hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-all duration-300`}
                >
                  <MdClose className={darkMode ? 'text-white' : 'text-gray-600'} />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className={`w-full p-4 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />

                <div className="grid grid-cols-3 gap-3">
                  {[500, 1000, 2000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setCustomAmount(amount.toString())}
                      className={`p-3 rounded-xl border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>

                <motion.button
                  onClick={() => {
                    if (customAmount) {
                      handleDeposit(parseFloat(customAmount));
                      setCustomAmount('');
                      setShowAddMoney(false);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add Money
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showConfirmWithdraw && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`w-full max-w-md rounded-2xl p-6 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-2xl`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Withdraw Money
                </h3>
                <button
                  onClick={() => setShowConfirmWithdraw(false)}
                  className={`p-2 rounded-full hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-all duration-300`}
                >
                  <MdClose className={darkMode ? 'text-white' : 'text-gray-600'} />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Enter withdrawal amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className={`w-full p-4 rounded-xl border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-red-500`}
                />

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConfirmWithdraw(false)}
                    className={`flex-1 py-3 rounded-xl border-2 ${
                      darkMode 
                        ? 'border-gray-600 text-gray-400 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    } transition-all duration-300`}
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleWithdraw}
                    className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Withdraw
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
};

export default Wallet;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import {
  FaArrowUp,
  FaArrowDown,
  FaFilter,
  FaSearch,
  FaCalendar,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaDownload,
  FaReceipt,
  FaUser,
  FaBolt,
  FaPhoneAlt,
  FaUniversity,
  FaShoppingCart,
  FaHistory,
  FaTrophy,
} from "react-icons/fa";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";
import { apiUrl, getAuthHeaders, getUserId } from "../utils/authStorage";
import { isCreditTransaction, formatCurrency, formatDateShort } from "../utils/format";
import LoadingSpinner from "../Components/ui/LoadingSpinner";
import BottomNav from "../Components/layout/BottomNav";

const Transactions = () => {
  const { darkMode } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTxnId, setExpandedTxnId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalReceived: 0,
    totalTransactions: 0,
  });

  const [authError, setAuthError] = useState(false);

  const normalizeTransaction = (txn) => {
    const ts = txn.timestamp || txn.createdAt || txn.date || txn.time;
    const description =
      txn.description ||
      txn.service ||
      txn.recipient ||
      txn.sender ||
      txn.note ||
      txn.type ||
      "Transaction";

    return {
      _id: txn._id || txn.id,
      type: txn.type,
      amount: Math.abs(Number(txn.amount) || 0),
      description,
      recipient: txn.recipient,
      sender: txn.sender,
      service: txn.service || txn.type,
      timestamp: ts,
      status: txn.status || "completed",
      category: txn.category || txn.typeTag,
      icon: txn.icon,
      details: txn.details || {
        type: isCreditTransaction(txn) ? "credit" : "debit",
        description,
      },
    };
  };

  const fetchTransactions = async () => {
    const userId = getUserId();
    setAuthError(false);

    try {
      let txns = [];

      try {
        const res = await axios.get(apiUrl("/api/transactions/all"), {
          headers: getAuthHeaders(),
        });
        txns = res.data.transactions || res.data || [];
      } catch (primaryError) {
        if (primaryError.response?.status === 401) {
          setAuthError(true);
        }

        if (userId) {
          const fallback = await axios.get(apiUrl(`/api/wallet/transactions/${userId}`), {
            headers: getAuthHeaders(),
            params: { limit: 100 },
          });
          txns = Array.isArray(fallback.data) ? fallback.data : fallback.data.transactions || [];
        } else {
          throw primaryError;
        }
      }

      const normalized = txns.map(normalizeTransaction);
      setTransactions(normalized);
      setFilteredTransactions(normalized);
      calculateStats(normalized);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      if (error.response?.status === 401) {
        setAuthError(true);
        toast.error("Session expired — please log in again");
      } else {
        toast.error("Could not load transactions");
      }
      setTransactions([]);
      setFilteredTransactions([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const calculateStats = (txns) => {
    const spent = txns
      .filter((t) => !isCreditTransaction(t))
      .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

    const received = txns
      .filter((t) => isCreditTransaction(t))
      .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

    setStats({
      totalSpent: spent,
      totalReceived: received,
      totalTransactions: txns.length,
    });
  };

  const getIcon = (category) => {
    const icons = {
      user: FaUser,
      bolt: FaBolt,
      phone: FaPhoneAlt,
      bank: FaUniversity,
      cart: FaShoppingCart,
    };
    return icons[category] || FaUser;
  };

  useEffect(() => {
    filterTransactions();
  }, [searchQuery, filterType, filterStatus, dateRange, transactions]);

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.recipient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.sender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.service?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.amount?.toString().includes(searchQuery)
      );
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType || t.category === filterType);
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((t) => t.status === filterStatus);
    }

    // Date range filter
    if (dateRange !== "all") {
      const now = new Date();
      filtered = filtered.filter((t) => {
        const txnDate = new Date(t.timestamp || t.createdAt || t.date);
        switch (dateRange) {
          case "today":
            return txnDate.toDateString() === now.toDateString();
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return txnDate >= weekAgo;
          case "month":
            return txnDate.getMonth() === now.getMonth() && txnDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    setFilteredTransactions(filtered);
  };

  const getTransactionIcon = (transaction) => {
    switch (transaction.icon || transaction.category) {
      case "user":
        return <FaUser />;
      case "bolt":
      case "bill":
        return <FaBolt />;
      case "phone":
      case "recharge":
        return <FaPhoneAlt />;
      case "bank":
        return <FaUniversity />;
      case "shopping":
        return <FaShoppingCart />;
      default:
        return transaction.type === "received" ? <FaArrowDown /> : <FaArrowUp />;
    }
  };

  const downloadReceipt = (transaction) => {
    toast.success("Receipt downloaded successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <LoadingSpinner label="Loading transactions..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 pb-24 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-2xl shadow-2xl mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold flex items-center">
              <FaHistory className="mr-3" />
              Transaction History
            </h1>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                fetchTransactions();
              }}
              className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors"
            >
              Refresh
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-amber-500/20 border border-amber-300/30 text-sm">
              Showing wallet history. Log out and sign in again for full transaction sync.
            </div>
          )}
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-purple-100 text-sm mb-1">Total Spent</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</p>
                <MdTrendingDown className="text-red-300 text-2xl" />
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-purple-100 text-sm mb-1">Total Received</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{formatCurrency(stats.totalReceived)}</p>
                <MdTrendingUp className="text-green-300 text-2xl" />
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-purple-100 text-sm mb-1">Total Transactions</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{stats.totalTransactions}</p>
                <FaTrophy className="text-yellow-300 text-2xl" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              <FaFilter />
              <span>Filters</span>
            </button>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="sent">Sent</option>
                    <option value="received">Received</option>
                    <option value="bill">Bills</option>
                    <option value="recharge">Recharge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-12 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <FaReceipt className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Transactions Found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query</p>
            </motion.div>
          ) : (
            filteredTransactions.map((txn, index) => {
              const details = txn.details || {};
              const isExpanded = expandedTxnId === txn._id;
              const isDebit = !isCreditTransaction(txn);

              return (
                <motion.div
                  key={txn._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer"
                    onClick={() => setExpandedTxnId(isExpanded ? null : txn._id)}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                          isDebit
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {getTransactionIcon(txn)}
                      </div>

                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-lg">
                          {txn.description || txn.recipient || txn.sender || txn.service || "Transaction"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {txn.timestamp ? new Date(txn.timestamp).toLocaleString() : "—"}
                        </p>
                        <div className="flex items-center mt-1">
                          {txn.status === "completed" && (
                            <span className="flex items-center text-green-600 text-xs">
                              <FaCheckCircle className="mr-1" />
                              Completed
                            </span>
                          )}
                          {txn.status === "pending" && (
                            <span className="flex items-center text-yellow-600 text-xs">
                              <FaClock className="mr-1" />
                              Pending
                            </span>
                          )}
                          {txn.status === "failed" && (
                            <span className="flex items-center text-red-600 text-xs">
                              <FaTimes className="mr-1" />
                              Failed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-2xl font-bold ${
                          isDebit ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {isDebit ? "-" : "+"}{formatCurrency(txn.amount)}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadReceipt(txn);
                        }}
                        className="mt-2 text-purple-600 hover:text-purple-700 text-sm flex items-center space-x-1"
                      >
                        <FaDownload />
                        <span>Receipt</span>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-t border-gray-100"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1">Transaction ID</p>
                            <p className="font-semibold text-gray-800">{txn._id}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Type</p>
                            <p className="font-semibold text-gray-800 capitalize">{txn.type}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Description</p>
                            <p className="font-semibold text-gray-800">
                              {details.description || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">Category</p>
                            <p className="font-semibold text-gray-800 capitalize">
                              {txn.category || "General"}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Transactions;

import { apiUrl, getAuthHeaders, getUserId } from "../utils/authStorage";
import React, { useEffect, useState } from 'react';
import {
  Wallet,
  RefreshCw,
  History,
  ArrowDown,
  ArrowUp,
  IndianRupee,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import PageShell from '../Components/layout/PageShell';
import BottomNav from '../Components/layout/BottomNav';
import { formatCurrency, isCreditTransaction } from '../utils/format';

const BalanceHis = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login-user');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  const fetchAllData = async () => {
    const userToFetch = getUserId();
    if (!userToFetch) {
      setError('Authentication required');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const headers = getAuthHeaders();
      const walletRes = await axios.get(apiUrl(`/api/myaccount/${userToFetch}`), { headers });
      setWallet(walletRes.data);

      try {
        const txnRes = await axios.get(apiUrl('/api/transactions/all'), { headers });
        setTransactions(txnRes.data?.transactions || []);
      } catch {
        const fallback = await axios.get(apiUrl(`/api/wallet/transactions/${userToFetch}`), {
          headers,
          params: { limit: 20 },
        });
        const list = Array.isArray(fallback.data) ? fallback.data : [];
        setTransactions(list);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to load balance history';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      setUserId(getUserId());
      fetchAllData();
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-900 dark:text-white text-lg">Loading balance history...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
      {error && (
        <motion.div
          className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-4xl font-bold flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
          <Wallet className="w-8 h-8 animate-bounce" />
          Wallet Summary
        </h2>
        <button
          onClick={() => fetchAllData(userId)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-700 hover:bg-indigo-600 transition-colors text-white rounded-xl shadow-md"
        >
          <RefreshCw className="w-4 h-4 animate-spin-slow" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-24 text-gray-400 animate-pulse">Loading data...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Balance Card */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-[#1e293b] rounded-2xl p-6 shadow-lg border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Current Balance
            </h3>
            <p className="text-4xl font-bold text-green-400">
              ₹{wallet?.balance?.toLocaleString("en-IN") || "0"}
            </p>
          </motion.div>

          {/* Transaction List */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-[#1e293b] rounded-2xl p-6 shadow-lg border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
              <History className="w-5 h-5" />
              All Transactions
            </h3>
            <ul className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {transactions?.length ? (
                transactions.map((txn, i) => (
                  <li
                    key={txn._id || i}
                    className="flex justify-between items-center p-3 rounded-lg bg-[#0f172a] border border-gray-700"
                  >
                    <div>
                      <p className="text-base font-medium">{txn.description}</p>
                      <p className="text-xs text-gray-500">{new Date(txn.date).toLocaleString()}</p>
                    </div>
                    <span
                      className={`text-sm font-semibold flex items-center gap-1 ${
                        txn.type === 'debit' ? 'text-red-400' : 'text-green-400'
                      }`}
                    >
                      {txn.type === 'debit' ? (
                        <ArrowDown className="w-4 h-4" />
                      ) : (
                        <ArrowUp className="w-4 h-4" />
                      )}
                      ₹{txn.amount.toLocaleString("en-IN")}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500">No transactions found.</p>
              )}
            </ul>
          </motion.div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default BalanceHis;

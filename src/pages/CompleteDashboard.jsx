import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaWallet, FaPaperPlane, FaMobileAlt, FaBolt, FaFilm, FaTrain, FaBus, FaPlane,
  FaHistory, FaUser, FaQrcode, FaArrowUp, FaArrowDown, FaTv, FaGasPump, FaUsers,
  FaMoneyBillWave, FaBell, FaGift, FaSync, FaThLarge, FaCreditCard,
} from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getAuthHeaders, getApiBase, getUserId, getUserUpi } from "../utils/authStorage";
import BottomNav from "../Components/layout/BottomNav";
import SpendingChart from "../Components/charts/SpendingChart";
import { formatCurrency, isCreditTransaction } from "../utils/format";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const offers = [
  { id: 1, title: "10% Cashback", desc: "On recharges above ₹299", gradient: "from-amber-500 to-orange-600", path: "/recharge" },
  { id: 2, title: "₹50 Off Bills", desc: "Electricity payments today", gradient: "from-green-500 to-emerald-600", path: "/pay-bills" },
  { id: 3, title: "Travel Sale", desc: "15% off bus tickets", gradient: "from-blue-500 to-indigo-600", path: "/bus-booking" },
];

const CompleteDashboard = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ spent: 0, received: 0 });

  const loadData = useCallback(async (showRefreshToast = false) => {
    const userId = getUserId();
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      if (showRefreshToast) setRefreshing(true);
      else setLoading(true);

      const [accountRes, txRes] = await Promise.all([
        axios.get(`${getApiBase()}/api/myaccount/${userId}`, { headers: getAuthHeaders() }),
        axios.get(`${getApiBase()}/api/transactions/all`, { headers: getAuthHeaders() }).catch(() => ({ data: [] })),
      ]);

      setBalance(accountRes.data.balance || 0);
      const txns = txRes.data.transactions || txRes.data || [];
      setAllTransactions(txns);
      setTransactions(txns.slice(0, 5));

      const spent = txns
        .filter((t) => !isCreditTransaction(t))
        .reduce((s, t) => s + Math.abs(Number(t.amount) || 0), 0);
      const received = txns
        .filter((t) => isCreditTransaction(t))
        .reduce((s, t) => s + Math.abs(Number(t.amount) || 0), 0);
      setStats({ spent, received });

      if (showRefreshToast) toast.success("Dashboard updated");
    } catch (error) {
      console.error("Dashboard load error:", error);
      if (showRefreshToast) toast.error("Could not refresh data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("paymanni_user") || "null");
    setUser(authUser || stored);
    loadData();
  }, [authUser, loadData]);

  const services = [
    { name: "Recharge", icon: FaMobileAlt, color: "from-blue-500 to-blue-600", path: "/recharge" },
    { name: "Bills", icon: FaBolt, color: "from-yellow-500 to-yellow-600", path: "/pay-bills" },
    { name: "Movies", icon: FaFilm, color: "from-red-500 to-red-600", path: "/movies" },
    { name: "Train", icon: FaTrain, color: "from-green-500 to-green-600", path: "/train-booking" },
    { name: "Bus", icon: FaBus, color: "from-teal-500 to-teal-600", path: "/bus-booking" },
    { name: "Flight", icon: FaPlane, color: "from-indigo-500 to-indigo-600", path: "/flight-booking" },
    { name: "Loan", icon: FaMoneyBillWave, color: "from-amber-500 to-orange-600", path: "/loan-application" },
    { name: "All", icon: FaThLarge, color: "from-purple-500 to-pink-600", path: "/services" },
  ];

  const quickActions = [
    { name: "Send", icon: FaPaperPlane, action: () => navigate("/send-money") },
    { name: "Receive", icon: FaArrowDown, action: () => navigate("/receive-money") },
    { name: "Scan QR", icon: FaQrcode, action: () => navigate("/qr-scanner") },
    { name: "Split", icon: FaUsers, action: () => navigate("/split-payment") },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0f0a1e] to-slate-950 flex items-center justify-center">
        <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0f0a1e] to-slate-950 text-white pb-28">
      <ToastContainer position="top-center" theme="dark" />

      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 pt-6 pb-28 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-blue-100 text-sm">{getGreeting()},</p>
              <h1 className="text-2xl font-bold">{user?.name || "User"} 👋</h1>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                onClick={() => loadData(true)}
                disabled={refreshing}
                className="w-10 h-10 glass rounded-full flex items-center justify-center"
                whileTap={{ scale: 0.95 }}
                aria-label="Refresh"
              >
                <FaSync className={`text-sm ${refreshing ? "animate-spin" : ""}`} />
              </motion.button>
              <motion.button
                type="button"
                onClick={() => navigate("/notifications")}
                className="w-10 h-10 glass rounded-full flex items-center justify-center relative"
                whileTap={{ scale: 0.95 }}
                aria-label="Notifications"
              >
                <FaBell />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>
              <motion.button
                type="button"
                onClick={() => navigate("/profile")}
                className="w-10 h-10 glass rounded-full flex items-center justify-center"
                whileTap={{ scale: 0.95 }}
                aria-label="Profile"
              >
                <FaUser />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-20 space-y-8">
        {/* Wallet */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-6 sm:p-8 shadow-2xl"
        >
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  <FaWallet className="text-2xl" />
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Available balance</p>
                  <h2 className="text-3xl sm:text-4xl font-bold">{formatCurrency(balance)}</h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/wallet")}
                className="px-6 py-2.5 bg-white text-purple-600 rounded-full font-bold text-sm hover:shadow-xl transition-shadow self-start sm:self-center"
              >
                + Add Money
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="glass rounded-xl p-3">
                <p className="text-xs text-blue-100">Spent</p>
                <p className="font-bold text-red-200">₹{stats.spent.toFixed(0)}</p>
              </div>
              <div className="glass rounded-xl p-3">
                <p className="text-xs text-blue-100">Received</p>
                <p className="font-bold text-green-200">₹{stats.received.toFixed(0)}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {quickActions.map((action, idx) => (
                <motion.button
                  key={action.name}
                  type="button"
                  onClick={action.action}
                  className="flex flex-col items-center gap-1.5 p-3 glass rounded-2xl hover:bg-white/20 transition-colors"
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <action.icon className="text-xl sm:text-2xl" />
                  <span className="text-[10px] sm:text-xs font-medium">{action.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Offers */}
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <FaGift className="text-amber-400" /> Offers for you
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
            {offers.map((offer) => (
              <motion.button
                key={offer.id}
                type="button"
                onClick={() => navigate(offer.path)}
                className={`snap-start shrink-0 w-56 p-4 rounded-2xl bg-gradient-to-br ${offer.gradient} text-left shadow-lg`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="font-bold text-lg">{offer.title}</p>
                <p className="text-sm text-white/90 mt-1">{offer.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Spending chart */}
        <div className="glass-dark rounded-2xl p-5 border border-gray-700/40">
          <h3 className="text-lg font-bold mb-4">Weekly overview</h3>
          <SpendingChart transactions={allTransactions} dark />
        </div>

        {/* UPI quick access */}
        {getUserUpi() && (
          <motion.button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(getUserUpi());
              toast.success("UPI ID copied!");
            }}
            className="w-full glass-dark rounded-2xl p-4 border border-gray-700/40 flex items-center justify-between text-left hover:border-purple-500/40 transition-colors"
            whileTap={{ scale: 0.99 }}
          >
            <div>
              <p className="text-xs text-gray-400">Your UPI ID</p>
              <p className="font-mono font-medium text-sm mt-0.5">{getUserUpi()}</p>
            </div>
            <span className="text-xs text-blue-400 font-medium">Tap to copy</span>
          </motion.button>
        )}

        {/* Services */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Services</h3>
            <button type="button" onClick={() => navigate("/services")} className="text-sm text-blue-400 hover:underline">
              View all →
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {services.map((service, idx) => (
              <motion.button
                key={service.name}
                type="button"
                onClick={() => navigate(service.path)}
                className="glass-dark rounded-2xl p-3 sm:p-4 border border-gray-700/40 hover:border-purple-500/40 transition-colors"
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                  <service.icon className="text-lg sm:text-xl" />
                </div>
                <p className="text-[10px] sm:text-xs font-medium text-center text-gray-300">{service.name}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Recent activity</h3>
            <button type="button" onClick={() => navigate("/transactions")} className="text-sm text-blue-400 hover:underline">
              View all →
            </button>
          </div>
          <div className="glass-dark rounded-2xl border border-gray-700/40 divide-y divide-gray-700/40">
            {transactions.length > 0 ? (
              transactions.map((txn, idx) => {
                const isCredit = ["credit", "Credit", "received"].includes(txn.type);
                return (
                  <div key={txn._id || idx} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isCredit ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {isCredit ? <FaArrowDown /> : <FaArrowUp />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{txn.description || txn.note || "Transaction"}</p>
                        <p className="text-xs text-gray-500">
                          {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString("en-IN") : "—"}
                        </p>
                      </div>
                    </div>
                    <p className={`font-bold ${isCredit ? "text-green-400" : "text-red-400"}`}>
                      {isCredit ? "+" : "-"}₹{Number(txn.amount || 0).toFixed(2)}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 px-4">
                <FaHistory className="text-3xl text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No transactions yet</p>
                <button type="button" onClick={() => navigate("/recharge")} className="mt-3 text-sm text-blue-400 hover:underline">
                  Make your first recharge →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default CompleteDashboard;

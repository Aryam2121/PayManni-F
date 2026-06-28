import React, { useEffect, useState, useCallback } from "react";
import {
  Banknote,
  RefreshCw,
  CreditCard,
  History,
  ShieldCheck,
  KeyRound,
  Copy,
  Plus,
  Wallet,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { apiUrl, getAuthHeaders, getUserId, getUserUpi } from "../utils/authStorage";
import { formatCurrency } from "../utils/format";
import LoadingSpinner from "./ui/LoadingSpinner";
import BottomNav from "./layout/BottomNav";

const BankServices = () => {
  const { darkMode } = useTheme();
  const [copied, setCopied] = useState(false);
  const [bankData, setBankData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showLinkBank, setShowLinkBank] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountMask, setAccountMask] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [savingPin, setSavingPin] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08 },
    }),
  };

  const fetchBankData = useCallback(async (silent = false) => {
    const userId = getUserId();
    if (!userId) {
      setLoading(false);
      return;
    }

    if (silent) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await axios.get(apiUrl(`/api/myaccount/${userId}`), {
        headers: getAuthHeaders(),
      });
      setBankData({
        ...res.data,
        upiId: res.data.upiId || getUserUpi(),
      });
    } catch (err) {
      console.error("Error fetching bank data:", err);
      const fallbackUpi = getUserUpi();
      if (fallbackUpi) {
        setBankData({
          name: "",
          upiId: fallbackUpi,
          balance: 0,
          linkedAccounts: [],
          transactions: [],
        });
      }
      toast.error("Could not load banking data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBankData();
  }, [fetchBankData]);

  const handleCopy = () => {
    const upi = bankData?.upiId || getUserUpi();
    if (!upi) return;
    navigator.clipboard.writeText(upi);
    setCopied(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkBank = async (e) => {
    e.preventDefault();
    const userId = getUserId();
    if (!userId || !bankName.trim()) {
      toast.error("Enter bank name");
      return;
    }

    try {
      await axios.post(
        apiUrl(`/api/${userId}/account`),
        {
          bankName: bankName.trim(),
          accountNumberMasked: accountMask.trim() || "**** 0000",
        },
        { headers: getAuthHeaders() }
      );
      toast.success("Bank account linked!");
      setShowLinkBank(false);
      setBankName("");
      setAccountMask("");
      fetchBankData(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to link account");
    }
  };

  const handleSetPin = async (e) => {
    e.preventDefault();
    const userId = getUserId();
    if (!userId) return;

    if (newPin.length !== 4 || confirmPin.length !== 4) {
      toast.error("PIN must be 4 digits");
      return;
    }
    if (newPin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }

    setSavingPin(true);
    try {
      await axios.post(
        apiUrl("/api/wallet/set-pin"),
        { userId, pin: newPin, currentPin: currentPin || undefined },
        { headers: getAuthHeaders() }
      );
      toast.success("UPI PIN updated!");
      setShowPinModal(false);
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update PIN");
    } finally {
      setSavingPin(false);
    }
  };

  const formatTxnDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const upiDisplay = bankData?.upiId || getUserUpi();

  return (
    <div
      className={`p-6 pb-28 min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold flex items-center gap-3 text-indigo-400">
              <Banknote className="w-8 h-8" />
              Banking Services
            </h2>
            {bankData?.name && (
              <p className="text-sm text-gray-400 mt-1">Welcome, {bankData.name}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => fetchBankData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-700 hover:bg-indigo-600 disabled:opacity-60 transition-colors text-white rounded-xl shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-24 flex justify-center">
            <LoadingSpinner label="Loading banking data..." />
          </div>
        ) : (
          <>
            {/* Balance strip */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-xl"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-indigo-100 text-sm flex items-center gap-2">
                    <Wallet className="w-4 h-4" /> Wallet Balance
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {formatCurrency(bankData?.balance ?? 0)}
                  </p>
                </div>
                {upiDisplay && (
                  <div className="text-right">
                    <p className="text-indigo-100 text-xs">Your UPI</p>
                    <p className="font-mono font-medium">{upiDisplay}</p>
                  </div>
                )}
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Linked Bank Accounts */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={0}
                className="bg-[#1e293b] rounded-2xl shadow-xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-400">
                    <CreditCard className="w-6 h-6" />
                    Linked Bank Accounts
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowLinkBank(true)}
                    className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30"
                  >
                    <Plus className="w-3 h-3" /> Link
                  </button>
                </div>
                <ul className="space-y-3">
                  {bankData?.linkedAccounts?.length ? (
                    bankData.linkedAccounts.map((acc, i) => (
                      <li
                        key={i}
                        className="bg-[#0f172a] p-4 rounded-xl border border-gray-700"
                      >
                        <p className="font-semibold">{acc.bankName}</p>
                        <p className="text-sm text-gray-400">{acc.accountNumberMasked}</p>
                      </li>
                    ))
                  ) : (
                    <div className="text-center py-8 border border-dashed border-gray-600 rounded-xl">
                      <CreditCard className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-3">No linked accounts yet</p>
                      <button
                        type="button"
                        onClick={() => setShowLinkBank(true)}
                        className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Link your first bank account →
                      </button>
                    </div>
                  )}
                </ul>
              </motion.div>

              {/* Recent Transactions */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={1}
                className="bg-[#1e293b] rounded-2xl shadow-xl p-6 border border-gray-700"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-400">
                  <History className="w-6 h-6" />
                  Recent Transactions
                </h3>
                <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {bankData?.transactions?.length ? (
                    bankData.transactions.map((txn, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-center p-3 rounded-lg bg-[#0f172a] border border-gray-700"
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <p className="text-sm font-medium truncate">{txn.description}</p>
                          <p className="text-xs text-gray-500">{formatTxnDate(txn.date)}</p>
                        </div>
                        <span
                          className={`text-sm font-semibold shrink-0 ${
                            txn.type === "debit" ? "text-red-400" : "text-green-400"
                          }`}
                        >
                          {txn.type === "debit" ? "-" : "+"}
                          {formatCurrency(txn.amount)}
                        </span>
                      </li>
                    ))
                  ) : (
                    <div className="text-center py-8 border border-dashed border-gray-600 rounded-xl">
                      <History className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No transactions yet</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Recharge, pay bills, or send money to see activity here
                      </p>
                    </div>
                  )}
                </ul>
              </motion.div>

              {/* Virtual UPI ID */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={2}
                className="bg-[#1e293b] rounded-2xl shadow-xl p-6 border border-gray-700"
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-purple-400">
                  <ShieldCheck className="w-6 h-6" />
                  Virtual UPI ID
                </h3>
                {upiDisplay ? (
                  <>
                    <p className="text-xs text-gray-400 mb-2">Share this ID to receive payments</p>
                    <div className="flex items-center gap-3 p-4 bg-[#0f172a] rounded-xl border border-gray-700">
                      <p className="text-xl font-bold text-indigo-400 truncate flex-1 font-mono">
                        {upiDisplay}
                      </p>
                      <button
                        type="button"
                        onClick={handleCopy}
                        title="Copy UPI ID"
                        className="p-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 transition-colors"
                      >
                        <Copy className="w-5 h-5 text-indigo-300" />
                      </button>
                    </div>
                    {copied && (
                      <p className="text-sm text-green-400 mt-2">Copied to clipboard!</p>
                    )}
                  </>
                ) : (
                  <div className="py-6 text-center text-gray-500 text-sm">
                    UPI ID not available — complete your profile after login
                  </div>
                )}
              </motion.div>

              {/* UPI PIN */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={3}
                className="bg-[#1e293b] rounded-2xl shadow-xl p-6 border border-gray-700 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-yellow-400">
                    <KeyRound className="w-6 h-6" />
                    Manage UPI PIN
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Securely set or change your 4-digit UPI PIN for payments and transfers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPinModal(true)}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm rounded-xl font-semibold shadow-lg w-full sm:w-auto"
                >
                  Set / Change PIN
                </button>
              </motion.div>
            </div>
          </>
        )}
      </div>

      {/* Link bank modal */}
      <AnimatePresence>
        {showLinkBank && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLinkBank(false)}
          >
            <motion.form
              onSubmit={handleLinkBank}
              className="bg-[#1e293b] border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Link Bank Account</h3>
              <label className="block text-sm text-gray-400 mb-1">Bank name</label>
              <input
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. HDFC Bank"
                className="w-full mb-4 px-4 py-3 rounded-xl bg-[#0f172a] border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
              <label className="block text-sm text-gray-400 mb-1">Account (masked)</label>
              <input
                value={accountMask}
                onChange={(e) => setAccountMask(e.target.value)}
                placeholder="**** 1234"
                className="w-full mb-6 px-4 py-3 rounded-xl bg-[#0f172a] border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLinkBank(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Link Account
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PIN modal */}
      <AnimatePresence>
        {showPinModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPinModal(false)}
          >
            <motion.form
              onSubmit={handleSetPin}
              className="bg-[#1e293b] border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Set UPI PIN</h3>
              <label className="block text-sm text-gray-400 mb-1">Current PIN (if changing)</label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
                className="w-full mb-4 px-4 py-3 rounded-xl bg-[#0f172a] border border-gray-600 text-white tracking-widest focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <label className="block text-sm text-gray-400 mb-1">New PIN</label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
                className="w-full mb-4 px-4 py-3 rounded-xl bg-[#0f172a] border border-gray-600 text-white tracking-widest focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
              <label className="block text-sm text-gray-400 mb-1">Confirm PIN</label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
                className="w-full mb-6 px-4 py-3 rounded-xl bg-[#0f172a] border border-gray-600 text-white tracking-widest focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPin}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold"
                >
                  {savingPin ? "Saving…" : "Save PIN"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default BankServices;

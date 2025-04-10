import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Banknote,
  CreditCard,
  History,
  KeyRound,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

const BankServices = () => {
  const [userId, setUserId] = useState(null);
  const [bankData, setBankData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBankData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://${import.meta.env.VITE_BACKEND}/api/${userId}`);
      setBankData(res.data);
    } catch (err) {
      console.error('Error fetching bank data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchBankData();
    }
  }, [userId]);


  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-800 dark:text-gray-100 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-extrabold flex items-center gap-3 text-indigo-700 dark:text-indigo-400">
          <Banknote className="w-8 h-8" /> Banking Services
        </h2>
        <button
          onClick={fetchBankData}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-100 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-700 shadow-md"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400 animate-pulse">
          Loading banking data...
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Linked Bank Accounts */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 hover:shadow-3xl border border-gray-100 dark:border-gray-700 transition-all">
            <h3 className="text-2xl font-semibold mb-5 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <CreditCard className="w-6 h-6" /> UPI Linked Bank Accounts
            </h3>
            <ul className="space-y-4">
              {bankData?.linkedAccounts?.length ? (
                bankData.linkedAccounts.map((acc, index) => (
                  <li
                    key={index}
                    className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:ring-2 hover:ring-indigo-500"
                  >
                    <p className="font-semibold text-lg">{acc.bankName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{acc.accountNumberMasked}</p>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500">No accounts linked yet.</p>
              )}
            </ul>
          </div>

          {/* Mini Statement */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 hover:shadow-3xl border border-gray-100 dark:border-gray-700 transition-all">
            <h3 className="text-2xl font-semibold mb-5 flex items-center gap-2 text-green-600 dark:text-green-400">
              <History className="w-6 h-6" /> Mini Statement
            </h3>
            <ul className="space-y-4 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {bankData?.transactions?.length ? (
                bankData.transactions.slice(0, 5).map((txn, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <div>
                      <p className="font-medium text-base">{txn.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{txn.date}</p>
                    </div>
                    <span
                      className={`text-base font-semibold ${txn.type === 'debit' ? 'text-red-500' : 'text-green-500'}`}
                    >
                      {txn.type === 'debit' ? '-' : '+'}₹{txn.amount}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent transactions.</p>
              )}
            </ul>
          </div>

          {/* Virtual UPI ID */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 hover:shadow-3xl border border-gray-100 dark:border-gray-700 transition-all flex flex-col justify-between">
            <h3 className="text-2xl font-semibold mb-5 flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-6 h-6" /> Virtual UPI ID
            </h3>
            <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-300">
              {bankData?.virtualUpiId || 'name@paymanni'}
            </p>
          </div>

          {/* Set / Change UPI PIN */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 hover:shadow-3xl border border-gray-100 dark:border-gray-700 transition-all flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-semibold mb-5 flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                <KeyRound className="w-6 h-6" /> Set / Change UPI PIN
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                Securely manage your UPI PIN linked to your bank account.
              </p>
            </div>
            <button className="mt-auto px-5 py-3 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg">
              Manage UPI PIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankServices;
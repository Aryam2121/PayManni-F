import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaWallet, FaChartLine } from 'react-icons/fa';

function Admin() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    axios.get(`https://${import.meta.env.VITE_BACKEND}/api/admin/users`).then(res => setUsers(res.data));
    axios.get(`https://${import.meta.env.VITE_BACKEND}/api/admin/transactions`).then(res => setTransactions(res.data));
    axios.get(`https://${import.meta.env.VITE_BACKEND}/api/admin/analytics`).then(res => setAnalytics(res.data));
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-100 font-sans">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-white">🧾 Admin Dashboard</h1>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl shadow p-6 transition-transform transform hover:scale-105 flex items-center space-x-4">
          <FaUsers className="text-blue-400 text-3xl" />
          <div>
            <h2 className="text-gray-400 text-sm">Total Users</h2>
            <p className="text-2xl font-bold text-blue-300">{analytics.totalUsers || 0}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl shadow p-6 transition-transform transform hover:scale-105 flex items-center space-x-4">
          <FaWallet className="text-green-400 text-3xl" />
          <div>
            <h2 className="text-gray-400 text-sm">Total Balance</h2>
            <p className="text-2xl font-bold text-green-300">₹{analytics.totalBalance || 0}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl shadow p-6 transition-transform transform hover:scale-105 flex items-center space-x-4">
          <FaChartLine className="text-purple-400 text-3xl" />
          <div>
            <h2 className="text-gray-400 text-sm">Revenue (Bank Txns)</h2>
            <p className="text-2xl font-bold text-purple-300">₹{analytics.totalRevenue || 0}</p>
          </div>
        </div>
      </div>

      {/* Users */}
      <section className="bg-gray-800 p-6 rounded-2xl shadow mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-white">👤 Users</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-700 text-gray-300 uppercase tracking-wider text-xs">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Balance</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-t border-gray-700 hover:bg-gray-700/40 transition">
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4 text-gray-300">{user.email}</td>
                  <td className="py-2 px-4 text-green-400 font-semibold">₹{user.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Transactions */}
      <section className="bg-gray-800 p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4 text-white">💳 Recent Transactions</h2>
        <div className="max-h-72 overflow-auto pr-2 custom-scrollbar">
          <ul className="space-y-4">
            {transactions.map((tx, i) => (
              <li
                key={i}
                className={`border-l-4 p-4 rounded-md bg-gray-700/40 transition ${
                  tx.amount > 10000 ? 'border-red-500' : 'border-blue-500'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm text-white">
                    {tx.type}: ₹{tx.amount}
                    {tx.amount > 10000 && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">High</span>
                    )}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(tx.date).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-300">{tx.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Admin;

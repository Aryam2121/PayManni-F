import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
      <h1 className="text-4xl font-extrabold mb-8 text-center text-white">🧾 Admin Dashboard</h1>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-800 rounded-2xl shadow p-6 hover:scale-[1.02] transition">
          <h2 className="text-gray-400 text-lg">Total Users</h2>
          <p className="text-3xl font-bold text-blue-400">{analytics.totalUsers || 0}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl shadow p-6 hover:scale-[1.02] transition">
          <h2 className="text-gray-400 text-lg">Total Balance</h2>
          <p className="text-3xl font-bold text-green-400">₹{analytics.totalBalance || 0}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl shadow p-6 hover:scale-[1.02] transition">
          <h2 className="text-gray-400 text-lg">Revenue (Bank Txns)</h2>
          <p className="text-3xl font-bold text-purple-400">₹{analytics.totalRevenue || 0}</p>
        </div>
      </div>

      {/* Users */}
      <section className="bg-gray-800 p-6 rounded-2xl shadow mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-white">👤 Users</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-700 text-gray-300 uppercase">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Balance</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-t border-gray-700 hover:bg-gray-700/50">
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4 text-green-400 font-medium">₹{user.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Transactions */}
      <section className="bg-gray-800 p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4 text-white">💳 Recent Transactions</h2>
        <div className="max-h-72 overflow-auto custom-scrollbar pr-2">
          <ul className="space-y-4">
            {transactions.map((tx, i) => (
              <li
                key={i}
                className={`border-l-4 p-4 rounded-md shadow-sm bg-gray-700/50 ${
                  tx.amount > 10000 ? 'border-red-500' : 'border-blue-500'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm">
                    {tx.type}: ₹{tx.amount}
                    {tx.amount > 10000 && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">High</span>
                    )}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(tx.date).toLocaleString()}
                  </span>
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

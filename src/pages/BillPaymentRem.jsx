import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BillPaymentReminder = () => {
  const [bills, setBills] = useState(() => JSON.parse(localStorage.getItem('bills')) || []);
  const [reminders, setReminders] = useState([]);
  const [newBill, setNewBill] = useState({ name: '', amount: '', dueDate: '' });
  const [darkMode, setDarkMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  
  useEffect(() => {
    localStorage.setItem('bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkForReminders();
    }, 60000);
    return () => clearInterval(interval);
  }, [bills]);

  const checkForReminders = () => {
    const today = new Date().toISOString().split('T')[0];
    const dueBills = bills.filter(bill => bill.dueDate === today);
    setReminders(dueBills);
  };

  const addBill = () => {
    if (!newBill.name || !newBill.amount || !newBill.dueDate) return;
    if (editIndex !== null) {
      const updatedBills = [...bills];
      updatedBills[editIndex] = newBill;
      setBills(updatedBills);
      setEditIndex(null);
    } else {
      setBills([...bills, newBill]);
    }
    setNewBill({ name: '', amount: '', dueDate: '' });
  };

  const removeBill = (index) => {
    setBills(bills.filter((_, i) => i !== index));
  };

  const editBill = (index) => {
    setNewBill(bills[index]);
    setEditIndex(index);
  };

  return (
    <div className={` p-6 rounded-lg shadow-xl transition-all ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <motion.div className="flex justify-between mb-4">
        <h2 className="text-3xl font-semibold">Smart Bill Reminders</h2>
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
          {darkMode ? '🌞 Light' : '🌙 Dark'}
        </button>
      </motion.div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Upcoming Bills</h3>
        {bills.length === 0 ? <p>No bills added.</p> : (
          <ul className="space-y-2">
            {bills.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).map((bill, index) => (
              <motion.li key={index} className={`p-3 rounded-lg shadow flex justify-between items-center ${
                new Date(bill.dueDate) < new Date() ? 'bg-red-200 text-red-800' : 'bg-indigo-100'
              }`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <span>{bill.name} - ${bill.amount} - Due: {bill.dueDate}</span>
                <div className="flex gap-2">
                  <button onClick={() => editBill(index)} className="text-blue-500 font-bold">✏️</button>
                  <button onClick={() => removeBill(index)} className="text-red-500 font-bold">❌</button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-bold">{editIndex !== null ? 'Edit Bill' : 'Add New Bill'}</h3>
        <div className="flex flex-col space-y-3">
          <input type="text" placeholder="Bill Name" value={newBill.name} onChange={(e) => setNewBill({...newBill, name: e.target.value})} className="p-3 rounded-lg border text-black" />
          <input type="number" placeholder="Amount ($)" value={newBill.amount} onChange={(e) => setNewBill({...newBill, amount: e.target.value})} className="p-3 rounded-lg border text-black" />
          <input type="date" value={newBill.dueDate} onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})} className="p-3 rounded-lg border text-black" />
          <motion.button onClick={addBill} className="w-full py-3 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none shadow-lg"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{editIndex !== null ? '✏️ Update Bill' : '➕ Add Bill'}</motion.button>
        </div>
      </div>

      {reminders.length > 0 && (
        <motion.div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="text-lg font-bold">⏰ Reminder!</h3>
          <ul>
            {reminders.map((bill, index) => (
              <li key={index} className="font-medium">⚡ Pay your {bill.name} bill of ${bill.amount} today!</li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default BillPaymentReminder;
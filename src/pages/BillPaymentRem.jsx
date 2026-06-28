import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BillPaymentReminder = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bills, setBills] = useState(() => JSON.parse(localStorage.getItem("bills")) || []);
  const [reminders, setReminders] = useState([]);
  const [newBill, setNewBill] = useState({ name: "", amount: "", dueDate: "" });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login-user");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    localStorage.setItem("bills", JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkForReminders();
    }, 60000);
    return () => clearInterval(interval);
  }, [bills]);

  const checkForReminders = () => {
    const today = new Date().toISOString().split("T")[0];
    const dueBills = bills.filter((bill) => bill.dueDate === today);
    setReminders(dueBills);
  };

  const addBill = () => {
    if (!newBill.name || !newBill.amount || !newBill.dueDate) {
      toast.error("Please fill all fields");
      return;
    }
    if (editIndex !== null) {
      const updatedBills = [...bills];
      updatedBills[editIndex] = newBill;
      setBills(updatedBills);
      setEditIndex(null);
      toast.success("Bill updated successfully!");
    } else {
      setBills([...bills, newBill]);
      toast.success("Bill added successfully!");
    }
    setNewBill({ name: "", amount: "", dueDate: "" });
  };

  const removeBill = (index) => {
    setBills(bills.filter((_, i) => i !== index));
    toast.success("Bill removed successfully!");
  };

  const editBill = (index) => {
    setNewBill(bills[index]);
    setEditIndex(index);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-900 dark:text-white text-lg">Loading bill reminders...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white duration-300">
      <motion.div
        className="w-full max-w-4xl p-8 rounded-lg shadow-lg bg-gray-50 dark:bg-gray-800 transition-colors duration-300"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">📅 Smart Bill Reminders</h2>
        </div>

        {/* Bills List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Upcoming Bills</h3>
          {bills.length === 0 ? (
            <p className="text-gray-400">No bills added.</p>
          ) : (
            <ul className="space-y-3">
              {bills
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .map((bill, index) => (
                  <motion.li
                    key={index}
                    className={`p-4 flex justify-between items-center rounded-lg shadow-lg transition-all ${
                      new Date(bill.dueDate) < new Date() ? "bg-red-600 text-white" : "bg-indigo-600"
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className="font-medium">{bill.name} - 💲{bill.amount} - Due: {bill.dueDate}</span>
                    <div className="flex gap-3">
                      <button onClick={() => editBill(index)} className="text-blue-300 font-bold hover:scale-110">✏️</button>
                      <button onClick={() => removeBill(index)} className="text-red-300 font-bold hover:scale-110">❌</button>
                    </div>
                  </motion.li>
                ))}
            </ul>
          )}
        </div>

        {/* Add New Bill Form */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold">{editIndex !== null ? "✏️ Edit Bill" : "➕ Add New Bill"}</h3>
          <div className="flex flex-col space-y-3 mt-3">
            <input
              type="text"
              placeholder="Bill Name"
              value={newBill.name}
              onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
              className="p-3 rounded-lg border bg-gray-700 text-white focus:outline-none"
            />
            <input
              type="number"
              placeholder="Amount (₹)"
              value={newBill.amount}
              onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
              className="p-3 rounded-lg border bg-gray-700 text-white focus:outline-none"
            />
            <input
              type="date"
              value={newBill.dueDate}
              onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
              className="p-3 rounded-lg border bg-gray-700 text-white focus:outline-none"
            />
            <motion.button
              onClick={addBill}
              className="w-full py-3 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {editIndex !== null ? "✏️ Update Bill" : "➕ Add Bill"}
            </motion.button>
          </div>
        </div>

        {/* Reminder Notifications */}
        {reminders.length > 0 && (
          <motion.div className="mt-6 p-4 bg-red-700 text-white rounded-lg shadow-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-lg font-bold">⏰ Reminder!</h3>
            <ul>
              {reminders.map((bill, index) => (
                <li key={index} className="font-medium">
                  ⚡ Pay your {bill.name} bill of 💲{bill.amount} today!
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>

      {/* Floating Add Button */}
      <motion.button
        onClick={() => setNewBill({ name: "", amount: "", dueDate: "" })}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none text-2xl"
        whileHover={{ scale: 1.1 }}
      >
        ➕
      </motion.button>
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

export default BillPaymentReminder;

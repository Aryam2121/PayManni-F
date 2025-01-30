import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LoanApplication = () => {
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [interestRate, setInterestRate] = useState(5);
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [approvalChance, setApprovalChance] = useState('Calculating...');
  const [progress, setProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (amount >= 100 && amount <= 500) {
      setInterestRate(5);
    } else if (amount > 500 && amount <= 1000) {
      setInterestRate(7);
    }
  }, [amount]);

  useEffect(() => {
    if (amount && term) {
      const principal = parseFloat(amount);
      const months = parseInt(term);
      const rate = interestRate / 100 / 12;
      const emi = (principal * rate) / (1 - Math.pow(1 + rate, -months));
      setMonthlyEMI(emi.toFixed(2));
      
      const approvalRate = Math.min(95, Math.max(30, 100 - principal / 10));
      setApprovalChance(`${approvalRate}% chance of approval`);
    }
  }, [amount, term, interestRate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    setProgress(0);

    if (parseFloat(amount) < 100 || parseFloat(amount) > 1000) {
      setStatus('❌ Loan amount must be between $100 and $1000.');
      setLoading(false);
      return;
    }
    if (parseInt(term) < 3 || parseInt(term) > 24) {
      setStatus('❌ Loan term must be between 3 and 24 months.');
      setLoading(false);
      return;
    }

    let progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 10));
    }, 300);

    setTimeout(() => {
      clearInterval(progressInterval);
      setLoading(false);
      setStatus('✅ Loan Approved! Amount: $' + amount + ', Term: ' + term + ' months.');
    }, 3000);
  };

  return (
    <div className={` p-6 rounded-lg shadow-xl transition-all ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <motion.div className="flex justify-between mb-4">
        <h2 className="text-3xl font-semibold">Apply for Instant Loan</h2>
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 transition-all">
          {darkMode ? '🌞 Light' : '🌙 Dark'}
        </button>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label className="text-lg font-medium">Loan Amount ($):</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className=" text-black p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all" required min="100" max="1000" />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium">Loan Term (Months):</label>
          <input type="number" value={term} onChange={(e) => setTerm(e.target.value)} className=" text-black p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all" required min="3" max="24" />
        </div>

        <motion.div className="bg-indigo-100 p-4 rounded-lg text-indigo-700 shadow-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="font-medium">💰 Interest Rate: <span className="font-bold">{interestRate}%</span></p>
          <p className="font-medium">📅 Monthly EMI: <span className="font-bold">${monthlyEMI}</span></p>
          <p className="font-medium">📊 Approval Chance: <span className="font-bold">{approvalChance}</span></p>
        </motion.div>

        {loading && <motion.div className="w-full bg-gray-300 rounded-full h-2 mt-2 overflow-hidden">
          <motion.div className="h-2 bg-green-500 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 3 }}/>
        </motion.div>}

        <motion.button type="submit" className="w-full py-3 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none shadow-lg flex items-center justify-center transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {loading ? 'Processing...' : 'Apply for Loan'}
        </motion.button>
      </form>

      <motion.p className={`mt-4 text-center text-lg font-medium transition-all ${status.includes('Approved') ? 'text-green-500' : 'text-red-500'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {status}
      </motion.p>
    </div>
  );
};

export default LoanApplication;

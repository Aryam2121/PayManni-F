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
  const [loans, setLoans] = useState([]);  // State to hold all loans
  const [loanId, setLoanId] = useState(''); // State for loan ID input

  // Fetch all loans on component mount
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await fetch(`https://${import.meta.env.VITE_BACKEND}api/loans`);
        const data = await response.json();
        setLoans(data);
      } catch (error) {
        console.error('Error fetching loans:', error);
      }
    };
    fetchLoans();
  }, []);

  // Fetch loan by ID when loanId changes
  useEffect(() => {
    const fetchLoanById = async () => {
      if (loanId) {
        try {
          const response = await fetch(`https://${import.meta.env.VITE_BACKEND}/api/loans/${loanId}`);
          const data = await response.json();
          if (response.status === 200) {
            setAmount(data.amount);
            setTerm(data.term);
            setInterestRate(data.interestRate);
            setMonthlyEMI(data.monthlyEMI);
            setApprovalChance(data.approvalChance);
            setStatus(data.status);
          } else {
            setStatus('❌ Loan not found');
          }
        } catch (error) {
          setStatus('❌ Something went wrong!');
        }
      }
    };
    fetchLoanById();
  }, [loanId]);

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

    // Input validation
    if (parseFloat(amount) < 100 || parseFloat(amount) > 70000000) {
      setStatus('❌ Loan amount must be between $100 and $70000000.');
      setLoading(false);
      return;
    }
    if (parseInt(term) < 1 || parseInt(term) > 24) {
      setStatus('❌ Loan term must be between 1 and 24 months.');
      setLoading(false);
      return;
    }

    let progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 10));
    }, 300);

    try {
      const response = await fetch(`https://${import.meta.env.VITE_BACKEND}/api/loans/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, term }),
      });

      const data = await response.json();
      clearInterval(progressInterval);
      setLoading(false);

      if (response.status === 200) {
        setStatus(data.status);
        setMonthlyEMI(data.monthlyEMI);
        setApprovalChance(data.approvalChance);
      } else {
        setStatus(data.status || '❌ Something went wrong!');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setLoading(false);
      setStatus('❌ Something went wrong! Please try again.');
    }
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-xl transition-all ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
      aria-live="polite"
    >
      <motion.div className="flex justify-between mb-4">
        <h2 className="text-3xl font-semibold">Apply for Instant Loan</h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 transition-all"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '🌞 Light' : '🌙 Dark'}
        </button>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6" aria-describedby="status">
        <div className="flex flex-col">
          <label className="text-lg font-medium" htmlFor="amount">
            Loan Amount ($):
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-black p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
            required
            min="100"
            max="70000000"
            aria-label="Enter loan amount"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-medium" htmlFor="term">
            Loan Term (Months):
          </label>
          <input
            id="term"
            type="number"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="text-black p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
            required
            min="3"
            max="24"
            aria-label="Enter loan term"
          />
        </div>

        <motion.div
          className="bg-indigo-100 p-4 rounded-lg text-indigo-700 shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="font-medium">💰 Interest Rate: <span className="font-bold">{interestRate}%</span></p>
          <p className="font-medium">📅 Monthly EMI: <span className="font-bold">${monthlyEMI}</span></p>
          <p className="font-medium">📊 Approval Chance: <span className="font-bold">{approvalChance}</span></p>
        </motion.div>

        {loading && (
          <motion.div className="w-full bg-gray-300 rounded-full h-2 mt-2 overflow-hidden">
            <motion.div className="h-2 bg-green-500 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 3 }} />
          </motion.div>
        )}

        <motion.button
          type="submit"
          className="w-full py-3 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none shadow-lg flex items-center justify-center transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          aria-label="Submit loan application"
        >
          {loading ? 'Processing...' : 'Apply for Loan'}
        </motion.button>
      </form>

      <motion.p
        id="status"
        className={`mt-4 text-center text-lg font-medium transition-all ${status.includes('Approved') ? 'text-green-500' : 'text-red-500'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        role="alert"
      >
        {status}
      </motion.p>

      {/* Loan ID input to fetch specific loan */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Enter Loan ID"
          value={loanId}
          onChange={(e) => setLoanId(e.target.value)}
          className="p-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
        />
        <button
          onClick={() => setLoanId(loanId)}
          className="mt-2 p-3 bg-indigo-600 text-white rounded-lg w-full"
        >
          Fetch Loan By ID
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-2xl font-semibold">All Loan Applications</h3>
        <ul>
          {loans.map((loan) => (
            <li key={loan._id} className="bg-indigo-100 p-4 mt-2 rounded-lg shadow-md">
              <p>Loan Amount: ${loan.amount}</p>
              <p>Term: {loan.term} months</p>
              <p>Status: {loan.status}</p>
              <p>Approval Chance: {loan.approvalChance}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LoanApplication;

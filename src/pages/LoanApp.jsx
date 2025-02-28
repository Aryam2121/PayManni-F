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
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await fetch(`https://${import.meta.env.VITE_BACKEND}/api/loans`);
      const text = await response.text();  // Get raw response text
      console.log("Raw Response:", text);  // Log it to see what's being returned
      const data = JSON.parse(text);  // Try parsing as JSON
      setLoans(data.loans || []);
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
  };
  

  const fetchLoanById = async () => {
    if (!loanId) return;
    try {
      const response = await fetch(`https://${import.meta.env.VITE_BACKEND}/api/loans/${loanId}`);
      const data = await response.json();
      if (response.status === 200) {
        setSelectedLoan(data.loan);
        setAmount(data.loan.amount);
        setTerm(data.loan.term);
        setInterestRate(data.loan.interestRate);
        setMonthlyEMI(data.loan.monthlyEMI);
        setApprovalChance(data.loan.approvalChance);
        setStatus(data.loan.status);
      } else {
        setStatus("❌ Loan not found");
      }
    } catch (error) {
      setStatus("❌ Something went wrong!");
    }
  };

  useEffect(() => {
    fetchLoanById();
  }, [loanId]);

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

  const handleApplyLoan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    if (parseFloat(amount) < 100 || parseFloat(amount) > 700000000) {
      setStatus("❌ Loan amount must be between $100 and $700000000.");
      setLoading(false);
      return;
    }
    if (parseInt(term) < 3 || parseInt(term) > 24) {
      setStatus("❌ Loan term must be between 3 and 24 months.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://${import.meta.env.VITE_BACKEND}/api/loans/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, term }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        setStatus(data.loan.status);
        fetchLoans();
      } else {
        setStatus(data.message || "❌ Something went wrong!");
      }
    } catch (error) {
      setLoading(false);
      setStatus("❌ Something went wrong! Please try again.");
    }
  };

  const handleRepayEMI = async (loanId) => {
    setLoading(true);
    try {
      const response = await fetch(`https://${import.meta.env.VITE_BACKEND}/api/loans/payment/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loanId }),
      });

      const data = await response.json();
      if (data.success) {
        const options = {
          key: "rzp_test_7K36B5aZcZTopD",
          amount: data.order.amount,
          currency: "INR",
          name: "PayManni Loan Repayment",
          description: "EMI Payment",
          order_id: data.order.id,
          handler: async function (response) {
            const verifyResponse = await fetch(`https://${import.meta.env.VITE_BACKEND}/api/loans/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                loanId,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              setStatus("✅ EMI Paid Successfully!");
              fetchLoans();
            } else {
              setStatus("❌ Payment Verification Failed!");
            }
          },
          theme: { color: "#007bff" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setStatus("❌ Could not initiate payment!");
      }
    } catch (error) {
      setStatus("❌ Error processing payment!");
    }
    setLoading(false);
  };
  return (
    <div className="p-6 rounded-lg shadow-2xl bg-gray-900 text-white transition-all" aria-live="polite">
      <motion.div className="flex justify-between mb-4 items-center">
        <h2 className="text-3xl font-semibold">Apply for Instant Loan</h2>
        <input
          type="text"
          placeholder="Search by Loan ID"
          value={loanId}
          onChange={(e) => fetchLoanById(e.target.value)}
          className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500 shadow-md transition-all"
          aria-label="Search loan by ID"
        />
      </motion.div>
  
      <form onSubmit={handleApplyLoan} className="space-y-6" aria-describedby="status">
        <div className="flex flex-col">
          <label className="text-lg font-medium" htmlFor="amount">Loan Amount ($):</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-black p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-500 shadow-md transition-all"
            required
            min="100"
            max="700000000"
            aria-label="Enter loan amount"
          />
        </div>
  
        <div className="flex flex-col">
          <label className="text-lg font-medium" htmlFor="term">Loan Term (Months):</label>
          <input
            id="term"
            type="number"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="text-black p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-indigo-500 shadow-md transition-all"
            required
            min="3"
            max="24"
            aria-label="Enter loan term"
          />
        </div>
  
        <motion.div className="bg-indigo-700 p-4 rounded-lg text-white shadow-lg transition-all" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="font-medium">💰 Interest Rate: <span className="font-bold">{interestRate}%</span></p>
          <p className="font-medium">📅 Monthly EMI: <span className="font-bold">${monthlyEMI}</span></p>
          <p className="font-medium">📊 Approval Chance: <span className="font-bold">{approvalChance}</span></p>
        </motion.div>
  
        <motion.button
          type="submit"
          className="w-full py-3 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none shadow-lg ring-2 ring-indigo-500/50 flex items-center justify-center transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          aria-label="Submit loan application"
        >
          {loading ? 'Processing...' : 'Apply for Loan'}
        </motion.button>
      </form>
  
      <h3 className="text-2xl font-semibold mt-6">All Loan Applications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loans.map((loan) => (
          <motion.div key={loan._id} className="p-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700 transition-all hover:shadow-2xl" whileHover={{ scale: 1.05 }}>
            <h3 className="text-lg font-semibold">Loan ID: {loan._id}</h3>
            <p>Amount: <span className="font-bold">${loan.amount}</span></p>
            <p>Term: <span className="font-bold">{loan.term} months</span></p>
            <p>Status: <span className="font-bold">{loan.status}</span></p>
            <button 
              onClick={() => handleRepayEMI(loan._id, loan.amount)} 
              className="mt-2 p-2 bg-green-600 text-white rounded-lg w-full hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Repay EMI'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
  
};

export default LoanApplication;
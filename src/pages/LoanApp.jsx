import { apiUrl, getAuthHeaders, getUserId } from "../utils/authStorage";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BottomNav from "../Components/layout/BottomNav";

const LoanApplication = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [interestRate, setInterestRate] = useState(5);
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [approvalChance, setApprovalChance] = useState('Calculating...');
  const [loans, setLoans] = useState([]);
  const [loanId, setLoanId] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [userUpi, setUserUpi] = useState('');
  const userId = getUserId();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const authHeaders = () => ({ "Content-Type": "application/json", ...getAuthHeaders() });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(apiUrl(`/api/myaccount/${userId}`), { 
        headers: authHeaders(), 
        credentials: "include" 
      });
      const data = await res.json();
      setUserUpi(data.upiId || "aryamangupta@paymanni");
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchLoans();
    }
  }, [userId]);

  const fetchLoans = async () => {
    try {
      const res = await fetch(apiUrl(`/api/getAllloans`), {
        headers: authHeaders(),
        credentials: 'include'
      });
      if (!res.ok) throw new Error("Failed to fetch loans");
      const data = await res.json();
      setLoans(data.loans || []);
    } catch (err) {
      console.error("Error fetching loans:", err);
    }
  };

  const fetchLoanById = async () => {
    if (!loanId) return;
    try {
      const res = await fetch(apiUrl(`/api/loans/${loanId}`), {
        headers: authHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.status === 200) {
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
    } catch {
      setStatus("❌ Something went wrong!");
    }
  };

  useEffect(() => {
    fetchLoanById();
  }, [loanId]);

  useEffect(() => {
    if (amount && term) {
      const p = parseFloat(amount);
      const n = parseInt(term);
      const r = interestRate / 100 / 12;
      const emi = (p * r) / (1 - Math.pow(1 + r, -n));
      setMonthlyEMI(emi.toFixed(2));
      const approvalRate = Math.min(95, Math.max(30, 100 - p / 10));
      setApprovalChance(`${approvalRate}% chance of approval`);
    }
  }, [amount, term, interestRate]);

  const handleApplyLoan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
  
    const parsedAmount = parseFloat(amount);
    const parsedTerm = parseInt(term);
  
    if (parsedAmount < 100 || parsedAmount > 700000000) {
      setStatus("❌ Loan amount must be between ₹100 and ₹700,000,000.");
      setLoading(false);
      return;
    }
  
    if (parsedTerm < 3 || parsedTerm > 24) {
      setStatus("❌ Loan term must be between 3 and 24 months.");
      setLoading(false);
      return;
    }
  
    const interestRate = 12;
    const monthlyInterestRate = interestRate / 12 / 100;
    const monthlyEMI = (
      (parsedAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, parsedTerm)) /
      (Math.pow(1 + monthlyInterestRate, parsedTerm) - 1)
    ).toFixed(2);
  
    const approvalChance = parsedAmount < 100000 ? "High" : parsedAmount < 500000 ? "Medium" : "Low";
  
    try {
      const res = await fetch(apiUrl(`/api/loans/apply`), {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify({
          amount: parsedAmount,
          term: parsedTerm,
          interestRate,
          monthlyEMI,
          approvalChance
        })
      });
  
      const data = await res.json();
      setLoading(false);
  
      if (data.success) {
        setStatus("✅ Loan applied successfully!");
        toast.success("Loan applied successfully!");
        fetchLoans(); 
        setAmount('');
        setTerm('');
      } else {
        setStatus(data.message || "❌ Something went wrong!");
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      setLoading(false);
      setStatus("❌ Something went wrong! Please try again.");
      toast.error("Something went wrong! Please try again.");
    }
  };
  const handleRepayEMI = async (loanId, amount, userUpi) => {
    setLoading(true);
  
    // ✅ Step 1: Sanity check
    if (!amount || !userUpi) {
      console.error("Missing amount or userUpi", { amount, userUpi });
      setStatus("❌ Amount or UPI ID is missing!");
      setLoading(false);
      return;
    }
  
    try {
      // ✅ Step 2: Create Razorpay order
      const res = await fetch(apiUrl(`/api/loans/payment/order`), {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify({ loanId, amount }),
      });
  
      const data = await res.json();
      if (!data.success) throw new Error("Payment order failed");
  
      // ✅ Step 3: Log Razorpay Key
      console.log("Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY_ID);
  
      // ✅ Step 4: Setup Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "PayManni Loan Repayment",
        description: "EMI Payment",
        order_id: data.order.id,
        handler: async (response) => {
          // ✅ Step 5: Verify Payment
          const verifyRes = await fetch(apiUrl(`/api/loans/payment/verify`), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
  
          const verifyData = await verifyRes.json();
  
          if (verifyData.success) {
            // ✅ Step 6: Repay EMI
            console.log("Sending repay request with:", {
              loanId,
              amount,
              paymentId: response.razorpay_payment_id,
              userUpi,
            });
  
            const repayRes = await fetch(apiUrl(`/api/${loanId}/repay`), {
              method: "POST",
              headers: authHeaders(),
              credentials: "include",
              body: JSON.stringify({
                loanId,
                amount,
                paymentId: response.razorpay_payment_id,
                userUpi,
              }),
            });
  
            const repayData = await repayRes.json();
            if (repayData.success) {
              fetchLoans();
              setStatus("✅ EMI Payment Successful!");
            } else {
              setStatus("❌ EMI Repayment Failed!");
            }
          } else {
            setStatus("❌ Payment verification failed!");
          }
          setLoading(false);
        },
        theme: { color: "#6366F1" },
      };
  
      // ✅ Step 7: Open Razorpay modal
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      setStatus("❌ Error during payment");
      setLoading(false);
    }
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
          <p className="text-gray-900 dark:text-white text-lg">Loading loan application...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 shadow-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-300" aria-live="polite">
      <motion.div className="flex justify-between mb-4 items-center">
        <h2 className="text-3xl font-semibold">Apply for Instant Loan</h2>
        <input
          type="text"
          placeholder="Search by Loan ID"
          value={loanId}
          onChange={(e) => setLoanId(e.target.value)}
          className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500 shadow-md transition-all"
          aria-label="Search loan by ID"
        />
      </motion.div>
  
      <form onSubmit={handleApplyLoan} className="space-y-6" aria-describedby="status">
        <div className="flex flex-col">
          <label className="text-lg font-medium" htmlFor="amount">Loan Amount (₹):</label>
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
          <p className="font-medium">📅 Monthly EMI: <span className="font-bold">₹{monthlyEMI}</span></p>
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
            <p>Amount: <span className="font-bold">₹{loan.amount}</span></p>
            <p>Term: <span className="font-bold">{loan.term} months</span></p>
            <p>Status: <span className="font-bold">{loan.status}</span></p>
            <button 
              onClick={() => handleRepayEMI(loan._id, loan.monthlyEMI || loan.amount, userUpi)} 
              className="mt-2 p-2 bg-green-600 text-white rounded-lg w-full hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Repay EMI'}
            </button>
          </motion.div>
        ))}
      </div>
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
      <BottomNav />
    </div>
  );
  
};

export default LoanApplication;
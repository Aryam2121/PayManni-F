import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import { getUserUpi, getUserName, getUserId, getAuthHeaders, apiUrl } from "../utils/authStorage";
import PageShell from "../Components/layout/PageShell";

const QUICK_AMOUNTS = [99, 149, 199, 299, 499, 799];

const Recharge = () => {
  const [amount, setAmount] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [rating, setRating] = useState(0);
  const { user } = useAuth();
  const userId = getUserId() || user?._id;

  useEffect(() => {
    if (!userId) return;
    axios
      .get(apiUrl(`/api/recharges/${userId}`), { headers: getAuthHeaders() })
      .then((res) => setTransactionHistory(res.data || []))
      .catch(() => {});
  }, [userId]);

  const handleRecharge = async () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setIsProcessing(true);
    let finalAmount = num;
    if (promoCode.toLowerCase() === "discount10") {
      finalAmount = num * 0.9;
      toast.info("10% promo applied!");
    }

    try {
      const response = await axios.post(
        apiUrl("/api/recharge"),
        { userId, amount: finalAmount, paymentMethod, promoCode },
        { headers: getAuthHeaders() }
      );

      setIsSuccess(true);
      toast.success("Recharge successful!");
      if (response.data.transaction) {
        setTransactionHistory((prev) => [response.data.transaction, ...prev]);
      }
      setAmount("");
      setPromoCode("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Recharge failed. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const submitRating = () => {
    if (rating > 0) toast.success(`Thanks for rating us ${rating}★!`);
  };

  return (
    <PageShell title="Mobile Recharge" subtitle="Top up instantly — try promo DISCOUNT10">
      <ToastContainer position="top-center" />
      <div className="page-card space-y-5">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Quick amounts</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAmount(String(a))}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  amount === String(a) ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"
                }`}
              >
                ₹{a}
              </button>
            ))}
          </div>
        </div>

        <input
          type="number"
          className="input-modern w-full"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="text"
          className="input-modern w-full"
          placeholder="Promo code (try DISCOUNT10)"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />

        <select className="input-modern w-full" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="wallet">Wallet</option>
          <option value="UPI">UPI</option>
          <option value="Debit/Credit">Debit/Credit Card</option>
        </select>

        {paymentMethod === "UPI" && amount && (
          <div className="text-center p-4 bg-secondary/50 rounded-xl">
            <p className="text-sm font-medium mb-2">Scan to pay</p>
            <QRCode
              className="mx-auto p-2 bg-white rounded-lg"
              value={`upi://pay?pa=${getUserUpi() || "paymanni@paytm"}&pn=${encodeURIComponent(getUserName())}&cu=INR&am=${amount}`}
              size={160}
            />
          </div>
        )}

        <motion.button
          type="button"
          className="btn-primary w-full"
          onClick={handleRecharge}
          disabled={isProcessing}
          whileTap={{ scale: 0.98 }}
        >
          {isProcessing ? "Processing…" : `Recharge ₹${amount || "0"}`}
        </motion.button>

        {isSuccess && (
          <p className="text-center text-green-600 dark:text-green-400 text-sm font-medium">
            Recharge completed successfully!
          </p>
        )}

        <div className="pt-4 border-t border-border">
          <p className="text-sm font-medium mb-2">Rate your experience</p>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => { setRating(r); submitRating(); }}
                className={`w-10 h-10 rounded-lg font-bold ${rating >= r ? "bg-amber-500 text-white" : "bg-secondary"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {transactionHistory.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h3 className="font-semibold mb-3">Recent recharges</h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {transactionHistory.slice(0, 8).map((tx, i) => (
                <li key={tx._id || i} className="flex justify-between text-sm p-2 rounded-lg bg-secondary/40">
                  <span>₹{tx.amount}</span>
                  <span className="text-muted-foreground">
                    {tx.date ? new Date(tx.date).toLocaleDateString("en-IN") : "—"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default Recharge;

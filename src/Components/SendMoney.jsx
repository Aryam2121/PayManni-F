import React, { useState } from "react";
import axios from "axios";
import { ArrowRightLeft } from "lucide-react";

const SendMoney = () => {
  const [fromUpi, setFromUpi] = useState("");
  const [toUpi, setToUpi] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/send`, {
        fromUpi,
        toUpi,
        amount: Number(amount),
      });
      setResult(res.data.msg);
    } catch (err) {
      setResult(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-lg border border-gray-200 shadow-xl rounded-2xl p-6 w-full max-w-md mx-auto hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-2 mb-5">
        <ArrowRightLeft className="text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">Send UPI Money</h2>
      </div>

      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">From UPI ID</label>
          <input
            type="text"
            placeholder="e.g. Aryaman@paymanni"
            value={fromUpi}
            onChange={(e) => setFromUpi(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">To UPI ID</label>
          <input
            type="text"
            placeholder="e.g. Aryaman21@paymanni"
            value={toUpi}
            onChange={(e) => setToUpi(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition duration-300"
        >
          Send Now
        </button>

        {result && (
          <div className="mt-4 text-sm font-medium text-green-700 bg-green-100 p-2 rounded-lg">
            {result}
          </div>
        )}
      </form>
    </div>
  );
};

export default SendMoney;

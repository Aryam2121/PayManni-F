import React, { useState } from "react";
import axios from "axios";
import { DownloadCloud } from "lucide-react";

const ReceiveMoney = () => {
  const [toUpi, setToUpi] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState("");

  const handleReceive = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/receive`, {
        toUpi,
        amount: Number(amount),
      });
      setResult(res.data.msg);
    } catch (err) {
      setResult(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className=" bg-gray-900 backdrop-blur-lg border border-gray-200 shadow-xl  p-6 w-full  hover:shadow-2xl transition-all duration-300 min-h-screen">
      <div className="flex items-center gap-2 mb-5">
        <DownloadCloud className="text-yellow-600" />
        <h2 className="text-2xl font-bold text-white">Receive / Top-up</h2>
      </div>

      <form onSubmit={handleReceive} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white pb-3">To UPI ID</label>
          <input
            type="text"
            
            placeholder="e.g. Aryaman@paymanni"
            value={toUpi}
            onChange={(e) => setToUpi(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 focus:outline-none bg-gray-800 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white pb-3">Amount (₹)</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-yellow-500 focus:outline-none bg-gray-800 text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded-lg transition duration-300"
        >
          Receive Money
        </button>

        {result && (
          <div className="mt-4 text-sm font-medium text-yellow-800 bg-yellow-100 p-2 rounded-lg">
            {result}
          </div>
        )}
      </form>
    </div>
  );
};

export default ReceiveMoney;

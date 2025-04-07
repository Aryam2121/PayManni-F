import React, { useState } from "react";
import axios from "axios";
import { BadgePlus } from "lucide-react"; // Lucide icons

const GenerateUpi = () => {
  const [username, setusername] = useState("");
  const [upiUsername, setUpiUsername] = useState("");
  const [result, setResult] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/generate-upi`, {
        username,
        upiUsername,
      });
      setResult(res.data.upiId);
    } catch (err) {
      setResult(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition duration-300 ease-in-out">
      <div className="flex items-center gap-2 mb-4">
        <BadgePlus className="text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-800">Generate UPI ID</h2>
      </div>

      <form onSubmit={handleGenerate} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            placeholder="Enter Username"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">UPI Username</label>
          <input
            type="text"
            value={upiUsername}
            onChange={(e) => setUpiUsername(e.target.value)}
            placeholder="e.g., AryamanGupta"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-300"
        >
          Create UPI ID
        </button>

        {result && (
          <div className="mt-3 p-2 rounded-lg bg-green-100 text-green-700 font-medium text-sm">
            {typeof result === "string" ? `UPI ID: ${result}` : result}
          </div>
        )}
      </form>
    </div>
  );
};

export default GenerateUpi;

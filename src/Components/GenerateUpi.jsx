import React, { useState } from "react";
import axios from "axios";
import { BadgePlus, Loader2 } from "lucide-react";

const GenerateUpi = () => {
  const [username, setUsername] = useState("");
  const [upiUsername, setUpiUsername] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    try {
      const res = await axios.post(
        `https://${import.meta.env.VITE_BACKEND}/api/generate-upi`,
        { username, upiUsername }
      );
      setResult(res.data.upiId);
    } catch (err) {
      setResult(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 backdrop-blur-md p-8  shadow-xl border border-gray-200 dark:border-gray-900  transition-all min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <BadgePlus className="text-indigo-600 w-6 h-6" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Generate UPI ID
        </h2>
      </div>

      <form onSubmit={handleGenerate} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username"
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm text-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            UPI Username
          </label>
          <input
            type="text"
            value={upiUsername}
            onChange={(e) => setUpiUsername(e.target.value)}
            placeholder="e.g., AryamanGupta"
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm text-gray-800 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition duration-300 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Generating...
            </>
          ) : (
            "Create UPI ID"
          )}
        </button>

        {result && (
          <div className="mt-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium px-4 py-2 rounded-lg border border-green-300 dark:border-green-600 transition-all">
            {typeof result === "string" ? `UPI ID: ${result}` : result}
          </div>
        )}
      </form>
    </div>
  );
};

export default GenerateUpi;

import React, { useState } from "react";
import axios from "axios";
import { BadgePlus, Loader2, Copy } from "lucide-react";
import { toast } from "react-toastify";
import { apiUrl, getAuthHeaders, getUserUpi, getUserName } from "../utils/authStorage";
import PageShell from "./layout/PageShell";

const GenerateUpi = () => {
  const [username, setUsername] = useState(getUserName() || "");
  const [upiUsername, setUpiUsername] = useState("");
  const [result, setResult] = useState(getUserUpi() || "");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    try {
      const res = await axios.post(
        apiUrl("/api/generate-upi"),
        { username, upiUsername },
        { headers: getAuthHeaders() }
      );
      const upi = res.data.upiId || res.data.upi;
      setResult(upi);
      toast.success("UPI ID created!");
    } catch (err) {
      const msg = err.response?.data?.msg || "Could not generate UPI ID";
      setResult(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const copyUpi = () => {
    if (!result || result.includes("wrong")) return;
    navigator.clipboard.writeText(result);
    toast.success("Copied!");
  };

  return (
    <PageShell title="Generate UPI ID" subtitle="Create your unique PayManni UPI address">
      <div className="glass-dark rounded-2xl border border-gray-700/50 p-6 sm:p-8">
        {getUserUpi() && (
          <div className="mb-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
            <p className="text-xs text-gray-400 mb-1">Current UPI ID</p>
            <p className="font-mono text-indigo-300">{getUserUpi()}</p>
          </div>
        )}

        <form onSubmit={handleGenerate} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Display name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">UPI username</label>
            <input
              type="text"
              value={upiUsername}
              onChange={(e) => setUpiUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
              placeholder="e.g. AryamanGupta"
              className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Will become username@paymanni</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <BadgePlus className="w-5 h-5" />}
            {loading ? "Generating…" : "Create UPI ID"}
          </button>
        </form>

        {result && !result.includes("wrong") && !result.includes("Could") && (
          <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-green-500/10 border border-green-500/30">
            <div>
              <p className="text-xs text-green-400 mb-1">Your new UPI ID</p>
              <p className="font-mono font-semibold text-green-300">{result}</p>
            </div>
            <button type="button" onClick={copyUpi} className="p-2 rounded-lg hover:bg-green-500/20">
              <Copy className="w-5 h-5 text-green-400" />
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default GenerateUpi;

// MerchantDashboard.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart4, Banknote, Clock, Filter, CalendarDays, Download, Settings } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const cardData = [
  { title: "Total Sales", value: 120000, icon: Banknote, color: "from-green-500 to-emerald-700" },
  { title: "Transactions", value: 340, icon: BarChart4, color: "from-blue-500 to-indigo-600" },
  { title: "Pending Payments", value: 12000, icon: Clock, color: "from-yellow-500 to-amber-600" },
];

const sampleChartData = [
  { name: "Jan", value: 20000 },
  { name: "Feb", value: 30000 },
  { name: "Mar", value: 50000 },
  { name: "Apr", value: 40000 },
  { name: "May", value: 60000 },
];

const MerchantDashboard = () => {
  const [filter, setFilter] = useState("monthly");
  const [animatedValues, setAnimatedValues] = useState(cardData.map(() => 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedValues((prev) =>
        prev.map((val, idx) =>
          val < cardData[idx].value ? val + Math.ceil(cardData[idx].value / 25) : cardData[idx].value
        )
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const exportCSV = () => {
    const csvData = sampleChartData.map((d) => `${d.name},${d.value}`).join("\n");
    const blob = new Blob(["Month,Value\n" + csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "sales_data.csv");
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 px-4 py-6 md:px-8 lg:px-16 dark:bg-[#111827] min-h-screen"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Merchant Dashboard</h2>
        <div className="flex gap-2">
          {["monthly", "yearly", "custom"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm rounded-xl font-medium border transition-all duration-200 ${
                filter === f
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white/10 text-gray-300 border-gray-600 hover:bg-white/20"
              }`}
            >
              <Filter className="w-4 h-4" />
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-1.5 text-sm rounded-xl font-medium bg-green-600 text-white hover:bg-green-700 transition"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardData.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`cursor-pointer relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-2xl border border-white/10 backdrop-blur-lg`}
          >
            <div className="absolute top-3 right-4 text-white/20">
              <card.icon className="w-10 h-10" />
            </div>
            <div>
              <p className="uppercase text-sm tracking-wider opacity-80">{card.title}</p>
              <p className="text-3xl font-bold mt-1">₹{animatedValues[i].toLocaleString()}</p>
              <p className="text-xs mt-1 opacity-75">Compared to last {filter}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Chart */}
      <div className="rounded-2xl p-6 bg-[#1e1e2f] shadow-xl border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5" /> Sales Analytics
          </h3>
          <span className="text-sm text-gray-400 flex items-center gap-1">
            <Settings className="w-4 h-4" />
            Filter: {filter}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={sampleChartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#3b82f6" stopOpacity={0.6} />
                <stop offset="90%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderColor: "#3b82f6", color: "#fff" }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-2xl p-6 bg-[#1e1e2f] shadow-xl border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
        <ul className="space-y-3">
          {[
            { name: "Payment from John", amount: 1200 },
            { name: "Order #1049", amount: 2999 },
            { name: "Refund to Alex", amount: -450 },
          ].map((txn, idx) => (
            <li key={idx} className="flex justify-between text-sm text-gray-300">
              <span>{txn.name}</span>
              <span className={`font-semibold ${txn.amount < 0 ? "text-red-400" : "text-green-400"}`}>
                ₹{txn.amount}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default MerchantDashboard;

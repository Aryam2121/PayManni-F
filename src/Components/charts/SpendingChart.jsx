import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { isCreditTransaction } from "../../utils/format";

export default function SpendingChart({ transactions = [], dark = true }) {
  const data = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({
        key,
        label: d.toLocaleDateString("en-IN", { weekday: "short" }),
        spent: 0,
        received: 0,
      });
    }

    transactions.forEach((txn) => {
      const raw = txn.createdAt || txn.timestamp || txn.date;
      if (!raw) return;
      const key = new Date(raw).toISOString().slice(0, 10);
      const day = days.find((d) => d.key === key);
      if (!day) return;
      const amt = Math.abs(Number(txn.amount) || 0);
      if (isCreditTransaction(txn)) day.received += amt;
      else day.spent += amt;
    });

    return days;
  }, [transactions]);

  const hasData = data.some((d) => d.spent > 0 || d.received > 0);

  if (!hasData) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-gray-500 rounded-xl border border-dashed border-gray-600/40">
        No spending data yet — make a payment to see your chart
      </div>
    );
  }

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#374151" : "#e5e7eb"} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: dark ? "#9ca3af" : "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: dark ? "#9ca3af" : "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: dark ? "#1f2937" : "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "12px",
            }}
            formatter={(value, name) => [`₹${Number(value).toFixed(0)}`, name === "spent" ? "Spent" : "Received"]}
          />
          <Bar dataKey="spent" fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={28} />
          <Bar dataKey="received" fill="#4ade80" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

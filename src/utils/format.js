export function formatCurrency(amount, compact = false) {
  const n = Number(amount) || 0;
  if (compact && n >= 100000) {
    return `₹${(n / 100000).toFixed(1)}L`;
  }
  if (compact && n >= 1000) {
    return `₹${(n / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatDateShort(date) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatTimeAgo(date) {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function isCreditTransaction(txn) {
  const type = (txn.type || txn.details?.type || "").toLowerCase();
  if (["credit", "received", "deposit", "receive", "receive money"].includes(type)) return true;
  if (type.includes("receive")) return true;
  if (txn.type === "Credit") return true;
  if (["debit", "sent", "payment", "bill", "recharge", "withdraw"].includes(type)) return false;
  if (type.includes("send") || type.includes("payment") || type.includes("transfer")) return false;
  return false;
}

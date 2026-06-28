import { useState } from "react";
import { motion } from "framer-motion";
import { FaBell, FaCheckCircle, FaBolt, FaGift, FaPlane } from "react-icons/fa";
import PageShell from "../Components/layout/PageShell";

const initialNotifications = [
  { id: 1, title: "Cashback credited", message: "₹50 cashback added to your wallet for mobile recharge.", time: "2 min ago", unread: true, icon: FaGift, color: "text-amber-500" },
  { id: 2, title: "Recharge successful", message: "Your ₹299 mobile recharge was completed successfully.", time: "1 hour ago", unread: true, icon: FaCheckCircle, color: "text-green-500" },
  { id: 3, title: "Bill reminder", message: "Electricity bill of ₹850 is due in 3 days.", time: "3 hours ago", unread: false, icon: FaBolt, color: "text-yellow-500" },
  { id: 4, title: "Travel offer", message: "Flat 15% off on bus bookings this weekend.", time: "Yesterday", unread: false, icon: FaPlane, color: "text-blue-500" },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <PageShell
      title="Notifications"
      subtitle={unreadCount ? `${unreadCount} unread` : "You're all caught up"}
    >
      <div className="flex justify-end mb-4">
        {unreadCount > 0 && (
          <button type="button" onClick={markAllRead} className="text-sm text-primary font-medium hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="page-card text-center py-16">
            <FaBell className="text-4xl text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n, i) => (
            <motion.div
              key={n.id}
              className={`page-card flex gap-4 p-4 ${n.unread ? "ring-1 ring-primary/30 bg-primary/5" : ""}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className={`mt-1 ${n.color}`}>
                <n.icon className="text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-foreground">{n.title}</p>
                  {n.unread && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                <p className="text-xs text-muted-foreground/80 mt-2">{n.time}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </PageShell>
  );
}

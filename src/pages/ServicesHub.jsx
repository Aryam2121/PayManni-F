import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMobileAlt, FaBolt, FaFilm, FaTrain, FaBus, FaPlane,
  FaMoneyBillWave, FaQrcode, FaUsers, FaUniversity, FaWallet,
  FaCreditCard, FaBell, FaStore, FaMapMarkerAlt, FaFileInvoice,
} from "react-icons/fa";
import { MdAccountBalance, MdPayment } from "react-icons/md";
import PageShell from "../Components/layout/PageShell";

const categories = [
  {
    title: "Payments",
    items: [
      { name: "Send Money", icon: FaWallet, path: "/send-money", color: "from-blue-500 to-cyan-600" },
      { name: "Receive Money", icon: FaWallet, path: "/receive-money", color: "from-green-500 to-emerald-600" },
      { name: "Scan QR", icon: FaQrcode, path: "/qr-scanner", color: "from-purple-500 to-pink-600" },
      { name: "Bank Transfer", icon: FaUniversity, path: "/transfer", color: "from-indigo-500 to-blue-600" },
      { name: "Pay Contacts", icon: FaUsers, path: "/pay-contacts", color: "from-teal-500 to-cyan-600" },
      { name: "Split Bill", icon: FaUsers, path: "/split-payment", color: "from-orange-500 to-red-500" },
    ],
  },
  {
    title: "Recharge & Bills",
    items: [
      { name: "Mobile Recharge", icon: FaMobileAlt, path: "/recharge", color: "from-blue-500 to-blue-600" },
      { name: "Pay Bills", icon: FaBolt, path: "/pay-bills", color: "from-yellow-500 to-orange-500" },
      { name: "Bill Reminders", icon: FaBell, path: "/bill-reminder", color: "from-rose-500 to-pink-600" },
      { name: "Wallet", icon: FaCreditCard, path: "/wallet", color: "from-violet-500 to-purple-600" },
    ],
  },
  {
    title: "Travel & Entertainment",
    items: [
      { name: "Movies", icon: FaFilm, path: "/movies", color: "from-red-500 to-rose-600" },
      { name: "Bus", icon: FaBus, path: "/bus-booking", color: "from-teal-500 to-green-600" },
      { name: "Train", icon: FaTrain, path: "/train-booking", color: "from-green-500 to-lime-600" },
      { name: "Flight", icon: FaPlane, path: "/flight-booking", color: "from-indigo-500 to-violet-600" },
    ],
  },
  {
    title: "Finance & Business",
    items: [
      { name: "Loans", icon: FaMoneyBillWave, path: "/loan-application", color: "from-amber-500 to-orange-600" },
      { name: "Banking", icon: MdAccountBalance, path: "/bank-services", color: "from-slate-500 to-gray-700" },
      { name: "Merchant", icon: FaStore, path: "/merchant-dashboard", color: "from-fuchsia-500 to-purple-600" },
      { name: "Invoices", icon: FaFileInvoice, path: "/customer-invoice", color: "from-cyan-500 to-blue-600" },
      { name: "Transactions", icon: MdPayment, path: "/transactions", color: "from-blue-600 to-indigo-600" },
      { name: "Locations", icon: FaMapMarkerAlt, path: "/location-services", color: "from-emerald-500 to-teal-600" },
    ],
  },
];

export default function ServicesHub() {
  const navigate = useNavigate();

  return (
    <PageShell title="All Services" subtitle="Everything you need in one place">
      <div className="space-y-10">
        {categories.map((cat, ci) => (
          <section key={cat.title}>
            <h2 className="text-lg font-semibold text-foreground mb-4">{cat.title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {cat.items.map((item, i) => (
                <motion.button
                  key={item.name}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="page-card text-left p-4 hover:shadow-lg transition-all group"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ci * 0.05 + i * 0.03 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-md group-hover:shadow-lg transition-shadow`}>
                    <item.icon className="text-white text-xl" />
                  </div>
                  <p className="font-medium text-sm text-foreground">{item.name}</p>
                </motion.button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}

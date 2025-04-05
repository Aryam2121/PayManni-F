import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash, ReceiptText, Download, XCircle } from "lucide-react";

const CustomerInvoice = () => {
  const [items, setItems] = useState([{ name: "", price: "" }]);
  const [errorIndex, setErrorIndex] = useState(null);
  const inputRefs = useRef([]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
    if (field === "price" && parseFloat(value) >= 0) {
      setErrorIndex(null);
    }
  };

  const addItem = () => {
    setItems((prev) => [...prev, { name: "", price: "" }]);
    setTimeout(() => {
      inputRefs.current[items.length]?.focus();
    }, 100);
  };

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const clearAll = () => {
    setItems([{ name: "", price: "" }]);
    setErrorIndex(null);
  };

  const exportJSON = () => {
    const validItems = items.filter((i) => i.name && i.price);
    const blob = new Blob([JSON.stringify(validItems, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoice.json";
    link.click();
  };

  const total = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-br from-gray-900 to-black border border-white/10 backdrop-blur-xl p-6 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.7)] text-white min-h-screen"
    >
      <div className="flex items-center gap-2 mb-6 relative">
        <ReceiptText className="w-6 h-6 text-blue-400" />
        <h2 className="text-3xl font-bold tracking-tight">Customer Invoice</h2>
        <motion.div
          layoutId="underline"
          className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500/30 rounded-full"
        />
      </div>

      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-4"
        >
          <div className="md:col-span-3 relative">
            <input
              ref={(el) => (inputRefs.current[i] = el)}
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleItemChange(i, "name", e.target.value)}
              className={`w-full bg-white/10 border ${
                errorIndex === i && !item.name ? "border-red-500" : "border-white/20"
              } rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div className="relative">
            <input
              type="number"
              placeholder="₹ Price"
              value={item.price}
              onChange={(e) => handleItemChange(i, "price", e.target.value)}
              className={`w-full bg-white/10 border ${
                errorIndex === i && !item.price ? "border-red-500" : "border-white/20"
              } rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
          </div>

          {items.length > 1 && (
            <button
              onClick={() => removeItem(i)}
              className="text-red-500 hover:text-red-600 transition"
              title="Remove item"
            >
              <Trash className="w-5 h-5" />
            </button>
          )}
        </motion.div>
      ))}

      <div className="flex flex-wrap justify-between items-center mt-6 gap-4">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addItem}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
          >
            + Add Item
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium"
          >
            <XCircle size={16} /> Clear All
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportJSON}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-sm font-medium"
        >
          <Download size={16} /> Export JSON
        </motion.button>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="text-2xl text-right font-bold text-green-400 bg-gradient-to-r from-emerald-500/10 to-emerald-400/10 p-4 rounded-xl shadow-inner">
          Total: ₹{total.toFixed(2)}
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerInvoice;

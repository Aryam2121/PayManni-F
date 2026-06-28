import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import { QRCodeCanvas } from "qrcode.react";
import {
  FaArrowDown,
  FaQrcode,
  FaShare,
  FaCopy,
  FaDownload,
  FaWhatsapp,
  FaEnvelope,
  FaUser,
  FaCheckCircle,
  FaWallet,
} from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { HiLightningBolt } from "react-icons/hi";
import { getApiBase, getAuthHeaders, getStoredUser, getUserId, getUserName, getUserUpi, apiUrl, updateStoredUser } from "../utils/authStorage";
import PageShell from "./layout/PageShell";

const ReceiveMoney = () => {
  const { darkMode } = useTheme();
  const [userUpi, setUserUpi] = useState("");
  const [userName, setUserName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [balance, setBalance] = useState(0);
  const qrRef = useRef(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userUpi) {
      generateQRValue();
    }
  }, [userUpi, amount, note]);

  const fetchUserData = async () => {
    const userId = getUserId();
    setUserName(getUserName());
    setUserUpi(getUserUpi());

    if (!userId) return;

    try {
      const balanceRes = await axios.get(apiUrl(`/api/myaccount/${userId}`), {
        headers: getAuthHeaders(),
      });
      const data = balanceRes.data;
      setBalance(data.balance ?? 0);
      setUserName(data.name || getUserName());
      setUserUpi(data.upiId || data.upi || getUserUpi());
      updateStoredUser({
        id: data.id || userId,
        _id: data.id || userId,
        name: data.name,
        email: data.email,
        upi: data.upiId,
        upiId: data.upiId,
        balance: data.balance,
      });
    } catch (error) {
      console.error("Data fetch error:", error);
      const user = getStoredUser();
      setUserName(user?.name || getUserName());
      setUserUpi(getUserUpi() || "");
      setBalance(user?.balance ?? 0);
    }
  };

  const generateQRValue = () => {
    const upiString = amount
      ? `upi://pay?pa=${userUpi}&pn=${userName}&am=${amount}&cu=INR&tn=${note || "Payment"}`
      : `upi://pay?pa=${userUpi}&pn=${userName}&cu=INR`;
    setQrValue(upiString);
  };

  const handleGenerateQR = () => {
    if (!userUpi) {
      toast.error("UPI ID not found");
      return;
    }
    setShowQR(true);
    generateQRValue();
  };

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    toast.success(message || "Copied to clipboard!");
  };

  const downloadQR = () => {
    const canvas = document.querySelector("#qr-canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `PayManni_QR_${userName}.png`;
      link.href = url;
      link.click();
      toast.success("QR Code downloaded!");
    }
  };

  const shareViaWhatsApp = () => {
    const message = amount
      ? `Pay me ₹${amount} via UPI\nUPI ID: ${userUpi}\n${note ? `Note: ${note}` : ""}`
      : `My UPI ID: ${userUpi}\nPay me instantly via PayManni`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareViaEmail = () => {
    const subject = "Payment Request - PayManni";
    const body = amount
      ? `Please pay me ₹${amount} via UPI\n\nUPI ID: ${userUpi}\n${note ? `Note: ${note}` : ""}\n\nThank you!`
      : `My UPI ID: ${userUpi}\n\nYou can pay me instantly using PayManni`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      "_blank"
    );
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  return (
    <PageShell
      title="Receive Money"
      subtitle="Share your UPI details or QR code"
      headerRight={
        <div className="page-card py-2.5 px-4 text-right min-w-[120px]">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Balance</p>
          <p className="text-lg font-bold text-foreground">₹{balance.toLocaleString("en-IN")}</p>
        </div>
      }
    >
      <div className="space-y-6">

        {/* User Info Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl">
              <FaUser />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">{userName}</h2>
              <p className="text-gray-600">{userUpi}</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => copyToClipboard(userUpi, "UPI ID copied!")}
              className="flex-1 bg-gradient-to-r from-green-100 to-teal-100 text-green-700 py-3 px-4 rounded-xl font-semibold hover:from-green-200 hover:to-teal-200 transition-all flex items-center justify-center space-x-2"
            >
              <FaCopy />
              <span>Copy UPI ID</span>
            </button>
            <button
              onClick={handleGenerateQR}
              className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all flex items-center justify-center space-x-2"
            >
              <FaQrcode />
              <span>Show QR</span>
            </button>
          </div>
        </motion.div>

        {/* Request Payment Form */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <HiLightningBolt className="text-yellow-500 mr-2" />
            Request Payment
          </h3>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Amount (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400">
                ₹
              </span>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-2xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Quick Select</p>
            <div className="grid grid-cols-3 gap-3">
              {quickAmounts.map((amt) => (
                <motion.button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className="bg-gray-100 hover:bg-green-100 text-gray-800 py-3 rounded-xl font-semibold transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ₹{amt}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add Note (Optional)
            </label>
            <input
              type="text"
              placeholder="What's this for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleGenerateQR}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Generate Payment QR
          </button>
        </motion.div>

        {/* QR Code Display */}
        {showQR && (
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Your Payment QR Code
            </h3>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-2xl mb-6">
              <div className="bg-white p-6 rounded-xl shadow-lg inline-block mx-auto" style={{ display: 'block', textAlign: 'center' }}>
                <QRCodeCanvas
                  id="qr-canvas"
                  value={qrValue}
                  size={250}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="text-center mt-6">
                <p className="text-gray-700 font-semibold text-lg">{userName}</p>
                <p className="text-gray-600">{userUpi}</p>
                {amount && (
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    ₹{amount}
                  </p>
                )}
                {note && (
                  <p className="text-gray-500 mt-2">Note: {note}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <motion.button
                onClick={downloadQR}
                className="bg-blue-100 text-blue-700 py-3 px-4 rounded-xl font-semibold hover:bg-blue-200 transition-all flex flex-col items-center space-y-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaDownload className="text-xl" />
                <span className="text-sm">Download</span>
              </motion.button>

              <motion.button
                onClick={shareViaWhatsApp}
                className="bg-green-100 text-green-700 py-3 px-4 rounded-xl font-semibold hover:bg-green-200 transition-all flex flex-col items-center space-y-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaWhatsapp className="text-xl" />
                <span className="text-sm">WhatsApp</span>
              </motion.button>

              <motion.button
                onClick={shareViaEmail}
                className="bg-purple-100 text-purple-700 py-3 px-4 rounded-xl font-semibold hover:bg-purple-200 transition-all flex flex-col items-center space-y-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEnvelope className="text-xl" />
                <span className="text-sm">Email</span>
              </motion.button>

              <motion.button
                onClick={() => {
                  const shareData = {
                    title: "Pay me via PayManni",
                    text: amount
                      ? `Pay me ₹${amount} via UPI: ${userUpi}`
                      : `My UPI ID: ${userUpi}`,
                  };
                  if (navigator.share) {
                    navigator.share(shareData);
                  } else {
                    copyToClipboard(shareData.text, "Payment details copied!");
                  }
                }}
                className="bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all flex flex-col items-center space-y-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaShare className="text-xl" />
                <span className="text-sm">Share</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Tips Section */}
        <motion.div
          className="bg-gradient-to-r from-teal-500 to-green-500 text-white p-6 rounded-2xl shadow-xl mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-bold mb-3 flex items-center">
            <FaCheckCircle className="mr-2" />
            Quick Tips
          </h3>
          <ul className="space-y-2 text-sm text-green-50">
            <li>• Share your QR code with anyone to receive instant payments</li>
            <li>• Add an amount to create a payment request</li>
            <li>• Your UPI ID is unique and can be shared safely</li>
            <li>• Download the QR code to print or save for later</li>
          </ul>
        </motion.div>
      </div>
    </PageShell>
  );
};

export default ReceiveMoney;

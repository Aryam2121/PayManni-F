import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import QrReader from "react-qr-scanner";

const QrScanner = () => {
  const [qrCodeData, setQrCodeData] = useState(null);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showMpinPrompt, setShowMpinPrompt] = useState(false);
  const [enteredMpin, setEnteredMpin] = useState("");
  const [isMpinValid, setIsMpinValid] = useState(true);
  const [qrFile, setQrFile] = useState(null);

  const navigate = useNavigate();
  const storedMpin = "1234";

  const handleScan = (data) => {
    if (data) {
      setQrCodeData(data);
      setError("");
      setShowConfirmation(true);
    }
  };

  const handleError = () => {
    setError("Failed to scan the QR code. Please try again.");
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleMpinChange = (e) => {
    setEnteredMpin(e.target.value);
    setIsMpinValid(true);
  };

  const handleSendMoney = () => {
    if (!qrCodeData || !amount || amount <= 0) {
      setError("Please scan a valid QR code and enter a valid amount.");
      return;
    }
    setShowMpinPrompt(true);
  };

  const validateMpin = () => {
    if (enteredMpin !== storedMpin) {
      setIsMpinValid(false);
      return;
    }
    setIsLoading(true);
    setShowMpinPrompt(false);
    setTimeout(() => {
      setPaymentSuccess(true);
      setIsLoading(false);
      alert(`Successfully sent ${amount} to ${qrCodeData}`);
      navigate("/transactions");
    }, 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQrFile(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <motion.h2
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Send Money
      </motion.h2>

      <div className="w-full max-w-md space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Scan QR Code</p>
          <QrReader delay={300} style={{ width: "100%" }} onError={handleError} onScan={handleScan} />
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Upload QR Code</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-600 dark:text-gray-300 cursor-pointer"
          />
        </div>

        {error && <div className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-800 p-3 rounded-md">{error}</div>}

        {qrCodeData && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <p className="text-gray-800 dark:text-gray-300 font-medium">Recipient ID: {qrCodeData}</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <label className="text-gray-700 dark:text-gray-300 font-semibold">Amount to Send</label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 mt-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Enter amount"
          />
        </div>

        {showConfirmation && (
          <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-lg shadow-md">
            <p className="text-gray-800 dark:text-gray-100 font-medium mb-4">
              Send ₹{amount} to {qrCodeData}?
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleSendMoney}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                Yes, Send
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showMpinPrompt && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <label className="text-gray-700 dark:text-gray-300 font-semibold">Enter Your M-PIN</label>
            <input
              type="password"
              value={enteredMpin}
              onChange={handleMpinChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 mt-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter 4-digit PIN"
              maxLength="4"
            />
            {!isMpinValid && <p className="text-red-600 dark:text-red-400 text-sm mt-2">Incorrect M-PIN. Try again.</p>}
            <div className="flex justify-between mt-4">
              <button
                onClick={validateMpin}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Validate
              </button>
              <button
                onClick={() => setShowMpinPrompt(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleSendMoney}
          disabled={isLoading || !amount || amount <= 0}
          className={`w-full py-3 rounded-md text-white font-semibold transition ${
            isLoading ? "bg-gray-400 dark:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Processing..." : "Send Money"}
        </button>

        {isLoading && <p className="text-blue-500 dark:text-blue-400 font-medium text-center">Processing payment...</p>}

        {paymentSuccess && (
          <div className="bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 p-3 rounded-md text-center">
            Payment Successful!
          </div>
        )}
      </div>
    </div>
  );
};

export default QrScanner;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import QrReader from "react-qr-scanner";

// New QR reader for file upload
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
  const [qrFile, setQrFile] = useState(null);  // To handle the uploaded QR code file
  const navigate = useNavigate();

  const storedMpin = "1234"; // For simplicity, assuming the stored MPIN is "1234"

  const handleScan = (data) => {
    if (data) {
      setQrCodeData(data);
      setError(""); // Clear any previous errors
      setShowConfirmation(true); // Show confirmation when QR is scanned
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError("Failed to scan the QR code. Please try again.");
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleMpinChange = (e) => {
    setEnteredMpin(e.target.value);
    setIsMpinValid(true); // Reset validation status when user changes MPIN input
  };

  const handleSendMoney = () => {
    if (!qrCodeData || !amount || amount <= 0) {
      setError("Please scan a valid QR code and enter a valid amount to send.");
      return;
    }
    setShowMpinPrompt(true); // Show MPIN prompt after amount and recipient are confirmed
  };

  const validateMpin = () => {
    if (enteredMpin !== storedMpin) {
      setIsMpinValid(false);
      return;
    }
    // Proceed with the transaction if MPIN is valid
    setIsLoading(true);
    setShowMpinPrompt(false); // Hide MPIN prompt
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentSuccess(true);
      setIsLoading(false);
      alert(`Successfully sent ${amount} to ${qrCodeData}`);
      navigate("/transactions"); // Use navigate instead of history.push
    }, 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQrFile(file);
      // You could implement file reading and scanning here, e.g., using a library like 'jsqr' for QR code processing
    }
  };

  const handleFileScan = (data) => {
    if (data) {
      setQrCodeData(data);
      setError(""); // Clear any previous errors
      setShowConfirmation(true); // Show confirmation when QR is scanned from file
    }
  };

  const handleFileError = (err) => {
    console.error(err);
    setError("Failed to scan the QR code from file. Please try again.");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <motion.h2 className="text-2xl font-bold mb-4">Send Money</motion.h2>

      {/* QR Scanner (Camera) */}
      <div className="w-full max-w-md mb-6">
        <QrReader
          delay={300}
          style={{ width: "100%", height: "auto" }}
          onError={handleError}
          onScan={handleScan}
        />
      </div>

      {/* File Upload for QR Code */}
      <div className="w-full max-w-md mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="border border-gray-300 p-3 rounded-md w-full"
        />
        {qrFile && (
          <QrReader
            delay={300}
            style={{ width: "100%", height: "auto" }}
            onError={handleFileError}
            onScan={handleFileScan}
            onFileSelect={(file) => handleFileUpload({ target: { files: [file] } })}
          />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4 w-full max-w-md">
          <p>{error}</p>
        </div>
      )}

      {/* Display Scanned QR Data */}
      {qrCodeData && (
        <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md mb-6">
          <p className="text-lg font-semibold">Recipient ID: {qrCodeData}</p>
        </div>
      )}

      {/* Amount Input */}
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md mb-6">
        <label className="block text-lg font-medium mb-2">Amount to Send</label>
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
          placeholder="Enter amount"
        />
      </div>

      {/* Confirmation Message */}
      {showConfirmation && (
        <div className="bg-yellow-100 p-4 rounded-lg shadow-lg w-full max-w-md mb-6">
          <p className="text-lg font-semibold">
            Are you sure you want to send {amount} to {qrCodeData}?
          </p>
          <div className="flex justify-between">
            <button
              onClick={handleSendMoney}
              className="bg-green-500 text-white py-2 px-6 rounded-md font-semibold hover:bg-green-600 transition-colors"
            >
              Yes, Send
            </button>
            <button
              onClick={() => setShowConfirmation(false)}
              className="bg-red-500 text-white py-2 px-6 rounded-md font-semibold hover:bg-red-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MPIN Prompt */}
      {showMpinPrompt && (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mb-6">
          <label className="block text-lg font-medium mb-2">Enter Your M-PIN</label>
          <input
            type="password"
            value={enteredMpin}
            onChange={handleMpinChange}
            className="w-full p-3 border border-gray-300 rounded-md mb-4"
            placeholder="Enter 4-digit PIN"
            maxLength="4"
          />
          {!isMpinValid && (
            <div className="text-red-600 text-sm mb-4">Incorrect M-PIN. Please try again.</div>
          )}
          <div className="flex justify-between">
            <button
              onClick={validateMpin}
              className="bg-blue-500 text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-600 transition-colors"
            >
              Validate
            </button>
            <button
              onClick={() => setShowMpinPrompt(false)}
              className="bg-red-500 text-white py-2 px-6 rounded-md font-semibold hover:bg-red-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Send Money Button (disabled if loading or missing amount) */}
      <div className="w-full max-w-md">
        <button
          onClick={handleSendMoney}
          disabled={isLoading || !amount || amount <= 0}
          className={`${
            isLoading ? "bg-gray-400" : "bg-blue-500"
          } text-white py-2 px-6 rounded-md font-semibold hover:bg-blue-600 transition-colors w-full`}
        >
          {isLoading ? "Processing..." : "Send Money"}
        </button>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="mt-4 text-blue-500 font-semibold">
          <span>Processing payment...</span>
        </div>
      )}

      {/* Payment Success Message */}
      {paymentSuccess && (
        <div className="mt-4 p-4 text-green-500 bg-green-100 rounded-lg">
          <p>Payment Successful!</p>
        </div>
      )}
    </div>
  );
};

export default QrScanner;

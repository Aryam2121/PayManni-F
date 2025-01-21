import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import Modal from "react-modal";

const MoneyTransferPage = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isLoading, setIsLoading] = useState(false);
  const [transferStatus, setTransferStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [transferHistory, setTransferHistory] = useState([]);
  const [userProfile, setUserProfile] = useState({ name: "", email: "aryamangupta2121@gmail.com" });
  const [bankAccount, setBankAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [otpLoading, setOtpLoading] = useState(false); // Loading state for OTP
  const [showOtpVerifiedModal, setShowOtpVerifiedModal] = useState(false); // OTP Verified Modal state
  const [confirmPayment, setConfirmPayment] = useState(false); // Confirm Payment state

  const handleTransfer = () => {
    if (!recipient || !amount || isNaN(amount) || amount <= 0) {
      alert("Please fill in all fields correctly.");
      return;
    }
    setIsModalOpen(true); // Open confirmation modal
  };

  const handleConfirmTransfer = () => {
    if (otpVerified) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setTransferStatus("success");
        // Add to transfer history
        setTransferHistory([
          ...transferHistory,
          { recipient, amount, paymentMethod, date: new Date().toLocaleString() }
        ]);
      }, 2000);
    } else {
      alert("Please verify OTP to proceed.");
    }
  };

  const handleOtpVerification = () => {
    setOtpLoading(true);
    setTimeout(() => {
      // Simulate OTP Verification (e.g., after an API call)
      if (otp === "123456") {
        setOtpVerified(true);
        setShowOtpVerifiedModal(true); // Show OTP Verified Modal
      } else {
        alert("Invalid OTP");
      }
      setOtpLoading(false);
    }, 2000);
  };

  const handleConfirmPayment = () => {
    setConfirmPayment(true);
    setShowOtpVerifiedModal(false); // Close OTP Verified Modal
    // Proceed with the payment after confirming
    handleConfirmTransfer();
  };

  const handleDiscardPayment = () => {
    setShowOtpVerifiedModal(false); // Close OTP Verified Modal
    alert("Payment discarded.");
  };

  return (
    <div className="bg-gray-100 text-gray-900 p-6 w-full min-h-screen">
      <h2 className="text-4xl font-semibold mb-8 text-center text-blue-700">Money Transfer</h2>

      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-xl space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="recipient" className="block text-gray-700 text-lg">Recipient's Name</label>
            <input
              type="text"
              id="recipient"
              value={recipient || userProfile.name}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter recipient's name"
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-gray-700 text-lg">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
              min="1"
            />
          </div>

          <div>
            <label htmlFor="payment-method" className="block text-gray-700 text-lg">Payment Method</label>
            <select
              id="payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI</option>
              <option value="paypal">PayPal</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          {paymentMethod === "card" && (
            <div>
              <label htmlFor="card-number" className="block text-gray-700 text-lg">Card Number</label>
              <input
                type="text"
                id="card-number"
                className="w-full p-4 border border-gray-300 rounded-md mt-2"
                placeholder="Enter card number"
              />
            </div>
          )}

          {paymentMethod === "upi" && (
            <div>
              <label htmlFor="upi-id" className="block text-gray-700 text-lg">UPI ID</label>
              <input
                type="text"
                id="upi-id"
                className="w-full p-4 border border-gray-300 rounded-md mt-2"
                placeholder="Enter UPI ID"
              />
            </div>
          )}

          {paymentMethod === "paypal" && (
            <div>
              <label htmlFor="paypal-email" className="block text-gray-700 text-lg">PayPal Email</label>
              <input
                type="email"
                id="paypal-email"
                className="w-full p-4 border border-gray-300 rounded-md mt-2"
                placeholder="Enter PayPal email"
              />
            </div>
          )}

          {paymentMethod === "bank" && (
            <div>
              <div>
                <label htmlFor="bank-name" className="block text-gray-700 text-lg">Bank Name</label>
                <input
                  type="text"
                  id="bank-name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-md mt-2"
                  placeholder="Enter bank name"
                />
              </div>

              <div>
                <label htmlFor="bank-account" className="block text-gray-700 text-lg">Bank Account Number</label>
                <input
                  type="text"
                  id="bank-account"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-md mt-2"
                  placeholder="Enter bank account number"
                />
              </div>

              <div>
                <label htmlFor="ifsc-code" className="block text-gray-700 text-lg">IFSC Code</label>
                <input
                  type="text"
                  id="ifsc-code"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-md mt-2"
                  placeholder="Enter IFSC code"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleTransfer}
            className="w-full bg-blue-600 text-white py-3 mt-4 rounded-md hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : "Transfer Money"}
          </button>

          {transferStatus && (
            <div className={`mt-4 p-4 rounded-md text-center ${transferStatus === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
              {transferStatus === "success" ? (
                <FaCheckCircle className="text-3xl" />
              ) : (
                <FaTimesCircle className="text-3xl" />
              )}
              <h4 className="font-semibold">{transferStatus === "success" ? "Transfer Successful!" : "Transfer Failed!"}</h4>
              <p>{transferStatus === "success" ? "Your transfer has been completed successfully." : "There was an issue with your transfer."}</p>
            </div>
          )}

          <div className="mt-6">
            <h4 className="text-xl font-semibold">Transfer History</h4>
            <ul className="mt-4 space-y-4">
              {transferHistory.map((transfer, index) => (
                <li key={index} className="p-4 border-b bg-gray-50 rounded-md">
                  <p><strong>Recipient:</strong> {transfer.recipient}</p>
                  <p><strong>Amount:</strong> ₹{transfer.amount}</p>
                  <p><strong>Payment Method:</strong> {transfer.paymentMethod}</p>
                  <p><strong>Date:</strong> {transfer.date}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} className="modal">
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Verify OTP</h3>
          <p className="mb-4">To proceed with the transfer, please enter the OTP sent to your phone.</p>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter OTP"
          />
          <div className="mt-4 flex justify-between">
            <button
              onClick={handleOtpVerification}
              className="bg-green-600 text-white py-2 px-4 rounded-md"
              disabled={otpLoading}
            >
              {otpLoading ? <FaSpinner className="animate-spin" /> : "Verify OTP"}
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* OTP Verified Modal */}
      <Modal
        isOpen={showOtpVerifiedModal}
        onRequestClose={() => setShowOtpVerifiedModal(false)}
        className="modal"
      >
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">OTP Verified</h3>
          <p className="mb-4">Your OTP has been successfully verified. Do you want to proceed with the payment?</p>
          <div className="flex justify-between">
            <button
              onClick={handleConfirmPayment}
              className="bg-blue-600 text-white py-2 px-4 rounded-md"
            >
              Confirm Payment
            </button>
            <button
              onClick={handleDiscardPayment}
              className="bg-red-600 text-white py-2 px-4 rounded-md"
            >
              Discard Payment
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MoneyTransferPage;

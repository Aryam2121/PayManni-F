import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaWallet, FaCreditCard, FaRegMoneyBillAlt, FaHistory, FaGift, FaQrcode, FaHeadset, FaDollarSign, FaRegBell, FaUserCircle, FaBalanceScale } from "react-icons/fa";
import { motion } from "framer-motion";  
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [offers, setOffers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loanAmount, setLoanAmount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setUser({ name: "Aryam", balance: 1200, profilePic: "https://via.placeholder.com/150" });
      setTransactions([
        { type: 'Recharge', amount: 500, date: '2024-12-01' },
        { type: 'Pay Bills', amount: 300, date: '2024-12-05' },
        { type: 'Money Transfer', amount: 150, date: '2024-12-10' },
      ]);
      setOffers([
        { name: "Cashback on First Recharge", discount: 100, claimed: false },
        { name: "10% Off on Bill Payments", discount: 50, claimed: false },
      ]);
      setNotifications([
        { type: 'Payment Success', message: '₹500 added to your wallet!' },
        { type: 'Recharge Completed', message: 'Your bill payment of ₹300 was successful.' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleChat = () => setChatOpen(!chatOpen);
  
  const notify = (message) => {
    toast(message);
  };

  const handleLoanApplication = () => {
    if (loanAmount <= 0) {
      toast.error("Please enter a valid loan amount.");
      return;
    }
    toast.success(`Loan Approved! ₹${loanAmount} added to your wallet.`);
    setUser((prev) => ({ ...prev, balance: prev.balance + loanAmount }));
  };

  const handleOfferClaim = (index) => {
    setOffers((prevOffers) => {
      const updatedOffers = [...prevOffers];
      updatedOffers[index].claimed = true;
      return updatedOffers;
    });
    toast.success(`Offer '${offers[index].name}' Claimed!`);
  };

  const clearNotifications = () => {
    setNotifications([]);
    toast.info("All notifications cleared.");
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-blue-50 via-indigo-100 to-blue-50'} p-6`}>
      <div className="max-w-screen-lg mx-auto">
        <motion.h2
          className="text-4xl font-bold text-blue-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Welcome to PayManni
        </motion.h2>
  
        <div className="flex justify-end mt-4">
          <button 
            onClick={toggleDarkMode} 
            className="bg-gray-800 text-white py-2 px-4 rounded-full hover:bg-gray-700 focus:outline-none"
            aria-pressed={darkMode ? "true" : "false"}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
  
        {/* User info section */}
        {!loading ? (
          <motion.div
            className="mt-6 bg-white p-4 rounded-xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <div className="flex items-center">
              <img src={user.profilePic} alt="Profile" className="w-12 h-12 rounded-full mr-4" />
              <div>
                <h3 className="text-2xl font-bold text-gray-700">{user.name}</h3>
                <p className="mt-2 text-gray-600">Balance: ₹{user.balance}</p>
              </div>
            </div>
            <button 
              onClick={() => setUser(null)} 
              className="mt-4 bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-700"
            >
              Logout
            </button>
          </motion.div>
        ) : (
          <div className="mt-6 text-center">
            <div className="animate-spin rounded-full border-4 border-t-4 border-blue-500 h-16 w-16 mx-auto"></div>
          </div>
        )}
  
        {/* Transaction Notifications */}
        <div className="mt-6">
          <h4 className="text-xl font-semibold text-gray-700">Notifications</h4>
          <button onClick={clearNotifications} className="mt-2 bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-700 transition duration-200">
            Clear All Notifications
          </button>
          {notifications.map((notification, index) => (
            <motion.div
              key={index}
              className="mt-4 bg-white p-4 rounded-xl shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 + index * 0.2, duration: 0.5 }}
            >
              <div className="flex items-center">
                <FaRegBell className="text-xl text-gray-500 mr-2" />
                <span className="text-gray-800">{notification.message}</span>
              </div>
            </motion.div>
          ))}
        </div>
  
        {/* Available Offers */}
        <div className="mt-6">
          <h4 className="text-xl font-semibold text-gray-700">Exclusive Offers</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {offers.map((offer, index) => (
              <motion.div
                key={index}
                className={`bg-white p-4 rounded-xl shadow-lg ${offer.claimed ? 'bg-gray-200' : 'hover:shadow-xl'} transition duration-300 ease-in-out transform hover:scale-105`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 + index * 0.2, duration: 0.5 }}
              >
                <h5 className="text-lg font-semibold text-gray-700">{offer.name}</h5>
                <p className="mt-2 text-gray-600">Get ₹{offer.discount} cashback!</p>
                {!offer.claimed ? (
                  <button 
                    onClick={() => handleOfferClaim(index)} 
                    className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-200"
                  >
                    Claim Offer
                  </button>
                ) : (
                  <span className="mt-4 text-green-600">Claimed</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
  
        {/* Instant Loan Application */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
          <motion.h4
            className="text-xl font-semibold text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            Instant Loan Application
          </motion.h4>
          <p className="mt-2 text-gray-600">Apply for an instant loan of up to ₹5000.</p>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="mt-4 border-2 border-gray-300 rounded-md p-2 w-full"
            placeholder="Enter loan amount"
          />
          <button
            onClick={handleLoanApplication}
            className="mt-4 bg-yellow-600 text-white py-2 px-6 rounded-full hover:bg-yellow-700 transition duration-200"
          >
            Apply for Loan
          </button>
        </div>
  
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {/* Card 1: Recharge */}
          <motion.div
            className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <FaWallet className="text-4xl text-blue-500" />
            <h3 className="text-xl font-semibold mt-4">Recharge</h3>
            <p className="text-gray-500">Add balance to your wallet.</p>
            <Link
              to="/recharge"
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-200"
            >
              Go to Recharge
            </Link>
          </motion.div>
  
          {/* Card 2: Pay Bills */}
          <motion.div
            className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.5 }}
          >
            <FaRegMoneyBillAlt className="text-4xl text-green-500" />
            <h3 className="text-xl font-semibold mt-4">Pay Bills</h3>
            <p className="text-gray-500">Pay your utility bills easily.</p>
            <Link
              to="/pay-bills"
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition duration-200"
            >
              Go to Bills
            </Link>
          </motion.div>
  
          {/* Card 3: Money Transfer */}
          <motion.div
            className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9, duration: 0.5 }}
          >
            <FaCreditCard className="text-4xl text-purple-500" />
            <h3 className="text-xl font-semibold mt-4">Transfer Money</h3>
            <p className="text-gray-500">Send money to anyone instantly.</p>
            <Link
              to="/transfer"
              className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-full hover:bg-purple-700 transition duration-200"
            >
              Send Money
            </Link>
          </motion.div>
  
          {/* Card 4: Pay Contacts */}
          <motion.div
            className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.5 }}
          >
            <FaUserCircle className="text-4xl text-green-500" />
            <h3 className="text-xl font-semibold mt-4">Pay Contacts</h3>
            <p className="text-gray-500">Pay your Contacts easily.</p>
            <Link
              to="/payContacts"
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition duration-200"
            >
              Go to Contacts
            </Link>
          </motion.div>
  
          {/* Card 4: Balance&History*/}
          <motion.div
            className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.5 }}
          >
            <FaBalanceScale className="text-4xl text-green-500" />
            <h3 className="text-xl font-semibold mt-4">Balance&History</h3>
            <p className="text-gray-500">Check Balance&History.</p>
            <Link
              to="/balanceHis"
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition duration-200"
            >
              Balance&History
            </Link>
          </motion.div>
  
          {/* Card 5: QR Code Payments */}
          <motion.div
            className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1, duration: 0.5 }}
          >
            <FaQrcode className="text-4xl text-yellow-500" />
            <h3 className="text-xl font-semibold mt-4">QR Payments</h3>
            <p className="text-gray-500">Pay quickly using QR codes.</p>
            <Link
              to="/qr-scanner"
              className="mt-4 bg-yellow-600 text-white py-2 px-4 rounded-full hover:bg-yellow-700 transition duration-200"
            >
              Scan & Pay
            </Link>
</motion.div>
        </div>
        

        {/* Chat Section */}
        <motion.div
          className={`fixed bottom-4 right-4 p-4 rounded-full shadow-lg transition-all ${
            chatOpen ? 'bg-white h-64 w-72' : 'bg-blue-600 h-12 w-12'
          }`}
          onClick={toggleChat}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
        >
          {chatOpen ? (
            <div className="relative h-full">
              <h4 className="text-lg font-semibold text-gray-700">Support Chat</h4>
              <textarea
                className="w-full h-32 mt-2 p-2 border-2 border-gray-300 rounded-lg"
                placeholder="Type your message..."
              ></textarea>
              <button className="absolute bottom-2 right-2 bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
                Send
              </button>
            </div>
          ) : (
            <FaHeadset className="text-2xl text-white" />
          )}
        </motion.div>
      </div>


      <ToastContainer />
    </div>
  );
};

export default Home;
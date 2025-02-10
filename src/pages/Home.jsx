import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlane, FaTrain, FaBus,FaWallet, FaCreditCard, FaRegMoneyBillAlt, FaHistory, FaGift, FaQrcode, FaHeadset, FaDollarSign, FaRegBell, FaUserCircle, FaBalanceScale } from "react-icons/fa";
import { motion } from "framer-motion";  
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import boy from "../assets/boy.png"
const Home = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [offers, setOffers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loanAmount, setLoanAmount] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      setUser({ name: "Aryaman Gupta", balance: 1200, profilePic: boy });

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
      <div className="">
         {/* Welcome Header */}
    <motion.h2
      className="text-4xl font-extrabold text-center mb-4 transition-colors duration-300"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      Welcome to <span className="text-blue-500">PayManni</span>
    </motion.h2>

    {/* Dark Mode Toggle */}
    <div className="flex justify-end">
      <motion.button
        onClick={toggleDarkMode}
        className="px-5 py-2 rounded-full text-white transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none"
        whileHover={{ scale: 1.05 }}
        style={{
          backgroundColor: darkMode ? "#facc15" : "#1e293b",
          color: darkMode ? "#1e293b" : "#fff"
        }}
      >
        {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
      </motion.button>
    </div>

    {/* User Info Section */}
    {!loading ? (
     <motion.div
     className={`mt-6 p-6 rounded-xl shadow-md transition-all duration-300 flex items-center justify-between ${
       darkMode ? "bg-gray-800 text-white shadow-gray-700" : "bg-white text-gray-900 shadow-lg"
     }`}
     initial={{ opacity: 0, y: -20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ delay: 0.5, duration: 0.7 }}
   >
     {/* Left: Profile & QR Code */}
     <div className="flex items-center space-x-4">
       <img src={user.profilePic} alt="Profile" className="w-16 h-16 rounded-full shadow-md border-2 border-gray-300" />
       {/* ✅ QR Code Button with Navigation */}
       <button
         onClick={() => navigate("/qr-scanner")}
         className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 shadow-md"
       >
         <FaQrcode className="text-2xl" />
       </button>
     </div>

     {/* Right: User Info */}
     <div className="text-right">
       <h3 className="text-2xl font-bold">{user.name}</h3>
       <p className="mt-1 text-gray-400">
         Balance: <span className="text-green-400 font-semibold">₹{user.balance}</span>
       </p>
       <button
         onClick={() => setUser(null)}
         className="mt-4 px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 shadow-md"
       >
         Logout
       </button>
     </div>
   </motion.div>
 ) : (
   <div className="mt-6 flex justify-center">
     <div className="animate-spin rounded-full border-4 border-t-4 border-blue-500 h-16 w-16"></div>
   </div>
  )}
  
        {/* Notifications
    <div className="mt-6">
      <h4 className="text-xl font-semibold">🔔 Notifications</h4>
      <button
        onClick={clearNotifications}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
      >
        Clear All Notifications
      </button>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <motion.div
            key={index}
            className={`mt-4 p-4 rounded-xl shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + index * 0.2, duration: 0.5 }}
          >
            <div className="flex items-center">
              <FaRegBell className="text-xl text-gray-500 mr-2" />
              <span>{notification.message}</span>
            </div>
          </motion.div>
        ))
      ) : (
        <p className="mt-4 text-gray-500">No new notifications.</p>
      )}
    </div> */}
         {/* Exclusive Offers
    <div className="mt-6">
      <h4 className="text-xl font-semibold">🎁 Exclusive Offers</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {offers.map((offer, index) => (
          <motion.div
            key={index}
            className={`p-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 ${
              offer.claimed ? "bg-gray-400 text-white" : darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 + index * 0.2, duration: 0.5 }}
          >
            <h5 className="text-lg font-semibold">{offer.name}</h5>
            <p className="mt-2">Get ₹{offer.discount} cashback!</p>
            {!offer.claimed ? (
              <button
                onClick={() => handleOfferClaim(index)}
                className="mt-4 px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 shadow-md"
              >
                Claim Offer
              </button>
            ) : (
              <span className="mt-4 text-green-400 font-semibold">Claimed</span>
            )}
          </motion.div>
        ))}
      </div>
    </div> */}


  
        {/* Feature Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
  {/* Card Example: Recharge */}
  <motion.div
    className={`flex flex-col items-center shadow-lg rounded-3xl p-6 hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 ${darkMode ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white" : "bg-gradient-to-r from-blue-400 to-blue-500 text-white"}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5, duration: 0.5 }}
  >
    <FaWallet className="text-5xl text-white" />
    <h3 className="text-2xl font-bold mt-4">Recharge</h3>
    <p className="text-gray-200">Add balance to your wallet.</p>
    <Link
      to="/recharge"
      className="mt-4 bg-blue-700 text-white py-3 px-6 rounded-full hover:bg-blue-800 transition duration-200"
    >
      Go to Recharge
    </Link>
  </motion.div>
           {/* Card 2: Pay Bills */}
  <motion.div
    className={`flex flex-col items-center shadow-lg rounded-3xl p-6 hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 ${darkMode ? "bg-gradient-to-r from-green-600 to-green-500 text-white" : "bg-gradient-to-r from-green-400 to-green-500 text-white"}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.7, duration: 0.5 }}
  >
    <FaRegMoneyBillAlt className="text-5xl text-white" />
    <h3 className="text-2xl font-bold mt-4">Pay Bills</h3>
    <p className="text-gray-200">Pay your utility bills easily.</p>
    <Link
      to="/pay-bills"
      className="mt-4 bg-green-700 text-white py-3 px-6 rounded-full hover:bg-green-800 transition duration-200"
    >
      Go to Bills
    </Link>
  </motion.div>

  {/* Card 3: Money Transfer */}
  <motion.div
    className={`flex flex-col items-center shadow-lg rounded-3xl p-6 hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 ${darkMode ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white" : "bg-gradient-to-r from-purple-400 to-purple-500 text-white"}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.9, duration: 0.5 }}
  >
    <FaCreditCard className="text-5xl text-white" />
    <h3 className="text-2xl font-bold mt-4">Transfer Money</h3>
    <p className="text-gray-200">Send money to anyone instantly.</p>
    <Link
      to="/transfer"
      className="mt-4 bg-purple-700 text-white py-3 px-6 rounded-full hover:bg-purple-800 transition duration-200"
    >
      Send Money
    </Link>
  </motion.div>

  {/* Card 4: Pay Contacts */}
  <motion.div
    className={`flex flex-col items-center shadow-lg rounded-3xl p-6 hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 ${darkMode ? "bg-gradient-to-r from-green-600 to-green-500 text-white" : "bg-gradient-to-r from-green-400 to-green-500 text-white"}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.1, duration: 0.5 }}
  >
    <FaUserCircle className="text-5xl text-white" />
    <h3 className="text-2xl font-bold mt-4">Pay Contacts</h3>
    <p className="text-gray-200">Pay your Contacts easily.</p>
    <Link
      to="/payContacts"
      className="mt-4 bg-green-700 text-white py-3 px-6 rounded-full hover:bg-green-800 transition duration-200"
    >
      Go to Contacts
    </Link>
  </motion.div>
  
          {/* Card 4: Balance&History*/}
          <motion.div
                className={`flex flex-col items-center shadow-lg rounded-3xl p-6 hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 ${darkMode ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white" : "bg-gradient-to-r from-purple-400 to-purple-500 text-white"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.5 }}
          >
            <FaBalanceScale className="text-5xl text-white" />
            <h3 className="text-2xl font-bold mt-4">Balance&History</h3>
            <p className="text-gray-200">Check Balance&History.</p>
            <Link
              to="/balanceHis"
              className="mt-4 bg-purple-700 text-white py-3 px-6 rounded-full hover:bg-green-800 transition duration-200"
            >
              Balance&History
            </Link>
          </motion.div>
         {/* Card 1: Flight Booking */}
<motion.div
   className={`flex flex-col items-center shadow-lg rounded-3xl p-6 hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 ${darkMode ? "bg-gradient-to-r from-green-600 to-green-500 text-white" : "bg-gradient-to-r from-green-400 to-green-500 text-white"}`}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.5, duration: 0.5 }}
>
  <FaPlane className="text-5xl text-white" />
  <h3 className="text-2xl font-bold mt-4">Check Flights</h3>
  <p className="text-gray-200">Flight Booking</p>
  <Link
    to="/flight-booking"
    className="mt-4 bg-green-700 text-white py-3 px-6 rounded-full hover:bg-green-800 transition duration-200"
  >
    Flight Booking
  </Link>
</motion.div>

{/* Card 2: Train Booking */}
<motion.div
      className={`flex flex-col items-center shadow-lg rounded-3xl p-6 hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 ${darkMode ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white" : "bg-gradient-to-r from-purple-400 to-purple-500 text-white"}`}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 1.0, duration: 0.5 }}
>
  <FaTrain className="text-5xl text-white" />
  <h3 className="text-2xl font-bold mt-4">Train Booking</h3>
  <p className="text-gray-200">Check Trains</p>
  <Link
    to="/train-booking"
     className="mt-4 bg-purple-700 text-white py-3 px-6 rounded-full hover:bg-green-800 transition duration-200"
  >
    Check Trains
  </Link>
</motion.div>

{/* Card 3: Bus Booking */}
<motion.div
      className={`flex flex-col items-center shadow-lg rounded-3xl p-6 hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 ${darkMode ? "bg-gradient-to-r from-green-600 to-green-500 text-white" : "bg-gradient-to-r from-green-400 to-green-500 text-white"}`}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 1.5, duration: 0.5 }}
>
  <FaBus className="text-5xl text-white" />
  <h3 className="text-2xl font-bold mt-4">Bus Booking</h3>
  <p className="text-gray-200">Check Buses</p>
  <Link
    to="/bus-booking"
    className="mt-4 bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition duration-200"
  >
    Bus Booking
  </Link>
</motion.div>

  
          {/* Card 5: QR Code Payments */}
          <motion.div
    className={`flex flex-col items-center shadow-lg rounded-3xl p-6 hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 ${darkMode ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white" : "bg-gradient-to-r from-purple-400 to-purple-500 text-white"}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.3, duration: 0.5 }}
  >
    <FaQrcode className="text-5xl text-white" />
    <h3 className="text-2xl font-bold mt-4">QR Payments</h3>
    <p className="text-gray-200">Pay quickly using QR codes.</p>
    <Link
      to="/qr-scanner"
      className="mt-4 bg-purple-700 text-white py-3 px-6 rounded-full hover:bg-green-800 transition duration-200"
    >
      Scan & Pay
    </Link>
  </motion.div>
        </div>
          {/* Instant Loan Application */}
<div
  className={`mt-8 p-6 rounded-xl shadow-xl transition-all duration-300 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
>
  <motion.h4
    className="text-2xl font-semibold tracking-tight"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5, duration: 0.7 }}
  >
    💰 Instant Loan Application
  </motion.h4>
  <p className="mt-2 text-gray-500 dark:text-gray-400">
    Apply for an instant loan of up to ₹5000. Fast, simple, and hassle-free!
  </p>
  <div className="mt-4 space-y-4">
    <div className="relative">
      <input
        type="number"
        value={loanAmount}
        onChange={(e) => setLoanAmount(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-300 transition-all duration-300"
        placeholder="Enter loan amount"
      />
      <div className="absolute top-0 right-0 mt-3 mr-4 text-gray-500 dark:text-gray-300">
        ₹
      </div>
    </div>
    <button
      onClick={handleLoanApplication}
      className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
    >
      Apply for Loan
    </button>
  </div>
  <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
    <span>Need assistance? </span>
    <a href="tel:+911234567890" className="underline text-yellow-500 hover:text-yellow-600">
      Call Support
    </a>
  </div>
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
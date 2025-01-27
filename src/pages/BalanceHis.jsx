import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { FiPlus, FiFilter } from "react-icons/fi";
import { BsMoon, BsSun } from "react-icons/bs";

const Card = ({ title, amount, extra }) => (
  <motion.div
    className="bg-white dark:bg-gray-700 p-5 rounded-xl shadow-md hover:shadow-lg transform transition duration-200"
    whileHover={{ scale: 1.05 }}
  >
    <p className="text-gray-500 dark:text-gray-300 text-sm">{amount}</p>
    <h3 className="text-gray-800 dark:text-gray-100 text-sm font-semibold mt-1">
      {title}
    </h3>
    {extra}
  </motion.div>
);
Card.propTypes = {
  title: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  extra: PropTypes.node,
};

const BalanceHistory = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Loans & Credit Card");
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { label: "Loans & Credit Card", content: <LoansContent /> },
    { label: "Investments", content: <InvestmentsContent /> },
    { label: "Insurance", content: <InsuranceContent /> },
  ];

  const transactions = [
    {
      name: "Deepanshu",
      date: "25 Jan, 02:27 PM",
      amount: "+₹120",
      type: "credit",
    },
    {
      name: "Deepanshu",
      date: "22 Jan, 11:34 PM",
      amount: "-₹45",
      type: "debit",
    },
    {
      name: "Deepanshu",
      date: "19 Jan, 09:58 PM",
      amount: "-₹33.33",
      type: "debit",
    },
    {
      name: "Paschimanchal Vidyut Nigam Limited",
      date: "",
      amount: "-₹2,137",
      type: "debit",
    },
  ];

  return (
    <div
      className={`${
        darkMode ? "dark" : ""
      } bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 min-h-screen p-6`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          className="text-2xl font-bold text-gray-700 dark:text-gray-200"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Balance & History
        </motion.h1>
        <div className="flex items-center gap-3">
          <span className="bg-yellow-300 text-yellow-800 px-3 py-1 rounded-full text-sm shadow-md">
            661
          </span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full shadow-md"
          >
            {darkMode ? <BsSun className="text-yellow-300" /> : <BsMoon />}
          </button>
        </div>
      </div>

      {/* UPI Accounts */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <AccountCard
          title="UPI Lite"
          amount="₹67"
          bgColor="bg-blue-500"
          textColor="text-white"
        />
        <AccountCard
          title="PNB Bank"
          description="A/c No - 5793"
          action="Check Balance"
          bgColor="bg-red-500"
          textColor="text-white"
        />
        <AccountCard
          title="Add Account"
          description="+ Add UPI"
          bgColor="bg-gray-100"
          textColor="text-gray-500"
        />
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300 mb-6">
        {tabs.map((tab) => (
          <motion.div
            key={tab.label}
            className={`cursor-pointer ${
              activeTab === tab.label
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1"
                : "hover:text-blue-500"
            }`}
            onClick={() => setActiveTab(tab.label)}
            whileHover={{ scale: 1.05 }}
          >
            {tab.label}
          </motion.div>
        ))}
      </div>

      {/* Active Tab Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={activeTab}
      >
        {tabs.find((tab) => tab.label === activeTab)?.content}
      </motion.div>

      {/* Payment History */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Payment History
        </h2>
        <SearchBar />
        <TransactionList transactions={transactions} isLoading={isLoading} />
      </motion.div>

      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transform transition duration-200"
        whileHover={{ scale: 1.1 }}
      >
        <FiPlus size={20} />
      </motion.button>
    </div>
  );
};

const AccountCard = ({ title, amount, description, action, bgColor, textColor }) => (
  <motion.div
    className={`${bgColor} ${textColor} p-4 rounded-xl shadow-md hover:scale-105 transform transition duration-200`}
    whileHover={{ scale: 1.05 }}
  >
    <h2 className="text-sm font-semibold">{title}</h2>
    {amount && <p className="mt-2 font-bold text-xl">{amount}</p>}
    {description && <p className="text-xs mt-3">{description}</p>}
    {action && (
      <button className="mt-3 bg-white text-sm px-4 py-2 rounded-lg shadow">
        {action}
      </button>
    )}
  </motion.div>
);

const SearchBar = () => (
  <div className="bg-white dark:bg-gray-700 flex items-center px-4 py-3 mb-6 rounded-xl shadow-md">
    <input
      type="text"
      placeholder="Search by Name"
      className="w-full outline-none text-sm bg-transparent dark:text-gray-200"
    />
    <button className="text-blue-500 ml-4 flex items-center">
      <FiFilter className="mr-1" /> Filters
    </button>
  </div>
);

const TransactionList = ({ transactions, isLoading }) => (
  <div className="space-y-4">
    {isLoading
      ? Array(4)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="h-14 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse"
            ></div>
          ))
      : transactions.map((transaction, index) => (
          <motion.div
            key={index}
            className="flex justify-between items-center bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md hover:shadow-lg transform transition duration-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`${
                  transaction.type === "credit" ? "bg-green-500" : "bg-red-500"
                } w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold`}
              >
                {transaction.name[0]}
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
                  {transaction.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {transaction.date}
                </p>
              </div>
            </div>
            <div
              className={`font-bold text-lg ${
                transaction.type === "credit" ? "text-green-500" : "text-red-500"
              }`}
            >
              {transaction.amount}
            </div>
          </motion.div>
        ))}
  </div>
);

const LoansContent = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
    <Card title="Personal Loan" amount="₹5,00,000" />
    <Card title="Get Credit" amount="Best Rates" />
  </div>
);

const InvestmentsContent = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
    <Card title="Mutual Funds" amount="₹1,50,000" />
    <Card title="Stocks" amount="₹2,30,000" />
  </div>
);

const InsuranceContent = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
    <Card title="Health Insurance" amount="₹15,000/yr | Active" />
    <Card title="Vehicle Insurance" amount="₹8,500/yr | Renew Soon" />
  </div>
);

export default BalanceHistory;

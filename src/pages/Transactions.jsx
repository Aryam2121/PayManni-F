import React from "react";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { Tooltip } from "react-tooltip";

const Transactions = () => {
  const transactions = [
    { id: 1, date: "2024-12-25", amount: 500, type: "Debit" },
    { id: 2, date: "2024-12-20", amount: 1000, type: "Credit" },
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto bg-gradient-to-r from-blue-50 via-indigo-100 to-purple-200 shadow-xl rounded-xl">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Transactions</h2>
      
      <ul className="space-y-6">
        {transactions.map((txn) => (
          <li
            key={txn.id}
            className="flex justify-between items-center p-5 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-105 duration-300 ease-in-out"
          >
            <div className="flex items-center space-x-3">
              {txn.type === "Debit" ? (
                <AiOutlineArrowDown className="text-red-500 text-3xl transition-all duration-200" />
              ) : (
                <AiOutlineArrowUp className="text-green-500 text-3xl transition-all duration-200" />
              )}
              <span className="text-lg font-semibold text-gray-700">{txn.date}</span>
            </div>

            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-white text-sm ${txn.type === "Debit" ? "bg-red-500" : "bg-green-500"}`}
              >
                {txn.type}
              </span>
              <span
                className={`text-2xl font-bold ${txn.type === "Debit" ? "text-red-500" : "text-green-500"}`}
              >
                ₹{txn.amount.toLocaleString()}
              </span>
            </div>
            
            <Tooltip content={`Transaction Date: ${txn.date}, Amount: ₹${txn.amount.toLocaleString()}`} placement="top">
              <button className="text-gray-500 hover:text-gray-800 transition-all duration-200">
                <i className="fas fa-info-circle text-xl" />
              </button>
            </Tooltip>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;

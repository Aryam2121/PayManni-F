import React from "react";

const Transactions = () => {
  const transactions = [
    { id: 1, date: "2024-12-25", amount: 500, type: "Debit" },
    { id: 2, date: "2024-12-20", amount: 1000, type: "Credit" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Transactions</h2>
      <ul className="mt-4">
        {transactions.map((txn) => (
          <li
            key={txn.id}
            className="flex justify-between border-b py-2"
          >
            <span>{txn.date}</span>
            <span>{txn.type}</span>
            <span>₹{txn.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;

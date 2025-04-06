// components/TransactionPIN.jsx
import { useState } from "react";

export default function TransactionPIN({ onSubmit }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (pin.length !== 4) {
      setError("PIN must be exactly 4 digits.");
    } else {
      setError("");
      onSubmit(pin); // send pin to backend
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg max-w-sm mx-auto">
      <h3 className="text-lg font-bold mb-3 text-zinc-800 dark:text-white">
        Enter Transaction PIN
      </h3>
      <input
        type="password"
        maxLength={4}
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-white mb-2"
        placeholder="••••"
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
      >
        Confirm Payment
      </button>
    </div>
  );
}

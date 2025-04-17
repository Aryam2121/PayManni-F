import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FiTrash2, FiUserPlus, FiDollarSign } from "react-icons/fi";

const GroupPaymentSplit = () => {
  const [amount, setAmount] = useState(0);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [newUser, setNewUser] = useState("");
  const [error, setError] = useState("");
  const [walletBalance, setWalletBalance] = useState(null);
  const { user } = useAuth();
  const userId = user?._id || localStorage.getItem("userId");

  const API_URL = `https://${import.meta.env.VITE_BACKEND}/api`;

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${API_URL}/groups`);
      setGroups(res.data);
    } catch (error) {
      console.error("Error fetching groups", error);
    }
  };

  const createGroup = async () => {
    if (!newGroupName.trim() || !amount) return;
    try {
      await axios.post(`${API_URL}/create-group`, {
        name: newGroupName,
        totalAmount: amount,
        userId,
      });
      setNewGroupName("");
      setAmount(0);
      fetchGroups();
    } catch (error) {
      console.error("Error creating group", error);
    }
  };

  const addUserToGroup = async () => {
    if (!selectedGroup || !newUser.trim()) return;
    try {
      await axios.post(`${API_URL}/add-user`, {
        groupId: selectedGroup._id,
        userName: newUser,
      });
      setNewUser("");
      fetchGroups();
    } catch (error) {
      console.error("Error adding user", error);
    }
  };

  const removeUserFromGroup = async (userName) => {
    try {
      await axios.post(`${API_URL}/remove-user`, {
        groupId: selectedGroup._id,
        userName,
      });
      fetchGroups();
    } catch (error) {
      console.error("Error removing user", error);
    }
  };

 // Split Payments logic
const splitPayments = async () => {
  if (selectedGroup && selectedGroup._id) {
    try {
      await axios.post(`${API_URL}/split-payment`, {
        groupId: selectedGroup._id,
      });
      fetchGroups(); // Reload the groups after splitting payment
    } catch (error) {
      console.error("Error splitting payment", error);
    }
  } else {
    console.error("Selected group is not valid:", selectedGroup);
  }
};

// useEffect to call splitPayments when selectedGroup changes
useEffect(() => {
  if (selectedGroup) {
    splitPayments();
  }
}, [selectedGroup]); // This effect runs only when selectedGroup changes


const createRazorpayOrder = async (userName, group) => {
  try {
    const { data } = await axios.post(`${API_URL}/create-order`, {
      groupId: group._id,
      userName,
    });

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: "INR",
      name: "Group Split",
      description: `Payment for ${group.name}`,
      order_id: data.order.id,
      handler: async (response) => {
        verifyPayment(response, userName, "razorpay");
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: {
        color: "#6366f1",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Error creating order", error);
  }
};

  const verifyPayment = async (response, userName, method) => {
    try {
      await axios.post(`${API_URL}/verify-payment`, {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        groupId: selectedGroup._id,
        userName,
        method,
      });
      fetchGroups();
      alert("Payment successful!");
    } catch (error) {
      console.error("Payment verification failed", error);
    }
  };

  const payWithWallet = async (userName) => {
    try {
      const res = await axios.post(`${API_URL}/checkWalletBalance`, {
        groupId: selectedGroup._id,
        userName,
      });

      if (res.data.canPayWithWallet) {
        await verifyPayment({}, userName, "wallet");
      } else {
        alert(res.data.message || "Wallet payment not possible");
      }
    } catch (error) {
      console.error("Wallet error", error);
    }
  };

  const viewGroupTransactions = async () => {
    try {
      const res = await axios.get(`${API_URL}/group-transactions/${selectedGroup._id}`);
      console.log("Group Transactions:", res.data.transactions);
      // You can display these in a modal or table
    } catch (error) {
      console.error("Fetching group transactions failed", error);
    }
  };

  return (
    <div className="p-6  bg-gradient-to-br from-gray-900 via-gray-950 to-black min-h-screen text-white">
      <h2 className="text-4xl font-bold mb-8 text-center text-indigo-400 drop-shadow-md">
        💸 Group Payment Split
      </h2>

      {/* Create Group Inputs */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-black/20 p-4 rounded-xl backdrop-blur-md border border-gray-700">
        <input
          type="text"
          placeholder="New Group Name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="input input-bordered w-full md:w-1/3 bg-gray-800 text-white border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          placeholder="Total Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input input-bordered w-full md:w-1/3 bg-gray-800 text-white border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={createGroup}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 transform transition shadow-lg hover:shadow-indigo-500/50"
        >
          Create Group
        </button>
      </div>

      {/* Group Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div
            key={group._id}
            className={`p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 bg-black/30 shadow-xl hover:scale-[1.02] hover:shadow-indigo-500/30 ${
              selectedGroup?._id === group._id
                ? "border-indigo-500"
                : "border-gray-700"
            }`}
          >
            <h3 className="text-2xl font-semibold text-indigo-300 mb-1">
              {group.name}
            </h3>
            <p className="text-sm text-gray-400">Total: ₹{group.totalAmount}</p>

            {/* Member List */}
            <div className="mt-4">
              <p className="text-gray-300 mb-1 font-medium">Members:</p>
              <ul className="text-sm space-y-2">
                {group.members.map((member, index) => (
                 <li
                 key={index}
                 className="flex justify-between items-center bg-gray-800/70 border border-gray-700 px-4 py-3 rounded-xl shadow hover:shadow-md transition-all"
               >
                 <div>
                   <p className="text-white font-medium">{member.name}</p>
                   <p className="text-sm text-gray-400">₹{member.payment}</p>
                 </div>
               
                 <div className="flex gap-3 items-center">
                 <button
  onClick={() => {
    setSelectedGroup(group); // optional if you still want to keep track in UI
    createRazorpayOrder(member.name, group);
  }}
  className="text-green-400 hover:text-green-300 text-xs font-semibold hover:underline transition"
>
  Razorpay
</button>

                   <button
                     onClick={() => {
                       setSelectedGroup(group);
                       payWithWallet(member.name);
                     }}
                     className="text-blue-400 hover:text-blue-300 text-xs font-semibold hover:underline transition"
                   >
                     Wallet
                   </button>
                   <FiTrash2
  className="text-red-500 cursor-pointer hover:text-red-400"
  onClick={() => {
    setSelectedGroup(group); // ensure selectedGroup is correctly set
    // Using setTimeout to ensure the state is updated first
    setTimeout(() => {
      // Check if selectedGroup is valid before calling removeUserFromGroup
      if (selectedGroup && selectedGroup._id) {
        removeUserFromGroup(member.name);
      } else {
        console.error("selectedGroup is not valid:", selectedGroup);
      }
    }, 0); // Execute after the state update
  }}
/>

                 </div>
               </li>
               
                ))}
              </ul>
            </div>

            {/* Add & Split Actions */}
            <div className="mt-5 flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Add Member"
                value={selectedGroup?._id === group._id ? newUser : ""}
                onChange={(e) => {
                  setSelectedGroup(group);
                  setNewUser(e.target.value);
                }}
                className="input input-sm input-bordered bg-gray-800 text-white border-indigo-500 rounded-lg"
              />
              <button
                onClick={addUserToGroup}
                className="btn btn-sm bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white rounded-md hover:scale-105 transition shadow-md"
              >
                <FiUserPlus />
              </button>
              <button
  onClick={() => {
    setSelectedGroup(group); // This will trigger the useEffect to call splitPayments
  }}
  className="btn btn-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md hover:scale-105 transition shadow-md"
>
  <FiDollarSign className="mr-1" /> Split
</button>
              <button
                onClick={() => {
                  setSelectedGroup(group);
                  viewGroupTransactions();
                }}
                className="btn btn-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md hover:scale-105 transition shadow-md"
              >
                Transactions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupPaymentSplit;
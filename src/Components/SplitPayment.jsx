import React, { useState, useEffect } from "react";
import { FiDollarSign, FiUserPlus, FiTrash2 } from "react-icons/fi";
import axios from "axios";

const GroupPaymentSplit = () => {
  const [amount, setAmount] = useState(0);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [newUser, setNewUser] = useState("");

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
    if (!newGroupName.trim()) return;
    try {
      await axios.post(`${API_URL}/create-group`, {
        name: newGroupName,
        totalAmount: amount,
      });
      setNewGroupName("");
      fetchGroups();
    } catch (error) {
      console.error("Error creating group", error);
    }
  };

  const addUserToGroup = async () => {
    if (selectedGroup === null || !newUser.trim()) return;
    try {
      await axios.post(`${API_URL}/add-user`, {
        groupId: selectedGroup,
        userName: newUser,
      });
      setNewUser("");
      fetchGroups();
    } catch (error) {
      console.error("Error adding user", error);
    }
  };

  const removeUserFromGroup = async (groupId, userName) => {
    try {
      await axios.post(`${API_URL}/remove-user`, { groupId, userName });
      fetchGroups();
    } catch (error) {
      console.error("Error removing user", error);
    }
  };

  const updateUserPayment = async (groupId, userName, payment) => {
    try {
      await axios.post(`${API_URL}/update-payment`, {
        groupId,
        userName,
        payment,
      });
      fetchGroups();
    } catch (error) {
      console.error("Error updating payment", error);
    }
  };

  const splitPayment = async () => {
    if (!selectedGroup) return;
    try {
      await axios.post(`${API_URL}/split-payment`, {
        groupId: selectedGroup,
      });
      alert("Payment split successfully!");
      fetchGroups();
    } catch (error) {
      console.error("Error splitting payment", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6 transition-transform transform hover:scale-105">
        <h2 className="text-3xl font-bold text-gray-100 mb-6 text-center">
          Group Payment Split
        </h2>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="text-lg font-medium text-gray-300">Enter Amount</label>
          <div className="flex items-center border border-gray-600 rounded-lg p-3 mt-2 focus-within:border-blue-500 bg-gray-700">
            <FiDollarSign className="text-gray-400 text-xl" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="Amount"
              className="w-full p-2 outline-none border-none bg-gray-700 text-gray-200"
            />
          </div>
        </div>

        {/* Create Group */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-300 mb-3">Create Group</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Group Name"
              className="p-2 flex-1 border-2 border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={createGroup}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              Create
            </button>
          </div>
        </div>

        {/* List Groups */}
        {groups.map((group) => (
          <div key={group._id} className="bg-gray-700 p-4 rounded-lg shadow-md mb-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-100">{group.name}</h4>
              <button
                onClick={() => setSelectedGroup(group._id)}
                className={`px-4 py-2 rounded-md shadow-md transition ${
                  selectedGroup === group._id ? "bg-green-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {selectedGroup === group._id ? "Selected" : "Select Group"}
              </button>
            </div>

            {/* Members Section */}
            {selectedGroup === group._id && (
              <div className="mt-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                    placeholder="Add User"
                    className="p-2 flex-1 border-2 border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addUserToGroup}
                    className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition duration-300"
                  >
                    <FiUserPlus className="inline-block mr-1" /> Add
                  </button>
                </div>

                {/* List Users */}
                <div className="mt-4">
                  {group.members.map((user, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-800 p-3 rounded-md shadow-sm mb-2">
                      <span className="text-gray-300">{user.name}</span>
                      <input
                        type="number"
                        value={user.payment}
                        onChange={(e) => updateUserPayment(group._id, user.name, e.target.value)}
                        placeholder="Payment"
                        className="p-2 w-24 border-2 border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeUserFromGroup(group._id, user.name)}
                        className="text-red-400 hover:text-red-600 transition duration-200"
                      >
                        <FiTrash2 className="text-xl" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Payment Split Info */}
                <div className="mt-4 text-center">
                  <span className="text-lg font-medium text-gray-300">Amount per person:</span>
                  <span className="text-lg font-semibold text-gray-100">
                    ${((amount || 0) / (group.members.length || 1)).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Final Split Payment Button */}
        <div className="text-center mt-6">
          <button
            onClick={splitPayment}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg w-full shadow-lg hover:bg-indigo-700 transition duration-300"
          >
            Finalize Payment Split
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupPaymentSplit;

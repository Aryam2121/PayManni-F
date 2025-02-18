import React, { useState, useEffect } from "react";
import { FiDollarSign, FiUserPlus, FiTrash2 } from "react-icons/fi";
import { AiOutlineCheckCircle } from "react-icons/ai";
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
  
  console.log(groups);  // Log groups to check if it's correctly updated
  
  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${API_URL}/all`);
      console.log("Fetched groups:", res.data);  // Log the response data
      setGroups(res.data);
    } catch (error) {
      console.error("Error fetching groups", error);
    }
  };
  

  const createGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      await axios.post(`${API_URL}/create`, {
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
  
    // Ensure the group exists in the groups array
    const group = groups.find(g => g._id === selectedGroup);
    if (!group) {
      console.error("Group not found!");
      return;
    }
  
    try {
      await axios.post(`${API_URL}/add-user`, {
        groupId: group._id,  // Now using the group from the array
        userName: newUser
      });
      setNewUser(""); // Clear the user input field
      fetchGroups(); // Refresh the groups after adding the user
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
    if (selectedGroup === null) return;
    try {
      await axios.post(`${API_URL}/split-payment`, {
        groupId: groups[selectedGroup]._id,
      });
      alert("Payment split successfully!");
      fetchGroups();
    } catch (error) {
      console.error("Error splitting payment", error);
    }
  };

  const handleAmountChange = (e) => setAmount(parseFloat(e.target.value) || 0);
  const handleNewGroupNameChange = (e) => setNewGroupName(e.target.value);
  const handleNewUserChange = (e) => setNewUser(e.target.value);

  const handlePaymentChange = (userIndex, groupId, payment) => {
    setGroups((prevGroups) => {
      return prevGroups.map((group) => {
        if (group._id === groupId) {
          return {
            ...group,
            members: group.members.map((member, mIdx) =>
              mIdx === userIndex ? { ...member, payment } : member
            ),
          };
        }
        return group;
      });
    });

    // Update payment in the backend
    updateUserPayment(groupId, groups[selectedGroup]?.members[userIndex]?.name, payment);
  };

  const calculateSharePerGroup = (groupId) => {
    const group = groups.find((g) => g._id === groupId);
    if (!group || group.members.length === 0 || !amount) return 0;
    return (parseFloat(amount) / group.members.length).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Group Payment Split
        </h2>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="text-xl font-medium text-gray-700 mb-2">
            Enter Amount
          </label>
          <div className="flex items-center border-2 border-gray-300 rounded-lg p-3 transition duration-200 ease-in-out hover:border-blue-500">
            <FiDollarSign className="text-gray-600 text-xl" />
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Amount"
              className="w-full p-2 outline-none border-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Group Creation */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-gray-700">Create Group</h3>
            <input
              type="text"
              value={newGroupName}
              onChange={handleNewGroupNameChange}
              placeholder="Group Name"
              className="p-2 w-60 border-2 border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={createGroup}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              Create Group
            </button>
          </div>

          {/* List Groups */}
          {groups.map((group) => (
  <div key={group._id} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
    <div className="flex justify-between items-center">
      <h4 className="text-xl font-semibold text-gray-800">{group.name}</h4>
      <button
  onClick={() => setSelectedGroup(group._id)}
  className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition duration-300"
>
  {selectedGroup === group._id ? "Selected" : "Select Group"}
</button>

    </div>

    {selectedGroup === group._id && (
      <div className="mt-4">
        {/* Log members array for debugging */}
        <pre>{JSON.stringify(group.members, null, 2)}</pre>

        <input
          type="text"
          value={newUser}
          onChange={handleNewUserChange}
          placeholder="Add User"
          className="p-2 w-60 border-2 border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addUserToGroup}
          className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition duration-300"
        >
          Add User
        </button>

        {/* List of Users in the group */}
        <div className="mt-4">
          {group.members.map((user, userIndex) => (
            <div
              key={userIndex}
              className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm mb-2"
            >
              <span>{user.name}</span>
              <input
                type="number"
                value={user.payment}
                onChange={(e) =>
                  handlePaymentChange(userIndex, group._id, e.target.value)
                }
                placeholder="Enter Payment"
                className="p-2 w-32 border-2 border-gray-300 rounded-md"
              />
              <button
                onClick={() => removeUserFromGroup(group._id, user.name)}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash2 className="text-xl" />
              </button>
            </div>
          ))}
        </div>

        {/* Payment Split */}
        <div className="mt-4 text-center">
          <span className="text-xl font-medium text-gray-700">
            Amount per person:
          </span>
          <span className="text-xl font-semibold text-gray-800">
            {" "}
            ${calculateSharePerGroup(group._id)}
          </span>
        </div>
      </div>
    )}
  </div>
))}

        </div>

        {/* Final Payment Split Button */}
        <div className="text-center mt-8">
          <button
            onClick={splitPayment}
            className="px-8 py-4 bg-indigo-600 text-white rounded-lg w-full shadow-lg hover:bg-indigo-700 transition duration-300"
          >
            Finalize Payment Split
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupPaymentSplit;

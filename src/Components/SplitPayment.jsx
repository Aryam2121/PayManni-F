import React, { useState } from "react";
import { FiDollarSign, FiUserPlus, FiTrash2 } from "react-icons/fi";
import { AiOutlineCheckCircle } from "react-icons/ai";

const GroupPaymentSplit = () => {
  const [amount, setAmount] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [newUser, setNewUser] = useState("");
  const [userPayments, setUserPayments] = useState({});

  const handleAmountChange = (e) => setAmount(e.target.value);

  const handleNewGroupNameChange = (e) => setNewGroupName(e.target.value);
  const handleNewUserChange = (e) => setNewUser(e.target.value);

  const addGroup = () => {
    if (newGroupName.trim()) {
      setGroups([...groups, { name: newGroupName, members: [] }]);
      setNewGroupName("");
    }
  };

  const addUserToGroup = () => {
    if (selectedGroup !== null && newUser.trim()) {
      const updatedGroups = [...groups];
      updatedGroups[selectedGroup].members.push({ name: newUser, paid: false, payment: "" });
      setGroups(updatedGroups);
      setNewUser("");
    }
  };

  const handlePaymentChange = (userIndex, groupIndex, payment) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].members[userIndex].payment = payment;
    setGroups(updatedGroups);
  };

  const removeUserFromGroup = (groupIndex, user) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].members = updatedGroups[groupIndex].members.filter(
      (member) => member.name !== user
    );
    setGroups(updatedGroups);
  };

  const calculateSharePerGroup = (groupIndex) => {
    const totalMembers = groups[groupIndex].members.length;
    if (totalMembers === 0 || !amount) return 0;
    return (parseFloat(amount) / totalMembers).toFixed(2);
  };

  const handlePaymentSplit = () => {
    if (amount > 0 && groups.length > 0) {
      alert("Payment split successfully!");
    } else {
      alert("Please provide an amount and create at least one group.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Group Payment Split</h2>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="text-xl font-medium text-gray-700 mb-2">Enter Amount</label>
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
              onClick={addGroup}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              Create Group
            </button>
          </div>

          {/* List Groups */}
          {groups.map((group, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4 hover:shadow-md transition-all">
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-semibold text-gray-800">{group.name}</h4>
                <button
                  onClick={() => setSelectedGroup(index)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition duration-300"
                >
                  {selectedGroup === index ? "Selected" : "Select Group"}
                </button>
              </div>

              {selectedGroup === index && (
                <div className="mt-4">
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
                      <div key={userIndex} className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm mb-2">
                        <span>{user.name}</span>
                        <input
                          type="number"
                          value={user.payment}
                          onChange={(e) => handlePaymentChange(userIndex, index, e.target.value)}
                          placeholder="Enter Payment"
                          className="p-2 w-32 border-2 border-gray-300 rounded-md"
                        />
                        <button
                          onClick={() => removeUserFromGroup(index, user.name)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 className="text-xl" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Payment Split */}
                  <div className="mt-4 text-center">
                    <span className="text-xl font-medium text-gray-700">Amount per person:</span>
                    <span className="text-xl font-semibold text-gray-800"> ${calculateSharePerGroup(index)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Final Payment Split Button */}
        <div className="text-center mt-8">
          <button
            onClick={handlePaymentSplit}
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

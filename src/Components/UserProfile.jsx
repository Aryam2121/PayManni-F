import { apiUrl, getAuthHeaders, getUserId } from "../utils/authStorage";
import React, { useState, useEffect } from "react";
import { FiEdit, FiLock, FiUserCheck, FiCamera } from "react-icons/fi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { Tab } from "@headlessui/react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import boy from "../assets/boy.png"

import { useNavigate } from "react-router-dom";
import PageShell from "./layout/PageShell";
import { formatCurrency } from "../utils/format";
import { toast } from "react-toastify";

const UserProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
    profilePicture: "",
    upiId: "",
    balance: 0,
    linkedAccounts: [],
    transactions: [],
  });

  const [editing, setEditing] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [kycProgress, setKycProgress] = useState(60);

  const tabs = ["Dashboard", "UPI QR Code", "Payments", "Orders", "Help & Support"];
  const { user } = useAuth();
  const { darkMode } = useTheme();

  const userId = getUserId();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(apiUrl(`/api/myaccount/${userId}`), {
          headers: getAuthHeaders(),
        });

        const { name, phone, email, profilePicture, upiId, balance, linkedAccounts, transactions } = res.data;
        setProfile({
          name: name || user?.name || "",
          phone: phone || user?.phoneNumber || "",
          email: email || user?.email || "",
          profilePicture: profilePicture || "",
          upiId: upiId || user?.upi || "",
          balance: balance ?? 0,
          linkedAccounts: linkedAccounts || [],
          transactions: transactions || [],
        });
      } catch (err) {
        console.error("Failed to fetch user profile", err);
        setProfile((p) => ({
          ...p,
          name: user?.name || "",
          email: user?.email || "",
          upiId: user?.upi || "",
        }));
      }
    };

    fetchUserData();
  }, [userId, user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSaveProfile = async () => {
    if (!userId) return;
    try {
      await axios.put(apiUrl(`/api/edituser/${userId}`), {
        name: profile.name,
        email: profile.email,
        upiId: profile.upiId,
      }, { headers: getAuthHeaders() });
      setEditing(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Could not update profile");
    }
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({
        ...profile,
        profilePicture: URL.createObjectURL(file),
      });
    }
  };

  const startKYCProcess = () => {
    setKycProgress((prev) => (prev < 100 ? prev + 25 : 100));
  };

  const handlePasswordSubmit = () => {
    if (password === confirmPassword) {
      alert("Password updated successfully!");
      setPasswordModal(false);
    } else {
      alert("Passwords do not match. Please try again.");
    }
  };

  const renderDashboard = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Dashboard Overview</h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="bg-indigo-100 p-4 rounded-lg shadow text-center text-black">
          <p className="text-lg font-medium">Wallet Balance</p>
          <p className="text-xl font-bold">₹{profile.balance}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow text-center text-black">
          <p className="text-lg font-medium">Rewards</p>
          <p className="text-xl font-bold">120 Points</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow text-center text-black">
          <p className="text-lg font-medium">Pending Payments</p>
          <p className="text-xl font-bold">$50</p>
        </div>
        <div
          className="bg-purple-100 p-4 rounded-lg shadow text-center text-black cursor-pointer hover:bg-purple-200 transition"
          onClick={() => navigate("/kyc-form/new")}
        >
          <p className="text-lg font-medium">KYC Status</p>
          <p className="text-xl font-bold">{kycProgress >= 100 ? "Verified" : "Pending"}</p>
        </div>
      </div>
    </div>
  );

  const renderUPIQRCode = () => (
    <div className="text-center">
      <h3 className="text-xl font-semibold mb-4">Your UPI QR Code</h3>
      <QRCodeCanvas
  value={`upi://pay?pa=${profile.upiId || "yourupi@upi"}&pn=${encodeURIComponent(profile.name)}&am=0&cu=INR`}
  size={200}
/>
      <p className="text-gray-500 mt-4">Scan to pay {profile.name} via UPI</p>
    </div>
  );

  const renderPayments = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Linked Bank Accounts</h3>
      {profile.linkedAccounts.length === 0 ? (
        <p className="text-gray-400">No linked bank accounts found.</p>
      ) : (
        <ul className="space-y-4">
          {profile.linkedAccounts.map((account) => (
            <li
              key={account._id}
              className="bg-gray-700 p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-white">{account.bankName}</p>
                <p className="text-gray-300">{account.accountNumberMasked}</p>
              </div>
              <FiLock size={20} className="text-indigo-400" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  

  const renderOrders = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
      {profile.transactions.length === 0 ? (
        <p className="text-gray-400">No transactions found.</p>
      ) : (
        <ul className="space-y-3">
          {profile.transactions.map((txn) => (
            <li
              key={txn._id}
              className="bg-gray-700 p-4 rounded-lg shadow flex justify-between"
            >
              <div>
                <p className="font-medium">{txn.description}</p>
                <p className="text-sm text-gray-300">{txn.date}</p>
              </div>
              <div className={`text-lg font-bold ${txn.type === "debit" ? "text-red-400" : "text-green-400"}`}>
                {txn.type === "debit" ? "-" : "+"} ₹{txn.amount}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  

  const renderHelp = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Help & Support</h3>
      <p className="text-gray-500">Choose an option below:</p>
      <ul className="mt-4 space-y-2">
        <li><button className="text-blue-500 underline">FAQ</button></li>
        <li><button className="text-blue-500 underline">Contact Support</button></li>
        <li><button className="text-blue-500 underline">Submit an Issue</button></li>
      </ul>
    </div>
  );

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      darkMode
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
        : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900"
    }`}>
      <div className={`max-w-4xl mx-auto rounded-lg shadow-md p-6 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}>
        <h2 className="text-2xl font-semibold text-center mb-6">User Profile & Settings</h2>

        <Tab.Group>
        <Tab.List className="flex space-x-2 pb-2 mb-4 overflow-x-auto scrollbar-hide">
  {tabs.map((tab) => (
    <Tab
      key={tab}
      className={({ selected }) =>
        `px-4 py-2 rounded-full transition font-medium whitespace-nowrap ${
          selected
            ? "bg-indigo-500 text-white shadow"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        }`
      }
    >
      {tab}
    </Tab>
  ))}
</Tab.List>


          <Tab.Panels>
            <Tab.Panel>{renderDashboard()}</Tab.Panel>
            <Tab.Panel>{renderUPIQRCode()}</Tab.Panel>
            <Tab.Panel>{renderPayments()}</Tab.Panel>
            <Tab.Panel>{renderOrders()}</Tab.Panel>
            <Tab.Panel>{renderHelp()}</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        {/* Profile Section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
          <div className="flex items-center mb-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <img
                src={boy}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <label htmlFor="profilePicture" className="absolute bottom-0 right-0 p-2 bg-white rounded-full cursor-pointer">
                <FiCamera className="text-gray-700" size={20} />
              </label>
              <input
                type="file"
                id="profilePicture"
                className="hidden"
                onChange={handleProfilePictureUpload}
              />
            </div>
            <div className="ml-4">
              {editing ? (
                <>
                  <input type="text" name="name" value={profile.name} onChange={handleProfileChange} className="border p-2 rounded-lg block mb-2" />
                  <input type="text" name="phone" value={profile.phone} onChange={handleProfileChange} className="border p-2 rounded-lg block mb-2" />
                  <input type="email" name="email" value={profile.email} onChange={handleProfileChange} className="border p-2 rounded-lg block" />
                  <button onClick={handleSaveProfile} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p className="font-medium">{profile.name}</p>
                  <p className="text-gray-400">{profile.phone}</p>
                  <p className="text-gray-400">{profile.email}</p>
                  <button onClick={() => setEditing(true)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
                    <FiEdit size={16} /> Edit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

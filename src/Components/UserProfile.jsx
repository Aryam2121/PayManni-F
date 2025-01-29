import React, { useState } from "react";
import { FiEdit, FiLock, FiUserCheck, FiCamera } from "react-icons/fi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { Tab } from "@headlessui/react";
import * as QRCode from "qrcode.react";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    phone: "+1234567890",
    email: "john.doe@example.com",
    profilePicture: "",
  });

  const [editing, setEditing] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [kycProgress, setKycProgress] = useState(0);

  const tabs = ["Dashboard", "UPI QR Code", "Payments", "Orders", "Help & Support"];

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSaveProfile = () => {
    setEditing(false);
    alert("Profile updated successfully!");
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

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
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
        <div className="bg-indigo-100 p-4 rounded-lg shadow text-center">
          <p className="text-lg font-medium">Wallet Balance</p>
          <p className="text-xl font-bold">$500</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow text-center">
          <p className="text-lg font-medium">Rewards</p>
          <p className="text-xl font-bold">120 Points</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow text-center">
          <p className="text-lg font-medium">Pending Payments</p>
          <p className="text-xl font-bold">$50</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow text-center">
          <p className="text-lg font-medium">KYC Status</p>
          <p className="text-xl font-bold">{kycProgress}%</p>
        </div>
      </div>
    </div>
  );

  const renderUPIQRCode = () => (
    <div className="text-center">
      <h3 className="text-xl font-semibold mb-4">Your UPI QR Code</h3>
      <QRCode value="upi://pay?pa=johndoe@upi&pn=John%20Doe&am=0&cu=INR" size={200} />
      <p className="text-gray-500 mt-4">Scan to pay John Doe via UPI</p>
    </div>
  );

  const renderPayments = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Payment Settings</h3>
      <p className="text-gray-500">Manage your payment methods and settings here.</p>
      <div className="mt-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
          Add Payment Method
        </button>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Order History</h3>
      <p className="text-gray-500">View your past orders and bookings below:</p>
      <ul className="mt-4 space-y-2">
        <li className="border p-4 rounded-lg shadow">
          <p className="font-medium">Order #12345</p>
          <p className="text-gray-500">$200 - Completed</p>
        </li>
        <li className="border p-4 rounded-lg shadow">
          <p className="font-medium">Order #12346</p>
          <p className="text-gray-500">$50 - Pending</p>
        </li>
      </ul>
    </div>
  );

  const renderHelp = () => (
    <div>
      <h3 className="text-xl font-semibold mb-4">Help & Support</h3>
      <p className="text-gray-500">Choose an option below:</p>
      <ul className="mt-4 space-y-2">
        <li>
          <button className="text-blue-500 underline">FAQ</button>
        </li>
        <li>
          <button className="text-blue-500 underline">Contact Support</button>
        </li>
        <li>
          <button className="text-blue-500 underline">Submit an Issue</button>
        </li>
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          User Profile & Settings
        </h2>

        {/* Tab Navigation */}
        <Tab.Group>
          <Tab.List className="flex space-x-2 border-b pb-2 mb-4">
            {tabs.map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  `px-4 py-2 rounded-t-lg font-medium ${
                    selected
                      ? "bg-indigo-500 text-white"
                      : "text-gray-700 bg-gray-100"
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
                src={profile.profilePicture || "https://via.placeholder.com/150"}
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
            {editing ? (
              <div className="ml-4">
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="border p-2 rounded-lg"
                />
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  className="border p-2 rounded-lg mt-2"
                />
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="border p-2 rounded-lg mt-2"
                />
                <button
                  onClick={handleSaveProfile}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="ml-4">
                <p className="font-medium">{profile.name}</p>
                <p className="text-gray-500">{profile.phone}</p>
                <p className="text-gray-500">{profile.email}</p>
                <button
                  onClick={() => setEditing(true)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                >
                  <FiEdit size={16} /> Edit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

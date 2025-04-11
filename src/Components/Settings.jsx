import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Moon,
  Bell,
  User,
  ShieldCheck,
  Save,
  UploadCloud,
} from "lucide-react";
import boy from "../assets/boy.png";
import { useAuth } from "../context/AuthContext";

export default function EnhancedSettingsPage() {
  const { user } = useAuth();
  const userId = user?._id || localStorage.getItem("userId");

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    upiId: "",
  });

  // 🔃 Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://${import.meta.env.VITE_BACKEND}/api/myaccount/${userId}`);
        setFormData({
          name: res.data.name,
          email: res.data.email,
          upiId: res.data.upiId || "",
        });
        if (res.data.profileImage) {
          setAvatar(res.data.profileImage);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, [userId]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
      setFormData({ ...formData, profileImage: url }); // Optional field
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`https://${import.meta.env.VITE_BACKEND}/api/edituser/${userId}`, formData);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Something went wrong while saving.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 dark:from-gray-900 dark:to-gray-800 p-6 transition-all">
      <div className="max-w-5xl mx-auto backdrop-blur-md bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl p-10">
        <h1 className="text-4xl font-extrabold text-white dark:text-white mb-10">
          ⚙️ User Settings
        </h1>

        {/* Avatar */}
        <div className="flex items-center space-x-6 mb-10">
          <img
            src={avatar || boy}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
          />
          <label className="flex items-center space-x-2 cursor-pointer text-sm font-medium text-blue-600 hover:underline">
            <UploadCloud className="w-5 h-5" />
            <span>Change Avatar</span>
            <input type="file" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="text-sm font-semibold">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mt-1 px-4 py-2 rounded-xl bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full mt-1 px-4 py-2 rounded-xl bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold">UPI ID</label>
            <input
              type="text"
              value={formData.upiId}
              onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              placeholder="e.g., username@bank"
              className="w-full mt-1 px-4 py-2 rounded-xl bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="flex items-center justify-between bg-white dark:bg-gray-700 p-4 rounded-xl shadow">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Enable Notifications</span>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-md"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
          </div>

          <div className="flex items-center justify-between bg-white dark:bg-gray-700 p-4 rounded-xl shadow">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-purple-500" />
              <span className="font-medium">Dark Mode</span>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-md"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          </div>
        </div>

        {/* Accordion-Like Panel */}
        <div className="space-y-4 mb-10">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow flex justify-between items-center">
            <div className="flex items-center gap-3">
              <User className="text-green-500" />
              <span className="font-medium">Account Preferences</span>
            </div>
            <button className="text-sm text-blue-600 hover:underline">Edit</button>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-yellow-500" />
              <span className="font-medium">Security & Privacy</span>
            </div>
            <button className="text-sm text-blue-600 hover:underline">Manage</button>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={handleSave}
            className="px-8 py-3 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

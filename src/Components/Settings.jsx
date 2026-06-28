import React, { useState, useEffect } from "react";
import axios from "axios";
import { Moon, Bell, Save, UploadCloud } from "lucide-react";
import { toast } from "react-toastify";
import boy from "../assets/boy.png";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { apiUrl, getAuthHeaders, getUserId, getUserUpi } from "../utils/authStorage";
import PageShell from "./layout/PageShell";

export default function EnhancedSettingsPage() {
  const { user, setUser } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const userId = getUserId();

  const [notifications, setNotifications] = useState(
    () => localStorage.getItem("paymanni_notifications") !== "false"
  );
  const [avatar, setAvatar] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", upiId: "" });

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(apiUrl(`/api/myaccount/${userId}`), {
          headers: getAuthHeaders(),
        });
        setFormData({
          name: res.data.name || user?.name || "",
          email: res.data.email || user?.email || "",
          upiId: res.data.upiId || getUserUpi() || "",
        });
        if (res.data.profileImage) setAvatar(res.data.profileImage);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          upiId: getUserUpi() || "",
        });
      }
    };
    fetchUser();
  }, [userId, user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      await axios.put(apiUrl(`/api/edituser/${userId}`), formData, {
        headers: getAuthHeaders(),
      });
      const updated = { ...user, ...formData, upi: formData.upiId };
      setUser(updated);
      localStorage.setItem("paymanni_user", JSON.stringify(updated));
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  const toggleNotifications = () => {
    const next = !notifications;
    setNotifications(next);
    localStorage.setItem("paymanni_notifications", String(next));
    toast.info(next ? "Notifications enabled" : "Notifications disabled");
  };

  return (
    <PageShell title="Settings" subtitle="Manage your account and preferences">
      <div className="glass-dark rounded-2xl border border-gray-700/50 p-6 sm:p-8 space-y-8">
        <div className="flex items-center gap-5">
          <img
            src={avatar || boy}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-indigo-500/30"
          />
          <label className="flex items-center gap-2 cursor-pointer text-sm text-indigo-400 hover:text-indigo-300">
            <UploadCloud className="w-5 h-5" />
            <span>Change photo</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm text-gray-400">Full name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-400">UPI ID</label>
            <input
              type="text"
              value={formData.upiId}
              onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              placeholder="username@paymanni"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={toggleNotifications}
            className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50 border border-gray-700"
          >
            <span className="flex items-center gap-2 text-sm">
              <Bell className="w-4 h-4 text-blue-400" /> Notifications
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${notifications ? "bg-green-500/20 text-green-400" : "bg-gray-600/30 text-gray-400"}`}>
              {notifications ? "On" : "Off"}
            </span>
          </button>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50 border border-gray-700"
          >
            <span className="flex items-center gap-2 text-sm">
              <Moon className="w-4 h-4 text-purple-400" /> Dark mode
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? "bg-purple-500/20 text-purple-300" : "bg-gray-600/30 text-gray-400"}`}>
              {darkMode ? "On" : "Off"}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold disabled:opacity-60"
        >
          <Save className="w-5 h-5" />
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </PageShell>
  );
}

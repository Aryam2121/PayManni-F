import React, { useState } from "react";
import { FiEdit, FiLock, FiUserCheck, FiCamera } from "react-icons/fi";
import { AiOutlineCheckCircle } from "react-icons/ai";

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

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSaveProfile = () => {
    setEditing(false);
    alert("Profile updated successfully!");
  };

  const handleChangePassword = () => {
    if (password === confirmPassword) {
      setPasswordModal(false);
      alert("Password updated successfully!");
    } else {
      alert("Passwords do not match!");
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          User Profile & Settings
        </h2>

        {/* Profile Management */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Profile Management
          </h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-24 h-24 rounded-full bg-gray-200 overflow-hidden shadow-md">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <FiUserCheck className="text-gray-500 text-4xl mx-auto my-8" />
              )}
              <label
                htmlFor="profilePictureUpload"
                className="absolute bottom-1 right-1 bg-blue-500 text-white p-1 rounded-full cursor-pointer shadow-lg hover:bg-blue-600 transition"
              >
                <FiCamera />
              </label>
              <input
                type="file"
                id="profilePictureUpload"
                className="hidden"
                onChange={handleProfilePictureUpload}
              />
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
              aria-label="Edit Profile"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {editing && (
            <div className="mt-4 space-y-4">
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="Name"
                className="w-full p-2 border border-gray-300 rounded-lg"
                aria-label="Name"
              />
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                placeholder="Phone"
                className="w-full p-2 border border-gray-300 rounded-lg"
                aria-label="Phone"
              />
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded-lg"
                aria-label="Email"
              />
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
                aria-label="Save Profile"
              >
                Save Profile
              </button>
            </div>
          )}
        </div>

        {/* Security Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Security Settings
          </h3>
          <button
            onClick={() => setPasswordModal(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
            aria-label="Change Password"
          >
            Change Password
          </button>

          {passwordModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-md w-96 transform scale-95 hover:scale-100 transition-transform">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Change Password
                </h3>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                  aria-label="New Password"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                  aria-label="Confirm Password"
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleChangePassword}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
                    aria-label="Save Password"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setPasswordModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* KYC Verification */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            KYC Verification
          </h3>
          <p className="text-gray-600 mb-4">
            Complete your KYC to unlock wallet services.
          </p>
          <div className="relative w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all"
              style={{ width: `${kycProgress}%` }}
            ></div>
            <span className="absolute right-0 -top-6 text-indigo-600 text-sm">
              {kycProgress}%
            </span>
          </div>
          <button
            onClick={startKYCProcess}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
            aria-label="Continue KYC"
          >
            {kycProgress === 100 ? (
              <div className="flex items-center gap-2">
                <AiOutlineCheckCircle /> KYC Completed
              </div>
            ) : (
              "Continue KYC"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

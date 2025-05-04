import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
export default function KYCForm() {
      const { user } = useAuth();
      const authToken = user?.token || localStorage.getItem("paymanni_token");
  const [form, setForm] = useState({
    fullName: '',
    dob: '',
    panNumber: '',
    address: '',
    idImage: null,
    selfie: null
  });

  const handleChange = (e) => {
    if (e.target.name === "idImage" || e.target.name === "selfie") {
      setForm({ ...form, [e.target.name]: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Creating FormData to handle file uploads
    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("dob", form.dob);
    formData.append("panNumber", form.panNumber);
    formData.append("address", form.address);
    formData.append("idImage", form.idImage);
    formData.append("selfie", form.selfie);

    try {
      await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authToken}`
        }
      });
      alert("KYC Submitted!");
    } catch (error) {
      alert("Error submitting KYC");
    }
  };

  return (
    <form
  onSubmit={handleSubmit}
  className=" p-8 bg-gray-900 shadow-2xl  text-white"
>
  <h2 className="text-4xl font-bold mb-8 text-center tracking-wide">KYC Verification</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="flex flex-col">
      <label htmlFor="fullName" className="mb-1 text-sm font-medium">
        Full Name
      </label>
      <input
        name="fullName"
        onChange={handleChange}
        value={form.fullName}
        placeholder="e.g. Aryaman Gupta"
        className="p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
      />
    </div>

    <div className="flex flex-col">
      <label htmlFor="dob" className="mb-1 text-sm font-medium">
        Date of Birth
      </label>
      <input
        type="date"
        name="dob"
        onChange={handleChange}
        value={form.dob}
        className="p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="flex flex-col">
      <label htmlFor="panNumber" className="mb-1 text-sm font-medium">
        PAN Number
      </label>
      <input
        name="panNumber"
        onChange={handleChange}
        value={form.panNumber}
        placeholder="ABCDE1234F"
        className="p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 uppercase"
      />
    </div>

    <div className="flex flex-col">
      <label htmlFor="address" className="mb-1 text-sm font-medium">
        Address
      </label>
      <input
        name="address"
        onChange={handleChange}
        value={form.address}
        placeholder="House no, Street, City"
        className="p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
      />
    </div>

    <div className="flex flex-col">
      <label htmlFor="idImage" className="mb-1 text-sm font-medium">
        Upload ID Proof
      </label>
      <input
        type="file"
        name="idImage"
        onChange={handleChange}
        accept=".jpg,.png,.pdf"
        className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
      />
      <span className="text-xs text-gray-400 mt-1">Accepted: JPG, PNG, PDF</span>
    </div>

    <div className="flex flex-col">
      <label htmlFor="selfie" className="mb-1 text-sm font-medium">
        Upload Selfie
      </label>
      <input
        type="file"
        name="selfie"
        onChange={handleChange}
        accept="image/*"
        className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
      />
      <span className="text-xs text-gray-400 mt-1">Upload a recent clear selfie</span>
    </div>
  </div>

  <button
    type="submit"
    className="mt-8 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg rounded-lg hover:opacity-90 transition-all duration-300"
  >
    Submit KYC
  </button>
</form>

  );
}

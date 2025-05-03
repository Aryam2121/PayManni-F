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
    <form onSubmit={handleSubmit} className=" p-8 bg-gray-900 shadow-lg  text-white">
      <h2 className="text-3xl font-semibold mb-8 text-center">KYC Verification</h2>
      
      <div className="space-y-6">
        {/* Full Name Input */}
        <div>
          <label htmlFor="fullName" className="block text-sm mb-1">Full Name</label>
          <input 
            name="fullName" 
            onChange={handleChange} 
            value={form.fullName} 
            placeholder="Enter your full name" 
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        {/* Date of Birth Input */}
        <div>
          <label htmlFor="dob" className="block text-sm mb-1">Date of Birth</label>
          <input 
            name="dob" 
            onChange={handleChange} 
            value={form.dob} 
            placeholder="Enter your Date of Birth" 
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* PAN Number Input */}
        <div>
          <label htmlFor="panNumber" className="block text-sm mb-1">PAN Number</label>
          <input 
            name="panNumber" 
            onChange={handleChange} 
            value={form.panNumber} 
            placeholder="Enter your PAN number" 
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Address Input */}
        <div>
          <label htmlFor="address" className="block text-sm mb-1">Address</label>
          <input 
            name="address" 
            onChange={handleChange} 
            value={form.address} 
            placeholder="Enter your address" 
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ID Image Input */}
        <div>
          <label htmlFor="idImage" className="block text-sm mb-1">Upload ID Proof (e.g., Aadhar, Passport)</label>
          <input 
            type="file" 
            name="idImage" 
            onChange={handleChange} 
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-2">Accepted formats: JPG, PNG, PDF</p>
        </div>

        {/* Selfie Input */}
        <div>
          <label htmlFor="selfie" className="block text-sm mb-1">Upload Selfie</label>
          <input 
            type="file" 
            name="selfie" 
            onChange={handleChange} 
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-2">Please upload a recent selfie</p>
        </div>

        {/* Submit Button */}
        <div>
          <button 
            type="submit" 
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ease-in-out duration-300"
          >
            Submit KYC
          </button>
        </div>
      </div>
    </form>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function KYCAdminPanel() {
     const { user } = useAuth();
          const authToken = user?.token || localStorage.getItem("paymanni_token");
    const [kycs, setKycs] = useState([]); 
  // Fetch KYC data
  useEffect(() => {
    axios.get(`https://${import.meta.env.VITE_BACKEND}/api/admin/all`, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    .then(res => {
      if (Array.isArray(res.data)) {
        setKycs(res.data);
      } else {
        console.error("Expected an array, but got:", res.data);
        setKycs([]);  // Default to empty array if the data is not an array
      }
    })
    .catch(err => {
      console.error("Error fetching KYC data:", err);
      setKycs([]);  // Set to empty array in case of an error
    });
  }, []);


  // Update KYC Status (Approve/Reject)
  const updateStatus = async (id, status) => {
    await axios.patch(`https://${import.meta.env.VITE_BACKEND}/api/admin/status/${id}`, { status }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    setKycs(kycs.map(k => k._id === id ? { ...k, status } : k));
  };
  return (
    <div className="p-6  bg-gray-800  shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-white">KYC Requests</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-4">Name</th>
            <th className="p-4">PAN</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
            <th className="p-4">Images</th>
          </tr>
        </thead>
        <tbody>
        {Array.isArray(kycs) && kycs.length > 0 ? (
            kycs.map(k => (
              <tr key={k._id} className="border-t border-gray-600">
                <td className="p-4">{k.fullName}</td>
                <td className="p-4">{k.panNumber}</td>
                <td className={`p-4 ${k.status === 'Pending' ? 'text-yellow-500' : k.status === 'Verified' ? 'text-green-500' : 'text-red-500'}`}>{k.status}</td>
                <td className="p-4">
                  {k.status === "Pending" && (
                    <div className="space-x-2">
                      <button 
                        onClick={() => updateStatus(k._id, "Verified")} 
                        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => updateStatus(k._id, "Rejected")} 
                        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <a 
                      href={k.idImageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-16 h-16 flex justify-center items-center border-2 border-gray-600 rounded-lg hover:border-blue-500"
                    >
                      <img src={k.idImageUrl} alt="ID" className="w-full h-full object-cover rounded-lg" />
                    </a>
                    <a 
                      href={k.selfieUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-16 h-16 flex justify-center items-center border-2 border-gray-600 rounded-lg hover:border-blue-500"
                    >
                      <img src={k.selfieUrl} alt="Selfie" className="w-full h-full object-cover rounded-lg" />
                    </a>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-4 text-center text-white">No KYC requests found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
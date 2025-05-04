import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function KYCAdminPanel() {
  const { user } = useAuth();
  const authToken = user?.token || localStorage.getItem("paymanni_token");
  const [kycs, setKycs] = useState([]);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    axios
      .get(`https://${import.meta.env.VITE_BACKEND}/api/admin/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) setKycs(res.data);
        else setKycs([]);
      })
      .catch(() => setKycs([]));
  }, []);

  const updateStatus = async (id, status) => {
    await axios.patch(
      `https://${import.meta.env.VITE_BACKEND}/api/admin/status/${id}`,
      { status },
      {
        headers: { Authorization: `Bearer ${authToken}` },
        withCredentials: true,
      }
    );
    setKycs((prev) =>
      prev.map((k) => (k._id === id ? { ...k, status } : k))
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold text-center mb-8">📁 KYC Requests</h2>

      <div className="overflow-auto shadow-xl rounded-xl backdrop-blur-md bg-gray-800/50 border border-gray-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              {["Name", "PAN", "Status", "Actions", "Images"].map((head, idx) => (
                <th key={idx} className="p-4 font-medium">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kycs.length > 0 ? (
              kycs.map((k) => (
                <tr key={k._id} className="odd:bg-gray-800 even:bg-gray-900 hover:bg-gray-700 transition duration-200">
                  <td className="p-4 rounded-l-lg">{k.fullName}</td>
                  <td className="p-4">{k.panNumber}</td>
                  <td className="p-4 font-bold">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      k.status === "Pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : k.status === "Verified"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {k.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(k._id, "Verified")}
                        disabled={k.status !== "Pending"}
                        className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 shadow focus:outline-none ${
                          k.status !== "Pending"
                            ? "bg-green-300/20 text-white opacity-50 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 hover:scale-105"
                        }`}
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => updateStatus(k._id, "Rejected")}
                        disabled={k.status !== "Pending"}
                        className={`py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 shadow focus:outline-none ${
                          k.status !== "Pending"
                            ? "bg-red-300/20 text-white opacity-50 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 hover:scale-105"
                        }`}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </td>
                  <td className="p-4 rounded-r-lg">
                    <div className="flex gap-2">
                      {[k.idImageUrl, k.selfieUrl].map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={index === 0 ? "ID" : "Selfie"}
                          className="w-16 h-16 rounded-lg object-cover cursor-pointer border border-gray-600 hover:scale-105 hover:ring-2 hover:ring-blue-400 transition-all"
                          onClick={() => setModalImage(url)}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-400">
                  No KYC requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Image Preview Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Preview"
            className="max-w-[90%] max-h-[80%] rounded-xl shadow-2xl border border-white"
          />
        </div>
      )}
    </div>
  );
}

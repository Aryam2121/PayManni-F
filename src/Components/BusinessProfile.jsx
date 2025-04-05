import { useState } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Save,
  User,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  CheckCircle,
} from "lucide-react";

const fieldIcons = {
  businessName: <Building2 className="w-4 h-4 text-blue-400" />,
  ownerName: <User className="w-4 h-4 text-purple-400" />,
  services: <Briefcase className="w-4 h-4 text-teal-400" />,
  contact: <Phone className="w-4 h-4 text-green-400" />,
  address: <MapPin className="w-4 h-4 text-orange-400" />,
};

const BusinessProfile = () => {
  const [profile, setProfile] = useState({
    businessName: "Acme Corp",
    ownerName: "Aryaman Gupta",
    services: "E-commerce, Repairs",
    contact: "+91 7579677966",
    address: "Plot 47, Sector 5, Mumbai",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="p-6 md:p-10 bg-gradient-to-br bg-gray-900  min-h-screen border border-white/10 backdrop-blur-xl rounded-none shadow-[0_10px_50px_rgba(0,0,0,0.8)]"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-white tracking-wide relative"
        >
          Business Profile
          <span className="block h-1 w-1/2 bg-blue-500 mt-2 rounded-full" />
        </motion.h2>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xl ring-offset-2 ring-2 ${
            isEditing
              ? "bg-green-600 hover:bg-green-700 text-white ring-green-500"
              : "bg-blue-600 hover:bg-blue-700 text-white ring-blue-500"
          }`}
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          {isEditing ? "Save" : "Edit"}
        </motion.button>
      </div>

      <div className="flex justify-center mb-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-white text-2xl font-bold shadow-md"
        >
          {profile.ownerName.split(" ")[0][0]}
        </motion.div>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(profile).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col gap-2"
          >
            <label className="text-sm font-medium text-white/70 capitalize tracking-wide">
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {fieldIcons[key]}
              </span>
              {isEditing ? (
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-white/50 transition-all duration-200"
                />
              ) : (
                <div className="pl-10 pr-3 py-2.5 text-sm text-white/90 border border-white/10 bg-white/5 rounded-xl">
                  {value}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </form>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-10 text-sm text-green-400 font-semibold flex items-center gap-2 justify-center"
        >
          <CheckCircle className="w-5 h-5" />
          Profile saved successfully!
        </motion.div>
      )}
    </motion.div>
  );
};

export default BusinessProfile;
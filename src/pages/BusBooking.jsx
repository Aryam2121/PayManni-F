import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapPin, Clock, DollarSign, Loader2, BusFront, Ticket, User } from "lucide-react";
import off from "../assets/500.jpg";
import refund from "../assets/refund.jpg";
import mahakumbh from "../assets/mhakumh.jpg";

export default function BusBooking() {
  const [tripType, setTripType] = useState("One Way");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(new Date());
  const [seatType, setSeatType] = useState("");
  const [loading, setLoading] = useState(false);
  const [buses, setBuses] = useState([]);
  const [showBookings, setShowBookings] = useState(false);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://${import.meta.env.VITE_BACKEND}/buses?from=${from}&to=${to}&seatType=${seatType}`, {
        method: 'GET',
        headers: {
          'X-TripGo-Key': 'e43957128fb7bd8d7a947caecd05cf22',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBuses(data);
      } else {
        console.error("Error fetching buses:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
    } finally {
      setLoading(false);
    }
  };

  const bookBus = async (bus) => {
    try {
      const response = await fetch(`https://${import.meta.env.VITE_BACKEND}/bookBus`, {
        method: 'POST',
        headers: {
          'X-TripGo-Key': 'e43957128fb7bd8d7a947caecd05cf22',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          busId: bus.id,
          user: "user123",
          date: new Date().toLocaleDateString(),
          from,
          to,
          seatType,
        }),
      });

      if (response.ok) {
        alert("Bus booked successfully");
      } else {
        alert("Booking failed");
      }
    } catch (error) {
      console.error("Error booking bus:", error);
    }
  };

  const filteredBuses = useMemo(() => {
    return buses.filter((bus) => !seatType || bus.type.includes(seatType));
  }, [buses, seatType]);

  const offers = [
    { id: 1, image: mahakumbh, link: "#" },
    { id: 2, image: off, link: "#" },
    { id: 3, image: refund, link: "#" },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-900 text-white rounded-xl shadow-lg">
      <motion.h2 
        className="text-4xl font-bold text-center text-blue-400"
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        🚌 Book Your Bus Tickets
      </motion.h2>

      {/* Trip Type and My Bookings */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          {["One Way", "Round Trip"].map((type) => (
            <motion.button
              key={type}
              className={`px-4 py-2 rounded-xl border ${tripType === type ? "bg-blue-600 text-white" : "border-blue-600 text-blue-400"} transition`}
              onClick={() => setTripType(type)}
              whileTap={{ scale: 0.95 }}
            >
              {type}
            </motion.button>
          ))}
        </div>

        <button 
          className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          onClick={() => setShowBookings(!showBookings)}
        >
          <User className="text-blue-400" /> <span>My Bookings</span>
        </button>
      </div>

      {/* Input Fields */}
      <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {["From", "To"].map((placeholder, index) => (
          <div key={index} className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" placeholder={placeholder} value={placeholder === "From" ? from : to}
              onChange={(e) => placeholder === "From" ? setFrom(e.target.value) : setTo(e.target.value)}
              className="p-3 pl-10 bg-gray-700 border border-gray-600 rounded-xl shadow-sm focus:ring focus:ring-blue-400 w-full text-white"
            />
          </div>
        ))}

        <DatePicker 
          selected={date} 
          onChange={(date) => setDate(date)}
          className="p-3 bg-gray-700 border border-gray-600 rounded-xl shadow-sm focus:ring focus:ring-blue-400 w-full text-white"
        />
      </motion.div>

      {/* Seat Type Filters */}
      <div className="flex justify-center space-x-4">
        {["Seater", "Sleeper", "Semi-Sleeper"].map((type) => (
          <motion.button
            key={type}
            className={`px-4 py-2 rounded-xl border ${seatType === type ? "bg-green-600 text-white" : "border-green-600 text-green-400"} transition`}
            onClick={() => setSeatType(seatType === type ? "" : type)}
            whileTap={{ scale: 0.95 }}
          >
            {type}
          </motion.button>
        ))}
      </div>

      {/* Search Button */}
      <motion.button 
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
        onClick={fetchBuses}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? <Loader2 className="animate-spin" /> : "Search Buses"}
      </motion.button>

      {/* Bus Listings */}
      <motion.div className="mt-6 space-y-4">
        {filteredBuses.length > 0 ? (
          filteredBuses.map(bus => (
            <motion.div key={bus.id} className="flex justify-between items-center p-6 bg-gray-800 hover:bg-gray-700 rounded-xl shadow-md border border-gray-600"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <p className="text-xl font-bold flex items-center gap-2">
                  <BusFront className="text-blue-400" /> {bus.name}
                </p>
                <p className="text-gray-300 flex items-center gap-2"><Clock /> {bus.time}</p>
                <p className="text-gray-300 flex items-center gap-2"><DollarSign /> {bus.price}</p>
              </div>
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-2 rounded-xl shadow-lg"
                onClick={() => bookBus(bus)}
              >
                Book Now
              </button>
            </motion.div>
          ))
        ) : !loading && <p className="text-center text-lg text-gray-400">🚫 No buses found</p>}
      </motion.div>

      {/* Offers Section */}
      <h2 className="text-xl font-bold mt-6">🎉 Best Offers for You</h2>
      <div className="flex space-x-4 overflow-x-auto">
        {offers.map((offer) => (
          <img key={offer.id} src={offer.image} className="h-[250px] rounded-xl shadow-lg cursor-pointer" />
        ))}
      </div>
    </div>
  );
}


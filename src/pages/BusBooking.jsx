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
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  const openSeatSelector = (bus) => {
    setSelectedBus(bus);
    setSelectedSeats([]);
  };
  const fetchBuses = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
  
      if (from) queryParams.append("from", from);
      if (to) queryParams.append("to", to);
      if (date) queryParams.append("date", date); // Must be in YYYY-MM-DD format
      if (seatType) queryParams.append("seatType", seatType);
  
      const response = await fetch(`https://${import.meta.env.VITE_BACKEND}/buses?${queryParams.toString()}`, {
        method: "GET",
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching buses:", errorData.message || response.statusText);
        return;
      }
  
      const data = await response.json();
      setBuses(data);
    } catch (error) {
      console.error("Network or server error while fetching buses:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const bookBus = async (bus, payment, user, from, to, seatType, date) => {
    try {
      const response = await fetch(`https://${import.meta.env.VITE_BACKEND}/bookBus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          busId: bus._id,
          user: {
            _id: user._id,
            upi: user.upi
          },
          date, // should be in 'YYYY-MM-DD' format
          from,
          to,
          seatType,
          payment // includes razorpay_order_id, razorpay_payment_id, razorpay_signature
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("✅ Bus booked successfully!");
        console.log("Booking Info:", data.booking);
      } else {
        alert(`❌ Booking failed: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Error booking bus:", error);
      alert("Something went wrong during booking.");
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
onClick={() => openSeatSelector(bus)}
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
      {selectedBus && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-lg space-y-4">
      <h2 className="text-xl font-bold text-center">🪑 Select Seats for {selectedBus.name}</h2>

      <div className="grid grid-cols-4 gap-3">
        {selectedBus.seats.map((seat, idx) => (
          <button
            key={idx}
            className={`p-3 rounded-xl ${
              selectedSeats.includes(seat.number)
                ? "bg-green-500 text-white"
                : seat.available
                ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                : "bg-red-400 text-white cursor-not-allowed"
            }`}
            disabled={!seat.available}
            onClick={() =>
              setSelectedSeats((prev) =>
                prev.includes(seat.number)
                  ? prev.filter((s) => s !== seat.number)
                  : [...prev, seat.number]
              )
            }
          >
            {seat.number}
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 rounded-lg bg-gray-500 text-white"
          onClick={() => setSelectedBus(null)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          onClick={() => bookSelectedSeats()}
        >
          Pay ₹{selectedSeats.length * selectedBus.price}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}


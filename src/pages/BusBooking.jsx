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
  const [myBookings, setMyBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false);

  // Function to search buses (optimized with useCallback)
  const fetchBuses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.example.com/buses?from=${from}&to=${to}&seatType=${seatType}`, {
        method: 'GET',
        headers: {
          'X-TripGo-Key': 'e43957128fb7bd8d7a947caecd05cf22',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBuses(data);  // Set the fetched buses data
      } else {
        console.error("Error fetching buses:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
    } finally {
      setLoading(false);
    }
  };


  // Function to book a bus (optimized with useCallback)
  const bookBus = async (bus) => {
    const bookingDetails = {
      busId: bus.id,
      user: "user123", // Replace with the logged-in user's data
      date: new Date().toLocaleDateString(),
      from,
      to,
      seatType,
    };
  
    try {
      const response = await fetch('https://api.example.com/bookBus', {
        method: 'POST',
        headers: {
          'X-TripGo-Key': 'e43957128fb7bd8d7a947caecd05cf22',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDetails),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Bus booked successfully");
        // Handle the response as needed
      } else {
        alert("Booking failed");
      }
    } catch (error) {
      console.error("Error booking bus:", error);
    }
  };
  // Optimized filtering for buses (useMemo)
  const filteredBuses = useMemo(() => {
    return buses.filter((bus) => !seatType || bus.type.includes(seatType));
  }, [buses, seatType]);

  // Offer Data
  const offers = [
    { id: 1, image: mahakumbh, link: "#" },
    { id: 2, image: off, link: "#" },
    { id: 3, image: refund, link: "#" },
];
const searchBuses = useCallback(() => {
  setLoading(true);
  fetch(`/api/buses?from=${from}&to=${to}&date=${date.toISOString()}&seatType=${seatType}`)
    .then(response => response.json())
    .then(data => {
      setBuses(data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching buses:", err);
      setLoading(false);
    });
}, [from, to, date, seatType]);


  return (
    <div className="p-6 space-y-6 bg-white rounded-xl shadow-lg">
      <motion.h2 
        className="text-4xl font-bold text-center text-blue-700"
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
              className={`px-4 py-2 rounded-xl border ${tripType === type ? "bg-blue-600 text-white" : "border-blue-600 text-blue-600"} transition`}
              onClick={() => setTripType(type)}
              whileTap={{ scale: 0.95 }}
            >
              {type}
            </motion.button>
          ))}
        </div>

        <button 
          className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          onClick={() => setShowBookings(!showBookings)}
        >
          <User className="text-blue-600" /> <span>My Bookings</span>
        </button>
      </div>

      {/* Input Fields */}
      <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-xl shadow-md border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {["From", "To"].map((placeholder, index) => (
          <div key={index} className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-500" />
            <input 
              type="text" placeholder={placeholder} value={placeholder === "From" ? from : to}
              onChange={(e) => placeholder === "From" ? setFrom(e.target.value) : setTo(e.target.value)}
              className="p-3 pl-10 border rounded-xl shadow-sm focus:ring focus:ring-blue-400 w-full"
            />
          </div>
        ))}

        <DatePicker 
          selected={date} 
          onChange={(date) => setDate(date)}
          className="p-3 border rounded-xl shadow-sm focus:ring focus:ring-blue-400 w-full"
        />
      </motion.div>

      {/* Seat Type Filters */}
      <div className="flex justify-center space-x-4">
        {["Seater", "Sleeper", "Semi-Sleeper"].map((type) => (
          <motion.button
            key={type}
            className={`px-4 py-2 rounded-xl border ${seatType === type ? "bg-green-600 text-white" : "border-green-600 text-green-600"} transition`}
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
        onClick={searchBuses}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? <Loader2 className="animate-spin" /> : "Search Buses"}
      </motion.button>

      {/* Bus Listings */}
      <motion.div className="mt-6 space-y-4">
        {filteredBuses.length > 0 ? (
          filteredBuses.map(bus => (
            <motion.div key={bus.id} className="flex justify-between items-center p-6 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-md border border-gray-300"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <p className="text-xl font-bold flex items-center gap-2">
                  <BusFront className="text-blue-500" /> {bus.name}
                </p>
                <p className="text-gray-600 flex items-center gap-2"><Clock /> {bus.time}</p>
                <p className="text-gray-600 flex items-center gap-2"><DollarSign /> {bus.price}</p>
              </div>
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-2 rounded-xl shadow-lg"
                onClick={() => bookBus(bus)}
              >
                Book Now
              </button>
            </motion.div>
          ))
        ) : !loading && <p className="text-center text-lg text-gray-500">🚫 No buses found</p>}
      </motion.div>
{/* Offers Section */}
<h2 className="text-xl font-bold mt-6">🎉 Best Offers for You</h2>
<div className="flex space-x-16 overflow-x-auto">
  {offers.map((offer) => (
    <img
      key={offer.id}
      src={offer.image}
      className="h-[430px] rounded-xl shadow-4xl cursor-pointer"
    />
  ))}
</div>


    </div>
  );
}

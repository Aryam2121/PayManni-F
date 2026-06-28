import { useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapPin, Clock, DollarSign, Loader2, BusFront, Ticket, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthToken, getStoredUser, getUserId, getUserUpi, getApiBase } from "../utils/authStorage";

export default function BusBooking() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
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
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);
  
  const openSeatSelector = (bus) => {
    setSelectedBus(bus);
    setSelectedSeats([]);
  };
  const fetchBuses = async () => {
    if (!from || !to) {
      toast.error("Please select both departure and destination cities");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const queryParams = new URLSearchParams();
  
      if (from) queryParams.append("from", from);
      if (to) queryParams.append("to", to);
      if (date) {
        const formattedDate = date.toISOString().split('T')[0];
        queryParams.append("date", formattedDate);
      }
      if (seatType) queryParams.append("seatType", seatType);
  
      const response = await fetch(apiUrl(`/api/buses?${queryParams.toString()}`), {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user?.token || localStorage.getItem("paymanni_token")}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.message || response.statusText;
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
  
      const data = await response.json();
      setBuses(data);
      if (data.length === 0) {
        toast.info("No buses found for this route. Try different cities or dates.");
      } else {
        toast.success(`Found ${data.length} buses!`);
      }
    } catch (error) {
      const errorMsg = "Network error while fetching buses. Please check your connection.";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const bookBus = async (bus, payment, bookingUser, fromCity, toCity, seatTypeValue, travelDate) => {
    try {
      const response = await fetch(`${getApiBase()}/api/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          busId: bus._id || bus.id,
          user: {
            _id: bookingUser._id || bookingUser.id,
            upi: bookingUser.upi || bookingUser.upiId || getUserUpi()
          },
          date: travelDate,
          from: fromCity,
          to: toCity,
          seatType: seatTypeValue || seatType,
          payment
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success("Bus booked successfully!");
        setSelectedBus(null);
        setSelectedSeats([]);
      } else {
        toast.error(data.message || "Booking failed");
      }
    } catch (error) {
      console.error("Error booking bus:", error);
      toast.error("Something went wrong during booking.");
    }
  };

  const bookSelectedSeats = async () => {
    if (!selectedBus || selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    const totalAmount = selectedSeats.length * (selectedBus.price || 0);
    const storedUser = getStoredUser() || user;
    const userId = getUserId();

    if (!userId) {
      toast.error("Please log in to book tickets");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const orderRes = await fetch(`${getApiBase()}/api/payment/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ amount: totalAmount, currency: "INR" })
      });

      const order = await orderRes.json();
      if (!orderRes.ok || !order.id) {
        throw new Error(order.message || "Failed to create payment order");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "PayManni Bus Booking",
        description: `${selectedBus.name} - ${selectedSeats.length} seat(s)`,
        order_id: order.id,
        handler: async (response) => {
          const formattedDate = date.toISOString().split("T")[0];
          await bookBus(
            selectedBus,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            },
            { _id: userId, upi: getUserUpi() },
            from,
            to,
            seatType,
            formattedDate
          );
        },
        theme: { color: "#2563EB" }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => toast.error("Payment failed. Please try again."));
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Unable to start payment");
    } finally {
      setLoading(false);
    }
  };

  const getBusSeats = (bus) => {
    if (bus?.seats?.length) return bus.seats;
    return Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      available: true
    }));
  };
  
  const filteredBuses = useMemo(() => {
    return buses.filter((bus) => !seatType || bus.type.includes(seatType));
  }, [buses, seatType]);
      

  const offers = [
    { id: 1, image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop", link: "#" },
    { id: 2, image: "https://images.unsplash.com/photo-1570125909232-eb263c3f8a2c?w=400&h=250&fit=crop", link: "#" },
    { id: 3, image: "https://images.unsplash.com/photo-1506377247377-780bec9c32f0?w=400&h=250&fit=crop", link: "#" },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading bus booking...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl shadow-lg transition-colors duration-300">
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
      <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {["From", "To"].map((placeholder, index) => (
          <div key={index} className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder={placeholder} 
              value={placeholder === "From" ? from : to}
              onChange={(e) => placeholder === "From" ? setFrom(e.target.value) : setTo(e.target.value)}
              className="p-3 pl-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring focus:ring-blue-400 w-full text-gray-900 dark:text-white transition-colors"
              required
            />
          </div>
        ))}

        <DatePicker 
          selected={date} 
          onChange={(date) => setDate(date)}
          minDate={new Date()}
          dateFormat="yyyy-MM-dd"
          className="p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring focus:ring-blue-400 w-full text-gray-900 dark:text-white transition-colors"
        />
      </motion.div>

      {error && (
        <motion.div
          className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

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
        {getBusSeats(selectedBus).map((seat, idx) => (
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}


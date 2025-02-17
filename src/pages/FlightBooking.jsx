import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2, XCircle } from "lucide-react";
import axios from "axios";

const FlightBooking = () => {
  const [tripType, setTripType] = useState("Round Trip");
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    passengers: 1,
    travelClass: "Economy",
    specialFares: [],
  });
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [filters, setFilters] = useState({ airline: "", maxPrice: "" });
  const [errors, setErrors] = useState([]);

  // Form validation
  const validateForm = () => {
    const newErrors = [];
    if (!formData.from) newErrors.push("From city is required.");
    if (!formData.to) newErrors.push("To city is required.");
    if (!formData.departureDate) newErrors.push("Departure date is required.");
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return false;
    }
    setErrors([]);
    return true;
  };

  const handleSearch = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { data } = await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/search`, formData);
      setSearchResults(data.flights || []);
      setShowResults(true);
    } catch (error) {
      alert("Failed to fetch flights. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filters and sorting
  const filteredResults = useMemo(() => {
    return searchResults.filter((flight) => {
      return (
        (!filters.airline || flight.airline === filters.airline) &&
        (!filters.maxPrice || flight.price <= filters.maxPrice)
      );
    });
  }, [searchResults, filters]);

  const sortedResults = useMemo(() => {
    return [...filteredResults].sort((a, b) => {
      if (sortOption === "price") return a.price - b.price;
      if (sortOption === "duration") return parseFloat(a.duration) - parseFloat(b.duration);
      return 0;
    });
  }, [filteredResults, sortOption]);

  // Reset filters
  const clearFilters = () => {
    setFilters({ airline: "", maxPrice: "" });
  };

  const cities = ["Delhi (DEL)", "Mumbai (BOM)", "Bangalore (BLR)", "Udaipur (UDR)", "Jaipur (JAI)", "Kolkata (CCU)", "Chennai (MAA)", "Hyderabad (HYD)", "Pune (PNQ)", "Ahmedabad (AMD)", "MNL", "BCD"];
  const travelClasses = ["Economy", "Business", "First Class"];
  const specialFares = ["Armed Forces", "Student Extra Baggage", "Senior Citizen"];

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get(`https://${import.meta.env.VITE_BACKEND}/api/fetch`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching flights:", error);
      }
    };
    fetchFlights();
  }, []);

  const handlePayment = async (price) => {
    try {
      // Step 1: Create an order using the backend API
      const { data } = await axios.post(`https://${import.meta.env.VITE_BACKEND}/create-order`, {
        amount: price,
      });
  
      if (data.success) {
        // Step 2: Use Razorpay SDK to initiate payment
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID, // From .env
          amount: data.order.amount,
          currency: data.order.currency,
          name: "Flight Booking",
          description: "Flight booking payment",
          order_id: data.order.id,
          handler: async function (response) {
            // Step 3: Verify the payment once done
            const verification = await axios.post(
              `https://${import.meta.env.VITE_BACKEND}/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );
            
            if (verification.data.success) {
              alert("Payment Successful!");
              // Proceed with booking confirmation or redirection
            } else {
              alert("Payment Verification Failed!");
            }
          },
          prefill: {
            name: "User Name", // Add dynamic user name if available
            email: "user@example.com", // Add dynamic email if available
          },
          theme: {
            color: "#528FF0",
          },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      console.error("Payment Error", error);
      alert("Error in payment process!");
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="bg-white rounded-xl shadow-lg max-w-5xl w-full mx-auto p-8">
        <h1 className="text-4xl font-extrabold text-blue-700 text-center mb-8">Flight Booking</h1>

        {/* Errors Section */}
        {errors.length > 0 && (
          <div className="bg-red-100 text-red-800 p-4 mb-4 rounded-lg">
            <ul>
              {errors.map((error, index) => (
                <li key={index} className="flex justify-between">
                  {error}
                  <XCircle className="cursor-pointer" onClick={() => setErrors([])} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Trip Type Toggle */}
        <div className="flex justify-center gap-6 mb-8">
          {["One Way", "Round Trip"].map((type) => (
            <button
              key={type}
              onClick={() => setTripType(type)}
              className={`py-3 px-8 rounded-full font-medium text-lg transition ${tripType === type ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Form */}
        <motion.form layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="from" className="text-lg font-medium text-gray-700">From</label>
            <select
              id="from"
              name="from"
              value={formData.from}
              onChange={(e) => setFormData((prev) => ({ ...prev, from: e.target.value }))}
              className="mt-2 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select City</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="to" className="text-lg font-medium text-gray-700">To</label>
            <select
              id="to"
              name="to"
              value={formData.to}
              onChange={(e) => setFormData((prev) => ({ ...prev, to: e.target.value }))}
              className="mt-2 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select City</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="departureDate" className="text-lg font-medium text-gray-700">Departure Date</label>
            <input
              type="date"
              id="departureDate"
              name="departureDate"
              value={formData.departureDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, departureDate: e.target.value }))}
              className="mt-2 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {tripType === "Round Trip" && (
            <div>
              <label htmlFor="returnDate" className="text-lg font-medium text-gray-700">Return Date</label>
              <input
                type="date"
                id="returnDate"
                name="returnDate"
                value={formData.returnDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, returnDate: e.target.value }))}
                className="mt-2 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          )}

          <div>
            <label htmlFor="passengers" className="text-lg font-medium text-gray-700">Passengers</label>
            <input
              type="number"
              id="passengers"
              name="passengers"
              min="1"
              value={formData.passengers}
              onChange={(e) => setFormData((prev) => ({ ...prev, passengers: e.target.value }))}
              className="mt-2 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label htmlFor="travelClass" className="text-lg font-medium text-gray-700">Travel Class</label>
            <select
              id="travelClass"
              name="travelClass"
              value={formData.travelClass}
              onChange={(e) => setFormData((prev) => ({ ...prev, travelClass: e.target.value }))}
              className="mt-2 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {travelClasses.map((cls, index) => (
                <option key={index} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Special Fares */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-700">Special Fares</h2>
            <div className="flex flex-wrap gap-4 mt-4">
              {specialFares.map((fare, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData((prev) => ({
                    ...prev,
                    specialFares: prev.specialFares.includes(fare)
                      ? prev.specialFares.filter(f => f !== fare)
                      : [...prev.specialFares, fare],
                  }))}
                  className={`py-2 px-4 rounded-lg font-medium transition ${formData.specialFares.includes(fare) ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  {fare}
                </button>
              ))}
            </div>
          </div>
        </motion.form>

        {/* Search Button */}
        <div className="mt-8">
          <button
            type="button"
            onClick={handleSearch}
            className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Search Flights"}
          </button>
        </div>

        {/* Flight Results */}
        {showResults && (
          <div className="mt-8">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-semibold text-blue-700">Flights</h2>
              <div>
                <button
                  onClick={() => setSortOption("price")}
                  className="text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
                >
                  Sort by Price
                </button>
                <button
                  onClick={() => setSortOption("duration")}
                  className="text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
                >
                  Sort by Duration
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {sortedResults.map((flight, index) => (
                <div key={index} className="p-4 border rounded-lg shadow-lg bg-white">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{flight.airline}</h3>
                      <p className="text-gray-600">{flight.from} to {flight.to}</p>
                      <p className="text-gray-500">{flight.departureTime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{flight.price} INR</p>
                      <button
                        onClick={() => handlePayment(flight.price)}
                        className="mt-4 py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightBooking;

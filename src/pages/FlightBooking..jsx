import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Filter, ArrowUpDown, XCircle } from "lucide-react";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (fare) => {
    setFormData((prev) => {
      const isActive = prev.specialFares.includes(fare);
      const updatedFares = isActive
        ? prev.specialFares.filter((f) => f !== fare)
        : [...prev.specialFares, fare];
      return { ...prev, specialFares: updatedFares };
    });
  };

  const handleSearch = () => {
    if (!formData.from || !formData.to || !formData.departureDate) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const dummyResults = [
        { airline: "IndiGo", departure: "03:10 PM", arrival: "04:30 PM", duration: "1h 20m", price: 4312 },
        { airline: "IndiGo", departure: "06:45 AM", arrival: "08:15 AM", duration: "1h 30m", price: 4616 },
        { airline: "Air India", departure: "05:00 PM", arrival: "06:20 PM", duration: "1h 20m", price: 5025 },
      ];
      setSearchResults(dummyResults);
      setShowResults(true);
      setIsLoading(false);
    }, 2000);
  };

  const filteredResults = searchResults.filter((flight) => {
    return (
      (!filters.airline || flight.airline === filters.airline) &&
      (!filters.maxPrice || flight.price <= filters.maxPrice)
    );
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortOption === "price") return a.price - b.price;
    if (sortOption === "duration") return parseFloat(a.duration) - parseFloat(b.duration);
    return 0;
  });

  const cities = ["Delhi (DEL)", "Mumbai (BOM)", "Bangalore (BLR)", "Udaipur (UDR)", "Jaipur (JAI)"];
  const travelClasses = ["Economy", "Business", "First Class"];
  const specialFares = ["Armed Forces", "Student Extra Baggage", "Senior Citizen"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      {!showResults ? (
        <div className="bg-white rounded-xl shadow-lg max-w-5xl w-full mx-auto p-8">
          <h1 className="text-4xl font-extrabold text-blue-700 text-center mb-8">Flight Booking</h1>

          <div className="flex justify-center gap-6 mb-8">
            {["One Way", "Round Trip"].map((type) => (
              <button
                key={type}
                onClick={() => setTripType(type)}
                className={`py-3 px-8 rounded-full font-medium text-lg transition ${
                  tripType === type ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <motion.form layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="from" className="block text-lg font-medium text-gray-600">From</label>
              <select
                id="from"
                name="from"
                value={formData.from}
                onChange={handleChange}
                className="mt-2 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Departure City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="to" className="block text-lg font-medium text-gray-600">To</label>
              <select
                id="to"
                name="to"
                value={formData.to}
                onChange={handleChange}
                className="mt-2 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Destination City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="departureDate" className="block text-lg font-medium text-gray-600">Departure Date</label>
              <input
                type="date"
                id="departureDate"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="mt-2 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {tripType === "Round Trip" && (
              <motion.div layout>
                <label htmlFor="returnDate" className="block text-lg font-medium text-gray-600">Return Date</label>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  min={formData.departureDate}
                  className="mt-2 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>
            )}

            <div>
              <label htmlFor="passengers" className="block text-lg font-medium text-gray-600">Passengers</label>
              <input
                type="number"
                id="passengers"
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                min="1"
                className="mt-2 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="travelClass" className="block text-lg font-medium text-gray-600">Travel Class</label>
              <select
                id="travelClass"
                name="travelClass"
                value={formData.travelClass}
                onChange={handleChange}
                className="mt-2 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {travelClasses.map((cls, index) => (
                  <option key={index} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
          </motion.form>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-700">Special Fares</h2>
            <div className="flex flex-wrap gap-4 mt-4">
              {specialFares.map((fare, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleToggle(fare)}
                  className={`py-2 px-4 rounded-lg font-medium transition ${
                    formData.specialFares.includes(fare)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {fare}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={handleSearch}
              className="py-4 px-10 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-600 transition flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : null} Search Flights
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg max-w-5xl w-full mx-auto p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-blue-700">Search Results</h2>
            <div className="flex items-center gap-4">
              <select
                value={filters.airline}
                onChange={(e) => setFilters((prev) => ({ ...prev, airline: e.target.value }))}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Filter by Airline</option>
                {[...new Set(searchResults.map((flight) => flight.airline))].map((airline, index) => (
                  <option key={index} value={airline}>{airline}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sort</option>
                <option value="price">Price</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>

          {sortedResults.map((flight, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="border rounded-lg p-4 mb-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{flight.airline}</h3>
                <p className="text-gray-600">{flight.departure} - {flight.arrival} ({flight.duration})</p>
              </div>
              <div className="text-blue-600 font-bold text-lg">₹{flight.price}</div>
            </motion.div>
          ))}

          <div className="text-center mt-8">
            <button
              onClick={() => setShowResults(false)}
              className="py-3 px-8 text-lg font-medium bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <XCircle /> Modify Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightBooking;

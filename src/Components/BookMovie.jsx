import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const rows = ["A", "B", "C", "D", "E"];
const seatsPerRow = 8;

export default function BookMovie() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = "6636e20f91e57aa51fce3005"; // Replace with actual user ID logic

  useEffect(() => {
    axios
      .get(`https://${import.meta.env.VITE_BACKEND}/api/movies/${movieId}`)
      .then((res) => setMovie(res.data.movie))
      .catch(() => alert("Error fetching movie"));
  }, [movieId]);

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    const bookingData = {
      movieId,
      userId,
      seatsBooked: selectedSeats.length,
      totalPrice: movie.price * selectedSeats.length,
    };

    try {
      setLoading(true);
      window.location.href = "https://razorpay.me/@pay-man";
      await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/movies/book`, bookingData);
      alert("🎉 Booking successful!");

      // Redirect to Razorpay for payment
    } catch (err) {
      alert("Booking failed: " + err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return movie ? (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <div className="bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Movie Poster */}
            <img
              src={movie.image || "https://via.placeholder.com/300"}
              alt={movie.title}
              className="w-full md:w-60 h-auto rounded-xl object-cover shadow-lg"
            />
  
            {/* Movie Info */}
            <div>
              <h1 className="text-4xl font-bold text-blue-400 mb-2">{movie.title}</h1>
              <p className="text-gray-300 mb-4">{movie.description}</p>
              <p className="text-sm text-gray-400 mb-1">🎬 Duration: {movie.duration} mins</p>
              <p className="text-sm text-gray-400 mb-1">💺 Seats Available: {movie.seatsAvailable}</p>
              <p className="text-xl font-semibold text-green-400 mt-4">Price: ₹{movie.price}</p>
            </div>
          </div>
        </div>
  
        {/* Seat Selection */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">🎟️ Select Your Seats</h2>
  
          {/* Seat Legend */}
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-600 rounded" />
              <span className="text-sm text-gray-300">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded" />
              <span className="text-sm text-gray-300">Selected</span>
            </div>
          </div>
  
          {/* Seat Grid */}
          <div className="grid gap-2 grid-cols-8 max-w-lg mb-6">
            {rows.flatMap((row) =>
              Array.from({ length: seatsPerRow }).map((_, i) => {
                const seat = `${row}${i + 1}`;
                const isSelected = selectedSeats.includes(seat);
  
                return (
                  <button
                    key={seat}
                    onClick={() => toggleSeat(seat)}
                    className={`w-10 h-10 text-sm rounded font-bold ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : "bg-green-600 hover:bg-green-500"
                    } transition-all duration-300`}
                  >
                    {seat}
                  </button>
                );
              })
            )}
          </div>
  
          {/* Booking Info */}
          <div className="mb-6 space-y-2">
            <p className="text-lg">
              Selected:{" "}
              <span className="font-semibold text-yellow-300">
                {selectedSeats.join(", ") || "None"}
              </span>
            </p>
            <p className="text-lg text-green-400 font-bold">
              Total: ₹{selectedSeats.length * movie.price}
            </p>
          </div>
  
          {/* Proceed Button */}
          <button
            onClick={handleBooking}
            disabled={loading || selectedSeats.length === 0}
            className={`w-full max-w-md py-3 px-6 rounded-xl text-lg font-bold transition-all ${
              selectedSeats.length === 0
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
            }`}
          >
            {loading ? "Booking..." : "Proceed to Pay"}
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-white text-center py-10">Loading movie...</div>
  );
  
}

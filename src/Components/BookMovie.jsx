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
      await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/movies/book`, bookingData);
      alert("🎉 Booking successful!");

      // Redirect to Razorpay for payment
      window.location.href = "https://razorpay.me/@pay-man";
    } catch (err) {
      alert("Booking failed: " + err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return movie ? (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <p className="mb-4 text-gray-400">{movie.description}</p>

      <h2 className="text-xl font-semibold mb-2">Select Seats:</h2>
      <div className="grid gap-2 grid-cols-8 max-w-md mb-6">
        {rows.flatMap((row) =>
          Array.from({ length: seatsPerRow }).map((_, i) => {
            const seat = `${row}${i + 1}`;
            const isSelected = selectedSeats.includes(seat);

            return (
              <button
                key={seat}
                onClick={() => toggleSeat(seat)}
                className={`w-10 h-10 rounded ${
                  isSelected
                    ? "bg-blue-500"
                    : "bg-green-600 hover:bg-green-500"
                }`}
              >
                {seat}
              </button>
            );
          })
        )}
      </div>

      <div className="mb-4">
        <p className="text-lg">
          Selected:{" "}
          <span className="font-semibold text-yellow-300">
            {selectedSeats.join(", ") || "None"}
          </span>
        </p>
        <p className="text-lg text-green-400">
          Total: ₹{selectedSeats.length * movie.price}
        </p>
      </div>

      <button
        onClick={handleBooking}
        disabled={loading}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-2 px-6 rounded-lg text-lg font-semibold transition-all"
      >
        {loading ? "Booking..." : "Proceed to Pay"}
      </button>
    </div>
  ) : (
    <p className="text-white">Loading movie...</p>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getApiBase } from "../utils/authStorage";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${getApiBase()}/api/getAllmovies`)
      .then((res) => {
        setMovies(res.data.movies || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load movies:", err);
        setError("Unable to load movies. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleBookNow = (movieId) => {
    navigate(`/movies/book/${movieId}`);
  };

  return (
    <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 min-h-screen text-white p-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center">🎬 Now Showing</h1>

      {error && (
        <p className="text-center text-red-400 mb-6">{error}</p>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-700 h-64 rounded-xl animate-pulse" />
            ))
          : movies.length === 0 ? (
              <p className="col-span-full text-center text-gray-400">No movies available right now.</p>
            ) : (
              movies.map((movie) => (
                <div
                  key={movie._id}
                  className="group relative bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={movie.image || "https://via.placeholder.com/300"}
                      alt={movie.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-all duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 px-3 py-1 text-sm rounded-md text-yellow-400">
                      ⭐ {movie.rating || "N/A"}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h2 className="text-2xl font-semibold mb-2 text-blue-400">{movie.title}</h2>
                    <p className="text-gray-300 text-sm h-16 overflow-hidden mb-3">
                      {movie.description && movie.description.length > 120
                        ? movie.description.slice(0, 120) + "..."
                        : movie.description || "No description available."}
                    </p>
                    <p className="mt-3 font-bold text-lg text-green-400">₹{movie.price}</p>

                    <button
                      onClick={() => handleBookNow(movie._id)}
                      className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-2 text-lg font-semibold rounded-lg transition duration-300 transform hover:scale-105"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            )}
      </div>
    </div>
  );
}

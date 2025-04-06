import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const movieId = params.get("movieId");
    const userId = params.get("userId");
    const seats = params.get("seats")?.split(",") || [];
    const totalPrice = params.get("amount");

    const bookNow = async () => {
      try {
        await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/movies/book`, {
          movieId,
          userId,
          seatsBooked: seats.length,
          seats,
          totalPrice,
        });

        alert("🎉 Booking successful after payment!");
        navigate("/thank-you");
      } catch (err) {
        alert("Payment done but booking failed. Contact support.");
      }
    };

    bookNow();
  }, []);

  return (
    <div className="text-white text-center mt-20 text-2xl">
      Verifying your payment and booking...
    </div>
  );
}

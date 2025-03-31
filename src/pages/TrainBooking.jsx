import React, { useState } from 'react';
import axios from 'axios';

const trains = [
  { id: 1, name: 'Express Train', from: 'New York', to: 'Los Angeles', price: { Sleeper: 150, 'AC First Class': 300, 'AC Second Class': 200 }, seats: { Sleeper: 50, 'AC First Class': 10, 'AC Second Class': 20 }, image: '/images/express-train.jpg' },
  { id: 2, name: 'Super Fast', from: 'Chicago', to: 'San Francisco', price: { Sleeper: 180, 'AC First Class': 350, 'AC Second Class': 230 }, seats: { Sleeper: 40, 'AC First Class': 5, 'AC Second Class': 15 }, image: '/images/super-fast.jpg' },
  { id: 3, name: 'Mountain Express', from: 'Boston', to: 'Los Angeles', price: { Sleeper: 200, 'AC First Class': 400, 'AC Second Class': 250 }, seats: { Sleeper: 30, 'AC First Class': 8, 'AC Second Class': 12 }, image: '/images/mountain-express.jpg' },
];

const classes = ['Sleeper', 'AC First Class', 'AC Second Class'];

const TrainBooking = () => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1,
    class: 'Sleeper',
    train: '',
    price: 0,
    availableSeats: 0,
    discount: 0,
  });

  const [errors, setErrors] = useState({});
  const [availableTrains, setAvailableTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  const cities = ['New York', 'Los Angeles', 'Chicago', 'San Francisco', 'Boston'];
  const discountCodes = { 'FIRST20': 0.2, 'STUDENT10': 0.1 }; // Example promo codes

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.from) newErrors.from = 'Departure city is required';
    if (!formData.to) newErrors.to = 'Destination city is required';
    if (!formData.date || new Date(formData.date) < new Date()) newErrors.date = 'Please select a valid date';
    if (formData.passengers < 1) newErrors.passengers = 'At least 1 passenger is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://${import.meta.env.VITE_BACKEND}/api/trains`, 
        { params: { from: formData.from, to: formData.to, date: formData.date, class: formData.class } }
      );

      setAvailableTrains(response.data);

      const selectedTrain = response.data.find(train => train.id === formData.train);
      if (selectedTrain) {
        setFormData((prev) => ({ ...prev, price: selectedTrain.price[formData.class] }));
      }
    } catch (error) {
      console.error('Error fetching trains:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoCode = () => {
    if (discountCodes[promoCode]) {
      setFormData((prev) => ({ ...prev, discount: discountCodes[promoCode] }));
      alert('Promo code applied!');
    } else {
      alert('Invalid promo code');
    }
  };

  const calculateTotalPrice = () => {
    const basePrice = formData.price * formData.passengers;
    return basePrice - basePrice * formData.discount;
  };

  const handlePayment = async () => {
    const totalAmount = calculateTotalPrice();
    
    try {
      const { data } = await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/trains/create-payment`, {
        amount: totalAmount,
        currency: 'INR',
      });

      if (data.success) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "Train Booking",
          description: "Train Ticket Payment",
          order_id: data.order.id,
          handler: async (response) => {
            const verification = await axios.post(`https://${import.meta.env.VITE_BACKEND}/api/trains/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.data.success) {
              alert("Payment Successful!");
            } else {
              alert("Payment Verification Failed!");
            }
          },
          prefill: {
            name: "User Name",
            email: "user@example.com",
          },
          theme: { color: "#528FF0" },
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
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto p-6 bg-gray-200 rounded-lg shadow-md mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Train Booking System</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
       {/* From */}
<div>
  <label htmlFor="from" className="block text-lg font-medium">From</label>
  <div className="flex gap-2">
    <select
      id="from"
      name="from"
      value={formData.from}
      onChange={handleChange}
      className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select Departure City</option>
      {cities.map((city) => (
        <option key={city} value={city}>{city}</option>
      ))}
    </select>
    <input
      type="text"
      id="fromCustom"
      name="fromCustom"
      value={formData.fromCustom || ''}
      onChange={handleChange}
      placeholder="Or enter your city"
      className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
  {errors.from && <p className="text-red-500 text-sm mt-1">{errors.from}</p>}
</div>

{/* To */}
<div>
  <label htmlFor="to" className="block text-lg font-medium">To</label>
  <div className="flex gap-2">
    <select
      id="to"
      name="to"
      value={formData.to}
      onChange={handleChange}
      className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select Destination City</option>
      {cities.map((city) => (
        <option key={city} value={city}>{city}</option>
      ))}
    </select>
    <input
      type="text"
      id="toCustom"
      name="toCustom"
      value={formData.toCustom || ''}
      onChange={handleChange}
      placeholder="Or enter your city"
      className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
  {errors.to && <p className="text-red-500 text-sm mt-1">{errors.to}</p>}
</div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-lg font-medium">Travel Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>

        {/* Passengers */}
        <div>
          <label htmlFor="passengers" className="block text-lg font-medium">Passengers</label>
          <input
            type="number"
            id="passengers"
            name="passengers"
            value={formData.passengers}
            onChange={handleChange}
            min="1"
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.passengers && <p className="text-red-500 text-sm mt-1">{errors.passengers}</p>}
        </div>

        {/* Class */}
        <div>
          <label htmlFor="class" className="block text-lg font-medium">Class</label>
          <select
            id="class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {classes.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        {/* Promo Code */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="promoCode" className="block text-lg font-medium">Promo Code</label>
          <div className="flex gap-4 mt-2">
            <input
              type="text"
              id="promoCode"
              name="promoCode"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handlePromoCode}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-2 text-center">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Searching...' : 'Search Trains'}
          </button>
        </div>
      </form>

     {/* Available Trains */}
{availableTrains.length > 0 ? (
  <div className="mt-8">
    <h3 className="text-xl font-semibold">Available Trains:</h3>
    <div className="space-y-4 mt-4">
      {availableTrains.map((train) => (
        <button
          key={train.id}
          onClick={() => setFormData({ ...formData, train: train.id })}
          className="w-full text-left px-6 py-3 bg-gray-100 rounded-lg mb-2"
        >
          {train.name} - ${train.price[formData.class]} | {train.seats[formData.class]} seats available
        </button>
      ))}
    </div>
  </div>
) : (
  !loading && <p className="text-center mt-4 text-lg text-gray-500">No trains found for this route.</p>
)}

{/* If a train is selected, show the details and payment option */}
{formData.train ? (
  <div className="mt-6">
    <h4 className="text-lg font-semibold">Selected Train:</h4>
    <div className="p-4 border border-gray-300 rounded-lg shadow-md">
      {/* Filter the available trains based on the selected train */}
      {availableTrains
        .filter((train) => train.id === formData.train)
        .map((train) => (
          <div key={train.id}>
            <h4 className="text-xl">{train.name}</h4>
            <p>From: {train.from} To: {train.to}</p>
            <p>Price for {formData.class}: ${train.price[formData.class]}</p>
            <p>Seats available: {train.seats[formData.class]}</p>
            <button
              onClick={() => handlePayment(train.price[formData.class] * formData.passengers)}
              className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Pay Now
            </button>
          </div>
        ))}
    </div>
  </div>
) : null}
    </div>
  </div>
  );
};

export default TrainBooking;
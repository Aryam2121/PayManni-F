import { useEffect, useState } from "react";

const PaymentPage = () => {
  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    const response = await fetch("http://localhost:8000/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 500 }), // ₹500
    });
    const data = await response.json();
    setOrder(data.order);
  };

  const handlePayment = () => {
    if (!order) return alert("Order not created yet!");

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID",
      amount: order.amount,
      currency: "INR",
      name: "CutieTube",
      description: "Premium Subscription",
      order_id: order.id,
      handler: async function (response) {
        const verifyResponse = await fetch("http://localhost:8000/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });
        const verifyData = await verifyResponse.json();
        alert(verifyData.message);
      },
      theme: { color: "#F37254" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <button onClick={fetchOrder}>Create Order</button>
      <button onClick={handlePayment} disabled={!order}>Pay Now</button>
    </div>
  );
};

export default PaymentPage;

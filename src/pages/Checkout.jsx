import { useState } from "react";
import { useCart } from "../context/CartContext";
import "../styles/Checkout.css";

const API_URL = "http://127.0.0.1:8000";

export default function Checkout() {
  const { cart } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ==========================================
      // 1. CREATE ORDER
      // ==========================================

      const orderResponse = await fetch(
        `${API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_name: form.name,
            customer_email: form.email,
            customer_phone: form.phone,
            shipping_address: form.address,

            items: cart.map((item) => ({
              product_id: item.id,
              quantity: item.quantity,
            })),
          }),
        }
      );

      const orderData = await orderResponse.json();

      console.log("ORDER RESPONSE:", orderData);

      if (!orderResponse.ok) {
        throw new Error(
          orderData.detail || "Failed to create order"
        );
      }

      // ==========================================
      // 2. INITIALIZE PAYSTACK PAYMENT
      // ==========================================

      const paymentResponse = await fetch(
        `${API_URL}/payments/initialize/${orderData.id}`,
        {
          method: "POST",
        }
      );

      const paymentData = await paymentResponse.json();

      console.log(
        "PAYMENT RESPONSE:",
        paymentData
      );

      if (!paymentResponse.ok) {
        throw new Error(
          paymentData.detail ||
            "Failed to initialize payment"
        );
      }

      // ==========================================
      // 3. REDIRECT TO PAYSTACK
      // ==========================================

      if (
        paymentData.authorization_url
      ) {
        window.location.href =
          paymentData.authorization_url;
      } else {
        throw new Error(
          "Paystack authorization URL was not returned."
        );
      }

    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong during checkout."
      );

      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">

      <h1>CHECKOUT</h1>

      {error && (
        <div className="checkout-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <input
          name="address"
          placeholder="Shipping Address"
          value={form.address}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "PROCESSING..."
            : "PROCEED TO PAYMENT"}
        </button>

      </form>

    </div>
  );
}
import { useState } from "react";
import { useCart } from "../context/CartContext";
import "../styles/Checkout.css";

export default function Checkout() {
  const { cart } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:8000/initialize-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart: cart,
        customer: {
          full_name: form.name,
          phone: form.phone,
          address: form.address,
          email: form.email,
        },
      }),
    });

    const data = await res.json();

    // Redirect to Paystack
    window.location.href = data.data.authorization_url;
  };

  return (
    <div className="checkout-page">
      <h1>CHECKOUT</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
        <input name="address" placeholder="Shipping Address" onChange={handleChange} required />
        <button type="submit">PROCEED TO PAYMENT</button>
      </form>
    </div>
  );
}
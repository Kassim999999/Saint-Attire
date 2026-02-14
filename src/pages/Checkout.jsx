import { useState } from "react";
import { useCart } from "../context/CartContext";
import "../styles/Checkout.css"

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order:", { cart, form });
    alert("Payment integration next");
    clearCart();
  };

  return (
    <div className="checkout-page">
      <h1>CHECKOUT</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
        <input name="address" placeholder="Shipping Address" onChange={handleChange} required />
        <button type="submit">PROCEED TO PAYMENT</button>
      </form>
    </div>
  );
}

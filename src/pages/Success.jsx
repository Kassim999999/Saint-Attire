import { useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function Success() {
  const { clearCart } = useCart();

  useEffect(() => {
    const saveOrder = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const reference = urlParams.get("reference");

      if (!reference) return;

      // Verify payment
      const res = await fetch(`http://127.0.0.1:8000/verify-payment/${reference}`);
      const data = await res.json();

      const paymentData = data.data;
      const customer = paymentData.metadata.customer;

      await fetch("http://127.0.0.1:8000/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: customer.full_name,
          email: paymentData.customer.email,
          phone: customer.phone,
          address: customer.address,
          amount: paymentData.amount / 100,
          reference: reference,
        }),
      });

      clearCart();
    };

    saveOrder();
  }, []);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Payment Successful 🎉</h1>
      <p>Your order has been placed successfully.</p>
    </div>
  );
}
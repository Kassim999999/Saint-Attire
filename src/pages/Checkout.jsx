import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cart, clearCart } = useCart();

  const handleOrder = () => {
    alert("Payment integration goes here (Flutterwave)");
    clearCart();
  };

  return (
    <div className="checkout-page">
      <h1>CHECKOUT</h1>
      <p>Total Items: {cart.length}</p>
      <button onClick={handleOrder}>
        PAY NOW
      </button>
    </div>
  );
}

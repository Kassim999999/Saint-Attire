import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart-page">
      <h1>CART</h1>
      {cart.map((item, index) => (
        <div key={index}>
          <p>{item.name} - KES {item.price}</p>
          <button onClick={() => removeFromCart(index)}>Remove</button>
        </div>
      ))}
      <h2>Total: KES {total}</h2>
      <Link to="/checkout">Proceed to Checkout</Link>
    </div>
  );
}

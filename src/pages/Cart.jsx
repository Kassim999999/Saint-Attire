import MainLayout from "../layouts/MainLayout"
import { useCart } from "../context/CartContext"
import "../styles/Cart.css"

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal
  } = useCart()

const handleCheckout = async () => {
  const response = await fetch("http://localhost:8000/initialize-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cart,
      customer: {
        full_name: "Test User",
        email: "test@email.com",
        phone: "0712345678",
        address: "Nairobi"
      }
    })
  });

  const data = await response.json();

  console.log(data);

  if (data.status) {
    window.location.href = data.data.authorization_url;
  } else {
    alert("Payment initialization failed");
  }
};



  return (
    <MainLayout>
      <h1 className="cart-title">YOUR CART</h1>

      {cart.length === 0 ? (
        <p className="empty-cart">Cart is empty.</p>
      ) : (
        <div className="cart-container">

          <div className="cart-items">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}`}
                className="cart-item"
              >
                <img src={item.image} alt={item.name} />

                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>Size: {item.selectedSize}</p>
                  <p>KSH {item.price}</p>

                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.selectedSize, -1)
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.selectedSize, 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeFromCart(item.id, item.selectedSize)
                    }
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Subtotal</h2>
            <p>KSH {subtotal}</p>
            <button onClick={handleCheckout} className="checkout-btn">
              CHECKOUT
            </button>
          </div>

        </div>
      )}
    </MainLayout>
  )
}

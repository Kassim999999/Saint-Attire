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
            <button className="checkout-btn">
              CHECKOUT
            </button>
          </div>

        </div>
      )}
    </MainLayout>
  )
}

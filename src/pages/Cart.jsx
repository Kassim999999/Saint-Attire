import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/Cart.css";

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
  } = useCart();

  const shipping = subtotal > 5000 ? 0 : 300;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/initialize-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart,
            customer: {
              full_name: "Test User",
              email: "test@email.com",
              phone: "0712345678",
              address: "Nairobi",
            },
          }),
        }
      );

      const data = await response.json();

      if (data.status) {
        window.location.href = data.data.authorization_url;
      } else {
        alert("Payment initialization failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <section className="cart-page">

      {/* ================= HERO ================= */}

      <section className="cart-hero">

        <span>SAINT ATTIRE</span>

        <h1>YOUR BAG</h1>

        <p>
          Every piece is produced in limited quantities.
          Complete your order before this drop sells out.
        </p>

      </section>

      {/* ================= EMPTY ================= */}

      {cart.length === 0 ? (
        <section className="empty-cart">

          <h2>Your bag is empty.</h2>

          <p>
            Discover the latest pieces from Drop 01.
          </p>

          <Link
            to="/drop"
            className="continue-btn"
          >
            SHOP DROP 01
          </Link>

        </section>
      ) : (
        <div className="cart-layout">

          {/* ================= LEFT ================= */}

          <section className="cart-items">

            {cart.map((item) => (
              <article
                key={`${item.id}-${item.selectedSize}`}
                className="cart-item"
              >

                <div className="cart-image">

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                </div>

                <div className="cart-details">

                  <span className="drop-label">
                    DROP 01
                  </span>

                  <h3>
                    {item.name.toUpperCase()}
                  </h3>

                  <p>
                    Size: <strong>{item.selectedSize}</strong>
                  </p>

                  <p className="price">
                    KSh {Number(item.price).toLocaleString()}
                  </p>

                  <div className="qty">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.selectedSize,
                          -1
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.selectedSize,
                          1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeFromCart(
                        item.id,
                        item.selectedSize
                      )
                    }
                  >
                    REMOVE
                  </button>

                </div>

              </article>
            ))}

          </section>

          {/* ================= SUMMARY ================= */}

          <aside className="summary">

            <h2>ORDER SUMMARY</h2>

            <div className="summary-row">

              <span>Subtotal</span>

              <span>
                KSh {subtotal.toLocaleString()}
              </span>

            </div>

            <div className="summary-row">

              <span>Shipping</span>

              <span>
                {shipping === 0
                  ? "FREE"
                  : `KSh ${shipping}`}
              </span>

            </div>

            <div className="summary-row total">

              <span>Total</span>

              <span>
                KSh {total.toLocaleString()}
              </span>

            </div>

            {shipping > 0 && (
              <div className="shipping-note">

                Spend another{" "}
                <strong>
                  KSh {(5000 - subtotal).toLocaleString()}
                </strong>{" "}
                to unlock free shipping.

              </div>
            )}

            <button
              className="checkout-btn"
              onClick={handleCheckout}
            >
              PROCEED TO CHECKOUT
            </button>

            <Link
              to="/drop"
              className="continue-shopping"
            >
              ← Continue Shopping
            </Link>

          </aside>

        </div>
      )}

    </section>
  );
}
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import MainLayout from "../layouts/MainLayout"
import { useCart } from "../context/CartContext"
import "../styles/Product.css"
import Bag from "../assets/Bag.png"

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const { cart, addToCart, removeFromCart, updateQuantity, subtotal, cartCount } = useCart()

  // Fetch product
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Fetch product error:", err))
  }, [id])

  // Loading
  if (!product) {
    return (
      <MainLayout>
        <h1 style={{ textAlign: "center", marginTop: "100px" }}>
          Loading...
        </h1>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="product-page">

        {/* IMAGE */}
        <div className="product-image-wrapper">
          <img
            src={product.image}
            alt={product.name}
            className="product-img primary"
          />

          <img
            src={product.image2 || product.image}
            alt={product.name}
            className="product-img secondary"
          />
        </div>

        {/* INFO */}
        <div className="product-info">
          <h1>{product.name}</h1>

          <p className="product-price">
            KSH {product.price}
          </p>

          <p className="product-desc">
            {product.description}
          </p>

          <p className="product-stock">
            {product.stock} pieces left
          </p>

          {/* SIZES */}
          <div className="size-selector">
            {(product.sizes || ["S", "M", "L"]).map((size) => (
              <button
                key={size}
                className={selectedSize === size ? "active-size" : ""}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>

          {/* ADD TO CART */}
          <button
            className="add-cart-btn"
            disabled={!selectedSize}
            onClick={() => {
              addToCart(product, selectedSize)
              setShowModal(true)
            }}
          >
            {selectedSize ? "ADD TO CART" : "SELECT SIZE"}
          </button>
        </div>
      </div>

{/* ===== CART DRAWER ===== */}
{showModal && (
  <>
    {/* Overlay */}
    <div
      className="cart-drawer-overlay"
      onClick={() => setShowModal(false)}
    ></div>

    {/* Drawer */}
    <div className="cart-drawer">

      {/* Header */}
      <div className="cart-drawer-header">
        <h2>Your Cart ({cartCount})</h2>
        <button onClick={() => setShowModal(false)}>✕</button>
      </div>

      {/* ITEMS */}
      <div className="cart-items">
        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          cart.map((item) => (
            <div
              key={`${item.id}-${item.selectedSize}`}
              className="cart-item"
            >
              <img src={item.image} alt={item.name} />

              <div className="cart-item-info">
                <p>{item.name}</p>
                <p className="size">Size: {item.selectedSize}</p>
                <p className="price">KSH {item.price}</p>

                {/* Quantity Controls */}
                <div className="qty-controls">
                  <button onClick={() => updateQuantity(item.id, item.selectedSize, -1)}>
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button onClick={() => updateQuantity(item.id, item.selectedSize, 1)}>
                    +
                  </button>
                </div>
              </div>

              {/* Remove */}
              <button
                className="remove"
                onClick={() => removeFromCart(item.id, item.selectedSize)}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      {cart.length > 0 && (
        <div className="cart-footer">

          <div className="cart-total">
            <span>Total</span>
            <span>KSH {subtotal}</span>
          </div>
          <div className="fbtn">
          <button
            className="go-cart"
            onClick={() => navigate("/cart")}
          >
            VIEW CART
          </button>

          <button
            className="continue"
            onClick={() => navigate("/drop")}
          >
            <i class="fa-solid fa-cart-plus"></i>
          </button>
          </div>

        </div>
      )}

    </div>
  </>
)}
    </MainLayout>
  )
}
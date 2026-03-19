import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import MainLayout from "../layouts/MainLayout"
import { useCart } from "../context/CartContext"
import "../styles/Product.css"

export default function Product() {
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [added, setAdded] = useState(false)

  const { addToCart } = useCart()

  // 🔥 Fetch product from backend
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Fetch product error:", err))
  }, [id])

  // Loading state
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
        <div className="product-image">
          <img src={product.image} alt={product.name} />
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

          {/* SIZES (fallback if backend doesn’t provide) */}
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
              setAdded(true)
              setTimeout(() => setAdded(false), 1500)
            }}
          >
            {added
              ? "ADDED ✓"
              : selectedSize
              ? "ADD TO CART"
              : "SELECT SIZE"}
          </button>

        </div>
      </div>
    </MainLayout>
  )
}
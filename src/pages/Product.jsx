import { useParams } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import { products } from "../data/products"
import "../styles/Product.css"
import { useState } from "react"

export default function Product() {
  const { id } = useParams()

  // id from URL is string, your product id is number
  const product = products.find(
    (item) => item.id === Number(id)
  )

  const [selectedSize, setSelectedSize] = useState(null)

  if (!product) {
    return (
      <MainLayout>
        <h1>Product Not Found</h1>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="product-page">

        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>

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

          <div className="size-selector">
            {product.sizes.map((size) => (
              <button
                key={size}
                className={selectedSize === size ? "active-size" : ""}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>

          <button
            className="add-cart-btn"
            disabled={!selectedSize}
          >
            {selectedSize
              ? "ADD TO CART"
              : "SELECT SIZE"}
          </button>

        </div>

      </div>
    </MainLayout>
  )
}

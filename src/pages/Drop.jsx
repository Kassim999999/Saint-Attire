import MainLayout from "../layouts/MainLayout"
import { products } from "../data/products"
import { Link } from "react-router-dom"
import "../styles/Drop.css"

export default function Drop() {
  return (
    <MainLayout>
      
      {/* Drop Hero Section */}
      <section className="drop-hero">
        <div className="drop-hero-content">
          <h1>DROP 01</h1>
          <p>SAINT ARCHIVE COLLECTION</p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="product-grid">
        {products.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="product-card"
          >
            <div className="product-image-wrapper">
              <img src={product.image} alt={product.name} />
              <div className="product-overlay">
                <span>VIEW PRODUCT</span>
              </div>
            </div>

            <div className="product-info">
              <p>{product.name}</p>
              <span>KSH {product.price}</span>
            </div>
          </Link>
        ))}
      </section>

    </MainLayout>
  )
}

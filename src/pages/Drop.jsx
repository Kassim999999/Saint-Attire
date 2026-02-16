import MainLayout from "../layouts/MainLayout"
import { products } from "../data/products"
import { Link } from "react-router-dom"
import "../styles/Drop.css"

export default function Drop() {
  return (
    <MainLayout>
      <section className="drop-header">
        <h1>DROP 01: FLY SEASON</h1>
      </section>

      <section className="product-grid">
        {products.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="product-card"
          >
            <img src={product.image} alt={product.name} />
            <p>{product.name}</p>
            <span>KSH {product.price}</span>
          </Link>
        ))}
      </section>
    </MainLayout>
  )
}

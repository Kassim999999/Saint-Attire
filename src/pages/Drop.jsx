import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import "../styles/Drop.css"

export default function Drop() {
  return (
    <div className="drop-page">
      <h1>DROP 01: FLY SEASON</h1>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import "../styles/ProductCard.css"

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>KES {product.price}</p>
      </Link>
    </div>
  );
}

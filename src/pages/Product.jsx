import { useParams } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

export default function Product() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const { addToCart } = useCart();

  if (!product) return <h2>Product Not Found</h2>;

  return (
    <div className="product-page">
      <img src={product.image} alt={product.name} />
      <div>
        <h1>{product.name}</h1>
        <p>KES {product.price}</p>
        <p>{product.description}</p>
        <button onClick={() => addToCart(product)}>
          ADD TO CART
        </button>
      </div>
    </div>
  );
}

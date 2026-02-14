import { useParams } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useState } from "react";


export default function Product() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");

  if (!product) return <h2>Product Not Found</h2>;

  return (
    <div className="product-page">
      <img src={product.image} alt={product.name} />
      <div>
        <h1>{product.name}</h1>
        <p>KES {product.price}</p>
        <p>{product.stock} pieces left</p>
        <p>{product.description}</p>

        <div className="sizes">
  {product.sizes.map((size) => (
    <button
      key={size}
      className={selectedSize === size ? "active" : ""}
      onClick={() => setSelectedSize(size)}
    >
      {size}
    </button>
  ))}
</div>

<button
  onClick={() => {
    if (!selectedSize) return alert("Select size");
    addToCart({ ...product, size: selectedSize });
  }}
>
  ADD TO CART
</button>
      </div>
    </div>
  );
}

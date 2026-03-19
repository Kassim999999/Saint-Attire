import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Drop.css";

export default function Drop() {
  const [products, setProducts] = useState([]);

  // Fetch products from backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Fetch products error:", err));
  }, []);

  // Intersection Observer for animation
  useEffect(() => {
    const cards = document.querySelectorAll(".product-card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [products]);

  return (
    <section>
      {/* Hero Section */}
      <section className="drop-hero">
        <div className="drop-hero-content">
          <h1>DROP 01</h1>
          <p>SAINT ARCHIVE COLLECTION</p>
          <p className="drop-tagline">LIMITED RELEASE · NO RESTOCKS</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="product-grid">
        {products.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="product-card"
          >
            <div className="product-image-wrapper">
              {/* Primary image */}
              <img
                src={product.image}
                alt={product.name}
                className="product-img primary"
              />
              {/* Secondary image (hover) */}
              <img
                src={product.image2 || product.image} // fallback if no second image
                alt={product.name}
                className="product-img secondary"
              />
              <div className="product-overlay">
                <span>VIEW PIECE</span>
              </div>
            </div>

            <div className="product-info">
              <p>{product.name}</p>
              <span>KSH {product.price}</span>
            </div>
          </Link>
        ))}
      </section>
    </section>
  );
}
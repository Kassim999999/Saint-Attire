import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Drop.css";

export default function Drop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Products
  useEffect(() => {
    fetch("http://127.0.0.1:8000/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch products error:", err);
        setLoading(false);
      });
  }, []);

  // Fade in cards
  useEffect(() => {
    if (loading) return;

    const cards = document.querySelectorAll(".product-card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [loading]);

  return (
    <>
      {/* ================= HERO ================= */}

      <section className="drop-hero">

        <div className="drop-overlay"></div>

        <div className="drop-hero-content">

          <span className="drop-label">
            SAINT ATTIRE PRESENTS
          </span>

          <h1>
            DROP 01
          </h1>

          <h2>
            SAINT ARCHIVE
          </h2>

          <p className="drop-description">
            Crafted for those who wear conviction.
            Produced in limited quantities.
            Once it's gone, it's gone.
          </p>

          <div className="drop-meta">
            <span>LIMITED RELEASE</span>
            <span>•</span>
            <span>NO RESTOCKS</span>
          </div>

        </div>

      </section>

      {/* ================= CAMPAIGN ================= */}

      <section className="campaign-section">

        <div className="campaign-left">

          <span className="campaign-small">
            ROMANS 1:7
          </span>

          <h2>
            MORE THAN
            <br />
            CLOTHING.
          </h2>

        </div>

        <div className="campaign-right">

          <p>
            Saint Attire is built for people who move with
            purpose. Every piece represents intentional
            craftsmanship, limited production, and a message
            bigger than fashion.
          </p>

        </div>

      </section>

      {/* ================= COLLECTION TITLE ================= */}

      <section className="collection-header">

        <h3>
          DROP 01 COLLECTION
        </h3>

        <p>
          {products.length} PIECES AVAILABLE
        </p>

      </section>

      {/* ================= PRODUCTS ================= */}

      {loading ? (

        <section className="product-grid">

          {[...Array(6)].map((_, index) => (

            <div
              className="product-skeleton"
              key={index}
            ></div>

          ))}

        </section>

      ) : (

        <section className="product-grid">

          {products.map((product, index) => (

            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="product-card"
              style={{
                transitionDelay: `${index * 0.08}s`,
              }}
            >

              <div className="product-image-wrapper">

                {/* Badge */}

                <span className="product-badge">
                  LIMITED
                </span>

                {/* Images */}

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

              <div className="product-info">

                <span className="product-drop">
                  DROP 01
                </span>

                <h4>
                  {product.name.toUpperCase()}
                </h4>

                <p>
                  KSh {Number(product.price).toLocaleString()}
                </p>

              </div>

            </Link>

          ))}

        </section>

      )}

      {/* ================= BRAND STATEMENT ================= */}

      <section className="brand-statement">

        <span>
          LIMITED • INTENTIONAL • RARE
        </span>

        <h2>
          NOT FOR EVERYONE.
        </h2>

        <p>
          We don't mass produce.
          <br />
          We create pieces that mean something.
        </p>

      </section>
    </>
  );
}
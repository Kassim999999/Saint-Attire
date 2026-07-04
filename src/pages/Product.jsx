import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useCart } from "../context/CartContext";
import "../styles/Product.css";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const {
    cart,
    cartCount,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setActiveImage(data.image);
      })
      .catch((err) => console.log(err));
  }, [id]);

  if (!product) {
    return (
      <MainLayout>
        <section className="loading-page">
          <h1>Loading Product...</h1>
        </section>
      </MainLayout>
    );
  }

  const images = [
    product.image,
    product.image2 || product.image,
  ];

  return (
    <MainLayout>

      <section className="product-wrapper">

        {/* LEFT */}

        <section className="gallery">

          <div className="thumbs">

            {images.map((img, index) => (

              <img
                key={index}
                src={img}
                alt=""
                className={
                  activeImage === img
                    ? "thumb active-thumb"
                    : "thumb"
                }
                onClick={() => setActiveImage(img)}
              />

            ))}

          </div>

          <div className="main-image">

            <img
              src={activeImage}
              alt={product.name}
            />

            <span className="limited-badge">
              LIMITED
            </span>

          </div>

        </section>

        {/* RIGHT */}

        <section className="details">

          <span className="drop">
            DROP 01
          </span>

          <h1>
            {product.name.toUpperCase()}
          </h1>

          <p className="price">
            KSh {Number(product.price).toLocaleString()}
          </p>

          <p className="description">
            {product.description}
          </p>

          <div className="divider"></div>

          <div className="meta">

            <div>

              <span>Collection</span>

              <p>Saint Archive</p>

            </div>

            <div>

              <span>Availability</span>

              <p>{product.stock} Pieces Left</p>

            </div>

          </div>

          <div className="divider"></div>

          <div className="sizes">

            <h3>Select Size</h3>

            <div className="size-grid">

              {(product.sizes || ["S","M","L","XL"]).map(size => (

                <button

                  key={size}

                  onClick={() => setSelectedSize(size)}

                  className={
                    selectedSize === size
                      ? "active-size"
                      : ""
                  }

                >

                  {size}

                </button>

              ))}

            </div>

          </div>

          <button

            disabled={!selectedSize}

            className="bag-btn"

            onClick={() => {

              addToCart(product, selectedSize);

              setShowModal(true);

            }}

          >

            {selectedSize
              ? "ADD TO BAG"
              : "SELECT SIZE"}

          </button>

          <div className="shipping-box">

            <h4>SHIPPING</h4>

            <p>

              Orders dispatch within
              1–3 business days.

            </p>

          </div>

          <div className="shipping-box">

            <h4>THE MESSAGE</h4>

            <p>

              Created for people who wear
              conviction with confidence.

            </p>

          </div>

        </section>

      </section>

      {/* ========= CART DRAWER ========= */}

      {showModal && (

        <>

          <div

            className="drawer-overlay"

            onClick={() => setShowModal(false)}

          />

          <div className="drawer">

            <div className="drawer-header">

              <h2>

                YOUR BAG ({cartCount})

              </h2>

              <button

                onClick={() => setShowModal(false)}

              >

                ✕

              </button>

            </div>

            <div className="drawer-items">

              {cart.map(item => (

                <div

                  className="drawer-item"

                  key={`${item.id}-${item.selectedSize}`}

                >

                  <img

                    src={item.image}

                    alt={item.name}

                  />

                  <div>

                    <h4>

                      {item.name}

                    </h4>

                    <span>

                      Size {item.selectedSize}

                    </span>

                    <p>

                      KSh {item.price}

                    </p>

                    <div className="qty">

                      <button

                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.selectedSize,
                            -1
                          )
                        }

                      >

                        -

                      </button>

                      <span>

                        {item.quantity}

                      </span>

                      <button

                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.selectedSize,
                            1
                          )
                        }

                      >

                        +

                      </button>

                    </div>

                  </div>

                  <button

                    className="remove"

                    onClick={() =>
                      removeFromCart(
                        item.id,
                        item.selectedSize
                      )
                    }

                  >

                    ✕

                  </button>

                </div>

              ))}

            </div>

            <div className="drawer-footer">

              <div className="subtotal">

                <span>Subtotal</span>

                <strong>

                  KSh {subtotal.toLocaleString()}

                </strong>

              </div>

              <button

                className="view-cart"

                onClick={() => navigate("/cart")}

              >

                VIEW BAG

              </button>

            </div>

          </div>

        </>

      )}

    </MainLayout>
  );
}
import MainLayout from "../layouts/MainLayout"
import "../styles/Product.css"

export default function Product() {
  return (
    <MainLayout>
      <div className="product-page">

        {/* LEFT SIDE - IMAGE */}
        <div className="product-image">
          <img src="/pants1.jpg" alt="Studded Black Pants" />
        </div>

        {/* RIGHT SIDE - INFO */}
        <div className="product-info">
          <h1>STUDDED BLACK PANTS</h1>

          <p className="product-price">KSH 950</p>

          <p className="product-desc">
            Heavy graphic urban pants. Built loud. 
            Structured fit with statement detailing.
          </p>

          <div className="size-selector">
            <button>S</button>
            <button>M</button>
            <button>L</button>
            <button>XL</button>
          </div>

          <button className="add-cart-btn">
            ADD TO CART
          </button>

        </div>

      </div>
    </MainLayout>
  )
}

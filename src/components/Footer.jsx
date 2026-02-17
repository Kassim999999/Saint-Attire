import { Link } from "react-router-dom"
import "../styles/Footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h2>FLY.</h2>
          <p>Independent Streetwear Brand</p>
        </div>

        <div className="footer-links">
          <div>
            <h4>SHOP</h4>
            <Link to="/drop">Drop</Link>
            <Link to="/cart">Cart</Link>
          </div>

          <div>
            <h4>INFO</h4>
            <a href="#">Shipping</a>
            <a href="#">Returns</a>
            <a href="#">Terms</a>
          </div>

          <div>
            <h4>SOCIAL</h4>
            <a href="#">Instagram</a>
            <a href="#">TikTok</a>
            <a href="#">Twitter</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 FLY. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

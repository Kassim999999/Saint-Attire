import { Link } from "react-router-dom"
import fullLogo from "../assets/primary-logo.png"
import "../styles/Footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <img src={fullLogo} alt="SAINT logo" className="footer-logo" />
          <p>Work With Intention</p>
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
            <a href="https://www.instagram.com/saint.attire_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="><i class="fa-brands fa-instagram"></i></a>
            <a href="https://www.tiktok.com/@saint.attire._?is_from_webapp=1&sender_device=pc"><i class="fa-brands fa-tiktok"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 SAINT. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

import { Link } from "react-router-dom";
import fullLogo from "../assets/primary-logo.png";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      {/* Newsletter */}
      <section className="footer-newsletter">
        <h2>JOIN THE COMMUNITY</h2>
        <p>
          Receive exclusive access to future drops, announcements and
          limited releases.
        </p>

        <form className="newsletter-form">
          <input
            type="email"
            placeholder="Your email address"
          />

          <button type="submit">
            JOIN
          </button>
        </form>
      </section>

      <div className="footer-divider"></div>

      {/* Main Footer */}
      <div className="footer-top">

        <div className="footer-brand">

          <img
            src={fullLogo}
            alt="Saint Attire"
            className="footer-logo"
          />

          <p className="brand-text">
            Worn With Intention.
            <br />
            Crafted in limited quantities.
          </p>

        </div>

        <div className="footer-links">

          <div>
            <h4>SHOP</h4>

            <Link to="/drop">
              Drop
            </Link>

            <Link to="/cart">
              Cart
            </Link>
          </div>

          <div>
            <h4>SUPPORT</h4>

            <a href="#">
              Shipping
            </a>

            <a href="#">
              Returns
            </a>

            <a href="#">
              Terms
            </a>
          </div>

          <div>
            <h4>FOLLOW</h4>

            <div className="footer-social">

              <a
                href="https://www.instagram.com/saint.attire_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>

              <a
                href="https://www.tiktok.com/@saint.attire._?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-brands fa-tiktok"></i>
              </a>

            </div>

          </div>

        </div>

      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">

        <p>© 2026 SAINT ATTIRE. All Rights Reserved.</p>

        <span>
          LIMITED • INTENTIONAL • RARE
        </span>

      </div>

    </footer>
  );
}
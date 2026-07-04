import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import logoIcon from "../assets/Saint-logo.png";
import Cart from "../assets/shopping-cart.png";
import "../styles/Navbar.css";

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="navbar">

      <div className="nav-left">
        <span className="nav-tag">
          WORN WITH INTENTION
        </span>
      </div>

      <Link to="/" className="nav-logo-link">
        <img
          src={logoIcon}
          alt="Saint Attire"
          className="nav-logo"
        />
      </Link>

      <div className="nav-right">

        <Link to="/drop" className="nav-link">
          DROP 01
        </Link>

        <Link to="/cart" className="nav-cart">

          <img
            src={Cart}
            alt="Cart"
            className="cart-icon"
          />

          <span>{cartCount}</span>

        </Link>

      </div>

    </nav>
  );
}
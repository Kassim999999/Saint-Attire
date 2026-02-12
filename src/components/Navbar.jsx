import { Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">FLY SEASON</Link>
      <div>
        <Link to="/drop">DROP 01</Link>
        <Link to="/cart">CART</Link>
      </div>
    </nav>
  );
}

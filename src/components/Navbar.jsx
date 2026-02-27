import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import logoIcon from "../assets/Saint-logo.png"
import Cart from "../assets/shopping-cart.png"
import "../styles/Navbar.css"

export default function Navbar() {

    const { cartCount } = useCart()

  return (
    <nav className="navbar">

      {/* LEFT MOTTO */}
      <div className="nav-left">
        <span className="nav-motto">WORK WITH INTENTION</span>
      </div>

      {/* CENTER LOGO */}
      <Link to="/" className="nav-center">
        <img src={logoIcon} alt="SAINT logo" className="nav-logo" />
      </Link>

      {/* RIGHT SIDE */}
      <div className="nav-right">
        <Link to="/drop">NEW</Link>
        <Link to="/cart">
          <img src={Cart} alt="cart" className="cart" /> ({cartCount})
        </Link>
      </div>

    </nav>
  )
}
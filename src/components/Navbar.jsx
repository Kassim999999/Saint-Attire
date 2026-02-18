import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import logoIcon from "../assets/Saint-logo.png"
import Cart from "../assets/shopping-cart.png"
import "../styles/Navbar.css"

export default function Navbar() {

    const { cartCount } = useCart()

  return (
    <nav className="navbar">
      <div className="nav-left">
       <Link to= "/"> <img src={logoIcon} alt="SAINT logo" className="nav-logo" /></Link>
      </div>

      <div className="nav-right">
        <Link to="/drop">Drop</Link>
        <Link to="/cart"><img src={Cart} alt="cart" className="cart" /> ({cartCount})</Link>
      </div>
    </nav>
  )
}
